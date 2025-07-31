// import api from './api';

// const studentService = {
//   getAllStudents: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return await api.get(`/students?${queryString}`);
//   },

//   getStudentById: async (id) => {
//     return await api.get(`/students/${id}`);
//   },

//   createStudent: async (studentData) => {
//     return await api.post('/students', studentData);
//   },

//   updateStudent: async (id, studentData) => {
//     return await api.put(`/students/${id}`, studentData);
//   },

//   deleteStudent: async (id) => {
//     return await api.delete(`/students/${id}`);
//   },

//   getStudentsByDepartment: async (departmentId) => {
//     return await api.get(`/students/department/${departmentId}`);
//   },

//   getStudentsBySemester: async (semesterId) => {
//     return await api.get(`/students/semester/${semesterId}`);
//   },

//   bulkUploadStudents: async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return await api.post('/students/bulk-upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   },

//   exportStudents: async (format = 'csv') => {
//     return await api.get(`/students/export?format=${format}`, {
//       responseType: 'blob',
//     });
//   }
// };

// export default studentService;

// import api from './api';

// const studentService = {
//   getAllStudents: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/students?${queryString}`);
//     return res.data; // ✅ Only return data
//   },

//   getStudentById: async (id) => await api.get(`/students/${id}`),
//   createStudent: async (studentData) => await api.post('/students', studentData),
//   updateStudent: async (id, studentData) => await api.put(`/students/${id}`, studentData),
//   deleteStudent: async (id) => await api.delete(`/students/${id}`),

//   getStudentsByDepartment: async (departmentId) => await api.get(`/students/department/${departmentId}`),
//   getStudentsBySemester: async (semesterId) => await api.get(`/students/semester/${semesterId}`),

//   bulkUploadStudents: async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return await api.post('/students/bulk-upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },

//   exportStudents: async (format = 'csv') => {
//     return await api.get(`/students/export?format=${format}`, { responseType: 'blob' });
//   }
// };

// export default studentService;



// // studentService.js
// import api from './api';

// const studentService = {
//   getAllStudents: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/students?${queryString}`);
//     return Array.isArray(res.data) ? res.data : res.data.students || [];
//   },

//   getStudentById: async (id) => await api.get(`/students/${id}`),
//   createStudent: async (studentData) => await api.post('/students', studentData),
//   updateStudent: async (id, studentData) => await api.put(`/students/${id}`, studentData),
//   deleteStudent: async (id) => await api.delete(`/students/${id}`),

//   getStudentsByDepartment: async (departmentId) => await api.get(`/students/department/${departmentId}`),
//   getStudentsBySemester: async (semesterId) => await api.get(`/students/semester/${semesterId}`),

//   bulkUploadStudents: async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return await api.post('/students/bulk-upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },

//   exportStudents: async (format = 'csv') => {
//     return await api.get(`/students/export?format=${format}`, { responseType: 'blob' });
//   }
// };

// export default studentService;

// services/studentService.js
// import api from './api';

// const studentService = {
//   getAllStudents: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/students?${queryString}`);
//     return res.data; // { students, total, totalPages }
//   },

//   getStudentById: async (id) => await api.get(`/students/${id}`),

//   createStudent: async (studentData) => await api.post('/students', studentData),

//   updateStudent: async (id, studentData) => await api.put(`/students/${id}`, studentData),

//   deleteStudent: async (id) => await api.delete(`/students/${id}`),

//   getStudentsByDepartment: async (departmentId) => await api.get(`/students/department/${departmentId}`),

//   getStudentsBySemester: async (semesterId) => await api.get(`/students/semester/${semesterId}`),

//   bulkUploadStudents: async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return await api.post('/students/bulk-upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },

//   exportStudents: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return await api.get(`/students/export?${queryString}`, { responseType: 'blob' });
//   }
// };

// export default studentService;


import api from './api';

const studentService = {
  // Get all students with pagination and filters
  getAllStudents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/students?${queryString}`);
    return response.data;
  },

  // Get single student by ID
  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Create new student
  createStudent: async (studentData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(studentData).forEach(key => {
      if (studentData[key] !== null && studentData[key] !== undefined) {
        formData.append(key, studentData[key]);
      }
    });

    const response = await api.post('/students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update student
  updateStudent: async (id, studentData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(studentData).forEach(key => {
      if (studentData[key] !== null && studentData[key] !== undefined) {
        formData.append(key, studentData[key]);
      }
    });

    const response = await api.put(`/students/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete student
  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Get students by department
  getStudentsByDepartment: async (departmentId) => {
    const response = await api.get(`/students/department/${departmentId}`);
    return response.data;
  },

  // Get students by semester
  getStudentsBySemester: async (semesterId) => {
    const response = await api.get(`/students/semester/${semesterId}`);
    return response.data;
  },

  // Export students to CSV
  exportStudents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/students/export?${queryString}`, { 
      responseType: 'blob' 
    });
    return response;
  }
};

export default studentService;
