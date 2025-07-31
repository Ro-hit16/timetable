import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSubject = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    subject_name: '',
    sem_id: '',
    department_id: '',
    teacher_id: '',
    lecture_per_week: '',
    type: 'Theory',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/departments').then(res => setDepartments(res.data));
  }, []);

  const handleDepartmentChange = async (e) => {
    const department_id = e.target.value;
    setForm({ ...form, department_id });

    const semRes = await axios.get(`/api/semesters/by-department/${department_id}`);
    const teachRes = await axios.get(`/api/teachers/by-department/${department_id}`);
    setSemesters(semRes.data);
    setTeachers(teachRes.data);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/subjects/add', form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Subject</h2>
      {message && <p className="alert alert-info">{message}</p>}
      <form onSubmit={handleSubmit}>
        <select name="department_id" className="form-control mb-3" onChange={handleDepartmentChange} required>
          <option disabled selected>Select Department</option>
          {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>

        <select name="sem_id" className="form-control mb-3" onChange={handleChange} required>
          <option disabled selected>Select Semester</option>
          {semesters.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        <select name="teacher_id" className="form-control mb-3" onChange={handleChange} required>
          <option disabled selected>Select Teacher</option>
          {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>

        <input type="text" name="subject_name" placeholder="Subject Name" className="form-control mb-3" onChange={handleChange} required />
        <input type="number" name="lecture_per_week" placeholder="Lecture/Week" className="form-control mb-3" onChange={handleChange} required />

        <div className="form-check mb-2">
          <input className="form-check-input" type="radio" name="type" value="Theory" checked={form.type === 'Theory'} onChange={handleChange} />
          <label className="form-check-label">Theory</label>
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="radio" name="type" value="Lab" checked={form.type === 'Lab'} onChange={handleChange} />
          <label className="form-check-label">Lab</label>
        </div>

        <button type="submit" className="btn btn-success">Add Subject</button>
      </form>
    </div>
  );
};

export default AddSubject;
