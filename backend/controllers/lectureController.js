import fs from 'fs';
import Lecture from '../models/Lecture.model.js';

export const importLectures = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Read the uploaded JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Uploaded file must contain an array of lectures' });
    }

    // Insert lectures into MongoDB
    const saved = await Lecture.insertMany(data);

    // Cleanup uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({ message: 'Lectures imported successfully', data: saved });
  } catch (error) {
    console.error('Import Lectures Error:', error);
    res.status(500).json({ message: 'Failed to import lectures' });
  }
};
