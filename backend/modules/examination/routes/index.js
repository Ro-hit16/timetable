// backend/modules/examination/routes/index.js
//
// Aggregates every route sub-router in the examination module. Mounted
// in server.js under /api/examination.

import express from 'express';
import examRoutes from './exam.routes.js';
import examTimetableRoutes from './examTimetable.routes.js';

const router = express.Router();

router.use('/exams', examRoutes);
router.use('/exam-timetables', examTimetableRoutes);

export default router;