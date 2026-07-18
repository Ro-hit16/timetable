// backend/modules/leave/service/leaveRequest.service.js
//
// CRUD + approval workflow for LeaveRequest. Status transitions are
// restricted to a small state machine so a request can't skip straight
// from 'rejected' to 'approved', etc.

import ApiError from '../../../utils/ApiError.js';
import leaveRequestRepository from '../repository/leaveRequest.repository.js';
import { validateLeaveRequest } from './leaveValidation.service.js';

const ALLOWED_TRANSITIONS = {
  pending: ['approved', 'rejected', 'cancelled'],
  approved: ['cancelled'],
  rejected: [],
  cancelled: [],
};

export const listLeaveRequests = async ({ teacherId, status, leaveType } = {}) => {
  const filter = {};
  if (teacherId) filter.teacherId = teacherId;
  if (status) filter.status = status;
  if (leaveType) filter.leaveType = leaveType;
  return leaveRequestRepository.findAll(filter);
};

export const getLeaveRequestById = async (id) => {
  const entry = await leaveRequestRepository.findById(id);
  if (!entry) throw new ApiError(404, `LeaveRequest ${id} not found`);
  return entry;
};

export const createLeaveRequest = async (data) => {
  // Ignore any client-supplied status — every leave request starts pending.
  const { status, ...rest } = data;

  await validateLeaveRequest({
    teacherId: rest.teacherId,
    leaveType: rest.leaveType,
    startDate: rest.startDate,
    endDate: rest.endDate,
    dayType: rest.dayType,
  });

  return leaveRequestRepository.create({
    ...rest,
    status: 'pending',
    approvalHistory: [{ status: 'pending', actedAt: new Date() }],
  });
};

export const updateLeaveRequest = async (id, data) => {
  const existing = await leaveRequestRepository.findById(id);
  if (!existing) throw new ApiError(404, `LeaveRequest ${id} not found`);

  if (existing.status !== 'pending') {
    throw new ApiError(409, `Cannot edit a leave request in '${existing.status}' status`);
  }

  await validateLeaveRequest({
    teacherId: data.teacherId ?? existing.teacherId,
    leaveType: data.leaveType ?? existing.leaveType,
    startDate: data.startDate ?? existing.startDate,
    endDate: data.endDate ?? existing.endDate,
    dayType: data.dayType ?? existing.dayType,
    excludeId: id,
  });

  return leaveRequestRepository.updateById(id, data);
};

const applyTransition = async (id, targetStatus, { actedBy = null, remarks = '' } = {}) => {
  const existing = await leaveRequestRepository.findById(id);
  if (!existing) throw new ApiError(404, `LeaveRequest ${id} not found`);

  const allowed = ALLOWED_TRANSITIONS[existing.status] || [];
  if (!allowed.includes(targetStatus)) {
    throw new ApiError(409, `Cannot move a leave request from '${existing.status}' to '${targetStatus}'`);
  }

  existing.status = targetStatus;
  existing.approvalHistory.push({ status: targetStatus, actedBy, remarks, actedAt: new Date() });
  return existing.save();
};

export const approveLeaveRequest = (id, actionData) => applyTransition(id, 'approved', actionData);
export const rejectLeaveRequest = (id, actionData) => applyTransition(id, 'rejected', actionData);
export const cancelLeaveRequest = (id, actionData) => applyTransition(id, 'cancelled', actionData);

export const deleteLeaveRequest = async (id) => {
  const deleted = await leaveRequestRepository.deleteById(id);
  if (!deleted) throw new ApiError(404, `LeaveRequest ${id} not found`);
  return deleted;
};

export default {
  listLeaveRequests,
  getLeaveRequestById,
  createLeaveRequest,
  updateLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  cancelLeaveRequest,
  deleteLeaveRequest,
};