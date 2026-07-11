// backend/modules/institution/repository/gaProfile.repository.js
//
// Repository layer: pure data access for GAProfile. No business rules
// here — see institutionConfigResolver.service.js / gaAdapter.service.js
// for merging and translation logic.

import GAProfile from '../model/gaProfile.model.js';

export const findAll = async (filter = {}) => {
  return GAProfile.find(filter).sort({ createdAt: -1 });
};

export const findById = async (id) => {
  return GAProfile.findById(id);
};

// Finds the GA profile for an exact scope (departmentId, academicYear).
// departmentId may be null to look up the institution-wide default profile.
export const findByScope = async ({ departmentId = null, academicYear }) => {
  return GAProfile.findOne({
    departmentId: departmentId || null,
    academicYear,
    isActive: true,
  });
};

export const create = async (data) => {
  return GAProfile.create(data);
};

export const updateById = async (id, data) => {
  return GAProfile.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteById = async (id) => {
  return GAProfile.findByIdAndDelete(id);
};

export default {
  findAll,
  findById,
  findByScope,
  create,
  updateById,
  deleteById,
};