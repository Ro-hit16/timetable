import { useEffect, useState } from 'react';
import axios from 'axios';

const SemesterForm = () => {
  const [departments, setDepartments] = useState([]);
  const [semesterName, setSemesterName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/departments')
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/semesters', {
        semester_name: semesterName,
        department_id: departmentId,
      });
      setMessage(res.data.message);
      setSemesterName('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <p>{message}</p>}
      <div>
        <label>Department</label>
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.department_name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Semester Name</label>
        <input
          type="text"
          value={semesterName}
          onChange={(e) => setSemesterName(e.target.value)}
          required
        />
      </div>

      <button type="submit">Add Semester</button>
    </form>
  );
};

export default SemesterForm;
