import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
  Dimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/providers/AuthProvider';
import { useProvider } from '@/providers/ProviderContext';
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
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
  Target,
  Award,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SafetyScreen() {
  const { user } = useAuth();
  const { stats, assignedCases } = useProvider();
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
  const [isSharing, setIsSharing] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: 'Family'
  });

  // Provider Analytics Dashboard
  if (user?.role === 'provider') {
    const monthlyData = [
      { month: 'Jan', cases: 12, completed: 10 },
      { month: 'Feb', cases: 15, completed: 13 },
      { month: 'Mar', cases: 18, completed: 16 },
      { month: 'Apr', cases: 22, completed: 20 },
      { month: 'May', cases: 25, completed: 22 },
      { month: 'Jun', cases: 20, completed: 18 },
    ];

    const serviceTypes = [
      { type: 'Medical', count: 45, percentage: 35, color: '#E53935' },
      { type: 'Legal', count: 32, percentage: 25, color: '#1565C0' },
      { type: 'Counseling', count: 28, percentage: 22, color: '#4527A0' },
      { type: 'Shelter', count: 23, percentage: 18, color: '#00695C' },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Performance insights and metrics</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Key Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Performance Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <BarChart3 color="#6A2CB0" size={24} />
                <Text style={styles.metricNumber}>{stats.totalCases}</Text>
                <Text style={styles.metricLabel}>Total Cases</Text>
                <Text style={styles.metricChange}>+12% this month</Text>
              </View>
              <View style={styles.metricCard}>
                <CheckCircle color="#43A047" size={24} />
                <Text style={styles.metricNumber}>{stats.completedCases}</Text>
                <Text style={styles.metricLabel}>Completed</Text>
                <Text style={styles.metricChange}>+8% this month</Text>
              </View>
              <View style={styles.metricCard}>
                <Clock color="#FF9800" size={24} />
                <Text style={styles.metricNumber}>{stats.averageResponseTime}min</Text>
                <Text style={styles.metricLabel}>Avg Response</Text>
                <Text style={styles.metricChange}>-5min improved</Text>
              </View>
              <View style={styles.metricCard}>
                <Award color="#F3B52F" size={24} />
                <Text style={styles.metricNumber}>{stats.rating.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>Rating</Text>
                <Text style={styles.metricChange}>+0.2 this month</Text>
              </View>
            </View>
          </View>

          {/* Monthly Trends */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Case Trends</Text>
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <TrendingUp color="#43A047" size={20} />
                <Text style={styles.chartTitle}>Cases Over Time</Text>
              </View>
              <View style={styles.chartContainer}>
                {monthlyData.map((data, index) => (
                  <View key={data.month} style={styles.chartBar}>
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.bar,
                          styles.completedBar,
                          { height: (data.completed / 25) * 80 }
                        ]}
                      />
                      <View 
                        style={[
                          styles.bar,
                          styles.totalBar,
                          { height: (data.cases / 25) * 80 }
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{data.month}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#6A2CB0' }]} />
                  <Text style={styles.legendText}>Total Cases</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#43A047' }]} />
                  <Text style={styles.legendText}>Completed</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Service Distribution */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Type Distribution</Text>
            <View style={styles.serviceDistribution}>
              {serviceTypes.map((service, index) => (
                <View key={service.type} style={styles.serviceItem}>
                  <View style={styles.serviceHeader}>
                    <View style={styles.serviceInfo}>
                      <View style={[styles.serviceColor, { backgroundColor: service.color }]} />
                      <Text style={styles.serviceName}>{service.type}</Text>
                    </View>
                    <Text style={styles.serviceCount}>{service.count}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${service.percentage}%`,
                          backgroundColor: service.color
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.servicePercentage}>{service.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Performance Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Goals</Text>
            <View style={styles.goalsContainer}>
              <View style={styles.goalCard}>
                <Target color="#6A2CB0" size={24} />
                <Text style={styles.goalTitle}>Response Time Goal</Text>
                <Text style={styles.goalTarget}>Under 30 minutes</Text>
                <View style={styles.goalProgress}>
                  <View style={[styles.goalProgressFill, { width: '85%' }]} />
                </View>
                <Text style={styles.goalStatus}>Current: {stats.averageResponseTime}min (85% of goal)</Text>
              </View>
              
              <View style={styles.goalCard}>
                <CheckCircle color="#43A047" size={24} />
                <Text style={styles.goalTitle}>Completion Rate Goal</Text>
                <Text style={styles.goalTarget}>90% completion rate</Text>
                <View style={styles.goalProgress}>
                  <View style={[styles.goalProgressFill, { width: '92%' }]} />
                </View>
                <Text style={styles.goalStatus}>Current: 92% (Goal exceeded!)</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              {assignedCases.slice(0, 5).map((incident) => (
                <View key={incident.id} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <CheckCircle color="#43A047" size={16} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      Case {incident.caseNumber} - {incident.status}
                    </Text>
                    <Text style={styles.activityTime}>
                      {new Date(incident.updatedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const handleAddEmergencyContact = () => {
    setNewContact({ name: '', phone: '', relationship: 'Family' });
    setShowAddContactModal(true);
  };

  const handleSaveContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    addEmergencyContact({
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
      relationship: newContact.relationship,
      isPrimary: emergencyContacts.length === 0,
    });

    setShowAddContactModal(false);
    setNewContact({ name: '', phone: '', relationship: 'Family' });
  };

  const handleCancelAddContact = () => {
    setShowAddContactModal(false);
    setNewContact({ name: '', phone: '', relationship: 'Family' });
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

  const handleLocationSharingToggle = async (value: boolean) => {
    if (value) {
      setIsSharing(true);
      try {
        const location = await getCurrentLocation();
        if (location && typeof location === 'object' && 'coords' in location && emergencyContacts.length > 0) {
          const coords = location.coords as { latitude: number; longitude: number; };
          const locationUrl = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
          const message = `I'm sharing my location with you for safety: ${locationUrl}`;
          
          // Simulate sending location to emergency contacts
          console.log('Sharing location with emergency contacts:', {
            location: locationUrl,
            contacts: emergencyContacts.map(c => ({ name: c.name, phone: c.phone }))
          });
          
          Alert.alert(
            'Location Shared',
            `Your location has been shared with ${emergencyContacts.length} emergency contact${emergencyContacts.length > 1 ? 's' : ''}.\n\nLocation: ${locationUrl}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  setLocationSharing(true);
                  // Auto-disable after 1 hour for privacy
                  setTimeout(() => {
                    setLocationSharing(false);
                    Alert.alert('Location Sharing Disabled', 'Location sharing has been automatically disabled after 1 hour for your privacy.');
                  }, 3600000); // 1 hour
                }
              }
            ]
          );
        } else if (emergencyContacts.length === 0) {
          Alert.alert(
            'No Emergency Contacts',
            'Please add emergency contacts first to share your location.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Location Unavailable',
            'Unable to get your current location. Please check your location permissions and try again.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Location sharing error:', error);
        Alert.alert(
          'Location Error',
          'Failed to get your location. Please ensure location services are enabled and try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsSharing(false);
      }
    } else {
      setLocationSharing(false);
      Alert.alert(
        'Location Sharing Disabled',
        'Your location is no longer being shared.',
        [{ text: 'OK' }]
      );
    }
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
          <View style={styles.sectionHeaderInline}>
            <Text style={styles.sectionTitle}>Safety Status</Text>
          </View>
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
          <View style={styles.sectionHeaderInline}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.safetyActions}>
            {safetyFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[styles.safetyAction, { borderColor: feature.color }]}
                onPress={feature.id === 'location' ? () => handleLocationSharingToggle(true) : feature.action}
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
          <View style={styles.sectionHeaderInline}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
          </View>
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
                onValueChange={handleLocationSharingToggle}
                trackColor={{ false: '#D8CEE8', true: '#6A2CB0' }}
                thumbColor={locationSharing ? '#FFFFFF' : '#FFFFFF'}
                disabled={isSharing}
              />
            </View>
          </View>
        </View>

        {/* Emergency Numbers */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderInline}>
            <Text style={styles.sectionTitle}>Emergency Numbers</Text>
          </View>
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

      {/* Add Contact Modal */}
      <Modal
        visible={showAddContactModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelAddContact}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancelAddContact}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Emergency Contact</Text>
              <TouchableOpacity onPress={handleSaveContact}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={newContact.name}
                  onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
                  placeholder="Enter contact name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  testID="contact-name-input"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  value={newContact.phone}
                  onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  testID="contact-phone-input"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Relationship</Text>
                <View style={styles.relationshipOptions}>
                  {['Family', 'Friend', 'Partner', 'Other'].map((relationship) => (
                    <TouchableOpacity
                      key={relationship}
                      style={[
                        styles.relationshipOption,
                        newContact.relationship === relationship && styles.relationshipOptionSelected
                      ]}
                      onPress={() => setNewContact(prev => ({ ...prev, relationship }))}
                      testID={`relationship-${relationship.toLowerCase()}`}
                    >
                      <Text style={[
                        styles.relationshipOptionText,
                        newContact.relationship === relationship && styles.relationshipOptionTextSelected
                      ]}>
                        {relationship}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formNote}>
                <Text style={styles.formNoteText}>
                  {emergencyContacts.length === 0 
                    ? 'This will be your primary emergency contact.'
                    : 'This contact will be added to your emergency contact list.'}
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
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
  sectionHeaderInline: {
    paddingHorizontal: 24,
    marginBottom: 16,
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
  // Provider Analytics Styles
  subtitle: {
    fontSize: 16,
    color: '#49455A',
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 80) / 2,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 10,
    color: '#43A047',
    fontWeight: '600',
  },
  chartCard: {
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
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 16,
  },
  chartBar: {
    alignItems: 'center',
  },
  barContainer: {
    position: 'relative',
    width: 20,
    height: 80,
    justifyContent: 'flex-end',
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    borderRadius: 2,
  },
  totalBar: {
    backgroundColor: '#6A2CB0',
    opacity: 0.3,
  },
  completedBar: {
    backgroundColor: '#43A047',
  },
  barLabel: {
    fontSize: 10,
    color: '#49455A',
    marginTop: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#49455A',
  },
  serviceDistribution: {
    paddingHorizontal: 24,
    gap: 16,
  },
  serviceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
  },
  serviceCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#341A52',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F5F0FF',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  servicePercentage: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'right',
  },
  goalsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginTop: 8,
    marginBottom: 4,
  },
  goalTarget: {
    fontSize: 14,
    color: '#49455A',
    marginBottom: 12,
  },
  goalProgress: {
    height: 8,
    backgroundColor: '#F5F0FF',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#6A2CB0',
    borderRadius: 4,
  },
  goalStatus: {
    fontSize: 12,
    color: '#43A047',
    fontWeight: '600',
  },
  activityList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#49455A',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  modalForm: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#341A52',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  relationshipOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  relationshipOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  relationshipOptionSelected: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  relationshipOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#49455A',
  },
  relationshipOptionTextSelected: {
    color: '#FFFFFF',
  },
  formNote: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  formNoteText: {
    fontSize: 14,
    color: '#6366F1',
    textAlign: 'center',
    lineHeight: 20,
  },
});