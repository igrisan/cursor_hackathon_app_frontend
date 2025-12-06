export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
export const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || 'SmokeLess AI';
export const ENABLE_NOTIFICATIONS = process.env.EXPO_PUBLIC_ENABLE_NOTIFICATIONS === 'true';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  OFFLINE_QUEUE: 'offline_queue',
  CACHED_LOGS: 'cached_logs',
  NOTIFICATION_TOKEN: 'notification_token',
};

export const INTAKE_INTENSITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const INTAKE_CONTEXT = {
  STRESS: 'stress',
  SOCIAL: 'social',
  BREAK: 'break',
  BOREDOM: 'boredom',
  AFTER_MEAL: 'after_meal',
  MORNING: 'morning',
  OTHER: 'other',
};

export const NOTIFICATION_TYPES = {
  CRAVING_PREDICTION: 'craving_prediction',
  DAILY_CHECKIN: 'daily_checkin',
  MILESTONE: 'milestone',
  COACH_TIP: 'coach_tip',
};

export const CHART_COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  gradient: ['#3B82F6', '#10B981'],
};

