import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { useIntakeStore } from '../../stores/intakeStore';
import Card from '../../components/common/Card';
import InsightCard from '../../components/ai/InsightCard';
import CoachingPanel from '../../components/ai/CoachingPanel';
import CravingAlert from '../../components/ai/CravingAlert';
import { colors, spacing, typography, borderRadius, shadows, withOpacity } from '../../utils/theme';
import { calculateStreak, calculateTotalPuffs } from '../../utils/helpers';

const CoachScreen = () => {
  const insets = useSafeAreaInsets();
  const [insights, setInsights] = useState([]);
  const [tips, setTips] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuthStore();
  const { logs } = useIntakeStore();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadCoachData();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [logs]);

  const loadCoachData = async () => {
    setIsLoading(true);
    const safeLogs = logs || [];
    
    // Calculate progress
    const todayLogs = safeLogs.filter(log => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(log.timestamp) >= today;
    });
    const todayPuffs = calculateTotalPuffs(todayLogs);
    const targetPuffs = 20;
    const progressPercentage = Math.max(0, Math.min(100, ((targetPuffs - todayPuffs) / targetPuffs) * 100));
    
    setProgress({
      percentage: Math.round(progressPercentage),
      message: progressPercentage >= 80 ? 'Excellent progress!' : 'Keep going!',
    });

    // Generate insights
    const streak = calculateStreak(safeLogs);
    const newInsights = [];
    
    if (streak > 0) {
      newInsights.push({
        type: 'milestone',
        title: 'Great Streak!',
        message: `You've been tracking for ${streak} ${streak === 1 ? 'day' : 'days'}. Keep it up!`,
        icon: 'fire',
        color: colors.warning,
      });
    }

    if (todayPuffs < targetPuffs / 2) {
      newInsights.push({
        type: 'trend',
        title: 'Low Usage Today',
        message: 'You\'re doing great! Your usage is below average today.',
        icon: 'trending-down',
        color: colors.success,
      });
    }

    if (todayPuffs > targetPuffs) {
      newInsights.push({
        type: 'warning',
        title: 'High Usage Alert',
        message: 'Your usage is higher than your target. Try some breathing exercises.',
        action: 'View Strategies',
        icon: 'alert-circle',
        color: colors.warning,
      });
    }

    // Always show at least one insight
    if (newInsights.length === 0) {
      newInsights.push({
        type: 'info',
        title: 'Track Your Progress',
        message: 'Log your intakes regularly to get personalized insights.',
        icon: 'lightbulb-outline',
        color: colors.primary,
      });
    }

    setInsights(newInsights);

    // Generate tips
    const newTips = [
      {
        icon: 'water',
        title: 'Stay Hydrated',
        description: 'Drink water when you feel a craving.',
        color: colors.primary,
      },
      {
        icon: 'walk',
        title: 'Take a Walk',
        description: 'A 5-minute walk can help distract you.',
        color: colors.success,
      },
      {
        icon: 'meditation',
        title: 'Deep Breathing',
        description: 'Practice breathing exercises.',
        color: colors.accent,
      },
      {
        icon: 'phone',
        title: 'Call Someone',
        description: 'Reach out for encouragement.',
        color: colors.warning,
      },
    ];

    setTips(newTips);

    // Mock prediction
    if (todayPuffs > 5) {
      setPrediction({
        message: 'Based on your patterns, you might experience a craving soon.',
        timeUntil: '~45 minutes',
      });
    }

    setIsLoading(false);
  };

  const handleResist = () => {
    console.log('User resisted craving');
    setPrediction(null);
  };

  const handleDismiss = () => {
    setPrediction(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={loadCoachData}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>AI Coach</Text>
              <Text style={styles.subtitle}>Personalized guidance for you</Text>
            </View>
            <View style={styles.robotCircle}>
              <MaterialCommunityIcons name="robot-happy" size={32} color={colors.accent} />
            </View>
          </View>
        </Animated.View>

        {/* Progress Card */}
        {progress && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Card style={styles.progressCard} variant="elevated">
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Today's Progress</Text>
                <View style={[styles.progressBadge, { 
                  backgroundColor: withOpacity(progress.percentage >= 50 ? colors.success : colors.warning, 0.15) 
                }]}>
                  <MaterialCommunityIcons 
                    name={progress.percentage >= 50 ? 'check-circle' : 'clock-outline'} 
                    size={16} 
                    color={progress.percentage >= 50 ? colors.success : colors.warning} 
                  />
                  <Text style={[styles.progressBadgeText, { 
                    color: progress.percentage >= 50 ? colors.success : colors.warning 
                  }]}>
                    {progress.message}
                  </Text>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <LinearGradient
                    colors={progress.percentage >= 50 ? [colors.success, colors.successLight] : [colors.warning, colors.warningLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBarFill, { width: `${progress.percentage}%` }]}
                  />
                </View>
                <Text style={styles.progressPercent}>{progress.percentage}%</Text>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Craving Alert */}
        {prediction && (
          <CravingAlert
            prediction={prediction}
            strategies={[
              'Take 5 deep breaths',
              'Drink a glass of water',
              'Go for a short walk',
            ]}
            onResist={handleResist}
            onDismiss={handleDismiss}
          />
        )}

        {/* Insights Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Your Insights</Text>
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </Animated.View>

        {/* Tips Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={styles.tipsGrid}>
            {tips.map((tip, index) => (
              <Card key={index} style={styles.tipCard} variant="outlined">
                <View style={[styles.tipIcon, { backgroundColor: withOpacity(tip.color, 0.15) }]}>
                  <MaterialCommunityIcons name={tip.icon} size={22} color={tip.color} />
                </View>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </Card>
            ))}
          </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  robotCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: withOpacity(colors.accent, 0.15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressTitle: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: colors.text.primary,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  progressBadgeText: {
    fontSize: typography.small.fontSize,
    fontWeight: '600',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressPercent: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: colors.text.primary,
    width: 50,
    textAlign: 'right',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tipCard: {
    width: '48%',
    padding: spacing.md,
  },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipTitle: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: typography.bodyMedium.fontWeight,
    color: colors.text.primary,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    lineHeight: 16,
  },
});

export default CoachScreen;
