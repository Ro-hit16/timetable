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
   
  semester: { type: String, required: true },
  capacity: { type: Number, default: 60 }
}, {
  timestamps: true
});

export default mongoose.model('Class', classSchema);
