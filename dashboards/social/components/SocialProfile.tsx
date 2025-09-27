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
import EditSocialProfileModal from './EditSocialProfileModal';
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
  Heart,
  GraduationCap,
  Home,
  HandHeart,
  Building,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { useProvider } from '@/providers/ProviderContext';

export default function SocialProfile() {
  const { logout, user } = useAuth();
  const { assignedCases } = useProvider();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [availabilityStatus, setAvailabilityStatus] = useState<boolean>(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  // Calculate social services-specific stats
  const socialCases = assignedCases.filter(c => c.supportServices.includes('social_services'));
  const completedCases = socialCases.filter(c => c.status === 'completed');
  const activeCases = socialCases.filter(c => ['assigned', 'in_progress'].includes(c.status));

  // Mock social worker provider data
  const socialProviderData = {
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Maria Rodriguez',
    title: 'Licensed Social Worker',
    specialization: 'Community Support & Case Management',
    license: 'LSW-2024-001',
    experience: '8 years',
    rating: 4.8,
    totalClients: socialCases.length,
    completedReferrals: completedCases.length * 3, // Assuming avg 3 referrals per case
    activeClients: activeCases.length,
    phone: '+1 (555) 234-5678',
    email: 'maria.rodriguez@kintaraa.org',
    address: '456 Community Center, Social Services District',
    workingHours: 'Monday - Friday, 8:00 AM - 5:00 PM',
    serviceAreas: ['Housing Assistance', 'Food Security', 'Emergency Support'],
    emergencyHours: '24/7 Crisis Response Available',
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    console.log('Social worker profile updated successfully');
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
            console.log('Social worker logging out...');
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
      value: socialProviderData.totalClients.toString(),
      icon: Users,
      color: '#059669',
    },
    {
      title: 'Completed Referrals',
      value: socialProviderData.completedReferrals.toString(),
      icon: FileText,
      color: '#3B82F6',
    },
    {
      title: 'Client Rating',
      value: socialProviderData.rating.toFixed(1),
      icon: Star,
      color: '#F59E0B',
    },
    {
      title: 'Active Cases',
      value: socialProviderData.activeClients.toString(),
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
      title: 'Privacy Settings',
      subtitle: 'Manage data privacy and security',
      icon: Shield,
      hasSwitch: false,
      onPress: () => handleSettingsPress('Privacy'),
    },
    {
      id: 'calendar',
      title: 'Calendar Integration',
      subtitle: 'Sync with external calendars',
      icon: Calendar,
      hasSwitch: false,
      onPress: () => handleSettingsPress('Calendar'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <HandHeart color="#FFFFFF" size={32} />
            </View>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: availabilityStatus ? '#10B981' : '#EF4444' }
            ]} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.providerName}>{socialProviderData.name}</Text>
            <Text style={styles.providerTitle}>{socialProviderData.title}</Text>
            <Text style={styles.specialization}>{socialProviderData.specialization}</Text>

            <View style={styles.ratingContainer}>
              <Star color="#F59E0B" size={16} fill="#F59E0B" />
              <Text style={styles.ratingText}>{socialProviderData.rating.toFixed(1)}</Text>
              <Text style={styles.ratingSubtext}>({socialProviderData.totalClients} clients)</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Edit3 color="#6A2CB0" size={20} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsGrid}>
            {statsCards.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                    <IconComponent size={24} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <GraduationCap size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>License Number</Text>
                <Text style={styles.infoValue}>{socialProviderData.license}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Award size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Specialization</Text>
                <Text style={styles.infoValue}>{socialProviderData.specialization}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Building size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Service Areas</Text>
                <Text style={styles.infoValue}>{socialProviderData.serviceAreas.join(', ')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Phone size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{socialProviderData.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Mail size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{socialProviderData.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <MapPin size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Office Address</Text>
                <Text style={styles.infoValue}>{socialProviderData.address}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Clock size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Working Hours</Text>
                <Text style={styles.infoValue}>{socialProviderData.workingHours}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <HandHeart size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Emergency Support</Text>
                <Text style={styles.infoValue}>{socialProviderData.emergencyHours}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            {settingsOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <View key={option.id}>
                  <TouchableOpacity
                    style={styles.settingsRow}
                    onPress={option.onPress}
                    disabled={option.hasSwitch}
                  >
                    <View style={styles.settingsLeft}>
                      <View style={styles.settingsIcon}>
                        <IconComponent size={20} color="#6B7280" />
                      </View>
                      <View style={styles.settingsContent}>
                        <Text style={styles.settingsTitle}>{option.title}</Text>
                        <Text style={styles.settingsSubtitle}>{option.subtitle}</Text>
                      </View>
                    </View>

                    {option.hasSwitch ? (
                      <Switch
                        value={option.switchValue}
                        onValueChange={option.onSwitchChange}
                        trackColor={{ false: '#E5E7EB', true: '#6A2CB0' }}
                        thumbColor={option.switchValue ? '#FFFFFF' : '#F3F4F6'}
                        ios_backgroundColor="#E5E7EB"
                      />
                    ) : (
                      <ChevronRight size={20} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                  {index < settingsOptions.length - 1 && <View style={styles.divider} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditSocialProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={handleEditSuccess}
        currentData={socialProviderData}
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
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6A2CB0',
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
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  providerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A2CB0',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  ratingSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 8,
  },
  statsSection: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutSection: {
    padding: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});