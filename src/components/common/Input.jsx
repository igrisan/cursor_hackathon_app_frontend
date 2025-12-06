import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows, withOpacity } from '../../utils/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Get border color based on state (error takes precedence)
  const getBorderColor = () => {
    if (error) return colors.danger;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputWrapper,
          { borderColor: getBorderColor() },
          isFocused && styles.inputFocused,
          error && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
        ]}
      >
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.neutral}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            disabled && styles.inputDisabled,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {rightIcon && (
          onRightIconPress ? (
            <TouchableOpacity 
              onPress={onRightIconPress} 
              style={styles.rightIconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name={rightIcon}
                size={20}
                color={colors.neutral}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightIconButton}>
              <MaterialCommunityIcons
                name={rightIcon}
                size={20}
                color={colors.neutral}
              />
            </View>
          )
        )}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={14} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  labelError: {
    color: colors.danger,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  inputFocused: {
    ...shadows.sm,
    backgroundColor: colors.surface,
  },
  inputWrapperError: {
    borderColor: colors.danger,
    backgroundColor: withOpacity(colors.danger, 0.05),
  },
  inputWrapperDisabled: {
    backgroundColor: colors.surfaceHover,
    opacity: 0.7,
  },
  leftIcon: {
    marginLeft: spacing.md,
  },
  rightIconButton: {
    padding: spacing.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    minHeight: 48,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  inputDisabled: {
    color: colors.text.muted,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  errorText: {
    fontSize: typography.small.fontSize,
    color: colors.danger,
  },
});

export default Input;
