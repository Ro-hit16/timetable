import Teacher from '../models/teacher.model.js';
import Department from '../models/department.model.js';
import multer from 'multer';
import fs from 'fs';
import XLSX from 'xlsx';
import { creatActivity } from './activity.controller.js';
// ---------------- Existing Controllers ----------------

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('department', 'departmentName');
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching teachers', error: error.message });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('department', 'departmentName');
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching teacher', error: error.message });
  }
};

// Create teacher
export const createTeacher = async (req, res) => {
  try {
    const { name, email, department, semester } = req.body;
    const departmentExists = await Department.findById(department);
    if (!departmentExists) return res.status(400).json({ success: false, message: 'Department not found' });

    const teacher = new Teacher({ name, email, department, semester });
    await teacher.save();
    await teacher.populate('department', 'departmentName');
        
    //create recent activity 
    await creatActivity({type:'teacher',action:'teacher added',details:{name,email,department}});
    
    res.status(201).json({ success: true, message: 'Teacher created successfully', data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating teacher', error: error.message });
  }
};

// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const { name, department, semester } = req.body;
    if (department) {
      const departmentExists = await Department.findById(department);
      if (!departmentExists) return res.status(400).json({ success: false, message: 'Department not found' });
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name, department, semester },
      { new: true, runValidators: true }
    ).populate('department', 'departmentName');

    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    res.status(200).json({ success: true, message: 'Teacher updated successfully', data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating teacher', error: error.message });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    res.status(200).json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting teacher', error: error.message });
  }
};

// ---------------- Upload Teachers via Excel (.xlsx / .xls) ----------------

// Multer setup
const upload = multer({ dest: 'uploads/' });
export const uploadMiddleware = upload.single('file');

// Reads a row's value for a given column name, matching case-insensitively
// and trimming surrounding whitespace, so minor header variations (e.g.
// "email" vs "Email", or a trailing space) don't silently drop rows.
const getRowValue = (row, columnName) => {
  const matchedKey = Object.keys(row).find(
    (key) => key.trim().toLowerCase() === columnName.toLowerCase()
  );
  return matchedKey ? String(row[matchedKey]).trim() : '';
};

// Handle Excel Upload + Teacher Extraction. Expects a header row with
// columns: Name, Email, Department, Semester (matching the frontend's
// downloadable sample template exactly).
export const uploadTeachersFromExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    console.log('✅ File received:', req.file);

    const workbook = XLSX.readFile(req.file.path);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // defval: '' ensures a blank cell becomes an empty string rather than
    // being omitted from the row object entirely.
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    console.log('📄 Extracted rows:', rows.length);

    let createdTeachers = [];
    for (const row of rows) {
      const name = getRowValue(row, 'Name');
      const email = getRowValue(row, 'Email');
      const deptName = getRowValue(row, 'Department');
      const semester = getRowValue(row, 'Semester');

      if (!name || !deptName) continue;

      let department = await Department.findOne({ departmentName: deptName });
      if (!department) {
        department = await Department.create({ departmentName: deptName, departmentCode: deptName.substring(0, 3).toUpperCase() });
        console.log('ℹ️ Created new department:', deptName);
      }

      const teacher = new Teacher({ name, email, department: department._id, semester });
      await teacher.save();
      createdTeachers.push(teacher);
    }

    fs.unlinkSync(req.file.path); // cleanup
    console.log('✅ Uploaded file deleted');

    res.status(201).json({ success: true, message: 'Teachers uploaded successfully', data: createdTeachers });

  } catch (error) {
    console.error('❌ Excel upload error:', error);
    res.status(500).json({ success: false, message: 'Error processing Excel file', error: error.message });
  }
}; 