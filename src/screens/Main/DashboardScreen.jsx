import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useIntakeStore } from '../../stores/intakeStore';
import { useAuthStore } from '../../stores/authStore';
import Card from '../../components/common/Card';
import IntakeHistoryItem from '../../components/intake/IntakeHistoryItem';
import QuickLogButton from '../../components/intake/QuickLogButton';
import IntakeLoggerModal from '../../components/intake/IntakeLoggerModal';
import { colors, spacing, typography } from '../../utils/theme';
import { calculateTotalPuffs, isToday } from '../../utils/helpers';

const DashboardScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { logs, fetchLogs, addLog, deleteLog, isLoading, syncOfflineQueue } = useIntakeStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLogs();
    syncOfflineQueue();
  }, []);

  // Safely handle logs being null or undefined
  const safeLogs = logs || [];
  const todayLogs = safeLogs.filter(log => isToday(log.timestamp));
  const todayPuffs = calculateTotalPuffs(todayLogs);
  const recentLogs = safeLogs.slice(0, 5);

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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
          <Text style={styles.subtitle}>Track your progress today</Text>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Today's Puffs</Text>
            <Text style={styles.statValue}>{todayPuffs}</Text>
            <Text style={styles.statSubtext}>
              {todayLogs.length} {todayLogs.length === 1 ? 'session' : 'sessions'}
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={styles.statValue}>
              {calculateTotalPuffs(safeLogs.filter(log => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(log.timestamp) >= weekAgo;
              }))}
            </Text>
            <Text style={styles.statSubtext}>Total puffs</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentLogs.length > 0 ? (
            <FlatList
              data={recentLogs}
              renderItem={({ item }) => (
                <IntakeHistoryItem item={item} onDelete={handleDeleteLog} />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No intake logs yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to log your first intake
              </Text>
            </Card>
          )}
        </View>
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
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statSubtext: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
});

export default DashboardScreen;

