// import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';
// import { createError } from '../utils/error.js';
// // import { asyncHandler } from '../utils/async-handler.js';
// import asyncHandler from '../utils/async-handler.js';

// // Generate JWT token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || '7d'
//   });
// };

// // Send token via cookie + response
// const createSendToken = (user, statusCode, res, message) => {
//   const token = generateToken(user._id);

//   const cookieOptions = {
//     expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict'
//   };

//   res.cookie('jwt', token, cookieOptions);

//   res.status(statusCode).json({
//     success: true,
//     message,
//     token,
//     user
//   });
// };

// // 🔐 Protect Route Middleware
// export const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   // Get token from header or cookie
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }

//   if (!token) {
//     return next(createError(401, 'You are not logged in! Please log in to get access.'));
//   }

//   // Verify token
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   // Check if user exists
//   const currentUser = await User.findById(decoded.id);
//   if (!currentUser) {
//     return next(createError(401, 'The user belonging to this token no longer exists.'));
//   }

//   // Check if user is active
//   if (!currentUser.isActive) {
//     return next(createError(401, 'Your account has been deactivated.'));
//   }

//   req.user = currentUser;
//   next();
// });

// // 🛑 Restrict To Specific Roles
// export const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(createError(403, 'You do not have permission to perform this action'));
//     }
//     next();
//   };
// };

// // 👁 Check if logged in (for views, not blocking)
// export const isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
//       const currentUser = await User.findById(decoded.id);
      
//       if (currentUser && currentUser.isActive) {
//         req.user = currentUser;
//         return next();
//       }
//     } catch (err) {
//       return next();
//     }
//   }
//   next();
// };

// // ✅ Login Controller
// export const login = asyncHandler(async (req, res, next) => {
//   const { e: user_name, p: password } = req.body;

//   if (!user_name || !password) {
//     return next(createError(400, 'Please provide username and password'));
//   }

//   const user = await User.findOne({ user_name }).select('+password');

//   if (!user || !(await user.comparePassword(password))) {
//     return next(createError(401, 'Invalid login details'));
//   }

//   if (!user.isActive) {
//     return next(createError(401, 'Your account has been deactivated'));
//   }

//   createSendToken(user, 200, res, 'Login successful');
// });

// // 🚪 Logout Controller
// export const logout = asyncHandler(async (req, res) => {
//   res.cookie('jwt', 'loggedout', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true
//   });

//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });

// // 🙋‍♂️ Get Logged-in User Info
// export const getMe = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);

//   res.status(200).json({
//     success: true,
//     user
//   });
// });

// // 🔑 Update Password
// export const updatePassword = asyncHandler(async (req, res, next) => {
//   const { currentPassword, newPassword, confirmPassword } = req.body;

//   if (!currentPassword || !newPassword || !confirmPassword) {
//     return next(createError(400, 'Please provide current, new and confirm password'));
//   }

//   if (newPassword !== confirmPassword) {
//     return next(createError(400, 'New password and confirm password do not match'));
//   }

//   const user = await User.findById(req.user.id).select('+password');

//   if (!(await user.comparePassword(currentPassword))) {
//     return next(createError(401, 'Current password is incorrect'));
//   }

//   user.password = newPassword;
//   await user.save();

//   createSendToken(user, 200, res, 'Password updated successfully');
// });



// import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';
// import { createError } from '../utils/error.js';
// import asyncHandler from '../utils/async-handler.js';

// // 🔐 Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || '7d',
//   });
// };

// // 🍪 Send Token via Cookie + Response
// const createSendToken = (user, statusCode, res, message) => {
//   const token = generateToken(user._id);

//   const cookieOptions = {
//     expires: new Date(
//       Date.now() +
//         (parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//   };

//   res.cookie('jwt', token, cookieOptions);

//   res.status(statusCode).json({
//     success: true,
//     message,
//     token,
//     user,
//   });
// };

// // 🛡️ Protect Route Middleware
// export const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   // Extract token from headers or cookies
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }

//   if (!token) {
//     return next(
//       createError(401, 'You are not logged in! Please log in to get access.')
//     );
//   }

//   // Verify token
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   // Check if user still exists
//   const currentUser = await User.findById(decoded.id);
//   if (!currentUser) {
//     return next(
//       createError(401, 'The user belonging to this token no longer exists.')
//     );
//   }

//   // Check if user is active
//   if (!currentUser.isActive) {
//     return next(createError(401, 'Your account has been deactivated.'));
//   }

//   req.user = currentUser;
//   next();
// });

// // ⛔ Restrict Access to Roles
// export const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         createError(403, 'You do not have permission to perform this action.')
//       );
//     }
//     next();
//   };
// };

// // 👁️ Check if Logged In (non-blocking)
// export const isLoggedIn = asyncHandler(async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
//       const currentUser = await User.findById(decoded.id);

//       if (currentUser && currentUser.isActive) {
//         req.user = currentUser;
//       }
//     } catch (err) {
//       // Token invalid or expired
//     }
//   }
//   next();
// });

// // ✅ Login Controller
// export const login = asyncHandler(async (req, res, next) => {
//   const { e: user_name, p: password } = req.body;

//   if (!user_name || !password) {
//     return next(createError(400, 'Please provide username and password.'));
//   }

//   const user = await User.findOne({ user_name }).select('+password');

//   if (!user || !(await user.comparePassword(password))) {
//     return next(createError(401, 'Invalid login credentials.'));
//   }

//   if (!user.isActive) {
//     return next(createError(401, 'Your account has been deactivated.'));
//   }

//   createSendToken(user, 200, res, 'Login successful');
// });

// // 🚪 Logout Controller
// export const logout = asyncHandler(async (req, res) => {
//   res.cookie('jwt', 'loggedout', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });

//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully',
//   });
// });

// // 🙋 Get Logged-in User Info
// export const getMe = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// // 🔑 Update Password
// export const updatePassword = asyncHandler(async (req, res, next) => {
//   const { currentPassword, newPassword, confirmPassword } = req.body;

//   if (!currentPassword || !newPassword || !confirmPassword) {
//     return next(
//       createError(400, 'Please provide current, new, and confirm password.')
//     );
//   }

//   if (newPassword !== confirmPassword) {
//     return next(
//       createError(400, 'New password and confirm password do not match.')
//     );
//   }

//   const user = await User.findById(req.user.id).select('+password');

//   if (!(await user.comparePassword(currentPassword))) {
//     return next(createError(401, 'Current password is incorrect.'));
//   }

//   user.password = newPassword;
//   await user.save();

//   createSendToken(user, 200, res, 'Password updated successfully');
// });



// // controllers/auth.controller.js
// import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';
// import { createError } from '../utils/error.js';
// import asyncHandler from '../utils/async-handler.js';

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || '7d'
//   });
// };

// const createSendToken = (user, statusCode, res, message) => {
//   const token = generateToken(user._id);

//   const cookieOptions = {
//     expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict'
//   };

//   res.cookie('jwt', token, cookieOptions);

//   res.status(statusCode).json({
//     success: true,
//     message,
//     token,
//     user
//   });
// };

// export const register = asyncHandler(async (req, res, next) => {
//   const { name, email, password, role } = req.body;

//   const existingUser = await User.findOne({ $or: [{ name }, { email }] });
//   if (existingUser) {
//     return next(createError(400, 'Username or email already exists'));
//   }

//   const newUser = await User.create({ name, email, password, role });

//   createSendToken(newUser, 201, res, 'User registered successfully');
// });

// export const login = asyncHandler(async (req, res, next) => {
//   const { name, password } = req.body;

//   if (!name || !password) {
//     return next(createError(400, 'Please provide name and password'));
//   }

//   const user = await User.findOne({ name }).select('+password');

//   if (!user || !(await user.comparePassword(password))) {
//     return next(createError(401, 'Invalid login details'));
//   }

//   if (!user.isActive) {
//     return next(createError(401, 'Your account has been deactivated'));
//   }

//   createSendToken(user, 200, res, 'Login successful');
// });

// export const logout = asyncHandler(async (req, res) => {
//   res.cookie('jwt', 'loggedout', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true
//   });

//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });

// export const refreshToken = asyncHandler(async (req, res) => {
//   const token = generateToken(req.user.id);
//   res.status(200).json({
//     success: true,
//     token
//   });
// });

// export const forgotPassword = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     return next(createError(404, 'User not found with this email'));
//   }

//   // Fake token generation for demo (implement real email/token logic in production)
//   const resetToken = generateToken(user._id);

//   res.status(200).json({
//     success: true,
//     message: 'Reset token generated (simulate sending email)',
//     resetToken
//   });
// });

// export const resetPassword = asyncHandler(async (req, res, next) => {
//   const { token, newPassword } = req.body;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return next(createError(404, 'Invalid or expired token'));
//     }

//     user.password = newPassword;
//     await user.save();

//     res.status(200).json({ success: true, message: 'Password reset successfully' });
//   } catch (err) {
//     return next(createError(400, 'Invalid or expired token'));
//   }
// });

// export const changePassword = asyncHandler(async (req, res, next) => {
//   const { currentPassword, newPassword } = req.body;
//   const user = await User.findById(req.user.id).select('+password');

//   if (!(await user.comparePassword(currentPassword))) {
//     return next(createError(401, 'Current password is incorrect'));
//   }

//   user.password = newPassword;
//   await user.save();

//   res.status(200).json({ success: true, message: 'Password changed successfully' });
// });

// export const getProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);
//   res.status(200).json({ success: true, user });
// });

// export const updateProfile = asyncHandler(async (req, res, next) => {
//   const updates = req.body;
//   const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });

//   if (!user) {
//     return next(createError(404, 'User not found'));
//   }

//   res.status(200).json({ success: true, user });
// });


// // controllers/auth.controller.js
// import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';
// import { createError } from '../utils/error.js';
// import asyncHandler from '../utils/async-handler.js';

// const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// const createSendToken = (user, statusCode, res, message) => {
//   const token = generateToken(user._id);
//   res.status(statusCode).json({ success: true, message, token, user });
// };

// export const register = asyncHandler(async (req, res, next) => {
//   const { name, user_name, email, password, role } = req.body;
//   const existingUser = await User.findOne({ $or: [{ user_name }, { email }] });
//   if (existingUser) return next(createError(400, 'Username or email already exists'));
//   const newUser = await User.create({ user_name, email, password, role });
//   createSendToken(newUser, 201, res, 'User registered successfully');
// });

// export const login = asyncHandler(async (req, res, next) => {
//   const { user_name, password } = req.body;
//   const user = await User.findOne({ user_name }).select('+password');
//   if (!user || !(await user.comparePassword(password))) return next(createError(401, 'Invalid credentials'));
//   createSendToken(user, 200, res, 'Login successful');
// });

// export const logout = asyncHandler(async (req, res) => {
//   res.clearCookie('jwt');
//   res.status(200).json({ success: true, message: 'Logged out successfully' });
// });

// export const refreshToken = asyncHandler(async (req, res) => {
//   const token = generateToken(req.user.id);
//   res.status(200).json({ success: true, token });
// });

// export const forgotPassword = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return next(createError(404, 'User not found'));
//   const resetToken = generateToken(user._id);
//   res.status(200).json({ success: true, resetToken });
// });

// export const resetPassword = asyncHandler(async (req, res, next) => {
//   const { token, newPassword } = req.body;
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const user = await User.findById(decoded.id);
//   if (!user) return next(createError(404, 'User not found'));
//   user.password = newPassword;
//   await user.save();
//   res.status(200).json({ success: true, message: 'Password reset successfully' });
// });

// export const changePassword = asyncHandler(async (req, res, next) => {
//   const { currentPassword, newPassword } = req.body;
//   const user = await User.findById(req.user.id).select('+password');
//   if (!(await user.comparePassword(currentPassword))) return next(createError(401, 'Current password is incorrect'));
//   user.password = newPassword;
//   await user.save();
//   res.status(200).json({ success: true, message: 'Password changed successfully' });
// });

// export const getProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);
//   res.status(200).json({ success: true, user });
// });

// export const updateProfile = asyncHandler(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
//   if (!user) return next(createError(404, 'User not found'));
//   res.status(200).json({ success: true, user });
// });

// import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';
// import { createError } from '../utils/error.js';
// import asyncHandler from '../utils/async-handler.js';

// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// const createSendToken = (user, statusCode, res, message) => {
//   const token = generateToken(user._id);
//   // Remove password before sending response
//   const userObj = user.toObject();
//   delete userObj.password;

//   res.status(statusCode).json({ success: true, message, token, user: userObj });
// };

// export const register = asyncHandler(async (req, res, next) => {
//   const { name, user_name, email, password, role } = req.body;
//   if (!user_name || !email || !password) {
//     return next(createError(400, 'All required fields must be provided'));
//   }
//   const existingUser = await User.findOne({ $or: [{ user_name }, { email }] });
//   if (existingUser) return next(createError(400, 'Username or email already exists'));
//   const newUser = await User.create({ user_name, email, password, role });
//   createSendToken(newUser, 201, res, 'User registered successfully');
// });

// export const login = asyncHandler(async (req, res, next) => {
//   const { user_name, password } = req.body;
//   if (!user_name || !password) return next(createError(400, 'All fields are required'));

//   const user = await User.findOne({ user_name }).select('+password');
//   if (!user || !(await user.comparePassword(password))) {
//     return next(createError(401, 'Invalid credentials'));
//   }

//   createSendToken(user, 200, res, 'Login successful');
// });

// export const logout = asyncHandler(async (req, res) => {
//   res.clearCookie('jwt');
//   res.status(200).json({ success: true, message: 'Logged out successfully' });
// });

// export const refreshToken = asyncHandler(async (req, res) => {
//   const token = generateToken(req.user.id);
//   res.status(200).json({ success: true, token });
// });

// export const forgotPassword = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return next(createError(404, 'User not found'));
//   const resetToken = generateToken(user._id);
//   res.status(200).json({ success: true, resetToken });
// });

// export const resetPassword = asyncHandler(async (req, res, next) => {
//   const { token, newPassword } = req.body;
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const user = await User.findById(decoded.id);
//   if (!user) return next(createError(404, 'User not found'));
//   user.password = newPassword;
//   await user.save();
//   res.status(200).json({ success: true, message: 'Password reset successfully' });
// });

// export const changePassword = asyncHandler(async (req, res, next) => {
//   const { currentPassword, newPassword } = req.body;
//   const user = await User.findById(req.user.id).select('+password');
//   if (!(await user.comparePassword(currentPassword))) return next(createError(401, 'Current password is incorrect'));
//   user.password = newPassword;
//   await user.save();
//   res.status(200).json({ success: true, message: 'Password changed successfully' });
// });

// export const getProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id).select('-password');
//   res.status(200).json({ success: true, user });
// });

// export const updateProfile = asyncHandler(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true }).select('-password');
//   if (!user) return next(createError(404, 'User not found'));
//   res.status(200).json({ success: true, user });
// });



// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "../utils/async-handler.js";
import { AppError } from "../utils/error.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const createSendToken = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  // Remove password before sending response
  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userObj,
  });
};

// ✅ Register
export const register = asyncHandler(async (req, res, next) => {
  const { name, user_name, email, password, role } = req.body;

  if (!user_name || !email || !password) {
    return next(new AppError("All required fields must be provided", 400));
  }

  const existingUser = await User.findOne({ $or: [{ user_name }, { email }] });
  if (existingUser) {
    return next(new AppError("Username or email already exists", 400));
  }

  const newUser = await User.create({ name, user_name, email, password, role });
  createSendToken(newUser, 201, res, "User registered successfully");
});

// ✅ Login
export const login = asyncHandler(async (req, res, next) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const user = await User.findOne({ user_name }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid credentials", 401));
  }

  createSendToken(user, 200, res, "Login successful");
});

// ✅ Logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ✅ Refresh token
export const refreshToken = asyncHandler(async (req, res) => {
  const token = generateToken(req.user.id);
  res.status(200).json({
    success: true,
    token,
  });
});

// ✅ Forgot password (for demo, returns reset token directly)
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("User not found", 404));

  const resetToken = generateToken(user._id);
  res.status(200).json({
    success: true,
    message: "Password reset token generated",
    resetToken,
  });
});

// ✅ Reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid or expired token", 400));
  }

  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("User not found", 404));

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

// ✅ Change password
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  if (!user) return next(new AppError("User not found", 404));

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// ✅ Get profile
export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

// ✅ Update profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
