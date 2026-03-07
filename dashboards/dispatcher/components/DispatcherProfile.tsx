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
import { LinearGradient } from 'expo-linear-gradient';
import {
  Settings,
  Bell,
  Shield,
  Calendar,
  Clock,
  Award,
  Star,
  Phone,
  Mail,
  MapPin,
  LogOut,
  ChevronRight,
  Activity,
  Users,
  TrendingUp,
  LayoutDashboard,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useIncidents } from '@/providers/IncidentProvider';
import { router } from 'expo-router';

export default function DispatcherProfile() {
  const { user, logout } = useAuth();
  const { incidents } = useIncidents();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [onDutyStatus, setOnDutyStatus] = useState<boolean>(true);

  // Calculate dispatcher stats
  const stats = {
    totalCasesHandled: incidents.length,
    assignmentsToday: incidents.filter(i => {
      const today = new Date().toDateString();
      return new Date(i.createdAt).toDateString() === today;
    }).length,
    avgResponseTime: '15 min',
    successRate: 95,
  };

  const dispatcherData = {
    name: user?.fullName || 'John Dispatcher',
    title: 'Senior Dispatch Coordinator',
    employeeId: 'DISP-2024-001',
    department: 'Emergency Response',
    joinDate: '2020-01-15',
    phone: '+254 712 345 999',
    email: user?.email || 'dispatcher@kintara.com',
    location: 'Nairobi Command Center',
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const handleSettingsPress = (setting: string) => {
    Alert.alert(
      'Settings',
      `${setting} settings will be implemented in the next phase.`,
      [{ text: 'OK' }]
    );
  };

  const performanceCards = [
    {
      title: 'Cases Handled',
      value: stats.totalCasesHandled.toString(),
      icon: LayoutDashboard,
      color: '#6A2CB0',
    },
    {
      title: 'Today',
      value: stats.assignmentsToday.toString(),
      icon: Activity,
      color: '#E24B95',
    },
    {
      title: 'Avg Response',
      value: stats.avgResponseTime,
      icon: Clock,
      color: '#FF6B35',
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: '#10B981',
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
      id: 'duty-status',
      title: 'On Duty Status',
      subtitle: onDutyStatus ? 'Currently on duty' : 'Currently off duty',
      icon: Clock,
      hasSwitch: true,
      switchValue: onDutyStatus,
      onSwitchChange: setOnDutyStatus,
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: Shield,
      onPress: () => handleSettingsPress('Privacy & Security'),
    },
    {
      id: 'schedule',
      title: 'Shift Schedule',
      subtitle: 'Manage your shift timings',
      icon: Calendar,
      onPress: () => handleSettingsPress('Shift Schedule'),
    },
  ];

  const PerformanceCard = ({ item }: { item: typeof performanceCards[0] }) => (
    <View style={styles.performanceCard}>
      <View style={[styles.performanceIcon, { backgroundColor: `${item.color}15` }]}>
        <item.icon size={24} color={item.color} />
      </View>
      <Text style={styles.performanceValue}>{item.value}</Text>
      <Text style={styles.performanceTitle}>{item.title}</Text>
    </View>
  );

  const SettingItem = ({ item }: { item: typeof settingsOptions[0] }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.hasSwitch}
      activeOpacity={item.hasSwitch ? 1 : 0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: `${item.icon === Bell ? '#6A2CB0' : '#E24B95'}15` }]}>
        <item.icon
          size={20}
          color={item.icon === Bell ? '#6A2CB0' : '#E24B95'}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      {item.hasSwitch ? (
        <Switch
          value={item.switchValue}
          onValueChange={item.onSwitchChange}
          trackColor={{ false: '#D1D5DB', true: '#6A2CB0' }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <ChevronRight size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#6A2CB0', '#8B5CF6']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0) || 'D'}
            </Text>
          </View>
          <Text style={styles.profileName}>{dispatcherData.name}</Text>
          <Text style={styles.profileTitle}>{dispatcherData.title}</Text>
          <Text style={styles.profileId}>ID: {dispatcherData.employeeId}</Text>
        </LinearGradient>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Mail size={20} color="#6A2CB0" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{dispatcherData.email}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.contactItem}>
              <Phone size={20} color="#6A2CB0" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{dispatcherData.phone}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.contactItem}>
              <MapPin size={20} color="#6A2CB0" />
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>{dispatcherData.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.performanceGrid}>
            {performanceCards.map(item => (
              <PerformanceCard key={item.title} item={item} />
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            {settingsOptions.map((item, index) => (
              <React.Fragment key={item.id}>
                <SettingItem item={item} />
                {index < settingsOptions.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Department Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{dispatcherData.department}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Joined</Text>
              <Text style={styles.infoValue}>
                {new Date(dispatcherData.joinDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#1F2937',
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  performanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  performanceTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});
