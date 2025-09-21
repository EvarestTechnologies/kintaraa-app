import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditSurvivorProfileModal from './EditSurvivorProfileModal';
import {
  Settings,
  Bell,
  Shield,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Edit3,
  LogOut,
  ChevronRight,
  User,
  Heart,
  FileText,
  Eye,
  EyeOff,
  Fingerprint,
  HelpCircle,
  Smartphone,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

export default function SurvivorProfile() {
  const { logout, user, biometricAvailable } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState<boolean>(true);
  const [anonymousMode, setAnonymousMode] = useState<boolean>(user?.isAnonymous || false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  // Mock survivor data
  const survivorData = {
    name: user?.isAnonymous
      ? 'Anonymous User'
      : (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Survivor'),
    email: user?.email || 'user@example.com',
    phone: '+256 700 000 000',
    emergencyContacts: user?.emergencyContacts?.length || 2,
    reportsSubmitted: 3,
    appointmentsScheduled: 5,
    wellbeingSessions: 12,
    joinDate: '2024-01-15',
    lastActive: new Date().toISOString(),
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    console.log('Survivor profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            console.log('Survivor logging out...');
            logout();
          }
        },
      ]
    );
  };

  const handleSettingsPress = (setting: string) => {
    Alert.alert(
      'Settings',
      `${setting} settings will be implemented in the next phase.`,
      [{ text: 'OK' }]
    );
  };

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const statsCards = [
    {
      title: 'Reports Submitted',
      value: survivorData.reportsSubmitted.toString(),
      icon: FileText,
      color: '#DC2626',
    },
    {
      title: 'Appointments',
      value: survivorData.appointmentsScheduled.toString(),
      icon: Calendar,
      color: '#3B82F6',
    },
    {
      title: 'Emergency Contacts',
      value: survivorData.emergencyContacts.toString(),
      icon: Phone,
      color: '#059669',
    },
    {
      title: 'Wellbeing Sessions',
      value: survivorData.wellbeingSessions.toString(),
      icon: Heart,
      color: '#8B5CF6',
    },
  ];

  const settingsOptions = [
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      icon: Bell,
      hasSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled,
    },
    {
      id: 'emergency-alerts',
      title: 'Emergency Alerts',
      subtitle: emergencyAlerts ? 'Critical alerts enabled' : 'Critical alerts disabled',
      icon: Shield,
      hasSwitch: true,
      switchValue: emergencyAlerts,
      onSwitchChange: setEmergencyAlerts,
    },
    {
      id: 'anonymous-mode',
      title: 'Anonymous Mode',
      subtitle: anonymousMode ? 'Identity hidden' : 'Identity visible',
      icon: anonymousMode ? EyeOff : Eye,
      hasSwitch: true,
      switchValue: anonymousMode,
      onSwitchChange: setAnonymousMode,
    },
    {
      id: 'biometric',
      title: 'Biometric Authentication',
      subtitle: user?.biometricEnabled ? 'Enabled' : 'Disabled',
      icon: Fingerprint,
      onPress: () => handleSettingsPress('Biometric Authentication'),
    },
    {
      id: 'app-settings',
      title: 'App Settings',
      subtitle: 'Language, theme, and preferences',
      icon: Settings,
      onPress: () => handleSettingsPress('App Settings'),
    },
  ];

  const quickActions = [
    {
      id: 'emergency-contacts',
      title: 'Emergency Contacts',
      subtitle: `${survivorData.emergencyContacts} contacts configured`,
      icon: Phone,
      onPress: () => handleNavigation('/(dashboard)/survivor/safety'),
    },
    {
      id: 'wellbeing',
      title: 'Wellbeing Resources',
      subtitle: 'Access mental health tools',
      icon: Heart,
      onPress: () => handleNavigation('/(dashboard)/survivor/wellbeing'),
    },
    {
      id: 'reports',
      title: 'My Reports',
      subtitle: 'View and manage your reports',
      icon: FileText,
      onPress: () => handleNavigation('/(dashboard)/survivor/reports'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: HelpCircle,
      onPress: () => handleNavigation('/emergency'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User color="#FFFFFF" size={32} />
          </View>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: anonymousMode ? '#F59E0B' : '#10B981' }
          ]} />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.survivorName}>{survivorData.name}</Text>
          <Text style={styles.survivorRole}>Survivor</Text>
          <Text style={styles.memberSince}>
            Member since {new Date(survivorData.joinDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}
          </Text>

          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: anonymousMode ? '#FEF3C7' : '#D1FAE5' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: anonymousMode ? '#92400E' : '#065F46' }
              ]}>
                {anonymousMode ? 'Anonymous' : 'Identified'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Edit3 color="#DC2626" size={20} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Activity</Text>
        <View style={styles.statsGrid}>
          {statsCards.map((stat) => (
            <View key={stat.title} style={styles.statCard}>
              <View style={[
                styles.statIconContainer,
                { backgroundColor: `${stat.color}20` }
              ]}>
                <stat.icon color={stat.color} size={20} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsCard}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionItem,
                index === quickActions.length - 1 && styles.actionItemLast
              ]}
              onPress={action.onPress}
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIconContainer}>
                  <action.icon color="#DC2626" size={20} />
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
              </View>
              <ChevronRight color="#9CA3AF" size={20} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactItem}>
            <Mail color="#6B7280" size={20} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{survivorData.email}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Phone color="#6B7280" size={20} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>
                {anonymousMode ? 'Hidden for privacy' : survivorData.phone}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Settings</Text>
        <View style={styles.settingsCard}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.settingItem,
                index === settingsOptions.length - 1 && styles.settingItemLast
              ]}
              onPress={option.onPress}
              disabled={option.hasSwitch}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <option.icon color="#DC2626" size={20} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                </View>
              </View>

              <View style={styles.settingRight}>
                {option.hasSwitch ? (
                  <Switch
                    value={option.switchValue}
                    onValueChange={option.onSwitchChange}
                    trackColor={{ false: '#E5E7EB', true: '#DC2626' }}
                    thumbColor={option.switchValue ? '#FFFFFF' : '#F3F4F6'}
                  />
                ) : (
                  <ChevronRight color="#9CA3AF" size={20} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut color="#EF4444" size={20} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Kintaraa v1.0.0</Text>
          <Text style={styles.appInfoText}>Your safety and privacy are our priority</Text>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <EditSurvivorProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={handleEditSuccess}
        currentData={survivorData}
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF2F2',
  },
  scrollContent: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  survivorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7F1D1D',
    marginBottom: 2,
  },
  survivorRole: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7F1D1D',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#7F1D1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7F1D1D',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#7F1D1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionItemLast: {
    borderBottomWidth: 0,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F1D1D',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#7F1D1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 16,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#7F1D1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F1D1D',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  settingRight: {
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#7F1D1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  appInfoText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
});