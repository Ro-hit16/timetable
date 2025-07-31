// import mongoose from 'mongoose';

// const subjectSchema = new mongoose.Schema({
//   subjectName: {
//     type: String,
//     required: [true, 'Subject name is required'],
//     trim: true,
//     maxlength: [100, 'Subject name cannot exceed 100 characters']
//   },
  
//   credits: {
//     type: Number,
//     default: 3,
//     min: 1,
//     max: 6
//   },
//   subject_code: {
//     type: String,
//     required: [true, 'Subject code is required'],
//     trim: true,
//     uppercase: true
//   },

//   semesterId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Semester',
//     required: [true, 'Semester is required']
//   },
//   departmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: [true, 'Department is required']
//   },
//   teacherId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: [true, 'Teacher is required']
//   },
//   lecturePerWeek: {
//     type: Number,
//     required: [true, 'Lectures per week is required'],
//     min: [1, 'Minimum 1 lecture per week required'],
//     max: [20, 'Maximum 20 lectures per week allowed']
//   },
//   type: {
//     type: String,
//     enum: ['theory', 'practical', 'tutorial'],
//     required: [true, 'Subject type is required'],
//     lowercase: true
//   },
//   credits: {
//     type: Number,
//     min: [1, 'Minimum 1 credit required'],
//     max: [10, 'Maximum 10 credits allowed']
//   },
//   syllabus: {
//     type: String,
//     maxlength: [2000, 'Syllabus cannot exceed 2000 characters']
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes for better performance
// subjectSchema.index({ subjectName: 1, semesterId: 1 });
// subjectSchema.index({ departmentId: 1 });
// subjectSchema.index({ teacherId: 1 });

// // Virtual populate for related data
// subjectSchema.virtual('semester', {
//   ref: 'Semester',
//   localField: 'semesterId',
//   foreignField: '_id',
//   justOne: true
// });

// subjectSchema.virtual('department', {
//   ref: 'Department',
//   localField: 'departmentId',
//   foreignField: '_id',
//   justOne: true
// });

// subjectSchema.virtual('teacher', {
//   ref: 'Teacher',
//   localField: 'teacherId',
//   foreignField: '_id',
//   justOne: true
// });

// // Pre-save middleware
// subjectSchema.pre('save', function(next) {
//   if (this.isModified('subjectName')) {
//     this.subjectName = this.subjectName.trim();
//   }
//   next();
// });

// // Static methods
// subjectSchema.statics.findByDepartment = function(departmentId) {
//   return this.find({ departmentId, isActive: true })
//     .populate('semester', 'semesterName')
//     .populate('department', 'departmentName')
//     .populate('teacher', 'name email');
// };

// subjectSchema.statics.findBySemester = function(semesterId) {
//   return this.find({ semesterId, isActive: true })
//     .populate('semester', 'semesterName')
//     .populate('department', 'departmentName')
//     .populate('teacher', 'name email');
// };

// subjectSchema.statics.findByTeacher = function(teacherId) {
//   return this.find({ teacherId, isActive: true })
//     .populate('semester', 'semesterName')
//     .populate('department', 'departmentName')
//     .populate('teacher', 'name email');
// };

// const Subject = mongoose.model('Subject', subjectSchema);

// export default Subject;

// import mongoose from 'mongoose';

// const subjectSchema = new mongoose.Schema({
//   subjectName: {
//     type: String,
//     required: [true, 'Subject name is required'],
//     trim: true,
//     maxlength: [100, 'Subject name cannot exceed 100 characters']
//   },
  
//   subject_code: {
//     type: String,
//     required: [true, 'Subject code is required'],
//     trim: true,
//     uppercase: true,
//     unique: true
//   },

//   sem_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Semester',
//     required: [true, 'Semester is required']
//   },
  
//   department_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: [true, 'Department is required']
//   },
  
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: [true, 'Teacher is required']
//   },
  
//   lecturePerWeek: {
//     type: Number,
//     required: [true, 'Lectures per week is required'],
//     min: [1, 'Minimum 1 lecture per week required'],
//     max: [20, 'Maximum 20 lectures per week allowed']
//   },
  
//   type: {
//     type: String,
//     enum: ['theory', 'practical', 'tutorial'],
//     required: [true, 'Subject type is required'],
//     lowercase: true
//   },
  
//   credits: {
//     type: Number,
//     default: 3,
//     min: [1, 'Minimum 1 credit required'],
//     max: [10, 'Maximum 10 credits allowed']
//   },
  
//   syllabus: {
//     type: String,
//     maxlength: [2000, 'Syllabus cannot exceed 2000 characters']
//   },
  
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes for better performance
// subjectSchema.index({ subjectName: 1, sem_id: 1, department_id: 1 });
// subjectSchema.index({ subject_code: 1 });
// subjectSchema.index({ department_id: 1 });
// subjectSchema.index({ teacher_id: 1 });
// subjectSchema.index({ sem_id: 1 });

// // Virtual populate for related data
// subjectSchema.virtual('semester', {
//   ref: 'Semester',
//   localField: 'sem_id',
//   foreignField: '_id',
//   justOne: true
// });

// subjectSchema.virtual('department', {
//   ref: 'Department',
//   localField: 'department_id',
//   foreignField: '_id',
//   justOne: true
// });

// subjectSchema.virtual('teacher', {
//   ref: 'Teacher',
//   localField: 'teacher_id',
//   foreignField: '_id',
//   justOne: true
// });

// // Pre-save middleware
// subjectSchema.pre('save', function(next) {
//   if (this.isModified('subjectName')) {
//     this.subjectName = this.subjectName.trim();
//   }
//   if (this.isModified('subject_code')) {
//     this.subject_code = this.subject_code.trim().toUpperCase();
//   }
//   next();
// });

// // Static methods
// subjectSchema.statics.findByDepartment = function(departmentId) {
//   return this.find({ department_id: departmentId, isActive: true })
//     .populate('sem_id', 'semesterName semesterNumber')
//     .populate('department_id', 'departmentName departmentCode')
//     .populate('teacher_id', 'name email');
// };

// subjectSchema.statics.findBySemester = function(semesterId) {
//   return this.find({ sem_id: semesterId, isActive: true })
//     .populate('sem_id', 'semesterName semesterNumber')
//     .populate('department_id', 'departmentName departmentCode')
//     .populate('teacher_id', 'name email');
// };

// subjectSchema.statics.findByTeacher = function(teacherId) {
//   return this.find({ teacher_id: teacherId, isActive: true })
//     .populate('sem_id', 'semesterName semesterNumber')
//     .populate('department_id', 'departmentName departmentCode')
//     .populate('teacher_id', 'name email');
// };

// // Instance methods
// // subjectSchema.methods.getFullDetails = function() {
// //   return this.populate([
// //     { path: 'sem_id', select: 'semesterName semesterNumber' },
// //     { path: 'department_id', select: 'departmentName departmentCode' },
// //     { path: 'teacher_id', select: 'name email mobile' }
// //   ]);
// // };

// subjectSchema.methods.getFullDetails = async function() {
//   return await this.populate([
//     { path: 'sem_id', select: 'semesterName semesterNumber' },
//     { path: 'department_id', select: 'departmentName departmentCode' },
//     { path: 'teacher_id', select: 'name email mobile' }
//   ]);
// };


// const Subject = mongoose.model('Subject', subjectSchema);

// export default Subject;

// import mongoose from 'mongoose';
// const subjectSchema = new mongoose.Schema({
//   subjectName: {
//     type: String,
//     required: true,
//   },
//   subject_code: {
//     type: String,
//     required: true,
//   },
//   // sem_id: {
//   //   type: String,   // 👈 change from mongoose.Schema.Types.ObjectId to String
//   //   required: true,
//   // },
//   department_id: {
//     type: mongoose.Schema.Types.ObjectId,  // keep as ObjectId if departments exist
//     ref: 'Department',
//     required: true,
//   },
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: true,
//   },
//   lecturePerWeek: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     required: true,
//   },
//   credits: {
//     type: String,
//     required: true,
//   },
//   syllabus: {
//     type: String,
//   }
// }, { timestamps: true });

// export default mongoose.model("Subject", subjectSchema);


import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
    trim: true
  },
  subject_code: {
    type: String,
    required: true,
    trim: true
  },
  sem_id: {
    type: String,
    required: true
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  lecturePerWeek: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  credits: {
    type: String,
    required: true
  },
  syllabus: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);
