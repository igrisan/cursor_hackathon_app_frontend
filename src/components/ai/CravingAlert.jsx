import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import Button from '../common/Button';
import { colors, spacing, typography } from '../../utils/theme';

const CravingAlert = ({ prediction, strategies, onResist, onDismiss }) => {
  if (!prediction) {
    return null;
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={24}
          color={colors.warning}
        />
        <Text style={styles.title}>Craving Prediction</Text>
      </View>

      <Text style={styles.message}>
        {prediction.message || 'You might experience a craving soon. Stay strong!'}
      </Text>

      {prediction.timeUntil && (
        <Text style={styles.timeText}>
          Estimated time: {prediction.timeUntil}
        </Text>
      )}

      {strategies && strategies.length > 0 && (
        <View style={styles.strategiesContainer}>
          <Text style={styles.strategiesTitle}>Try these strategies:</Text>
          {strategies.slice(0, 3).map((strategy, index) => (
            <View key={index} style={styles.strategyItem}>
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color={colors.success}
              />
              <Text style={styles.strategyText}>{strategy}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="I Resisted"
          onPress={onResist}
          variant="success"
          size="sm"
          style={styles.actionButton}
        />
        <Button
          title="Dismiss"
          onPress={onDismiss}
          variant="secondary"
          size="sm"
          style={styles.actionButton}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  message: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  timeText: {
    fontSize: typography.caption.fontSize,
    color: colors.warning,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  strategiesContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  strategiesTitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  strategyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  strategyText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});

export default CravingAlert;

