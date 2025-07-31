// import { body, validationResult } from 'express-validator';
// import Joi from 'joi';
// import { createError } from '../utils/error.js';
// import ApiError from '../utils/ApiError.js';

// // ---------- Common Express-Validator Error Handler ----------
// export const handleValidationErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const errorMessages = errors.array().map(error => error.msg).join(', ');
//     return next(createError(400, errorMessages));
//   }
//   next();
// };

// // ---------- Express-Validator Based Validations ----------
// export const validateLogin = [
//   body('e').notEmpty().withMessage('Username is required')
//     .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long').trim(),
//   body('p').notEmpty().withMessage('Password is required')
//     .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//   handleValidationErrors
// ];

// export const validateRegister = [
//   body('name').notEmpty().withMessage('Name is required').trim().isLength({ min: 2 }),
//   body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
//   body('password').notEmpty().withMessage('Password is required')
//     .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
//     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
//     .withMessage('Password must contain uppercase, lowercase, and a number'),
//   handleValidationErrors
// ];

// export const validateChangePassword = [
//   body('oldPassword').notEmpty().withMessage('Old password is required'),
//   body('newPassword').notEmpty().withMessage('New password is required')
//     .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
//     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
//     .withMessage('New password must contain uppercase, lowercase, and a number'),
//   handleValidationErrors
// ];

// export const validateCourse = [
//   body('course_name').notEmpty().withMessage('Course name is required')
//     .isLength({ min: 2 }).withMessage('Course name must be at least 2 characters long').trim(),
//   body('course_code').notEmpty().withMessage('Course code is required')
//     .isLength({ min: 2, max: 10 }).withMessage('Course code must be between 2-10 characters').trim(),
//   handleValidationErrors
// ];

// export const validateSemester = [
//   body('semester_name').notEmpty().withMessage('Semester name is required').trim(),
//   body('course_id').notEmpty().withMessage('Course ID is required')
//     .isMongoId().withMessage('Invalid course ID'),
//   handleValidationErrors
// ];

// export const validateSubject = [
//   body('subject_name').notEmpty().withMessage('Subject name is required')
//     .isLength({ min: 2 }).withMessage('Subject name must be at least 2 characters long').trim(),
//   body('subject_code').notEmpty().withMessage('Subject code is required')
//     .isLength({ min: 2, max: 10 }).withMessage('Subject code must be between 2-10 characters').trim(),
//   body('semester_id').notEmpty().withMessage('Semester ID is required')
//     .isMongoId().withMessage('Invalid semester ID'),
//   handleValidationErrors
// ];

// export const validateStudent = [
//   body('student_name').notEmpty().withMessage('Student name is required')
//     .isLength({ min: 2 }).withMessage('Student name must be at least 2 characters long').trim(),
//   body('student_email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
//   body('student_phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
//   body('semester_id').notEmpty().withMessage('Semester ID is required')
//     .isMongoId().withMessage('Invalid semester ID'),
//   handleValidationErrors
// ];

// // ---------- Joi-Based Validations ----------
// const teacherCreateSchema = Joi.object({
//   name: Joi.string().trim().min(2).max(100).required()
//     .messages({ 'string.empty': 'Teacher name is required', 'string.min': 'Teacher name must be at least 2 characters', 'string.max': 'Teacher name cannot exceed 100 characters' }),
//   email: Joi.string().email().lowercase().required()
//     .messages({ 'string.email': 'Please provide a valid email address', 'string.empty': 'Email is required' }),
//   password: Joi.string().min(6).max(20).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/).required()
//     .messages({ 'string.min': 'Password must be at least 6 characters', 'string.max': 'Password cannot exceed 20 characters', 'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number', 'string.empty': 'Password is required' }),
//   mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
//     .messages({ 'string.pattern.base': 'Mobile number must be exactly 10 digits', 'string.empty': 'Mobile number is required' }),
//   address: Joi.string().trim().min(10).max(200).required()
//     .messages({ 'string.min': 'Address must be at least 10 characters', 'string.max': 'Address cannot exceed 200 characters', 'string.empty': 'Address is required' }),
//   departmentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
//     .messages({ 'string.pattern.base': 'Invalid department ID format', 'string.empty': 'Department selection is required' })
// });

// const teacherUpdateSchema = Joi.object({
//   name: Joi.string().trim().min(2).max(100).optional()
//     .messages({ 'string.min': 'Teacher name must be at least 2 characters', 'string.max': 'Teacher name cannot exceed 100 characters' }),
//   email: Joi.string().email().lowercase().optional()
//     .messages({ 'string.email': 'Please provide a valid email address' }),
//   password: Joi.string().min(6).max(20).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/).optional()
//     .messages({ 'string.min': 'Password must be at least 6 characters', 'string.max': 'Password cannot exceed 20 characters', 'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number' }),
//   mobile: Joi.string().pattern(/^[0-9]{10}$/).optional()
//     .messages({ 'string.pattern.base': 'Mobile number must be exactly 10 digits' }),
//   address: Joi.string().trim().min(10).max(200).optional()
//     .messages({ 'string.min': 'Address must be at least 10 characters', 'string.max': 'Address cannot exceed 200 characters' }),
//   departmentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
//     .messages({ 'string.pattern.base': 'Invalid department ID format' })
// });

// export const validateTeacher = (req, res, next) => {
//   const { error } = teacherCreateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
//   if (error) {
//     const errorMessages = error.details.map(detail => detail.message);
//     throw new ApiError(400, 'Validation failed', errorMessages);
//   }
//   next();
// };

// export const validateTeacherUpdate = (req, res, next) => {
//   const { error } = teacherUpdateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
//   if (error) {
//     const errorMessages = error.details.map(detail => detail.message);
//     throw new ApiError(400, 'Validation failed', errorMessages);
//   }
//   if (Object.keys(req.body).length === 0) {
//     throw new ApiError(400, 'At least one field is required for update');
//   }
//   next();
// };

// export const validateDepartment = (req, res, next) => {
//   const schema = Joi.object({
//     name: Joi.string().trim().min(2).max(100).required()
//       .messages({ 'string.empty': 'Department name is required', 'string.min': 'Department name must be at least 2 characters', 'string.max': 'Department name cannot exceed 100 characters' }),
//     code: Joi.string().trim().min(2).max(10).uppercase().required()
//       .messages({ 'string.empty': 'Department code is required', 'string.min': 'Department code must be at least 2 characters', 'string.max': 'Department code cannot exceed 10 characters' }),
//     description: Joi.string().trim().max(500).optional()
//       .messages({ 'string.max': 'Description cannot exceed 500 characters' })
//   });

//   const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
//   if (error) {
//     const errorMessages = error.details.map(detail => detail.message);
//     throw new ApiError(400, 'Validation failed', errorMessages);
//   }
//   next();
// };

import { body, validationResult } from 'express-validator';
import Joi from 'joi';
import { createError } from '../utils/error.js';
import ApiError from '../utils/ApiError.js';

// ---------- Common Express-Validator Error Handler ----------
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(createError(400, errorMessages));
  }
  next();
};

// ---------- Express-Validator Based Validations ----------
export const validateLogin = [
  body('user_name').notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long').trim(),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateRegister = [
  body('name').notEmpty().withMessage('Name is required').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('user_name').notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  handleValidationErrors
];

export const validateChangePassword = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword').notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain uppercase, lowercase, and a number'),
  handleValidationErrors
];

export const validateCourse = [
  body('course_name').notEmpty().withMessage('Course name is required')
    .isLength({ min: 2 }).withMessage('Course name must be at least 2 characters long').trim(),
  body('course_code').notEmpty().withMessage('Course code is required')
    .isLength({ min: 2, max: 10 }).withMessage('Course code must be between 2–10 characters').trim(),
  handleValidationErrors
];

export const validateSemester = [
  body('semester_name').notEmpty().withMessage('Semester name is required').trim(),
  body('course_id').notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid course ID'),
  handleValidationErrors
];

export const validateSubject = [
  body('subject_name').notEmpty().withMessage('Subject name is required')
    .isLength({ min: 2 }).withMessage('Subject name must be at least 2 characters long').trim(),
  body('subject_code').notEmpty().withMessage('Subject code is required')
    .isLength({ min: 2, max: 10 }).withMessage('Subject code must be between 2–10 characters').trim(),
  body('semester_id').notEmpty().withMessage('Semester ID is required')
    .isMongoId().withMessage('Invalid semester ID'),
  handleValidationErrors
];

export const validateStudent = [
  body('student_name').notEmpty().withMessage('Student name is required')
    .isLength({ min: 2 }).withMessage('Student name must be at least 2 characters long').trim(),
  body('student_email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('student_phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('semester_id').notEmpty().withMessage('Semester ID is required')
    .isMongoId().withMessage('Invalid semester ID'),
  handleValidationErrors
];

// ---------- Joi-Based Validations ----------
const teacherCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(20)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/).required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  address: Joi.string().trim().min(10).max(200).required(),
  departmentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

const teacherUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().email().lowercase().optional(),
  password: Joi.string().min(6).max(20)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/).optional(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  address: Joi.string().trim().min(10).max(200).optional(),
  departmentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
});

export const validateTeacher = (req, res, next) => {
  const { error } = teacherCreateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    throw new ApiError(400, 'Validation failed', errorMessages);
  }
  next();
};

export const validateTeacherUpdate = (req, res, next) => {
  const { error } = teacherUpdateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    throw new ApiError(400, 'Validation failed', errorMessages);
  }
  if (Object.keys(req.body).length === 0) {
    throw new ApiError(400, 'At least one field is required for update');
  }
  next();
};

export const validateDepartment = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    code: Joi.string().trim().min(2).max(10).uppercase().required(),
    description: Joi.string().trim().max(500).optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    throw new ApiError(400, 'Validation failed', errorMessages);
  }
  next();
};


import mongoose from 'mongoose';

export function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: `Invalid ObjectId for ${paramName}` });
    }
    next();
  };
}

export function validateTimetable(req, res, next) {
  const {
    departmentId,
    semester,
    academicYear,
    divisions,
    subjects,
    teachers,
    classes
  } = req.body;

  if (
    !departmentId ||
    !semester ||
    !academicYear ||
    !Array.isArray(divisions) || divisions.length === 0 ||
    !Array.isArray(subjects) || subjects.length === 0 ||
    !Array.isArray(teachers) || teachers.length === 0 ||
    !Array.isArray(classes) || classes.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'All timetable fields (departmentId, semester, academicYear, divisions, subjects, teachers, classes) are required and must be valid arrays.'
    });
  }

  next();
}

export function validateStatusUpdate(req, res, next) {
  const { status } = req.body;

  if (!status || typeof status !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Status field is required and must be a string.',
    });
  }

  const validStatuses = ['pending', 'generated', 'published'];

  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${validStatuses.join(', ')}`,
    });
  }

  next();
}
