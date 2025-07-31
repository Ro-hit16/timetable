// // models/Department.js
// import mongoose from 'mongoose';

// const departmentSchema = new mongoose.Schema({
//   departmentName: {
//     type: String,
//     required: [true, 'Department name is required'],
//     unique: true,
//     trim: true,
//     maxlength: [100, 'Department name cannot exceed 100 characters']
//   },
//   departmentCode: {
//     type: String,
//     required: [true, 'Department code is required'],
//     unique: true,
//     trim: true,
//     uppercase: true,
//     maxlength: [10, 'Department code cannot exceed 10 characters']
//   },
//   description: {
//     type: String,
//     trim: true,
//     maxlength: [500, 'Description cannot exceed 500 characters']
//   },
//   establishedYear: {
//     type: Number,
//     min: [1900, 'Established year cannot be before 1900'],
//     max: [new Date().getFullYear(), 'Established year cannot be in the future']
//   },
//   headOfDepartment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher'
//   },
//   contactEmail: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     match: [
//       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//       'Please enter a valid email'
//     ]
//   },
//   contactPhone: {
//     type: String,
//     trim: true,
//     match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
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

// // Indexes for faster queries
// departmentSchema.index({ departmentName: 1 });
// departmentSchema.index({ departmentCode: 1 });
// departmentSchema.index({ isActive: 1 });

// // Virtual populates
// departmentSchema.virtual('teachers', {
//   ref: 'Teacher',
//   localField: '_id',
//   foreignField: 'departmentId'
// });
// departmentSchema.virtual('semesters', {
//   ref: 'Semester',
//   localField: '_id',
//   foreignField: 'departmentId'
// });
// departmentSchema.virtual('subjects', {
//   ref: 'Subject',
//   localField: '_id',
//   foreignField: 'departmentId'
// });
// departmentSchema.virtual('students', {
//   ref: 'Student',
//   localField: '_id',
//   foreignField: 'departmentId'
// });
// departmentSchema.virtual('hodDetails', {
//   ref: 'Teacher',
//   localField: 'headOfDepartment',
//   foreignField: '_id',
//   justOne: true
// });

// // Pre-save middleware to normalize string fields
// departmentSchema.pre('save', function(next) {
//   if (this.isModified('departmentName')) {
//     this.departmentName = this.departmentName.trim();
//   }
//   if (this.isModified('departmentCode')) {
//     this.departmentCode = this.departmentCode.trim().toUpperCase();
//   }
//   if (this.isModified('description') && this.description) {
//     this.description = this.description.trim();
//   }
//   next();
// });

// // Static method to get all active departments, sorted by name, with HOD details populated
// departmentSchema.statics.findActiveDepartments = function() {
//   return this.find({ isActive: true })
//     .populate('hodDetails', 'name email')
//     .sort({ departmentName: 1 });
// };

// // Static method to find department by code (case-insensitive)
// departmentSchema.statics.findByCode = function(code) {
//   return this.findOne({ departmentCode: code.toUpperCase() });
// };

// // Instance methods to get counts of related documents
// departmentSchema.methods.getTeacherCount = async function() {
//   const Teacher = mongoose.model('Teacher');
//   return await Teacher.countDocuments({ departmentId: this._id, isActive: true });
// };

// departmentSchema.methods.getStudentCount = async function() {
//   const Student = mongoose.model('Student');
//   return await Student.countDocuments({ departmentId: this._id, isActive: true });
// };

// departmentSchema.methods.getSemesterCount = async function() {
//   const Semester = mongoose.model('Semester');
//   return await Semester.countDocuments({ departmentId: this._id, isActive: true });
// };

// departmentSchema.methods.getSubjectCount = async function() {
//   const Subject = mongoose.model('Subject');
//   return await Subject.countDocuments({ departmentId: this._id, isActive: true });
// };

// const Department = mongoose.model('Department', departmentSchema);

// export default Department;


// models/department.model.js
import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters'],
    minlength: [2, 'Department name must be at least 2 characters']
  },
  departmentCode: {
    type: String,
    required: [true, 'Department code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [10, 'Department code cannot exceed 10 characters'],
    minlength: [2, 'Department code must be at least 2 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  establishedYear: {
    type: Number,
    min: [1900, 'Established year cannot be before 1900'],
    max: [new Date().getFullYear(), 'Established year cannot be in the future'],
    validate: {
      validator: function(value) {
        return !value || (Number.isInteger(value) && value > 0);
      },
      message: 'Established year must be a valid year'
    }
  },
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ],
    validate: {
      validator: function(value) {
        return !value || this.constructor.isValidEmail(value);
      },
      message: 'Please enter a valid email address'
    }
  },
  contactPhone: {
    type: String,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number starting with 6-9'],
    validate: {
      validator: function(value) {
        return !value || /^[6-9]\d{9}$/.test(value);
      },
      message: 'Please enter a valid 10-digit Indian phone number'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  // Additional fields for better management
  location: {
    building: { type: String, trim: true },
    floor: { type: String, trim: true },
    room: { type: String, trim: true }
  },
  budget: {
    allocated: { type: Number, min: 0 },
    spent: { type: Number, min: 0, default: 0 }
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(value) {
        return !value || /^https?:\/\/.+\..+/.test(value);
      },
      message: 'Please enter a valid website URL'
    }
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
departmentSchema.index({ departmentName: 1, isActive: 1 });
departmentSchema.index({ departmentCode: 1, isActive: 1 });
departmentSchema.index({ establishedYear: 1 });
departmentSchema.index({ headOfDepartment: 1 });
departmentSchema.index({ createdAt: -1 });

// Text index for search functionality
departmentSchema.index({
  departmentName: 'text',
  departmentCode: 'text',
  description: 'text'
});

// Virtual populates for related data
departmentSchema.virtual('teachers', {
  ref: 'Teacher',
  localField: '_id',
  foreignField: 'department_id',
  match: { isActive: true }
});

departmentSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'department_id',
  match: { isActive: true }
});

departmentSchema.virtual('semesters', {
  ref: 'Semester',
  localField: '_id',
  foreignField: 'department_id',
  match: { isActive: true }
});

departmentSchema.virtual('subjects', {
  ref: 'Subject',
  localField: '_id',
  foreignField: 'department_id',
  match: { isActive: true }
});

departmentSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'department_id',
  match: { isActive: true }
});

departmentSchema.virtual('hodDetails', {
  ref: 'Teacher',
  localField: 'headOfDepartment',
  foreignField: '_id',
  justOne: true
});

// Virtual for full department info
departmentSchema.virtual('fullName').get(function() {
  return `${this.departmentName} (${this.departmentCode})`;
});

// Virtual for years since establishment
departmentSchema.virtual('yearsEstablished').get(function() {
  return this.establishedYear ? new Date().getFullYear() - this.establishedYear : null;
});

// Pre-save middleware to normalize and validate data
departmentSchema.pre('save', function(next) {
  // Normalize string fields
  if (this.isModified('departmentName')) {
    this.departmentName = this.departmentName.trim();
  }
  
  if (this.isModified('departmentCode')) {
    this.departmentCode = this.departmentCode.trim().toUpperCase();
  }
  
  if (this.isModified('description') && this.description) {
    this.description = this.description.trim();
  }
  
  if (this.isModified('contactEmail') && this.contactEmail) {
    this.contactEmail = this.contactEmail.trim().toLowerCase();
  }
  
  if (this.isModified('contactPhone') && this.contactPhone) {
    this.contactPhone = this.contactPhone.replace(/\D/g, ''); // Remove non-digits
  }
  
  if (this.isModified('website') && this.website) {
    this.website = this.website.trim();
    // Add https:// if no protocol specified
    if (this.website && !this.website.startsWith('http')) {
      this.website = 'https://' + this.website;
    }
  }
  
  next();
});

// Pre-update middleware
departmentSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  if (update.departmentName) {
    update.departmentName = update.departmentName.trim();
  }
  
  if (update.departmentCode) {
    update.departmentCode = update.departmentCode.trim().toUpperCase();
  }
  
  if (update.description) {
    update.description = update.description.trim();
  }
  
  if (update.contactEmail) {
    update.contactEmail = update.contactEmail.trim().toLowerCase();
  }
  
  if (update.contactPhone) {
    update.contactPhone = update.contactPhone.replace(/\D/g, '');
  }
  
  next();
});

// Static methods
departmentSchema.statics.findActiveDepartments = function(populateHod = true) {
  let query = this.find({ isActive: true }).sort({ departmentName: 1 });
  
  if (populateHod) {
    query = query.populate('hodDetails', 'name email contactPhone');
  }
  
  return query;
};

departmentSchema.statics.findByCode = function(code) {
  return this.findOne({ 
    departmentCode: code.toUpperCase(),
    isActive: true 
  });
};

departmentSchema.statics.findByName = function(name) {
  return this.findOne({ 
    departmentName: { $regex: `^${name}$`, $options: 'i' },
    isActive: true 
  });
};

departmentSchema.statics.searchDepartments = function(searchTerm, limit = 10) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { departmentName: { $regex: searchTerm, $options: 'i' } },
          { departmentCode: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      }
    ]
  })
  .limit(limit)
  .sort({ departmentName: 1 });
};

departmentSchema.statics.getDepartmentsByEstablishedYear = function(year) {
  return this.find({ 
    establishedYear: year,
    isActive: true 
  }).sort({ departmentName: 1 });
};

departmentSchema.statics.isValidEmail = function(email) {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Instance methods for getting related counts
departmentSchema.methods.getTeacherCount = async function() {
  try {
    const Teacher = mongoose.model('Teacher');
    return await Teacher.countDocuments({ 
      department_id: this._id, 
      isActive: true 
    });
  } catch (error) {
    console.error('Error getting teacher count:', error);
    return 0;
  }
};

departmentSchema.methods.getStudentCount = async function() {
  try {
    const Student = mongoose.model('Student');
    return await Student.countDocuments({ 
      department_id: this._id, 
      isActive: true 
    });
  } catch (error) {
    console.error('Error getting student count:', error);
    return 0;
  }
};

departmentSchema.methods.getSemesterCount = async function() {
  try {
    const Semester = mongoose.model('Semester');
    return await Semester.countDocuments({ 
      department_id: this._id, 
      isActive: true 
    });
  } catch (error) {
    console.error('Error getting semester count:', error);
    return 0;
  }
};

departmentSchema.methods.getSubjectCount = async function() {
  try {
    const Subject = mongoose.model('Subject');
    return await Subject.countDocuments({ 
      department_id: this._id, 
      isActive: true 
    });
  } catch (error) {
    console.error('Error getting subject count:', error);
    return 0;
  }
};

departmentSchema.methods.getCourseCount = async function() {
  try {
    const Course = mongoose.model('Course');
    return await Course.countDocuments({ 
      department_id: this._id, 
      isActive: true 
    });
  } catch (error) {
    console.error('Error getting course count:', error);
    return 0;
  }
};

// Method to get complete department info with stats
departmentSchema.methods.getCompleteInfo = async function() {
  const departmentInfo = this.toObject();
  
  departmentInfo.stats = {
    teacherCount: await this.getTeacherCount(),
    studentCount: await this.getStudentCount(),
    semesterCount: await this.getSemesterCount(),
    subjectCount: await this.getSubjectCount(),
    courseCount: await this.getCourseCount()
  };
  
  return departmentInfo;
};

// Method to check if department can be deleted
departmentSchema.methods.canBeDeleted = async function() {
  const counts = {
    teachers: await this.getTeacherCount(),
    students: await this.getStudentCount(),
    subjects: await this.getSubjectCount(),
    courses: await this.getCourseCount()
  };
  
  const hasActiveRelations = Object.values(counts).some(count => count > 0);
  
  return {
    canDelete: !hasActiveRelations,
    reasons: hasActiveRelations ? counts : null
  };
};

// Post-save hook for logging
departmentSchema.post('save', function(doc) {
  console.log(`Department ${doc.departmentName} was saved with ID: ${doc._id}`);
});

// Error handling middleware
departmentSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    const message = field === 'departmentName' 
      ? 'Department name already exists' 
      : 'Department code already exists';
    next(new Error(message));
  } else {
    next(error);
  }
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;