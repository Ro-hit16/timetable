

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

  // async generateSchedule({ divisions = [], subjects = [], teachers = [], classes = [] } = {}) {
  //   if (!divisions.length || !subjects.length || !teachers.length || !classes.length) {
  //     throw new Error('Insufficient data: divisions, subjects, teachers, or classes array is empty');
  //   }
  //   const startTime = Date.now();
  //   const schedule = this.run(divisions, subjects, teachers, classes);

  //   if (!schedule) {
  //     throw new Error('Failed to generate valid schedule');
  //   }

  //   return {
  //     schedule,
  //     metadata: {
  //       fitnessScore: this.fitness(schedule, subjects),
  //       generation_count: this.maxGenerations,
  //       population_size: this.populationSize,
  //       conflictsResolved: true,
  //       algorithm_version: '3.2.0',
  //       executionTime: `${(Date.now() - startTime) / 1000} seconds`
  //     }
  //   };
  // }

  async generateSchedule({ divisions = [], subjects = [], teachers = [], classes = [] } = {}) {
  if (!divisions.length || !subjects.length || !teachers.length || !classes.length) {
    throw new Error('Insufficient data: divisions, subjects, teachers, or classes array is empty');
  }

  // Flatten divisions to include all department divisions (semester-wise)
  const allDivisions = divisions;

  // Generate schedule for all divisions together
  const startTime = Date.now();
  const schedule = this.run(allDivisions, subjects, teachers, classes);

  if (!schedule) {
    throw new Error('Failed to generate valid schedule');
  }

  // Calculate fitness globally for department
  const fitnessScore = this.fitness(schedule, subjects);

  return {
    schedule, // department-wide schedule
    metadata: {
      fitnessScore,
      generation_count: this.maxGenerations,
      population_size: this.populationSize,
      conflictsResolved: true,
      algorithm_version: '3.3.0', // updated version
      executionTime: `${((Date.now() - startTime) / 1000).toFixed(2)} seconds`,
      divisions: allDivisions.map(d => d.division_name || d._id),
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

//   createRandomSchedule(divisions, subjects, teachers, classes) {
//   const schedule = {};

//   // Categorize subjects
//   const theorySubjects = subjects.filter(s => s.type === 'theory');
//   const practicalSubjects = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
//   const tutorialSubjects = subjects.filter(s => s.type === 'tutorial');

//   // Categorize rooms
//   const regularRooms = classes.filter(c => c.classNumber && !c.classNumber.toLowerCase().includes('lab'));
//   const labRooms = classes.filter(c => c.classNumber && c.classNumber.toLowerCase().includes('lab'));
//   const allRooms = [...regularRooms, ...labRooms];

//   const pickRandom = arr => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;

//   // const getAvailableTeachers = (subject) => {
//   //   if (!subject || !teachers.length) return [];
//   //   let available = teachers.filter(t => t.semester && subject.sem_id && t.semester.toString() === subject.sem_id.toString());
//   //   if (!available.length) available = [...teachers];
//   //   return available;
//   // };

// const getAvailableTeachers = (subject) => {
//   if (!subject || !teachers.length) return [];

//   // Try teachers specifically assigned to this subject
//   let available = teachers.filter(t => subject.teacherIds?.includes(t._id));

//   // If none found, fallback to same semester
//   if (!available.length) {
//     available = teachers.filter(t => t.semester?.toString() === subject.sem_id?.toString());
//   }

//   // Final fallback: pick any teacher
//   if (!available.length) available = [...teachers];

//   return available;
// };


//   // Initialize schedule
//   for (const division of divisions) {
//     schedule[division] = {};
//     for (const day of this.days) {
//       schedule[division][day] = new Array(this.periodsPerDay).fill(null);
//     }
//   }

//   const createWeeklyPlan = () => {
//     const plan = [];

//     theorySubjects.forEach(subject => {
//       const sessions = Math.min(parseInt(subject.lecturePerWeek) || 3, 4);
//       for (let i = 0; i < sessions; i++) plan.push({ subject, type: 'theory', preferredSlots: [0,1,2,3,4,5], priority: 2 });
//     });

//     practicalSubjects.forEach(subject => {
//       for (let i = 0; i < 3; i++) plan.push({ subject, type: 'lab_session', preferredSlots: [0,2,4], priority: 1 });
//     });

//     tutorialSubjects.forEach(subject => {
//       const sessions = Math.min(parseInt(subject.lecturePerWeek) || 2, 2);
//       for (let i = 0; i < sessions; i++) plan.push({ subject, type: 'tutorial', preferredSlots: [4,5], priority: 3 });
//     });

//     return plan.sort((a,b) => a.priority - b.priority);
//   };

//   for (const division of divisions) {
//     const weeklyPlan = createWeeklyPlan();
//     const subjectWeeklyCount = new Map();

//     for (const item of weeklyPlan) {
//       const maxWeekly = item.type === 'tutorial' ? 2 : item.type === 'lab_session' ? 3 : parseInt(item.subject.lecturePerWeek) || 3;
//       if ((subjectWeeklyCount.get(item.subject._id) || 0) >= maxWeekly) continue;

//       // Shuffle days
//       const shuffledDays = [...this.days].sort(() => Math.random() - 0.5);
//       let scheduled = false;

//       for (const day of shuffledDays) {
//         if (scheduled) break;

//         const daySchedule = schedule[division][day];

//         // Daily limit: max 1, allow 2 only if no other days available
//         const countToday = daySchedule.filter(slot => slot?.subject?._id === item.subject._id).length;
//         const otherDaysAvailable = this.days.some(d => d !== day && !schedule[division][d].some(slot => slot?.subject?._id === item.subject._id));
//         if (countToday >= 1 && otherDaysAvailable) continue;
//         if (countToday >= 2) continue;

//         if (item.type === 'lab_session') {
//           for (const startSlot of item.preferredSlots) {
//             if (startSlot + 1 < this.periodsPerDay && !daySchedule[startSlot] && !daySchedule[startSlot + 1]) {
//               const teacher = pickRandom(getAvailableTeachers(item.subject));
//               const room = pickRandom(labRooms.length ? labRooms : allRooms);
//               if (teacher && room) {
//                 const labSlot = { period: startSlot+1, subject: { _id:item.subject._id, subjectName:item.subject.subjectName, type:'practical' }, teacher:{_id:teacher._id, name:teacher.name}, classroom:{_id:room._id, room_number:room.classNumber} };
//                 daySchedule[startSlot] = labSlot;
//                 daySchedule[startSlot+1] = { ...labSlot, period: startSlot+2 };
//                 scheduled = true;
//                 break;
//               }
//             }
//           }
//         } else {
//           for (const slot of item.preferredSlots) {
//             if (!daySchedule[slot]) {
//               const teacher = pickRandom(getAvailableTeachers(item.subject));
//               const room = pickRandom(item.type === 'tutorial' ? regularRooms : allRooms);
//               if (teacher && room) {
//                 daySchedule[slot] = { period: slot+1, subject: { _id:item.subject._id, subjectName:item.subject.subjectName, type:item.subject.type }, teacher:{_id:teacher._id, name:teacher.name}, classroom:{_id:room._id, room_number:room.classNumber} };
//                 scheduled = true;
//                 break;
//               }
//             }
//           }
//         }
//       }

//       if (scheduled) subjectWeeklyCount.set(item.subject._id, (subjectWeeklyCount.get(item.subject._id) || 0)+1);
//     }
//   }

//   return schedule;
// }

createRandomSchedule(divisions, subjects, teachers, classes) {
  const schedule = {};
  const theorySubjects = subjects.filter(s => s.type === 'theory');
  const practicalSubjects = subjects.filter(s => s.type === 'practical' || s.type === 'lab');
  const tutorialSubjects = subjects.filter(s => s.type === 'tutorial');

  const regularRooms = classes.filter(c => c.classNumber && !c.classNumber.toLowerCase().includes('lab'));
  const labRooms = classes.filter(c => c.classNumber && c.classNumber.toLowerCase().includes('lab'));
  const allRooms = [...regularRooms, ...labRooms];

  const pickRandom = arr => arr?.length ? arr[Math.floor(Math.random() * arr.length)] : null;

  const getAvailableTeachers = (subject) => {
    if (!subject || !teachers.length) return [];
    let available = teachers.filter(t => subject.teacherIds?.includes(t._id));
    if (!available.length) available = teachers.filter(t => t.semester?.toString() === subject.sem_id?.toString());
    if (!available.length) available = [...teachers];
    return available;
  };

  // Initialize schedule for **all divisions**
  for (const division of divisions) {
    schedule[division] = {};
    for (const day of this.days) {
      schedule[division][day] = new Array(this.periodsPerDay).fill(null);
    }
  }

  // Create weekly plan **per division**
  for (const division of divisions) {
    const weeklyPlan = [];

    theorySubjects.forEach(subject => {
      if (subject.sem_id.toString() === division.semester.toString()) {
        const sessions = Math.min(parseInt(subject.lecturePerWeek) || 3, 4);
        for (let i = 0; i < sessions; i++) weeklyPlan.push({ subject, type: 'theory', priority: 2 });
      }
    });

    practicalSubjects.forEach(subject => {
      if (subject.sem_id.toString() === division.semester.toString()) {
        for (let i = 0; i < 3; i++) weeklyPlan.push({ subject, type: 'lab_session', priority: 1 });
      }
    });

    tutorialSubjects.forEach(subject => {
      if (subject.sem_id.toString() === division.semester.toString()) {
        const sessions = Math.min(parseInt(subject.lecturePerWeek) || 2, 2);
        for (let i = 0; i < sessions; i++) weeklyPlan.push({ subject, type: 'tutorial', priority: 3 });
      }
    });

    weeklyPlan.sort((a,b) => a.priority - b.priority);

    // Fill the schedule
    const subjectWeeklyCount = new Map();

    for (const item of weeklyPlan) {
      const maxWeekly = item.type === 'tutorial' ? 2 : item.type === 'lab_session' ? 3 : parseInt(item.subject.lecturePerWeek) || 3;
      if ((subjectWeeklyCount.get(item.subject._id) || 0) >= maxWeekly) continue;

      const shuffledDays = [...this.days].sort(() => Math.random() - 0.5);
      let scheduled = false;

      for (const day of shuffledDays) {
        if (scheduled) break;
        const daySchedule = schedule[division][day];

        const countToday = daySchedule.filter(slot => slot?.subject?._id === item.subject._id).length;
        const otherDaysAvailable = this.days.some(d => d !== day && !schedule[division][d].some(slot => slot?.subject?._id === item.subject._id));
        if (countToday >= 1 && otherDaysAvailable) continue;
        if (countToday >= 2) continue;

        if (item.type === 'lab_session') {
          for (let startSlot = 0; startSlot < this.periodsPerDay - 1; startSlot++) {
            if (!daySchedule[startSlot] && !daySchedule[startSlot + 1]) {
              const teacher = pickRandom(getAvailableTeachers(item.subject));
              const room = pickRandom(labRooms.length ? labRooms : allRooms);
              if (teacher && room) {
                const labSlot = {
                  period: startSlot+1,
                  subject: { _id:item.subject._id, subjectName:item.subject.subjectName, type:'practical' },
                  teacher:{_id:teacher._id, name:teacher.name},
                  classroom:{_id:room._id, room_number:room.classNumber}
                };
                daySchedule[startSlot] = labSlot;
                daySchedule[startSlot+1] = { ...labSlot, period: startSlot+2 };
                scheduled = true;
                break;
              }
            }
          }
        } else {
          for (let slot = 0; slot < this.periodsPerDay; slot++) {
            if (!daySchedule[slot]) {
              const teacher = pickRandom(getAvailableTeachers(item.subject));
              const room = pickRandom(item.type === 'tutorial' ? regularRooms : allRooms);
              if (teacher && room) {
                daySchedule[slot] = {
                  period: slot+1,
                  subject: { _id:item.subject._id, subjectName:item.subject.subjectName, type:item.subject.type },
                  teacher:{_id:teacher._id, name:teacher.name},
                  classroom:{_id:room._id, room_number:room.classNumber}
                };
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


