import { Platform } from 'react-native';

// Modern, warm color palette for a wellness/health app
export const colors = {
  // Primary gradient colors
  primary: '#6366F1',        // Indigo
  primaryDark: '#4F46E5',    // Darker indigo
  primaryLight: '#818CF8',   // Lighter indigo
  
  // Accent colors
  accent: '#F472B6',         // Pink
  accentLight: '#F9A8D4',
  
  // Semantic colors
  success: '#10B981',        // Emerald
  successLight: '#34D399',
  warning: '#F59E0B',        // Amber
  warningLight: '#FBBF24',
  danger: '#EF4444',         // Red
  dangerLight: '#F87171',
  
  // Neutrals
  neutral: '#64748B',        // Slate
  neutralLight: '#94A3B8',
  neutralDark: '#475569',
  
  // Backgrounds
  background: '#FAFBFC',
  backgroundDark: '#0F172A',
  surface: '#FFFFFF',
  surfaceHover: '#F8FAFC',
  
  // Text
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },
  
  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',
  
  // Gradients (for LinearGradient)
  gradients: {
    primary: ['#6366F1', '#8B5CF6', '#A855F7'],
    sunset: ['#F472B6', '#FB7185', '#F97316'],
    ocean: ['#06B6D4', '#3B82F6', '#6366F1'],
    success: ['#10B981', '#34D399'],
    card: ['#FFFFFF', '#F8FAFC'],
  },
};

export const typography = {
  // Display - for hero text
  display: { fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  
  // Headings
  h1: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '600', letterSpacing: -0.2 },
  h4: { fontSize: 18, fontWeight: '600' },
  
  // Body text
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' },
  bodySemibold: { fontSize: 16, fontWeight: '600' },
  
  // Smaller text
  caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  captionMedium: { fontSize: 14, fontWeight: '500' },
  small: { fontSize: 12, fontWeight: '400' },
  smallMedium: { fontSize: 12, fontWeight: '500' },
  
  // Special
  stat: { fontSize: 48, fontWeight: '700', letterSpacing: -1 },
  statSmall: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

// Web-compatible shadows
const createShadow = (offset, blur, opacity, spread = 0) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0px ${offset}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`,
    };
  }
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: offset },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation: Math.max(1, Math.floor(blur / 2)),
  };
};

export const shadows = {
  none: {},
  xs: createShadow(1, 2, 0.03),
  sm: createShadow(2, 4, 0.06),
  md: createShadow(4, 8, 0.08),
  lg: createShadow(8, 16, 0.1),
  xl: createShadow(12, 24, 0.12),
  
  // Colored shadows
  primary: Platform.OS === 'web' 
    ? { boxShadow: '0px 8px 24px rgba(99, 102, 241, 0.25)' }
    : { shadowColor: '#6366F1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 24, elevation: 12 },
  
  success: Platform.OS === 'web'
    ? { boxShadow: '0px 8px 24px rgba(16, 185, 129, 0.25)' }
    : { shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 24, elevation: 12 },
};

// Animation presets
export const animations = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: {
    damping: 15,
    stiffness: 150,
  },
};

// Common component styles
export const componentStyles = {
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenPadding: {
    paddingHorizontal: spacing.lg,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};
