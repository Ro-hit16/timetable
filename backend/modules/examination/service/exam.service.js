// backend/modules/examination/service/exam.service.js

import ApiError from '../../../utils/ApiError.js';
import examRepository from '../repository/exam.repository.js';

export const listExams = async ({ departmentId, academicYear, semester, examType, status } = {}) => {
  const filter = {};
  if (departmentId) filter.departmentId = departmentId;
  if (academicYear) filter.academicYear = academicYear;
  if (semester) filter.semester = semester;
  if (examType) filter.examType = examType;
  if (status) filter.status = status;
  return examRepository.findAll(filter);
};

export const getExamById = async (id) => {
  const exam = await examRepository.findById(id);
  if (!exam) throw new ApiError(404, `Exam ${id} not found`);
  return exam;
};

export const createExam = async (data) => examRepository.create(data);

export const updateExam = async (id, data) => {
  const updated = await examRepository.updateById(id, data);
  if (!updated) throw new ApiError(404, `Exam ${id} not found`);
  return updated;
};

export const deleteExam = async (id) => {
  const deleted = await examRepository.deleteById(id);
  if (!deleted) throw new ApiError(404, `Exam ${id} not found`);
  return deleted;
};

export default { listExams, getExamById, createExam, updateExam, deleteExam };