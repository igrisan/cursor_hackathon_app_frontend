export const colors = {
  primary: '#3B82F6',      // Blue
  success: '#10B981',      // Green
  warning: '#F59E0B',      // Amber
  danger: '#EF4444',       // Red
  neutral: '#6B7280',      // Gray
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  },
  border: '#E5E7EB',
  divider: '#E5E7EB',
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '600' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

import { Platform } from 'react-native';

// Web-compatible shadows using boxShadow
const createShadow = (offset, blur, opacity) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0px ${offset}px ${blur}px rgba(0, 0, 0, ${opacity})`,
    };
  }
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: offset },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation: blur,
  };
};

export const shadows = {
  sm: createShadow(1, 2, 0.05),
  md: createShadow(2, 4, 0.1),
  lg: createShadow(4, 8, 0.15),
};

