import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Global error handler
    const errorHandler = (e) => {
      console.error('App Error:', e);
      setError(e.message || 'Unknown error');
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('error', errorHandler);
      return () => window.removeEventListener('error', errorHandler);
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

