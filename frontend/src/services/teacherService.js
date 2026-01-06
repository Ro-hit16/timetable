
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
