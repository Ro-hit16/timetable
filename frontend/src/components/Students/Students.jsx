// components/Students.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('You want to delete?')) {
      try {
        await axios.delete(`/api/students/${id}`);
        fetchStudents(); // Refresh list
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-red-100 px-4 py-3 border-b">
          <a 
            href="/admin/add-student"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Add New
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-2 py-2 text-left">Student Id</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Password</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Mobile</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Address</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Department</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Semester</th>
                <th className="border border-gray-300 px-2 py-2 text-left">D.O.B</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Pic</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Gender</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Update</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-2">{student.stu_id}</td>
                  <td className="border border-gray-300 px-2 py-2">{student.name}</td>
                  <td className="border border-gray-300 px-2 py-2">{student.eid}</td>
                  <td className="border border-gray-300 px-2 py-2">{student.password}</td>
                  <td className="border border-gray-300 px-2 py-2">{student.mob}</td>
                  <td className="border border-gray-300 px-2 py-2">{student.address}</td>
                  <td className="border border-gray-300 px-2 py-2">
                    {student.department_id?.department_name}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {student.sem_id?.semester_name}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {new Date(student.dob).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">{student.pic}</td>
                  <td className="border border-gray-300 px-2 py-2">{student.gender}</td>
                  <td className="border border-gray-300 px-2 py-2">{student.status}</td>
                  <td className="border border-gray-300 px-2 py-2">
                    <a 
                      href={`/admin/update-student/${student._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Update
                    </a>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <button 
                      onClick={() => handleDelete(student._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;