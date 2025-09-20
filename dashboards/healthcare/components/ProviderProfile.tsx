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
  Stethoscope,
  Users,
  FileText,
} from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

export default function ProviderProfile() {
  const { stats, providerProfile } = useProvider();
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [availabilityStatus, setAvailabilityStatus] = useState<boolean>(true);

  // Mock provider data
  const providerData = {
    name: providerProfile?.name || 'Dr. Sarah Johnson',
    title: 'Senior Healthcare Provider',
    specialization: 'Internal Medicine',
    license: 'MD-2024-001',
    experience: '8 years',
    rating: stats.rating,
    totalPatients: stats.totalCases,
    completedCases: stats.completedCases,
    phone: '+256 700 123 456',
    email: 'sarah.johnson@healthcare.com',
    address: 'Kampala Medical Center, Uganda',
    joinDate: '2016-03-15',
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing functionality will be implemented in the next phase.',
      [{ text: 'OK' }]
    );
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
            console.log('Logging out...');
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
      value: providerData.totalPatients.toString(),
      icon: Users,
      color: '#10B981',
    },
    {
      title: 'Completed Cases',
      value: providerData.completedCases.toString(),
      icon: FileText,
      color: '#3B82F6',
    },
    {
      title: 'Patient Rating',
      value: providerData.rating.toFixed(1),
      icon: Star,
      color: '#F59E0B',
    },
    {
      title: 'Experience',
      value: providerData.experience,
      icon: Award,
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Stethoscope color="#FFFFFF" size={32} />
          </View>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: availabilityStatus ? '#10B981' : '#EF4444' }
          ]} />
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.providerName}>{providerData.name}</Text>
          <Text style={styles.providerTitle}>{providerData.title}</Text>
          <Text style={styles.specialization}>{providerData.specialization}</Text>
          
          <View style={styles.ratingContainer}>
            <Star color="#F59E0B" size={16} fill="#F59E0B" />
            <Text style={styles.ratingText}>{providerData.rating.toFixed(1)}</Text>
            <Text style={styles.ratingSubtext}>({providerData.totalPatients} patients)</Text>
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
              <Text style={styles.contactValue}>{providerData.phone}</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <Mail color="#6B7280" size={20} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{providerData.email}</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <MapPin color="#6B7280" size={20} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Location</Text>
              <Text style={styles.contactValue}>{providerData.address}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Professional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Information</Text>
        <View style={styles.professionalCard}>
          <View style={styles.professionalItem}>
            <Text style={styles.professionalLabel}>License Number</Text>
            <Text style={styles.professionalValue}>{providerData.license}</Text>
          </View>
          
          <View style={styles.professionalItem}>
            <Text style={styles.professionalLabel}>Experience</Text>
            <Text style={styles.professionalValue}>{providerData.experience}</Text>
          </View>
          
          <View style={styles.professionalItem}>
            <Text style={styles.professionalLabel}>Join Date</Text>
            <Text style={styles.professionalValue}>
              {new Date(providerData.joinDate).toLocaleDateString('en-US', {
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
            <TouchableOpacity
              key={option.id}
              style={styles.settingItem}
              onPress={option.onPress}
              disabled={option.hasSwitch}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <option.icon color="#6A2CB0" size={20} />
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
                    trackColor={{ false: '#E5E7EB', true: '#6A2CB0' }}
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
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
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
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 2,
  },
  providerTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  specialization: {
    fontSize: 14,
    color: '#6A2CB0',
    fontWeight: '500',
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
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
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
    shadowColor: '#341A52',
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
    color: '#341A52',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
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
  professionalCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  professionalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  professionalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  professionalValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#341A52',
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
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0FF',
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
    color: '#341A52',
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
    shadowColor: '#341A52',
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
});