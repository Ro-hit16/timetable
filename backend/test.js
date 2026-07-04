/**
 * test.js  --  Verification script for the Timetable Generator
 *
 * Run: node backend/test.js
 */

import GeneticAlgorithm from './utils/timetableGenerator.js';

const GREEN  = (s) => `\x1b[32m${s}\x1b[0m`;
const RED    = (s) => `\x1b[31m${s}\x1b[0m`;
const YELLOW = (s) => `\x1b[33m${s}\x1b[0m`;
const BOLD   = (s) => `\x1b[1m${s}\x1b[0m`;

let passed = 0, failed = 0;

function assert(condition, label) {
  if (condition) { console.log(`  ${GREEN("OK")} ${label}`); passed++; }
  else           { console.log(`  ${RED("FAIL")} ${label}`); failed++; }
}

// ── Mock data ──────────────────────────────────────────────────────────────
const TEACHERS = [
  { _id: 'T1', name: 'Dr. Alice',   maxWeeklyWorkload: 10, maxDailyWorkload: 3,
    unavailableSlots: [{ day: 'Monday', period: 1 }, { day: 'Friday', period: 6 }] },
  { _id: 'T2', name: 'Prof. Bob',   maxWeeklyWorkload: 12, maxDailyWorkload: 4,
    unavailableSlots: [] },
  { _id: 'T3', name: 'Ms. Carol',   maxWeeklyWorkload: 18, maxDailyWorkload: 4,
    unavailableSlots: [{ day: 'Wednesday', period: 3 }] }
];

const SUBJECTS = [
  { _id: 'S1', name: 'Mathematics',      type: 'theory',    lecturePerWeek: 3, teacher_id: 'T1' },
  { _id: 'S2', name: 'Physics',          type: 'theory',    lecturePerWeek: 3, teacher_id: 'T2' },
  { _id: 'S3', name: 'Chemistry Lab',    type: 'practical', lecturePerWeek: 2, teacher_id: 'T3' },
  { _id: 'S4', name: 'Computer Science', type: 'theory',    lecturePerWeek: 3, teacher_id: 'T2' },
  { _id: 'S5', name: 'English',          type: 'tutorial',  lecturePerWeek: 2, teacher_id: 'T1' }
];

const CLASSES = [
  { _id: 'R1', classNumber: 'Room-101', capacity: 60 },
  { _id: 'R2', classNumber: 'Room-102', capacity: 55 },
  { _id: 'R3', classNumber: 'Lab-A',    capacity: 40 },
  { _id: 'R4', classNumber: 'Lab-B',    capacity: 40 }
];

const DIVISIONS = ['A', 'B'];

const config = {
  departmentId: 'DEPT1', semester: '3', academicYear: '2025-26',
  divisions: DIVISIONS, populationSize: 80, maxGenerations: 400,
  mutationRate: 0.18, crossoverRate: 0.85, elitismRate: 0.10
};

function buildSubjectTeacherMap(subjects, teachers) {
  const tMap = new Map(teachers.map(t => [String(t._id), t]));
  const map  = new Map();
  for (const sub of subjects) {
    const tId = String(sub.teacher_id?._id || sub.teacher_id);
    if (tMap.has(tId)) map.set(String(sub._id), tMap.get(tId));
  }
  return map;
}

async function runTests() {
  console.log(BOLD('\n===================================================='));
  console.log(BOLD('  Timetable Generator - Verification Test Suite'));
  console.log(BOLD('====================================================\n'));

  const ga  = new GeneticAlgorithm(config);
  const stm = buildSubjectTeacherMap(SUBJECTS, TEACHERS);

  console.log(YELLOW('Running GA (this may take 10-30s)...'));
  const t0 = Date.now();
  const schedule = ga.run(DIVISIONS, SUBJECTS, TEACHERS, CLASSES, stm);
  console.log(GREEN(`GA done in ${((Date.now()-t0)/1000).toFixed(2)}s\n`));

  // Test 1: Teacher clashes
  console.log(BOLD('Test 1: Teacher Clashes (hard constraint)'));
  const tSlots = new Map(); let tClashes = 0;
  for (const div of DIVISIONS) for (const day of ga.days) {
    (schedule[div]?.[day] || []).forEach((slot,i) => {
      if (!slot?.teacher?._id) return;
      const key = `${slot.teacher._id}_${day}_${i}`;
      if (tSlots.has(key)) { tClashes++; console.log(`    CLASH: ${slot.teacher.name} ${day} P${i+1} (${tSlots.get(key)} & ${div})`); }
      else tSlots.set(key, div);
    });
  }
  assert(tClashes === 0, `Zero teacher clashes (found ${tClashes})`);

  // Test 2: Room clashes
  console.log(BOLD('\nTest 2: Room Clashes (hard constraint)'));
  const rSlots = new Map(); let rClashes = 0;
  for (const div of DIVISIONS) for (const day of ga.days) {
    (schedule[div]?.[day] || []).forEach((slot,i) => {
      if (!slot?.classroom?._id) return;
      const key = `${slot.classroom._id}_${day}_${i}`;
      if (rSlots.has(key)) { rClashes++; console.log(`    CLASH: ${slot.classroom.room_number} ${day} P${i+1}`); }
      else rSlots.set(key, div);
    });
  }
  assert(rClashes === 0, `Zero room clashes (found ${rClashes})`);

  // Test 3: Teacher unavailability
  console.log(BOLD('\nTest 3: Teacher Unavailability'));
  const tMap = new Map(TEACHERS.map(t => [String(t._id), t]));
  let unavailViolations = 0;
  for (const div of DIVISIONS) for (const day of ga.days) {
    (schedule[div]?.[day] || []).forEach((slot,i) => {
      if (!slot?.teacher?._id) return;
      const t = tMap.get(String(slot.teacher._id));
      if (t?.unavailableSlots?.some(us => us.day === day && us.period === (i+1))) {
        unavailViolations++;
        console.log(`    VIOLATION: ${t.name} scheduled ${day} P${i+1} (unavailable) in div ${div}`);
      }
    });
  }
  assert(unavailViolations === 0, `Zero unavailability violations (found ${unavailViolations})`);

  // Test 4: Weekly workload
  console.log(BOLD('\nTest 4: Teacher Weekly Workload'));
  const wCount = new Map();
  for (const div of DIVISIONS) for (const day of ga.days) {
    (schedule[div]?.[day] || []).forEach(slot => {
      if (!slot?.teacher?._id) return;
      const id = String(slot.teacher._id);
      wCount.set(id, (wCount.get(id) || 0) + 1);
    });
  }
  let overloads = 0;
  for (const t of TEACHERS) {
    const assigned = wCount.get(String(t._id)) || 0;
    if (assigned > t.maxWeeklyWorkload) { overloads++; console.log(`    OVERLOAD: ${t.name} ${assigned}/${t.maxWeeklyWorkload}`); }
    else console.log(`    OK: ${t.name} ${assigned}/${t.maxWeeklyWorkload} periods`);
  }
  assert(overloads === 0, `Zero weekly overload violations (found ${overloads})`);

  // Test 5: Lab consecutive pairs
  console.log(BOLD('\nTest 5: Lab Consecutive Pairs'));
  let labErrors = 0;
  for (const div of DIVISIONS) for (const day of ga.days) {
    const slots = schedule[div]?.[day] || [];
    slots.forEach((slot, i) => {
      if (!slot?.subject) return;
      const type = slot.subject.type;
      if ((type === 'practical' || type === 'lab') && (i === 0 || i === 2 || i === 4)) {
        const next = slots[i+1];
        if (!next || String(next.subject?._id) !== String(slot.subject._id)) {
          labErrors++;
          console.log(`    LAB ERROR: ${slot.subject.subjectName} not consecutive ${day} P${i+1} div ${div}`);
        }
      }
    });
  }
  assert(labErrors === 0, `All lab sessions consecutive (errors: ${labErrors})`);

  // Test 6: Quality metrics
  console.log(BOLD('\nTest 6: Quality Metrics'));
  const m = ga.computeQualityMetrics(schedule, SUBJECTS, TEACHERS, CLASSES);
  console.log(`    Teacher util:   ${m.teacherUtilization.used}/${m.teacherUtilization.total} (${m.teacherUtilization.percentage}%)`);
  console.log(`    Classroom util: ${m.classroomUtilization.used}/${m.classroomUtilization.total} (${m.classroomUtilization.percentage}%)`);
  console.log(`    Lab util:       ${m.labUtilization.correct}/${m.labUtilization.total} correct (${m.labUtilization.percentage}%)`);
  console.log(`    Slot util:      ${m.slotUtilization.filled}/${m.slotUtilization.total} (${m.slotUtilization.percentage}%)`);
  console.log(`    Hard clashes:   ${m.hardClashes}`);
  console.log(`    Quality score:  ${m.qualityScore}/100`);
  assert(m.hardClashes === 0, `Quality metrics reports 0 hard clashes`);
  assert(m.qualityScore >= 0 && m.qualityScore <= 100, `Quality score in range 0-100 (got ${m.qualityScore})`);

  // Test 7: Structure integrity
  console.log(BOLD('\nTest 7: Schedule Structure Integrity'));
  let structErr = 0;
  for (const div of DIVISIONS) {
    if (!schedule[div]) { structErr++; continue; }
    for (const day of ga.days) {
      if (!Array.isArray(schedule[div][day]) || schedule[div][day].length !== 6) structErr++;
    }
  }
  assert(structErr === 0, `All ${DIVISIONS.length} divs x 5 days x 6 periods intact (errors: ${structErr})`);

  // Summary
  console.log(BOLD('\n===================================================='));
  const total = passed + failed;
  if (failed === 0) console.log(GREEN(BOLD(`  ALL ${total} TESTS PASSED`)));
  else              console.log(RED(BOLD(`  ${failed}/${total} TESTS FAILED`)));
  console.log(BOLD('====================================================\n'));
  process.exit(failed === 0 ? 0 : 1);
}

runTests().catch(err => {
  console.error(RED(`\nFATAL: ${err.message}`));
  console.error(err.stack);
  process.exit(1);
});
