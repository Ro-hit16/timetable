// backend/modules/institution/controller/teacherPreference.controller.js

import asyncHandler from '../../../utils/async-handler.js';
import { sendResponse } from '../../../utils/response.js';
import ApiError from '../../../utils/ApiError.js';
import teacherPreferenceService from '../service/teacherPreference.service.js';
import {
  validateCreateTeacherPreference,
  validateUpdateTeacherPreference,
} from '../validator/teacherPreference.validator.js';

export const listTeacherPreferences = asyncHandler(async (req, res) => {
  const { teacherId, academicYear } = req.query;
  const docs = await teacherPreferenceService.listTeacherPreferences({
    teacherId,
    academicYear,
  });
  return sendResponse(res, 200, true, 'TeacherPreferences fetched', docs);
});

export const getTeacherPreferenceById = asyncHandler(async (req, res) => {
  const doc = await teacherPreferenceService.getTeacherPreferenceById(req.params.id);
  return sendResponse(res, 200, true, 'TeacherPreference fetched', doc);
});

export const getTeacherPreferenceByScope = asyncHandler(async (req, res) => {
  const { teacherId, academicYear } = req.query;
  const doc = await teacherPreferenceService.getTeacherPreferenceByScope({
    teacherId,
    academicYear,
  });
  return sendResponse(res, 200, true, 'TeacherPreference fetched', doc);
});

export const createTeacherPreference = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateTeacherPreference(req.body);
  if (error) {
    throw new ApiError(400, 'Invalid TeacherPreference payload', error.details);
  }
  const created = await teacherPreferenceService.createTeacherPreference(value);
  return sendResponse(res, 201, true, 'TeacherPreference created', created);
});

export const updateTeacherPreference = asyncHandler(async (req, res) => {
  const { error, value } = validateUpdateTeacherPreference(req.body);
  if (error) {
    throw new ApiError(400, 'Invalid TeacherPreference payload', error.details);
  }
  const updated = await teacherPreferenceService.updateTeacherPreference(req.params.id, value);
  return sendResponse(res, 200, true, 'TeacherPreference updated', updated);
});

export const deleteTeacherPreference = asyncHandler(async (req, res) => {
  await teacherPreferenceService.deleteTeacherPreference(req.params.id);
  return sendResponse(res, 200, true, 'TeacherPreference deleted', null);
});

export default {
  listTeacherPreferences,
  getTeacherPreferenceById,
  getTeacherPreferenceByScope,
  createTeacherPreference,
  updateTeacherPreference,
  deleteTeacherPreference,
};