// ManualLectureAdder.jsx
import React, { useEffect, useState } from 'react';
import LectureForm from '@/components/Timetable/LectureForm';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManualLectureAdder = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [subjectsRes, teachersRes, classesRes] = await Promise.all([
        axios.get('/api/subjects'),
        axios.get('/api/teachers'),
        axios.get('/api/classes')
      ]);
      setSubjects(subjectsRes.data);
      setTeachers(teachersRes.data);
      setClasses(classesRes.data);
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    }
  };

  const handleAddLecture = (lecture) => {
    setLectures([...lectures, lecture]);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/lectures', { lectures });
      toast.success('Lectures added successfully!');
      setLectures([]);
    } catch (err) {
      toast.error('Failed to save lectures.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manual Lecture Adder</h2>

      <LectureForm
        subjects={subjects}
        teachers={teachers}
        classes={classes}
        onAdd={handleAddLecture}
      />

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Added Lectures:</h3>
        {lectures.length === 0 ? (
          <p>No lectures added yet.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-1">
            {lectures.map((lec, index) => (
              <li key={index}>
                {lec.day} - Period {lec.period}: {subjects.find(s => s._id === lec.subject)?.name} by {teachers.find(t => t._id === lec.teacher)?.name} in Room {lec.classroom}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit All Lectures
        </button>
      </div>
    </div>
  );
};

export default ManualLectureAdder;
