import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';

const InsightCard = ({ insight }) => {
  if (!insight) {
    return null;
  }

  const getIcon = () => {
    if (insight.icon) return insight.icon;
    switch (insight.type) {
      case 'trend':
        return 'trending-down';
      case 'milestone':
        return 'trophy';
      case 'warning':
        return 'alert-circle';
      case 'tip':
        return 'lightbulb-outline';
      case 'info':
        return 'information-outline';
      default:
        return 'information';
    }
  };

  const getColor = () => {
    if (insight.color) return insight.color;
    switch (insight.type) {
      case 'trend':
        return colors.success;
      case 'milestone':
        return colors.warning;
      case 'warning':
        return colors.danger;
      case 'tip':
        return colors.primary;
      case 'info':
        return colors.primary;
      default:
        return colors.neutral;
    }
  };

  const insightColor = getColor();

  return (
    <Card style={styles.container} variant="outlined">
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: insightColor + '15' }]}>
          <MaterialCommunityIcons
            name={getIcon()}
            size={22}
            color={insightColor}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{insight.title}</Text>
          <Text style={styles.message}>{insight.message}</Text>
        </View>
      </View>
      {insight.action && (
        <TouchableOpacity style={[styles.actionContainer, { borderTopColor: insightColor + '20' }]}>
          <Text style={[styles.actionText, { color: insightColor }]}>{insight.action}</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color={insightColor} />
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: typography.bodyMedium.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
});

export default InsightCard;
