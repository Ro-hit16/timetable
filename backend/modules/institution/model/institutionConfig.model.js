// backend/modules/institution/model/institutionConfig.model.js
//
// InstitutionConfig holds every institution-wide, non-teacher-specific,
// non-department-specific scheduling default in ONE document per
// (departmentId, academicYear) scope, per the architecture instructions.
//
// `departmentId: null` represents the institution-wide default document
// (applies to every department that has no department-specific override).
// A department MAY have its own InstitutionConfig document by setting
// `departmentId` to that department's ObjectId; the resolver decides
// precedence (see institutionConfigResolver.service.js).
//
// This model is intentionally self-contained: everything listed under
// "InstitutionConfig" in the architecture (working days, time slots,
// breaks, slot preferences, default theory/lab/tutorial rules, default
// teacher limits, default classroom rules, and placeholder exam/leave
// rules) lives inside this one schema — no sibling collections were
// created for any of these sub-sections.

import mongoose from 'mongoose';
import { buildTimeSlotsFromConfig, validateTimingConfig } from '../utils/timeSlotBuilder.js';

const { Schema } = mongoose;

// A single period/time-slot row (e.g. "Period 1", 09:00-10:00)
const timeSlotSchema = new Schema(
  {
    index: { type: Number, required: true, min: 0 },
    label: { type: String, trim: true, default: '' },
    startTime: { type: String, trim: true, default: null }, // "HH:mm"
    endTime: { type: String, trim: true, default: null },   // "HH:mm"
  },
  { _id: false }
);

// A single break row (e.g. lunch, short break). Breaks are modeled
// separately from `timeSlots` so a break is never mistaken for a
// schedulable period.
const breakSlotSchema = new Schema(
  {
    label: { type: String, trim: true, default: 'Break' },
    afterPeriodIndex: { type: Number, required: true, min: 0 }, // break occurs after this period index
    startTime: { type: String, trim: true, default: null },
    endTime: { type: String, trim: true, default: null },
    durationMinutes: { type: Number, min: 0, default: null },
  },
  { _id: false }
);

// General, cross-subject-type slot preferences (ordering/priority only —
// NOT the per-type rules, which live in defaultTheoryRules / defaultLabRules
// / defaultTutorialRules below).
const slotPreferencesSchema = new Schema(
  {
    prioritizeLabsFirst: { type: Boolean, default: true },
    prioritizeTutorialsLast: { type: Boolean, default: true },
    allowSplitAcrossBreak: { type: Boolean, default: false },
  },
  { _id: false }
);

const defaultTheoryRulesSchema = new Schema(
  {
    preferredPeriodIndices: { type: [Number], default: [] }, // e.g. [0,1,2,3]
    maxOccurrencesPerDay: { type: Number, min: 0, default: 1 },
    defaultLecturesPerWeek: { type: Number, min: 0, default: 3 },
    // "Default Theory Duration" — how many consecutive periods a single
    // theory session occupies (almost always 1, but kept configurable so
    // an institution running double-period lectures doesn't need a
    // schema change).
    sessionDurationPeriods: { type: Number, min: 1, default: 1 },
  },
  { _id: false }
);

const defaultLabRulesSchema = new Schema(
  {
    preferredStartPeriodIndices: { type: [Number], default: [] }, // e.g. [0,2,4]
    consecutiveBlockSize: { type: Number, min: 1, default: 2 },
    maxOccurrencesPerDay: { type: Number, min: 0, default: 1 },
    defaultSessionsPerWeek: { type: Number, min: 0, default: 2 },
  },
  { _id: false }
);

const defaultTutorialRulesSchema = new Schema(
  {
    preferredPeriodIndices: { type: [Number], default: [] }, // e.g. [4,5]
    maxOccurrencesPerDay: { type: Number, min: 0, default: 1 },
    defaultLecturesPerWeek: { type: Number, min: 0, default: 1 },
  },
  { _id: false }
);

const defaultTeacherLimitsSchema = new Schema(
  {
    maxLecturesPerDay: { type: Number, min: 0, default: null },
    maxLecturesPerWeek: { type: Number, min: 0, default: null },
    minGapBetweenLectures: { type: Number, min: 0, default: null }, // in periods
  },
  { _id: false }
);

const defaultClassroomRulesSchema = new Schema(
  {
    capacityBufferPercent: { type: Number, min: 0, max: 100, default: 0 },
    allowRoomSharingAcrossDivisions: { type: Boolean, default: false },
  },
  { _id: false }
);

const institutionConfigSchema = new Schema(
  {
    // Scope: null departmentId = institution-wide default document.
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },

    institutionName: {
      type: String,
      trim: true,
      default: '',
    },

    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'workingDays must contain at least one day',
      },
    },

    // ── Simple, admin-facing timing fields ──────────────────────────────
    // These are the source of truth for timetable timings. `timeSlots`
    // and `breaks` below are derived from them automatically (see the
    // pre-validate hook) so every existing consumer that already reads
    // `timeSlots` / `breaks` keeps working without changes.
    periodsPerDay: {
      type: Number,
      min: 1,
      default: 6,
    },
    periodStartTime: {
      type: String, // "HH:mm"
      trim: true,
      default: '09:00',
    },
    periodEndTime: {
      type: String, // "HH:mm"
      trim: true,
      default: '16:00',
    },
    periodDurationMinutes: {
      type: Number,
      min: 1,
      default: 60,
    },
    breakDurationMinutes: {
      type: Number,
      min: 0,
      default: 0,
    },
    lunchBreakStart: {
      type: String, // "HH:mm"
      trim: true,
      default: null,
    },
    lunchBreakEnd: {
      type: String, // "HH:mm"
      trim: true,
      default: null,
    },

    // Derived/cached from the simple fields above via the pre-validate
    // hook below. Kept as real schema fields (not virtuals) so existing
    // reads/queries against `timeSlots` / `breaks` are unaffected.
    timeSlots: {
      type: [timeSlotSchema],
      default: [],
    },

    breaks: {
      type: [breakSlotSchema],
      default: [],
    },

    slotPreferences: {
      type: slotPreferencesSchema,
      default: () => ({}),
    },

    defaultTheoryRules: {
      type: defaultTheoryRulesSchema,
      default: () => ({}),
    },

    defaultLabRules: {
      type: defaultLabRulesSchema,
      default: () => ({}),
    },

    defaultTutorialRules: {
      type: defaultTutorialRulesSchema,
      default: () => ({}),
    },

    defaultTeacherLimits: {
      type: defaultTeacherLimitsSchema,
      default: () => ({}),
    },

    defaultClassroomRules: {
      type: defaultClassroomRulesSchema,
      default: () => ({}),
    },

    // Placeholder only, per architecture instructions — no validation or
    // business logic is attached to these yet. Free-form so a future Exam
    // module / Leave module can populate them without a schema migration.
    defaultExamRules: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },
    defaultLeaveRules: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Exactly one active document per (departmentId, academicYear) scope.
institutionConfigSchema.index(
  { departmentId: 1, academicYear: 1 },
  { unique: true }
);

// Regenerate `timeSlots` / `breaks` from the simple timing fields on
// every save, and reject structurally inconsistent timings (overlaps,
// invalid ranges, lunch outside working hours, non-positive durations)
// before they ever reach the database. This is a safety net: the Joi
// validator in institutionConfig.validator.js already rejects bad input
// at the HTTP boundary, but any other write path (seed scripts, direct
// service calls) goes through this hook too.
institutionConfigSchema.pre('validate', function preValidateTimeSlots(next) {
  const errors = validateTimingConfig({
    periodsPerDay: this.periodsPerDay,
    periodStartTime: this.periodStartTime,
    periodEndTime: this.periodEndTime,
    periodDurationMinutes: this.periodDurationMinutes,
    breakDurationMinutes: this.breakDurationMinutes,
    lunchBreakStart: this.lunchBreakStart,
    lunchBreakEnd: this.lunchBreakEnd,
  });

  if (errors.length) {
    return next(new Error(`Invalid timetable timing configuration: ${errors.join('; ')}`));
  }

  const { timeSlots, breaks } = buildTimeSlotsFromConfig({
    periodsPerDay: this.periodsPerDay,
    periodStartTime: this.periodStartTime,
    periodDurationMinutes: this.periodDurationMinutes,
    breakDurationMinutes: this.breakDurationMinutes || 0,
    lunchBreakStart: this.lunchBreakStart,
    lunchBreakEnd: this.lunchBreakEnd,
  });

  this.timeSlots = timeSlots;
  this.breaks = breaks;

  next();
});

export default mongoose.model('InstitutionConfig', institutionConfigSchema);