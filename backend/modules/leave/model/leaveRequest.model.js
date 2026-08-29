// backend/modules/leave/model/leaveRequest.model.js
//
// LeaveRequest holds one teacher's leave application plus its approval
// audit trail. Substitute suggestions are NOT persisted here — they are
// computed on demand by substituteTeacher.service.js so they're always
// based on current workload/availability, never stale.

import mongoose from 'mongoose';
const { Schema } = mongoose;

const approvalHistoryEntrySchema = new Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      required: true,
    },
    actedBy: { type: Schema.Types.ObjectId, ref: 'Teacher', default: null },
    remarks: { type: String, trim: true, default: '' },
    actedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const leaveRequestSchema = new Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: [true, 'Teacher is required'],
    },
    leaveType: {
      type: String,
      required: [true, 'Leave type is required'],
      enum: ['Casual', 'Sick', 'Earned', 'On Duty', 'Other'],
    },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },
    dayType: {
      type: String,
      enum: ['full_day', 'half_day'],
      default: 'full_day',
    },
    halfDaySession: {
      type: String,
      enum: ['forenoon', 'afternoon', null],
      default: null,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
    approvalHistory: { type: [approvalHistoryEntrySchema], default: [] },
    // Set by an approver after reviewing Substitute Teacher Engine
    // suggestions. Pure data field in Part 1 — nothing reads or writes
    // the timetable from this field yet.
    assignedSubstituteTeacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null,
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

leaveRequestSchema.index({ teacherId: 1, startDate: 1, endDate: 1 });

export default mongoose.model('LeaveRequest', leaveRequestSchema);
