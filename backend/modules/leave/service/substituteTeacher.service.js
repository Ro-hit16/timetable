// backend/modules/leave/service/substituteTeacher.service.js
//
// Suggests substitute teachers for a faculty member's leave. Read-only —
// never writes to Teacher, Subject, or Timetable, and never calls
// timetableGenerator.js. Scoring is a simple weighted heuristic meant as
// a Part 1 foundation.
//
// NOTE: as of this task, backend/models/teacher.model.js has only a
// single `department` field. An earlier task's chat output proposed
// `departments[]`/`sharedDepartments[]` array fields, but that proposal
// was never actually merged into this repository (verified directly).
// This engine is written defensively: `teacher.department` is the
// authoritative same-department check today, and `teacher.departments`/
// `teacher.sharedDepartments` are additionally checked via optional
// chaining so this file automatically benefits the moment a future
// migration adds them — with no code change required here.

import teacherModel from '../../../models/teacher.model.js';
import subjectModel from '../../../models/subject.model.js';
import Timetable from '../../../models/timetable.model.js';

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WORKING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Every distinct working weekday a [startDate, endDate] range touches.
export const weekdaysInRange = (startDate, endDate) => {
  const days = new Set();
  const cursor = new Date(startDate);
  const end = new Date(endDate);
  while (cursor <= end) {
    const name = WEEKDAY_NAMES[cursor.getDay()];
    if (WORKING_DAYS.includes(name)) days.add(name);
    cursor.setDate(cursor.getDate() + 1);
  }
  return Array.from(days);
};

const isSameOrSharedDepartment = (candidate, originalDepartmentId) => {
  const originalId = String(originalDepartmentId);
  if (String(candidate.department) === originalId) return true;
  if (Array.isArray(candidate.departments) && candidate.departments.some((d) => String(d) === originalId)) {
    return true;
  }
  if (
    Array.isArray(candidate.sharedDepartments) &&
    candidate.sharedDepartments.some((d) => String(d) === originalId)
  ) {
    return true;
  }
  return false;
};

// Suggests substitutes for one specific (subject, day, period) slot that
// needs coverage. Fetches published timetables once and reuses that data
// for both workload counting and availability checking.
export const suggestSubstitutesForSlot = async ({ originalTeacherId, subjectId, day, period }) => {
  const [originalTeacher, subject, publishedTimetables] = await Promise.all([
    teacherModel.findById(originalTeacherId).lean(),
    subjectId ? subjectModel.findById(subjectId).lean() : null,
    Timetable.find({ status: 'published' }).lean(),
  ]);

  if (!originalTeacher) return [];

  const workloadByTeacher = new Map();
  const busyTeacherIdsAtSlot = new Set();

  for (const timetable of publishedTimetables) {
    for (const division of timetable.divisions || []) {
      for (const slotDay of Object.keys(division.schedule || {})) {
        for (const slot of division.schedule[slotDay] || []) {
          const slotTeacherId = slot?.teacher?._id ? String(slot.teacher._id) : null;
          if (!slotTeacherId) continue;
          workloadByTeacher.set(slotTeacherId, (workloadByTeacher.get(slotTeacherId) || 0) + 1);
          if (slotDay === day && slot.period === period) {
            busyTeacherIdsAtSlot.add(slotTeacherId);
          }
        }
      }
    }
  }

  const candidatePool = await teacherModel.find({ _id: { $ne: originalTeacherId } }).lean();
  const sameOrSharedDeptCandidates = candidatePool.filter((c) =>
    isSameOrSharedDepartment(c, originalTeacher.department)
  );

  // Prefer teachers already assigned to the same subject name in the same
  // department, as a proxy for subject-matter fit (Teacher has no
  // "subjects I can teach" list of its own).
  const subjectTeacherIds = subject
    ? new Set(
        (
          await subjectModel
            .find({ subjectName: subject.subjectName, department_id: subject.department_id })
            .select('teacher_id')
            .lean()
        ).map((s) => String(s.teacher_id))
      )
    : new Set();

  const scored = [];
  for (const candidate of sameOrSharedDeptCandidates) {
    const candidateId = String(candidate._id);
    if (busyTeacherIdsAtSlot.has(candidateId)) continue; // not available at this slot

    const workload = workloadByTeacher.get(candidateId) || 0;
    const sameSubject = subjectTeacherIds.has(candidateId);
    const sameDepartment = String(candidate.department) === String(originalTeacher.department);

    let score = 0;
    if (sameSubject) score += 50;
    score += sameDepartment ? 30 : 15; // same-department beats shared-department-only
    score -= Math.min(workload, 30); // lighter current workload scores higher

    scored.push({
      teacherId: candidateId,
      name: candidate.name,
      sameSubject,
      sameDepartment,
      currentWeeklyWorkload: workload,
      score,
    });
  }

  return scored.sort((a, b) => b.score - a.score);
};

// Higher-level helper: expands a leave date range into weekdays and
// batches slot-level suggestions. The caller supplies the actual
// (subject, period) slots per weekday — this function does not look
// those up itself, since which slots are "affected" is a
// reschedule-service concern (see reschedule.service.js).
export const suggestSubstitutesForLeave = async ({ originalTeacherId, startDate, endDate, slotsByDay = {} }) => {
  const days = weekdaysInRange(startDate, endDate);
  const suggestions = {};

  for (const day of days) {
    const slots = slotsByDay[day] || [];
    suggestions[day] = [];
    for (const slot of slots) {
      const candidates = await suggestSubstitutesForSlot({
        originalTeacherId,
        subjectId: slot.subjectId,
        day,
        period: slot.period,
      });
      suggestions[day].push({ period: slot.period, subjectId: slot.subjectId, candidates });
    }
  }

  return suggestions;
};

export default { weekdaysInRange, suggestSubstitutesForSlot, suggestSubstitutesForLeave };