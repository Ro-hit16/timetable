// backend/modules/institution/validator/gaProfile.validator.js

import Joi from 'joi';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createGAProfileSchema = Joi.object({
  departmentId: Joi.string().pattern(objectIdPattern).allow(null).default(null),
  academicYear: Joi.string().trim().required(),
  populationSize: Joi.number().integer().min(1).allow(null).default(null),
  maxGenerations: Joi.number().integer().min(1).allow(null).default(null),
  mutationRate: Joi.number().min(0).max(1).allow(null).default(null),
  crossoverRate: Joi.number().min(0).max(1).allow(null).default(null),
  elitismRate: Joi.number().min(0).max(1).allow(null).default(null),
  // Sparse map of penalty-key -> numeric override, e.g. { TEACHER_CLASH: -20000 }.
  // Keys are intentionally not enumerated here (see gaProfile.model.js) so
  // this validator never has to be kept in sync with the GA's internal
  // penalty constant names.
  penaltyOverrides: Joi.object().pattern(Joi.string(), Joi.number()).default({}),
  isActive: Joi.boolean().default(true),
});

export const updateGAProfileSchema = createGAProfileSchema.fork(
  ['academicYear'],
  (schema) => schema.optional()
);

export const validateCreateGAProfile = (payload) =>
  createGAProfileSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export const validateUpdateGAProfile = (payload) =>
  updateGAProfileSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export default {
  createGAProfileSchema,
  updateGAProfileSchema,
  validateCreateGAProfile,
  validateUpdateGAProfile,
};