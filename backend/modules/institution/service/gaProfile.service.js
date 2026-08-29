// backend/modules/institution/service/gaProfile.service.js

import ApiError from '../../../utils/ApiError.js';
import gaProfileRepository from '../repository/gaProfile.repository.js';

export const listGAProfiles = async ({ departmentId, academicYear } = {}) => {
  const filter = {};
  if (departmentId !== undefined) filter.departmentId = departmentId || null;
  if (academicYear) filter.academicYear = academicYear;
  return gaProfileRepository.findAll(filter);
};

export const getGAProfileById = async (id) => {
  const doc = await gaProfileRepository.findById(id);
  if (!doc) {
    throw new ApiError(404, `GAProfile ${id} not found`);
  }
  return doc;
};

export const getGAProfileByScope = async ({ departmentId = null, academicYear }) => {
  if (!academicYear) {
    throw new ApiError(400, 'academicYear is required');
  }
  return gaProfileRepository.findByScope({ departmentId, academicYear });
};

export const createGAProfile = async (data) => {
  try {
    return await gaProfileRepository.create(data);
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(
        409,
        'A GAProfile already exists for this departmentId + academicYear scope'
      );
    }
    throw err;
  }
};

export const updateGAProfile = async (id, data) => {
  const updated = await gaProfileRepository.updateById(id, data);
  if (!updated) {
    throw new ApiError(404, `GAProfile ${id} not found`);
  }
  return updated;
};

export const deleteGAProfile = async (id) => {
  const deleted = await gaProfileRepository.deleteById(id);
  if (!deleted) {
    throw new ApiError(404, `GAProfile ${id} not found`);
  }
  return deleted;
};

export default {
  listGAProfiles,
  getGAProfileById,
  getGAProfileByScope,
  createGAProfile,
  updateGAProfile,
  deleteGAProfile,
};