import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors, spacing, typography } from '../../utils/theme';
import { validateEmail } from '../../utils/helpers';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const { login, isLoading, error } = useAuthStore();

  const validate = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const result = await login(email.trim(), password);
    
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Please check your credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('Register')}
              >
                Sign Up
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl * 2,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  linkText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: '600',
  },
  errorContainer: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.danger + '10',
    borderRadius: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption.fontSize,
  },
});

export default LoginScreen;

