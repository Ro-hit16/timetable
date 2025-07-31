// // models/Student.js
// import mongoose from 'mongoose';

// const studentSchema = new mongoose.Schema({
//   stu_id: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   eid: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   mob: {
//     type: String,
//     required: true
//   },
//   address: {
//     type: String,
//     required: true
//   },
//   department_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course',
//     required: true
//   },
//   sem_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Semester',
//     required: true
//   },
//   dob: {
//     type: Date,
//     required: true
//   },
//   pic: {
//     type: String
//   },
//   gender: {
//     type: String,
//     enum: ['Male', 'Female', 'Other']
//   },
//   status: {
//     type: String,
//     default: 'Active'
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('Student', studentSchema);

// import mongoose from 'mongoose';

// const studentSchema = new mongoose.Schema({
//   stu_id: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   eid: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   mob: {
//     type: String,
//     required: true
//   },
//   address: {
//     type: String,
//     required: true
//   },
//   department_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course',
//     required: true
//   },
//   sem_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Semester',
//     required: true
//   },
//   dob: {
//     type: Date,
//     required: true
//   },
//   pic: {
//     type: String
//   },
//   gender: {
//     type: String,
//     enum: ['Male', 'Female', 'Other']
//   },
//   status: {
//     type: String,
//     default: 'Active'
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('Student', studentSchema);


import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  stu_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  eid: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  sem_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  pic: {
    type: String,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    lowercase: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    lowercase: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for department (for consistency with frontend)
studentSchema.virtual('department', {
  ref: 'Department',
  localField: 'department_id',
  foreignField: '_id',
  justOne: true
});

// Virtual for semester (for consistency with frontend)
studentSchema.virtual('semester', {
  ref: 'Semester',
  localField: 'sem_id',
  foreignField: '_id',
  justOne: true
});

// Virtual for email (mapping eid to email for frontend consistency)
studentSchema.virtual('email').get(function() {
  return this.eid;
});

// Index for better performance
studentSchema.index({ name: 1 });
studentSchema.index({ eid: 1 });
studentSchema.index({ mobile: 1 });
studentSchema.index({ department_id: 1 });
studentSchema.index({ sem_id: 1 });
studentSchema.index({ status: 1 });

export default mongoose.model('Student', studentSchema);