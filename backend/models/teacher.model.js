// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const teacherSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Teacher name is required'],
//     trim: true,
//     maxlength: [100, 'Name cannot exceed 100 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [6, 'Password must be at least 6 characters'],
//     select: false
//   },
//   mobile: {
//     type: String,
//     required: [true, 'Mobile number is required'],
//     trim: true,
//     match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
//   },
//   address: {
//     type: String,
//     required: [true, 'Address is required'],
//     trim: true,
//     maxlength: [200, 'Address cannot exceed 200 characters']
//   },
//   departmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: [true, 'Department is required']
//   },
//   employeeId: {
//     type: String,
//     unique: true,
//     trim: true,
//     maxlength: [20, 'Employee ID cannot exceed 20 characters']
//   },
//   qualification: {
//     type: String,
//     trim: true,
//     maxlength: [100, 'Qualification cannot exceed 100 characters']
//   },
//   experience: {
//     type: Number,
//     min: [0, 'Experience cannot be negative'],
//     max: [50, 'Experience cannot exceed 50 years']
//   },
//   designation: {
//     type: String,
//     enum: ['assistant professor', 'associate professor', 'professor', 'lecturer', 'guest faculty'],
//     default: 'assistant professor',
//     lowercase: true
//   },
//   joiningDate: {
//     type: Date,
//     default: Date.now
//   },
//   salary: {
//     type: Number,
//     min: [0, 'Salary cannot be negative']
//   },
//   subjects: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subject'
//   }],
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   profileImage: {
//     type: String,
//     default: null
//   },
//   lastLogin: {
//     type: Date
//   }
// }, {
//   timestamps: true,
//   toJSON: { 
//     virtuals: true,
//     transform: function(doc, ret) {
//       delete ret.password;
//       return ret;
//     }
//   },
//   toObject: { virtuals: true }
// });

// // Indexes
// teacherSchema.index({ email: 1 });
// teacherSchema.index({ employeeId: 1 });
// teacherSchema.index({ departmentId: 1 });

// // Virtual populate
// teacherSchema.virtual('department', {
//   ref: 'Department',
//   localField: 'departmentId',
//   foreignField: '_id',
//   justOne: true
// });

// teacherSchema.virtual('teachingSubjects', {
//   ref: 'Subject',
//   localField: '_id',
//   foreignField: 'teacherId'
// });

// // Pre-save middleware
// teacherSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }

//   if (this.isModified('name')) this.name = this.name.trim();
//   if (this.isModified('address')) this.address = this.address.trim();
//   if (this.isModified('qualification')) this.qualification = this.qualification.trim();

//   if (!this.employeeId && this.isNew) {
//     const count = await this.constructor.countDocuments();
//     this.employeeId = `TCH${(count + 1).toString().padStart(4, '0')}`;
//   }

//   next();
// });

// // Instance methods
// teacherSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// teacherSchema.methods.updateLastLogin = function() {
//   this.lastLogin = new Date();
//   return this.save({ validateBeforeSave: false });
// };

// teacherSchema.methods.getSubjectCount = async function() {
//   const Subject = mongoose.model('Subject');
//   return await Subject.countDocuments({ teacherId: this._id, isActive: true });
// };

// // Static methods
// teacherSchema.statics.findByDepartment = function(departmentId) {
//   return this.find({ departmentId, isActive: true })
//     .populate('department', 'departmentName')
//     .select('-password')
//     .sort({ name: 1 });
// };

// teacherSchema.statics.findActiveTeachers = function() {
//   return this.find({ isActive: true })
//     .populate('department', 'departmentName')
//     .select('-password')
//     .sort({ name: 1 });
// };

// teacherSchema.statics.findByEmail = function(email) {
//   return this.findOne({ email: email.toLowerCase() });
// };

// teacherSchema.statics.findByEmployeeId = function(employeeId) {
//   return this.findOne({ employeeId });
// };

// const Teacher = mongoose.model('Teacher', teacherSchema);
// export default Teacher;



// // models/Teacher.js
// import mongoose from 'mongoose';

// const teacherSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Teacher name is required'],
//     trim: true
//   },
//   department: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: [true, 'Department is required']
//   },
//   semester: {
//     type: Number,
//     required: [true, 'Semester is required'],
//     min: 1,
//     max: 8
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('Teacher', teacherSchema);

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