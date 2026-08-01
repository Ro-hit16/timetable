// backend/modules/institution/service/institutionConfigResolver.service.js
//
// InstitutionConfigResolver is the single place that:
//   1. Loads InstitutionConfig (department-specific override, falling back
//      to the institution-wide default document, falling back to
//      SYSTEM_DEFAULTS below).
//   2. Loads TeacherPreference documents for the teachers involved.
//   3. Loads DepartmentPreference for the department (if any).
//   4. Loads GAProfile (department-specific override, falling back to the
//      institution-wide default document, falling back to
//      SYSTEM_DEFAULTS below).
//   5. Merges everything into flattened `resolvedRules`.
//   6. Validates the merged result.
//   7. Returns exactly one SchedulerContext object (see
//      backend/modules/shared/SchedulerContext.js).
//
// This file IS called from timetables.controller.js (via
// gaAdapter.service.js's buildGAConstructorConfig) to resolve
// working days / periods-per-day / lab block size for a generation run,
// and from institutionConfig.controller.js's `getEffectiveInstitutionConfig`
// for the frontend timetable/settings display.
//
// SYSTEM_DEFAULTS intentionally mirrors the values that are hardcoded
// today inside backend/utils/timetableGenerator.js's GeneticAlgorithm
// constructor. This guarantees that "no config documents exist yet" (the
// state of every real department right now) resolves to the exact same
// numbers the application already uses — the resolver cannot change
// behavior on its own; only creating actual config documents can.

import institutionConfigRepository from '../repository/institutionConfig.repository.js';
import teacherPreferenceRepository from '../repository/teacherPreference.repository.js';
import departmentPreferenceRepository from '../repository/departmentPreference.repository.js';
import gaProfileRepository from '../repository/gaProfile.repository.js';
import { createSchedulerContext } from '../../shared/SchedulerContext.js';
import ApiError from '../../../utils/ApiError.js';

// Mirrors backend/utils/timetableGenerator.js's current hardcoded values.
// Kept as plain data here (not imported from timetableGenerator.js) so this
// module never imports from — and therefore never risks modifying the
// behavior of — the generator, per this task's constraints.
export const SYSTEM_DEFAULTS = Object.freeze({
  institutionConfig: {
    institutionName: '',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    periodsPerDay: 6,
    periodStartTime: '09:00',
    periodEndTime: '16:00',
    periodDurationMinutes: 60,
    breakDurationMinutes: 0,
    lunchBreakStart: null,
    lunchBreakEnd: null,
    timeSlots: [],
    breaks: [],
    slotPreferences: {
      prioritizeLabsFirst: true,
      prioritizeTutorialsLast: true,
      allowSplitAcrossBreak: false,
    },
    defaultTheoryRules: {
      preferredPeriodIndices: [0, 1, 2, 3],
      maxOccurrencesPerDay: 1,
      defaultLecturesPerWeek: 3,
      sessionDurationPeriods: 1,
    },
    defaultLabRules: {
      preferredStartPeriodIndices: [0, 2, 4],
      consecutiveBlockSize: 2,
      maxOccurrencesPerDay: 1,
      defaultSessionsPerWeek: 2,
    },
    defaultTutorialRules: {
      preferredPeriodIndices: [4, 5],
      maxOccurrencesPerDay: 1,
      defaultLecturesPerWeek: 1,
    },
    defaultTeacherLimits: {
      maxLecturesPerDay: null,
      maxLecturesPerWeek: null,
      minGapBetweenLectures: null,
    },
    defaultClassroomRules: {
      capacityBufferPercent: 0,
      allowRoomSharingAcrossDivisions: false,
    },
    defaultExamRules: {},
    defaultLeaveRules: {},
  },
  gaProfile: {
    // These mirror GeneticAlgorithm's constructor clamps/defaults exactly;
    // `null` here means "let the GA apply its own internal default/clamp".
    populationSize: null,
    maxGenerations: null,
    mutationRate: null,
    crossoverRate: null,
    elitismRate: null,
    penaltyOverrides: {},
  },
});

const toPlainObject = (doc) => (doc && typeof doc.toObject === 'function' ? doc.toObject() : doc);

// --- TEMP DEBUG: remove once the "resolved from: system-default" issue is
// confirmed fixed in production. Set to false to silence without deleting
// the call sites below.
const DEBUG_RESOLVER = true;
const debugLog = (...args) => {
  if (DEBUG_RESOLVER) console.log('[InstitutionConfigResolver]', ...args);
};

// Normalizes a scope id so a populated document (`{ _id, name, ... }`),
// a Mongoose ObjectId instance, or a plain string all compare the same
// way against the DB. Also strips accidental leading/trailing whitespace
// (e.g. from a form field or URL param), which — combined with a Mongoose
// CastError being swallowed as "no match" rather than thrown — is the most
// common reason a document that was "saved correctly" is never matched by
// a scope query. Returns `null` for anything falsy so `null` always means
// "institution-wide", never a bad/empty id.
const normalizeScopeId = (id) => {
  if (!id) return null;
  if (typeof id === 'object' && id._id) return String(id._id).trim();
  return String(id).trim();
};

// Normalizes academicYear the same way (trim only — it's a plain string
// field, not an ObjectId), so a value like "2024-25 " (trailing space from
// a form) doesn't silently fail to match "2024-25" as saved.
const normalizeAcademicYear = (academicYear) =>
  typeof academicYear === 'string' ? academicYear.trim() : academicYear;

/**
 * Merges a resolved Mongoose document (already converted to a plain
 * object) over a defaults object, one level deep for known sub-sections.
 * Only keys present and non-null on `source` override `base`.
 */
const mergeOver = (base, source) => {
  if (!source) return { ...base };
  const merged = { ...base };
  for (const key of Object.keys(base)) {
    if (source[key] !== undefined && source[key] !== null) {
      if (
        typeof base[key] === 'object' &&
        !Array.isArray(base[key]) &&
        base[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        merged[key] = { ...base[key], ...source[key] };
      } else {
        merged[key] = source[key];
      }
    }
  }
  return merged;
};

/**
 * Resolves the effective InstitutionConfig for a scope: department-specific
 * document (if any) wins, else the institution-wide default document (if
 * any) wins, else SYSTEM_DEFAULTS.institutionConfig.
 */
export const resolveInstitutionConfig = async ({ departmentId, academicYear }) => {
  const sources = [];
  let effective = SYSTEM_DEFAULTS.institutionConfig;

  const normalizedDepartmentId = normalizeScopeId(departmentId);
  const normalizedAcademicYear = normalizeAcademicYear(academicYear);

  debugLog('incoming scope ->', {
    rawDepartmentId: departmentId,
    normalizedDepartmentId,
    rawAcademicYear: academicYear,
    normalizedAcademicYear,
  });

  const instituteWideQuery = { departmentId: null, academicYear: normalizedAcademicYear };
  debugLog('Mongo query (institution-wide) ->', instituteWideQuery);
  const instituteWide = await institutionConfigRepository.findByScope(instituteWideQuery);
  debugLog('institution-wide match ->', instituteWide?._id ? String(instituteWide._id) : null);
  if (instituteWide) {
    effective = mergeOver(effective, toPlainObject(instituteWide));
    sources.push('institution-wide-default');
  }

  if (normalizedDepartmentId) {
    const departmentQuery = {
      departmentId: normalizedDepartmentId,
      academicYear: normalizedAcademicYear,
    };
    debugLog('Mongo query (department-specific) ->', departmentQuery);
    const departmentSpecific = await institutionConfigRepository.findByScope(departmentQuery);
    debugLog(
      'department-specific match ->',
      departmentSpecific?._id ? String(departmentSpecific._id) : null
    );
    if (departmentSpecific) {
      effective = mergeOver(effective, toPlainObject(departmentSpecific));
      sources.push('department-override');
    }
  }

  if (!sources.length) sources.push('system-default');
  debugLog('resolved sources ->', sources);

  return { config: effective, sources };
};

/**
 * Resolves the effective GAProfile for a scope, same precedence order as
 * InstitutionConfig above.
 */
const resolveGAProfile = async ({ departmentId, academicYear }) => {
  const sources = [];
  let effective = SYSTEM_DEFAULTS.gaProfile;

  const normalizedDepartmentId = normalizeScopeId(departmentId);
  const normalizedAcademicYear = normalizeAcademicYear(academicYear);

  const instituteWide = await gaProfileRepository.findByScope({
    departmentId: null,
    academicYear: normalizedAcademicYear,
  });
  if (instituteWide) {
    effective = mergeOver(effective, toPlainObject(instituteWide));
    sources.push('institution-wide-default');
  }

  if (normalizedDepartmentId) {
    const departmentSpecific = await gaProfileRepository.findByScope({
      departmentId: normalizedDepartmentId,
      academicYear: normalizedAcademicYear,
    });
    if (departmentSpecific) {
      effective = mergeOver(effective, toPlainObject(departmentSpecific));
      sources.push('department-override');
    }
  }

  if (!sources.length) sources.push('system-default');

  return { profile: effective, sources };
};

/**
 * Validates the minimally-required shape of a resolved config. This is
 * intentionally light — most fields have safe defaults already applied —
 * it exists to catch structurally broken overrides (e.g. an admin saved
 * an empty workingDays array) before they reach a SchedulerContext.
 */
const validateResolvedConfig = (institutionConfig) => {
  const errors = [];

  if (!Array.isArray(institutionConfig.workingDays) || institutionConfig.workingDays.length === 0) {
    errors.push('Resolved institutionConfig.workingDays must be a non-empty array');
  }
  if (!Number.isInteger(institutionConfig.periodsPerDay) || institutionConfig.periodsPerDay <= 0) {
    errors.push('Resolved institutionConfig.periodsPerDay must be a positive integer');
  }

  if (errors.length) {
    throw new ApiError(422, 'Resolved InstitutionConfig failed validation', errors);
  }
};

/**
 * Builds flattened, ready-to-consume rules from the resolved sub-objects.
 * This is what GAAdapter (and any future module) should read first.
 */
const buildResolvedRules = ({ institutionConfig, departmentPreference }) => ({
  workingDays: institutionConfig.workingDays,
  periodsPerDay: institutionConfig.periodsPerDay,
  periodStartTime: institutionConfig.periodStartTime,
  periodEndTime: institutionConfig.periodEndTime,
  periodDurationMinutes: institutionConfig.periodDurationMinutes,
  breakDurationMinutes: institutionConfig.breakDurationMinutes,
  lunchBreakStart: institutionConfig.lunchBreakStart,
  lunchBreakEnd: institutionConfig.lunchBreakEnd,
  timeSlots: institutionConfig.timeSlots,
  breaks: institutionConfig.breaks,
  theory: institutionConfig.defaultTheoryRules,
  lab: institutionConfig.defaultLabRules,
  tutorial: institutionConfig.defaultTutorialRules,
  teacherLimits: institutionConfig.defaultTeacherLimits,
  classroomRules: institutionConfig.defaultClassroomRules,
  departmentBlackoutSlots: departmentPreference?.blackoutSlots || [],
  departmentPreferredClassrooms: departmentPreference?.preferredClassrooms || [],
  divisionStrength: departmentPreference?.divisionStrength || [],
});

/**
 * Main entry point. Loads all four config types for the given scope,
 * merges/defaults/validates, and returns one SchedulerContext.
 *
 * @param {Object} params
 * @param {string|null} params.departmentId
 * @param {string} params.academicYear
 * @param {string[]} [params.teacherIds] - teachers involved in this resolution
 * @returns {Promise<import('../../shared/SchedulerContext.js').SchedulerContext>}
 */
export const resolveSchedulerContext = async ({
  departmentId = null,
  academicYear,
  teacherIds = [],
}) => {
  if (!academicYear || !normalizeAcademicYear(academicYear)) {
    throw new ApiError(400, 'academicYear is required to resolve a SchedulerContext');
  }

  debugLog('resolveSchedulerContext called with ->', {
    departmentId,
    academicYear,
    teacherIdsCount: teacherIds.length,
  });

  // NOTE: DepartmentPreference / TeacherPreference are supplementary data —
  // a failure loading either must NEVER take down an otherwise-successfully-
  // resolved InstitutionConfig/GAProfile. Previously these four lookups
  // were combined in a single Promise.all(), so ANY one rejecting (a bad
  // teacherIds cast, a missing doc edge case, etc.) discarded the whole
  // SchedulerContext — including a perfectly good InstitutionConfig — and
  // the controller's catch-all silently fell back to pure hardcoded GA
  // defaults with no visible cause. Each optional lookup is now isolated
  // behind its own .catch() so it degrades to null/[] instead of failing
  // the entire resolution.
  const [
    { config: institutionConfig, sources: institutionConfigSources },
    { profile: gaProfile, sources: gaProfileSources },
    departmentPreferenceDoc,
    teacherPreferenceDocs,
  ] = await Promise.all([
    resolveInstitutionConfig({ departmentId, academicYear }),
    resolveGAProfile({ departmentId, academicYear }),
    departmentId
      ? departmentPreferenceRepository
          .findByDepartmentAndYear({ departmentId, academicYear })
          .catch((err) => {
            debugLog('⚠️ departmentPreference lookup failed, continuing without it ->', err.message);
            return null;
          })
      : Promise.resolve(null),
    teacherIds.length
      ? teacherPreferenceRepository
          .findByTeacherIdsAndYear({ teacherIds, academicYear })
          .catch((err) => {
            debugLog('⚠️ teacherPreference lookup failed, continuing without it ->', err.message);
            return [];
          })
      : Promise.resolve([]),
  ]);

  validateResolvedConfig(institutionConfig);

  const departmentPreference = toPlainObject(departmentPreferenceDoc);
  const teacherPreferences = (teacherPreferenceDocs || []).map(toPlainObject);

  const resolvedRules = buildResolvedRules({ institutionConfig, departmentPreference });

  return createSchedulerContext({
    scope: { departmentId, academicYear },
    institutionConfig,
    teacherPreferences,
    departmentPreference,
    gaProfile,
    resolvedRules,
    metadata: {
      sources: [...institutionConfigSources, ...gaProfileSources],
    },
  });
};

export default { resolveSchedulerContext, SYSTEM_DEFAULTS };