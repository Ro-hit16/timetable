// export default class GeneticAlgorithm {
//   constructor(config = {}) {
//     this.config = config;
//     this.populationSize = Math.max(50, Math.min(500, config.populationSize || 150));
//     this.maxGenerations = Math.max(100, Math.min(2000, config.maxGenerations || 800));
//     this.mutationRate = Math.max(0.05, Math.min(0.5, config.mutationRate || 0.15));
//     this.crossoverRate = Math.max(0.5, Math.min(1, config.crossoverRate || 0.8));
//     this.elitismCount = Math.max(1, Math.floor(
//       Math.max(0.05, Math.min(0.3, config.elitismRate || 0.1)) * this.populationSize
//     ));

//     if (!config.departmentId || !config.semester || !config.academicYear) {
//       throw new Error('Missing required configuration: departmentId, semester, or academicYear');
//     }

//     this.departmentId = config.departmentId;
//     this.semester = config.semester;
//     this.academicYear = config.academicYear;
//     this.divisions = Array.isArray(config.divisions) ? config.divisions : [];
//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     this.periodsPerDay = 6;
    
//     this.penalties = {
//       TEACHER_CLASH: -100,
//       ROOM_CLASH: -80,
//       SUBJECT_OVERLOAD: -30,
//       LAB_NOT_CONSECUTIVE: -60,
//       LAB_WRONG_SLOT: -40,
//       UNWANTED_FREE: -10,
//       PREFERRED_SLOT: 15,
//       FILLED_SLOT: 5,
//       BALANCED_DISTRIBUTION: 20
//     };
//   }

//   async generateSchedule({ divisions = [], subjects = [], teachers = [], classes = [] } = {}) {
//     try {
//       // Enhanced validation
//       if (!divisions.length) throw new Error('No divisions provided');
//       if (!subjects.length) throw new Error('No subjects provided');
//       if (!teachers.length) throw new Error('No teachers provided');
//       if (!classes.length) throw new Error('No classrooms provided');

//       // 🔧 CRITICAL FIX: Build subject-teacher mapping from subject.teacher_id
//       const subjectTeacherMap = new Map();
//       const teacherMap = new Map(teachers.map(t => [String(t._id), t]));
      
//       subjects.forEach(subject => {
//         const teacherId = String(subject.teacher_id?._id || subject.teacher_id);
//         if (teacherId && teacherMap.has(teacherId)) {
//           subjectTeacherMap.set(String(subject._id), teacherMap.get(teacherId));
//         } else {
//           console.warn(`⚠️ Subject "${subject.name || subject.subjectName}" has no valid teacher assigned`);
//         }
//       });

//       const assignedTeachers = Array.from(new Set(subjectTeacherMap.values()));
      
//       console.log(`✅ Subject-Teacher Mapping:`, {
//         totalSubjects: subjects.length,
//         subjectsWithTeachers: subjectTeacherMap.size,
//         uniqueTeachersUsed: assignedTeachers.length
//       });

//       if (subjectTeacherMap.size === 0) {
//         throw new Error('No subjects have teachers assigned. Please assign teachers to subjects in the database.');
//       }

//       const startTime = Date.now();
//       const schedule = this.run(divisions, subjects, teachers, classes, subjectTeacherMap);
      
//       if (!schedule) {
//         throw new Error('Failed to generate valid schedule');
//       }

//       // Validate final schedule
//       const validation = this.validateSchedule(schedule, teachers, classes);
      
//       return {
//         schedule,
//         metadata: {
//           fitnessScore: this.fitness(schedule, subjects, teachers, classes),
//           generation_count: this.maxGenerations,
//           population_size: this.populationSize,
//           teachersUsed: assignedTeachers.length,
//           subjectsScheduled: subjects.length,
//           divisionsCreated: divisions.length,
//           conflictsResolved: validation.isValid,
//           conflictDetails: validation.conflicts,
//           algorithm_version: '3.2.0',
//           executionTime: `${(Date.now() - startTime) / 1000} seconds`
//         }
//       };
//     } catch (err) {
//       console.error('Schedule generation error:', err);
//       throw new Error(`Failed to generate schedule: ${err.message}`);
//     }
//   }

//   createEmptySchedule(divisions) {
//     const schedule = {};
//     for (const division of divisions) {
//       schedule[division] = {};
//       for (const day of this.days) {
//         schedule[division][day] = new Array(this.periodsPerDay).fill(null);
//       }
//     }
//     return schedule;
//   }

//   createRandomSchedule(divisions, subjects, teachers, classes, subjectTeacherMap) {
//     const schedule = this.createEmptySchedule(divisions);
    
//     // Categorize resources
//     const theorySubs = subjects.filter(s => s.type === 'theory');
//     const practicals = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
//     const tutorials = subjects.filter(s => s.type === 'tutorial');
//     const regularRooms = classes.filter(c => !c.classNumber?.toLowerCase().includes('lab'));
//     const labRooms = classes.filter(c => c.classNumber?.toLowerCase().includes('lab'));

//     const pickRandom = (arr) => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;
//     const getRoom = (type) => {
//       if (type === 'practical' || type === 'lab') {
//         return pickRandom(labRooms) || pickRandom(regularRooms);
//       }
//       return pickRandom(regularRooms);
//     };

//     // Schedule for each division
//     for (const division of divisions) {
//       const divisionSubjectCount = new Map();
      
//       for (const day of this.days) {
//         const daySubjectCount = new Map();
//         let p = 0;

//         while (p < this.periodsPerDay) {
//           let scheduled = false;

//           // Priority 1: Schedule labs in valid slots (0-1, 2-3, 4-5)
//           if (p % 2 === 0 && p + 1 < this.periodsPerDay) {
//             const availableLabs = practicals.filter(lab => {
//               const dayCount = daySubjectCount.get(lab._id) || 0;
//               const totalCount = divisionSubjectCount.get(lab._id) || 0;
//               return dayCount < 1 && totalCount < 3 && subjectTeacherMap.has(String(lab._id));
//             });

//             if (availableLabs.length > 0) {
//               const lab = pickRandom(availableLabs);
//               const teacher = subjectTeacherMap.get(String(lab._id));
//               const room = getRoom(lab.type);

//               const slot = {
//                 period: p + 1,
//                 subject: { 
//                   _id: lab._id, 
//                   subjectName: lab.name || lab.subjectName, 
//                   type: lab.type 
//                 },
//                 teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//                 classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//               };

//               schedule[division][day][p] = slot;
//               schedule[division][day][p + 1] = { ...slot, period: p + 2 };
              
//               daySubjectCount.set(lab._id, (daySubjectCount.get(lab._id) || 0) + 1);
//               divisionSubjectCount.set(lab._id, (divisionSubjectCount.get(lab._id) || 0) + 1);
              
//               p += 2;
//               scheduled = true;
//               continue;
//             }
//           }

//           // Priority 2: Schedule tutorials in last slots (period 5 or 6)
//           if (p >= 4 && tutorials.length > 0) {
//             const availableTutorials = tutorials.filter(tut => {
//               const dayCount = daySubjectCount.get(tut._id) || 0;
//               const totalCount = divisionSubjectCount.get(tut._id) || 0;
//               return dayCount < 1 && totalCount < 3 && subjectTeacherMap.has(String(tut._id));
//             });

//             if (availableTutorials.length > 0) {
//               const tutorial = pickRandom(availableTutorials);
//               const teacher = subjectTeacherMap.get(String(tutorial._id));
//               const room = getRoom(tutorial.type);

//               schedule[division][day][p] = {
//                 period: p + 1,
//                 subject: { 
//                   _id: tutorial._id, 
//                   subjectName: tutorial.name || tutorial.subjectName, 
//                   type: tutorial.type 
//                 },
//                 teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//                 classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//               };

//               daySubjectCount.set(tutorial._id, (daySubjectCount.get(tutorial._id) || 0) + 1);
//               divisionSubjectCount.set(tutorial._id, (divisionSubjectCount.get(tutorial._id) || 0) + 1);
              
//               p++;
//               scheduled = true;
//               continue;
//             }
//           }

//           // Priority 3: Fill with theory subjects
//           if (theorySubs.length > 0) {
//             const availableTheory = theorySubs.filter(th => {
//               const dayCount = daySubjectCount.get(th._id) || 0;
//               const totalCount = divisionSubjectCount.get(th._id) || 0;
//               return dayCount < 2 && totalCount < 5 && subjectTeacherMap.has(String(th._id));
//             });

//             if (availableTheory.length > 0) {
//               const theory = pickRandom(availableTheory);
//               const teacher = subjectTeacherMap.get(String(theory._id));
//               const room = getRoom(theory.type);

//               schedule[division][day][p] = {
//                 period: p + 1,
//                 subject: { 
//                   _id: theory._id, 
//                   subjectName: theory.name || theory.subjectName, 
//                   type: theory.type 
//                 },
//                 teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//                 classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//               };

//               daySubjectCount.set(theory._id, (daySubjectCount.get(theory._id) || 0) + 1);
//               divisionSubjectCount.set(theory._id, (divisionSubjectCount.get(theory._id) || 0) + 1);
              
//               scheduled = true;
//             }
//           }

//           p++;
//         }
//       }
//     }

//     return schedule;
//   }

//   fitness(schedule, subjects, teachers, classes) {
//     if (!schedule) return -Infinity;
    
//     let score = 0;
//     const globalTeacherSlots = new Map();
//     const globalRoomSlots = new Map();

//     for (const division in schedule) {
//       for (const day of this.days) {
//         const daySlots = schedule[division][day] || [];
//         const subjectDayCount = new Map();

//         for (let i = 0; i < daySlots.length; i++) {
//           const slot = daySlots[i];
          
//           if (!slot) {
//             score += this.penalties.UNWANTED_FREE;
//             continue;
//           }

//           score += this.penalties.FILLED_SLOT;

//           const subjectId = slot.subject?._id;
//           const subjectType = slot.subject?.type;
//           const teacherId = slot.teacher?._id;
//           const roomId = slot.classroom?._id;

//           if (subjectId) {
//             subjectDayCount.set(subjectId, (subjectDayCount.get(subjectId) || 0) + 1);
//             if (subjectDayCount.get(subjectId) > 2) {
//               score += this.penalties.SUBJECT_OVERLOAD;
//             }
//           }

//           // CRITICAL: Check teacher conflicts across ALL divisions
//           if (teacherId) {
//             const teacherKey = `${teacherId}_${day}_${i}`;
//             if (globalTeacherSlots.has(teacherKey)) {
//               score += this.penalties.TEACHER_CLASH;
//             } else {
//               globalTeacherSlots.set(teacherKey, { division, day, period: i });
//             }
//           }

//           // CRITICAL: Check room conflicts across ALL divisions
//           if (roomId) {
//             const roomKey = `${roomId}_${day}_${i}`;
//             if (globalRoomSlots.has(roomKey)) {
//               score += this.penalties.ROOM_CLASH;
//             } else {
//               globalRoomSlots.set(roomKey, { division, day, period: i });
//             }
//           }

//           // Lab validation
//           if (subjectType === 'practical' || subjectType === 'lab') {
//             const isValidLabStart = (i === 0 || i === 2 || i === 4);
            
//             if (!isValidLabStart) {
//               score += this.penalties.LAB_WRONG_SLOT;
//             }

//             const nextSlot = daySlots[i + 1];
//             const isConsecutive = nextSlot && 
//                                  nextSlot.subject?._id === subjectId &&
//                                  nextSlot.teacher?._id === teacherId;
            
//             if (!isConsecutive) {
//               score += this.penalties.LAB_NOT_CONSECUTIVE;
//             } else {
//               score += this.penalties.PREFERRED_SLOT * 2;
//             }

//             if (i === 0) score += this.penalties.PREFERRED_SLOT * 3;
//             else if (i === 2) score += this.penalties.PREFERRED_SLOT * 2;
//             else if (i === 4) score += this.penalties.PREFERRED_SLOT;
//           }

//           if (subjectType === 'theory' && i >= 1 && i <= 4) {
//             score += this.penalties.PREFERRED_SLOT;
//           }

//           if (subjectType === 'tutorial' && i >= 4) {
//             score += this.penalties.PREFERRED_SLOT * 3;
//           }
//         }

//         const filledSlots = daySlots.filter(s => s !== null).length;
//         if (filledSlots >= 5) {
//           score += this.penalties.BALANCED_DISTRIBUTION;
//         }
//       }
//     }

//     return score;
//   }

//   selection(population, fitnessScores) {
//     if (!population?.length || population.length !== fitnessScores?.length) {
//       return population || [];
//     }

//     const minFitness = Math.min(...fitnessScores);
//     const adjustedScores = fitnessScores.map(s => s - minFitness + 1);
//     const totalFitness = adjustedScores.reduce((sum, score) => sum + score, 0);

//     if (totalFitness <= 0) return [...population];

//     const selected = [];
//     for (let i = 0; i < population.length; i++) {
//       let random = Math.random() * totalFitness;
//       let cumulative = 0;

//       for (let j = 0; j < population.length; j++) {
//         cumulative += adjustedScores[j];
//         if (random <= cumulative) {
//           selected.push(JSON.parse(JSON.stringify(population[j])));
//           break;
//         }
//       }
//     }

//     return selected.length ? selected : [...population];
//   }

//   crossover(parent1, parent2) {
//     if (!parent1 || !parent2 || Math.random() > this.crossoverRate) {
//       return parent1 ? JSON.parse(JSON.stringify(parent1)) : {};
//     }

//     const child = {};
//     const divisions = Object.keys(parent1);

//     for (const division of divisions) {
//       child[division] = {};
      
//       for (const day of this.days) {
//         const crossoverPoint = Math.floor(Math.random() * this.periodsPerDay);
//         const parent1Slots = parent1[division]?.[day] || new Array(this.periodsPerDay).fill(null);
//         const parent2Slots = parent2[division]?.[day] || new Array(this.periodsPerDay).fill(null);

//         child[division][day] = [
//           ...parent1Slots.slice(0, crossoverPoint),
//           ...parent2Slots.slice(crossoverPoint)
//         ];
//       }
//     }

//     return child;
//   }

//   mutate(schedule) {
//     if (!schedule || Math.random() > this.mutationRate) {
//       return JSON.parse(JSON.stringify(schedule));
//     }

//     const mutated = JSON.parse(JSON.stringify(schedule));
//     const divisions = Object.keys(mutated);
//     if (!divisions.length) return mutated;

//     const mutationType = Math.random();

//     if (mutationType < 0.5) {
//       const division = divisions[Math.floor(Math.random() * divisions.length)];
//       const day = this.days[Math.floor(Math.random() * this.days.length)];
//       const p1 = Math.floor(Math.random() * this.periodsPerDay);
//       const p2 = Math.floor(Math.random() * this.periodsPerDay);

//       if (mutated[division]?.[day]) {
//         const temp = mutated[division][day][p1];
//         mutated[division][day][p1] = mutated[division][day][p2];
//         mutated[division][day][p2] = temp;
//       }
//     } else {
//       const division = divisions[Math.floor(Math.random() * divisions.length)];
//       const day = this.days[Math.floor(Math.random() * this.days.length)];
//       const period = Math.floor(Math.random() * this.periodsPerDay);

//       if (mutated[division]?.[day]) {
//         mutated[division][day][period] = null;
//       }
//     }

//     return mutated;
//   }

//   validateSchedule(schedule, teachers, classes) {
//     const conflicts = [];
//     const teacherSlots = new Map();
//     const roomSlots = new Map();

//     for (const division in schedule) {
//       for (const day of this.days) {
//         const daySlots = schedule[division][day] || [];
        
//         for (let i = 0; i < daySlots.length; i++) {
//           const slot = daySlots[i];
//           if (!slot) continue;

//           const teacherId = slot.teacher?._id;
//           const roomId = slot.classroom?._id;

//           if (teacherId) {
//             const key = `${teacherId}_${day}_${i}`;
//             if (teacherSlots.has(key)) {
//               conflicts.push({
//                 type: 'TEACHER_CLASH',
//                 teacher: slot.teacher.name,
//                 divisions: [teacherSlots.get(key).division, division],
//                 day,
//                 period: i + 1
//               });
//             } else {
//               teacherSlots.set(key, { division, day, period: i });
//             }
//           }

//           if (roomId) {
//             const key = `${roomId}_${day}_${i}`;
//             if (roomSlots.has(key)) {
//               conflicts.push({
//                 type: 'ROOM_CLASH',
//                 room: slot.classroom.room_number,
//                 divisions: [roomSlots.get(key).division, division],
//                 day,
//                 period: i + 1
//               });
//             } else {
//               roomSlots.set(key, { division, day, period: i });
//             }
//           }
//         }
//       }
//     }

//     return {
//       isValid: conflicts.length === 0,
//       conflicts
//     };
//   }

//   run(divisions, subjects, teachers, classes, subjectTeacherMap) {
//     if (!divisions?.length || !subjects?.length || !teachers?.length || !classes?.length) {
//       return this.createEmptySchedule(divisions || []);
//     }

//     let population = [];
//     for (let i = 0; i < this.populationSize; i++) {
//       population.push(this.createRandomSchedule(divisions, subjects, teachers, classes, subjectTeacherMap));
//     }

//     let bestSolution = null;
//     let bestFitness = -Infinity;
//     let stagnationCount = 0;
//     const maxStagnation = 100;

//     for (let gen = 0; gen < this.maxGenerations; gen++) {
//       const fitnessScores = population.map(s => this.fitness(s, subjects, teachers, classes));
//       const currentBest = Math.max(...fitnessScores);
      
//       if (currentBest > bestFitness) {
//         bestFitness = currentBest;
//         bestSolution = JSON.parse(JSON.stringify(population[fitnessScores.indexOf(currentBest)]));
//         stagnationCount = 0;
//       } else {
//         stagnationCount++;
//       }

//       if (bestFitness >= 800 || stagnationCount >= maxStagnation) {
//         console.log(`✅ Terminated at generation ${gen}, fitness: ${bestFitness}`);
//         break;
//       }

//       const selected = this.selection(population, fitnessScores);
//       const newPopulation = [];

//       const eliteIndices = fitnessScores
//         .map((score, idx) => ({ score, idx }))
//         .sort((a, b) => b.score - a.score)
//         .slice(0, this.elitismCount)
//         .map(item => item.idx);

//       for (const idx of eliteIndices) {
//         newPopulation.push(JSON.parse(JSON.stringify(population[idx])));
//       }

//       while (newPopulation.length < this.populationSize) {
//         const p1 = selected[Math.floor(Math.random() * selected.length)];
//         const p2 = selected[Math.floor(Math.random() * selected.length)];
//         const child = this.crossover(p1, p2);
//         newPopulation.push(this.mutate(child));
//       }

//       population = newPopulation;
//     }

//     return bestSolution || population[0] || this.createEmptySchedule(divisions);
//   }
// }

// export default class GeneticAlgorithm {
//   constructor(config = {}) {
//     this.config = config;
//     this.populationSize = Math.max(50, Math.min(500, config.populationSize || 150));
//     this.maxGenerations = Math.max(100, Math.min(2000, config.maxGenerations || 800));
//     this.mutationRate = Math.max(0.05, Math.min(0.5, config.mutationRate || 0.15));
//     this.crossoverRate = Math.max(0.5, Math.min(1, config.crossoverRate || 0.8));
//     this.elitismCount = Math.max(1, Math.floor(
//       Math.max(0.05, Math.min(0.3, config.elitismRate || 0.1)) * this.populationSize
//     ));

//     if (!config.departmentId || !config.semester || !config.academicYear) {
//       throw new Error('Missing required configuration: departmentId, semester, or academicYear');
//     }

//     this.departmentId = config.departmentId;
//     this.semester = config.semester;
//     this.academicYear = config.academicYear;
//     this.divisions = Array.isArray(config.divisions) ? config.divisions : [];
//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     this.periodsPerDay = 6;
    
//     this.penalties = {
//       TEACHER_CLASH: -200,
//       ROOM_CLASH: -150,
//       SUBJECT_SAME_DAY: -100,          // Same subject on same day
//       SUBJECT_OVERLOAD_WEEK: -60,      // Same subject too many times per week
//       LAB_NOT_CONSECUTIVE: -120,
//       LAB_WRONG_SLOT: -80,
//       UNWANTED_FREE: -15,
//       PREFERRED_SLOT: 25,
//       FILLED_SLOT: 10,
//       VARIETY_BONUS: 30,               // Bonus for good variety
//       BALANCED_DAY: 20,
//       BALANCED_WEEK: 40                // Bonus for balanced week distribution
//     };
//   }

//   async generateSchedule({ divisions = [], subjects = [], teachers = [], classes = [] } = {}) {
//     try {
//       if (!divisions.length) throw new Error('No divisions provided');
//       if (!subjects.length) throw new Error('No subjects provided');
//       if (!teachers.length) throw new Error('No teachers provided');
//       if (!classes.length) throw new Error('No classrooms provided');

//       const subjectTeacherMap = new Map();
//       const teacherMap = new Map(teachers.map(t => [String(t._id), t]));
      
//       subjects.forEach(subject => {
//         const teacherId = String(subject.teacher_id?._id || subject.teacher_id);
//         if (teacherId && teacherMap.has(teacherId)) {
//           subjectTeacherMap.set(String(subject._id), teacherMap.get(teacherId));
//         }
//       });

//       const assignedTeachers = Array.from(new Set(subjectTeacherMap.values()));
      
//       console.log(`✅ Subject-Teacher Mapping:`, {
//         totalSubjects: subjects.length,
//         subjectsWithTeachers: subjectTeacherMap.size,
//         uniqueTeachersUsed: assignedTeachers.length
//       });

//       if (subjectTeacherMap.size === 0) {
//         throw new Error('No subjects have teachers assigned');
//       }

//       const startTime = Date.now();
//       const schedule = this.run(divisions, subjects, teachers, classes, subjectTeacherMap);
      
//       if (!schedule) {
//         throw new Error('Failed to generate valid schedule');
//       }

//       const validation = this.validateSchedule(schedule, teachers, classes);
      
//       return {
//         schedule,
//         metadata: {
//           fitnessScore: this.fitness(schedule, subjects, teachers, classes),
//           generation_count: this.maxGenerations,
//           population_size: this.populationSize,
//           teachersUsed: assignedTeachers.length,
//           subjectsScheduled: subjects.length,
//           divisionsCreated: divisions.length,
//           conflictsResolved: validation.isValid,
//           conflictDetails: validation.conflicts,
//           algorithm_version: '3.4.0',
//           executionTime: `${(Date.now() - startTime) / 1000} seconds`
//         }
//       };
//     } catch (err) {
//       console.error('Schedule generation error:', err);
//       throw new Error(`Failed to generate schedule: ${err.message}`);
//     }
//   }

//   createEmptySchedule(divisions) {
//     const schedule = {};
//     for (const division of divisions) {
//       schedule[division] = {};
//       for (const day of this.days) {
//         schedule[division][day] = new Array(this.periodsPerDay).fill(null);
//       }
//     }
//     return schedule;
//   }

//   createRandomSchedule(divisions, subjects, teachers, classes, subjectTeacherMap) {
//     const schedule = this.createEmptySchedule(divisions);
    
//     const theorySubs = subjects.filter(s => s.type === 'theory');
//     const practicals = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
//     const tutorials = subjects.filter(s => s.type === 'tutorial');
//     const regularRooms = classes.filter(c => !c.classNumber?.toLowerCase().includes('lab'));
//     const labRooms = classes.filter(c => c.classNumber?.toLowerCase().includes('lab'));

//     const pickRandom = (arr) => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;
//     const getRoom = (type) => {
//       if (type === 'practical' || type === 'lab') {
//         return pickRandom(labRooms) || pickRandom(regularRooms);
//       }
//       return pickRandom(regularRooms);
//     };

//     // Schedule for each division
//     for (const division of divisions) {
//       const weekSubjectCount = new Map(); // Track across entire week
      
//       // ✅ STEP 1: Distribute labs across ALL days (at least 1 lab per day if possible)
//       const shuffledDays = [...this.days].sort(() => Math.random() - 0.5);
//       const labsPerDay = Math.ceil(practicals.length / this.days.length);
      
//       for (let dayIdx = 0; dayIdx < this.days.length && practicals.length > 0; dayIdx++) {
//         const day = shuffledDays[dayIdx];
//         let labsScheduledToday = 0;
        
//         // Try to schedule 1-2 labs per day
//         for (let attempt = 0; attempt < labsPerDay && labsScheduledToday < 2; attempt++) {
//           const availableLabs = practicals.filter(lab => {
//             const weekCount = weekSubjectCount.get(lab._id) || 0;
//             return weekCount < 2 && subjectTeacherMap.has(String(lab._id));
//           });

//           if (availableLabs.length === 0) break;

//           const lab = pickRandom(availableLabs);
//           const teacher = subjectTeacherMap.get(String(lab._id));
//           const room = getRoom(lab.type);

//           // Find valid lab slot (0-1, 2-3, or 4-5)
//           const validSlots = [0, 2, 4];
//           const availableSlot = validSlots.find(p => 
//             !schedule[division][day][p] && !schedule[division][day][p + 1]
//           );

//           if (availableSlot !== undefined) {
//             const slot1 = {
//               period: availableSlot + 1,
//               subject: { 
//                 _id: lab._id, 
//                 subjectName: lab.name || lab.subjectName, 
//                 type: lab.type 
//               },
//               teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//               classroom: room ? { _id: room._id, room_number: room.classNumber } : null,
//               isLab: true
//             };

//             schedule[division][day][availableSlot] = slot1;
//             schedule[division][day][availableSlot + 1] = { ...slot1, period: availableSlot + 2 };
            
//             weekSubjectCount.set(lab._id, (weekSubjectCount.get(lab._id) || 0) + 1);
//             labsScheduledToday++;
//           }
//         }
//       }

//       // ✅ STEP 2: Fill remaining slots with theory and tutorials
//       for (const day of this.days) {
//         const daySubjectCount = new Map(); // Track what's already on this day
        
//         // Count existing subjects on this day
//         for (let p = 0; p < this.periodsPerDay; p++) {
//           const slot = schedule[division][day][p];
//           if (slot?.subject?._id) {
//             daySubjectCount.set(slot.subject._id, (daySubjectCount.get(slot.subject._id) || 0) + 1);
//           }
//         }

//         for (let p = 0; p < this.periodsPerDay; p++) {
//           if (schedule[division][day][p]) continue; // Skip filled slots

//           let scheduled = false;

//           // Try tutorials in last 2 periods
//           if (p >= 4 && tutorials.length > 0) {
//             const availableTutorials = tutorials.filter(tut => {
//               const onDay = daySubjectCount.get(tut._id) || 0;
//               const inWeek = weekSubjectCount.get(tut._id) || 0;
//               return onDay === 0 && inWeek < 3 && subjectTeacherMap.has(String(tut._id));
//             });

//             if (availableTutorials.length > 0) {
//               const tutorial = pickRandom(availableTutorials);
//               const teacher = subjectTeacherMap.get(String(tutorial._id));
//               const room = getRoom(tutorial.type);

//               schedule[division][day][p] = {
//                 period: p + 1,
//                 subject: { 
//                   _id: tutorial._id, 
//                   subjectName: tutorial.name || tutorial.subjectName, 
//                   type: tutorial.type 
//                 },
//                 teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//                 classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//               };

//               daySubjectCount.set(tutorial._id, 1);
//               weekSubjectCount.set(tutorial._id, (weekSubjectCount.get(tutorial._id) || 0) + 1);
//               scheduled = true;
//               continue;
//             }
//           }

//           // Fill with theory - STRICT: Only if NOT already on this day
//           if (theorySubs.length > 0) {
//             const availableTheory = theorySubs.filter(th => {
//               const onDay = daySubjectCount.get(th._id) || 0;
//               const inWeek = weekSubjectCount.get(th._id) || 0;
//               return onDay === 0 && inWeek < 5 && subjectTeacherMap.has(String(th._id));
//             });

//             if (availableTheory.length > 0) {
//               // Prioritize subjects that have been scheduled less this week
//               availableTheory.sort((a, b) => {
//                 const aCount = weekSubjectCount.get(a._id) || 0;
//                 const bCount = weekSubjectCount.get(b._id) || 0;
//                 return aCount - bCount;
//               });

//               const theory = availableTheory[0]; // Pick least scheduled
//               const teacher = subjectTeacherMap.get(String(theory._id));
//               const room = getRoom(theory.type);

//               schedule[division][day][p] = {
//                 period: p + 1,
//                 subject: { 
//                   _id: theory._id, 
//                   subjectName: theory.name || theory.subjectName, 
//                   type: theory.type 
//                 },
//                 teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//                 classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//               };

//               daySubjectCount.set(theory._id, 1);
//               weekSubjectCount.set(theory._id, (weekSubjectCount.get(theory._id) || 0) + 1);
//             }
//           }
//         }
//       }
//     }

//     return schedule;
//   }

//   fitness(schedule, subjects, teachers, classes) {
//     if (!schedule) return -Infinity;
    
//     let score = 0;
//     const globalTeacherSlots = new Map();
//     const globalRoomSlots = new Map();

//     for (const division in schedule) {
//       const weekSubjectCount = new Map();
      
//       for (const day of this.days) {
//         const daySlots = schedule[division][day] || [];
//         const daySubjectCount = new Map();
//         const daySubjects = new Set();

//         for (let i = 0; i < daySlots.length; i++) {
//           const slot = daySlots[i];
          
//           if (!slot) {
//             score += this.penalties.UNWANTED_FREE;
//             continue;
//           }

//           score += this.penalties.FILLED_SLOT;

//           const subjectId = slot.subject?._id;
//           const subjectType = slot.subject?.type;
//           const teacherId = slot.teacher?._id;
//           const roomId = slot.classroom?._id;

//           // Track subjects
//           if (subjectId) {
//             daySubjectCount.set(subjectId, (daySubjectCount.get(subjectId) || 0) + 1);
//             weekSubjectCount.set(subjectId, (weekSubjectCount.get(subjectId) || 0) + 1);
//             daySubjects.add(subjectId);
            
//             // ✅ CRITICAL: Heavy penalty if same subject appears more than once per day
//             if (daySubjectCount.get(subjectId) > 1) {
//               score += this.penalties.SUBJECT_SAME_DAY;
//             }
//           }

//           // Check teacher conflicts
//           if (teacherId) {
//             const teacherKey = `${teacherId}_${day}_${i}`;
//             if (globalTeacherSlots.has(teacherKey)) {
//               score += this.penalties.TEACHER_CLASH;
//             } else {
//               globalTeacherSlots.set(teacherKey, { division, day, period: i });
//             }
//           }

//           // Check room conflicts
//           if (roomId) {
//             const roomKey = `${roomId}_${day}_${i}`;
//             if (globalRoomSlots.has(roomKey)) {
//               score += this.penalties.ROOM_CLASH;
//             } else {
//               globalRoomSlots.set(roomKey, { division, day, period: i });
//             }
//           }

//           // Lab validation
//           if (subjectType === 'practical' || subjectType === 'lab') {
//             const isValidLabStart = (i === 0 || i === 2 || i === 4);
            
//             if (!isValidLabStart) {
//               score += this.penalties.LAB_WRONG_SLOT;
//             }

//             const nextSlot = daySlots[i + 1];
//             const isConsecutive = nextSlot && 
//                                  nextSlot.subject?._id === subjectId &&
//                                  nextSlot.teacher?._id === teacherId;
            
//             if (!isConsecutive) {
//               score += this.penalties.LAB_NOT_CONSECUTIVE;
//             } else {
//               score += this.penalties.PREFERRED_SLOT * 3;
//             }

//             if (i === 0) score += this.penalties.PREFERRED_SLOT * 3;
//             else if (i === 2) score += this.penalties.PREFERRED_SLOT * 2;
//             else if (i === 4) score += this.penalties.PREFERRED_SLOT;
//           }

//           if (subjectType === 'theory' && i >= 0 && i <= 4) {
//             score += this.penalties.PREFERRED_SLOT;
//           }

//           if (subjectType === 'tutorial' && i >= 4) {
//             score += this.penalties.PREFERRED_SLOT * 3;
//           }
//         }

//         // ✅ Bonus for good variety (different subjects each day)
//         if (daySubjects.size >= 5) {
//           score += this.penalties.VARIETY_BONUS;
//         }

//         // Bonus for balanced day
//         const filledSlots = daySlots.filter(s => s !== null).length;
//         if (filledSlots >= 5) {
//           score += this.penalties.BALANCED_DAY;
//         }
//       }

//       // ✅ Bonus for balanced week distribution
//       const subjectCounts = Array.from(weekSubjectCount.values());
//       const avgCount = subjectCounts.reduce((a, b) => a + b, 0) / subjectCounts.length;
//       const variance = subjectCounts.reduce((sum, count) => sum + Math.pow(count - avgCount, 2), 0) / subjectCounts.length;
      
//       if (variance < 2) { // Low variance = good balance
//         score += this.penalties.BALANCED_WEEK;
//       }
//     }

//     return score;
//   }

//   selection(population, fitnessScores) {
//     if (!population?.length || population.length !== fitnessScores?.length) {
//       return population || [];
//     }

//     const minFitness = Math.min(...fitnessScores);
//     const adjustedScores = fitnessScores.map(s => s - minFitness + 1);
//     const totalFitness = adjustedScores.reduce((sum, score) => sum + score, 0);

//     if (totalFitness <= 0) return [...population];

//     const selected = [];
//     for (let i = 0; i < population.length; i++) {
//       let random = Math.random() * totalFitness;
//       let cumulative = 0;

//       for (let j = 0; j < population.length; j++) {
//         cumulative += adjustedScores[j];
//         if (random <= cumulative) {
//           selected.push(JSON.parse(JSON.stringify(population[j])));
//           break;
//         }
//       }
//     }

//     return selected.length ? selected : [...population];
//   }

//   crossover(parent1, parent2) {
//     if (!parent1 || !parent2 || Math.random() > this.crossoverRate) {
//       return parent1 ? JSON.parse(JSON.stringify(parent1)) : {};
//     }

//     const child = {};
//     const divisions = Object.keys(parent1);

//     for (const division of divisions) {
//       child[division] = {};
      
//       for (const day of this.days) {
//         const crossoverPoint = Math.floor(Math.random() * this.periodsPerDay);
//         const parent1Slots = parent1[division]?.[day] || new Array(this.periodsPerDay).fill(null);
//         const parent2Slots = parent2[division]?.[day] || new Array(this.periodsPerDay).fill(null);

//         child[division][day] = [
//           ...parent1Slots.slice(0, crossoverPoint),
//           ...parent2Slots.slice(crossoverPoint)
//         ];
//       }
//     }

//     return child;
//   }

//   mutate(schedule) {
//     if (!schedule || Math.random() > this.mutationRate) {
//       return JSON.parse(JSON.stringify(schedule));
//     }

//     const mutated = JSON.parse(JSON.stringify(schedule));
//     const divisions = Object.keys(mutated);
//     if (!divisions.length) return mutated;

//     const mutationType = Math.random();

//     if (mutationType < 0.7) {
//       // Swap slots from different days to improve variety
//       const division = divisions[Math.floor(Math.random() * divisions.length)];
//       const day1 = this.days[Math.floor(Math.random() * this.days.length)];
//       const day2 = this.days[Math.floor(Math.random() * this.days.length)];
      
//       if (day1 !== day2) {
//         const p1 = Math.floor(Math.random() * this.periodsPerDay);
//         const p2 = Math.floor(Math.random() * this.periodsPerDay);
        
//         const slot1 = mutated[division]?.[day1]?.[p1];
//         const slot2 = mutated[division]?.[day2]?.[p2];
        
//         // Only swap non-lab slots
//         if (slot1 && slot2 && 
//             slot1.subject?.type !== 'lab' && slot1.subject?.type !== 'practical' &&
//             slot2.subject?.type !== 'lab' && slot2.subject?.type !== 'practical') {
//           mutated[division][day1][p1] = slot2;
//           mutated[division][day2][p2] = slot1;
//         }
//       }
//     } else {
//       // Clear a random non-lab slot
//       const division = divisions[Math.floor(Math.random() * divisions.length)];
//       const day = this.days[Math.floor(Math.random() * this.days.length)];
//       const period = Math.floor(Math.random() * this.periodsPerDay);

//       const slot = mutated[division]?.[day]?.[period];
//       if (slot && slot.subject?.type !== 'lab' && slot.subject?.type !== 'practical') {
//         mutated[division][day][period] = null;
//       }
//     }

//     return mutated;
//   }

//   validateSchedule(schedule, teachers, classes) {
//     const conflicts = [];
//     const teacherSlots = new Map();
//     const roomSlots = new Map();

//     for (const division in schedule) {
//       for (const day of this.days) {
//         const daySlots = schedule[division][day] || [];
        
//         for (let i = 0; i < daySlots.length; i++) {
//           const slot = daySlots[i];
//           if (!slot) continue;

//           const teacherId = slot.teacher?._id;
//           const roomId = slot.classroom?._id;

//           if (teacherId) {
//             const key = `${teacherId}_${day}_${i}`;
//             if (teacherSlots.has(key)) {
//               conflicts.push({
//                 type: 'TEACHER_CLASH',
//                 teacher: slot.teacher.name,
//                 divisions: [teacherSlots.get(key).division, division],
//                 day,
//                 period: i + 1
//               });
//             } else {
//               teacherSlots.set(key, { division, day, period: i });
//             }
//           }

//           if (roomId) {
//             const key = `${roomId}_${day}_${i}`;
//             if (roomSlots.has(key)) {
//               conflicts.push({
//                 type: 'ROOM_CLASH',
//                 room: slot.classroom.room_number,
//                 divisions: [roomSlots.get(key).division, division],
//                 day,
//                 period: i + 1
//               });
//             } else {
//               roomSlots.set(key, { division, day, period: i });
//             }
//           }
//         }
//       }
//     }

//     return {
//       isValid: conflicts.length === 0,
//       conflicts
//     };
//   }

//   run(divisions, subjects, teachers, classes, subjectTeacherMap) {
//     if (!divisions?.length || !subjects?.length || !teachers?.length || !classes?.length) {
//       return this.createEmptySchedule(divisions || []);
//     }

//     let population = [];
//     for (let i = 0; i < this.populationSize; i++) {
//       population.push(this.createRandomSchedule(divisions, subjects, teachers, classes, subjectTeacherMap));
//     }

//     let bestSolution = null;
//     let bestFitness = -Infinity;
//     let stagnationCount = 0;
//     const maxStagnation = 150;

//     for (let gen = 0; gen < this.maxGenerations; gen++) {
//       const fitnessScores = population.map(s => this.fitness(s, subjects, teachers, classes));
//       const currentBest = Math.max(...fitnessScores);
      
//       if (currentBest > bestFitness) {
//         bestFitness = currentBest;
//         bestSolution = JSON.parse(JSON.stringify(population[fitnessScores.indexOf(currentBest)]));
//         stagnationCount = 0;
//       } else {
//         stagnationCount++;
//       }

//       if (bestFitness >= 1200 || stagnationCount >= maxStagnation) {
//         console.log(`✅ Terminated at generation ${gen}, fitness: ${bestFitness}`);
//         break;
//       }

//       const selected = this.selection(population, fitnessScores);
//       const newPopulation = [];

//       const eliteIndices = fitnessScores
//         .map((score, idx) => ({ score, idx }))
//         .sort((a, b) => b.score - a.score)
//         .slice(0, this.elitismCount)
//         .map(item => item.idx);

//       for (const idx of eliteIndices) {
//         newPopulation.push(JSON.parse(JSON.stringify(population[idx])));
//       }

//       while (newPopulation.length < this.populationSize) {
//         const p1 = selected[Math.floor(Math.random() * selected.length)];
//         const p2 = selected[Math.floor(Math.random() * selected.length)];
//         const child = this.crossover(p1, p2);
//         newPopulation.push(this.mutate(child));
//       }

//       population = newPopulation;
//     }

//     return bestSolution || population[0] || this.createEmptySchedule(divisions);
//   }
// }

export default class GeneticAlgorithm {
  constructor(config = {}) {
    this.config = config;
    this.populationSize = Math.max(50, Math.min(500, config.populationSize || 150));
    this.maxGenerations = Math.max(100, Math.min(2000, config.maxGenerations || 800));
    this.mutationRate = Math.max(0.05, Math.min(0.5, config.mutationRate || 0.15));
    this.crossoverRate = Math.max(0.5, Math.min(1, config.crossoverRate || 0.8));
    this.elitismCount = Math.max(1, Math.floor(
      Math.max(0.05, Math.min(0.3, config.elitismRate || 0.1)) * this.populationSize
    ));

    if (!config.departmentId || !config.semester || !config.academicYear) {
      throw new Error('Missing required configuration: departmentId, semester, or academicYear');
    }

    this.departmentId = config.departmentId;
    this.semester = config.semester;
    this.academicYear = config.academicYear;
    this.divisions = Array.isArray(config.divisions) ? config.divisions : [];
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    this.periodsPerDay = 6;
    
    this.penalties = {
      TEACHER_CLASH: -100,
      ROOM_CLASH: -80,
      SUBJECT_OVERLOAD: -30,
      LAB_NOT_CONSECUTIVE: -60,
      LAB_WRONG_SLOT: -40,
      UNWANTED_FREE: -10,
      PREFERRED_SLOT: 15,
      FILLED_SLOT: 5,
      BALANCED_DISTRIBUTION: 20
    };
  }

  async generateSchedule({ divisions = [], subjects = [], teachers = [], classes = [] } = {}) {
    try {
      // Enhanced validation
      if (!divisions.length) throw new Error('No divisions provided');
      if (!subjects.length) throw new Error('No subjects provided');
      if (!teachers.length) throw new Error('No teachers provided');
      if (!classes.length) throw new Error('No classrooms provided');

      // 🔧 CRITICAL FIX: Build subject-teacher mapping from subject.teacher_id
      const subjectTeacherMap = new Map();
      const teacherMap = new Map(teachers.map(t => [String(t._id), t]));
      
      subjects.forEach(subject => {
        const teacherId = String(subject.teacher_id?._id || subject.teacher_id);
        if (teacherId && teacherMap.has(teacherId)) {
          subjectTeacherMap.set(String(subject._id), teacherMap.get(teacherId));
        } else {
          console.warn(`⚠️ Subject "${subject.name || subject.subjectName}" has no valid teacher assigned`);
        }
      });

      const assignedTeachers = Array.from(new Set(subjectTeacherMap.values()));
      
      console.log(`✅ Subject-Teacher Mapping:`, {
        totalSubjects: subjects.length,
        subjectsWithTeachers: subjectTeacherMap.size,
        uniqueTeachersUsed: assignedTeachers.length
      });

      if (subjectTeacherMap.size === 0) {
        throw new Error('No subjects have teachers assigned. Please assign teachers to subjects in the database.');
      }

      const startTime = Date.now();
      const schedule = this.run(divisions, subjects, teachers, classes, subjectTeacherMap);
      
      if (!schedule) {
        throw new Error('Failed to generate valid schedule');
      }

      // Validate final schedule
      const validation = this.validateSchedule(schedule, teachers, classes);
      
      return {
        schedule,
        metadata: {
          fitnessScore: this.fitness(schedule, subjects, teachers, classes),
          generation_count: this.maxGenerations,
          population_size: this.populationSize,
          teachersUsed: assignedTeachers.length,
          subjectsScheduled: subjects.length,
          divisionsCreated: divisions.length,
          conflictsResolved: validation.isValid,
          conflictDetails: validation.conflicts,
          algorithm_version: '3.2.0',
          executionTime: `${(Date.now() - startTime) / 1000} seconds`
        }
      };
    } catch (err) {
      console.error('Schedule generation error:', err);
      throw new Error(`Failed to generate schedule: ${err.message}`);
    }
  }

  createEmptySchedule(divisions) {
    const schedule = {};
    for (const division of divisions) {
      schedule[division] = {};
      for (const day of this.days) {
        schedule[division][day] = new Array(this.periodsPerDay).fill(null);
      }
    }
    return schedule;
  }

  isSameAsPrevious(daySchedule, p, subjectId) {
  if (p === 0) return false;
  return daySchedule[p - 1]?.subject?._id === subjectId;
}


  createRandomSchedule(divisions, subjects, teachers, classes, subjectTeacherMap) {
    const schedule = this.createEmptySchedule(divisions);
    
    // Categorize resources
    const theorySubs = subjects.filter(s => s.type === 'theory');
    const practicals = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
    const tutorials = subjects.filter(s => s.type === 'tutorial');
    const regularRooms = classes.filter(c => !c.classNumber?.toLowerCase().includes('lab'));
    const labRooms = classes.filter(c => c.classNumber?.toLowerCase().includes('lab'));

    const pickRandom = (arr) => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;
    const getRoom = (type) => {
      if (type === 'practical' || type === 'lab') {
        return pickRandom(labRooms) || pickRandom(regularRooms);
      }
      return pickRandom(regularRooms);
    };

    // Schedule for each division
    for (const division of divisions) {
      const divisionSubjectCount = new Map();
      
      for (const day of this.days) {
        const daySubjectCount = new Map();
        let p = 0;

        while (p < this.periodsPerDay) {
          let scheduled = false;

          // Priority 1: Schedule labs in valid slots (0-1, 2-3, 4-5)
          // =======================
// HARD LAB PLACEMENT
// =======================
if (p % 2 === 0 && p + 1 < this.periodsPerDay) {
  const availableLabs = practicals.filter(lab => {
    const dayCount = daySubjectCount.get(lab._id) || 0;
    const totalCount = divisionSubjectCount.get(lab._id) || 0;
    return (
      dayCount === 0 &&
      totalCount < 3 &&
      subjectTeacherMap.has(String(lab._id))
    );
  });

  if (availableLabs.length > 0) {
    const lab = pickRandom(availableLabs);
    const teacher = subjectTeacherMap.get(String(lab._id));
    const room = getRoom(lab.type);

    // ❗ SAFETY: if teacher or room missing → skip lab
    if (!teacher || !room) {
      p++;
      continue;
    }

    const slot1 = {
      period: p + 1,
      subject: { _id: lab._id, subjectName: lab.name, type: lab.type },
      teacher: { _id: teacher._id, name: teacher.name },
      classroom: { _id: room._id, room_number: room.classNumber }
    };

    const slot2 = { ...slot1, period: p + 2 };

    schedule[division][day][p] = slot1;
    schedule[division][day][p + 1] = slot2;

    daySubjectCount.set(lab._id, 1);
    divisionSubjectCount.set(lab._id, (divisionSubjectCount.get(lab._id) || 0) + 1);

    p += 2;     // 🔥 skip next period
    continue;
  }
}


          // Priority 2: Schedule tutorials in last slots (period 5 or 6)
          if (p >= 4 && tutorials.length > 0) {
            const availableTutorials = tutorials.filter(tut => {
              const dayCount = daySubjectCount.get(tut._id) || 0;
              const totalCount = divisionSubjectCount.get(tut._id) || 0;
              return dayCount < 1 && totalCount < 3 && subjectTeacherMap.has(String(tut._id));
            });

            if (availableTutorials.length > 0) {
              const tutorial = pickRandom(availableTutorials);
              const teacher = subjectTeacherMap.get(String(tutorial._id));
              const room = getRoom(tutorial.type);

              schedule[division][day][p] = {
                period: p + 1,
                subject: { 
                  _id: tutorial._id, 
                  subjectName: tutorial.name || tutorial.subjectName, 
                  type: tutorial.type 
                },
                teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
                classroom: room ? { _id: room._id, room_number: room.classNumber } : null
              };

              daySubjectCount.set(tutorial._id, (daySubjectCount.get(tutorial._id) || 0) + 1);
              divisionSubjectCount.set(tutorial._id, (divisionSubjectCount.get(tutorial._id) || 0) + 1);
              
              p++;
              scheduled = true;
              continue;
            }
          }

         
          // Priority 3: Fill with theory subjects
if (theorySubs.length > 0) {
  const availableTheory = theorySubs.filter(th => {
    const dayCount = daySubjectCount.get(th._id) || 0;
    const totalCount = divisionSubjectCount.get(th._id) || 0;

    // must have teacher
    if (!subjectTeacherMap.has(String(th._id))) return false;

    // weekly + daily limits
    if (dayCount >= 2 || totalCount >= 5) return false;

    // ❗STOP same subject in consecutive periods
    if (this.isSameAsPrevious(schedule[division][day], p, th._id)) return false;

    return true;
  });

  if (availableTheory.length > 0) {
    const theory = pickRandom(availableTheory);
    const teacher = subjectTeacherMap.get(String(theory._id));
    const room = getRoom(theory.type);

    schedule[division][day][p] = {
      period: p + 1,
      subject: { 
        _id: theory._id, 
        subjectName: theory.name || theory.subjectName, 
        type: theory.type 
      },
      teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
      classroom: room ? { _id: room._id, room_number: room.classNumber } : null
    };

    daySubjectCount.set(theory._id, (daySubjectCount.get(theory._id) || 0) + 1);
    divisionSubjectCount.set(theory._id, (divisionSubjectCount.get(theory._id) || 0) + 1);
    
    scheduled = true;
  }
}


          p++;
        }
      }
    }

    return schedule;
  }

  fitness(schedule, subjects, teachers, classes) {
    if (!schedule) return -Infinity;
    
    let score = 0;
    const globalTeacherSlots = new Map();
    const globalRoomSlots = new Map();

    for (const division in schedule) {
      for (const day of this.days) {
        const daySlots = schedule[division][day] || [];
        const subjectDayCount = new Map();

        for (let i = 0; i < daySlots.length; i++) {
          const slot = daySlots[i];
          
          if (!slot) {
            score += this.penalties.UNWANTED_FREE;
            continue;
          }

          score += this.penalties.FILLED_SLOT;

          const subjectId = slot.subject?._id;
          const subjectType = slot.subject?.type;
          const teacherId = slot.teacher?._id;
          const roomId = slot.classroom?._id;

          if (subjectId) {
            subjectDayCount.set(subjectId, (subjectDayCount.get(subjectId) || 0) + 1);
            if (subjectDayCount.get(subjectId) > 2) {
              score += this.penalties.SUBJECT_OVERLOAD;
            }
          }

          // CRITICAL: Check teacher conflicts across ALL divisions
          if (teacherId) {
            const teacherKey = `${teacherId}_${day}_${i}`;
            if (globalTeacherSlots.has(teacherKey)) {
              score += this.penalties.TEACHER_CLASH;
            } else {
              globalTeacherSlots.set(teacherKey, { division, day, period: i });
            }
          }

          // CRITICAL: Check room conflicts across ALL divisions
          if (roomId) {
            const roomKey = `${roomId}_${day}_${i}`;
            if (globalRoomSlots.has(roomKey)) {
              score += this.penalties.ROOM_CLASH;
            } else {
              globalRoomSlots.set(roomKey, { division, day, period: i });
            }
          }

          // Lab validation
          if (subjectType === 'practical' || subjectType === 'lab') {
            const isValidLabStart = (i === 0 || i === 2 || i === 4);
            
            if (!isValidLabStart) {
              score += this.penalties.LAB_WRONG_SLOT;
            }

            const nextSlot = daySlots[i + 1];
            const isConsecutive = nextSlot && 
                                 nextSlot.subject?._id === subjectId &&
                                 nextSlot.teacher?._id === teacherId;
            
            if (!isConsecutive) {
              score += this.penalties.LAB_NOT_CONSECUTIVE;
            } else {
              score += this.penalties.PREFERRED_SLOT * 2;
            }

            if (i === 0) score += this.penalties.PREFERRED_SLOT * 3;
            else if (i === 2) score += this.penalties.PREFERRED_SLOT * 2;
            else if (i === 4) score += this.penalties.PREFERRED_SLOT;
          }

          if (subjectType === 'theory' && i >= 1 && i <= 4) {
            score += this.penalties.PREFERRED_SLOT;
          }

          if (subjectType === 'tutorial' && i >= 4) {
            score += this.penalties.PREFERRED_SLOT * 3;
          }
        }

        const filledSlots = daySlots.filter(s => s !== null).length;
        if (filledSlots >= 5) {
          score += this.penalties.BALANCED_DISTRIBUTION;
        }
      }
    }

    return score;
  }

  selection(population, fitnessScores) {
    if (!population?.length || population.length !== fitnessScores?.length) {
      return population || [];
    }

    const minFitness = Math.min(...fitnessScores);
    const adjustedScores = fitnessScores.map(s => s - minFitness + 1);
    const totalFitness = adjustedScores.reduce((sum, score) => sum + score, 0);

    if (totalFitness <= 0) return [...population];

    const selected = [];
    for (let i = 0; i < population.length; i++) {
      let random = Math.random() * totalFitness;
      let cumulative = 0;

      for (let j = 0; j < population.length; j++) {
        cumulative += adjustedScores[j];
        if (random <= cumulative) {
          selected.push(JSON.parse(JSON.stringify(population[j])));
          break;
        }
      }
    }

    return selected.length ? selected : [...population];
  }

  crossover(parent1, parent2) {
    if (!parent1 || !parent2 || Math.random() > this.crossoverRate) {
      return parent1 ? JSON.parse(JSON.stringify(parent1)) : {};
    }

    const child = {};
    const divisions = Object.keys(parent1);

    for (const division of divisions) {
      child[division] = {};
      
      for (const day of this.days) {
        const crossoverPoint = Math.floor(Math.random() * this.periodsPerDay);
        const parent1Slots = parent1[division]?.[day] || new Array(this.periodsPerDay).fill(null);
        const parent2Slots = parent2[division]?.[day] || new Array(this.periodsPerDay).fill(null);

        child[division][day] = [
          ...parent1Slots.slice(0, crossoverPoint),
          ...parent2Slots.slice(crossoverPoint)
        ];
      }
    }

    return child;
  }

  mutate(schedule) {
    if (!schedule || Math.random() > this.mutationRate) {
      return JSON.parse(JSON.stringify(schedule));
    }

    const mutated = JSON.parse(JSON.stringify(schedule));
    const divisions = Object.keys(mutated);
    if (!divisions.length) return mutated;

    const mutationType = Math.random();

    if (mutationType < 0.5) {
      const division = divisions[Math.floor(Math.random() * divisions.length)];
      const day = this.days[Math.floor(Math.random() * this.days.length)];
      const p1 = Math.floor(Math.random() * this.periodsPerDay);
      const p2 = Math.floor(Math.random() * this.periodsPerDay);

      if (mutated[division]?.[day]) {
        const temp = mutated[division][day][p1];
        mutated[division][day][p1] = mutated[division][day][p2];
        mutated[division][day][p2] = temp;
      }
    } else {
      const division = divisions[Math.floor(Math.random() * divisions.length)];
      const day = this.days[Math.floor(Math.random() * this.days.length)];
      const period = Math.floor(Math.random() * this.periodsPerDay);

      if (mutated[division]?.[day]) {
        mutated[division][day][period] = null;
      }
    }

    return mutated;
  }

  validateSchedule(schedule, teachers, classes) {
    const conflicts = [];
    const teacherSlots = new Map();
    const roomSlots = new Map();

    for (const division in schedule) {
      for (const day of this.days) {
        const daySlots = schedule[division][day] || [];
        
        for (let i = 0; i < daySlots.length; i++) {
          const slot = daySlots[i];
          if (!slot) continue;

          const teacherId = slot.teacher?._id;
          const roomId = slot.classroom?._id;

          if (teacherId) {
            const key = `${teacherId}_${day}_${i}`;
            if (teacherSlots.has(key)) {
              conflicts.push({
                type: 'TEACHER_CLASH',
                teacher: slot.teacher.name,
                divisions: [teacherSlots.get(key).division, division],
                day,
                period: i + 1
              });
            } else {
              teacherSlots.set(key, { division, day, period: i });
            }
          }

          if (roomId) {
            const key = `${roomId}_${day}_${i}`;
            if (roomSlots.has(key)) {
              conflicts.push({
                type: 'ROOM_CLASH',
                room: slot.classroom.room_number,
                divisions: [roomSlots.get(key).division, division],
                day,
                period: i + 1
              });
            } else {
              roomSlots.set(key, { division, day, period: i });
            }
          }
        }
      }
    }

    return {
      isValid: conflicts.length === 0,
      conflicts
    };
  }

  run(divisions, subjects, teachers, classes, subjectTeacherMap) {
    if (!divisions?.length || !subjects?.length || !teachers?.length || !classes?.length) {
      return this.createEmptySchedule(divisions || []);
    }

    let population = [];
    for (let i = 0; i < this.populationSize; i++) {
      population.push(this.createRandomSchedule(divisions, subjects, teachers, classes, subjectTeacherMap));
    }

    let bestSolution = null;
    let bestFitness = -Infinity;
    let stagnationCount = 0;
    const maxStagnation = 100;

    for (let gen = 0; gen < this.maxGenerations; gen++) {
      const fitnessScores = population.map(s => this.fitness(s, subjects, teachers, classes));
      const currentBest = Math.max(...fitnessScores);
      
      if (currentBest > bestFitness) {
        bestFitness = currentBest;
        bestSolution = JSON.parse(JSON.stringify(population[fitnessScores.indexOf(currentBest)]));
        stagnationCount = 0;
      } else {
        stagnationCount++;
      }

      if (bestFitness >= 800 || stagnationCount >= maxStagnation) {
        console.log(`✅ Terminated at generation ${gen}, fitness: ${bestFitness}`);
        break;
      }

      const selected = this.selection(population, fitnessScores);
      const newPopulation = [];

      const eliteIndices = fitnessScores
        .map((score, idx) => ({ score, idx }))
        .sort((a, b) => b.score - a.score)
        .slice(0, this.elitismCount)
        .map(item => item.idx);

      for (const idx of eliteIndices) {
        newPopulation.push(JSON.parse(JSON.stringify(population[idx])));
      }

      while (newPopulation.length < this.populationSize) {
        const p1 = selected[Math.floor(Math.random() * selected.length)];
        const p2 = selected[Math.floor(Math.random() * selected.length)];
        const child = this.crossover(p1, p2);
        newPopulation.push(this.mutate(child));
      }

      population = newPopulation;
    }

    return bestSolution || population[0] || this.createEmptySchedule(divisions);
  }
}