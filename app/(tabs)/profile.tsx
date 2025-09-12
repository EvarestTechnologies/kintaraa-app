import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import {
  User,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  Edit,
  Eye,
  EyeOff,
  Fingerprint,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout, updateUser, biometricAvailable } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleToggleBiometric = () => {
    if (!biometricAvailable) {
      Alert.alert(
        'Biometric Authentication Unavailable',
        'Your device does not support biometric authentication or it is not set up.'
      );
      return;
    }

    updateUser({ biometricEnabled: !user?.biometricEnabled });
  };

  const profileSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'edit-profile',
          title: 'Edit Profile',
          icon: Edit,
          onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon.'),
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          icon: user?.isAnonymous ? EyeOff : Eye,
          subtitle: user?.isAnonymous ? 'Anonymous Mode' : 'Public Profile',
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon.'),
        },
        {
          id: 'biometric',
          title: 'Biometric Authentication',
          icon: Fingerprint,
          subtitle: user?.biometricEnabled ? 'Enabled' : 'Disabled',
          onPress: handleToggleBiometric,
          disabled: !biometricAvailable,
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          id: 'security',
          title: 'Security Settings',
          icon: Shield,
          onPress: () => Alert.alert('Coming Soon', 'Security settings will be available soon.'),
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: Bell,
          onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon.'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          icon: HelpCircle,
          onPress: () => Alert.alert('Coming Soon', 'Help center will be available soon.'),
        },
        {
          id: 'settings',
          title: 'App Settings',
          icon: Settings,
          onPress: () => Alert.alert('Coming Soon', 'App settings will be available soon.'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <User color="#6A2CB0" size={32} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.isAnonymous 
                ? 'Anonymous User' 
                : `${user?.firstName} ${user?.lastName}`
              }
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>
                {user?.role === 'survivor' ? 'Survivor' : 'Healthcare Provider'}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionItems}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.sectionItem,
                    item.disabled && styles.sectionItemDisabled,
                  ]}
                  onPress={item.onPress}
                  disabled={item.disabled}
                  testID={`profile-${item.id}`}
                >
                  <View style={styles.sectionItemIcon}>
                    <item.icon 
                      color={item.disabled ? '#D8CEE8' : '#6A2CB0'} 
                      size={20} 
                    />
                  </View>
                  <View style={styles.sectionItemContent}>
                    <Text 
                      style={[
                        styles.sectionItemTitle,
                        item.disabled && styles.sectionItemTitleDisabled,
                      ]}
                    >
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <Text 
                        style={[
                          styles.sectionItemSubtitle,
                          item.disabled && styles.sectionItemSubtitleDisabled,
                        ]}
                      >
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            testID="logout-button"
          >
            <LogOut color="#E53935" size={20} />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Kintaraa v1.0.0</Text>
          <Text style={styles.appInfoText}>
            Your safety and privacy are our priority
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#341A52',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#49455A',
    marginBottom: 8,
  },
  userBadge: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  userBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  sectionItems: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0FF',
  },
  sectionItemDisabled: {
    opacity: 0.5,
  },
  sectionItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionItemContent: {
    flex: 1,
  },
  sectionItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 2,
  },
  sectionItemTitleDisabled: {
    color: '#D8CEE8',
  },
  sectionItemSubtitle: {
    fontSize: 14,
    color: '#49455A',
  },
  sectionItemSubtitleDisabled: {
    color: '#D8CEE8',
  },
  logoutSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E53935',
    gap: 8,
  },
  logoutButtonText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  appInfoText: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 16,
  },
});