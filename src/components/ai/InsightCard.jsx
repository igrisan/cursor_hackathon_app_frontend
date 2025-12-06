import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { colors, spacing, typography } from '../../utils/theme';

const InsightCard = ({ insight }) => {
  if (!insight) {
    return null;
  }

  const getIcon = () => {
    switch (insight.type) {
      case 'trend':
        return 'trending-down';
      case 'milestone':
        return 'trophy';
      case 'warning':
        return 'alert';
      case 'tip':
        return 'lightbulb';
      default:
        return 'information';
    }
  };

  const getColor = () => {
    switch (insight.type) {
      case 'trend':
        return colors.success;
      case 'milestone':
        return colors.warning;
      case 'warning':
        return colors.danger;
      case 'tip':
        return colors.primary;
      default:
        return colors.neutral;
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getColor() + '20' }]}>
          <MaterialCommunityIcons
            name={getIcon()}
            size={24}
            color={getColor()}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{insight.title}</Text>
          <Text style={styles.message}>{insight.message}</Text>
        </View>
      </View>
      {insight.action && (
        <View style={styles.actionContainer}>
          <Text style={styles.actionText}>{insight.action}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default InsightCard;

