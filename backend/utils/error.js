// utils/error.js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.status = 'fail';
  return err;
};