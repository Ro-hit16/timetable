// import api from './api';

// const courseService = {
//   getAllCourses: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return await api.get(`/courses?${queryString}`);
//   },

//   getCourseById: async (id) => {
//     return await api.get(`/courses/${id}`);
//   },

//   createCourse: async (courseData) => {
//     return await api.post('/courses', courseData);
//   },

//   updateCourse: async (id, courseData) => {
//     return await api.put(`/courses/${id}`, courseData);
//   },

//   deleteCourse: async (id) => {
//     return await api.delete(`/courses/${id}`);
//   },

//   getCoursesByDepartment: async (departmentId) => {
//     return await api.get(`/courses/department/${departmentId}`);
//   },

//   getCourseSubjects: async (courseId) => {
//     return await api.get(`/courses/${courseId}/subjects`);
//   },

//   addSubjectToCourse: async (courseId, subjectId) => {
//     return await api.post(`/courses/${courseId}/subjects`, { subjectId });
//   },

//   removeSubjectFromCourse: async (courseId, subjectId) => {
//     return await api.delete(`/courses/${courseId}/subjects/${subjectId}`);
//   }
// };

// export default courseService;


// import api from './api';

// const courseService = {
//   getAllCourses: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return api.get(`/courses?${queryString}`);
//   },

//   getCourseById: (id) => api.get(`/courses/${id}`),

//   createCourse: (courseData) => api.post('/courses', courseData),

//   updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),

//   deleteCourse: (id) => api.delete(`/courses/${id}`),

//   getCoursesByDepartment: (departmentId) => api.get(`/courses/department/${departmentId}`),

//   getCourseSubjects: (courseId) => api.get(`/courses/${courseId}/subjects`),

//   addSubjectToCourse: (courseId, subjectId) =>
//     api.post(`/courses/${courseId}/subjects`, { subjectId }),

//   removeSubjectFromCourse: (courseId, subjectId) =>
//     api.delete(`/courses/${courseId}/subjects/${subjectId}`)
// };

// export default courseService;



// import api from './api';

// const courseService = {
//   getAllCourses: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/courses?${queryString}`);
//     return res.data; // ✅ Only return data
//   },

//   getCourseById: (id) => api.get(`/courses/${id}`),
//   createCourse: (courseData) => api.post('/courses', courseData),
//   updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
//   deleteCourse: (id) => api.delete(`/courses/${id}`),

//   getCoursesByDepartment: (departmentId) => api.get(`/courses/department/${departmentId}`),
//   getCourseSubjects: (courseId) => api.get(`/courses/${courseId}/subjects`),
//   addSubjectToCourse: (courseId, subjectId) => api.post(`/courses/${courseId}/subjects`, { subjectId }),
//   removeSubjectFromCourse: (courseId, subjectId) => api.delete(`/courses/${courseId}/subjects/${subjectId}`)
// };

// export default courseService;


// import api from './api';

// const courseService = {
//   getAllCourses: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/courses?${queryString}`);
//     return res.data;
//   },

//   getCourseById: async (id) => {
//     const res = await api.get(`/courses/${id}`);
//     return res.data;
//   },

//   createCourse: async (courseData) => {
//     const res = await api.post('/courses', courseData);
//     return res.data;
//   },

//   updateCourse: async (id, courseData) => {
//     const res = await api.put(`/courses/${id}`, courseData);
//     return res.data;
//   },

//   deleteCourse: async (id) => {
//     const res = await api.delete(`/courses/${id}`);
//     return res.data;
//   },

//   getCoursesByDepartment: async (departmentId) => {
//     const res = await api.get(`/courses/department/${departmentId}`);
//     return res.data;
//   },

//   getCourseSubjects: async (courseId) => {
//     const res = await api.get(`/courses/${courseId}/subjects`);
//     return res.data;
//   },

//   addSubjectToCourse: async (courseId, subjectId) => {
//     const res = await api.post(`/courses/${courseId}/subjects`, { subjectId });
//     return res.data;
//   },

//   removeSubjectFromCourse: async (courseId, subjectId) => {
//     const res = await api.delete(`/courses/${courseId}/subjects/${subjectId}`);
//     return res.data;
//   },
// };

// export default courseService;


// import api from './api';

// const courseService = {
//   // Get all courses (with optional query params)
//   getAllCourses: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/courses${queryString ? `?${queryString}` : ''}`);
//     return res.data;
//   },

//   // Get course by ID
//   getCourseById: async (id) => {
//     const res = await api.get(`/courses/${id}`);
//     return res.data;
//   },

//   // Create new course
//   createCourse: async (courseData) => {
//     const res = await api.post('/courses', courseData);
//     return res.data;
//   },

//   // Update course by ID
//   updateCourse: async (id, courseData) => {
//     const res = await api.put(`/courses/${id}`, courseData);
//     return res.data;
//   },

//   // Delete course by ID
//   deleteCourse: async (id) => {
//     const res = await api.delete(`/courses/${id}`);
//     return res.data;
//   },

//   // Get courses by department
//   getCoursesByDepartment: async (departmentId) => {
//     const res = await api.get(`/courses/department/${departmentId}`);
//     return res.data;
//   },

//   // Get all subjects for a course
//   getCourseSubjects: async (courseId) => {
//     const res = await api.get(`/courses/${courseId}/subjects`);
//     return res.data;
//   },

//   // Add a subject to a course
//   addSubjectToCourse: async (courseId, subjectId) => {
//     const res = await api.post(`/courses/${courseId}/subjects`, { subjectId });
//     return res.data;
//   },

//   // Remove a subject from a course
//   removeSubjectFromCourse: async (courseId, subjectId) => {
//     const res = await api.delete(`/courses/${courseId}/subjects/${subjectId}`);
//     return res.data;
//   }
// };

// export default courseService;

// import api from './api';

// const courseService = {
//   getAllCourses: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/courses${queryString ? `?${queryString}` : ''}`);
//     return res.data;
//   },

//   getCourseById: async (id) => {
//     const res = await api.get(`/courses/${id}`);
//     return res.data;
//   },

//   createCourse: async (courseData) => {
//     const res = await api.post('/courses', courseData);
//     return res.data;
//   },

//   updateCourse: async (id, courseData) => {
//     const res = await api.put(`/courses/${id}`, courseData);
//     return res.data;
//   },

//   deleteCourse: async (id) => {
//     const res = await api.delete(`/courses/${id}`);
//     return res.data;
//   },

//   getCoursesByDepartment: async (departmentId) => {
//     const res = await api.get(`/courses/department/${departmentId}`);
//     return res.data;
//   },

//   getCourseSubjects: async (courseId) => {
//     const res = await api.get(`/courses/${courseId}/subjects`);
//     return res.data;
//   },

//   addSubjectToCourse: async (courseId, subjectId) => {
//     const res = await api.post(`/courses/${courseId}/subjects`, { subjectId });
//     return res.data;
//   },

//   removeSubjectFromCourse: async (courseId, subjectId) => {
//     const res = await api.delete(`/courses/${courseId}/subjects/${subjectId}`);
//     return res.data;
//   }
// };

// export default courseService;


// import api from './api';

// const courseService = {
//   getAllCourses: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/courses${queryString ? `?${queryString}` : ''}`);
//     return Array.isArray(res.data) ? res.data : res.data.courses || [];
//   },

//   getCourseById: async (id) => {
//     const res = await api.get(`/courses/${id}`);
//     return res.data;
//   },

//   createCourse: async (courseData) => {
//     const res = await api.post('/courses', courseData);
//     return res.data;
//   },

//   updateCourse: async (id, courseData) => {
//     const res = await api.put(`/courses/${id}`, courseData);
//     return res.data;
//   },

//   deleteCourse: async (id) => {
//     const res = await api.delete(`/courses/${id}`);
//     return res.data;
//   },

//   getCoursesByDepartment: async (departmentId) => {
//     const res = await api.get(`/courses/department/${departmentId}`);
//     return Array.isArray(res.data) ? res.data : res.data.courses || [];
//   },

//   getCourseSubjects: async (courseId) => {
//     const res = await api.get(`/courses/${courseId}/subjects`);
//     return Array.isArray(res.data) ? res.data : res.data.subjects || [];
//   },

//   addSubjectToCourse: async (courseId, subjectId) => {
//     const res = await api.post(`/courses/${courseId}/subjects`, { subjectId });
//     return res.data;
//   },

//   removeSubjectFromCourse: async (courseId, subjectId) => {
//     const res = await api.delete(`/courses/${courseId}/subjects/${subjectId}`);
//     return res.data;
//   }
// };

// export default courseService;



import api from './api';

const courseService = {
  // Get all courses with optional filtering and pagination
  getAllCourses: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/courses${queryString ? `?${queryString}` : ''}`);
      
      // Handle different response structures
      if (response.data?.courses) {
        return response.data.courses;
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get single course by ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data?.course || response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Create new course
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update existing course
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete course (soft delete)
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // Get courses by department
  getCoursesByDepartment: async (departmentId) => {
    try {
      const response = await api.get(`/courses/department/${departmentId}`);
      return Array.isArray(response.data) ? response.data : response.data?.courses || [];
    } catch (error) {
      console.error('Error fetching department courses:', error);
      throw error;
    }
  },

  // Get course statistics
  getCourseStats: async () => {
    try {
      const response = await api.get('/courses/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching course stats:', error);
      throw error;
    }
  },

  // Search courses
  searchCourses: async (searchTerm) => {
    try {
      const response = await api.get(`/courses?search=${encodeURIComponent(searchTerm)}`);
      return Array.isArray(response.data) ? response.data : response.data?.courses || [];
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  },

  // Get courses by semester
  getCoursesBySemester: async (semesterId) => {
    try {
      const response = await api.get(`/courses?semester_id=${semesterId}`);
      return Array.isArray(response.data) ? response.data : response.data?.courses || [];
    } catch (error) {
      console.error('Error fetching semester courses:', error);
      throw error;
    }
  },

  // Get courses by type
  getCoursesByType: async (courseType) => {
    try {
      const response = await api.get(`/courses?course_type=${courseType}`);
      return Array.isArray(response.data) ? response.data : response.data?.courses || [];
    } catch (error) {
      console.error('Error fetching courses by type:', error);
      throw error;
    }
  }
};

export default courseService;