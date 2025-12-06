import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import Button from '../common/Button';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';

const CravingAlert = ({ prediction, strategies, onResist, onDismiss }) => {
  if (!prediction) {
    return null;
  }

  return (
    <Card style={styles.container} variant="elevated">
      {/* Alert Header */}
      <View style={styles.headerRow}>
        <View style={styles.alertBadge}>
          <MaterialCommunityIcons name="alert" size={16} color={colors.warning} />
          <Text style={styles.alertBadgeText}>Craving Alert</Text>
        </View>
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <MaterialCommunityIcons name="close" size={20} color={colors.neutral} />
        </TouchableOpacity>
      </View>

      <Text style={styles.message}>
        {prediction.message || 'You might experience a craving soon. Stay strong!'}
      </Text>

      {prediction.timeUntil && (
        <View style={styles.timeContainer}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={colors.warning} />
          <Text style={styles.timeText}>Estimated: {prediction.timeUntil}</Text>
        </View>
      )}

      {strategies && strategies.length > 0 && (
        <View style={styles.strategiesContainer}>
          <Text style={styles.strategiesTitle}>Try these strategies:</Text>
          {strategies.slice(0, 3).map((strategy, index) => (
            <View key={index} style={styles.strategyItem}>
              <View style={styles.strategyNumber}>
                <Text style={styles.strategyNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.strategyText}>{strategy}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="I Resisted! 💪"
          onPress={onResist}
          variant="success"
          size="md"
          fullWidth
          leftIcon="check-circle"
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.warning + '30',
    backgroundColor: colors.warning + '05',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    gap: spacing.xs,
  },
  alertBadgeText: {
    fontSize: typography.small.fontSize,
    fontWeight: '600',
    color: colors.warning,
  },
  dismissButton: {
    padding: spacing.xs,
  },
  message: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  timeText: {
    fontSize: typography.caption.fontSize,
    color: colors.warning,
    fontWeight: '600',
  },
  strategiesContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  strategiesTitle: {
    fontSize: typography.captionMedium.fontSize,
    fontWeight: typography.captionMedium.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  strategyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  strategyNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  strategyNumberText: {
    fontSize: typography.small.fontSize,
    fontWeight: '600',
    color: colors.success,
  },
  strategyText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    flex: 1,
  },
  actions: {
    marginTop: spacing.xs,
  },
});

export default CravingAlert;
