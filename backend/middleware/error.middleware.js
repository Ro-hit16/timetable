// import { AppError } from '../utils/error.js';

// const handleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError(message, 400);
// };

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   const message = `Duplicate field value: ${value}. Please use another value!`;
//   return new AppError(message, 400);
// };

// const handleValidationErrorDB = (err) => {
//   const errors = Object.values(err.errors).map(el => el.message);
//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return new AppError(message, 400);
// };

// const handleJWTError = () =>
//   new AppError('Invalid token. Please log in again!', 401);

// const handleJWTExpiredError = () =>
//   new AppError('Your token has expired! Please log in again.', 401);

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     success: false,
//     error: err,
//     message: err.message,
//     stack: err.stack
//   });
// };

// const sendErrorProd = (err, res) => {
//   // Operational, trusted error: send message to client
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       success: false,
//       message: err.message
//     });
//   } else {
//     // Programming or other unknown error: don't leak error details
//     console.error('ERROR 💥', err);
//     res.status(500).json({
//       success: false,
//       message: 'Something went wrong!'
//     });
//   }
// };

// export const globalErrorHandler = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, res);
//   } else {
//     let error = { ...err };
//     error.message = err.message;

//     if (error.name === 'CastError') error = handleCastErrorDB(error);
//     if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//     if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
//     if (error.name === 'JsonWebTokenError') error = handleJWTError();
//     if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

//     sendErrorProd(error, res);
//   }
// };

// // ✅ middleware/errorHandler.js
// import ApiError from '../utils/ApiError.js';

// const errorHandler = (err, req, res, next) => {
//   let error = { ...err };
//   error.message = err.message;

//   console.log(err);

//   if (err.name === 'CastError') {
//     const message = 'Resource not found';
//     error = new ApiError(404, message);
//   }

//   if (err.code === 11000) {
//     const message = 'Duplicate field value entered';
//     error = new ApiError(400, message);
//   }

//   if (err.name === 'ValidationError') {
//     const message = Object.values(err.errors).map(val => val.message);
//     error = new ApiError(400, 'Validation Error', message);
//   }

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


// middleware/errorHandler.js
import ApiError from '../utils/ApiError.js';

const handleCastErrorDB = (err) => {
  const message = `Resource not found: Invalid ${err.path} - ${err.value}.`;
  return new ApiError(404, message);
};

const handleDuplicateFieldsDB = (err) => {
  // Extract duplicate value from error message (MongoDB)
  const value = err.message.match(/(["'])(\\?.)*?\1/);
  const duplicateValue = value ? value[0] : 'Duplicate value';
  const message = `Duplicate field value: ${duplicateValue}. Please use another value!`;
  return new ApiError(400, message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = 'Validation Error';
  return new ApiError(400, message, errors);
};

const handleJWTError = () => new ApiError(401, 'Invalid token. Please log in again!');

const handleJWTExpiredError = () => new ApiError(401, 'Your token has expired! Please log in again.');

const errorHandler = (err, req, res, next) => {
  // Make a shallow copy of err to avoid mutating original err object properties
  let error = { ...err };
  error.message = err.message;

  // Handle known error types
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  else if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  else if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  else if (error.name === 'JsonWebTokenError') error = handleJWTError();
  else if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Set default status code and message if not set by ApiError
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';
  const errors = error.errors || [];

  // Log full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
