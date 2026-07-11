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
      // ── Hard constraints (catastrophic — must never happen) ───────────────
      TEACHER_CLASH:     -15000,
      ROOM_CLASH:        -15000,
      UNAVAILABLE_SLOT:  -10000,

      // ── Soft constraint penalties ─────────────────────────────────────────
      TEACHER_OVERLOAD:       -1000,
      CAPACITY_CLASH:         -1000,
      WORKLOAD_DEVIATION:     -800,  // per missing/extra period vs target
      SUBJECT_OVERLOAD:       -60,   // >2 occurrences of same subject per day
      LAB_NOT_CONSECUTIVE:    -200,
      LAB_WRONG_SLOT:         -80,
      UNWANTED_FREE:          -20,   // internal gap between lectures

      // ── Phase 2: Distribution & Spacing penalties ─────────────────────────
      SUBJECT_CONSEC_DAY:     -150,  // same subject on back-to-back days
      TEACHER_CONSEC_LECTURE: -25,   // each consecutive lecture beyond 2 in a row
      TEACHER_IDLE_GAP:       -30,   // gap (null) between teacher's lectures same day
      LAB_SAME_WEEK_CLUSTER:  -80,   // lab scheduled on adjacent days same week
      ROOM_INCONSISTENCY:     -5,    // different room for same subject across days

      // ── Reward bonuses ────────────────────────────────────────────────────
      PREFERRED_SLOT:             15,
      FILLED_SLOT:                 5,
      BALANCED_DISTRIBUTION:      20,
      VARIETY_BONUS:              25,  // ≥4 distinct subjects per day
      LAB_PAIR_REWARD:            60,  // correctly placed consecutive lab pair
      TEACHER_UTILISATION_REWARD:  3,  // per period actively teaching
      ROOM_UTILISATION_REWARD:     2,  // unique room-period used without clash
      WORKLOAD_MATCH_BONUS:       80,  // exact weekly target hit per subject
      TEACHER_LOAD_BALANCE_BONUS: 30,  // teacher load 60–100% of weekly limit

      // ── Phase 2: Distribution & Spacing rewards ───────────────────────────
      SUBJECT_SPREAD_BONUS:       40,  // subject well-spread across week (no cluster)
      TEACHER_COMPACT_BONUS:      20,  // teacher's lectures are compact (no idle gaps)
      ROOM_CONSISTENT_BONUS:       8,  // same room used for same subject across days
      LAB_SPREAD_BONUS:           35,  // lab days are non-adjacent in the week
      DIVISION_FAIRNESS_BONUS:    50   // all divisions have similar schedule density
    };
  }

  getLecturePerWeek(sub) {
    const val = sub.lecturePerWeek || sub.lecturesPerWeek;
    if (!val) {
      return sub.type === 'practical' || sub.type === 'lab' ? 2 : 3;
    }
    const parsed = parseInt(val);
    return isNaN(parsed) ? (sub.type === 'practical' || sub.type === 'lab' ? 2 : 3) : parsed;
  }

  getTeacherWorkload(schedule) {
    const weekly = new Map();
    const daily = new Map();
    
    for (const division in schedule) {
      for (const day of this.days) {
        const daySlots = schedule[division][day] || [];
        for (const slot of daySlots) {
          if (slot && slot.teacher?._id) {
            const tId = String(slot.teacher._id);
            weekly.set(tId, (weekly.get(tId) || 0) + 1);
            
            const key = `${tId}_${day}`;
            daily.set(key, (daily.get(key) || 0) + 1);
          }
        }
      }
    }
    return { weekly, daily };
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
      
      const qualityMetrics = this.computeQualityMetrics(schedule, subjects, teachers, classes);

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
          // ── Quality Metrics ──────────────────────────────────────────────
          teacherUtilization:   qualityMetrics.teacherUtilization,
          classroomUtilization: qualityMetrics.classroomUtilization,
          labUtilization:       qualityMetrics.labUtilization,
          slotUtilization:      qualityMetrics.slotUtilization,
          hardClashes:          qualityMetrics.hardClashes,
          qualityScore:         qualityMetrics.qualityScore,
          algorithm_version: '3.3.0',
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

    // Global tracking to avoid immediate clashes across divisions during init
    const initTeacherSlots = new Map();  // `teacherId_day_period` -> true
    const initRoomSlots = new Map();      // `roomId_day_period` -> true

    const pickRandom = (arr) => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;

    const getRoom = (type, day, period) => {
      const pool = (type === 'practical' || type === 'lab')
        ? [...(labRooms.length ? labRooms : regularRooms)]
        : [...regularRooms];
      // Shuffle and pick first non-clashing room
      pool.sort(() => Math.random() - 0.5);
      for (const room of pool) {
        const key = `${room._id}_${day}_${period}`;
        if (!initRoomSlots.has(key)) return room;
      }
      return pool[0] || null; // fallback
    };

    const getTeacher = (subjectId, day, period) => {
      const teacher = subjectTeacherMap.get(String(subjectId));
      if (!teacher) return null;
      const key = `${teacher._id}_${day}_${period}`;
      // If this teacher is already used at this slot, skip
      if (initTeacherSlots.has(key)) return null;
      return teacher;
    };

    // Schedule for each division
    for (const division of divisions) {
      const divisionSubjectCount = new Map();

      for (const day of this.days) {
        const daySubjectCount = new Map();
        let p = 0;

        while (p < this.periodsPerDay) {

          // ── Priority 1: Labs in even-start slots (0-1, 2-3, 4-5) ──────────
          if (p % 2 === 0 && p + 1 < this.periodsPerDay) {
            // Shuffle for variety
            const shuffledLabs = [...practicals].sort(() => Math.random() - 0.5);
            let labScheduled = false;

            for (const lab of shuffledLabs) {
              const sId = String(lab._id);
              const dayCount  = daySubjectCount.get(sId) || 0;
              const totalCount = divisionSubjectCount.get(sId) || 0;
              const target    = this.getLecturePerWeek(lab);
              // NOTE: `target` from getLecturePerWeek() is expressed in LAB
              // SESSIONS per week (e.g. 2 sessions), while `totalCount` /
              // `dayCount` accumulate in PERIODS (each lab session adds 2,
              // since a lab occupies 2 consecutive periods). Comparing
              // `totalCount + 2 > target` mixed periods against sessions, so
              // with the common default target of 2 (sessions), scheduling
              // stopped after a single session (2 periods >= 2), chronically
              // under-allocating labs to 1 pair instead of the intended
              // number of sessions. Multiplying target by 2 converts it to
              // the same periods unit that totalCount uses.
              const targetPeriods = target * 2;

              if (dayCount > 0 || totalCount + 2 > targetPeriods) continue;

              const teacher = getTeacher(lab._id, day, p);
              const room    = getRoom(lab.type, day, p);

              if (!teacher || !room) continue;

              // Also check second period for clashes
              const tKey2 = `${teacher._id}_${day}_${p + 1}`;
              const rKey2 = `${room._id}_${day}_${p + 1}`;
              if (initTeacherSlots.has(tKey2) || initRoomSlots.has(rKey2)) continue;

              const slot1 = {
                period: p + 1,
                subject: { _id: lab._id, subjectName: lab.name || lab.subjectName, type: lab.type },
                teacher: { _id: teacher._id, name: teacher.name },
                classroom: { _id: room._id, room_number: room.classNumber }
              };
              const slot2 = { ...slot1, period: p + 2 };

              schedule[division][day][p]     = slot1;
              schedule[division][day][p + 1] = slot2;

              // Register both periods globally
              initTeacherSlots.set(`${teacher._id}_${day}_${p}`, true);
              initTeacherSlots.set(`${teacher._id}_${day}_${p + 1}`, true);
              initRoomSlots.set(`${room._id}_${day}_${p}`, true);
              initRoomSlots.set(`${room._id}_${day}_${p + 1}`, true);

              daySubjectCount.set(sId, (daySubjectCount.get(sId) || 0) + 1);
              divisionSubjectCount.set(sId, totalCount + 2);

              p += 2;
              labScheduled = true;
              break;
            }
            if (labScheduled) continue;
          }

          // ── Priority 2: Tutorials in last 2 slots ────────────────────────
          if (p >= 4 && tutorials.length > 0) {
            const shuffledTuts = [...tutorials].sort(() => Math.random() - 0.5);
            let tutScheduled = false;

            for (const tut of shuffledTuts) {
              const sId = String(tut._id);
              const dayCount   = daySubjectCount.get(sId) || 0;
              const totalCount = divisionSubjectCount.get(sId) || 0;
              const target     = this.getLecturePerWeek(tut);

              if (dayCount >= 1 || totalCount >= target) continue;

              const teacher = getTeacher(tut._id, day, p);
              const room    = getRoom(tut.type, day, p);
              if (!teacher || !room) continue;

              schedule[division][day][p] = {
                period: p + 1,
                subject: { _id: tut._id, subjectName: tut.name || tut.subjectName, type: tut.type },
                teacher: { _id: teacher._id, name: teacher.name },
                classroom: { _id: room._id, room_number: room.classNumber }
              };

              initTeacherSlots.set(`${teacher._id}_${day}_${p}`, true);
              initRoomSlots.set(`${room._id}_${day}_${p}`, true);
              daySubjectCount.set(sId, (daySubjectCount.get(sId) || 0) + 1);
              divisionSubjectCount.set(sId, totalCount + 1);

              p++;
              tutScheduled = true;
              break;
            }
            if (tutScheduled) continue;
          }

          // ── Priority 3: Theory subjects ───────────────────────────────────
          if (theorySubs.length > 0) {
            // Sort by least scheduled this week (fills gaps more evenly)
            const candidates = theorySubs
              .filter(th => {
                const sId = String(th._id);
                const dayCount   = daySubjectCount.get(sId) || 0;
                const totalCount = divisionSubjectCount.get(sId) || 0;
                const target     = this.getLecturePerWeek(th);
                if (!subjectTeacherMap.has(sId)) return false;
                if (dayCount >= 2 || totalCount >= target) return false;
                if (this.isSameAsPrevious(schedule[division][day], p, th._id)) return false;
                return true;
              })
              .sort((a, b) => {
                const aC = divisionSubjectCount.get(String(a._id)) || 0;
                const bC = divisionSubjectCount.get(String(b._id)) || 0;
                return aC - bC; // prefer least scheduled
              });

            let theoryScheduled = false;
            for (const theory of candidates) {
              const sId    = String(theory._id);
              const teacher = getTeacher(theory._id, day, p);
              const room    = getRoom(theory.type, day, p);
              if (!teacher || !room) continue;

              schedule[division][day][p] = {
                period: p + 1,
                subject: { _id: theory._id, subjectName: theory.name || theory.subjectName, type: theory.type },
                teacher: { _id: teacher._id, name: teacher.name },
                classroom: { _id: room._id, room_number: room.classNumber }
              };

              initTeacherSlots.set(`${teacher._id}_${day}_${p}`, true);
              initRoomSlots.set(`${room._id}_${day}_${p}`, true);
              daySubjectCount.set(sId, (daySubjectCount.get(sId) || 0) + 1);
              divisionSubjectCount.set(sId, (divisionSubjectCount.get(sId) || 0) + 1);

              p++;
              theoryScheduled = true;
              break;
            }
            if (theoryScheduled) continue;
          }

          p++;
        }
      }
    }

    return schedule;
  }

 fitness(schedule, subjects, teachers, classes) {
    if (!schedule) return -1000; // sentinel for a missing/invalid schedule

    const teacherSlots = new Map();
    const roomSlots = new Map();
    const teacherLoad = new Map(); // soft teacher-workload check

    let totalSlots = 0;
    let filledSlots = 0;
    let teacherClashCount = 0;
    let roomClashCount = 0;
    let dayOverloadCount = 0;
    let tutorialWrongSlotCount = 0;
    let labIssueCount = 0;
    let labBonusCount = 0;
    let preferredSlotHits = 0;

    let weeklyTargetSubjects = 0;
    let weeklyTargetHits = 0;
    let weeklyTargetDeviation = 0;

    const subjectList = subjects || [];

    for (const division in schedule) {
      const weeklySubjectCount = new Map();

      for (const day of this.days) {
        const daySlots = schedule[division][day] || [];
        const subjectDayCount = new Map();

        for (let i = 0; i < daySlots.length; i++) {
          totalSlots++;
          const slot = daySlots[i];
          if (!slot) continue;

          filledSlots++;

          const subjectId = slot.subject?._id;
          if (subjectId) {
            subjectDayCount.set(subjectId, (subjectDayCount.get(subjectId) || 0) + 1);
            weeklySubjectCount.set(subjectId, (weeklySubjectCount.get(subjectId) || 0) + 1);

            // Daily limit: more than one session of the same subject on the
            // same day is a soft violation, not a hard conflict.
            if (subjectDayCount.get(subjectId) > 1) dayOverloadCount++;
          }

          // Teacher clashes (hard conflict — same teacher, same day/period)
          const teacherId = slot.teacher?._id;
          if (teacherId) {
            const teacherKey = `${teacherId}_${day}_${i}`;
            if (teacherSlots.has(teacherKey)) teacherClashCount++;
            else teacherSlots.set(teacherKey, true);
            teacherLoad.set(teacherId, (teacherLoad.get(teacherId) || 0) + 1);
          }

          // Room clashes (hard conflict — same room, same day/period)
          const roomId = slot.classroom?._id;
          if (roomId) {
            const roomKey = `${roomId}_${day}_${i}`;
            if (roomSlots.has(roomKey)) roomClashCount++;
            else roomSlots.set(roomKey, true);
          }

          // Slot placement preferences.
          const subjectType = slot.subject?.type;
          if (subjectType === 'practical' || subjectType === 'lab') {
            const prevSlot = i > 0 ? daySlots[i - 1] : null;
            const isPairStart = !(prevSlot && prevSlot.subject?._id === subjectId);
            if (isPairStart) {
              const nextSlot = daySlots[i + 1];
              if (nextSlot && nextSlot.subject?._id === subjectId) {
                labBonusCount++;
                if (i === 0 || i === 2 || i === 4) preferredSlotHits++;
              } else {
                labIssueCount++;
              }
            }
          } else if (subjectType === 'theory') {
            if (i <= 3) preferredSlotHits++;
          } else if (subjectType === 'tutorial') {
            if (i >= 4) preferredSlotHits++;
            else tutorialWrongSlotCount++;
          }
        }
      }

      // Weekly target check — uses this.getLecturePerWeek(), the exact same
      // function createRandomSchedule() uses to decide how many sessions to
      // place. Previously this block recomputed targets independently
      // (hardcoding labs to 3 sessions, capping tutorials at 2), which
      // disagreed with what createRandomSchedule() actually generates and
      // penalized valid schedules for "missing" sessions that were never
      // supposed to exist.
      for (const subject of subjectList) {
        const actualCount = weeklySubjectCount.get(subject._id) || 0;
        const sessions = this.getLecturePerWeek(subject);
        // Labs occupy 2 consecutive slots per session; theory/tutorial
        // targets are measured directly in slots-per-week.
        const targetSlots = (subject.type === 'practical' || subject.type === 'lab')
          ? sessions * 2
          : sessions;

        weeklyTargetSubjects++;
        if (actualCount === targetSlots) weeklyTargetHits++;
        else weeklyTargetDeviation += Math.abs(actualCount - targetSlots);
      }
    }

    // Soft teacher-workload balance: penalize large spread in how many
    // periods each teacher carries relative to the department average.
    let workloadImbalance = 0;
    if (teacherLoad.size > 1) {
      const loads = [...teacherLoad.values()];
      const avg = loads.reduce((a, b) => a + b, 0) / loads.length;
      workloadImbalance = loads.reduce((sum, l) => sum + Math.abs(l - avg), 0) / loads.length;
    }

    // ---- Normalize into a bounded score ----
    const fillRatio = totalSlots > 0 ? filledSlots / totalSlots : 0;
    const weeklyTargetRatio = weeklyTargetSubjects > 0 ? weeklyTargetHits / weeklyTargetSubjects : 1;
    const preferredRatio = filledSlots > 0 ? preferredSlotHits / filledSlots : 0;

    let score = 0;
    score += fillRatio * 45;
    score += weeklyTargetRatio * 35;
    score += preferredRatio * 10;
    score += labBonusCount * 1.5;

    score -= dayOverloadCount * 3;
    score -= tutorialWrongSlotCount * 2;
    score -= weeklyTargetDeviation * 2;
    score -= workloadImbalance * 1.5;
    score -= labIssueCount * 4;

    score -= teacherClashCount * 25;
    score -= roomClashCount * 20;

    return Math.min(100, Math.round(score * 10) / 10);
  }

  /**
   * Tournament selection — preserves genetic diversity better than roulette
   * under extreme fitness differences (common in constrained scheduling).
   * O(n * k) where k = tournament size (3).
   */
  selection(population, fitnessScores) {
    if (!population?.length || population.length !== fitnessScores?.length) {
      return population || [];
    }

    const TOURNAMENT_SIZE = 3;
    const selected = [];

    for (let i = 0; i < population.length; i++) {
      // Pick TOURNAMENT_SIZE random contestants
      let bestIdx   = -1;
      let bestScore = -Infinity;

      for (let t = 0; t < TOURNAMENT_SIZE; t++) {
        const idx = Math.floor(Math.random() * population.length);
        if (fitnessScores[idx] > bestScore) {
          bestScore = fitnessScores[idx];
          bestIdx   = idx;
        }
      }

      selected.push(JSON.parse(JSON.stringify(population[bestIdx])));
    }

    return selected;
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

  /**
   * Multi-operator mutation with 5 targeted strategies:
   *  Type 1 (30%): Intra-day swap within same division
   *  Type 2 (28%): Cross-day swap within same division (improves weekly spread)
   *  Type 3 (20%): Cross-division room swap (resolves room clashes)
   *  Type 4 (12%): Subject spacing repair — moves a subject off a consecutive-day pair
   *  Type 5 (10%): Nullify one random non-lab slot (exploration)
   */
  mutate(schedule, overrideMutationRate = null) {
    const rate = overrideMutationRate ?? this.mutationRate;
    if (!schedule || Math.random() > rate) {
      return JSON.parse(JSON.stringify(schedule));
    }

    const mutated   = JSON.parse(JSON.stringify(schedule));
    const divisions = Object.keys(mutated);
    if (!divisions.length) return mutated;

    const r      = Math.random();
    const isLab  = (slot) => slot?.subject?.type === 'practical' || slot?.subject?.type === 'lab';
    const pickRand = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (r < 0.30) {
      // ── Type 1: Intra-day swap ───────────────────────────────────────────
      const division = pickRand(divisions);
      const day      = pickRand(this.days);
      const p1 = Math.floor(Math.random() * this.periodsPerDay);
      const p2 = Math.floor(Math.random() * this.periodsPerDay);
      if (mutated[division]?.[day] &&
          !isLab(mutated[division][day][p1]) &&
          !isLab(mutated[division][day][p2])) {
        const temp = mutated[division][day][p1];
        mutated[division][day][p1] = mutated[division][day][p2];
        mutated[division][day][p2] = temp;
      }

    } else if (r < 0.58) {
      // ── Type 2: Cross-day swap within same division ──────────────────────
      const division = pickRand(divisions);
      const day1 = pickRand(this.days);
      const day2 = pickRand(this.days);
      if (day1 !== day2) {
        const p1    = Math.floor(Math.random() * this.periodsPerDay);
        const p2    = Math.floor(Math.random() * this.periodsPerDay);
        const slot1 = mutated[division]?.[day1]?.[p1];
        const slot2 = mutated[division]?.[day2]?.[p2];
        if (slot1 && slot2 && !isLab(slot1) && !isLab(slot2)) {
          mutated[division][day1][p1] = { ...slot2, period: p1 + 1 };
          mutated[division][day2][p2] = { ...slot1, period: p2 + 1 };
        }
      }

    } else if (r < 0.78) {
      // ── Type 3: Cross-division room swap ─────────────────────────────────
      if (divisions.length >= 2) {
        const div1 = pickRand(divisions);
        let div2   = pickRand(divisions);
        if (div1 === div2) div2 = divisions[(divisions.indexOf(div1) + 1) % divisions.length];
        const day    = pickRand(this.days);
        const period = Math.floor(Math.random() * this.periodsPerDay);
        const slot1  = mutated[div1]?.[day]?.[period];
        const slot2  = mutated[div2]?.[day]?.[period];
        if (slot1 && slot2 && !isLab(slot1) && !isLab(slot2)) {
          const room1 = slot1.classroom;
          mutated[div1][day][period] = { ...slot1, classroom: slot2.classroom };
          mutated[div2][day][period] = { ...slot2, classroom: room1 };
        }
      }

    } else if (r < 0.90) {
      // ── Type 4: Subject spacing repair ───────────────────────────────────
      // Find a subject that appears on two adjacent days and move one instance
      // to a non-adjacent day that currently has a free slot.
      const division = pickRand(divisions);

      // Build subject->days map for this division
      const subDays = {};
      for (let di = 0; di < this.days.length; di++) {
        const day     = this.days[di];
        const daySlots = mutated[division]?.[day] || [];
        daySlots.forEach((slot, pi) => {
          if (!slot?.subject?._id || isLab(slot)) return;
          const sId = String(slot.subject._id);
          if (!subDays[sId]) subDays[sId] = [];
          subDays[sId].push({ di, pi, day });
        });
      }

      // Find a subject with a consecutive-day violation
      for (const [sId, entries] of Object.entries(subDays)) {
        if (entries.length < 2) continue;
        const sorted = entries.sort((a, b) => a.di - b.di);
        for (let k = 0; k < sorted.length - 1; k++) {
          if (sorted[k + 1].di - sorted[k].di !== 1) continue;

          // Found consecutive days — try to move the second occurrence to a gap day
          const victim     = sorted[k + 1];
          const usedDayIdx = new Set(entries.map(e => e.di));
          const freeDays   = this.days
            .map((d, idx) => ({ d, idx }))
            .filter(({ idx }) => !usedDayIdx.has(idx) ||
              (idx !== sorted[k].di && idx !== victim.di))
            .filter(({ d, idx }) => {
              // Must be non-adjacent to sorted[k].di
              return Math.abs(idx - sorted[k].di) > 1;
            });

          if (freeDays.length === 0) break;
          const target = pickRand(freeDays);

          // Find a free slot in the target day
          const targetSlots = mutated[division]?.[target.d] || [];
          const freeSlot = targetSlots.findIndex(s => s === null);
          if (freeSlot === -1) break;

          // Move the slot
          mutated[division][target.d][freeSlot] = {
            ...mutated[division][victim.day][victim.pi],
            period: freeSlot + 1
          };
          mutated[division][victim.day][victim.pi] = null;
          break;
        }
        break; // process one violation per mutation call
      }

    } else {
      // ── Type 5: Nullify one random non-lab slot (exploration) ────────────
      const division = pickRand(divisions);
      const day      = pickRand(this.days);
      const period   = Math.floor(Math.random() * this.periodsPerDay);
      if (mutated[division]?.[day] && !isLab(mutated[division][day][period])) {
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
  initializePopulation(divisions, subjects, teachers, classes, subjectTeacherMap) {
    const population = [];
    for (let i = 0; i < this.populationSize; i++) {
      try {
        const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes, subjectTeacherMap);
        population.push(schedule);
      } catch (error) {
        console.error('createRandomSchedule failed, falling back to an empty schedule:', error);
        population.push(this.createEmptySchedule(divisions));
      }
    }
    return population;
  }

  resolveConflicts(schedule, teachers, classes) {
    // Intentional no-op post-processing hook. fitness() already applies
    // hard penalties (teacherClashCount / roomClashCount) that the GA
    // selects against during evolution, so the returned bestSolution should
    // already be conflict-minimal. This hook exists as a place to add
    // deterministic post-hoc repair (e.g. swap-out remaining clashes) later
    // without changing run()'s call site.
    return schedule;
  }
  run(divisions, subjects, teachers, classes, subjectTeacherMap) {
    if (!divisions?.length || !subjects?.length || !teachers?.length || !classes?.length) {
      console.error('Insufficient data for running algorithm');
      return this.createEmptySchedule(divisions || []);
    }

    let population = this.initializePopulation(divisions, subjects, teachers, classes, subjectTeacherMap);
    let bestSolution = null;
    let bestFitness = -Infinity;
    let generationsWithoutImprovement = 0;

    // Fitness is now bounded to a max of 100 (see fitness()), so a score of
    // 500 — the old threshold — was unreachable and this loop could only
    // ever stop via the stall counter, often burning through most of
    // maxGenerations even after effectively converging. 90+ now represents
    // a near-perfect, conflict-free timetable.
    const NEAR_PERFECT_FITNESS = 90;
    const STALL_PATIENCE = 40;

    for (let generation = 0; generation < this.maxGenerations; generation++) {
      const fitnessScores = population.map(s => this.fitness(s, subjects));
      const currentBest = Math.max(...fitnessScores);

      if (currentBest > bestFitness) {
        bestFitness = currentBest;
        bestSolution = population[fitnessScores.indexOf(currentBest)];
        generationsWithoutImprovement = 0;
      } else {
        generationsWithoutImprovement++;
      }

      if (bestFitness >= NEAR_PERFECT_FITNESS || generationsWithoutImprovement >= STALL_PATIENCE) {
        break;
      }

      const selected = this.selection(population, fitnessScores);
      const newPopulation = [];

      // Elitism
      const eliteIndices = [...fitnessScores]
        .map((score, index) => ({ score, index }))
        .sort((a, b) => b.score - a.score)
        .slice(0, this.elitismCount)
        .map(item => item.index);

      for (const index of eliteIndices) {
        newPopulation.push(population[index]);
      }

      // Fill with offspring
      while (newPopulation.length < this.populationSize && selected.length >= 2) {
        const parent1 = selected[Math.floor(Math.random() * selected.length)];
        const parent2 = selected[Math.floor(Math.random() * selected.length)];
        const child = this.crossover(parent1, parent2);
        newPopulation.push(this.mutate(child));
      }

      // Ensure population size
      while (newPopulation.length < this.populationSize) {
        newPopulation.push(this.createRandomSchedule(divisions, subjects, teachers, classes, subjectTeacherMap));
      }

      population = newPopulation;
    }

    const finalSolution = bestSolution || 
                         population[population.map(s => this.fitness(s, subjects)).indexOf(Math.max(...population.map(s => this.fitness(s, subjects))))] || 
                         this.createEmptySchedule(divisions);

    return this.resolveConflicts(finalSolution, teachers, classes);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Quality metrics — returned in generateSchedule metadata
  // ─────────────────────────────────────────────────────────────────────────
  computeQualityMetrics(schedule, subjects, teachers, classes) {
    const teacherIds       = new Set(teachers.map(t => String(t._id)));
    const classroomIds     = new Set(classes.map(c => String(c._id)));
    const usedTeachers     = new Set();
    const usedRooms        = new Set();
    let totalSlots         = 0;
    let filledSlots        = 0;
    let labPairsCorrect    = 0;
    let labPairsTotal      = 0;
    let hardClashes        = 0;
    const teacherSlotCheck = new Map();
    const roomSlotCheck    = new Map();

    // Phase 2 metrics
    let subjectConsecDayViolations = 0;
    let teacherIdleGaps            = 0;
    let teacherConsecRuns          = 0;   // count of 3+ consecutive lecture runs
    const divFills                 = [];
    const subjectDayMapM           = {};  // subId -> Set<dayIdx> (across all divs)
    const teacherDaySlotsM         = {};  // teacherId -> day -> [periodIdx]

    for (const division in schedule) {
      subjectDayMapM[division] = {};
      let divFill = 0;

      for (let di = 0; di < this.days.length; di++) {
        const day     = this.days[di];
        const daySlots = schedule[division][day] || [];
        totalSlots  += daySlots.length;
        const dayFill = daySlots.filter(s => s !== null).length;
        filledSlots += dayFill;
        divFill     += dayFill;

        for (let i = 0; i < daySlots.length; i++) {
          const slot = daySlots[i];
          if (!slot) continue;

          if (slot.teacher?._id) {
            usedTeachers.add(String(slot.teacher._id));
            // Clash
            const tk = `${slot.teacher._id}_${day}_${i}`;
            if (teacherSlotCheck.has(tk)) hardClashes++;
            else teacherSlotCheck.set(tk, true);
            // For teacher compactness
            const tId = String(slot.teacher._id);
            if (!teacherDaySlotsM[tId])      teacherDaySlotsM[tId]      = {};
            if (!teacherDaySlotsM[tId][day]) teacherDaySlotsM[tId][day] = [];
            teacherDaySlotsM[tId][day].push(i);
          }
          if (slot.classroom?._id) {
            usedRooms.add(String(slot.classroom._id));
            const rk = `${slot.classroom._id}_${day}_${i}`;
            if (roomSlotCheck.has(rk)) hardClashes++;
            else roomSlotCheck.set(rk, true);
          }

          // Subject day spread tracking
          if (slot.subject?._id) {
            const sId = String(slot.subject._id);
            if (!subjectDayMapM[division][sId]) subjectDayMapM[division][sId] = new Set();
            subjectDayMapM[division][sId].add(di);
          }

          // Lab pairs
          const type = slot.subject?.type;
          if ((type === 'practical' || type === 'lab') && (i === 0 || i === 2 || i === 4)) {
            labPairsTotal++;
            const next = daySlots[i + 1];
            if (next &&
                String(next.subject?._id)  === String(slot.subject._id) &&
                String(next.teacher?._id)  === String(slot.teacher?._id)) {
              labPairsCorrect++;
            }
          }
        }
      }
      divFills.push(divFill);

      // Subject consecutive-day violations for this division
      for (const sId of Object.keys(subjectDayMapM[division])) {
        const days = [...subjectDayMapM[division][sId]].sort((a, b) => a - b);
        for (let k = 0; k < days.length - 1; k++) {
          if (days[k + 1] - days[k] === 1) subjectConsecDayViolations++;
        }
      }
    }

    // Teacher idle gaps & consecutive runs
    for (const tId of Object.keys(teacherDaySlotsM)) {
      for (const day of this.days) {
        const periods = (teacherDaySlotsM[tId]?.[day] || []).sort((a, b) => a - b);
        if (periods.length < 2) continue;
        // Gaps
        for (let k = 0; k < periods.length - 1; k++) {
          if (periods[k + 1] - periods[k] > 1) teacherIdleGaps++;
        }
        // Consecutive runs of 3+
        let run = 1;
        for (let k = 1; k < periods.length; k++) {
          if (periods[k] - periods[k - 1] === 1) {
            run++;
            if (run === 3) teacherConsecRuns++;
          } else {
            run = 1;
          }
        }
      }
    }

    // Division fairness
    const avgFill      = divFills.length ? divFills.reduce((a, b) => a + b, 0) / divFills.length : 0;
    const fillVariance = divFills.length ? divFills.reduce((s, f) => s + Math.pow(f - avgFill, 2), 0) / divFills.length : 0;
    const divFairnessScore = Math.max(0, 100 - Math.round(Math.sqrt(fillVariance) * 10));

    const teacherUtil      = teacherIds.size   > 0 ? Math.round((usedTeachers.size / teacherIds.size)   * 100) : 0;
    const classroomUtil    = classroomIds.size > 0 ? Math.round((usedRooms.size   / classroomIds.size)   * 100) : 0;
    const labUtil          = labPairsTotal     > 0 ? Math.round((labPairsCorrect   / labPairsTotal)       * 100) : 100;
    const slotUtil         = totalSlots        > 0 ? Math.round((filledSlots       / totalSlots)           * 100) : 0;
    const subjectSpread    = Math.max(0, 100 - subjectConsecDayViolations * 10);
    const teacherCompact   = Math.max(0, 100 - teacherIdleGaps * 8 - teacherConsecRuns * 5);

    // Weighted quality score 0–100 (Phase 2 formula)
    const qualityScore = Math.min(100, Math.round(
      (teacherUtil     * 0.20) +
      (classroomUtil   * 0.15) +
      (labUtil         * 0.20) +
      (slotUtil        * 0.15) +
      (subjectSpread   * 0.15) +
      (teacherCompact  * 0.10) +
      (divFairnessScore * 0.05) +
      (hardClashes === 0 ? 10 : 0)
    ));

    return {
      // Core utilisation
      teacherUtilization:   { used: usedTeachers.size,  total: teacherIds.size,   percentage: teacherUtil },
      classroomUtilization: { used: usedRooms.size,     total: classroomIds.size, percentage: classroomUtil },
      labUtilization:       { correct: labPairsCorrect, total: labPairsTotal,     percentage: labUtil },
      slotUtilization:      { filled: filledSlots,      total: totalSlots,        percentage: slotUtil },
      hardClashes,
      // Phase 2 soft-constraint metrics
      subjectSpread:        { violations: subjectConsecDayViolations, score: subjectSpread },
      teacherCompactness:   { idleGaps: teacherIdleGaps, consecRuns: teacherConsecRuns, score: teacherCompact },
      divisionFairness:     { fillVariance: Math.round(fillVariance * 10) / 10, score: divFairnessScore },
      // Overall
      qualityScore
    };
  }
}