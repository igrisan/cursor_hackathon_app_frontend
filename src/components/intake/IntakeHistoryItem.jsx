import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { INTAKE_INTENSITY, INTAKE_CONTEXT } from '../../utils/constants';
import { formatTime, getRelativeTime } from '../../utils/helpers';

const IntakeHistoryItem = ({ item, onDelete, isLast = false }) => {
  const getIntensityColor = (intensity) => {
    switch (intensity) {
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

  const getIntensityLabel = (intensity) => {
    switch (intensity) {
      case INTAKE_INTENSITY.LOW:
        return 'Low';
      case INTAKE_INTENSITY.MEDIUM:
        return 'Medium';
      case INTAKE_INTENSITY.HIGH:
        return 'High';
      default:
        return intensity;
    }
  };

  const getContextIcon = (context) => {
    switch (context) {
      case INTAKE_CONTEXT.STRESS:
        return 'lightning-bolt';
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
        return 'dots-horizontal';
    }
  };

  const getContextLabel = (context) => {
    switch (context) {
      case INTAKE_CONTEXT.STRESS:
        return 'Stress';
      case INTAKE_CONTEXT.SOCIAL:
        return 'Social';
      case INTAKE_CONTEXT.BREAK:
        return 'Break';
      case INTAKE_CONTEXT.BOREDOM:
        return 'Boredom';
      case INTAKE_CONTEXT.AFTER_MEAL:
        return 'After Meal';
      case INTAKE_CONTEXT.MORNING:
        return 'Morning';
      default:
        return 'Other';
    }
  };

  const intensityColor = getIntensityColor(item.intensity);

  return (
    <Card style={styles.card} variant="outlined">
      <View style={styles.content}>
        {/* Left - Intensity indicator */}
        <View style={[styles.intensityIndicator, { backgroundColor: intensityColor + '15' }]}>
          <Text style={[styles.puffCount, { color: intensityColor }]}>
            {item.puffCount}
          </Text>
          <Text style={[styles.puffLabel, { color: intensityColor }]}>puffs</Text>
        </View>

        {/* Middle - Info */}
        <View style={styles.infoSection}>
          <View style={styles.topRow}>
            <View style={styles.contextBadge}>
              <MaterialCommunityIcons 
                name={getContextIcon(item.context)} 
                size={14} 
                color={colors.neutral} 
              />
              <Text style={styles.contextText}>
                {getContextLabel(item.context)}
              </Text>
            </View>
            <View style={[styles.intensityBadge, { backgroundColor: intensityColor + '15' }]}>
              <View style={[styles.intensityDot, { backgroundColor: intensityColor }]} />
              <Text style={[styles.intensityText, { color: intensityColor }]}>
                {getIntensityLabel(item.intensity)}
              </Text>
            </View>
          </View>

          {item.notes ? (
            <Text style={styles.notes} numberOfLines={1}>
              {item.notes}
            </Text>
          ) : null}

          <Text style={styles.time}>
            {getRelativeTime(item.timestamp)} · {formatTime(item.timestamp)}
          </Text>
        </View>

        {/* Right - Delete button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.neutral} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    marginBottom: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intensityIndicator: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  puffCount: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
  },
  puffLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: -2,
  },
  infoSection: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  contextText: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  intensityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  intensityText: {
    fontSize: typography.small.fontSize,
    fontWeight: '600',
  },
  notes: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  time: {
    fontSize: typography.small.fontSize,
    color: colors.text.muted,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
});

export default IntakeHistoryItem;
