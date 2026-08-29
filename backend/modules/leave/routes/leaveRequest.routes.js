import express from 'express';
import {
  listLeaveRequests,
  getLeaveRequestById,
  createLeaveRequest,
  updateLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  cancelLeaveRequest,
  deleteLeaveRequest,
} from '../controller/leaveRequest.controller.js';

const router = express.Router();

router.get('/', listLeaveRequests);
router.get('/:id', getLeaveRequestById);
router.post('/', createLeaveRequest);
router.put('/:id', updateLeaveRequest);
router.post('/:id/approve', approveLeaveRequest);
router.post('/:id/reject', rejectLeaveRequest);
router.post('/:id/cancel', cancelLeaveRequest);
router.delete('/:id', deleteLeaveRequest);

export default router;