import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Animated,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { useIntakeStore } from '../../stores/intakeStore';
import Card from '../../components/common/Card';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { calculateStreak, calculateTotalPuffs } from '../../utils/helpers';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { pushToken, registerForPushNotifications } = useNotificationStore();
  const { logs } = useIntakeStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(!!pushToken);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Calculate stats
  const safeLogs = logs || [];
  const streak = calculateStreak(safeLogs);
  const totalPuffs = calculateTotalPuffs(safeLogs);
  const totalSessions = safeLogs.length;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleToggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    if (value && !pushToken) {
      await registerForPushNotifications();
    }
  };

  const menuItems = [
    {
      icon: 'account-edit',
      title: 'Edit Profile',
      subtitle: 'Update your information',
      onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon'),
    },
    {
      icon: 'bell-outline',
      title: 'Notifications',
      subtitle: notificationsEnabled ? 'Enabled' : 'Disabled',
      rightComponent: (
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ false: colors.border, true: colors.primary + '50' }}
          thumbColor={notificationsEnabled ? colors.primary : colors.neutral}
        />
      ),
    },
    {
      icon: 'target',
      title: 'Goals & Targets',
      subtitle: 'Set your reduction goals',
      onPress: () => Alert.alert('Coming Soon', 'Goal setting will be available soon'),
    },
    {
      icon: 'export',
      title: 'Export Data',
      subtitle: 'Download your progress data',
      onPress: () => Alert.alert('Export', 'Your data export has been prepared'),
    },
  ];

  const supportItems = [
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => Alert.alert('Help', 'Contact support at support@smokeless.ai'),
    },
    {
      icon: 'shield-check-outline',
      title: 'Privacy Policy',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy content...'),
    },
    {
      icon: 'file-document-outline',
      title: 'Terms of Service',
      onPress: () => Alert.alert('Terms', 'Terms of service content...'),
    },
    {
      icon: 'information-outline',
      title: 'About',
      subtitle: 'SmokeLess AI v1.0.0',
      onPress: () => Alert.alert('About', 'SmokeLess AI v1.0.0\n\nBuilt with ❤️ for a healthier you'),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={40} color={colors.primary} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <MaterialCommunityIcons name="camera" size={16} color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <Card style={styles.statCard} variant="elevated">
            <MaterialCommunityIcons name="fire" size={24} color={colors.warning} />
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <MaterialCommunityIcons name="clipboard-check" size={24} color={colors.success} />
            <Text style={styles.statValue}>{totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <MaterialCommunityIcons name="chart-timeline" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{totalPuffs}</Text>
            <Text style={styles.statLabel}>Total Puffs</Text>
          </Card>
        </Animated.View>

        {/* Settings Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.menuCard} variant="outlined">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index !== menuItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
                disabled={!item.onPress}
              >
                <View style={[styles.menuIcon, { backgroundColor: colors.primary + '10' }]}>
                  <MaterialCommunityIcons name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
                {item.rightComponent || (
                  <MaterialCommunityIcons name="chevron-right" size={22} color={colors.neutralLight} />
                )}
              </TouchableOpacity>
            ))}
          </Card>
        </Animated.View>

        {/* Support Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Card style={styles.menuCard} variant="outlined">
            {supportItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index !== supportItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
              >
                <View style={[styles.menuIcon, { backgroundColor: colors.neutral + '15' }]}>
                  <MaterialCommunityIcons name={item.icon} size={20} color={colors.neutral} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color={colors.neutralLight} />
              </TouchableOpacity>
            ))}
          </Card>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View style={[styles.logoutSection, { opacity: fadeAnim }]}>
          <Pressable
            onPress={handleLogout}
            onHoverIn={() => setIsLogoutHovered(true)}
            onHoverOut={() => setIsLogoutHovered(false)}
            style={[
              styles.logoutButton,
              isLogoutHovered && styles.logoutButtonHovered,
            ]}
          >
            <MaterialCommunityIcons 
              name="logout" 
              size={20} 
              color={isLogoutHovered ? colors.text.inverse : colors.danger} 
            />
            <Text style={[
              styles.logoutButtonText,
              isLogoutHovered && styles.logoutButtonTextHovered,
            ]}>
              Logout
            </Text>
          </Pressable>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  name: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.xl,
  },
  statValue: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.captionMedium.fontSize,
    fontWeight: typography.captionMedium.fontWeight,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: colors.text.primary,
  },
  menuSubtitle: {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    marginTop: 2,
  },
  logoutSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  logoutButtonHovered: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  logoutButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.danger,
  },
  logoutButtonTextHovered: {
    color: colors.text.inverse,
  },
});

export default ProfileScreen;
