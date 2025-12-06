import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors, spacing, typography, borderRadius, shadows, withOpacity } from '../../utils/theme';
import { validateEmail } from '../../utils/helpers';

const { height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isLoading, error } = useAuthStore();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Branding */}
          <Animated.View 
            style={[
              styles.brandingContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="lungs" size={40} color={colors.primary} />
            </View>
            <Text style={styles.appName}>SmokeLess AI</Text>
          </Animated.View>

          {/* Registration Card */}
          <Animated.View 
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>Start your smoke-free journey today</Text>

            <View style={styles.form}>
              <Input
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your full name"
                autoCapitalize="words"
                error={errors.name}
                leftIcon="account-outline"
              />

              <Input
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                leftIcon="email-outline"
              />

              <Input
                label="Password"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                error={errors.password}
                leftIcon="lock-outline"
                rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <Input
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                error={errors.confirmPassword}
                leftIcon="lock-check-outline"
                rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              {error && (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color={colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={isLoading}
                fullWidth
                size="lg"
                style={styles.signUpButton}
                gradient
              />
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.xl,
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.text.inverse,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    ...shadows.xl,
  },
  welcomeText: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
  },
  signUpButton: {
    marginTop: spacing.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: withOpacity(colors.danger, 0.1),
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption.fontSize,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  footerText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  linkText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default RegisterScreen;
