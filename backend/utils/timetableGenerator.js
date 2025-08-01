// // utils/timetableGenerator.js
// async function generateTimeTable(courseId, semester, SubjectModel) {
//   const subjects = await SubjectModel.find({ department_id: courseId, sem_id: semester }).lean();

//   const clonedSubjects = subjects.map(subject => ({ ...subject }));
//   const totalDays = 5;
//   const totalSlots = 8; // 0-7
//   const lunchSlot = 2;
//   const teaSlot = 5;

//   const weekTimeTable = [];

//   for (let day = 0; day < totalDays; day++) {
//     const daySchedule = [];
//     const dailySubjects = [...clonedSubjects];
//     let pointer = 0;

//     for (let slot = 0; slot < totalSlots; slot++) {
//       // Insert Breaks
//       if (slot === lunchSlot) {
//         daySchedule.push({ subject_name: "Lunch Break", type: "Break" });
//         continue;
//       }
//       if (slot === teaSlot) {
//         daySchedule.push({ subject_name: "Tea Break", type: "Break" });
//         continue;
//       }

//       let subjectPlaced = false;

//       for (let attempt = 0; attempt < dailySubjects.length; attempt++) {
//         const subject = dailySubjects[pointer];

//         if (!subject || subject.lecture_per_week <= 0) {
//           pointer = (pointer + 1) % dailySubjects.length;
//           continue;
//         }

//         // -----------------------
//         // SLOT 0 or 1 → ONLY LECTURES
//         // -----------------------
//         if (slot === 0 || slot === 1) {
//           if (subject.type === "Theory") {
//             daySchedule.push(subject);
//             subject.lecture_per_week--;
//             subjectPlaced = true;
//             break;
//           }
//         }

//         // -----------------------
//         // SLOT 3 or 4 → Prefer Labs (if 2-slot available)
//         // -----------------------
//         else if (slot === 3 || slot === 4) {
//           if (
//             subject.type === "Lab" &&
//             slot + 1 < totalSlots &&
//             ![lunchSlot, teaSlot].includes(slot + 1) &&
//             daySchedule.length <= slot &&
//             daySchedule.length <= slot + 1
//           ) {
//             daySchedule.push(subject);
//             daySchedule.push(subject);
//             subject.lecture_per_week--;
//             slot++; // occupy two slots
//             subjectPlaced = true;
//             break;
//           } else if (subject.type === "Theory") {
//             daySchedule.push(subject);
//             subject.lecture_per_week--;
//             subjectPlaced = true;
//             break;
//           }
//         }

//         // -----------------------
//         // SLOT 6 or 7 → Lecture or Lab
//         // -----------------------
//         else if (slot === 6 || slot === 7) {
//           if (subject.type === "Lab" && slot + 1 < totalSlots && ![lunchSlot, teaSlot].includes(slot + 1)) {
//             daySchedule.push(subject);
//             daySchedule.push(subject);
//             subject.lecture_per_week--;
//             slot++;
//             subjectPlaced = true;
//             break;
//           } else if (subject.type === "Theory") {
//             daySchedule.push(subject);
//             subject.lecture_per_week--;
//             subjectPlaced = true;
//             break;
//           }
//         }

//         pointer = (pointer + 1) % dailySubjects.length;
//       }

//       if (!subjectPlaced) {
//         daySchedule.push({ subject_name: "Free", type: "Empty" });
//       }
//     }

//     weekTimeTable.push(daySchedule);
//   }

//   return weekTimeTable;
// }

// module.exports = generateTimeTable;



// // utils/timetableGenerator.js
// async function generateTimeTable(courseId, semester, SubjectModel) {
//   const subjects = await SubjectModel.find({ department_id: courseId, sem_id: semester }).lean();

//   const clonedSubjects = subjects.map(subject => ({ ...subject }));
//   const totalDays = 5; // Monday to Friday
//   const totalSlots = 6; // 6 lecture periods
  
//   // Updated time slots: 10:30-11:30, 11:30-12:30, 13:15-14:15, 14:15-15:15, 15:30-16:30, 16:30-17:30
//   const timeSlots = [
//     { start: '10:30', end: '11:30', label: '1st Period' },
//     { start: '11:30', end: '12:30', label: '2nd Period' },
//     { start: '13:15', end: '14:15', label: '3rd Period' },
//     { start: '14:15', end: '15:15', label: '4th Period' },
//     { start: '15:30', end: '16:30', label: '5th Period' },
//     { start: '16:30', end: '17:30', label: '6th Period' }
//   ];

//   const breakSlots = [
//     { start: '12:30', end: '13:15', name: 'Lunch Break' },
//     { start: '15:15', end: '15:30', name: 'Tea Break' }
//   ];

//   const weekTimeTable = [];

//   for (let day = 0; day < totalDays; day++) {
//     const daySchedule = [];
//     const dailySubjects = [...clonedSubjects];
//     let pointer = 0;

//     // Add morning slots (1st and 2nd period)
//     for (let slot = 0; slot < 2; slot++) {
//       let subjectPlaced = false;

//       for (let attempt = 0; attempt < dailySubjects.length; attempt++) {
//         const subject = dailySubjects[pointer];

//         if (!subject || subject.lecture_per_week <= 0) {
//           pointer = (pointer + 1) % dailySubjects.length;
//           continue;
//         }

//         if (subject.type === "Theory" || subject.type === "Lecture") {
//           daySchedule.push({
//             ...subject,
//             time_slot: timeSlots[slot],
//             start_time: timeSlots[slot].start,
//             end_time: timeSlots[slot].end
//           });
//           subject.lecture_per_week--;
//           subjectPlaced = true;
//           break;
//         }

//         pointer = (pointer + 1) % dailySubjects.length;
//       }

//       if (!subjectPlaced) {
//         daySchedule.push({ 
//           subject_name: "Free", 
//           type: "Empty",
//           time_slot: timeSlots[slot],
//           start_time: timeSlots[slot].start,
//           end_time: timeSlots[slot].end
//         });
//       }
//     }

//     // Add lunch break
//     daySchedule.push({
//       subject_name: breakSlots[0].name,
//       type: "Break",
//       start_time: breakSlots[0].start,
//       end_time: breakSlots[0].end
//     });

//     // Add afternoon slots (3rd and 4th period)
//     for (let slot = 2; slot < 4; slot++) {
//       let subjectPlaced = false;

//       for (let attempt = 0; attempt < dailySubjects.length; attempt++) {
//         const subject = dailySubjects[pointer];

//         if (!subject || subject.lecture_per_week <= 0) {
//           pointer = (pointer + 1) % dailySubjects.length;
//           continue;
//         }

//         // Try to place labs in double slots when possible
//         if (subject.type === "Lab" && slot === 2) {
//           daySchedule.push({
//             ...subject,
//             time_slot: { start: timeSlots[2].start, end: timeSlots[3].end },
//             start_time: timeSlots[2].start,
//             end_time: timeSlots[3].end
//           });
//           subject.lecture_per_week--;
          
//           // Skip next slot since lab takes 2 hours
//           slot = 3;
//           subjectPlaced = true;
//           break;
//         } else if (subject.type === "Theory" || subject.type === "Lecture") {
//           daySchedule.push({
//             ...subject,
//             time_slot: timeSlots[slot],
//             start_time: timeSlots[slot].start,
//             end_time: timeSlots[slot].end
//           });
//           subject.lecture_per_week--;
//           subjectPlaced = true;
//           break;
//         }

//         pointer = (pointer + 1) % dailySubjects.length;
//       }

//       if (!subjectPlaced) {
//         daySchedule.push({ 
//           subject_name: "Free", 
//           type: "Empty",
//           time_slot: timeSlots[slot],
//           start_time: timeSlots[slot].start,
//           end_time: timeSlots[slot].end
//         });
//       }
//     }

//     // Add tea break
//     daySchedule.push({
//       subject_name: breakSlots[1].name,
//       type: "Break",
//       start_time: breakSlots[1].start,
//       end_time: breakSlots[1].end
//     });

//     // Add evening slots (5th and 6th period)
//     for (let slot = 4; slot < 6; slot++) {
//       let subjectPlaced = false;

//       for (let attempt = 0; attempt < dailySubjects.length; attempt++) {
//         const subject = dailySubjects[pointer];

//         if (!subject || subject.lecture_per_week <= 0) {
//           pointer = (pointer + 1) % dailySubjects.length;
//           continue;
//         }

//         // Try to place labs in double slots when possible
//         if (subject.type === "Lab" && slot === 4) {
//           daySchedule.push({
//             ...subject,
//             time_slot: { start: timeSlots[4].start, end: timeSlots[5].end },
//             start_time: timeSlots[4].start,
//             end_time: timeSlots[5].end
//           });
//           subject.lecture_per_week--;
          
//           // Skip next slot since lab takes 2 hours
//           slot = 5;
//           subjectPlaced = true;
//           break;
//         } else if (subject.type === "Theory" || subject.type === "Lecture") {
//           daySchedule.push({
//             ...subject,
//             time_slot: timeSlots[slot],
//             start_time: timeSlots[slot].start,
//             end_time: timeSlots[slot].end
//           });
//           subject.lecture_per_week--;
//           subjectPlaced = true;
//           break;
//         }

//         pointer = (pointer + 1) % dailySubjects.length;
//       }

//       if (!subjectPlaced) {
//         daySchedule.push({ 
//           subject_name: "Free", 
//           type: "Empty",
//           time_slot: timeSlots[slot],
//           start_time: timeSlots[slot].start,
//           end_time: timeSlots[slot].end
//         });
//       }
//     }

//     weekTimeTable.push(daySchedule);
//   }

//   return weekTimeTable;
// }

// export default generateTimeTable;




// // utils/geneticAlgorithm.js
// import { EnhancedSubject, TeacherAvailability } from '../models/timetable.model.js';

// class TimetableGeneticAlgorithm {
//   constructor(config = {}) {
//     this.config = {
//       populationSize: config.populationSize || 50,
//       maxGenerations: config.maxGenerations || 100,
//       mutationRate: config.mutationRate || 0.1,
//       crossoverRate: config.crossoverRate || 0.8,
//       elitismRate: config.elitismRate || 0.1,
//       ...config
//     };
    
//     this.timeSlots = [
//       { period: 1, start: '10:30', end: '11:30', label: '1st Period' },
//       { period: 2, start: '11:30', end: '12:30', label: '2nd Period' },
//       { period: 3, start: '13:15', end: '14:15', label: '3rd Period' },
//       { period: 4, start: '14:15', end: '15:15', label: '4th Period' },
//       { period: 5, start: '15:30', end: '16:30', label: '5th Period' },
//       { period: 6, start: '16:30', end: '17:30', label: '6th Period' }
//     ];
    
//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     this.divisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
//   }

//   /**
//    * Main function to generate timetable for all divisions
//    */
//   async generateTimetable(departmentId, semester) {
//     try {
//       console.log('Starting timetable generation...');
      
//       // Fetch subjects for all divisions
//       const subjects = await this.fetchSubjectsForDivisions(departmentId, semester);
      
//       // Fetch teacher availability
//       const teacherAvailability = await this.fetchTeacherAvailability();
      
//       // Create initial population
//       let population = this.createInitialPopulation(subjects);
      
//       let bestSolution = null;
//       let bestFitness = -Infinity;
//       let generation = 0;
      
//       console.log(`Initial population created with ${population.length} individuals`);
      
//       // Evolution loop
//       while (generation < this.config.maxGenerations) {
//         // Evaluate fitness for each individual
//         const fitnessScores = population.map(individual => 
//           this.calculateFitness(individual, teacherAvailability)
//         );
        
//         // Find best solution in current generation
//         const currentBestIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
//         const currentBest = population[currentBestIndex];
//         const currentBestFitness = fitnessScores[currentBestIndex];
        
//         if (currentBestFitness > bestFitness) {
//           bestFitness = currentBestFitness;
//           bestSolution = JSON.parse(JSON.stringify(currentBest));
//         }
        
//         // Check if we found a perfect solution
//         if (bestFitness >= 0.95) {
//           console.log(`Perfect solution found at generation ${generation}`);
//           break;
//         }
        
//         // Create new generation
//         population = this.createNewGeneration(population, fitnessScores);
//         generation++;
        
//         if (generation % 10 === 0) {
//           console.log(`Generation ${generation}: Best fitness = ${bestFitness.toFixed(4)}`);
//         }
//       }
      
//       console.log(`Final best fitness: ${bestFitness.toFixed(4)} after ${generation} generations`);
      
//       return {
//         timetable: bestSolution,
//         metadata: {
//           fitness_score: bestFitness,
//           generation_count: generation,
//           conflicts_resolved: this.countConflicts(bestSolution),
//           algorithm_version: '2.0'
//         }
//       };
      
//     } catch (error) {
//       console.error('Error in genetic algorithm:', error);
//       throw error;
//     }
//   }

//   /**
//    * Fetch subjects for all divisions
//    */
//   async fetchSubjectsForDivisions(departmentId, semester) {
//     const subjects = await EnhancedSubject.find({
//       department_id: departmentId,
//       sem_id: semester
//     }).populate('teacher_id').lean();
    
//     // Expand subjects for each division they belong to
//     const expandedSubjects = [];
    
//     subjects.forEach(subject => {
//       subject.divisions.forEach(division => {
//         for (let i = 0; i < subject.lecturePerWeek; i++) {
//           expandedSubjects.push({
//             ...subject,
//             division: division,
//             instance: i + 1,
//             duration: subject.type === 'Lab' ? 2 : 1
//           });
//         }
//       });
//     });
    
//     return expandedSubjects;
//   }

//   /**
//    * Fetch teacher availability constraints
//    */
//   async fetchTeacherAvailability() {
//     const availability = await TeacherAvailability.find({}).lean();
//     const availabilityMap = new Map();
    
//     availability.forEach(record => {
//       const key = `${record.teacher_id}_${record.day}`;
//       availabilityMap.set(key, record);
//     });
    
//     return availabilityMap;
//   }

//   /**
//    * Create initial population of timetables
//    */
//   createInitialPopulation(subjects) {
//     const population = [];
    
//     for (let i = 0; i < this.config.populationSize; i++) {
//       const individual = this.createRandomIndividual(subjects);
//       population.push(individual);
//     }
    
//     return population;
//   }

//   /**
//    * Create a random timetable individual
//    */
//   createRandomIndividual(subjects) {
//     const timetable = [];
//     const subjectsCopy = [...subjects];
    
//     // Shuffle subjects for randomness
//     this.shuffleArray(subjectsCopy);
    
//     // Track assignments to avoid conflicts
//     const assignmentTracker = new Map();
    
//     subjectsCopy.forEach(subject => {
//       const assignment = this.findValidSlot(subject, assignmentTracker);
//       if (assignment) {
//         timetable.push(assignment);
//         this.updateAssignmentTracker(assignment, assignmentTracker);
//       }
//     });
    
//     return timetable;
//   }

//   /**
//    * Find a valid time slot for a subject
//    */
//   findValidSlot(subject, assignmentTracker) {
//     const availableSlots = [];
    
//     this.days.forEach(day => {
//       this.timeSlots.forEach(timeSlot => {
//         // For labs, check if we can place in consecutive slots
//         if (subject.type === 'Lab' && timeSlot.period < 6) {
//           const nextSlot = this.timeSlots.find(ts => ts.period === timeSlot.period + 1);
//           if (nextSlot && this.isSlotAvailable(subject, day, timeSlot, assignmentTracker) &&
//               this.isSlotAvailable(subject, day, nextSlot, assignmentTracker)) {
//             availableSlots.push({
//               ...subject,
//               day: day,
//               period: timeSlot.period,
//               start_time: timeSlot.start,
//               end_time: nextSlot.end,
//               duration: 2
//             });
//           }
//         } else if (subject.type !== 'Lab') {
//           if (this.isSlotAvailable(subject, day, timeSlot, assignmentTracker)) {
//             availableSlots.push({
//               ...subject,
//               day: day,
//               period: timeSlot.period,
//               start_time: timeSlot.start,
//               end_time: timeSlot.end,
//               duration: 1
//             });
//           }
//         }
//       });
//     });
    
//     return availableSlots.length > 0 ? 
//       availableSlots[Math.floor(Math.random() * availableSlots.length)] : null;
//   }

//   /**
//    * Check if a time slot is available
//    */
//   isSlotAvailable(subject, day, timeSlot, assignmentTracker) {
//     // Check teacher conflict
//     const teacherKey = `${subject.teacher_id._id}_${day}_${timeSlot.period}`;
//     if (assignmentTracker.has(teacherKey)) {
//       return false;
//     }
    
//     // Check division conflict (same division can't have multiple subjects at same time)
//     const divisionKey = `${subject.division}_${day}_${timeSlot.period}`;
//     if (assignmentTracker.has(divisionKey)) {
//       return false;
//     }
    
//     return true;
//   }

//   /**
//    * Update assignment tracker after placing a subject
//    */
//   updateAssignmentTracker(assignment, assignmentTracker) {
//     const periods = assignment.duration === 2 ? 
//       [assignment.period, assignment.period + 1] : [assignment.period];
    
//     periods.forEach(period => {
//       // Mark teacher as busy
//       const teacherKey = `${assignment.teacher_id._id}_${assignment.day}_${period}`;
//       assignmentTracker.set(teacherKey, assignment);
      
//       // Mark division as busy
//       const divisionKey = `${assignment.division}_${assignment.day}_${period}`;
//       assignmentTracker.set(divisionKey, assignment);
//     });
//   }

//   /**
//    * Calculate fitness score for a timetable
//    */
//   calculateFitness(timetable, teacherAvailability) {
//     let score = 0;
//     let totalConstraints = 0;
    
//     // 1. Hard constraints (must be satisfied)
//     const hardConstraints = this.evaluateHardConstraints(timetable);
//     score += hardConstraints.score;
//     totalConstraints += hardConstraints.total;
    
//     // 2. Soft constraints (preferred)
//     const softConstraints = this.evaluateSoftConstraints(timetable, teacherAvailability);
//     score += softConstraints.score * 0.3; // Weight soft constraints less
//     totalConstraints += softConstraints.total;
    
//     return totalConstraints > 0 ? score / totalConstraints : 0;
//   }

//   /**
//    * Evaluate hard constraints
//    */
//   evaluateHardConstraints(timetable) {
//     let score = 0;
//     let total = 0;
    
//     // Group by teacher and time slot to check conflicts
//     const teacherSlots = new Map();
//     const divisionSlots = new Map();
    
//     timetable.forEach(assignment => {
//       const periods = assignment.duration === 2 ? 
//         [assignment.period, assignment.period + 1] : [assignment.period];
      
//       periods.forEach(period => {
//         const teacherKey = `${assignment.teacher_id._id}_${assignment.day}_${period}`;
//         const divisionKey = `${assignment.division}_${assignment.day}_${period}`;
        
//         // Check teacher conflict
//         total++;
//         if (!teacherSlots.has(teacherKey)) {
//           teacherSlots.set(teacherKey, assignment);
//           score++;
//         }
        
//         // Check division conflict
//         total++;
//         if (!divisionSlots.has(divisionKey)) {
//           divisionSlots.set(divisionKey, assignment);
//           score++;
//         }
//       });
//     });
    
//     return { score, total };
//   }

//   /**
//    * Evaluate soft constraints
//    */
//   evaluateSoftConstraints(timetable, teacherAvailability) {
//     let score = 0;
//     let total = 0;
    
//     // Preferred time distribution
//     const dayDistribution = this.evaluateDayDistribution(timetable);
//     score += dayDistribution.score;
//     total += dayDistribution.total;
    
//     // Teacher workload balance
//     const workloadBalance = this.evaluateWorkloadBalance(timetable);
//     score += workloadBalance.score;
//     total += workloadBalance.total;
    
//     return { score, total };
//   }

//   /**
//    * Evaluate day distribution
//    */
//   evaluateDayDistribution(timetable) {
//     const divisionDays = new Map();
    
//     timetable.forEach(assignment => {
//       const key = assignment.division;
//       if (!divisionDays.has(key)) {
//         divisionDays.set(key, new Set());
//       }
//       divisionDays.get(key).add(assignment.day);
//     });
    
//     let score = 0;
//     let total = 0;
    
//     divisionDays.forEach((days, division) => {
//       total++;
//       // Prefer subjects spread across all 5 days
//       if (days.size >= 4) score++;
//     });
    
//     return { score, total };
//   }

//   /**
//    * Evaluate workload balance
//    */
//   evaluateWorkloadBalance(timetable) {
//     const teacherWorkload = new Map();
    
//     timetable.forEach(assignment => {
//       const teacherId = assignment.teacher_id._id;
//       if (!teacherWorkload.has(teacherId)) {
//         teacherWorkload.set(teacherId, 0);
//       }
//       teacherWorkload.set(teacherId, teacherWorkload.get(teacherId) + assignment.duration);
//     });
    
//     let score = 0;
//     let total = 0;
    
//     teacherWorkload.forEach((hours, teacherId) => {
//       total++;
//       // Prefer teachers with 15-25 hours per week
//       if (hours >= 15 && hours <= 25) score++;
//     });
    
//     return { score, total };
//   }

//   /**
//    * Create new generation through selection, crossover, and mutation
//    */
//   createNewGeneration(population, fitnessScores) {
//     const newPopulation = [];
    
//     // Elitism - keep best individuals
//     const eliteCount = Math.floor(this.config.populationSize * this.config.elitismRate);
//     const sortedIndices = fitnessScores
//       .map((fitness, index) => ({ fitness, index }))
//       .sort((a, b) => b.fitness - a.fitness)
//       .slice(0, eliteCount);
    
//     sortedIndices.forEach(({ index }) => {
//       newPopulation.push(JSON.parse(JSON.stringify(population[index])));
//     });
    
//     // Fill rest with crossover and mutation
//     while (newPopulation.length < this.config.populationSize) {
//       const parent1 = this.tournamentSelection(population, fitnessScores);
//       const parent2 = this.tournamentSelection(population, fitnessScores);
      
//       let offspring = this.crossover(parent1, parent2);
//       offspring = this.mutate(offspring);
      
//       newPopulation.push(offspring);
//     }
    
//     return newPopulation;
//   }

//   /**
//    * Tournament selection
//    */
//   tournamentSelection(population, fitnessScores, tournamentSize = 3) {
//     let best = null;
//     let bestFitness = -Infinity;
    
//     for (let i = 0; i < tournamentSize; i++) {
//       const randomIndex = Math.floor(Math.random() * population.length);
//       const fitness = fitnessScores[randomIndex];
      
//       if (fitness > bestFitness) {
//         bestFitness = fitness;
//         best = population[randomIndex];
//       }
//     }
    
//     return JSON.parse(JSON.stringify(best));
//   }

//   /**
//    * Crossover operation
//    */
//   crossover(parent1, parent2) {
//     if (Math.random() > this.config.crossoverRate) {
//       return parent1;
//     }
    
//     const offspring = [];
//     const crossoverPoint = Math.floor(Math.random() * Math.min(parent1.length, parent2.length));
    
//     // Take first part from parent1
//     offspring.push(...parent1.slice(0, crossoverPoint));
    
//     // Take second part from parent2, avoiding conflicts
//     const assignmentTracker = new Map();
//     offspring.forEach(assignment => {
//       this.updateAssignmentTracker(assignment, assignmentTracker);
//     });
    
//     parent2.slice(crossoverPoint).forEach(assignment => {
//       if (this.isAssignmentValid(assignment, assignmentTracker)) {
//         offspring.push(assignment);
//         this.updateAssignmentTracker(assignment, assignmentTracker);
//       }
//     });
    
//     return offspring;
//   }

//   /**
//    * Mutation operation
//    */
//   mutate(individual) {
//     if (Math.random() > this.config.mutationRate) {
//       return individual;
//     }
    
//     const mutated = JSON.parse(JSON.stringify(individual));
    
//     if (mutated.length === 0) return mutated;
    
//     // Random mutation: change time slot of a random assignment
//     const randomIndex = Math.floor(Math.random() * mutated.length);
//     const assignment = mutated[randomIndex];
    
//     // Try to find a new valid slot
//     const availableDays = [...this.days];
//     const availableSlots = [...this.timeSlots];
    
//     this.shuffleArray(availableDays);
//     this.shuffleArray(availableSlots);
    
//     for (const day of availableDays) {
//       for (const slot of availableSlots) {
//         if (assignment.duration === 2 && slot.period < 6) {
//           const nextSlot = this.timeSlots.find(ts => ts.period === slot.period + 1);
//           if (nextSlot) {
//             assignment.day = day;
//             assignment.period = slot.period;
//             assignment.start_time = slot.start;
//             assignment.end_time = nextSlot.end;
//             return mutated;
//           }
//         } else if (assignment.duration === 1) {
//           assignment.day = day;
//           assignment.period = slot.period;
//           assignment.start_time = slot.start;
//           assignment.end_time = slot.end;
//           return mutated;
//         }
//       }
//     }
    
//     return mutated;
//   }

//   /**
//    * Check if assignment is valid
//    */
//   isAssignmentValid(assignment, assignmentTracker) {
//     const periods = assignment.duration === 2 ? 
//       [assignment.period, assignment.period + 1] : [assignment.period];
    
//     return periods.every(period => {
//       const teacherKey = `${assignment.teacher_id._id}_${assignment.day}_${period}`;
//       const divisionKey = `${assignment.division}_${assignment.day}_${period}`;
      
//       return !assignmentTracker.has(teacherKey) && !assignmentTracker.has(divisionKey);
//     });
//   }

//   /**
//    * Count conflicts in a timetable
//    */
//   countConflicts(timetable) {
//     const conflicts = new Set();
//     const teacherSlots = new Map();
//     const divisionSlots = new Map();
    
//     timetable.forEach(assignment => {
//       const periods = assignment.duration === 2 ? 
//         [assignment.period, assignment.period + 1] : [assignment.period];
      
//       periods.forEach(period => {
//         const teacherKey = `${assignment.teacher_id._id}_${assignment.day}_${period}`;
//         const divisionKey = `${assignment.division}_${assignment.day}_${period}`;
        
//         if (teacherSlots.has(teacherKey)) {
//           conflicts.add(`teacher_${teacherKey}`);
//         } else {
//           teacherSlots.set(teacherKey, assignment);
//         }
        
//         if (divisionSlots.has(divisionKey)) {
//           conflicts.add(`division_${divisionKey}`);
//         } else {
//           divisionSlots.set(divisionKey, assignment);
//         }
//       });
//     });
    
//     return conflicts.size;
//   }

//   /**
//    * Utility function to shuffle array
//    */
//   shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//   }
// }

// export default TimetableGeneticAlgorithm;




// import { EnhancedSubject, TeacherAvailability } from '../models/timetable.model.js';

// class TimetableGeneticAlgorithm {
//   constructor(config = {}) {
//     this.config = {
//       populationSize: config.populationSize || 50,
//       maxGenerations: config.maxGenerations || 100,
//       mutationRate: config.mutationRate || 0.1,
//       crossoverRate: config.crossoverRate || 0.8,
//       elitismRate: config.elitismRate || 0.1,
//       ...config
//     };
    
//     this.timeSlots = [
//       { period: 1, start: '10:30', end: '11:30', label: '1st Period' },
//       { period: 2, start: '11:30', end: '12:30', label: '2nd Period' },
//       { period: 3, start: '13:15', end: '14:15', label: '3rd Period' },
//       { period: 4, start: '14:15', end: '15:15', label: '4th Period' },
//       { period: 5, start: '15:30', end: '16:30', label: '5th Period' },
//       { period: 6, start: '16:30', end: '17:30', label: '6th Period' }
//     ];
    
//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     this.divisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
//   }

//   /**
//    * Main function to generate timetable for all divisions
//    */
//   async generateTimetable(departmentId, semester, subjects = null, teachers = null) {
//     try {
//       console.log('Starting timetable generation...');
      
//       // Use provided subjects or fetch from database
//       const allSubjects = subjects || await this.fetchSubjectsForDivisions(departmentId, semester);
      
//       // Fetch teacher availability
//       const teacherAvailability = await this.fetchTeacherAvailability();
      
//       // Create initial population
//       let population = this.createInitialPopulation(allSubjects);
      
//       let bestSolution = null;
//       let bestFitness = -Infinity;
//       let generation = 0;
      
//       console.log(`Initial population created with ${population.length} individuals`);
      
//       // Evolution loop
//       while (generation < this.config.maxGenerations) {
//         // Evaluate fitness for each individual
//         const fitnessScores = population.map(individual => 
//           this.calculateFitness(individual, teacherAvailability)
//         );
        
//         // Find best solution in current generation
//         const currentBestIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
//         const currentBest = population[currentBestIndex];
//         const currentBestFitness = fitnessScores[currentBestIndex];
        
//         if (currentBestFitness > bestFitness) {
//           bestFitness = currentBestFitness;
//           bestSolution = JSON.parse(JSON.stringify(currentBest));
//         }
        
//         // Check if we found a perfect solution
//         if (bestFitness >= 0.95) {
//           console.log(`Perfect solution found at generation ${generation}`);
//           break;
//         }
        
//         // Create new generation
//         population = this.createNewGeneration(population, fitnessScores);
//         generation++;
        
//         if (generation % 10 === 0) {
//           console.log(`Generation ${generation}: Best fitness = ${bestFitness.toFixed(4)}`);
//         }
//       }
      
//       console.log(`Final best fitness: ${bestFitness.toFixed(4)} after ${generation} generations`);
      
//       return this.formatTimetableResult(bestSolution, bestFitness, generation);
      
//     } catch (error) {
//       console.error('Error in genetic algorithm:', error);
//       throw error;
//     }
//   }

//   /**
//    * Format timetable result to match expected structure
//    */
//   formatTimetableResult(solution, fitness, generations) {
//     const formattedTimetable = {};
    
//     // Group assignments by division
//     this.divisions.forEach(division => {
//       formattedTimetable[division] = {};
      
//       this.days.forEach(day => {
//         formattedTimetable[division][day] = Array(6).fill(null).map(() => ({}));
//       });
//     });
    
//     // Fill in the assignments
//     solution.forEach(assignment => {
//       const daySchedule = formattedTimetable[assignment.division][assignment.day];
//       const periodIndex = assignment.period - 1;
      
//       daySchedule[periodIndex] = {
//         period: assignment.period,
//         subject: assignment._id || assignment.subject_id,
//         teacher: assignment.teacher_id._id || assignment.teacher_id,
//         classroom: assignment.classroom || '',
//         subjectName: assignment.name,
//         teacherName: assignment.teacher_id.name || 'Unknown Teacher',
//         type: assignment.type
//       };
      
//       // For labs, fill the next period too
//       if (assignment.duration === 2 && periodIndex < 5) {
//         daySchedule[periodIndex + 1] = {
//           period: assignment.period + 1,
//           subject: assignment._id || assignment.subject_id,
//           teacher: assignment.teacher_id._id || assignment.teacher_id,
//           classroom: assignment.classroom || '',
//           subjectName: assignment.name,
//           teacherName: assignment.teacher_id.name || 'Unknown Teacher',
//           type: assignment.type
//         };
//       }
//     });
    
//     return {
//       timetable: formattedTimetable,
//       metadata: {
//         fitness_score: fitness,
//         generation_count: generations,
//         conflicts_resolved: this.countConflicts(solution),
//         algorithm_version: '2.0'
//       }
//     };
//   }

//   /**
//    * Fetch subjects for all divisions
//    */
//   async fetchSubjectsForDivisions(departmentId, semester) {
//     const subjects = await EnhancedSubject.find({
//       department_id: departmentId,
//       sem_id: semester
//     }).populate('teacher_id').lean();
    
//     return this.expandSubjectsForDivisions(subjects);
//   }

//   /**
//    * Expand subjects for each division and lecture count
//    */
//   expandSubjectsForDivisions(subjects) {
//     const expandedSubjects = [];
    
//     subjects.forEach(subject => {
//       subject.divisions.forEach(division => {
//         for (let i = 0; i < subject.lecturePerWeek; i++) {
//           expandedSubjects.push({
//             ...subject,
//             division: division,
//             instance: i + 1,
//             duration: subject.type === 'Lab' ? 2 : 1
//           });
//         }
//       });
//     });
    
//     return expandedSubjects;
//   }

//   /**
//    * Fetch teacher availability constraints
//    */
//   async fetchTeacherAvailability() {
//     const availability = await TeacherAvailability.find({}).lean();
//     const availabilityMap = new Map();
    
//     availability.forEach(record => {
//       const key = `${record.teacher_id}_${record.day}`;
//       availabilityMap.set(key, record);
//     });
    
//     return availabilityMap;
//   }

//   /**
//    * Create initial population of timetables
//    */
//   // createInitialPopulation(subjects) {
//   //   const population = [];
    
//   //   for (let i = 0; i < this.config.populationSize; i++) {
//   //     const individual = this.createRandomIndividual(subjects);
//   //     population.push(individual);
//   //   }
    
//   //   return population;
//   // }

//   createInitialPopulation(subjects, teacherAvailability) {
//   const population = [];
//   for (let i = 0; i < this.config.populationSize; i++) {
//     const individual = this.createRandomIndividual(subjects, teacherAvailability);
//     population.push(individual);
//   }
//   return population;
// }


//   /**
//    * Create a random timetable individual
//    */
//   // createRandomIndividual(subjects) {
//   //   const timetable = [];
//   //   const subjectsCopy = [...subjects];
    
//   //   // Shuffle subjects for randomness
//   //   this.shuffleArray(subjectsCopy);
    
//   //   // Track assignments to avoid conflicts
//   //   const assignmentTracker = new Map();
    
//   //   subjectsCopy.forEach(subject => {
//   //     const assignment = this.findValidSlot(subject, assignmentTracker);
//   //     if (assignment) {
//   //       timetable.push(assignment);
//   //       this.updateAssignmentTracker(assignment, assignmentTracker);
//   //     }
//   //   });
    
//   //   return timetable;
//   // }

//   createRandomIndividual(subjects, teacherAvailability) {
//   const individual = [];
//   const assignmentTracker = new Map();

//   for (const subject of subjects) {
//     const assignment = this.findValidSlot(subject, assignmentTracker, teacherAvailability);
//     if (assignment) {
//       individual.push(assignment);
//     }
//   }

//   return individual;
// }


//   /**
//    * Find a valid time slot for a subject
//    */
//   // findValidSlot(subject, assignmentTracker) {
//   //   const availableSlots = [];
    
//   //   this.days.forEach(day => {
//   //     this.timeSlots.forEach(timeSlot => {
//   //       // For labs, check if we can place in consecutive slots
//   //       if (subject.type === 'Lab' && timeSlot.period < 6) {
//   //         const nextSlot = this.timeSlots.find(ts => ts.period === timeSlot.period + 1);
//   //         if (nextSlot && this.isSlotAvailable(subject, day, timeSlot, assignmentTracker) &&
//   //             this.isSlotAvailable(subject, day, nextSlot, assignmentTracker)) {
//   //           availableSlots.push({
//   //             ...subject,
//   //             day: day,
//   //             period: timeSlot.period,
//   //             start_time: timeSlot.start,
//   //             end_time: nextSlot.end,
//   //             duration: 2
//   //           });
//   //         }
//   //       } else if (subject.type !== 'Lab') {
//   //         if (this.isSlotAvailable(subject, day, timeSlot, assignmentTracker)) {
//   //           availableSlots.push({
//   //             ...subject,
//   //             day: day,
//   //             period: timeSlot.period,
//   //             start_time: timeSlot.start,
//   //             end_time: timeSlot.end,
//   //             duration: 1
//   //           });
//   //         }
//   //       }
//   //     });
//   //   });
    
//   //   return availableSlots.length > 0 ? 
//   //     availableSlots[Math.floor(Math.random() * availableSlots.length)] : null;
//   // }

//   findValidSlot(subject, assignmentTracker, teacherAvailability) {
//   const maxAttempts = 100;
//   let attempts = 0;

//   while (attempts < maxAttempts) {
//     const day = getRandomDay();
//     const timeSlot = getRandomTimeSlot();

//     if (subject.isLab) {
//       const nextSlot = { ...timeSlot, period: timeSlot.period + 1 };
//       if (
//         this.isSlotAvailable(subject, day, timeSlot, assignmentTracker, teacherAvailability) &&
//         this.isSlotAvailable(subject, day, nextSlot, assignmentTracker, teacherAvailability)
//       ) {
//         const assignment = {
//           subjectId: subject._id,
//           teacherId: subject.teacher_id._id,
//           divisionId: subject.division,
//           classId: subject.classroom,
//           subjectName: subject.subject_name,
//           teacherName: subject.teacher_id.teacher_name,
//           day,
//           period: timeSlot.period,
//           isLab: true,
//         };

//         const teacherKey1 = `${assignment.teacherId}_${day}_${timeSlot.period}`;
//         const teacherKey2 = `${assignment.teacherId}_${day}_${nextSlot.period}`;
//         const divisionKey1 = `${assignment.divisionId}_${day}_${timeSlot.period}`;
//         const divisionKey2 = `${assignment.divisionId}_${day}_${nextSlot.period}`;

//         assignmentTracker.set(teacherKey1, true);
//         assignmentTracker.set(teacherKey2, true);
//         assignmentTracker.set(divisionKey1, true);
//         assignmentTracker.set(divisionKey2, true);

//         return assignment;
//       }
//     } else {
//       if (this.isSlotAvailable(subject, day, timeSlot, assignmentTracker, teacherAvailability)) {
//         const assignment = {
//           subjectId: subject._id,
//           teacherId: subject.teacher_id._id,
//           divisionId: subject.division,
//           classId: subject.classroom,
//           subjectName: subject.subject_name,
//           teacherName: subject.teacher_id.teacher_name,
//           day,
//           period: timeSlot.period,
//           isLab: false,
//         };

//         const teacherKey = `${assignment.teacherId}_${day}_${timeSlot.period}`;
//         const divisionKey = `${assignment.divisionId}_${day}_${timeSlot.period}`;

//         assignmentTracker.set(teacherKey, true);
//         assignmentTracker.set(divisionKey, true);

//         return assignment;
//       }
//     }

//     attempts++;
//   }

//   return null;
// }


//   /**
//    * Check if a time slot is available
//    */
//   // isSlotAvailable(subject, day, timeSlot, assignmentTracker) {
//   //   // Check teacher conflict
//   //   const teacherKey = `${subject.teacher_id._id}_${day}_${timeSlot.period}`;
//   //   if (assignmentTracker.has(teacherKey)) {
//   //     return false;
//   //   }
    
//   //   // Check division conflict (same division can't have multiple subjects at same time)
//   //   const divisionKey = `${subject.division}_${day}_${timeSlot.period}`;
//   //   if (assignmentTracker.has(divisionKey)) {
//   //     return false;
//   //   }
    
//   //   return true;
//   // }


//   isSlotAvailable(subject, day, timeSlot, assignmentTracker, teacherAvailability) {
//   const teacherId = subject.teacher_id._id;
//   const period = timeSlot.period;

//   const teacherKey = `${teacherId}_${day}_${period}`;
//   const divisionKey = `${subject.division}_${day}_${period}`;

//   if (assignmentTracker.has(teacherKey)) return false;
//   if (assignmentTracker.has(divisionKey)) return false;

//   // 🆕 Check teacher availability
//   const availabilityKey = `${teacherId}_${day}`;
//   const availability = teacherAvailability.get(availabilityKey);
//   if (availability && availability.unavailable.includes(period)) {
//     return false;
//   }

//   return true;
// }

//   /**
//    * Update assignment tracker after placing a subject
//    */
//   updateAssignmentTracker(assignment, assignmentTracker) {
//     const periods = assignment.duration === 2 ? 
//       [assignment.period, assignment.period + 1] : [assignment.period];
    
//     periods.forEach(period => {
//       // Mark teacher as busy
//       const teacherKey = `${assignment.teacher_id._id}_${assignment.day}_${period}`;
//       assignmentTracker.set(teacherKey, assignment);
      
//       // Mark division as busy
//       const divisionKey = `${assignment.division}_${assignment.day}_${period}`;
//       assignmentTracker.set(divisionKey, assignment);
//     });
//   }

//   /**
//    * Calculate fitness score for a timetable
//    */
//   calculateFitness(timetable, teacherAvailability) {
//     let score = 0;
//     let totalConstraints = 0;
    
//     // 1. Hard constraints (must be satisfied)
//     const hardConstraints = this.evaluateHardConstraints(timetable);
//     score += hardConstraints.score;
//     totalConstraints += hardConstraints.total;
    
//     // 2. Soft constraints (preferred)
//     const softConstraints = this.evaluateSoftConstraints(timetable, teacherAvailability);
//     score += softConstraints.score * 0.3; // Weight soft constraints less
//     totalConstraints += softConstraints.total;
    
//     return totalConstraints > 0 ? score / totalConstraints : 0;
//   }

//   /**
//    * Evaluate hard constraints
//    */
//   evaluateHardConstraints(timetable) {
//     let score = 0;
//     let total = 0;
    
//     // Group by teacher and time slot to check conflicts
//     const teacherSlots = new Map();
//     const divisionSlots = new Map();
    
//     timetable.forEach(assignment => {
//       const periods = assignment.duration === 2 ? 
//         [assignment.period, assignment.period + 1] : [assignment.period];
      
//       periods.forEach(period => {
//         const teacherKey = `${assignment.teacher_id._id}_${assignment.day}_${period}`;
//         const divisionKey = `${assignment.division}_${assignment.day}_${period}`;
        
//         // Check teacher conflict
//         total++;
//         if (!teacherSlots.has(teacherKey)) {
//           teacherSlots.set(teacherKey, assignment);
//           score++;
//         }
        
//         // Check division conflict
//         total++;
//         if (!divisionSlots.has(divisionKey)) {
//           divisionSlots.set(divisionKey, assignment);
//           score++;
//         }
//       });
//     });
    
//     return { score, total };
//   }

//   /**
//    * Evaluate soft constraints
//    */
//   evaluateSoftConstraints(timetable, teacherAvailability) {
//     let score = 0;
//     let total = 0;
    
//     // Preferred time distribution
//     const dayDistribution = this.evaluateDayDistribution(timetable);
//     score += dayDistribution.score;
//     total += dayDistribution.total;
    
//     // Teacher workload balance
//     const workloadBalance = this.evaluateWorkloadBalance(timetable);
//     score += workloadBalance.score;
//     total += workloadBalance.total;
    
//     return { score, total };
//   }

//   /**
//    * Evaluate day distribution
//    */
//   evaluateDayDistribution(timetable) {
//     const divisionDays = new Map();
    
//     timetable.forEach(assignment => {
//       const key = assignment.division;
//       if (!divisionDays.has(key)) {
//         divisionDays.set(key, new Set());
//       }
//       divisionDays.get(key).add(assignment.day);
//     });
    
//     let score = 0;
//     let total = 0;
    
//     divisionDays.forEach((days, division) => {
//       total++;
//       // Prefer subjects spread across all 5 days
//       if (days.size >= 4) score++;
//     });
    
//     return { score, total };
//   }

//   /**
//    * Evaluate workload balance
//    */
//   evaluateWorkloadBalance(timetable) {
//     const teacherWorkload = new Map();
    
//     timetable.forEach(assignment => {
//       const teacherId = assignment.teacher_id._id;
//       if (!teacherWorkload.has(teacherId)) {
//         teacherWorkload.set(teacherId, 0);
//       }
//       teacherWorkload.set(teacherId, teacherWorkload.get(teacherId) + assignment.duration);
//     });
    
//     let score = 0;
//     let total = 0;
    
//     teacherWorkload.forEach((hours, teacherId) => {
//       total++;
//       // Prefer teachers with 15-25 hours per week
//       if (hours >= 15 && hours <= 25) score++;
//     });
    
//     return { score, total };
//   }

//   /**
//    * Create new generation through selection, crossover, and mutation
//    */
//   createNewGeneration(population, fitnessScores) {
//     const newPopulation = [];
    
//     // Elitism - keep best individuals
//     const eliteCount = Math.floor(this.config.populationSize * this.config.elitismRate);
//     const sortedIndices = fitnessScores
//       .map((fitness, index) => ({ fitness, index }))
//       .sort((a, b) => b.fitness - a.fitness)
//       .slice(0, eliteCount);
    
//     sortedIndices.forEach(({ index }) => {
//       newPopulation.push(JSON.parse(JSON.stringify(population[index])));
//     });
    
//     // Fill rest with crossover and mutation
//     while (newPopulation.length < this.config.populationSize) {
//       const parent1 = this.tournamentSelection(population, fitnessScores);
//       const parent2 = this.tournamentSelection(population, fitnessScores);
      
//       let offspring = this.crossover(parent1, parent2);
//       offspring = this.mutate(offspring);
      
//       newPopulation.push(offspring);
//     }
    
//     return newPopulation;
//   }

//   /**
//    * Tournament selection
//    */
//   tournamentSelection(population, fitnessScores, tournamentSize = 3) {
//     let best = null;
//     let bestFitness = -Infinity;
    
//     for (let i = 0; i < tournamentSize; i++) {
//       const randomIndex = Math.floor(Math.random() * population.length);
//       const fitness = fitnessScores[randomIndex];
      
//       if (fitness > bestFitness) {
//         bestFitness = fitness;
//         best = population[randomIndex];
//       }
//     }
    
//     return JSON.parse(JSON.stringify(best));
//   }

//   /**
//    * Crossover operation
//    */
//   crossover(parent1, parent2) {
//     if (Math.random() > this.config.crossoverRate) {
//       return parent1;
//     }
    
//     const offspring = [];
//     const crossoverPoint = Math.floor(Math.random() * Math.min(parent1.length, parent2.length));
    
//     // Take first part from parent1
//     offspring.push(...parent1.slice(0, crossoverPoint));
    
//     // Take second part from parent2, avoiding conflicts
//     const assignmentTracker = new Map();
//     offspring.forEach(assignment => {
//       this.updateAssignmentTracker(assignment, assignmentTracker);
//     });
    
//     parent2.slice(crossoverPoint).forEach(assignment => {
//       if (this.isAssignmentValid(assignment, assignmentTracker)) {
//         offspring.push(assignment);
//         this.updateAssignmentTracker(assignment, assignmentTracker);
//       }
//     });
    
//     return offspring;
//   }

//   /**
//    * Mutation operation
//    */
//   mutate(individual) {
//     if (Math.random() > this.config.mutationRate) {
//       return individual;
//     }
    
//     const mutated = JSON.parse(JSON.stringify(individual));
    
//     if (mutated.length === 0) return mutated;
    
//     // Random mutation: change time slot of a random assignment
//     const randomIndex = Math.floor(Math.random() * mutated.length);
//     const assignment = mutated[randomIndex];
    
//     // Try to find a new valid slot
//     const availableDays = [...this.days];
//     const availableSlots = [...this.timeSlots];
    
//     this.shuffleArray(availableDays);
//     this.shuffleArray(availableSlots);
    
//     for (const day of availableDays) {
//       for (const slot of availableSlots) {
//         if (assignment.duration === 2 && slot.period < 6) {
//           const nextSlot = this.timeSlots.find(ts => ts.period === slot.period + 1);
//           if (nextSlot) {
//             assignment.day = day;
//             assignment.period = slot.period;
//             assignment.start_time = slot.start;
//             assignment.end_time = nextSlot.end;
//             return mutated;
//           }
//         } else if (assignment.duration === 1) {
//           assignment.day = day;
//           assignment.period = slot.period;
//           assignment.start_time = slot.start;
//           assignment.end_time = slot.end;
//           return mutated;
//         }
//       }
//     }
    
//     return mutated;
//   }

//   /**
//    * Check if assignment is valid
//    */
//   isAssignmentValid(assignment, assignmentTracker) {
//     const periods = assignment.duration === 2 ? 
//       [assignment.period, assignment.period + 1] : [assignment.period];
    
//     return periods.every(period => {
//       const teacherKey = `${assignment.teacher_id._id}_${assignment.day}_${period}`;
//       const divisionKey = `${assignment.division}_${assignment.day}_${period}`;
      
//       return !assignmentTracker.has(teacherKey) && !assignmentTracker.has(divisionKey);
//     });
//   }

//   /**
//    * Count conflicts in a timetable
//    */
//   countConflicts(timetable) {
//     const conflicts = new Set();
//     const teacherSlots = new Map();
//     const divisionSlots = new Map();
    
//     timetable.forEach(assignment => {
//       const periods = assignment.duration === 2 ? 
//         [assignment.period, assignment.period + 1] : [assignment.period];
      
//       periods.forEach(period => {
//         const teacherKey = `${assignment.teacher_id._id}_${assignment.day}_${period}`;
//         const divisionKey = `${assignment.division}_${assignment.day}_${period}`;
        
//         if (teacherSlots.has(teacherKey)) {
//           conflicts.add(`teacher_${teacherKey}`);
//         } else {
//           teacherSlots.set(teacherKey, assignment);
//         }
        
//         if (divisionSlots.has(divisionKey)) {
//           conflicts.add(`division_${divisionKey}`);
//         } else {
//           divisionSlots.set(divisionKey, assignment);
//         }
//       });
//     });
    
//     return conflicts.size;
//   }

//   /**
//    * Utility function to shuffle array
//    */
//   shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//   }
// }

// export default TimetableGeneticAlgorithm;






// import { EnhancedSubject, TeacherAvailability } from '../models/timetable.model.js';

// // Add missing utility functions
// const getRandomDay = () => {
//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//   return days[Math.floor(Math.random() * days.length)];
// };

// const getRandomTimeSlot = () => {
//   const timeSlots = [
//     { period: 1, start: '10:30', end: '11:30', label: '1st Period' },
//     { period: 2, start: '11:30', end: '12:30', label: '2nd Period' },
//     { period: 3, start: '13:15', end: '14:15', label: '3rd Period' },
//     { period: 4, start: '14:15', end: '15:15', label: '4th Period' },
//     { period: 5, start: '15:30', end: '16:30', label: '5th Period' },
//     { period: 6, start: '16:30', end: '17:30', label: '6th Period' }
//   ];
//   return timeSlots[Math.floor(Math.random() * timeSlots.length)];
// };

// class TimetableGeneticAlgorithm {
  
//   constructor(config = {}) {
//     this.config = {
//       populationSize: config.populationSize || 50,
//       maxGenerations: config.maxGenerations || 100,
//       mutationRate: config.mutationRate || 0.1,
//       crossoverRate: config.crossoverRate || 0.8,
//       elitismRate: config.elitismRate || 0.1,
//       ...config
//     };
    
//     this.timeSlots = [
//       { period: 1, start: '10:30', end: '11:30', label: '1st Period' },
//       { period: 2, start: '11:30', end: '12:30', label: '2nd Period' },
//       { period: 3, start: '13:15', end: '14:15', label: '3rd Period' },
//       { period: 4, start: '14:15', end: '15:15', label: '4th Period' },
//       { period: 5, start: '15:30', end: '16:30', label: '5th Period' },
//       { period: 6, start: '16:30', end: '17:30', label: '6th Period' }
//     ];
    
//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     this.divisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
//   }

//   /**
//    * Main function to generate timetable for all divisions
//    */
//   async generateTimetable(departmentId, semester, subjects = null, teachers = null) {
//     try {
//       console.log('Starting timetable generation...');
      
//       // Use provided subjects or fetch from database
//       const allSubjects = subjects || await this.fetchSubjectsForDivisions(departmentId, semester);
      
//       // Fetch teacher availability
//       const teacherAvailability = await this.fetchTeacherAvailability();
      
//       // Create initial population
//       let population = this.createInitialPopulation(allSubjects, teacherAvailability);
      
//       let bestSolution = null;
//       let bestFitness = -Infinity;
//       let generation = 0;
      
//       console.log(`Initial population created with ${population.length} individuals`);
      
//       // Evolution loop
//       while (generation < this.config.maxGenerations) {
//         // Evaluate fitness for each individual
//         const fitnessScores = population.map(individual => 
//           this.calculateFitness(individual, teacherAvailability)
//         );
        
//         // Find best solution in current generation
//         const currentBestIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
//         const currentBest = population[currentBestIndex];
//         const currentBestFitness = fitnessScores[currentBestIndex];
        
//         if (currentBestFitness > bestFitness) {
//           bestFitness = currentBestFitness;
//           bestSolution = JSON.parse(JSON.stringify(currentBest));
//         }
        
//         // Check if we found a perfect solution
//         if (bestFitness >= 0.95) {
//           console.log(`Perfect solution found at generation ${generation}`);
//           break;
//         }
        
//         // Create new generation
//         population = this.createNewGeneration(population, fitnessScores);
//         generation++;
        
//         if (generation % 10 === 0) {
//           console.log(`Generation ${generation}: Best fitness = ${bestFitness.toFixed(4)}`);
//         }
//       }
      
//       console.log(`Final best fitness: ${bestFitness.toFixed(4)} after ${generation} generations`);
      
//       return this.formatTimetableResult(bestSolution, bestFitness, generation);
      
//     } catch (error) {
//       console.error('Error in genetic algorithm:', error);
//       throw error;
//     }
//   }

//   /**
//    * Format timetable result to match expected structure - returns FLAT ARRAY
//    */
//   formatTimetableResult(solution, fitness, generations) {
//     const timetableArray = [];
    
//     // Convert solution assignments to flat array format expected by controller
//     if (solution && Array.isArray(solution)) {
//       solution.forEach(assignment => {
//         timetableArray.push({
//           division: assignment.divisionId || assignment.division,
//           day: assignment.day,
//           period: assignment.period,
//           subject: {
//             _id: assignment.subjectId,
//             name: assignment.subjectName
//           },
//           teacher: {
//             _id: assignment.teacherId,
//             name: assignment.teacherName
//           },
//           classroom: assignment.classId || assignment.classroom || 'TBA',
//           duration: assignment.isLab ? 2 : 1
//         });
//       });
//     }
    
//     return {
//       timetable: timetableArray, // This should be a flat array
//       metadata: {
//         fitness_score: fitness,
//         generation_count: generations,
//         conflicts_resolved: this.countConflicts(solution),
//         algorithm_version: '2.0'
//       }
//     };
//   }

//   /**
//    * Fetch subjects for all divisions
//    */
//   async fetchSubjectsForDivisions(departmentId, semester) {
//     try {
//       const subjects = await EnhancedSubject.find({
//         department_id: departmentId,
//         sem_id: semester
//       }).populate('teacher_id').lean();
      
//       return this.expandSubjectsForDivisions(subjects);
//     } catch (error) {
//       console.warn('Could not fetch subjects from database, using mock data');
//       return this.createMockSubjects();
//     }
//   }

//   /**
//    * Create mock subjects for testing
//    */
//   // createMockSubjects() {
//   //   const mockSubjects = [];
//   //   const subjects = [
//   //     { name: 'Data Structures', isLab: false },
//   //     { name: 'DBMS', isLab: false },
//   //     { name: 'Web Development', isLab: true },
//   //     { name: 'Software Engineering', isLab: false },
//   //     { name: 'Computer Networks', isLab: false },
//   //     { name: 'Machine Learning', isLab: true }
//   //   ];

//   //   this.divisions.forEach(division => {
//   //     subjects.forEach((subject, idx) => {
//   //       for (let i = 0; i < (subject.isLab ? 1 : 2); i++) {
//   //         mockSubjects.push({
//   //           _id: `subject_${idx}_${division}_${i}`,
//   //           subject_name: subject.name,
//   //           division: division,
//   //           teacher_id: {
//   //             _id: `teacher_${idx}`,
//   //             teacher_name: `Prof. ${String.fromCharCode(65 + idx)}`
//   //           },
//   //           classroom: `Room ${100 + idx}`,
//   //           isLab: subject.isLab,
//   //           instance: i + 1
//   //         });
//   //       });
//   //     });
//   //   });

//   //   return mockSubjects;
//   // }
//   createMockSubjects() {
//   const mockSubjects = [];
//   const subjects = [
//     { name: 'Data Structures', isLab: false },
//     { name: 'DBMS', isLab: false },
//     { name: 'Web Development', isLab: true },
//     { name: 'Software Engineering', isLab: false },
//     { name: 'Computer Networks', isLab: false },
//     { name: 'Machine Learning', isLab: true }
//   ];

//   this.divisions.forEach(division => {
//     subjects.forEach((subject, idx) => {
//       for (let i = 0; i < (subject.isLab ? 1 : 2); i++) {
//         mockSubjects.push({
//           _id: `subject_${idx}_${division}_${i}`,
//           subject_name: subject.name,
//           division: division,
//           teacher_id: {
//             _id: `teacher_${idx}`,
//             teacher_name: `Prof. ${String.fromCharCode(65 + idx)}`
//           },
//           classroom: `Room ${100 + idx}`,
//           isLab: subject.isLab,
//           instance: i + 1
//         });
//       }
//     });
//   });

//   return mockSubjects;
// }


//   /**
//    * Expand subjects for each division and lecture count
//    */
//   expandSubjectsForDivisions(subjects) {
//     const expandedSubjects = [];
    
//     subjects.forEach(subject => {
//       subject.divisions.forEach(division => {
//         for (let i = 0; i < subject.lecturePerWeek; i++) {
//           expandedSubjects.push({
//             ...subject,
//             division: division,
//             instance: i + 1,
//             duration: subject.type === 'Lab' ? 2 : 1,
//             isLab: subject.type === 'Lab'
//           });
//         }
//       });
//     });
    
//     return expandedSubjects;
//   }

//   /**
//    * Fetch teacher availability constraints
//    */
//   async fetchTeacherAvailability() {
//     try {
//       const availability = await TeacherAvailability.find({}).lean();
//       const availabilityMap = new Map();
      
//       availability.forEach(record => {
//         const key = `${record.teacher_id}_${record.day}`;
//         availabilityMap.set(key, record);
//       });
      
//       return availabilityMap;
//     } catch (error) {
//       console.warn('Could not fetch teacher availability, using empty map');
//       return new Map();
//     }
//   }

//   /**
//    * Create initial population of timetables
//    */
//   createInitialPopulation(subjects, teacherAvailability) {
//     const population = [];
//     for (let i = 0; i < this.config.populationSize; i++) {
//       const individual = this.createRandomIndividual(subjects, teacherAvailability);
//       population.push(individual);
//     }
//     return population;
//   }

//   /**
//    * Create a random timetable individual
//    */
//   createRandomIndividual(subjects, teacherAvailability) {
//     const individual = [];
//     const assignmentTracker = new Map();

//     for (const subject of subjects) {
//       const assignment = this.findValidSlot(subject, assignmentTracker, teacherAvailability);
//       if (assignment) {
//         individual.push(assignment);
//       }
//     }

//     return individual;
//   }

//   /**
//    * Find a valid time slot for a subject
//    */
//   findValidSlot(subject, assignmentTracker, teacherAvailability) {
//     const maxAttempts = 100;
//     let attempts = 0;

//     while (attempts < maxAttempts) {
//       const day = getRandomDay();
//       const timeSlot = getRandomTimeSlot();

//       if (subject.isLab) {
//         const nextSlot = { ...timeSlot, period: timeSlot.period + 1 };
//         if (timeSlot.period < 6 &&
//           this.isSlotAvailable(subject, day, timeSlot, assignmentTracker, teacherAvailability) &&
//           this.isSlotAvailable(subject, day, nextSlot, assignmentTracker, teacherAvailability)
//         ) {
//           const assignment = {
//             subjectId: subject._id,
//             teacherId: subject.teacher_id._id,
//             divisionId: subject.division,
//             classId: subject.classroom,
//             subjectName: subject.subject_name || subject.name,
//             teacherName: subject.teacher_id.teacher_name || subject.teacher_id.name,
//             day,
//             period: timeSlot.period,
//             isLab: true,
//           };

//           const teacherKey1 = `${assignment.teacherId}_${day}_${timeSlot.period}`;
//           const teacherKey2 = `${assignment.teacherId}_${day}_${nextSlot.period}`;
//           const divisionKey1 = `${assignment.divisionId}_${day}_${timeSlot.period}`;
//           const divisionKey2 = `${assignment.divisionId}_${day}_${nextSlot.period}`;

//           assignmentTracker.set(teacherKey1, true);
//           assignmentTracker.set(teacherKey2, true);
//           assignmentTracker.set(divisionKey1, true);
//           assignmentTracker.set(divisionKey2, true);

//           return assignment;
//         }
//       } else {
//         if (this.isSlotAvailable(subject, day, timeSlot, assignmentTracker, teacherAvailability)) {
//           const assignment = {
//             subjectId: subject._id,
//             teacherId: subject.teacher_id._id,
//             divisionId: subject.division,
//             classId: subject.classroom,
//             subjectName: subject.subject_name || subject.name,
//             teacherName: subject.teacher_id.teacher_name || subject.teacher_id.name,
//             day,
//             period: timeSlot.period,
//             isLab: false,
//           };

//           const teacherKey = `${assignment.teacherId}_${day}_${timeSlot.period}`;
//           const divisionKey = `${assignment.divisionId}_${day}_${timeSlot.period}`;

//           assignmentTracker.set(teacherKey, true);
//           assignmentTracker.set(divisionKey, true);

//           return assignment;
//         }
//       }

//       attempts++;
//     }

//     // Exhaustive fallback attempt
// for (let day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
//   for (let period = 0; period < 8; period++) {
//     const timeSlot = { period };
//     if (subject.isLab && period < 7) {
//       const nextSlot = { period: period + 1 };
//       if (
//         this.isSlotAvailable(subject, day, timeSlot, assignmentTracker, teacherAvailability) &&
//         this.isSlotAvailable(subject, day, nextSlot, assignmentTracker, teacherAvailability)
//       ) {
//         const assignment = {
//           subjectId: subject._id,
//           teacherId: subject.teacher_id._id,
//           divisionId: subject.division,
//           classId: subject.classroom,
//           subjectName: subject.subject_name || subject.name,
//           teacherName: subject.teacher_id.teacher_name || subject.teacher_id.name,
//           day,
//           period,
//           isLab: true,
//         };

//         const teacherKey1 = `${assignment.teacherId}_${day}_${period}`;
//         const teacherKey2 = `${assignment.teacherId}_${day}_${period + 1}`;
//         const divisionKey1 = `${assignment.divisionId}_${day}_${period}`;
//         const divisionKey2 = `${assignment.divisionId}_${day}_${period + 1}`;

//         assignmentTracker.set(teacherKey1, true);
//         assignmentTracker.set(teacherKey2, true);
//         assignmentTracker.set(divisionKey1, true);
//         assignmentTracker.set(divisionKey2, true);

//         return assignment;
//       }
//     } else {
//       if (this.isSlotAvailable(subject, day, timeSlot, assignmentTracker, teacherAvailability)) {
//         const assignment = {
//           subjectId: subject._id,
//           teacherId: subject.teacher_id._id,
//           divisionId: subject.division,
//           classId: subject.classroom,
//           subjectName: subject.subject_name || subject.name,
//           teacherName: subject.teacher_id.teacher_name || subject.teacher_id.name,
//           day,
//           period,
//           isLab: false,
//         };

//         const teacherKey = `${assignment.teacherId}_${day}_${period}`;
//         const divisionKey = `${assignment.divisionId}_${day}_${period}`;

//         assignmentTracker.set(teacherKey, true);
//         assignmentTracker.set(divisionKey, true);

//         return assignment;
//       }
//     }
//   }
// }

// return null; // Final fallback if all slots blocked

//   }

//   /**
//    * Check if a time slot is available
//    */
//   isSlotAvailable(subject, day, timeSlot, assignmentTracker, teacherAvailability) {
//     const teacherId = subject.teacher_id._id;
//     const period = timeSlot.period;

//     const teacherKey = `${teacherId}_${day}_${period}`;
//     const divisionKey = `${subject.division}_${day}_${period}`;

//     if (assignmentTracker.has(teacherKey)) return false;
//     if (assignmentTracker.has(divisionKey)) return false;

//     // Check teacher availability
//     const availabilityKey = `${teacherId}_${day}`;
//     const availability = teacherAvailability.get(availabilityKey);
//     if (availability && availability.unavailable && availability.unavailable.includes(period)) {
//       return false;
//     }

//     return true;
//   }

//   /**
//    * Calculate fitness score for a timetable
//    */
//   calculateFitness(timetable, teacherAvailability) {
//     let score = 0;
//     let totalConstraints = 0;
    
//     // 1. Hard constraints (must be satisfied)
//     const hardConstraints = this.evaluateHardConstraints(timetable);
//     score += hardConstraints.score;
//     totalConstraints += hardConstraints.total;
    
//     // 2. Soft constraints (preferred)
//     const softConstraints = this.evaluateSoftConstraints(timetable, teacherAvailability);
//     score += softConstraints.score * 0.3; // Weight soft constraints less
//     totalConstraints += softConstraints.total;
    
//     return totalConstraints > 0 ? score / totalConstraints : 0;
//   }

//   /**
//    * Evaluate hard constraints
//    */
//   evaluateHardConstraints(timetable) {
//     let score = 0;
//     let total = 0;
    
//     // Group by teacher and time slot to check conflicts
//     const teacherSlots = new Map();
//     const divisionSlots = new Map();
    
//     timetable.forEach(assignment => {
//       const periods = assignment.isLab ? 
//         [assignment.period, assignment.period + 1] : [assignment.period];
      
//       periods.forEach(period => {
//         const teacherKey = `${assignment.teacherId}_${assignment.day}_${period}`;
//         const divisionKey = `${assignment.divisionId}_${assignment.day}_${period}`;
        
//         // Check teacher conflict
//         total++;
//         if (!teacherSlots.has(teacherKey)) {
//           teacherSlots.set(teacherKey, assignment);
//           score++;
//         }
        
//         // Check division conflict
//         total++;
//         if (!divisionSlots.has(divisionKey)) {
//           divisionSlots.set(divisionKey, assignment);
//           score++;
//         }
//       });
//     });
    
//     return { score, total };
//   }

//   /**
//    * Evaluate soft constraints
//    */
//   evaluateSoftConstraints(timetable, teacherAvailability) {
//     let score = 0;
//     let total = 0;
    
//     // Preferred time distribution
//     const dayDistribution = this.evaluateDayDistribution(timetable);
//     score += dayDistribution.score;
//     total += dayDistribution.total;
    
//     // Teacher workload balance
//     const workloadBalance = this.evaluateWorkloadBalance(timetable);
//     score += workloadBalance.score;
//     total += workloadBalance.total;
    
//     return { score, total };
//   }

//   /**
//    * Evaluate day distribution
//    */
//   evaluateDayDistribution(timetable) {
//     const divisionDays = new Map();
    
//     timetable.forEach(assignment => {
//       const key = assignment.divisionId;
//       if (!divisionDays.has(key)) {
//         divisionDays.set(key, new Set());
//       }
//       divisionDays.get(key).add(assignment.day);
//     });
    
//     let score = 0;
//     let total = 0;
    
//     divisionDays.forEach((days, division) => {
//       total++;
//       // Prefer subjects spread across all 5 days
//       if (days.size >= 4) score++;
//     });
    
//     return { score, total };
//   }

//   /**
//    * Evaluate workload balance
//    */
//   evaluateWorkloadBalance(timetable) {
//     const teacherWorkload = new Map();
    
//     timetable.forEach(assignment => {
//       const teacherId = assignment.teacherId;
//       if (!teacherWorkload.has(teacherId)) {
//         teacherWorkload.set(teacherId, 0);
//       }
//       teacherWorkload.set(teacherId, teacherWorkload.get(teacherId) + (assignment.isLab ? 2 : 1));
//     });
    
//     let score = 0;
//     let total = 0;
    
//     teacherWorkload.forEach((hours, teacherId) => {
//       total++;
//       // Prefer teachers with 15-25 hours per week
//       if (hours >= 15 && hours <= 25) score++;
//     });
    
//     return { score, total };
//   }

//   /**
//    * Create new generation through selection, crossover, and mutation
//    */
//   createNewGeneration(population, fitnessScores) {
//     const newPopulation = [];
    
//     // Elitism - keep best individuals
//     const eliteCount = Math.floor(this.config.populationSize * this.config.elitismRate);
//     const sortedIndices = fitnessScores
//       .map((fitness, index) => ({ fitness, index }))
//       .sort((a, b) => b.fitness - a.fitness)
//       .slice(0, eliteCount);
    
//     sortedIndices.forEach(({ index }) => {
//       newPopulation.push(JSON.parse(JSON.stringify(population[index])));
//     });
    
//     // Fill rest with crossover and mutation
//     while (newPopulation.length < this.config.populationSize) {
//       const parent1 = this.tournamentSelection(population, fitnessScores);
//       const parent2 = this.tournamentSelection(population, fitnessScores);
      
//       let offspring = this.crossover(parent1, parent2);
//       offspring = this.mutate(offspring);
      
//       newPopulation.push(offspring);
//     }
    
//     return newPopulation;
//   }

//   /**
//    * Tournament selection
//    */
//   tournamentSelection(population, fitnessScores, tournamentSize = 3) {
//     let best = null;
//     let bestFitness = -Infinity;
    
//     for (let i = 0; i < tournamentSize; i++) {
//       const randomIndex = Math.floor(Math.random() * population.length);
//       const fitness = fitnessScores[randomIndex];
      
//       if (fitness > bestFitness) {
//         bestFitness = fitness;
//         best = population[randomIndex];
//       }
//     }
    
//     return JSON.parse(JSON.stringify(best));
//   }

//   /**
//    * Crossover operation
//    */
//   crossover(parent1, parent2) {
//     if (Math.random() > this.config.crossoverRate) {
//       return parent1;
//     }
    
//     const offspring = [];
//     const crossoverPoint = Math.floor(Math.random() * Math.min(parent1.length, parent2.length));
    
//     // Take first part from parent1
//     offspring.push(...parent1.slice(0, crossoverPoint));
    
//     // Take second part from parent2, avoiding conflicts
//     const assignmentTracker = new Map();
//     offspring.forEach(assignment => {
//       this.updateAssignmentTracker(assignment, assignmentTracker);
//     });
    
//     parent2.slice(crossoverPoint).forEach(assignment => {
//       if (this.isAssignmentValid(assignment, assignmentTracker)) {
//         offspring.push(assignment);
//         this.updateAssignmentTracker(assignment, assignmentTracker);
//       }
//     });
    
//     return offspring;
//   }

//   /**
//    * Mutation operation
//    */
//   mutate(individual) {
//     if (Math.random() > this.config.mutationRate) {
//       return individual;
//     }
    
//     const mutated = JSON.parse(JSON.stringify(individual));
    
//     if (mutated.length === 0) return mutated;
    
//     // Random mutation: change time slot of a random assignment
//     const randomIndex = Math.floor(Math.random() * mutated.length);
//     const assignment = mutated[randomIndex];
    
//     // Try to find a new valid slot
//     const availableDays = [...this.days];
//     const availableSlots = [...this.timeSlots];
    
//     this.shuffleArray(availableDays);
//     this.shuffleArray(availableSlots);
    
//     for (const day of availableDays) {
//       for (const slot of availableSlots) {
//         if (assignment.isLab && slot.period < 6) {
//           assignment.day = day;
//           assignment.period = slot.period;
//           return mutated;
//         } else if (!assignment.isLab) {
//           assignment.day = day;
//           assignment.period = slot.period;
//           return mutated;
//         }
//       }
//     }
    
//     return mutated;
//   }

//   /**
//    * Update assignment tracker after placing a subject
//    */
//   updateAssignmentTracker(assignment, assignmentTracker) {
//     const periods = assignment.isLab ? 
//       [assignment.period, assignment.period + 1] : [assignment.period];
    
//     periods.forEach(period => {
//       // Mark teacher as busy
//       const teacherKey = `${assignment.teacherId}_${assignment.day}_${period}`;
//       assignmentTracker.set(teacherKey, assignment);
      
//       // Mark division as busy
//       const divisionKey = `${assignment.divisionId}_${assignment.day}_${period}`;
//       assignmentTracker.set(divisionKey, assignment);
//     });
//   }

//   /**
//    * Check if assignment is valid
//    */
//   isAssignmentValid(assignment, assignmentTracker) {
//     const periods = assignment.isLab ? 
//       [assignment.period, assignment.period + 1] : [assignment.period];
    
//     return periods.every(period => {
//       const teacherKey = `${assignment.teacherId}_${assignment.day}_${period}`;
//       const divisionKey = `${assignment.divisionId}_${assignment.day}_${period}`;
      
//       return !assignmentTracker.has(teacherKey) && !assignmentTracker.has(divisionKey);
//     });
//   }

//   /**
//    * Count conflicts in a timetable
//    */
//   countConflicts(timetable) {
//     if (!timetable || !Array.isArray(timetable)) return 0;
    
//     const conflicts = new Set();
//     const teacherSlots = new Map();
//     const divisionSlots = new Map();
    
//     timetable.forEach(assignment => {
//       const periods = assignment.isLab ? 
//         [assignment.period, assignment.period + 1] : [assignment.period];
      
//       periods.forEach(period => {
//         const teacherKey = `${assignment.teacherId}_${assignment.day}_${period}`;
//         const divisionKey = `${assignment.divisionId}_${assignment.day}_${period}`;
        
//         if (teacherSlots.has(teacherKey)) {
//           conflicts.add(`teacher_${teacherKey}`);
//         } else {
//           teacherSlots.set(teacherKey, assignment);
//         }
        
//         if (divisionSlots.has(divisionKey)) {
//           conflicts.add(`division_${divisionKey}`);
//         } else {
//           divisionSlots.set(divisionKey, assignment);
//         }
//       });
//     });
    
//     return conflicts.size;
//   }

//   /**
//    * Utility function to shuffle array
//    */
//   shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//   }
// }

// export default TimetableGeneticAlgorithm;
// class GeneticAlgorithm {
//   constructor(config = {}) {
//     this.config = {
//       populationSize: config.populationSize || 50,
//       maxGenerations: config.maxGenerations || 100,
//       mutationRate: config.mutationRate || 0.1,
//       crossoverRate: config.crossoverRate || 0.8,
//       elitismRate: config.elitismRate || 0.1
//     };

//     this.timeSlots = [
//       { period: 1, start: '10:30', end: '11:30' },
//       { period: 2, start: '11:30', end: '12:30' },
//       { period: 3, start: '13:15', end: '14:15' },
//       { period: 4, start: '14:15', end: '15:15' },
//       { period: 5, start: '15:30', end: '16:30' },
//       { period: 6, start: '16:30', end: '17:30' }
//     ];

//     this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     this.bestFitnessScore = 0;
//     this.currentGeneration = 0;
//     this.conflictsResolved = 0;
//   }

//   async generateSchedule({ divisions, subjects, teachers, classes }) {
//     try {
//       console.log('Starting schedule generation...');
      
//       // Create initial population
//       let population = this.createInitialPopulation(divisions, subjects, teachers, classes);
//       let bestSolution = null;
      
//       // Evolution loop
//       for (let gen = 0; gen < this.config.maxGenerations; gen++) {
//         this.currentGeneration = gen + 1;
        
//         // Evaluate fitness for each schedule
//         const fitnessScores = population.map(schedule => 
//           this.evaluateFitness(schedule, teachers)
//         );
        
//         // Find best solution
//         const bestIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
//         const currentBest = population[bestIndex];
        
//         if (fitnessScores[bestIndex] > this.bestFitnessScore) {
//           this.bestFitnessScore = fitnessScores[bestIndex];
//           bestSolution = JSON.parse(JSON.stringify(currentBest));
//         }
        
//         // Check if solution is good enough
//         if (this.bestFitnessScore >= 0.95) {
//           console.log('Found optimal solution');
//           break;
//         }
        
//         // Create new generation
//         population = this.createNewGeneration(population, fitnessScores);
        
//         if (gen % 10 === 0) {
//           console.log(`Generation ${gen}: Best fitness = ${this.bestFitnessScore}`);
//         }
//       }
      
//       // Resolve any remaining conflicts
//       const finalSchedule = this.resolveConflicts(bestSolution);
      
//       return {
//         schedule: finalSchedule,
//         metadata: {
//           generations: this.currentGeneration,
//           fitnessScore: this.bestFitnessScore,
//           conflictsResolved: this.conflictsResolved
//         }
//       };
      
//     } catch (error) {
//       console.error('Error generating schedule:', error);
//       throw error;
//     }
//   }

//   createInitialPopulation(divisions, subjects, teachers, classes) {
//     const population = [];
    
//     for (let i = 0; i < this.config.populationSize; i++) {
//       const schedule = {};
      
//       divisions.forEach(division => {
//         schedule[division] = {};
        
//         this.days.forEach(day => {
//           schedule[division][day] = Array(6).fill(null).map(() => {
//             const subject = this.getRandomItem(subjects);
//             const teacher = this.getEligibleTeacher(teachers, subject);
//             const classroom = this.getRandomItem(classes);
            
//             return {
//               subject: {
//                 id: subject._id,
//                 name: subject.name,
//                 type: subject.type || 'Theory'
//               },
//               teacher: {
//                 id: teacher?._id,
//                 name: teacher?.name || 'TBA'
//               },
//               classroom: classroom?.name || 'TBA',
//               isLab: subject.type === 'Lab'
//             };
//           });
//         });
//       });
      
//       population.push(schedule);
//     }
    
//     return population;
//   }

//   getEligibleTeacher(teachers, subject) {
//     const eligible = teachers.filter(teacher => 
//       teacher.subjects?.includes(subject._id)
//     );
//     return eligible.length ? this.getRandomItem(eligible) : null;
//   }

//   getRandomItem(array) {
//     return array[Math.floor(Math.random() * array.length)];
//   }

//   evaluateFitness(schedule, teachers) {
//     let score = 0;
//     let totalChecks = 0;
    
//     // Check teacher conflicts
//     const teacherSlots = new Map();
    
//     Object.values(schedule).forEach(divisionSchedule => {
//       Object.entries(divisionSchedule).forEach(([day, slots]) => {
//         slots.forEach((slot, period) => {
//           if (!slot) return;
          
//           totalChecks++;
//           const teacherKey = `${slot.teacher.id}_${day}_${period}`;
          
//           if (!teacherSlots.has(teacherKey)) {
//             score++;
//             teacherSlots.set(teacherKey, true);
//           }
          
//           // Check lab slots
//           if (slot.isLab && period < 5) {
//             totalChecks++;
//             const nextTeacherKey = `${slot.teacher.id}_${day}_${period + 1}`;
//             if (!teacherSlots.has(nextTeacherKey)) {
//               score++;
//               teacherSlots.set(nextTeacherKey, true);
//             }
//           }
//         });
//       });
//     });
    
//     // Check distribution of subjects
//     const subjectDistribution = new Map();
//     Object.values(schedule).forEach(divisionSchedule => {
//       Object.values(divisionSchedule).forEach(slots => {
//         slots.forEach(slot => {
//           if (!slot) return;
          
//           const subjectKey = slot.subject.id;
//           subjectDistribution.set(
//             subjectKey, 
//             (subjectDistribution.get(subjectKey) || 0) + 1
//           );
//         });
//       });
//     });
    
//     // Prefer even distribution
//     subjectDistribution.forEach(count => {
//       totalChecks++;
//       if (count <= 6) score++;  // Max 6 periods per week per subject
//     });
    
//     return totalChecks > 0 ? score / totalChecks : 0;
//   }

//   createNewGeneration(population, fitnessScores) {
//     const newPopulation = [];
    
//     // Elitism
//     const eliteCount = Math.floor(this.config.populationSize * this.config.elitismRate);
//     const sortedIndices = fitnessScores
//       .map((score, index) => ({ score, index }))
//       .sort((a, b) => b.score - a.score);
    
//     // Keep best solutions
//     for (let i = 0; i < eliteCount; i++) {
//       newPopulation.push(
//         JSON.parse(JSON.stringify(population[sortedIndices[i].index]))
//       );
//     }
    
//     // Create rest through crossover and mutation
//     while (newPopulation.length < this.config.populationSize) {
//       const parent1 = this.selectParent(population, fitnessScores);
//       const parent2 = this.selectParent(population, fitnessScores);
      
//       let offspring = this.crossover(parent1, parent2);
//       offspring = this.mutate(offspring);
      
//       newPopulation.push(offspring);
//     }
    
//     return newPopulation;
//   }

//   selectParent(population, fitnessScores) {
//     // Tournament selection
//     const tournamentSize = 3;
//     let bestFitness = -1;
//     let bestIndex = -1;
    
//     for (let i = 0; i < tournamentSize; i++) {
//       const index = Math.floor(Math.random() * population.length);
//       if (fitnessScores[index] > bestFitness) {
//         bestFitness = fitnessScores[index];
//         bestIndex = index;
//       }
//     }
    
//     return JSON.parse(JSON.stringify(population[bestIndex]));
//   }

//   crossover(schedule1, schedule2) {
//     if (Math.random() > this.config.crossoverRate) {
//       return schedule1;
//     }
    
//     const offspring = {};
    
//     Object.keys(schedule1).forEach(division => {
//       offspring[division] = {};
      
//       this.days.forEach(day => {
//         // Randomly choose from which parent to take the day's schedule
//         offspring[division][day] = Math.random() < 0.5 
//           ? [...schedule1[division][day]]
//           : [...schedule2[division][day]];
//       });
//     });
    
//     return offspring;
//   }

//   mutate(schedule) {
//     if (Math.random() > this.config.mutationRate) {
//       return schedule;
//     }
    
//     const mutated = JSON.parse(JSON.stringify(schedule));
    
//     // Randomly swap two slots
//     const division = this.getRandomItem(Object.keys(mutated));
//     const day = this.getRandomItem(this.days);
//     const period1 = Math.floor(Math.random() * 6);
//     const period2 = Math.floor(Math.random() * 6);
    
//     [
//       mutated[division][day][period1],
//       mutated[division][day][period2]
//     ] = [
//       mutated[division][day][period2],
//       mutated[division][day][period1]
//     ];
    
//     return mutated;
//   }

//   resolveConflicts(schedule) {
//     let conflicts = 0;
//     const resolved = JSON.parse(JSON.stringify(schedule));
    
//     // Track teacher assignments
//     const teacherAssignments = new Map();
    
//     Object.entries(resolved).forEach(([division, divisionSchedule]) => {
//       Object.entries(divisionSchedule).forEach(([day, slots]) => {
//         slots.forEach((slot, period) => {
//           if (!slot) return;
          
//           const teacherKey = `${slot.teacher.id}_${day}_${period}`;
          
//           if (teacherAssignments.has(teacherKey)) {
//             // Conflict found - try to swap with a free slot
//             conflicts++;
            
//             for (let p = 0; p < slots.length; p++) {
//               if (!slots[p] || !slots[p].teacher) {
//                 // Swap with free slot
//                 [slots[period], slots[p]] = [slots[p], slots[period]];
//                 break;
//               }
//             }
//           }
          
//           teacherAssignments.set(teacherKey, {
//             division,
//             subject: slot.subject.name
//           });
//         });
//       });
//     });
    
//     this.conflictsResolved = conflicts;
//     return resolved;
//   }
// }

// export default GeneticAlgorithm;


// class GeneticAlgorithm {
//   constructor(config = {}) {
//     this.populationSize = config.populationSize || 50;
//     this.maxGenerations = config.maxGenerations || 100;
//     this.mutationRate = config.mutationRate || 0.1;
//     this.crossoverRate = config.crossoverRate || 0.8;
//     this.elitismCount = Math.floor((config.elitismRate || 0.1) * this.populationSize);
//   }

//   async generateSchedule({ divisions, subjects, teachers, classes }) {
//     try {
//       console.log('🧬 Starting genetic algorithm with:', {
//         divisions: divisions.length,
//         subjects: subjects.length,
//         teachers: teachers.length,
//         classes: classes.length
//       });

//       // Initialize population
//       let population = this.initializePopulation(divisions, subjects, teachers, classes);
//       let bestSchedule = null;
//       let bestFitness = 0;
//       let generationCount = 0;
//       let conflictsResolved = 0;

//       // Evolution loop
//       for (let generation = 0; generation < this.maxGenerations; generation++) {
//         // Evaluate fitness for each schedule
//         const fitnessScores = population.map(schedule => 
//           this.calculateFitness(schedule, teachers, classes)
//         );

//         // Find best schedule in current generation
//         const bestIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
//         if (fitnessScores[bestIndex] > bestFitness) {
//           bestFitness = fitnessScores[bestIndex];
//           bestSchedule = {...population[bestIndex]};
//           conflictsResolved = this.countConflictsResolved(bestSchedule);
//         }

//         // Check if we've reached optimal solution
//         if (bestFitness >= 0.95) break;

//         // Create new generation
//         population = this.evolvePopulation(
//           population, 
//           fitnessScores,
//           teachers, 
//           classes
//         );

//         generationCount++;
//       }

//       if (!bestSchedule) {
//         throw new Error('Failed to generate valid schedule');
//       }

//       return {
//         schedule: this.formatSchedule(bestSchedule),
//         metadata: {
//           fitnessScore: bestFitness,
//           generations: generationCount,
//           conflictsResolved,
//           algorithm_version: 'genetic-v1.0'
//         }
//       };

//     } catch (error) {
//       console.error('❌ Genetic algorithm error:', error);
//       throw new Error('Error in timetable generation algorithm');
//     }
//   }

//   initializePopulation(divisions, subjects, teachers, classes) {
//     const population = [];
//     for (let i = 0; i < this.populationSize; i++) {
//       population.push(this.createRandomSchedule(divisions, subjects, teachers, classes));
//     }
//     return population;
//   }

//   createRandomSchedule(divisions, subjects, teachers, classes) {
//     const schedule = {};
//     const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
//     divisions.forEach(division => {
//       schedule[division] = {};
//       days.forEach(day => {
//         schedule[division][day] = Array(6).fill(null).map(() => {
//           const subject = subjects[Math.floor(Math.random() * subjects.length)];
//           const teacher = teachers.find(t => t.subjects?.includes(subject._id));
//           const classroom = classes[Math.floor(Math.random() * classes.length)];

//           return {
//             subject: {
//               _id: subject._id,
//               name: subject.name,
//               type: subject.type || 'Theory'
//             },
//             teacher: teacher ? {
//               _id: teacher._id,
//               name: teacher.name
//             } : null,
//             classroom: classroom?.classNumber || 'TBA'
//           };
//         });
//       });
//     });

//     return schedule;
//   }

//   calculateFitness(schedule, teachers, classes) {
//     let fitness = 1.0;
//     const conflicts = this.findConflicts(schedule, teachers, classes);
    
//     // Reduce fitness for each conflict
//     fitness -= (conflicts.length * 0.1);
    
//     return Math.max(0, fitness);
//   }

//   findConflicts(schedule, teachers, classes) {
//     const conflicts = [];
//     const teacherAssignments = new Map();
//     const classroomAssignments = new Map();

//     Object.entries(schedule).forEach(([division, divisionSchedule]) => {
//       Object.entries(divisionSchedule).forEach(([day, periods]) => {
//         periods.forEach((slot, period) => {
//           if (!slot || !slot.teacher) return;

//           // Check teacher conflicts
//           const teacherKey = `${slot.teacher._id}_${day}_${period}`;
//           if (teacherAssignments.has(teacherKey)) {
//             conflicts.push({
//               type: 'teacher_conflict',
//               description: `Teacher ${slot.teacher.name} has multiple classes at period ${period + 1} on ${day}`
//             });
//           }
//           teacherAssignments.set(teacherKey, true);

//           // Check classroom conflicts
//           const classKey = `${slot.classroom}_${day}_${period}`;
//           if (classroomAssignments.has(classKey)) {
//             conflicts.push({
//               type: 'classroom_conflict',
//               description: `Classroom ${slot.classroom} is double-booked at period ${period + 1} on ${day}`
//             });
//           }
//           classroomAssignments.set(classKey, true);
//         });
//       });
//     });

//     return conflicts;
//   }

//   evolvePopulation(population, fitnessScores, teachers, classes) {
//     const newPopulation = [];

//     // Elitism - keep best schedules
//     const sortedIndices = fitnessScores
//       .map((score, index) => ({ score, index }))
//       .sort((a, b) => b.score - a.score)
//       .map(item => item.index);

//     for (let i = 0; i < this.elitismCount; i++) {
//       newPopulation.push({...population[sortedIndices[i]]});
//     }

//     // Create rest of new population
//     while (newPopulation.length < this.populationSize) {
//       const parent1 = this.selectParent(population, fitnessScores);
//       const parent2 = this.selectParent(population, fitnessScores);
      
//       if (Math.random() < this.crossoverRate) {
//         const child = this.crossover(parent1, parent2);
//         if (Math.random() < this.mutationRate) {
//           this.mutate(child, teachers, classes);
//         }
//         newPopulation.push(child);
//       } else {
//         newPopulation.push({...parent1});
//       }
//     }

//     return newPopulation;
//   }

//   // Helper methods continue...
//     selectParent(population, fitnessScores) {
//     // Tournament selection
//     const tournamentSize = 3;
//     let bestFitness = -1;
//     let bestIndex = -1;
    
//     for (let i = 0; i < tournamentSize; i++) {
//       const index = Math.floor(Math.random() * population.length);
//       if (fitnessScores[index] > bestFitness) {
//         bestFitness = fitnessScores[index];
//         bestIndex = index;
//       }
//     }
    
//     return JSON.parse(JSON.stringify(population[bestIndex]));
//   }

//   crossover(schedule1, schedule2) {
//     if (Math.random() > this.config.crossoverRate) {
//       return schedule1;
//     }
    
//     const offspring = {};
    
//     Object.keys(schedule1).forEach(division => {
//       offspring[division] = {};
      
//       this.days.forEach(day => {
//         // Randomly choose from which parent to take the day's schedule
//         offspring[division][day] = Math.random() < 0.5 
//           ? [...schedule1[division][day]]
//           : [...schedule2[division][day]];
//       });
//     });
    
//     return offspring;
//   }

//   mutate(schedule) {
//     if (Math.random() > this.config.mutationRate) {
//       return schedule;
//     }
    
//     const mutated = JSON.parse(JSON.stringify(schedule));
    
//     // Randomly swap two slots
//     const division = this.getRandomItem(Object.keys(mutated));
//     const day = this.getRandomItem(this.days);
//     const period1 = Math.floor(Math.random() * 6);
//     const period2 = Math.floor(Math.random() * 6);
    
//     [
//       mutated[division][day][period1],
//       mutated[division][day][period2]
//     ] = [
//       mutated[division][day][period2],
//       mutated[division][day][period1]
//     ];
    
//     return mutated;
//   }

//   resolveConflicts(schedule) {
//     let conflicts = 0;
//     const resolved = JSON.parse(JSON.stringify(schedule));
    
//     // Track teacher assignments
//     const teacherAssignments = new Map();
    
//     Object.entries(resolved).forEach(([division, divisionSchedule]) => {
//       Object.entries(divisionSchedule).forEach(([day, slots]) => {
//         slots.forEach((slot, period) => {
//           if (!slot) return;
          
//           const teacherKey = `${slot.teacher.id}_${day}_${period}`;
          
//           if (teacherAssignments.has(teacherKey)) {
//             // Conflict found - try to swap with a free slot
//             conflicts++;
            
//             for (let p = 0; p < slots.length; p++) {
//               if (!slots[p] || !slots[p].teacher) {
//                 // Swap with free slot
//                 [slots[period], slots[p]] = [slots[p], slots[period]];
//                 break;
//               }
//             }
//           }
          
//           teacherAssignments.set(teacherKey, {
//             division,
//             subject: slot.subject.name
//           });
//         });
//       });
//     });
    
//     this.conflictsResolved = conflicts;
//     return resolved;
//   }

//   // Add the rest of the genetic algorithm implementation...
// }

// export default GeneticAlgorithm;

// utils/GeneticAlgorithm.js

// export default class GeneticAlgorithm {

  
//  constructor(config = {}) {
//   this.config = config;
//   this.populationSize = config.populationSize || 50;
//   this.maxGenerations = config.maxGenerations || 100;
//   this.mutationRate = config.mutationRate || 0.1;
//   this.crossoverRate = config.crossoverRate || 0.8;
//   this.elitismCount = Math.floor((config.elitismRate || 0.1) * this.populationSize);

//   // ✅ Extracting input fields from config
//   this.departmentId = config.departmentId;
//   this.semester = config.semester;
//   this.academicYear = config.academicYear;
//   this.divisions = config.divisions;
//   this.subjects = config.subjects;
//   this.teachers = config.teachers;
//   this.classes = config.classes;

//   // ✅ Days
//   this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

//   // 🧪 Logging for verification
//   console.log('🧬 GeneticAlgorithm initialized for departmentId:', this.departmentId);

//   console.log("🚀 GA Input:", {
//     semester: this.semester,
//     academicYear: this.academicYear,
//     divisionsLength: this.divisions?.length,
//     subjectsLength: this.subjects?.length,
//     teachersLength: this.teachers?.length,
//     classesLength: this.classes?.length,
//   });
// }


  
  
//   initializePopulation(divisions, subjects, teachers, classes) {
//   const population = [];
//   // console.log("📦 Divisions received in initializePopulation:", divisions);
//   // console.log(`📊 Creating ${this.populationSize} random schedules for genetic algorithm`);

//   for (let i = 0; i < this.populationSize; i++) {
//     // console.log(`\n🧬 Generating individual ${i + 1}/${this.populationSize}`);
//     const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes);
//     population.push(schedule);
//   }

//   // console.log("\n✅ Finished initializing population.");
//   return population;
// }



// // async generateSchedule({ divisions, subjects, teachers, classes }) {
// //   try {
// //     console.log("⚙️ Starting schedule generation...");
// //     console.log("📥 Input Divisions:", divisions.length);
// //     console.log("📥 Input Subjects:", subjects.length);
// //     console.log("📥 Input Teachers:", teachers.length);
// //     console.log("📥 Input Classes:", classes.length);

// //     const schedule = this.run(divisions, subjects, teachers, classes);

// //     // Log a sample of one division's schedule for debugging
// //     const firstDivision = Object.keys(schedule)[0];
// //     if (firstDivision) {
// //       console.log("🗂 Sample schedule for", firstDivision);
// //       console.log(JSON.stringify(schedule[firstDivision], null, 2));
// //     }

// //     // Check if schedule has undefined entries
// //     for (const divisionName in schedule) {
// //       for (const day of Object.keys(schedule[divisionName])) {
// //         const periods = schedule[divisionName][day];
// //         for (let i = 0; i < periods.length; i++) {
// //           const slot = periods[i];
// //           if (!slot || !slot.subject || !slot.teacher || !slot.classroom) {
// //             console.warn(`⚠️ Incomplete slot at ${divisionName} ${day} period ${i + 1}`, slot);
// //             schedule[divisionName][day][i] = null; // Clean undefined slot
// //           }
// //         }
// //       }
// //     }

// //     return {
// //       schedule,
// //       metadata: {
// //         fitnessScore: this.fitness(schedule),
// //         generation_count: this.maxGenerations,
// //         conflictsResolved: true,
// //         algorithm_version: "1.0.0"
// //       }
// //     };
// //   } catch (error) {
// //     console.error("❌ Error in generateSchedule:", error.stack || error);
// //     throw new Error("Failed to generate schedule");
// //   }
// // }

// // async generateSchedule({ divisions, subjects, teachers, classes }) {
// //   try {
// //     console.log("⚙️ Starting schedule generation...");
// //     console.log("📥 Input Counts:");
// //     console.log("Divisions:", divisions?.length);
// //     console.log("Subjects:", subjects?.length);
// //     console.log("Teachers:", teachers?.length);
// //     console.log("Classes:", classes?.length);

// //     const schedule = this.run(divisions, subjects, teachers, classes);

// //     const firstDivision = Object.keys(schedule)?.[0];
// //     if (firstDivision) {
// //       console.log(`🗂 Sample schedule for division: ${firstDivision}`);
// //       const sampleDay = Object.keys(schedule[firstDivision])[0];
// //       if (sampleDay) {
// //         console.log(`📅 Sample day: ${sampleDay}`);
// //         console.log("🧾 Periods:");
// //         schedule[firstDivision][sampleDay].forEach((slot, index) => {
// //           console.log(
// //             `Period ${index + 1}:`,
// //             slot
// //               ? `Subject: ${slot.subject?.name || "?"}, Teacher: ${slot.teacher?.name || "?"}, Room: ${slot.classroom?.room_number || "?"}`
// //               : "Free"
// //           );
// //         });
// //       }
// //     }

// //     // Sanitize undefined or incomplete slots
// //     for (const divisionName in schedule) {
// //       for (const day of Object.keys(schedule[divisionName])) {
// //         schedule[divisionName][day] = schedule[divisionName][day].map((slot, index) => {
// //           if (
// //             !slot ||
// //             !slot.subject?.name ||
// //             !slot.teacher?.name ||
// //             !slot.classroom?.room_number
// //           ) {
// //             //console.warn(`⚠️ Incomplete slot at ${divisionName} > ${day} > Period ${index + 1}`, slot);
// //             return null;
// //           }
// //           return slot;
// //         });
// //       }
// //     }

// //     return {
// //       schedule,
// //       metadata: {
// //         fitnessScore: this.fitness(schedule),
// //         generation_count: this.maxGenerations,
// //         conflictsResolved: true,
// //         algorithm_version: "1.0.0"
// //       }
// //     };
// //   } catch (error) {
// //     console.error("❌ Error in generateSchedule:", error.stack || error);
// //     throw new Error("Failed to generate schedule");
// //   }
// // }

// // async generateSchedule({ divisions, subjects, teachers, classes }) {
// //   try {
// //     console.log("\n📊 Input Summary:");
// //     console.log(`Divisions (${divisions.length}): ${divisions.join(', ')}`);
// //     console.log(`Subjects (${subjects.length}): ${subjects.map(s => `${s.name || 'Unnamed'} (${s._id})`).join(', ')}`);
// //     console.log(`Teachers (${teachers.length}): ${teachers.map(t => `${t.name} (${t._id})`).join(', ')}`);
// //     console.log(`Classes (${classes.length}): ${classes.map(c => c.room_number || 'Unknown Room').join(', ')}\n`);

// //     const schedule = this.run(divisions, subjects, teachers, classes);

// //     // Check if schedule was created properly
// //     if (!schedule || Object.keys(schedule).length === 0) {
// //       console.error("⚠️ Schedule is empty. Check input or generation logic.");
// //       return { schedule: {}, metadata: null };
// //     }

// //     // 🎯 Detailed Timetable Log
// //     for (const divisionName of divisions) {
// //       console.log(`\n📘 Division: ${divisionName}`);

// //       const divisionSchedule = schedule[divisionName];
// //       if (!divisionSchedule) {
// //         console.warn(`⚠️ No schedule found for division: ${divisionName}`);
// //         continue;
// //       }

// //       for (const day of this.days) {
// //         const periods = divisionSchedule[day] || [];
// //         console.log(`\n   📅 ${day}:`);

// //         if (periods.length === 0) {
// //           console.log("   ❌ No periods scheduled.");
// //           continue;
// //         }

// //         periods.forEach((slot, i) => {
// //           const {
// //             period = i + 1,
// //             subject,
// //             teacher,
// //             classroom,
// //             start_time,
// //             end_time
// //           } = slot || {};

// //           const subjectName = subject?.name || 'No Subject';
// //           const teacherName = teacher?.name || 'No Teacher';
// //           const room = classroom?.room_number || 'No Room';

// //           console.log(
// //             `   🕒 Period ${period} (${start_time || '??'} - ${end_time || '??'}): ` +
// //             `${subjectName} | ${teacherName} | Room ${room}`
// //           );
// //         });
// //       }
// //     }

// //     return {
// //       schedule,
// //       metadata: {
// //         fitnessScore: this.fitness(schedule),
// //         generation_count: this.maxGenerations,
// //         conflictsResolved: true,
// //         algorithm_version: "1.0.0"
// //       }
// //     };
// //   } catch (error) {
// //     console.error("❌ Error in generateSchedule:", error.stack || error);
// //     throw new Error("Failed to generate schedule");
// //   }
// // }

// async generateSchedule({ divisions, subjects, teachers, classes }) {
//   try {
//     console.log("\n📊 Input Summary:");
//     console.log(`Divisions (${divisions.length}): ${divisions.join(', ')}`);
//     console.log(`Subjects (${subjects.length}): ${subjects.map(s => `${s.name || 'Unnamed'} (${s._id})`).join(', ')}`);
//     console.log(`Teachers (${teachers.length}): ${teachers.map(t => `${t.name} (${t._id})`).join(', ')}`);
//     console.log(`Classes (${classes.length}): ${classes.map(c => c.room_number || 'Unknown Room').join(', ')}\n`);

//     const schedule = this.run(divisions, subjects, teachers, classes);

//     // Check if schedule was created properly
//     if (!schedule || Object.keys(schedule).length === 0) {
//       console.error("⚠️ Schedule is empty. Check input or generation logic.");
//       return { schedule: {}, metadata: null };
//     }

//     // 🎯 Detailed Timetable Log
//     for (const divisionName of divisions) {
//       console.log(`\n📘 Division: ${divisionName}`);

//       const divisionSchedule = schedule[divisionName];
//       if (!divisionSchedule) {
//         console.warn(`⚠️ No schedule found for division: ${divisionName}`);
//         continue;
//       }

//       for (const day of this.days) {
//         const periods = divisionSchedule[day] || [];
//         console.log(`\n   📅 ${day}:`);

//         if (periods.length === 0) {
//           console.log("   ❌ No periods scheduled");
//           continue;
//         }

//         periods.forEach((slot, index) => {
//           if (!slot) {
//             console.log(`   🕒 Period ${index + 1}: Free Period`);
//             return;
//           }

//           const {
//             subject = {},
//             teacher = {},
//             classroom = {},
//             start_time = "?",
//             end_time = "?"
//           } = slot;

//           console.log(
//             `   🕒 Period ${index + 1} (${start_time}-${end_time}): ` +
//             `${subject.name || 'No Subject'} | ` +
//             `${teacher.name || 'No Teacher'} | ` +
//             `Room ${classroom.room_number || 'No Room'}`
//           );
//         });
//       }
//     }

//     return {
//       schedule,
//       metadata: {
//         fitnessScore: this.fitness(schedule),
//         generation_count: this.maxGenerations,
//         conflictsResolved: true,
//         algorithm_version: "1.0.0"
//       }
//     };

//   } catch (error) {
//     console.error("❌ Error in generateSchedule:", error.stack || error);
//     throw new Error("Failed to generate schedule");
//   }
// }

// //  createRandomSchedule(divisions, subjects, teachers, classes) {
// //   const schedule = {};

// //   for (const division of divisions) {
// //     if (!division || !division.division_name) {
// //       console.warn("⚠️ Skipping invalid division:", division);
// //       continue;
// //     }

// //     const divisionName = division.division_name;
// //     const divisionSchedule = {};
// //     console.log(`📘 Generating schedule for division: ${divisionName}`);

// //     for (const day of this.days) {
// //       divisionSchedule[day] = Array(8).fill(null).map((_, i) => {
// //         const subject = subjects[Math.floor(Math.random() * subjects.length)];

// //         if (!subject || !subject._id || !subject.name) {
// //           console.warn(`⚠️ Skipped invalid subject at period ${i + 1}`);
// //           return null;
// //         }

// //         const eligibleTeachers = teachers.filter(t =>
// //           Array.isArray(t.subjects) && t.subjects.includes(subject._id)
// //         );
// //         const teacher = eligibleTeachers.length > 0
// //           ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)]
// //           : null;

// //         const classroom = classes.length > 0
// //           ? classes[Math.floor(Math.random() * classes.length)]
// //           : { room_number: "Unknown", _id: null };

// //         return {
// //           subject: {
// //             _id: subject._id,
// //             name: subject.name
// //           },
// //           teacher: teacher
// //             ? { _id: teacher._id, name: teacher.name }
// //             : { _id: null, name: "TBD" },
// //           classroom: {
// //             _id: classroom._id,
// //             room_number: classroom.room_number || "Unassigned"
// //           }
// //         };
// //       });
// //     }

// //     schedule[divisionName] = divisionSchedule;
// //     console.log(`✅ Schedule created for division: ${divisionName}`);
// //   }

// //   return schedule;
// // }


// // createRandomSchedule(divisions, subjects, teachers, classes) {
// //   const schedule = {};

// //   console.log("🧩 Subjects:", subjects.map(s => ({ id: s._id, name: s.name })));
// //   console.log("👨‍🏫 Teachers:", teachers.map(t => ({
// //     id: t._id,
// //     name: t.name,
// //     subjects: t.subjects
// //   })));
// //   console.log("🏫 Classes:", classes.map(c => ({
// //     id: c._id,
// //     room: c.room_number
// //   })));

// //   for (const divisionName of divisions) {
// //     console.log(`🧪 Creating schedule for division: ${divisionName}`);
// //     const divisionSchedule = {};

// //     for (const day of this.days) {
// //       console.log(`📅 Day: ${day}`);
// //       divisionSchedule[day] = Array(this.periodsPerDay).fill(null).map((_, periodIndex) => {
// //         const subject = subjects[Math.floor(Math.random() * subjects.length)];

// //         if (!subject || !subject._id || !subject.name) {
// //           console.warn(`⚠️ Invalid subject selected for period ${periodIndex + 1}`);
// //           return {
// //             period: periodIndex + 1,
// //             subject: null,
// //             teacher: null,
// //             classroom: null
// //           };
// //         }

// //         const eligibleTeachers = teachers.filter(t =>
// //           Array.isArray(t.subjects) && t.subjects.includes(subject._id)
// //         );

// //         const teacher = eligibleTeachers.length > 0
// //           ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)]
// //           : null;

// //         if (!teacher) {
// //           console.warn(`⚠️ No eligible teacher found for subject '${subject.name}' in period ${periodIndex + 1}`);
// //         }

// //         const classroom = classes.length > 0
// //           ? classes[Math.floor(Math.random() * classes.length)]
// //           : null;

// //         if (!classroom) {
// //           console.warn(`⚠️ No classroom found for period ${periodIndex + 1}`);
// //         }

// //         const slot = {
// //           period: periodIndex + 1,
// //           subject: {
// //             _id: subject._id,
// //             name: subject.name,
// //             type: subject.type || 'Theory'
// //           },
// //           teacher: teacher ? {
// //             _id: teacher._id,
// //             name: teacher.name
// //           } : null,
// //           classroom: classroom ? {
// //             _id: classroom._id,
// //             room_number: classroom.room_number || 'TBA'
// //           } : null,
// //           start_time: this.getTimeForPeriod(periodIndex).start,
// //           end_time: this.getTimeForPeriod(periodIndex).end
// //         };

// //         console.log(`🎯 Period ${periodIndex + 1}:`, slot);
// //         return slot;
// //       });
// //     }

// //     schedule[divisionName] = divisionSchedule;
// //   }

// //   return schedule;
// // }


// // createRandomSchedule(divisions, subjects, teachers, classes) {
// //   const schedule = {};

// //   console.log('\n📌 Starting schedule generation...');
// //   console.log(`🔹 Divisions count: ${divisions.length}`);
// //   console.log(`🔹 Subjects count: ${subjects.length}`);
// //   console.log(`🔹 Teachers count: ${teachers.length}`);
// //   console.log(`🔹 Classrooms count: ${classes.length}`);
// //   console.log(`🔹 Periods per day: ${this.periodsPerDay}`);
// //   console.log(`🔹 Days per week: ${this.days.length}`);

// //   for (let divIndex = 0; divIndex < divisions.length; divIndex++) {
// //     const divisionName = divisions[divIndex];
// //     const divisionSchedule = {};
// //     console.log(`\n📘 [${divIndex + 1}/${divisions.length}] Generating schedule for division: ${divisionName}`);

// //     for (const day of this.days) {
// //       console.log(`\n  🗓️  Day: ${day}`);
// //       divisionSchedule[day] = Array(this.periodsPerDay).fill(null).map((_, periodIndex) => {
// //         const subject = subjects[Math.floor(Math.random() * subjects.length)];

// //         if (!subject || !subject._id || !subject.name) {
// //           console.warn(`  ⚠️  Skipping invalid subject at period ${periodIndex + 1}`);
// //           return {
// //             period: periodIndex + 1,
// //             subject: null,
// //             teacher: null,
// //             classroom: null
// //           };
// //         }

// //         //console.log(`  ➡️  Period ${periodIndex + 1}: Selected subject: ${subject.name}`);

// //         const eligibleTeachers = teachers.filter(t =>
// //           Array.isArray(t.subjects) && t.subjects.includes(subject._id)
// //         );

// //         const teacher = eligibleTeachers.length > 0
// //           ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)]
// //           : null;

// //         if (!teacher) {
// //           console.warn(`  ⚠️  No eligible teacher found for subject ${subject.name}`);
// //         }

// //         const classroom = classes.length > 0
// //           ? classes[Math.floor(Math.random() * classes.length)]
// //           : null;

// //         if (!classroom) {
// //           console.warn(`  ⚠️  No classroom available for period ${periodIndex + 1}`);
// //         }

// //         const timeSlot = this.getTimeForPeriod(periodIndex);

// //         const periodSlot = {
// //           period: periodIndex + 1,
// //           subject: {
// //             _id: subject._id,
// //             name: subject.name,
// //             type: subject.type || 'Theory'
// //           },
// //           teacher: teacher ? {
// //             _id: teacher._id,
// //             name: teacher.name
// //           } : null,
// //           classroom: classroom ? {
// //             _id: classroom._id,
// //             room_number: classroom.room_number || 'TBA'
// //           } : null,
// //           start_time: timeSlot.start,
// //           end_time: timeSlot.end
// //         };

// //         console.log(`  ✅ Assigned: ${subject.name} by ${teacher?.name || 'N/A'} in Room ${classroom?.room_number || 'N/A'} | ${timeSlot.start} - ${timeSlot.end}`);

// //         return periodSlot;
// //       });
// //     }

// //     schedule[divisionName] = divisionSchedule;
// //   }

// //   console.log('\n✅ Finished generating full schedule.\n');
// //   return schedule;
// // }

// // createRandomSchedule(divisions, subjects, teachers, classes) {
// //   const schedule = {};
// //   this.periodsPerDay = 6; // Set number of periods

// //   console.log('\n📌 Starting schedule generation...');
// //   console.log(`🔹 Divisions: ${divisions.join(', ')}`);
// //   console.log(`🔹 Subjects: ${subjects.length} total`);
// //   console.log(`🔹 Teachers: ${teachers.length} total`);
// //   console.log(`🔹 Classrooms: ${classes.length} total\n`);

// //   // For each division
// //   for (const divisionName of divisions) {
// //     console.log(`\n🧩 Generating schedule for Division: ${divisionName}`);
// //     schedule[divisionName] = {};

// //     // For each day
// //     for (const day of this.days) {
// //       console.log(`\n📅 Day: ${day}`);
// //       schedule[divisionName][day] = [];

// //       // For each period
// //       for (let periodIndex = 0; periodIndex < this.periodsPerDay; periodIndex++) {
// //         const subject = subjects[Math.floor(Math.random() * subjects.length)];

// //         if (!subject) {
// //           console.warn(`⚠️ No subject found for ${divisionName} ${day} Period ${periodIndex + 1}`);
// //           continue;
// //         }

// //         // Filter teachers eligible for subject semester
// //         const eligibleTeachers = teachers.filter(
// //           teacher => teacher.semester === Number(subject.semester)
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
// //             name: subject.name,
// //             type: subject.type === 'theory' ? 'Theory' : subject.type
// //           },
// //           teacher: teacher ? {
// //             _id: teacher._id,
// //             name: teacher.name
// //           } : null,
// //           classroom: classroom ? {
// //             _id: classroom._id,
// //             room_number: classroom.room_number || classroom.classNumber
// //           } : null,
// //           start_time: timeSlot.start,
// //           end_time: timeSlot.end
// //         };

// //         schedule[divisionName][day].push(slot);

// //         console.log(`📚 Period ${periodIndex + 1}: Subject: ${subject.name} (${subject.type}) | ` +
// //           `Teacher: ${teacher?.name || 'TBA'} | Room: ${classroom?.room_number || 'TBA'} ` +
// //           `| Time: ${timeSlot.start} - ${timeSlot.end}`);
// //       }
// //     }
// //   }

// //   return schedule;
// // }


// // createRandomSchedule(divisions, subjects, teachers, classes) {
// //   const schedule = {};
// //   this.periodsPerDay = 6;

// //   console.log('📌 Starting random schedule generation...');
// //   console.log(`➡️ Divisions received: ${divisions.join(', ')}`);
// //   console.log(`➡️ Subjects count: ${subjects.length}`);
// //   console.log(`➡️ Teachers count: ${teachers.length}`);
// //   console.log(`➡️ Classrooms count: ${classes.length}`);

// //   for (const divisionName of divisions) {
// //     schedule[divisionName] = {};
// //     console.log(`\n🧩 Generating for Division: ${divisionName}`);

// //     for (const day of this.days) {
// //       schedule[divisionName][day] = [];
// //       console.log(`  📅 Day: ${day}`);

// //       for (let periodIndex = 0; periodIndex < this.periodsPerDay; periodIndex++) {
// //         const subject = subjects[Math.floor(Math.random() * subjects.length)];

// //         if (!subject) {
// //           console.warn(`    ⚠️ Skipping Period ${periodIndex + 1}: No subject found`);
// //           continue;
// //         }

// //         const eligibleTeachers = teachers.filter(
// //           teacher => teacher.semester === Number(subject.semester)
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
// //             name: subject.name,
// //             type: subject.type === 'theory' ? 'Theory' : subject.type
// //           },
// //           teacher: teacher ? {
// //             _id: teacher._id,
// //             name: teacher.name
// //           } : null,
// //           classroom: classroom ? {
// //             _id: classroom._id,
// //             room_number: classroom.room_number || classroom.classNumber
// //           } : null,
// //           start_time: timeSlot.start,
// //           end_time: timeSlot.end
// //         };

// //         schedule[divisionName][day].push(slot);

// //         console.log(
// //           `    ✅ Period ${periodIndex + 1}: ${subject.name} (${slot.subject.type}) | ` +
// //           `Teacher: ${teacher?.name || 'None'} | Room: ${slot.classroom?.room_number || 'None'} | ` +
// //           `Time: ${timeSlot.start} - ${timeSlot.end}`
// //         );
// //       }
// //     }
// //   }

// //   console.log('\n✅ Schedule generation completed.\n');
// //   return schedule;
// // }


// createRandomSchedule(divisions, subjects, teachers, classes) {
//   const schedule = {};
//   this.periodsPerDay = 6;

//   // Log only subject names to verify data integrity
//   console.log("📋 Subjects Check:");
//   subjects.forEach((subj, i) => {
//     console.log(`  ${i + 1}. ID: ${subj._id}, Name: "${subj.name}", Semester: ${subj.semester}`);
//   });

//   for (const divisionName of divisions) {
//     schedule[divisionName] = {};

//     for (const day of this.days) {
//       schedule[divisionName][day] = [];

//       for (let periodIndex = 0; periodIndex < this.periodsPerDay; periodIndex++) {
//         let subject = null;
//         let attempts = 0;

//         // Try up to 5 times to get a valid subject with a name
//         while (!subject && attempts < 5) {
//           const temp = subjects[Math.floor(Math.random() * subjects.length)];
//           if (temp && temp.name) subject = temp;
//           attempts++;
//         }

//         if (!subject) {
//           schedule[divisionName][day].push(null);
//           continue;
//         }

//         const eligibleTeachers = teachers.filter(
//           (teacher) => teacher.semester === Number(subject.semester)
//         );

//         const teacher = eligibleTeachers.length > 0
//           ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)]
//           : null;

//         const classroom = classes.length > 0
//           ? classes[Math.floor(Math.random() * classes.length)]
//           : null;

//         const timeSlot = this.getTimeForPeriod(periodIndex);

//         const slot = {
//           period: periodIndex + 1,
//           subject: {
//             _id: subject._id,
//             name: subject.name || 'Unnamed Subject',
//             type: subject.type === 'theory' ? 'Theory' : (subject.type || 'Theory')
//           },
//           teacher: teacher
//             ? {
//                 _id: teacher._id,
//                 name: teacher.name || 'Unnamed Teacher'
//               }
//             : null,
//           classroom: classroom
//             ? {
//                 _id: classroom._id,
//                 room_number: classroom.room_number || classroom.classNumber || 'Unassigned'
//               }
//             : null,
//           start_time: timeSlot.start,
//           end_time: timeSlot.end
//         };

//         // ✅ Minimal but important log
//         if (!subject.name) {
//           console.warn(`⚠️ Unnamed Subject detected in Division: ${divisionName}, Day: ${day}, Period: ${periodIndex + 1}`);
//         }

//         schedule[divisionName][day].push(slot);
//       }
//     }
//   }

//   return schedule;
// }




// // Update time slots for 6 periods
// getTimeForPeriod(periodIndex) {
//   const timeSlots = [
//     { start: '10:30', end: '11:30' },
//     { start: '11:30', end: '12:30' },
//     { start: '12:30', end: '13:30' },
//     { start: '14:30', end: '15:30' },
//     { start: '15:30', end: '16:30' },
//     { start: '16:30', end: '17:30' }
//   ];

//   return timeSlots[periodIndex] || { start: 'TBA', end: 'TBA' };
// }






//  fitness(schedule) {
//   let score = 0;

//   if (!schedule || typeof schedule !== 'object') {
//     //console.error("⚠️ Invalid schedule passed to fitness function");
//     return score;
//   }

//   for (const divisionName in schedule) {
//     const divisionSchedule = schedule[divisionName];

//     if (!divisionSchedule || typeof divisionSchedule !== 'object') {
//       //console.warn(`⚠️ schedule[${divisionName}] is invalid`);
//       continue;
//     }

//     const teacherDaySlots = {};
//     const classDaySlots = {};

//     for (const day of this.days) {
//       const slots = divisionSchedule[day];

//       if (!Array.isArray(slots)) {
//         //console.warn(`⚠️ schedule[${divisionName}][${day}] is not an array`);
//         continue;
//       }

//       for (let i = 0; i < slots.length; i++) {
//         const slot = slots[i];
//         if (!slot) {
//          // console.log(`ℹ️ Empty slot on ${divisionName} ${day} Period ${i + 1}`);
//           continue;
//         }

//         const teacherId = slot.teacher?._id;
//         const classId = slot.classroom?._id;

//         // ✅ Teacher conflict check
//         if (teacherId) {
//           const key = `${teacherId}-${day}-${i}`;
//           if (teacherDaySlots[key]) {
//             //console.log(`❌ Teacher conflict: Teacher ${teacherId} already assigned on ${day} Period ${i + 1}`);
//             score -= 10;
//           } else {
//             teacherDaySlots[key] = true;
//           }
//         }

//         // ✅ Classroom conflict check
//         if (classId) {
//           const key = `${classId}-${day}-${i}`;
//           if (classDaySlots[key]) {
//             //console.log(`❌ Classroom conflict: Classroom ${classId} already in use on ${day} Period ${i + 1}`);
//             score -= 5;
//           } else {
//             classDaySlots[key] = true;
//           }
//         }

//         // ✅ Valid slot bonus
//         if (slot.subject && teacherId && classId) {
//           score += 2;
//           //console.log(`✅ Scored +2 for valid slot: ${divisionName} ${day} Period ${i + 1}`);
//         } else {
//          // console.log(`⚠️ Incomplete slot: ${divisionName} ${day} Period ${i + 1} — missing subject/teacher/class`);
//         }
//       }
//     }
//   }

//  // console.log(`🏁 Final fitness score: ${score}`);
//   return score;
// }



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

//   // crossover(parent1, parent2) {
//   //   if (Math.random() > this.config.crossoverRate) {
//   //     return JSON.parse(JSON.stringify(parent1));
//   //   }

//   //   const child = {};

//   //   for (const division in parent1) {
//   //     child[division] = {};
//   //     for (const day of this.days) {
//   //       const crossoverPoint = Math.floor(Math.random() * 8); // period index
//   //       const slots1 = parent1[division][day];
//   //       const slots2 = parent2[division][day];

//   //       child[division][day] = [
//   //         ...slots1.slice(0, crossoverPoint),
//   //         ...slots2.slice(crossoverPoint)
//   //       ];
//   //     }
//   //   }

//   //   return child;
//   // }

//   crossover(parent1, parent2) {
//   if (!parent1 || !parent2 || Math.random() > this.config.crossoverRate) {
//     // 🛡️ Fallback if inputs are invalid or skipping crossover
//     return JSON.parse(JSON.stringify(parent1 || parent2 || {}));
//   }

//   const child = {};

//   for (const division in parent1) {
//     child[division] = {};
//     for (const day of this.days) {
//       const crossoverPoint = Math.floor(Math.random() * 8); // period index
//       const slots1 = parent1[division]?.[day] || [];
//       const slots2 = parent2[division]?.[day] || [];

//       child[division][day] = [
//         ...slots1.slice(0, crossoverPoint),
//         ...slots2.slice(crossoverPoint)
//       ];
//     }
//   }

//   return child;
// }



//  mutate(schedule) {
//   const mutated = JSON.parse(JSON.stringify(schedule));

//   if (Math.random() > this.config.mutationRate) return mutated;

//   const divisions = Object.keys(mutated);
//   const division = divisions[Math.floor(Math.random() * divisions.length)];
//   const day = this.days[Math.floor(Math.random() * this.days.length)];
//   const period = Math.floor(Math.random() * 8);

//   // ✅ Ensure structure exists
//   if (!mutated[division]) {
//     mutated[division] = {};
//   }

//   if (!mutated[division][day]) {
//     mutated[division][day] = new Array(8).fill(null); // assume 8 periods
//   }

//   const slots = mutated[division][day];

//   // ✅ Safe mutation
//   if (slots && slots[period] !== undefined) {
//     slots[period] = null; // or any mutation logic you want
//   }
//   //console.log(`🔄 Mutating schedule for ${division}, ${day}, Period ${period}`);

//   return mutated;
// }


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

// //  run(divisions, subjects, teachers, classes) {
// //   try {
// //     console.log("📥 Inputs received for GA:");
// //     console.log("Divisions:", divisions?.length);
// //     console.log("Subjects:", subjects?.length);
// //     console.log("Teachers:", teachers?.length);
// //     console.log("Classes:", classes?.length);

// //     let population = this.initializePopulation(divisions, subjects, teachers, classes);

// //     for (let generation = 0; generation < this.maxGenerations; generation++) {
// //       const fitnesses = population.map(schedule => this.fitness(schedule));
// //       const bestFitness = Math.max(...fitnesses);

// //       console.log(`🧬 Generation ${generation + 1} / ${this.maxGenerations}, Best Fitness: ${bestFitness}`);

// //       // Selection and elitism
// //       const selected = this.selection(population, fitnesses);
// //       const newPopulation = [];

// //       // Elitism: carry forward best schedules
// //       for (let i = 0; i < this.elitismCount; i++) {
// //         const eliteIndex = fitnesses.indexOf(Math.max(...fitnesses));
// //         newPopulation.push(population[eliteIndex]);
// //         fitnesses[eliteIndex] = -Infinity; // so same individual isn't picked again
// //       }

// //       // Crossover and mutation to form the rest of the population
// //       while (newPopulation.length < this.populationSize) {
// //         const parent1 = selected[Math.floor(Math.random() * selected.length)];
// //         const parent2 = selected[Math.floor(Math.random() * selected.length)];
// //         let child = this.crossover(parent1, parent2);
// //         child = this.mutate(child);
// //         newPopulation.push(child);
// //       }

// //       population = newPopulation;
// //     }

// //     const finalFitnesses = population.map(schedule => this.fitness(schedule));
// //     const bestIndex = finalFitnesses.indexOf(Math.max(...finalFitnesses));
// //     let bestSchedule = population[bestIndex];

// //     // Ensure final schedule is conflict-resolved before returning
// //     bestSchedule = this.resolveConflicts(bestSchedule, teachers, classes);

// //     console.log("✅ Schedule generation complete.");
// //     return bestSchedule;
// //   } catch (error) {
// //     console.error("❌ Genetic algorithm error:", error.stack || error);
// //     throw new Error("Error in timetable generation algorithm");
// //   }
// // }

// run(divisions, subjects, teachers, classes) {
//   try {
//     // console.log("📥 GA Inputs:");
//     // console.log("Divisions:", divisions?.length);
//     // console.log("Subjects:", subjects?.length);
//     // console.log("Teachers:", teachers?.length);
//     // console.log("Classes:", classes?.length);

//     let population = this.initializePopulation(divisions, subjects, teachers, classes);

//     for (let generation = 0; generation < this.maxGenerations; generation++) {
//       const fitnesses = population.map(schedule => this.fitness(schedule));
//       const bestFitness = Math.max(...fitnesses);

//      // console.log(`🧬 Generation ${generation + 1}/${this.maxGenerations} | 🔝 Fitness: ${bestFitness}`);

//       // Elitism: carry forward top N schedules
//       const selected = this.selection(population, fitnesses);
//       const newPopulation = [];

//       for (let i = 0; i < this.elitismCount; i++) {
//         const eliteIndex = fitnesses.indexOf(Math.max(...fitnesses));
//         newPopulation.push(population[eliteIndex]);
//         fitnesses[eliteIndex] = -Infinity; // Avoid picking same elite again
//       }

//       while (newPopulation.length < this.populationSize) {
//         const parent1 = selected[Math.floor(Math.random() * selected.length)];
//         const parent2 = selected[Math.floor(Math.random() * selected.length)];

//         let child = this.crossover(parent1, parent2);
//         child = this.mutate(child);
//         newPopulation.push(child);
//       }

//       population = newPopulation;
//     }

//     const finalFitnesses = population.map(schedule => this.fitness(schedule));
//     const bestIndex = finalFitnesses.indexOf(Math.max(...finalFitnesses));
//     let bestSchedule = population[bestIndex];

//     // Final cleanup
//     bestSchedule = this.resolveConflicts(bestSchedule, teachers, classes);

//     console.log("✅ Best schedule selected and conflicts resolved.");
//     return bestSchedule;
//   } catch (error) {
//     console.error("❌ Error in run:", error.stack || error);
//     throw new Error("Timetable generation failed inside run()");
//   }
// }

// }

// export default class GeneticAlgorithm {

  
//  constructor(config = {}) {
//   this.config = config;
//   this.populationSize = config.populationSize || 50;
//   this.maxGenerations = config.maxGenerations || 100;
//   this.mutationRate = config.mutationRate || 0.1;
//   this.crossoverRate = config.crossoverRate || 0.8;
//   this.elitismCount = Math.floor((config.elitismRate || 0.1) * this.populationSize);

//   // ✅ Extracting input fields from config
//   this.departmentId = config.departmentId;
//   this.semester = config.semester;
//   this.academicYear = config.academicYear;
//   this.divisions = config.divisions;
//   this.subjects = config.subjects;
//   this.teachers = config.teachers;
//   this.classes = config.classes;

//   // ✅ Days
//   this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

//   // 🧪 Logging for verification
//   console.log('🧬 GeneticAlgorithm initialized for departmentId:', this.departmentId);

//   console.log("🚀 GA Input:", {
//     semester: this.semester,
//     academicYear: this.academicYear,
//     divisionsLength: this.divisions?.length,
//     subjectsLength: this.subjects?.length,
//     teachersLength: this.teachers?.length,
//     classesLength: this.classes?.length,
//   });
// }


  
  
//   initializePopulation(divisions, subjects, teachers, classes) {
//   const population = [];
//   // console.log("📦 Divisions received in initializePopulation:", divisions);
//   // console.log(`📊 Creating ${this.populationSize} random schedules for genetic algorithm`);

//   for (let i = 0; i < this.populationSize; i++) {
//     // console.log(`\n🧬 Generating individual ${i + 1}/${this.populationSize}`);
//     const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes);
//     population.push(schedule);
//   }

//   // console.log("\n✅ Finished initializing population.");
//   return population;
// }

// async generateSchedule({ divisions, subjects, teachers, classes }) {
//   try {
//     console.log("\n📊 Input Summary:");
//     console.log(`Divisions (${divisions.length}): ${divisions.join(', ')}`);
//     console.log(`Subjects (${subjects.length}): ${subjects.map(s => `${s.name || 'Unnamed'} (${s._id})`).join(', ')}`);
//     console.log(`Teachers (${teachers.length}): ${teachers.map(t => `${t.name} (${t._id})`).join(', ')}`);
//     console.log(`Classes (${classes.length}): ${classes.map(c => c.room_number || 'Unknown Room').join(', ')}\n`);

//     const schedule = this.run(divisions, subjects, teachers, classes);

//     // Check if schedule was created properly
//     if (!schedule || Object.keys(schedule).length === 0) {
//       console.error("⚠️ Schedule is empty. Check input or generation logic.");
//       return { schedule: {}, metadata: null };
//     }

//     // 🎯 Detailed Timetable Log - FIXED: Proper object destructuring
//     for (const divisionName of divisions) {
//       console.log(`\n📘 Division: ${divisionName}`);

//       const divisionSchedule = schedule[divisionName];
//       if (!divisionSchedule) {
//         console.warn(`⚠️ No schedule found for division: ${divisionName}`);
//         continue;
//       }

//       for (const day of this.days) {
//         const periods = divisionSchedule[day] || [];
//         console.log(`\n   📅 ${day} => ${periods.length} periods`);

//         if (periods.length === 0) {
//           console.log("   ❌ No periods scheduled");
//           continue;
//         }

//         periods.forEach((slot, index) => {
//           if (!slot) {
//             console.log(`   🕒 Period ${index + 1}: Free Period`);
//             return;
//           }

//           // ✅ FIXED: Proper object destructuring with null checks
//           const subjectName = slot.subject?.name || 'No Subject';
//           const teacherName = slot.teacher?.name || 'No Teacher';
//           const roomNumber = slot.classroom?.room_number || 'No Room';
//           const startTime = slot.start_time || '??';
//           const endTime = slot.end_time || '??';

//           console.log(
//             `   🕒 Period ${index + 1} (${startTime}-${endTime}): ` +
//             `${subjectName} | ${teacherName} | Room ${roomNumber}`
//           );
//         });
//       }
//     }

//     return {
//       schedule,
//       metadata: {
//         fitnessScore: this.fitness(schedule),
//         generation_count: this.maxGenerations,
//         conflictsResolved: true,
//         algorithm_version: "1.0.0"
//       }
//     };

//   } catch (error) {
//     console.error("❌ Error in generateSchedule:", error.stack || error);
//     throw new Error("Failed to generate schedule");
//   }
// }

// // createRandomSchedule(divisions, subjects, teachers, classes) {
// //   const schedule = {};
// //   this.periodsPerDay = 6;

// //   // ✅ FIXED: Better subject validation and logging
// //   console.log("📋 Subjects Check:");
// //   subjects.forEach((subj, i) => {
// //     // ✅ FIXED: Proper null checking and property extraction
// //     const subjectId = subj?._id || 'N/A';
// //     const subjectName = subj?.name || 'Unnamed Subject';
// //     const subjectSemester = subj?.semester || 'N/A';
// //     console.log(`  ${i + 1}. ID: ${subjectId}, Name: "${subjectName}", Semester: ${subjectSemester}`);
// //   });

// //   for (const divisionName of divisions) {
// //     schedule[divisionName] = {};

// //     for (const day of this.days) {
// //       schedule[divisionName][day] = [];

// //       for (let periodIndex = 0; periodIndex < this.periodsPerDay; periodIndex++) {
// //         // let subject = null;
// //         // let attempts = 0;

// //         // // Try up to 5 times to get a valid subject with a name
// //         // while (!subject && attempts < 5) {
// //         //   const temp = subjects[Math.floor(Math.random() * subjects.length)];
// //         //   if (temp && temp.name) subject = temp;
// //         //   attempts++;
// //         // }

// //         let subject = null;
// // let attempts = 0;

// // // Only pick subjects with a valid name
// // const validSubjects = subjects.filter(s => s.name && s.name.trim() !== '');

// // if (validSubjects.length === 0) {
// //   console.warn("⚠️ No valid subjects with names found. All subjects are unnamed.");
// // } else {
// //   while (!subject && attempts < 5) {
// //     const temp = validSubjects[Math.floor(Math.random() * validSubjects.length)];
// //     subject = temp;
// //     attempts++;
// //   }
// // }


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

// //         // ✅ FIXED: Proper object construction with null checks
// //         const slot = {
// //           period: periodIndex + 1,
// //           subject: {
// //             _id: subject._id,
// //             name: subject.name || 'Unnamed Subject',
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

// //         // ✅ FIXED: Better logging with proper property access
// //         if (!subject.name) {
// //           console.warn(`⚠️ Unnamed Subject detected in Division: ${divisionName}, Day: ${day}, Period: ${periodIndex + 1}`);
// //         }

// //         schedule[divisionName][day].push(slot);
// //       }
// //     }
// //   }
  

// //   return schedule;
// // }

// // Update time slots for 6 periods
// createRandomSchedule(divisions, subjects, teachers, classes) {
//   const schedule = {};
//   this.periodsPerDay = 6;

//   // ✅ Logging for subject verification
//   console.log("📋 Subjects Check:");
//   subjects.forEach((subj, i) => {
//     const subjectId = subj?._id || 'N/A';
//     const subjectName = subj?.name || 'Unnamed Subject';
//     const subjectSemester = subj?.semester || 'N/A';
//     console.log(`  ${i + 1}. ID: ${subjectId}, Name: "${subjectName}", Semester: ${subjectSemester}`);
//   });

//   // ✅ Filter valid subjects with proper names
//   const validSubjects = subjects.filter(s => s.name && s.name.trim() !== '');
//   if (validSubjects.length === 0) {
//     console.warn("⚠️ No valid subjects with names found. All subjects are unnamed.");
//   }

//   for (const divisionName of divisions) {
//     schedule[divisionName] = {};

//     for (const day of this.days) {
//       schedule[divisionName][day] = [];

//       for (let periodIndex = 0; periodIndex < this.periodsPerDay; periodIndex++) {
//         let subject = null;
//         let attempts = 0;

//         // ✅ Try to pick a valid subject with a name
//         while (!subject && attempts < 5 && validSubjects.length > 0) {
//           const temp = validSubjects[Math.floor(Math.random() * validSubjects.length)];
//           subject = temp;
//           attempts++;
//         }

//         if (!subject) {
//           // ❌ Couldn't assign any subject for this period
//           schedule[divisionName][day].push(null);
//           continue;
//         }

//         // ✅ Find eligible teachers based on semester
//         const eligibleTeachers = teachers.filter(
//           (teacher) => teacher.semester === Number(subject.semester)
//         );
//         const teacher = eligibleTeachers.length > 0
//           ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)]
//           : null;

//         // ✅ Pick a random classroom if available
//         const classroom = classes.length > 0
//           ? classes[Math.floor(Math.random() * classes.length)]
//           : null;

//         // ✅ Generate time slot
//         const timeSlot = this.getTimeForPeriod(periodIndex);

//         // ✅ Construct schedule slot object
//         const slot = {
//           period: periodIndex + 1,
//           subject: {
//             _id: subject._id,
//             name: subject.name || 'Unnamed Subject',
//             type: subject.type === 'theory' ? 'Theory' : (subject.type || 'Theory')
//           },
//           teacher: teacher
//             ? {
//                 _id: teacher._id,
//                 name: teacher.name || 'Unnamed Teacher'
//               }
//             : null,
//           classroom: classroom
//             ? {
//                 _id: classroom._id,
//                 room_number: classroom.room_number || classroom.classNumber || 'Unassigned'
//               }
//             : null,
//           start_time: timeSlot.start,
//           end_time: timeSlot.end
//         };

//         if (!subject.name) {
//           console.warn(`⚠️ Unnamed Subject in Division: ${divisionName}, Day: ${day}, Period: ${periodIndex + 1}`);
//         }

//         schedule[divisionName][day].push(slot);
//       }
//     }
//   }

//   // ✅ Final subject list log
//   console.log("✅ Valid Subjects Used:", validSubjects.map(s => `${s.name} (${s._id})`).join(', '));

//   return schedule;
// }


// getTimeForPeriod(periodIndex) {
//   const timeSlots = [
//     { start: '10:30', end: '11:30' },
//     { start: '11:30', end: '12:30' },
//     { start: '12:30', end: '13:30' },
//     { start: '14:30', end: '15:30' },
//     { start: '15:30', end: '16:30' },
//     { start: '16:30', end: '17:30' }
//   ];

//   return timeSlots[periodIndex] || { start: 'TBA', end: 'TBA' };
// }

//  fitness(schedule) {
//   let score = 0;

//   if (!schedule || typeof schedule !== 'object') {
//     //console.error("⚠️ Invalid schedule passed to fitness function");
//     return score;
//   }

//   for (const divisionName in schedule) {
//     const divisionSchedule = schedule[divisionName];

//     if (!divisionSchedule || typeof divisionSchedule !== 'object') {
//       //console.warn(`⚠️ schedule[${divisionName}] is invalid`);
//       continue;
//     }

//     const teacherDaySlots = {};
//     const classDaySlots = {};

//     for (const day of this.days) {
//       const slots = divisionSchedule[day];

//       if (!Array.isArray(slots)) {
//         //console.warn(`⚠️ schedule[${divisionName}][${day}] is not an array`);
//         continue;
//       }

//       for (let i = 0; i < slots.length; i++) {
//         const slot = slots[i];
//         if (!slot) {
//          // console.log(`ℹ️ Empty slot on ${divisionName} ${day} Period ${i + 1}`);
//           continue;
//         }

//         const teacherId = slot.teacher?._id;
//         const classId = slot.classroom?._id;

//         // ✅ Teacher conflict check
//         if (teacherId) {
//           const key = `${teacherId}-${day}-${i}`;
//           if (teacherDaySlots[key]) {
//             //console.log(`❌ Teacher conflict: Teacher ${teacherId} already assigned on ${day} Period ${i + 1}`);
//             score -= 10;
//           } else {
//             teacherDaySlots[key] = true;
//           }
//         }

//         // ✅ Classroom conflict check
//         if (classId) {
//           const key = `${classId}-${day}-${i}`;
//           if (classDaySlots[key]) {
//             //console.log(`❌ Classroom conflict: Classroom ${classId} already in use on ${day} Period ${i + 1}`);
//             score -= 5;
//           } else {
//             classDaySlots[key] = true;
//           }
//         }

//         // ✅ Valid slot bonus
//         if (slot.subject && teacherId && classId) {
//           score += 2;
//           //console.log(`✅ Scored +2 for valid slot: ${divisionName} ${day} Period ${i + 1}`);
//         } else {
//          // console.log(`⚠️ Incomplete slot: ${divisionName} ${day} Period ${i + 1} — missing subject/teacher/class`);
//         }
//       }
//     }
//   }

//  // console.log(`🏁 Final fitness score: ${score}`);
//   return score;
// }

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
//   if (!parent1 || !parent2 || Math.random() > this.config.crossoverRate) {
//     // 🛡️ Fallback if inputs are invalid or skipping crossover
//     return JSON.parse(JSON.stringify(parent1 || parent2 || {}));
//   }

//   const child = {};

//   for (const division in parent1) {
//     child[division] = {};
//     for (const day of this.days) {
//       const crossoverPoint = Math.floor(Math.random() * 8); // period index
//       const slots1 = parent1[division]?.[day] || [];
//       const slots2 = parent2[division]?.[day] || [];

//       child[division][day] = [
//         ...slots1.slice(0, crossoverPoint),
//         ...slots2.slice(crossoverPoint)
//       ];
//     }
//   }

//   return child;
// }

//  mutate(schedule) {
//   const mutated = JSON.parse(JSON.stringify(schedule));

//   if (Math.random() > this.config.mutationRate) return mutated;

//   const divisions = Object.keys(mutated);
//   const division = divisions[Math.floor(Math.random() * divisions.length)];
//   const day = this.days[Math.floor(Math.random() * this.days.length)];
//   const period = Math.floor(Math.random() * 8);

//   // ✅ Ensure structure exists
//   if (!mutated[division]) {
//     mutated[division] = {};
//   }

//   if (!mutated[division][day]) {
//     mutated[division][day] = new Array(8).fill(null); // assume 8 periods
//   }

//   const slots = mutated[division][day];

//   // ✅ Safe mutation
//   if (slots && slots[period] !== undefined) {
//     slots[period] = null; // or any mutation logic you want
//   }
//   //console.log(`🔄 Mutating schedule for ${division}, ${day}, Period ${period}`);

//   return mutated;
// }

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

// run(divisions, subjects, teachers, classes) {
//   try {
//     // console.log("📥 GA Inputs:");
//     // console.log("Divisions:", divisions?.length);
//     // console.log("Subjects:", subjects?.length);
//     // console.log("Teachers:", teachers?.length);
//     // console.log("Classes:", classes?.length);

//     let population = this.initializePopulation(divisions, subjects, teachers, classes);

//     for (let generation = 0; generation < this.maxGenerations; generation++) {
//       const fitnesses = population.map(schedule => this.fitness(schedule));
//       const bestFitness = Math.max(...fitnesses);

//      // console.log(`🧬 Generation ${generation + 1}/${this.maxGenerations} | 🔝 Fitness: ${bestFitness}`);

//       // Elitism: carry forward top N schedules
//       const selected = this.selection(population, fitnesses);
//       const newPopulation = [];

//       for (let i = 0; i < this.elitismCount; i++) {
//         const eliteIndex = fitnesses.indexOf(Math.max(...fitnesses));
//         newPopulation.push(population[eliteIndex]);
//         fitnesses[eliteIndex] = -Infinity; // Avoid picking same elite again
//       }

//       while (newPopulation.length < this.populationSize) {
//         const parent1 = selected[Math.floor(Math.random() * selected.length)];
//         const parent2 = selected[Math.floor(Math.random() * selected.length)];

//         let child = this.crossover(parent1, parent2);
//         child = this.mutate(child);
//         newPopulation.push(child);
//       }

//       population = newPopulation;
//     }

//     const finalFitnesses = population.map(schedule => this.fitness(schedule));
//     const bestIndex = finalFitnesses.indexOf(Math.max(...finalFitnesses));
//     let bestSchedule = population[bestIndex];

//     // Final cleanup
//     bestSchedule = this.resolveConflicts(bestSchedule, teachers, classes);

//     console.log("✅ Best schedule selected and conflicts resolved.");
//     return bestSchedule;
//   } catch (error) {
//     console.error("❌ Error in run:", error.stack || error);
//     throw new Error("Timetable generation failed inside run()");
//   }
// }

// }


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
    this.subjects = config.subjects;
    this.teachers = config.teachers;
    this.classes = config.classes;

    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  }

  initializePopulation(divisions, subjects, teachers, classes) {
    const population = [];
    for (let i = 0; i < this.populationSize; i++) {
      const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes);
      population.push(schedule);
    }
    return population;
  }

  async generateSchedule({ divisions, subjects, teachers, classes }) {
    try {
      const schedule = this.run(divisions, subjects, teachers, classes);

      if (!schedule || Object.keys(schedule).length === 0) {
        return { schedule: {}, metadata: null };
      }

      return {
        schedule,
        metadata: {
          fitnessScore: this.fitness(schedule),
          generation_count: this.maxGenerations,
          conflictsResolved: true,
          algorithm_version: "1.0.0"
        }
      };
    } catch (error) {
      throw new Error("Failed to generate schedule");
    }
  }

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

createRandomSchedule(divisions, subjects, teachers, classes) {
  const schedule = {};
  this.periodsPerDay = 6;

  const validSubjects = subjects.filter(s => s.name && s.name.trim() !== '');

  for (const divisionName of divisions) {
    schedule[divisionName] = {};

    for (const day of this.days) {
      schedule[divisionName][day] = [];

      for (let periodIndex = 0; periodIndex < this.periodsPerDay; periodIndex++) {
        let subject = null;
        let attempts = 0;

        while (!subject && attempts < 5 && validSubjects.length > 0) {
          const temp = validSubjects[Math.floor(Math.random() * validSubjects.length)];
          subject = temp;
          attempts++;
        }

        if (!subject) {
          schedule[divisionName][day].push(null);
          continue;
        }

        const eligibleTeachers = teachers.filter(
          (teacher) => teacher.semester === Number(subject.semester)
        );
        const teacher = eligibleTeachers.length > 0
          ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)]
          : null;

        const classroom = classes.length > 0
          ? classes[Math.floor(Math.random() * classes.length)]
          : null;

        const timeSlot = this.getTimeForPeriod(periodIndex);

        const slot = {
          period: periodIndex + 1,
          subject: {
            _id: subject._id,
            subjectName: subject.name || subject.subjectName || 'Unnamed Subject',
            type: subject.type === 'theory' ? 'Theory' : (subject.type || 'Theory')
          },
          teacher: teacher
            ? {
                _id: teacher._id,
                name: teacher.name || 'Unnamed Teacher'
              }
            : null,
          classroom: classroom
            ? {
                _id: classroom._id,
                room_number: classroom.room_number || classroom.classNumber || 'Unassigned'
              }
            : null,
          start_time: timeSlot.start,
          end_time: timeSlot.end
        };

        schedule[divisionName][day].push(slot);
      }
    }
  }

  return schedule;
}


  getTimeForPeriod(periodIndex) {
    const timeSlots = [
      { start: '10:30', end: '11:30' },
      { start: '11:30', end: '12:30' },
      { start: '12:30', end: '13:30' },
      { start: '14:30', end: '15:30' },
      { start: '15:30', end: '16:30' },
      { start: '16:30', end: '17:30' }
    ];

    return timeSlots[periodIndex] || { start: 'TBA', end: 'TBA' };
  }

  fitness(schedule) {
    let score = 0;

    if (!schedule || typeof schedule !== 'object') {
      return score;
    }

    for (const divisionName in schedule) {
      const divisionSchedule = schedule[divisionName];

      if (!divisionSchedule || typeof divisionSchedule !== 'object') {
        continue;
      }

      const teacherDaySlots = {};
      const classDaySlots = {};

      for (const day of this.days) {
        const slots = divisionSchedule[day];

        if (!Array.isArray(slots)) {
          continue;
        }

        for (let i = 0; i < slots.length; i++) {
          const slot = slots[i];
          if (!slot) continue;

          const teacherId = slot.teacher?._id;
          const classId = slot.classroom?._id;

          if (teacherId) {
            const key = `${teacherId}-${day}-${i}`;
            if (teacherDaySlots[key]) {
              score -= 10;
            } else {
              teacherDaySlots[key] = true;
            }
          }

          if (classId) {
            const key = `${classId}-${day}-${i}`;
            if (classDaySlots[key]) {
              score -= 5;
            } else {
              classDaySlots[key] = true;
            }
          }

          if (slot.subject && teacherId && classId) {
            score += 2;
          }
        }
      }
    }

    return score;
  }

  selection(population, fitnesses) {
    const totalFitness = fitnesses.reduce((sum, f) => sum + f, 0);
    const probabilities = fitnesses.map(f => f / totalFitness);

    const selected = [];
    for (let i = 0; i < population.length; i++) {
      const rand = Math.random();
      let acc = 0;
      for (let j = 0; j < population.length; j++) {
        acc += probabilities[j];
        if (rand < acc) {
          selected.push(population[j]);
          break;
        }
      }
    }

    return selected;
  }

  crossover(parent1, parent2) {
    if (!parent1 || !parent2 || Math.random() > this.config.crossoverRate) {
      return JSON.parse(JSON.stringify(parent1 || parent2 || {}));
    }

    const child = {};

    for (const division in parent1) {
      child[division] = {};
      for (const day of this.days) {
        const crossoverPoint = Math.floor(Math.random() * 8);
        const slots1 = parent1[division]?.[day] || [];
        const slots2 = parent2[division]?.[day] || [];

        child[division][day] = [
          ...slots1.slice(0, crossoverPoint),
          ...slots2.slice(crossoverPoint)
        ];
      }
    }

    return child;
  }

  mutate(schedule) {
    const mutated = JSON.parse(JSON.stringify(schedule));

    if (Math.random() > this.config.mutationRate) return mutated;

    const divisions = Object.keys(mutated);
    const division = divisions[Math.floor(Math.random() * divisions.length)];
    const day = this.days[Math.floor(Math.random() * this.days.length)];
    const period = Math.floor(Math.random() * 8);

    if (!mutated[division]) {
      mutated[division] = {};
    }

    if (!mutated[division][day]) {
      mutated[division][day] = new Array(8).fill(null);
    }

    const slots = mutated[division][day];

    if (slots && slots[period] !== undefined) {
      slots[period] = null;
    }

    return mutated;
  }

  resolveConflicts(schedule, teachers, classes) {
    for (const division in schedule) {
      for (const day of this.days) {
        const slots = schedule[division][day];
        const teacherPeriodSet = new Set();
        const classPeriodSet = new Set();

        for (let i = 0; i < slots.length; i++) {
          const slot = slots[i];
          if (!slot) continue;

          const teacherId = slot.teacher?._id;
          const classId = slot.classroom?._id;

          const teacherKey = `${teacherId}-${day}-${i}`;
          const classKey = `${classId}-${day}-${i}`;

          if (teacherPeriodSet.has(teacherKey) || classPeriodSet.has(classKey)) {
            slots[i] = null;
          } else {
            teacherPeriodSet.add(teacherKey);
            classPeriodSet.add(classKey);
          }
        }
      }
    }

    return schedule;
  }

  run(divisions, subjects, teachers, classes) {
    try {
      let population = this.initializePopulation(divisions, subjects, teachers, classes);

      for (let generation = 0; generation < this.maxGenerations; generation++) {
        const fitnesses = population.map(schedule => this.fitness(schedule));
        const selected = this.selection(population, fitnesses);
        const newPopulation = [];

        for (let i = 0; i < this.elitismCount; i++) {
          const eliteIndex = fitnesses.indexOf(Math.max(...fitnesses));
          newPopulation.push(population[eliteIndex]);
          fitnesses[eliteIndex] = -Infinity;
        }

        while (newPopulation.length < this.populationSize) {
          const parent1 = selected[Math.floor(Math.random() * selected.length)];
          const parent2 = selected[Math.floor(Math.random() * selected.length)];

          let child = this.crossover(parent1, parent2);
          child = this.mutate(child);
          newPopulation.push(child);
        }

        population = newPopulation;
      }

      const finalFitnesses = population.map(schedule => this.fitness(schedule));
      const bestIndex = finalFitnesses.indexOf(Math.max(...finalFitnesses));
      let bestSchedule = population[bestIndex];

      bestSchedule = this.resolveConflicts(bestSchedule, teachers, classes);

      return bestSchedule;
    } catch (error) {
      throw new Error("Timetable generation failed inside run()");
    }
  }
}



// export default class GeneticAlgorithm {
//   constructor(config = {}) {
//     this.populationSize = config.populationSize || 50;
//     this.maxGenerations = config.maxGenerations || 100;
//     this.mutationRate = config.mutationRate || 0.1;
//     this.crossoverRate = config.crossoverRate || 0.8;
//     this.elitismRate = config.elitismRate || 0.1;
//     this.periodsPerDay = 6;
//   }

//   async generateSchedule({ divisions, subjects, teachers, classes }) {
//   try {
//     const schedule = this.run(divisions, subjects, teachers, classes);

//     if (!schedule || Object.keys(schedule).length === 0) {
//       console.error("⚠️ Empty schedule generated");
//       return { schedule: {}, metadata: null };
//     }

//     return {
//       schedule,
//       metadata: {
//         fitnessScore: this.fitness(schedule),
//         generation_count: this.maxGenerations,
//         conflictsResolved: true,
//         algorithm_version: "1.0.0"
//       }
//     };
//   } catch (error) {
//     console.error("❌ Error in generateSchedule:", error);
//     throw new Error("Failed to generate schedule");
//   }
// }


//   run(divisions, subjects, teachers, classes) {
//     let population = this.initializePopulation(divisions, subjects, teachers, classes);

//     for (let generation = 0; generation < this.maxGenerations; generation++) {
//       const fitnessScores = population.map((schedule) => this.fitness(schedule));
//       const eliteCount = Math.floor(this.elitismRate * this.populationSize);
//       const elites = this.selectElite(population, fitnessScores, eliteCount);

//       const newPopulation = [...elites];

//       while (newPopulation.length < this.populationSize) {
//         const parent1 = this.selectParent(population, fitnessScores);
//         const parent2 = this.selectParent(population, fitnessScores);

//         let offspring;
//         if (Math.random() < this.crossoverRate) {
//           offspring = this.crossover(parent1, parent2);
//         } else {
//           offspring = { ...parent1 };
//         }

//         const mutated = this.mutate(offspring, divisions, subjects, teachers, classes);
//         newPopulation.push(mutated);
//       }

//       population = newPopulation;
//     }

//     const bestSchedule = this.selectElite(
//       population,
//       population.map((schedule) => this.fitness(schedule)),
//       1
//     )[0];

//     return bestSchedule;
//   }

//   initializePopulation(divisions, subjects, teachers, classes) {
//     const population = [];
//     for (let i = 0; i < this.populationSize; i++) {
//       const schedule = this.createRandomSchedule(divisions, subjects, teachers, classes);
//       population.push(schedule);
//     }
//     return population;
//   }

// createRandomSchedule(divisions, subjects, teachers, classes) {
//   const schedule = {};

//   divisions.forEach((division) => {
//     // No filtering by division
//     const eligibleSubjects = subjects.filter(subj => subj._id); // at least has an ID

//     for (let day = 0; day < 5; day++) {
//       for (let period = 0; period < this.periodsPerDay; period++) {
//         const subject = eligibleSubjects[Math.floor(Math.random() * eligibleSubjects.length)];
//         if (!subject) continue;

//         // Pick random teacher (no subject-teacher mapping in your data)
//         const teacher = teachers[Math.floor(Math.random() * teachers.length)];
//         if (!teacher) continue;

//         const key = `${division}_${day}_${period}`;
//         schedule[key] = {
//           subject: subject.name || subject.subjectName || "Unnamed Subject",
//           subjectId: subject._id,
//           teacher: teacher.name || "Unnamed Teacher",
//           teacherId: teacher._id,
//           room: `R-${Math.floor(Math.random() * 10) + 1}`,
//         };
//       }
//     }
//   });

//   return schedule;
// }



//   crossover(parent1, parent2) {
//     const keys = Object.keys(parent1);
//     const crossoverPoint = Math.floor(Math.random() * keys.length);

//     const offspring = {};
//     for (let i = 0; i < keys.length; i++) {
//       const key = keys[i];
//       offspring[key] = i < crossoverPoint ? parent1[key] : parent2[key];
//     }

//     return offspring;
//   }

//  mutate(schedule, divisions, subjects, teachers, classes) {
//   const mutated = { ...schedule };
//   const keys = Object.keys(mutated);

//   for (const key of keys) {
//     if (Math.random() < this.mutationRate) {
//       const [divisionId, day, period] = key.split("_");

//       const division = divisions.find((d) => d._id?.toString() === divisionId);
//       if (!division) continue;

//       const eligibleSubjects = subjects.filter(
//         (s) => s.division?.toString() === divisionId
//       );
//       if (eligibleSubjects.length === 0) continue;

//       const subject =
//         eligibleSubjects[Math.floor(Math.random() * eligibleSubjects.length)];
//       if (!subject) continue;

//       const teacher = teachers.find((t) =>
//         t.subjects?.some(
//           (subjId) =>
//             subjId?.toString && subject._id?.toString &&
//             subjId.toString() === subject._id.toString()
//         )
//       );
//       if (!teacher) continue;

//       mutated[key] = {
//         subject: subject.name || subject.subjectName || "Unnamed Subject",
//         subjectId: subject._id,
//         teacher: teacher.name || "Unnamed Teacher",
//         teacherId: teacher._id,
//         room: `R-${Math.floor(Math.random() * 10) + 1}`,
//       };
//     }
//   }

//   return mutated;
// }


//   selectElite(population, fitnessScores, count) {
//     const scored = population.map((individual, idx) => ({
//       schedule: individual,
//       fitness: fitnessScores[idx],
//     }));

//     scored.sort((a, b) => b.fitness - a.fitness);
//     return scored.slice(0, count).map((entry) => entry.schedule);
//   }

//   selectParent(population, fitnessScores) {
//     const totalFitness = fitnessScores.reduce((a, b) => a + b, 0);
//     const rand = Math.random() * totalFitness;
//     let sum = 0;

//     for (let i = 0; i < population.length; i++) {
//       sum += fitnessScores[i];
//       if (sum >= rand) return population[i];
//     }

//     return population[population.length - 1];
//   }

//   fitness(schedule) {
//     let score = 0;
//     const teacherSlots = {};
//     const roomSlots = {};

//     for (const key in schedule) {
//       const entry = schedule[key];
//       const timeSlot = key.split("_").slice(1).join("_");

//       const teacherKey = `${entry.teacherId}_${timeSlot}`;
//       const roomKey = `${entry.room}_${timeSlot}`;

//       if (!teacherSlots[teacherKey]) {
//         teacherSlots[teacherKey] = true;
//         score += 1;
//       }

//       if (!roomSlots[roomKey]) {
//         roomSlots[roomKey] = true;
//         score += 1;
//       }
//     }

//     return score;
//   }
// }
