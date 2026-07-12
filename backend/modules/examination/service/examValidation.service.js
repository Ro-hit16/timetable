// backend/modules/examination/service/examValidation.service.js
//
// Standalone conflict-detection for exam scheduling: room clash, teacher
// clash, student overlap, and capacity overflow, plus invigilator
// workload. Entirely separate from timetableGenerator.js's fitness/
// clash logic — this only ever queries the ExamTimetable collection.

import ApiError from '../../../utils/ApiError.js';
import examTimetableRepository from '../repository/examTimetable.repository.js';

const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

const timeSlotsOverlap = (slotA, slotB) => {
  const aStart = toMinutes(slotA.startTime);
  const aEnd = toMinutes(slotA.endTime);
  const bStart = toMinutes(slotB.startTime);
  const bEnd = toMinutes(slotB.endTime);
  return aStart < bEnd && bStart < aEnd;
};

const loadSameDayEntries = ({ date, excludeId }) =>
  examTimetableRepository.findByDate(date, excludeId);

export const checkRoomClash = async ({ date, timeSlot, roomAllocations = [], excludeId = null }) => {
  const roomIds = roomAllocations.map((r) => String(r.roomId));
  if (!roomIds.length) return [];

  const sameDayEntries = await loadSameDayEntries({ date, excludeId });
  const conflicts = [];

  for (const entry of sameDayEntries) {
    if (!timeSlotsOverlap(entry.timeSlot, timeSlot)) continue;
    for (const existingRoom of entry.roomAllocations || []) {
      if (roomIds.includes(String(existingRoom.roomId))) {
        conflicts.push({
          type: 'ROOM_CLASH',
          roomId: String(existingRoom.roomId),
          conflictingExamTimetableId: String(entry._id),
        });
      }
    }
  }
  return conflicts;
};

export const checkTeacherClash = async ({ date, timeSlot, invigilators = [], excludeId = null }) => {
  const teacherIds = invigilators.map((i) => String(i.teacherId));
  if (!teacherIds.length) return [];

  const sameDayEntries = await loadSameDayEntries({ date, excludeId });
  const conflicts = [];

  for (const entry of sameDayEntries) {
    if (!timeSlotsOverlap(entry.timeSlot, timeSlot)) continue;
    for (const existingInvigilator of entry.invigilators || []) {
      if (teacherIds.includes(String(existingInvigilator.teacherId))) {
        conflicts.push({
          type: 'TEACHER_CLASH',
          teacherId: String(existingInvigilator.teacherId),
          conflictingExamTimetableId: String(entry._id),
        });
      }
    }
  }
  return conflicts;
};

export const checkStudentOverlap = async ({ date, timeSlot, divisions = [], excludeId = null }) => {
  if (!divisions.length) return [];

  const sameDayEntries = await loadSameDayEntries({ date, excludeId });
  const conflicts = [];

  for (const entry of sameDayEntries) {
    if (!timeSlotsOverlap(entry.timeSlot, timeSlot)) continue;
    const overlappingDivisions = (entry.divisions || []).filter((d) => divisions.includes(d));
    if (overlappingDivisions.length) {
      conflicts.push({
        type: 'STUDENT_OVERLAP',
        divisions: overlappingDivisions,
        conflictingExamTimetableId: String(entry._id),
      });
    }
  }
  return conflicts;
};

export const checkCapacityOverflow = ({ roomAllocations = [], studentAllocations = [] }) => {
  const conflicts = [];

  for (const room of roomAllocations) {
    const seatsInRoom = studentAllocations
      .filter((s) => String(s.roomId) === String(room.roomId))
      .reduce((sum, s) => sum + (s.numberOfStudents || 0), 0);

    const allocated = room.allocatedSeats || seatsInRoom;
    if (allocated > room.capacity) {
      conflicts.push({
        type: 'CAPACITY_OVERFLOW',
        roomId: String(room.roomId),
        capacity: room.capacity,
        allocated,
      });
    }
  }
  return conflicts;
};

export const checkInvigilatorWorkload = async ({
  date,
  invigilators = [],
  maxInvigilationsPerDay = 2,
  excludeId = null,
}) => {
  const sameDayEntries = await loadSameDayEntries({ date, excludeId });
  const countByTeacher = new Map();

  for (const entry of sameDayEntries) {
    for (const inv of entry.invigilators || []) {
      const key = String(inv.teacherId);
      countByTeacher.set(key, (countByTeacher.get(key) || 0) + 1);
    }
  }

  const conflicts = [];
  for (const inv of invigilators) {
    const key = String(inv.teacherId);
    const existingCount = countByTeacher.get(key) || 0;
    if (existingCount + 1 > maxInvigilationsPerDay) {
      conflicts.push({
        type: 'INVIGILATOR_OVERLOAD',
        teacherId: key,
        existingCount,
        maxInvigilationsPerDay,
      });
    }
  }
  return conflicts;
};

// Runs every check and throws one ApiError(409, ...) listing all conflicts
// if any check fails. Called once from examTimetable.service.js before
// create/update.
export const validateExamTimetable = async ({
  date,
  timeSlot,
  divisions = [],
  roomAllocations = [],
  studentAllocations = [],
  invigilators = [],
  maxInvigilationsPerDay = 2,
  excludeId = null,
}) => {
  const [roomConflicts, teacherConflicts, studentConflicts] = await Promise.all([
    checkRoomClash({ date, timeSlot, roomAllocations, excludeId }),
    checkTeacherClash({ date, timeSlot, invigilators, excludeId }),
    checkStudentOverlap({ date, timeSlot, divisions, excludeId }),
  ]);

  const capacityConflicts = checkCapacityOverflow({ roomAllocations, studentAllocations });
  const workloadConflicts = await checkInvigilatorWorkload({
    date,
    invigilators,
    maxInvigilationsPerDay,
    excludeId,
  });

  const allConflicts = [
    ...roomConflicts,
    ...teacherConflicts,
    ...studentConflicts,
    ...capacityConflicts,
    ...workloadConflicts,
  ];

  if (allConflicts.length) {
    throw new ApiError(409, 'Exam timetable validation failed', allConflicts);
  }
};

export default {
  checkRoomClash,
  checkTeacherClash,
  checkStudentOverlap,
  checkCapacityOverflow,
  checkInvigilatorWorkload,
  validateExamTimetable,
};