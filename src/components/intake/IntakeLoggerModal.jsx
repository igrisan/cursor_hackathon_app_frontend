import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform, 
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Helper function to trigger haptics only on native
const triggerHaptic = (type = 'impact') => {
  if (Platform.OS === 'web') return;
  if (type === 'impact') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } else if (type === 'success') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } else if (type === 'light') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

import Modal from '../common/Modal';
import Button from '../common/Button';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/theme';
import { INTAKE_INTENSITY, INTAKE_CONTEXT } from '../../utils/constants';
import { formatDateTime } from '../../utils/helpers';

const IntakeLoggerModal = ({ visible, onClose, onSubmit }) => {
  const [puffCount, setPuffCount] = useState(1);
  const [puffCountInput, setPuffCountInput] = useState('1'); // Separate state for text input
  const [intensity, setIntensity] = useState(INTAKE_INTENSITY.MEDIUM);
  const [context, setContext] = useState(INTAKE_CONTEXT.OTHER);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePuffChange = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = async () => {
    triggerHaptic('impact');
    setIsSubmitting(true);
    
    const intakeData = {
      puffCount: parseInt(puffCount),
      intensity,
      context,
      notes: notes.trim(),
      timestamp: new Date().toISOString(),
    };

    const result = await onSubmit(intakeData);
    setIsSubmitting(false);

    if (result.success) {
      triggerHaptic('success');
      // Reset form
      setPuffCount(1);
      setPuffCountInput('1');
      setIntensity(INTAKE_INTENSITY.MEDIUM);
      setContext(INTAKE_CONTEXT.OTHER);
      setNotes('');
      onClose();
    }
  };

  const intensityOptions = [
    { label: 'Low', value: INTAKE_INTENSITY.LOW, color: colors.success, icon: 'leaf' },
    { label: 'Medium', value: INTAKE_INTENSITY.MEDIUM, color: colors.warning, icon: 'fire' },
    { label: 'High', value: INTAKE_INTENSITY.HIGH, color: colors.danger, icon: 'fire-alert' },
  ];

  const contextOptions = [
    { label: 'Stress', value: INTAKE_CONTEXT.STRESS, icon: 'lightning-bolt' },
    { label: 'Social', value: INTAKE_CONTEXT.SOCIAL, icon: 'account-group' },
    { label: 'Break', value: INTAKE_CONTEXT.BREAK, icon: 'coffee' },
    { label: 'Boredom', value: INTAKE_CONTEXT.BOREDOM, icon: 'clock-outline' },
    { label: 'After Meal', value: INTAKE_CONTEXT.AFTER_MEAL, icon: 'food' },
    { label: 'Morning', value: INTAKE_CONTEXT.MORNING, icon: 'weather-sunny' },
    { label: 'Other', value: INTAKE_CONTEXT.OTHER, icon: 'dots-horizontal' },
  ];

  return (
    <Modal visible={visible} onClose={onClose} title="Log Intake">
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Timestamp */}
          <View style={styles.timestampContainer}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.neutral} />
            <Text style={styles.timestamp}>{formatDateTime(new Date())}</Text>
          </View>

          {/* Puff Count Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How many puffs?</Text>
            <View style={styles.puffCountContainer}>
              <TouchableOpacity
                style={[styles.countButton, puffCount <= 1 && styles.countButtonDisabled]}
                onPress={() => {
                  if (puffCount > 1) {
                    triggerHaptic('light');
                    animatePuffChange();
                    const newValue = puffCount - 1;
                    setPuffCount(newValue);
                    setPuffCountInput(String(newValue));
                  }
                }}
                disabled={puffCount <= 1}
              >
                <MaterialCommunityIcons 
                  name="minus" 
                  size={24} 
                  color={puffCount <= 1 ? colors.neutralLight : colors.primary} 
                />
              </TouchableOpacity>
              
              <Animated.View style={[styles.puffCountDisplay, { transform: [{ scale: scaleAnim }] }]}>
                <TextInput
                  style={styles.puffCountInput}
                  value={puffCountInput}
                  onChangeText={(text) => {
                    // Allow user to type freely (only digits)
                    const cleanedText = text.replace(/[^0-9]/g, '');
                    setPuffCountInput(cleanedText);
                  }}
                  onBlur={() => {
                    // Validate and clamp on blur
                    const num = parseInt(puffCountInput) || 1;
                    const clamped = Math.min(100, Math.max(1, num));
                    setPuffCount(clamped);
                    setPuffCountInput(String(clamped));
                    // Animate if the clamped value differs from current state
                    if (clamped !== puffCount) {
                      animatePuffChange();
                    }
                  }}
                  keyboardType="number-pad"
                  textAlign="center"
                  maxLength={3}
                />
                <Text style={styles.puffCountLabel}>puffs</Text>
              </Animated.View>
              
              <TouchableOpacity
                style={[styles.countButton, puffCount >= 100 && styles.countButtonDisabled]}
                onPress={() => {
                  if (puffCount < 100) {
                    triggerHaptic('light');
                    animatePuffChange();
                    const newValue = puffCount + 1;
                    setPuffCount(newValue);
                    setPuffCountInput(String(newValue));
                  }
                }}
                disabled={puffCount >= 100}
              >
                <MaterialCommunityIcons 
                  name="plus" 
                  size={24} 
                  color={puffCount >= 100 ? colors.neutralLight : colors.primary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Intensity Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intensity</Text>
            <View style={styles.intensityContainer}>
              {intensityOptions.map((option) => {
                const isSelected = intensity === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.intensityOption,
                      isSelected && { backgroundColor: option.color + '15', borderColor: option.color },
                    ]}
                    onPress={() => {
                      triggerHaptic('light');
                      setIntensity(option.value);
                    }}
                  >
                    <MaterialCommunityIcons 
                      name={option.icon} 
                      size={20} 
                      color={isSelected ? option.color : colors.neutral} 
                    />
                    <Text style={[
                      styles.intensityText,
                      isSelected && { color: option.color, fontWeight: '600' }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Context Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What triggered this?</Text>
            <View style={styles.contextGrid}>
              {contextOptions.map((option) => {
                const isSelected = context === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.contextOption,
                      isSelected && styles.contextOptionSelected,
                    ]}
                    onPress={() => {
                      triggerHaptic('light');
                      setContext(option.value);
                    }}
                  >
                    <MaterialCommunityIcons 
                      name={option.icon} 
                      size={18} 
                      color={isSelected ? colors.primary : colors.neutral} 
                    />
                    <Text style={[
                      styles.contextText,
                      isSelected && styles.contextTextSelected,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Notes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="How are you feeling? Any triggers?"
              placeholderTextColor={colors.text.muted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="ghost"
              style={styles.cancelButton}
            />
            <Button
              title="Log Intake"
              onPress={handleSubmit}
              loading={isSubmitting}
              gradient
              leftIcon="check"
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: '80%',
  },
  container: {
    paddingBottom: spacing.lg,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceHover,
    borderRadius: borderRadius.md,
  },
  timestamp: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  puffCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  countButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  countButtonDisabled: {
    backgroundColor: colors.surfaceHover,
    ...shadows.none,
  },
  puffCountDisplay: {
    alignItems: 'center',
    minWidth: 100,
  },
  puffCountInput: {
    fontSize: typography.stat.fontSize,
    fontWeight: typography.stat.fontWeight,
    color: colors.text.primary,
    textAlign: 'center',
    width: 100,
  },
  puffCountLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    marginTop: -spacing.xs,
  },
  intensityContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  intensityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  intensityText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  contextGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  contextOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  contextOptionSelected: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },
  contextText: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  contextTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  notesInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default IntakeLoggerModal;
