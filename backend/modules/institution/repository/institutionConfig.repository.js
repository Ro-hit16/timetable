// backend/modules/institution/repository/institutionConfig.repository.js
//
// Repository layer: pure data access for InstitutionConfig. No business
// rules, no defaulting/merging logic (that belongs to the service /
// resolver layer). Keeping Mongoose calls isolated here is what allows
// this module to later be lifted into its own microservice without any
// controller/service code change — only this file's internals would need
// to change (e.g. to call another service's API instead of Mongoose).

import InstitutionConfig from '../model/institutionConfig.model.js';

export const findAll = async (filter = {}) => {
  return InstitutionConfig.find(filter).sort({ createdAt: -1 });
};

export const findById = async (id) => {
  return InstitutionConfig.findById(id);
};

// Finds the config document for an exact scope (departmentId, academicYear).
// departmentId may be null to look up the institution-wide default.
export const findByScope = async ({ departmentId = null, academicYear }) => {
  return InstitutionConfig.findOne({
    departmentId: departmentId || null,
    academicYear,
    isActive: true,
  });
};

export const create = async (data) => {
  return InstitutionConfig.create(data);
};

// Fetch -> modify -> save, rather than findByIdAndUpdate, so that any
// document middleware (pre('save')/post('save') hooks — e.g. the
// time-slot builder) actually runs. findByIdAndUpdate is a query and
// bypasses document middleware entirely, which would silently skip that
// logic.
export const updateById = async (id, data) => {
  const doc = await InstitutionConfig.findById(id);
  if (!doc) return null;
  doc.set(data);
  return doc.save();
};

export const deleteById = async (id) => {
  return InstitutionConfig.findByIdAndDelete(id);
};

export default {
  findAll,
  findById,
  findByScope,
  create,
  updateById,
  deleteById,
};