import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    trim: true
  },
  classNumber: {
    type: String,
    required: true,
    trim: true
  },
   department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  // ── College-wide Resource Scheduling (Part 1) ──────────────────────────
  // department_id remains the room's home department, unchanged.
  isShared: {
    type: Boolean,
    default: false
  },
  sharedDepartments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }],
  isLab: {
    type: Boolean,
    default: false
  },
  semester: { type: String, required: true },
  capacity: { type: Number, default: 60 }
}, {
  timestamps: true
});

export default mongoose.model('Class', classSchema);
