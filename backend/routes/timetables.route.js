// import express from 'express';
// import { generateTimetable ,  getDepartments,
//   getSemestersByDepartment,
//   getSubjectsBySemester,deleteTimeschedule} from '../controllers/timetables.controller.js';

// const router = express.Router();

// // Route to generate timetable
// router.get('/generate', generateTimetable);
// router.get('/departments', getDepartments);
// router.get('/semesters/:departmentId', getSemestersByDepartment);
// router.get('/subjects/:semesterId', getSubjectsBySemester);
// router.delete('/:id', deleteTimeschedule);
// export default router;



// import express from 'express';
// import {
//   getAllTimetables,             // ✅ added
//   generateTimetable,
//   getDepartments,
//   getSemestersByDepartment,
//   getSubjectsBySemester,
//   deleteTimeschedule
// } from '../controllers/timetables.controller.js';

// const router = express.Router();

// // ✅ GET /api/timetables
// router.get('/', getAllTimetables);

// router.get('/generate', generateTimetable);
// router.get('/departments', getDepartments);
// router.get('/semesters/:departmentId', getSemestersByDepartment);
// router.get('/subjects/:semesterId', getSubjectsBySemester);
// router.delete('/:id', deleteTimeschedule);

// export default router;



// import express from 'express';
// import {
//   getAllTimetables,
//   getTimetableById,
//   createTimetable,
//   updateTimetable,
//   deleteTimetable,
//   generateTimetable,
//   getTimetablesByDepartment,
//   getDepartments,
//   getSemestersByDepartment,
//   getSubjectsBySemester,
//   checkConflicts
// } from '../controllers/timetables.controller.js';

// const router = express.Router();

// // Main CRUD routes
// router.get('/', getAllTimetables);
// router.get('/:id', getTimetableById);
// router.post('/', createTimetable);
// router.put('/:id', updateTimetable);
// router.delete('/:id', deleteTimetable);

// // Timetable generation
// router.post('/generate', generateTimetable);

// // Department-specific routes
// router.get('/department/:department_id', getTimetablesByDepartment);

// // Dropdown data routes
// router.get('/data/departments', getDepartments);
// router.get('/data/semesters/:department_id', getSemestersByDepartment);
// router.get('/data/subjects/:sem_id', getSubjectsBySemester);

// // Conflict checking
// router.post('/check-conflicts', checkConflicts);

// export default router;


// import express from 'express';
// import {
//   getAllTimetables,
//   getTimetableById,
//   createTimetable,
//   updateTimetable,
//   deleteTimetable,
//   generateTimetable,
//   getTimetablesByDepartment,
//   getDepartments,
//   getSemestersByDepartment,
//   getSubjectsBySemester,
//   getTeachers,
//   checkConflicts,
//   exportTimetable,
//   searchTimetables,
//   getAvailableTimeSlots,
//   validateTimetableData
// } from '../controllers/timetables.controller.js';

// const router = express.Router();

// // Time slot configuration
// export const TIME_SLOTS = [
//   { id: 1, start: '10:30', end: '11:30', type: 'lecture' },
//   { id: 2, start: '11:30', end: '12:30', type: 'lecture' },
//   { id: 3, start: '12:30', end: '13:15', type: 'break', name: 'Lunch Break' },
//   { id: 4, start: '13:15', end: '14:15', type: 'lecture' },
//   { id: 5, start: '14:15', end: '15:15', type: 'lecture' },
//   { id: 6, start: '15:15', end: '15:30', type: 'break', name: 'Tea Break' },
//   { id: 7, start: '15:30', end: '16:30', type: 'lecture' },
//   { id: 8, start: '16:30', end: '17:30', type: 'lecture' }
// ];

// export const LAB_SLOTS = [
//   { id: 1, start: '10:30', end: '12:30', type: 'lab' }, // 2-hour slot
//   { id: 2, start: '13:15', end: '15:15', type: 'lab' }, // 2-hour slot
//   { id: 3, start: '15:30', end: '17:30', type: 'lab' }  // 2-hour slot
// ];

// export const DAYS_OF_WEEK = [
//   'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
// ];

// // Main CRUD routes
// router.get('/', getAllTimetables);
// router.get('/search', searchTimetables);
// router.get('/:id', getTimetableById);
// router.post('/', validateTimetableData, createTimetable);
// router.put('/:id', validateTimetableData, updateTimetable);
// router.delete('/:id', deleteTimetable);

// // Timetable generation and management
// router.post('/generate', generateTimetable);
// router.post('/validate', validateTimetableData);

// // Department and class specific routes
// router.get('/department/:department_id', getTimetablesByDepartment);
// router.get('/department/:department_id/semester/:sem_id', getTimetablesByDepartment);

// // Dropdown and reference data routes
// router.get('/data/departments', getDepartments);
// router.get('/data/semesters/:department_id', getSemestersByDepartment);
// router.get('/data/subjects/:sem_id', getSubjectsBySemester);
// router.get('/data/teachers', getTeachers);
// router.get('/data/timeslots', getAvailableTimeSlots);

// // Conflict checking and validation
// router.post('/check-conflicts', checkConflicts);
// router.post('/check-availability', checkConflicts);

// // Export functionality
// router.get('/:id/export', exportTimetable);
// router.get('/department/:department_id/export', exportTimetable);

// // Utility routes
// router.get('/utils/slots', (req, res) => {
//   res.json({
//     success: true,
//     data: {
//       timeSlots: TIME_SLOTS,
//       labSlots: LAB_SLOTS,
//       daysOfWeek: DAYS_OF_WEEK
//     }
//   });
// });

// export default router;




// import express from 'express';
// import {
//   getAllTimetables,
//   getTimetableById,
//   createTimetable,
//   updateTimetable,
//   deleteTimetable,
//   generateTimetable,
//   getTimetablesByDepartment,
//   getDepartments,
//   getSemestersByDepartment,
//   getSubjectsBySemester,
//   getTeachers,
//   getFormattedTimetable,
//   getAvailableTimeSlots,
//   validateTimetableData
// } from '../controllers/timetables.controller.js';

// const router = express.Router();

// export const TIME_SLOTS = [
//   { id: 1, start: '10:30', end: '11:30', type: 'lecture', label: '1st Period' },
//   { id: 2, start: '11:30', end: '12:30', type: 'lecture', label: '2nd Period' },
//   { id: 3, start: '12:30', end: '13:15', type: 'break', name: 'Lunch Break' },
//   { id: 4, start: '13:15', end: '14:15', type: 'lecture', label: '3rd Period' },
//   { id: 5, start: '14:15', end: '15:15', type: 'lecture', label: '4th Period' },
//   { id: 6, start: '15:15', end: '15:30', type: 'break', name: 'Tea Break' },
//   { id: 7, start: '15:30', end: '16:30', type: 'lecture', label: '5th Period' },
//   { id: 8, start: '16:30', end: '17:30', type: 'lecture', label: '6th Period' }
// ];

// export const LAB_SLOTS = [
//   { id: 1, start: '10:30', end: '12:30', type: 'lab', label: 'Lab Session 1' },
//   { id: 2, start: '13:15', end: '15:15', type: 'lab', label: 'Lab Session 2' },
//   { id: 3, start: '15:30', end: '17:30', type: 'lab', label: 'Lab Session 3' }
// ];

// export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// // Main CRUD routes
// router.get('/', getAllTimetables);
// router.get('/formatted', getFormattedTimetable);
// router.get('/:id', getTimetableById);
// router.post('/', validateTimetableData, createTimetable);
// router.put('/:id', validateTimetableData, updateTimetable);
// router.delete('/:id', deleteTimetable);

// // Timetable generation
// router.post('/generate', generateTimetable);

// // Department and class specific routes
// router.get('/department/:department_id', getTimetablesByDepartment);
// router.get('/department/:department_id/semester/:sem_id', getTimetablesByDepartment);

// // Dropdown data routes
// router.get('/data/departments', getDepartments);
// router.get('/data/semesters/:department_id', getSemestersByDepartment);
// router.get('/data/subjects/:sem_id', getSubjectsBySemester);
// router.get('/data/teachers', getTeachers);
// router.get('/data/timeslots', getAvailableTimeSlots);

// // Utility routes
// router.get('/utils/slots', (req, res) => {
//   res.json({
//     success: true,
//     data: {
//       timeSlots: TIME_SLOTS,
//       labSlots: LAB_SLOTS,
//       daysOfWeek: DAYS_OF_WEEK
//     }
//   });
// });

// export default router;



// // routes/timetable.routes.js
// import express from 'express';
// import { body, param, query } from 'express-validator';
// import TimetableController from '../controllers/timetables.controller.js';

// const router = express.Router();

// // Validation middleware
// const validateObjectId = (field) => [
//   param(field).isMongoId().withMessage(`Invalid ${field} format`)
// ];

// const validateTimetableGeneration = [
//   body('departmentId')
//     .isMongoId()
//     .withMessage('Invalid department ID format'),
//   body('semester')
//     .notEmpty()
//     .withMessage('Semester is required')
//     .isIn(['1', '2', '3', '4', '5', '6', '7', '8'])
//     .withMessage('Semester must be between 1 and 8'),
//   body('academicYear')
//     .notEmpty()
//     .withMessage('Academic year is required')
//     .matches(/^\d{4}-\d{4}$/)
//     .withMessage('Academic year must be in format YYYY-YYYY'),
//   body('divisions')
//     .optional()
//     .isArray()
//     .withMessage('Divisions must be an array')
//     .custom((divisions) => {
//       const validDivisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
//       const invalidDivisions = divisions.filter(div => !validDivisions.includes(div));
//       if (invalidDivisions.length > 0) {
//         throw new Error(`Invalid divisions: ${invalidDivisions.join(', ')}`);
//       }
//       return true;
//     })
// ];

// const validateStatusUpdate = [
//   body('status')
//     .notEmpty()
//     .withMessage('Status is required')
//     .isIn(['draft', 'published', 'archived'])
//     .withMessage('Status must be one of: draft, published, archived')
// ];

// const validateSlotAdjustment = [
//   body('day')
//     .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
//     .withMessage('Invalid day'),
//   body('period')
//     .isInt({ min: 1, max: 6 })
//     .withMessage('Period must be between 1 and 6'),
//   body('division')
//     .isIn(['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'])
//     .withMessage('Invalid division'),
//   body('action')
//     .isIn(['add', 'remove', 'modify'])
//     .withMessage('Action must be one of: add, remove, modify')
// ];

// // Routes

// /**
//  * @route   POST /api/timetables/generate
//  * @desc    Generate new timetable using genetic algorithm
//  * @access  Private
//  */
// router.post('/generate', validateTimetableGeneration, TimetableController.generateTimetable);

// /**
//  * @route   GET /api/timetables/:id
//  * @desc    Get timetable by ID
//  * @access  Private
//  * @query   formatted=true to get formatted timetable for frontend
//  */
// router.get('/:id', validateObjectId('id'), TimetableController.getTimetable);

// /**
//  * @route   GET /api/timetables/department/:departmentId
//  * @desc    Get all timetables for a department
//  * @access  Private
//  * @query   semester, academicYear for filtering
//  */
// router.get('/department/:departmentId', 
//   validateObjectId('departmentId'), 
//   TimetableController.getTimetables
// );

// /**
//  * @route   PATCH /api/timetables/:id/status
//  * @desc    Update timetable status
//  * @access  Private
//  */
// router.patch('/:id/status', 
//   validateObjectId('id'), 
//   validateStatusUpdate, 
//   TimetableController.updateTimetableStatus
// );

// /**
//  * @route   DELETE /api/timetables/:id
//  * @desc    Delete timetable
//  * @access  Private
//  */
// export default router;


// // routes/timetable.routes.js
// import express from 'express';
// import { body, param, query } from 'express-validator';
// import TimetableController from '../controllers/timetables.controller.js';

// const router = express.Router();

// // Validation middleware
// const validateObjectId = (field) => [
//   param(field).isMongoId().withMessage(`Invalid ${field} format`)
// ];

// const validateTimetableGeneration = [
//   body('departmentId')
//     .isMongoId()
//     .withMessage('Invalid department ID format'),
//   body('semester')
//     .notEmpty()
//     .withMessage('Semester is required')
//     .isIn(['1', '2', '3', '4', '5', '6', '7', '8'])
//     .withMessage('Semester must be between 1 and 8'),
//   body('academicYear')
//     .notEmpty()
//     .withMessage('Academic year is required')
//     .matches(/^\d{4}-\d{4}$/)
//     .withMessage('Academic year must be in format YYYY-YYYY'),
//   body('divisions')
//     .optional()
//     .isArray()
//     .withMessage('Divisions must be an array')
//     .custom((divisions) => {
//       const validDivisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
//       const invalidDivisions = divisions.filter(div => !validDivisions.includes(div));
//       if (invalidDivisions.length > 0) {
//         throw new Error(`Invalid divisions: ${invalidDivisions.join(', ')}`);
//       }
//       return true;
//     })
// ];

// const validateStatusUpdate = [
//   body('status')
//     .notEmpty()
//     .withMessage('Status is required')
//     .isIn(['draft', 'published', 'archived'])
//     .withMessage('Status must be one of: draft, published, archived')
// ];

// const validateSlotAdjustment = [
//   body('day')
//     .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
//     .withMessage('Invalid day'),
//   body('period')
//     .isInt({ min: 1, max: 6 })
//     .withMessage('Period must be between 1 and 6'),
//   body('division')
//     .isIn(['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'])
//     .withMessage('Invalid division'),
//   body('action')
//     .isIn(['add', 'remove', 'modify'])
//     .withMessage('Action must be one of: add, remove, modify')
// ];

// // Routes

// // router.post('/generate', validateTimetableGeneration, TimetableController.generateTimetable);

// router.post('/generate', validateTimetableGeneration, async (req, res) => {
//   console.log("🚀 Generate Timetable Request Body:", req.body);
  
// });

// router.get('/:id', validateObjectId('id'), TimetableController.getTimetable);

// // router.get('/department/:departmentId', 
// //   validateObjectId('departmentId'), 
// //   TimetableController.getTimetables
// // );



// router.patch('/:id/status', 
//   validateObjectId('id'), 
//   validateStatusUpdate, 
//   TimetableController.updateTimetableStatus
// );

// router.delete('/:id', 
//   validateObjectId('id'), 
//   TimetableController.deleteTimetable
// );

// router.get('/:id/validate', 
//   validateObjectId('id'), 
//   TimetableController.validateTimetable
// );

// router.get('/:id/export', 
//   validateObjectId('id'), 
//   TimetableController.exportTimetable
// );

// router.get('/teacher/:teacherId/:departmentId/:semester', 
//   [
//     param('teacherId').isMongoId().withMessage('Invalid teacher ID'),
//     param('departmentId').isMongoId().withMessage('Invalid department ID'),
//     param('semester').isIn(['1', '2', '3', '4', '5', '6', '7', '8']).withMessage('Invalid semester')
//   ],
//   TimetableController.getTeacherSchedule
// );

// router.get('/division-workload/:departmentId/:semester', 
//   [
//     param('departmentId').isMongoId().withMessage('Invalid department ID'),
//     param('semester').isIn(['1', '2', '3', '4', '5', '6', '7', '8']).withMessage('Invalid semester')
//   ],
//   TimetableController.getDivisionWorkload
// );

// router.get('/:id/statistics', 
//   validateObjectId('id'), 
//   TimetableController.getTimetableStatistics
// );

// router.get('/available-slots', 
//   [
//     query('departmentId').isMongoId().withMessage('Invalid department ID'),
//     query('semester').isIn(['1', '2', '3', '4', '5', '6', '7', '8']).withMessage('Invalid semester'),
//     query('day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).withMessage('Invalid day'),
//     query('period').isInt({ min: 1, max: 6 }).withMessage('Period must be between 1 and 6'),
//     query('division').isIn(['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']).withMessage('Invalid division')
//   ],
//   TimetableController.getAvailableSlots
// );

// router.patch('/:id/adjust-slot', 
//   validateObjectId('id'), 
//   validateSlotAdjustment, 
//   TimetableController.adjustTimetableSlot
// );

// router.post('/:id/clone', 
//   validateObjectId('id'),
//   [
//     body('newAcademicYear')
//       .optional()
//       .matches(/^\d{4}-\d{4}$/)
//       .withMessage('Academic year must be in format YYYY-YYYY'),
//     body('newSemester')
//       .optional()
//       .isIn(['1', '2', '3', '4', '5', '6', '7', '8'])
//       .withMessage('Semester must be between 1 and 8')
//   ],
//   TimetableController.cloneTimetable
// );

// export default router;



// // routes/timetable.routes.js
// import express from 'express';
// import { body, param, query } from 'express-validator';
// //import TimetableController from '../controllers/timetables.controller.js';
// import TimetableController from '../controllers/timetables.controller.js';
// const router = express.Router();

// // Validation middleware
// const validateObjectId = (field) => [
//   param(field).isMongoId().withMessage(`Invalid ${field} format`)
// ];

// const validateTimetableGeneration = [
//   body('departmentId')
//     .isMongoId()
//     .withMessage('Invalid department ID format'),
//   body('semester')
//     .notEmpty()
//     .withMessage('Semester is required')
//     .isIn(['1', '2', '3', '4', '5', '6', '7', '8'])
//     .withMessage('Semester must be between 1 and 8'),
//   body('academicYear')
//     .notEmpty()
//     .withMessage('Academic year is required')
//     .matches(/^\d{4}-\d{4}$/)
//     .withMessage('Academic year must be in format YYYY-YYYY'),
//   body('divisions')
//     .optional()
//     .isArray()
//     .withMessage('Divisions must be an array')
//     .custom((divisions) => {
//       const validDivisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
//       const invalidDivisions = divisions.filter(div => !validDivisions.includes(div));
//       if (invalidDivisions.length > 0) {
//         throw new Error(`Invalid divisions: ${invalidDivisions.join(', ')}`);
//       }
//       return true;
//     })
// ];

// const validateStatusUpdate = [
//   body('status')
//     .notEmpty()
//     .withMessage('Status is required')
//     .isIn(['draft', 'published', 'archived'])
//     .withMessage('Status must be one of: draft, published, archived')
// ];

// const validateSlotAdjustment = [
//   body('day')
//     .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
//     .withMessage('Invalid day'),
//   body('period')
//     .isInt({ min: 1, max: 6 })
//     .withMessage('Period must be between 1 and 6'),
//   body('division')
//     .isIn(['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'])
//     .withMessage('Invalid division'),
//   body('action')
//     .isIn(['add', 'remove', 'modify'])
//     .withMessage('Action must be one of: add, remove, modify')
// ];

// // Routes

// // router.post('/generate', validateTimetableGeneration, TimetableController.generateTimetable);

// router.post('/generate', validateTimetableGeneration, TimetableController.generateTimetable);


// router.get('/:id', validateObjectId('id'), TimetableController.getTimetable);

// router.get('/department/:departmentId', 
//   validateObjectId('departmentId'), 
//   TimetableController.getTimetables
// );



// router.patch('/:id/status', 
//   validateObjectId('id'), 
//   validateStatusUpdate, 
//   TimetableController.updateTimetableStatus
// );

// router.delete('/:id', 
//   validateObjectId('id'), 
//   TimetableController.deleteTimetable
// );

// router.get('/:id/validate', 
//   validateObjectId('id'), 
//   TimetableController.validateTimetable
// );

// router.get('/:id/export', 
//   validateObjectId('id'), 
//   TimetableController.exportTimetable
// );

// router.get('/teacher/:teacherId/:departmentId/:semester', 
//   [
//     param('teacherId').isMongoId().withMessage('Invalid teacher ID'),
//     param('departmentId').isMongoId().withMessage('Invalid department ID'),
//     param('semester').isIn(['1', '2', '3', '4', '5', '6', '7', '8']).withMessage('Invalid semester')
//   ],
//   TimetableController.getTeacherSchedule
// );

// router.get('/division-workload/:departmentId/:semester', 
//   [
//     param('departmentId').isMongoId().withMessage('Invalid department ID'),
//     param('semester').isIn(['1', '2', '3', '4', '5', '6', '7', '8']).withMessage('Invalid semester')
//   ],
//   TimetableController.getDivisionWorkload
// );

// router.get('/:id/statistics', 
//   validateObjectId('id'), 
//   TimetableController.getTimetableStatistics
// );

// router.get('/available-slots', 
//   [
//     query('departmentId').isMongoId().withMessage('Invalid department ID'),
//     query('semester').isIn(['1', '2', '3', '4', '5', '6', '7', '8']).withMessage('Invalid semester'),
//     query('day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).withMessage('Invalid day'),
//     query('period').isInt({ min: 1, max: 6 }).withMessage('Period must be between 1 and 6'),
//     query('division').isIn(['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']).withMessage('Invalid division')
//   ],
//   TimetableController.getAvailableSlots
// );

// router.patch('/:id/adjust-slot', 
//   validateObjectId('id'), 
//   validateSlotAdjustment, 
//   TimetableController.adjustTimetableSlot
// );

// router.post('/:id/clone', 
//   validateObjectId('id'),
//   [
//     body('newAcademicYear')
//       .optional()
//       .matches(/^\d{4}-\d{4}$/)
//       .withMessage('Academic year must be in format YYYY-YYYY'),
//     body('newSemester')
//       .optional()
//       .isIn(['1', '2', '3', '4', '5', '6', '7', '8'])
//       .withMessage('Semester must be between 1 and 8')
//   ],
//   TimetableController.cloneTimetable
// );

// export default router;


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

export default router;