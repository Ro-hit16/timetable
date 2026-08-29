// backend/modules/institution/model/departmentPreference.model.js
//
// DepartmentPreference stores department-specific scheduling preferences
// that layer on top of InstitutionConfig. Absence of a document for a
// given department means "use institution defaults only" — backward
// compatible with today's behavior where no such preferences exist.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const slotRefSchema = new Schema(
  {
    day: { type: String, required: true, trim: true },
    periodIndex: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const divisionStrengthSchema = new Schema(
  {
    division: { type: String, required: true, trim: true },
    studentCount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const departmentPreferenceSchema = new Schema(
  {
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'departmentId is required'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },

    preferredClassrooms: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
      default: [],
    },

    blackoutSlots: {
      type: [slotRefSchema],
      default: [],
    },

    divisionStrength: {
      type: [divisionStrengthSchema],
      default: [],
    },

    // Free-form bag for any additional department-specific scheduling
    // preference that doesn't yet warrant its own typed field. Kept
    // deliberately loose so departments can express ad-hoc preferences
    // without a schema migration; the resolver only reads well-known keys
    // from here today and ignores anything else.
    schedulingPreferences: {
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

// One preference document per department per academic year.
departmentPreferenceSchema.index(
  { departmentId: 1, academicYear: 1 },
  { unique: true }
);

export default mongoose.model(
  'DepartmentPreference',
  departmentPreferenceSchema
);