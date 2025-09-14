// import api from './api';

// const teacherService = {
//   getAllTeachers: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return await api.get(`/teachers?${queryString}`);
//   },

//   getTeacherById: async (id) => {
//     return await api.get(`/teachers/${id}`);
//   },

//   createTeacher: async (teacherData) => {
//     return await api.post('/teachers', teacherData);
//   },

//   updateTeacher: async (id, teacherData) => {
//     return await api.put(`/teachers/${id}`, teacherData);
//   },

//   deleteTeacher: async (id) => {
//     return await api.delete(`/teachers/${id}`);
//   },

//   getTeachersByDepartment: async (departmentId) => {
//     return await api.get(`/teachers/department/${departmentId}`);
//   },

//   getTeacherSchedule: async (teacherId) => {
//     return await api.get(`/teachers/${teacherId}/schedule`);
//   },

//   assignSubject: async (teacherId, subjectId) => {
//     return await api.post(`/teachers/${teacherId}/subjects`, { subjectId });
//   },

//   removeSubject: async (teacherId, subjectId) => {
//     return await api.delete(`/teachers/${teacherId}/subjects/${subjectId}`);
//   }
// };

// export default teacherService;


// import api from './api';

// const teacherService = {
//   getAllTeachers: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/teachers?${queryString}`);
//     return res.data; // ✅ Only return data
//   },

//   getTeacherById: async (id) => await api.get(`/teachers/${id}`),
//   createTeacher: async (teacherData) => await api.post('/teachers', teacherData),
//   updateTeacher: async (id, teacherData) => await api.put(`/teachers/${id}`, teacherData),
//   deleteTeacher: async (id) => await api.delete(`/teachers/${id}`),

//   getTeachersByDepartment: async (departmentId) => await api.get(`/teachers/department/${departmentId}`),
//   getTeacherSchedule: async (teacherId) => await api.get(`/teachers/${teacherId}/schedule`),

//   assignSubject: async (teacherId, subjectId) => await api.post(`/teachers/${teacherId}/subjects`, { subjectId }),
//   removeSubject: async (teacherId, subjectId) => await api.delete(`/teachers/${teacherId}/subjects/${subjectId}`)
// };

// export default teacherService;


// // teacherService.js
// import api from './api';

// const teacherService = {
//   getAllTeachers: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/teachers?${queryString}`);
//     return Array.isArray(res.data) ? res.data : res.data.teachers || [];
//   },

//   getTeacherById: async (id) => await api.get(`/teachers/${id}`),
//   createTeacher: async (teacherData) => await api.post('/teachers', teacherData),
//   updateTeacher: async (id, teacherData) => await api.put(`/teachers/${id}`, teacherData),
//   deleteTeacher: async (id) => await api.delete(`/teachers/${id}`),

//   getTeachersByDepartment: async (departmentId) => await api.get(`/teachers/department/${departmentId}`),
//   getTeacherSchedule: async (teacherId) => await api.get(`/teachers/${teacherId}/schedule`),

//   assignSubject: async (teacherId, subjectId) => await api.post(`/teachers/${teacherId}/subjects`, { subjectId }),
//   removeSubject: async (teacherId, subjectId) => await api.delete(`/teachers/${teacherId}/subjects/${subjectId}`)
// };

// export default teacherService;


//imp 
// services/teacherService.js
// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// class TeacherService {
//   // Get all teachers
//   async getAllTeachers() {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/teachers`);
//       return response.data.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch teachers');
//     }
//   }

//   // Get teacher by ID
//   async getTeacherById(id) {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/teachers/${id}`);
//       return response.data.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch teacher');
//     }
//   }

 
// async createTeacher(teacherData) {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/teachers`, teacherData);
//     return response.data.data;
//   } catch (error) {
//     console.error('TeacherService Error:', error.response?.data);
//     // Throw the actual error from backend
//     throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to create teacher');
//   }
// }

//   // Update teacher
//   async updateTeacher(id, teacherData) {
//     try {
//       const response = await axios.put(`${API_BASE_URL}/teachers/${id}`, teacherData);
//       return response.data.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to update teacher');
//     }
//   }

//   // Delete teacher
//   async deleteTeacher(id) {
//     try {
//       const response = await axios.delete(`${API_BASE_URL}/teachers/${id}`);
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to delete teacher');
//     }
//   }
// }

// export default new TeacherService();


// services/teacherService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class TeacherService {
  // Get all teachers
  async getAllTeachers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/teachers`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teachers');
    }
  }

  // Get teacher by ID
  async getTeacherById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/teachers/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teacher');
    }
  }

  // Create teacher
  async createTeacher(teacherData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/teachers`, teacherData);
      return response.data.data;
    } catch (error) {
      console.error('TeacherService Error:', error.response?.data);
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create teacher'
      );
    }
  }

  // Update teacher
  async updateTeacher(id, teacherData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/teachers/${id}`, teacherData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update teacher');
    }
  }

  // Delete teacher
  async deleteTeacher(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/teachers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete teacher');
    }
  }

  // ⭐ NEW: Upload teachers via PDF
  async uploadTeachersPdf(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/teachers/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload teachers from PDF');
    }
  }
}

export default new TeacherService();
