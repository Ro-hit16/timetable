// // controllers/teacherController.js

// import Teacher from '../models/teacher.model.js';
// //import Department from '../models/department.model.js';
// import  ApiError  from '../utils/ApiError.js';
// import { ApiResponse } from '../utils/response.js';
// import  asyncHandler  from '../utils/async-handler.js';

// /**
//  * @desc    Get all teachers with filters, search, pagination, and sorting
//  * @route   GET /api/teachers
//  * @access  Private
//  */
// export const getAllTeachers = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10, department, designation, search } = req.query;

//   // Build filter object
//   const filter = { isActive: true };
//   if (department) filter.departmentId = department;
//   if (designation) filter.designation = designation.toLowerCase();

//   // Add search functionality
//   if (search) {
//     filter.$or = [
//       { name: { $regex: search, $options: 'i' } },
//       { email: { $regex: search, $options: 'i' } },
//       { employeeId: { $regex: search, $options: 'i' } }
//     ];
//   }

//   // Calculate pagination
//   const skip = (page - 1) * limit;

//   // Get teachers with populated data
//   const teachers = await Teacher.find(filter)
//     .populate('department', 'departmentName departmentCode')
//     .select('-password')
//     .skip(skip)
//     .limit(parseInt(limit))
//     .sort({ name: 1 });

//   // Get total count for pagination
//   const totalTeachers = await Teacher.countDocuments(filter);
//   const totalPages = Math.ceil(totalTeachers / limit);

//   res.status(200).json(
//     new ApiResponse(200, {
//       teachers,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages,
//         totalTeachers,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1
//       }
//     }, 'Teachers fetched successfully')
//   );
// });

// /**
//  * @desc    Get teacher by ID
//  * @route   GET /api/teachers/:id
//  * @access  Private
//  */
// export const getTeacherById = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const teacher = await Teacher.findById(id)
//     .populate('department', 'departmentName departmentCode')
//     .populate('teachingSubjects', 'subjectName type lecturePerWeek')
//     .select('-password');

//   if (!teacher) {
//     throw new ApiError(404, 'Teacher not found');
//   }

//   res.status(200).json(
//     new ApiResponse(200, teacher, 'Teacher fetched successfully')
//   );
// });

// /**
//  * @desc    Create new teacher
//  * @route   POST /api/teachers
//  * @access  Private
//  */
// export const createTeacher = asyncHandler(async (req, res) => {
//   const {
//     name,
//     email,
//     password,
//     mobile,
//     address,
//     departmentId,
//     employeeId,
//     qualification,
//     experience,
//     designation,
//     joiningDate,
//     salary
//   } = req.body;

//   // Validate required fields
//   if (!name || !email || !password || !mobile || !address || !departmentId) {
//     throw new ApiError(400, 'All required fields must be provided');
//   }

//   // Check if department exists
//   const department = await Department.findById(departmentId);
//   if (!department) {
//     throw new ApiError(404, 'Department not found');
//   }

//   // Check if teacher with email already exists
//   const existingTeacher = await Teacher.findByEmail(email);
//   if (existingTeacher) {
//     throw new ApiError(400, 'Teacher with this email already exists');
//   }

//   // Check if employee ID already exists (if provided)
//   if (employeeId) {
//     const existingEmployee = await Teacher.findByEmployeeId(employeeId);
//     if (existingEmployee) {
//       throw new ApiError(400, 'Teacher with this employee ID already exists');
//     }
//   }

//   // Create new teacher
//   const teacher = await Teacher.create({
//     name: name.trim(),
//     email: email.toLowerCase(),
//     password,
//     mobile,
//     address: address.trim(),
//     departmentId,
//     employeeId,
//     qualification,
//     experience,
//     designation: designation?.toLowerCase(),
//     joiningDate,
//     salary
//   });

//   // Populate the created teacher
//   const populatedTeacher = await Teacher.findById(teacher._id)
//     .populate('department', 'departmentName departmentCode')
//     .select('-password');

//   res.status(201).json(
//     new ApiResponse(201, populatedTeacher, 'Teacher created successfully')
//   );
// });

// /**
//  * @desc    Update teacher
//  * @route   PUT /api/teachers/:id
//  * @access  Private
//  */
// export const updateTeacher = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const updateData = { ...req.body };

//   // Remove password from update data if empty
//   if (!updateData.password) {
//     delete updateData.password;
//   }

//   // Check if teacher exists
//   const teacher = await Teacher.findById(id);
//   if (!teacher) {
//     throw new ApiError(404, 'Teacher not found');
//   }

//   // Validate department if provided
//   if (updateData.departmentId) {
//     const department = await Department.findById(updateData.departmentId);
//     if (!department) {
//       throw new ApiError(404, 'Department not found');
//     }
//   }

//   // Check for duplicate email if being updated
//   if (updateData.email && updateData.email !== teacher.email) {
//     const existingTeacher = await Teacher.findByEmail(updateData.email);
//     if (existingTeacher) {
//       throw new ApiError(400, 'Teacher with this email already exists');
//     }
//   }

//   // Check for duplicate employee ID if being updated
//   if (updateData.employeeId && updateData.employeeId !== teacher.employeeId) {
//     const existingEmployee = await Teacher.findByEmployeeId(updateData.employeeId);
//     if (existingEmployee) {
//       throw new ApiError(400, 'Teacher with this employee ID already exists');
//     }
//   }

//   // Update teacher
//   const updatedTeacher = await Teacher.findByIdAndUpdate(
//     id,
//     { ...updateData, updatedAt: Date.now() },
//     { new: true, runValidators: true }
//   )
//     .populate('department', 'departmentName departmentCode')
//     .select('-password');

//   res.status(200).json(
//     new ApiResponse(200, updatedTeacher, 'Teacher updated successfully')
//   );
// });

// /**
//  * @desc    Delete teacher (soft delete)
//  * @route   DELETE /api/teachers/:id
//  * @access  Private
//  */
// // export const deleteTeacher = asyncHandler(async (req, res) => {
// //   const { id } = req.params;

// //   const teacher = await Teacher.findById(id);
// //   if (!teacher) {
// //     throw new ApiError(404, 'Teacher not found');
// //   }

// //   // Check if teacher has subjects assigned
// //   const subjectCount = await teacher.getSubjectCount();
// //   if (subjectCount > 0) {
// //     throw new ApiError(400, 'Cannot delete teacher with assigned subjects');
// //   }

// //   // Soft delete
// //   teacher.isActive = false;
// //   await teacher.save();

// //   res.status(200).json(
// //     new ApiResponse(200, null, 'Teacher deleted successfully')
// //   );
// // });

// export const deleteTeacher = async (req, res) => {
//   try {
//     const { teacher_id } = req.params;
//     await Teacher.findByIdAndDelete(teacher_id);
//     res.status(200).json({ message: 'Teacher deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };




// /**
//  * @desc    Restore deleted teacher
//  * @route   PATCH /api/teachers/:id/restore
//  * @access  Private
//  */
// export const restoreTeacher = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const teacher = await Teacher.findByIdAndUpdate(
//     id,
//     { isActive: true },
//     { new: true }
//   ).populate('department', 'departmentName departmentCode');

//   if (!teacher) {
//     throw new ApiError(404, 'Teacher not found');
//   }

//   res.status(200).json(new ApiResponse(200, teacher, 'Teacher restored successfully'));
// });

// /**
//  * @desc    Get teachers by department
//  * @route   GET /api/teachers/department/:departmentId
//  * @access  Private
//  */
// export const getTeachersByDepartment = asyncHandler(async (req, res) => {
//   const { departmentId } = req.params;

//   const teachers = await Teacher.findByDepartment(departmentId);

//   res.status(200).json(
//     new ApiResponse(200, teachers, 'Department teachers fetched successfully')
//   );
// });

// /**
//  * @desc    Get active teachers
//  * @route   GET /api/teachers/active
//  * @access  Private
//  */
// export const getActiveTeachers = asyncHandler(async (req, res) => {
//   const teachers = await Teacher.findActiveTeachers();

//   res.status(200).json(
//     new ApiResponse(200, teachers, 'Active teachers fetched successfully')
//   );
// });

// /**
//  * @desc    Teacher login
//  * @route   POST /api/teachers/login
//  * @access  Public
//  */
// export const loginTeacher = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     throw new ApiError(400, 'Email and password are required');
//   }

//   // Find teacher by email
//   const teacher = await Teacher.findByEmail(email)
//     .populate('department', 'departmentName departmentCode');

//   if (!teacher || !teacher.isActive) {
//     throw new ApiError(401, 'Invalid credentials or account deactivated');
//   }

//   // Check password
//   const isPasswordCorrect = await teacher.comparePassword(password);
//   if (!isPasswordCorrect) {
//     throw new ApiError(401, 'Invalid credentials');
//   }

//   // Update last login
//   await teacher.updateLastLogin();

//   // Remove password from response
//   const teacherData = teacher.toObject();
//   delete teacherData.password;

//   res.status(200).json(
//     new ApiResponse(200, teacherData, 'Teacher logged in successfully')
//   );
// });

// /**
//  * @desc    Get teacher statistics (by designation, department, experience, and overall)
//  * @route   GET /api/teachers/stats
//  * @access  Private
//  */
// export const getTeacherStats = asyncHandler(async (req, res) => {
//   const totalTeachers = await Teacher.countDocuments({ isActive: true });

//   // Get teachers by designation
//   const teachersByDesignation = await Teacher.aggregate([
//     { $match: { isActive: true } },
//     {
//       $group: {
//         _id: '$designation',
//         count: { $sum: 1 }
//       }
//     },
//     { $sort: { count: -1 } }
//   ]);

//   // Get teachers by department
//   const teachersByDepartment = await Teacher.aggregate([
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
//         count: { $sum: 1 }
//       }
//     },
//     { $sort: { count: -1 } }
//   ]);

//   // Get teachers by experience range
//   const teachersByExperience = await Teacher.aggregate([
//     { $match: { isActive: true, experience: { $exists: true } } },
//     {
//       $bucket: {
//         groupBy: '$experience',
//         boundaries: [0, 5, 10, 15, 20, 100],
//         default: 'Unknown',
//         output: {
//           count: { $sum: 1 }
//         }
//       }
//     }
//   ]);

//   const stats = {
//     totalTeachers,
//     teachersByDesignation,
//     teachersByDepartment,
//     teachersByExperience
//   };

//   res.status(200).json(
//     new ApiResponse(200, stats, 'Teacher statistics fetched successfully')
//   );
// });



// controllers/teacherController.js
import Teacher from '../models/teacher.model.js';
import Department from '../models/department.model.js';

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('department', 'name');
    res.status(200).json({
      success: true,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message
    });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('department', 'name');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher',
      error: error.message
    });
  }
};

// Create new teacher
// export const createTeacher = async (req, res) => {
//   try {
//     const { name, department, semester } = req.body;

//     // Check if department exists
//     const departmentExists = await Department.findById(department);
//     if (!departmentExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'Department not found'
//       });
//     }

//     const teacher = new Teacher({
//       name,
//       department,
//       semester
//     });

//     await teacher.save();
    
//     // Populate department before sending response
//     await teacher.populate('department', 'name');

//     res.status(201).json({
//       success: true,
//       message: 'Teacher created successfully',
//       data: teacher
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error creating teacher',
//       error: error.message
//     });
//   }
// };
export const createTeacher = async (req, res) => {
  try {
    const { name, email, department, semester } = req.body;

    // Check if department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(400).json({
        success: false,
        message: 'Department not found'
      });
    }

    const teacher = new Teacher({
      name,
      email,
      department,
      semester
    });

    await teacher.save();

    // Populate department before sending response
    await teacher.populate('department', 'name');

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating teacher',
      error: error.message
    });
  }
};


// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const { name, department, semester } = req.body;

    // Check if department exists if it's being updated
    if (department) {
      const departmentExists = await Department.findById(department);
      if (!departmentExists) {
        return res.status(400).json({
          success: false,
          message: 'Department not found'
        });
      }
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name, department, semester },
      { new: true, runValidators: true }
    ).populate('department', 'name');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating teacher',
      error: error.message
    });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting teacher',
      error: error.message
    });
  }
};