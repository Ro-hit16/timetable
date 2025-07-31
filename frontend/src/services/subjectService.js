// import api from './api';

// const subjectService = {
//   getAllSubjects: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return await api.get(`/subjects?${queryString}`);
//   },

//   getSubjectById: async (id) => {
//     return await api.get(`/subjects/${id}`);
//   },

//   createSubject: async (subjectData) => {
//     return await api.post('/subjects', subjectData);
//   },

//   updateSubject: async (id, subjectData) => {
//     return await api.put(`/subjects/${id}`, subjectData);
//   },

//   deleteSubject: async (id) => {
//     return await api.delete(`/subjects/${id}`);
//   },

//   getSubjectsByCourse: async (courseId) => {
//     return await api.get(`/subjects/course/${courseId}`);
//   },

//   getSubjectsBySemester: async (semesterId) => {
//     return await api.get(`/subjects/semester/${semesterId}`);
//   },

//   getSubjectsByDepartment: async (departmentId) => {
//     return await api.get(`/subjects/department/${departmentId}`);
//   },

//   assignTeacher: async (subjectId, teacherId) => {
//     return await api.post(`/subjects/${subjectId}/teachers`, { teacherId });
//   },

//   removeTeacher: async (subjectId, teacherId) => {
//     return await api.delete(`/subjects/${subjectId}/teachers/${teacherId}`);
//   }
// };

// export default subjectService;

// import api from './api';

// export const subjectService = {
//   // Get all subjects
//   getAllSubjects: async () => {
//     try {
//       const response = await api.get('/subjects');
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get subject by ID
//   getSubjectById: async (id) => {
//     try {
//       const response = await api.get(`/subjects/${id}`);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Create new subject
//   createSubject: async (subjectData) => {
//     try {
//       const response = await api.post('/subjects', subjectData);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update subject
//   updateSubject: async (id, subjectData) => {
//     try {
//       const response = await api.put(`/subjects/${id}`, subjectData);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Delete subject
//   deleteSubject: async (id) => {
//     try {
//       const response = await api.delete(`/subjects/${id}`);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get subjects by semester
//   getSubjectsBySemester: async (semesterId) => {
//     try {
//       const response = await api.get(`/subjects/semester/${semesterId}`);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get subjects by department
//   getSubjectsByDepartment: async (departmentId) => {
//     try {
//       const response = await api.get(`/subjects/department/${departmentId}`);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   }
// };

import api from './api';

class SubjectService {
  // Get all subjects with filters and pagination
  async getAllSubjects(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`/subjects?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  }

  // Get subject by ID
  async getSubjectById(id) {
    try {
      const response = await api.get(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subject:', error);
      throw error;
    }
  }

  // Create new subject
  async createSubject(subjectData) {
    try {
      const response = await api.post('/subjects', subjectData);
      return response.data;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  }

  // Update subject
  async updateSubject(id, subjectData) {
    try {
      const response = await api.put(`/subjects/${id}`, subjectData);
      return response.data;
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  }

  // Delete subject
  async deleteSubject(id) {
    try {
      const response = await api.delete(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }

  // Get subjects by department
  async getSubjectsByDepartment(departmentId) {
    try {
      const response = await api.get(`/subjects/department/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department subjects:', error);
      throw error;
    }
  }

  // Get subjects by semester
  async getSubjectsBySemester(semesterId) {
    try {
      const response = await api.get(`/subjects/semester/${semesterId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching semester subjects:', error);
      throw error;
    }
  }

  // Get subjects by teacher
  async getSubjectsByTeacher(teacherId) {
    try {
      const response = await api.get(`/subjects/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher subjects:', error);
      throw error;
    }
  }

  // Get subjects for select dropdown
  async getSubjectsForSelect() {
    try {
      const response = await api.get('/subjects/select');
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects for select:', error);
      throw error;
    }
  }

  // Get subject statistics
  async getSubjectStats() {
    try {
      const response = await api.get('/subjects/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching subject stats:', error);
      throw error;
    }
  }
}

export const subjectService = new SubjectService();
export default subjectService;