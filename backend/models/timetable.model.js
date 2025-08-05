// // import mongoose from 'mongoose';

// // const timetableSchema = new mongoose.Schema({
// //     day: { type: String, required: true },
// //     lectures: [
// //         {
// //             lectureNumber: { type: Number, required: true },
// //             subject: { type: String, required: true },
// //             teacher: { type: String, required: true },
// //             time: { type: String, required: true }
// //         }
// //     ]
// // });

// // const Timetable = mongoose.model('Timetable', timetableSchema);
// // export default Timetable;


// // models/Timetable.js
// import mongoose from 'mongoose';

// const TimetableSchema = new mongoose.Schema({
//   department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
//   semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
//   schedule: { type: Array, required: true }, // structure depends on timetablegen output
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model('Timetable', TimetableSchema);

// import mongoose from 'mongoose';

// // models/Timetable.js
// const timetableSchema = new mongoose.Schema({
//   semester_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Semester',
//     required: [true, 'Semester ID is required']
//   },
//   subject_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subject',
//     required: [true, 'Subject ID is required']
//   },
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: [true, 'Teacher ID is required']
//   },
//   day_of_week: {
//     type: String,
//     required: [true, 'Day of week is required'],
//     enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
//   },
//   start_time: {
//     type: String,
//     required: [true, 'Start time is required'],
//     match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
//   },
//   end_time: {
//     type: String,
//     required: [true, 'End time is required'],
//     match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
//   },
//   room_number: {
//     type: String,
//     trim: true
//   },
//   type: {
//     type: String,
//     enum: ['lecture', 'lab', 'tutorial'],
//     default: 'lecture'
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// // Prevent scheduling conflicts
// timetableSchema.index({ 
//   semester_id: 1, 
//   day_of_week: 1, 
//   start_time: 1 
// }, { 
//   unique: true,
//   partialFilterExpression: { isActive: true }
// });

// // Prevent teacher conflicts
// timetableSchema.index({ 
//   teacher_id: 1, 
//   day_of_week: 1, 
//   start_time: 1 
// }, { 
//   unique: true,
//   partialFilterExpression: { isActive: true }
// });

// export const Timetable = mongoose.model('Timetable', timetableSchema);




// import mongoose from 'mongoose';

// const timetableSchema = new mongoose.Schema({
//   department_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: [true, 'Department ID is required']
//   },
//   sem_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Semester',
//     required: [true, 'Semester ID is required']
//   },
//   subject_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subject',
//     required: [true, 'Subject ID is required']
//   },
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: [true, 'Teacher ID is required']
//   },
//   day_of_week: {
//     type: String,
//     required: [true, 'Day of week is required'],
//     enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
//   },
//   start_time: {
//     type: String,
//     required: [true, 'Start time is required'],
//     match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
//   },
//   end_time: {
//     type: String,
//     required: [true, 'End time is required'],
//     match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
//   },
//   room_number: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   type: {
//     type: String,
//     enum: ['Lecture', 'Lab', 'Tutorial', 'Break'],
//     default: 'Lecture'
//   },
//   subject_name: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// // Prevent scheduling conflicts for same semester/day/time
// timetableSchema.index({ 
//   sem_id: 1, 
//   day_of_week: 1, 
//   start_time: 1 
// }, { 
//   unique: true,
//   partialFilterExpression: { isActive: true }
// });

// // Prevent teacher conflicts for same day/time
// timetableSchema.index({ 
//   teacher_id: 1, 
//   day_of_week: 1, 
//   start_time: 1 
// }, { 
//   unique: true,
//   partialFilterExpression: { isActive: true }
// });

// // Virtual for formatted time display
// timetableSchema.virtual('timeSlot').get(function() {
//   return `${this.start_time} - ${this.end_time}`;
// });

// // Method to check conflicts
// timetableSchema.methods.checkConflicts = async function() {
//   const conflicts = [];
  
//   // Check semester conflict
//   const semesterConflict = await this.constructor.findOne({
//     sem_id: this.sem_id,
//     day_of_week: this.day_of_week,
//     start_time: this.start_time,
//     _id: { $ne: this._id },
//     isActive: true
//   });
  
//   if (semesterConflict) {
//     conflicts.push({
//       type: 'semester',
//       message: 'Time slot already occupied for this semester'
//     });
//   }
  
//   // Check teacher conflict
//   const teacherConflict = await this.constructor.findOne({
//     teacher_id: this.teacher_id,
//     day_of_week: this.day_of_week,
//     start_time: this.start_time,
//     _id: { $ne: this._id },
//     isActive: true
//   });
  
//   if (teacherConflict) {
//     conflicts.push({
//       type: 'teacher',
//       message: 'Teacher is already assigned at this time'
//     });
//   }
  
//   return conflicts;
// };

// export const Timetable = mongoose.model('Timetable', timetableSchema);



// import mongoose from 'mongoose';

// const timetableSchema = new mongoose.Schema({
//   department_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: [true, 'Department ID is required']
//   },
//   sem_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Semester',
//     required: [true, 'Semester ID is required']
//   },
//   subject_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subject'
//   },
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher'
//   },
//   day_of_week: {
//     type: String,
//     required: [true, 'Day of week is required'],
//     enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
//   },
//   start_time: {
//     type: String,
//     required: [true, 'Start time is required'],
//     match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
//   },
//   end_time: {
//     type: String,
//     required: [true, 'End time is required'],
//     match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
//   },
//   room_number: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   type: {
//     type: String,
//     enum: ['Lecture', 'Lab', 'Tutorial', 'Break'],
//     default: 'Lecture'
//   },
//   subject_name: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// timetableSchema.index({ 
//   sem_id: 1, 
//   day_of_week: 1, 
//   start_time: 1 
// }, { 
//   unique: true,
//   partialFilterExpression: { isActive: true }
// });

// timetableSchema.index({ 
//   teacher_id: 1, 
//   day_of_week: 1, 
//   start_time: 1 
// }, { 
//   unique: true,
//   partialFilterExpression: { isActive: true }
// });

// timetableSchema.virtual('timeSlot').get(function() {
//   return `${this.start_time} - ${this.end_time}`;
// });

// timetableSchema.methods.checkConflicts = async function() {
//   const conflicts = [];
  
//   const semesterConflict = await this.constructor.findOne({
//     sem_id: this.sem_id,
//     day_of_week: this.day_of_week,
//     start_time: this.start_time,
//     _id: { $ne: this._id },
//     isActive: true
//   });
  
//   if (semesterConflict) {
//     conflicts.push({
//       type: 'semester',
//       message: 'Time slot already occupied for this semester'
//     });
//   }
  
//   const teacherConflict = await this.constructor.findOne({
//     teacher_id: this.teacher_id,
//     day_of_week: this.day_of_week,
//     start_time: this.start_time,
//     _id: { $ne: this._id },
//     isActive: true
//   });
  
//   if (teacherConflict) {
//     conflicts.push({
//       type: 'teacher',
//       message: 'Teacher is already assigned at this time'
//     });
//   }
  
//   return conflicts;
// };

// export const Timetable = mongoose.model('Timetable', timetableSchema);


// // models/timetable.model.js
// import mongoose from 'mongoose';

// const timeSlotSchema = new mongoose.Schema({
//   day: {
//     type: String,
//     required: true,
//     enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
//   },
//   period: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 6
//   },
//   start_time: {
//     type: String,
//     required: true
//   },
//   end_time: {
//     type: String,
//     required: true
//   },
//   subject_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subject',
//     required: true
//   },
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: true
//   },
//   division: {
//     type: String,
//     required: true,
//     enum: ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']
//   },
//   room_number: {
//     type: String,
//     default: null
//   },
//   is_lab: {
//     type: Boolean,
//     default: false
//   },
//   duration: {
//     type: Number, // in hours
//     default: 1
//   }
// }, { _id: true });

// const timetableSchema = new mongoose.Schema({
//   department_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: true
//   },
//   semester: {
//     type: String,
//     required: true
//   },
//   academic_year: {
//     type: String,
//     required: true
//   },
//   divisions: [{
//     type: String,
//     enum: ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']
//   }],
//   schedule: [timeSlotSchema],
//   generation_metadata: {
//     algorithm_version: String,
//     fitness_score: Number,
//     generation_count: Number,
//     conflicts_resolved: Number,
//     created_at: {
//       type: Date,
//       default: Date.now
//     }
//   },
//   status: {
//     type: String,
//     enum: ['draft', 'published', 'archived'],
//     default: 'draft'
//   }
// }, { 
//   timestamps: true,
//   indexes: [
//     { department_id: 1, semester: 1, academic_year: 1 },
//     { 'schedule.division': 1, 'schedule.day': 1, 'schedule.period': 1 }
//   ]
// });

// // Enhanced Subject Schema with Division Support
// const enhancedSubjectSchema = new mongoose.Schema({
//   subjectName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   subject_code: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   sem_id: {
//     type: String,
//     required: true
//   },
//   department_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: true
//   },
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: true
//   },
//   divisions: [{
//     type: String,
//     enum: ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']
//   }],
//   lecturePerWeek: {
//     type: Number,
//     required: true
//   },
//   type: {
//     type: String,
//     required: true,
//     enum: ['Theory', 'Lab', 'Tutorial', 'Practical']
//   },
//   credits: {
//     type: Number,
//     required: true
//   },
//   duration: {
//     type: Number, // in hours
//     default: function() {
//       return this.type === 'Lab' ? 2 : 1;
//     }
//   },
//   requires_lab: {
//     type: Boolean,
//     default: function() {
//       return this.type === 'Lab' || this.type === 'Practical';
//     }
//   },
//   syllabus: {
//     type: String
//   }
// }, { timestamps: true });

// // Teacher Availability Schema
// const teacherAvailabilitySchema = new mongoose.Schema({
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: true
//   },
//   day: {
//     type: String,
//     required: true,
//     enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
//   },
//   unavailable_periods: [{
//     period: Number,
//     reason: String
//   }],
//   max_hours_per_day: {
//     type: Number,
//     default: 6
//   },
//   preferred_divisions: [{
//     type: String,
//     enum: ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']
//   }]
// }, { timestamps: true });

// export const Timetable = mongoose.model('Timetable', timetableSchema);
// export const EnhancedSubject = mongoose.model('EnhancedSubject', enhancedSubjectSchema);
// export const TeacherAvailability = mongoose.model('TeacherAvailability', teacherAvailabilitySchema);



// import mongoose from 'mongoose';

// const timeSlotSchema = new mongoose.Schema({
//   period: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 6
//   },
//   subject: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subject'
//   },
//   teacher: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher'
//   },
//   classroom: {
//     type: String,
//     default: ''
//   }
// });

// const dayScheduleSchema = new mongoose.Schema({
//   Monday: [timeSlotSchema],
//   Tuesday: [timeSlotSchema],
//   Wednesday: [timeSlotSchema],
//   Thursday: [timeSlotSchema],
//   Friday: [timeSlotSchema]
// });

// const divisionSchema = new mongoose.Schema({
//   division_name: {
//     type: String,
//     required: true,
//     enum: ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']
//   },
//   schedule: dayScheduleSchema
// });

// const timetableSchema = new mongoose.Schema({
//   departmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: true
//   },
//   semester: {
//     type: String,
//     required: true,
//     enum: ['1', '2', '3', '4', '5', '6', '7', '8']
//   },
//   // academicYear: {
//   //   type: String,
//   //   required: true,
//   //   match: /^\d{4}-\d{4}$/
//   // },
//   academicYear: {
//   type: String,
//   required: true,
//   match: [/^\d{4}-\d{2}$/, 'Invalid academic year format']  // allows "2024-25"
// },
//   divisions: [divisionSchema],
//   status: {
//     type: String,
//     enum: ['draft', 'published', 'archived'],
//     default: 'draft'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Update the updatedAt field before saving
// timetableSchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

// const Timetable = mongoose.model('Timetable', timetableSchema);

// export default Timetable;


// import mongoose from 'mongoose';

// const timeSlotSchema = new mongoose.Schema({
//   period: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 6
//   },
//   subject: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subject'
//   },
//   teacher: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher'
//   },
//   classroom: {
//     type: String,
//     default: ''
//   }
// });

// const dayScheduleSchema = new mongoose.Schema({
//   Monday: [timeSlotSchema],
//   Tuesday: [timeSlotSchema],
//   Wednesday: [timeSlotSchema],
//   Thursday: [timeSlotSchema],
//   Friday: [timeSlotSchema]
// });

// const divisionSchema = new mongoose.Schema({
//   division_name: {
//     type: String,
//     required: true,
//     enum: ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']
//   },
//   schedule: dayScheduleSchema
// });

// const timetableSchema = new mongoose.Schema({
//   departmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: true
//   },
//   semester: {
//     type: String,
//     required: true,
//     enum: ['1', '2', '3', '4', '5', '6', '7', '8']
//   },
//   // academicYear: {
//   //   type: String,
//   //   required: true,
//   //   match: /^\d{4}-\d{4}$/
//   // },
//   academicYear: {
//   type: String,
//   required: true,
//   match: [/^\d{4}-\d{2}$/, 'Invalid academic year format']  // allows "2024-25"
// },
//   divisions: [divisionSchema],
//   status: {
//     type: String,
//     enum: ['draft', 'published', 'archived'],
//     default: 'draft'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Update the updatedAt field before saving
// timetableSchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

// // Enhanced Subject schema for genetic algorithm
// const enhancedSubjectSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   code: {
//     type: String,
//     required: true
//   },
//   type: {
//     type: String,
//     enum: ['Lecture', 'Lab', 'Tutorial'],
//     default: 'Lecture'
//   },
//   lecturePerWeek: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 6
//   },
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: true
//   },
//   department_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: true
//   },
//   sem_id: {
//     type: String,
//     required: true
//   },
//   divisions: [{
//     type: String,
//     enum: ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']
//   }]
// });

// // Teacher availability schema
// const teacherAvailabilitySchema = new mongoose.Schema({
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: true
//   },
//   day: {
//     type: String,
//     enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
//     required: true
//   },
//   available_periods: [{
//     type: Number,
//     min: 1,
//     max: 6
//   }],
//   preferred_periods: [{
//     type: Number,
//     min: 1,
//     max: 6
//   }],
//   unavailable_periods: [{
//     type: Number,
//     min: 1,
//     max: 6
//   }]
// });

// const Timetable = mongoose.model('Timetable', timetableSchema);
// const EnhancedSubject = mongoose.model('EnhancedSubject', enhancedSubjectSchema);
// const TeacherAvailability = mongoose.model('TeacherAvailability', teacherAvailabilitySchema);

// export default Timetable;
// export { EnhancedSubject, TeacherAvailability };

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
}

  },
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