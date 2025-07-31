// // // routes/courseRoutes.js
// // import express from 'express';
// // import { getCourses, deleteCourse } from '../controllers/courseController.js';

// // const router = express.Router();

// // // GET /api/courses - Get all courses
// // router.get('/', getCourses);

// // // DELETE /api/courses/:id - Delete course
// // router.delete('/:id', deleteCourse);

// // export default router;

// import express from 'express';
// import {
//   getAllCourses,
//   getCourse,
//   createCourse,
//   updateCourse,
//   deleteCourse,
//   getCourseStats
// } from '../controllers/courses.controller.js';
// import { protect } from '../middleware/auth.middleware.js';
// //import { validateCourse } from '../middleware/validation.middleware.js';

// const router = express.Router();

// // Protect all routes
// router.use(protect);

// // Course statistics (admin only)
// router.get('/stats', restrictTo('admin'), getCourseStats);

// // CRUD routes
// router
//   .route('/')
//   .get(getAllCourses)
//   .post(restrictTo('admin'), validateCourse, createCourse);

// router
//   .route('/:id')
//   .get(getCourse)
//   .patch(restrictTo('admin'), validateCourse, updateCourse)
//   .delete(restrictTo('admin'), deleteCourse);

// export default router;


// import express from 'express';
// import {
//   getAllCourses,
//   getCourse,
//   createCourse,
//   updateCourse,
//   deleteCourse,
//   getCourseStats
// } from '../controllers/courses.controller.js';

// const router = express.Router();

// // Course statistics route
// router.get('/stats', getCourseStats);

// // CRUD routes
// router
//   .route('/')
//   .get(getAllCourses)
//   .post(createCourse);

// router
//   .route('/:id')
//   .get(getCourse)
//   .patch(updateCourse)
//   .delete(deleteCourse);

// export default router;

import express from 'express';
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  getCoursesByDepartment
} from '../controllers/courses.controller.js';

const router = express.Router();

// Course statistics route
router.get('/stats', getCourseStats);

// Get courses by department
router.get('/department/:departmentId', getCoursesByDepartment);

// CRUD routes
router
  .route('/')
  .get(getAllCourses)
  .post(createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(updateCourse)  // Changed from PATCH to PUT for consistency
  .delete(deleteCourse);

export default router;
