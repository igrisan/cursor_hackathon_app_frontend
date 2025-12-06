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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading, error } = useAuthStore();
  
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
              <MaterialCommunityIcons name="lungs" size={48} color={colors.primary} />
            </View>
            <Text style={styles.appName}>SmokeLess AI</Text>
            <Text style={styles.tagline}>Your journey to a healthier life</Text>
          </Animated.View>

          {/* Login Card */}
          <Animated.View 
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your progress</Text>

            <View style={styles.form}>
              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                leftIcon="email-outline"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                error={errors.password}
                leftIcon="lock-outline"
                rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {error && (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color={colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                size="lg"
                style={styles.signInButton}
                gradient
              />

              {/* Demo credentials hint */}
              <View style={styles.demoHint}>
                <MaterialCommunityIcons name="information-outline" size={16} color={colors.neutral} />
                <Text style={styles.demoHintText}>
                  Demo: test@smokeless.ai / password123
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Sign Up</Text>
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
    height: height * 0.45,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.xl,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: typography.body.fontSize,
    color: 'rgba(255, 255, 255, 0.85)',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  forgotPasswordText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    fontWeight: '600',
  },
  signInButton: {
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
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  demoHintText: {
    fontSize: typography.small.fontSize,
    color: colors.text.muted,
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

export default LoginScreen;
