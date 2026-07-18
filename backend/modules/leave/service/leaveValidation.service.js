// backend/modules/leave/service/leaveValidation.service.js
//
// Standalone validation for leave requests: invalid dates, duplicate
// requests, and overlapping leave. Only ever queries LeaveRequest.

import ApiError from '../../../utils/ApiError.js';
import leaveRequestRepository from '../repository/leaveRequest.repository.js';

export const checkValidDateRange = ({ startDate, endDate, dayType }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const conflicts = [];

  if (end < start) {
    conflicts.push({ type: 'INVALID_DATE_RANGE', message: 'endDate cannot be before startDate' });
  }
  if (dayType === 'half_day' && start.toDateString() !== end.toDateString()) {
    conflicts.push({
      type: 'INVALID_DATE_RANGE',
      message: 'A half-day leave must have the same startDate and endDate',
    });
  }
  return conflicts;
};

export const checkOverlappingLeave = async ({ teacherId, startDate, endDate, excludeId = null }) => {
  const overlapping = await leaveRequestRepository.findOverlappingActive({
    teacherId,
    startDate,
    endDate,
    excludeId,
  });
  return overlapping.map((entry) => ({
    type: 'OVERLAPPING_LEAVE',
    conflictingLeaveRequestId: String(entry._id),
    startDate: entry.startDate,
    endDate: entry.endDate,
  }));
};

// A "duplicate" is an identical (teacherId, leaveType, startDate, endDate)
// active request already on file — distinct from a partial overlap,
// which checkOverlappingLeave already catches.
export const checkDuplicateLeaveRequest = async ({
  teacherId,
  leaveType,
  startDate,
  endDate,
  excludeId = null,
}) => {
  const overlapping = await leaveRequestRepository.findOverlappingActive({
    teacherId,
    startDate,
    endDate,
    excludeId,
  });
  const duplicate = overlapping.find(
    (entry) =>
      entry.leaveType === leaveType &&
      new Date(entry.startDate).toDateString() === new Date(startDate).toDateString() &&
      new Date(entry.endDate).toDateString() === new Date(endDate).toDateString()
  );
  return duplicate
    ? [{ type: 'DUPLICATE_LEAVE_REQUEST', conflictingLeaveRequestId: String(duplicate._id) }]
    : [];
};

export const validateLeaveRequest = async ({
  teacherId,
  leaveType,
  startDate,
  endDate,
  dayType,
  excludeId = null,
}) => {
  const dateConflicts = checkValidDateRange({ startDate, endDate, dayType });
  const [duplicateConflicts, overlapConflicts] = await Promise.all([
    checkDuplicateLeaveRequest({ teacherId, leaveType, startDate, endDate, excludeId }),
    checkOverlappingLeave({ teacherId, startDate, endDate, excludeId }),
  ]);

  const allConflicts = [...dateConflicts, ...duplicateConflicts, ...overlapConflicts];
  if (allConflicts.length) {
    throw new ApiError(409, 'Leave request validation failed', allConflicts);
  }
};

export default { checkValidDateRange, checkOverlappingLeave, checkDuplicateLeaveRequest, validateLeaveRequest };