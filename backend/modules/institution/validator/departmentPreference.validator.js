// backend/modules/institution/validator/departmentPreference.validator.js

import Joi from 'joi';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const slotRefSchema = Joi.object({
  day: Joi.string().trim().required(),
  periodIndex: Joi.number().integer().min(0).required(),
});

const divisionStrengthSchema = Joi.object({
  division: Joi.string().trim().required(),
  studentCount: Joi.number().integer().min(0).required(),
});

export const createDepartmentPreferenceSchema = Joi.object({
  departmentId: Joi.string().pattern(objectIdPattern).required(),
  academicYear: Joi.string().trim().required(),
  preferredClassrooms: Joi.array().items(Joi.string().pattern(objectIdPattern)).default([]),
  blackoutSlots: Joi.array().items(slotRefSchema).default([]),
  divisionStrength: Joi.array().items(divisionStrengthSchema).default([]),
  schedulingPreferences: Joi.object().unknown(true).default({}),
  isActive: Joi.boolean().default(true),
});

export const updateDepartmentPreferenceSchema = createDepartmentPreferenceSchema.fork(
  ['departmentId', 'academicYear'],
  (schema) => schema.optional()
);

export const validateCreateDepartmentPreference = (payload) =>
  createDepartmentPreferenceSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export const validateUpdateDepartmentPreference = (payload) =>
  updateDepartmentPreferenceSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export default {
  createDepartmentPreferenceSchema,
  updateDepartmentPreferenceSchema,
  validateCreateDepartmentPreference,
  validateUpdateDepartmentPreference,
};