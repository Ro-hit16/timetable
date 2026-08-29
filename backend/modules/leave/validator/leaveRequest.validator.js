// backend/modules/leave/validator/leaveRequest.validator.js

import Joi from 'joi';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createLeaveRequestSchema = Joi.object({
  teacherId: Joi.string().pattern(objectIdPattern).required(),
  leaveType: Joi.string().valid('Casual', 'Sick', 'Earned', 'On Duty', 'Other').required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  dayType: Joi.string().valid('full_day', 'half_day').default('full_day'),
  halfDaySession: Joi.string().valid('forenoon', 'afternoon').allow(null).default(null),
  reason: Joi.string().trim().max(500).required(),
  // Accepted but ignored server-side on create — every request starts
  // 'pending' regardless of what's sent here (see leaveRequest.service.js).
  status: Joi.string().valid('pending', 'approved', 'rejected', 'cancelled').default('pending'),
});

export const updateLeaveRequestSchema = createLeaveRequestSchema.fork(
  ['teacherId', 'leaveType', 'startDate', 'endDate', 'reason'],
  (schema) => schema.optional()
);

const leaveActionSchema = Joi.object({
  actedBy: Joi.string().pattern(objectIdPattern).allow(null).default(null),
  remarks: Joi.string().trim().allow('').default(''),
});

export const validateCreateLeaveRequest = (payload) =>
  createLeaveRequestSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export const validateUpdateLeaveRequest = (payload) =>
  updateLeaveRequestSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export const validateLeaveAction = (payload) =>
  leaveActionSchema.validate(payload, { abortEarly: false, stripUnknown: true });

export default {
  createLeaveRequestSchema,
  updateLeaveRequestSchema,
  validateCreateLeaveRequest,
  validateUpdateLeaveRequest,
  validateLeaveAction,
};