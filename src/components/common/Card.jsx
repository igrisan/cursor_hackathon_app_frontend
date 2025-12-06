import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows } from '../../utils/theme';

const Card = ({ 
  children, 
  style, 
  variant = 'default', 
  padding = 'md',
  onPress,
  gradient,
  gradientColors = ['#FFFFFF', '#F8FAFC'],
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return spacing.sm;
      case 'lg':
        return spacing.lg;
      case 'xl':
        return spacing.xl;
      default:
        return spacing.md;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return shadows.lg;
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.none,
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          ...shadows.md,
        };
      case 'highlight':
        return {
          borderWidth: 1.5,
          borderColor: colors.primary + '30',
          backgroundColor: colors.primary + '05',
          ...shadows.sm,
        };
      default:
        return shadows.sm;
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'glass':
        return 'rgba(255, 255, 255, 0.9)';
      case 'highlight':
        return colors.primary + '05';
      default:
        return colors.surface;
    }
  };

  const cardStyle = [
    styles.card,
    {
      padding: getPadding(),
      backgroundColor: getBackgroundColor(),
    },
    getVariantStyles(),
    style,
  ];

  const gradientCardStyle = [
    styles.card,
    { backgroundColor: getBackgroundColor() },
    getVariantStyles(),
    { padding: 0 },
    style,
  ];

  const content = gradient ? (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientContent, { padding: getPadding() }]}
    >
      {children}
    </LinearGradient>
  ) : (
    children
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={gradient ? gradientCardStyle : cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  if (gradient) {
    return (
      <View style={gradientCardStyle}>
        {content}
      </View>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  gradientContent: {
    borderRadius: borderRadius.xl,
  },
});

export default Card;
