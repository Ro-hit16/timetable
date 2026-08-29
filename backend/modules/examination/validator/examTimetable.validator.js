// backend/modules/examination/validator/examTimetable.validator.js

import Joi from 'joi';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const objectId = () => Joi.string().pattern(objectIdPattern);

const roomAllocationSchema = Joi.object({
  roomId: objectId().required(),
  capacity: Joi.number().integer().min(1).required(),
  allocatedSeats: Joi.number().integer().min(0).default(0),
  isShared: Joi.boolean().default(false),
  isLab: Joi.boolean().default(false),
});

const studentAllocationSchema = Joi.object({
  division: Joi.string().trim().required(),
  prnStart: Joi.string().trim().required(),
  prnEnd: Joi.string().trim().required(),
  numberOfStudents: Joi.number().integer().min(1).required(),
  roomId: objectId().allow(null).default(null),
  seatStart: Joi.number().integer().allow(null).default(null),
  seatEnd: Joi.number().integer().allow(null).default(null),
});

const invigilatorSchema = Joi.object({
  teacherId: objectId().required(),
  roomId: objectId().required(),
  isSharedTeacher: Joi.boolean().default(false),
});

export const createExamTimetableSchema = Joi.object({
  examId: objectId().required(),
  date: Joi.date().required(),
  timeSlot: Joi.object({
    startTime: Joi.string().trim().required(),
    endTime: Joi.string().trim().required(),
  }).required(),
  durationMinutes: Joi.number().integer().min(1).required(),
  subjectId: objectId().required(),
  departmentId: objectId().required(),
  semester: Joi.string().trim().required(),
  divisions: Joi.array().items(Joi.string().trim()).min(1).required(),
  roomAllocations: Joi.array().items(roomAllocationSchema).default([]),
  studentAllocations: Joi.array().items(studentAllocationSchema).default([]),
  invigilators: Joi.array().items(invigilatorSchema).default([]),
  status: Joi.string().valid('draft', 'published', 'cancelled').default('draft'),
  // Request-scoped validation input only — not persisted on the model.
  // Stripped out in examTimetable.service.js before saving.
  maxInvigilationsPerDay: Joi.number().integer().min(1).default(2),
});

export const updateExamTimetableSchema = createExamTimetableSchema.fork(
  ['examId', 'date', 'timeSlot', 'durationMinutes', 'subjectId', 'departmentId', 'semester', 'divisions'],
  (schema) => schema.optional()
);

export const validateCreateExamTimetable = (payload) =>
  createExamTimetableSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export const validateUpdateExamTimetable = (payload) =>
  updateExamTimetableSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export default {
  createExamTimetableSchema,
  updateExamTimetableSchema,
  validateCreateExamTimetable,
  validateUpdateExamTimetable,
};