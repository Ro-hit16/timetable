// controllers/subjectController.js

// import Subject from '../models/subject.model.js';
// import Semester from '../models/semester.model.js';
// //import Department from '../models/department.model.js';
// import Teacher from '../models/teacher.model.js';
// import  ApiError  from '../utils/ApiError.js';
// import { ApiResponse } from '../utils/response.js';
// import  asyncHandler  from '../utils/async-handler.js';

// // Get all subjects with populated data
// export const getAllSubjects = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10, department, semester, teacher, type } = req.query;

//   const filter = { isActive: true };
//   if (department) filter.departmentId = department;
//   if (semester) filter.semesterId = semester;
//   if (teacher) filter.teacherId = teacher;
//   if (type) filter.type = type;

//   const skip = (page - 1) * limit;

//   const subjects = await Subject.find(filter)
//     .populate('semester', 'semesterName semesterNumber')
//     .populate('department', 'departmentName departmentCode')
//     .populate('teacher', 'name email mobile')
//     .skip(skip)
//     .limit(parseInt(limit))
//     .sort({ createdAt: -1 });

//   const totalSubjects = await Subject.countDocuments(filter);
//   const totalPages = Math.ceil(totalSubjects / limit);

//   res.status(200).json(
//     new ApiResponse(200, {
//       subjects,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages,
//         totalSubjects,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1
//       }
//     }, 'Subjects fetched successfully')
//   );
// });

// // Get subject by ID
// export const getSubjectById = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const subject = await Subject.findById(id)
//     .populate('semester', 'semesterName semesterNumber')
//     .populate('department', 'departmentName departmentCode')
//     .populate('teacher', 'name email mobile');

//   if (!subject) {
//     throw new ApiError(404, 'Subject not found');
//   }

//   res.status(200).json(
//     new ApiResponse(200, subject, 'Subject fetched successfully')
//   );
// });

// // Create subject
// export const createSubject = asyncHandler(async (req, res) => {
//   const {
//     subjectName,
//     semesterId,
//     departmentId,
//     teacherId,
//     lecturePerWeek,
//     type,
//     credits,
//     syllabus
//   } = req.body;

//   if (!subjectName || !semesterId || !departmentId || !teacherId || !lecturePerWeek || !type) {
//     throw new ApiError(400, 'All required fields must be provided');
//   }

//   const semester = await Semester.findById(semesterId);
//   if (!semester) throw new ApiError(404, 'Semester not found');

//   const department = await Department.findById(departmentId);
//   if (!department) throw new ApiError(404, 'Department not found');

//   const teacher = await Teacher.findById(teacherId);
//   if (!teacher) throw new ApiError(404, 'Teacher not found');

//   const existingSubject = await Subject.findOne({
//     subjectName: subjectName.trim(),
//     semesterId,
//     departmentId,
//     isActive: true
//   });

//   if (existingSubject) {
//     throw new ApiError(400, 'Subject already exists for this semester and department');
//   }

//   const subject = await Subject.create({
//     subjectName: subjectName.trim(),
//     semesterId,
//     departmentId,
//     teacherId,
//     lecturePerWeek,
//     type: type.toLowerCase(),
//     credits,
//     syllabus
//   });

//   const populatedSubject = await Subject.findById(subject._id)
//     .populate('semester', 'semesterName semesterNumber')
//     .populate('department', 'departmentName departmentCode')
//     .populate('teacher', 'name email mobile');

//   res.status(201).json(
//     new ApiResponse(201, populatedSubject, 'Subject created successfully')
//   );
// });

// // Update subject
// export const updateSubject = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   const subject = await Subject.findById(id);
//   if (!subject) throw new ApiError(404, 'Subject not found');

//   if (updateData.semesterId) {
//     const semester = await Semester.findById(updateData.semesterId);
//     if (!semester) throw new ApiError(404, 'Semester not found');
//   }

//   if (updateData.departmentId) {
//     const department = await Department.findById(updateData.departmentId);
//     if (!department) throw new ApiError(404, 'Department not found');
//   }

//   if (updateData.teacherId) {
//     const teacher = await Teacher.findById(updateData.teacherId);
//     if (!teacher) throw new ApiError(404, 'Teacher not found');
//   }

//   if (updateData.subjectName && updateData.subjectName !== subject.subjectName) {
//     const existingSubject = await Subject.findOne({
//       subjectName: updateData.subjectName.trim(),
//       semesterId: updateData.semesterId || subject.semesterId,
//       departmentId: updateData.departmentId || subject.departmentId,
//       isActive: true,
//       _id: { $ne: id }
//     });

//     if (existingSubject) {
//       throw new ApiError(400, 'Subject with this name already exists for the semester and department');
//     }
//   }

//   const updatedSubject = await Subject.findByIdAndUpdate(
//     id,
//     { ...updateData, updatedAt: Date.now() },
//     { new: true, runValidators: true }
//   )
//     .populate('semester', 'semesterName semesterNumber')
//     .populate('department', 'departmentName departmentCode')
//     .populate('teacher', 'name email mobile');

//   res.status(200).json(
//     new ApiResponse(200, updatedSubject, 'Subject updated successfully')
//   );
// });

// // Delete subject (soft delete)
// export const deleteSubject = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const subject = await Subject.findById(id);
//   if (!subject) throw new ApiError(404, 'Subject not found');

//   subject.isActive = false;
//   await subject.save();

//   res.status(200).json(
//     new ApiResponse(200, null, 'Subject deleted successfully')
//   );
// });

// // Get subjects by department
// export const getSubjectsByDepartment = asyncHandler(async (req, res) => {
//   const { departmentId } = req.params;

//   const subjects = await Subject.find({ departmentId, isActive: true });

//   res.status(200).json(
//     new ApiResponse(200, subjects, 'Department subjects fetched successfully')
//   );
// });

// // Get subjects by semester
// export const getSubjectsBySemester = asyncHandler(async (req, res) => {
//   const { semesterId } = req.params;

//   const subjects = await Subject.find({ semesterId, isActive: true });

//   res.status(200).json(
//     new ApiResponse(200, subjects, 'Semester subjects fetched successfully')
//   );
// });

// // Get subjects by teacher
// export const getSubjectsByTeacher = asyncHandler(async (req, res) => {
//   const { teacherId } = req.params;

//   const subjects = await Subject.find({ teacherId, isActive: true });

//   res.status(200).json(
//     new ApiResponse(200, subjects, 'Teacher subjects fetched successfully')
//   );
// });

// // Get subject statistics
// export const getSubjectStats = asyncHandler(async (req, res) => {
//   const totalSubjects = await Subject.countDocuments({ isActive: true });
//   const theorySubjects = await Subject.countDocuments({ type: 'theory', isActive: true });
//   const practicalSubjects = await Subject.countDocuments({ type: 'practical', isActive: true });
//   const tutorialSubjects = await Subject.countDocuments({ type: 'tutorial', isActive: true });

//   const subjectsByDepartment = await Subject.aggregate([
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

//   const stats = {
//     totalSubjects,
//     subjectsByType: {
//       theory: theorySubjects,
//       practical: practicalSubjects,
//       tutorial: tutorialSubjects
//     },
//     subjectsByDepartment
//   };

//   res.status(200).json(
//     new ApiResponse(200, stats, 'Subject statistics fetched successfully')
//   );
// });


// import Subject from '../models/subject.model.js';
// import Semester from '../models/semester.model.js';
// import Department from '../models/department.model.js';
// import Teacher from '../models/teacher.model.js';
// import ApiError from '../utils/ApiError.js';
// import { ApiResponse } from '../utils/response.js';
// import asyncHandler from '../utils/async-handler.js';

// // Get all subjects with populated data
// export const getAllSubjects = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10, search, department_id, sem_id, teacher_id, type } = req.query;

//   const filter = { isActive: true };
  
//   // Search functionality
//   if (search) {
//     filter.$or = [
//       { subjectName: { $regex: search, $options: 'i' } },
//       { subject_code: { $regex: search, $options: 'i' } }
//     ];
//   }
  
//   if (department_id) filter.department_id = department_id;
//   if (sem_id) filter.sem_id = sem_id;
//   if (teacher_id) filter.teacher_id = teacher_id;
//   if (type) filter.type = type;

//   const skip = (page - 1) * limit;

//   const subjects = await Subject.find(filter)
//     .populate('sem_id', 'semesterName semesterNumber')
//     .populate('department_id', 'departmentName departmentCode')
//     .populate('teacher_id', 'name email mobile')
//     .skip(skip)
//     .limit(parseInt(limit))
//     .sort({ createdAt: -1 });

//   const totalSubjects = await Subject.countDocuments(filter);
//   const totalPages = Math.ceil(totalSubjects / limit);

//   res.status(200).json(
//     new ApiResponse(200, {
//       subjects,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages,
//         totalSubjects,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1
//       }
//     }, 'Subjects fetched successfully')
//   );
// });

// // Get subject by ID
// export const getSubjectById = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const subject = await Subject.findById(id)
//     .populate('sem_id', 'semesterName semesterNumber')
//     .populate('department_id', 'departmentName departmentCode')
//     .populate('teacher_id', 'name email mobile');

//   if (!subject) {
//     throw new ApiError(404, 'Subject not found');
//   }

//   res.status(200).json(
//     new ApiResponse(200, subject, 'Subject fetched successfully')
//   );
// });

// // Create subject
// export const createSubject = asyncHandler(async (req, res) => {
//   console.log('👉 [SubjectController] Incoming createSubject request:', req.body);
//   const {
//     subjectName,
//     subject_code,
//     sem_id,
//     department_id,
//     teacher_id,
//     lecturePerWeek,
//     type,
//     credits,
//     syllabus
//   } = req.body;

//   if (!subjectName || !subject_code || !sem_id || !department_id || !teacher_id || !lecturePerWeek || !type) {
//     throw new ApiError(400, 'All required fields must be provided');
//   }

//   const semester = await Semester.findById(sem_id);
//   if (!semester) throw new ApiError(404, 'Semester not found');

//   const department = await Department.findById(department_id);
//   if (!department) throw new ApiError(404, 'Department not found');

//   const teacher = await Teacher.findById(teacher_id);
//   if (!teacher) throw new ApiError(404, 'Teacher not found');

//   // Check for duplicate subject
//   const existingSubject = await Subject.findOne({
//     $or: [
//       { subjectName: subjectName.trim(), sem_id, department_id, isActive: true },
//       { subject_code: subject_code.trim(), isActive: true }
//     ]
//   });

//   if (existingSubject) {
//     throw new ApiError(400, 'Subject with this name or code already exists');
//   }

//   const subject = await Subject.create({
//     subjectName: subjectName.trim(),
//     subject_code: subject_code.trim().toUpperCase(),
//     sem_id,
//     department_id,
//     teacher_id,
//     lecturePerWeek,
//     type: type.toLowerCase(),
//     credits,
//     syllabus
//   });

//   const populatedSubject = await Subject.findById(subject._id)
//     .populate('sem_id', 'semesterName semesterNumber')
//     .populate('department_id', 'departmentName departmentCode')
//     .populate('teacher_id', 'name email mobile');

//   res.status(201).json(
//     new ApiResponse(201, populatedSubject, 'Subject created successfully')
//   );
// });

// // Update subject
// export const updateSubject = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   const subject = await Subject.findById(id);
//   if (!subject) throw new ApiError(404, 'Subject not found');

//   if (updateData.sem_id) {
//     const semester = await Semester.findById(updateData.sem_id);
//     if (!semester) throw new ApiError(404, 'Semester not found');
//   }

//   if (updateData.department_id) {
//     const department = await Department.findById(updateData.department_id);
//     if (!department) throw new ApiError(404, 'Department not found');
//   }

//   if (updateData.teacher_id) {
//     const teacher = await Teacher.findById(updateData.teacher_id);
//     if (!teacher) throw new ApiError(404, 'Teacher not found');
//   }

//   // Check for duplicate when updating
//   if (updateData.subjectName || updateData.subject_code) {
//     const duplicateCheck = {};
//     if (updateData.subjectName) {
//       duplicateCheck.subjectName = updateData.subjectName.trim();
//       duplicateCheck.sem_id = updateData.sem_id || subject.sem_id;
//       duplicateCheck.department_id = updateData.department_id || subject.department_id;
//     }
//     if (updateData.subject_code) {
//       duplicateCheck.subject_code = updateData.subject_code.trim().toUpperCase();
//     }

//     const existingSubject = await Subject.findOne({
//       ...duplicateCheck,
//       isActive: true,
//       _id: { $ne: id }
//     });

//     if (existingSubject) {
//       throw new ApiError(400, 'Subject with this name or code already exists');
//     }
//   }

//   // Format update data
//   if (updateData.subjectName) updateData.subjectName = updateData.subjectName.trim();
//   if (updateData.subject_code) updateData.subject_code = updateData.subject_code.trim().toUpperCase();
//   if (updateData.type) updateData.type = updateData.type.toLowerCase();

//   const updatedSubject = await Subject.findByIdAndUpdate(
//     id,
//     { ...updateData, updatedAt: Date.now() },
//     { new: true, runValidators: true }
//   )
//     .populate('sem_id', 'semesterName semesterNumber')
//     .populate('department_id', 'departmentName departmentCode')
//     .populate('teacher_id', 'name email mobile');

//   res.status(200).json(
//     new ApiResponse(200, updatedSubject, 'Subject updated successfully')
//   );
// });

// // Delete subject (soft delete)
// export const deleteSubject = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const subject = await Subject.findById(id);
//   if (!subject) throw new ApiError(404, 'Subject not found');

//   subject.isActive = false;
//   await subject.save();

//   res.status(200).json(
//     new ApiResponse(200, null, 'Subject deleted successfully')
//   );
// });

// // Get subjects by department
// export const getSubjectsByDepartment = asyncHandler(async (req, res) => {
//   const { departmentId } = req.params;

//   const subjects = await Subject.find({ department_id: departmentId, isActive: true })
//     .populate('sem_id', 'semesterName semesterNumber')
//     .populate('teacher_id', 'name email');

//   res.status(200).json(
//     new ApiResponse(200, subjects, 'Department subjects fetched successfully')
//   );
// });

// // Get subjects by semester
// export const getSubjectsBySemester = asyncHandler(async (req, res) => {
//   const { semesterId } = req.params;

//   const subjects = await Subject.find({ sem_id: semesterId, isActive: true })
//     .populate('department_id', 'departmentName departmentCode')
//     .populate('teacher_id', 'name email');

//   res.status(200).json(
//     new ApiResponse(200, subjects, 'Semester subjects fetched successfully')
//   );
// });

// // Get subjects by teacher
// export const getSubjectsByTeacher = asyncHandler(async (req, res) => {
//   const { teacherId } = req.params;

//   const subjects = await Subject.find({ teacher_id: teacherId, isActive: true })
//     .populate('sem_id', 'semesterName semesterNumber')
//     .populate('department_id', 'departmentName departmentCode');

//   res.status(200).json(
//     new ApiResponse(200, subjects, 'Teacher subjects fetched successfully')
//   );
// });

// // Get subjects for select dropdown
// export const getSubjectsForSelect = asyncHandler(async (req, res) => {
//   const subjects = await Subject.find({ isActive: true })
//     .select('_id subjectName subject_code')
//     .sort({ subjectName: 1 });

//   res.status(200).json(
//     new ApiResponse(200, subjects, 'Subjects for select fetched successfully')
//   );
// });

// // Get subject statistics
// export const getSubjectStats = asyncHandler(async (req, res) => {
//   const totalSubjects = await Subject.countDocuments({ isActive: true });
//   const theorySubjects = await Subject.countDocuments({ type: 'theory', isActive: true });
//   const practicalSubjects = await Subject.countDocuments({ type: 'practical', isActive: true });
//   const tutorialSubjects = await Subject.countDocuments({ type: 'tutorial', isActive: true });

//   const subjectsByDepartment = await Subject.aggregate([
//     { $match: { isActive: true } },
//     {
//       $lookup: {
//         from: 'departments',
//         localField: 'department_id',
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

//   const stats = {
//     totalSubjects,
//     subjectsByType: {
//       theory: theorySubjects,
//       practical: practicalSubjects,
//       tutorial: tutorialSubjects
//     },
//     subjectsByDepartment
//   };

//   res.status(200).json(
//     new ApiResponse(200, stats, 'Subject statistics fetched successfully')
//   );
// });
import Subject from '../models/subject.model.js';

export const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const { search = '', department_id, sem_id, teacher_id, type, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) query.$or = [
      { subjectName: new RegExp(search, 'i') },
      { subject_code: new RegExp(search, 'i') }
    ];
    if (department_id) query.department_id = department_id;
    if (sem_id) query.sem_id = sem_id;
    if (teacher_id) query.teacher_id = teacher_id;
    if (type) query.type = type;

    const subjects = await Subject.find(query)
      .populate('department_id')
      .populate('teacher_id')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Subject.countDocuments(query);
    res.json({
      success: true,
      data: {
        subjects,
        pagination: {
          page: Number(page),
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ success: false, message: 'Error fetching subjects' });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, data: subject });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, message: 'Subject deleted' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ success: false, message: 'Error deleting subject' });
  }
};

export const getSubjectStats = async (req, res) => {
  try {
    const totalSubjects = await Subject.countDocuments();
    const subjectsByTypeAgg = await Subject.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    const subjectsByType = {};
    subjectsByTypeAgg.forEach(t => {
      subjectsByType[t._id] = t.count;
    });
    res.json({ success: true, data: { totalSubjects, subjectsByType } });
  } catch (error) {
    console.error('Error fetching subject stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};
