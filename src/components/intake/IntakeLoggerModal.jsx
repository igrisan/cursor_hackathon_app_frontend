import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TextInput } from 'react-native';
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
import Input from '../common/Input';
import { colors, spacing, borderRadius, typography } from '../../utils/theme';
import { INTAKE_INTENSITY, INTAKE_CONTEXT } from '../../utils/constants';
import { formatDateTime } from '../../utils/helpers';

const IntakeLoggerModal = ({ visible, onClose, onSubmit }) => {
  const [puffCount, setPuffCount] = useState(1);
  const [intensity, setIntensity] = useState(INTAKE_INTENSITY.MEDIUM);
  const [context, setContext] = useState(INTAKE_CONTEXT.OTHER);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIntensity(INTAKE_INTENSITY.MEDIUM);
      setContext(INTAKE_CONTEXT.OTHER);
      setNotes('');
      onClose();
    }
  };

  const intensityOptions = [
    { label: 'Low', value: INTAKE_INTENSITY.LOW },
    { label: 'Medium', value: INTAKE_INTENSITY.MEDIUM },
    { label: 'High', value: INTAKE_INTENSITY.HIGH },
  ];

  const contextOptions = [
    { label: 'Stress', value: INTAKE_CONTEXT.STRESS },
    { label: 'Social', value: INTAKE_CONTEXT.SOCIAL },
    { label: 'Break', value: INTAKE_CONTEXT.BREAK },
    { label: 'Boredom', value: INTAKE_CONTEXT.BOREDOM },
    { label: 'After Meal', value: INTAKE_CONTEXT.AFTER_MEAL },
    { label: 'Morning', value: INTAKE_CONTEXT.MORNING },
    { label: 'Other', value: INTAKE_CONTEXT.OTHER },
  ];

  return (
    <Modal visible={visible} onClose={onClose} title="Log Intake">
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.timestamp}>{formatDateTime(new Date())}</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Puff Count</Text>
            <View style={styles.puffCountContainer}>
              <Button
                title="-"
                onPress={() => {
                  if (puffCount > 1) {
                    triggerHaptic('light');
                    setPuffCount(puffCount - 1);
                  }
                }}
                variant="secondary"
                size="sm"
                style={styles.countButton}
                disabled={puffCount <= 1}
              />
              <TextInput
                style={styles.puffCountInput}
                value={String(puffCount)}
                onChangeText={(text) => {
                  const num = parseInt(text) || 1;
                  if (num >= 1 && num <= 100) {
                    setPuffCount(num);
                  }
                }}
                keyboardType="number-pad"
                textAlign="center"
              />
              <Button
                title="+"
                onPress={() => {
                  if (puffCount < 100) {
                    triggerHaptic('light');
                    setPuffCount(puffCount + 1);
                  }
                }}
                variant="secondary"
                size="sm"
                style={styles.countButton}
                disabled={puffCount >= 100}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Intensity</Text>
            <View style={styles.segmentedControl}>
              {intensityOptions.map((option) => (
                <Button
                  key={option.value}
                  title={option.label}
                  onPress={() => {
                    triggerHaptic('light');
                    setIntensity(option.value);
                  }}
                  variant={intensity === option.value ? 'primary' : 'secondary'}
                  size="sm"
                  style={styles.segmentButton}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Context</Text>
            <View style={styles.contextGrid}>
              {contextOptions.map((option) => (
                <Button
                  key={option.value}
                  title={option.label}
                  onPress={() => {
                    triggerHaptic('light');
                    setContext(option.value);
                  }}
                  variant={context === option.value ? 'primary' : 'secondary'}
                  size="sm"
                  style={styles.contextButton}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Input
              label="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="secondary"
              style={styles.cancelButton}
            />
            <Button
              title="Log Intake"
              onPress={handleSubmit}
              loading={isSubmitting}
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
  timestamp: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  puffCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  countButton: {
    width: 44,
    minHeight: 44,
  },
  puffCountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  contextGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  contextButton: {
    flex: 1,
    minWidth: '30%',
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segmentButton: {
    flex: 1,
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

