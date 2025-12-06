import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';

const CoachingPanel = ({ tips, progress }) => {
  if (!tips || tips.length === 0) {
    return (
      <Card style={styles.container}>
        <Text style={styles.emptyText}>No coaching tips available</Text>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {progress && (
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressValue}>{progress.percentage || 0}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress.percentage || 0}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress.message || 'Keep going!'}</Text>
        </Card>
      )}

      <Text style={styles.sectionTitle}>Personalized Tips</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tips.map((tip, index) => (
          <Card key={index} style={styles.tipCard}>
            <MaterialCommunityIcons
              name={tip.icon || 'lightbulb'}
              size={32}
              color={colors.primary}
              style={styles.tipIcon}
            />
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDescription}>{tip.description}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  progressCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
  },
  progressValue: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  progressText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tipCard: {
    width: 280,
    marginRight: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  tipIcon: {
    marginBottom: spacing.md,
  },
  tipTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  tipDescription: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
});

export default CoachingPanel;

