import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Platform-specific global error handling
    if (Platform.OS === 'web') {
      // Web: use window error event
      const webHandler = (e) => {
        console.error('App Error:', e);
        setError(e.message || 'Unknown error');
      };
      window.addEventListener('error', webHandler);
      return () => window.removeEventListener('error', webHandler);
    } else {
      // Native: use React Native's ErrorUtils
      const originalHandler = global.ErrorUtils?.getGlobalHandler?.();
      const nativeHandler = (error, isFatal) => {
        console.error('App Error:', error, isFatal ? '(Fatal)' : '');
        setError(error?.message || 'Unknown error');
        // Preserve original handler for crash reporting
        originalHandler?.(error, isFatal);
      };
      global.ErrorUtils?.setGlobalHandler?.(nativeHandler);
      return () => {
        if (originalHandler) {
          global.ErrorUtils?.setGlobalHandler?.(originalHandler);
        }
      };
    }
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEE2E2',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#7F1D1D',
    textAlign: 'center',
  },
});

export default App;
