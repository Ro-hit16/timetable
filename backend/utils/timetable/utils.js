/**
 * Auxiliary Helper Functions for Timetable Generator
 */

export function getLecturePerWeek(sub) {
  const val = sub.lecturePerWeek || sub.lecturesPerWeek;
  if (!val) {
    return sub.type === 'practical' || sub.type === 'lab' ? 2 : 3;
  }
  const parsed = parseInt(val);
  return isNaN(parsed) ? (sub.type === 'practical' || sub.type === 'lab' ? 2 : 3) : parsed;
}

export function getTeacherWorkload(schedule, days) {
  const weekly = new Map();
  const daily = new Map();
  
  for (const division in schedule) {
    for (const day of days) {
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

export function isSameAsPrevious(daySchedule, p, subjectId) {
  if (p === 0) return false;
  const prevSlot = daySchedule[p - 1];
  return prevSlot && String(prevSlot.subject?._id) === String(subjectId);
}
