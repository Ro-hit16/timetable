// backend/modules/examination/repository/examTimetable.repository.js
//
// Pure data access for ExamTimetable. Overlap/clash comparison logic
// intentionally lives in examValidation.service.js, not here — this file
// only fetches candidate documents.

import ExamTimetable from '../model/examTimetable.model.js';

export const findAll = (filter = {}) => ExamTimetable.find(filter).sort({ date: 1 });

export const findById = (id) => ExamTimetable.findById(id);

export const findByExamId = (examId) => ExamTimetable.find({ examId }).sort({ date: 1 });

export const create = (data) => ExamTimetable.create(data);

export const updateById = (id, data) =>
  ExamTimetable.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteById = (id) => ExamTimetable.findByIdAndDelete(id);

// Returns every other exam-timetable entry on the same calendar date,
// excluding the entry currently being created/updated. Exact time-range
// overlap filtering happens in examValidation.service.js.
export const findByDate = (date, excludeId = null) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const filter = { date: { $gte: start, $lte: end } };
  if (excludeId) filter._id = { $ne: excludeId };
  return ExamTimetable.find(filter);
};

export default { findAll, findById, findByExamId, create, updateById, deleteById, findByDate };