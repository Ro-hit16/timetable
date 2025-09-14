// // routes/teacherRoutes.js
// import express from 'express';
// import {
//   getAllTeachers,
//   getTeacherById,
//   createTeacher,
//   updateTeacher,
//   deleteTeacher,
//   getTeachersByDepartment,
//   getActiveTeachers,
//   loginTeacher,
//   getTeacherStats
// } from '../controllers/teachers.controller.js';
// import { auth,  } from '../middleware/auth.middleware.js';
// import { validateTeacher, validateTeacherUpdate, validateLogin } from '../middleware/validation.middleware.js';

// const router = express.Router();

// // Public route: Teacher login (no authentication required)
// router.post('/login', validateLogin, loginTeacher);

// // Apply authentication middleware to all routes below this line
// router.use(auth);

// // Get all teachers with optional filters and pagination
// router.get('/', getAllTeachers);

// // Get all active teachers
// router.get('/active', getActiveTeachers);

// // Get teacher statistics (admin only)
// router.get('/stats', authorize('admin'), getTeacherStats);

// // Get teachers by department
// router.get('/department/:departmentId', getTeachersByDepartment);

// // Get single teacher by ID
// router.get('/:id', getTeacherById);

// // Create new teacher (admin only)
// router.post('/', authorize('admin'), validateTeacher, createTeacher);

// // Update teacher (admin or teacher themselves)
// router.put('/:id', authorize('admin', 'teacher'), validateTeacherUpdate, updateTeacher);

// // Delete teacher (soft delete) (admin only)
// router.delete('/:id', authorize('admin'), deleteTeacher);

// export default router;


// import express from 'express';
// import {
//   getAllTeachers,
//   getTeacherById,
//   createTeacher,
//   updateTeacher,
//   deleteTeacher,
//   getTeachersByDepartment,
//   getActiveTeachers,
//   loginTeacher,
//   getTeacherStats
// } from '../controllers/teachers.controller.js';

// const router = express.Router();

// // Public route: Teacher login
// router.post('/login', loginTeacher);

// // Get all teachers
// router.get('/', getAllTeachers);

// // Get all active teachers
// router.get('/active', getActiveTeachers);

// // Get teacher statistics
// router.get('/stats', getTeacherStats);

// // Get teachers by department
// router.get('/department/:departmentId', getTeachersByDepartment);

// // Get single teacher by ID
// router.get('/:id', getTeacherById);

// // Create new teacher
// router.post('/', createTeacher);

// // Update teacher
// router.put('/:id', updateTeacher);

// // Delete teacher
// router.delete('/:id', deleteTeacher);

// export default router;



// routes/teacherRoutes.js
import express from 'express';
import { 
  getAllTeachers, 
  getTeacherById, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher ,
  uploadTeachersFromPdf,
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

router.post('/upload-pdf', uploadMiddleware, uploadTeachersFromPdf);


export default router;

