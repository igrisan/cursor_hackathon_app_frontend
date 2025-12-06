import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../utils/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: colors.danger,
          borderColor: colors.danger,
        };
      case 'success':
        return {
          backgroundColor: colors.success,
          borderColor: colors.success,
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          fontSize: typography.caption.fontSize,
        };
      case 'lg':
        return {
          paddingVertical: spacing.md + 4,
          paddingHorizontal: spacing.lg,
          fontSize: typography.body.fontSize,
        };
      default:
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          fontSize: typography.body.fontSize,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary') {
      return colors.primary;
    }
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
});

export default Button;

