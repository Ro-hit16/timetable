// import mongoose from 'mongoose';
// import logger from './logger.js';

// export const connectDB = async () => {
//   try {
//     const options = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       maxPoolSize: 10,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//       bufferCommands: false,
//       bufferMaxEntries: 0
//     };

//     const conn = await mongoose.connect(process.env.MONGODB_URI, options);

//     logger.info(`MongoDB Connected: ${conn.connection.host}`);

//     mongoose.connection.on('connected', () => {
//       logger.info('Mongoose connected to MongoDB');
//     });

//     mongoose.connection.on('error', (err) => {
//       logger.error('Mongoose connection error:', err);
//     });

//     mongoose.connection.on('disconnected', () => {
//       logger.warn('Mongoose disconnected from MongoDB');
//     });

//     process.on('SIGINT', async () => {
//       await mongoose.connection.close();
//       logger.info('Mongoose connection closed due to app termination');
//       process.exit(0);
//     });

//     return conn;
//   } catch (error) {
//     logger.error('Database connection failed:', error);
//     process.exit(1);
//   }
// };


import mongoose from 'mongoose';
import logger from './logger.js';

export const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed due to app termination');
      process.exit(0);
    });

    // ✅ Drop index once connected
    mongoose.connection.once('open', async () => {
      await dropEmailIndex();
    });

    return conn;
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

const dropEmailIndex = async () => {
  try {
    const db = mongoose.connection.db;
    await db.collection('teachers').dropIndex('email_1');
    logger.info('✅ Email index dropped successfully');
  } catch (error) {
    logger.error(`❌ Error dropping index: ${error.message}`);
  }
};
