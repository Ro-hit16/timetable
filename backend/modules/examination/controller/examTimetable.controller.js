// backend/modules/examination/controller/examTimetable.controller.js

import asyncHandler from '../../../utils/async-handler.js';
import { sendResponse } from '../../../utils/response.js';
import ApiError from '../../../utils/ApiError.js';
import examTimetableService from '../service/examTimetable.service.js';
import {
  validateCreateExamTimetable,
  validateUpdateExamTimetable,
} from '../validator/examTimetable.validator.js';

export const listExamTimetables = asyncHandler(async (req, res) => {
  const { examId, departmentId, semester } = req.query;
  const filter = {};
  if (examId) filter.examId = examId;
  if (departmentId) filter.departmentId = departmentId;
  if (semester) filter.semester = semester;
  const entries = await examTimetableService.listExamTimetables(filter);
  return sendResponse(res, 200, true, 'Exam timetables fetched', entries);
});

export const getExamTimetableById = asyncHandler(async (req, res) => {
  const entry = await examTimetableService.getExamTimetableById(req.params.id);
  return sendResponse(res, 200, true, 'Exam timetable fetched', entry);
});

export const listExamTimetablesByExamId = asyncHandler(async (req, res) => {
  const entries = await examTimetableService.listExamTimetablesByExamId(req.params.examId);
  return sendResponse(res, 200, true, 'Exam timetables fetched', entries);
});

export const createExamTimetable = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateExamTimetable(req.body);
  if (error) throw new ApiError(400, 'Invalid ExamTimetable payload', error.details);
  const created = await examTimetableService.createExamTimetable(value);
  return sendResponse(res, 201, true, 'Exam timetable created', created);
});

export const updateExamTimetable = asyncHandler(async (req, res) => {
  const { error, value } = validateUpdateExamTimetable(req.body);
  if (error) throw new ApiError(400, 'Invalid ExamTimetable payload', error.details);
  const updated = await examTimetableService.updateExamTimetable(req.params.id, value);
  return sendResponse(res, 200, true, 'Exam timetable updated', updated);
});

export const deleteExamTimetable = asyncHandler(async (req, res) => {
  await examTimetableService.deleteExamTimetable(req.params.id);
  return sendResponse(res, 200, true, 'Exam timetable deleted', null);
});

export default {
  listExamTimetables,
  getExamTimetableById,
  listExamTimetablesByExamId,
  createExamTimetable,
  updateExamTimetable,
  deleteExamTimetable,
};