import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { colors, spacing, typography } from '../../utils/theme';

const ProfileScreen = () => {
  const { user, logout, updateProfile } = useAuthStore();
  const { pushToken, registerForPushNotifications, permissions } = useNotificationStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(!!pushToken);

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
      onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon'),
    },
    {
      icon: 'bell',
      title: 'Notifications',
      rightComponent: (
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ false: colors.neutral, true: colors.primary }}
        />
      ),
    },
    {
      icon: 'help-circle',
      title: 'Help & Support',
      onPress: () => Alert.alert('Help', 'Contact support at support@smokeless.ai'),
    },
    {
      icon: 'shield-check',
      title: 'Privacy Policy',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy content...'),
    },
    {
      icon: 'file-document',
      title: 'Terms of Service',
      onPress: () => Alert.alert('Terms', 'Terms of service content...'),
    },
    {
      icon: 'information',
      title: 'About',
      onPress: () => Alert.alert('About', 'SmokeLess AI v1.0.0'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account" size={48} color={colors.primary} />
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        </View>

        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              disabled={!item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              {item.rightComponent || (
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={colors.neutral}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            fullWidth
          />
        </View>
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
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  section: {
    marginBottom: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
});

export default ProfileScreen;

