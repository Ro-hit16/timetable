import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/students-with-details');
      setStudents(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("You want to delete ?")) {
      try {
        await axios.delete(`/api/students/${studentId}`);
        // Refresh the list after deletion
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        setError('Failed to delete student');
      }
    }
  };

  const handleUpdate = (studentId) => {
    // Navigate to update page or show update modal
    // This would typically use React Router
    window.location.href = `/admin/update-student/${studentId}`;
  };

  const handleAddNew = () => {
    // Navigate to add student page
    window.location.href = '/admin/add-student';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-details-container">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <table border="1" className="table table-striped">
        <thead>
          <tr className="danger" style={{ backgroundColor: '#FFCCCC' }}>
            <th colSpan="14">
              <button 
                className="btn btn-primary"
                onClick={handleAddNew}
              >
                Add New Student
              </button>
            </th>
          </tr>
          <tr>
            <th>Student Id</th>
            <th>Student Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>Department</th>
            <th>Semester</th>
            <th>D.O.B</th>
            <th>Pic</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="14" className="text-center">
                No students found
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.stu_id}>
                <td>{student.stu_id}</td>
                <td>{student.name}</td>
                <td>{student.eid}</td>
                <td>
                  {/* Don't show actual password for security */}
                  {'*'.repeat(student.password?.length || 8)}
                </td>
                <td>{student.mob}</td>
                <td>{student.address}</td>
                <td>{student.department_name}</td>
                <td>{student.semester_name}</td>
                <td>{student.dob}</td>
                <td>
                  {student.pic ? (
                    <img 
                      src={`/student/image/${student.eid}/${student.pic}`}
                      alt="Student"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>{student.gender === 'm' ? 'Male' : 'Female'}</td>
                <td>
                  <span 
                    className={`badge ${student.status === 'ON' ? 'badge-success' : 'badge-secondary'}`}
                  >
                    {student.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleUpdate(student.stu_id)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(student.stu_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDetails;