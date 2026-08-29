// backend/modules/examination/repository/exam.repository.js
//
// Pure data access for Exam. No business rules here — see exam.service.js.

import Exam from '../model/exam.model.js';

export const findAll = (filter = {}) => Exam.find(filter).sort({ createdAt: -1 });

export const findById = (id) => Exam.findById(id);

export const create = (data) => Exam.create(data);

export const updateById = (id, data) =>
  Exam.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteById = (id) => Exam.findByIdAndDelete(id);

export default { findAll, findById, create, updateById, deleteById };