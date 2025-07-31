// // routes/studentRoutes.js
// import express from 'express';
// import multer from 'multer';
// import { getStudents, deleteStudent,addStudent, getSubjectsBySemester  } from '../controllers/students.controller.js';

// const router = express.Router();

// // GET /api/students - Get all students  
// router.get('/', getStudents);

// // DELETE /api/students/:id - Delete student
// router.delete('/:id', deleteStudent);

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Directory for uploaded files
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname); // Use original file name
//     }
// });
// const upload = multer({ storage });
// // Route to add a new student
// router.post('/', upload.single('pic'), addStudent);
// // Route to get subjects by semester
// router.get('/subjects/:id', getSubjectsBySemester);

// export default router;

import express from 'express';
import multer from 'multer';
import { 
  getStudents, 
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  exportStudents,
  getStudentsByDepartment,
  getStudentsBySemester
} from '../controllers/students.controller.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/'); // Temporary directory for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Routes
router.get('/', getStudents);                                    // GET /api/students
router.get('/export', exportStudents);                          // GET /api/students/export
router.get('/department/:departmentId', getStudentsByDepartment); // GET /api/students/department/:departmentId
router.get('/semester/:semesterId', getStudentsBySemester);      // GET /api/students/semester/:semesterId
router.get('/:id', getStudentById);                             // GET /api/students/:id
router.post('/', upload.single('pic'), createStudent);          // POST /api/students
router.put('/:id', upload.single('pic'), updateStudent);        // PUT /api/students/:id
router.delete('/:id', deleteStudent);                           // DELETE /api/students/:id

export default router;