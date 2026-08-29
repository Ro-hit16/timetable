// backend/modules/institution/repository/departmentPreference.repository.js
//
// Repository layer: pure data access for DepartmentPreference. No business
// rules here — see institutionConfigResolver.service.js for merging logic.

import DepartmentPreference from '../model/departmentPreference.model.js';

export const findAll = async (filter = {}) => {
  return DepartmentPreference.find(filter).sort({ createdAt: -1 });
};

export const findById = async (id) => {
  return DepartmentPreference.findById(id);
};

export const findByDepartmentAndYear = async ({ departmentId, academicYear }) => {
  return DepartmentPreference.findOne({
    departmentId,
    academicYear,
    isActive: true,
  });
};

export const create = async (data) => {
  return DepartmentPreference.create(data);
};

export const updateById = async (id, data) => {
  return DepartmentPreference.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteById = async (id) => {
  return DepartmentPreference.findByIdAndDelete(id);
};

export default {
  findAll,
  findById,
  findByDepartmentAndYear,
  create,
  updateById,
  deleteById,
};