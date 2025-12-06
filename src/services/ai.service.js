import api from './api';

export const aiService = {
  async getInsights() {
    const response = await api.get('/ai/insights');
    return response.data;
  },

  async getCravingPrediction() {
    const response = await api.get('/ai/craving-prediction');
    return response.data;
  },

  async getCoachingTips() {
    const response = await api.get('/ai/coaching-tips');
    return response.data;
  },

  async getPersonalizedAdvice() {
    const response = await api.get('/ai/advice');
    return response.data;
  },

  async logCravingResistance(data) {
    const response = await api.post('/ai/craving-resistance', data);
    return response.data;
  },

  async getProgressCelebration() {
    const response = await api.get('/ai/celebration');
    return response.data;
  },
};

