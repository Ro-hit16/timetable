import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  UserIcon,
  BookOpenIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-10">

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Academic Setup
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">Add Subject</h1>
        </div>

        {message && (
          <div className="mb-5 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <BuildingOffice2Icon className="h-3.5 w-3.5" /> Department
              </label>
              <select
                name="department_id"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                onChange={handleDepartmentChange}
                required
                defaultValue=""
              >
                <option value="" disabled>Select Department</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <AcademicCapIcon className="h-3.5 w-3.5" /> Semester
              </label>
              <select
                name="sem_id"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                onChange={handleChange}
                required
                defaultValue=""
              >
                <option value="" disabled>Select Semester</option>
                {semesters.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <UserIcon className="h-3.5 w-3.5" /> Teacher
              </label>
              <select
                name="teacher_id"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                onChange={handleChange}
                required
                defaultValue=""
              >
                <option value="" disabled>Select Teacher</option>
                {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <BookOpenIcon className="h-3.5 w-3.5" /> Subject Name
              </label>
              <input
                type="text"
                name="subject_name"
                placeholder="Subject Name"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <ClockIcon className="h-3.5 w-3.5" /> Lectures Per Week
              </label>
              <input
                type="number"
                name="lecture_per_week"
                placeholder="Lecture/Week"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-600">Type</label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium cursor-pointer transition ${form.type === 'Theory'
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}>
                  <input
                    type="radio"
                    name="type"
                    value="Theory"
                    checked={form.type === 'Theory'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  Theory
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium cursor-pointer transition ${form.type === 'Lab'
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}>
                  <input
                    type="radio"
                    name="type"
                    value="Lab"
                    checked={form.type === 'Lab'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  Lab
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
            >
              Add Subject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubject;