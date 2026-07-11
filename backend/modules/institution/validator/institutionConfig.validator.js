// backend/modules/institution/validator/institutionConfig.validator.js
//
// Joi validation schemas for InstitutionConfig payloads. `joi` is already
// a project dependency (see backend/package.json), so no new package is
// introduced. Validators only shape/check input; they never touch
// Mongoose or the database.

import Joi from 'joi';

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

export const validateCreateInstitutionConfig = (payload) =>
  createInstitutionConfigSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export const validateUpdateInstitutionConfig = (payload) =>
  updateInstitutionConfigSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export default {
  createInstitutionConfigSchema,
  updateInstitutionConfigSchema,
  validateCreateInstitutionConfig,
  validateUpdateInstitutionConfig,
};