// backend/modules/institution/validator/teacherPreference.validator.js

import Joi from 'joi';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const slotRefSchema = Joi.object({
  day: Joi.string().trim().required(),
  periodIndex: Joi.number().integer().min(0).required(),
});

export const createTeacherPreferenceSchema = Joi.object({
  teacherId: Joi.string().pattern(objectIdPattern).required(),
  academicYear: Joi.string().trim().required(),
  unavailableSlots: Joi.array().items(slotRefSchema).default([]),
  preferredSlots: Joi.array().items(slotRefSchema).default([]),
  maxLecturesPerDay: Joi.number().integer().min(0).allow(null).default(null),
  maxLecturesPerWeek: Joi.number().integer().min(0).allow(null).default(null),
  isActive: Joi.boolean().default(true),
});

export const updateTeacherPreferenceSchema = createTeacherPreferenceSchema.fork(
  ['teacherId', 'academicYear'],
  (schema) => schema.optional()
);

export const validateCreateTeacherPreference = (payload) =>
  createTeacherPreferenceSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export const validateUpdateTeacherPreference = (payload) =>
  updateTeacherPreferenceSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export default {
  createTeacherPreferenceSchema,
  updateTeacherPreferenceSchema,
  validateCreateTeacherPreference,
  validateUpdateTeacherPreference,
};