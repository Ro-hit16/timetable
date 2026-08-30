import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const getRecentActivity = async () => {
  const res = await axios.get(`${API_URL}/activity/recent`);
  return res.data;
};

const activityService = {
  getRecentActivity,
};

export default activityService;