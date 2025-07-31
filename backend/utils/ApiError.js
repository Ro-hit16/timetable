// // utils/ApiError.js
// class ApiError extends Error {
//   constructor(
//     statusCode,
//     message = "Something went wrong",
//     errors = [],
//     stack = ""
//   ) {
//     super(message);
//     this.statusCode = statusCode;
//     this.data = null;
//     this.message = message;
//     this.success = false;
//     this.errors = errors;

//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

// export default ApiError;

// // utils/ApiResponse.js
// class ApiResponse {
//   constructor(statusCode, data, message = "Success") {
//     this.statusCode = statusCode;
//     this.data = data;
//     this.message = message;
//     this.success = statusCode < 400;
//   }
// }

// export { ApiResponse };

// // utils/asyncHandler.js
// const asyncHandler = (requestHandler) => {
//   return (req, res, next) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//   };
// };

// export default ApiResponse;

// // middleware/errorHandler.js
// import ApiError from '../utils/ApiError.js';

// const errorHandler = (err, req, res, next) => {
//   let error = { ...err };
//   error.message = err.message;

//   // Log error
//   console.log(err);

//   // Mongoose bad ObjectId
//   if (err.name === 'CastError') {
//     const message = 'Resource not found';
//     error = new ApiError(404, message);
//   }

//   // Mongoose duplicate key
//   if (err.code === 11000) {
//     const message = 'Duplicate field value entered';
//     error = new ApiError(400, message);
//   }

//   // Mongoose validation error
//   if (err.name === 'ValidationError') {
//     const message = Object.values(err.errors).map(val => val.message);
//     error = new ApiError(400, 'Validation Error', message);
//   }

//   // JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     const message = 'Invalid token';
//     error = new ApiError(401, message);
//   }

//   if (err.name === 'TokenExpiredError') {
//     const message = 'Token expired';
//     error = new ApiError(401, message);
//   }

//   res.status(error.statusCode || 500).json({
//     success: false,
//     message: error.message || 'Server Error',
//     errors: error.errors || [],
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// };

// export default errorHandler;

// // middleware/auth.js 
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import ApiError from '../utils/ApiError.js';
// import asyncHandler from '../utils/asyncHandler.js';

// // Protect routes
// export const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     throw new ApiError(401, 'Not authorized to access this route');
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Get user from token
//     req.user = await User.findById(decoded.id).select('-password');

//     if (!req.user) {
//       throw new ApiError(401, 'Not authorized to access this route');
//     }

//     next();
//   } catch (error) {
//     throw new ApiError(401, 'Not authorized to access this route');
//   }
// });

// // Grant access to specific roles
// export const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       throw new ApiError(
//         403,
//         `User role ${req.user.role} is not authorized to access this route`
//       );
//     }
//     next();
//   };
// };

// // utils/generateToken.js
// import jwt from 'jsonwebtoken';

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || '30d',
//   });
// };

// export default generateToken;



class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;