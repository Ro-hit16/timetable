// backend/modules/institution/controller/departmentPreference.controller.js

import asyncHandler from '../../../utils/async-handler.js';
import { sendResponse } from '../../../utils/response.js';
import ApiError from '../../../utils/ApiError.js';
import departmentPreferenceService from '../service/departmentPreference.service.js';
import {
  validateCreateDepartmentPreference,
  validateUpdateDepartmentPreference,
} from '../validator/departmentPreference.validator.js';

export const listDepartmentPreferences = asyncHandler(async (req, res) => {
  const { departmentId, academicYear } = req.query;
  const docs = await departmentPreferenceService.listDepartmentPreferences({
    departmentId,
    academicYear,
  });
  return sendResponse(res, 200, true, 'DepartmentPreferences fetched', docs);
});

export const getDepartmentPreferenceById = asyncHandler(async (req, res) => {
  const doc = await departmentPreferenceService.getDepartmentPreferenceById(req.params.id);
  return sendResponse(res, 200, true, 'DepartmentPreference fetched', doc);
});

export const getDepartmentPreferenceByScope = asyncHandler(async (req, res) => {
  const { departmentId, academicYear } = req.query;
  const doc = await departmentPreferenceService.getDepartmentPreferenceByScope({
    departmentId,
    academicYear,
  });
  return sendResponse(res, 200, true, 'DepartmentPreference fetched', doc);
});

export const createDepartmentPreference = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateDepartmentPreference(req.body);
  if (error) {
    throw new ApiError(400, 'Invalid DepartmentPreference payload', error.details);
  }
  const created = await departmentPreferenceService.createDepartmentPreference(value);
  return sendResponse(res, 201, true, 'DepartmentPreference created', created);
});

export const updateDepartmentPreference = asyncHandler(async (req, res) => {
  const { error, value } = validateUpdateDepartmentPreference(req.body);
  if (error) {
    throw new ApiError(400, 'Invalid DepartmentPreference payload', error.details);
  }
  const updated = await departmentPreferenceService.updateDepartmentPreference(
    req.params.id,
    value
  );
  return sendResponse(res, 200, true, 'DepartmentPreference updated', updated);
});

export const deleteDepartmentPreference = asyncHandler(async (req, res) => {
  await departmentPreferenceService.deleteDepartmentPreference(req.params.id);
  return sendResponse(res, 200, true, 'DepartmentPreference deleted', null);
});

export default {
  listDepartmentPreferences,
  getDepartmentPreferenceById,
  getDepartmentPreferenceByScope,
  createDepartmentPreference,
  updateDepartmentPreference,
  deleteDepartmentPreference,
};