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
import EditCHWProfileModal from './EditCHWProfileModal';
import {
  Bell,
  Shield,
  Calendar,
  Award,
  Star,
  Phone,
  Mail,
  MapPin,
  Edit3,
  LogOut,
  ChevronRight,
  Users,
  Activity,
  Heart,
  Stethoscope,
  BookOpen,
  Target,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';

export default function CHWProfile() {
  const { logout, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [availabilityStatus, setAvailabilityStatus] = useState<boolean>(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  // Mock CHW data
  const chwData = {
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Mary Nakato',
    title: 'Community Health Worker',
    level: 'Senior CHW',
    id: 'CHW-2024-089',
    experience: '6 years',
    rating: 4.7,
    totalPatients: 156,
    activePatients: 89,
    completedScreenings: 234,
    educationSessions: 67,
    referralsMade: 45,
    communityEvents: 28,
    organization: 'Kampala Community Health Program',
    phone: '+256 700 456 789',
    email: user?.email || 'mary.nakato@chwprogram.org',
    address: 'Nakawa Division, Kampala, Uganda',
    joinDate: '2018-07-15',
    specialization: 'Maternal & Child Health',
    certification: 'Certified Community Health Worker',
    coverage: 'Zone 7, Nakawa Division (500 households)',
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    console.log('CHW profile updated successfully');
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
            console.log('CHW logging out...');
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
      title: 'Total Patients',
      value: chwData.totalPatients.toString(),
      icon: Users,
      color: '#3B82F6',
    },
    {
      title: 'Active Patients',
      value: chwData.activePatients.toString(),
      icon: Activity,
      color: '#059669',
    },
    {
      title: 'Health Screenings',
      value: chwData.completedScreenings.toString(),
      icon: Stethoscope,
      color: '#DC2626',
    },
    {
      title: 'Education Sessions',
      value: chwData.educationSessions.toString(),
      icon: BookOpen,
      color: '#7C3AED',
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
      title: 'Field Status',
      subtitle: availabilityStatus ? 'Available for field visits' : 'Not available',
      icon: Target,
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
      onPress: () => handleSettingsPress('Schedule Settings'),
    },
    {
      id: 'training',
      title: 'Training & Certification',
      subtitle: 'View your training records',
      icon: Award,
      onPress: () => handleSettingsPress('Training & Certification'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Heart color="#FFFFFF" size={32} />
            </View>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: availabilityStatus ? '#059669' : '#EF4444' }
            ]} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.chwName}>{chwData.name}</Text>
            <Text style={styles.chwTitle}>{chwData.title}</Text>
            <Text style={styles.level}>{chwData.level} • {chwData.specialization}</Text>
            <View style={styles.ratingContainer}>
              <Star color="#F59E0B" size={16} fill="#F59E0B" />
              <Text style={styles.rating}>{chwData.rating}</Text>
              <Text style={styles.ratingText}>Community Rating</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit3 color="#3B82F6" size={20} />
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Phone color="#64748B" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{chwData.phone}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Mail color="#64748B" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{chwData.email}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <MapPin color="#64748B" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Coverage Area</Text>
                <Text style={styles.infoValue}>{chwData.coverage}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Details</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CHW ID:</Text>
              <Text style={styles.infoValue}>{chwData.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Organization:</Text>
              <Text style={styles.infoValue}>{chwData.organization}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experience:</Text>
              <Text style={styles.infoValue}>{chwData.experience}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Certification:</Text>
              <Text style={styles.infoValue}>{chwData.certification}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Join Date:</Text>
              <Text style={styles.infoValue}>{new Date(chwData.joinDate).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsContainer}>
            {statsCards.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <stat.icon color={stat.color} size={24} />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.settingItem,
                  index === settingsOptions.length - 1 && styles.lastSettingItem
                ]}
                onPress={option.onPress}
                disabled={option.hasSwitch}
              >
                <View style={styles.settingIcon}>
                  <option.icon color="#64748B" size={20} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                </View>
                {option.hasSwitch ? (
                  <Switch
                    value={option.switchValue}
                    onValueChange={option.onSwitchChange}
                    trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                    thumbColor="#FFFFFF"
                  />
                ) : (
                  <ChevronRight color="#94A3B8" size={20} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditCHWProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={handleEditSuccess}
        currentData={chwData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    bottom: 4,
    right: 4,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  chwName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  chwTitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  level: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 4,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748B',
  },
  editButton: {
    padding: 8,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  statsContainer: {
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});