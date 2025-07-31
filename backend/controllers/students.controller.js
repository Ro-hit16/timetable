// // controllers/studentController.js
// import Student from '../models/student.model.js';

// // Get all students with populated department and semester
// export const getStudents = async (req, res) => {
//   try {
//     const students = await Student.find()
//       .populate('department_id', 'department_name')
//       .populate('sem_id', 'semester_name');
    
//     res.json({ success: true, data: students });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Delete student
// // export const deleteStudent = async (req, res) => {
// //   try {
// //     await Student.findByIdAndDelete(req.params.id);
// //     res.json({ success: true, message: 'Student deleted successfully' });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// export const deleteStudent = async (req, res) => {
//   try {
//     const { stu_id } = req.params;
//     await Student.findByIdAndDelete(stu_id);
//     res.status(200).json({ message: 'Student deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// import fs from 'fs';
// import path from 'path';

// // Add a new student
// export const addStudent = async (req, res) => {
//     const { stname, eid, p, mobile, address, courseid, s, dob, gen, status } = req.body;
//     const image = req.file ? req.file.filename : null;

//     try {
//         const existingStudent = await Student.findOne({ email: eid, mobile });
//         if (existingStudent) {
//             return res.status(400).json({ message: 'This student already exists' });
//         }

//         const newStudent = new Student({
//             name: stname,
//             email: eid,
//             password: p,
//             mobile,
//             address,
//             courseId: courseid,
//             semesterId: s,
//             dob,
//             picture: image,
//             gender: gen,
//             status
//         });

//         await newStudent.save();

//         // Create directory for student images
//         const studentDir = path.join(__dirname, '../student/image', eid);
//         fs.mkdirSync(studentDir, { recursive: true });

//         // Move uploaded file
//         if (req.file) {
//             fs.renameSync(req.file.path, path.join(studentDir, image));
//         }

//         res.status(201).json({ message: 'Congrats! Your data has been saved!' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error saving student', error });
//     }
// };

// // Get subjects based on semester
// export const getSubjectsBySemester = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const subjects = await Subject.find({ semesterId: id });
//         res.status(200).json(subjects);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching subjects', error });
//     }
// };


// import Student from '../models/student.model.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Get all students with populated department and semester
// export const getStudents = async (req, res) => {
//   try {
//     const students = await Student.find()
//       .populate('department_id', 'department_name')
//       .populate('sem_id', 'semester_name');

//     res.json({ success: true, data: students });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Add a new student
// export const addStudent = async (req, res) => {
//   const {
//     name,
//     eid,
//     password,
//     mob,
//     address,
//     department_id,
//     sem_id,
//     dob,
//     gender,
//     status
//   } = req.body;

//   const pic = req.file ? req.file.filename : null;

//   try {
//     const existingStudent = await Student.findOne({ eid, mob });
//     if (existingStudent) {
//       return res.status(400).json({ message: 'This student already exists' });
//     }

//     const newStudent = new Student({
//       stu_id: Date.now().toString(), // or use UUID if needed
//       name,
//       eid,
//       password,
//       mob,
//       address,
//       department_id,
//       sem_id,
//       dob,
//       pic,
//       gender,
//       status
//     });

//     await newStudent.save();

//     // Create student image directory
//     const studentDir = path.join(__dirname, '../uploads/students', eid);
//     fs.mkdirSync(studentDir, { recursive: true });

//     // Move uploaded file to student folder
//     if (req.file) {
//       fs.renameSync(req.file.path, path.join(studentDir, pic));
//     }

//     res.status(201).json({ message: 'Congrats! Student saved successfully.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving student', error });
//   }
// };

// // Delete student
// export const deleteStudent = async (req, res) => {
//   try {
//     const { stu_id } = req.params;
//     await Student.findByIdAndDelete(stu_id);
//     res.status(200).json({ message: 'Student deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get subjects by semester
// export const getSubjectsBySemester = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const subjects = await Subject.find({ sem_id: id });
//     res.status(200).json(subjects);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching subjects', error });
//   }
// };


import Student from '../models/student.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all students with pagination and filters
export const getStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = '',
      semester = '',
      status = ''
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { eid: { $regex: search, $options: 'i' } },
        { stu_id: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) filter.department_id = department;
    if (semester) filter.sem_id = semester;
    if (status) filter.status = status;

    const students = await Student.find(filter)
      .populate('department_id', 'department_name')
      .populate('sem_id', 'semester_name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({ 
      success: true, 
      students,
      total,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single student by ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id)
      .populate('department_id', 'department_name')
      .populate('sem_id', 'semester_name');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new student
export const createStudent = async (req, res) => {
  const {
    name,
    eid,
    password,
    mobile,
    address,
    department,
    semester,
    dob,
    gender,
    status = 'active'
  } = req.body;

  const pic = req.file ? req.file.filename : null;

  try {
    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ eid }, { mobile }] 
    });
    
    if (existingStudent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student with this email or mobile already exists' 
      });
    }

    const newStudent = new Student({
      stu_id: `STU${Date.now()}`,
      name,
      eid,
      password,
      mobile,
      address,
      department_id: department,
      sem_id: semester,
      dob,
      pic,
      gender,
      status
    });

    await newStudent.save();

    // Create student image directory
    if (pic) {
      const studentDir = path.join(__dirname, '../uploads/students', eid);
      fs.mkdirSync(studentDir, { recursive: true });
      
      // Move uploaded file to student folder
      if (req.file) {
        fs.renameSync(req.file.path, path.join(studentDir, pic));
      }
    }

    res.status(201).json({ 
      success: true, 
      message: 'Student created successfully',
      data: newStudent
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating student', 
      error: error.message 
    });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If department is provided, map it to department_id
    if (updateData.department) {
      updateData.department_id = updateData.department;
      delete updateData.department;
    }
    
    // If semester is provided, map it to sem_id
    if (updateData.semester) {
      updateData.sem_id = updateData.semester;
      delete updateData.semester;
    }

    const student = await Student.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('department_id', 'department_name')
     .populate('sem_id', 'semester_name');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ 
      success: true, 
      message: 'Student updated successfully',
      data: student 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Student deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export students to CSV
export const exportStudents = async (req, res) => {
  try {
    const {
      search = '',
      department = '',
      semester = '',
      status = ''
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { eid: { $regex: search, $options: 'i' } },
        { stu_id: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) filter.department_id = department;
    if (semester) filter.sem_id = semester;
    if (status) filter.status = status;

    const students = await Student.find(filter)
      .populate('department_id', 'department_name')
      .populate('sem_id', 'semester_name');

    // Create CSV content
    const csvHeader = 'Student ID,Name,Email,Mobile,Department,Semester,Status,DOB,Gender\n';
    const csvRows = students.map(student => 
      `${student.stu_id},${student.name},${student.eid},${student.mobile},${student.department_id?.department_name || 'N/A'},${student.sem_id?.semester_name || 'N/A'},${student.status},${student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'},${student.gender || 'N/A'}`
    ).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=students_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get students by department
export const getStudentsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const students = await Student.find({ department_id: departmentId })
      .populate('department_id', 'department_name')
      .populate('sem_id', 'semester_name');
    
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get students by semester
export const getStudentsBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const students = await Student.find({ sem_id: semesterId })
      .populate('department_id', 'department_name')
      .populate('sem_id', 'semester_name');
    
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};