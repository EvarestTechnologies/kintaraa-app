import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {
  X,
  Bell,
  Clock,
  Settings,
  CheckCircle,
  MessageSquare,
  Smartphone,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppointmentReminderService, ReminderPreferences } from '@/services/appointmentReminderService';

interface ReminderPreferencesModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  userType: 'survivor' | 'provider';
}

export default function ReminderPreferencesModal({
  visible,
  onClose,
  userId,
  userType
}: ReminderPreferencesModalProps) {
  const [preferences, setPreferences] = useState<ReminderPreferences>({
    userId,
    userType,
    enable24HourReminder: true,
    enable2HourReminder: true,
    enable30MinuteReminder: false,
    preferredMethod: 'in_app',
  });

  // Load existing preferences when modal opens
  useEffect(() => {
    if (visible) {
      const existingPrefs = AppointmentReminderService.getReminderPreferences(userId);
      setPreferences({ ...existingPrefs, userType }); // Ensure userType is set correctly
    }
  }, [visible, userId, userType]);

  const handleSavePreferences = () => {
    AppointmentReminderService.setReminderPreferences(preferences);

    Alert.alert(
      'Preferences Saved',
      'Your reminder preferences have been updated successfully.',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const updatePreference = <K extends keyof ReminderPreferences>(
    key: K,
    value: ReminderPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const getReminderDescription = (type: string) => {
    switch (type) {
      case '24_hour':
        return 'Get notified 1 day before your appointment';
      case '2_hour':
        return 'Get notified 2 hours before your appointment';
      case '30_minute':
        return 'Get notified 30 minutes before your appointment';
      default:
        return '';
    }
  };

  const getMethodDescription = (method: string) => {
    switch (method) {
      case 'in_app':
        return 'Receive notifications within the app only';
      case 'sms':
        return 'Receive SMS text messages to your phone';
      case 'both':
        return 'Receive both in-app and SMS notifications';
      default:
        return '';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Bell size={24} color="#6A2CB0" />
            <View style={styles.headerText}>
              <Text style={styles.title}>Reminder Preferences</Text>
              <Text style={styles.subtitle}>
                Customize when and how you receive appointment reminders
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Reminder Times Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#6A2CB0" />
              <Text style={styles.sectionTitle}>Reminder Times</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Choose when you want to receive reminders before your appointments
            </Text>

            {/* 24 Hour Reminder */}
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceTitle}>24 Hours Before</Text>
                <Text style={styles.preferenceDescription}>
                  {getReminderDescription('24_hour')}
                </Text>
              </View>
              <Switch
                value={preferences.enable24HourReminder}
                onValueChange={(value) => updatePreference('enable24HourReminder', value)}
                trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
                thumbColor={preferences.enable24HourReminder ? '#6A2CB0' : '#9CA3AF'}
              />
            </View>

            {/* 2 Hour Reminder */}
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceTitle}>2 Hours Before</Text>
                <Text style={styles.preferenceDescription}>
                  {getReminderDescription('2_hour')}
                </Text>
              </View>
              <Switch
                value={preferences.enable2HourReminder}
                onValueChange={(value) => updatePreference('enable2HourReminder', value)}
                trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
                thumbColor={preferences.enable2HourReminder ? '#6A2CB0' : '#9CA3AF'}
              />
            </View>

            {/* 30 Minute Reminder */}
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceTitle}>30 Minutes Before</Text>
                <Text style={styles.preferenceDescription}>
                  {getReminderDescription('30_minute')}
                </Text>
              </View>
              <Switch
                value={preferences.enable30MinuteReminder}
                onValueChange={(value) => updatePreference('enable30MinuteReminder', value)}
                trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
                thumbColor={preferences.enable30MinuteReminder ? '#6A2CB0' : '#9CA3AF'}
              />
            </View>
          </View>

          {/* Notification Method Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MessageSquare size={20} color="#6A2CB0" />
              <Text style={styles.sectionTitle}>Notification Method</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Choose how you want to receive reminder notifications
            </Text>

            {/* In-App Only */}
            <TouchableOpacity
              style={[
                styles.methodOption,
                preferences.preferredMethod === 'in_app' && styles.methodOptionSelected
              ]}
              onPress={() => updatePreference('preferredMethod', 'in_app')}
            >
              <View style={styles.methodContent}>
                <Bell size={20} color={preferences.preferredMethod === 'in_app' ? '#6A2CB0' : '#6B7280'} />
                <View style={styles.methodText}>
                  <Text style={[
                    styles.methodTitle,
                    preferences.preferredMethod === 'in_app' && styles.methodTitleSelected
                  ]}>
                    In-App Only
                  </Text>
                  <Text style={styles.methodDescription}>
                    {getMethodDescription('in_app')}
                  </Text>
                </View>
              </View>
              {preferences.preferredMethod === 'in_app' && (
                <CheckCircle size={20} color="#6A2CB0" />
              )}
            </TouchableOpacity>

            {/* SMS Only */}
            <TouchableOpacity
              style={[
                styles.methodOption,
                preferences.preferredMethod === 'sms' && styles.methodOptionSelected
              ]}
              onPress={() => updatePreference('preferredMethod', 'sms')}
            >
              <View style={styles.methodContent}>
                <Smartphone size={20} color={preferences.preferredMethod === 'sms' ? '#6A2CB0' : '#6B7280'} />
                <View style={styles.methodText}>
                  <Text style={[
                    styles.methodTitle,
                    preferences.preferredMethod === 'sms' && styles.methodTitleSelected
                  ]}>
                    SMS Only
                  </Text>
                  <Text style={styles.methodDescription}>
                    {getMethodDescription('sms')}
                  </Text>
                </View>
              </View>
              {preferences.preferredMethod === 'sms' && (
                <CheckCircle size={20} color="#6A2CB0" />
              )}
            </TouchableOpacity>

            {/* Both */}
            <TouchableOpacity
              style={[
                styles.methodOption,
                preferences.preferredMethod === 'both' && styles.methodOptionSelected
              ]}
              onPress={() => updatePreference('preferredMethod', 'both')}
            >
              <View style={styles.methodContent}>
                <Settings size={20} color={preferences.preferredMethod === 'both' ? '#6A2CB0' : '#6B7280'} />
                <View style={styles.methodText}>
                  <Text style={[
                    styles.methodTitle,
                    preferences.preferredMethod === 'both' && styles.methodTitleSelected
                  ]}>
                    Both Methods
                  </Text>
                  <Text style={styles.methodDescription}>
                    {getMethodDescription('both')}
                  </Text>
                </View>
              </View>
              {preferences.preferredMethod === 'both' && (
                <CheckCircle size={20} color="#6A2CB0" />
              )}
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <View style={styles.saveSection}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
              <LinearGradient
                colors={['#6A2CB0', '#553C9A']}
                style={styles.saveButtonGradient}
              >
                <CheckCircle size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Preferences</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  methodOptionSelected: {
    backgroundColor: '#F3F4F6',
    borderColor: '#6A2CB0',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  methodText: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  methodTitleSelected: {
    color: '#6A2CB0',
    fontWeight: '600',
  },
  methodDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  saveSection: {
    paddingVertical: 20,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});