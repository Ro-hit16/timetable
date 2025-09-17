
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

import departmentRoutes from './routes/departments.route.js';

import subjectRoutes from './routes/subjects.route.js';
import teacherRoutes from './routes/teachers.route.js';
import timetableRoutes from './routes/timetables.route.js';
import pdfRoutes from './routes/pdf.route.js';

import classRoutes from './routes/class.route.js';
import globalErrorHandler from './middleware/error.middleware.js';
import { createError } from './utils/error.js';

dotenv.config();
const app = express();

// ------------------------ MIDDLEWARES ------------------------
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
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

app.use('/api/departments', departmentRoutes);

app.use('/api/subjects', subjectRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/classes', classRoutes);

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
