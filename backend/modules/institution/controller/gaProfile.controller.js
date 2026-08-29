// backend/modules/institution/controller/gaProfile.controller.js

import asyncHandler from '../../../utils/async-handler.js';
import { sendResponse } from '../../../utils/response.js';
import ApiError from '../../../utils/ApiError.js';
import gaProfileService from '../service/gaProfile.service.js';
import {
  validateCreateGAProfile,
  validateUpdateGAProfile,
} from '../validator/gaProfile.validator.js';

export const listGAProfiles = asyncHandler(async (req, res) => {
  const { departmentId, academicYear } = req.query;
  const docs = await gaProfileService.listGAProfiles({
    departmentId: departmentId || undefined,
    academicYear,
  });
  return sendResponse(res, 200, true, 'GAProfiles fetched', docs);
});

export const getGAProfileById = asyncHandler(async (req, res) => {
  const doc = await gaProfileService.getGAProfileById(req.params.id);
  return sendResponse(res, 200, true, 'GAProfile fetched', doc);
});

export const getGAProfileByScope = asyncHandler(async (req, res) => {
  const { departmentId, academicYear } = req.query;
  const doc = await gaProfileService.getGAProfileByScope({
    departmentId: departmentId || null,
    academicYear,
  });
  return sendResponse(res, 200, true, 'GAProfile fetched', doc);
});

export const createGAProfile = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateGAProfile(req.body);
  if (error) {
    throw new ApiError(400, 'Invalid GAProfile payload', error.details);
  }
  const created = await gaProfileService.createGAProfile(value);
  return sendResponse(res, 201, true, 'GAProfile created', created);
});

export const updateGAProfile = asyncHandler(async (req, res) => {
  const { error, value } = validateUpdateGAProfile(req.body);
  if (error) {
    throw new ApiError(400, 'Invalid GAProfile payload', error.details);
  }
  const updated = await gaProfileService.updateGAProfile(req.params.id, value);
  return sendResponse(res, 200, true, 'GAProfile updated', updated);
});

export const deleteGAProfile = asyncHandler(async (req, res) => {
  await gaProfileService.deleteGAProfile(req.params.id);
  return sendResponse(res, 200, true, 'GAProfile deleted', null);
});

export default {
  listGAProfiles,
  getGAProfileById,
  getGAProfileByScope,
  createGAProfile,
  updateGAProfile,
  deleteGAProfile,
};