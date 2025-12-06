import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useIntakeStore } from '../../stores/intakeStore';
import Card from '../../components/common/Card';
import DailyChart from '../../components/analytics/DailyChart';
import WeeklyTrends from '../../components/analytics/WeeklyTrends';
import UsageHeatMap from '../../components/analytics/UsageHeatMap';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { groupLogsByDay, groupLogsByHour, getStartOfWeek, getEndOfWeek } from '../../utils/helpers';

const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const { fetchWeeklyAnalytics, weeklyData, isLoading } = useAnalyticsStore();
  const { logs } = useIntakeStore();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startDate = getStartOfWeek();
    const endDate = getEndOfWeek();
    fetchWeeklyAnalytics(startDate, endDate);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRefresh = async () => {
    const startDate = getStartOfWeek();
    const endDate = getEndOfWeek();
    await fetchWeeklyAnalytics(startDate, endDate);
  };

  // Process logs for charts
  const safeLogs = logs || [];
  
  const dailyData = React.useMemo(() => {
    const grouped = groupLogsByDay(safeLogs);
    return Object.entries(grouped).map(([date, dayLogs]) => ({
      date,
      totalPuffs: dayLogs.reduce((sum, log) => sum + (log.puffCount || 0), 0),
    })).slice(-7).reverse();
  }, [safeLogs]);

  const weeklyDataProcessed = React.useMemo(() => {
    const grouped = groupLogsByDay(safeLogs);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    // Generate last 7 days with correct day labels
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dateKey = date.toISOString().split('T')[0];
      const dayLogs = grouped[dateKey] || [];
      return {
        day: dayNames[date.getDay()],
        totalPuffs: dayLogs.reduce((sum, log) => sum + (log.puffCount || 0), 0),
        isToday: index === 6, // Last item is always today
      };
    });
  }, [safeLogs]);

  const hourlyData = React.useMemo(() => {
    return groupLogsByHour(safeLogs);
  }, [safeLogs]);

  // Calculate previous week total for trend comparison
  const previousWeekTotal = React.useMemo(() => {
    const grouped = groupLogsByDay(safeLogs);
    const today = new Date();
    let total = 0;
    
    // Generate days 8-14 days ago (previous week)
    for (let i = 7; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayLogs = grouped[dateKey] || [];
      total += dayLogs.reduce((sum, log) => sum + (log.puffCount || 0), 0);
    }
    return total;
  }, [safeLogs]);

  // Calculate summary stats
  const weeklyTotal = weeklyDataProcessed.reduce((sum, d) => sum + d.totalPuffs, 0);
  const dailyAverage = Math.round(weeklyTotal / 7);
  const bestDay = weeklyDataProcessed.reduce((best, d) => 
    d.totalPuffs < best.totalPuffs ? d : best, weeklyDataProcessed[0]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your progress and patterns</Text>
        </Animated.View>

        {/* Summary Cards */}
        <Animated.View style={[styles.summaryContainer, { opacity: fadeAnim }]}>
          <Card style={styles.summaryCard} variant="elevated">
            <View style={[styles.summaryIcon, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons name="sigma" size={20} color={colors.primary} />
            </View>
            <Text style={styles.summaryValue}>{weeklyTotal}</Text>
            <Text style={styles.summaryLabel}>This Week</Text>
          </Card>

          <Card style={styles.summaryCard} variant="elevated">
            <View style={[styles.summaryIcon, { backgroundColor: colors.warning + '15' }]}>
              <MaterialCommunityIcons name="chart-line-variant" size={20} color={colors.warning} />
            </View>
            <Text style={styles.summaryValue}>{dailyAverage}</Text>
            <Text style={styles.summaryLabel}>Daily Avg</Text>
          </Card>

          <Card style={styles.summaryCard} variant="elevated">
            <View style={[styles.summaryIcon, { backgroundColor: colors.success + '15' }]}>
              <MaterialCommunityIcons name="star" size={20} color={colors.success} />
            </View>
            <Text style={styles.summaryValue}>{bestDay?.day}</Text>
            <Text style={styles.summaryLabel}>Best Day</Text>
          </Card>
        </Animated.View>

        {/* Charts */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <DailyChart data={dailyData} />
          <WeeklyTrends data={weeklyDataProcessed} previousWeekTotal={previousWeekTotal} />
          <UsageHeatMap data={hourlyData} />
        </Animated.View>
        
        <View style={{ height: 100 }} />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
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
  summaryContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.xl,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryValue: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    marginTop: 2,
  },
});

export default AnalyticsScreen;
