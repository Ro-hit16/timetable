// // // controllers/courseController.js
// // import Course from '../models/Course.js';

// // // Get all courses
// // export const getCourses = async (req, res) => {
// //   try {
// //     const courses = await Course.find();
// //     res.json({ success: true, data: courses });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// // // Delete course


// // export const deleteCourse = async (req, res) => {
// //   try {
// //     const { course_id } = req.params;
// //     await Course.findByIdAndDelete(course_id);
// //     res.status(200).json({ message: 'Course deleted successfully' });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };


// import { Course } from '../models/course.model.js';
// import { createError } from '../utils/error.js';
// // import { asyncHandler } from '../utils/async-handler.js';
// import asyncHandler from '../utils/async-handler.js';
// import { APIFeatures } from '../utils/apiFeatures.js';
// import { sendResponse } from '../utils/response.js';

// export const getAllCourses = asyncHandler(async (req, res) => {
//   const features = new APIFeatures(Course.find({ isActive: true }), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate()
//     .search(['course_name', 'course_code']);

//   const courses = await features.query.populate('semesters');
//   const total = await Course.countDocuments({ isActive: true });

//   sendResponse(res, 200, true, 'Courses retrieved successfully', {
//     courses,
//     total,
//     page: req.query.page * 1 || 1,
//     limit: req.query.limit * 1 || 10
//   });
// });

// export const getCourse = asyncHandler(async (req, res, next) => {
//   const course = await Course.findById(req.params.id).populate('semesters');

//   if (!course || !course.isActive) {
//     return next(createError(404, 'Course not found'));
//   }

//   sendResponse(res, 200, true, 'Course retrieved successfully', { course });
// });

// export const createCourse = asyncHandler(async (req, res, next) => {
//   const { course_name, course_code, description, duration } = req.body;

//   // Check if course already exists
//   const existingCourse = await Course.findOne({
//     $or: [
//       { course_name: course_name },
//       { course_code: course_code }
//     ]
//   });

//   if (existingCourse) {
//     return next(createError(400, 'Course with this name or code already exists'));
//   }

//   const course = await Course.create({
//     course_name,
//     course_code,
//     description,
//     duration
//   });

//   sendResponse(res, 201, true, 'Course created successfully', { course });
// });

// export const updateCourse = asyncHandler(async (req, res, next) => {
//   const { course_name, course_code, description, duration } = req.body;

//   // Check if another course exists with same name or code
//   const existingCourse = await Course.findOne({
//     _id: { $ne: req.params.id },
//     $or: [
//       { course_name: course_name },
//       { course_code: course_code }
//     ]
//   });

//   if (existingCourse) {
//     return next(createError(400, 'Course with this name or code already exists'));
//   }

//   const course = await Course.findByIdAndUpdate(
//     req.params.id,
//     { course_name, course_code, description, duration },
//     { new: true, runValidators: true }
//   );

//   if (!course || !course.isActive) {
//     return next(createError(404, 'Course not found'));
//   }

//   sendResponse(res, 200, true, 'Course updated successfully', { course });
// });

// export const deleteCourse = asyncHandler(async (req, res, next) => {
//   const course = await Course.findById(req.params.id);

//   if (!course || !course.isActive) {
//     return next(createError(404, 'Course not found'));
//   }

//   // Soft delete
//   await Course.findByIdAndUpdate(req.params.id, { isActive: false });

//   sendResponse(res, 200, true, 'Course deleted successfully');
// });

// export const getCourseStats = asyncHandler(async (req, res) => {
//   const stats = await Course.aggregate([
//     {
//       $match: { isActive: true }
//     },
//     {
//       $lookup: {
//         from: 'semesters',
//         localField: '_id',
//         foreignField: 'course_id',
//         as: 'semesters'
//       }
//     },
//     {
//       $addFields: {
//         semesterCount: { $size: '$semesters' }
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         totalCourses: { $sum: 1 },
//         avgSemesters: { $avg: '$semesterCount' },
//         maxSemesters: { $max: '$semesterCount' },
//         minSemesters: { $min: '$semesterCount' }
//       }
//     }
//   ]);

//   sendResponse(res, 200, true, 'Course statistics retrieved successfully', { 
//     stats: stats[0] || {} 
//   });
// });



// // controllers/courses.controller.js
// import  asyncHandler  from '../utils/async-handler.js';
// import {Course} from '../models/course.model.js';  // adjust model path if needed
// import { createError } from '../utils/error.js';
// import { sendResponse } from '../utils/response.js';

// // Create new course
// export const createCourse = asyncHandler(async (req, res, next) => {
//   const { title, description, duration } = req.body;

//   if (!title) {
//     return next(createError(400, 'Course title is required'));
//   }

//   const existing = await Course.findOne({ title });
//   if (existing) {
//     return next(createError(400, 'Course with this title already exists'));
//   }

//   const course = await Course.create({
//     title,
//     description,
//     duration,
//     isActive: true,
//   });

//   sendResponse(res, 201, true, 'Course created successfully', { course });
// });

// // Get all courses
// export const getAllCourses = asyncHandler(async (req, res) => {
//   const courses = await Course.find({ isActive: true });
//   sendResponse(res, 200, true, 'Courses retrieved successfully', { courses });
// });

// // Get single course by id
// export const getCourse = asyncHandler(async (req, res, next) => {
//   const course = await Course.findById(req.params.id);

//   if (!course || !course.isActive) {
//     return next(createError(404, 'Course not found'));
//   }

//   sendResponse(res, 200, true, 'Course retrieved successfully', { course });
// });

// // Update course
// export const updateCourse = asyncHandler(async (req, res, next) => {
//   const course = await Course.findById(req.params.id);

//   if (!course || !course.isActive) {
//     return next(createError(404, 'Course not found'));
//   }

//   const { title, description, duration } = req.body;

//   course.title = title || course.title;
//   course.description = description || course.description;
//   course.duration = duration || course.duration;

//   await course.save();

//   sendResponse(res, 200, true, 'Course updated successfully', { course });
// });

// // Delete course (soft delete)
// export const deleteCourse = asyncHandler(async (req, res, next) => {
//   const course = await Course.findById(req.params.id);

//   if (!course || !course.isActive) {
//     return next(createError(404, 'Course not found'));
//   }

//   course.isActive = false;
//   await course.save();

//   sendResponse(res, 200, true, 'Course deleted successfully');
// });

// // Get course stats example (you can customize)
// export const getCourseStats = asyncHandler(async (req, res) => {
//   const totalCourses = await Course.countDocuments({ isActive: true });
//   sendResponse(res, 200, true, 'Course stats retrieved', { totalCourses });
// });



// controllers/courses.controller.js
import asyncHandler from '../utils/async-handler.js';
import { Course } from '../models/course.model.js';  
import { createError } from '../utils/error.js';
import { sendResponse } from '../utils/response.js';

// Create new course
export const createCourse = asyncHandler(async (req, res, next) => {
  const { 
    course_name, 
    course_code, 
    credits, 
    course_type, 
    department_id, 
    semester_id, 
    description, 
    duration, 
    year, 
    section 
  } = req.body;

  if (!course_name) {
    return next(createError(400, 'Course name is required'));
  }

  if (!course_code) {
    return next(createError(400, 'Course code is required'));
  }

  if (!department_id) {
    return next(createError(400, 'Department is required'));
  }

  if (!semester_id) {
    return next(createError(400, 'Semester is required'));
  }

  // Check if course already exists
  const existing = await Course.findOne({ 
    course_code: course_code.toUpperCase(),
    year,
    section,
    isActive: true 
  });
  
  if (existing) {
    return next(createError(400, 'Course with this code, year and section already exists'));
  }

  const course = await Course.create({
    course_name,
    course_code: course_code.toUpperCase(),
    credits: credits || 0,
    course_type: course_type || 'core',
    department_id,
    semester_id,
    description,
    duration: duration || 4,
    year,
    section,
    isActive: true,
  });

  // Populate department and semester info
  await course.populate([
    { path: 'department_id', select: 'name code' },
    { path: 'semester_id', select: 'name number' }
  ]);

  sendResponse(res, 201, true, 'Course created successfully', { course });
});

// Get all courses with pagination and filtering
export const getAllCourses = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    search = '', 
    department_id, 
    semester_id, 
    course_type,
    year,
    section 
  } = req.query;

  const skip = (page - 1) * limit;
  
  // Build filter object
  const filter = { isActive: true };
  
  if (search) {
    filter.$or = [
      { course_name: { $regex: search, $options: 'i' } },
      { course_code: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (department_id) filter.department_id = department_id;
  if (semester_id) filter.semester_id = semester_id;
  if (course_type) filter.course_type = course_type;
  if (year) filter.year = year;
  if (section) filter.section = section;

  const courses = await Course.find(filter)
    .populate([
      { path: 'department_id', select: 'name code' },
      { path: 'semester_id', select: 'name number' }
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Course.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  sendResponse(res, 200, true, 'Courses retrieved successfully', { 
    courses, 
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages
    }
  });
});

// Get single course by id
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate([
      { path: 'department_id', select: 'name code' },
      { path: 'semester_id', select: 'name number' }
    ]);

  if (!course || !course.isActive) {
    return next(createError(404, 'Course not found'));
  }

  sendResponse(res, 200, true, 'Course retrieved successfully', { course });
});

// Update course
export const updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course || !course.isActive) {
    return next(createError(404, 'Course not found'));
  }

  const { 
    course_name, 
    course_code, 
    credits, 
    course_type, 
    department_id, 
    semester_id, 
    description, 
    duration, 
    year, 
    section 
  } = req.body;

  // Check for duplicate if course_code, year, or section is being changed
  if (course_code || year || section) {
    const existing = await Course.findOne({
      _id: { $ne: req.params.id },
      course_code: course_code?.toUpperCase() || course.course_code,
      year: year || course.year,
      section: section || course.section,
      isActive: true
    });

    if (existing) {
      return next(createError(400, 'Course with this code, year and section already exists'));
    }
  }

  // Update fields
  course.course_name = course_name || course.course_name;
  course.course_code = course_code?.toUpperCase() || course.course_code;
  course.credits = credits || course.credits;
  course.course_type = course_type || course.course_type;
  course.department_id = department_id || course.department_id;
  course.semester_id = semester_id || course.semester_id;
  course.description = description || course.description;
  course.duration = duration || course.duration;
  course.year = year || course.year;
  course.section = section || course.section;

  await course.save();

  // Populate department and semester info
  await course.populate([
    { path: 'department_id', select: 'name code' },
    { path: 'semester_id', select: 'name number' }
  ]);

  sendResponse(res, 200, true, 'Course updated successfully', { course });
});

// Delete course (soft delete)
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course || !course.isActive) {
    return next(createError(404, 'Course not found'));
  }

  course.isActive = false;
  await course.save();

  sendResponse(res, 200, true, 'Course deleted successfully');
});

// Get courses by department
export const getCoursesByDepartment = asyncHandler(async (req, res, next) => {
  const { departmentId } = req.params;
  
  const courses = await Course.find({ 
    department_id: departmentId, 
    isActive: true 
  })
  .populate('semester_id', 'name number')
  .sort({ year: 1, section: 1 });

  sendResponse(res, 200, true, 'Department courses retrieved successfully', { courses });
});

// Get course statistics
export const getCourseStats = asyncHandler(async (req, res) => {
  const totalCourses = await Course.countDocuments({ isActive: true });
  const coursesByType = await Course.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$course_type', count: { $sum: 1 } } }
  ]);
  
  const coursesByYear = await Course.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$year', count: { $sum: 1 } } }
  ]);

  sendResponse(res, 200, true, 'Course stats retrieved successfully', { 
    totalCourses,
    coursesByType,
    coursesByYear
  });
});