// backend/modules/examination/model/exam.model.js
//
// Exam holds the top-level definition of an examination event (its name,
// scope, and type). Individual scheduled papers live in ExamTimetable,
// each referencing back to one Exam via examId — the same one-to-many
// relationship Timetable/divisions already uses elsewhere in this
// project, just split into two collections here because an Exam's
// metadata (name/type/status) and its many scheduled papers change at
// very different rates.

import mongoose from 'mongoose';
const { Schema } = mongoose;

const examSchema = new Schema(
  {
    examName: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      trim: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    examType: {
      type: String,
      required: [true, 'Exam type is required'],
      enum: ['Mid Semester', 'End Semester', 'Practical', 'Viva', 'Internal'],
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'draft',
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

examSchema.index({ departmentId: 1, academicYear: 1, semester: 1, examType: 1 });

export default mongoose.model('Exam', examSchema);