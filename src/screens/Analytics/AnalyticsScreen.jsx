import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useIntakeStore } from '../../stores/intakeStore';
import DailyChart from '../../components/analytics/DailyChart';
import WeeklyTrends from '../../components/analytics/WeeklyTrends';
import UsageHeatMap from '../../components/analytics/UsageHeatMap';
import { colors, spacing, typography } from '../../utils/theme';
import { groupLogsByDay, groupLogsByHour, getStartOfWeek, getEndOfWeek } from '../../utils/helpers';

const AnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const { fetchWeeklyAnalytics, weeklyData, isLoading } = useAnalyticsStore();
  const { logs } = useIntakeStore();

  useEffect(() => {
    const startDate = getStartOfWeek();
    const endDate = getEndOfWeek();
    fetchWeeklyAnalytics(startDate, endDate);
  }, []);

  const handleRefresh = async () => {
    const startDate = getStartOfWeek();
    const endDate = getEndOfWeek();
    await fetchWeeklyAnalytics(startDate, endDate);
  };

  // Process logs for charts
  const dailyData = React.useMemo(() => {
    const grouped = groupLogsByDay(logs);
    return Object.entries(grouped).map(([date, dayLogs]) => ({
      date,
      totalPuffs: dayLogs.reduce((sum, log) => sum + (log.puffCount || 0), 0),
    })).slice(-7).reverse();
  }, [logs]);

  const weeklyDataProcessed = React.useMemo(() => {
    const grouped = groupLogsByDay(logs);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const dateKey = date.toISOString().split('T')[0];
      const dayLogs = grouped[dateKey] || [];
      return {
        day,
        totalPuffs: dayLogs.reduce((sum, log) => sum + (log.puffCount || 0), 0),
      };
    });
  }, [logs]);

  const hourlyData = React.useMemo(() => {
    return groupLogsByHour(logs);
  }, [logs]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your progress and patterns</Text>
        </View>

        <DailyChart data={dailyData} />
        <WeeklyTrends data={weeklyDataProcessed} />
        <UsageHeatMap data={hourlyData} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
});

export default AnalyticsScreen;

