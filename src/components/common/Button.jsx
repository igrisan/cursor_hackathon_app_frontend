import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows, withOpacity } from '../../utils/theme';

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
  leftIcon,
  rightIcon,
  gradient = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: gradient ? 'transparent' : colors.primary,
          borderColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: withOpacity(colors.primary, 0.1),
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.border,
          borderWidth: 1.5,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
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
          iconSize: 16,
          minHeight: 36,
        };
      case 'lg':
        return {
          paddingVertical: spacing.md + 2,
          paddingHorizontal: spacing.xl,
          fontSize: typography.body.fontSize,
          iconSize: 22,
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          fontSize: typography.body.fontSize,
          iconSize: 20,
          minHeight: 48,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary') return colors.primary;
    if (variant === 'outline') return colors.text.primary;
    if (variant === 'ghost') return colors.primary;
    return '#FFFFFF';
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();
  const textColor = getTextColor();

  const buttonContent = (
    <View style={styles.contentContainer}>
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {leftIcon && (
            <MaterialCommunityIcons
              name={leftIcon}
              size={sizeStyles.iconSize}
              color={textColor}
              style={styles.leftIcon}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: textColor, fontSize: sizeStyles.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && (
            <MaterialCommunityIcons
              name={rightIcon}
              size={sizeStyles.iconSize}
              color={textColor}
              style={styles.rightIcon}
            />
          )}
        </>
      )}
    </View>
  );

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            {
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              minHeight: sizeStyles.minHeight,
            },
            (disabled || loading) && styles.disabled,
            shadows.primary,
          ]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          minHeight: sizeStyles.minHeight,
        },
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        variant === 'primary' && !gradient && shadows.sm,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
});

export default Button;
