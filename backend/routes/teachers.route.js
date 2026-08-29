// routes/teacherRoutes.js
import express from 'express';
import { 
  getAllTeachers, 
  getTeacherById, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher ,

  uploadMiddleware,
  uploadTeachersFromExcel

} from '../controllers/teachers.controller.js';

const router = express.Router();

// GET /api/teachers - Get all teachers
router.get('/', getAllTeachers);

// POST /api/teachers/upload-excel - Bulk upload teachers from an .xlsx file
// Registered before the '/:id' routes purely for readability; Express
// dispatches by HTTP method first, so a GET '/:id' below never intercepts
// this POST route regardless of order.
router.post('/upload-excel', uploadMiddleware, uploadTeachersFromExcel);

// GET /api/teachers/:id - Get teacher by ID
router.get('/:id', getTeacherById);

// POST /api/teachers - Create new teacher
router.post('/', createTeacher);

// PUT /api/teachers/:id - Update teacher
router.put('/:id', updateTeacher);

// DELETE /api/teachers/:id - Delete teacher
router.delete('/:id', deleteTeacher);




export default router;