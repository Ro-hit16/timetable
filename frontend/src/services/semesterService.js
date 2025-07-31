// import api from './api';

// const semesterService = {
//   getAllSemesters: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return await api.get(`/semesters?${queryString}`);
//   },

//   getSemesterById: async (id) => {
//     return await api.get(`/semesters/${id}`);
//   },

//   createSemester: async (semesterData) => {
//     return await api.post('/semesters', semesterData);
//   },

//   updateSemester: async (id, semesterData) => {
//     return await api.put(`/semesters/${id}`, semesterData);
//   },

//   deleteSemester: async (id) => {
//     return await api.delete(`/semesters/${id}`);
//   },

//   getSemestersByCourse: async (courseId) => {
//     return await api.get(`/semesters/course/${courseId}`);
//   },

//   getSemestersByDepartment: async (departmentId) => {
//     return await api.get(`/semesters/department/${departmentId}`);
//   },

//   getActiveSemesters: async () => {
//     return await api.get('/semesters/active');
//   },

//   setSemesterStatus: async (id, status) => {
//     return await api.patch(`/semesters/${id}/status`, { status });
//   }
// };

// export default semesterService;

// import api from './api';

// export const semesterService = {
//   // Get all semesters
//   getAllSemesters: async () => {
//     try {
//       const response = await api.get('/semesters');
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get semester by ID
//   getSemesterById: async (id) => {
//     try {
//       const response = await api.get(`/semesters/${id}`);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Create new semester
//   createSemester: async (semesterData) => {
//     try {
//       const response = await api.post('/semesters', semesterData);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update semester
//   updateSemester: async (id, semesterData) => {
//     try {
//       const response = await api.put(`/semesters/${id}`, semesterData);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Delete semester
//   deleteSemester: async (id) => {
//     try {
//       const response = await api.delete(`/semesters/${id}`);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get semesters by department
//   getSemestersByDepartment: async (departmentId) => {
//     try {
//       const response = await api.get(`/semesters/department/${departmentId}`);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   }
// };



// import api from './api';

// export const semesterService = {
//   getAllSemesters: () => api.get('/semesters'),

//   getSemesterById: (id) => api.get(`/semesters/${id}`),

//   createSemester: (semesterData) => api.post('/semesters', semesterData),

//   updateSemester: (id, semesterData) => api.put(`/semesters/${id}`, semesterData),

//   deleteSemester: (id) => api.delete(`/semesters/${id}`),

//   getSemestersByDepartment: (departmentId) =>
//     api.get(`/semesters/department/${departmentId}`)
// };


// import api from './api';

// export const semesterService = {
//   getAllSemesters: async () => await api.get('/semesters'),

//   getSemesterById: async (id) => await api.get(`/semesters/${id}`),

//   createSemester: async (semesterData) => await api.post('/semesters', semesterData),

//   updateSemester: async (id, semesterData) => await api.put(`/semesters/${id}`, semesterData),

//   deleteSemester: async (id) => await api.delete(`/semesters/${id}`),

//   getSemestersByDepartment: async (departmentId) =>
//     await api.get(`/semesters/department/${departmentId}`)
// };


// services/semesterService.js

// import api from './api';

// export const semesterService = {
//   // Get all semesters with optional pagination/filter support
//   getAllSemesters: async (params = {}) => {
//     return await api.get('/semesters', { params });
//   },

//   // Get a single semester by its ID
//   getSemesterById: async (id) => {
//     return await api.get(`/semesters/${id}`);
//   },

//   // Create a new semester
//   createSemester: async (semesterData) => {
//     return await api.post('/semesters', semesterData);
//   },

//   // Update an existing semester
//   updateSemester: async (id, semesterData) => {
//     return await api.put(`/semesters/${id}`, semesterData);
//   },

//   // Soft delete a semester
//   deleteSemester: async (id) => {
//     return await api.delete(`/semesters/${id}`);
//   },

//   // Get semesters by department ID
//   getSemestersByDepartment: async (departmentId) => {
//     return await api.get(`/semesters/department/${departmentId}`);
//   },

//   // Get all active semesters (without filters)
//   getActiveSemesters: async () => {
//     return await api.get('/semesters/active');
//   },

 
//   getAllSemesters: async () => {
//     return await api.get('/semesters'); // Adjust endpoint if needed
//   }

// };


// import api from './api';

// export const semesterService = {
//   // Get all semesters with optional pagination/filter support
//   getAllSemesters: async (params = {}) => {
//     return await api.get('/semesters', { params });
//   },

//   // Get a single semester by its ID
//   getSemesterById: async (id) => {
//     return await api.get(`/semesters/${id}`);
//   },

//   // Create a new semester
//   createSemester: async (semesterData) => {
//     return await api.post('/semesters', semesterData);
//   },

//   // Update an existing semester
//   updateSemester: async (id, semesterData) => {
//     return await api.put(`/semesters/${id}`, semesterData);
//   },

//   // Soft delete a semester
//   deleteSemester: async (id) => {
//     return await api.delete(`/semesters/${id}`);
//   },

//   // Get semesters by department ID
//   getSemestersByDepartment: async (departmentId) => {
//     return await api.get(`/semesters/department/${departmentId}`);
//   },

//   // Get all active semesters (without filters)
//   getActiveSemesters: async () => {
//     return await api.get('/semesters/active');
//   }
// };


// import api from './api';

// export const semesterService = {
//   getAllSemesters: async (params = {}) => {
//     const res = await api.get('/semesters', { params });
//     return res.data;
//   },

 

//   getSemesterById: async (id) => {
//     const res = await api.get(`/semesters/${id}`);
//     return res.data;
//   },

//   createSemester: async (semesterData) => {
//     const res = await api.post('/semesters', semesterData);
//     return res.data;
//   },

//   updateSemester: async (id, semesterData) => {
//     const res = await api.put(`/semesters/${id}`, semesterData);
//     return res.data;
//   },

//   deleteSemester: async (id) => {
//     const res = await api.delete(`/semesters/${id}`);
//     return res.data;
//   },

//   getSemestersByDepartment: async (departmentId) => {
//     const res = await api.get(`/semesters/department/${departmentId}`);
//     return res.data;
//   },

//   getActiveSemesters: async () => {
//     const res = await api.get('/semesters/active');
//     return res.data;
//   }
// };


// // semesterService.js
// import api from './api';

// export const semesterService = {
//   getAllSemesters: async (params = {}) => {
//     const res = await api.get('/semesters', { params });
//     return Array.isArray(res.data) ? res.data : res.data.semesters || [];
//   },

//   getSemesterById: async (id) => {
//     const res = await api.get(`/semesters/${id}`);
//     return res.data;
//   },

//   createSemester: async (semesterData) => {
//     const res = await api.post('/semesters', semesterData);
//     return res.data;
//   },

//   updateSemester: async (id, semesterData) => {
//     const res = await api.put(`/semesters/${id}`, semesterData);
//     return res.data;
//   },

//   deleteSemester: async (id) => {
//     const res = await api.delete(`/semesters/${id}`);
//     return res.data;
//   },

//   getSemestersByDepartment: async (departmentId) => {
//     const res = await api.get(`/semesters/department/${departmentId}`);
//     return Array.isArray(res.data) ? res.data : res.data.semesters || [];
//   },

//   getActiveSemesters: async () => {
//     const res = await api.get('/semesters/active');
//     return Array.isArray(res.data) ? res.data : res.data.semesters || [];
//   }
// };



// // semesterService.js
import api from './api';

export const semesterService = {
  getAllSemesters: async (params = {}) => {
    try {
      const res = await api.get('/semesters', { params });
      return res.data;
    } catch (error) {
      console.error('Error fetching semesters:', error);
      throw error;
    }
  },

  getSemesterById: async (id) => {
    try {
      const res = await api.get(`/semesters/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching semester:', error);
      throw error;
    }
  },

  createSemester: async (semesterData) => {
    try {
      const res = await api.post('/semesters', semesterData);
      return res.data;
    } catch (error) {
      console.error('Error creating semester:', error);
      throw error;
    }
  },

  updateSemester: async (id, semesterData) => {
    try {
      const res = await api.put(`/semesters/${id}`, semesterData);
      return res.data;
    } catch (error) {
      console.error('Error updating semester:', error);
      throw error;
    }
  },

  deleteSemester: async (id) => {
    try {
      const res = await api.delete(`/semesters/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error deleting semester:', error);
      throw error;
    }
  },

  getSemestersByDepartment: async (departmentId) => {
    try {
      const res = await api.get(`/semesters/department/${departmentId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching department semesters:', error);
      throw error;
    }
  },

  getActiveSemesters: async () => {
    try {
      const res = await api.get('/semesters/active');
      return res.data;
    } catch (error) {
      console.error('Error fetching active semesters:', error);
      throw error;
    }
  },

  getSemesterStats: async () => {
    try {
      const res = await api.get('/semesters/stats');
      return res.data;
    } catch (error) {
      console.error('Error fetching semester stats:', error);
      throw error;
    }
  }
};


