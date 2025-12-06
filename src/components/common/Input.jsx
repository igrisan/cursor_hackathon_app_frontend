import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../utils/theme';

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
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.inputMultiline,
          disabled && styles.inputDisabled,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={!disabled}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    backgroundColor: colors.background,
    minHeight: 44,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  errorText: {
    fontSize: typography.small.fontSize,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});

export default Input;

