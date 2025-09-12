import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import { useSafety } from '@/providers/SafetyProvider';
import {
  Shield,
  Phone,
  MapPin,
  Users,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Navigation,
} from 'lucide-react-native';

export default function SafetyScreen() {
  const {
    isEmergencyMode,
    emergencyContacts,
    isLocationEnabled,
    triggerEmergency,
    exitEmergencyMode,
    addEmergencyContact,
    removeEmergencyContact,
    getCurrentLocation,
  } = useSafety();

  const [locationSharing, setLocationSharing] = useState(false);

  const handleAddEmergencyContact = () => {
    Alert.prompt(
      'Add Emergency Contact',
      'Enter contact name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (name) => {
            if (name?.trim()) {
              Alert.prompt(
                'Add Emergency Contact',
                'Enter phone number:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Add',
                    onPress: (phone) => {
                      if (phone?.trim()) {
                        addEmergencyContact({
                          name: name.trim(),
                          phone: phone.trim(),
                          relationship: 'Friend',
                          isPrimary: emergencyContacts.length === 0,
                        });
                      }
                    },
                  },
                ],
                'plain-text',
                '',
                'phone-pad'
              );
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleRemoveContact = (contactId: string, contactName: string) => {
    Alert.alert(
      'Remove Contact',
      `Are you sure you want to remove ${contactName} from your emergency contacts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeEmergencyContact(contactId),
        },
      ]
    );
  };

  const handleCallContact = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const safetyFeatures = [
    {
      id: 'panic',
      title: 'Panic Button',
      description: 'Instantly alert emergency contacts',
      icon: AlertTriangle,
      color: '#E53935',
      action: triggerEmergency,
    },
    {
      id: 'location',
      title: 'Share Location',
      description: 'Share your location with trusted contacts',
      icon: MapPin,
      color: '#26A69A',
      action: getCurrentLocation,
    },
    {
      id: 'safe-routes',
      title: 'Safe Routes',
      description: 'Find the safest path to your destination',
      icon: Navigation,
      color: '#6A2CB0',
      action: () => Alert.alert('Feature Coming Soon', 'Safe routes feature will be available in the next update.'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Center</Text>
        {isEmergencyMode && (
          <TouchableOpacity
            style={styles.exitEmergencyButton}
            onPress={exitEmergencyMode}
          >
            <Text style={styles.exitEmergencyText}>Exit Emergency</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Emergency Mode Banner */}
        {isEmergencyMode && (
          <View style={styles.emergencyBanner}>
            <AlertTriangle color="#FFFFFF" size={24} />
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyTitle}>Emergency Mode Active</Text>
              <Text style={styles.emergencyDescription}>
                Your emergency contacts have been notified
              </Text>
            </View>
          </View>
        )}

        {/* Safety Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <Shield color={isLocationEnabled ? '#43A047' : '#FF9800'} size={24} />
              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>Location Services</Text>
                <Text style={styles.statusDescription}>
                  {isLocationEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <View style={styles.statusItem}>
              <Users color={emergencyContacts.length > 0 ? '#43A047' : '#FF9800'} size={24} />
              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>Emergency Contacts</Text>
                <Text style={styles.statusDescription}>
                  {emergencyContacts.length} contacts configured
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Safety Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.safetyActions}>
            {safetyFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[styles.safetyAction, { borderColor: feature.color }]}
                onPress={feature.action}
                testID={`safety-action-${feature.id}`}
              >
                <View style={[styles.safetyActionIcon, { backgroundColor: feature.color }]}>
                  <feature.icon color="#FFFFFF" size={24} />
                </View>
                <View style={styles.safetyActionContent}>
                  <Text style={styles.safetyActionTitle}>{feature.title}</Text>
                  <Text style={styles.safetyActionDescription}>
                    {feature.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddEmergencyContact}
              testID="add-emergency-contact"
            >
              <Plus color="#6A2CB0" size={20} />
            </TouchableOpacity>
          </View>

          {emergencyContacts.length === 0 ? (
            <View style={styles.emptyContacts}>
              <Users color="#D8CEE8" size={48} />
              <Text style={styles.emptyTitle}>No Emergency Contacts</Text>
              <Text style={styles.emptyDescription}>
                Add trusted contacts who will be notified in case of emergency
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleAddEmergencyContact}
              >
                <Text style={styles.emptyButtonText}>Add First Contact</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.contactsList}>
              {emergencyContacts.map((contact) => (
                <View key={contact.id} style={styles.contactCard}>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                    <Text style={styles.contactRelationship}>
                      {contact.relationship}
                      {contact.isPrimary && ' • Primary'}
                    </Text>
                  </View>
                  <View style={styles.contactActions}>
                    <TouchableOpacity
                      style={styles.contactAction}
                      onPress={() => handleCallContact(contact.phone)}
                    >
                      <Phone color="#43A047" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.contactAction}
                      onPress={() => handleRemoveContact(contact.id, contact.name)}
                    >
                      <Trash2 color="#E53935" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <View style={styles.privacyCard}>
            <View style={styles.privacyItem}>
              <View style={styles.privacyContent}>
                <Text style={styles.privacyTitle}>Location Sharing</Text>
                <Text style={styles.privacyDescription}>
                  Share your location with emergency contacts
                </Text>
              </View>
              <Switch
                value={locationSharing}
                onValueChange={setLocationSharing}
                trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                thumbColor={locationSharing ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        {/* Emergency Numbers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Numbers</Text>
          <View style={styles.emergencyNumbers}>
            <TouchableOpacity
              style={styles.emergencyNumber}
              onPress={() => Linking.openURL('tel:911')}
            >
              <Phone color="#E53935" size={20} />
              <Text style={styles.emergencyNumberText}>911 - Emergency</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.emergencyNumber}
              onPress={() => Linking.openURL('tel:1-800-799-7233')}
            >
              <Phone color="#6A2CB0" size={20} />
              <Text style={styles.emergencyNumberText}>
                1-800-799-SAFE - National Domestic Violence Hotline
              </Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#341A52',
  },
  exitEmergencyButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exitEmergencyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emergencyDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 14,
    color: '#49455A',
  },
  safetyActions: {
    paddingHorizontal: 24,
    gap: 12,
  },
  safetyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  safetyActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  safetyActionContent: {
    flex: 1,
  },
  safetyActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  safetyActionDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 18,
  },
  emptyContacts: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contactsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#49455A',
    marginBottom: 2,
  },
  contactRelationship: {
    fontSize: 12,
    color: '#6A2CB0',
    fontWeight: '600',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyCard: {
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
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyContent: {
    flex: 1,
    marginRight: 16,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 18,
  },
  emergencyNumbers: {
    paddingHorizontal: 24,
    gap: 12,
  },
  emergencyNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  emergencyNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
    flex: 1,
  },
});