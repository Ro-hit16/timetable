


// import Timetable from '../models/timetable.model.js';
// import { createError } from '../utils/error.js';
// import GeneticAlgorithm from '../utils/timetableGenerator.js';
// import subjectModel from '../models/subject.model.js';
// import teacherModel from '../models/teacher.model.js';
// import classModel from '../models/class.model.js';
// import PDFDocument from 'pdfkit';
// class TimetableController {


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

//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     });

//     if (!schedule || Object.keys(schedule).length === 0) {
//       return next(createError(500, 'Failed to generate a valid schedule'));
//     }

//     // Create lookup maps
//     const subjectMap = Object.fromEntries(
//       filteredSubjects.map(s => [
//         String(s._id),
//         { ...s, subjectName: s.subjectName || s.name || 'Unnamed Subject' }
//       ])
//     );
//     const teacherMap = Object.fromEntries(
//       filteredTeachers.map(t => [String(t._id), t])
//     );

//     // Enrich slots via ID-based lookup (safer than typeof === 'string')
//     for (const division of Object.keys(schedule)) {
//       const daySchedule = schedule[division];
//       for (const day of Object.keys(daySchedule)) {
//         daySchedule[day] = daySchedule[day].map(period => {
//           if (!period) return null;

//           const enriched = { ...period };

//           // const subjectId =
//           //   enriched.subject?._id ||
//           //   enriched.subject?.id ||
//           //   enriched.subject;
//           // if (subjectId && subjectMap[subjectId]) {
//           //   enriched.subject = subjectMap[subjectId];
//           // } else {
//           //   enriched.subject = { subjectName: 'Unknown Subject' };
//           // }
//           const subjectId =
//   enriched.subject?._id ||
//   enriched.subject?.id ||
//   enriched.subject;

// if (subjectId && subjectMap[subjectId]) {
//   enriched.subject = subjectMap[subjectId];
//   // ✅ ensure 'name' is set for mongoose schema
//   enriched.subject.name =
//     enriched.subject.subjectName ||
//     enriched.subject.name ||
//     'Unknown Subject';
// } else {
//   enriched.subject = { name: 'Unknown Subject' };
// }


//           const teacherId =
//             enriched.teacher?._id ||
//             enriched.teacher?.id ||
//             enriched.teacher;
//           if (teacherId && teacherMap[teacherId]) {
//             enriched.teacher = teacherMap[teacherId];
//           } else {
//             enriched.teacher = { name: 'Unknown Teacher' };
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
//     console.error("💥 Timetable generation failed:", error);
//     return next(createError(500, error.message || 'Error in timetable generation'));
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

//   // static async getTimetables(req, res, next) {
//   //   try {
//   //     const { departmentId } = req.params;
//   //     const { semester, academicYear, status } = req.query;

//   //     const query = { department_id: departmentId };
//   //     if (semester) query.semester = semester;
//   //     if (academicYear) query.academicYear = academicYear;
//   //     if (status) query.status = status;

//   //     const timetables = await Timetable.find(query)
//   //       .populate('department_id', 'name')
//   //       .sort({ createdAt: -1 });

//   //     res.json({
//   //       success: true,
//   //       data: timetables
//   //     });

//   //   } catch (error) {
//   //     next(createError(500, 'Error fetching timetables'));
//   //   }
//   // }

// // static async getTimetables(req, res, next) {
// //   try {
// //    console.log("📌 [GET /timetables] Function hit");
// //     const { departmentId } = req.params;
// //     const { semester, academicYear, status } = req.query;

// //     // 🔎 1. Log input values
// //     console.log("📥 Params:", departmentId);
// //     console.log("📥 Query:", { semester, academicYear, status });

// //     const query = { departmentId };
// //     if (semester) query.semester = semester;
// //     if (academicYear) query.academicYear = academicYear;
// //     if (status) query.status = status;

// //     // 🔎 2. Log final MongoDB query
// //     console.log("📄 Final MongoDB query:", query);

// //     const timetables = await Timetable.find(query)
// //       .populate('departmentId', 'name')
      
// //       .sort({ createdAt: -1 });

// //     // 🔎 3. Log result from DB
// //     console.log("📦 Found Timetables:", timetables.length, timetables);
// //     console.log(`✅ Found ${timetables.length} timetables`);
// // console.table(timetables.map(t => ({
// //   id: t._id.toString(),
// //   createdAt: t.createdAt,
// //   department: t.departmentId?.name
// // })));

// //     res.json({
// //       success: true,
// //       data: timetables
// //     });

// //   } catch (error) {
// //     console.error("🔥 Error fetching timetables:", error.message);
// //     next(createError(500, 'Error fetching timetables'));
// //   }
// // }
// static async getTimetables(req, res, next) {
//   try {
//     const { departmentId } = req.params;
//     const { semester, academicYear, status } = req.query;

//     const query = { departmentId };
//     if (semester) query.semester = semester;
//     if (academicYear) query.academicYear = academicYear;
//     if (status) query.status = status;

//     const timetables = await Timetable.find(query)
//       .populate('departmentId', 'name')
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: timetables
//     });

//   } catch (error) {
//     next(createError(500, 'Error fetching timetables'));
//   }
// }








// //   static async getTimetableById(req, res, next) {
// //   try {
// //     const timetable = await Timetable.findById(req.params.id);
// //     if (!timetable) return next(createError(404, 'Timetable not found'));

// //     if (req.query.stats === 'true') {
// //       // Reuse getStatistics logic here or refactor to a helper function
// //       const statistics = {
// //         totalClasses: 0,
// //         labSessions: 0,
// //         theorySessions: 0,
// //         teacherUtilization: 0,
// //         roomUtilization: 0,
// //         fitness_score: timetable.generation_metadata?.fitness_score || 0
// //       };

// //       timetable.divisions.forEach(div => {
// //         Object.values(div.schedule).forEach(daySchedule => {
// //           daySchedule.forEach(slot => {
// //             if (slot && slot.subject) {
// //               statistics.totalClasses++;
// //               if (slot.type === 'lab') statistics.labSessions++;
// //               else statistics.theorySessions++;
// //             }
// //           });
// //         });
// //       });

// //       return res.json({ success: true, data: { statistics } });
// //     }

// //     // Default: just return timetable
// //     res.json({ success: true, data: { timetable } });

// //   } catch (err) {
// //     next(createError(500, 'Error fetching timetable'));
// //   }
// // }

// // static async getTimetableById(req, res, next) {
// //   try {
// //     console.log("📌 [GET /timetables/:id] Function hit");
// // console.log("🆔 Timetable ID:", req.params.id);

// //     const timetable = await Timetable.findById(req.params.id);

// //     if (!timetable) {
// //       console.warn("⚠️ Timetable not found for ID:", req.params.id);

// //       return next(createError(404, 'Timetable not found'));
// //     }

// //     // If query ?stats=true is present, return statistics
// //     if (req.query.stats === 'true') {
// //       const statistics = {
// //         totalClasses: 0,
// //         labSessions: 0,
// //         theorySessions: 0,
// //         teacherUtilization: 0,
// //         roomUtilization: 0,
// //         fitness_score: timetable.generation_metadata?.fitness_score || 0
// //       };

// //       const uniqueTeachers = new Set();
// //       const uniqueRooms = new Set();

// //       console.log("📋 Starting statistics computation...");
// //       timetable.divisions?.forEach((division, divIndex) => {
// //         const schedule = division.schedule;
// //         if (!schedule || typeof schedule !== 'object') {
// //           console.log(`⚠️ Division ${divIndex} has no valid schedule`);
// //           return;
// //         }
     
// //         Object.entries(schedule).forEach(([day, daySlots]) => {
// //           if (!Array.isArray(daySlots)) {
// //             console.log(`⚠️ ${day} in Division ${divIndex} is not an array`);
// //             return;
// //           }

// //           daySlots.forEach((slot, slotIndex) => {
// //             if (slot && typeof slot === 'object' && slot.subject) {
// //               statistics.totalClasses++;

// //               const type = (slot.type || 'theory').toLowerCase();
// //               if (type === 'lab') {
// //                 statistics.labSessions++;
// //               } else {
// //                 statistics.theorySessions++;
// //               }

// //               // Unique teacher/classroom usage
// //               if (slot.teacher) uniqueTeachers.add(slot.teacher.toString());
// //               if (slot.classroom) uniqueRooms.add(slot.classroom.toString());

// //               console.log(`✅ Slot on ${day}, period ${slotIndex + 1}:`, slot);
// //             } else {
// //               console.log(`🟡 Empty or invalid slot on ${day}, period ${slotIndex + 1}`);
// //             }
// //           });
// //         });
// //       });

// //       // Teacher utilization = total unique teacher-periods / totalClasses * 100
// //       statistics.teacherUtilization = uniqueTeachers.size > 0
// //         ? parseFloat(((statistics.totalClasses / (uniqueTeachers.size * 6 * 5)) * 100).toFixed(2))
// //         : 0;

// //       statistics.roomUtilization = uniqueRooms.size > 0
// //         ? parseFloat(((statistics.totalClasses / (uniqueRooms.size * 6 * 5)) * 100).toFixed(2))
// //         : 0;

// //       console.log("✅ Final Computed Statistics:", statistics);

// //       return res.status(200).json({
// //         success: true,
// //         data: { statistics }
// //       });
// //     }

// //     // Default: return full timetable
// //     return res.status(200).json({
// //       success: true,
// //       data: { timetable }
// //     });

// //   } catch (err) {
// //     console.error('🔴 Error in getTimetableById:', err);
// //     return next(createError(500, 'Error fetching timetable. Please check the ID and schedule structure.'));
// //   }
// // }

// static async getTimetableById(req, res, next) {
//   try {
//     const timetable = await Timetable.findById(req.params.id);

//     if (!timetable) {
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

//       timetable.divisions?.forEach((division) => {
//         const schedule = division.schedule;
//         if (!schedule || typeof schedule !== 'object') return;

//         Object.entries(schedule).forEach(([_, daySlots]) => {
//           if (!Array.isArray(daySlots)) return;

//           daySlots.forEach((slot) => {
//             if (slot && typeof slot === 'object' && slot.subject) {
//               statistics.totalClasses++;

//               const type = (slot.type || 'theory').toLowerCase();
//               if (type === 'lab') {
//                 statistics.labSessions++;
//               } else {
//                 statistics.theorySessions++;
//               }

//               if (slot.teacher) uniqueTeachers.add(slot.teacher.toString());
//               if (slot.classroom) uniqueRooms.add(slot.classroom.toString());
//             }
//           });
//         });
//       });

//       statistics.teacherUtilization = uniqueTeachers.size > 0
//         ? parseFloat(((statistics.totalClasses / (uniqueTeachers.size * 6 * 5)) * 100).toFixed(2))
//         : 0;

//       statistics.roomUtilization = uniqueRooms.size > 0
//         ? parseFloat(((statistics.totalClasses / (uniqueRooms.size * 6 * 5)) * 100).toFixed(2))
//         : 0;

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
//     return next(createError(500, 'Error fetching timetable. Please check the ID and schedule structure.'));
//   }
// }






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


//   static async generateDepartmentTimetable(req, res, next) {
//   try {
//     const { departmentId, academicYear, divisions, subjects = [], teachers = [], classes = [] } = req.body;

//     if (!departmentId || !academicYear || !divisions?.length) {
//       return next(createError(400, 'Missing required fields: departmentId, academicYear, or divisions'));
//     }

//     // Group subjects, teachers, classes semester-wise
//     const semesters = [...new Set(subjects.map(s => s.semester.toString()))];

//     const finalSchedule = {};
//     const teacherUsage = new Map();
//     const classUsage = new Map();

//     for (const sem of semesters) {
//       const semSubjects = subjects.filter(s => s.semester.toString() === sem);
//       const semTeachers = teachers.filter(t => t.semester?.toString() === sem);
//       const semClasses = classes.filter(c => c.semester?.toString() === sem);

//       if (!semSubjects.length || !semTeachers.length || !semClasses.length) continue;

//       // Generate schedule using GA
//       const ga = new GeneticAlgorithm({
//         populationSize: 150,
//         maxGenerations: 800,
//         mutationRate: 0.15,
//         crossoverRate: 0.8,
//         elitismRate: 0.1,
//         departmentId,
//         semester: sem,
//         academicYear,
//         divisions: semClasses.map(c => c.name),
//       });

//       const { schedule } = await ga.generateSchedule({
//         divisions: semClasses.map(c => c.name),
//         subjects: semSubjects,
//         teachers: semTeachers,
//         classes: semClasses,
//       });

//       // Merge schedules and avoid teacher/class clashes
//       for (const division of Object.keys(schedule)) {
//         if (!finalSchedule[division]) finalSchedule[division] = {};
//         const daySchedule = schedule[division];

//         for (const day of Object.keys(daySchedule)) {
//           if (!finalSchedule[division][day]) finalSchedule[division][day] = [];

//           const enrichedSlots = daySchedule[day].map((slot, idx) => {
//             if (!slot) return null;

//             const teacherKey = `${slot.teacher._id}_${day}_${idx}`;
//             const classKey = `${slot.classroom._id}_${day}_${idx}`;

//             if (teacherUsage.has(teacherKey)) slot.teacher.name += ' (CLASH)';
//             else teacherUsage.set(teacherKey, true);

//             if (classUsage.has(classKey)) slot.classroom.room_number += ' (CLASH)';
//             else classUsage.set(classKey, true);

//             return slot;
//           });

//           finalSchedule[division][day].push(...enrichedSlots);
//         }
//       }
//     }

//     // Save in DB
//     const timetable = new Timetable({
//       departmentId,
//       academicYear,
//       divisions: divisions.map(name => ({
//         division_name: name,
//         schedule: finalSchedule[name] || {},
//       })),
//       status: 'draft',
//       generation_metadata: { algorithm_version: 'GA_Department_v1', generated_at: new Date() },
//     });

//     await timetable.save();
//     const saved = await Timetable.findById(timetable._id).lean();

//     res.status(201).json({
//       success: true,
//       message: 'Department-wide timetable generated successfully',
//       data: saved,
//     });

//   } catch (error) {
//     console.error('💥 Department timetable generation error:', error);
//     next(createError(500, error.message || 'Failed to generate department timetable'));
//   }
// }




// static async getStatistics(req, res, next) {
//   try {
//     const timetableId = req.params.id;
//     console.log("🧠 Fetching stats for timetable ID:", timetableId);

//     const timetable = await Timetable.findById(timetableId);
//     console.log("🧾 Found timetable:", timetable);

//     if (!timetable) {
//       return next(createError(404, 'Timetable not found'));
//     }

//     const statistics = {
//       totalClasses: 0,
//       labSessions: 0,
//       theorySessions: 0,
//       teacherUtilization: 0,
//       roomUtilization: 0,
//       fitness_score: timetable.generation_metadata?.fitness_score || 0
//     };

//     timetable.divisions.forEach(div => {
//       Object.values(div.schedule || {}).forEach(daySchedule => {
//         daySchedule.forEach(slot => {
//           if (slot && slot.subject) {
//             statistics.totalClasses++;
//             if (slot.type === 'lab') statistics.labSessions++;
//             else statistics.theorySessions++;
//           }
//         });
//       });
//     });

//     res.json({
//       success: true,
//       data: { statistics }
//     });

//   } catch (error) {
//     console.error("❌ Error in getStatistics:", error);
//     next(createError(500, 'Error fetching statistics'));
//   }
// }

// static async transformFlatSchedule(flatSchedule, divisions, daysOfWeek, periodsPerDay) {
//   const formattedSchedule = {};

//   divisions.forEach((division) => {
//     const divisionId = division._id || division; // if it's string like "SYA"
//     formattedSchedule[divisionId] = {};

//     daysOfWeek.forEach((dayName, dayIndex) => {
//       formattedSchedule[divisionId][dayName] = [];

//       for (let period = 0; period < periodsPerDay; period++) {
//         const key = `${divisionId}_${dayIndex}_${period}`;
//         formattedSchedule[divisionId][dayName].push(flatSchedule[key] || null);
//       }
//     });
//   });

//   return formattedSchedule;
// }


// static async exportTimetable(req, res) {
//   try {
//     const { id } = req.params;
//     const { format } = req.query;

//     // Fetch timetable data by ID
//   const timetable = await Timetable.findById(id); // no populate


//     if (!timetable) {
//       return res.status(404).json({ message: 'Timetable not found' });
//     }

//     if (format === 'pdf') {
//       const doc = new PDFDocument({ margin: 30, size: 'A4' });
      
//       // Set headers for download
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=timetable_${id}.pdf`);

//       doc.pipe(res);

//       doc.fontSize(16).text(`Timetable - ${timetable.divisionName}`, { align: 'center' });
//       doc.moveDown();

//       // Example: draw a simple table
//       timetable.schedule.forEach(day => {
//         doc.fontSize(12).text(`Day: ${day.name}`);
//         day.slots.forEach(slot => {
//           doc.text(
//             `Period ${slot.period}: ${slot.subject?.name || 'Free'} - Teacher: ${slot.teacher?.name || 'N/A'} - Room: ${slot.classroom?.name || 'N/A'}`
//           );
//         });
//         doc.moveDown();
//       });

//       doc.end(); // Send PDF
//     } else {
//       res.status(400).json({ message: 'Unsupported export format' });
//     }

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to export timetable' });
//   }
// };



// }

// export default TimetableController;



import Timetable from '../models/timetable.model.js';
import { createError } from '../utils/error.js';
import GeneticAlgorithm from '../utils/timetableGenerator.js';
import subjectModel from '../models/subject.model.js';
import teacherModel from '../models/teacher.model.js';
import classModel from '../models/class.model.js';
import PDFDocument from 'pdfkit';
import { creatActivity } from './activity.controller.js';

class TimetableController {

  // 🔧 MODIFIED: Enhanced to generate all divisions together
  // ========================================================================
//   static async generateTimetable(req, res, next) {
//     try {
//       console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//       const {
//         departmentId,
//         semester,
//         academicYear,
//         divisions,
//         subjects = [],
//         teachers = [],
//         classes = [],
//       } = req.body;

//       // Basic required checks
//       if (!departmentId || !semester || !academicYear || !Array.isArray(divisions) || divisions.length === 0) {
//         return next(createError(400, 'Missing required fields: departmentId, semester, academicYear, or divisions'));
//       }

//       // 🆕 CHANGE 1: Log division count for department-level generation
//       console.log(`🏢 Generating department-level timetable for ${divisions.length} divisions:`, divisions);
//       // ========================================================================

//       const targetSemester = String(semester).trim();
//       const normalize = (val) => String(val ?? '').trim();

//       // Filter by semester
//       const filteredSubjects = subjects.filter(s => normalize(s.semester) === targetSemester);
//       const filteredTeachers = teachers.filter(t => normalize(t.semester) === targetSemester);
//       const filteredClasses = classes.filter(c => normalize(c.semester) === targetSemester);

//       // 🆕 CHANGE 2: Enhanced validation logging
//       console.log(`📊 Filtered Resources:`, {
//         subjects: filteredSubjects.length,
//         teachers: filteredTeachers.length,
//         classrooms: filteredClasses.length,
//         semester: targetSemester
//       });
//       // ========================================================================

//       if (!filteredSubjects.length) {
//         return next(createError(400, `No subjects found for semester ${targetSemester}`));
//       }
//       if (!filteredTeachers.length) {
//         return next(createError(400, `No teachers found for semester ${targetSemester}. Please assign teachers to subjects.`));
//       }
//       if (!filteredClasses.length) {
//         return next(createError(400, `No classes found for semester ${targetSemester}`));
//       }

//       // 🔧 MODIFIED: Enhanced GA configuration for department-level
//       // ========================================================================
//       const geneticAlgorithm = new GeneticAlgorithm({
//         populationSize: Math.min(200, 50 * divisions.length), // 🆕 Scale population with divisions
//         maxGenerations: Math.min(1000, 100 * divisions.length), // 🆕 Scale generations with divisions
//         mutationRate: 0.12, // 🆕 Slightly reduced for stability
//         crossoverRate: 0.85, // 🆕 Increased for better exploration
//         elitismRate: 0.15, // 🆕 Increased to preserve good solutions
//         departmentId,
//         semester: targetSemester,
//         academicYear,
//         divisions,
//       });

//       console.log(`🧬 GA Configuration:`, {
//         populationSize: geneticAlgorithm.populationSize,
//         maxGenerations: geneticAlgorithm.maxGenerations,
//         divisions: divisions.length
//       });
//       // ========================================================================

//       // 🆕 CHANGE 3: Generate with timing measurement
//       const startTime = Date.now();
//       // ========================================================================

//       const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//         divisions,
//         subjects: filteredSubjects,
//         teachers: filteredTeachers,
//         classes: filteredClasses,
//       });

//       // 🆕 CHANGE 4: Log generation time
//       const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
//       console.log(`⏱️ Generation completed in ${generationTime} seconds`);
//       // ========================================================================

//       if (!schedule || Object.keys(schedule).length === 0) {
//         return next(createError(500, 'Failed to generate a valid schedule'));
//       }

//       // 🆕 CHANGE 5: Validate schedule for conflicts
//       const conflicts = await TimetableController.validateTimetable({
//         divisions: divisions.map(name => ({
//           division_name: name,
//           schedule: schedule[name] || {}
//         }))
//       });

//       console.log(`🔍 Conflict Validation Result:`, {
//         totalConflicts: conflicts.length,
//         conflicts: conflicts.slice(0, 5) // Log first 5 conflicts
//       });

//       // 🆕 CHANGE 6: Warn if conflicts exist
//       if (conflicts.length > 0) {
//         console.warn(`⚠️ Generated schedule has ${conflicts.length} conflicts!`);
//         console.warn('Top conflicts:', conflicts.slice(0, 3));
//       } else {
//         console.log('✅ No conflicts detected in generated schedule');
//       }
//       // ========================================================================

//       // Create lookup maps
//       const subjectMap = Object.fromEntries(
//         filteredSubjects.map(s => [
//           String(s._id),
//           { ...s, subjectName: s.subjectName || s.name || 'Unnamed Subject' }
//         ])
//       );
//       const teacherMap = Object.fromEntries(
//         filteredTeachers.map(t => [String(t._id), t])
//       );

//       // Enrich slots via ID-based lookup
//       for (const division of Object.keys(schedule)) {
//         const daySchedule = schedule[division];
//         for (const day of Object.keys(daySchedule)) {
//           daySchedule[day] = daySchedule[day].map(period => {
//             if (!period) return null;

//             const enriched = { ...period };

//             const subjectId =
//               enriched.subject?._id ||
//               enriched.subject?.id ||
//               enriched.subject;

//             if (subjectId && subjectMap[subjectId]) {
//               enriched.subject = subjectMap[subjectId];
//               enriched.subject.name =
//                 enriched.subject.subjectName ||
//                 enriched.subject.name ||
//                 'Unknown Subject';
//             } else {
//               enriched.subject = { name: 'Unknown Subject' };
//             }

//             const teacherId =
//               enriched.teacher?._id ||
//               enriched.teacher?.id ||
//               enriched.teacher;
//             if (teacherId && teacherMap[teacherId]) {
//               enriched.teacher = teacherMap[teacherId];
//             } else {
//               enriched.teacher = { name: 'Unknown Teacher' };
//             }

//             return enriched;
//           });
//         }
//       }

//       // 🔧 MODIFIED: Enhanced metadata with conflict information
//       // ========================================================================
//       const timetable = new Timetable({
//         departmentId,
//         semester: Number(targetSemester),
//         academicYear,
//         divisions: divisions.map(name => ({
//           division_name: name,
//           schedule: schedule[name] || {},
//         })),
//         status: conflicts.length === 0 ? 'published' : 'draft', // 🆕 Auto-publish if no conflicts
//         generation_metadata: {
//           fitness_score: metadata.fitnessScore,
//           generation_count: metadata.generation_count || metadata.generations || 0,
//           conflicts_resolved: metadata.conflictsResolved || conflicts.length === 0,
//           conflict_count: conflicts.length, // 🆕 Track conflict count
//           algorithm_version: metadata.algorithm_version,
//           generated_at: new Date(),
//           generation_time_seconds: parseFloat(generationTime), // 🆕 Track generation time
//           divisions_count: divisions.length, // 🆕 Track number of divisions
//         },
//       });
//       // ========================================================================

//       await timetable.save();
//       const savedTimetable = await Timetable.findById(timetable._id).lean();

//       // 🆕 CHANGE 7: Enhanced response with conflict info
//       // ========================================================================
//       res.status(201).json({
//         success: true,
//         message: conflicts.length === 0 
//           ? 'Timetable generated successfully with no conflicts' 
//           : `Timetable generated with ${conflicts.length} conflicts`,
//         data: savedTimetable,
//         conflicts: conflicts.slice(0, 10), // 🆕 Return top 10 conflicts
//         statistics: {
//           totalConflicts: conflicts.length,
//           generationTime: `${generationTime}s`,
//           divisionsGenerated: divisions.length,
//           fitnessScore: metadata.fitnessScore?.toFixed(2)
//         }
//       });
//       // add activity
// await creatActivity({
//   type: 'timetable',
//   action: 'Timetable generated',
//   details: `Dept: ${departmentId}, Semester: ${targetSemester}, Year: ${academicYear}`
// });
//       console.log("activity created");
      
//     } catch (error) {
//       console.error("💥 Timetable generation failed:", error);
//       return next(createError(500, error.message || 'Error in timetable generation'));
//     }
//   }



// Replace your entire generateTimetable method with this SCHEMA-MATCHED version

// static async generateTimetable(req, res, next) {
//   try {
//     console.log("📥 Incoming Request Body:", JSON.stringify(req.body, null, 2));

//     const {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//     } = req.body;

//     if (!departmentId || !semester || !academicYear || !Array.isArray(divisions) || divisions.length === 0) {
//       return next(createError(400, 'Missing required fields: departmentId, semester, academicYear, or divisions'));
//     }

//     console.log(`🏢 Generating timetable for ${divisions.length} divisions:`, divisions);

//     const targetSemester = String(semester).trim();

//     // Fetch data from database
//     const [subjects, teachers, classes] = await Promise.all([
//       subjectModel.find({ 
//         department_id: departmentId,
//         sem_id: targetSemester
//       }).populate('teacher_id', 'name email').lean(),
      
//       teacherModel.find({
//         department: departmentId,
//         semester: parseInt(targetSemester)
//       }).lean(),
      
//       classModel.find({
//         department_id: departmentId,
//         semester: targetSemester
//       }).lean()
//     ]);

//     console.log(`📝 Fetched from Database:`, {
//       subjects: subjects.length,
//       subjectsWithTeachers: subjects.filter(s => s.teacher_id).length,
//       teachers: teachers.length,
//       classrooms: classes.length,
//       semester: targetSemester
//     });

//     // Validation
//     if (subjects.length === 0) {
//       return next(createError(400, `No subjects found for department ${departmentId} and semester ${targetSemester}`));
//     }

//     const subjectsWithoutTeachers = subjects.filter(s => !s.teacher_id);
//     if (subjectsWithoutTeachers.length > 0) {
//       console.warn(`⚠️ ${subjectsWithoutTeachers.length} subjects have no teacher assigned:`, 
//         subjectsWithoutTeachers.map(s => s.subjectName).slice(0, 5)
//       );
//     }

//     const subjectsWithTeachers = subjects.filter(s => s.teacher_id);
//     if (subjectsWithTeachers.length === 0) {
//       return next(createError(400, `No subjects have teachers assigned for semester ${targetSemester}`));
//     }

//     if (teachers.length === 0) {
//       return next(createError(400, `No teachers found for department ${departmentId} and semester ${targetSemester}`));
//     }

//     if (classes.length === 0) {
//       return next(createError(400, `No classrooms found for department ${departmentId} and semester ${targetSemester}`));
//     }

//     // Transform subjects
//     const transformedSubjects = subjects.map(s => ({
//       _id: s._id,
//       name: s.subjectName,
//       subjectName: s.subjectName,
//       subject_code: s.subject_code,
//       semester: s.sem_id,
//       type: s.type,
//       credits: s.credits,
//       teacher_id: s.teacher_id,
//       lecturePerWeek: s.lecturePerWeek
//     }));

//     // Create lookup maps for enrichment
//     const teacherMap = new Map(teachers.map(t => [String(t._id), t]));
//     const classMap = new Map(classes.map(c => [String(c._id), c]));

//     // GA Configuration
//     const geneticAlgorithm = new GeneticAlgorithm({
//       populationSize: Math.min(200, 50 * divisions.length),
//       maxGenerations: Math.min(1000, 100 * divisions.length),
//       mutationRate: 0.12,
//       crossoverRate: 0.85,
//       elitismRate: 0.15,
//       departmentId,
//       semester: targetSemester,
//       academicYear,
//       divisions,
//     });

//     console.log(`🧬 GA Configuration:`, {
//       populationSize: geneticAlgorithm.populationSize,
//       maxGenerations: geneticAlgorithm.maxGenerations,
//       divisions: divisions.length
//     });

//     const startTime = Date.now();

//     const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
//       divisions,
//       subjects: transformedSubjects,
//       teachers: teachers,
//       classes: classes,
//     });

//     const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
//     console.log(`⏱️ Generation completed in ${generationTime} seconds`);

//     if (!schedule || Object.keys(schedule).length === 0) {
//       return next(createError(500, 'Failed to generate a valid schedule'));
//     }

//     // Validate schedule
//     const conflicts = await TimetableController.validateTimetable({
//       divisions: divisions.map(name => ({
//         division_name: name,
//         schedule: schedule[name] || {}
//       }))
//     });

//     console.log(`🔍 Conflict Validation:`, {
//       totalConflicts: conflicts.length,
//       topConflicts: conflicts.slice(0, 3)
//     });

//     // 🔧 CRITICAL FIX: Match exact schema structure
//     const normalizedSchedule = {};
    
//     for (const division of Object.keys(schedule)) {
//       normalizedSchedule[division] = {};
      
//       for (const day of Object.keys(schedule[division])) {
//         normalizedSchedule[division][day] = schedule[division][day].map(period => {
//           if (!period) return null;

//           // Get teacher and classroom details
//           const teacherId = period.teacher?._id ? String(period.teacher._id) : null;
//           const classroomId = period.classroom?._id ? String(period.classroom._id) : null;
          
//           const teacher = teacherId ? teacherMap.get(teacherId) : null;
//           const classroom = classroomId ? classMap.get(classroomId) : null;

//           // ✅ Match EXACT schema structure
//           return {
//             period: period.period,
            
//             // Subject: { _id: ObjectId, name: String, type: String }
//             subject: {
//               _id: period.subject?._id,
//               name: period.subject?.subjectName || period.subject?.name || 'Unknown',
//               type: period.subject?.type || 'theory'
//             },
            
//             // Teacher: { _id: ObjectId, name: String }
//             teacher: teacher ? {
//               _id: teacher._id,
//               name: teacher.name
//             } : null,
            
//             // Classroom: String (room number)
//             classroom: classroom?.classNumber || classroom?.room_number || null
//           };
//         });
//       }
//     }

//     console.log('✅ Schedule normalized to match MongoDB schema');

//     // Save timetable with normalized data
//     const timetable = new Timetable({
//       departmentId,
//       semester: targetSemester, // Keep as string to match schema
//       academicYear,
//       divisions: divisions.map(name => ({
//         division_name: name,
//         schedule: normalizedSchedule[name] || {},
//       })),
//       status: conflicts.length === 0 ? 'published' : 'draft',
//       generation_metadata: {
//         fitness_score: metadata.fitnessScore,
//         generation_count: metadata.generation_count || 0,
//         conflicts_resolved: conflicts.length,
//         conflict_count: conflicts.length,
//         algorithm_version: metadata.algorithm_version || '3.2.0',
//         generated_at: new Date(),
//         generation_time_seconds: parseFloat(generationTime),
//         divisions_count: divisions.length,
//       },
//     });

//     await timetable.save();
    
//     // Fetch saved timetable with populated data
//     const savedTimetable = await Timetable.findById(timetable._id)
//       .populate('departmentId', 'name departmentName')
//       .lean();

//     res.status(201).json({
//       success: true,
//       message: conflicts.length === 0 
//         ? 'Timetable generated successfully with no conflicts' 
//         : `Timetable generated with ${conflicts.length} conflicts`,
//       data: savedTimetable,
//       conflicts: conflicts.slice(0, 10),
//       statistics: {
//         totalConflicts: conflicts.length,
//         generationTime: `${generationTime}s`,
//         divisionsGenerated: divisions.length,
//         subjectsScheduled: transformedSubjects.length,
//         teachersUsed: teachers.length,
//         fitnessScore: metadata.fitnessScore?.toFixed(2)
//       }
//     });

//     // Log activity
//     await creatActivity({
//       type: 'timetable',
//       action: 'Timetable generated',
//       details: `Dept: ${departmentId}, Semester: ${targetSemester}, Year: ${academicYear}, Divisions: ${divisions.length}`
//     });
//     console.log("✅ Activity logged");
    
//   } catch (error) {
//     console.error("💥 Timetable generation failed:", error);
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
    } = req.body;

    if (!departmentId || !semester || !academicYear || !Array.isArray(divisions) || divisions.length === 0) {
      return next(createError(400, 'Missing required fields: departmentId, semester, academicYear, or divisions'));
    }

    console.log(`🏢 Generating timetable for ${divisions.length} divisions:`, divisions);

    const targetSemester = String(semester).trim();

    // Fetch data from database
    const [subjects, teachers, classes] = await Promise.all([
      subjectModel.find({ 
        department_id: departmentId,
        sem_id: targetSemester
      }).populate('teacher_id', 'name email').lean(),
      
      teacherModel.find({
        department: departmentId,
        semester: parseInt(targetSemester)
      }).lean(),
      
      classModel.find({
        department_id: departmentId,
        semester: targetSemester
      }).lean()
    ]);

    console.log(`📝 Fetched from Database:`, {
      subjects: subjects.length,
      subjectsWithTeachers: subjects.filter(s => s.teacher_id).length,
      teachers: teachers.length,
      classrooms: classes.length,
      semester: targetSemester
    });

    // Validation
    if (subjects.length === 0) {
      return next(createError(400, `No subjects found for department ${departmentId} and semester ${targetSemester}`));
    }

    const subjectsWithoutTeachers = subjects.filter(s => !s.teacher_id);
    if (subjectsWithoutTeachers.length > 0) {
      console.warn(`⚠️ ${subjectsWithoutTeachers.length} subjects have no teacher assigned:`, 
        subjectsWithoutTeachers.map(s => s.subjectName).slice(0, 5)
      );
    }

    const subjectsWithTeachers = subjects.filter(s => s.teacher_id);
    if (subjectsWithTeachers.length === 0) {
      return next(createError(400, `No subjects have teachers assigned for semester ${targetSemester}`));
    }

    if (teachers.length === 0) {
      return next(createError(400, `No teachers found for department ${departmentId} and semester ${targetSemester}`));
    }

    if (classes.length === 0) {
      return next(createError(400, `No classrooms found for department ${departmentId} and semester ${targetSemester}`));
    }

    // Transform subjects
    const transformedSubjects = subjects.map(s => ({
      _id: s._id,
      name: s.subjectName,
      subjectName: s.subjectName,
      subject_code: s.subject_code,
      semester: s.sem_id,
      type: s.type,
      credits: s.credits,
      teacher_id: s.teacher_id,
      lecturePerWeek: s.lecturePerWeek
    }));

    // Create lookup maps for enrichment
    const teacherMap = new Map(teachers.map(t => [String(t._id), t]));
    const classMap = new Map(classes.map(c => [String(c._id), c]));

    // GA Configuration
    const geneticAlgorithm = new GeneticAlgorithm({
      populationSize: Math.min(200, 50 * divisions.length),
      maxGenerations: Math.min(1000, 100 * divisions.length),
      mutationRate: 0.12,
      crossoverRate: 0.85,
      elitismRate: 0.15,
      departmentId,
      semester: targetSemester,
      academicYear,
      divisions,
    });

    console.log(`🧬 GA Configuration:`, {
      populationSize: geneticAlgorithm.populationSize,
      maxGenerations: geneticAlgorithm.maxGenerations,
      divisions: divisions.length
    });

    const startTime = Date.now();

    const { schedule, metadata } = await geneticAlgorithm.generateSchedule({
      divisions,
      subjects: transformedSubjects,
      teachers: teachers,
      classes: classes,
    });

    const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️ Generation completed in ${generationTime} seconds`);

    if (!schedule || Object.keys(schedule).length === 0) {
      return next(createError(500, 'Failed to generate a valid schedule'));
    }

    // Validate schedule
    const conflicts = await TimetableController.validateTimetable({
      divisions: divisions.map(name => ({
        division_name: name,
        schedule: schedule[name] || {}
      }))
    });

    console.log(`🔍 Conflict Validation:`, {
      totalConflicts: conflicts.length,
      topConflicts: conflicts.slice(0, 3)
    });

    // 🔧 CRITICAL FIX: Match exact schema structure
    const normalizedSchedule = {};
    
    for (const division of Object.keys(schedule)) {
      normalizedSchedule[division] = {};
      
      for (const day of Object.keys(schedule[division])) {
        normalizedSchedule[division][day] = schedule[division][day].map(period => {
          if (!period) return null;

          // Get teacher and classroom details
          const teacherId = period.teacher?._id ? String(period.teacher._id) : null;
          const classroomId = period.classroom?._id ? String(period.classroom._id) : null;
          
          const teacher = teacherId ? teacherMap.get(teacherId) : null;
          const classroom = classroomId ? classMap.get(classroomId) : null;

          // ✅ Match EXACT schema structure + preserve lab marker
          return {
            period: period.period,
            
            // Subject: { _id: ObjectId, name: String, type: String }
            subject: {
              _id: period.subject?._id,
              name: period.subject?.subjectName || period.subject?.name || 'Unknown',
              type: period.subject?.type || 'theory'
            },
            
            // Teacher: { _id: ObjectId, name: String }
            teacher: teacher ? {
              _id: teacher._id,
              name: teacher.name
            } : null,
            
            // Classroom: String (room number)
            classroom: classroom?.classNumber || classroom?.room_number || null,
            
            // ✅ Preserve lab marker for statistics
            isLab: period.isLab || period.subject?.type === 'lab' || period.subject?.type === 'practical'
          };
        });
      }
    }

    console.log('✅ Schedule normalized to match MongoDB schema');

    // Save timetable with normalized data
    const timetable = new Timetable({
      departmentId,
      semester: targetSemester, // Keep as string to match schema
      academicYear,
      divisions: divisions.map(name => ({
        division_name: name,
        schedule: normalizedSchedule[name] || {},
      })),
      status: conflicts.length === 0 ? 'published' : 'draft',
      generation_metadata: {
        fitness_score: metadata.fitnessScore,
        generation_count: metadata.generation_count || 0,
        conflicts_resolved: conflicts.length,
        conflict_count: conflicts.length,
        algorithm_version: metadata.algorithm_version || '3.2.0',
        generated_at: new Date(),
        generation_time_seconds: parseFloat(generationTime),
        divisions_count: divisions.length,
      },
    });

    await timetable.save();
    
    // Fetch saved timetable with populated data
    const savedTimetable = await Timetable.findById(timetable._id)
      .populate('departmentId', 'name departmentName')
      .lean();

    res.status(201).json({
      success: true,
      message: conflicts.length === 0 
        ? 'Timetable generated successfully with no conflicts' 
        : `Timetable generated with ${conflicts.length} conflicts`,
      data: savedTimetable,
      conflicts: conflicts.slice(0, 10),
      statistics: {
        totalConflicts: conflicts.length,
        generationTime: `${generationTime}s`,
        divisionsGenerated: divisions.length,
        subjectsScheduled: transformedSubjects.length,
        teachersUsed: teachers.length,
        fitnessScore: metadata.fitnessScore?.toFixed(2)
      }
    });

    // Log activity
    await creatActivity({
      type: 'timetable',
      action: 'Timetable generated',
      details: `Dept: ${departmentId}, Semester: ${targetSemester}, Year: ${academicYear}, Divisions: ${divisions.length}`
    });
    console.log("✅ Activity logged");
    
  } catch (error) {
    console.error("💥 Timetable generation failed:", error);
    return next(createError(500, error.message || 'Error in timetable generation'));
  }
}


  // 🔧 MODIFIED: Enhanced conflict validation
  // ========================================================================
  static async validateTimetable(timetable) {
    const conflicts = [];
    const teacherAssignments = new Map();
    const classAssignments = new Map();

    // 🆕 CHANGE 8: Track division for each assignment
    const teacherDivisionMap = new Map(); // teacherKey -> [divisions]
    const classDivisionMap = new Map(); // classKey -> [divisions]
    // ========================================================================

    timetable.divisions.forEach(division => {
      const divisionName = division.division_name || division.name;
      
      Object.entries(division.schedule).forEach(([day, periods]) => {
        if (!Array.isArray(periods)) return;

        periods.forEach((slot, periodIndex) => {
          if (!slot || !slot.teacher) return;

          // Check teacher conflicts
          const teacherKey = `${slot.teacher._id}_${day}_${periodIndex}`;
          
          // 🆕 CHANGE 9: Enhanced teacher conflict tracking
          if (teacherAssignments.has(teacherKey)) {
            const previousDivision = teacherDivisionMap.get(teacherKey)[0];
            conflicts.push({
              type: 'teacher_conflict',
              severity: previousDivision === divisionName ? 'medium' : 'high', // 🆕 Higher severity for cross-division
              description: `Teacher ${slot.teacher.name} has multiple classes at period ${periodIndex + 1} on ${day}`,
              details: {
                teacher: slot.teacher.name,
                teacherId: slot.teacher._id,
                day,
                period: periodIndex + 1,
                divisions: [previousDivision, divisionName], // 🆕 Show which divisions conflict
                conflictType: previousDivision === divisionName ? 'same-division' : 'cross-division'
              }
            });
          } else {
            teacherAssignments.set(teacherKey, true);
            teacherDivisionMap.set(teacherKey, [divisionName]);
          }
          // ========================================================================

          // Check classroom conflicts
          const classKey = `${slot.classroom}_${day}_${periodIndex}`;
          
          // 🆕 CHANGE 10: Enhanced classroom conflict tracking
          if (classAssignments.has(classKey)) {
            const previousDivision = classDivisionMap.get(classKey)[0];
            conflicts.push({
              type: 'classroom_conflict',
              severity: previousDivision === divisionName ? 'low' : 'medium', // 🆕 Higher severity for cross-division
              description: `Classroom ${slot.classroom} is double-booked at period ${periodIndex + 1} on ${day}`,
              details: {
                classroom: slot.classroom,
                day,
                period: periodIndex + 1,
                divisions: [previousDivision, divisionName], // 🆕 Show which divisions conflict
                conflictType: previousDivision === divisionName ? 'same-division' : 'cross-division'
              }
            });
          } else {
            classAssignments.set(classKey, true);
            classDivisionMap.set(classKey, [divisionName]);
          }
          // ========================================================================

          // Check lab sessions
          if ((slot.subject?.type === 'Lab' || slot.subject?.type === 'practical') && periodIndex < periods.length - 1) {
            const nextPeriod = periods[periodIndex + 1];
            if (!nextPeriod || nextPeriod.subject?._id !== slot.subject._id) {
              conflicts.push({
                type: 'lab_conflict',
                severity: 'high',
                description: `Lab session for ${slot.subject?.name || 'Unknown'} doesn't have consecutive periods on ${day}`,
                details: {
                  subject: slot.subject?.name,
                  division: divisionName,
                  day,
                  period: periodIndex + 1
                }
              });
            }
          }
        });
      });
    });

    // 🆕 CHANGE 11: Sort conflicts by severity
    const severityOrder = { high: 0, medium: 1, low: 2 };
    conflicts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    // ========================================================================

    return conflicts;
  }
  // ========================================================================

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

  // static async getTimetableById(req, res, next) {
  //   try {
  //     const timetable = await Timetable.findById(req.params.id);

  //     if (!timetable) {
  //       return next(createError(404, 'Timetable not found'));
  //     }

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

  //       timetable.divisions?.forEach((division) => {
  //         const schedule = division.schedule;
  //         if (!schedule || typeof schedule !== 'object') return;

  //         Object.entries(schedule).forEach(([_, daySlots]) => {
  //           if (!Array.isArray(daySlots)) return;

  //           daySlots.forEach((slot) => {
  //             if (slot && typeof slot === 'object' && slot.subject) {
  //               statistics.totalClasses++;

  //               const type = (slot.type || 'theory').toLowerCase();
  //               if (type === 'lab') {
  //                 statistics.labSessions++;
  //               } else {
  //                 statistics.theorySessions++;
  //               }

  //               if (slot.teacher) uniqueTeachers.add(slot.teacher.toString());
  //               if (slot.classroom) uniqueRooms.add(slot.classroom.toString());
  //             }
  //           });
  //         });
  //       });

  //       statistics.teacherUtilization = uniqueTeachers.size > 0
  //         ? parseFloat(((statistics.totalClasses / (uniqueTeachers.size * 6 * 5)) * 100).toFixed(2))
  //         : 0;

  //       statistics.roomUtilization = uniqueRooms.size > 0
  //         ? parseFloat(((statistics.totalClasses / (uniqueRooms.size * 6 * 5)) * 100).toFixed(2))
  //         : 0;

  //       return res.status(200).json({
  //         success: true,
  //         data: { statistics }
  //       });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       data: { timetable }
  //     });

  //   } catch (err) {
  //     return next(createError(500, 'Error fetching timetable. Please check the ID and schedule structure.'));
  //   }
  // }


static async getTimetableById(req, res, next) {
  try {
    const { id } = req.params;
    const { stats } = req.query;

    const timetable = await Timetable.findById(id)
      .populate('departmentId', 'name');

    if (!timetable) {
      return next(createError(404, 'Timetable not found'));
    }

    // ============================
    // Always send timetable
    // ============================
    let response = {
      success: true,
      data: timetable
    };

    
    if (stats === 'true') {
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

        Object.values(schedule).forEach((daySlots) => {
          if (!Array.isArray(daySlots)) return;

          daySlots.forEach((slot) => {
            if (slot && typeof slot === 'object' && slot.subject) {
              statistics.totalClasses++;

              // Detect lab in multiple ways
const isLab =
  slot.isLab === true ||
  String(slot.subject.type || '').toLowerCase() === 'lab' ||
  String(slot.subject.sessionType || '').toLowerCase() === 'lab' ||
  String(slot.subject.subjectType || '').toLowerCase() === 'lab';


  

if (isLab) {
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

      response.statistics = statistics; 
      console.log('📊 Statistics:', statistics);  
    }

    return res.status(200).json(response);

  } catch (err) {
    console.error("❌ getTimetableById error:", err);
    return next(createError(500, 'Error fetching timetable.'));
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
              if (slot.subject.type === 'lab') statistics.labSessions++;
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
      const divisionId = division._id || division;
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

      const timetable = await Timetable.findById(id);

      if (!timetable) {
        return res.status(404).json({ message: 'Timetable not found' });
      }

      if (format === 'pdf') {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=timetable_${id}.pdf`);

        doc.pipe(res);

        doc.fontSize(16).text(`Timetable - ${timetable.divisionName}`, { align: 'center' });
        doc.moveDown();

        timetable.schedule.forEach(day => {
          doc.fontSize(12).text(`Day: ${day.name}`);
          day.slots.forEach(slot => {
            doc.text(
              `Period ${slot.period}: ${slot.subject?.name || 'Free'} - Teacher: ${slot.teacher?.name || 'N/A'} - Room: ${slot.classroom?.name || 'N/A'}`
            );
          });
          doc.moveDown();
        });

        doc.end();
      } else {
        res.status(400).json({ message: 'Unsupported export format' });
      }

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to export timetable' });
    }
  }
}

export default TimetableController;