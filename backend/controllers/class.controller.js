// import Class from '../models/class.model.js';

// export const getAllClasses = async (req, res) => {
//   try {
//     const classes = await Class.find();
//     res.json(classes);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch classes' });
//   }
// };
// export const deleteAllClasses = async (req, res) => {
//   try {
//     await Class.deleteMany({});
//     res.json({ message: 'All classes deleted' });
//   } catch (error) {
//     //console.error('Error deleting all classes:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// //   try {
// //     const { className, classNumber } = req.body;
// //     const newClass = new Class({ className, classNumber });
// //     await newClass.save();
// //     res.status(201).json(newClass);
// //   } catch (err) {
// //     res.status(400).json({ message: 'Failed to create class' });
// //   }
// // };
// export const createClass = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { className, classNumber, department_id, semester } = req.body;
     
     
//     if (!className || !classNumber || !department_id || !semester) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const newClass = new Class({
//       className,
//       classNumber,
//       department_id,
//       semester
//     });

//     await newClass.save();
//     res.status(201).json(newClass);
//   } catch (err) {
//     console.error('Error creating class:', err);
//     res.status(400).json({ message: 'Failed to create class' });
//   }
// };


// export const updateClass = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { className, classNumber, department_id, semester } = req.body;
//     const updatedClass = await Class.findByIdAndUpdate(id, { className, classNumber, department_id, semester }, { new: true });
//     res.json(updatedClass);
//   } catch (err) {
//     res.status(400).json({ message: 'Failed to update class' });
//   }
// };

// export const deleteClass = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Class.findByIdAndDelete(id);
//     res.json({ message: 'Class deleted' });
//   } catch (err) {
//     res.status(400).json({ message: 'Failed to delete class' });
//   }
// };




import Class from '../models/class.model.js';
import Department from '../models/department.model.js';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import multer from 'multer';
import path from 'path';

// ---------------- Multer setup ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  },
});

export const uploadMiddleware = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
}).single('file');

// ---------------- Class Controllers ----------------

// GET all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};

// DELETE all classes
export const deleteAllClasses = async (req, res) => {
  try {
    await Class.deleteMany({});
    res.json({ message: 'All classes deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE a class
export const createClass = async (req, res) => {
  try {
    const { className, classNumber, department_id, semester } = req.body;

    if (!className || !classNumber || !department_id || !semester) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newClass = new Class({
      className,
      classNumber,
      department_id,
      semester,
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    console.error('Error creating class:', err);
    res.status(400).json({ message: 'Failed to create class' });
  }
};

// UPDATE a class
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, classNumber, department_id, semester } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { className, classNumber, department_id, semester },
      { new: true }
    );

    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update class' });
  }
};

// DELETE a single class
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await Class.findByIdAndDelete(id);
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete class' });
  }
};

// ---------------- PDF Upload Logic ----------------
export const uploadClassesFromPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;

    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l);

    for (const line of lines) {
      // Expected format: ClassName - ClassNumber - DepartmentName - Semester
      const parts = line.split(' - ').map((p) => p.trim());
      if (parts.length !== 4) continue;

      const [className, classNumber, deptName, semester] = parts;

      // Find or create Department
      let dept = await Department.findOne({ departmentName: deptName });
      if (!dept) {
        const words = deptName.trim().split(' ');
        let deptCode;

        if (words.length === 1) {
          deptCode = words[0].slice(0, 2).toUpperCase(); // first 2 letters
        } else {
          deptCode = words.slice(0, 2).map((w) => w[0].toUpperCase()).join('');
        }

        dept = new Department({
          departmentName: deptName,
          departmentCode: deptCode,
        });

        await dept.save();
        console.log(`Department ${deptName} saved with ID: ${dept._id}`);
      }

      // Create Class
      const newClass = new Class({
        className,
        classNumber,
        department_id: dept._id,
        semester,
      });

      await newClass.save();
    }

    // Clean up uploaded PDF
    fs.unlinkSync(req.file.path);

    res.json({ message: 'Classes uploaded successfully' });
  } catch (err) {
    console.error('Error uploading classes from PDF:', err);
    res
      .status(500)
      .json({ message: 'Failed to upload classes', error: err.message });
  }
};
