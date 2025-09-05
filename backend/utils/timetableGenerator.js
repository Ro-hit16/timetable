
// export default class GeneticAlgorithm {
//   constructor(config = {}) {
//     this.config = config;
//     this.populationSize = config.populationSize || 50;
//     this.maxGenerations = config.maxGenerations || 100;
//     this.mutationRate = config.mutationRate || 0.1;
//     this.crossoverRate = config.crossoverRate || 0.8;
//     this.elitismCount = Math.floor((config.elitismRate || 0.1) * this.populationSize);

//     this.departmentId = config.departmentId;
//     this.semester = config.semester;
//     this.academicYear = config.academicYear;
//     this.divisions = config.divisions;
//     this.subjects = config.subjects;
//     this.teachers = config.teachers;
//     this.classes = config.classes;

//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//   }

//   initializePopulation(divisions, subjects, teachers, classes) {
//     const population = [];
//     for (let i = 0; i < this.populationSize; i++) {
//       const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes);
//       population.push(schedule);
//     }
//     return population;
//   }

//   async generateSchedule({ divisions, subjects, teachers, classes }) {
//     try {
//       const schedule = this.run(divisions, subjects, teachers, classes);

//       if (!schedule || Object.keys(schedule).length === 0) {
//         return { schedule: {}, metadata: null };
//       }

//       return {
//         schedule,
//         metadata: {
//           fitnessScore: this.fitness(schedule),
//           generation_count: this.maxGenerations,
//           conflictsResolved: true,
//           algorithm_version: "1.0.0"
//         }
//       };
//     } catch (error) {
//       throw new Error("Failed to generate schedule");
//     }
//   }

//   createRandomSchedule(divisions, subjects, teachers, classes) {
//     const schedule = {};
//     this.periodsPerDay = 6;

//     const validSubjects = subjects.filter(s => s.name && s.name.trim() !== '');

//     for (const divisionName of divisions) {
//       schedule[divisionName] = {};

//       for (const day of this.days) {
//         schedule[divisionName][day] = [];

//         for (let periodIndex = 0; periodIndex < this.periodsPerDay; periodIndex++) {
//           let subject = null;
//           let attempts = 0;

//           while (!subject && attempts < 5 && validSubjects.length > 0) {
//             const temp = validSubjects[Math.floor(Math.random() * validSubjects.length)];
//             subject = temp;
//             attempts++;
//           }

//           if (!subject) {
//             schedule[divisionName][day].push(null);
//             continue;
//           }

//           const eligibleTeachers = teachers.filter(
//             (teacher) => teacher.semester === Number(subject.semester)
//           );
//           const teacher = eligibleTeachers.length > 0
//             ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)]
//             : null;

//           const classroom = classes.length > 0
//             ? classes[Math.floor(Math.random() * classes.length)]
//             : null;

//           const timeSlot = this.getTimeForPeriod(periodIndex);

//           const slot = {
//             period: periodIndex + 1,
//             subject: {
//   _id: subject._id,
//   subjectName: subject.subjectName || 'Unnamed Subject',
//   type: subject.type === 'theory' ? 'Theory' : (subject.type || 'Theory')
// },

//             teacher: teacher
//               ? {
//                   _id: teacher._id,
//                   name: teacher.name || 'Unnamed Teacher'
//                 }
//               : null,
//             classroom: classroom
//               ? {
//                   _id: classroom._id,
//                   room_number: classroom.room_number || classroom.classNumber || 'Unassigned'
//                 }
//               : null,
//             start_time: timeSlot.start,
//             end_time: timeSlot.end
//           };

//           schedule[divisionName][day].push(slot);
//         }
//       }
//     }

//     return schedule;
//   }

// // createRandomSchedule(divisions, subjects, teachers, classes) {
// //   const schedule = {};
// //   this.periodsPerDay = 6;

// //   const validSubjects = subjects.filter(s => s.name && s.name.trim() !== '');

// //   for (const divisionName of divisions) {
// //     schedule[divisionName] = {};

// //     for (const day of this.days) {
// //       schedule[divisionName][day] = [];

// //       for (let periodIndex = 0; periodIndex < this.periodsPerDay; periodIndex++) {
// //         let subject = null;
// //         let attempts = 0;

// //         while (!subject && attempts < 5 && validSubjects.length > 0) {
// //           const temp = validSubjects[Math.floor(Math.random() * validSubjects.length)];
// //           subject = temp;
// //           attempts++;
// //         }

// //         if (!subject) {
// //           schedule[divisionName][day].push(null);
// //           continue;
// //         }

// //         const eligibleTeachers = teachers.filter(
// //           (teacher) => teacher.semester === Number(subject.semester)
// //         );
// //         const teacher = eligibleTeachers.length > 0
// //           ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)]
// //           : null;

// //         const classroom = classes.length > 0
// //           ? classes[Math.floor(Math.random() * classes.length)]
// //           : null;

// //         const timeSlot = this.getTimeForPeriod(periodIndex);

// //         const slot = {
// //           period: periodIndex + 1,
// //           subject: {
// //             _id: subject._id,
// //             subjectName: subject.name || subject.subjectName || 'Unnamed Subject',
// //             type: subject.type === 'theory' ? 'Theory' : (subject.type || 'Theory')
// //           },
// //           teacher: teacher
// //             ? {
// //                 _id: teacher._id,
// //                 name: teacher.name || 'Unnamed Teacher'
// //               }
// //             : null,
// //           classroom: classroom
// //             ? {
// //                 _id: classroom._id,
// //                 room_number: classroom.room_number || classroom.classNumber || 'Unassigned'
// //               }
// //             : null,
// //           start_time: timeSlot.start,
// //           end_time: timeSlot.end
// //         };

// //         schedule[divisionName][day].push(slot);
// //       }
// //     }
// //   }

// //   return schedule;
// // }


//   getTimeForPeriod(periodIndex) {
//     const timeSlots = [
//       { start: '10:30', end: '11:30' },
//       { start: '11:30', end: '12:30' },
//       { start: '12:30', end: '13:30' },
//       { start: '14:30', end: '15:30' },
//       { start: '15:30', end: '16:30' },
//       { start: '16:30', end: '17:30' }
//     ];

//     return timeSlots[periodIndex] || { start: 'TBA', end: 'TBA' };
//   }

//   fitness(schedule) {
//     let score = 0;

//     if (!schedule || typeof schedule !== 'object') {
//       return score;
//     }

//     for (const divisionName in schedule) {
//       const divisionSchedule = schedule[divisionName];

//       if (!divisionSchedule || typeof divisionSchedule !== 'object') {
//         continue;
//       }

//       const teacherDaySlots = {};
//       const classDaySlots = {};

//       for (const day of this.days) {
//         const slots = divisionSchedule[day];

//         if (!Array.isArray(slots)) {
//           continue;
//         }

//         for (let i = 0; i < slots.length; i++) {
//           const slot = slots[i];
//           if (!slot) continue;

//           const teacherId = slot.teacher?._id;
//           const classId = slot.classroom?._id;

//           if (teacherId) {
//             const key = `${teacherId}-${day}-${i}`;
//             if (teacherDaySlots[key]) {
//               score -= 10;
//             } else {
//               teacherDaySlots[key] = true;
//             }
//           }

//           if (classId) {
//             const key = `${classId}-${day}-${i}`;
//             if (classDaySlots[key]) {
//               score -= 5;
//             } else {
//               classDaySlots[key] = true;
//             }
//           }

//           if (slot.subject && teacherId && classId) {
//             score += 2;
//           }
//         }
//       }
//     }

//     return score;
//   }

//   selection(population, fitnesses) {
//     const totalFitness = fitnesses.reduce((sum, f) => sum + f, 0);
//     const probabilities = fitnesses.map(f => f / totalFitness);

//     const selected = [];
//     for (let i = 0; i < population.length; i++) {
//       const rand = Math.random();
//       let acc = 0;
//       for (let j = 0; j < population.length; j++) {
//         acc += probabilities[j];
//         if (rand < acc) {
//           selected.push(population[j]);
//           break;
//         }
//       }
//     }

//     return selected;
//   }

//   crossover(parent1, parent2) {
//     if (!parent1 || !parent2 || Math.random() > this.config.crossoverRate) {
//       return JSON.parse(JSON.stringify(parent1 || parent2 || {}));
//     }

//     const child = {};

//     for (const division in parent1) {
//       child[division] = {};
//       for (const day of this.days) {
//         const crossoverPoint = Math.floor(Math.random() * 8);
//         const slots1 = parent1[division]?.[day] || [];
//         const slots2 = parent2[division]?.[day] || [];

//         child[division][day] = [
//           ...slots1.slice(0, crossoverPoint),
//           ...slots2.slice(crossoverPoint)
//         ];
//       }
//     }

//     return child;
//   }

//   mutate(schedule) {
//     const mutated = JSON.parse(JSON.stringify(schedule));

//     if (Math.random() > this.config.mutationRate) return mutated;

//     const divisions = Object.keys(mutated);
//     const division = divisions[Math.floor(Math.random() * divisions.length)];
//     const day = this.days[Math.floor(Math.random() * this.days.length)];
//     const period = Math.floor(Math.random() * 8);

//     if (!mutated[division]) {
//       mutated[division] = {};
//     }

//     if (!mutated[division][day]) {
//       mutated[division][day] = new Array(8).fill(null);
//     }

//     const slots = mutated[division][day];

//     if (slots && slots[period] !== undefined) {
//       slots[period] = null;
//     }

//     return mutated;
//   }

//   resolveConflicts(schedule, teachers, classes) {
//     for (const division in schedule) {
//       for (const day of this.days) {
//         const slots = schedule[division][day];
//         const teacherPeriodSet = new Set();
//         const classPeriodSet = new Set();

//         for (let i = 0; i < slots.length; i++) {
//           const slot = slots[i];
//           if (!slot) continue;

//           const teacherId = slot.teacher?._id;
//           const classId = slot.classroom?._id;

//           const teacherKey = `${teacherId}-${day}-${i}`;
//           const classKey = `${classId}-${day}-${i}`;

//           if (teacherPeriodSet.has(teacherKey) || classPeriodSet.has(classKey)) {
//             slots[i] = null;
//           } else {
//             teacherPeriodSet.add(teacherKey);
//             classPeriodSet.add(classKey);
//           }
//         }
//       }
//     }

//     return schedule;
//   }

//   run(divisions, subjects, teachers, classes) {
//     try {
//       let population = this.initializePopulation(divisions, subjects, teachers, classes);

//       for (let generation = 0; generation < this.maxGenerations; generation++) {
//         const fitnesses = population.map(schedule => this.fitness(schedule));
//         const selected = this.selection(population, fitnesses);
//         const newPopulation = [];

//         for (let i = 0; i < this.elitismCount; i++) {
//           const eliteIndex = fitnesses.indexOf(Math.max(...fitnesses));
//           newPopulation.push(population[eliteIndex]);
//           fitnesses[eliteIndex] = -Infinity;
//         }

//         while (newPopulation.length < this.populationSize) {
//           const parent1 = selected[Math.floor(Math.random() * selected.length)];
//           const parent2 = selected[Math.floor(Math.random() * selected.length)];

//           let child = this.crossover(parent1, parent2);
//           child = this.mutate(child);
//           newPopulation.push(child);
//         }

//         population = newPopulation;
//       }

//       const finalFitnesses = population.map(schedule => this.fitness(schedule));
//       const bestIndex = finalFitnesses.indexOf(Math.max(...finalFitnesses));
//       let bestSchedule = population[bestIndex];

//       bestSchedule = this.resolveConflicts(bestSchedule, teachers, classes);

//       return bestSchedule;
//     } catch (error) {
//       throw new Error("Timetable generation failed inside run()");
//     }
//   }
// }


// 📌 GeneticAlgorithm with constraints added

// export default class GeneticAlgorithm {
//   constructor(config = {}) {
//     this.config = config;
//     this.populationSize = config.populationSize || 50;
//     this.maxGenerations = config.maxGenerations || 100;
//     this.mutationRate = config.mutationRate || 0.1;
//     this.crossoverRate = config.crossoverRate || 0.8;
//     this.elitismCount = Math.floor((config.elitismRate || 0.1) * this.populationSize);

//     this.departmentId = config.departmentId;
//     this.semester = config.semester;
//     this.academicYear = config.academicYear;
//     this.divisions = config.divisions;

//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//   }

//   // create starting population
//   initializePopulation(divisions, subjects, teachers, classes) {
//     const population = [];
//     for (let i = 0; i < this.populationSize; i++) {
//       const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes);
//       population.push(schedule);
//     }
//     return population;
//   }

//   async generateSchedule({ divisions, subjects, teachers, classes }) {
//     try {
//       const schedule = this.run(divisions, subjects, teachers, classes);
//       return {
//         schedule,
//         metadata: {
//           fitnessScore: this.fitness(schedule),
//           generation_count: this.maxGenerations,
//           conflictsResolved: true,
//           algorithm_version: '2.0.0',
//         },
//       };
//     } catch (err) {
//       console.error(err);
//       throw new Error('Failed to generate schedule');
//     }
//   }

//   // 🔧 MAIN FUNCTION where constraints are handled
//   // createRandomSchedule(divisions, subjects, teachers, classes) {
//   //   const schedule = {};
//   //   this.periodsPerDay = 6;

//   //   // filter valid named subjects
//   //   const validSubjects = subjects.filter(s => s.subjectName || s.name);

//   //   for (const division of divisions) {
//   //     schedule[division] = {};

//   //     for (const day of this.days) {
//   //       schedule[division][day] = [];

//   //       // to track how many times we scheduled same subject in this day
//   //       const subjectDayCount = {};

//   //       let periodIndex = 0;
//   //       while (periodIndex < this.periodsPerDay) {
//   //         let subject = null;
//   //         let attempts = 0;

//   //         while (attempts < 10 && !subject) {
//   //           const candidate = validSubjects[Math.floor(Math.random() * validSubjects.length)];
//   //           const subjId = candidate._id.toString();

//   //           // ✅ constraint: same subject ≤ 2 per day
//   //           if ((subjectDayCount[subjId] || 0) >= 2) {
//   //             attempts++;
//   //             continue;
//   //           }

//   //           subject = candidate;
//   //         }

//   //         // if still not found → mark Free
//   //         if (!subject) {
//   //           schedule[division][day].push(null);
//   //           periodIndex++;
//   //           continue;
//   //         }

//   //         subjectDayCount[subject._id] = (subjectDayCount[subject._id] || 0) + 1;

//   //         // assign teacher
//   //         const eligTeachers = teachers.filter(t => Number(t.semester) === Number(subject.semester));
//   //         const teacher = eligTeachers[Math.floor(Math.random() * eligTeachers.length)] || null;

//   //         // assign classroom
//   //         const classroom = classes[Math.floor(Math.random() * classes.length)] || null;

//   //         // Now build slot
//   //         const slot = {
//   //           period: periodIndex + 1,
//   //           subject: {
//   //             _id: subject._id,
//   //             subjectName: subject.subjectName || subject.name,
//   //             type: subject.type === 'practical' ? 'practical' : (subject.type === 'theory' ? 'Theory' : subject.type)
//   //           },
//   //           teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//   //           classroom: classroom ? { _id: classroom._id, room_number: classroom.classNumber } : null,
//   //         };

//   //         // ✅ If subject is practical → try to book double-slot
//   //         if (subject.type === 'practical' && periodIndex < this.periodsPerDay - 1) {
//   //           schedule[division][day].push(slot);         // slot 1
//   //           schedule[division][day].push({ ...slot, period: periodIndex + 2 }); // slot 2
//   //           periodIndex += 2;
//   //         } else {
//   //           schedule[division][day].push(slot);
//   //           periodIndex++;
//   //         }
//   //       }
//   //     }
//   //   }
//   //   return schedule;
//   // }

//   createRandomSchedule(divisions, subjects, teachers, classes) {
//   const schedule = {};
//   this.periodsPerDay = 6;

//   // prepare helpful buckets
//   const theories      = subjects.filter(s => s.type === 'theory');
//   const practicals    = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
//   const tutorials     = subjects.filter(s => s.type === 'tutorial');
//   const regularRooms  = classes.filter(c => !(c.classNumber?.toLowerCase().includes('lab')));
//   const labRooms      = classes.filter(c =>   c.classNumber?.toLowerCase().includes('lab'));

//   for (const division of divisions) {
//     schedule[division] = {};
//     for (const day of this.days) {
//       schedule[division][day] = new Array(this.periodsPerDay).fill(null);
//       const subjectDayCount = {};
      
//       let period = 0;
//       while (period < this.periodsPerDay) {

//         // BLOCK PRACTICAL check
//         const isPracticalSlot = (period === 0 || period === 2); // 1-2 OR 3-4 slots only

//         let chosenSub = null;

//         // (1) Try practical in block positions
//         if (isPracticalSlot) {
//           const availablePract = practicals.filter(p => (subjectDayCount[p._id] || 0) < 1);
//           if (availablePract.length > 0) {
//             chosenSub = availablePract[Math.floor(Math.random() * availablePract.length)];

//             // assign teacher & lab
//             const eligTeach = teachers.filter(t => +t.semester === +chosenSub.semester);
//             const teacher   = eligTeach[Math.floor(Math.random() * eligTeach.length)] || null;
//             const lab       = labRooms[Math.floor(Math.random() * labRooms.length)] || null;

//             // place in two slots
//             const slot = {
//               period  : period + 1,
//               subject : { _id: chosenSub._id, subjectName: chosenSub.subjectName || chosenSub.name, type:'practical' },
//               teacher : teacher ? { _id: teacher._id, name: teacher.name } : null,
//               classroom: lab ? { _id: lab._id, room_number: lab.classNumber } : null
//             };
//             schedule[division][day][period]     = slot;
//             schedule[division][day][period + 1] = { ...slot, period: period + 2 };
//             subjectDayCount[chosenSub._id] = (subjectDayCount[chosenSub._id] || 0) + 1;
//             period += 2;
//             continue;
//           }
//         }

//         // (2) Prefer putting tutorial in P5 or P6
//         if ((period === 4 || period === 5) && tutorials.length > 0) {
//           const availableTut = tutorials.filter(t => (subjectDayCount[t._id] || 0) < 1);
//           if (availableTut.length > 0) {
//             chosenSub = availableTut[Math.floor(Math.random() * availableTut.length)];
//             const eligTeach = teachers.filter(t => +t.semester === +chosenSub.semester);
//             const teacher   = eligTeach[Math.floor(Math.random() * eligTeach.length)] || null;
//             const room      = regularRooms[Math.floor(Math.random() * regularRooms.length)] || null;

//             schedule[division][day][period] = {
//               period : period + 1,
//               subject: { _id: chosenSub._id, subjectName: chosenSub.subjectName || chosenSub.name, type: 'tutorial' },
//               teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//               classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//             };
//             subjectDayCount[chosenSub._id] = (subjectDayCount[chosenSub._id] || 0) + 1;
//             period++;
//             continue;
//           }
//         }

//         // (3) Regular theory
//         const availableTheory = theories.filter(s => (subjectDayCount[s._id] || 0) < 2);
//         if (availableTheory.length > 0) {
//           chosenSub = availableTheory[Math.floor(Math.random() * availableTheory.length)];
//           const eligTeach = teachers.filter(t => +t.semester === +chosenSub.semester);
//           const teacher   = eligTeach[Math.floor(Math.random() * eligTeach.length)] || null;
//           const room      = regularRooms[Math.floor(Math.random() * regularRooms.length)] || null;

//           schedule[division][day][period] = {
//             period : period + 1,
//             subject: { _id: chosenSub._id, subjectName: chosenSub.subjectName || chosenSub.name, type: 'theory' },
//             teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//             classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//           };
//           subjectDayCount[chosenSub._id] = (subjectDayCount[chosenSub._id] || 0) + 1;
//         }

//         period++;
//       }
//     }
//   }
//   return schedule;
// }


//   // Minor updated fitness → Penalize repeats of subject >2/day
//   fitness(schedule) {
//     let score = 0;

//     for (const division in schedule) {
//       for (const day of this.days) {
//         const slots = schedule[division][day] || [];
//         const subjCount = {};

//         slots.forEach((slot, i) => {
//           if (!slot) return;

//           const tId = slot.teacher?._id;
//           const cId = slot.classroom?._id;

//           // prefer filled slots
//           score += 2;

//           // teacher clash check
//           if (tId && slots.some((s, j) => j !== i && s?.teacher?._id === tId)) {
//             score -= 10;
//           }

//           // class clash check
//           if (cId && slots.some((s, j) => j !== i && s?.classroom?._id === cId)) {
//             score -= 5;
//           }

//           // repetition penalty
//           const sid = slot.subject?._id;
//           subjCount[sid] = (subjCount[sid] || 0) + 1;
//         });

//         // if a subject appears >2 → penalty
//         for (const k in subjCount) {
//           if (subjCount[k] > 2) {
//             score -= (subjCount[k] - 2) * 5;
//           }
//         }
//       }
//     }

//     return score;
//   }

//   selection(pop, fits) {
//     const tot = fits.reduce((a, b) => a + b, 0);
//     const probs = fits.map(f => f / tot);
//     const sel = [];
//     for (let i = 0; i < pop.length; i++) {
//       let r = Math.random(), acc = 0;
//       for (let j = 0; j < pop.length; j++) {
//         acc += probs[j];
//         if (r < acc) {
//           sel.push(pop[j]);
//           break;
//         }
//       }
//     }
//     return sel;
//   }

//   crossover(p1, p2) {
//     if (!p1 || !p2 || Math.random() > this.crossoverRate) {
//       return JSON.parse(JSON.stringify(p1 || p2));
//     }
//     const child = {};
//     for (const d in p1) {
//       child[d] = {};
//       for (const day of this.days) {
//         const cp = Math.floor(Math.random() * this.periodsPerDay);
//         const s1 = p1[d][day] || [], s2 = p2[d][day] || [];
//         child[d][day] = [...s1.slice(0, cp), ...s2.slice(cp)];
//       }
//     }
//     return child;
//   }

//   mutate(schedule) {
//     const m = JSON.parse(JSON.stringify(schedule));
//     if (Math.random() > this.mutationRate) return m;

//     const divisions = Object.keys(m);
//     const div = divisions[Math.floor(Math.random() * divisions.length)];
//     const day = this.days[Math.floor(Math.random() * this.days.length)];
//     const period = Math.floor(Math.random() * this.periodsPerDay);

//     if (m[div]?.[day]) {
//       m[div][day][period] = null;
//     }
//     return m;
//   }

//   resolveConflicts(s, teachers, classes) {
//     for (const d in s) {
//       for (const day of this.days) {
//         const slots = s[d][day];
//         const tSet = new Set(), cSet = new Set();
//         for (let i = 0; i < slots.length; i++) {
//           const slot = slots[i];
//           if (!slot) continue;
//           const tk = `${slot.teacher?._id}_${day}_${i}`;
//           const ck = `${slot.classroom?._id}_${day}_${i}`;
//           if (tSet.has(tk) || cSet.has(ck)) {
//             slots[i] = null;
//           } else {
//             tSet.add(tk); cSet.add(ck);
//           }
//         }
//       }
//     }
//     return s;
//   }

//   run(divisions, subjects, teachers, classes) {
//     let pop = this.initializePopulation(divisions, subjects, teachers, classes);
//     for (let g = 0; g < this.maxGenerations; g++) {
//       const fits = pop.map(p => this.fitness(p));
//       const sel = this.selection(pop, fits);
//       const newPop = [];

//       // elitism
//       for (let i = 0; i < this.elitismCount; i++) {
//         const bestIdx = fits.indexOf(Math.max(...fits));
//         newPop.push(pop[bestIdx]);
//         fits[bestIdx] = -Infinity;
//       }
//       // crossover + mutation
//       while (newPop.length < this.populationSize) {
//         const p1 = sel[Math.floor(Math.random() * sel.length)];
//         const p2 = sel[Math.floor(Math.random() * sel.length)];
//         let child = this.crossover(p1, p2);
//         child = this.mutate(child);
//         newPop.push(child);
//       }
//       pop = newPop;
//     }

//     const finalFits = pop.map(p => this.fitness(p));
//     const bestIdx = finalFits.indexOf(Math.max(...finalFits));
//     return this.resolveConflicts(pop[bestIdx], teachers, classes);
//   }
// }



// export default class GeneticAlgorithm {
//   constructor(config = {}) {
//     this.config = config;
//     this.populationSize = config.populationSize || 50;
//     this.maxGenerations = config.maxGenerations || 100;
//     this.mutationRate = config.mutationRate || 0.1;
//     this.crossoverRate = config.crossoverRate || 0.8;
//     this.elitismCount = Math.floor((config.elitismRate || 0.1) * this.populationSize);

//     this.departmentId = config.departmentId;
//     this.semester = config.semester;
//     this.academicYear = config.academicYear;
//     this.divisions = config.divisions;

//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//   }


//   // -----------------------------------------------------------------
//   // -------------------- create random schedule ---------------------
//   // -----------------------------------------------------------------
//   createRandomSchedule(divisions, subjects, teachers, classes) {
//     const schedule = {};
//     this.periodsPerDay = 6;

//     const theorySubs   = subjects.filter(s => s.type === 'theory');
//     const practicals   = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
//     const tutorials    = subjects.filter(s => s.type === 'tutorial');
//     const regularRooms = classes.filter(c => !(c.classNumber?.toLowerCase().includes('lab')));
//     const labRooms     = classes.filter(c  =>  (c.classNumber?.toLowerCase().includes('lab')));

//     for (const division of divisions) {
//       schedule[division] = {};
//       for (const day of this.days) {
//         schedule[division][day] = new Array(this.periodsPerDay).fill(null);
//         const subjectDayCount = {};

//         let p = 0;
//         while (p < this.periodsPerDay) {
//           let chosen = null;

//           //--------------------- block practical -------------------
//           const isPracticalBlockStart = (p === 0 || p === 2);  // 1-2 OR 3-4 only
//           if (isPracticalBlockStart) {
//             const candidates = practicals.filter(s => (subjectDayCount[s._id] || 0) < 1);
//             if (candidates.length) {
//               chosen = candidates[Math.floor(Math.random() * candidates.length)];
//               const t = teachers.filter(x => +x.semester === +chosen.semester);
//               const teacher = t[Math.floor(Math.random() * t.length)] || null;
//               const lab     = labRooms[Math.floor(Math.random() * labRooms.length)] || null;

//               const slot = {
//                 period   : p + 1,
//                 subject  : { _id: chosen._id, subjectName: chosen.subjectName || chosen.name, type:'practical' },
//                 teacher  : teacher ? { _id: teacher._id, name: teacher.name } : null,
//                 classroom: lab     ? { _id: lab._id, room_number: lab.classNumber } : null
//               };
//               schedule[division][day][p]   = slot;
//               schedule[division][day][p+1] = { ...slot, period: p+2 };

//               subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
//               p += 2;
//               continue;
//             }
//           }

//           //------------------ tutorial preferred 5-6 -----------------
//           if ((p === 4 || p === 5) && tutorials.length) {
//             const possible = tutorials.filter(t => (subjectDayCount[t._id] || 0) < 1);
//             if (possible.length) {
//               chosen = possible[Math.floor(Math.random() * possible.length)];
//               const t  = teachers.filter(x => +x.semester === +chosen.semester);
//               const teacher = t[Math.floor(Math.random() * t.length)] || null;
//               const room    = regularRooms[Math.floor(Math.random() * regularRooms.length)] || null;

//               schedule[division][day][p] = {
//                 period : p+1,
//                 subject: { _id: chosen._id, subjectName: chosen.subjectName||chosen.name, type:'tutorial' },
//                 teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//                 classroom: room  ? { _id: room._id, room_number: room.classNumber } : null
//               };
//               subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
//               p++;
//               continue;
//             }
//           }

//           //------------------------ theory ---------------------------
//           const availTheory = theorySubs.filter(s => (subjectDayCount[s._id] || 0) < 2);
//           if (availTheory.length) {
//             chosen = availTheory[Math.floor(Math.random() * availTheory.length)];
//             const t = teachers.filter(x => +x.semester === +chosen.semester);
//             const teacher = t[Math.floor(Math.random() * t.length)] || null;
//             const room    = regularRooms[Math.floor(Math.random() * regularRooms.length)] || null;

//             schedule[division][day][p] = {
//               period : p+1,
//               subject: { _id: chosen._id, subjectName: chosen.subjectName||chosen.name, type:'theory' },
//               teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//               classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//             };
//             subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
//           }
//           p++;
//         }
//       }
//     }
//     return schedule;
//   }


//   //-----------------------------------------------------------------
//   fitness(schedule) {
//     let sc = 0;
//     for (const d in schedule) {
//       for (const day of this.days) {
//         const slots = schedule[d][day] || [];
//         const subCount = {};

//         slots.forEach((slot,i)=>{
//           if (!slot) return;
//           const tId = slot.teacher?._id, cId = slot.classroom?._id;

//           sc += 2; // prefer filled period

//           // teacher clash
//           if (tId && slots.some((s,j)=> j!==i && s?.teacher?._id === tId)) sc -= 10;
//           // classroom clash
//           if (cId && slots.some((s,j)=> j!==i && s?.classroom?._id===cId)) sc -= 5;

//           const sId = slot.subject?._id;
//           subCount[sId] = (subCount[sId]||0) + 1;
//         });

//         for (const k in subCount) {
//           if (subCount[k] > 2) sc -= (subCount[k]-2)*5;
//         }
//       }
//     }
//     return sc;
//   }


//   selection(pop,fit){
//     const sum = fit.reduce((a,b)=>a+b,0), prob = fit.map(f=>f/sum);
//     const sel=[];
//     for (let i=0;i<pop.length;i++){
//       let r=Math.random(),a=0;
//       for (let j=0;j<pop.length;j++){
//         a+=prob[j];
//         if(r<a){sel.push(pop[j]);break;}
//       }
//     }
//     return sel;
//   }

//   crossover(p1,p2){
//     if(!p1 || !p2 || Math.random()>this.crossoverRate){
//       return JSON.parse(JSON.stringify(p1||p2));
//     }
//     const ch={};
//     for(const d in p1){
//       ch[d]={};
//       for(const day of this.days){
//         const cp=Math.floor(Math.random()*this.periodsPerDay);
//         const s1=p1[d][day]||[], s2=p2[d][day]||[];
//         ch[d][day]=[...s1.slice(0,cp),...s2.slice(cp)];
//       }
//     }
//     return ch;
//   }

//   mutate(sch){
//     const m=JSON.parse(JSON.stringify(sch));
//     if(Math.random()>this.mutationRate) return m;
//     const divs=Object.keys(m), pick = divs[Math.floor(Math.random()*divs.length)];
//     const day = this.days[Math.floor(Math.random()*this.days.length)];
//     const per = Math.floor(Math.random()*this.periodsPerDay);
//     if(m[pick]?.[day]) m[pick][day][per]=null;
//     return m;
//   }

//   resolveConflicts(sch,teachers,classes){
//     for(const d in sch){
//       for(const day of this.days){
//         const slots=sch[d][day], tSet=new Set(),cSet=new Set();
//         for(let i=0;i<slots.length;i++){
//           const slot=slots[i];
//           if(!slot) continue;
//           const tKey=`${slot.teacher?._id}_${day}_${i}`;
//           const cKey=`${slot.classroom?._id}_${day}_${i}`;
//           if(tSet.has(tKey)||cSet.has(cKey)) slots[i]=null;
//           else{tSet.add(tKey); cSet.add(cKey);}
//         }
//       }
//     }
//     return sch;
//   }

//   run(divs,sub,teach,cls){
//     let pop=this.initializePopulation(divs,sub,teach,cls);
//     for(let g=0;g<this.maxGenerations;g++){
//       const fit=pop.map(p=>this.fitness(p));
//       const selected=this.selection(pop,fit);
//       const newPop=[];
//       for(let i=0;i<this.elitismCount;i++){
//         const best = fit.indexOf(Math.max(...fit));
//         newPop.push(pop[best]);
//         fit[best]= -Infinity;
//       }
//       while(newPop.length<this.populationSize){
//         const p1 = selected[Math.floor(Math.random()*selected.length)];
//         const p2 = selected[Math.floor(Math.random()*selected.length)];
//         let child = this.crossover(p1,p2);
//         child = this.mutate(child);
//         newPop.push(child);
//       }
//       pop = newPop;
//     }
//     const f=pop.map(p=>this.fitness(p));
//     const idx=f.indexOf(Math.max(...f));
//     return this.resolveConflicts(pop[idx],teach,cls);
//   }
// }

// //in working
// export default class GeneticAlgorithm {
//   constructor(config = {}) {
//     this.config = config;
//     this.populationSize = config.populationSize || 50;
//     this.maxGenerations = config.maxGenerations || 100;
//     this.mutationRate = config.mutationRate || 0.1;
//     this.crossoverRate = config.crossoverRate || 0.8;
//     this.elitismCount = Math.floor((config.elitismRate || 0.1) * this.populationSize);

//     this.departmentId = config.departmentId;
//     this.semester = config.semester;
//     this.academicYear = config.academicYear;
//     this.divisions = config.divisions;
//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//   }

//   async generateSchedule({ divisions, subjects, teachers, classes }) {
//     try {
//       const schedule = this.run(divisions, subjects, teachers, classes);
//       return {
//         schedule,
//         metadata: {
//           fitnessScore: this.fitness(schedule),
//           generation_count: this.maxGenerations,
//           conflictsResolved: true,
//           algorithm_version: '2.0.0',
//         }
//       };
//     } catch (err) {
//       console.error(err);
//       throw new Error('Failed to generate schedule');
//     }
//   }

//   initializePopulation(divisions, subjects, teachers, classes) {
//     const population = [];
//     for (let i = 0; i < this.populationSize; i++) {
//       population.push(this.createRandomSchedule(divisions, subjects, teachers, classes));
//     }
//     return population;
//   }

//   // ------------------------------------------------------------------------------

// //   createRandomSchedule(divisions, subjects, teachers, classes) {
// //   const schedule = {};
// //   this.periodsPerDay = 6;

// //   const theorySubs   = subjects.filter(s => s.type === 'theory');
// //   const practicals   = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
// //   const tutorials    = subjects.filter(s => s.type === 'tutorial');
// //   const regularRooms = classes.filter(c => !(c.classNumber?.toLowerCase().includes('lab')));
// //   const labRooms     = classes.filter(c  =>  (c.classNumber?.toLowerCase().includes('lab')));

// //   for (const division of divisions) {
// //     schedule[division] = {};
// //     for (const day of this.days) {
// //       schedule[division][day] = new Array(this.periodsPerDay).fill(null);
// //       const subjectDayCount = {};
// //       let p = 0;

// //       while (p < this.periodsPerDay) {
// //         let chosen = null;

// //         // Helper to pick classroom safely
// //         const pickRoom = (preferred, fallback) => {
// //           if (preferred.length) {
// //             return preferred[Math.floor(Math.random() * preferred.length)];
// //           }
// //           if (fallback.length) {
// //             return fallback[Math.floor(Math.random() * fallback.length)];
// //           }
// //           return null;
// //         };

// //         // 1) Practical block booking only at 1-2 / 3-4 / 5-6
// //         const isPracticalBlockStart = (p === 0 || p === 2 || p === 4);
// //         if (isPracticalBlockStart) {
// //           const candidates = practicals.filter(s => (subjectDayCount[s._id] || 0) < 1);
// //           if (candidates.length) {
// //             chosen = candidates[Math.floor(Math.random() * candidates.length)];
// //             const t = teachers.filter(x => +x.semester === +chosen.semester);
// //             const teacher = t[Math.floor(Math.random() * t.length)] || null;
// //             const lab     = pickRoom(labRooms, classes);

// //             const slot = {
// //               period   : p + 1,
// //               subject  : { _id: chosen._id, subjectName: chosen.subjectName || chosen.name, type:'practical' },
// //               teacher  : teacher ? { _id: teacher._id, name: teacher.name } : null,
// //               classroom: lab     ? { _id: lab._id, room_number: lab.classNumber } : null
// //             };
// //             schedule[division][day][p]   = slot;
// //             if (p+1 < this.periodsPerDay) {
// //               schedule[division][day][p+1] = { ...slot, period: p+2 };
// //             }
// //             subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
// //             p += 2;
// //             continue;
// //           }
// //         }

// //         // 2) Tutorial preferred at period 5 or 6
// //         if ((p === 4 || p === 5) && tutorials.length) {
// //           const possible = tutorials.filter(t => (subjectDayCount[t._id] || 0) < 1);
// //           if (possible.length) {
// //             chosen = possible[Math.floor(Math.random() * possible.length)];
// //             const t  = teachers.filter(x => +x.semester === +chosen.semester);
// //             const teacher = t[Math.floor(Math.random() * t.length)] || null;
// //             const room    = pickRoom(regularRooms, classes);

// //             schedule[division][day][p] = {
// //               period : p+1,
// //               subject: { _id: chosen._id, subjectName: chosen.subjectName||chosen.name, type:'tutorial' },
// //               teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
// //               classroom: room  ? { _id: room._id, room_number: room.classNumber } : null
// //             };
// //             subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
// //             p++;
// //             continue;
// //           }
// //         }

// //         // 3) Theory subjects (max twice a day)
// //         const availTheory = theorySubs.filter(s => (subjectDayCount[s._id] || 0) < 2);
// //         if (availTheory.length) {
// //           chosen = availTheory[Math.floor(Math.random() * availTheory.length)];
// //           const t = teachers.filter(x => +x.semester === +chosen.semester);
// //           const teacher = t[Math.floor(Math.random() * t.length)] || null;
// //           const room    = pickRoom(regularRooms, classes);

// //           schedule[division][day][p] = {
// //             period : p+1,
// //             subject: { _id: chosen._id, subjectName: chosen.subjectName||chosen.name, type:'theory' },
// //             teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
// //             classroom: room ? { _id: room._id, room_number: room.classNumber } : null
// //           };
// //           subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
// //         }
// //         p++;
// //       }
// //     }
// //   }
// //   return schedule;
// // }

// createRandomSchedule(divisions, subjects, teachers, classes) {
//   const schedule = {};
//   this.periodsPerDay = 6;

//   const theorySubs   = subjects.filter(s => s.type === 'theory');
//   const practicals   = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
//   const tutorials    = subjects.filter(s => s.type === 'tutorial');
//   const regularRooms = classes.filter(c => !(c.classNumber?.toLowerCase().includes('lab')));
//   const labRooms     = classes.filter(c  =>  (c.classNumber?.toLowerCase().includes('lab')));

//   const maxPerDay = 2; // limit for same subject per day (all types combined)

//   for (const division of divisions) {
//     schedule[division] = {};
//     for (const day of this.days) {
//       schedule[division][day] = new Array(this.periodsPerDay).fill(null);
//       const subjectDayCount = {};
//       let p = 0;

//       const pickRoom = (preferred, fallback) => {
//         if (preferred.length) {
//           return preferred[Math.floor(Math.random() * preferred.length)];
//         }
//         if (fallback.length) {
//           return fallback[Math.floor(Math.random() * fallback.length)];
//         }
//         return null;
//       };

//       while (p < this.periodsPerDay) {
//         let chosen = null;

//         // 1) Practical block booking only at 1-2 / 3-4 / 5-6
//         const isPracticalBlockStart = (p === 0 || p === 2 || p === 4);
//         if (isPracticalBlockStart) {
//           const candidates = practicals.filter(s => (subjectDayCount[s._id] || 0) < maxPerDay);
//           if (candidates.length) {
//             chosen = candidates[Math.floor(Math.random() * candidates.length)];
//             const t = teachers.filter(x => +x.semester === +chosen.semester);
//             const teacher = t[Math.floor(Math.random() * t.length)] || null;
//             const lab     = pickRoom(labRooms, classes);

//             const slot = {
//               period   : p + 1,
//               subject  : { _id: chosen._id, subjectName: chosen.subjectName || chosen.name, type:'practical' },
//               teacher  : teacher ? { _id: teacher._id, name: teacher.name } : null,
//               classroom: lab     ? { _id: lab._id, room_number: lab.classNumber } : null
//             };
//             schedule[division][day][p]   = slot;
//             if (p+1 < this.periodsPerDay) {
//               schedule[division][day][p+1] = { ...slot, period: p+2 };
//             }
//             subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
//             p += 2;
//             continue;
//           }
//         }

//         // 2) Tutorial preferred at period 5 or 6
//         if ((p === 4 || p === 5) && tutorials.length) {
//           const possible = tutorials.filter(t => (subjectDayCount[t._id] || 0) < maxPerDay);
//           if (possible.length) {
//             chosen = possible[Math.floor(Math.random() * possible.length)];
//             const t  = teachers.filter(x => +x.semester === +chosen.semester);
//             const teacher = t[Math.floor(Math.random() * t.length)] || null;
//             const room    = pickRoom(regularRooms, classes);

//             schedule[division][day][p] = {
//               period : p+1,
//               subject: { _id: chosen._id, subjectName: chosen.subjectName||chosen.name, type:'tutorial' },
//               teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//               classroom: room  ? { _id: room._id, room_number: room.classNumber } : null
//             };
//             subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
//             p++;
//             continue;
//           }
//         }

//         // 3) Theory subjects (max twice a day)
//         const availTheory = theorySubs.filter(s => (subjectDayCount[s._id] || 0) < maxPerDay);
//         if (availTheory.length) {
//           chosen = availTheory[Math.floor(Math.random() * availTheory.length)];
//           const t = teachers.filter(x => +x.semester === +chosen.semester);
//           const teacher = t[Math.floor(Math.random() * t.length)] || null;
//           const room    = pickRoom(regularRooms, classes);

//           schedule[division][day][p] = {
//             period : p+1,
//             subject: { _id: chosen._id, subjectName: chosen.subjectName||chosen.name, type:'theory' },
//             teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//             classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//           };
//           subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
//         }
//         p++;
//       }
//     }
//   }
//   return schedule;
// }


//   // ------------------------------------------------------------------------------

//   fitness(schedule) {
//     let sc = 0;
//     for (const d in schedule) {
//       for (const day of this.days) {
//         const slots = schedule[d][day] || [];
//         const subCount = {};
//         slots.forEach((slot,i)=>{
//           if(!slot) return;
//           const tId=slot.teacher?._id, cId=slot.classroom?._id;
//           sc+=2; // filled period reward
//           if(tId && slots.some((s,j)=>j!==i && s?.teacher?._id===tId)) sc-=10;
//           if(cId && slots.some((s,j)=>j!==i && s?.classroom?._id===cId)) sc-=5;
//           const sid=slot.subject?._id;
//           subCount[sid]=(subCount[sid]||0)+1;
//         });
//         for(const sid in subCount){
//           if(subCount[sid]>2) sc-=(subCount[sid]-2)*5;
//         }
//       }
//     }
//     return sc;
//   }

//   selection(pop,fit){
//     const sum=fit.reduce((a,b)=>a+b,0);
//     const prob=fit.map(f=>f/sum);
//     const sel=[];
//     for(let i=0;i<pop.length;i++){
//       let r=Math.random(),a=0;
//       for(let j=0;j<pop.length;j++){
//         a+=prob[j];
//         if(r<a){ sel.push(pop[j]); break; }
//       }
//     }
//     return sel;
//   }

//   crossover(p1,p2){
//     if(!p1||!p2||Math.random()>this.crossoverRate){
//       return JSON.parse(JSON.stringify(p1||p2));
//     }
//     const ch={};
//     for(const d in p1){
//       ch[d]={};
//       for(const day of this.days){
//         const cp=Math.floor(Math.random()*this.periodsPerDay);
//         const s1=p1[d][day]||[], s2=p2[d][day]||[];
//         ch[d][day]=[...s1.slice(0,cp),...s2.slice(cp)];
//       }
//     }
//     return ch;
//   }

//   mutate(sch){
//     const m=JSON.parse(JSON.stringify(sch));
//     if(Math.random()>this.mutationRate) return m;
//     const divs=Object.keys(m), pick=divs[Math.floor(Math.random()*divs.length)];
//     const day=this.days[Math.floor(Math.random()*this.days.length)];
//     const per=Math.floor(Math.random()*this.periodsPerDay);
//     if(m[pick]?.[day]) m[pick][day][per]=null;
//     return m;
//   }

//   resolveConflicts(sch,teachers,classes){
//     for(const d in sch){
//       for(const day of this.days){
//         const slots=sch[d][day], tset=new Set(), cset=new Set();
//         for(let i=0;i<slots.length;i++){
//           const slot=slots[i];
//           if(!slot) continue;
//           const tk=`${slot.teacher?._id}_${day}_${i}`;
//           const ck=`${slot.classroom?._id}_${day}_${i}`;
//           if(tset.has(tk)||cset.has(ck)) slots[i]=null;
//           else{ tset.add(tk); cset.add(ck);}
//         }
//       }
//     }
//     return sch;
//   }

//   run(divs,subs,teach,cls){
//     let pop=this.initializePopulation(divs,subs,teach,cls);
//     for(let g=0;g<this.maxGenerations;g++){
//       const fit=pop.map(p=>this.fitness(p));
//       const sel=this.selection(pop,fit);
//       const newPop=[];
//       for(let i=0;i<this.elitismCount;i++){
//         const best=fit.indexOf(Math.max(...fit));
//         newPop.push(pop[best]);
//         fit[best]=-Infinity;
//       }
//       while(newPop.length<this.populationSize){
//         const p1=sel[Math.floor(Math.random()*sel.length)];
//         const p2=sel[Math.floor(Math.random()*sel.length)];
//         let ch=this.crossover(p1,p2);
//         ch=this.mutate(ch);
//         newPop.push(ch);
//       }
//       pop=newPop;
//     }
//     const f=pop.map(p=>this.fitness(p));
//     const idx=f.indexOf(Math.max(...f));
//     return this.resolveConflicts(pop[idx],teach,cls);
//   }
// }




// export default class GeneticAlgorithm {
//   constructor(config = {}) {
//     // Enhanced configuration with validation
//     this.config = config;
//     this.populationSize = Math.max(50, Math.min(500, config.populationSize || 150));
//     this.maxGenerations = Math.max(100, Math.min(2000, config.maxGenerations || 800));
//     this.mutationRate = Math.max(0.05, Math.min(0.5, config.mutationRate || 0.15));
//     this.crossoverRate = Math.max(0.5, Math.min(1, config.crossoverRate || 0.8));
//     this.elitismCount = Math.max(1, Math.floor(
//       Math.max(0.05, Math.min(0.3, config.elitismRate || 0.1)) * this.populationSize
//     ));

//     // Validate required fields
//     if (!config.departmentId || !config.semester || !config.academicYear) {
//       throw new Error('Missing required configuration: departmentId, semester, or academicYear');
//     }

//     this.departmentId = config.departmentId;
//     this.semester = config.semester;
//     this.academicYear = config.academicYear;
//     this.divisions = Array.isArray(config.divisions) ? config.divisions : [];
//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     this.periodsPerDay = 6;
    
//     // Penalty/Bonus configuration
//     this.penalties = {
//       TEACHER_CLASH: -50,
//       ROOM_CLASH: -30,
//       SUBJECT_OVERLOAD: -20,
//       LAB_NOT_CONSECUTIVE: -40,
//       UNWANTED_FREE: -5,
//       PREFERRED_SLOT: 10,
//       FILLED_SLOT: 5
//     };
//   }

//   async generateSchedule({ divisions = [], subjects = [], teachers = [], classes = [] } = {}) {
//     try {
//       // Enhanced input validation
//       if (!divisions.length || !subjects.length || !teachers.length || !classes.length) {
//         throw new Error('Insufficient data: divisions, subjects, teachers, or classes array is empty');
//       }

//       // Verify we have enough teachers and rooms
//       const requiredTeachers = subjects.filter(s => s.type === 'practical' || s.type === 'lab').length * 2;
//       if (teachers.length < requiredTeachers) {
//         throw new Error(`Insufficient teachers: Need at least ${requiredTeachers} for practical subjects`);
//       }

//       const startTime = Date.now();
//       const schedule = this.run(divisions, subjects, teachers, classes);
      
//       if (!schedule) {
//         throw new Error('Failed to generate valid schedule');
//       }

//       return {
//         schedule,
//         metadata: {
//           fitnessScore: this.fitness(schedule),
//           generation_count: this.maxGenerations,
//           population_size: this.populationSize,
//           conflictsResolved: true,
//           algorithm_version: '3.0.0',
//           executionTime: `${(Date.now() - startTime) / 1000} seconds`
//         }
//       };
//     } catch (err) {
//       console.error('Schedule generation error:', err);
//       throw new Error(`Failed to generate schedule: ${err.message}`);
//     }
//   }

//   initializePopulation(divisions, subjects, teachers, classes) {
//     const population = [];
//     for (let i = 0; i < this.populationSize; i++) {
//       try {
//         const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes);
//         population.push(schedule);
//       } catch (error) {
//         console.warn('Failed to create random schedule, using empty one:', error);
//         population.push(this.createEmptySchedule(divisions));
//       }
//     }
//     return population;
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

//   createRandomSchedule(divisions, subjects, teachers, classes) {
//     const schedule = {};
//     const maxPerDay = 2; // Max occurrences of same subject per day

//     // Categorize resources with error handling
//     const theorySubs = subjects?.filter(s => s?.type === 'theory') || [];
//     const practicals = subjects?.filter(s => s?.type === 'practical' || s?.type === 'lab') || [];
//     const tutorials = subjects?.filter(s => s?.type === 'tutorial') || [];
//     const regularRooms = classes?.filter(c => !(c.classNumber?.toLowerCase().includes('lab'))) || [];
//     const labRooms = classes?.filter(c => (c.classNumber?.toLowerCase().includes('lab'))) || [];

//     // Helper functions
//     const getAvailableTeachers = (subject) => {
//       if (!subject || !teachers.length) return [];
//       return teachers.filter(t => 
//         t.semester && subject.semester && +t.semester === +subject.semester
//       );
//     };

//     const pickRandom = (arr) => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;

//     // Shuffle days to distribute subjects better
//     const shuffledDays = [...this.days].sort(() => Math.random() - 0.5);

//     for (const division of divisions) {
//       schedule[division] = {};
      
//       for (const day of shuffledDays) {
//         schedule[division][day] = new Array(this.periodsPerDay).fill(null);
//         const subjectDayCount = new Map();
//         let p = 0;

//         while (p < this.periodsPerDay) {
//           // 1) First try to schedule labs in proper blocks
//           const isPracticalBlockStart = (p === 0 || p === 2 || p === 4);
//           if (isPracticalBlockStart && practicals.length) {
//             const availableLabs = practicals.filter(subj => 
//               (subjectDayCount.get(subj._id) || 0) < maxPerDay);
            
//             if (availableLabs.length) {
//               const labSubj = pickRandom(availableLabs);
//               const labTeachers = getAvailableTeachers(labSubj);
//               const teacher = pickRandom(labTeachers);
//               const labRoom = pickRandom(labRooms) || pickRandom(regularRooms);

//               if (labSubj && p + 1 < this.periodsPerDay) {
//                 const slot = {
//                   period: p + 1,
//                   subject: { 
//                     _id: labSubj._id, 
//                     subjectName: labSubj.subjectName || labSubj.name, 
//                     type: 'lab' 
//                   },
//                   teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//                   classroom: labRoom ? { 
//                     _id: labRoom._id, 
//                     room_number: labRoom.classNumber 
//                   } : null
//                 };

//                 schedule[division][day][p] = slot;
//                 schedule[division][day][p + 1] = { ...slot, period: p + 2 };
//                 subjectDayCount.set(labSubj._id, (subjectDayCount.get(labSubj._id) || 0) + 1);
//                 p += 2;
//                 continue;
//               }
//             }
//           }

//           // 2) Then try tutorials in preferred slots (5-6)
//           if (p >= 4 && tutorials.length) {
//             const availableTutorials = tutorials.filter(t => 
//               (subjectDayCount.get(t._id) || 0) < maxPerDay);
            
//             if (availableTutorials.length) {
//               const tutorial = pickRandom(availableTutorials);
//               const tutorTeachers = getAvailableTeachers(tutorial);
//               const teacher = pickRandom(tutorTeachers);
//               const room = pickRandom(regularRooms);

//               if (tutorial) {
//                 schedule[division][day][p] = {
//                   period: p + 1,
//                   subject: { 
//                     _id: tutorial._id, 
//                     subjectName: tutorial.subjectName || tutorial.name, 
//                     type: 'tutorial' 
//                   },
//                   teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//                   classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//                 };
//                 subjectDayCount.set(tutorial._id, (subjectDayCount.get(tutorial._id) || 0) + 1);
//                 p++;
//                 continue;
//               }
//             }
//           }

//           // 3) Fill with theory subjects
//           const availableTheory = theorySubs.filter(t => 
//             (subjectDayCount.get(t._id) || 0) < maxPerDay);
          
//           if (availableTheory.length) {
//             const theory = pickRandom(availableTheory);
//             const theoryTeachers = getAvailableTeachers(theory);
//             const teacher = pickRandom(theoryTeachers);
//             const room = pickRandom(regularRooms);

//             if (theory) {
//               schedule[division][day][p] = {
//                 period: p + 1,
//                 subject: { 
//                   _id: theory._id, 
//                   subjectName: theory.subjectName || theory.name, 
//                   type: 'theory' 
//                 },
//                 teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
//                 classroom: room ? { _id: room._id, room_number: room.classNumber } : null
//               };
//               subjectDayCount.set(theory._id, (subjectDayCount.get(theory._id) || 0) + 1);
//             }
//           }
//           p++;
//         }
//       }
//     }
//     return schedule;
//   }

//   fitness(schedule) {
//     if (!schedule) return -Infinity;
    
//     let score = 0;
//     const teacherSlots = new Map();
//     const roomSlots = new Map();

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

//           // Basic scoring for filled slots
//           score += this.penalties.FILLED_SLOT;

//           // Track subject counts per day
//           const subjectId = slot.subject?._id;
//           if (subjectId) {
//             subjectDayCount.set(subjectId, (subjectDayCount.get(subjectId) || 0) + 1);
//             if (subjectDayCount.get(subjectId) > 2) {
//               score += this.penalties.SUBJECT_OVERLOAD;
//             }
//           }

//           // Check teacher conflicts
//           const teacherId = slot.teacher?._id;
//           if (teacherId) {
//             const teacherKey = `${teacherId}_${day}_${i}`;
//             if (teacherSlots.has(teacherKey)) {
//               score += this.penalties.TEACHER_CLASH;
//             } else {
//               teacherSlots.set(teacherKey, true);
//             }
//           }

//           // Check room conflicts
//           const roomId = slot.classroom?._id;
//           if (roomId) {
//             const roomKey = `${roomId}_${day}_${i}`;
//             if (roomSlots.has(roomKey)) {
//               score += this.penalties.ROOM_CLASH;
//             } else {
//               roomSlots.set(roomKey, true);
//             }
//           }

//           // Lab specific checks
//           if (slot.subject?.type === 'practical' || slot.subject?.type === 'lab') {
//             // Check if lab is in proper consecutive slots
//             if (i % 2 !== 0 || !daySlots[i+1] || daySlots[i+1].subject?._id !== slot.subject?._id) {
//               score += this.penalties.LAB_NOT_CONSECUTIVE;
//             }
            
//             // Bonus for preferred lab slots (1-2 first, then 3-4, then 5-6)
//             if (i === 0) score += this.penalties.PREFERRED_SLOT * 2;
//             else if (i === 2) score += this.penalties.PREFERRED_SLOT;
//           }

//           // Theory in preferred slots (1-4)
//           if (slot.subject?.type === 'theory' && i <= 3) {
//             score += this.penalties.PREFERRED_SLOT;
//           }

//           // Tutorial in preferred slots (5-6)
//           if (slot.subject?.type === 'tutorial' && i >= 4) {
//             score += this.penalties.PREFERRED_SLOT * 2; // Extra bonus for tutorials
//           }
//         }
//       }
//     }
//     return score;
//   }

//   selection(population, fitnessScores) {
//     if (!population?.length || population.length !== fitnessScores?.length) {
//       return population || [];
//     }

//     // Normalize fitness scores to positive values
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
//           selected.push(population[j]);
//           break;
//         }
//       }
//     }

//     return selected.length ? selected : [...population];
//   }

//   crossover(parent1, parent2) {
//     if (!parent1 || !parent2 || Math.random() > this.crossoverRate) {
//       return parent1 ? JSON.parse(JSON.stringify(parent1)) : 
//              parent2 ? JSON.parse(JSON.stringify(parent2)) : {};
//     }

//     const child = {};
//     const divisions = Object.keys(parent1);

//     for (const division of divisions) {
//       child[division] = {};
      
//       for (const day of this.days) {
//         // Use different crossover points for different days
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
//       return schedule ? JSON.parse(JSON.stringify(schedule)) : {};
//     }

//     const mutated = JSON.parse(JSON.stringify(schedule));
//     const divisions = Object.keys(mutated);
//     if (!divisions.length) return mutated;

//     // Determine mutation type (swap, shift, or clear)
//     const mutationType = Math.random();

//     if (mutationType < 0.6) {
//       // Clear a random slot (60% chance)
//       const division = divisions[Math.floor(Math.random() * divisions.length)];
//       const day = this.days[Math.floor(Math.random() * this.days.length)];
//       const period = Math.floor(Math.random() * this.periodsPerDay);

//       if (mutated[division]?.[day]?.[period] !== undefined) {
//         mutated[division][day][period] = null;
//       }
//     } else if (mutationType < 0.9) {
//       // Swap two random slots (30% chance)
//       const division = divisions[Math.floor(Math.random() * divisions.length)];
//       const day = this.days[Math.floor(Math.random() * this.days.length)];
//       const period1 = Math.floor(Math.random() * this.periodsPerDay);
//       const period2 = Math.floor(Math.random() * this.periodsPerDay);

//       if (mutated[division]?.[day]?.[period1] !== undefined && 
//           mutated[division]?.[day]?.[period2] !== undefined) {
//         const temp = mutated[division][day][period1];
//         mutated[division][day][period1] = mutated[division][day][period2];
//         mutated[division][day][period2] = temp;
//       }
//     } else {
//       // Shift a block (10% chance)
//       const division = divisions[Math.floor(Math.random() * divisions.length)];
//       const day = this.days[Math.floor(Math.random() * this.days.length)];
//       const start = Math.floor(Math.random() * (this.periodsPerDay - 1));
//       const end = Math.min(start + Math.floor(Math.random() * 2) + 1, this.periodsPerDay);
//       const direction = Math.random() > 0.5 ? 1 : -1;

//       if (mutated[division]?.[day]) {
//         const slots = [...mutated[division][day]];
//         const block = slots.slice(start, end);
        
//         if (direction > 0 && end < this.periodsPerDay) {
//           // Shift right
//           for (let i = end; i < this.periodsPerDay; i++) {
//             slots[i - (end - start)] = slots[i];
//           }
//           for (let i = 0; i < block.length; i++) {
//             slots[this.periodsPerDay - block.length + i] = block[i];
//           }
//         } else if (direction < 0 && start > 0) {
//           // Shift left
//           for (let i = start - 1; i >= 0; i--) {
//             slots[i + (end - start)] = slots[i];
//           }
//           for (let i = 0; i < block.length; i++) {
//             slots[i] = block[i];
//           }
//         }
        
//         mutated[division][day] = slots;
//       }
//     }

//     return mutated;
//   }

//   resolveConflicts(schedule, teachers, classes) {
//     const resolved = JSON.parse(JSON.stringify(schedule));
//     const teacherAllocations = new Map();
//     const roomAllocations = new Map();

//     // First pass - identify and clear direct conflicts
//     for (const division in resolved) {
//       for (const day of this.days) {
//         const daySlots = resolved[division][day] || [];
        
//         for (let i = 0; i < daySlots.length; i++) {
//           const slot = daySlots[i];
//           if (!slot) continue;

//           const teacherKey = slot.teacher?._id ? `${slot.teacher._id}_${day}_${i}` : null;
//           const roomKey = slot.classroom?._id ? `${slot.classroom._id}_${day}_${i}` : null;

//           // Check for conflicts
//           const hasTeacherConflict = teacherKey && teacherAllocations.has(teacherKey);
//           const hasRoomConflict = roomKey && roomAllocations.has(roomKey);

//           if (hasTeacherConflict || hasRoomConflict) {
//             daySlots[i] = null; // Clear conflicting slot
//           } else {
//             if (teacherKey) teacherAllocations.set(teacherKey, { division, day, period: i });
//             if (roomKey) roomAllocations.set(roomKey, { division, day, period: i });
//           }
//         }
//       }
//     }

//     return resolved;
//   }

//   run(divisions, subjects, teachers, classes) {
//     if (!divisions?.length || !subjects?.length || !teachers?.length || !classes?.length) {
//       console.error('Insufficient data for running algorithm');
//       return this.createEmptySchedule(divisions || []);
//     }

//     let population = this.initializePopulation(divisions, subjects, teachers, classes);
//     let bestSolution = null;
//     let bestFitness = -Infinity;

//     for (let generation = 0; generation < this.maxGenerations; generation++) {
//       const fitnessScores = population.map(s => this.fitness(s));
//       const currentBest = Math.max(...fitnessScores);
      
//       // Track best solution across generations
//       if (currentBest > bestFitness) {
//         bestFitness = currentBest;
//         bestSolution = population[fitnessScores.indexOf(currentBest)];
//       }

//       // Early termination if perfect score found
//       if (bestFitness >= 1000) { // Adjust threshold as needed
//         console.log(`Early termination at generation ${generation} with perfect score`);
//         break;
//       }

//       const selected = this.selection(population, fitnessScores);
//       const newPopulation = [];

//       // Elitism: keep best solutions
//       const eliteIndices = [...fitnessScores]
//         .map((score, index) => ({ score, index }))
//         .sort((a, b) => b.score - a.score)
//         .slice(0, this.elitismCount)
//         .map(item => item.index);

//       for (const index of eliteIndices) {
//         newPopulation.push(population[index]);
//       }

//       // Fill rest of population with offspring
//       while (newPopulation.length < this.populationSize && selected.length >= 2) {
//         const parent1 = selected[Math.floor(Math.random() * selected.length)];
//         const parent2 = selected[Math.floor(Math.random() * selected.length)];
//         const child = this.crossover(parent1, parent2);
//         newPopulation.push(this.mutate(child));
//       }

//       population = newPopulation;
//     }

//     // Final conflict resolution
//     const finalSolution = bestSolution || 
//                          population[population.map(s => this.fitness(s)).indexOf(Math.max(...population.map(s => this.fitness(s))))] || 
//                          this.createEmptySchedule(divisions);

//     return this.resolveConflicts(finalSolution, teachers, classes);
//   }
// }


//claude imp
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
//       SUBJECT_OVERLOAD_DAY: -40,
//       SUBJECT_OVERLOAD_WEEK: -60,
//       LAB_NOT_CONSECUTIVE: -80,
//       LAB_WRONG_SLOT: -50,
//       UNWANTED_FREE: -10,
//       PREFERRED_SLOT: 20,
//       FILLED_SLOT: 10,
//       WEEKLY_TARGET_MET: 30,
//       PROPER_LAB_PLACEMENT: 25,
//       TUTORIAL_WRONG_SLOT: -30
//     };
//   }

//   async generateSchedule({ divisions = [], subjects = [], teachers = [], classes = [] } = {}) {
//     try {
//       if (!divisions.length || !subjects.length || !teachers.length || !classes.length) {
//         throw new Error('Insufficient data: divisions, subjects, teachers, or classes array is empty');
//       }

//       const startTime = Date.now();
//       const schedule = this.run(divisions, subjects, teachers, classes);
      
//       if (!schedule) {
//         throw new Error('Failed to generate valid schedule');
//       }

//       return {
//         schedule,
//         metadata: {
//           fitnessScore: this.fitness(schedule, subjects),
//           generation_count: this.maxGenerations,
//           population_size: this.populationSize,
//           conflictsResolved: true,
//           algorithm_version: '3.2.0',
//           executionTime: `${(Date.now() - startTime) / 1000} seconds`
//         }
//       };
//     } catch (err) {
//       console.error('Schedule generation error:', err);
//       throw new Error(`Failed to generate schedule: ${err.message}`);
//     }
//   }

//   initializePopulation(divisions, subjects, teachers, classes) {
//     const population = [];
//     for (let i = 0; i < this.populationSize; i++) {
//       try {
//         const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes);
//         population.push(schedule);
//       } catch (error) {
//         console.warn('Failed to create random schedule, using empty one:', error);
//         population.push(this.createEmptySchedule(divisions));
//       }
//     }
//     return population;
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

//   createRandomSchedule(divisions, subjects, teachers, classes) {
//     const schedule = {};
    
//     // Categorize subjects properly
//     const theorySubjects = subjects.filter(s => s.type === 'theory');
//     const practicalSubjects = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
//     const tutorialSubjects = subjects.filter(s => s.type === 'tutorial');
    
//     // Categorize rooms
//     const regularRooms = classes.filter(c => c.classNumber && !(c.classNumber.toLowerCase().includes('lab')));
//     const labRooms = classes.filter(c => c.classNumber && c.classNumber.toLowerCase().includes('lab'));
//     const allRooms = [...regularRooms, ...labRooms];

//     const getAvailableTeachers = (subject) => {
//       if (!subject || !teachers.length) return [];
      
//       let availableTeachers = teachers.filter(t => 
//         t.semester && subject.sem_id && 
//         (t.semester.toString() === subject.sem_id.toString())
//       );
      
//       if (availableTeachers.length === 0) {
//         availableTeachers = [...teachers];
//       }
      
//       return availableTeachers;
//     };

//     const pickRandom = (arr) => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;

//     // Define proper weekly requirements based on reference timetable
//     const createWeeklyPlan = () => {
//       const plan = [];
      
//       // Theory subjects: 3-4 times per week, slots 1-4 preferred
//       theorySubjects.forEach(subject => {
//         const sessionsPerWeek = Math.min(parseInt(subject.lecturePerWeek) || 3, 4);
//         for (let i = 0; i < sessionsPerWeek; i++) {
//           plan.push({
//             subject: subject,
//             type: 'theory',
//             preferredSlots: [0, 1, 2, 3, 4, 5], // 1-4 preferred, 5-6 fallback
//             priority: 2
//           });
//         }
//       });

//       // Lab subjects: exactly 3 lab sessions per week (6 slots total), only in consecutive pairs
//       practicalSubjects.forEach(subject => {
//         const labSessionsPerWeek = 3; // Fixed at 3 sessions per week
//         for (let i = 0; i < labSessionsPerWeek; i++) {
//           plan.push({
//             subject: subject,
//             type: 'lab_session',
//             preferredSlots: [0, 2, 4], // Only valid lab start positions (1-2, 3-4, 5-6)
//             priority: 1 // Highest priority
//           });
//         }
//       });

//       // Tutorial subjects: ONLY 1-2 times per week, ONLY in slots 5-6
//       tutorialSubjects.forEach(subject => {
//         const tutorialSessionsPerWeek = Math.min(parseInt(subject.lecturePerWeek) || 2, 2); // Max 2 per week
//         for (let i = 0; i < tutorialSessionsPerWeek; i++) {
//           plan.push({
//             subject: subject,
//             type: 'tutorial',
//             preferredSlots: [4, 5], // ONLY slots 5-6 (periods 5-6)
//             priority: 3
//           });
//         }
//       });

//       return plan.sort((a, b) => a.priority - b.priority);
//     };

//     // Initialize schedule structure
//     for (const division of divisions) {
//       schedule[division] = {};
//       for (const day of this.days) {
//         schedule[division][day] = new Array(this.periodsPerDay).fill(null);
//       }
//     }

//     // Schedule each division
//     for (const division of divisions) {
//       const weeklyPlan = createWeeklyPlan();
//       const scheduledItems = new Set();
//       const subjectWeeklyCount = new Map(); // Track weekly counts per subject
      
//       // Shuffle days for better distribution
//       const shuffledDays = [...this.days].sort(() => Math.random() - 0.5);

//       for (const item of weeklyPlan) {
//         if (scheduledItems.has(item)) continue;
        
//         // Check weekly limit for this subject
//         const currentWeeklyCount = subjectWeeklyCount.get(item.subject._id) || 0;
//         let maxWeeklyLimit = parseInt(item.subject.lecturePerWeek) || 3;
        
//         // Special limits for tutorials
//         if (item.type === 'tutorial') {
//           maxWeeklyLimit = Math.min(maxWeeklyLimit, 2); // Max 2 tutorials per week
//         }
        
//         if (currentWeeklyCount >= maxWeeklyLimit) {
//           continue; // Skip if already at weekly limit
//         }
        
//         let scheduled = false;
        
//         for (const day of shuffledDays) {
//           if (scheduled) break;
          
//           const daySchedule = schedule[division][day];
          
//           // Check daily limit (max 2 of same subject per day)
//           const subjectCountToday = daySchedule.filter(slot => 
//             slot?.subject?._id === item.subject._id
//           ).length;
          
//           if (subjectCountToday >= 2) continue;

//           if (item.type === 'lab_session') {
//             // Lab scheduling - need 2 consecutive slots
//             for (const startSlot of item.preferredSlots) {
//               if (startSlot + 1 < this.periodsPerDay &&
//                   daySchedule[startSlot] === null && 
//                   daySchedule[startSlot + 1] === null) {
                
//                 const availableTeachers = getAvailableTeachers(item.subject);
//                 const teacher = pickRandom(availableTeachers);
//                 const room = pickRandom(labRooms.length ? labRooms : allRooms);

//                 if (teacher && room) {
//                   const labSlot = {
//                     period: startSlot + 1,
//                     subject: { 
//                       _id: item.subject._id, 
//                       subjectName: item.subject.subjectName, 
//                       type: 'practical'
//                     },
//                     teacher: { _id: teacher._id, name: teacher.name },
//                     classroom: { _id: room._id, room_number: room.classNumber }
//                   };

//                   daySchedule[startSlot] = labSlot;
//                   daySchedule[startSlot + 1] = { ...labSlot, period: startSlot + 2 };
//                   scheduledItems.add(item);
//                   subjectWeeklyCount.set(item.subject._id, currentWeeklyCount + 1);
//                   scheduled = true;
//                   break;
//                 }
//               }
//             }
//           } else {
//             // Theory/Tutorial scheduling
//             for (const slot of item.preferredSlots) {
//               if (daySchedule[slot] === null) {
//                 const availableTeachers = getAvailableTeachers(item.subject);
//                 const teacher = pickRandom(availableTeachers);
//                 const room = pickRandom(item.type === 'tutorial' ? regularRooms : allRooms);

//                 if (teacher && room) {
//                   daySchedule[slot] = {
//                     period: slot + 1,
//                     subject: { 
//                       _id: item.subject._id, 
//                       subjectName: item.subject.subjectName, 
//                       type: item.subject.type 
//                     },
//                     teacher: { _id: teacher._id, name: teacher.name },
//                     classroom: { _id: room._id, room_number: room.classNumber }
//                   };
//                   scheduledItems.add(item);
//                   subjectWeeklyCount.set(item.subject._id, currentWeeklyCount + 1);
//                   scheduled = true;
//                   break;
//                 }
//               }
//             }
//           }
//         }
//       }
//     }

//     return schedule;
//   }

//   fitness(schedule, subjects) {
//     if (!schedule) return -Infinity;
    
//     let score = 0;
//     const teacherSlots = new Map();
//     const roomSlots = new Map();

//     for (const division in schedule) {
//       const weeklySubjectCount = new Map();
      
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
//           if (subjectId) {
//             subjectDayCount.set(subjectId, (subjectDayCount.get(subjectId) || 0) + 1);
//             weeklySubjectCount.set(subjectId, (weeklySubjectCount.get(subjectId) || 0) + 1);
            
//             if (subjectDayCount.get(subjectId) > 2) {
//               score += this.penalties.SUBJECT_OVERLOAD_DAY;
//             }
//           }

//           // Teacher conflicts
//           const teacherId = slot.teacher?._id;
//           if (teacherId) {
//             const teacherKey = `${teacherId}_${day}_${i}`;
//             if (teacherSlots.has(teacherKey)) {
//               score += this.penalties.TEACHER_CLASH;
//             } else {
//               teacherSlots.set(teacherKey, true);
//             }
//           }

//           // Room conflicts
//           const roomId = slot.classroom?._id;
//           if (roomId) {
//             const roomKey = `${roomId}_${day}_${i}`;
//             if (roomSlots.has(roomKey)) {
//               score += this.penalties.ROOM_CLASH;
//             } else {
//               roomSlots.set(roomKey, true);
//             }
//           }

//           // Slot preference bonuses/penalties
//           if (slot.subject?.type === 'practical' || slot.subject?.type === 'lab') {
//             // Lab must be in consecutive pairs at valid positions
//             if (i % 2 === 0 && i + 1 < daySlots.length) {
//               const nextSlot = daySlots[i + 1];
//               if (nextSlot && nextSlot.subject?._id === slot.subject?._id) {
//                 score += this.penalties.PROPER_LAB_PLACEMENT;
//                 // Prefer earlier slots for labs
//                 if (i === 0) score += this.penalties.PREFERRED_SLOT * 3;
//                 else if (i === 2) score += this.penalties.PREFERRED_SLOT * 2;
//                 else if (i === 4) score += this.penalties.PREFERRED_SLOT;
//               } else {
//                 score += this.penalties.LAB_NOT_CONSECUTIVE;
//               }
//             }
//           } else if (slot.subject?.type === 'theory') {
//             // Theory prefers slots 1-4
//             if (i <= 3) {
//               score += this.penalties.PREFERRED_SLOT;
//             }
//           } else if (slot.subject?.type === 'tutorial') {
//             // Tutorial MUST be in slots 5-6
//             if (i >= 4) {
//               score += this.penalties.PREFERRED_SLOT * 3; // High bonus for correct slot
//             } else {
//               score += this.penalties.TUTORIAL_WRONG_SLOT; // Penalty for wrong slot
//             }
//           }
//         }
//       }
      
//       // Check weekly subject targets
//       for (const subject of subjects) {
//         const actualCount = weeklySubjectCount.get(subject._id) || 0;
//         let targetCount = parseInt(subject.lecturePerWeek) || 3;
        
//         // Special targets for different types
//         if (subject.type === 'tutorial') {
//           targetCount = Math.min(targetCount, 2); // Max 2 tutorials per week
//         } else if (subject.type === 'practical' || subject.type === 'lab') {
//           targetCount = 3; // Exactly 3 lab sessions per week
//         }
        
//         if (actualCount === targetCount) {
//           score += this.penalties.WEEKLY_TARGET_MET;
//         } else {
//           score += this.penalties.SUBJECT_OVERLOAD_WEEK * Math.abs(actualCount - targetCount);
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
//           selected.push(population[j]);
//           break;
//         }
//       }
//     }

//     return selected.length ? selected : [...population];
//   }

//   crossover(parent1, parent2) {
//     if (!parent1 || !parent2 || Math.random() > this.crossoverRate) {
//       return parent1 ? JSON.parse(JSON.stringify(parent1)) : 
//              parent2 ? JSON.parse(JSON.stringify(parent2)) : {};
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
//       return schedule ? JSON.parse(JSON.stringify(schedule)) : {};
//     }

//     const mutated = JSON.parse(JSON.stringify(schedule));
//     const divisions = Object.keys(mutated);
//     if (!divisions.length) return mutated;

//     const division = divisions[Math.floor(Math.random() * divisions.length)];
//     const day = this.days[Math.floor(Math.random() * this.days.length)];
//     const period = Math.floor(Math.random() * this.periodsPerDay);

//     if (mutated[division]?.[day]?.[period] !== undefined) {
//       const slot = mutated[division][day][period];
//       if (slot && (slot.subject?.type === 'practical' || slot.subject?.type === 'lab')) {
//         // Clear both consecutive lab slots
//         if (period % 2 === 0 && period + 1 < this.periodsPerDay) {
//           mutated[division][day][period] = null;
//           mutated[division][day][period + 1] = null;
//         } else if (period % 2 === 1 && period - 1 >= 0) {
//           mutated[division][day][period - 1] = null;
//           mutated[division][day][period] = null;
//         } else {
//           mutated[division][day][period] = null;
//         }
//       } else {
//         mutated[division][day][period] = null;
//       }
//     }

//     return mutated;
//   }

//   resolveConflicts(schedule, teachers, classes) {
//     return schedule; // Basic conflict resolution
//   }

//   run(divisions, subjects, teachers, classes) {
//     if (!divisions?.length || !subjects?.length || !teachers?.length || !classes?.length) {
//       console.error('Insufficient data for running algorithm');
//       return this.createEmptySchedule(divisions || []);
//     }

//     let population = this.initializePopulation(divisions, subjects, teachers, classes);
//     let bestSolution = null;
//     let bestFitness = -Infinity;
//     let generationsWithoutImprovement = 0;

//     for (let generation = 0; generation < this.maxGenerations; generation++) {
//       const fitnessScores = population.map(s => this.fitness(s, subjects));
//       const currentBest = Math.max(...fitnessScores);
      
//       if (currentBest > bestFitness) {
//         bestFitness = currentBest;
//         bestSolution = population[fitnessScores.indexOf(currentBest)];
//         generationsWithoutImprovement = 0;
//       } else {
//         generationsWithoutImprovement++;
//       }

//       if (bestFitness >= 500 || generationsWithoutImprovement >= 50) {
//         break;
//       }

//       const selected = this.selection(population, fitnessScores);
//       const newPopulation = [];

//       // Elitism
//       const eliteIndices = [...fitnessScores]
//         .map((score, index) => ({ score, index }))
//         .sort((a, b) => b.score - a.score)
//         .slice(0, this.elitismCount)
//         .map(item => item.index);

//       for (const index of eliteIndices) {
//         newPopulation.push(population[index]);
//       }

//       // Fill with offspring
//       while (newPopulation.length < this.populationSize && selected.length >= 2) {
//         const parent1 = selected[Math.floor(Math.random() * selected.length)];
//         const parent2 = selected[Math.floor(Math.random() * selected.length)];
//         const child = this.crossover(parent1, parent2);
//         newPopulation.push(this.mutate(child));
//       }

//       // Ensure population size
//       while (newPopulation.length < this.populationSize) {
//         newPopulation.push(this.createRandomSchedule(divisions, subjects, teachers, classes));
//       }

//       population = newPopulation;
//     }

//     const finalSolution = bestSolution || 
//                          population[population.map(s => this.fitness(s, subjects)).indexOf(Math.max(...population.map(s => this.fitness(s, subjects))))] || 
//                          this.createEmptySchedule(divisions);

//     return this.resolveConflicts(finalSolution, teachers, classes);
//   }
// }

// export default class GeneticAlgorithm {
//   constructor(config = {}) {
//     // Enhanced configuration with validation
//     this.config = config;
//     this.populationSize = Math.max(50, Math.min(500, config.populationSize || 200));
//     this.maxGenerations = Math.max(100, Math.min(2000, config.maxGenerations || 1000));
//     this.mutationRate = Math.max(0.05, Math.min(0.5, config.mutationRate || 0.2));
//     this.crossoverRate = Math.max(0.5, Math.min(1, config.crossoverRate || 0.9));
//     this.elitismCount = Math.max(1, Math.floor(
//       Math.max(0.05, Math.min(0.3, config.elitismRate || 0.15)) * this.populationSize
//     ));

//     // Validate required fields
//     if (!config.departmentId || !config.semester || !config.academicYear) {
//       throw new Error('Missing required configuration: departmentId, semester, or academicYear');
//     }

//     this.departmentId = config.departmentId;
//     this.semester = config.semester;
//     this.academicYear = config.academicYear;
//     this.divisions = Array.isArray(config.divisions) ? config.divisions : [];
//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     this.periodsPerDay = 6;
    
//     // Enhanced penalty configuration
//     this.penalties = {
//       TEACHER_CLASH: -1000,       // Extremely heavy penalty
//       ROOM_CLASH: -800,           // Very heavy penalty
//       SUBJECT_OVERLOAD_DAY: -100, // Heavy penalty for same subject >2/day
//       SUBJECT_OVERLOAD_WEEK: -80, // Penalty for not meeting weekly targets
//       LAB_NOT_CONSECUTIVE: -500,  // Very heavy penalty
//       LAB_OVERLOAD: -200,         // Heavy penalty for >3 labs/week
//       UNWANTED_FREE: -50,         // Increased penalty for free periods
//       PREFERRED_SLOT: 30,         // Higher bonus for preferred slots
//       FILLED_SLOT: 20,            // Higher bonus for filled slots
//       WEEKLY_TARGET_MET: 100,     // Big bonus for meeting targets
//       PROPER_LAB_PLACEMENT: 50,   // Higher bonus for proper labs
//       TUTORIAL_MISSING: -300,     // Heavy penalty for missing tutorials
//       TUTORIAL_WRONG_SLOT: -200,  // Heavy penalty for tutorials in wrong slots
//       OPTIMAL_DISTRIBUTION: 20    // Bonus for well-distributed schedule
//     };
//   }

//   async generateSchedule({ divisions = [], subjects = [], teachers = [], classes = [] } = {}) {
//     try {
//       // Enhanced input validation
//       if (!divisions.length || !subjects.length || !teachers.length || !classes.length) {
//         throw new Error('Insufficient data: divisions, subjects, teachers, or classes array is empty');
//       }

//       // Verify we have enough teachers and rooms
//       const requiredTeachers = subjects.filter(s => s.type === 'practical' || s.type === 'lab').length * 2;
//       if (teachers.length < requiredTeachers) {
//         throw new Error(`Insufficient teachers: Need at least ${requiredTeachers} for practical subjects`);
//       }

//       const startTime = Date.now();
//       const schedule = this.run(divisions, subjects, teachers, classes);
      
//       if (!schedule) {
//         throw new Error('Failed to generate valid schedule');
//       }

//       return {
//         schedule,
//         metadata: {
//           fitnessScore: this.fitness(schedule, subjects),
//           generation_count: this.maxGenerations,
//           population_size: this.populationSize,
//           conflictsResolved: true,
//           algorithm_version: '3.5.0',
//           executionTime: `${(Date.now() - startTime) / 1000} seconds`
//         }
//       };
//     } catch (err) {
//       console.error('Schedule generation error:', err);
//       throw new Error(`Failed to generate schedule: ${err.message}`);
//     }
//   }

//   initializePopulation(divisions, subjects, teachers, classes) {
//     const population = [];
//     for (let i = 0; i < this.populationSize; i++) {
//       try {
//         const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes);
//         population.push(schedule);
//       } catch (error) {
//         console.warn('Failed to create random schedule, using empty one:', error);
//         population.push(this.createEmptySchedule(divisions));
//       }
//     }
//     return population;
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

// //   createRandomSchedule(divisions, subjects, teachers, classes) {
// //     const schedule = {};
// //     const maxLabsPerWeek = 3; // Strict limit of 3 lab sessions per week
// //     const maxTutorialsPerWeek = 2; // Strict limit of 2 tutorials per week

// //     // Categorize resources
// //     const theorySubs = subjects.filter(s => s.type === 'theory');
// //     const practicals = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
// //     const tutorials = subjects.filter(s => s.type === 'tutorial');
// //     const regularRooms = classes.filter(c => !(c.classNumber?.toLowerCase().includes('lab')));
// //     const labRooms = classes.filter(c => (c.classNumber?.toLowerCase().includes('lab')));

// //     // Helper functions
// //     // const getAvailableTeachers = (subject) => {
// //     //   if (!subject || !teachers.length) return [];
// //     //   return teachers.filter(t => 
// //     //     t.semester && subject.semester && +t.semester === +subject.semester
// //     //   );
// //     // };

// //    const getAvailableTeachers = (subject) => {
// //   if (!subject || !teachers.length) return [];
// //   return teachers.filter(t =>
// //     (subject.teacherId && t._id === subject.teacherId) ||
// //     (subject.teacherName && 
// //      t.name.trim().toLowerCase() === subject.teacherName.trim().toLowerCase())
// //   );
// // };


// //     const pickRandom = (arr) => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;

// //     for (const division of divisions) {
// //       schedule[division] = {};
// //       const labCounts = new Map();
// //       const tutorialCounts = new Map();

// //       // Shuffle days for better distribution
// //       const shuffledDays = [...this.days].sort(() => Math.random() - 0.5);

// //       for (const day of shuffledDays) {
// //         schedule[division][day] = new Array(this.periodsPerDay).fill(null);
// //         const subjectDayCount = new Map();

// //         // 1) First schedule labs in their preferred slots (1-2, 3-4, 5-6)
// //         for (let p = 0; p < this.periodsPerDay; p += 2) {
// //           const availableLabs = practicals.filter(subj => {
// //             const weeklyCount = labCounts.get(subj._id) || 0;
// //             return weeklyCount < maxLabsPerWeek && 
// //                    (subjectDayCount.get(subj._id) || 0) < 1; // Max 1 lab per day
// //           });

// //           if (availableLabs.length && p + 1 < this.periodsPerDay) {
// //             const labSubj = pickRandom(availableLabs);
// //             const labTeachers = getAvailableTeachers(labSubj);
// //             const teacher = pickRandom(labTeachers);
// //             const labRoom = pickRandom(labRooms) || pickRandom(regularRooms);

// //             if (labSubj && teacher && labRoom) {
// //               const slot = {
// //                 period: p + 1,
// //                 subject: { 
// //                   _id: labSubj._id, 
// //                   subjectName: labSubj.subjectName || labSubj.name, 
// //                   type: 'lab' 
// //                 },
// //                 teacher: { _id: teacher._id, name: teacher.name },
// //                 classroom: { _id: labRoom._id, room_number: labRoom.classNumber }
// //               };

// //               schedule[division][day][p] = slot;
// //               schedule[division][day][p + 1] = { ...slot, period: p + 2 };
// //               labCounts.set(labSubj._id, (labCounts.get(labSubj._id) || 0) + 1);
// //               subjectDayCount.set(labSubj._id, (subjectDayCount.get(labSubj._id) || 0) + 1);
// //             }
// //           }
// //         }

// //         // 2) Schedule tutorials in their required slots (5-6 only)
// //         const tutorialSlots = [4, 5]; // Periods 5-6 (0-based)
// //         for (const p of tutorialSlots) {
// //           if (schedule[division][day][p]) continue; // Skip if already filled

// //           const availableTutorials = tutorials.filter(tut => {
// //             const weeklyCount = tutorialCounts.get(tut._id) || 0;
// //             return weeklyCount < maxTutorialsPerWeek && 
// //                    (subjectDayCount.get(tut._id) || 0) < 1; // Max 1 tutorial per day
// //           });

// //           if (availableTutorials.length) {
// //             const tutorial = pickRandom(availableTutorials);
// //             const tutorTeachers = getAvailableTeachers(tutorial);
// //             const teacher = pickRandom(tutorTeachers);
// //             const room = pickRandom(regularRooms);

// //             if (tutorial && teacher && room) {
// //               schedule[division][day][p] = {
// //                 period: p + 1,
// //                 subject: { 
// //                   _id: tutorial._id, 
// //                   subjectName: tutorial.subjectName || tutorial.name, 
// //                   type: 'tutorial' 
// //                 },
// //                 teacher: { _id: teacher._id, name: teacher.name },
// //                 classroom: { _id: room._id, room_number: room.classNumber }
// //               };
// //               tutorialCounts.set(tutorial._id, (tutorialCounts.get(tutorial._id) || 0) + 1);
// //               subjectDayCount.set(tutorial._id, (subjectDayCount.get(tutorial._id) || 0) + 1);
// //             }
// //           }
// //         }

// //         // 3) Fill remaining slots with theory subjects
// //         for (let p = 0; p < this.periodsPerDay; p++) {
// //           if (schedule[division][day][p]) continue; // Skip filled slots

// //           const availableTheory = theorySubs.filter(theory => {
// //             const weeklyCount = subjectDayCount.get(theory._id) || 0;
// //             return weeklyCount < (theory.lecturePerWeek || 4) && 
// //                    (subjectDayCount.get(theory._id) || 0) < 2; // Max 2 per day
// //           });

// //           if (availableTheory.length) {
// //             const theory = pickRandom(availableTheory);
// //             const theoryTeachers = getAvailableTeachers(theory);
// //             const teacher = pickRandom(theoryTeachers);
// //             const room = pickRandom(regularRooms);

// //             if (theory && teacher && room) {
// //               schedule[division][day][p] = {
// //                 period: p + 1,
// //                 subject: { 
// //                   _id: theory._id, 
// //                   subjectName: theory.subjectName || theory.name, 
// //                   type: 'theory' 
// //                 },
// //                 teacher: { _id: teacher._id, name: teacher.name },
// //                 classroom: { _id: room._id, room_number: room.classNumber }
// //               };
// //               subjectDayCount.set(theory._id, (subjectDayCount.get(theory._id) || 0) + 1);
// //             }
// //           }
// //         }
// //       }
// //     }
// //     return schedule;
// //   }

// getAvailableTeachers = (subject) => {
//   if (!subject || !teachers.length) return [];

//   // First try to match by subject-teacher mapping
//   const mappedTeachers = teachers.filter(t => {
//     // Check if teacher is assigned to this subject via subject_ids array
//     return t.subject_ids && t.subject_ids.includes(subject._id);
//   });

//   if (mappedTeachers.length > 0) {
//     return mappedTeachers;
//   }

//   // Fallback: Match by semester if no direct mapping exists
//   return teachers.filter(t => 
//     t.semester && subject.semester && 
//     t.semester.toString() === subject.semester.toString()
//   );
// };



// // createRandomSchedule(divisions, subjects, teachers, classes) {
// //   const schedule = {};
// //   this.periodsPerDay = 6;

// //   // Prepare helpful buckets
// //   const theorySubs = subjects.filter(s => s.type === 'theory');
// //   const practicals = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
// //   const tutorials = subjects.filter(s => s.type === 'tutorial');
// //   const regularRooms = classes.filter(c => !(c.classNumber?.toLowerCase().includes('lab')));
// //   const labRooms = classes.filter(c => c.classNumber?.toLowerCase().includes('lab'));

// //   const getAvailableTeachers = (subject) => {
// //     if (!subject || !teachers.length) return [];

// //     // ✅ Match strictly by teacherId or teacherName
// //     return teachers.filter(t =>
// //       (subject.teacherId && t._id === subject.teacherId) ||
// //       (subject.teacherName &&
// //         t.name.trim().toLowerCase() === subject.teacherName.trim().toLowerCase())
// //   );
// // };

// //   const pickRandom = (arr) => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;

// //   for (const division of divisions) {
// //     schedule[division] = {};
// //     for (const day of this.days) {
// //       schedule[division][day] = new Array(this.periodsPerDay).fill(null);
// //       const subjectDayCount = {};
      
// //       let period = 0;
// //       while (period < this.periodsPerDay) {

// //         // BLOCK PRACTICAL check
// //         const isPracticalSlot = (period === 0 || period === 2); // 1-2 OR 3-4 slots only

// //         let chosenSub = null;

// //         // (1) Try practical in block positions
// //         if (isPracticalSlot) {
// //           const availablePract = practicals.filter(p => (subjectDayCount[p._id] || 0) < 1);
// //           if (availablePract.length > 0) {
// //             chosenSub = availablePract[Math.floor(Math.random() * availablePract.length)];

// //             // assign teacher & lab
// //             const eligTeach = getAvailableTeachers(chosenSub);
// //             const teacher   = eligTeach[Math.floor(Math.random() * eligTeach.length)] || null;
// //             const lab       = labRooms[Math.floor(Math.random() * labRooms.length)] || null;

// //             if (teacher && lab) {
// //               const slot = {
// //                 period  : period + 1,
// //                 subject : { _id: chosenSub._id, subjectName: chosenSub.subjectName || chosenSub.name, type:'practical' },
// //                 teacher : teacher ? { _id: teacher._id, name: teacher.name } : null,
// //                 classroom: lab ? { _id: lab._id, room_number: lab.classNumber } : null
// //               };
// //               schedule[division][day][period]     = slot;
// //               schedule[division][day][period + 1] = { ...slot, period: period + 2 };
// //               subjectDayCount[chosenSub._id] = (subjectDayCount[chosenSub._id] || 0) + 1;
// //               period += 2;
// //               continue;
// //             }
// //           }
// //         }

// //         // (2) Prefer putting tutorial in P5 or P6
// //         if ((period === 4 || period === 5) && tutorials.length > 0) {
// //           const availableTut = tutorials.filter(t => (subjectDayCount[t._id] || 0) < 1);
// //           if (availableTut.length > 0) {
// //             chosenSub = availableTut[Math.floor(Math.random() * availableTut.length)];
// //             const eligTeach = getAvailableTeachers(chosenSub);
// //             const teacher   = eligTeach[Math.floor(Math.random() * eligTeach.length)] || null;
// //             const room      = regularRooms[Math.floor(Math.random() * regularRooms.length)] || null;

// //             if (teacher && room) {
// //               schedule[division][day][period] = {
// //                 period : period + 1,
// //                 subject: { _id: chosenSub._id, subjectName: chosenSub.subjectName || chosenSub.name, type:'tutorial' },
// //                 teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
// //                 classroom: room ? { _id: room._id, room_number: room.classNumber } : null
// //               };
// //               subjectDayCount[chosenSub._id] = (subjectDayCount[chosenSub._id] || 0) + 1;
// //               period++;
// //               continue;
// //             }
// //           }
// //         }

// //         // (3) Regular theory
// //         const availableTheory = theorySubs.filter(s => (subjectDayCount[s._id] || 0) < 2);
// //         if (availableTheory.length > 0) {
// //           chosenSub = availableTheory[Math.floor(Math.random() * availableTheory.length)];
// //           const eligTeach = getAvailableTeachers(chosenSub);
// //           const teacher   = eligTeach[Math.floor(Math.random() * eligTeach.length)] || null;
// //           const room      = regularRooms[Math.floor(Math.random() * regularRooms.length)] || null;

// //           if (teacher && room) {
// //             schedule[division][day][period] = {
// //               period : period + 1,
// //               subject: { _id: chosenSub._id, subjectName: chosenSub.subjectName || chosenSub.name, type:'theory' },
// //               teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
// //               classroom: room ? { _id: room._id, room_number: room.classNumber } : null
// //             };
// //             subjectDayCount[chosenSub._id] = (subjectDayCount[chosenSub._id] || 0) + 1;
// //           }
// //         }

// //         period++;
// //       }
// //     }
// //   }
// //   return schedule;
// // }

// createRandomSchedule(divisions, subjects, teachers, classes) {
//   const schedule = {};
//   this.periodsPerDay = 6;

//   // Enhanced categorization
//   const theorySubs = subjects.filter(s => s.type === 'theory');
//   const practicals = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
//   const tutorials = subjects.filter(s => s.type === 'tutorial');
//   const regularRooms = classes.filter(c => !(c.classNumber?.toLowerCase().includes('lab')));
//   const labRooms = classes.filter(c => c.classNumber?.toLowerCase().includes('lab'));

//   // Weekly tracking
//   const weeklySubjectCount = new Map();
//   const maxTheoryPerWeek = 4;
//   const maxLabsPerWeek = 3;
//   const maxTutorialsPerWeek = 2;

//   for (const division of divisions) {
//     schedule[division] = {};
    
//     for (const day of this.days) {
//       schedule[division][day] = new Array(this.periodsPerDay).fill(null);
//       const subjectDayCount = new Map();
      
//       let period = 0;
//       while (period < this.periodsPerDay) {
//         // Lab slots (1-2 or 3-4)
//         if ((period === 0 || period === 2) && practicals.length > 0) {
//           const availableLabs = practicals.filter(lab => {
//             const weekCount = weeklySubjectCount.get(`${division}_${lab._id}`) || 0;
//             const dayCount = subjectDayCount.get(lab._id) || 0;
//             return weekCount < maxLabsPerWeek && dayCount < 1;
//           });

//           if (availableLabs.length) {
//             const lab = availableLabs[Math.floor(Math.random() * availableLabs.length)];
//             const labTeachers = getAvailableTeachers(lab);
            
//             if (labTeachers.length && labRooms.length) {
//               const teacher = labTeachers[Math.floor(Math.random() * labTeachers.length)];
//               const room = labRooms[Math.floor(Math.random() * labRooms.length)];

//               const labSlot = {
//                 period: period + 1,
//                 subject: {
//                   _id: lab._id,
//                   name: lab.name,
//                   type: 'lab'
//                 },
//                 teacher: {
//                   _id: teacher._id,
//                   name: teacher.name
//                 },
//                 classroom: {
//                   _id: room._id,
//                   room_number: room.classNumber
//                 },
//                 start_time: this.getTimeForPeriod(period).start,
//                 end_time: this.getTimeForPeriod(period + 1).end
//               };

//               schedule[division][day][period] = labSlot;
//               schedule[division][day][period + 1] = {...labSlot, period: period + 2};
              
//               weeklySubjectCount.set(`${division}_${lab._id}`, 
//                 (weeklySubjectCount.get(`${division}_${lab._id}`) || 0) + 1);
//               subjectDayCount.set(lab._id, 1);
              
//               period += 2;
//               continue;
//             }
//           }
//         }

//         // Theory slots
//         const availableTheory = theorySubs.filter(theory => {
//           const weekCount = weeklySubjectCount.get(`${division}_${theory._id}`) || 0;
//           const dayCount = subjectDayCount.get(theory._id) || 0;
//           return weekCount < maxTheoryPerWeek && dayCount < 2;
//         });

//         if (availableTheory.length) {
//           const theory = availableTheory[Math.floor(Math.random() * availableTheory.length)];
//           const theoryTeachers = getAvailableTeachers(theory);
          
//           if (theoryTeachers.length && regularRooms.length) {
//             const teacher = theoryTeachers[Math.floor(Math.random() * theoryTeachers.length)];
//             const room = regularRooms[Math.floor(Math.random() * regularRooms.length)];

//             schedule[division][day][period] = {
//               period: period + 1,
//               subject: {
//                 _id: theory._id,
//                 name: theory.name,
//                 type: 'theory'
//               },
//               teacher: {
//                 _id: teacher._id,
//                 name: teacher.name
//               },
//               classroom: {
//                 _id: room._id,
//                 room_number: room.classNumber
//               },
//               start_time: this.getTimeForPeriod(period).start,
//               end_time: this.getTimeForPeriod(period).end
//             };

//             weeklySubjectCount.set(`${division}_${theory._id}`,
//               (weeklySubjectCount.get(`${division}_${theory._id}`) || 0) + 1);
//             subjectDayCount.set(theory._id, (subjectDayCount.get(theory._id) || 0) + 1);
//           }
//         }

//         period++;
//       }
//     }
//   }

//   return schedule;
// }





//   fitness(schedule, subjects) {
//     if (!schedule) return -Infinity;
    
//     let score = 0;
//     const teacherSlots = new Map();
//     const roomSlots = new Map();
//     const weeklySubjectCount = new Map();
//     const labCounts = new Map();
//     const tutorialCounts = new Map();

//     // Distribution tracking
//     const dailyLoad = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 };

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

//           dailyLoad[day]++; // Track daily load for distribution

//           score += this.penalties.FILLED_SLOT;

//           // Track subject counts
//           const subjectId = slot.subject?._id;
//           if (subjectId) {
//             subjectDayCount.set(subjectId, (subjectDayCount.get(subjectId) || 0) + 1);
//             weeklySubjectCount.set(subjectId, (weeklySubjectCount.get(subjectId) || 0) + 1);
            
//             // Daily subject limit
//             if (subjectDayCount.get(subjectId) > 2) {
//               score += this.penalties.SUBJECT_OVERLOAD_DAY;
//             }
//           }

//           // Track lab counts
//           if (slot.subject?.type === 'lab') {
//             const labKey = `${division}_${slot.subject._id}`;
//             labCounts.set(labKey, (labCounts.get(labKey) || 0) + 0.5); // Each slot counts as 0.5
//           }

//           // Track tutorial counts
//           if (slot.subject?.type === 'tutorial') {
//             const tutKey = `${division}_${slot.subject._id}`;
//             tutorialCounts.set(tutKey, (tutorialCounts.get(tutKey) || 0) + 1);
//           }

//           // Teacher conflicts
//           const teacherId = slot.teacher?._id;
//           if (teacherId) {
//             const teacherKey = `${teacherId}_${day}_${i}`;
//             if (teacherSlots.has(teacherKey)) {
//               score += this.penalties.TEACHER_CLASH;
//             } else {
//               teacherSlots.set(teacherKey, true);
//             }
//           }

//           // Room conflicts
//           const roomId = slot.classroom?._id;
//           if (roomId) {
//             const roomKey = `${roomId}_${day}_${i}`;
//             if (roomSlots.has(roomKey)) {
//               score += this.penalties.ROOM_CLASH;
//             } else {
//               roomSlots.set(roomKey, true);
//             }
//           }

//           // Slot preference bonuses/penalties
//           if (slot.subject?.type === 'lab') {
//             // Lab must be in consecutive pairs at valid positions
//             if (i % 2 === 0 && i + 1 < daySlots.length) {
//               const nextSlot = daySlots[i + 1];
//               if (nextSlot && nextSlot.subject?._id === slot.subject?._id) {
//                 score += this.penalties.PROPER_LAB_PLACEMENT;
//                 // Prefer earlier slots for labs
//                 if (i === 0) score += this.penalties.PREFERRED_SLOT * 3;
//                 else if (i === 2) score += this.penalties.PREFERRED_SLOT * 2;
//                 else if (i === 4) score += this.penalties.PREFERRED_SLOT;
//               } else {
//                 score += this.penalties.LAB_NOT_CONSECUTIVE;
//               }
//             }
//           } else if (slot.subject?.type === 'theory') {
//             // Theory prefers slots 1-4
//             if (i <= 3) {
//               score += this.penalties.PREFERRED_SLOT;
//             }
//           } else if (slot.subject?.type === 'tutorial') {
//             // Tutorial MUST be in slots 5-6
//             if (i >= 4) {
//               score += this.penalties.PREFERRED_SLOT * 3; // High bonus for correct slot
//             } else {
//               score += this.penalties.TUTORIAL_WRONG_SLOT; // Penalty for wrong slot
//             }
//           }
//         }
//       }
      
//       // Check weekly lab limits (max 3)
//       for (const [labKey, count] of labCounts) {
//         if (count > 3) {
//           score += this.penalties.LAB_OVERLOAD * (count - 3);
//         } else if (count === 3) {
//           score += this.penalties.WEEKLY_TARGET_MET;
//         }
//       }

//       // Check tutorial requirements (min 1, max 2)
//       for (const subject of subjects.filter(s => s.type === 'tutorial')) {
//         const count = tutorialCounts.get(subject._id) || 0;
//         if (count === 0) {
//           score += this.penalties.TUTORIAL_MISSING;
//         } else if (count > 2) {
//           score += this.penalties.SUBJECT_OVERLOAD_WEEK * (count - 2);
//         } else {
//           score += this.penalties.WEEKLY_TARGET_MET;
//         }
//       }

//       // Check distribution (penalize uneven daily loads)
//       const dailyLoads = Object.values(dailyLoad);
//       const avgLoad = dailyLoads.reduce((a, b) => a + b, 0) / dailyLoads.length;
//       for (const load of dailyLoads) {
//         score += this.penalties.OPTIMAL_DISTRIBUTION * (1 - Math.abs(load - avgLoad) / avgLoad);
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
//           selected.push(population[j]);
//           break;
//         }
//       }
//     }

//     return selected.length ? selected : [...population];
//   }

//   crossover(parent1, parent2) {
//     if (!parent1 || !parent2 || Math.random() > this.crossoverRate) {
//       return parent1 ? JSON.parse(JSON.stringify(parent1)) : 
//              parent2 ? JSON.parse(JSON.stringify(parent2)) : {};
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
//       return schedule ? JSON.parse(JSON.stringify(schedule)) : {};
//     }

//     const mutated = JSON.parse(JSON.stringify(schedule));
//     const divisions = Object.keys(mutated);
//     if (!divisions.length) return mutated;

//     const mutationType = Math.random();

//     if (mutationType < 0.6) {
//       // Clear a random slot (60% chance)
//       const division = divisions[Math.floor(Math.random() * divisions.length)];
//       const day = this.days[Math.floor(Math.random() * this.days.length)];
//       const period = Math.floor(Math.random() * this.periodsPerDay);

//       if (mutated[division]?.[day]?.[period] !== undefined) {
//         mutated[division][day][period] = null;
//       }
//     } else if (mutationType < 0.9) {
//       // Swap two random slots (30% chance)
//       const division = divisions[Math.floor(Math.random() * divisions.length)];
//       const day = this.days[Math.floor(Math.random() * this.days.length)];
//       const period1 = Math.floor(Math.random() * this.periodsPerDay);
//       const period2 = Math.floor(Math.random() * this.periodsPerDay);

//       if (mutated[division]?.[day]?.[period1] !== undefined && 
//           mutated[division]?.[day]?.[period2] !== undefined) {
//         const temp = mutated[division][day][period1];
//         mutated[division][day][period1] = mutated[division][day][period2];
//         mutated[division][day][period2] = temp;
//       }
//     } else {
//       // Shift a block (10% chance)
//       const division = divisions[Math.floor(Math.random() * divisions.length)];
//       const day = this.days[Math.floor(Math.random() * this.days.length)];
//       const start = Math.floor(Math.random() * (this.periodsPerDay - 1));
//       const end = Math.min(start + Math.floor(Math.random() * 2) + 1, this.periodsPerDay);
//       const direction = Math.random() > 0.5 ? 1 : -1;

//       if (mutated[division]?.[day]) {
//         const slots = [...mutated[division][day]];
//         const block = slots.slice(start, end);
        
//         if (direction > 0 && end < this.periodsPerDay) {
//           // Shift right
//           for (let i = end; i < this.periodsPerDay; i++) {
//             slots[i - (end - start)] = slots[i];
//           }
//           for (let i = 0; i < block.length; i++) {
//             slots[this.periodsPerDay - block.length + i] = block[i];
//           }
//         } else if (direction < 0 && start > 0) {
//           // Shift left
//           for (let i = start - 1; i >= 0; i--) {
//             slots[i + (end - start)] = slots[i];
//           }
//           for (let i = 0; i < block.length; i++) {
//             slots[i] = block[i];
//           }
//         }
        
//         mutated[division][day] = slots;
//       }
//     }

//     return mutated;
//   }

//   resolveConflicts(schedule, teachers, classes) {
//     const resolved = JSON.parse(JSON.stringify(schedule));
//     const teacherAllocations = new Map();
//     const roomAllocations = new Map();

//     for (const division in resolved) {
//       for (const day of this.days) {
//         const daySlots = resolved[division][day] || [];
        
//         for (let i = 0; i < daySlots.length; i++) {
//           const slot = daySlots[i];
//           if (!slot) continue;

//           const teacherKey = slot.teacher?._id ? `${slot.teacher._id}_${day}_${i}` : null;
//           const roomKey = slot.classroom?._id ? `${slot.classroom._id}_${day}_${i}` : null;

//           if ((teacherKey && teacherAllocations.has(teacherKey)) || 
//               (roomKey && roomAllocations.has(roomKey))) {
//             daySlots[i] = null;
//           } else {
//             if (teacherKey) teacherAllocations.set(teacherKey, true);
//             if (roomKey) roomAllocations.set(roomKey, true);
//           }
//         }
//       }
//     }

//     return resolved;
//   }

//   fillRemainingSlots(schedule, subjects, teachers, classes) {
//     const theorySubs = subjects.filter(s => s.type === 'theory');
//     const regularRooms = classes.filter(c => !(c.classNumber?.toLowerCase().includes('lab')));

//     for (const division in schedule) {
//       for (const day of this.days) {
//         for (let p = 0; p < this.periodsPerDay; p++) {
//           if (!schedule[division][day][p]) {
//             // Try to fill with theory subject
//             const availableTheory = theorySubs.filter(theory => {
//               // Check weekly count
//               let weeklyCount = 0;
//               for (const d of this.days) {
//                 weeklyCount += schedule[division][d]?.filter(s => 
//                   s?.subject?._id === theory._id
//                 ).length || 0;
//               }
//               return weeklyCount < (theory.lecturePerWeek || 4);
//             });

//             if (availableTheory.length) {
//               const theory = availableTheory[Math.floor(Math.random() * availableTheory.length)];
//               const theoryTeachers = teachers.filter(t => 
//                 t.semester && theory.semester && +t.semester === +theory.semester
//               );
//               const teacher = theoryTeachers[Math.floor(Math.random() * theoryTeachers.length)] || null;
//               const room = regularRooms[Math.floor(Math.random() * regularRooms.length)] || null;

//               if (theory && teacher && room) {
//                 schedule[division][day][p] = {
//                   period: p + 1,
//                   subject: { 
//                     _id: theory._id, 
//                     subjectName: theory.subjectName || theory.name, 
//                     type: 'theory' 
//                   },
//                   teacher: { _id: teacher._id, name: teacher.name },
//                   classroom: { _id: room._id, room_number: room.classNumber }
//                 };
//               }
//             }
//           }
//         }
//       }
//     }
//     return schedule;
//   }

//   run(divisions, subjects, teachers, classes) {
//     if (!divisions?.length || !subjects?.length || !teachers?.length || !classes?.length) {
//       console.error('Insufficient data for running algorithm');
//       return this.createEmptySchedule(divisions || []);
//     }

//     let population = this.initializePopulation(divisions, subjects, teachers, classes);
//     let bestSolution = null;
//     let bestFitness = -Infinity;
//     let generationsWithoutImprovement = 0;

//     for (let generation = 0; generation < this.maxGenerations; generation++) {
//       const fitnessScores = population.map(s => this.fitness(s, subjects));
//       const currentBest = Math.max(...fitnessScores);
      
//       if (currentBest > bestFitness) {
//         bestFitness = currentBest;
//         bestSolution = population[fitnessScores.indexOf(currentBest)];
//         generationsWithoutImprovement = 0;
//       } else {
//         generationsWithoutImprovement++;
//       }

//       // Early termination conditions
//       if (bestFitness >= 2000 || generationsWithoutImprovement >= 50) {
//         break;
//       }

//       const selected = this.selection(population, fitnessScores);
//       const newPopulation = [];

//       // Elitism: keep best solutions
//       const eliteIndices = [...fitnessScores]
//         .map((score, index) => ({ score, index }))
//         .sort((a, b) => b.score - a.score)
//         .slice(0, this.elitismCount)
//         .map(item => item.index);

//       for (const index of eliteIndices) {
//         newPopulation.push(population[index]);
//       }

//       // Fill rest of population with offspring
//       while (newPopulation.length < this.populationSize && selected.length >= 2) {
//         const parent1 = selected[Math.floor(Math.random() * selected.length)];
//         const parent2 = selected[Math.floor(Math.random() * selected.length)];
//         const child = this.crossover(parent1, parent2);
//         newPopulation.push(this.mutate(child));
//       }

//       population = newPopulation;
//     }

//     // Get the best solution
//     const finalSolution = bestSolution || 
//                          population[population.map(s => this.fitness(s, subjects)).indexOf(Math.max(...population.map(s => this.fitness(s, subjects))))] || 
//                          this.createEmptySchedule(divisions);

//     // Post-processing
//     const conflictFree = this.resolveConflicts(finalSolution, teachers, classes);
//     return this.fillRemainingSlots(conflictFree, subjects, teachers, classes);
//   }
// }

// imp imp 
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
      SUBJECT_OVERLOAD_DAY: -40,
      SUBJECT_OVERLOAD_WEEK: -60,
      LAB_NOT_CONSECUTIVE: -80,
      LAB_WRONG_SLOT: -50,
      UNWANTED_FREE: -10,
      PREFERRED_SLOT: 20,
      FILLED_SLOT: 10,
      WEEKLY_TARGET_MET: 30,
      PROPER_LAB_PLACEMENT: 25,
      TUTORIAL_WRONG_SLOT: -30
    };
  }

  async generateSchedule({ divisions = [], subjects = [], teachers = [], classes = [] } = {}) {
    if (!divisions.length || !subjects.length || !teachers.length || !classes.length) {
      throw new Error('Insufficient data: divisions, subjects, teachers, or classes array is empty');
    }
    const startTime = Date.now();
    const schedule = this.run(divisions, subjects, teachers, classes);

    if (!schedule) {
      throw new Error('Failed to generate valid schedule');
    }

    return {
      schedule,
      metadata: {
        fitnessScore: this.fitness(schedule, subjects),
        generation_count: this.maxGenerations,
        population_size: this.populationSize,
        conflictsResolved: true,
        algorithm_version: '3.2.0',
        executionTime: `${(Date.now() - startTime) / 1000} seconds`
      }
    };
  }

  initializePopulation(divisions, subjects, teachers, classes) {
    const population = [];
    for (let i = 0; i < this.populationSize; i++) {
      try {
        const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes);
        population.push(schedule);
      } catch (error) {
        population.push(this.createEmptySchedule(divisions));
      }
    }
    return population;
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

  createRandomSchedule(divisions, subjects, teachers, classes) {
  const schedule = {};

  // Categorize subjects
  const theorySubjects = subjects.filter(s => s.type === 'theory');
  const practicalSubjects = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
  const tutorialSubjects = subjects.filter(s => s.type === 'tutorial');

  // Categorize rooms
  const regularRooms = classes.filter(c => c.classNumber && !c.classNumber.toLowerCase().includes('lab'));
  const labRooms = classes.filter(c => c.classNumber && c.classNumber.toLowerCase().includes('lab'));
  const allRooms = [...regularRooms, ...labRooms];

  const pickRandom = arr => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;

  // const getAvailableTeachers = (subject) => {
  //   if (!subject || !teachers.length) return [];
  //   let available = teachers.filter(t => t.semester && subject.sem_id && t.semester.toString() === subject.sem_id.toString());
  //   if (!available.length) available = [...teachers];
  //   return available;
  // };

const getAvailableTeachers = (subject) => {
  if (!subject || !teachers.length) return [];

  // Try teachers specifically assigned to this subject
  let available = teachers.filter(t => subject.teacherIds?.includes(t._id));

  // If none found, fallback to same semester
  if (!available.length) {
    available = teachers.filter(t => t.semester?.toString() === subject.sem_id?.toString());
  }

  // Final fallback: pick any teacher
  if (!available.length) available = [...teachers];

  return available;
};


  // Initialize schedule
  for (const division of divisions) {
    schedule[division] = {};
    for (const day of this.days) {
      schedule[division][day] = new Array(this.periodsPerDay).fill(null);
    }
  }

  const createWeeklyPlan = () => {
    const plan = [];

    theorySubjects.forEach(subject => {
      const sessions = Math.min(parseInt(subject.lecturePerWeek) || 3, 4);
      for (let i = 0; i < sessions; i++) plan.push({ subject, type: 'theory', preferredSlots: [0,1,2,3,4,5], priority: 2 });
    });

    practicalSubjects.forEach(subject => {
      for (let i = 0; i < 3; i++) plan.push({ subject, type: 'lab_session', preferredSlots: [0,2,4], priority: 1 });
    });

    tutorialSubjects.forEach(subject => {
      const sessions = Math.min(parseInt(subject.lecturePerWeek) || 2, 2);
      for (let i = 0; i < sessions; i++) plan.push({ subject, type: 'tutorial', preferredSlots: [4,5], priority: 3 });
    });

    return plan.sort((a,b) => a.priority - b.priority);
  };

  for (const division of divisions) {
    const weeklyPlan = createWeeklyPlan();
    const subjectWeeklyCount = new Map();

    for (const item of weeklyPlan) {
      const maxWeekly = item.type === 'tutorial' ? 2 : item.type === 'lab_session' ? 3 : parseInt(item.subject.lecturePerWeek) || 3;
      if ((subjectWeeklyCount.get(item.subject._id) || 0) >= maxWeekly) continue;

      // Shuffle days
      const shuffledDays = [...this.days].sort(() => Math.random() - 0.5);
      let scheduled = false;

      for (const day of shuffledDays) {
        if (scheduled) break;

        const daySchedule = schedule[division][day];

        // Daily limit: max 1, allow 2 only if no other days available
        const countToday = daySchedule.filter(slot => slot?.subject?._id === item.subject._id).length;
        const otherDaysAvailable = this.days.some(d => d !== day && !schedule[division][d].some(slot => slot?.subject?._id === item.subject._id));
        if (countToday >= 1 && otherDaysAvailable) continue;
        if (countToday >= 2) continue;

        if (item.type === 'lab_session') {
          for (const startSlot of item.preferredSlots) {
            if (startSlot + 1 < this.periodsPerDay && !daySchedule[startSlot] && !daySchedule[startSlot + 1]) {
              const teacher = pickRandom(getAvailableTeachers(item.subject));
              const room = pickRandom(labRooms.length ? labRooms : allRooms);
              if (teacher && room) {
                const labSlot = { period: startSlot+1, subject: { _id:item.subject._id, subjectName:item.subject.subjectName, type:'practical' }, teacher:{_id:teacher._id, name:teacher.name}, classroom:{_id:room._id, room_number:room.classNumber} };
                daySchedule[startSlot] = labSlot;
                daySchedule[startSlot+1] = { ...labSlot, period: startSlot+2 };
                scheduled = true;
                break;
              }
            }
          }
        } else {
          for (const slot of item.preferredSlots) {
            if (!daySchedule[slot]) {
              const teacher = pickRandom(getAvailableTeachers(item.subject));
              const room = pickRandom(item.type === 'tutorial' ? regularRooms : allRooms);
              if (teacher && room) {
                daySchedule[slot] = { period: slot+1, subject: { _id:item.subject._id, subjectName:item.subject.subjectName, type:item.subject.type }, teacher:{_id:teacher._id, name:teacher.name}, classroom:{_id:room._id, room_number:room.classNumber} };
                scheduled = true;
                break;
              }
            }
          }
        }
      }

      if (scheduled) subjectWeeklyCount.set(item.subject._id, (subjectWeeklyCount.get(item.subject._id) || 0)+1);
    }
  }

  return schedule;
}





  fitness(schedule, subjects) {
    if (!schedule) return -Infinity;

    let score = 0;
    const teacherSlots = new Map();
    const roomSlots = new Map();

    for (const division in schedule) {
      const weeklySubjectCount = new Map();

      for (const day of this.days) {
        const daySlots = schedule[division][day] || [];
        const subjectDayCount = new Map();

        for (let i = 0; i < daySlots.length; i++) {
          const slot = daySlots[i];
          if (!slot) { score += this.penalties.UNWANTED_FREE; continue; }
          score += this.penalties.FILLED_SLOT;

          const subjectId = slot.subject?._id;
          if (subjectId) {
            subjectDayCount.set(subjectId, (subjectDayCount.get(subjectId) || 0) + 1);
            weeklySubjectCount.set(subjectId, (weeklySubjectCount.get(subjectId) || 0) + 1);

            // Daily limit penalty: max 1 per day, penalize if more than 1
            if (subjectDayCount.get(subjectId) > 1) score += this.penalties.SUBJECT_OVERLOAD_DAY;
          }

          // Teacher conflicts
          const teacherId = slot.teacher?._id;
          if (teacherId) {
            const teacherKey = `${teacherId}_${day}_${i}`;
            if (teacherSlots.has(teacherKey)) score += this.penalties.TEACHER_CLASH;
            else teacherSlots.set(teacherKey, true);
          }

          // Room conflicts
          const roomId = slot.classroom?._id;
          if (roomId) {
            const roomKey = `${roomId}_${day}_${i}`;
            if (roomSlots.has(roomKey)) score += this.penalties.ROOM_CLASH;
            else roomSlots.set(roomKey, true);
          }

          // Slot preferences
          if (slot.subject?.type === 'practical' || slot.subject?.type === 'lab') {
            if (i % 2 === 0 && i + 1 < daySlots.length) {
              const nextSlot = daySlots[i + 1];
              if (nextSlot && nextSlot.subject?._id === slot.subject?._id) {
                score += this.penalties.PROPER_LAB_PLACEMENT;
                if (i === 0) score += this.penalties.PREFERRED_SLOT * 3;
                else if (i === 2) score += this.penalties.PREFERRED_SLOT * 2;
                else if (i === 4) score += this.penalties.PREFERRED_SLOT;
              } else score += this.penalties.LAB_NOT_CONSECUTIVE;
            }
          } else if (slot.subject?.type === 'theory') {
            if (i <= 3) score += this.penalties.PREFERRED_SLOT;
          } else if (slot.subject?.type === 'tutorial') {
            if (i >= 4) score += this.penalties.PREFERRED_SLOT * 3;
            else score += this.penalties.TUTORIAL_WRONG_SLOT;
          }
        }
      }

      // Weekly target check
      for (const subject of subjects) {
        const actualCount = weeklySubjectCount.get(subject._id) || 0;
        let targetCount = parseInt(subject.lecturePerWeek) || 3;
        if (subject.type === 'tutorial') targetCount = Math.min(targetCount, 2);
        else if (subject.type === 'practical' || subject.type === 'lab') targetCount = 3;

        if (actualCount === targetCount) score += this.penalties.WEEKLY_TARGET_MET;
        else score += this.penalties.SUBJECT_OVERLOAD_WEEK * Math.abs(actualCount - targetCount);
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
          selected.push(population[j]);
          break;
        }
      }
    }

    return selected.length ? selected : [...population];
  }

  crossover(parent1, parent2) {
    if (!parent1 || !parent2 || Math.random() > this.crossoverRate) {
      return parent1 ? JSON.parse(JSON.stringify(parent1)) : 
             parent2 ? JSON.parse(JSON.stringify(parent2)) : {};
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
      return schedule ? JSON.parse(JSON.stringify(schedule)) : {};
    }

    const mutated = JSON.parse(JSON.stringify(schedule));
    const divisions = Object.keys(mutated);
    if (!divisions.length) return mutated;

    const division = divisions[Math.floor(Math.random() * divisions.length)];
    const day = this.days[Math.floor(Math.random() * this.days.length)];
    const period = Math.floor(Math.random() * this.periodsPerDay);

    if (mutated[division]?.[day]?.[period] !== undefined) {
      const slot = mutated[division][day][period];
      if (slot && (slot.subject?.type === 'practical' || slot.subject?.type === 'lab')) {
        // Clear both consecutive lab slots
        if (period % 2 === 0 && period + 1 < this.periodsPerDay) {
          mutated[division][day][period] = null;
          mutated[division][day][period + 1] = null;
        } else if (period % 2 === 1 && period - 1 >= 0) {
          mutated[division][day][period - 1] = null;
          mutated[division][day][period] = null;
        } else {
          mutated[division][day][period] = null;
        }
      } else {
        mutated[division][day][period] = null;
      }
    }

    return mutated;
  }

  resolveConflicts(schedule, teachers, classes) {
    return schedule; // Basic conflict resolution
  }

  run(divisions, subjects, teachers, classes) {
    if (!divisions?.length || !subjects?.length || !teachers?.length || !classes?.length) {
      console.error('Insufficient data for running algorithm');
      return this.createEmptySchedule(divisions || []);
    }

    let population = this.initializePopulation(divisions, subjects, teachers, classes);
    let bestSolution = null;
    let bestFitness = -Infinity;
    let generationsWithoutImprovement = 0;

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

      if (bestFitness >= 500 || generationsWithoutImprovement >= 50) {
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
        newPopulation.push(this.createRandomSchedule(divisions, subjects, teachers, classes));
      }

      population = newPopulation;
    }

    const finalSolution = bestSolution || 
                         population[population.map(s => this.fitness(s, subjects)).indexOf(Math.max(...population.map(s => this.fitness(s, subjects))))] || 
                         this.createEmptySchedule(divisions);

    return this.resolveConflicts(finalSolution, teachers, classes);
  }
}


