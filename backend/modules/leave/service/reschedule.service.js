// backend/modules/leave/service/reschedule.service.js
//
// SKELETON ONLY, per instructions — nothing here is wired into any
// controller/route, and nothing here calls timetableGenerator.js.
// identifyAffectedSlots() is the one read-only helper provided so a
// future task has a starting point for "which existing timetable slots
// does this leave affect"; it makes no decision about how those slots
// get rescheduled.

import Timetable from '../../../models/timetable.model.js';
import { weekdaysInRange } from './substituteTeacher.service.js';

// Read-only: finds every slot in every published timetable, across all
// divisions, that belongs to `teacherId` on a weekday the given leave
// date range touches. Makes no changes to any document.
export const identifyAffectedSlots = async ({ teacherId, startDate, endDate }) => {
  const days = weekdaysInRange(startDate, endDate);
  const timetables = await Timetable.find({ status: 'published' }).lean();
  const affected = [];

  for (const timetable of timetables) {
    for (const division of timetable.divisions || []) {
      for (const day of days) {
        for (const slot of division.schedule?.[day] || []) {
          if (slot?.teacher?._id && String(slot.teacher._id) === String(teacherId)) {
            affected.push({
              timetableId: String(timetable._id),
              division: division.division_name,
              day,
              period: slot.period,
              subject: slot.subject,
            });
          }
        }
      }
    }
  }

  return affected;
};

// --- Skeleton only — intentionally not implemented in Part 1 ---

// TODO (future task): decide the rescheduling strategy (e.g. assign a
// substitute per affected slot, or move the slot to another day/period)
// and persist a reschedule record. Not implemented; not called from any
// controller yet.
export const planReschedule = async (/* { leaveRequestId } */) => {
  throw new Error('planReschedule() is not implemented yet — Part 1 provides a skeleton only.');
};

// TODO (future task): apply an approved reschedule plan. Must never call
// timetableGenerator.js directly without a dedicated, reviewed
// integration task.
export const applyReschedule = async (/* { rescheduleId } */) => {
  throw new Error('applyReschedule() is not implemented yet — Part 1 provides a skeleton only.');
};

export default { identifyAffectedSlots, planReschedule, applyReschedule };