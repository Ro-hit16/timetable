

//  import Timetable from '../models/timetable.model.js';
// import { validationResult } from 'express-validator';
// import { createError } from '../utils/error.js';
// import subjectModel from '../models/subject.model.js';
// import teacherModel from '../models/teacher.model.js';
// import { log } from 'console';

// class TimetableController {



// // working code
// // static async generateTimetable(req, res, next) {
// //   try {

// //     console.log('📥 Incoming data:', req.body);
// //     const {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions,
// //       subjects,
// //       teachers,
// //       classes
// //     } = req.body;

// //     if (!departmentId || !semester || !academicYear || !divisions?.length || !subjects || !teachers || !classes) {
// //       return next(createError(400, "Missing required fields"));
// //     }

// //     const formattedDivisions = divisions.map((divisionName) => {
// //       const schedule = {
// //         Monday: Array(8).fill(null),
// //         Tuesday: Array(8).fill(null),
// //         Wednesday: Array(8).fill(null),
// //         Thursday: Array(8).fill(null),
// //         Friday: Array(8).fill(null)
// //       };

// //       const divisionClasses = classes.filter(
// //         (cls) => cls.division?.toLowerCase() === divisionName.toLowerCase()
// //       );

// //       divisionClasses.forEach((cls) => {
// //         const { day, period, subject, teacher, classroom } = cls;

// //         if (schedule[day] && period >= 1 && period <= 8) {
// //           schedule[day][period - 1] = {
// //             period: Number(period),
// //             subject: subjects.find((s) => s._id === subject || s._id == subject),
// //             teacher: teachers.find((t) => t._id === teacher || t._id == teacher),
// //             classroom: String(classroom)
// //           };
// //         }
// //       });

// //       return {
// //         division_name: divisionName,
// //         schedule
// //       };
// //     });

// //     const timetable = {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions: formattedDivisions,
// //       subjects,
// //       teachers,
// //       status: 'draft',
// //       createdAt: new Date(),
// //       updatedAt: new Date()
// //     };

// //     const newTimetable = new Timetable(timetable);
// //     await newTimetable.save();

// //     res.status(201).json({
// //       success: true,
// //       data: newTimetable,
// //       message: 'Timetable generated successfully'
// //     });

// //   } catch (error) {
// //     console.error('❌ Error generating timetable:', error);
// //     next(createError(500, 'Failed to generate timetable'));
// //   }
// // }

// // static async generateTimetable(req, res, next) {
// //   try {
// //     console.log('📥 Incoming data:', req.body);
// //     const {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions,
// //       subjects,
// //       teachers,
// //       classes
// //     } = req.body;

// //     if (
// //       !departmentId || !semester || !academicYear ||
// //       !divisions?.length || !subjects || !teachers || !classes
// //     ) {
// //       return next(createError(400, "Missing required fields"));
// //     }

// //     // ✅ Extract subjects array from nested structure
// //     const subjectList = subjects.subjects || [];

// //     const formattedDivisions = divisions.map((divisionName) => {
// //       const schedule = {
// //         Monday: Array(8).fill(null),
// //         Tuesday: Array(8).fill(null),
// //         Wednesday: Array(8).fill(null),
// //         Thursday: Array(8).fill(null),
// //         Friday: Array(8).fill(null)
// //       };

// //       const divisionClasses = classes.filter(
// //         (cls) => cls.division?.toLowerCase() === divisionName.toLowerCase()
// //       );

// //       divisionClasses.forEach((cls) => {
// //         const { day, period, subject, teacher, classroom } = cls;

// //         if (schedule[day] && period >= 1 && period <= 8) {
// //           schedule[day][period - 1] = {
// //             period: Number(period),
// //             subject: subjectList.find((s) => s._id === subject || s._id == subject),
// //             teacher: teachers.find((t) => t._id === teacher || t._id == teacher),
// //             classroom: String(classroom)
// //           };
// //         }
// //       });

// //       return {
// //         division_name: divisionName,
// //         schedule
// //       };
// //     });

// //     const timetable = {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions: formattedDivisions,
// //       subjects: subjectList,
// //       teachers,
// //       status: 'draft',
// //       createdAt: new Date(),
// //       updatedAt: new Date()
// //     };

// //     const newTimetable = new Timetable(timetable);
// //     await newTimetable.save();

// //     res.status(201).json({
// //       success: true,
// //       data: newTimetable,
// //       message: 'Timetable generated successfully'
// //     });

// //   } catch (error) {
// //     console.error('❌ Error generating timetable:', error);
// //     next(createError(500, 'Failed to generate timetable'));
// //   }
// // }

// // static async generateTimetable(req, res, next) {
// //   try {
// //     console.log('📥 Incoming data:', req.body);
// //     const {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions,
// //       subjects,
// //       teachers,
// //       classes
// //     } = req.body;

// //     if (
// //       !departmentId || !semester || !academicYear ||
// //       !divisions?.length || !subjects || !teachers || !classes
// //     ) {
// //       return next(createError(400, "Missing required fields"));
// //     }

// //     const subjectList = subjects.subjects || [];

// //     // Conflict Trackers
// //     const teacherAvailability = {}; // day -> period -> teacherId[]
// //     const classAvailability = {};   // day -> period -> classId[]

// //     // Initialize availability
// //     const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// //     days.forEach(day => {
// //       teacherAvailability[day] = Array(8).fill(null).map(() => []);
// //       classAvailability[day] = Array(8).fill(null).map(() => []);
// //     });

// //     const formattedDivisions = [];

// //     for (const divisionName of divisions) {
// //       const schedule = {
// //         Monday: Array(8).fill(null),
// //         Tuesday: Array(8).fill(null),
// //         Wednesday: Array(8).fill(null),
// //         Thursday: Array(8).fill(null),
// //         Friday: Array(8).fill(null)
// //       };

// //       for (const day of days) {
// //         for (let period = 0; period < 8; period++) {

// //           // Choose random subject and teacher
// //           const subject = subjectList[Math.floor(Math.random() * subjectList.length)];
// //           const eligibleTeachers = teachers.filter(t => t.semester == subject.semester);

// //           if (!eligibleTeachers.length) continue;

// //           const teacher = eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)];

// //           // Check for teacher conflict
// //           if (teacherAvailability[day][period].includes(teacher._id)) continue;

// //           // Pick random class
// //           const availableClasses = classes.filter(c => c.semester == semester);

// //           if (!availableClasses.length) continue;

// //           const classroom = availableClasses[Math.floor(Math.random() * availableClasses.length)];

// //           // Check classroom conflict
// //           if (classAvailability[day][period].includes(classroom._id)) continue;

// //           // Assign to schedule
// //           schedule[day][period] = {
// //             period: period + 1,
// //             subject,
// //             teacher,
// //             classroom: classroom.classNumber
// //           };

// //           // Mark teacher and class as occupied
// //           teacherAvailability[day][period].push(teacher._id);
// //           classAvailability[day][period].push(classroom._id);
// //         }
// //       }

// //       formattedDivisions.push({
// //         division_name: divisionName,
// //         schedule
// //       });
// //     }

// //     const timetable = {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions: formattedDivisions,
// //       subjects: subjectList,
// //       teachers,
// //       status: 'draft',
// //       createdAt: new Date(),
// //       updatedAt: new Date()
// //     };

// //     const newTimetable = new Timetable(timetable);
// //     await newTimetable.save();
// //     console.log("timetable created:", newTimetable);

// //     res.status(201).json({
// //       success: true,
// //       data: newTimetable,
// //       message: 'Timetable generated successfully'
// //     });

// //   } catch (error) {
// //     console.error('❌ Error generating timetable:', error);
// //     next(createError(500, 'Failed to generate timetable'));
// //   }
// // }

// // static async generateTimetable(req, res, next) {
// //   try {
// //     console.log('📥 Incoming data:', req.body);
// //     const {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions,
// //       subjects,
// //       teachers,
// //       classes
// //     } = req.body;

// //     if (
// //       !departmentId || !semester || !academicYear ||
// //       !divisions?.length || !subjects || !teachers || !classes
// //     ) {
// //       return next(createError(400, "Missing required fields"));
// //     }

// //     const subjectList = subjects.subjects || [];

// //     const teacherAvailability = {};
// //     const classAvailability = {};
// //     const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// //     days.forEach(day => {
// //       teacherAvailability[day] = Array(8).fill(null).map(() => []);
// //       classAvailability[day] = Array(8).fill(null).map(() => []);
// //     });

// //     const formattedDivisions = [];

// //     for (const divisionName of divisions) {
// //       const schedule = {};
// //       days.forEach(day => {
// //         schedule[day] = Array(8).fill(null);
// //       });

// //       for (const day of days) {
// //         for (let period = 0; period < 8; period++) {
// //           let assigned = false;

// //           // Try up to 10 random attempts to find a conflict-free slot
// //           for (let attempt = 0; attempt < 10 && !assigned; attempt++) {
// //             const subject = subjectList[Math.floor(Math.random() * subjectList.length)];

// //             // Match only subject for same semester as division
// //             const eligibleTeachers = teachers.filter(t => t.subjects?.includes(subject._id));
// //             if (!eligibleTeachers.length) continue;

// //             const teacher = eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)];

// //             if (teacherAvailability[day][period].includes(teacher._id)) continue;

// //             const availableClasses = classes.filter(c => c.semester == semester);
// //             if (!availableClasses.length) continue;

// //             const classroom = availableClasses[Math.floor(Math.random() * availableClasses.length)];
// //             if (classAvailability[day][period].includes(classroom._id)) continue;

// //             // ✅ Assign the lecture
// //             schedule[day][period] = {
// //               period: period + 1,
// //               subject: {
// //                 _id: subject._id,
// //                 name: subject.name
// //               },
// //               teacher: {
// //                 _id: teacher._id,
// //                 name: teacher.name
// //               },
// //               classroom: classroom.classNumber
// //             };

// //             teacherAvailability[day][period].push(teacher._id);
// //             classAvailability[day][period].push(classroom._id);
// //             assigned = true;
// //           }

// //           // Optional: Log if unable to assign
// //           if (!assigned) {
// //             console.log(`❌ Could not assign lecture for ${divisionName} on ${day} period ${period + 1}`);
// //           }
// //         }
// //       }

// //       formattedDivisions.push({
// //         division_name: divisionName,
// //         schedule
// //       });
// //     }

// //     const timetable = {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions: formattedDivisions,
// //       subjects: subjectList,
// //       teachers,
// //       status: 'draft',
// //       createdAt: new Date(),
// //       updatedAt: new Date()
// //     };

// //     const newTimetable = new Timetable(timetable);
// //     await newTimetable.save();
// //     console.log("✅ Timetable created");

// //     res.status(201).json({
// //       success: true,
// //       data: newTimetable,
// //       message: 'Timetable generated successfully'
// //     });

// //   } catch (error) {
// //     console.error('❌ Error generating timetable:', error);
// //     next(createError(500, 'Failed to generate timetable'));
// //   }
// // }

// static async generateTimetable(req, res, next) {
//   try {
//     console.log('📥 Incoming data:', req.body);
//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects,
//       teachers,
//       classes
//     } = req.body;

//     if (
//       !departmentId || !semester || !academicYear ||
//       !divisions?.length || !subjects || !teachers || !classes
//     ) {
//       return next(createError(400, "Missing required fields"));
//     }

//     const subjectList = subjects.subjects || [];

//     const teacherAvailability = {};
//     const classAvailability = {};
//     const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

//     // Initialize availability maps
//     days.forEach(day => {
//       teacherAvailability[day] = Array(8).fill(null).map(() => []);
//       classAvailability[day] = Array(8).fill(null).map(() => []);
//     });

//     const formattedDivisions = [];

//     for (const division of divisions) {
//       const schedule = {};
//       days.forEach(day => {
//         schedule[day] = Array(8).fill(null);
//       });

//       // Filter only subjects and classes for this semester
//       const divisionSubjects = subjectList.filter(s => s.semester === semester);
//       const availableClasses = classes.filter(c => c.semester === semester);

//       for (const day of days) {
//         const usedSubjectsToday = new Set();

//         for (let period = 0; period < 8; period++) {
//           let assigned = false;

//           for (let attempt = 0; attempt < 15 && !assigned; attempt++) {
//             const subject = divisionSubjects[Math.floor(Math.random() * divisionSubjects.length)];
//             if (!subject || usedSubjectsToday.has(subject._id)) continue;

//             const eligibleTeachers = teachers.filter(t => t.subjects?.includes(subject._id));
//             if (!eligibleTeachers.length) continue;

//             const teacher = eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)];
//             if (teacherAvailability[day][period].includes(teacher._id)) continue;

//             const classroom = availableClasses[Math.floor(Math.random() * availableClasses.length)];
//             if (classAvailability[day][period].includes(classroom._id)) continue;

//             // ✅ Assign
//             schedule[day][period] = {
//               period: period + 1,
//               subject: {
//                 _id: subject._id,
//                 name: subject.name
//               },
//               teacher: {
//                 _id: teacher._id,
//                 name: teacher.name
//               },
//               classroom: classroom.classNumber
//             };

//             teacherAvailability[day][period].push(teacher._id);
//             classAvailability[day][period].push(classroom._id);
//             usedSubjectsToday.add(subject._id);
//             assigned = true;
//           }

//           if (!assigned) {
//             console.log(`❌ Could not assign lecture for ${division} on ${day} period ${period + 1}`);
//           }
//         }
//       }

//       formattedDivisions.push({
//         division_name: division,
//         schedule
//       });
//     }

//     const timetable = {
//       departmentId,
//       semester,
//       academicYear,
//       divisions: formattedDivisions,
//       subjects: subjectList,
//       teachers,
//       status: 'draft',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     const newTimetable = new Timetable(timetable);
//     await newTimetable.save();
//     console.log("✅ Timetable created");

//     res.status(201).json({
//       success: true,
//       data: newTimetable,
//       message: 'Timetable generated successfully'
//     });

//   } catch (error) {
//     console.error('❌ Error generating timetable:', error);
//     next(createError(500, 'Failed to generate timetable'));
//   }
// }




//   static async getTimetables(req, res, next) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return next(createError(400, 'Validation failed', errors.array()));
//       }

//       const { departmentId } = req.params;
//       const { semester, academicYear, status } = req.query;

//       // Build query object
//       const query = { departmentId };
      
//       if (semester) query.semester = semester;
//       if (academicYear) query.academicYear = academicYear;
//       if (status) query.status = status;

//       const timetables = await Timetable.find(query)
//         .populate('departmentId', 'name code')
//         .sort({ createdAt: -1 });

//       res.status(200).json({
//         success: true,
//         data: timetables,
//         message: 'Timetables fetched successfully'
//       });
//     } catch (error) {
//       console.error('Error fetching timetables:', error);
//       next(createError(500, 'Error fetching timetables'));
//     }
//   }

// // static async getTimetable(req, res, next) {
// //   try {
// //     const { id } = req.params;
// //     const formatted = req.query.formatted === 'true';

// //     let timetable = await Timetable.findById(id)
// //       .populate('departmentId', 'name')
// //       .lean(); // Required to allow direct object modification

// //     if (!timetable) {
// //       return res.status(404).json({ success: false, message: 'Timetable not found' });
// //     }

// //     if (formatted) {
// //       for (const division of timetable.divisions) {
// //         division.lectures = [];

// //         for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
// //           const slots = division.schedule[day];

// //           for (let period = 0; period < slots.length; period++) {
// //             const slot = slots[period];

// //             if (slot && (slot.subject || slot.teacher)) {
// //               const lecture = {
// //                 day,
// //                 period: period + 1, // assuming index 0 = Period 1
// //               };

// //               if (slot.subject) {
// //                 const subject = await Subject.findById(slot.subject).select('name code');
// //                 lecture.subject = subject;
// //               }

// //               if (slot.teacher) {
// //                 const teacher = await Teacher.findById(slot.teacher).select('name');
// //                 lecture.teacher = teacher;
// //               }

// //               if (slot.classroom) {
// //                 lecture.classroom = slot.classroom;
// //               }

// //               division.lectures.push(lecture);
// //             }
// //           }
// //         }

// //         // Optional: Clean up to reduce size
// //         delete division.schedule;
// //       }

// //       console.log("📦 Final formatted timetable to send:", JSON.stringify(timetable.divisions, null, 2));
// //     }

// //     res.status(200).json({ success: true, data: timetable });
// //   } catch (error) {
// //     console.error('🔥 Error in getTimetable():', error.message);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error fetching timetable',
// //       error: error.message
// //     });
// //   }
// // }

// static async getTimetable(req, res, next) {
//   try {
//     const { id } = req.params;
//     const formatted = req.query.formatted === 'true';

//     let timetable = await Timetable.findById(id)
//       .populate('departmentId', 'name')
//       .lean(); // So we can modify the object

//     if (!timetable) {
//       return res.status(404).json({ success: false, message: 'Timetable not found' });
//     }

//     if (formatted) {
//       for (const division of timetable.divisions) {
//         division.lectures = [];

//         for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
//           const slots = division.schedule[day];

//           for (let period = 0; period < slots.length; period++) {
//             const slot = slots[period];

//             if (slot && (slot.subject || slot.teacher)) {
//               const lecture = {
//                 day,
//                 period: period + 1
//               };

//               if (slot.subject && typeof slot.subject === 'object' && slot.subject.name) {
//                 lecture.subject = slot.subject;
//               } else if (slot.subject) {
//                 const subject = await Subject.findById(slot.subject).select('name code');
//                 lecture.subject = subject;
//               }

//               if (slot.teacher && typeof slot.teacher === 'object' && slot.teacher.name) {
//                 lecture.teacher = slot.teacher;
//               } else if (slot.teacher) {
//                 const teacher = await Teacher.findById(slot.teacher).select('name');
//                 lecture.teacher = teacher;
//               }

//               if (slot.classroom) {
//                 lecture.classroom = slot.classroom;
//               }

//               division.lectures.push(lecture);
//             }
//           }
//         }

//         // ✅ Don't delete schedule — keep it so frontend sees it
//         // delete division.schedule ❌ <-- REMOVE this line
//       }

//       console.log("📦 Final formatted timetable to send:", JSON.stringify(timetable.divisions, null, 2));
//     }

//     res.status(200).json({ success: true, data: timetable });
//   } catch (error) {
//     console.error('🔥 Error in getTimetable():', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching timetable',
//       error: error.message
//     });
//   }
// }



//   static async updateTimetableStatus(req, res, next) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return next(createError(400, 'Validation failed', errors.array()));
//       }

//       const { id } = req.params;
//       const { status } = req.body;

//       const timetable = await Timetable.findByIdAndUpdate(
//         id,
//         { status, updatedAt: new Date() },
//         { new: true }
//       );

//       if (!timetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       res.status(200).json({
//         success: true,
//         data: timetable,
//         message: 'Timetable status updated successfully'
//       });
//     } catch (error) {
//       console.error('Error updating timetable status:', error);
//       next(createError(500, 'Error updating timetable status'));
//     }
//   }

//   static async deleteTimetable(req, res, next) {
//     try {
//       const { id } = req.params;

//       const timetable = await Timetable.findByIdAndDelete(id);

//       if (!timetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       res.status(200).json({
//         success: true,
//         message: 'Timetable deleted successfully'
//       });
//     } catch (error) {
//       console.error('Error deleting timetable:', error);
//       next(createError(500, 'Error deleting timetable'));
//     }
//   }

//   static async validateTimetable(req, res, next) {
//     try {
//       const { id } = req.params;
      
//       // Add your validation logic here
//       res.status(200).json({
//         success: true,
//         data: { valid: true, conflicts: [] },
//         message: 'Timetable validation completed'
//       });
//     } catch (error) {
//       console.error('Error validating timetable:', error);
//       next(createError(500, 'Error validating timetable'));
//     }
//   }

//   static async exportTimetable(req, res, next) {
//     try {
//       const { id } = req.params;
//       const { format } = req.query;

//       // Add export logic here
//       res.status(200).json({
//         success: true,
//         message: 'Export functionality coming soon'
//       });
//     } catch (error) {
//       console.error('Error exporting timetable:', error);
//       next(createError(500, 'Error exporting timetable'));
//     }
//   }

//   static async getTeacherSchedule(req, res, next) {
//     try {
//       // Add teacher schedule logic here
//       res.status(200).json({
//         success: true,
//         data: [],
//         message: 'Teacher schedule fetched successfully'
//       });
//     } catch (error) {
//       console.error('Error fetching teacher schedule:', error);
//       next(createError(500, 'Error fetching teacher schedule'));
//     }
//   }

//   static async getDivisionWorkload(req, res, next) {
//     try {
//       // Add division workload logic here
//       res.status(200).json({
//         success: true,
//         data: [],
//         message: 'Division workload fetched successfully'
//       });
//     } catch (error) {
//       console.error('Error fetching division workload:', error);
//       next(createError(500, 'Error fetching division workload'));
//     }
//   }

//   static async getTimetableStatistics(req, res, next) {
//     try {
//       // Add statistics logic here
//       res.status(200).json({
//         success: true,
//         data: {},
//         message: 'Timetable statistics fetched successfully'
//       });
//     } catch (error) {
//       console.error('Error fetching timetable statistics:', error);
//       next(createError(500, 'Error fetching timetable statistics'));
//     }
//   }

//   static async getAvailableSlots(req, res, next) {
//     try {
//       // Add available slots logic here
//       res.status(200).json({
//         success: true,
//         data: [],
//         message: 'Available slots fetched successfully'
//       });
//     } catch (error) {
//       console.error('Error fetching available slots:', error);
//       next(createError(500, 'Error fetching available slots'));
//     }
//   }

//   static async adjustTimetableSlot(req, res, next) {
//     try {
//       // Add slot adjustment logic here
//       res.status(200).json({
//         success: true,
//         message: 'Timetable slot adjusted successfully'
//       });
//     } catch (error) {
//       console.error('Error adjusting timetable slot:', error);
//       next(createError(500, 'Error adjusting timetable slot'));
//     }
//   }

//   static async cloneTimetable(req, res, next) {
//     try {
//       // Add clone logic here
//       res.status(200).json({
//         success: true,
//         message: 'Timetable cloned successfully'
//       });
//     } catch (error) {
//       console.error('Error cloning timetable:', error);
//       next(createError(500, 'Error cloning timetable'));
//     



// import Timetable from '../models/timetable.model.js';
// import { validationResult } from 'express-validator';
// import { createError } from '../utils/error.js';
// import subjectModel from '../models/subject.model.js';
// import teacherModel from '../models/teacher.model.js';
// import TimetableGeneticAlgorithm from '../utils/timetableGenerator.js';
// import { log } from 'console';

// class TimetableController {

//   // static async generateTimetable(req, res, next) {
//   //   try {
//   //     console.log('📥 Incoming data:', req.body);
//   //     const {
//   //       departmentId,
//   //       semester,
//   //       academicYear,
//   //       divisions,
//   //       subjects,
//   //       teachers,
//   //       classes
//   //     } = req.body;

//   //     if (
//   //       !departmentId || !semester || !academicYear ||
//   //       !divisions?.length || !subjects || !teachers || !classes
//   //     ) {
//   //       return next(createError(400, "Missing required fields"));
//   //     }

//   //     const subjectList = subjects.subjects || subjects || [];

//   //     // Initialize genetic algorithm
//   //     const geneticAlgorithm = new TimetableGeneticAlgorithm({
//   //       populationSize: 50,
//   //       maxGenerations: 100,
//   //       mutationRate: 0.1,
//   //       crossoverRate: 0.8,
//   //       elitismRate: 0.1
//   //     });

//   //     console.log('🧬 Starting genetic algorithm timetable generation...');

//   //     // Generate timetable using genetic algorithm
//   //     const geneticResult = await geneticAlgorithm.generateTimetable(departmentId, semester);

//   //     // Convert genetic algorithm result to our timetable format
//   //     const formattedDivisions = divisions.map((divisionName) => {
//   //       const schedule = {
//   //         Monday: Array(8).fill(null),
//   //         Tuesday: Array(8).fill(null),
//   //         Wednesday: Array(8).fill(null),
//   //         Thursday: Array(8).fill(null),
//   //         Friday: Array(8).fill(null)
//   //       };

//   //       // Filter genetic result for this division
//   //       const divisionAssignments = geneticResult.timetable.filter(
//   //         assignment => assignment.division === divisionName
//   //       );

//   //         console.log(`📦 Assignments for ${divisionName}:`, divisionAssignments);


//   //       divisionAssignments.forEach((assignment) => {
//   //         const { day, period, subject, teacher, classroom, duration } = assignment;

//   //         if (schedule[day] && period >= 1 && period <= 8) {
//   //           const periodIndex = period - 1;
            
//   //           // Handle single period assignments
//   //           schedule[day][periodIndex] = {
//   //             period: Number(period),
//   //             subject: {
//   //               _id: subject._id,
//   //               name: subject.name
//   //             },
//   //             teacher: {
//   //               _id: teacher._id || assignment.teacher_id._id,
//   //               name: teacher.name || assignment.teacher_id.name
//   //             },
//   //             classroom: classroom || assignment.classroom || 'TBA'
//   //           };

//   //           // Handle double period assignments (labs)
//   //           if (duration === 2 && periodIndex + 1 < 8) {
//   //             schedule[day][periodIndex + 1] = {
//   //               period: Number(period + 1),
//   //               subject: {
//   //                 _id: subject._id,
//   //                 name: subject.name + ' (Lab)'
//   //               },
//   //               teacher: {
//   //                 _id: teacher._id || assignment.teacher_id._id,
//   //                 name: teacher.name || assignment.teacher_id.name
//   //               },
//   //               classroom: classroom || assignment.classroom || 'TBA'
//   //             };
//   //           }
//   //         }
//   //       });

//   //       return {
//   //         division_name: divisionName,
//   //         schedule
//   //       };
//   //     });

//   //     const timetable = {
//   //       departmentId,
//   //       semester,
//   //       academicYear,
//   //       divisions: formattedDivisions,
//   //       subjects: subjectList,
//   //       teachers,
//   //       status: 'draft',
//   //       generation_metadata: {
//   //         fitness_score: geneticResult.metadata.fitness_score,
//   //         generation_count: geneticResult.metadata.generation_count,
//   //         conflicts_resolved: geneticResult.metadata.conflicts_resolved,
//   //         algorithm_version: geneticResult.metadata.algorithm_version,
//   //         generated_at: new Date()
//   //       },
//   //       createdAt: new Date(),
//   //       updatedAt: new Date()
//   //     };

//   //     const newTimetable = new Timetable(timetable);
//   //     await newTimetable.save();

//   //     console.log("✅ Genetic algorithm timetable created with fitness score:", geneticResult.metadata.fitness_score);

//   //     res.status(201).json({
//   //       success: true,
//   //       data: newTimetable,
//   //       message: 'Timetable generated successfully using genetic algorithm',
//   //       metadata: geneticResult.metadata
//   //     });

//   //   } catch (error) {
//   //     console.error('❌ Error generating timetable with genetic algorithm:', error);
      
//   //     // Fallback to simple random generation if genetic algorithm fails
//   //     try {
//   //       console.log('🔄 Falling back to simple generation...');
        
//   //       const {
//   //         departmentId,
//   //         semester,
//   //         academicYear,
//   //         divisions,
//   //         subjects,
//   //         teachers,
//   //         classes
//   //       } = req.body;

//   //       const subjectList = subjects.subjects || subjects || [];
//   //       const teacherAvailability = {};
//   //       const classAvailability = {};
//   //       const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

//   //       days.forEach(day => {
//   //         teacherAvailability[day] = Array(8).fill(null).map(() => []);
//   //         classAvailability[day] = Array(8).fill(null).map(() => []);
//   //       });

//   //       const formattedDivisions = [];

//   //       for (const division of divisions) {
//   //         const schedule = {};
//   //         days.forEach(day => {
//   //           schedule[day] = Array(8).fill(null);
//   //         });
//   //         console.log("🧬 geneticResult.timetable =", geneticResult.timetable);


//   //         const divisionSubjects = subjectList.filter(s => s.semester === semester);
//   //         const availableClasses = classes.filter(c => c.semester === semester);

//   //         for (const day of days) {
//   //           const usedSubjectsToday = new Set();

//   //           for (let period = 0; period < 8; period++) {
//   //             let assigned = false;

//   //             for (let attempt = 0; attempt < 15 && !assigned; attempt++) {
//   //               const subject = divisionSubjects[Math.floor(Math.random() * divisionSubjects.length)];
//   //               if (!subject || usedSubjectsToday.has(subject._id)) continue;

//   //               const eligibleTeachers = teachers.filter(t => t.subjects?.includes(subject._id));
//   //               if (!eligibleTeachers.length) continue;

//   //               const teacher = eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)];
//   //               if (teacherAvailability[day][period].includes(teacher._id)) continue;

//   //               const classroom = availableClasses[Math.floor(Math.random() * availableClasses.length)];
//   //               if (classAvailability[day][period].includes(classroom._id)) continue;

//   //               schedule[day][period] = {
//   //                 period: period + 1,
//   //                 subject: {
//   //                   _id: subject._id,
//   //                   name: subject.name
//   //                 },
//   //                 teacher: {
//   //                   _id: teacher._id,
//   //                   name: teacher.name
//   //                 },
//   //                 classroom: classroom.classNumber
//   //               };

//   //               teacherAvailability[day][period].push(teacher._id);
//   //               classAvailability[day][period].push(classroom._id);
//   //               usedSubjectsToday.add(subject._id);
//   //               assigned = true;
//   //             }
//   //           }
//   //         }

//   //         formattedDivisions.push({
//   //           division_name: division,
//   //           schedule
//   //         });
//   //       }

//   //       const fallbackTimetable = {
//   //         departmentId,
//   //         semester,
//   //         academicYear,
//   //         divisions: formattedDivisions,
//   //         subjects: subjectList,
//   //         teachers,
//   //         status: 'draft',
//   //         generation_metadata: {
//   //           fitness_score: 0.5,
//   //           generation_count: 0,
//   //           conflicts_resolved: 0,
//   //           algorithm_version: 'fallback-random',
//   //           generated_at: new Date()
//   //         },
//   //         createdAt: new Date(),
//   //         updatedAt: new Date()
//   //       };

//   //       const newTimetable = new Timetable(fallbackTimetable);
//   //       await newTimetable.save();

//   //       res.status(201).json({
//   //         success: true,
//   //         data: newTimetable,
//   //         message: 'Timetable generated using fallback method',
//   //         warning: 'Genetic algorithm failed, used simple random generation'
//   //       });

//   //     } catch (fallbackError) {
//   //       console.error('❌ Fallback generation also failed:', fallbackError);
//   //       next(createError(500, 'Failed to generate timetable'));
//   //     }
//   //   }
//   // }

// //     static async generateTimetable(req, res, next) {
// //   try {
// //     console.log('📥 Incoming data:', req.body);
// //     const {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions,
// //       subjects,
// //       teachers,
// //       classes
// //     } = req.body;

// //     if (
// //       !departmentId || !semester || !academicYear ||
// //       !divisions?.length || !subjects || !teachers || !classes
// //     ) {
// //       return next(createError(400, "Missing required fields"));
// //     }

// //     const subjectList = subjects.subjects || subjects || [];

// //     // Initialize genetic algorithm
// //     const geneticAlgorithm = new TimetableGeneticAlgorithm({
// //       populationSize: 50,
// //       maxGenerations: 100,
// //       mutationRate: 0.1,
// //       crossoverRate: 0.8,
// //       elitismRate: 0.1
// //     });

// //     console.log('🧬 Starting genetic algorithm timetable generation...');

// //     // Generate timetable using genetic algorithm
// //     const geneticResult = await geneticAlgorithm.generateTimetable(departmentId, semester);
// //     console.log("🧬 geneticResult:", geneticResult);

// //     // 🛑 Guard: Ensure timetable is an array
// //     if (!Array.isArray(geneticResult.timetable)) {
// //       throw new Error("Invalid genetic algorithm result: 'timetable' is not an array");
// //     }

// //     // Convert genetic algorithm result to our timetable format
// //     const formattedDivisions = divisions.map((divisionName) => {
// //       const schedule = {
// //         Monday: Array(8).fill(null),
// //         Tuesday: Array(8).fill(null),
// //         Wednesday: Array(8).fill(null),
// //         Thursday: Array(8).fill(null),
// //         Friday: Array(8).fill(null)
// //       };

// //       const divisionAssignments = geneticResult.timetable.filter(
// //         assignment => assignment.division === divisionName
// //       );

// //       console.log(`📦 Assignments for ${divisionName}:`, divisionAssignments);

// //       divisionAssignments.forEach((assignment) => {
// //         const { day, period, subject, teacher, classroom, duration } = assignment;

// //         if (schedule[day] && period >= 1 && period <= 8) {
// //           const periodIndex = period - 1;

// //           schedule[day][periodIndex] = {
// //             period: Number(period),
// //             subject: {
// //               _id: subject._id,
// //               name: subject.name
// //             },
// //             teacher: {
// //               _id: teacher._id || assignment.teacher_id?._id,
// //               name: teacher.name || assignment.teacher_id?.name
// //             },
// //             classroom: classroom || assignment.classroom || 'TBA'
// //           };

// //           if (duration === 2 && periodIndex + 1 < 8) {
// //             schedule[day][periodIndex + 1] = {
// //               period: Number(period + 1),
// //               subject: {
// //                 _id: subject._id,
// //                 name: subject.name + ' (Lab)'
// //               },
// //               teacher: {
// //                 _id: teacher._id || assignment.teacher_id?._id,
// //                 name: teacher.name || assignment.teacher_id?.name
// //               },
// //               classroom: classroom || assignment.classroom || 'TBA'
// //             };
// //           }
// //         }
// //       });

// //       return {
// //         division_name: divisionName,
// //         schedule
// //       };
// //     });

// //     const timetable = {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions: formattedDivisions,
// //       subjects: subjectList,
// //       teachers,
// //       status: 'draft',
// //       generation_metadata: {
// //         fitness_score: geneticResult.metadata?.fitness_score || 0,
// //         generation_count: geneticResult.metadata?.generation_count || 0,
// //         conflicts_resolved: geneticResult.metadata?.conflicts_resolved || 0,
// //         algorithm_version: geneticResult.metadata?.algorithm_version || "genetic-unknown",
// //         generated_at: new Date()
// //       },
// //       createdAt: new Date(),
// //       updatedAt: new Date()
// //     };

// //     const newTimetable = new Timetable(timetable);
// //     await newTimetable.save();

// //     console.log("✅ Genetic algorithm timetable created with fitness score:", geneticResult.metadata?.fitness_score);
// //     console.log("finaTimetable",newTimetable)

// //     res.status(201).json({
// //       success: true,
// //       data: newTimetable,
// //       message: 'Timetable generated successfully using genetic algorithm',
// //       metadata: geneticResult.metadata
// //     });

// //   } catch (error) {
// //     console.error('❌ Error generating timetable with genetic algorithm:', error);

// //     // Fallback to simple random generation if genetic algorithm fails
// //     try {
// //       console.log('🔄 Falling back to simple generation...');
// //       const {
// //         departmentId,
// //         semester,
// //         academicYear,
// //         divisions,
// //         subjects,
// //         teachers,
// //         classes
// //       } = req.body;

// //       const subjectList = subjects.subjects || subjects || [];
// //       const teacherAvailability = {};
// //       const classAvailability = {};
// //       const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// //       days.forEach(day => {
// //         teacherAvailability[day] = Array(8).fill(null).map(() => []);
// //         classAvailability[day] = Array(8).fill(null).map(() => []);
// //       });

// //       const formattedDivisions = [];

// //       for (const division of divisions) {
// //         const schedule = {};
// //         days.forEach(day => {
// //           schedule[day] = Array(8).fill(null);
// //         });

// //         const divisionSubjects = subjectList.filter(s => s.semester === semester);
// //         const availableClasses = classes.filter(c => c.semester === semester);

// //         for (const day of days) {
// //           const usedSubjectsToday = new Set();

// //           for (let period = 0; period < 8; period++) {
// //             let assigned = false;

// //             for (let attempt = 0; attempt < 15 && !assigned; attempt++) {
// //               const subject = divisionSubjects[Math.floor(Math.random() * divisionSubjects.length)];
// //               if (!subject || usedSubjectsToday.has(subject._id)) continue;

// //               const eligibleTeachers = teachers.filter(t => t.subjects?.includes(subject._id));
// //               if (!eligibleTeachers.length) continue;

// //               const teacher = eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)];
// //               if (teacherAvailability[day][period].includes(teacher._id)) continue;

// //               const classroom = availableClasses[Math.floor(Math.random() * availableClasses.length)];
// //               if (!classroom || classAvailability[day][period].includes(classroom._id)) continue;

// //               schedule[day][period] = {
// //                 period: period + 1,
// //                 subject: {
// //                   _id: subject._id,
// //                   name: subject.name
// //                 },
// //                 teacher: {
// //                   _id: teacher._id,
// //                   name: teacher.name
// //                 },
// //                 classroom: classroom.classNumber
// //               };

// //               teacherAvailability[day][period].push(teacher._id);
// //               classAvailability[day][period].push(classroom._id);
// //               usedSubjectsToday.add(subject._id);
// //               assigned = true;
// //             }
// //           }
// //         }

// //         formattedDivisions.push({
// //           division_name: division,
// //           schedule
// //         });
// //       }

// //       const fallbackTimetable = {
// //         departmentId,
// //         semester,
// //         academicYear,
// //         divisions: formattedDivisions,
// //         subjects: subjectList,
// //         teachers,
// //         status: 'draft',
// //         generation_metadata: {
// //           fitness_score: 0.5,
// //           generation_count: 0,
// //           conflicts_resolved: 0,
// //           algorithm_version: 'fallback-random',
// //           generated_at: new Date()
// //         },
// //         createdAt: new Date(),
// //         updatedAt: new Date()
// //       };

// //       const newTimetable = new Timetable(fallbackTimetable);
// //       await newTimetable.save();

// //       res.status(201).json({
// //         success: true,
// //         data: newTimetable,
// //         message: 'Timetable generated using fallback method',
// //         warning: 'Genetic algorithm failed, used simple random generation'
// //       });

// //     } catch (fallbackError) {
// //       console.error('❌ Fallback generation also failed:', fallbackError);
// //       next(createError(500, 'Failed to generate timetable'));
// //     }
// //   }
// // }


// // static async generateTimetable(req, res, next) {
// //   // Fallback to simple random generation
// // try {
// //   console.log('🔄 Falling back to simple generation...');
// //   const {
// //     departmentId,
// //     semester,
// //     academicYear,
// //     divisions,
// //     subjects,
// //     teachers,
// //     classes
// //   } = req.body;

// //   const subjectList = subjects.subjects || subjects || []; // ✅ fixed
// //   const teacherAvailability = {};
// //   const classAvailability = {};
// //   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// //   days.forEach(day => {
// //     teacherAvailability[day] = Array(8).fill(null).map(() => []);
// //     classAvailability[day] = Array(8).fill(null).map(() => []);
// //   });

// //   const formattedDivisions = [];

// //   for (const division of divisions) {
// //     const schedule = {};
// //     days.forEach(day => {
// //       schedule[day] = Array(8).fill(null);
// //     });

// //     const divisionSubjects = subjectList.filter(s => s.semester === semester); // ✅ fixed

// //     const availableClasses = classes.filter(c => c.semester === semester);

// //     for (const day of days) {
// //       const usedSubjectsToday = new Set();

// //       for (let period = 0; period < 8; period++) {
// //         let assigned = false;

// //         for (let attempt = 0; attempt < 15 && !assigned; attempt++) {
// //           const subject = divisionSubjects[Math.floor(Math.random() * divisionSubjects.length)];
// //           if (!subject || usedSubjectsToday.has(subject._id)) continue;

// //           const eligibleTeachers = teachers.filter(t => t.subjects?.includes(subject._id));
// //           if (!eligibleTeachers.length) continue;

// //           const teacher = eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)];
// //           if (teacherAvailability[day][period].includes(teacher._id)) continue;

// //           const classroom = availableClasses[Math.floor(Math.random() * availableClasses.length)];
// //           if (!classroom || classAvailability[day][period].includes(classroom._id)) continue;

// //           schedule[day][period] = {
// //             period: period + 1,
// //             subject: {
// //               _id: subject._id,
// //               name: subject.name
// //             },
// //             teacher: {
// //               _id: teacher._id,
// //               name: teacher.name
// //             },
// //             classroom: classroom.classNumber
// //           };

// //           teacherAvailability[day][period].push(teacher._id);
// //           classAvailability[day][period].push(classroom._id);
// //           usedSubjectsToday.add(subject._id);
// //           assigned = true;
// //         }
// //       }
// //     }

// //     formattedDivisions.push({
// //       division_name: division,
// //       schedule
// //     });
// //   }

// //   const fallbackTimetable = {
// //     departmentId,
// //     semester,
// //     academicYear,
// //     divisions: formattedDivisions,
// //     subjects: subjectList, // ✅ fixed
// //     teachers,
// //     status: 'draft',
// //     generation_metadata: {
// //       fitness_score: 0.5,
// //       generation_count: 0,
// //       conflicts_resolved: 0,
// //       algorithm_version: 'fallback-random',
// //       generated_at: new Date()
// //     },
// //     createdAt: new Date(),
// //     updatedAt: new Date()
// //   };

// //   const newTimetable = new Timetable(fallbackTimetable);
// //   await newTimetable.save();

// //   res.status(201).json({
// //     success: true,
// //     data: newTimetable,
// //     message: 'Timetable generated using fallback method',
// //     warning: 'Genetic algorithm failed, used simple random generation'
// //   });

// // } catch (fallbackError) {
// //   console.error('❌ Fallback generation also failed:', fallbackError);
// //   next(createError(500, 'Failed to generate timetable'));
// // }

// // }

// static async generateTimetable(req, res, next) {
//   try {
//     console.log('📥 Incoming data:', req.body);
//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects,
//       teachers,
//       classes
//     } = req.body;

//     // Validate required fields
//     if (!departmentId || !semester || !academicYear || !divisions?.length || !subjects || !teachers || !classes) {
//       return next(createError(400, "Missing required fields"));
//     }

//     // Format subjects data
//     const formattedSubjects = subjects.map(subject => ({
//       _id: subject._id,
//       name: subject.name,
//       subject_name: subject.name,
//       type: subject.type || 'Theory',
//       isLab: subject.type === 'Lab',
//       teacher_id: {
//         _id: subject.teacher,
//         name: teachers.find(t => t._id === subject.teacher)?.name || 'Unknown Teacher'
//       },
//       divisions: divisions,
//       lecturePerWeek: subject.lecturesPerWeek || 1
//     }));

//     // Initialize genetic algorithm with configuration
//     const geneticAlgorithm = new TimetableGeneticAlgorithm({
//       populationSize: 50,
//       maxGenerations: 100,
//       mutationRate: 0.1,
//       crossoverRate: 0.8,
//       elitismRate: 0.1
//     });

//     console.log('🧬 Starting genetic algorithm timetable generation...');

//     // Generate timetable using genetic algorithm
//     const geneticResult = await geneticAlgorithm.generateTimetable(
//       departmentId, 
//       semester,
//       formattedSubjects,
//       teachers
//     );

//     if (!geneticResult || !geneticResult.timetable) {
//       throw new Error('Failed to generate timetable');
//     }

//     // Format divisions with schedules
//     const formattedDivisions = divisions.map(divisionName => {
//       const schedule = {
//         Monday: Array(6).fill(null),
//         Tuesday: Array(6).fill(null),
//         Wednesday: Array(6).fill(null),
//         Thursday: Array(6).fill(null),
//         Friday: Array(6).fill(null)
//       };

//       // Filter assignments for this division
//       const divisionAssignments = geneticResult.timetable.filter(
//         assignment => assignment.division === divisionName
//       );

//       // Place assignments in schedule
//       divisionAssignments.forEach(assignment => {
//         const periodIndex = assignment.period - 1;
//         if (periodIndex >= 0 && periodIndex < 6) {
//           schedule[assignment.day][periodIndex] = {
//             period: assignment.period,
//             subject: {
//               _id: assignment.subject._id,
//               name: assignment.subject.name
//             },
//             teacher: {
//               _id: assignment.teacher._id,
//               name: assignment.teacher.name
//             },
//             classroom: assignment.classroom || 'TBA'
//           };

//           // For lab sessions, fill next slot too
//           if (assignment.duration === 2 && periodIndex < 5) {
//             schedule[assignment.day][periodIndex + 1] = {
//               period: assignment.period + 1,
//               subject: {
//                 _id: assignment.subject._id,
//                 name: `${assignment.subject.name} (Lab)`
//               },
//               teacher: {
//                 _id: assignment.teacher._id,
//                 name: assignment.teacher.name
//               },
//               classroom: assignment.classroom || 'TBA'
//             };
//           }
//         }
//       });

//       return {
//         division_name: divisionName,
//         schedule
//       };
//     });

//     // Create timetable document
//     const timetable = {
//       departmentId,
//       semester,
//       academicYear,
//       divisions: formattedDivisions,
//       subjects: formattedSubjects,
//       teachers,
//       status: 'draft',
//       generation_metadata: {
//         fitness_score: geneticResult.metadata.fitness_score,
//         generation_count: geneticResult.metadata.generation_count,
//         conflicts_resolved: geneticResult.metadata.conflicts_resolved,
//         algorithm_version: geneticResult.metadata.algorithm_version,
//         generated_at: new Date()
//       },
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     const newTimetable = new Timetable(timetable);
//     await newTimetable.save();

//     console.log("✅ Timetable generated successfully");
//     console.log("📊 Fitness score:", geneticResult.metadata.fitness_score);

//     res.status(201).json({
//       success: true,
//       data: newTimetable,
//       message: 'Timetable generated successfully',
//       metadata: geneticResult.metadata
//     });

//   } catch (error) {
//     console.error('❌ Error generating timetable:', error);
//     next(createError(500, 'Failed to generate timetable'));
//   }
// }
















//   static async getTimetables(req, res, next) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return next(createError(400, 'Validation failed', errors.array()));
//       }

//       const { departmentId } = req.params;
//       const { semester, academicYear, status } = req.query;


//       const query = { departmentId };
      
//       if (semester) query.semester = semester;
//       if (academicYear) query.academicYear = academicYear;
//       if (status) query.status = status;

//       const timetables = await Timetable.find(query)
//         .populate('departmentId', 'name code')
//         .sort({ createdAt: -1 });

//         console.log("📦 Timetables fetched:", timetables);
//       res.status(200).json({
//         success: true,
//         data: timetables,
//         message: 'Timetables fetched successfully'
//       });
//     } catch (error) {
//       console.error('Error fetching timetables:', error);
//       next(createError(500, 'Error fetching timetables'));
//     }
//   }

//   static async getTimetable(req, res, next) {
//     try {
//       const { id } = req.params;
//       const formatted = req.query.formatted === 'true';

//       let timetable = await Timetable.findById(id)
//         .populate('departmentId', 'name')
//         .lean();

//       if (!timetable) {
//         return res.status(404).json({ success: false, message: 'Timetable not found' });
//       }

//       if (formatted) {
//         for (const division of timetable.divisions) {
//           division.lectures = [];

//           for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
//             const slots = division.schedule[day];

//             for (let period = 0; period < slots.length; period++) {
//               const slot = slots[period];

//               if (slot && (slot.subject || slot.teacher)) {
//                 const lecture = {
//                   day,
//                   period: period + 1
//                 };

//                 if (slot.subject && typeof slot.subject === 'object' && slot.subject.name) {
//                   lecture.subject = slot.subject;
//                 } else if (slot.subject) {
//                   const subject = await subjectModel.findById(slot.subject).select('name code');
//                   lecture.subject = subject;
//                 }

//                 if (slot.teacher && typeof slot.teacher === 'object' && slot.teacher.name) {
//                   lecture.teacher = slot.teacher;
//                 } else if (slot.teacher) {
//                   const teacher = await teacherModel.findById(slot.teacher).select('name');
//                   lecture.teacher = teacher;
//                 }

//                 if (slot.classroom) {
//                   lecture.classroom = slot.classroom;
//                 }

//                 division.lectures.push(lecture);
//               }
//             }
//           }
//         }

//         console.log("📦 Final formatted timetable to send:", JSON.stringify(timetable.divisions, null, 2));
//       }

//       res.status(200).json({ success: true, data: timetable });
//     } catch (error) {
//       console.error('🔥 Error in getTimetable():', error.message);
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching timetable',
//         error: error.message
//       });
//     }
//   }

//   static async updateTimetableStatus(req, res, next) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return next(createError(400, 'Validation failed', errors.array()));
//       }

//       const { id } = req.params;
//       const { status } = req.body;

//       const timetable = await Timetable.findByIdAndUpdate(
//         id,
//         { status, updatedAt: new Date() },
//         { new: true }
//       );

//       if (!timetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       res.status(200).json({
//         success: true,
//         data: timetable,
//         message: 'Timetable status updated successfully'
//       });
//     } catch (error) {
//       console.error('Error updating timetable status:', error);
//       next(createError(500, 'Error updating timetable status'));
//     }
//   }

//   static async deleteTimetable(req, res, next) {
//     try {
//       const { id } = req.params;

//       const timetable = await Timetable.findByIdAndDelete(id);

//       if (!timetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       res.status(200).json({
//         success: true,
//         message: 'Timetable deleted successfully'
//       });
//     } catch (error) {
//       console.error('Error deleting timetable:', error);
//       next(createError(500, 'Error deleting timetable'));
//     }
//   }

//   static async validateTimetable(req, res, next) {
//     try {
//       const { id } = req.params;
      
//       const timetable = await Timetable.findById(id);
//       if (!timetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       // Use genetic algorithm to validate the timetable
//       const geneticAlgorithm = new TimetableGeneticAlgorithm();
//       const conflicts = geneticAlgorithm.countConflicts(timetable.divisions);
      
//       res.status(200).json({
//         success: true,
//         data: { 
//           valid: conflicts === 0, 
//           conflicts: conflicts,
//           fitness_score: timetable.generation_metadata?.fitness_score || 'N/A'
//         },
//         message: 'Timetable validation completed'
//       });
//     } catch (error) {
//       console.error('Error validating timetable:', error);
//       next(createError(500, 'Error validating timetable'));
//     }
//   }

//   static async exportTimetable(req, res, next) {
//     try {
//       const { id } = req.params;
//       const { format } = req.query;

//       res.status(200).json({
//         success: true,
//         message: 'Export functionality coming soon'
//       });
//     } catch (error) {
//       console.error('Error exporting timetable:', error);
//       next(createError(500, 'Error exporting timetable'));
//     }
//   }

//   static async getTeacherSchedule(req, res, next) {
//     try {
//       res.status(200).json({
//         success: true,
//         data: [],
//         message: 'Teacher schedule fetched successfully'
//       });
//     } catch (error) {
//       console.error('Error fetching teacher schedule:', error);
//       next(createError(500, 'Error fetching teacher schedule'));
//     }
//   }

//   static async getDivisionWorkload(req, res, next) {
//     try {
//       res.status(200).json({
//         success: true,
//         data: [],
//         message: 'Division workload fetched successfully'
//       });
//     } catch (error) {
//       console.error('Error fetching division workload:', error);
//       next(createError(500, 'Error fetching division workload'));
//     }
//   }

//   static async getTimetableStatistics(req, res, next) {
//     try {
//       const { id } = req.params;
      
//       const timetable = await Timetable.findById(id);
//       if (!timetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       let totalClasses = 0;
//       let labSessions = 0;
//       let theorySessions = 0;

//       timetable.divisions.forEach(division => {
//         Object.values(division.schedule).forEach(daySchedule => {
//           daySchedule.forEach(slot => {
//             if (slot && slot.subject) {
//               totalClasses++;
//               if (slot.subject.name && slot.subject.name.toLowerCase().includes('lab')) {
//                 labSessions++;
//               } else {
//                 theorySessions++;
//               }
//             }
//           });
//         });
//       });

//       const statistics = {
//         totalClasses,
//         labSessions,
//         theorySessions,
//         teacherUtilization: timetable.generation_metadata?.fitness_score || 0,
//         roomUtilization: timetable.generation_metadata?.fitness_score || 0,
//         fitness_score: timetable.generation_metadata?.fitness_score || 0,
//         generation_count: timetable.generation_metadata?.generation_count || 0,
//         conflicts_resolved: timetable.generation_metadata?.conflicts_resolved || 0
//       };

//       res.status(200).json({
//         success: true,
//         data: { statistics },
//         message: 'Timetable statistics fetched successfully'
//       });
//     } catch (error) {
//       console.error('Error fetching timetable statistics:', error);
//       next(createError(500, 'Error fetching timetable statistics'));
//     }
//   }

// //   static async getTimetableStatistics(req, res, next)  {
// //   try {
// //     const { id } = req.params;

// //     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
// //       return next(createError('Invalid timetable ID', 400));
// //     }

// //     const timetable = await Timetable.findById(id)
// //       .populate('department_id', 'departmentName departmentCode')
// //       .populate('divisions.lectures.subject_id', 'subjectName subjectCode')
// //       .populate('divisions.lectures.teacher_id', 'firstName lastName employeeId')
// //       .populate('divisions.lectures.classroom_id', 'roomNumber building');

// //     if (!timetable) {
// //       return next(createError('Timetable not found', 404));
// //     }

// //     const statistics = {
// //       totalDivisions: timetable.divisions ? timetable.divisions.length : 0,
// //       totalLectures: 0,
// //       totalFreeSlots: 0,
// //       teacherWorkload: {},
// //       subjectDistribution: {},
// //       roomUtilization: {},
// //       weeklySchedule: {
// //         Monday: 0,
// //         Tuesday: 0,
// //         Wednesday: 0,
// //         Thursday: 0,
// //         Friday: 0
// //       }
// //     };

// //     if (timetable.divisions && Array.isArray(timetable.divisions)) {
// //       timetable.divisions.forEach(division => {
// //         if (division.schedule) {
// //           Object.entries(division.schedule).forEach(([day, daySchedule]) => {
// //             // Check if daySchedule is an array or object
// //             let scheduleArray = [];
// //             if (Array.isArray(daySchedule)) {
// //               scheduleArray = daySchedule;
// //             } else if (daySchedule && typeof daySchedule === 'object') {
// //               // If it's an object, try to convert to array
// //               scheduleArray = Object.values(daySchedule);
// //             }

// //             if (Array.isArray(scheduleArray)) {
// //               scheduleArray.forEach(slot => {
// //                 if (slot && slot !== null && typeof slot === 'object') {
// //                   if (slot.subject_id || slot.teacher_id) {
// //                     statistics.totalLectures++;
// //                     if (statistics.weeklySchedule[day] !== undefined) {
// //                       statistics.weeklySchedule[day]++;
// //                     }

// //                     // Teacher workload
// //                     if (slot.teacher_id) {
// //                       const teacherKey = slot.teacher_id._id ? slot.teacher_id._id.toString() : slot.teacher_id.toString();
// //                       const teacherName = slot.teacher_id.firstName && slot.teacher_id.lastName 
// //                         ? `${slot.teacher_id.firstName} ${slot.teacher_id.lastName}`
// //                         : 'Unknown Teacher';

// //                       if (!statistics.teacherWorkload[teacherKey]) {
// //                         statistics.teacherWorkload[teacherKey] = {
// //                           name: teacherName,
// //                           lectures: 0
// //                         };
// //                       }
// //                       statistics.teacherWorkload[teacherKey].lectures++;
// //                     }

// //                     // Subject distribution
// //                     if (slot.subject_id) {
// //                       const subjectKey = slot.subject_id._id ? slot.subject_id._id.toString() : slot.subject_id.toString();
// //                       const subjectName = slot.subject_id.subjectName || 'Unknown Subject';

// //                       if (!statistics.subjectDistribution[subjectKey]) {
// //                         statistics.subjectDistribution[subjectKey] = {
// //                           name: subjectName,
// //                           lectures: 0
// //                         };
// //                       }
// //                       statistics.subjectDistribution[subjectKey].lectures++;
// //                     }

// //                     // Room utilization
// //                     if (slot.classroom_id) {
// //                       const roomKey = slot.classroom_id._id ? slot.classroom_id._id.toString() : slot.classroom_id.toString();
// //                       const roomNumber = slot.classroom_id.roomNumber || 'Unknown Room';

// //                       if (!statistics.roomUtilization[roomKey]) {
// //                         statistics.roomUtilization[roomKey] = {
// //                           name: roomNumber,
// //                           lectures: 0
// //                         };
// //                       }
// //                       statistics.roomUtilization[roomKey].lectures++;
// //                     }
// //                   } else {
// //                     statistics.totalFreeSlots++;
// //                   }
// //                 } else {
// //                   statistics.totalFreeSlots++;
// //                 }
// //               });
// //             }
// //           });
// //         }
// //       });
// //     }

// //     res.status(200).json({
// //       status: 'success',
// //       data: {
// //         timetable: {
// //           _id: timetable._id,
// //           name: timetable.name,
// //           department: timetable.department_id,
// //           semester: timetable.semester,
// //           academicYear: timetable.academicYear,
// //           status: timetable.status,
// //           createdAt: timetable.createdAt
// //         },
// //         statistics
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Error fetching timetable statistics:', error);
// //     return next(createError('Error fetching timetable statistics', 500));
// //   }
// // };




//   static async getAvailableSlots(req, res, next) {
//     try {
//       res.status(200).json({
//         success: true,
//         data: [],
//         message: 'Available slots fetched successfully'
//       });
//     } catch (error) {
//       console.error('Error fetching available slots:', error);
//       next(createError(500, 'Error fetching available slots'));
//     }
//   }

//   static async adjustTimetableSlot(req, res, next) {
//     try {
//       res.status(200).json({
//         success: true,
//         message: 'Timetable slot adjusted successfully'
//       });
//     } catch (error) {
//       console.error('Error adjusting timetable slot:', error);
//       next(createError(500, 'Error adjusting timetable slot'));
//     }
//   }

//   static async cloneTimetable(req, res, next) {
//     try {
//       const { id } = req.params;
//       const { newAcademicYear, newSemester } = req.body;

//       const originalTimetable = await Timetable.findById(id);
//       if (!originalTimetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       const clonedTimetable = new Timetable({
//         ...originalTimetable.toObject(),
//         _id: undefined,
//         academicYear: newAcademicYear,
//         semester: newSemester,
//         status: 'draft',
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });

//       await clonedTimetable.save();

//       res.status(200).json({
//         success: true,
//         data: clonedTimetable,
//         message: 'Timetable cloned successfully'
//       });
//     } catch (error) {
//       console.error('Error cloning timetable:', error);
//       next(createError(500, 'Error cloning timetable'));
//     }
//   }
// }

// export default TimetableController;


// import Timetable from '../models/timetable.model.js';
// import { createError } from '../utils/error.js';
// import GeneticAlgorithm from '../utils/timetableGenerator.js';




// class TimetableController {
// // static async generateTimetable(req, res, next) {
// //   try {
// //     console.log("📥 Incoming Request Body:", req.body);

// //     const {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions,
// //       subjects,
// //       teachers,
// //       classes,
// //     } = req.body;

// //     if (!departmentId || !semester || !academicYear || !divisions?.length) {
// //       console.log("❗ Missing required fields");
// //       return next(createError(400, 'Missing required fields'));
// //     }

// //     const targetSemester = Number(semester);
// //     console.log(`🎯 Target Semester: ${targetSemester}`);
// //     console.log(`🏢 Department ID: ${departmentId}`);
// //     console.log(`📅 Academic Year: ${academicYear}`);

// //     const filteredSubjects = subjects.filter(s => Number(s.semester) === targetSemester);
// //     const filteredTeachers = teachers.filter(t => Number(t.semester) === targetSemester);
// //     const filteredClasses = classes.filter(c => {
// //       const classSemester = typeof c.semester === 'number' ? c.semester : Number(c.semester);
// //       return classSemester === targetSemester;
// //     });

// //     console.log(`📚 Filtered Subjects (${filteredSubjects.length}):`, filteredSubjects.map(s => s.name));
// //     console.log(`👨‍🏫 Filtered Teachers (${filteredTeachers.length}):`, filteredTeachers.map(t => t.name));
// //     console.log(`🏫 Filtered Classes (${filteredClasses.length}):`, filteredClasses.map(c => c.room_number || c.name || c._id));

// //     if (!filteredSubjects.length) {
// //       return next(createError(400, `No subjects found for semester ${targetSemester}`));
// //     }

// //     if (!filteredTeachers.length) {
// //       return next(createError(400, `No teachers found for semester ${targetSemester}`));
// //     }

// //     if (!filteredClasses.length) {
// //       return next(createError(400, `No classes found for semester ${targetSemester}`));
// //     }

// //     // 🔧 Pass config + required info to GA constructor
// //     const geneticAlgorithm = new GeneticAlgorithm({
// //       populationSize: 50,
// //       maxGenerations: 100,
// //       mutationRate: 0.1,
// //       crossoverRate: 0.8,
// //       elitismRate: 0.1,
// //       departmentId,       // ✅ departmentId available in GA class
// //       semester: targetSemester,  // ✅ semester passed for logs or logic
// //       academicYear,
// //              // ✅ optional, but useful for logs/debug
// //     });

// //     console.log("🧬 Starting genetic algorithm...");

// //     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
// //       divisions,
// //       subjects: filteredSubjects,
// //       teachers: filteredTeachers,
// //       classes: filteredClasses,
// //       departmentId,
// //       semester: targetSemester,
// //       academicYear,
// //     });

// //     console.log("✅ Schedule generated. Metadata:", metadata);
// //     console.log("🗓️ Sample Schedule for First Division:", JSON.stringify(schedule[divisions[0]], null, 2));

// //     const timetable = new Timetable({
// //       departmentId,
// //       semester: targetSemester,
// //       academicYear,
// //       divisions: divisions.map((div) => ({
// //         division_name: div,
// //         schedule: schedule[div] || {}
// //       })),
// //       status: 'draft',
// //       generation_metadata: {
// //         fitness_score: metadata.fitnessScore,
// //         generation_count: metadata.generations,
// //         conflicts_resolved: metadata.conflictsResolved,
// //         algorithm_version: metadata.algorithm_version,
// //         generated_at: new Date(),
// //       },
// //     });

// //     await timetable.save();
// //     console.log("💾 Timetable saved to DB");

// //     res.status(201).json({
// //       success: true,
// //       data: timetable,
// //       message: 'Timetable generated successfully',
// //     });

// //   } catch (error) {
// //     console.error('❌ Error in timetable generation:', error);
// //     next(createError(500, 'Error in timetable generation algorithm'));
// //   }
// // }





// // Helper function to validate timetable

// // static async generateTimetable(req, res, next) {
// //   try {
// //     console.log("📥 Incoming Request Body:", req.body);

// //     const {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions,
// //       subjects,
// //       teachers,
// //       classes,
// //     } = req.body;

// //     console.log("🧾 Divisions input:", divisions);


// //     if (!departmentId || !semester || !academicYear || !divisions?.length) {
// //       console.log("❗ Missing required fields");
// //       return next(createError(400, 'Missing required fields'));
// //     }

// //     const targetSemester = Number(semester);
// //     console.log(`🎯 Target Semester: ${targetSemester}`);
// //     console.log(`🏢 Department ID: ${departmentId}`);
// //     console.log(`📅 Academic Year: ${academicYear}`);

// //     const filteredSubjects = subjects.filter(s => Number(s.semester) === targetSemester);
// //     const filteredTeachers = teachers.filter(t => Number(t.semester) === targetSemester);
// //     const filteredClasses = classes.filter(c => {
// //       const classSemester = typeof c.semester === 'number' ? c.semester : Number(c.semester);
// //       return classSemester === targetSemester;
// //     });

// //     console.log(`📚 Filtered Subjects (${filteredSubjects.length}):`, filteredSubjects.map(s => s.name));
// //     console.log(`👨‍🏫 Filtered Teachers (${filteredTeachers.length}):`, filteredTeachers.map(t => t.name));
// //     console.log(`🏫 Filtered Classes (${filteredClasses.length}):`, filteredClasses.map(c => c.room_number || c.name || c._id));

// //     if (!filteredSubjects.length) return next(createError(400, `No subjects found for semester ${targetSemester}`));
// //     if (!filteredTeachers.length) return next(createError(400, `No teachers found for semester ${targetSemester}`));
// //     if (!filteredClasses.length) return next(createError(400, `No classes found for semester ${targetSemester}`));

// //     const geneticAlgorithm = new GeneticAlgorithm({
// //       populationSize: 50,
// //       maxGenerations: 100,
// //       mutationRate: 0.1,
// //       crossoverRate: 0.8,
// //       elitismRate: 0.1,
// //       departmentId,
// //       semester: targetSemester,
// //       academicYear,
// //       divisions,
// //       subjects: filteredSubjects,
// //       teachers: filteredTeachers,
// //       classes: filteredClasses,
// //     });

// //     console.log("🧬 Starting genetic algorithm...");
// //     console.log("⏳ Calling geneticAlgorithm.generateSchedule...");

// //     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
// //       divisions,
// //       subjects: filteredSubjects,
// //       teachers: filteredTeachers,
// //       classes: filteredClasses,
// //       departmentId,
// //       semester: targetSemester,
// //       academicYear,
// //     });

// //     console.log("✅ Schedule generated. Metadata:", metadata);
// //     console.log("🗓️ Sample Schedule for First Division:", JSON.stringify(schedule[divisions[0]], null, 2));

// //     const timetable = new Timetable({
// //       departmentId,
// //       semester: targetSemester,
// //       academicYear,
// //       divisions: divisions.map((div) => ({
// //         division_name: div,
// //         schedule: schedule[div] || {}
// //       })),
// //       status: 'draft',
// //       generation_metadata: {
// //         fitness_score: metadata.fitnessScore,
// //         generation_count: metadata.generations,
// //         conflicts_resolved: metadata.conflictsResolved,
// //         algorithm_version: metadata.algorithm_version,
// //         generated_at: new Date(),
// //       },
// //     });

// //     await timetable.save();
// //     console.log("💾 Timetable saved to DB");

// //     res.status(201).json({
// //       success: true,
// //       data: timetable,
// //       message: 'Timetable generated successfully',
// //     });

// //   } catch (error) {
// //     console.error('❌ Error in timetable generation:', error.message);
// //     console.error('🧵 Stack Trace:', error.stack);
// //     next(createError(500, 'Error in timetable generation algorithm'));
// //   }
// // }

// // static async generateTimetable(req, res, next) {
// //   try {
// //     console.log("📥 Incoming Request Body:", req.body);

// //     const {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions, // Will now be array of strings like ['TYA', 'SYB']
// //       subjects,
// //       teachers,
// //       classes,
// //     } = req.body;

// //     // Validate divisions format
// //     if (!Array.isArray(divisions) || !divisions.every(div => typeof div === 'string')) {
// //       console.log("❗ Invalid divisions format");
// //       return next(createError(400, 'Divisions must be an array of strings (e.g. ["TYA", "SYB"])'));
// //     }

// //     if (!departmentId || !semester || !academicYear || !divisions?.length) {
// //       console.log("❗ Missing required fields");
// //       return next(createError(400, 'Missing required fields'));
// //     }

// //     const targetSemester = Number(semester);
// //     console.log(`🎯 Target Semester: ${targetSemester}`);
// //     console.log(`🏢 Department ID: ${departmentId}`);
// //     console.log(`📅 Academic Year: ${academicYear}`);
// //     console.log(`👥 Divisions: ${divisions.join(', ')}`);

// //     // Filter resources by semester
// //     const filteredSubjects = subjects.filter(s => Number(s.semester) === targetSemester);
// //     const filteredTeachers = teachers.filter(t => Number(t.semester) === targetSemester);
// //     const filteredClasses = classes.filter(c => {
// //       const classSemester = typeof c.semester === 'number' ? c.semester : Number(c.semester);
// //       return classSemester === targetSemester;
// //     });

// //     // Initialize genetic algorithm with string-based divisions
// //     const geneticAlgorithm = new GeneticAlgorithm({
// //       populationSize: 50,
// //       maxGenerations: 100,
// //       mutationRate: 0.1,
// //       crossoverRate: 0.8,
// //       elitismRate: 0.1,
// //       departmentId,
// //       semester: targetSemester,
// //       academicYear,
// //       divisions: divisions, // Pass string array directly
// //     });

// //     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
// //       divisions,
// //       subjects: filteredSubjects,
// //       teachers: filteredTeachers,
// //       classes: filteredClasses,
// //     });

// //     // Create timetable with string-based divisions
// //     const timetable = new Timetable({
// //       departmentId,
// //       semester: targetSemester,
// //       academicYear,
// //       divisions: divisions.map((divisionName) => ({
// //         division_name: divisionName, // Use division name directly
// //         schedule: schedule[divisionName] || {}
// //       })),
// //       status: 'draft',
// //       generation_metadata: {
// //         fitness_score: metadata.fitnessScore,
// //         generation_count: metadata.generations,
// //         conflicts_resolved: metadata.conflictsResolved,
// //         algorithm_version: metadata.algorithm_version,
// //         generated_at: new Date(),
// //       },
// //     });

// //     await timetable.save();
// //     console.log("💾 Timetable saved to DB");

// //     res.status(201).json({
// //       success: true,
// //       data: timetable,
// //       message: 'Timetable generated successfully',
// //     });

// //   } catch (error) {
// //     console.error('❌ Error in timetable generation:', error.message);
// //     console.error('🧵 Stack Trace:', error.stack);
// //     next(createError(500, 'Error in timetable generation algorithm'));
// //   }
// // }

// // static async generateTimetable(req, res, next) {
// //   try {
// //     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

// //     const {
// //       departmentId,
// //       semester,
// //       academicYear,
// //       divisions, // Array of strings like ['TYA', 'SYB']
// //       subjects,
// //       teachers,
// //       classes,
// //     } = req.body;

// //     // Validate required fields
// //     if (!departmentId || !semester || !academicYear || !divisions?.length) {
// //       console.log("❗ Missing required fields");
// //       return next(createError(400, 'Missing required fields'));
// //     }

// //     // Validate division format
// //     if (!Array.isArray(divisions) || !divisions.every(div => typeof div === 'string')) {
// //       console.log("❗ Invalid divisions format. Received:", divisions);
// //       return next(createError(400, 'Divisions must be an array of strings (e.g. ["TYA", "SYB"])'));
// //     }

// //     const targetSemester = Number(semester);
// //     console.log("🎯 Target Semester:", targetSemester);
// //     console.log("🏢 Department ID:", departmentId);
// //     console.log("📅 Academic Year:", academicYear);
// //     console.log("👥 Divisions:", divisions.join(', '));

// //     // Filter inputs by semester
// //     const filteredSubjects = subjects.filter(s => Number(s.semester) === targetSemester);
// //     const filteredTeachers = teachers.filter(t => Number(t.semester) === targetSemester);
// //     const filteredClasses = classes.filter(c => {
// //       const classSemester = typeof c.semester === 'number' ? c.semester : Number(c.semester);
// //       return classSemester === targetSemester;
// //     });

// //     console.log("📚 Filtered Subjects:", JSON.stringify(filteredSubjects, null, 2));
// //     console.log("👩‍🏫 Filtered Teachers:", JSON.stringify(filteredTeachers, null, 2));
// //     console.log("🏫 Filtered Classes:", JSON.stringify(filteredClasses, null, 2));

// //     // Initialize Genetic Algorithm
// //     const geneticAlgorithm = new GeneticAlgorithm({
// //       populationSize: 50,
// //       maxGenerations: 100,
// //       mutationRate: 0.1,
// //       crossoverRate: 0.8,
// //       elitismRate: 0.1,
// //       departmentId,
// //       semester: targetSemester,
// //       academicYear,
// //       divisions,
// //     });

// //     console.log("🧬 Starting Genetic Algorithm...");
// //     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
// //       divisions,
// //       subjects: filteredSubjects,
// //       teachers: filteredTeachers,
// //       classes: filteredClasses,
// //     });

// //     console.log("📅 Generated Schedule:", JSON.stringify(schedule, null, 2));
// //     console.log("📊 Metadata:", metadata);

// //     // Construct and save Timetable
// //     const timetable = new Timetable({
// //       departmentId,
// //       semester: targetSemester,
// //       academicYear,
// //       divisions: divisions.map((divisionName) => ({
// //         division_name: divisionName,
// //         schedule: schedule[divisionName] || {}
// //       })),
// //       status: 'draft',
// //       generation_metadata: {
// //         fitness_score: metadata.fitnessScore,
// //         generation_count: metadata.generations,
// //         conflicts_resolved: metadata.conflictsResolved,
// //         algorithm_version: metadata.algorithm_version,
// //         generated_at: new Date(),
// //       },
// //     });

// //     await timetable.save();
// //     console.log("💾 Timetable saved to DB");

// //     res.status(201).json({
// //       success: true,
// //       data: timetable,
// //       message: 'Timetable generated successfully',
// //     });

// //   } catch (error) {
// //     console.error('❌ Error in timetable generation:', error.message);
// //     console.error('🧵 Stack Trace:', error.stack);
// //     next(createError(500, 'Error in timetable generation algorithm'));
// //   }
// // }
// static async generateTimetable(req, res, next) {
//   try {
//     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects,
//       teachers,
//       classes,
//     } = req.body;

//     if (!departmentId || !semester || !academicYear || !divisions?.length) {
//       console.log("❗ Missing required fields");
//       return next(createError(400, 'Missing required fields'));
//     }

//     if (!Array.isArray(divisions) || !divisions.every(div => typeof div === 'string')) {
//       console.log("❗ Invalid divisions format. Received:", divisions);
//       return next(createError(400, 'Divisions must be an array of strings (e.g. [\"TYA\", \"SYB\"])'));
//     }

//     const targetSemester = Number(semester);
//     console.log("🎯 Target Semester:", targetSemester);
//     console.log("🏢 Department ID:", departmentId);
//     console.log("📅 Academic Year:", academicYear);
//     console.log("👥 Divisions:", divisions.join(', '));

//     // Filter inputs by semester
//     const filteredSubjects = subjects.filter(s => Number(s.semester) === targetSemester);
//     const filteredTeachers = teachers.filter(t => Number(t.semester) === targetSemester);
//     const filteredClasses = classes.filter(c => {
//       const classSemester = typeof c.semester === 'number' ? c.semester : Number(c.semester);
//       return classSemester === targetSemester;
//     });

//     console.log("📚 Filtered Subjects:", JSON.stringify(filteredSubjects, null, 2));
//     console.log("👩‍🏫 Filtered Teachers:", JSON.stringify(filteredTeachers, null, 2));
//     console.log("🏫 Filtered Classes:", JSON.stringify(filteredClasses, null, 2));

//     const geneticAlgorithm = new GeneticAlgorithm({
//       populationSize: 50,
//       maxGenerations: 100,
//       mutationRate: 0.1,
//       crossoverRate: 0.8,
//       elitismRate: 0.1,
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions,
//     });

//     console.log("🧬 Starting Genetic Algorithm with 6 periods per day...");
//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     });

//     console.log("✅ Algorithm Finished.");
//     console.log("📅 Generated Schedule (raw):", JSON.stringify(schedule, null, 2));
//     console.log("📊 Metadata:", metadata);

//     // Log division-wise summary of scheduled days and periods
//     Object.entries(schedule).forEach(([division, daySchedule]) => {
//       console.log(`📘 Division: ${division}`);
//       Object.entries(daySchedule).forEach(([day, periods]) => {
//         console.log(`   📅 ${day} => ${periods.length} periods`);
//         periods.forEach((p, idx) => {
//           console.log(`      🕒 Period ${idx + 1}: ${p ? p.subject + ' by ' + p.teacher : 'Free'}`);
//         });
//       });
//     });

//     const timetable = new Timetable({
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions: divisions.map((divisionName) => ({
//         division_name: divisionName,
//         schedule: schedule[divisionName] || {}
//       })),
//       status: 'draft',
//       generation_metadata: {
//         fitness_score: metadata.fitnessScore,
//         generation_count: metadata.generations,
//         conflicts_resolved: metadata.conflictsResolved,
//         algorithm_version: metadata.algorithm_version,
//         generated_at: new Date(),
//       },
//     });

//     await timetable.save();
//     console.log("💾 Timetable saved to DB");

//     res.status(201).json({
//       success: true,
//       data: timetable,
//       message: 'Timetable generated successfully',
//     });

//   } catch (error) {
//     console.error('❌ Error in timetable generation:', error.message);
//     console.error('🧵 Stack Trace:', error.stack);
//     next(createError(500, 'Error in timetable generation algorithm'));
//   }
// }


// static async  validateTimetable(timetable) {
//   const conflicts = [];
//   const teacherAssignments = new Map();
//   const classAssignments = new Map();

//   timetable.divisions.forEach(division => {
//     Object.entries(division.schedule).forEach(([day, periods]) => {
//       periods.forEach((slot, periodIndex) => {
//         if (!slot || !slot.teacher) return;

//         // Check teacher conflicts
//         const teacherKey = `${slot.teacher._id}_${day}_${periodIndex}`;
//         if (teacherAssignments.has(teacherKey)) {
//           conflicts.push({
//             type: 'teacher_conflict',
//             description: `Teacher ${slot.teacher.name} has multiple classes at period ${periodIndex + 1} on ${day}`,
//             severity: 'high'
//           });
//         }
//         teacherAssignments.set(teacherKey, true);

//         // Check classroom conflicts
//         const classKey = `${slot.classroom}_${day}_${periodIndex}`;
//         if (classAssignments.has(classKey)) {
//           conflicts.push({
//             type: 'classroom_conflict',
//             description: `Classroom ${slot.classroom} is double-booked at period ${periodIndex + 1} on ${day}`,
//             severity: 'medium'
//           });
//         }
//         classAssignments.set(classKey, true);

//         // Check lab sessions
//         if (slot.subject.type === 'Lab' && periodIndex < 5) {
//           const nextPeriod = periods[periodIndex + 1];
//           if (nextPeriod && nextPeriod.subject) {
//             conflicts.push({
//               type: 'lab_conflict',
//               description: `Lab session for ${slot.subject.name} doesn't have consecutive periods on ${day}`,
//               severity: 'high'
//             });
//           }
//         }
//       });
//     });
//   });

//   return conflicts;
// }

//   static async getTimetables(req, res, next) {
//     try {
//       const { departmentId } = req.params;
//       const { semester, academicYear, status } = req.query;

//       const query = { department_id: departmentId };
//       if (semester) query.semester = semester;
//       if (academicYear) query.academicYear = academicYear;
//       if (status) query.status = status;

//       const timetables = await Timetable.find(query)
//         .populate('department_id', 'name')
//         .sort({ createdAt: -1 });

//       res.json({
//         success: true,
//         data: timetables
//       });

//     } catch (error) {
//       next(createError(500, 'Error fetching timetables'));
//     }
//   }

//   static async getTimetableById(req, res, next) {
//     try {
//       const timetable = await Timetable.findById(req.params.id)
//         .populate('department_id', 'name');

//       if (!timetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       res.json({
//         success: true,
//         data: timetable
//       });

//     } catch (error) {
//       next(createError(500, 'Error fetching timetable'));
//     }
//   }

//   static async updateStatus(req, res, next) {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;

//       const timetable = await Timetable.findByIdAndUpdate(
//         id,
//         { status },
//         { new: true }
//       );

//       if (!timetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       res.json({
//         success: true,
//         data: timetable
//       });

//     } catch (error) {
//       next(createError(500, 'Error updating timetable status'));
//     }
//   }

//   static async deleteTimetable(req, res, next) {
//     try {
//       const timetable = await Timetable.findByIdAndDelete(req.params.id);

//       if (!timetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       res.json({
//         success: true,
//         message: 'Timetable deleted successfully'
//       });

//     } catch (error) {
//       next(createError(500, 'Error deleting timetable'));
//     }
//   }

//   static async getStatistics(req, res, next) {
//     try {
//       const timetable = await Timetable.findById(req.params.id);

//       if (!timetable) {
//         return next(createError(404, 'Timetable not found'));
//       }

//       // Calculate statistics
//       const statistics = {
//         totalClasses: 0,
//         labSessions: 0,
//         theorySessions: 0,
//         teacherUtilization: 0,
//         roomUtilization: 0,
//         fitness_score: timetable.generation_metadata?.fitness_score || 0
//       };

//       // Calculate statistics from schedule
//       timetable.divisions.forEach(div => {
//         Object.values(div.schedule).forEach(daySchedule => {
//           daySchedule.forEach(slot => {
//             if (slot && slot.subject) {
//               statistics.totalClasses++;
//               if (slot.type === 'lab') statistics.labSessions++;
//               else statistics.theorySessions++;
//             }
//           });
//         });
//       });

//       res.json({
//         success: true,
//         data: { statistics }
//       });

//     } catch (error) {
//       next(createError(500, 'Error fetching statistics'));
//     }
//   }
// }

// export default TimetableController;




import Timetable from '../models/timetable.model.js';
import { createError } from '../utils/error.js';
import GeneticAlgorithm from '../utils/timetableGenerator.js';
import subjectModel from '../models/subject.model.js';
import teacherModel from '../models/teacher.model.js';
import classModel from '../models/class.model.js';
import PDFDocument from 'pdfkit';
class TimetableController {

// static async generateTimetable(req, res, next) {
//   try {
//     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects,
//       teachers,
//       classes,
//     } = req.body;

//     if (!departmentId || !semester || !academicYear || !divisions?.length) {
//       console.log("❗ Missing required fields");
//       return next(createError(400, 'Missing required fields'));
//     }

//     if (!Array.isArray(divisions) || !divisions.every(div => typeof div === 'string')) {
//       console.log("❗ Invalid divisions format. Received:", divisions);
//       return next(createError(400, 'Divisions must be an array of strings (e.g. [\"TYA\", \"SYB\"])'));
//     }

//     const targetSemester = Number(semester);
//     console.log("🎯 Target Semester:", targetSemester);
//     console.log("🏢 Department ID:", departmentId);
//     console.log("📅 Academic Year:", academicYear);
//     console.log("👥 Divisions:", divisions.join(', '));

//       console.log("📚 Subjects:", JSON.stringify(subjects, null, 2));

//     // Filter inputs by semester
//     const filteredSubjects = subjects.filter(s => Number(s.semester) === targetSemester);
//     const filteredTeachers = teachers.filter(t => Number(t.semester) === targetSemester);
//     const filteredClasses = classes.filter(c => {
//       const classSemester = typeof c.semester === 'number' ? c.semester : Number(c.semester);
//       return classSemester === targetSemester;
//     });

//     console.log("📚 Filtered Subjects:", JSON.stringify(filteredSubjects, null, 2));
//     console.log("👩‍🏫 Filtered Teachers:", JSON.stringify(filteredTeachers, null, 2));
//     console.log("🏫 Filtered Classes:", JSON.stringify(filteredClasses, null, 2));

//     const geneticAlgorithm = new GeneticAlgorithm({
//       populationSize: 50,
//       maxGenerations: 100,
//       mutationRate: 0.1,
//       crossoverRate: 0.8,
//       elitismRate: 0.1,
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions,
//     });

//     console.log("🧬 Starting Genetic Algorithm with 6 periods per day...");
//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     });

//     console.log("✅ Algorithm Finished.");
//     console.log("📅 Generated Schedule (raw):", JSON.stringify(schedule, null, 2));
//     console.log("📊 Metadata:", metadata);

//     // ✅ ENHANCED: Improved logging with better object property handling
//     Object.entries(schedule).forEach(([division, daySchedule]) => {
//       console.log(`📘 Division: ${division}`);
//       Object.entries(daySchedule).forEach(([day, periods]) => {
//         console.log(`   📅 ${day} => ${periods.length} periods`);
//         periods.forEach((period, idx) => {
//           if (!period) {
//             console.log(`      🕒 Period ${idx + 1}: Free Period`);
//           } else {
//             // ✅ FIXED: Enhanced debugging and property access
//             console.log(`      🔍 Debug Period ${idx + 1} structure:`, JSON.stringify(period, null, 4));
            
//             // Multiple ways to access subject name to handle different data structures
//             let subjectName = 'No Subject';
//             if (period.subject) {
//               if (typeof period.subject === 'string') {
//                 subjectName = period.subject;
//               } else if (period.subject.name) {
//                 subjectName = period.subject.name;
//               } else if (period.subject.subjectName) {
//                 subjectName = period.subject.subjectName;
//               } else if (period.subject._id) {
//                 subjectName = `Subject ID: ${period.subject._id}`;
//               }
//             }
            
//             // Multiple ways to access teacher name
//             let teacherName = 'No Teacher';
//             if (period.teacher) {
//               if (typeof period.teacher === 'string') {
//                 teacherName = period.teacher;
//               } else if (period.teacher.name) {
//                 teacherName = period.teacher.name;
//               } else if (period.teacher.teacherName) {
//                 teacherName = period.teacher.teacherName;
//               } else if (period.teacher._id) {
//                 teacherName = `Teacher ID: ${period.teacher._id}`;
//               }
//             }
            
//             // Multiple ways to access classroom info
//             let roomNumber = 'No Room';
//             if (period.classroom) {
//               if (typeof period.classroom === 'string') {
//                 roomNumber = period.classroom;
//               } else if (period.classroom.room_number) {
//                 roomNumber = period.classroom.room_number;
//               } else if (period.classroom.roomNumber) {
//                 roomNumber = period.classroom.roomNumber;
//               } else if (period.classroom.name) {
//                 roomNumber = period.classroom.name;
//               } else if (period.classroom._id) {
//                 roomNumber = `Room ID: ${period.classroom._id}`;
//               }
//             }
            
//             const startTime = period.start_time || period.startTime || '??';
//             const endTime = period.end_time || period.endTime || '??';
            
//             console.log(`      🕒 Period ${idx + 1} (${startTime}-${endTime}): ${subjectName} by ${teacherName} in Room ${roomNumber}`);
//           }
//         });
//       });
//     });

//     const timetable = new Timetable({
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions: divisions.map((divisionName) => ({
//         division_name: divisionName,
//         schedule: schedule[divisionName] || {}
//       })),
//       status: 'draft',
//       generation_metadata: {
//         fitness_score: metadata.fitnessScore,
//         generation_count: metadata.generations,
//         conflicts_resolved: metadata.conflictsResolved,
//         algorithm_version: metadata.algorithm_version,
//         generated_at: new Date(),
//       },
//     });

//     // await timetable.save();
//     // console.log("💾 Timetable saved to DB");

//     // res.status(201).json({
//     //   success: true,
//     //   data: timetable,
//     //   message: 'Timetable generated successfully',
//     // });

//     await timetable.save();
// console.log("💾 Timetable saved to DB");

// // ✅ Populate nested references after saving
// const populatedTimetable = await Timetable.findById(timetable._id).lean();

// res.status(201).json({
//   success: true,
//   data: populatedTimetable,
//   message: 'Timetable generated successfully',
// });


//   } catch (error) {
//     console.error('❌ Error in timetable generation:', error.message);
//     console.error('🧵 Stack Trace:', error.stack);
//     next(createError(500, 'Error in timetable generation algorithm'));
//   }
// }

// static async generateTimetable(req, res, next) {
//   try {
//     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects,
//       teachers,
//       classes,
//     } = req.body;

//     if (!departmentId || !semester || !academicYear || !divisions?.length) {
//       console.log("❗ Missing required fields");
//       return next(createError(400, 'Missing required fields'));
//     }

//     if (!Array.isArray(divisions) || !divisions.every(div => typeof div === 'string')) {
//       console.log("❗ Invalid divisions format. Received:", divisions);
//       return next(createError(400, 'Divisions must be an array of strings (e.g. [\"TYA\", \"SYB\"])'));
//     }

//     const targetSemester = Number(semester);
//     console.log("🎯 Target Semester:", targetSemester);
//     console.log("🏢 Department ID:", departmentId);
//     console.log("📅 Academic Year:", academicYear);
//     console.log("👥 Divisions:", divisions.join(', '));
//     console.log("📚 Subjects:", JSON.stringify(subjects, null, 2));

//     // 🛠️ UPDATED: Fetch full documents from MongoDB
//     const subjectIds = subjects.map(s => s._id);
//     const teacherIds = teachers.map(t => t._id);
//     const classIds = classes.map(c => c._id);

//  const allSubjects = await subjectModel.find({ _id: { $in: subjectIds } });
// const allTeachers = await teacherModel.find({ _id: { $in: teacherIds } });
// const allClasses = await classModel.find({ _id: { $in: classIds } });

//     // ✅ Semester filter
//     const filteredSubjects = allSubjects.filter(s => Number(s.semester) === targetSemester);
//     const filteredTeachers = allTeachers.filter(t => Number(t.semester) === targetSemester);
//     const filteredClasses = allClasses.filter(c => {
//       const classSemester = typeof c.semester === 'number' ? c.semester : Number(c.semester);
//       return classSemester === targetSemester;
//     });

//     console.log("📚 Filtered Subjects:", JSON.stringify(filteredSubjects, null, 2));
//     console.log("👩‍🏫 Filtered Teachers:", JSON.stringify(filteredTeachers, null, 2));
//     console.log("🏫 Filtered Classes:", JSON.stringify(filteredClasses, null, 2));

//     const geneticAlgorithm = new GeneticAlgorithm({
//       populationSize: 50,
//       maxGenerations: 100,
//       mutationRate: 0.1,
//       crossoverRate: 0.8,
//       elitismRate: 0.1,
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions,
//     });

//     console.log("🧬 Starting Genetic Algorithm with 6 periods per day...");
//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     });

//     console.log("✅ Algorithm Finished.");
//     console.log("📅 Generated Schedule (raw):", JSON.stringify(schedule, null, 2));
//     console.log("📊 Metadata:", metadata);

//     Object.entries(schedule).forEach(([division, daySchedule]) => {
//       console.log(`📘 Division: ${division}`);
//       Object.entries(daySchedule).forEach(([day, periods]) => {
//         console.log(`   📅 ${day} => ${periods.length} periods`);
//         periods.forEach((period, idx) => {
//           if (!period) {
//             console.log(`      🕒 Period ${idx + 1}: Free Period`);
//           } else {
//             console.log(`      🔍 Debug Period ${idx + 1} structure:`, JSON.stringify(period, null, 4));

//             let subjectName = 'No Subject';
//             if (period.subject) {
//               if (typeof period.subject === 'string') subjectName = period.subject;
//               else if (period.subject.name) subjectName = period.subject.name;
//               else if (period.subject.subjectName) subjectName = period.subject.subjectName;
//               else if (period.subject._id) subjectName = `Subject ID: ${period.subject._id}`;
//             }

//             let teacherName = 'No Teacher';
//             if (period.teacher) {
//               if (typeof period.teacher === 'string') teacherName = period.teacher;
//               else if (period.teacher.name) teacherName = period.teacher.name;
//               else if (period.teacher.teacherName) teacherName = period.teacher.teacherName;
//               else if (period.teacher._id) teacherName = `Teacher ID: ${period.teacher._id}`;
//             }

//             let roomNumber = 'No Room';
//             if (period.classroom) {
//               if (typeof period.classroom === 'string') roomNumber = period.classroom;
//               else if (period.classroom.room_number) roomNumber = period.classroom.room_number;
//               else if (period.classroom.roomNumber) roomNumber = period.classroom.roomNumber;
//               else if (period.classroom.name) roomNumber = period.classroom.name;
//               else if (period.classroom._id) roomNumber = `Room ID: ${period.classroom._id}`;
//             }

//             const startTime = period.start_time || period.startTime || '??';
//             const endTime = period.end_time || period.endTime || '??';

//             console.log(`      🕒 Period ${idx + 1} (${startTime}-${endTime}): ${subjectName} by ${teacherName} in Room ${roomNumber}`);
//           }
//         });
//       });
//     });

//     const timetable = new Timetable({
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions: divisions.map((divisionName) => ({
//         division_name: divisionName,
//         schedule: schedule[divisionName] || {}
//       })),
//       status: 'draft',
//       generation_metadata: {
//         fitness_score: metadata.fitnessScore,
//         generation_count: metadata.generations,
//         conflicts_resolved: metadata.conflictsResolved,
//         algorithm_version: metadata.algorithm_version,
//         generated_at: new Date(),
//       },
//     });

//     await timetable.save();
//     console.log("💾 Timetable saved to DB");

//     const populatedTimetable = await Timetable.findById(timetable._id).lean();

//     res.status(201).json({
//       success: true,
//       data: populatedTimetable,
//       message: 'Timetable generated successfully',
//     });

//   } catch (error) {
//     console.error('❌ Error in timetable generation:', error.message);
//     console.error('🧵 Stack Trace:', error.stack);
//     next(createError(500, 'Error in timetable generation algorithm'));
//   }
// }


// static async generateTimetable(req, res, next) {
//   try {
//     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects = [],
//       teachers = [],
//       classes = [],
//     } = req.body;

//     if (!departmentId || !semester || !academicYear || !divisions?.length) {
//       console.log("❗ Missing required fields");
//       return next(createError(400, 'Missing required fields'));
//     }

//     if (!Array.isArray(divisions) || !divisions.every(div => typeof div === 'string')) {
//       console.log("❗ Invalid divisions format:", divisions);
//       return next(createError(400, 'Divisions must be an array of strings'));
//     }

//     const targetSemester = Number(semester);
//     const normalizeSemester = (s) => {
//       const n = Number(s?.toString().trim());
//       return isNaN(n) ? null : n;
//     };

//     console.log("🎯 Semester:", targetSemester);
//     console.log("🏢 Department ID:", departmentId);
//     console.log("📅 Academic Year:", academicYear);
//     console.log("👥 Divisions:", divisions.join(', '));

//     const subjectIds = subjects.map(s => s._id);
//     const teacherIds = teachers.map(t => t._id);
//     const classIds = classes.map(c => c._id);

//     // Get full DB data for matching IDs
//     const allSubjects = await subjectModel.find({ _id: { $in: subjectIds } });
//     const allTeachers = await teacherModel.find({ _id: { $in: teacherIds } });
//     const allClasses = await classModel.find({ _id: { $in: classIds } });

//     console.log("📦 Raw Subjects from DB:", allSubjects);
//     console.log("🔍 Teacher Semesters:", allTeachers.map(t => t.semester));
//     console.log("🔍 Class Semesters:", allClasses.map(c => c.semester));

//     const filteredSubjects = allSubjects;
//     const filteredTeachers = allTeachers.filter(t => normalizeSemester(t.semester) === targetSemester);
//     const filteredClasses = allClasses.filter(c => normalizeSemester(c.semester) === targetSemester);

//     console.log("📚 Filtered Subjects:", filteredSubjects.map(s => `${s.subjectName || s.name || 'Unnamed Subject'} (${s._id})`).join(', ') || 'None');
//     console.log("👩‍🏫 Filtered Teachers:", filteredTeachers.map(t => `${t.name || 'Unnamed Teacher'} (${t._id})`).join(', ') || 'None');
//     console.log("🏫 Filtered Classes:", filteredClasses.map(c => `${c.className || c.room_number || 'Unnamed Room'} (${c._id})`).join(', ') || 'None');

//     if (!filteredSubjects.length || !filteredTeachers.length || !filteredClasses.length) {
//       console.warn("⚠️ Missing required filtered entities to generate timetable");
//       return next(createError(400, 'Subjects, teachers, and classes must not be empty for the given semester'));
//     }

//     const geneticAlgorithm = new GeneticAlgorithm({
//       populationSize: 50,
//       maxGenerations: 100,
//       mutationRate: 0.1,
//       crossoverRate: 0.8,
//       elitismRate: 0.1,
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions,
//     });

//     console.log("🧬 Running Genetic Algorithm...");
//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     });

//     if (!schedule || Object.keys(schedule).length === 0) {
//       console.warn("⚠️ Generated schedule is empty.");
//       return next(createError(500, 'Failed to generate a valid schedule'));
//     }

//     console.log("✅ Schedule generated. Logging summary:");
//     for (const [division, daySchedule] of Object.entries(schedule)) {
//       console.log(`📘 Division: ${division}`);
//       for (const [day, periods] of Object.entries(daySchedule)) {
//         console.log(`   📅 ${day} => ${periods.length} periods`);
//         periods.forEach((period, idx) => {
//           if (!period) {
//             console.log(`      🕒 Period ${idx + 1}: Free Period`);
//             return;
//           }

//           const subject =
//             typeof period.subject === 'string'
//               ? period.subject
//               : period.subject?.subjectName || period.subject?.name || 'Unnamed Subject';

//           const teacher =
//             typeof period.teacher === 'string'
//               ? period.teacher
//               : period.teacher?.name || 'Unnamed Teacher';

//           const classroom =
//             typeof period.classroom === 'string'
//               ? period.classroom
//               : period.classroom?.room_number || period.classroom?.className || 'Unnamed Room';

//           const start = period.start_time || period.startTime || '??';
//           const end = period.end_time || period.endTime || '??';

//           console.log(`      🕒 Period ${idx + 1} (${start}-${end}): ${subject} by ${teacher} in Room ${classroom}`);
//         });
//       }
//     }

//     const timetable = new Timetable({
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions: divisions.map(name => ({
//         division_name: name,
//         schedule: schedule[name] || {},
//       })),
//       status: 'draft',
//       generation_metadata: {
//         fitness_score: metadata.fitnessScore,
//         generation_count: metadata.generation_count || metadata.generations || 0,
//         conflicts_resolved: metadata.conflictsResolved,
//         algorithm_version: metadata.algorithm_version,
//         generated_at: new Date(),
//       },
//     });

//     await timetable.save();
//     console.log("💾 Timetable saved.");

//     const savedTimetable = await Timetable.findById(timetable._id).lean();

//     res.status(201).json({
//       success: true,
//       message: 'Timetable generated successfully',
//       data: savedTimetable,
//     });

//   } catch (error) {
//     console.error('❌ Error generating timetable:', error.message);
//     console.error('🧵 Stack Trace:', error.stack);
//     next(createError(500, 'Error in timetable generation'));
//   }
// }

// static async generateTimetable(req, res, next) {
//   try {
//     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects = [],
//       teachers = [],
//       classes = [],
//     } = req.body;

//     if (!departmentId || !semester || !academicYear || !divisions?.length) {
//       console.log("❗ Missing required fields");
//       return next(createError(400, 'Missing required fields'));
//     }

//     if (!Array.isArray(divisions) || !divisions.every(div => typeof div === 'string')) {
//       console.log("❗ Invalid divisions format:", divisions);
//       return next(createError(400, 'Divisions must be an array of strings'));
//     }

//     const targetSemester = Number(semester);
//     const normalizeSemester = (s) => {
//       const n = Number(s?.toString().trim());
//       return isNaN(n) ? null : n;
//     };

//     console.log("🎯 Semester:", targetSemester);
//     console.log("🏢 Department ID:", departmentId);
//     console.log("📅 Academic Year:", academicYear);
//     console.log("👥 Divisions:", divisions.join(', '));

//     const subjectIds = subjects.map(s => s._id);
//     const teacherIds = teachers.map(t => t._id);
//     const classIds = classes.map(c => c._id);

//     const allSubjects = await subjectModel.find({ _id: { $in: subjectIds } });
//     const allTeachers = await teacherModel.find({ _id: { $in: teacherIds } });
//     const allClasses = await classModel.find({ _id: { $in: classIds } });

//     console.log("📦 Raw Subjects from DB:", allSubjects);
//     console.log("🔍 Teacher Semesters:", allTeachers.map(t => t.semester));
//     console.log("🔍 Class Semesters:", allClasses.map(c => c.semester));

//     // 💡 Inject semester into each subject if not present
//     const filteredSubjects = allSubjects.map((subject) => ({
//       ...subject.toObject(),  // ensure it's a plain object
//       semester: targetSemester,
//     }));

//     const filteredTeachers = allTeachers.filter(t => normalizeSemester(t.semester) === targetSemester);
//     const filteredClasses = allClasses.filter(c => normalizeSemester(c.semester) === targetSemester);

//     console.log("📚 Filtered Subjects:", filteredSubjects.map(s => `${s.subjectName || s.name || 'Unnamed Subject'} (${s._id})`).join(', ') || 'None');
//     console.log("👩‍🏫 Filtered Teachers:", filteredTeachers.map(t => `${t.name || 'Unnamed Teacher'} (${t._id})`).join(', ') || 'None');
//     console.log("🏫 Filtered Classes:", filteredClasses.map(c => `${c.className || c.room_number || 'Unnamed Room'} (${c._id})`).join(', ') || 'None');

//     if (!filteredSubjects.length || !filteredTeachers.length || !filteredClasses.length) {
//       console.warn("⚠️ Missing required filtered entities to generate timetable");
//       return next(createError(400, 'Subjects, teachers, and classes must not be empty for the given semester'));
//     }

//     const geneticAlgorithm = new GeneticAlgorithm({
//       populationSize: 50,
//       maxGenerations: 100,
//       mutationRate: 0.1,
//       crossoverRate: 0.8,
//       elitismRate: 0.1,
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions,
//     });

//     console.log("🧬 Running Genetic Algorithm...");
//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     });

//     if (!schedule || Object.keys(schedule).length === 0) {
//       console.warn("⚠️ Generated schedule is empty.");
//       return next(createError(500, 'Failed to generate a valid schedule'));
//     }

//     console.log("✅ Schedule generated. Logging summary:");
//     for (const [division, daySchedule] of Object.entries(schedule)) {
//       console.log(`📘 Division: ${division}`);
//       for (const [day, periods] of Object.entries(daySchedule)) {
//         console.log(`   📅 ${day} => ${periods.length} periods`);
//         periods.forEach((period, idx) => {
//           if (!period) {
//             console.log(`      🕒 Period ${idx + 1}: Free Period`);
//             return;
//           }

//           const subject = typeof period.subject === 'string'
//             ? period.subject
//             : period.subject?.subjectName || period.subject?.name || 'Unnamed Subject';

//           const teacher = typeof period.teacher === 'string'
//             ? period.teacher
//             : period.teacher?.name || 'Unnamed Teacher';

//           const classroom = typeof period.classroom === 'string'
//             ? period.classroom
//             : period.classroom?.room_number || period.classroom?.className || 'Unnamed Room';

//           const start = period.start_time || period.startTime || '??';
//           const end = period.end_time || period.endTime || '??';

//           console.log(`      🕒 Period ${idx + 1} (${start}-${end}): ${subject} by ${teacher} in Room ${classroom}`);
//         });
//       }
//     }

//     const timetable = new Timetable({
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions: divisions.map(name => ({
//         division_name: name,
//         schedule: schedule[name] || {},
//       })),
//       status: 'draft',
//       generation_metadata: {
//         fitness_score: metadata.fitnessScore,
//         generation_count: metadata.generation_count || metadata.generations || 0,
//         conflicts_resolved: metadata.conflictsResolved,
//         algorithm_version: metadata.algorithm_version,
//         generated_at: new Date(),
//       },
//     });

//     await timetable.save();
//     console.log("💾 Timetable saved.");

//     const savedTimetable = await Timetable.findById(timetable._id).lean();

//     res.status(201).json({
//       success: true,
//       message: 'Timetable generated successfully',
//       data: savedTimetable,
//     });

//   } catch (error) {
//     console.error('❌ Error generating timetable:', error.message);
//     console.error('🧵 Stack Trace:', error.stack);
//     next(createError(500, 'Error in timetable generation'));
//   }
// }

// static async generateTimetable(req, res, next) {
//   try {
//     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects = [],
//       teachers = [],
//       classes = [],
//     } = req.body;

//     if (!departmentId || !semester || !academicYear || !Array.isArray(divisions) || divisions.length === 0) {
//       console.log("❗ Missing required fields");
//       return next(createError(400, 'Missing required fields: departmentId, semester, academicYear, or divisions'));
//     }

//     const targetSemester = String(semester).trim();
//     const normalize = (val) => String(val ?? '').trim();

//     // console.log("🎯 Semester:", targetSemester);
//     // console.log("🏢 Department ID:", departmentId);
//     // console.log("📅 Academic Year:", academicYear);
//     // console.log("👥 Divisions:", divisions.join(', '));

//     // Normalize semester fields for filtering
//     const filteredSubjects = subjects.filter(
//       (s) => normalize(s.semester) === targetSemester
//     );

//     const filteredTeachers = teachers.filter(
//       (t) => normalize(t.semester) === targetSemester
//     );

//     const filteredClasses = classes.filter(
//       (c) => normalize(c.semester) === targetSemester
//     );

//     // console.log("📚 Filtered Subjects:", filteredSubjects.length);
//     // console.log("👩‍🏫 Filtered Teachers:", filteredTeachers.length);
//     // console.log("🏫 Filtered Classes:", filteredClasses.length);

//     if (!filteredSubjects.length || !filteredTeachers.length || !filteredClasses.length) {
//       return next(createError(400, `Subjects, teachers, and classes must not be empty for semester ${semester}`));
//     }

//     // 🧬 Run genetic algorithm
//     const geneticAlgorithm = new GeneticAlgorithm({
//       populationSize: 50,
//       maxGenerations: 100,
//       mutationRate: 0.1,
//       crossoverRate: 0.8,
//       elitismRate: 0.1,
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions,
//     });

//     // console.log("🧬 Running Genetic Algorithm...");
//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     });

//     if (!schedule || Object.keys(schedule).length === 0) {
//       return next(createError(500, 'Failed to generate a valid schedule'));
//     }

//     // 📝 Logging summary
//     for (const [division, daySchedule] of Object.entries(schedule)) {
//       // console.log(`📘 Division: ${division}`);
//       for (const [day, periods] of Object.entries(daySchedule)) {
//         // console.log(`   📅 ${day} => ${periods.length} periods`);
//         periods.forEach((period, idx) => {
//           if (!period) {
//             // console.log(`      🕒 Period ${idx + 1}: Free Period`);
//             return;
//           }

//           const subject = typeof period.subject === 'string'
//             ? period.subject
//             : period.subject?.subjectName || period.subject?.name || 'Unnamed Subject';

//           const teacher = typeof period.teacher === 'string'
//             ? period.teacher
//             : period.teacher?.name || 'Unnamed Teacher';

//           const classroom = typeof period.classroom === 'string'
//             ? period.classroom
//             : period.classroom?.room_number || period.classroom?.className || 'Unnamed Room';

//           const start = period.start_time || period.startTime || '??';
//           const end = period.end_time || period.endTime || '??';

//           // console.log(`      🕒 Period ${idx + 1} (${start}-${end}): ${subject} by ${teacher} in Room ${classroom}`);
//         });
//       }
//     }

//     // 💾 Save timetable
//     const timetable = new Timetable({
//       departmentId,
//       semester: Number(targetSemester),
//       academicYear,
//       divisions: divisions.map(name => ({
//         division_name: name,
//         schedule: schedule[name] || {},
//       })),
//       status: 'draft',
//       generation_metadata: {
//         fitness_score: metadata.fitnessScore,
//         generation_count: metadata.generation_count || metadata.generations || 0,
//         conflicts_resolved: metadata.conflictsResolved,
//         algorithm_version: metadata.algorithm_version,
//         generated_at: new Date(),
//       },
//     });

//     await timetable.save();
//     // console.log("💾 Timetable saved.");

//     const savedTimetable = await Timetable.findById(timetable._id).lean();

//     res.status(201).json({
//       success: true,
//       message: 'Timetable generated successfully',
//       data: savedTimetable,
//     });

//   } catch (error) {
//     // console.error('❌ Error generating timetable:', error.message);
//     // console.error('🧵 Stack Trace:', error.stack);
//     next(createError(500, 'Error in timetable generation'));
//   }
// }

// static async generateTimetable(req, res, next) {
//   try {
//     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects = [],
//       teachers = [],
//       classes = [],
//     } = req.body;

//     if (!departmentId || !semester || !academicYear || !Array.isArray(divisions) || divisions.length === 0) {
//       console.log("❗ Missing required fields");
//       return next(createError(400, 'Missing required fields: departmentId, semester, academicYear, or divisions'));
//     }

//     const targetSemester = String(semester).trim();
//     const normalize = (val) => String(val ?? '').trim();

//     const filteredSubjects = subjects.filter(
//       (s) => normalize(s.semester) === targetSemester
//     );

//     const filteredTeachers = teachers.filter(
//       (t) => normalize(t.semester) === targetSemester
//     );

//     const filteredClasses = classes.filter(
//       (c) => normalize(c.semester) === targetSemester
//     );

//     if (!filteredSubjects.length || !filteredTeachers.length || !filteredClasses.length) {
//       return next(createError(400, `Subjects, teachers, and classes must not be empty for semester ${semester}`));
//     }

//     const geneticAlgorithm = new GeneticAlgorithm({
//       populationSize: 50,
//       maxGenerations: 100,
//       mutationRate: 0.1,
//       crossoverRate: 0.8,
//       elitismRate: 0.1,
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions,
//     });

//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     });

//     if (!schedule || Object.keys(schedule).length === 0) {
//       return next(createError(500, 'Failed to generate a valid schedule'));
//     }

//     // 🧠 Map subjects and teachers by ID for lookup
//     const subjectMap = Object.fromEntries(filteredSubjects.map(s => [String(s._id), s]));
//     const teacherMap = Object.fromEntries(filteredTeachers.map(t => [String(t._id), t]));

//     // 🧪 Enrich each slot in the schedule with full subject and teacher
//     for (const division of Object.keys(schedule)) {
//       const daySchedule = schedule[division];
//       for (const day of Object.keys(daySchedule)) {
//         daySchedule[day] = daySchedule[day].map((period) => {
//           if (!period) return null;

//           const enrichedPeriod = { ...period };

//           if (typeof enrichedPeriod.subject === 'string') {
//             enrichedPeriod.subject = subjectMap[enrichedPeriod.subject] || { subjectName: 'Unknown Subject' };
//           }

//           if (typeof enrichedPeriod.teacher === 'string') {
//             enrichedPeriod.teacher = teacherMap[enrichedPeriod.teacher] || { name: 'Unknown Teacher' };
//           }

//           return enrichedPeriod;
//         });
//       }
//     }

//     const timetable = new Timetable({
//       departmentId,
//       semester: Number(targetSemester),
//       academicYear,
//       divisions: divisions.map(name => ({
//         division_name: name,
//         schedule: schedule[name] || {},
//       })),
//       status: 'draft',
//       generation_metadata: {
//         fitness_score: metadata.fitnessScore,
//         generation_count: metadata.generation_count || metadata.generations || 0,
//         conflicts_resolved: metadata.conflictsResolved,
//         algorithm_version: metadata.algorithm_version,
//         generated_at: new Date(),
//       },
//     });

//     await timetable.save();

//     const savedTimetable = await Timetable.findById(timetable._id).lean();

//     res.status(201).json({
//       success: true,
//       message: 'Timetable generated successfully',
//       data: savedTimetable,
//     });

//   } catch (error) {
//     next(createError(500, 'Error in timetable generation'));
//   }
// }

// static async generateTimetable(req, res, next) {
//   try {
//     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects = [],
//       teachers = [],
//       classes = [],
//     } = req.body;

//     if (!departmentId || !semester || !academicYear || !Array.isArray(divisions) || divisions.length === 0) {
//       console.log("❗ Missing required fields");
//       return next(createError(400, 'Missing required fields: departmentId, semester, academicYear, or divisions'));
//     }

//     const targetSemester = String(semester).trim();
//     const normalize = (val) => String(val ?? '').trim();

//     const filteredSubjects = subjects.filter((s) => normalize(s.semester) === targetSemester);
//     const filteredTeachers = teachers.filter((t) => normalize(t.semester) === targetSemester);
//     const filteredClasses = classes.filter((c) => normalize(c.semester) === targetSemester);

//     if (!filteredSubjects.length || !filteredTeachers.length || !filteredClasses.length) {
//       return next(createError(400, `Subjects, teachers, and classes must not be empty for semester ${semester}`));
//     }

//     const geneticAlgorithm = new GeneticAlgorithm({
//       populationSize: 50,
//       maxGenerations: 100,
//       mutationRate: 0.1,
//       crossoverRate: 0.8,
//       elitismRate: 0.1,
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions,
//     });

//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     });

//     if (!schedule || Object.keys(schedule).length === 0) {
//       return next(createError(500, 'Failed to generate a valid schedule'));
//     }

//     // 🧠 Create lookup maps
//     const subjectMap = Object.fromEntries(
//       filteredSubjects.map(s => [String(s._id), { ...s, subjectName: s.name }])
//     );
//     const teacherMap = Object.fromEntries(
//       filteredTeachers.map(t => [String(t._id), t])
//     );

//     // 🧪 Enrich each slot with full subject and teacher info
//     for (const division of Object.keys(schedule)) {
//       const daySchedule = schedule[division];
//       for (const day of Object.keys(daySchedule)) {
//         daySchedule[day] = daySchedule[day].map((period) => {
//           if (!period) return null;

//           const enrichedPeriod = { ...period };

//           if (typeof enrichedPeriod.subject === 'string') {
//             enrichedPeriod.subject = subjectMap[enrichedPeriod.subject] || { subjectName: 'Unknown Subject' };
//           }

//           if (typeof enrichedPeriod.teacher === 'string') {
//             enrichedPeriod.teacher = teacherMap[enrichedPeriod.teacher] || { name: 'Unknown Teacher' };
//           }

//           return enrichedPeriod;
//         });
//       }
//     }

//     const timetable = new Timetable({
//       departmentId,
//       semester: Number(targetSemester),
//       academicYear,
//       divisions: divisions.map(name => ({
//         division_name: name,
//         schedule: schedule[name] || {},
//       })),
//       status: 'draft',
//       generation_metadata: {
//         fitness_score: metadata.fitnessScore,
//         generation_count: metadata.generation_count || metadata.generations || 0,
//         conflicts_resolved: metadata.conflictsResolved,
//         algorithm_version: metadata.algorithm_version,
//         generated_at: new Date(),
//       },
//     });

//     await timetable.save();
//     const savedTimetable = await Timetable.findById(timetable._id).lean();

//     res.status(201).json({
//       success: true,
//       message: 'Timetable generated successfully',
//       data: savedTimetable,
//     });

//   } catch (error) {
//     next(createError(500, 'Error in timetable generation'));
//   }
// }

// static async generateTimetable(req, res, next) {
//   try {
//     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects = [],
//       teachers = [],
//       classes = [],
//     } = req.body;

//     // Basic required checks
//     if (!departmentId || !semester || !academicYear || !Array.isArray(divisions) || divisions.length === 0) {
//       return next(createError(400, 'Missing required fields: departmentId, semester, academicYear, or divisions'));
//     }

//     const targetSemester = String(semester).trim();
//     const normalize = (val) => String(val ?? '').trim();

//     // Filter by semester
//     const filteredSubjects = subjects.filter(s => normalize(s.semester) === targetSemester);
//     const filteredTeachers = teachers.filter(t => normalize(t.semester) === targetSemester);
//     const filteredClasses = classes.filter(c => normalize(c.semester) === targetSemester);

//     // Handle empty lists clearly
//     if (!filteredSubjects.length) {
//       return next(createError(400, `No subjects found for semester ${targetSemester}`));
//     }
//     if (!filteredTeachers.length) {
//       return next(createError(400, `No teachers found for semester ${targetSemester}. Please assign teachers to subjects.`));
//     }
//     if (!filteredClasses.length) {
//       return next(createError(400, `No classes found for semester ${targetSemester}`));
//     }

//     // Create GA instance
//     const geneticAlgorithm = new GeneticAlgorithm({
//       populationSize: 50,
//       maxGenerations: 100,
//       mutationRate: 0.1,
//       crossoverRate: 0.8,
//       elitismRate: 0.1,
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions,
//     });

//     // Generate schedule
//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     });

//     if (!schedule || Object.keys(schedule).length === 0) {
//       return next(createError(500, 'Failed to generate a valid schedule'));
//     }

//     // Maps to lookup full data
//     // const subjectMap = Object.fromEntries(filteredSubjects.map(s => [String(s._id), { ...s, subjectName: s.name }]));
//     const subjectMap = Object.fromEntries(
//   filteredSubjects.map(s => [
//     String(s._id),
//     { ...s, subjectName: s.subjectName || s.name || 'Unnamed Subject' }
//   ])
// );

//     const teacherMap = Object.fromEntries(filteredTeachers.map(t => [String(t._id), t]));

//     // Enrich schedule slots
//     for (const division of Object.keys(schedule)) {
//       const daySchedule = schedule[division];
//       for (const day of Object.keys(daySchedule)) {
//         daySchedule[day] = daySchedule[day].map(period => {
//           if (!period) return null;
//           const enriched = { ...period };

//           if (typeof enriched.subject === 'string') {
//             enriched.subject = subjectMap[enriched.subject] || { subjectName: 'Unknown Subject' };
//           }
//           if (typeof enriched.teacher === 'string') {
//             enriched.teacher = teacherMap[enriched.teacher] || { name: 'Unknown Teacher' };
//           }
//           return enriched;
//         });
//       }
//     }

//     // Save
//     const timetable = new Timetable({
//       departmentId,
//       semester: Number(targetSemester),
//       academicYear,
//       divisions: divisions.map(name => ({
//         division_name: name,
//         schedule: schedule[name] || {},
//       })),
//       status: 'draft',
//       generation_metadata: {
//         fitness_score: metadata.fitnessScore,
//         generation_count: metadata.generation_count || metadata.generations || 0,
//         conflicts_resolved: metadata.conflictsResolved,
//         algorithm_version: metadata.algorithm_version,
//         generated_at: new Date(),
//       },
//     });

//     await timetable.save();
//     const savedTimetable = await Timetable.findById(timetable._id).lean();

//     res.status(201).json({
//       success: true,
//       message: 'Timetable generated successfully',
//       data: savedTimetable,
//     });

//   } catch (error) {
//     console.error("💥 Timetable generation failed:", error);                    // <-- log original stack
//     return next(createError(500, error.message || 'Error in timetable generation'));
//   }
// }

static async generateTimetable(req, res, next) {
  try {
    console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

    const {
      departmentId,
      semester,
      academicYear,
      divisions,
      subjects = [],
      teachers = [],
      classes = [],
    } = req.body;

    // Basic required checks
    if (!departmentId || !semester || !academicYear || !Array.isArray(divisions) || divisions.length === 0) {
      return next(createError(400, 'Missing required fields: departmentId, semester, academicYear, or divisions'));
    }

    const targetSemester = String(semester).trim();
    const normalize = (val) => String(val ?? '').trim();

    // Filter by semester
    const filteredSubjects = subjects.filter(s => normalize(s.semester) === targetSemester);
    const filteredTeachers = teachers.filter(t => normalize(t.semester) === targetSemester);
    const filteredClasses = classes.filter(c => normalize(c.semester) === targetSemester);

    if (!filteredSubjects.length) {
      return next(createError(400, `No subjects found for semester ${targetSemester}`));
    }
    if (!filteredTeachers.length) {
      return next(createError(400, `No teachers found for semester ${targetSemester}. Please assign teachers to subjects.`));
    }
    if (!filteredClasses.length) {
      return next(createError(400, `No classes found for semester ${targetSemester}`));
    }

    // Create GA instance
    const geneticAlgorithm = new GeneticAlgorithm({
      populationSize: 50,
      maxGenerations: 100,
      mutationRate: 0.1,
      crossoverRate: 0.8,
      elitismRate: 0.1,
      departmentId,
      semester: targetSemester,
      academicYear,
      divisions,
    });

    const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
      divisions,
      subjects: filteredSubjects,
      teachers: filteredTeachers,
      classes: filteredClasses,
    });

    if (!schedule || Object.keys(schedule).length === 0) {
      return next(createError(500, 'Failed to generate a valid schedule'));
    }

    // Create lookup maps
    const subjectMap = Object.fromEntries(
      filteredSubjects.map(s => [
        String(s._id),
        { ...s, subjectName: s.subjectName || s.name || 'Unnamed Subject' }
      ])
    );
    const teacherMap = Object.fromEntries(
      filteredTeachers.map(t => [String(t._id), t])
    );

    // Enrich slots via ID-based lookup (safer than typeof === 'string')
    for (const division of Object.keys(schedule)) {
      const daySchedule = schedule[division];
      for (const day of Object.keys(daySchedule)) {
        daySchedule[day] = daySchedule[day].map(period => {
          if (!period) return null;

          const enriched = { ...period };

          // const subjectId =
          //   enriched.subject?._id ||
          //   enriched.subject?.id ||
          //   enriched.subject;
          // if (subjectId && subjectMap[subjectId]) {
          //   enriched.subject = subjectMap[subjectId];
          // } else {
          //   enriched.subject = { subjectName: 'Unknown Subject' };
          // }
          const subjectId =
  enriched.subject?._id ||
  enriched.subject?.id ||
  enriched.subject;

if (subjectId && subjectMap[subjectId]) {
  enriched.subject = subjectMap[subjectId];
  // ✅ ensure 'name' is set for mongoose schema
  enriched.subject.name =
    enriched.subject.subjectName ||
    enriched.subject.name ||
    'Unknown Subject';
} else {
  enriched.subject = { name: 'Unknown Subject' };
}


          const teacherId =
            enriched.teacher?._id ||
            enriched.teacher?.id ||
            enriched.teacher;
          if (teacherId && teacherMap[teacherId]) {
            enriched.teacher = teacherMap[teacherId];
          } else {
            enriched.teacher = { name: 'Unknown Teacher' };
          }

          return enriched;
        });
      }
    }

    // Save
    const timetable = new Timetable({
      departmentId,
      semester: Number(targetSemester),
      academicYear,
      divisions: divisions.map(name => ({
        division_name: name,
        schedule: schedule[name] || {},
      })),
      status: 'draft',
      generation_metadata: {
        fitness_score: metadata.fitnessScore,
        generation_count: metadata.generation_count || metadata.generations || 0,
        conflicts_resolved: metadata.conflictsResolved,
        algorithm_version: metadata.algorithm_version,
        generated_at: new Date(),
      },
    });

    await timetable.save();
    const savedTimetable = await Timetable.findById(timetable._id).lean();

    res.status(201).json({
      success: true,
      message: 'Timetable generated successfully',
      data: savedTimetable,
    });

  } catch (error) {
    console.error("💥 Timetable generation failed:", error);
    return next(createError(500, error.message || 'Error in timetable generation'));
  }
}








static async  validateTimetable(timetable) {
  const conflicts = [];
  const teacherAssignments = new Map();
  const classAssignments = new Map();

  timetable.divisions.forEach(division => {
    Object.entries(division.schedule).forEach(([day, periods]) => {
      periods.forEach((slot, periodIndex) => {
        if (!slot || !slot.teacher) return;

        // Check teacher conflicts
        const teacherKey = `${slot.teacher._id}_${day}_${periodIndex}`;
        if (teacherAssignments.has(teacherKey)) {
          conflicts.push({
            type: 'teacher_conflict',
            description: `Teacher ${slot.teacher.name} has multiple classes at period ${periodIndex + 1} on ${day}`,
            severity: 'high'
          });
        }
        teacherAssignments.set(teacherKey, true);

        // Check classroom conflicts
        const classKey = `${slot.classroom}_${day}_${periodIndex}`;
        if (classAssignments.has(classKey)) {
          conflicts.push({
            type: 'classroom_conflict',
            description: `Classroom ${slot.classroom} is double-booked at period ${periodIndex + 1} on ${day}`,
            severity: 'medium'
          });
        }
        classAssignments.set(classKey, true);

        // Check lab sessions
        if (slot.subject.type === 'Lab' && periodIndex < 5) {
          const nextPeriod = periods[periodIndex + 1];
          if (nextPeriod && nextPeriod.subject) {
            conflicts.push({
              type: 'lab_conflict',
              description: `Lab session for ${slot.subject.name} doesn't have consecutive periods on ${day}`,
              severity: 'high'
            });
          }
        }
      });
    });
  });

  return conflicts;
}

  // static async getTimetables(req, res, next) {
  //   try {
  //     const { departmentId } = req.params;
  //     const { semester, academicYear, status } = req.query;

  //     const query = { department_id: departmentId };
  //     if (semester) query.semester = semester;
  //     if (academicYear) query.academicYear = academicYear;
  //     if (status) query.status = status;

  //     const timetables = await Timetable.find(query)
  //       .populate('department_id', 'name')
  //       .sort({ createdAt: -1 });

  //     res.json({
  //       success: true,
  //       data: timetables
  //     });

  //   } catch (error) {
  //     next(createError(500, 'Error fetching timetables'));
  //   }
  // }

// static async getTimetables(req, res, next) {
//   try {
//    console.log("📌 [GET /timetables] Function hit");
//     const { departmentId } = req.params;
//     const { semester, academicYear, status } = req.query;

//     // 🔎 1. Log input values
//     console.log("📥 Params:", departmentId);
//     console.log("📥 Query:", { semester, academicYear, status });

//     const query = { departmentId };
//     if (semester) query.semester = semester;
//     if (academicYear) query.academicYear = academicYear;
//     if (status) query.status = status;

//     // 🔎 2. Log final MongoDB query
//     console.log("📄 Final MongoDB query:", query);

//     const timetables = await Timetable.find(query)
//       .populate('departmentId', 'name')
      
//       .sort({ createdAt: -1 });

//     // 🔎 3. Log result from DB
//     console.log("📦 Found Timetables:", timetables.length, timetables);
//     console.log(`✅ Found ${timetables.length} timetables`);
// console.table(timetables.map(t => ({
//   id: t._id.toString(),
//   createdAt: t.createdAt,
//   department: t.departmentId?.name
// })));

//     res.json({
//       success: true,
//       data: timetables
//     });

//   } catch (error) {
//     console.error("🔥 Error fetching timetables:", error.message);
//     next(createError(500, 'Error fetching timetables'));
//   }
// }
static async getTimetables(req, res, next) {
  try {
    const { departmentId } = req.params;
    const { semester, academicYear, status } = req.query;

    const query = { departmentId };
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;
    if (status) query.status = status;

    const timetables = await Timetable.find(query)
      .populate('departmentId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: timetables
    });

  } catch (error) {
    next(createError(500, 'Error fetching timetables'));
  }
}








//   static async getTimetableById(req, res, next) {
//   try {
//     const timetable = await Timetable.findById(req.params.id);
//     if (!timetable) return next(createError(404, 'Timetable not found'));

//     if (req.query.stats === 'true') {
//       // Reuse getStatistics logic here or refactor to a helper function
//       const statistics = {
//         totalClasses: 0,
//         labSessions: 0,
//         theorySessions: 0,
//         teacherUtilization: 0,
//         roomUtilization: 0,
//         fitness_score: timetable.generation_metadata?.fitness_score || 0
//       };

//       timetable.divisions.forEach(div => {
//         Object.values(div.schedule).forEach(daySchedule => {
//           daySchedule.forEach(slot => {
//             if (slot && slot.subject) {
//               statistics.totalClasses++;
//               if (slot.type === 'lab') statistics.labSessions++;
//               else statistics.theorySessions++;
//             }
//           });
//         });
//       });

//       return res.json({ success: true, data: { statistics } });
//     }

//     // Default: just return timetable
//     res.json({ success: true, data: { timetable } });

//   } catch (err) {
//     next(createError(500, 'Error fetching timetable'));
//   }
// }

// static async getTimetableById(req, res, next) {
//   try {
//     console.log("📌 [GET /timetables/:id] Function hit");
// console.log("🆔 Timetable ID:", req.params.id);

//     const timetable = await Timetable.findById(req.params.id);

//     if (!timetable) {
//       console.warn("⚠️ Timetable not found for ID:", req.params.id);

//       return next(createError(404, 'Timetable not found'));
//     }

//     // If query ?stats=true is present, return statistics
//     if (req.query.stats === 'true') {
//       const statistics = {
//         totalClasses: 0,
//         labSessions: 0,
//         theorySessions: 0,
//         teacherUtilization: 0,
//         roomUtilization: 0,
//         fitness_score: timetable.generation_metadata?.fitness_score || 0
//       };

//       const uniqueTeachers = new Set();
//       const uniqueRooms = new Set();

//       console.log("📋 Starting statistics computation...");
//       timetable.divisions?.forEach((division, divIndex) => {
//         const schedule = division.schedule;
//         if (!schedule || typeof schedule !== 'object') {
//           console.log(`⚠️ Division ${divIndex} has no valid schedule`);
//           return;
//         }
     
//         Object.entries(schedule).forEach(([day, daySlots]) => {
//           if (!Array.isArray(daySlots)) {
//             console.log(`⚠️ ${day} in Division ${divIndex} is not an array`);
//             return;
//           }

//           daySlots.forEach((slot, slotIndex) => {
//             if (slot && typeof slot === 'object' && slot.subject) {
//               statistics.totalClasses++;

//               const type = (slot.type || 'theory').toLowerCase();
//               if (type === 'lab') {
//                 statistics.labSessions++;
//               } else {
//                 statistics.theorySessions++;
//               }

//               // Unique teacher/classroom usage
//               if (slot.teacher) uniqueTeachers.add(slot.teacher.toString());
//               if (slot.classroom) uniqueRooms.add(slot.classroom.toString());

//               console.log(`✅ Slot on ${day}, period ${slotIndex + 1}:`, slot);
//             } else {
//               console.log(`🟡 Empty or invalid slot on ${day}, period ${slotIndex + 1}`);
//             }
//           });
//         });
//       });

//       // Teacher utilization = total unique teacher-periods / totalClasses * 100
//       statistics.teacherUtilization = uniqueTeachers.size > 0
//         ? parseFloat(((statistics.totalClasses / (uniqueTeachers.size * 6 * 5)) * 100).toFixed(2))
//         : 0;

//       statistics.roomUtilization = uniqueRooms.size > 0
//         ? parseFloat(((statistics.totalClasses / (uniqueRooms.size * 6 * 5)) * 100).toFixed(2))
//         : 0;

//       console.log("✅ Final Computed Statistics:", statistics);

//       return res.status(200).json({
//         success: true,
//         data: { statistics }
//       });
//     }

//     // Default: return full timetable
//     return res.status(200).json({
//       success: true,
//       data: { timetable }
//     });

//   } catch (err) {
//     console.error('🔴 Error in getTimetableById:', err);
//     return next(createError(500, 'Error fetching timetable. Please check the ID and schedule structure.'));
//   }
// }

static async getTimetableById(req, res, next) {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return next(createError(404, 'Timetable not found'));
    }

    // If query ?stats=true is present, return statistics
    if (req.query.stats === 'true') {
      const statistics = {
        totalClasses: 0,
        labSessions: 0,
        theorySessions: 0,
        teacherUtilization: 0,
        roomUtilization: 0,
        fitness_score: timetable.generation_metadata?.fitness_score || 0
      };

      const uniqueTeachers = new Set();
      const uniqueRooms = new Set();

      timetable.divisions?.forEach((division) => {
        const schedule = division.schedule;
        if (!schedule || typeof schedule !== 'object') return;

        Object.entries(schedule).forEach(([_, daySlots]) => {
          if (!Array.isArray(daySlots)) return;

          daySlots.forEach((slot) => {
            if (slot && typeof slot === 'object' && slot.subject) {
              statistics.totalClasses++;

              const type = (slot.type || 'theory').toLowerCase();
              if (type === 'lab') {
                statistics.labSessions++;
              } else {
                statistics.theorySessions++;
              }

              if (slot.teacher) uniqueTeachers.add(slot.teacher.toString());
              if (slot.classroom) uniqueRooms.add(slot.classroom.toString());
            }
          });
        });
      });

      statistics.teacherUtilization = uniqueTeachers.size > 0
        ? parseFloat(((statistics.totalClasses / (uniqueTeachers.size * 6 * 5)) * 100).toFixed(2))
        : 0;

      statistics.roomUtilization = uniqueRooms.size > 0
        ? parseFloat(((statistics.totalClasses / (uniqueRooms.size * 6 * 5)) * 100).toFixed(2))
        : 0;

      return res.status(200).json({
        success: true,
        data: { statistics }
      });
    }

    // Default: return full timetable
    return res.status(200).json({
      success: true,
      data: { timetable }
    });

  } catch (err) {
    return next(createError(500, 'Error fetching timetable. Please check the ID and schedule structure.'));
  }
}






  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const timetable = await Timetable.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!timetable) {
        return next(createError(404, 'Timetable not found'));
      }

      res.json({
        success: true,
        data: timetable
      });

    } catch (error) {
      next(createError(500, 'Error updating timetable status'));
    }
  }

  static async deleteTimetable(req, res, next) {
    try {
      const timetable = await Timetable.findByIdAndDelete(req.params.id);

      if (!timetable) {
        return next(createError(404, 'Timetable not found'));
      }

      res.json({
        success: true,
        message: 'Timetable deleted successfully'
      });

    } catch (error) {
      next(createError(500, 'Error deleting timetable'));
    }
  }

static async getStatistics(req, res, next) {
  try {
    const timetableId = req.params.id;
    console.log("🧠 Fetching stats for timetable ID:", timetableId);

    const timetable = await Timetable.findById(timetableId);
    console.log("🧾 Found timetable:", timetable);

    if (!timetable) {
      return next(createError(404, 'Timetable not found'));
    }

    const statistics = {
      totalClasses: 0,
      labSessions: 0,
      theorySessions: 0,
      teacherUtilization: 0,
      roomUtilization: 0,
      fitness_score: timetable.generation_metadata?.fitness_score || 0
    };

    timetable.divisions.forEach(div => {
      Object.values(div.schedule || {}).forEach(daySchedule => {
        daySchedule.forEach(slot => {
          if (slot && slot.subject) {
            statistics.totalClasses++;
            if (slot.type === 'lab') statistics.labSessions++;
            else statistics.theorySessions++;
          }
        });
      });
    });

    res.json({
      success: true,
      data: { statistics }
    });

  } catch (error) {
    console.error("❌ Error in getStatistics:", error);
    next(createError(500, 'Error fetching statistics'));
  }
}

static async transformFlatSchedule(flatSchedule, divisions, daysOfWeek, periodsPerDay) {
  const formattedSchedule = {};

  divisions.forEach((division) => {
    const divisionId = division._id || division; // if it's string like "SYA"
    formattedSchedule[divisionId] = {};

    daysOfWeek.forEach((dayName, dayIndex) => {
      formattedSchedule[divisionId][dayName] = [];

      for (let period = 0; period < periodsPerDay; period++) {
        const key = `${divisionId}_${dayIndex}_${period}`;
        formattedSchedule[divisionId][dayName].push(flatSchedule[key] || null);
      }
    });
  });

  return formattedSchedule;
}


static async exportTimetable(req, res) {
  try {
    const { id } = req.params;
    const { format } = req.query;

    // Fetch timetable data by ID
  const timetable = await Timetable.findById(id); // no populate


    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      
      // Set headers for download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=timetable_${id}.pdf`);

      doc.pipe(res);

      doc.fontSize(16).text(`Timetable - ${timetable.divisionName}`, { align: 'center' });
      doc.moveDown();

      // Example: draw a simple table
      timetable.schedule.forEach(day => {
        doc.fontSize(12).text(`Day: ${day.name}`);
        day.slots.forEach(slot => {
          doc.text(
            `Period ${slot.period}: ${slot.subject?.name || 'Free'} - Teacher: ${slot.teacher?.name || 'N/A'} - Room: ${slot.classroom?.name || 'N/A'}`
          );
        });
        doc.moveDown();
      });

      doc.end(); // Send PDF
    } else {
      res.status(400).json({ message: 'Unsupported export format' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to export timetable' });
  }
};



}

export default TimetableController;
