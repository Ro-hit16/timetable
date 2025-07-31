// // import mongoose from 'mongoose';
// // import bcrypt from 'bcryptjs';

// // const userSchema = new mongoose.Schema({
// //   user_name: {
// //     type: String,
// //     required: [true, 'Username is required'],
// //     unique: true,
// //     trim: true,
// //     minlength: [3, 'Username must be at least 3 characters long']
// //   },
// //   password: {
// //     type: String,
// //     required: [true, 'Password is required'],
// //     minlength: [6, 'Password must be at least 6 characters long']
// //   },
// //   role: {
// //     type: String,
// //     enum: ['admin', 'teacher', 'student'],
// //     default: 'admin'
// //   },
// //   isActive: {
// //     type: Boolean,
// //     default: true
// //   }
// // }, {
// //   timestamps: true,
// //   collection: 'admin'
// // });

// // // Hash password before saving
// // userSchema.pre('save', async function(next) {
// //   if (!this.isModified('password')) return next();
  
// //   try {
// //     const salt = await bcrypt.genSalt(12);
// //     this.password = await bcrypt.hash(this.password, salt);
// //     next();
// //   } catch (error) {
// //     next(error);
// //   }
// // });

// // // Compare password method
// // userSchema.methods.comparePassword = async function(candidatePassword) {
// //   return await bcrypt.compare(candidatePassword, this.password);
// // };

// // // Remove password from JSON output
// // userSchema.methods.toJSON = function() {
// //   const userObject = this.toObject();
// //   delete userObject.password;
// //   return userObject;
// // };

// // export default mongoose.model('User', userSchema);


// // models/user.model.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   user_name: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true, minlength: 6, select: false },
//   role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'admin' },
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });

// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.model('User', userSchema);


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);

