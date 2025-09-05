// import pdfParse from 'pdf-parse';
// import Teacher from '../models/teacher.model.js';
// import Subject from '../models/subject.model.js';
// //import Class from '../models/';

// export const handlePdfUpload = async (req, res) => {
//   try {
//     const buffer = req.file.buffer;
//     const data = await pdfParse(buffer);
//     const text = data.text;

//     const blocks = text.split('\n\n').filter(b => b.includes('Prof.'));
    
//     for (const block of blocks) {
//       const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
//       const teacherLine = lines.find(line => line.startsWith('Prof.'));
//       if (!teacherLine) continue;

//       const teacherName = teacherLine.replace('Prof.', '').trim();
//       const teacher = await Teacher.findOneAndUpdate(
//         { name: teacherName },
//         { name: teacherName },
//         { upsert: true, new: true }
//       );

//       // Process workload lines
//       for (const line of lines) {
//         if (line.includes(',') || line.startsWith('Prof.')) continue;

//         const match = line.match(/(.+?)\s+(.+?)\s+([0-9\-*]*)/); // class + subject + LPT info
//         if (!match) continue;

//         const [_, className, subjectName] = match;
//         const lptLine = lines.find(l => l.includes('L') && l.includes('P'));
//         const lMatch = lptLine?.match(/(\d+)\s+(\d+)\s+(\d+)/);
//         const lecturesPerWeek = lMatch
//           ? +lMatch[1] + +lMatch[2] + +lMatch[3]
//           : 0;

//         const cls = await Class.findOneAndUpdate(
//           { name: className.trim() },
//           { name: className.trim() },
//           { upsert: true, new: true }
//         );

//         await Subject.create({
//           name: subjectName.trim(),
//           class: cls._id,
//           teacher: teacher._id,
//           lecturesPerWeek,
//         });
//       }
//     }

//     res.status(200).json({ message: 'PDF processed successfully.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to process PDF.' });
//   }
// };

// controllers/pdfController.js
// controllers/pdfController.js
import pdfParse from 'pdf-parse';
import Teacher from '../models/teacher.model.js';
import Subject from '../models/subject.model.js';

import Department from '../models/department.model.js';
import asyncHandler from '../utils/async-handler.js';
import ApiError from '../utils/ApiError.js';

export const handlePdfUpload = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer) {
    throw new ApiError(400, 'PDF file is missing');
  }

  const data = await pdfParse(req.file.buffer);
  const text = data.text;

  const blocks = text
    .split('\n')
    .filter(line => line.toLowerCase().includes('prof.'));

  let insertedSubjects = [];

  for (let line of blocks) {
    const parts = line.trim().split(/\s{2,}|\t+/);
    if (parts.length < 4) continue;

    const [teacherName, subjectName, subjectTypeRaw, lecturePerWeekRaw] = parts;
    const subjectType = subjectTypeRaw.toLowerCase();
    const lecturePerWeek = parseInt(lecturePerWeekRaw);

    if (!['theory', 'practical', 'tutorial'].includes(subjectType)) continue;
    if (isNaN(lecturePerWeek)) continue;

    // Find or create teacher
    let teacher = await Teacher.findOne({ name: teacherName.trim() });
    if (!teacher) {
      teacher = await Teacher.create({
        name: teacherName.trim(),
        email: `${teacherName.replace(/\s+/g, '').toLowerCase()}@college.edu`,
        password: 'password123',
        mobile: '9999999999',
        address: 'Default Address',
        departmentId: (await Department.findOne() || {})._id, // default department
      });
    }

    // Use first active semester for default placement
    const semester = await Semester.findOne({ isActive: true });
    if (!semester) throw new ApiError(404, 'No active semester found');

    const subject = await Subject.create({
      subjectName: subjectName.trim(),
      subject_code: subjectName.trim().slice(0, 6).toUpperCase() + Math.floor(Math.random() * 100),
      type: subjectType,
      lecturePerWeek,
      credits: 3,
      semesterId: semester._id,
      departmentId: semester.departmentId,
      teacherId: teacher._id,
    });

    insertedSubjects.push(subject);
  }

  res.status(201).json({
    success: true,
    message: `${insertedSubjects.length} subjects added successfully`,
    data: insertedSubjects,
  });
});
