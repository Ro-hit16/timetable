
import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Teacher name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 8
  },
  // ── College-wide Resource Scheduling (Part 1) ──────────────────────────
  // All fields below are optional and additive. A teacher document with
  // none of these set behaves exactly as before: single department,
  // single semester, eligible for every division.
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }],
  semesters: [{
    type: Number,
    min: 1,
    max: 8
  }],
  divisions: [{
    type: String,
    trim: true
  }],
  isSharedAcrossDepartments: {
    type: Boolean,
    default: false
  },
  maxWeeklyWorkload: {
    type: Number,
    default: 18
  },
  maxDailyWorkload: {
    type: Number,
    default: 4
  },
  unavailableSlots: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    period: {
      type: Number,
      min: 1,
      max: 6
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Teacher', teacherSchema);