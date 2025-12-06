import { useEffect } from 'react';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { getStartOfWeek, getEndOfWeek } from '../utils/helpers';

export const useAnalytics = (autoFetch = true) => {
  const analyticsStore = useAnalyticsStore();

  useEffect(() => {
    if (autoFetch) {
      const startDate = getStartOfWeek();
      const endDate = getEndOfWeek();
      analyticsStore.fetchWeeklyAnalytics(startDate, endDate);
    }
  }, [autoFetch]);

  return analyticsStore;
};

