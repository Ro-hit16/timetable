// import Semester from '../models/semester.model.js';
// import Department from '../models/department.model.js';

// import ApiError from '../utils/ApiError.js';
// import { ApiResponse } from '../utils/response.js';
// import asyncHandler from '../utils/async-handler.js';

// // Get all semesters with populated data
// export const getAllSemesters = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10, department } = req.query;
  
//   // Build filter object
//   const filter = { isActive: true };
//   if (department) filter.departmentId = department;
  
//   // Calculate pagination
//   const skip = (page - 1) * limit;
  
//   // Get semesters with populated data
//   const semesters = await Semester.find(filter)
//     .populate('department', 'departmentName departmentCode')
//     .skip(skip)
//     .limit(parseInt(limit))
//     .sort({ departmentId: 1, semesterNumber: 1 });
  
//   // Get total count for pagination
//   const totalSemesters = await Semester.countDocuments(filter);
//   const totalPages = Math.ceil(totalSemesters / limit);
  
//   res.status(200).json(
//     new ApiResponse(200, {
//       semesters,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages,
//         totalSemesters,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1
//       }
//     }, 'Semesters fetched successfully')
//   );
// });

// // Get semester by ID
// export const getSemesterById = asyncHandler(async (req, res) => {
//   const { id } = req.params;
  
//   const semester = await Semester.findById(id)
//     .populate('department', 'departmentName departmentCode');
  
//   if (!semester) {
//     throw new ApiError(404, 'Semester not found');
//   }
  
//   res.status(200).json(
//     new ApiResponse(200, semester, 'Semester fetched successfully')
//   );
// });

// // Create new semester
// export const createSemester = asyncHandler(async (req, res) => {
//   const {
//     semesterName,
//     departmentId,
//     semesterNumber,
//     duration,
//     startDate,
//     endDate,
//     description
//   } = req.body;
  
//   // Validate required fields
//   if (!semesterName || !departmentId || !semesterNumber) {
//     throw new ApiError(400, 'Semester name, department, and semester number are required');
//   }
  
//   // Check if department exists
//   const department = await Department.findById(departmentId);
//   if (!department) {
//     throw new ApiError(404, 'Department not found');
//   }
  
//   // Check if semester already exists for this department
//   const existingSemester = await Semester.findOne({
//     $or: [
//       { semesterName: semesterName.trim(), departmentId, isActive: true },
//       { semesterNumber, departmentId, isActive: true }
//     ]
//   });
  
//   if (existingSemester) {
//     throw new ApiError(400, 'Semester with this name or number already exists for this department');
//   }
  
//   // Create new semester
//   const semester = await Semester.create({
//     semesterName: semesterName.trim(),
//     departmentId,
//     semesterNumber,
//     duration,
//     startDate,
//     endDate,
//     description
//   });
  
//   // Populate the created semester
//   const populatedSemester = await Semester.findById(semester._id)
//     .populate('department', 'departmentName departmentCode');
  
//   res.status(201).json(
//     new ApiResponse(201, populatedSemester, 'Semester created successfully')
//   );
// });

// // Update semester
// export const updateSemester = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;
  
//   // Check if semester exists
//   const semester = await Semester.findById(id);
//   if (!semester) {
//     throw new ApiError(404, 'Semester not found');
//   }
  
//   // Validate department if provided
//   if (updateData.departmentId) {
//     const department = await Department.findById(updateData.departmentId);
//     if (!department) {
//       throw new ApiError(404, 'Department not found');
//     }
//   }
  
//   // Check for duplicate semester name or number if being updated
//   if (updateData.semesterName || updateData.semesterNumber) {
//     const existingSemester = await Semester.findOne({
//       $or: [
//         { 
//           semesterName: updateData.semesterName?.trim() || semester.semesterName,
//           departmentId: updateData.departmentId || semester.departmentId,
//           isActive: true,
//           _id: { $ne: id }
//         },
//         { 
//           semesterNumber: updateData.semesterNumber || semester.semesterNumber,
//           departmentId: updateData.departmentId || semester.departmentId,
//           isActive: true,
//           _id: { $ne: id }
//         }
//       ]
//     });
    
//     if (existingSemester) {
//       throw new ApiError(400, 'Semester with this name or number already exists for the department');
//     }
//   }
  
//   // Update semester
//   const updatedSemester = await Semester.findByIdAndUpdate(
//     id,
//     { ...updateData, updatedAt: Date.now() },
//     { new: true, runValidators: true }
//   ).populate('department', 'departmentName departmentCode');
  
//   res.status(200).json(
//     new ApiResponse(200, updatedSemester, 'Semester updated successfully')
//   );
// });

// // Delete semester (soft delete)
// export const deleteSemester = asyncHandler(async (req, res) => {
//   const { id } = req.params;
  
//   const semester = await Semester.findById(id);
//   if (!semester) {
//     throw new ApiError(404, 'Semester not found');
//   }
  
//   // Check if semester has subjects or students
//   const subjectCount = await semester.getSubjectCount();
//   const studentCount = await semester.getStudentCount();
  
//   if (subjectCount > 0 || studentCount > 0) {
//     throw new ApiError(400, 'Cannot delete semester with existing subjects or students');
//   }
  
//   // Soft delete
//   semester.isActive = false;
//   await semester.save();
  
//   res.status(200).json(
//     new ApiResponse(200, null, 'Semester deleted successfully')
//   );
// });

// // Get semesters by department
// export const getSemestersByDepartment = asyncHandler(async (req, res) => {
//   const { departmentId } = req.params;
  
//   const semesters = await Semester.findByDepartment(departmentId);
  
//   res.status(200).json(
//     new ApiResponse(200, semesters, 'Department semesters fetched successfully')
//   );
// });

// // Get active semesters
// export const getActiveSemesters = asyncHandler(async (req, res) => {
//   const semesters = await Semester.findActiveSemesters();
  
//   res.status(200).json(
//     new ApiResponse(200, semesters, 'Active semesters fetched successfully')
//   );
// });

// // Get semester statistics
// export const getSemesterStats = asyncHandler(async (req, res) => {
//   const totalSemesters = await Semester.countDocuments({ isActive: true });
  
//   // Get semesters by department
//   const semestersByDepartment = await Semester.aggregate([
//     { $match: { isActive: true } },
//     {
//       $lookup: {
//         from: 'departments',
//         localField: 'departmentId',
//         foreignField: '_id',
//         as: 'department'
//       }
//     },
//     { $unwind: '$department' },
//     {
//       $group: {
//         _id: '$department._id',
//         departmentName: { $first: '$department.departmentName' },
//         count: { $sum: 1 },
//         semesters: {
//           $push: {
//             semesterName: '$semesterName',
//             semesterNumber: '$semesterNumber'
//           }
//         }
//       }
//     },
//     { $sort: { departmentName: 1 } }
//   ]);
  
//   const stats = {
//     totalSemesters,
//     semestersByDepartment
//   };
  
//   res.status(200).json(
//     new ApiResponse(200, stats, 'Semester statistics fetched successfully')
//   );
// });

// // controllers/semesters.controller.js
// import Semester from '../models/semester.model.js';
// import Department from '../models/department.model.js';
// import ApiError from '../utils/ApiError.js';
// import { ApiResponse } from '../utils/response.js';
// import asyncHandler from '../utils/async-handler.js';

// // Get all semesters with populated data
// export const getAllSemesters = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10, department } = req.query;

//   const filter = { isActive: true };
//   if (department) filter.departmentId = department;

//   const skip = (page - 1) * limit;

//   const semesters = await Semester.find(filter)
//     .populate('department', 'departmentName departmentCode')
//     .skip(skip)
//     .limit(parseInt(limit))
//     .sort({ departmentId: 1, semesterNumber: 1 });

//   const totalSemesters = await Semester.countDocuments(filter);
//   const totalPages = Math.ceil(totalSemesters / limit);

//   res.status(200).json(
//     new ApiResponse(200, {
//       semesters,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages,
//         totalSemesters,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1
//       }
//     }, 'Semesters fetched successfully')
//   );
// });

// // Get semester by ID
// export const getSemesterById = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const semester = await Semester.findById(id)
//     .populate('department', 'departmentName departmentCode');

//   if (!semester) throw new ApiError(404, 'Semester not found');

//   res.status(200).json(new ApiResponse(200, semester, 'Semester fetched successfully'));
// });

// // ✅ Updated: Create new semester
// export const createSemester = asyncHandler(async (req, res) => {
//   const {
//     semesterName,
//     departmentId,
//     course_id,
//     semesterNumber,
//     duration,
//     startDate,
//     endDate,
//     description
//   } = req.body;

//   if (!semesterName || !departmentId || !course_id || !semesterNumber) {
//     throw new ApiError(400, 'semesterName, departmentId, course_id, and semesterNumber are required');
//   }

//   const department = await Department.findById(departmentId);
//   if (!department) throw new ApiError(404, 'Department not found');

//   const existingSemester = await Semester.findOne({
//     $or: [
//       { semesterName: semesterName.trim(), departmentId, isActive: true },
//       { semesterNumber, departmentId, isActive: true }
//     ]
//   });

//   if (existingSemester) {
//     throw new ApiError(400, 'Semester with this name or number already exists for this department');
//   }

//   const semester = await Semester.create({
//     semesterName: semesterName.trim(),
//     departmentId,
//     course_id,
//     semesterNumber,
//     duration,
//     startDate,
//     endDate,
//     description
//   });

//   const populatedSemester = await Semester.findById(semester._id)
//     .populate('department', 'departmentName departmentCode');

//   res.status(201).json(new ApiResponse(201, populatedSemester, 'Semester created successfully'));
// });

// // Update semester
// export const updateSemester = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   const semester = await Semester.findById(id);
//   if (!semester) throw new ApiError(404, 'Semester not found');

//   if (updateData.departmentId) {
//     const department = await Department.findById(updateData.departmentId);
//     if (!department) throw new ApiError(404, 'Department not found');
//   }

//   if (updateData.semesterName || updateData.semesterNumber) {
//     const existingSemester = await Semester.findOne({
//       $or: [
//         {
//           semesterName: updateData.semesterName?.trim() || semester.semesterName,
//           departmentId: updateData.departmentId || semester.departmentId,
//           isActive: true,
//           _id: { $ne: id }
//         },
//         {
//           semesterNumber: updateData.semesterNumber || semester.semesterNumber,
//           departmentId: updateData.departmentId || semester.departmentId,
//           isActive: true,
//           _id: { $ne: id }
//         }
//       ]
//     });

//     if (existingSemester) {
//       throw new ApiError(400, 'Semester with this name or number already exists for the department');
//     }
//   }

//   const updatedSemester = await Semester.findByIdAndUpdate(
//     id,
//     { ...updateData, updatedAt: Date.now() },
//     { new: true, runValidators: true }
//   ).populate('department', 'departmentName departmentCode');

//   res.status(200).json(new ApiResponse(200, updatedSemester, 'Semester updated successfully'));
// });

// // Soft delete
// export const deleteSemester = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const semester = await Semester.findById(id);
//   if (!semester) throw new ApiError(404, 'Semester not found');

//   const subjectCount = await semester.getSubjectCount();
//   const studentCount = await semester.getStudentCount();

//   if (subjectCount > 0 || studentCount > 0) {
//     throw new ApiError(400, 'Cannot delete semester with existing subjects or students');
//   }

//   semester.isActive = false;
//   await semester.save();

//   res.status(200).json(new ApiResponse(200, null, 'Semester deleted successfully'));
// });

// export const getSemestersByDepartment = asyncHandler(async (req, res) => {
//   const { departmentId } = req.params;

//   const semesters = await Semester.findByDepartment(departmentId);

//   res.status(200).json(new ApiResponse(200, semesters, 'Department semesters fetched successfully'));
// });

// export const getActiveSemesters = asyncHandler(async (req, res) => {
//   const semesters = await Semester.findActiveSemesters();

//   res.status(200).json(new ApiResponse(200, semesters, 'Active semesters fetched successfully'));
// });

// export const getSemesterStats = asyncHandler(async (req, res) => {
//   const totalSemesters = await Semester.countDocuments({ isActive: true });

//   const semestersByDepartment = await Semester.aggregate([
//     { $match: { isActive: true } },
//     {
//       $lookup: {
//         from: 'departments',
//         localField: 'departmentId',
//         foreignField: '_id',
//         as: 'department'
//       }
//     },
//     { $unwind: '$department' },
//     {
//       $group: {
//         _id: '$department._id',
//         departmentName: { $first: '$department.departmentName' },
//         count: { $sum: 1 },
//         semesters: {
//           $push: {
//             semesterName: '$semesterName',
//             semesterNumber: '$semesterNumber'
//           }
//         }
//       }
//     },
//     { $sort: { departmentName: 1 } }
//   ]);

//   const stats = {
//     totalSemesters,
//     semestersByDepartment
//   };

//   res.status(200).json(new ApiResponse(200, stats, 'Semester statistics fetched successfully'));
// });



// // controllers/semesters.controller.js
// import Semester from '../models/semester.model.js';
// import Department from '../models/department.model.js';
// import ApiError from '../utils/ApiError.js';
// import { ApiResponse } from '../utils/response.js';
// import asyncHandler from '../utils/async-handler.js';

// // Get all semesters with populated data
// export const getAllSemesters = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10, department, search } = req.query;

//   const filter = { isActive: true };
  
//   // Department filter
//   if (department) filter.departmentId = department;
  
//   // Search filter
//   if (search) {
//     filter.$or = [
//       { semesterName: { $regex: search, $options: 'i' } },
//       { description: { $regex: search, $options: 'i' } }
//     ];
//   }

//   const skip = (page - 1) * limit;

//   const semesters = await Semester.find(filter)
//     .populate('departmentId', 'departmentName departmentCode')
//     .populate('course_id', 'courseName courseCode')
//     .skip(skip)
//     .limit(parseInt(limit))
//     .sort({ departmentId: 1, semesterNumber: 1 });

//   const totalSemesters = await Semester.countDocuments(filter);
//   const totalPages = Math.ceil(totalSemesters / limit);

//   res.status(200).json(
//     new ApiResponse(200, {
//       semesters,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages,
//         totalSemesters,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1
//       }
//     }, 'Semesters fetched successfully')
//   );
// });

// // Get semester by ID
// export const getSemesterById = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const semester = await Semester.findById(id)
//     .populate('departmentId', 'departmentName departmentCode')
//     .populate('course_id', 'courseName courseCode');

//   if (!semester) throw new ApiError(404, 'Semester not found');

//   res.status(200).json(new ApiResponse(200, semester, 'Semester fetched successfully'));
// });

// // Create new semester
// export const createSemester = asyncHandler(async (req, res) => {
//   const {
//     semesterName,
//     departmentId,
//     course_id,
//     semesterNumber,
//     duration,
//     startDate,
//     endDate,
//     description
//   } = req.body;

//   if (!semesterName || !departmentId || !course_id || !semesterNumber) {
//     throw new ApiError(400, 'semesterName, departmentId, course_id, and semesterNumber are required');
//   }

//   const department = await Department.findById(departmentId);
//   if (!department) throw new ApiError(404, 'Department not found');

//   const existingSemester = await Semester.findOne({
//     $or: [
//       { semesterName: semesterName.trim(), departmentId, isActive: true },
//       { semesterNumber, departmentId, isActive: true }
//     ]
//   });

//   if (existingSemester) {
//     throw new ApiError(400, 'Semester with this name or number already exists for this department');
//   }

//   const semester = await Semester.create({
//     semesterName: semesterName.trim(),
//     departmentId,
//     course_id,
//     semesterNumber,
//     duration,
//     startDate,
//     endDate,
//     description
//   });

//   const populatedSemester = await Semester.findById(semester._id)
//     .populate('departmentId', 'departmentName departmentCode')
//     .populate('course_id', 'courseName courseCode');

//   res.status(201).json(new ApiResponse(201, populatedSemester, 'Semester created successfully'));
// });

// // Update semester
// export const updateSemester = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   const semester = await Semester.findById(id);
//   if (!semester) throw new ApiError(404, 'Semester not found');

//   if (updateData.departmentId) {
//     const department = await Department.findById(updateData.departmentId);
//     if (!department) throw new ApiError(404, 'Department not found');
//   }

//   if (updateData.semesterName || updateData.semesterNumber) {
//     const existingSemester = await Semester.findOne({
//       $or: [
//         {
//           semesterName: updateData.semesterName?.trim() || semester.semesterName,
//           departmentId: updateData.departmentId || semester.departmentId,
//           isActive: true,
//           _id: { $ne: id }
//         },
//         {
//           semesterNumber: updateData.semesterNumber || semester.semesterNumber,
//           departmentId: updateData.departmentId || semester.departmentId,
//           isActive: true,
//           _id: { $ne: id }
//         }
//       ]
//     });

//     if (existingSemester) {
//       throw new ApiError(400, 'Semester with this name or number already exists for the department');
//     }
//   }

//   const updatedSemester = await Semester.findByIdAndUpdate(
//     id,
//     { ...updateData, updatedAt: Date.now() },
//     { new: true, runValidators: true }
//   ).populate('departmentId', 'departmentName departmentCode')
//    .populate('course_id', 'courseName courseCode');

//   res.status(200).json(new ApiResponse(200, updatedSemester, 'Semester updated successfully'));
// });

// // Soft delete
// export const deleteSemester = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const semester = await Semester.findById(id);
//   if (!semester) throw new ApiError(404, 'Semester not found');

//   const subjectCount = await semester.getSubjectCount();
//   const studentCount = await semester.getStudentCount();

//   if (subjectCount > 0 || studentCount > 0) {
//     throw new ApiError(400, 'Cannot delete semester with existing subjects or students');
//   }

//   semester.isActive = false;
//   await semester.save();

//   res.status(200).json(new ApiResponse(200, null, 'Semester deleted successfully'));
// });

// export const getSemestersByDepartment = asyncHandler(async (req, res) => {
//   const { departmentId } = req.params;

//   const semesters = await Semester.findByDepartment(departmentId);

//   res.status(200).json(new ApiResponse(200, semesters, 'Department semesters fetched successfully'));
// });

// export const getActiveSemesters = asyncHandler(async (req, res) => {
//   const semesters = await Semester.findActiveSemesters();

//   res.status(200).json(new ApiResponse(200, semesters, 'Active semesters fetched successfully'));
// });

// export const getSemesterStats = asyncHandler(async (req, res) => {
//   const totalSemesters = await Semester.countDocuments({ isActive: true });

//   const semestersByDepartment = await Semester.aggregate([
//     { $match: { isActive: true } },
//     {
//       $lookup: {
//         from: 'departments',
//         localField: 'departmentId',
//         foreignField: '_id',
//         as: 'department'
//       }
//     },
//     { $unwind: '$department' },
//     {
//       $group: {
//         _id: '$department._id',
//         departmentName: { $first: '$department.departmentName' },
//         count: { $sum: 1 },
//         semesters: {
//           $push: {
//             semesterName: '$semesterName',
//             semesterNumber: '$semesterNumber'
//           }
//         }
//       }
//     },
//     { $sort: { departmentName: 1 } }
//   ]);

//   const stats = {
//     totalSemesters,
//     semestersByDepartment
//   };

//   res.status(200).json(new ApiResponse(200, stats, 'Semester statistics fetched successfully'));
// });

// controllers/semesters.controller.js
import Semester from '../models/semester.model.js';
import Department from '../models/department.model.js';
import ApiError from '../utils/ApiError.js';
import { ApiResponse } from '../utils/response.js';
import asyncHandler from '../utils/async-handler.js';

// Get all semesters with populated data
export const getAllSemesters = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, department, search } = req.query;

  const filter = { isActive: true };
  
  // Department filter
  if (department) filter.departmentId = department;
  
  // Search filter
  if (search) {
    filter.$or = [
      { semesterName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const semesters = await Semester.find(filter)
    .populate('departmentId', 'departmentName departmentCode')
    .populate('course_id', 'courseName courseCode')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ departmentId: 1, semesterNumber: 1 });

  const totalSemesters = await Semester.countDocuments(filter);
  const totalPages = Math.ceil(totalSemesters / limit);

  res.status(200).json(
    new ApiResponse(200, {
      semesters,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalSemesters,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, 'Semesters fetched successfully')
  );
});

// Get semester by ID
export const getSemesterById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const semester = await Semester.findById(id)
    .populate('departmentId', 'departmentName departmentCode')
    .populate('course_id', 'courseName courseCode');

  if (!semester) throw new ApiError(404, 'Semester not found');

  res.status(200).json(new ApiResponse(200, semester, 'Semester fetched successfully'));
});

// Create new semester - FIXED: course_id is now optional
export const createSemester = asyncHandler(async (req, res) => {
  const {
    semesterName,
    departmentId,
    course_id,
    semesterNumber,
    duration,
    startDate,
    endDate,
    description
  } = req.body;

  // FIXED: Removed course_id from required validation
  if (!semesterName || !departmentId || !semesterNumber) {
    throw new ApiError(400, 'semesterName, departmentId, and semesterNumber are required');
  }

  // Validate department exists
  const department = await Department.findById(departmentId);
  if (!department) throw new ApiError(404, 'Department not found');

  // FIXED: Check for existing semester without course_id dependency
  const existingSemester = await Semester.findOne({
    semesterNumber,
    departmentId,
    isActive: true
  });

  if (existingSemester) {
    throw new ApiError(400, 'Semester with this number already exists for this department');
  }

  // FIXED: Only add course_id to semester data if provided
  const semesterData = {
    semesterName: semesterName.trim(),
    departmentId,
    semesterNumber,
    duration: duration || 6, // Default duration
    startDate,
    endDate,
    description
  };

  // Add course_id only if provided
  if (course_id) {
    semesterData.course_id = course_id;
  }

  const semester = await Semester.create(semesterData);

  const populatedSemester = await Semester.findById(semester._id)
    .populate('departmentId', 'departmentName departmentCode')
    .populate('course_id', 'courseName courseCode');

  res.status(201).json(new ApiResponse(201, populatedSemester, 'Semester created successfully'));
});

// Update semester
export const updateSemester = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const semester = await Semester.findById(id);
  if (!semester) throw new ApiError(404, 'Semester not found');

  if (updateData.departmentId) {
    const department = await Department.findById(updateData.departmentId);
    if (!department) throw new ApiError(404, 'Department not found');
  }

  // FIXED: Check for duplicates without requiring course_id
  if (updateData.semesterName || updateData.semesterNumber) {
    const existingSemester = await Semester.findOne({
      semesterNumber: updateData.semesterNumber || semester.semesterNumber,
      departmentId: updateData.departmentId || semester.departmentId,
      isActive: true,
      _id: { $ne: id }
    });

    if (existingSemester) {
      throw new ApiError(400, 'Semester with this number already exists for the department');
    }
  }

  const updatedSemester = await Semester.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: Date.now() },
    { new: true, runValidators: true }
  ).populate('departmentId', 'departmentName departmentCode')
   .populate('course_id', 'courseName courseCode');

  res.status(200).json(new ApiResponse(200, updatedSemester, 'Semester updated successfully'));
});

// Soft delete
export const deleteSemester = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const semester = await Semester.findById(id);
  if (!semester) throw new ApiError(404, 'Semester not found');

  const subjectCount = await semester.getSubjectCount();
  const studentCount = await semester.getStudentCount();

  if (subjectCount > 0 || studentCount > 0) {
    throw new ApiError(400, 'Cannot delete semester with existing subjects or students');
  }

  semester.isActive = false;
  await semester.save();

  res.status(200).json(new ApiResponse(200, null, 'Semester deleted successfully'));
});

export const getSemestersByDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;

  const semesters = await Semester.findByDepartment(departmentId);

  res.status(200).json(new ApiResponse(200, semesters, 'Department semesters fetched successfully'));
});

export const getActiveSemesters = asyncHandler(async (req, res) => {
  const semesters = await Semester.findActiveSemesters();

  res.status(200).json(new ApiResponse(200, semesters, 'Active semesters fetched successfully'));
});

export const getSemesterStats = asyncHandler(async (req, res) => {
  const totalSemesters = await Semester.countDocuments({ isActive: true });

  const semestersByDepartment = await Semester.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'departments',
        localField: 'departmentId',
        foreignField: '_id',
        as: 'department'
      }
    },
    { $unwind: '$department' },
    {
      $group: {
        _id: '$department._id',
        departmentName: { $first: '$department.departmentName' },
        count: { $sum: 1 },
        semesters: {
          $push: {
            semesterName: '$semesterName',
            semesterNumber: '$semesterNumber'
          }
        }
      }
    },
    { $sort: { departmentName: 1 } }
  ]);

  const stats = {
    totalSemesters,
    semestersByDepartment
  };

  res.status(200).json(new ApiResponse(200, stats, 'Semester statistics fetched successfully'));
});