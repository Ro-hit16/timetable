// // utils/response.js
// export const sendResponse = (res, statusCode, success, message, data = null) => {
//   const response = {
//     success,
//     message
//   };

//   if (data) {
//     response.data = data;
//   }

//   res.status(statusCode).json(response);
// };

// export const sendErrorResponse = (res, statusCode, message, errors = null) => {
//   const response = {
//     success: false,
//     message
//   };

//   if (errors) {
//     response.errors = errors;
//   }

//   res.status(statusCode).json(response);
// };

// class ApiResponse {
//   constructor(statusCode, data, message = "Success") {
//     this.statusCode = statusCode;
//     this.data = data;
//     this.message = message;
//     this.success = statusCode < 400;
//   }
// }

// export { ApiResponse };


// utils/response.js

// Sends a success or failure response with optional data
export const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success: Boolean(success),
    message: message || "",
  };

  // Include data only if it's not null or undefined
  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Sends an error response with optional errors array or object
export const sendErrorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message: message || "An error occurred",
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Class to standardize API response format if you want to use it elsewhere
class ApiResponse {
  constructor(statusCode, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;  // status codes below 400 considered success
  }

  toJSON() {
    // Customize serialization, exclude statusCode if not needed in response
    return {
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}

export { ApiResponse };
