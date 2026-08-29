import express from 'express';
import {
  listExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
} from '../controller/exam.controller.js';

const router = express.Router();

router.get('/', listExams);
router.get('/:id', getExamById);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;