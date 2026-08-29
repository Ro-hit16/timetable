// backend/modules/institution/service/departmentPreference.service.js

import ApiError from '../../../utils/ApiError.js';
import departmentPreferenceRepository from '../repository/departmentPreference.repository.js';

export const listDepartmentPreferences = async ({ departmentId, academicYear } = {}) => {
  const filter = {};
  if (departmentId) filter.departmentId = departmentId;
  if (academicYear) filter.academicYear = academicYear;
  return departmentPreferenceRepository.findAll(filter);
};

export const getDepartmentPreferenceById = async (id) => {
  const doc = await departmentPreferenceRepository.findById(id);
  if (!doc) {
    throw new ApiError(404, `DepartmentPreference ${id} not found`);
  }
  return doc;
};

export const getDepartmentPreferenceByScope = async ({ departmentId, academicYear }) => {
  if (!departmentId || !academicYear) {
    throw new ApiError(400, 'departmentId and academicYear are required');
  }
  return departmentPreferenceRepository.findByDepartmentAndYear({ departmentId, academicYear });
};

export const createDepartmentPreference = async (data) => {
  try {
    return await departmentPreferenceRepository.create(data);
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(
        409,
        'A DepartmentPreference already exists for this departmentId + academicYear scope'
      );
    }
    throw err;
  }
};

export const updateDepartmentPreference = async (id, data) => {
  const updated = await departmentPreferenceRepository.updateById(id, data);
  if (!updated) {
    throw new ApiError(404, `DepartmentPreference ${id} not found`);
  }
  return updated;
};

export const deleteDepartmentPreference = async (id) => {
  const deleted = await departmentPreferenceRepository.deleteById(id);
  if (!deleted) {
    throw new ApiError(404, `DepartmentPreference ${id} not found`);
  }
  return deleted;
};

export default {
  listDepartmentPreferences,
  getDepartmentPreferenceById,
  getDepartmentPreferenceByScope,
  createDepartmentPreference,
  updateDepartmentPreference,
  deleteDepartmentPreference,
};