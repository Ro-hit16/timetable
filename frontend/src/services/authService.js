// import api from './api';

// const authService = {
//   login: async (credentials) => {
//     return await api.post('/auth/login', credentials);
//   },

//   logout: async () => {
//     return await api.post('/auth/logout');
//   },

//   verifyToken: async (token) => {
//     return await api.get('/auth/verify', {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//   },

//   register: async (userData) => {
//     return await api.post('/auth/register', userData);
//   },

//   forgotPassword: async (email) => {
//     return await api.post('/auth/forgot-password', { email });
//   },

//   resetPassword: async (token, password) => {
//     return await api.post('/auth/reset-password', { token, password });
//   }
// };

// export default authService;




// authService.js
import api from './api';

const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  logout: async () => {
    return await api.post('/auth/logout');
  },

  verifyToken: async (token) => {
    return await api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, password) => {
    return await api.post('/auth/reset-password', { token, password });
  }
};

export default authService;