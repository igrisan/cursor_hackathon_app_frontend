import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { colors, spacing, typography } from '../../utils/theme';
import { INTAKE_INTENSITY, INTAKE_CONTEXT } from '../../utils/constants';
import { formatTime, getRelativeTime } from '../../utils/helpers';

const IntakeHistoryItem = ({ item, onDelete }) => {
  const getIntensityColor = () => {
    switch (item.intensity) {
      case INTAKE_INTENSITY.LOW:
        return colors.success;
      case INTAKE_INTENSITY.MEDIUM:
        return colors.warning;
      case INTAKE_INTENSITY.HIGH:
        return colors.danger;
      default:
        return colors.neutral;
    }
  };

  const getContextIcon = () => {
    switch (item.context) {
      case INTAKE_CONTEXT.STRESS:
        return 'emoticon-sad';
      case INTAKE_CONTEXT.SOCIAL:
        return 'account-group';
      case INTAKE_CONTEXT.BREAK:
        return 'coffee';
      case INTAKE_CONTEXT.BOREDOM:
        return 'clock-outline';
      case INTAKE_CONTEXT.AFTER_MEAL:
        return 'food';
      case INTAKE_CONTEXT.MORNING:
        return 'weather-sunny';
      default:
        return 'circle';
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={[styles.intensityIndicator, { backgroundColor: getIntensityColor() }]} />
          <View style={styles.info}>
            <View style={styles.headerRow}>
              <Text style={styles.puffCount}>{item.puffCount} puffs</Text>
              <MaterialCommunityIcons
                name={getContextIcon()}
                size={16}
                color={colors.text.secondary}
              />
            </View>
            <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
            {item.notes && (
              <Text style={styles.notes} numberOfLines={1}>
                {item.notes}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.relativeTime}>{getRelativeTime(item.timestamp)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(item.id)}
          >
            <MaterialCommunityIcons name="delete" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  intensityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  puffCount: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  },
  time: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  notes: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  rightSection: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  relativeTime: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
  },
  deleteButton: {
    padding: spacing.xs,
  },
});

export default IntakeHistoryItem;

