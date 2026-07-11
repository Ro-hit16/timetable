// backend/modules/institution/model/gaProfile.model.js
//
// GAProfile stores ONLY Genetic Algorithm tuning values (population size,
// generations, rates, and penalty overrides). It has no knowledge of days,
// periods, or subject types — those live in InstitutionConfig. This keeps
// GA-tuning concerns fully separate from scheduling-rule concerns, so the
// two can evolve (and later be split into separate services) independently.
//
// `departmentId: null` represents the institution-wide default GA profile.
// A department may have its own override by setting `departmentId`.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const gaProfileSchema = new Schema(
  {
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

    // All nullable: null means "let timetableGenerator.js apply its own
    // existing default/clamp for this parameter" (see gaAdapter.service.js).
    // No new GA parameter is introduced here — these mirror the constructor
    // options timetableGenerator.js's GeneticAlgorithm class already accepts.
    populationSize: { type: Number, min: 1, default: null },
    maxGenerations: { type: Number, min: 1, default: null },
    mutationRate: { type: Number, min: 0, max: 1, default: null },
    crossoverRate: { type: Number, min: 0, max: 1, default: null },
    elitismRate: { type: Number, min: 0, max: 1, default: null },

    // Sparse override map for individual penalty/reward constants
    // (e.g. { "TEACHER_CLASH": -20000 }). Only keys present here are
    // ever touched; every other penalty keeps timetableGenerator.js's
    // own built-in value. Stored as Mixed rather than a fixed set of
    // named fields so this module never has to hardcode (and therefore
    // never has to stay in sync with) the GA's internal penalty key list.
    penaltyOverrides: {
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

// One GA profile per (departmentId, academicYear) scope.
gaProfileSchema.index({ departmentId: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('GAProfile', gaProfileSchema);