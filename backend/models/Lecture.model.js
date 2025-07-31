import mongoose from "mongoose";
const lectureSchema = new mongoose.Schema({
  day: String,
  period: Number,
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  classroom: String,
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }
}, { timestamps: true });

export default mongoose.model('Lecture', lectureSchema);
