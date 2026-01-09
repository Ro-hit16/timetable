

import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { createError } from '../utils/error.js';
import asyncHandler from '../utils/async-handler.js';
import {OAuth2Client} from 'google-auth-library'
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const googleLogin = asyncHandler(async (req, res, next) => {
  const { token } = req.body; // Google ID token from frontend

  if (!token) return next(createError(400, 'Google token is required'));

  // Verify token with Google
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const {
    sub: googleId,
    email,
    name,
    picture,
    email_verified,
  } = payload;

  if (!email_verified) {
    return next(createError(401, 'Google email not verified'));
  }

  // Check if user exists
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      user_name: email.split('@')[0],
      email,
      googleId,
      role: 'student',
      isGoogleUser: true,
    });
  }

  createSendToken(user, 200, res, 'Google login successful');
});



const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const createSendToken = (user, statusCode, res, message) => {
  const token = generateToken(user._id);
  // Remove password before sending response
  const userObj = user.toObject();
  //delete userObj.password;

  res.status(statusCode).json({ success: true, message, token, user: userObj });
};

export const register = asyncHandler(async (req, res, next) => {
  const { name, user_name, email, password, role } = req.body;
  if (!user_name || !email || !password) {
    return next(createError(400, 'All required fields must be provided'));
  }
  const existingUser = await User.findOne({ $or: [{ user_name }, { email }] });
  if (existingUser) return next(createError(400, 'Username or email already exists'));
  const newUser = await User.create({ user_name, email, password, role });
  createSendToken(newUser, 201, res, 'User registered successfully');
});

export const login = asyncHandler(async (req, res, next) => {
  const { user_name, password } = req.body;
  if (!user_name || !password) return next(createError(400, 'All fields are required'));

  const user = await User.findOne({ user_name }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(createError(401, 'Invalid credentials'));
  }

  createSendToken(user, 200, res, 'Login successful');
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = generateToken(req.user.id);
  res.status(200).json({ success: true, token });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(createError(404, 'User not found'));
  const resetToken = generateToken(user._id);
  res.status(200).json({ success: true, resetToken });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) return next(createError(404, 'User not found'));
  user.password = newPassword;
  await user.save();
  res.status(200).json({ success: true, message: 'Password reset successfully' });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword))) return next(createError(401, 'Current password is incorrect'));
  user.password = newPassword;
  await user.save();
  res.status(200).json({ success: true, message: 'Password changed successfully' });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json({ success: true, user });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true }).select('-password');
  if (!user) return next(createError(404, 'User not found'));
  res.status(200).json({ success: true, user });
});
