/**
 * Fitness Calculation Module
 */
import { GA_CONFIG } from './config.js';
import { getLecturePerWeek, getTeacherWorkload } from './utils.js';

export function calculateFitness(schedule, subjects, teachers, classes, days, penalties = GA_CONFIG.penalties) {
  if (!schedule) return -Infinity;

  let score = 0;
  const globalTeacherSlots = new Map();
  const globalRoomSlots    = new Map();
  const teacherObjMap   = new Map(teachers.map(t => [String(t._id), t]));
  const classroomObjMap = new Map(classes.map(c => [String(c._id), c]));
  const workload = getTeacherWorkload(schedule, days);
  const divisionSubjectCounts = {};

  const subjectDayMap    = {};  
  const roomSubjectMap   = {};  
  const teacherDaySlots  = {};  
  const divisionFill     = {};  

  for (const division in schedule) {
    for (let di = 0; di < days.length; di++) {
      const day     = days[di];
      const daySlots = schedule[division][day] || [];
      daySlots.forEach((slot, pi) => {
        if (!slot?.teacher?._id) return;
        const tId = String(slot.teacher._id);
        if (!teacherDaySlots[tId])       teacherDaySlots[tId]       = {};
        if (!teacherDaySlots[tId][day])  teacherDaySlots[tId][day]  = [];
        teacherDaySlots[tId][day].push(pi);
      });
    }
  }

  for (const division in schedule) {
    divisionSubjectCounts[division] = new Map();
    subjectDayMap[division]         = {};
    roomSubjectMap[division]        = {};
    divisionFill[division]          = 0;

    for (let di = 0; di < days.length; di++) {
      const day     = days[di];
      const daySlots = schedule[division][day] || [];
      const subjectDayCount = new Map();  
      let gapOpen = false;

      for (let i = 0; i < daySlots.length; i++) {
        const slot = daySlots[i];

        if (!slot) {
          const hasAfter = daySlots.slice(i + 1).some(s => s !== null);
          if (gapOpen && hasAfter) score += penalties.UNWANTED_FREE;
          continue;
        }

        gapOpen = true;
        score += penalties.FILLED_SLOT;
        divisionFill[division]++;

        const subjectId   = slot.subject?._id;
        const subjectType = slot.subject?.type;
        const teacherId   = slot.teacher?._id;
        const roomId      = slot.classroom?._id;
        const sIdStr      = subjectId ? String(subjectId) : null;

        if (sIdStr) {
          subjectDayCount.set(sIdStr, (subjectDayCount.get(sIdStr) || 0) + 1);
          divisionSubjectCounts[division].set(sIdStr, (divisionSubjectCounts[division].get(sIdStr) || 0) + 1);

          if (subjectDayCount.get(sIdStr) > 2) score += penalties.SUBJECT_OVERLOAD;

          if (!subjectDayMap[division][sIdStr]) subjectDayMap[division][sIdStr] = new Set();
          subjectDayMap[division][sIdStr].add(di);

          if (roomId) {
            if (!roomSubjectMap[division][sIdStr]) roomSubjectMap[division][sIdStr] = new Map();
            const rStr = String(roomId);
            roomSubjectMap[division][sIdStr].set(rStr, (roomSubjectMap[division][sIdStr].get(rStr) || 0) + 1);
          }
        }

        if (teacherId) {
          const teacherKey = `${teacherId}_${day}_${i}`;
          if (globalTeacherSlots.has(teacherKey)) {
            score += penalties.TEACHER_CLASH;
          } else {
            globalTeacherSlots.set(teacherKey, { division, day, period: i });
          }

          const tObj = teacherObjMap.get(String(teacherId));
          if (tObj?.unavailableSlots?.length) {
            const unavail = tObj.unavailableSlots.some(
              us => us.day === day && us.period === (i + 1)
            );
            if (unavail) score += penalties.UNAVAILABLE_SLOT;
          }

          score += penalties.TEACHER_UTILISATION_REWARD;
        }

        if (roomId) {
          const roomKey = `${roomId}_${day}_${i}`;
          if (globalRoomSlots.has(roomKey)) {
            score += penalties.ROOM_CLASH;
          } else {
            globalRoomSlots.set(roomKey, { division, day, period: i });
            score += penalties.ROOM_UTILISATION_REWARD;
          }

          const roomObj  = classroomObjMap.get(String(roomId));
          const capacity = roomObj?.capacity || 60;
          if (capacity < 50) score += penalties.CAPACITY_CLASH;
        }

        if (subjectType === 'practical' || subjectType === 'lab') {
          const isValidStart = (i === 0 || i === 2 || i === 4);
          if (!isValidStart) score += penalties.LAB_WRONG_SLOT;

          const nextSlot = daySlots[i + 1];
          const isConsecutive = nextSlot &&
            String(nextSlot.subject?._id) === String(subjectId) &&
            String(nextSlot.teacher?._id) === String(teacherId);

          if (!isConsecutive) score += penalties.LAB_NOT_CONSECUTIVE;
          else                score += penalties.LAB_PAIR_REWARD;

          if (i === 0)      score += penalties.PREFERRED_SLOT * 3;
          else if (i === 2) score += penalties.PREFERRED_SLOT * 2;
          else if (i === 4) score += penalties.PREFERRED_SLOT;
        }

        if (subjectType === 'theory'   && i >= 1 && i <= 4) score += penalties.PREFERRED_SLOT;
        if (subjectType === 'tutorial' && i >= 4)           score += penalties.PREFERRED_SLOT * 3;
      }

      const filledCount = daySlots.filter(s => s !== null).length;
      if (filledCount >= 5) score += penalties.BALANCED_DISTRIBUTION;

      const uniqueSubjectsToday = new Set(
        daySlots.filter(s => s?.subject?._id).map(s => String(s.subject._id))
      ).size;
      if (uniqueSubjectsToday >= 4) score += penalties.VARIETY_BONUS;
    }

    for (const subject of subjects) {
      const sId       = String(subject._id);
      const target    = getLecturePerWeek(subject);
      const scheduled = divisionSubjectCounts[division].get(sId) || 0;
      if (scheduled !== target) {
        score += Math.abs(scheduled - target) * penalties.WORKLOAD_DEVIATION;
      } else {
        score += penalties.WORKLOAD_MATCH_BONUS;
      }
    }

    for (const subject of subjects) {
      const sId  = String(subject._id);
      const daysList = subjectDayMap[division][sId];
      if (!daysList || daysList.size < 2) continue;

      const sortedDays = [...daysList].sort((a, b) => a - b);
      let hasConsecDay    = false;
      let isWellSpread    = true;
      for (let k = 0; k < sortedDays.length - 1; k++) {
        if (sortedDays[k + 1] - sortedDays[k] === 1) {
          hasConsecDay = true;
          isWellSpread = false;
          score += penalties.SUBJECT_CONSEC_DAY;
        }
      }
      if (isWellSpread) score += penalties.SUBJECT_SPREAD_BONUS;
    }

    for (const sId of Object.keys(roomSubjectMap[division] || {})) {
      const roomCounts = roomSubjectMap[division][sId];
      if (!roomCounts || roomCounts.size === 0) continue;
      const total = [...roomCounts.values()].reduce((a, b) => a + b, 0);
      const maxUse = Math.max(...roomCounts.values());
      const consistencyRatio = maxUse / total;
      if (consistencyRatio >= 0.8) {
        score += penalties.ROOM_CONSISTENT_BONUS;
      } else if (consistencyRatio < 0.5) {
        score += penalties.ROOM_INCONSISTENCY * (total - maxUse);
      }
    }
  }

  for (const teacherId of Object.keys(teacherDaySlots)) {
    const teacher   = teacherObjMap.get(teacherId);
    const maxWeekly = teacher?.maxWeeklyWorkload || 18;
    const maxDaily  = teacher?.maxDailyWorkload  || 4;

    for (const day of days) {
      const periods = (teacherDaySlots[teacherId]?.[day] || []).sort((a, b) => a - b);
      if (periods.length === 0) continue;

      for (let k = 0; k < periods.length - 1; k++) {
        const gap = periods[k + 1] - periods[k];
        if (gap > 1) {
          score += (gap - 1) * penalties.TEACHER_IDLE_GAP;
        }
      }

      let runLength = 1;
      for (let k = 1; k < periods.length; k++) {
        if (periods[k] - periods[k - 1] === 1) {
          runLength++;
          if (runLength > 2) {
            score += penalties.TEACHER_CONSEC_LECTURE;
          }
        } else {
          runLength = 1;
        }
      }

      if (periods.length > 1) {
        const span = periods[periods.length - 1] - periods[0] + 1;
        if (span === periods.length) {
          score += penalties.TEACHER_COMPACT_BONUS;
        }
      }
    }

    const tIdStr         = String(teacherId);
    const weeklyAssigned = workload.weekly.get(tIdStr) || 0;
    if (weeklyAssigned > maxWeekly) {
      score += (weeklyAssigned - maxWeekly) * penalties.TEACHER_OVERLOAD;
    } else if (weeklyAssigned > 0) {
      const utilRatio = weeklyAssigned / maxWeekly;
      if (utilRatio >= 0.6 && utilRatio <= 1.0) score += penalties.TEACHER_LOAD_BALANCE_BONUS;
    }

    for (const day of days) {
      const dailyAssigned = workload.daily.get(`${tIdStr}_${day}`) || 0;
      if (dailyAssigned > maxDaily) {
        score += (dailyAssigned - maxDaily) * penalties.TEACHER_OVERLOAD;
      }
    }
  }

  for (const division in schedule) {
    for (const subject of subjects) {
      if (subject.type !== 'practical' && subject.type !== 'lab') continue;
      const sId  = String(subject._id);
      const daysList = subjectDayMap[division]?.[sId];
      if (!daysList || daysList.size < 2) continue;
      const sortedDays = [...daysList].sort((a, b) => a - b);
      let labClustered = false;
      for (let k = 0; k < sortedDays.length - 1; k++) {
        if (sortedDays[k + 1] - sortedDays[k] === 1) {
          labClustered = true;
          score += penalties.LAB_SAME_WEEK_CLUSTER;
        }
      }
      if (!labClustered) score += penalties.LAB_SPREAD_BONUS;
    }
  }

  const divKeys   = Object.keys(divisionFill);
  if (divKeys.length > 1) {
    const fills    = divKeys.map(d => divisionFill[d]);
    const avg      = fills.reduce((a, b) => a + b, 0) / fills.length;
    const variance = fills.reduce((s, f) => s + Math.pow(f - avg, 2), 0) / fills.length;
    if (variance <= 4) {
      score += penalties.DIVISION_FAIRNESS_BONUS * divKeys.length;
    } else {
      score -= Math.sqrt(variance) * 10;
    }
  }

  return score;
}
