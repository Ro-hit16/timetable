// backend/modules/institution/validator/institutionConfig.validator.js
//
// Joi validation schemas for InstitutionConfig payloads. `joi` is already
// a project dependency (see backend/package.json), so no new package is
// introduced. Validators only shape/check input; they never touch
// Mongoose or the database.

import Joi from 'joi';
import { validateTimingConfig } from '../utils/timeSlotBuilder.js';

const timeSlotSchema = Joi.object({
  index: Joi.number().integer().min(0).required(),
  label: Joi.string().allow('').default(''),
  startTime: Joi.string().allow(null).default(null),
  endTime: Joi.string().allow(null).default(null),
});

const breakSlotSchema = Joi.object({
  label: Joi.string().allow('').default('Break'),
  afterPeriodIndex: Joi.number().integer().min(0).required(),
  startTime: Joi.string().allow(null).default(null),
  endTime: Joi.string().allow(null).default(null),
  durationMinutes: Joi.number().min(0).allow(null).default(null),
});

const slotPreferencesSchema = Joi.object({
  prioritizeLabsFirst: Joi.boolean().default(true),
  prioritizeTutorialsLast: Joi.boolean().default(true),
  allowSplitAcrossBreak: Joi.boolean().default(false),
});

const defaultTheoryRulesSchema = Joi.object({
  preferredPeriodIndices: Joi.array().items(Joi.number().integer().min(0)).default([]),
  maxOccurrencesPerDay: Joi.number().integer().min(0).default(1),
  defaultLecturesPerWeek: Joi.number().integer().min(0).default(3),
  sessionDurationPeriods: Joi.number().integer().min(1).default(1),
});

const defaultLabRulesSchema = Joi.object({
  preferredStartPeriodIndices: Joi.array().items(Joi.number().integer().min(0)).default([]),
  consecutiveBlockSize: Joi.number().integer().min(1).default(2),
  maxOccurrencesPerDay: Joi.number().integer().min(0).default(1),
  defaultSessionsPerWeek: Joi.number().integer().min(0).default(2),
});

const defaultTutorialRulesSchema = Joi.object({
  preferredPeriodIndices: Joi.array().items(Joi.number().integer().min(0)).default([]),
  maxOccurrencesPerDay: Joi.number().integer().min(0).default(1),
  defaultLecturesPerWeek: Joi.number().integer().min(0).default(1),
});

const defaultTeacherLimitsSchema = Joi.object({
  maxLecturesPerDay: Joi.number().integer().min(0).allow(null).default(null),
  maxLecturesPerWeek: Joi.number().integer().min(0).allow(null).default(null),
  minGapBetweenLectures: Joi.number().integer().min(0).allow(null).default(null),
});

const defaultClassroomRulesSchema = Joi.object({
  capacityBufferPercent: Joi.number().min(0).max(100).default(0),
  allowRoomSharingAcrossDivisions: Joi.boolean().default(false),
});

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createInstitutionConfigSchema = Joi.object({
  departmentId: Joi.string().pattern(objectIdPattern).allow(null).default(null),
  academicYear: Joi.string().trim().required(),
  institutionName: Joi.string().allow('').default(''),
  workingDays: Joi.array().items(Joi.string()).min(1).default([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
  ]),
  periodsPerDay: Joi.number().integer().min(1).default(6),
  periodStartTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).default('09:00'),
  periodEndTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).default('16:00'),
  periodDurationMinutes: Joi.number().min(1).default(60),
  breakDurationMinutes: Joi.number().min(0).default(0),
  lunchBreakStart: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).allow(null, '').default(null),
  lunchBreakEnd: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).allow(null, '').default(null),
  // timeSlots/breaks are derived server-side from the simple fields
  // above (see institutionConfig.model.js's pre-validate hook). Accepted
  // here only so reads that round-trip a fetched document don't fail
  // validation; any values submitted are recomputed, not trusted.
  timeSlots: Joi.array().items(timeSlotSchema).default([]),
  breaks: Joi.array().items(breakSlotSchema).default([]),
  slotPreferences: slotPreferencesSchema.default({}),
  defaultTheoryRules: defaultTheoryRulesSchema.default({}),
  defaultLabRules: defaultLabRulesSchema.default({}),
  defaultTutorialRules: defaultTutorialRulesSchema.default({}),
  defaultTeacherLimits: defaultTeacherLimitsSchema.default({}),
  defaultClassroomRules: defaultClassroomRulesSchema.default({}),
  defaultExamRules: Joi.object().unknown(true).default({}),
  defaultLeaveRules: Joi.object().unknown(true).default({}),
  isActive: Joi.boolean().default(true),
});

export const updateInstitutionConfigSchema = createInstitutionConfigSchema.fork(
  ['academicYear'],
  (schema) => schema.optional()
);

// Applies the shared timing-consistency checks (overlap/range/lunch/
// duration rules) on top of Joi's shape validation. `existing` is the
// current document (for updates), so a partial payload that only changes
// e.g. `periodDurationMinutes` is still checked against the full,
// merged set of timing fields rather than against Joi defaults.
const applyTimingValidation = (value, existing = {}) => {
  const merged = {
    periodsPerDay: value.periodsPerDay ?? existing.periodsPerDay ?? 6,
    periodStartTime: value.periodStartTime ?? existing.periodStartTime ?? '09:00',
    periodEndTime: value.periodEndTime ?? existing.periodEndTime ?? '16:00',
    periodDurationMinutes: value.periodDurationMinutes ?? existing.periodDurationMinutes ?? 60,
    breakDurationMinutes: value.breakDurationMinutes ?? existing.breakDurationMinutes ?? 0,
    lunchBreakStart: value.lunchBreakStart ?? existing.lunchBreakStart ?? null,
    lunchBreakEnd: value.lunchBreakEnd ?? existing.lunchBreakEnd ?? null,
  };

  const timingErrors = validateTimingConfig(merged);
  return timingErrors;
};

export const validateCreateInstitutionConfig = (payload) => {
  const result = createInstitutionConfigSchema.validate(payload, { abortEarly: false, stripUnknown: true });
  if (result.error) return result;

  const timingErrors = applyTimingValidation(result.value);
  if (timingErrors.length) {
    return {
      error: { details: timingErrors.map((message) => ({ message })) },
      value: result.value,
    };
  }
  return result;
};

export const validateUpdateInstitutionConfig = (payload, existing = {}) => {
  const result = updateInstitutionConfigSchema.validate(payload, { abortEarly: false, stripUnknown: true });
  if (result.error) return result;

  const timingErrors = applyTimingValidation(result.value, existing);
  if (timingErrors.length) {
    return {
      error: { details: timingErrors.map((message) => ({ message })) },
      value: result.value,
    };
  }
  return result;
};

export default {
  createInstitutionConfigSchema,
  updateInstitutionConfigSchema,
  validateCreateInstitutionConfig,
  validateUpdateInstitutionConfig,
};