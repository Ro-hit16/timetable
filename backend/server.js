// // // server.js
// // import express from 'express';
// // import mongoose from 'mongoose';
// // import dotenv from 'dotenv';
// // import cors from 'cors';
// // import helmet from 'helmet';
// // import morgan from 'morgan';
// // import rateLimit from 'express-rate-limit';
// // import cookieParser from 'cookie-parser';
// // import compression from 'compression';
// // import mongoSanitize from 'express-mongo-sanitize';
// // import xss from 'xss-clean';

// // import authRoutes from './routes/auth.route.js';
// // import courseRoutes from './routes//courses.route.js';
// // import semesterRoutes from './routes/semesters.route.js';
// // import subjectRoutes from './routes/subjects.route.js';
// // import teacherRoutes from './routes/teachers.route.js';
// // import studentRoutes from './routes/students.route.js';
// // import timetableRoutes from './routes/timetables.route.js';
// // //import departmentRoutes from './routes/departments.route.js';

// // import  globalErrorHandler  from './middleware/error.middleware.js';
// // import { createError } from './utils/error.js';

// // // Handle uncaught exceptions
// // process.on('uncaughtException', (err) => {
// //   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
// //   console.log(err.name, err.message);
// //   process.exit(1);
// // });

// // // Load environment variables
// // dotenv.config();

// // const app = express();

// // // Security middleware
// // app.use(helmet());

// // // CORS configuration
// // app.use(cors({
// //   origin: process.env.CLIENT_URL || 'http://localhost:3000',
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// // // Rate limiting
// // const limiter = rateLimit({
// //   max: 100,
// //   windowMs: 60 * 60 * 1000, // 1 hour
// //   message: 'Too many requests from this IP, please try again in an hour!'
// // });
// // app.use('/api', limiter);

// // // Body parser middleware
// // app.use(express.json({ limit: '10kb' }));
// // app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// // app.use(cookieParser());

// // // Data sanitization
// // app.use(mongoSanitize());
// // app.use(xss());

// // // Compression middleware
// // app.use(compression());

// // // Logging
// // if (process.env.NODE_ENV === 'development') {
// //   app.use(morgan('dev'));
// // }

// // // Health check route
// // app.get('/health', (req, res) => {
// //   res.status(200).json({
// //     success: true,
// //     message: 'Server is running!',
// //     timestamp: new Date().toISOString()
// //   });
// // });

// // // API routes
// // app.use('/api/auth', authRoutes);
// // app.use('/api/courses', courseRoutes);
// // app.use('/api/semesters', semesterRoutes);
// // app.use('/api/subjects', subjectRoutes);
// // app.use('/api/teachers', teacherRoutes);
// // app.use('/api/students', studentRoutes);
// // app.use('/api/timetables', timetableRoutes);
// // //app.use('/api/departments', departmentRoutes);

// // // Handle undefined routes
// // app.all('*', (req, res, next) => {
// //   next(createError(404, `Can't find ${req.originalUrl} on this server!`));
// // });

// // // Global error handling middleware
// // app.use(globalErrorHandler);

// // // Database connection and server startup
// // const PORT = process.env.PORT || 5000;

// // const startServer = async () => {
// //   try {
// //     const conn = await mongoose.connect(process.env.MONGODB_URI, {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true
// //     });

// //     console.log(`MongoDB Connected: ${conn.connection.host}`);

// //     const server = app.listen(PORT, () => {
// //       console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
// //     });

// //     process.on('unhandledRejection', (err) => {
// //       console.log('UNHANDLED REJECTION! 💥 Shutting down...');
// //       console.log(err.name, err.message);
// //       server.close(() => process.exit(1));
// //     });

// //     process.on('SIGTERM', () => {
// //       console.log('SIGTERM received. Shutting down gracefully...');
// //       server.close(() => {
// //         console.log('💥 Process terminated');
// //       });
// //     });

// //     process.on('SIGINT', () => {
// //       console.log('SIGINT received. Shutting down...');
// //       server.close(() => {
// //         console.log('✅ Server shut down gracefully');
// //         process.exit(0);
// //       });
// //     });

// //   } catch (error) {
// //     console.error('Failed to connect to the database:', error);
// //     process.exit(1);
// //   }
// // };

// // startServer();
// // server.js
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import cookieParser from 'cookie-parser';
// import compression from 'compression';
// import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';

// import authRoutes from './routes/auth.route.js';
// import courseRoutes from './routes/courses.route.js';
// import semesterRoutes from './routes/semesters.route.js';
// import subjectRoutes from './routes/subjects.route.js';
// import teacherRoutes from './routes/teachers.route.js';
// import studentRoutes from './routes/students.route.js';
// import timetableRoutes from './routes/timetables.route.js';

// // <-- NEW: Import departments route
// import departmentRoutes from './routes/departments.route.js';

// import globalErrorHandler from './middleware/error.middleware.js';
// import { createError } from './utils/error.js';

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// // Load environment variables
// dotenv.config();

// const app = express();

// // Security middleware
// app.use(helmet());

// // CORS configuration
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Rate limiting
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000, // 1 hour
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// // Body parser middleware
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// app.use(cookieParser());

// // Data sanitization
// app.use(mongoSanitize());
// app.use(xss());

// // Compression middleware
// app.use(compression());

// // Logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Health check route
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running!',
//     timestamp: new Date().toISOString()
//   });
// });

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/semesters', semesterRoutes);
// app.use('/api/subjects', subjectRoutes);
// app.use('/api/teachers', teacherRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/timetables', timetableRoutes);

// // <-- NEW: Use departments route
// app.use('/api/departments', departmentRoutes);

// // Handle undefined routes
// app.all('*', (req, res, next) => {
//   next(createError(404, `Can't find ${req.originalUrl} on this server!`));
// });

// // Global error handling middleware
// app.use(globalErrorHandler);

// // Database connection and server startup
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);

//     const server = app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
//     });

//     process.on('unhandledRejection', (err) => {
//       console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//       console.log(err.name, err.message);
//       server.close(() => process.exit(1));
//     });

//     process.on('SIGTERM', () => {
//       console.log('SIGTERM received. Shutting down gracefully...');
//       server.close(() => {
//         console.log('💥 Process terminated');
//       });
//     });

//     process.on('SIGINT', () => {
//       console.log('SIGINT received. Shutting down...');
//       server.close(() => {
//         console.log('✅ Server shut down gracefully');
//         process.exit(0);
//       });
//     });

//   } catch (error) {
//     console.error('Failed to connect to the database:', error);
//     process.exit(1);
//   }
// };

// startServer();


// // server.js
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import cookieParser from 'cookie-parser';
// import compression from 'compression';
// import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';

// import authRoutes from './routes/auth.route.js';
// import globalErrorHandler from './middleware/error.middleware.js';
// import { createError } from './utils/error.js';

// dotenv.config();
// const app = express();

// app.use(helmet());
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true,
// }));
// app.use(rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again in an hour!'
// }));
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// app.use(cookieParser());
// app.use(mongoSanitize());
// app.use(xss());
// app.use(compression());
// if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'Server is running!' }));
// app.use('/api/auth', authRoutes);

// app.all('*', (req, res, next) => {
//   next(createError(404, `Can't find ${req.originalUrl} on this server!`));
// });

// app.use(globalErrorHandler);

// const startServer = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     app.listen(process.env.PORT || 5000, () => console.log('Server started'));
//   } catch (error) {
//     console.error('DB connection failed:', error);
//     process.exit(1);
//   }
// };

// startServer();

// // server.js
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import cookieParser from 'cookie-parser';
// import compression from 'compression';
// import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import authRoutes from './routes/auth.route.js';
// import courseRoutes from './routes/courses.route.js';
// import departmentRoutes from './routes/departments.route.js';
// import semesterRoutes from './routes/semesters.route.js';
// import studentRoutes from './routes/students.route.js';
// import subjectRoutes from './routes/subjects.route.js';
// import teacherRoutes from './routes/teachers.route.js';
// import timetableRoutes from './routes/timetables.route.js';

// import globalErrorHandler from './middleware/error.middleware.js';
// import { createError } from './utils/error.js';

// dotenv.config();
// const app = express();

// // ------------------------ MIDDLEWARES ------------------------
// app.use(helmet());
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true,
// }));
// app.use(rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again in an hour!'
// }));
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// app.use(cookieParser());
// app.use(mongoSanitize());
// app.use(xss());
// app.use(compression());
// if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// // ------------------------ STATIC FILES ------------------------
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ------------------------ ROUTES ------------------------
// app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'Server is running!' }));

// app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/departments', departmentRoutes);
// app.use('/api/semesters', semesterRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/subjects', subjectRoutes);
// app.use('/api/teachers', teacherRoutes);
// app.use('/api/timetables', timetableRoutes);

// // ------------------------ ERROR HANDLING ------------------------
// app.all('*', (req, res, next) => {
//   next(createError(404, `Can't find ${req.originalUrl} on this server!`));
// });

// app.use(globalErrorHandler);

// // ------------------------ DB CONNECTION ------------------------
// const startServer = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     app.listen(process.env.PORT || 5000, () =>
//       console.log(`Server started on port ${process.env.PORT || 5000}`)
//     );
//   } catch (error) {
//     console.error('DB connection failed:', error);
//     process.exit(1);
//   }
// };

// startServer();


// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.route.js';
import courseRoutes from './routes/courses.route.js';
import departmentRoutes from './routes/departments.route.js';
import semesterRoutes from './routes/semesters.route.js';
import studentRoutes from './routes/students.route.js';
import subjectRoutes from './routes/subjects.route.js';
import teacherRoutes from './routes/teachers.route.js';
import timetableRoutes from './routes/timetables.route.js';
import pdfRoutes from './routes/pdf.route.js';
import lectureRoutes from './routes/lectureRoutes.js';
import classRoutes from './routes/class.route.js';
import globalErrorHandler from './middleware/error.middleware.js';
import { createError } from './utils/error.js';

dotenv.config();
const app = express();

// ------------------------ MIDDLEWARES ------------------------
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.set('trust proxy', 1);

// ⚠️ General rate limit (only basic)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // high limit for general traffic
});
app.use(generalLimiter);

// ⚠️ Specific rate limiter for login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 attempts allowed in 15 minutes
  message: 'Too many login/register attempts. Please try again later.',
});

// ------------------------ BODY/PARSER ------------------------
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ------------------------ STATIC FILES ------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------------ ROUTES ------------------------
// Apply authLimiter only to login and register
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'Server is running!' }));
app.use('/api/courses', courseRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/lectures', lectureRoutes);
// ------------------------ ERROR HANDLING ------------------------
app.all('*', (req, res, next) => {
  next(createError(404, `Can't find ${req.originalUrl} on this server!`));
});
app.use(globalErrorHandler);

// ------------------------ DB CONNECTION ------------------------
const startServer = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server started on port ${process.env.PORT || 5000}`)
    );
  } catch (error) {
    console.error('DB connection failed:', error);
    process.exit(1);
  }
};

startServer();
