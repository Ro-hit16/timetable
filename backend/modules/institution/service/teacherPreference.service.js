// backend/modules/institution/service/teacherPreference.service.js

import ApiError from '../../../utils/ApiError.js';
import teacherPreferenceRepository from '../repository/teacherPreference.repository.js';

export const listTeacherPreferences = async ({ teacherId, academicYear } = {}) => {
  const filter = {};
  if (teacherId) filter.teacherId = teacherId;
  if (academicYear) filter.academicYear = academicYear;
  return teacherPreferenceRepository.findAll(filter);
};

export const getTeacherPreferenceById = async (id) => {
  const doc = await teacherPreferenceRepository.findById(id);
  if (!doc) {
    throw new ApiError(404, `TeacherPreference ${id} not found`);
  }
  return doc;
};

export const getTeacherPreferenceByScope = async ({ teacherId, academicYear }) => {
  if (!teacherId || !academicYear) {
    throw new ApiError(400, 'teacherId and academicYear are required');
  }
  return teacherPreferenceRepository.findByTeacherAndYear({ teacherId, academicYear });
};

export const getTeacherPreferencesForTeachers = async ({ teacherIds = [], academicYear }) => {
  if (!academicYear) {
    throw new ApiError(400, 'academicYear is required');
  }
  return teacherPreferenceRepository.findByTeacherIdsAndYear({ teacherIds, academicYear });
};

export const createTeacherPreference = async (data) => {
  try {
    return await teacherPreferenceRepository.create(data);
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(
        409,
        'A TeacherPreference already exists for this teacherId + academicYear scope'
      );
    }
    throw err;
  }
};

export const updateTeacherPreference = async (id, data) => {
  const updated = await teacherPreferenceRepository.updateById(id, data);
  if (!updated) {
    throw new ApiError(404, `TeacherPreference ${id} not found`);
  }
  return updated;
};

export const deleteTeacherPreference = async (id) => {
  const deleted = await teacherPreferenceRepository.deleteById(id);
  if (!deleted) {
    throw new ApiError(404, `TeacherPreference ${id} not found`);
  }
  return deleted;
};

export default {
  listTeacherPreferences,
  getTeacherPreferenceById,
  getTeacherPreferenceByScope,
  getTeacherPreferencesForTeachers,
  createTeacherPreference,
  updateTeacherPreference,
  deleteTeacherPreference,
};