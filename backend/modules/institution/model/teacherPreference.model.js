// backend/modules/institution/model/teacherPreference.model.js
//
// TeacherPreference stores ONLY teacher-specific overrides on top of
// InstitutionConfig's defaultTeacherLimits. Absence of a document for a
// given teacher simply means "use institution defaults" — this is what
// keeps the module backward compatible with today's behavior, where no
// such preferences exist at all.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const slotRefSchema = new Schema(
  {
    day: { type: String, required: true, trim: true },
    periodIndex: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const teacherPreferenceSchema = new Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: [true, 'teacherId is required'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },

    unavailableSlots: {
      type: [slotRefSchema],
      default: [],
    },
    preferredSlots: {
      type: [slotRefSchema],
      default: [],
    },

    maxLecturesPerDay: {
      type: Number,
      min: 0,
      default: null, // null = fall back to InstitutionConfig.defaultTeacherLimits
    },
    maxLecturesPerWeek: {
      type: Number,
      min: 0,
      default: null,
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

// One preference document per teacher per academic year.
teacherPreferenceSchema.index(
  { teacherId: 1, academicYear: 1 },
  { unique: true }
);

export default mongoose.model('TeacherPreference', teacherPreferenceSchema);