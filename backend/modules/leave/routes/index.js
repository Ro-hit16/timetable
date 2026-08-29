// backend/modules/leave/routes/index.js
//
// Aggregates every route sub-router in the leave module. Mounted in
// server.js under /api/leave.

import express from 'express';
import leaveRequestRoutes from './leaveRequest.routes.js';
import substituteTeacherRoutes from './substituteTeacher.routes.js';

const router = express.Router();

router.use('/requests', leaveRequestRoutes);
router.use('/substitutes', substituteTeacherRoutes);

export default router;