// import express from 'express';
// import {
//   getAllSubjects,
//   getSubjectById,
//   createSubject,
//   updateSubject,
//   deleteSubject,
//   getSubjectsByDepartment,
//   getSubjectsBySemester,
//   getSubjectsByTeacher,
//   getSubjectStats
// } from '../controllers/subjects.controller.js';
// import { auth } from '../middleware/auth.middleware.js';
// //import { validateSubject, validateSubjectUpdate } from '../middleware/validation.middleware.js';

// const router = express.Router();

// // Public routes (with authentication)
// router.use(auth); // Apply authentication to all routes

// // GET routes
// router.get('/', getAllSubjects); // Get all subjects with filters and pagination
// router.get('/stats', auth('admin'), getSubjectStats); // Get subject statistics
// router.get('/department/:departmentId', getSubjectsByDepartment); // Get subjects by department
// router.get('/semester/:semesterId', getSubjectsBySemester); // Get subjects by semester
// router.get('/teacher/:teacherId', getSubjectsByTeacher); // Get subjects by teacher
// router.get('/:id', getSubjectById); // Get subject by ID

// // POST routes
// router.post('/', authorize('admin'), validateSubject, createSubject); // Create new subject

// // PUT routes
// router.put('/:id', authorize('admin'), validateSubjectUpdate, updateSubject); // Update subject

// // DELETE routes
// router.delete('/:id', authorize('admin'), deleteSubject); // Delete subject (soft delete)

// export default router;


// import express from 'express';
// import {
//   getAllSubjects,
//   getSubjectById,
//   createSubject,
//   updateSubject,
//   deleteSubject,
//   getSubjectsByDepartment,
//   getSubjectsBySemester,
//   getSubjectsByTeacher,
//   getSubjectStats
// } from '../controllers/subjects.controller.js';

// const router = express.Router();

// // GET routes
// router.get('/', getAllSubjects);
// router.get('/stats', getSubjectStats);
// router.get('/department/:departmentId', getSubjectsByDepartment);
// router.get('/semester/:semesterId', getSubjectsBySemester);
// router.get('/teacher/:teacherId', getSubjectsByTeacher);
// router.get('/:id', getSubjectById);

// // POST routes
// router.post('/', createSubject);

// // PUT routes
// router.put('/:id', updateSubject);

// // DELETE routes
// router.delete('/:id', deleteSubject);

// export default router;


import express from 'express';
import {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  getSubjectStats
} from '../controllers/subjects.controller.js';

const router = express.Router();

router.post('/', createSubject);
router.get('/', getAllSubjects);
router.get('/stats', getSubjectStats);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
