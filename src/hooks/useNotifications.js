import { useEffect } from 'react';
import { useNotificationStore } from '../stores/notificationStore';
import { ENABLE_NOTIFICATIONS } from '../utils/constants';

export const useNotifications = (autoRegister = true) => {
  const notificationStore = useNotificationStore();

  useEffect(() => {
    if (autoRegister && ENABLE_NOTIFICATIONS) {
      notificationStore.loadStoredToken();
      if (!notificationStore.pushToken) {
        notificationStore.registerForPushNotifications();
      }
    }
  }, [autoRegister]);

  return notificationStore;
};

