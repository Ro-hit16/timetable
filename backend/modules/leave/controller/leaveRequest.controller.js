// backend/modules/leave/controller/leaveRequest.controller.js
//
// Thin controller: validate -> service -> respond.

import asyncHandler from '../../../utils/async-handler.js';
import { sendResponse } from '../../../utils/response.js';
import ApiError from '../../../utils/ApiError.js';
import leaveRequestService from '../service/leaveRequest.service.js';
import {
  validateCreateLeaveRequest,
  validateUpdateLeaveRequest,
  validateLeaveAction,
} from '../validator/leaveRequest.validator.js';

export const listLeaveRequests = asyncHandler(async (req, res) => {
  const { teacherId, status, leaveType } = req.query;
  const entries = await leaveRequestService.listLeaveRequests({ teacherId, status, leaveType });
  return sendResponse(res, 200, true, 'Leave requests fetched', entries);
});

export const getLeaveRequestById = asyncHandler(async (req, res) => {
  const entry = await leaveRequestService.getLeaveRequestById(req.params.id);
  return sendResponse(res, 200, true, 'Leave request fetched', entry);
});

export const createLeaveRequest = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateLeaveRequest(req.body);
  if (error) throw new ApiError(400, 'Invalid LeaveRequest payload', error.details);
  const created = await leaveRequestService.createLeaveRequest(value);
  return sendResponse(res, 201, true, 'Leave request created', created);
});

export const updateLeaveRequest = asyncHandler(async (req, res) => {
  const { error, value } = validateUpdateLeaveRequest(req.body);
  if (error) throw new ApiError(400, 'Invalid LeaveRequest payload', error.details);
  const updated = await leaveRequestService.updateLeaveRequest(req.params.id, value);
  return sendResponse(res, 200, true, 'Leave request updated', updated);
});

const runAction = (actionFn, successMessage) =>
  asyncHandler(async (req, res) => {
    const { error, value } = validateLeaveAction(req.body);
    if (error) throw new ApiError(400, 'Invalid action payload', error.details);
    const updated = await actionFn(req.params.id, value);
    return sendResponse(res, 200, true, successMessage, updated);
  });

export const approveLeaveRequest = runAction(leaveRequestService.approveLeaveRequest, 'Leave request approved');
export const rejectLeaveRequest = runAction(leaveRequestService.rejectLeaveRequest, 'Leave request rejected');
export const cancelLeaveRequest = runAction(leaveRequestService.cancelLeaveRequest, 'Leave request cancelled');

export const deleteLeaveRequest = asyncHandler(async (req, res) => {
  await leaveRequestService.deleteLeaveRequest(req.params.id);
  return sendResponse(res, 200, true, 'Leave request deleted', null);
});

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