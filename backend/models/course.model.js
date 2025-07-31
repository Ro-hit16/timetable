// // models/Course.js
// import mongoose from 'mongoose';

// const courseSchema = new mongoose.Schema({
//   department_id: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   department_name: {
//     type: String,
//     required: true
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('Course', courseSchema);

// // models/Course.js
// import mongoose from 'mongoose';

// const courseSchema = new mongoose.Schema({
//   course_name: {
//     type: String,
//     required: [true, 'Course name is required'],
//     trim: true,
//     unique: true
//   },
//   course_code: {
//     type: String,
//     required: [true, 'Course code is required'],
//     trim: true,
//     unique: true,
//     uppercase: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   duration: {
//     type: Number,
//     default: 4 // years
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

// // Virtual populate
// courseSchema.virtual('semesters', {
//   ref: 'Semester',
//   foreignField: 'course_id',
//   localField: '_id'
// });

// export const Course = mongoose.model('Course', courseSchema);


// import mongoose from 'mongoose';

// const courseSchema = new mongoose.Schema({
//   course_name: {
//     type: String,
//     required: [true, 'Course name is required'],
//     trim: true,
//   },
//   course_code: {
//     type: String,
//     required: [true, 'Course code is required'],
//     trim: true,
//     uppercase: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   duration: {
//     type: Number,
//     default: 4 // years
//   },
//   year: {
//     type: String, // FE, SE, TE, BE
//     required: true
//   },
//   section: {
//     type: String, // A, B
//     required: true
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

// // Make course_code + year + section unique
// courseSchema.index({ course_code: 1, year: 1, section: 1 }, { unique: true });

// export const Course = mongoose.model('Course', courseSchema);


import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
  },
  course_code: {
    type: String,
    required: [true, 'Course code is required'],
    trim: true,
    uppercase: true
  },
  credits: {
    type: Number,
    default: 0,
    min: [0, 'Credits cannot be negative']
  },
  course_type: {
    type: String,
    enum: ['core', 'elective'],
    default: 'core'
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  semester_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: [true, 'Semester is required']
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    default: 4 // years
  },
  year: {
    type: String, // FE, SE, TE, BE
    required: [true, 'Year is required'],
    enum: ['FE', 'SE', 'TE', 'BE']
  },
  section: {
    type: String, // A, B, C
    required: [true, 'Section is required'],
    enum: ['A', 'B', 'C']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Make course_code + year + section unique
courseSchema.index({ course_code: 1, year: 1, section: 1 }, { unique: true });

// Index for better query performance
courseSchema.index({ department_id: 1, isActive: 1 });
courseSchema.index({ semester_id: 1, isActive: 1 });
courseSchema.index({ course_type: 1, isActive: 1 });

// Virtual for full course identifier
courseSchema.virtual('fullCode').get(function() {
  return `${this.course_code}-${this.year}-${this.section}`;
});

// Pre-save middleware to ensure course_code is uppercase
courseSchema.pre('save', function(next) {
  if (this.course_code) {
    this.course_code = this.course_code.toUpperCase();
  }
  next();
});

export const Course = mongoose.model('Course', courseSchema);