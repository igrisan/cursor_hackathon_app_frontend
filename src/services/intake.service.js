import api from './api';

export const intakeService = {
  async createIntake(intakeData) {
    const response = await api.post('/intake', intakeData);
    return response.data;
  },

  async getIntakes(params = {}) {
    const response = await api.get('/intake', { params });
    return response.data;
  },

  async getIntakeById(id) {
    const response = await api.get(`/intake/${id}`);
    return response.data;
  },

  async updateIntake(id, intakeData) {
    const response = await api.put(`/intake/${id}`, intakeData);
    return response.data;
  },

  async deleteIntake(id) {
    const response = await api.delete(`/intake/${id}`);
    return response.data;
  },

  async getTodayIntakes() {
    const response = await api.get('/intake/today');
    return response.data;
  },

  async getWeeklyIntakes() {
    const response = await api.get('/intake/week');
    return response.data;
  },
};

