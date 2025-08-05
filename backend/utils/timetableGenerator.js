
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

//in working
export default class GeneticAlgorithm {
  constructor(config = {}) {
    this.config = config;
    this.populationSize = config.populationSize || 50;
    this.maxGenerations = config.maxGenerations || 100;
    this.mutationRate = config.mutationRate || 0.1;
    this.crossoverRate = config.crossoverRate || 0.8;
    this.elitismCount = Math.floor((config.elitismRate || 0.1) * this.populationSize);

    this.departmentId = config.departmentId;
    this.semester = config.semester;
    this.academicYear = config.academicYear;
    this.divisions = config.divisions;
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  }

  async generateSchedule({ divisions, subjects, teachers, classes }) {
    try {
      const schedule = this.run(divisions, subjects, teachers, classes);
      return {
        schedule,
        metadata: {
          fitnessScore: this.fitness(schedule),
          generation_count: this.maxGenerations,
          conflictsResolved: true,
          algorithm_version: '2.0.0',
        }
      };
    } catch (err) {
      console.error(err);
      throw new Error('Failed to generate schedule');
    }
  }

  initializePopulation(divisions, subjects, teachers, classes) {
    const population = [];
    for (let i = 0; i < this.populationSize; i++) {
      population.push(this.createRandomSchedule(divisions, subjects, teachers, classes));
    }
    return population;
  }

  // ------------------------------------------------------------------------------

  createRandomSchedule(divisions, subjects, teachers, classes) {
    const schedule = {};
    this.periodsPerDay = 6;

    const theorySubs   = subjects.filter(s => s.type === 'theory');
    const practicals   = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
    const tutorials    = subjects.filter(s => s.type === 'tutorial');
    const regularRooms = classes.filter(c => !(c.classNumber?.toLowerCase().includes('lab')));
    const labRooms     = classes.filter(c  =>  (c.classNumber?.toLowerCase().includes('lab')));

    for (const division of divisions) {
      schedule[division] = {};
      for (const day of this.days) {
        schedule[division][day] = new Array(this.periodsPerDay).fill(null);
        const subjectDayCount = {};
        let p = 0;

        while (p < this.periodsPerDay) {
          let chosen = null;

          // 1) practical block booking only at 1-2 / 3-4 / 5-6
          const isPracticalBlockStart = (p === 0 || p === 2 || p === 4);
          if (isPracticalBlockStart) {
            const candidates = practicals.filter(s => (subjectDayCount[s._id] || 0) < 1);
            if (candidates.length) {
              chosen = candidates[Math.floor(Math.random() * candidates.length)];
              const t = teachers.filter(x => +x.semester === +chosen.semester);
              const teacher = t[Math.floor(Math.random() * t.length)] || null;
              const lab     = labRooms[Math.floor(Math.random() * labRooms.length)] || null;

              const slot = {
                period   : p + 1,
                subject  : { _id: chosen._id, subjectName: chosen.subjectName || chosen.name, type:'practical' },
                teacher  : teacher ? { _id: teacher._id, name: teacher.name } : null,
                classroom: lab     ? { _id: lab._id, room_number: lab.classNumber } : null
              };
              schedule[division][day][p]   = slot;
              if (p+1 < this.periodsPerDay) {
                schedule[division][day][p+1] = { ...slot, period: p+2 };
              }
              subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
              p += 2;
              continue;
            }
          }

          // 2) Tutorial preferred at period 5 or 6
          if ((p === 4 || p === 5) && tutorials.length) {
            const possible = tutorials.filter(t => (subjectDayCount[t._id] || 0) < 1);
            if (possible.length) {
              chosen = possible[Math.floor(Math.random() * possible.length)];
              const t  = teachers.filter(x => +x.semester === +chosen.semester);
              const teacher = t[Math.floor(Math.random() * t.length)] || null;
              const room    = regularRooms[Math.floor(Math.random() * regularRooms.length)] || null;

              schedule[division][day][p] = {
                period : p+1,
                subject: { _id: chosen._id, subjectName: chosen.subjectName||chosen.name, type:'tutorial' },
                teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
                classroom: room  ? { _id: room._id, room_number: room.classNumber } : null
              };
              subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
              p++;
              continue;
            }
          }

          // 3) Theory subjects (max twice a day)
          const availTheory = theorySubs.filter(s => (subjectDayCount[s._id] || 0) < 2);
          if (availTheory.length) {
            chosen = availTheory[Math.floor(Math.random() * availTheory.length)];
            const t = teachers.filter(x => +x.semester === +chosen.semester);
            const teacher = t[Math.floor(Math.random() * t.length)] || null;
            const room    = regularRooms[Math.floor(Math.random() * regularRooms.length)] || null;

            schedule[division][day][p] = {
              period : p+1,
              subject: { _id: chosen._id, subjectName: chosen.subjectName||chosen.name, type:'theory' },
              teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
              classroom: room ? { _id: room._id, room_number: room.classNumber } : null
            };
            subjectDayCount[chosen._id] = (subjectDayCount[chosen._id] || 0) + 1;
          }
          p++;
        }
      }
    }
    return schedule;
  }

  // ------------------------------------------------------------------------------

  fitness(schedule) {
    let sc = 0;
    for (const d in schedule) {
      for (const day of this.days) {
        const slots = schedule[d][day] || [];
        const subCount = {};
        slots.forEach((slot,i)=>{
          if(!slot) return;
          const tId=slot.teacher?._id, cId=slot.classroom?._id;
          sc+=2; // filled period reward
          if(tId && slots.some((s,j)=>j!==i && s?.teacher?._id===tId)) sc-=10;
          if(cId && slots.some((s,j)=>j!==i && s?.classroom?._id===cId)) sc-=5;
          const sid=slot.subject?._id;
          subCount[sid]=(subCount[sid]||0)+1;
        });
        for(const sid in subCount){
          if(subCount[sid]>2) sc-=(subCount[sid]-2)*5;
        }
      }
    }
    return sc;
  }

  selection(pop,fit){
    const sum=fit.reduce((a,b)=>a+b,0);
    const prob=fit.map(f=>f/sum);
    const sel=[];
    for(let i=0;i<pop.length;i++){
      let r=Math.random(),a=0;
      for(let j=0;j<pop.length;j++){
        a+=prob[j];
        if(r<a){ sel.push(pop[j]); break; }
      }
    }
    return sel;
  }

  crossover(p1,p2){
    if(!p1||!p2||Math.random()>this.crossoverRate){
      return JSON.parse(JSON.stringify(p1||p2));
    }
    const ch={};
    for(const d in p1){
      ch[d]={};
      for(const day of this.days){
        const cp=Math.floor(Math.random()*this.periodsPerDay);
        const s1=p1[d][day]||[], s2=p2[d][day]||[];
        ch[d][day]=[...s1.slice(0,cp),...s2.slice(cp)];
      }
    }
    return ch;
  }

  mutate(sch){
    const m=JSON.parse(JSON.stringify(sch));
    if(Math.random()>this.mutationRate) return m;
    const divs=Object.keys(m), pick=divs[Math.floor(Math.random()*divs.length)];
    const day=this.days[Math.floor(Math.random()*this.days.length)];
    const per=Math.floor(Math.random()*this.periodsPerDay);
    if(m[pick]?.[day]) m[pick][day][per]=null;
    return m;
  }

  resolveConflicts(sch,teachers,classes){
    for(const d in sch){
      for(const day of this.days){
        const slots=sch[d][day], tset=new Set(), cset=new Set();
        for(let i=0;i<slots.length;i++){
          const slot=slots[i];
          if(!slot) continue;
          const tk=`${slot.teacher?._id}_${day}_${i}`;
          const ck=`${slot.classroom?._id}_${day}_${i}`;
          if(tset.has(tk)||cset.has(ck)) slots[i]=null;
          else{ tset.add(tk); cset.add(ck);}
        }
      }
    }
    return sch;
  }

  run(divs,subs,teach,cls){
    let pop=this.initializePopulation(divs,subs,teach,cls);
    for(let g=0;g<this.maxGenerations;g++){
      const fit=pop.map(p=>this.fitness(p));
      const sel=this.selection(pop,fit);
      const newPop=[];
      for(let i=0;i<this.elitismCount;i++){
        const best=fit.indexOf(Math.max(...fit));
        newPop.push(pop[best]);
        fit[best]=-Infinity;
      }
      while(newPop.length<this.populationSize){
        const p1=sel[Math.floor(Math.random()*sel.length)];
        const p2=sel[Math.floor(Math.random()*sel.length)];
        let ch=this.crossover(p1,p2);
        ch=this.mutate(ch);
        newPop.push(ch);
      }
      pop=newPop;
    }
    const f=pop.map(p=>this.fitness(p));
    const idx=f.indexOf(Math.max(...f));
    return this.resolveConflicts(pop[idx],teach,cls);
  }
}




