// backend/modules/institution/service/institutionConfig.service.js
//
// CRUD-level service for InstitutionConfig. This is deliberately separate
// from institutionConfigResolver.service.js: this file is "manage the
// config documents themselves" (what the controller calls); the resolver
// is "merge config documents + defaults into a SchedulerContext" (what a
// future integration step, NOT part of this task, would call before
// running the generator).

import ApiError from '../../../utils/ApiError.js';
import institutionConfigRepository from '../repository/institutionConfig.repository.js';
import { createSchedulerContext } from '../../shared/SchedulerContext.js';
export const listInstitutionConfigs = async ({ departmentId, academicYear } = {}) => {
  const filter = {};
  if (departmentId !== undefined) filter.departmentId = departmentId || null;
  if (academicYear) filter.academicYear = academicYear;
  return institutionConfigRepository.findAll(filter);
};

export const getInstitutionConfigById = async (id) => {
  const doc = await institutionConfigRepository.findById(id);
  if (!doc) {
    throw new ApiError(404, `InstitutionConfig ${id} not found`);
  }
  return doc;
};

export const getInstitutionConfigByScope = async ({ departmentId = null, academicYear }) => {
  if (!academicYear) {
    throw new ApiError(400, 'academicYear is required');
  }
  return institutionConfigRepository.findByScope({ departmentId, academicYear });
};

export const createInstitutionConfig = async (data) => {
  try {
    return await institutionConfigRepository.create(data);
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(
        409,
        'An InstitutionConfig already exists for this departmentId + academicYear scope'
      );
    }
    throw err;
  }
};

export const updateInstitutionConfig = async (id, data) => {
  const updated = await institutionConfigRepository.updateById(id, data);
  if (!updated) {
    throw new ApiError(404, `InstitutionConfig ${id} not found`);
  }
  return updated;
};

export const deleteInstitutionConfig = async (id) => {
  const deleted = await institutionConfigRepository.deleteById(id);
  if (!deleted) {
    throw new ApiError(404, `InstitutionConfig ${id} not found`);
  }
  return deleted;
};

export default {
  listInstitutionConfigs,
  getInstitutionConfigById,
  getInstitutionConfigByScope,
  createInstitutionConfig,
  updateInstitutionConfig,
  deleteInstitutionConfig,
};