// components/Courses.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('You want to delete?')) {
      try {
        await axios.delete(`/api/courses/${id}`);
        fetchCourses(); // Refresh list
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-red-100 px-4 py-3 border-b">
          <a 
            href="/admin/add-course"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Add New
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Id</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Update</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{course.department_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{course.department_name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <a 
                      href={`/admin/update-course/${course._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Update
                    </a>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button 
                      onClick={() => handleDelete(course._id)}
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

export default Courses;