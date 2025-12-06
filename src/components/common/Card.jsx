import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../utils/theme';

const Card = ({ children, style, variant = 'default', padding = 'md' }) => {
  const getPadding = () => {
    switch (padding) {
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
        return shadows.md;
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return shadows.sm;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          padding: getPadding(),
          backgroundColor: colors.surface,
        },
        getVariantStyles(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
});

export default Card;

