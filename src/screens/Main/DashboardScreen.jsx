import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIntakeStore } from '../../stores/intakeStore';
import { useAuthStore } from '../../stores/authStore';
import Card from '../../components/common/Card';
import IntakeHistoryItem from '../../components/intake/IntakeHistoryItem';
import QuickLogButton from '../../components/intake/QuickLogButton';
import IntakeLoggerModal from '../../components/intake/IntakeLoggerModal';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import { calculateTotalPuffs, isToday } from '../../utils/helpers';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const { logs, fetchLogs, addLog, deleteLog, isLoading, syncOfflineQueue } = useIntakeStore();
  const { user } = useAuthStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchLogs();
    syncOfflineQueue();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Safely handle logs being null or undefined
  const safeLogs = logs || [];
  const todayLogs = safeLogs.filter(log => isToday(log.timestamp));
  const todayPuffs = calculateTotalPuffs(todayLogs);
  const recentLogs = safeLogs.slice(0, 5);

  // Weekly data
  const weeklyLogs = safeLogs.filter(log => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(log.timestamp) >= weekAgo;
  });
  const weeklyPuffs = calculateTotalPuffs(weeklyLogs);

  // Calculate daily goal progress
  const dailyGoal = 10;
  const goalProgress = Math.min((todayPuffs / dailyGoal) * 100, 100);
  const isUnderGoal = todayPuffs <= dailyGoal;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleAddLog = async (intakeData) => {
    return await addLog(intakeData);
  };

  const handleDeleteLog = async (id) => {
    await deleteLog(id);
  };

  const handleRefresh = async () => {
    await fetchLogs();
    await syncOfflineQueue();
  };

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
        {/* Header Section */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons name="account" size={28} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Let's check your progress today</Text>
        </Animated.View>

        {/* Main Stats Card */}
        <Animated.View style={[styles.mainStatsCard, { opacity: fadeAnim }]}>
          <Card variant="elevated" padding="lg" style={styles.statsCard}>
            <View style={styles.statsRow}>
              {/* Progress Ring */}
              <View style={styles.progressContainer}>
                <View style={styles.progressRingWrapper}>
                  <View 
                    style={[
                      styles.progressRing,
                      { borderColor: isUnderGoal ? colors.success + '20' : colors.warning + '20' }
                    ]}
                  >
                    <View 
                      style={[
                        styles.progressRingFill,
                        { 
                          backgroundColor: isUnderGoal ? colors.success : colors.warning,
                          height: `${Math.min(goalProgress, 100)}%`,
                        }
                      ]}
                    />
                    <View style={styles.progressInner}>
                      <Text style={styles.progressValue}>{todayPuffs}</Text>
                      <Text style={styles.progressLabel}>puffs</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.goalInfo}>
                  <MaterialCommunityIcons 
                    name={isUnderGoal ? "check-circle" : "alert-circle"} 
                    size={16} 
                    color={isUnderGoal ? colors.success : colors.warning} 
                  />
                  <Text style={[styles.goalText, { color: isUnderGoal ? colors.success : colors.warning }]}>
                    {isUnderGoal ? `${dailyGoal - todayPuffs} under goal` : `${todayPuffs - dailyGoal} over goal`}
                  </Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsInfo}>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
                    <MaterialCommunityIcons name="calendar-today" size={18} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.statValue}>{todayLogs.length}</Text>
                    <Text style={styles.statLabel}>Sessions</Text>
                  </View>
                </View>

                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: colors.accent + '15' }]}>
                    <MaterialCommunityIcons name="calendar-week" size={18} color={colors.accent} />
                  </View>
                  <View>
                    <Text style={styles.statValue}>{weeklyPuffs}</Text>
                    <Text style={styles.statLabel}>This Week</Text>
                  </View>
                </View>

                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
                    <MaterialCommunityIcons name="trending-down" size={18} color={colors.success} />
                  </View>
                  <View>
                    <Text style={styles.statValue}>-12%</Text>
                    <Text style={styles.statLabel}>vs Last Week</Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Quick Stats Row */}
        <View style={styles.quickStatsRow}>
          <Card style={styles.quickStatCard} variant="highlight">
            <MaterialCommunityIcons name="fire" size={24} color={colors.warning} />
            <Text style={styles.quickStatValue}>5</Text>
            <Text style={styles.quickStatLabel}>Day Streak</Text>
          </Card>
          
          <Card style={styles.quickStatCard} variant="highlight">
            <MaterialCommunityIcons name="leaf" size={24} color={colors.success} />
            <Text style={styles.quickStatValue}>$42</Text>
            <Text style={styles.quickStatLabel}>Saved</Text>
          </Card>
          
          <Card style={styles.quickStatCard} variant="highlight">
            <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
            <Text style={styles.quickStatValue}>3.2h</Text>
            <Text style={styles.quickStatLabel}>Avg Gap</Text>
          </Card>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Text style={styles.sectionLink}>View All</Text>
          </View>
          
          {recentLogs.length > 0 ? (
            <View style={styles.activityList}>
              {recentLogs.map((item, index) => (
                <IntakeHistoryItem 
                  key={item.id} 
                  item={item} 
                  onDelete={handleDeleteLog}
                  isLast={index === recentLogs.length - 1}
                />
              ))}
            </View>
          ) : (
            <Card style={styles.emptyCard} variant="outlined">
              <View style={styles.emptyContent}>
                <View style={styles.emptyIconCircle}>
                  <MaterialCommunityIcons name="clipboard-text-outline" size={32} color={colors.neutral} />
                </View>
                <Text style={styles.emptyText}>No intake logs yet</Text>
                <Text style={styles.emptySubtext}>
                  Tap the + button below to log your first intake
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Bottom spacing for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <QuickLogButton onPress={() => setModalVisible(true)} />
      <IntakeLoggerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddLog}
      />
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  greeting: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.text.primary,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  mainStatsCard: {
    marginBottom: spacing.lg,
  },
  statsCard: {
    borderRadius: borderRadius.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  progressRingWrapper: {
    marginBottom: spacing.sm,
  },
  progressRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  progressRingFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 50,
  },
  progressInner: {
    alignItems: 'center',
    zIndex: 1,
  },
  progressValue: {
    fontSize: typography.statSmall.fontSize,
    fontWeight: typography.statSmall.fontWeight,
    color: colors.text.primary,
  },
  progressLabel: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    marginTop: -2,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  goalText: {
    fontSize: typography.small.fontSize,
    fontWeight: '600',
  },
  statsInfo: {
    flex: 1,
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    marginTop: -2,
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  quickStatCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  quickStatLabel: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
  },
  sectionLink: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    fontWeight: '600',
  },
  activityList: {
    gap: spacing.sm,
  },
  emptyCard: {
    padding: spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default DashboardScreen;
