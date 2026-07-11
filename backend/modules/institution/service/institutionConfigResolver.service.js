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
//      backend/modules/shared/schedulerContext.js).
//
// IMPORTANT: this file is NOT called from timetables.controller.js or
// timetableGenerator.js anywhere in this task. It exists as a
// standalone, independently-testable service. Wiring it into the actual
// generation flow is an explicitly separate, future task.
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
import { createSchedulerContext } from '../../shared/schedulerContext.js';
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
const resolveInstitutionConfig = async ({ departmentId, academicYear }) => {
  const sources = [];
  let effective = SYSTEM_DEFAULTS.institutionConfig;

  const instituteWide = await institutionConfigRepository.findByScope({
    departmentId: null,
    academicYear,
  });
  if (instituteWide) {
    effective = mergeOver(effective, toPlainObject(instituteWide));
    sources.push('institution-wide-default');
  }

  if (departmentId) {
    const departmentSpecific = await institutionConfigRepository.findByScope({
      departmentId,
      academicYear,
    });
    if (departmentSpecific) {
      effective = mergeOver(effective, toPlainObject(departmentSpecific));
      sources.push('department-override');
    }
  }

  if (!sources.length) sources.push('system-default');

  return { config: effective, sources };
};

/**
 * Resolves the effective GAProfile for a scope, same precedence order as
 * InstitutionConfig above.
 */
const resolveGAProfile = async ({ departmentId, academicYear }) => {
  const sources = [];
  let effective = SYSTEM_DEFAULTS.gaProfile;

  const instituteWide = await gaProfileRepository.findByScope({
    departmentId: null,
    academicYear,
  });
  if (instituteWide) {
    effective = mergeOver(effective, toPlainObject(instituteWide));
    sources.push('institution-wide-default');
  }

  if (departmentId) {
    const departmentSpecific = await gaProfileRepository.findByScope({
      departmentId,
      academicYear,
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
 * @returns {Promise<import('../../shared/schedulerContext.js').SchedulerContext>}
 */
export const resolveSchedulerContext = async ({
  departmentId = null,
  academicYear,
  teacherIds = [],
}) => {
  if (!academicYear) {
    throw new ApiError(400, 'academicYear is required to resolve a SchedulerContext');
  }

  const [
    { config: institutionConfig, sources: institutionConfigSources },
    { profile: gaProfile, sources: gaProfileSources },
    departmentPreferenceDoc,
    teacherPreferenceDocs,
  ] = await Promise.all([
    resolveInstitutionConfig({ departmentId, academicYear }),
    resolveGAProfile({ departmentId, academicYear }),
    departmentId
      ? departmentPreferenceRepository.findByDepartmentAndYear({ departmentId, academicYear })
      : Promise.resolve(null),
    teacherIds.length
      ? teacherPreferenceRepository.findByTeacherIdsAndYear({ teacherIds, academicYear })
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