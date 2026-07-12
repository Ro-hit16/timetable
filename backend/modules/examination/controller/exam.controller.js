// backend/modules/examination/controller/exam.controller.js
//
// Thin controller: validate -> service -> respond.

import asyncHandler from '../../../utils/async-handler.js';
import { sendResponse } from '../../../utils/response.js';
import ApiError from '../../../utils/ApiError.js';
import examService from '../service/exam.service.js';
import { validateCreateExam, validateUpdateExam } from '../validator/exam.validator.js';

export const listExams = asyncHandler(async (req, res) => {
  const { departmentId, academicYear, semester, examType, status } = req.query;
  const exams = await examService.listExams({ departmentId, academicYear, semester, examType, status });
  return sendResponse(res, 200, true, 'Exams fetched', exams);
});

export const getExamById = asyncHandler(async (req, res) => {
  const exam = await examService.getExamById(req.params.id);
  return sendResponse(res, 200, true, 'Exam fetched', exam);
});

export const createExam = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateExam(req.body);
  if (error) throw new ApiError(400, 'Invalid Exam payload', error.details);
  const created = await examService.createExam(value);
  return sendResponse(res, 201, true, 'Exam created', created);
});

export const updateExam = asyncHandler(async (req, res) => {
  const { error, value } = validateUpdateExam(req.body);
  if (error) throw new ApiError(400, 'Invalid Exam payload', error.details);
  const updated = await examService.updateExam(req.params.id, value);
  return sendResponse(res, 200, true, 'Exam updated', updated);
});

export const deleteExam = asyncHandler(async (req, res) => {
  await examService.deleteExam(req.params.id);
  return sendResponse(res, 200, true, 'Exam deleted', null);
});

export default { listExams, getExamById, createExam, updateExam, deleteExam };