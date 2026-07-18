// backend/modules/leave/repository/leaveRequest.repository.js
//
// Pure data access for LeaveRequest. No business rules here — see
// leaveRequest.service.js and leaveValidation.service.js.

import LeaveRequest from '../model/leaveRequest.model.js';

export const findAll = (filter = {}) => LeaveRequest.find(filter).sort({ createdAt: -1 });

export const findById = (id) => LeaveRequest.findById(id);

export const create = (data) => LeaveRequest.create(data);

export const updateById = (id, data) =>
  LeaveRequest.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteById = (id) => LeaveRequest.findByIdAndDelete(id);

// Active (pending/approved) leave requests for a teacher whose date range
// overlaps [startDate, endDate]. Terminal states (rejected/cancelled) are
// excluded since they no longer block anything.
export const findOverlappingActive = ({ teacherId, startDate, endDate, excludeId = null }) => {
  const filter = {
    teacherId,
    status: { $in: ['pending', 'approved'] },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };
  if (excludeId) filter._id = { $ne: excludeId };
  return LeaveRequest.find(filter);
};

export default { findAll, findById, create, updateById, deleteById, findOverlappingActive };