import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../utils/constants';

// Check if SecureStore is available (not available on web)
const isSecureStoreAvailable = Platform.OS !== 'web';

export const storageService = {
  // Secure storage for sensitive data (falls back to AsyncStorage on web)
  async setSecureItem(key, value) {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.setItemAsync(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
      return true;
    } catch (error) {
      console.error('Error setting secure item:', error);
      return false;
    }
  },

  async getSecureItem(key) {
    try {
      if (isSecureStoreAvailable) {
        return await SecureStore.getItemAsync(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error('Error getting secure item:', error);
      return null;
    }
  },

  async deleteSecureItem(key) {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
      return true;
    } catch (error) {
      console.error('Error deleting secure item:', error);
      return false;
    }
  },

  // AsyncStorage for non-sensitive data
  async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error('Error setting item:', error);
      return false;
    }
  },

  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  },

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },

  // Convenience methods for specific keys
  async setAuthToken(token) {
    return this.setSecureItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken() {
    return this.getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async removeAuthToken() {
    return this.deleteSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async setUserData(userData) {
    return this.setItem(STORAGE_KEYS.USER_DATA, userData);
  },

  async getUserData() {
    return this.getItem(STORAGE_KEYS.USER_DATA);
  },

  async removeUserData() {
    return this.removeItem(STORAGE_KEYS.USER_DATA);
  },

  async setOfflineQueue(queue) {
    return this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  },

  async getOfflineQueue() {
    return this.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || [];
  },

  async setCachedLogs(logs) {
    return this.setItem(STORAGE_KEYS.CACHED_LOGS, logs);
  },

  async getCachedLogs() {
    return this.getItem(STORAGE_KEYS.CACHED_LOGS) || [];
  },
};

