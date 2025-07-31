// import express from 'express';
// import {
//   register,
//   login,
//   logout,
//   refreshToken,
//   forgotPassword,
//   resetPassword,
//   changePassword,
//   getProfile,
//   updateProfile
// } from '../controllers/auth.controller.js';
// import { auth } from '../middleware/auth.middleware.js';
// import {
//   validateRegister,
//   validateLogin,
//   //validateForgotPassword,
//   //validateResetPassword,
//   //validateChangePassword,
//   //validateProfileUpdate
// } from '../middleware/validation.middleware.js';

// const router = express.Router();

// // Public routes (no authentication required)
// router.post('/register', validateRegister, register); // User registration (admin only)
// router.post('/login', validateLogin, login); // User login
// router.post('/forgot-password', validateForgotPassword, forgotPassword); // Forgot password
// router.post('/reset-password', validateResetPassword, resetPassword); // Reset password
// router.post('/refresh-token', refreshToken); // Refresh JWT token

// // Protected routes (authentication required)
// router.use(auth); // Apply authentication to all routes below

// router.post('/logout', logout); // User logout
// router.post('/change-password', validateChangePassword, changePassword); // Change password
// router.get('/profile', getProfile); // Get user profile
// router.put('/profile', validateProfileUpdate, updateProfile); // Update user profile

// export default router;

// routes/auth.route.js
import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile
} from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { validateRegister, validateLogin } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

router.use(auth);
router.post('/logout', logout);
router.post('/change-password', changePassword);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
