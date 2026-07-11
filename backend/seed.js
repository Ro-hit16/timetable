import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/department.model.js';
import Teacher from './models/teacher.model.js';
import Subject from './models/subject.model.js';
import Class from './models/class.model.js';
import GeneticAlgorithm from './utils/timetableGenerator.js';

dotenv.config({ path: process.cwd().endsWith('backend') ? '.env' : 'backend/.env' });

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully. Cleaning existing collections...');

    await Department.deleteMany({});
    await Teacher.deleteMany({});
    await Subject.deleteMany({});
    await Class.deleteMany({});

    console.log('Inserting Department...');
    const dept = await Department.create({
      departmentName: 'Computer Engineering',
      departmentCode: 'CO',
      description: 'Department of Computer Engineering',
      establishedYear: 2010
    });

    console.log('Inserting Teachers...');
    // Generate 10 teachers mapped to semester 3 with high workload limits for scheduling flexibility
    const teachers = await Teacher.create([
      { name: 'Dr. Alice', email: 'alice@co.edu', department: dept._id, semester: 3, maxWeeklyWorkload: 24, maxDailyWorkload: 6, unavailableSlots: [] },
      { name: 'Prof. Bob', email: 'bob@co.edu', department: dept._id, semester: 3, maxWeeklyWorkload: 24, maxDailyWorkload: 6, unavailableSlots: [] },
      { name: 'Ms. Carol', email: 'carol@co.edu', department: dept._id, semester: 3, maxWeeklyWorkload: 24, maxDailyWorkload: 6, unavailableSlots: [] },
      { name: 'Dr. Dave', email: 'dave@co.edu', department: dept._id, semester: 3, maxWeeklyWorkload: 24, maxDailyWorkload: 6, unavailableSlots: [] },
      { name: 'Prof. Eva', email: 'eva@co.edu', department: dept._id, semester: 3, maxWeeklyWorkload: 24, maxDailyWorkload: 6, unavailableSlots: [] },
      { name: 'Mr. Frank', email: 'frank@co.edu', department: dept._id, semester: 3, maxWeeklyWorkload: 24, maxDailyWorkload: 6, unavailableSlots: [] },
      { name: 'Dr. Grace', email: 'grace@co.edu', department: dept._id, semester: 3, maxWeeklyWorkload: 24, maxDailyWorkload: 6, unavailableSlots: [] },
      { name: 'Prof. Harry', email: 'harry@co.edu', department: dept._id, semester: 3, maxWeeklyWorkload: 24, maxDailyWorkload: 6, unavailableSlots: [] },
      { name: 'Ms. Irene', email: 'irene@co.edu', department: dept._id, semester: 3, maxWeeklyWorkload: 24, maxDailyWorkload: 6, unavailableSlots: [] },
      { name: 'Mr. Jack', email: 'jack@co.edu', department: dept._id, semester: 3, maxWeeklyWorkload: 24, maxDailyWorkload: 6, unavailableSlots: [] }
    ]);

    console.log('Inserting Subjects...');
    // Generate 10 subjects (8 theory/tutorial, 2 practical labs) mapped to sem_id "3"
    const subjects = await Subject.create([
      { subjectName: 'Data Structures', subject_code: 'CO301', sem_id: '3', department_id: dept._id, teacher_id: teachers[0]._id, lecturePerWeek: '3', type: 'theory', credits: '3' },
      { subjectName: 'Discrete Mathematics', subject_code: 'CO302', sem_id: '3', department_id: dept._id, teacher_id: teachers[1]._id, lecturePerWeek: '3', type: 'theory', credits: '3' },
      { subjectName: 'Digital Electronics', subject_code: 'CO303', sem_id: '3', department_id: dept._id, teacher_id: teachers[2]._id, lecturePerWeek: '3', type: 'theory', credits: '3' },
      { subjectName: 'Computer Organization', subject_code: 'CO304', sem_id: '3', department_id: dept._id, teacher_id: teachers[3]._id, lecturePerWeek: '3', type: 'theory', credits: '3' },
      { subjectName: 'OOP Java', subject_code: 'CO305', sem_id: '3', department_id: dept._id, teacher_id: teachers[4]._id, lecturePerWeek: '3', type: 'theory', credits: '3' },
      { subjectName: 'Data Structures Tutorial', subject_code: 'CO301T', sem_id: '3', department_id: dept._id, teacher_id: teachers[5]._id, lecturePerWeek: '1', type: 'tutorial', credits: '1' },
      { subjectName: 'Digital Electronics Tutorial', subject_code: 'CO303T', sem_id: '3', department_id: dept._id, teacher_id: teachers[6]._id, lecturePerWeek: '1', type: 'tutorial', credits: '1' },
      { subjectName: 'OOP Java Tutorial', subject_code: 'CO305T', sem_id: '3', department_id: dept._id, teacher_id: teachers[7]._id, lecturePerWeek: '1', type: 'tutorial', credits: '1' },
      { subjectName: 'Data Structures Lab', subject_code: 'CO301L', sem_id: '3', department_id: dept._id, teacher_id: teachers[8]._id, lecturePerWeek: '2', type: 'practical', credits: '1' },
      { subjectName: 'OOP Java Lab', subject_code: 'CO305L', sem_id: '3', department_id: dept._id, teacher_id: teachers[9]._id, lecturePerWeek: '2', type: 'practical', credits: '1' }
    ]);

    console.log('Inserting Classrooms & Labs...');
    // Create 6 classrooms and 2 labs
    const classrooms = await Class.create([
      { className: 'Room 101', classNumber: 'R101', department_id: dept._id, semester: '3', capacity: 60 },
      { className: 'Room 102', classNumber: 'R102', department_id: dept._id, semester: '3', capacity: 60 },
      { className: 'Room 103', classNumber: 'R103', department_id: dept._id, semester: '3', capacity: 60 },
      { className: 'Room 104', classNumber: 'R104', department_id: dept._id, semester: '3', capacity: 60 },
      { className: 'Room 105', classNumber: 'R105', department_id: dept._id, semester: '3', capacity: 60 },
      { className: 'Room 106', classNumber: 'R106', department_id: dept._id, semester: '3', capacity: 60 },
      { className: 'Computer Lab 1', classNumber: 'CLAB1', department_id: dept._id, semester: '3', capacity: 30 },
      { className: 'Computer Lab 2', classNumber: 'CLAB2', department_id: dept._id, semester: '3', capacity: 30 }
    ]);

    console.log('----------------------------------------------------');
    console.log('Verification Checks:');
    console.log(`- Department seeded: ${dept.departmentName}`);
    console.log(`- Teachers seeded: ${teachers.length} (Expected: 10)`);
    console.log(`- Subjects seeded: ${subjects.length} (Expected: 10)`);
    console.log(`- Rooms seeded: ${classrooms.filter(c => !c.classNumber.includes('LAB')).length} Classrooms, ${classrooms.filter(c => c.classNumber.includes('LAB')).length} Labs`);

    // Verify workload mapping and teacher assignment
    let allSubjectsHaveTeachers = true;
    for (const sub of subjects) {
      if (!sub.teacher_id) allSubjectsHaveTeachers = false;
    }
    console.log(`- Every subject has a valid teacher assigned: ${allSubjectsHaveTeachers}`);

    // Timetable Feasibility Validation via Genetic Algorithm instance dry-run
    console.log('Running Genetic Algorithm Feasibility Dry Run...');
    const divisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
    const ga = new GeneticAlgorithm({
      populationSize: 150,
      maxGenerations: 800,
      mutationRate: 0.15,
      crossoverRate: 0.8,
      elitismRate: 0.1,
      departmentId: dept._id,
      semester: '3',
      academicYear: '2026-2027',
      divisions
    });

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

    const result = await ga.generateSchedule({
      divisions,
      subjects: transformedSubjects,
      teachers,
      classes: classrooms
    });

    console.log(`- GA Generation completed successfully!`);
    console.log(`- Dry run metadata:`, JSON.stringify(result.metadata, null, 2));

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();

