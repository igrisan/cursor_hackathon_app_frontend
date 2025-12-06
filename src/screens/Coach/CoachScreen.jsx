import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useIntakeStore } from '../../stores/intakeStore';
import InsightCard from '../../components/ai/InsightCard';
import CoachingPanel from '../../components/ai/CoachingPanel';
import CravingAlert from '../../components/ai/CravingAlert';
import { colors, spacing, typography } from '../../utils/theme';
import { calculateStreak, calculateTotalPuffs } from '../../utils/helpers';

const CoachScreen = () => {
  const [insights, setInsights] = useState([]);
  const [tips, setTips] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuthStore();
  const { logs } = useIntakeStore();

  useEffect(() => {
    loadCoachData();
  }, [logs]);

  const loadCoachData = async () => {
    setIsLoading(true);
    
    // Calculate progress
    const todayLogs = logs.filter(log => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(log.timestamp) >= today;
    });
    const todayPuffs = calculateTotalPuffs(todayLogs);
    const targetPuffs = 20; // Example target
    const progressPercentage = Math.max(0, Math.min(100, ((targetPuffs - todayPuffs) / targetPuffs) * 100));
    
    setProgress({
      percentage: Math.round(progressPercentage),
      message: progressPercentage >= 80 ? 'Excellent progress!' : 'Keep going!',
    });

    // Generate insights
    const streak = calculateStreak(logs);
    const newInsights = [];
    
    if (streak > 0) {
      newInsights.push({
        type: 'milestone',
        title: 'Great Streak!',
        message: `You've been tracking for ${streak} ${streak === 1 ? 'day' : 'days'}. Keep it up!`,
      });
    }

    if (todayPuffs < targetPuffs / 2) {
      newInsights.push({
        type: 'trend',
        title: 'Low Usage Today',
        message: 'You\'re doing great! Your usage is below average today.',
      });
    }

    if (todayPuffs > targetPuffs) {
      newInsights.push({
        type: 'warning',
        title: 'High Usage Alert',
        message: 'Your usage is higher than your target. Try some breathing exercises.',
        action: 'View Strategies',
      });
    }

    setInsights(newInsights);

    // Generate tips
    const newTips = [
      {
        icon: 'water',
        title: 'Stay Hydrated',
        description: 'Drink a glass of water when you feel a craving coming on.',
      },
      {
        icon: 'walk',
        title: 'Take a Walk',
        description: 'A short 5-minute walk can help distract you from cravings.',
      },
      {
        icon: 'meditation',
        title: 'Deep Breathing',
        description: 'Practice deep breathing exercises to manage stress and cravings.',
      },
      {
        icon: 'phone',
        title: 'Call a Friend',
        description: 'Reach out to someone supportive when you need encouragement.',
      },
    ];

    setTips(newTips);

    // Mock prediction
    setPrediction({
      message: 'Based on your patterns, you might experience a craving in the next hour.',
      timeUntil: '~45 minutes',
    });

    setIsLoading(false);
  };

  const handleResist = () => {
    // Log resistance
    console.log('User resisted craving');
    setPrediction(null);
  };

  const handleDismiss = () => {
    setPrediction(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadCoachData} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>AI Coach</Text>
          <Text style={styles.subtitle}>Personalized guidance for your journey</Text>
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))
          ) : (
            <Text style={styles.emptyText}>No insights available yet</Text>
          )}
        </View>

        <CoachingPanel tips={tips} progress={progress} />
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
});

export default CoachScreen;

