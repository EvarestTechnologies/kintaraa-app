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
import EditGBVProfileModal from './EditGBVProfileModal';
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
  Edit3,
  LogOut,
  ChevronRight,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Heart,
  Headphones,
  Activity,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

export default function GBVProfile() {
  const { logout, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [availabilityStatus, setAvailabilityStatus] = useState<boolean>(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  // Mock GBV specialist data
  const gbvSpecialistData = {
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Dr. Sarah Williams',
    title: 'Senior GBV Response Specialist',
    rank: 'Lead Coordinator',
    badgeNumber: 'GBV-2024-156',
    experience: '8 years',
    rating: 4.8,
    totalCases: 186,
    completedCases: 172,
    activeCases: 14,
    emergencyResponses: 45,
    hotlineCalls: 234,
    supportSessions: 128,
    organization: 'GBV Rescue & Response Unit',
    phone: '+256 700 123 456',
    email: user?.email || 'sarah.williams@gbvrescue.org',
    address: 'GBV Response Center, Kampala, Uganda',
    joinDate: '2016-03-20',
    specialization: 'Crisis Intervention & Trauma Support',
    certification: 'Advanced GBV Response & Crisis Management',
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    console.log('GBV profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('GBV specialist logging out...');
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

  const statsCards = [
    {
      title: 'Total Cases',
      value: gbvSpecialistData.totalCases.toString(),
      icon: FileText,
      color: '#DC2626',
    },
    {
      title: 'Emergency Responses',
      value: gbvSpecialistData.emergencyResponses.toString(),
      icon: AlertTriangle,
      color: '#EA580C',
    },
    {
      title: 'Hotline Calls',
      value: gbvSpecialistData.hotlineCalls.toString(),
      icon: Headphones,
      color: '#7C3AED',
    },
    {
      title: 'Support Sessions',
      value: gbvSpecialistData.supportSessions.toString(),
      icon: Heart,
      color: '#059669',
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
      id: 'availability',
      title: 'Response Status',
      subtitle: availabilityStatus ? 'Available for emergency response' : 'Off duty',
      icon: Activity,
      hasSwitch: true,
      switchValue: availabilityStatus,
      onSwitchChange: setAvailabilityStatus,
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
      title: 'Response Schedule',
      subtitle: 'Manage your availability hours',
      icon: Calendar,
      onPress: () => handleSettingsPress('Response Schedule'),
    },
    {
      id: 'general',
      title: 'General Settings',
      subtitle: 'App preferences and configuration',
      icon: Settings,
      onPress: () => handleSettingsPress('General'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Shield color="#FFFFFF" size={32} />
            </View>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: availabilityStatus ? '#059669' : '#EF4444' }
            ]} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.specialistName}>{gbvSpecialistData.name}</Text>
            <Text style={styles.specialistTitle}>{gbvSpecialistData.title}</Text>
            <Text style={styles.rank}>{gbvSpecialistData.rank} • {gbvSpecialistData.specialization}</Text>

            <View style={styles.ratingContainer}>
              <Star color="#F59E0B" size={16} fill="#F59E0B" />
              <Text style={styles.ratingText}>{gbvSpecialistData.rating.toFixed(1)}</Text>
              <Text style={styles.ratingSubtext}>({gbvSpecialistData.totalCases} cases)</Text>
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
          <Text style={styles.sectionTitle}>Response Overview</Text>
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

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Phone color="#6B7280" size={20} />
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{gbvSpecialistData.phone}</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Mail color="#6B7280" size={20} />
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{gbvSpecialistData.email}</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <MapPin color="#6B7280" size={20} />
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Organization</Text>
                <Text style={styles.contactValue}>{gbvSpecialistData.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <View style={styles.professionalCard}>
            <View style={styles.professionalItem}>
              <Text style={styles.professionalLabel}>Badge Number</Text>
              <Text style={styles.professionalValue}>{gbvSpecialistData.badgeNumber}</Text>
            </View>

            <View style={styles.professionalItem}>
              <Text style={styles.professionalLabel}>Rank</Text>
              <Text style={styles.professionalValue}>{gbvSpecialistData.rank}</Text>
            </View>

            <View style={styles.professionalItem}>
              <Text style={styles.professionalLabel}>Experience</Text>
              <Text style={styles.professionalValue}>{gbvSpecialistData.experience}</Text>
            </View>

            <View style={styles.professionalItem}>
              <Text style={styles.professionalLabel}>Specialization</Text>
              <Text style={styles.professionalValue}>{gbvSpecialistData.specialization}</Text>
            </View>

            <View style={styles.professionalItem}>
              <Text style={styles.professionalLabel}>Certification</Text>
              <Text style={styles.professionalValue}>{gbvSpecialistData.certification}</Text>
            </View>

            <View style={styles.professionalItem}>
              <Text style={styles.professionalLabel}>Join Date</Text>
              <Text style={styles.professionalValue}>
                {new Date(gbvSpecialistData.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            {settingsOptions.map((option) => (
              <View key={option.id} style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <View style={styles.settingIcon}>
                    <option.icon color="#DC2626" size={20} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{option.title}</Text>
                    <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                  </View>
                </View>

                {option.hasSwitch ? (
                  <Switch
                    value={option.switchValue}
                    onValueChange={option.onSwitchChange}
                    trackColor={{ false: '#D1D5DB', true: '#FECACA' }}
                    thumbColor={option.switchValue ? '#DC2626' : '#9CA3AF'}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.settingAction}
                    onPress={option.onPress}
                  >
                    <ChevronRight color="#9CA3AF" size={20} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditGBVProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={handleEditSuccess}
        currentData={gbvSpecialistData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  specialistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  rank: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  ratingSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  contactCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  contactText: {
    marginLeft: 12,
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  professionalCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  professionalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  professionalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  professionalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  settingsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FECACA',
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
    color: '#1E293B',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  settingAction: {
    padding: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});