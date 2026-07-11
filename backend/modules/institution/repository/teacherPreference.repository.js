// backend/modules/institution/repository/teacherPreference.repository.js
//
// Repository layer: pure data access for TeacherPreference. No business
// rules here — see institutionConfigResolver.service.js for merging logic.

import TeacherPreference from '../model/teacherPreference.model.js';

export const findAll = async (filter = {}) => {
  return TeacherPreference.find(filter).sort({ createdAt: -1 });
};

export const findById = async (id) => {
  return TeacherPreference.findById(id);
};

export const findByTeacherAndYear = async ({ teacherId, academicYear }) => {
  return TeacherPreference.findOne({
    teacherId,
    academicYear,
    isActive: true,
  });
};

// Bulk lookup used by the resolver when it needs preferences for several
// teachers at once (e.g. all teachers involved in one generation run).
export const findByTeacherIdsAndYear = async ({ teacherIds = [], academicYear }) => {
  return TeacherPreference.find({
    teacherId: { $in: teacherIds },
    academicYear,
    isActive: true,
  });
};

export const create = async (data) => {
  return TeacherPreference.create(data);
};

export const updateById = async (id, data) => {
  return TeacherPreference.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteById = async (id) => {
  return TeacherPreference.findByIdAndDelete(id);
};

export default {
  findAll,
  findById,
  findByTeacherAndYear,
  findByTeacherIdsAndYear,
  create,
  updateById,
  deleteById,
};