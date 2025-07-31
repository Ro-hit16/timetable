// src/pages/TimetableGenerator.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimetableGenerator = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [timetable, setTimetable] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/timetable/departments')
      .then(res => setDepartments(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedDept) {
      axios.get(`/api/timetable/semesters/${selectedDept}`)
        .then(res => setSemesters(res.data))
        .catch(console.error);
      setSelectedSem('');
      setSubjects([]);
      setTimetable(null);
    }
  }, [selectedDept]);

  useEffect(() => {
    if (selectedSem) {
      axios.get(`/api/timetable/subjects/${selectedSem}`)
        .then(res => setSubjects(res.data))
        .catch(console.error);
      setTimetable(null);
    }
  }, [selectedSem]);

  const handleGenerate = async () => {
    if (!selectedDept || !selectedSem) {
      setError('Please select department and semester');
      return;
    }
    setError('');
    try {
      const res = await axios.post('/api/timetable/generate', {
        departmentId: selectedDept,
        semesterId: selectedSem,
      });
      setTimetable(res.data.timetable);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate timetable');
    }
  };

  return (
    <div>
      <h2>Generate Time Table</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div>
        <label>Department</label>
        <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="form-control">
          <option value="">Select Department</option>
          {departments.map(d => (
            <option key={d._id} value={d._id}>{d.department_name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Semester</label>
        <select value={selectedSem} onChange={e => setSelectedSem(e.target.value)} className="form-control" disabled={!selectedDept}>
          <option value="">Select Semester</option>
          {semesters.map(s => (
            <option key={s._id} value={s._id}>{s.semester_name}</option>
          ))}
        </select>
      </div>

      {/* Subject dropdown is optional, as timetable generation typically uses all subjects */}
      {/* <div>
        <label>Subject</label>
        <select className="form-control" disabled={!selectedSem}>
          <option>Select Subject</option>
          {subjects.map(sub => (
            <option key={sub._id} value={sub._id}>{sub.subject_name}</option>
          ))}
        </select>
      </div> */}

      <button onClick={handleGenerate} className="btn btn-success mt-3">Generate Time Table</button>

      {timetable && (
        <div className="mt-4">
          <h3>Generated Timetable</h3>
          <table className="table table-bordered text-center">
            <thead className="table-danger">
              <tr>
                <th>Days/Lecture</th>
                <th>Lecture 1<br/>09:00-10:00</th>
                <th>Lecture 2<br/>10:00-11:00</th>
                <th>Lecture 3<br/>11:00-12:00</th>
                <th>Lecture 4<br/>12:00-01:00</th>
                <th>Break</th>
                <th>Lecture 5<br/>02:30-03:30</th>
                <th>Lecture 6<br/>03:30-04:30</th>
              </tr>
            </thead>
            <tbody>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => (
                <tr key={day}>
                  <th className="table-danger">{day}</th>
                  {timetable[i].map((slot, j) => {
                    if (slot.type === 'Lab') {
                      return <th key={j} colSpan={2} className="align-middle">{slot.subject_name}</th>;
                    } else if (slot.type === 'Break') {
                      return <th key={j} className="align-middle"><b>Break</b></th>;
                    }
                    return <th key={j} className="align-middle">{slot.subject_name}</th>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TimetableGenerator;
