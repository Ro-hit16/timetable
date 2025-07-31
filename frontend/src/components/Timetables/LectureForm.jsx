import React, { useState } from 'react';

const LectureForm = ({ subjects = [], teachers = [], classes = [], onAdd }) => {
  const [formData, setFormData] = useState({
    day: 'Monday',
    period: 1,
    subject: '',
    teacher: '',
    classroom: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ ...formData, subject: '', teacher: '', classroom: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mt-5 mb-4 shadow-sm">
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label>Day</label>
          <select name="day" value={formData.day} onChange={handleChange} className="w-full border p-1 rounded">
            {days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Period</label>
          <input type="number" name="period" min="1" max="8" value={formData.period} onChange={handleChange} className="w-full border p-1 rounded" />
        </div>
        <div>
          <label>Subject</label>
          <select name="subject" value={formData.subject} onChange={handleChange} className="w-full border p-1 rounded" required>
            <option value="">Select Subject</option>
            {subjects?.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Teacher</label>
          <select name="teacher" value={formData.teacher} onChange={handleChange} className="w-full border p-1 rounded" required>
            <option value="">Select Teacher</option>
            {teachers?.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label>Classroom</label>
          <input name="classroom" value={formData.classroom} onChange={handleChange} className="w-full border p-1 rounded" required />
        </div>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
        Add Lecture
      </button>
    </form>
  );
};

export default LectureForm;

