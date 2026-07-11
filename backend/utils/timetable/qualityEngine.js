/**
 * Quality Metrics Evaluation Engine
 */
export function computeQualityMetrics(schedule, subjects, teachers, classes, days) {
  const teacherIds       = new Set(teachers.map(t => String(t._id)));
  const classroomIds     = new Set(classes.map(c => String(c._id)));
  const usedTeachers     = new Set();
  const usedRooms        = new Set();
  let totalSlots         = 0;
  let filledSlots        = 0;
  let labPairsCorrect    = 0;
  let labPairsTotal      = 0;
  let hardClashes        = 0;
  const teacherSlotCheck = new Map();
  const roomSlotCheck    = new Map();

  // Phase 2 metrics
  let subjectConsecDayViolations = 0;
  let teacherIdleGaps            = 0;
  let teacherConsecRuns          = 0; 
  const divFills                 = [];
  const subjectDayMapM           = {};  
  const teacherDaySlotsM         = {};  

  for (const division in schedule) {
    subjectDayMapM[division] = {};
    let divFill = 0;

    for (let di = 0; di < days.length; di++) {
      const day     = days[di];
      const daySlots = schedule[division][day] || [];
      totalSlots  += daySlots.length;
      const dayFill = daySlots.filter(s => s !== null).length;
      filledSlots += dayFill;
      divFill     += dayFill;

      for (let i = 0; i < daySlots.length; i++) {
        const slot = daySlots[i];
        if (!slot) continue;

        if (slot.teacher?._id) {
          usedTeachers.add(String(slot.teacher._id));
          const tk = `${slot.teacher._id}_${day}_${i}`;
          if (teacherSlotCheck.has(tk)) hardClashes++;
          else teacherSlotCheck.set(tk, true);
          
          const tId = String(slot.teacher._id);
          if (!teacherDaySlotsM[tId])      teacherDaySlotsM[tId]      = {};
          if (!teacherDaySlotsM[tId][day]) teacherDaySlotsM[tId][day] = [];
          teacherDaySlotsM[tId][day].push(i);
        }
        if (slot.classroom?._id) {
          usedRooms.add(String(slot.classroom._id));
          const rk = `${slot.classroom._id}_${day}_${i}`;
          if (roomSlotCheck.has(rk)) hardClashes++;
          else roomSlotCheck.set(rk, true);
        }

        if (slot.subject?._id) {
          const sId = String(slot.subject._id);
          if (!subjectDayMapM[division][sId]) subjectDayMapM[division][sId] = new Set();
          subjectDayMapM[division][sId].add(di);
        }

        const type = slot.subject?.type;
        if ((type === 'practical' || type === 'lab') && (i === 0 || i === 2 || i === 4)) {
          labPairsTotal++;
          const next = daySlots[i + 1];
          if (next &&
              String(next.subject?._id)  === String(slot.subject._id) &&
              String(next.teacher?._id)  === String(slot.teacher?._id)) {
            labPairsCorrect++;
          }
        }
      }
    }
    divFills.push(divFill);

    for (const sId of Object.keys(subjectDayMapM[division])) {
      const dayIndices = [...subjectDayMapM[division][sId]].sort((a, b) => a - b);
      for (let k = 0; k < dayIndices.length - 1; k++) {
        if (dayIndices[k + 1] - dayIndices[k] === 1) subjectConsecDayViolations++;
      }
    }
  }

  for (const tId of Object.keys(teacherDaySlotsM)) {
    for (const day of days) {
      const periods = (teacherDaySlotsM[tId]?.[day] || []).sort((a, b) => a - b);
      if (periods.length < 2) continue;
      for (let k = 0; k < periods.length - 1; k++) {
        if (periods[k + 1] - periods[k] > 1) teacherIdleGaps++;
      }
      let run = 1;
      for (let k = 1; k < periods.length; k++) {
        if (periods[k] - periods[k - 1] === 1) {
          run++;
          if (run === 3) teacherConsecRuns++;
        } else {
          run = 1;
        }
      }
    }
  }

  const avgFill      = divFills.length ? divFills.reduce((a, b) => a + b, 0) / divFills.length : 0;
  const fillVariance = divFills.length ? divFills.reduce((s, f) => s + Math.pow(f - avgFill, 2), 0) / divFills.length : 0;
  const divFairnessScore = Math.max(0, 100 - Math.round(Math.sqrt(fillVariance) * 10));

  const teacherUtil      = teacherIds.size   > 0 ? Math.round((usedTeachers.size / teacherIds.size)   * 100) : 0;
  const classroomUtil    = classroomIds.size > 0 ? Math.round((usedRooms.size   / classroomIds.size)   * 100) : 0;
  const labUtil          = labPairsTotal     > 0 ? Math.round((labPairsCorrect   / labPairsTotal)       * 100) : 100;
  const slotUtil         = totalSlots        > 0 ? Math.round((filledSlots       / totalSlots)           * 100) : 0;
  const subjectSpread    = Math.max(0, 100 - subjectConsecDayViolations * 10);
  const teacherCompact   = Math.max(0, 100 - teacherIdleGaps * 8 - teacherConsecRuns * 5);

  const qualityScore = Math.min(100, Math.round(
    (teacherUtil     * 0.20) +
    (classroomUtil   * 0.15) +
    (labUtil         * 0.20) +
    (slotUtil        * 0.15) +
    (subjectSpread   * 0.15) +
    (teacherCompact  * 0.10) +
    (divFairnessScore * 0.05) +
    (hardClashes === 0 ? 10 : 0)
  ));

  return {
    teacherUtilization:   { used: usedTeachers.size,  total: teacherIds.size,   percentage: teacherUtil },
    classroomUtilization: { used: usedRooms.size,     total: classroomIds.size, percentage: classroomUtil },
    labUtilization:       { correct: labPairsCorrect, total: labPairsTotal,     percentage: labUtil },
    slotUtilization:      { filled: filledSlots,      total: totalSlots,        percentage: slotUtil },
    hardClashes,
    subjectSpread:        { violations: subjectConsecDayViolations, score: subjectSpread },
    teacherCompactness:   { idleGaps: teacherIdleGaps, consecRuns: teacherConsecRuns, score: teacherCompact },
    divisionFairness:     { fillVariance: Math.round(fillVariance * 10) / 10, score: divFairnessScore },
    qualityScore
  };
}
