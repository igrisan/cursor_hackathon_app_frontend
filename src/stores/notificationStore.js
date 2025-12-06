import { create } from 'zustand';
import { notificationService } from '../services/notification.service';
import { storageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../utils/constants';

export const useNotificationStore = create((set, get) => ({
  pushToken: null,
  permissions: null,
  scheduledNotifications: [],
  isLoading: false,
  error: null,

  registerForPushNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await notificationService.registerForPushNotifications();
      
      if (token) {
        await storageService.setItem(STORAGE_KEYS.NOTIFICATION_TOKEN, token);
        set({
          pushToken: token,
          permissions: 'granted',
          isLoading: false,
        });
        return { success: true, token };
      } else {
        set({
          permissions: 'denied',
          isLoading: false,
        });
        return { success: false, error: 'Permissions denied' };
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to register for notifications';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  scheduleCravingAlert: async (predictedTime, strategies) => {
    try {
      const notificationId = await notificationService.scheduleCravingAlert(predictedTime, strategies);
      const updated = [...get().scheduledNotifications, { id: notificationId, type: 'craving_prediction' }];
      set({ scheduledNotifications: updated });
      return { success: true, notificationId };
    } catch (error) {
      const errorMessage = error.message || 'Failed to schedule craving alert';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  scheduleDailyCheckin: async (type = 'morning') => {
    try {
      const notificationId = await notificationService.scheduleDailyCheckin(type);
      const updated = [...get().scheduledNotifications, { id: notificationId, type: 'daily_checkin' }];
      set({ scheduledNotifications: updated });
      return { success: true, notificationId };
    } catch (error) {
      const errorMessage = error.message || 'Failed to schedule daily checkin';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  scheduleMilestoneNotification: async (milestone) => {
    try {
      const notificationId = await notificationService.scheduleMilestoneNotification(milestone);
      const updated = [...get().scheduledNotifications, { id: notificationId, type: 'milestone' }];
      set({ scheduledNotifications: updated });
      return { success: true, notificationId };
    } catch (error) {
      const errorMessage = error.message || 'Failed to schedule milestone notification';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  clearAllNotifications: async () => {
    try {
      await notificationService.cancelAllNotifications();
      set({ scheduledNotifications: [] });
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Failed to clear notifications';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  loadScheduledNotifications: async () => {
    try {
      const notifications = await notificationService.getScheduledNotifications();
      set({ scheduledNotifications: notifications });
      return notifications;
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
      return [];
    }
  },

  loadStoredToken: async () => {
    const token = await storageService.getItem(STORAGE_KEYS.NOTIFICATION_TOKEN);
    if (token) {
      set({ pushToken: token });
    }
    return token;
  },

  clearError: () => set({ error: null }),
}));

