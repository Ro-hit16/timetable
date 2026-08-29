

import express from 'express';
//import TimetableController from '../controllers/timetable.controller.js';
import TimetableController from '../controllers/timetables.controller.js';
const router = express.Router();

router.post('/generate', TimetableController.generateTimetable);
router.get('/department/:departmentId', TimetableController.getTimetables);
router.get('/:id', TimetableController.getTimetableById);
router.patch('/:id/status', TimetableController.updateStatus);
router.delete('/:id', TimetableController.deleteTimetable);
router.get('/:id/statistics', TimetableController.getStatistics);
router.get('/:id/export', TimetableController.exportTimetable);
//router.post('/department-generate', TimetableController.generateDepartmentTimetable);



export default router;