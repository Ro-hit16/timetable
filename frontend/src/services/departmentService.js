// import api from './api';

// const departmentService = {
//   getAllDepartments: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return await api.get(`/departments?${queryString}`);
//   },

//   getDepartmentById: async (id) => {
//     return await api.get(`/departments/${id}`);
//   },

//   createDepartment: async (departmentData) => {
//     return await api.post('/departments', departmentData);
//   },

//   updateDepartment: async (id, departmentData) => {
//     return await api.put(`/departments/${id}`, departmentData);
//   },

//   deleteDepartment: async (id) => {
//     return await api.delete(`/departments/${id}`);
//   },

//   getDepartmentStats: async (id) => {
//     return await api.get(`/departments/${id}/stats`);
//   },

//   getActiveDepartments: async () => {
//     return await api.get('/departments/active');
//   }
// };

// export default departmentService;

// import api from './api';

// const departmentService = {
//   getAllDepartments: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/departments?${queryString}`);
//     console.log("TEST_1: Calling /departments with params", params);
//     return res.data; // ✅ Only return data
//   },

//   getDepartmentById: async (id) => await api.get(`/departments/${id}`),
//   createDepartment: async (departmentData) => await api.post('/departments', departmentData),
//   updateDepartment: async (id, departmentData) => await api.put(`/departments/${id}`, departmentData),
//   deleteDepartment: async (id) => await api.delete(`/departments/${id}`),

//   getDepartmentStats: async (id) => await api.get(`/departments/${id}/stats`),
//   getActiveDepartments: async () => await api.get('/departments/active')
// };

// export default departmentService;


// import api from './api';

// const departmentService = {
//   getAllDepartments: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/departments${queryString ? `?${queryString}` : ''}`);
//     return res.data;  // return only data for consistency
//   },

//   getDepartmentById: async (id) => {
//     const res = await api.get(`/departments/${id}`);
//     return res.data;
//   },

//   createDepartment: async (departmentData) => {
//     const res = await api.post('/departments', departmentData);
//     return res.data;
//   },

//   updateDepartment: async (id, departmentData) => {
//     const res = await api.put(`/departments/${id}`, departmentData);
//     return res.data;
//   },

//   deleteDepartment: async (id) => {
//     const res = await api.delete(`/departments/${id}`);
//     return res.data;
//   },

//   getDepartmentStats: async (id) => {
//     const res = await api.get(`/departments/${id}/stats`);
//     return res.data;
//   },

//   getActiveDepartments: async () => {
//     const res = await api.get('/departments/active');
//     return res.data;
//   }
// };

// export default departmentService;


// // src/services/departmentService.js
// import api from './api';

// const departmentService = {
//   getAllDepartments: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/departments${queryString ? `?${queryString}` : ''}`);
//     // Ensure we always return an array
//     return Array.isArray(res.data) ? res.data : res.data.departments || [];
//   },

//   getDepartmentById: async (id) => {
//     const res = await api.get(`/departments/${id}`);
//     return res.data;
//   },

//   createDepartment: async (departmentData) => {
//     const res = await api.post('/departments', departmentData);
//     return res.data;
//   },

//   updateDepartment: async (id, departmentData) => {
//     const res = await api.put(`/departments/${id}`, departmentData);
//     return res.data;
//   },

//   deleteDepartment: async (id) => {
//     const res = await api.delete(`/departments/${id}`);
//     return res.data;
//   },

//   getDepartmentStats: async (id) => {
//     const res = await api.get(`/departments/${id}/stats`);
//     return res.data;
//   },

//   getActiveDepartments: async () => {
//     const res = await api.get('/departments/active');
//     return Array.isArray(res.data) ? res.data : res.data.departments || [];
//   }
// };

// export default departmentService;



// // departmentService.js
// import api from './api';

// const departmentService = {
//   getAllDepartments: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/departments${queryString ? `?${queryString}` : ''}`);
//     return Array.isArray(res.data) ? res.data : res.data.departments || [];
//   },

//   getDepartmentById: async (id) => {
//     const res = await api.get(`/departments/${id}`);
//     return res.data;
//   },

//   createDepartment: async (departmentData) => {
//     const res = await api.post('/departments', departmentData);
//     return res.data;
//   },

//   updateDepartment: async (id, departmentData) => {
//     const res = await api.put(`/departments/${id}`, departmentData);
//     return res.data;
//   },

//   deleteDepartment: async (id) => {
//     const res = await api.delete(`/departments/${id}`);
//     return res.data;
//   },

//   getDepartmentStats: async (id) => {
//     const res = await api.get(`/departments/${id}/stats`);
//     return res.data;
//   },

//   getActiveDepartments: async () => {
//     const res = await api.get('/departments/active');
//     return Array.isArray(res.data) ? res.data : res.data.departments || [];
//   }
// };

// export default departmentService;


// services/departmentService.js
import api from './api';

const departmentService = {
  // Get all departments with filters, pagination, and search
  getAllDepartments: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/departments${queryString ? `?${queryString}` : ''}`;
      const response = await api.get(url);
      
      if (response.data && response.data.departments) {
        return response.data;
      } else if (Array.isArray(response.data)) {
        return { departments: response.data, pagination: {} };
      } else {
        return { departments: [], pagination: {} };
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getDepartmentById: async (id) => {
    try {
      if (!id) throw new Error('Department ID is required');
      const response = await api.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department by ID:', error);
      throw error;
    }
  },

  createDepartment: async (departmentData) => {
    try {
      if (!departmentData.departmentName || !departmentData.departmentCode) {
        throw new Error('Department name and code are required');
      }

      const cleanData = {
        departmentName: departmentData.departmentName.trim(),
        departmentCode: departmentData.departmentCode.trim().toUpperCase(),
        description: departmentData.description?.trim() || '',
        establishedYear: departmentData.establishedYear ? parseInt(departmentData.establishedYear) : undefined,
        contactEmail: departmentData.contactEmail?.trim().toLowerCase() || '',
        contactPhone: departmentData.contactPhone?.replace(/\D/g, '') || '',
        website: departmentData.website?.trim() || ''
      };

      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === '' || cleanData[key] === undefined) {
          delete cleanData[key];
        }
      });

      const response = await api.post('/departments', cleanData);
      return response.data;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  },

  updateDepartment: async (id, departmentData) => {
    try {
      if (!id) throw new Error('Department ID is required');

      const cleanData = {
        ...departmentData,
        departmentName: departmentData.departmentName?.trim(),
        departmentCode: departmentData.departmentCode?.trim().toUpperCase(),
        description: departmentData.description?.trim(),
        establishedYear: departmentData.establishedYear ? parseInt(departmentData.establishedYear) : undefined,
        contactEmail: departmentData.contactEmail?.trim().toLowerCase(),
        contactPhone: departmentData.contactPhone?.replace(/\D/g, ''),
        website: departmentData.website?.trim()
      };

      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === undefined) {
          delete cleanData[key];
        }
      });

      const response = await api.put(`/departments/${id}`, cleanData);
      return response.data;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  },

  deleteDepartment: async (id) => {
    try {
      if (!id) throw new Error('Department ID is required');
      const response = await api.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  },

  getActiveDepartments: async (options = {}) => {
    try {
      const params = {
        isActive: 'true',
        sortBy: 'departmentName',
        sortOrder: 'asc',
        ...options
      };

      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/departments/active${queryString ? `?${queryString}` : ''}`);
      return Array.isArray(response.data) ? response.data : response.data.departments || [];
    } catch (error) {
      console.error('Error fetching active departments:', error);
      throw error;
    }
  },

  getDepartmentStats: async () => {
    try {
      const response = await api.get('/departments/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching department stats:', error);
      throw error;
    }
  },

  searchDepartments: async (searchTerm, options = {}) => {
    try {
      const params = {
        search: searchTerm,
        isActive: 'true',
        limit: options.limit || 10,
        ...options
      };
      return await departmentService.getAllDepartments(params);
    } catch (error) {
      console.error('Error searching departments:', error);
      throw error;
    }
  },

  getDepartmentsForSelect: async (includeInactive = false) => {
    try {
      const params = {
        isActive: includeInactive ? 'all' : 'true',
        sortBy: 'departmentName',
        sortOrder: 'asc',
        fields: 'departmentName departmentCode _id'
      };

      const response = await api.get(`/departments?${new URLSearchParams(params).toString()}`);
      const departments = Array.isArray(response.data) ? response.data : response.data.departments || [];

      return departments.map(dept => ({
        value: dept._id,
        label: `${dept.departmentName} (${dept.departmentCode})`,
        code: dept.departmentCode,
        name: dept.departmentName
      }));
    } catch (error) {
      console.error('Error fetching departments for select:', error);
      return [];
    }
  },

  getDepartmentByCode: async (code) => {
    try {
      if (!code) throw new Error('Department code is required');

      const params = {
        search: code.toUpperCase(),
        isActive: 'true',
        limit: 1
      };

      const response = await departmentService.getAllDepartments(params);
      const departments = response.departments || [];

      return departments.find(dept => dept.departmentCode === code.toUpperCase()) || null;
    } catch (error) {
      console.error('Error fetching department by code:', error);
      throw error;
    }
  },

  bulkUpdateDepartments: async (operations) => {
    try {
      if (!Array.isArray(operations) || operations.length === 0) {
        throw new Error('Operations array is required');
      }

      const response = await api.post('/departments/bulk-update', { operations });
      return response.data;
    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  },

  bulkDeleteDepartments: async (departmentIds) => {
    try {
      if (!Array.isArray(departmentIds) || departmentIds.length === 0) {
        throw new Error('Department IDs array is required');
      }

      const operations = departmentIds.map(id => ({
        id,
        updates: { isActive: false }
      }));

      return await departmentService.bulkUpdateDepartments(operations);
    } catch (error) {
      console.error('Error in bulk delete:', error);
      throw error;
    }
  },

  exportDepartments: async (format = 'json', filters = {}) => {
    try {
      const params = {
        ...filters,
        export: format,
        limit: 1000
      };

      const response = await api.get(`/departments/export?${new URLSearchParams(params).toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error exporting departments:', error);
      throw error;
    }
  },

  validateDepartmentData: (departmentData) => {
    const errors = [];

    if (!departmentData.departmentName || !departmentData.departmentName.trim()) {
      errors.push({ field: 'departmentName', message: 'Department name is required' });
    }

    if (!departmentData.departmentCode || !departmentData.departmentCode.trim()) {
      errors.push({ field: 'departmentCode', message: 'Department code is required' });
    }

    if (departmentData.departmentCode && departmentData.departmentCode.length > 10) {
      errors.push({ field: 'departmentCode', message: 'Department code cannot exceed 10 characters' });
    }

    if (departmentData.departmentName && departmentData.departmentName.length > 100) {
      errors.push({ field: 'departmentName', message: 'Department name cannot exceed 100 characters' });
    }

    if (departmentData.description && departmentData.description.length > 500) {
      errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
    }

    if (departmentData.establishedYear) {
      const year = parseInt(departmentData.establishedYear);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        errors.push({ field: 'establishedYear', message: `Year must be between 1900 and ${currentYear}` });
      }
    }

    if (departmentData.contactEmail && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(departmentData.contactEmail)) {
      errors.push({ field: 'contactEmail', message: 'Please enter a valid email address' });
    }

    if (departmentData.contactPhone && !/^[6-9]\d{9}$/.test(departmentData.contactPhone.replace(/\D/g, ''))) {
      errors.push({ field: 'contactPhone', message: 'Please enter a valid 10-digit phone number' });
    }

    if (departmentData.website && !/^https?:\/\/.+\..+/.test(departmentData.website)) {
      errors.push({ field: 'website', message: 'Please enter a valid website URL' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  getDepartmentWithCounts: async (id) => {
    try {
      const department = await departmentService.getDepartmentById(id);
      if (!department) return null;

      if (!department.stats) {
        department.stats = {
          teacherCount: 0,
          studentCount: 0,
          semesterCount: 0,
          subjectCount: 0,
          courseCount: 0
        };
      }

      return department;
    } catch (error) {
      console.error('Error fetching department with counts:', error);
      throw error;
    }
  },

  checkDepartmentCodeAvailability: async (code, excludeId = null) => {
    try {
      const params = {
        search: code.toUpperCase(),
        isActive: 'all',
        limit: 1
      };

      const response = await departmentService.getAllDepartments(params);
      const departments = response.departments || [];

      const match = departments.find(
        dept => dept.departmentCode === code.toUpperCase() && dept._id !== excludeId
      );

      return !match;
    } catch (error) {
      console.error('Error checking department code availability:', error);
      throw error;
    }
  }
};

export default departmentService;
