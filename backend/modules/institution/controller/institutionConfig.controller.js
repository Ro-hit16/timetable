// backend/modules/institution/controller/institutionConfig.controller.js
//
// Thin controller: validate -> service -> respond. No business logic
// lives here (see institutionConfig.service.js).

import asyncHandler from '../../../utils/async-handler.js';
import { sendResponse } from '../../../utils/response.js';
import ApiError from '../../../utils/ApiError.js';
import institutionConfigService from '../service/institutionConfig.service.js';
import {
  validateCreateInstitutionConfig,
  validateUpdateInstitutionConfig,
} from '../validator/institutionConfig.validator.js';
import { resolveSchedulerContext } from '../service/institutionConfigResolver.service.js';

export const listInstitutionConfigs = asyncHandler(async (req, res) => {
  const { departmentId, academicYear } = req.query;
  const configs = await institutionConfigService.listInstitutionConfigs({
    departmentId: departmentId || undefined,
    academicYear,
  });
  return sendResponse(res, 200, true, 'InstitutionConfigs fetched', configs);
});

export const getInstitutionConfigById = asyncHandler(async (req, res) => {
  const config = await institutionConfigService.getInstitutionConfigById(req.params.id);
  return sendResponse(res, 200, true, 'InstitutionConfig fetched', config);
});

export const getInstitutionConfigByScope = asyncHandler(async (req, res) => {
  const { departmentId, academicYear } = req.query;
  const config = await institutionConfigService.getInstitutionConfigByScope({
    departmentId: departmentId || null,
    academicYear,
  });
  return sendResponse(res, 200, true, 'InstitutionConfig fetched', config);
});

// Returns the *effective* (merged: department override -> institution-
// wide default -> system default) timing configuration for a scope. This
// is what the frontend timetable display should call — it always
// resolves to something renderable, even when no InstitutionConfig
// document has been saved yet for that exact department/year.
export const getEffectiveInstitutionConfig = asyncHandler(async (req, res) => {
  const { departmentId, academicYear } = req.query;
  if (!academicYear) {
    throw new ApiError(400, 'academicYear is required');
  }
  const schedulerContext = await resolveSchedulerContext({
    departmentId: departmentId || null,
    academicYear,
  });
  return sendResponse(res, 200, true, 'Effective InstitutionConfig resolved', {
    institutionConfig: schedulerContext.institutionConfig,
    resolvedRules: schedulerContext.resolvedRules,
    sources: schedulerContext.metadata.sources,
  });
});

export const createInstitutionConfig = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateInstitutionConfig(req.body);
  if (error) {
    throw new ApiError(400, 'Invalid InstitutionConfig payload', error.details);
  }
  const created = await institutionConfigService.createInstitutionConfig(value);
  return sendResponse(res, 201, true, 'InstitutionConfig created', created);
});

export const updateInstitutionConfig = asyncHandler(async (req, res) => {
  const existing = await institutionConfigService.getInstitutionConfigById(req.params.id);
  const { error, value } = validateUpdateInstitutionConfig(req.body, existing?.toObject ? existing.toObject() : existing);
  if (error) {
    throw new ApiError(400, 'Invalid InstitutionConfig payload', error.details);
  }
  const updated = await institutionConfigService.updateInstitutionConfig(req.params.id, value);
  return sendResponse(res, 200, true, 'InstitutionConfig updated', updated);
});

export const deleteInstitutionConfig = asyncHandler(async (req, res) => {
  await institutionConfigService.deleteInstitutionConfig(req.params.id);
  return sendResponse(res, 200, true, 'InstitutionConfig deleted', null);
});

export default {
  listInstitutionConfigs,
  getInstitutionConfigById,
  getInstitutionConfigByScope,
  getEffectiveInstitutionConfig,
  createInstitutionConfig,
  updateInstitutionConfig,
  deleteInstitutionConfig,
};