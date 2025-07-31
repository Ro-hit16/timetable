// import express from 'express';
// import {
//   getAllSemesters,
//   getSemesterById,
//   createSemester,
//   updateSemester,
//   deleteSemester,
//   getSemestersByDepartment,
//   getActiveSemesters,
//   getSemesterStats,
 
// } from '../controllers/semesters.controller.js';
// import { auth,  } from '../middleware/auth.middleware.js';
// //import { validateSemester, validateSemesterUpdate } from '../middleware/validation.middleware.js';

// const router = express.Router();

// // Public routes (with authentication)
// router.use(auth); // Apply authentication to all routes

// // GET routes
// router.get('/', getAllSemesters); // Get all semesters with filters and pagination
// router.get('/active', getActiveSemesters); // Get active semesters
// router.get('/stats', authorize('admin'), getSemesterStats); // Get semester statistics
// router.get('/department/:departmentId', getSemestersByDepartment); // Get semesters by department
// router.get('/:id', getSemesterById); // Get semester by ID

// // POST routes
// router.post('/', authorize('admin'), validateSemester, createSemester); // Create new semester

// // PUT routes
// router.put('/:id', authorize('admin'), validateSemesterUpdate, updateSemester); // Update semester

// // DELETE routes
// router.delete('/:id', authorize('admin'), deleteSemester); // Delete semester (soft delete)

// router.post('/', addSemester);

// export default router;



import express from 'express';
import {
  getAllSemesters,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester,
  getSemestersByDepartment,
  getActiveSemesters,
  getSemesterStats,
  
} from '../controllers/semesters.controller.js';

const router = express.Router();

// GET routes
router.get('/', getAllSemesters); // Get all semesters
router.get('/active', getActiveSemesters); // Get active semesters
router.get('/stats', getSemesterStats); // Get semester statistics
router.get('/department/:departmentId', getSemestersByDepartment); // Get semesters by department
router.get('/:id', getSemesterById); // Get semester by ID

// POST routes
router.post('/', createSemester);
//router.post('/', addSemester); // Note: duplicate POST route, might cause issues

// PUT routes
router.put('/:id', updateSemester);

// DELETE routes
router.delete('/:id', deleteSemester);

export default router;
