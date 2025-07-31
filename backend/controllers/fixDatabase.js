// fixDatabase.js - Run this once to clean existing data and fix indexes

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Lms';

export async function fixDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('teachers');

    // Check existing indexes
    console.log('Existing indexes:');
    const indexes = await collection.indexes();
    console.log(indexes);

    // Option 1: Drop the entire teachers collection and start fresh
    console.log('\n🗑️ Dropping teachers collection to start fresh...');
    await collection.drop();
    console.log('✅ Teachers collection dropped');

    // The email index will be recreated automatically when you restart your server
    // because it's defined in the schema

    console.log('\n🎉 Database cleanup completed!');
    console.log('📌 Now restart your server to let Mongoose recreate the collection with proper indexes');
    
  } catch (error) {
    if (error.message.includes('ns not found')) {
      console.log('ℹ️ Teachers collection does not exist, nothing to clean');
    } else {
      console.error('❌ Error fixing database:', error);
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the fix


// Usage: node fixDatabase.js

// Usage: node fixDatabase.js