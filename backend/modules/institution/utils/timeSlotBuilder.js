// backend/modules/institution/utils/timeSlotBuilder.js
//
// Pure, framework-free helpers that turn the simple, admin-facing timing
// fields on InstitutionConfig (periodStartTime, periodEndTime,
// periodDurationMinutes, breakDurationMinutes, lunchBreakStart,
// lunchBreakEnd, periodsPerDay) into the richer `timeSlots` / `breaks`
// arrays that already existed on the schema. Also exposes a validator
// used by both the Mongoose model (pre-save safety net) and the Joi
// request validator (fast, descriptive 400s).
//
// Kept dependency-free (no mongoose, no express) so it can be unit
// tested and reused anywhere.

const HHMM_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const isValidHHMM = (value) => typeof value === 'string' && HHMM_PATTERN.test(value);

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const toHHMM = (totalMinutes) => {
  const mins = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * Validates the "simple" timing fields for internal consistency:
 *  - valid HH:mm time ranges (start < end)
 *  - positive durations
 *  - lunch break falling inside the working (period) window
 *  - the generated periods actually fit before periodEndTime (i.e. no
 *    overlap and no overflow past the institution's declared end time)
 *
 * Returns an array of human-readable error strings (empty = valid).
 */
export const validateTimingConfig = ({
  periodsPerDay,
  periodStartTime,
  periodEndTime,
  periodDurationMinutes,
  breakDurationMinutes,
  lunchBreakStart,
  lunchBreakEnd,
} = {}) => {
  const errors = [];

  if (!Number.isInteger(periodsPerDay) || periodsPerDay <= 0) {
    errors.push('Number of periods must be a positive integer');
  }
  if (!Number.isFinite(periodDurationMinutes) || periodDurationMinutes <= 0) {
    errors.push('Period duration must be a positive number of minutes');
  }
  if (breakDurationMinutes != null && (!Number.isFinite(breakDurationMinutes) || breakDurationMinutes < 0)) {
    errors.push('Break duration must be zero or a positive number of minutes');
  }
  if (!isValidHHMM(periodStartTime)) {
    errors.push('Period start time must be a valid HH:mm time');
  }
  if (!isValidHHMM(periodEndTime)) {
    errors.push('Period end time must be a valid HH:mm time');
  }

  const hasLunch = lunchBreakStart != null && lunchBreakStart !== '' && lunchBreakEnd != null && lunchBreakEnd !== '';
  if (hasLunch) {
    if (!isValidHHMM(lunchBreakStart)) errors.push('Lunch break start must be a valid HH:mm time');
    if (!isValidHHMM(lunchBreakEnd)) errors.push('Lunch break end must be a valid HH:mm time');
  }

  // Stop early if the basic shapes are broken — the checks below assume
  // valid HH:mm strings and positive numbers.
  if (errors.length) return errors;

  const startMin = toMinutes(periodStartTime);
  const endMin = toMinutes(periodEndTime);

  if (startMin >= endMin) {
    errors.push('Period start time must be before period end time');
    return errors;
  }

  if (hasLunch) {
    const lunchStartMin = toMinutes(lunchBreakStart);
    const lunchEndMin = toMinutes(lunchBreakEnd);
    if (lunchStartMin >= lunchEndMin) {
      errors.push('Lunch break start must be before lunch break end');
    } else if (lunchStartMin < startMin || lunchEndMin > endMin) {
      errors.push('Lunch break must fall within the period start/end window');
    }
  }

  // Simulate laying out periods (+ optional inter-period break, + lunch)
  // and confirm the last period does not run past periodEndTime. This is
  // what guarantees "no overlapping periods" — periods are placed
  // strictly sequentially, so overlap is structurally impossible; the
  // only failure mode is overflowing the declared end time.
  if (Number.isInteger(periodsPerDay) && periodsPerDay > 0 && errors.length === 0) {
    const { timeSlots } = buildTimeSlotsFromConfig({
      periodsPerDay,
      periodStartTime,
      periodDurationMinutes,
      breakDurationMinutes: breakDurationMinutes || 0,
      lunchBreakStart: hasLunch ? lunchBreakStart : null,
      lunchBreakEnd: hasLunch ? lunchBreakEnd : null,
    });
    const lastSlot = timeSlots[timeSlots.length - 1];
    if (lastSlot && toMinutes(lastSlot.endTime) > endMin) {
      errors.push(
        `Configured periods (${periodsPerDay} × ${periodDurationMinutes}min, plus breaks) do not fit between ${periodStartTime} and ${periodEndTime}`
      );
    }
  }

  return errors;
};

/**
 * Builds `timeSlots` (one row per period) and `breaks` (currently just
 * the lunch break, if configured) from the simple timing fields.
 *
 * `breakDurationMinutes` is treated as passing time inserted after every
 * period (except immediately before/after lunch, which uses the explicit
 * lunch window instead).
 */
export const buildTimeSlotsFromConfig = ({
  periodsPerDay,
  periodStartTime,
  periodDurationMinutes,
  breakDurationMinutes = 0,
  lunchBreakStart = null,
  lunchBreakEnd = null,
}) => {
  const timeSlots = [];
  const breaks = [];

  let cursor = toMinutes(periodStartTime);
  const lunchStartMin = lunchBreakStart ? toMinutes(lunchBreakStart) : null;
  const lunchEndMin = lunchBreakEnd ? toMinutes(lunchBreakEnd) : null;
  let lunchInserted = false;

  for (let i = 0; i < periodsPerDay; i++) {
    if (lunchStartMin != null && lunchEndMin != null && !lunchInserted && cursor >= lunchStartMin) {
      breaks.push({
        label: 'Lunch Break',
        afterPeriodIndex: Math.max(0, i - 1),
        startTime: toHHMM(lunchStartMin),
        endTime: toHHMM(lunchEndMin),
        durationMinutes: lunchEndMin - lunchStartMin,
      });
      cursor = lunchEndMin;
      lunchInserted = true;
    }

    const start = cursor;
    const end = cursor + periodDurationMinutes;

    timeSlots.push({
      index: i,
      label: `Period ${i + 1}`,
      startTime: toHHMM(start),
      endTime: toHHMM(end),
    });

    cursor = end + (breakDurationMinutes || 0);
  }

  return { timeSlots, breaks };
};

export default { isValidHHMM, toMinutes, toHHMM, validateTimingConfig, buildTimeSlotsFromConfig };
