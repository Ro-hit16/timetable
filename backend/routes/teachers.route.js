
// routes/teacherRoutes.js
import express from 'express';
import { 
  getAllTeachers, 
  getTeacherById, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher ,

  uploadMiddleware

} from '../controllers/teachers.controller.js';

const router = express.Router();

// GET /api/teachers - Get all teachers
router.get('/', getAllTeachers);

// GET /api/teachers/:id - Get teacher by ID
router.get('/:id', getTeacherById);

// POST /api/teachers - Create new teacher
router.post('/', createTeacher);

// PUT /api/teachers/:id - Update teacher
router.put('/:id', updateTeacher);

// DELETE /api/teachers/:id - Delete teacher
router.delete('/:id', deleteTeacher);




export default router;

