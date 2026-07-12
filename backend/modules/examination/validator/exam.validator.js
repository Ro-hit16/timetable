// backend/modules/examination/validator/exam.validator.js
//
// Joi validation for Exam payloads (joi is already a project dependency).

import Joi from 'joi';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createExamSchema = Joi.object({
  examName: Joi.string().trim().required(),
  academicYear: Joi.string().trim().required(),
  semester: Joi.string().trim().required(),
  departmentId: Joi.string().pattern(objectIdPattern).required(),
  examType: Joi.string()
    .valid('Mid Semester', 'End Semester', 'Practical', 'Viva', 'Internal')
    .required(),
  status: Joi.string()
    .valid('draft', 'scheduled', 'ongoing', 'completed', 'cancelled')
    .default('draft'),
});

export const updateExamSchema = createExamSchema.fork(
  ['examName', 'academicYear', 'semester', 'departmentId', 'examType'],
  (schema) => schema.optional()
);

export const validateCreateExam = (payload) =>
  createExamSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export const validateUpdateExam = (payload) =>
  updateExamSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export default { createExamSchema, updateExamSchema, validateCreateExam, validateUpdateExam };