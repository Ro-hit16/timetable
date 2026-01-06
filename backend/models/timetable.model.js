

import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  period: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  subject: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    type: {
      type: String,
      enum: ['theory', 'practical', 'lab', 'tutorial'],
      default: 'theory'
}},
  teacher: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String
  },
  classroom: String
});

const divisionSchema = new mongoose.Schema({
  division_name: {
    type: String,
    required: true
  },
  schedule: {
    Monday: [timeSlotSchema],
    Tuesday: [timeSlotSchema],
    Wednesday: [timeSlotSchema],
    Thursday: [timeSlotSchema],
    Friday: [timeSlotSchema]
  }
});
 
const timetableSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  divisions: [divisionSchema],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  generation_metadata: {
    fitness_score: Number,
    generation_count: Number,
    conflicts_resolved: Number,
    algorithm_version: String,
    generated_at: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Timetable', timetableSchema);