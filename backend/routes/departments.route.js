

// import express from 'express';
// import {
//   getAllDepartments,
//   getDepartmentById,
//   createDepartment,
//   updateDepartment,
//   deleteDepartment,
//   getActiveDepartments,
//   getDepartmentStats,addDepartment, getDepartments
// } from '../controllers/departments.controller.js';

// import { auth, authorize } from '../middleware/auth.middleware.js';
// import { validateDepartment, validateDepartmentUpdate } from '../middleware/validation.middleware.js';

// const router = express.Router();

// // Protected routes (authentication required)
// router.use(auth); // Apply authentication to all routes

// // GET routes
// router.get('/', getAllDepartments); // Get all departments with filters and pagination
// router.get('/active', getActiveDepartments); // Get active departments
// router.get('/stats', authorize('admin'), getDepartmentStats); // Get department statistics
// router.get('/:id', getDepartmentById); // Get department by ID

// // POST routes
// router.post('/', authorize('admin'), validateDepartment, createDepartment); // Create new department

// // PUT routes
// router.put('/:id', authorize('admin'), validateDepartmentUpdate, updateDepartment); // Update department

// // DELETE routes
// router.delete('/:id', authorize('admin'), deleteDepartment); // Delete department (soft delete)

// // Route to add a new department
// router.post('/', addDepartment);
// // Route to get departments for AJAX
// router.get('/:id', getDepartments);

// export default router;

// // routes/departments.route.js

// import express from 'express';
// import {
//   getAllDepartments,
//   getDepartmentById,
//   createDepartment,
//   updateDepartment,
//   deleteDepartment,
//   getActiveDepartments,
//   getDepartmentStats,
//   addDepartment,
//   getDepartments
// } from '../controllers/departments.controller.js';

// //import { auth, } from '../middleware/auth.middleware.js';

// //import { validateDepartment, validateDepartmentUpdate } from '../middleware/validation.middleware.js';

// const router = express.Router();
// router.get('/test', (req, res) => {
//   console.log('TEST_ROUTE: /test called');
//   res.json({ message: 'Test route works' });
// });

// // Protected routes (authentication required)
// //router.use(auth); // Apply authentication to all routes

// // GET routes
// // console.log("TEST_2: /departments route matched");
// // router.get('/', getAllDepartments); // Get all departments with filters and pagination
// router.get('/', (req, res, next) => {
//   console.log("TEST_2: GET /departments route called");
//   next();
// }, getAllDepartments);

// router.get('/active', getActiveDepartments); // Get active departments
// //router.get('/stats', auth('admin'), getDepartmentStats); // Get department statistics
// router.get('/:id', getDepartmentById); // Get department by ID

// // POST route to create a department
// //router.post('/', auth('admin'),  createDepartment); // Create new department

// // Additional POST route to add department (if different logic is required)
// //router.post('/add', auth('admin'), addDepartment); // Add department via separate logic

// // PUT route
// //router.put('/:id', auth('admin'), updateDepartment); // Update department

// // DELETE route
// //router.delete('/:id', auth('admin'), deleteDepartment); // Delete department (soft delete)

// // Route to get departments for AJAX or frontend
// router.get('/ajax/:id', getDepartments); // Avoid conflict by changing route path

// export default router;


import express from 'express';
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getActiveDepartments,
  getDepartmentStats,
  getDepartments
} from '../controllers/departments.controller.js';

const router = express.Router();

// TEST route
router.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// GET all departments
router.get('/', getAllDepartments);

// GET all active
router.get('/active', getActiveDepartments);

// GET stats
router.get('/stats', getDepartmentStats);

// GET by ID
router.get('/:id', getDepartmentById);

// GET AJAX-style
router.get('/ajax/:id', getDepartments);

// CREATE department
router.post('/', createDepartment);

// UPDATE department
router.put('/:id', updateDepartment);

// DELETE (soft)
router.delete('/:id', deleteDepartment);

export default router;
