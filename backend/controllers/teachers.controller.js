import Teacher from '../models/teacher.model.js';
import Department from '../models/department.model.js';
import multer from 'multer';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
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

// ---------------- Upload Teachers via PDF or Scanned PDF ----------------

// Multer setup
const upload = multer({ dest: 'uploads/' });
export const uploadMiddleware = upload.single('file');

// Handle PDF Upload + Teacher Extraction with pdf-parse + Tesseract OCR
export const uploadTeachersFromPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    console.log('✅ File received:', req.file);

    const pdfBuffer = fs.readFileSync(req.file.path);
    let extractedText = '';

    try {
      // Try parsing text PDF
      const pdfData = await pdfParse(pdfBuffer);
      extractedText = pdfData.text;
      console.log('✅ PDF parsed via pdf-parse, text length:', extractedText.length);
    } catch (err) {
      console.warn('⚠️ pdf-parse failed, falling back to OCR...', err);
    }

    // If pdf-parse failed or returned empty text, use OCR
    if (!extractedText || extractedText.trim().length === 0) {
      console.log('🔎 Using Tesseract OCR for scanned PDF...');
      const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng', { logger: m => console.log(m) });
      extractedText = text;
      console.log('✅ OCR completed, text length:', extractedText.length);
    }

    // Split lines robustly
    const lines = extractedText.split(/\r?\n|\r|\n/).map(line => line.trim()).filter(Boolean);
    console.log('📄 Extracted lines:', lines);

    let createdTeachers = [];
    for (let line of lines) {
      // Expect: Name - Email - Department - Semester
      const [name, email, deptName, semester] = line.split('-').map(x => x?.trim());
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
    console.error('❌ PDF upload error:', error);
    res.status(500).json({ success: false, message: 'Error processing PDF', error: error.message });
  }
};
