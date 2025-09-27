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
import EditCounselingProfileModal from './EditCounselingProfileModal';
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
  Brain,
  Users,
  FileText,
  Heart,
  GraduationCap,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { useProvider } from '@/providers/ProviderContext';

export default function CounselingProfile() {
  const { logout, user } = useAuth();
  const { assignedCases } = useProvider();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [availabilityStatus, setAvailabilityStatus] = useState<boolean>(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  // Calculate counseling-specific stats
  const counselingCases = assignedCases.filter(c => c.supportServices.includes('counseling'));
  const completedCases = counselingCases.filter(c => c.status === 'completed');
  const activeCases = counselingCases.filter(c => ['assigned', 'in_progress'].includes(c.status));

  // Mock counseling provider data
  const counselingProviderData = {
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Dr. Sarah Johnson',
    title: 'Licensed Clinical Social Worker',
    specialization: 'Trauma & PTSD Therapy',
    license: 'LCSW-2024-001',
    experience: '12 years',
    rating: 4.9,
    totalClients: counselingCases.length,
    completedSessions: completedCases.length * 8, // Assuming avg 8 sessions per case
    activeClients: activeCases.length,
    phone: '+1 (555) 123-4567',
    email: 'dr.sarah.johnson@kintaraa.org',
    address: '789 Wellness Center, Mental Health District',
    workingHours: 'Monday - Friday, 9:00 AM - 6:00 PM',
    sessionRate: '$150/hour',
    emergencyHours: '24/7 Crisis Support Available',
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    console.log('Counseling profile updated successfully');
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
            console.log('Counseling provider logging out...');
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
      title: 'Total Clients',
      value: counselingProviderData.totalClients.toString(),
      icon: Users,
      color: '#059669',
    },
    {
      title: 'Completed Sessions',
      value: counselingProviderData.completedSessions.toString(),
      icon: FileText,
      color: '#3B82F6',
    },
    {
      title: 'Client Rating',
      value: counselingProviderData.rating.toFixed(1),
      icon: Star,
      color: '#F59E0B',
    },
    {
      title: 'Active Clients',
      value: counselingProviderData.activeClients.toString(),
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
      id: 'availability',
      title: 'Availability Status',
      subtitle: availabilityStatus ? 'Currently available' : 'Currently unavailable',
      icon: Clock,
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
      title: 'Schedule Settings',
      subtitle: 'Manage your working hours',
      icon: Calendar,
      onPress: () => handleSettingsPress('Schedule'),
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
            <Brain color="#FFFFFF" size={32} />
          </View>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: availabilityStatus ? '#10B981' : '#EF4444' }
          ]} />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.providerName}>{counselingProviderData.name}</Text>
          <Text style={styles.providerTitle}>{counselingProviderData.title}</Text>
          <Text style={styles.specialization}>{counselingProviderData.specialization}</Text>

          <View style={styles.ratingContainer}>
            <Star color="#F59E0B" size={16} fill="#F59E0B" />
            <Text style={styles.ratingText}>{counselingProviderData.rating.toFixed(1)}</Text>
            <Text style={styles.ratingSubtext}>({counselingProviderData.totalClients} clients)</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Edit3 color="#059669" size={20} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Performance Overview</Text>
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

      {/* Professional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Information</Text>
        <View style={styles.professionalCard}>
          <View style={styles.professionalItem}>
            <GraduationCap color="#6B7280" size={20} />
            <View style={styles.professionalText}>
              <Text style={styles.professionalLabel}>License</Text>
              <Text style={styles.professionalValue}>{counselingProviderData.license}</Text>
            </View>
          </View>

          <View style={styles.professionalItem}>
            <Award color="#6B7280" size={20} />
            <View style={styles.professionalText}>
              <Text style={styles.professionalLabel}>Experience</Text>
              <Text style={styles.professionalValue}>{counselingProviderData.experience}</Text>
            </View>
          </View>

          <View style={styles.professionalItem}>
            <Clock color="#6B7280" size={20} />
            <View style={styles.professionalText}>
              <Text style={styles.professionalLabel}>Working Hours</Text>
              <Text style={styles.professionalValue}>{counselingProviderData.workingHours}</Text>
            </View>
          </View>

          <View style={styles.professionalItem}>
            <Heart color="#6B7280" size={20} />
            <View style={styles.professionalText}>
              <Text style={styles.professionalLabel}>Emergency Support</Text>
              <Text style={styles.professionalValue}>{counselingProviderData.emergencyHours}</Text>
            </View>
          </View>
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
              <Text style={styles.contactValue}>{counselingProviderData.phone}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Mail color="#6B7280" size={20} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{counselingProviderData.email}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MapPin color="#6B7280" size={20} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Location</Text>
              <Text style={styles.contactValue}>{counselingProviderData.address}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.settingItem}
              onPress={option.onPress}
              disabled={option.hasSwitch}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingIcon}>
                  <option.icon color="#6B7280" size={20} />
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
                  trackColor={{ false: '#D1D5DB', true: '#059669' }}
                  thumbColor={option.switchValue ? '#FFFFFF' : '#F3F4F6'}
                />
              ) : (
                <ChevronRight color="#9CA3AF" size={16} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="#FFFFFF" size={20} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

      <EditCounselingProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={handleEditSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#059669',
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
  providerName: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 2,
  },
  providerTitle: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  specialization: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginLeft: 4,
  },
  ratingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  statsSection: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginRight: '2%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  professionalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  professionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  professionalText: {
    flex: 1,
    marginLeft: 12,
  },
  professionalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  professionalValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500' as const,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactText: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500' as const,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});