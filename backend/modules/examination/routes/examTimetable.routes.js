import express from 'express';
import {
  listExamTimetables,
  getExamTimetableById,
  listExamTimetablesByExamId,
  createExamTimetable,
  updateExamTimetable,
  deleteExamTimetable,
} from '../controller/examTimetable.controller.js';

const router = express.Router();

router.get('/', listExamTimetables);
router.get('/by-exam/:examId', listExamTimetablesByExamId);
router.get('/:id', getExamTimetableById);
router.post('/', createExamTimetable);
router.put('/:id', updateExamTimetable);
router.delete('/:id', deleteExamTimetable);

export default router;