import api from './api';

export const analyticsService = {
  async getDailyAnalytics(date) {
    const response = await api.get('/analytics/daily', {
      params: { date },
    });
    return response.data;
  },

  async getWeeklyAnalytics(startDate, endDate) {
    const response = await api.get('/analytics/weekly', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  async getMonthlyAnalytics(month, year) {
    const response = await api.get('/analytics/monthly', {
      params: { month, year },
    });
    return response.data;
  },

  async getTrends(period = '7d') {
    const response = await api.get('/analytics/trends', {
      params: { period },
    });
    return response.data;
  },

  async getHeatMapData(startDate, endDate) {
    const response = await api.get('/analytics/heatmap', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  async getContextBreakdown(period = '7d') {
    const response = await api.get('/analytics/context', {
      params: { period },
    });
    return response.data;
  },
};

