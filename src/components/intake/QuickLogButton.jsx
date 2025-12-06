import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, shadows } from '../../utils/theme';

const QuickLogButton = ({ onPress }) => {
  const handlePress = () => {
    // Haptics only work on native devices
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons name="plus" size={28} color={colors.background} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
    zIndex: 1000,
  },
});

export default QuickLogButton;

