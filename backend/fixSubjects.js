// fixSubjects.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

await mongoose.connection.collection('subjects').updateMany(
  { name: { $exists: true }, subjectName: { $exists: false } },
  [{ $set: { subjectName: "$name" } }]
);

console.log("✅ subjectName copied from name where needed.");
process.exit();
