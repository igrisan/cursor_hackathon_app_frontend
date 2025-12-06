import { create } from 'zustand';
import { analyticsService } from '../services/analytics.service';

export const useAnalyticsStore = create((set, get) => ({
  dailyData: null,
  weeklyData: null,
  monthlyData: null,
  trends: null,
  heatMapData: null,
  contextBreakdown: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  fetchDailyAnalytics: async (date) => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getDailyAnalytics(date);
      const data = response.data || response;
      
      set({
        dailyData: data,
        isLoading: false,
        lastUpdated: new Date(),
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch daily analytics';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  fetchWeeklyAnalytics: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getWeeklyAnalytics(startDate, endDate);
      const data = response.data || response;
      
      set({
        weeklyData: data,
        isLoading: false,
        lastUpdated: new Date(),
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch weekly analytics';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  fetchMonthlyAnalytics: async (month, year) => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getMonthlyAnalytics(month, year);
      const data = response.data || response;
      
      set({
        monthlyData: data,
        isLoading: false,
        lastUpdated: new Date(),
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch monthly analytics';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  fetchTrends: async (period = '7d') => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getTrends(period);
      const data = response.data || response;
      
      set({
        trends: data,
        isLoading: false,
        lastUpdated: new Date(),
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch trends';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  fetchHeatMapData: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getHeatMapData(startDate, endDate);
      const data = response.data || response;
      
      set({
        heatMapData: data,
        isLoading: false,
        lastUpdated: new Date(),
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch heat map data';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  fetchContextBreakdown: async (period = '7d') => {
    set({ isLoading: true, error: null });
    try {
      const response = await analyticsService.getContextBreakdown(period);
      const data = response.data || response;
      
      set({
        contextBreakdown: data,
        isLoading: false,
        lastUpdated: new Date(),
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch context breakdown';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null }),
}));

