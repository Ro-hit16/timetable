// backend/modules/examination/model/examTimetable.model.js
//
// ExamTimetable holds one scheduled paper: date/time/duration/subject,
// which rooms it uses (with sharing/capacity metadata), how students are
// seated (PRN-range based, since no Student collection exists in this
// project yet), and who invigilates. Validation of clashes/overflow lives
// in examValidation.service.js, not here — this file is data shape only.

import mongoose from 'mongoose';
const { Schema } = mongoose;

const roomAllocationSchema = new Schema(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    capacity: { type: Number, required: true, min: 1 },
    // Filled in by auto seat allocation; may be pre-set for a manual override.
    allocatedSeats: { type: Number, min: 0, default: 0 },
    isShared: { type: Boolean, default: false },
    isLab: { type: Boolean, default: false },
  },
  { _id: false }
);

const studentAllocationSchema = new Schema(
  {
    division: { type: String, required: true, trim: true },
    prnStart: { type: String, required: true, trim: true },
    prnEnd: { type: String, required: true, trim: true },
    numberOfStudents: { type: Number, required: true, min: 1 },
    // roomId/seatStart/seatEnd are populated by auto seat allocation.
    roomId: { type: Schema.Types.ObjectId, ref: 'Class', default: null },
    seatStart: { type: Number, default: null },
    seatEnd: { type: Number, default: null },
  },
  { _id: false }
);

const invigilatorSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    isSharedTeacher: { type: Boolean, default: false },
  },
  { _id: false }
);

const examTimetableSchema = new Schema(
  {
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: [true, 'Exam is required'] },
    date: { type: Date, required: [true, 'Exam date is required'] },
    timeSlot: {
      startTime: { type: String, required: [true, 'Start time is required'], trim: true }, // "HH:mm"
      endTime: { type: String, required: [true, 'End time is required'], trim: true },
    },
    durationMinutes: { type: Number, required: [true, 'Duration is required'], min: 1 },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: [true, 'Subject is required'] },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: [true, 'Department is required'] },
    semester: { type: String, required: [true, 'Semester is required'], trim: true },
    divisions: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one division is required',
      },
    },
    roomAllocations: { type: [roomAllocationSchema], default: [] },
    studentAllocations: { type: [studentAllocationSchema], default: [] },
    invigilators: { type: [invigilatorSchema], default: [] },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled'],
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

examTimetableSchema.index({ examId: 1, date: 1 });
examTimetableSchema.index({ departmentId: 1, semester: 1, date: 1 });

export default mongoose.model('ExamTimetable', examTimetableSchema);