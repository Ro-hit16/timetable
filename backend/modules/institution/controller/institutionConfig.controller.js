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

// Mongoose ObjectId (and similar) values need to become plain strings
// before being re-validated by the Joi schema, which expects strings.
const toPlainScalar = (value) =>
  value && typeof value.toString === 'function' && typeof value !== 'string' ? value.toString() : value;

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

export const createInstitutionConfig = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateInstitutionConfig(req.body);
  if (error) {
    throw new ApiError(400, 'Invalid InstitutionConfig payload', error.details);
  }
  const created = await institutionConfigService.createInstitutionConfig(value);
  return sendResponse(res, 201, true, 'InstitutionConfig created', created);
});

export const updateInstitutionConfig = asyncHandler(async (req, res) => {
  const { error: partialError, value: partialValue } = validateUpdateInstitutionConfig(req.body);
  if (partialError) {
    throw new ApiError(400, 'Invalid InstitutionConfig payload', partialError.details);
  }

  // Fetch the existing document so we can validate the *merged* result,
  // not just the (possibly partial) incoming payload in isolation. This
  // catches cases where an otherwise-valid partial update would leave the
  // overall configuration invalid (e.g. clearing workingDays down to []).
  const existing = await institutionConfigService.getInstitutionConfigById(req.params.id);
  const existingPlain = existing.toObject();

  const merged = {
    ...existingPlain,
    departmentId: toPlainScalar(existingPlain.departmentId),
    ...partialValue,
  };

  const { error: mergedError } = validateCreateInstitutionConfig(merged);
  if (mergedError) {
    throw new ApiError(400, 'Resulting InstitutionConfig would be invalid', mergedError.details);
  }

  const updated = await institutionConfigService.updateInstitutionConfig(req.params.id, partialValue);
  return sendResponse(res, 200, true, 'InstitutionConfig updated', updated);
});

export const getEffectiveInstitutionConfig = asyncHandler(async (req, res) => {
  const { departmentId, academicYear } = req.query;
  const effective = await institutionConfigService.getEffectiveInstitutionConfig({
    departmentId: departmentId || null,
    academicYear,
  });
  return sendResponse(res, 200, true, 'Effective InstitutionConfig resolved', effective);
});

export const deleteInstitutionConfig = asyncHandler(async (req, res) => {
  await institutionConfigService.deleteInstitutionConfig(req.params.id);
  return sendResponse(res, 200, true, 'InstitutionConfig deleted', null);
});

export default {
  listInstitutionConfigs,
  getInstitutionConfigById,
  getInstitutionConfigByScope,
  createInstitutionConfig,
  updateInstitutionConfig,
  deleteInstitutionConfig,
  getEffectiveInstitutionConfig,
};