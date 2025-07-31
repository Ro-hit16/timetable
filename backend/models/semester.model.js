// import mongoose from 'mongoose';

// const semesterSchema = new mongoose.Schema({
//   semesterName: {
//     type: String,
//     required: [true, 'Semester name is required'],
//     trim: true,
//     maxlength: [50, 'Semester name cannot exceed 50 characters']
//   },
//   course_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course',
//     required: [true, 'Course ID is required']
//   },
//   departmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: [true, 'Department is required']
//   },
//   semesterNumber: {
//     type: Number,
//     required: [true, 'Semester number is required'],
//     min: [1, 'Semester number must be at least 1'],
//     max: [8, 'Semester number cannot exceed 8']
//   },
//   duration: {
//     type: Number,
//     default: 6, // months
//     min: [1, 'Duration must be at least 1 month'],
//     max: [12, 'Duration cannot exceed 12 months']
//   },
//   startDate: {
//     type: Date
//   },
//   endDate: {
//     type: Date
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   description: {
//     type: String,
//     maxlength: [500, 'Description cannot exceed 500 characters']
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Compound index for unique semester per department
// semesterSchema.index({ semesterName: 1, departmentId: 1 }, { unique: true });
// semesterSchema.index({ semesterNumber: 1, departmentId: 1 }, { unique: true });

// // Virtual populate for department
// semesterSchema.virtual('department', {
//   ref: 'Department',
//   localField: 'departmentId',
//   foreignField: '_id',
//   justOne: true
// });

// // Virtual populate for subjects
// semesterSchema.virtual('subjects', {
//   ref: 'Subject',
//   localField: '_id',
//   foreignField: 'semesterId'
// });

// // Virtual populate for students
// semesterSchema.virtual('students', {
//   ref: 'Student',
//   localField: '_id',
//   foreignField: 'semesterId'
// });

// // Pre-save middleware
// semesterSchema.pre('save', function(next) {
//   if (this.isModified('semesterName')) {
//     this.semesterName = this.semesterName.trim();
//   }
  
//   // Validate end date is after start date
//   if (this.startDate && this.endDate && this.endDate <= this.startDate) {
//     next(new Error('End date must be after start date'));
//   }
  
//   next();
// });

// // Static methods
// semesterSchema.statics.findByDepartment = function(departmentId) {
//   return this.find({ departmentId, isActive: true })
//     .populate('department', 'departmentName')
//     .sort({ semesterNumber: 1 });
// };

// semesterSchema.statics.findActiveSemesters = function() {
//   return this.find({ isActive: true })
//     .populate('department', 'departmentName')
//     .sort({ departmentId: 1, semesterNumber: 1 });
// };

// // Instance methods
// semesterSchema.methods.getSubjectCount = async function() {
//   const Subject = mongoose.model('Subject');
//   return await Subject.countDocuments({ semesterId: this._id, isActive: true });
// };

// semesterSchema.methods.getStudentCount = async function() {
//   const Student = mongoose.model('Student');
//   return await Student.countDocuments({ semesterId: this._id, isActive: true });
// };

// const Semester = mongoose.model('Semester', semesterSchema);

// export default Semester;

import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
  semesterName: {
    type: String,
    required: [true, 'Semester name is required'],
    trim: true,
    maxlength: [50, 'Semester name cannot exceed 50 characters']
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false // Changed to optional
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  semesterNumber: {
    type: Number,
    required: [true, 'Semester number is required'],
    min: [1, 'Semester number must be at least 1'],
    max: [8, 'Semester number cannot exceed 8']
  },
  duration: {
    type: Number,
    default: 6, // months
    min: [1, 'Duration must be at least 1 month'],
    max: [12, 'Duration cannot exceed 12 months']
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique semester per department
semesterSchema.index({ semesterName: 1, departmentId: 1 }, { unique: true });
semesterSchema.index({ semesterNumber: 1, departmentId: 1 }, { unique: true });

// Virtual populate for department
semesterSchema.virtual('department', {
  ref: 'Department',
  localField: 'departmentId',
  foreignField: '_id',
  justOne: true
});

// Virtual populate for subjects
semesterSchema.virtual('subjects', {
  ref: 'Subject',
  localField: '_id',
  foreignField: 'semesterId'
});

// Virtual populate for students
semesterSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'semesterId'
});

// Pre-save middleware
semesterSchema.pre('save', function(next) {
  if (this.isModified('semesterName')) {
    this.semesterName = this.semesterName.trim();
  }

  // Validate end date is after start date
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }

  next();
});

// Static methods
semesterSchema.statics.findByDepartment = function(departmentId) {
  return this.find({ departmentId, isActive: true })
    .populate('department', 'departmentName')
    .sort({ semesterNumber: 1 });
};

semesterSchema.statics.findActiveSemesters = function() {
  return this.find({ isActive: true })
    .populate('department', 'departmentName')
    .sort({ departmentId: 1, semesterNumber: 1 });
};

// Instance methods
semesterSchema.methods.getSubjectCount = async function() {
  const Subject = mongoose.model('Subject');
  return await Subject.countDocuments({ semesterId: this._id, isActive: true });
};

semesterSchema.methods.getStudentCount = async function() {
  const Student = mongoose.model('Student');
  return await Student.countDocuments({ semesterId: this._id, isActive: true });
};

const Semester = mongoose.model('Semester', semesterSchema);

export default Semester;
