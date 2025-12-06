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

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  
  const { register, isLoading, error } = useAuthStore();

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'Please try again');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your smoke-free journey today</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter your full name"
              autoCapitalize="words"
              error={errors.name}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
            />

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Sign Up"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('Login')}
              >
                Sign In
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
    paddingVertical: spacing.xl,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
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

export default RegisterScreen;

