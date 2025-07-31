// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// const router = express.Router();
// import { importLectures } from '../controllers/lectureController.js';
// import Lecture from '../models/Lecture.model.js';

// const upload = multer({ dest: 'uploads/' });

// router.post('/import', upload.single('file'), importLectures);

//   try {
//     const filePath = req.file.path;

//     // Read the uploaded JSON file
//     const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

//     if (!Array.isArray(data)) {
//       return res.status(400).json({ message: 'Uploaded file must contain an array of lectures' });
//     }

//     const saved = await Lecture.insertMany(data);

//     // Cleanup uploaded file
//     fs.unlinkSync(filePath);

//     res.status(201).json({ message: 'Lectures imported successfully', data: saved });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to import lectures' });
//   }
// });

// export default router;



import express from 'express';
import multer from 'multer';
import { importLectures } from '../controllers/lectureController.js';

const router = express.Router();

// Multer config to store uploaded file temporarily in 'uploads' folder
const upload = multer({ dest: 'uploads/' });

// Route to import lectures from uploaded JSON file
router.post('/import', upload.single('file'), importLectures);

export default router;
