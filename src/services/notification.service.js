import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with your Expo project ID
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
    }

    // Send token to backend
    try {
      await api.post('/notifications/register', { token: token.data });
    } catch (error) {
      console.error('Error registering notification token:', error);
    }

    return token.data;
  },

  async scheduleNotification(notification) {
    const { title, body, data, trigger } = notification;
    
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: trigger || null,
    });
  },

  async scheduleCravingAlert(predictedTime, strategies) {
    const trigger = new Date(predictedTime);
    trigger.setMinutes(trigger.getMinutes() - 10); // 10 minutes before

    return await this.scheduleNotification({
      title: 'Craving Alert',
      body: `You might experience a craving soon. ${strategies?.[0] || 'Take a deep breath.'}`,
      data: {
        type: 'craving_prediction',
        strategies,
      },
      trigger,
    });
  },

  async scheduleDailyCheckin(type = 'morning') {
    const trigger = type === 'morning' 
      ? { hour: 9, minute: 0, repeats: true }
      : { hour: 20, minute: 0, repeats: true };

    return await this.scheduleNotification({
      title: type === 'morning' ? 'Good Morning!' : 'Evening Reflection',
      body: type === 'morning' 
        ? 'Start your day with a positive mindset. You\'ve got this!'
        : 'How did your day go? Take a moment to reflect on your progress.',
      data: {
        type: 'daily_checkin',
        checkinType: type,
      },
      trigger,
    });
  },

  async scheduleMilestoneNotification(milestone) {
    return await this.scheduleNotification({
      title: '🎉 Milestone Achieved!',
      body: `Congratulations! You've been smoke-free for ${milestone.duration}. Keep it up!`,
      data: {
        type: 'milestone',
        milestone,
      },
      trigger: null, // Immediate
    });
  },

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async cancelNotification(notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  },

  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  },
};

