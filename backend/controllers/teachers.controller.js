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

// Matches the same email pattern enforced by the Teacher model
// (models/teacher.model.js) so a row is rejected here with a clear,
// per-row reason instead of surfacing as an opaque Mongoose
// ValidationError later.
const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// Handle Excel Upload + Teacher Extraction. Expects a header row with
// columns: Name, Email, Department, Semester (matching the frontend's
// downloadable sample template exactly).
//
// Every row is validated independently and a per-row error is recorded
// instead of throwing, so one bad row can no longer abort the entire
// batch (previously, a Mongoose validation error such as an invalid
// semester would throw inside the loop and turn into a generic 500 for
// the whole upload, discarding every teacher already created earlier in
// the same file). Unknown departments are now reported as an error
// ("Unknown Department") rather than being silently auto-created, since
// silently creating departments from typos was a data-quality risk and
// is not something the bulk upload feature is meant to do.
export const uploadTeachersFromExcel = async (req, res) => {
  let filePath;
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    filePath = req.file.path;

    const workbook = XLSX.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // defval: '' ensures a blank cell becomes an empty string rather than
    // being omitted from the row object entirely.
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    const createdTeachers = [];
    const errors = [];
    const emailsSeenInFile = new Set();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // +2 accounts for the header row plus 1-based row numbering, so this
      // matches the row number a user would see if they opened the sheet.
      const rowNumber = i + 2;

      const name = getRowValue(row, 'Name');
      const emailRaw = getRowValue(row, 'Email');
      const email = emailRaw.toLowerCase();
      const deptName = getRowValue(row, 'Department');
      const semesterRaw = getRowValue(row, 'Semester');

      // Silently skip fully blank rows (e.g. trailing empty rows in the sheet).
      if (!name && !emailRaw && !deptName && !semesterRaw) continue;

      const recordError = (reason) => errors.push({ row: rowNumber, name: name || undefined, email: emailRaw || undefined, reason });

      if (!name) {
        recordError('Missing Name');
        continue;
      }
      if (!emailRaw) {
        recordError('Missing Email');
        continue;
      }
      if (!EMAIL_PATTERN.test(email)) {
        recordError('Invalid Email');
        continue;
      }
      if (emailsSeenInFile.has(email)) {
        recordError('Duplicate Email');
        continue;
      }
      emailsSeenInFile.add(email);

      const semester = parseInt(semesterRaw, 10);
      if (!semesterRaw || Number.isNaN(semester) || semester < 1 || semester > 8) {
        recordError('Invalid Semester');
        continue;
      }

      const department = await Department.findOne({ departmentName: deptName });
      if (!department) {
        recordError('Unknown Department');
        continue;
      }

      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        recordError('Duplicate Email');
        continue;
      }

      try {
        const teacher = new Teacher({ name, email, department: department._id, semester });
        await teacher.save();
        createdTeachers.push(teacher);
      } catch (err) {
        recordError(err.message || 'Failed to create teacher');
      }
    }

    if (createdTeachers.length > 0) {
      await creatActivity({
        type: 'teacher',
        action: 'teachers bulk uploaded',
        details: { createdCount: createdTeachers.length, errorCount: errors.length, totalRows: rows.length },
      });
    }

    res.status(201).json({
      success: true,
      message: `Processed ${rows.length} row(s): ${createdTeachers.length} created, ${errors.length} failed`,
      data: createdTeachers,
      summary: {
        totalRows: rows.length,
        createdCount: createdTeachers.length,
        errorCount: errors.length,
        errors,
      },
    });
  } catch (error) {
    console.error('❌ Excel upload error:', error);
    res.status(500).json({ success: false, message: 'Error processing Excel file', error: error.message });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // cleanup temp upload regardless of success/failure
    }
  }
};