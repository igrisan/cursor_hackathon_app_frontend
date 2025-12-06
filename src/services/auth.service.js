import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  async changePassword(oldPassword, newPassword) {
    const response = await api.put('/auth/password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

