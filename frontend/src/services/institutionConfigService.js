// frontend/src/services/institutionConfigService.js
//
// Talks to backend/modules/institution/routes/institutionConfig.routes.js
// (mounted at /api/institution/config). Mirrors the style of the other
// services in this folder (departmentService.js, timetableService.js):
// thin wrappers around `api`, consistent try/catch + console.error, and
// always returning `response.data` (the `{ success, message, data }`
// envelope from backend/utils/response.js).

import api from './api';

const institutionConfigService = {
  // Effective (merged: department override -> institution-wide default ->
  // system default) config for a scope. Always resolves to something
  // renderable/editable, even if nothing has been saved yet.
  getEffectiveConfig: async ({ departmentId, academicYear }) => {
    try {
      if (!academicYear) throw new Error('academicYear is required');
      const params = { academicYear };
      if (departmentId) params.departmentId = departmentId;
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/institution/config/effective?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching effective institution config:', error);
      throw error;
    }
  },

  // Raw saved document for an exact scope (may be null if nothing has
  // been saved for that department/year yet).
  getConfigByScope: async ({ departmentId, academicYear }) => {
    try {
      if (!academicYear) throw new Error('academicYear is required');
      const params = { academicYear };
      if (departmentId) params.departmentId = departmentId;
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/institution/config/scope?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching institution config by scope:', error);
      throw error;
    }
  },

  createConfig: async (data) => {
    try {
      const response = await api.post('/institution/config', data);
      return response.data;
    } catch (error) {
      console.error('Error creating institution config:', error);
      throw error;
    }
  },

  updateConfig: async (id, data) => {
    try {
      if (!id) throw new Error('InstitutionConfig id is required');
      const response = await api.put(`/institution/config/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating institution config:', error);
      throw error;
    }
  },

  // Convenience helper for the settings page: creates a new document if
  // this scope has none saved yet, otherwise updates the existing one.
  saveConfig: async ({ departmentId, academicYear }, data) => {
    try {
      const existing = await institutionConfigService.getConfigByScope({ departmentId, academicYear });
      const existingDoc = existing?.data;
      if (existingDoc && existingDoc._id) {
        return await institutionConfigService.updateConfig(existingDoc._id, data);
      }
      return await institutionConfigService.createConfig({ ...data, departmentId: departmentId || null, academicYear });
    } catch (error) {
      console.error('Error saving institution config:', error);
      throw error;
    }
  },

  deleteConfig: async (id) => {
    try {
      if (!id) throw new Error('InstitutionConfig id is required');
      const response = await api.delete(`/institution/config/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting institution config:', error);
      throw error;
    }
  },
};

export default institutionConfigService;
