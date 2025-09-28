import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useSafety } from '@/providers/SafetyProvider';
import {
  Shield,
  Phone,
  MapPin,
  Users,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Settings,
  CheckCircle,
  Clock,
  Navigation,
} from 'lucide-react-native';

export function SafetyTools() {
  const { isEmergencyMode, triggerEmergency, emergencyContacts } = useSafety();

  const safetyFeatures = [
    {
      id: 'emergency_button',
      title: 'Emergency Button',
      description: 'Quick access to emergency services and contacts',
      icon: Phone,
      color: '#E53935',
      status: 'active',
      action: triggerEmergency,
    },
    {
      id: 'location_sharing',
      title: 'Location Sharing',
      description: 'Share your location with trusted contacts',
      icon: MapPin,
      color: '#26A69A',
      status: 'active',
      action: () => console.log('Location sharing'),
    },
    {
      id: 'stealth_mode',
      title: 'Stealth Mode',
      description: 'Hide the app or disguise it as another app',
      icon: EyeOff,
      color: '#8B5CF6',
      status: 'inactive',
      action: () => console.log('Stealth mode'),
    },
    {
      id: 'safe_contacts',
      title: 'Safe Contacts',
      description: 'Manage your emergency contact list',
      icon: Users,
      color: '#3B82F6',
      status: 'configured',
      action: () => console.log('Safe contacts'),
    },
  ];

  const safetyTips = [
    {
      id: '1',
      title: 'Create a Safety Plan',
      description: 'Develop a personalized plan for staying safe in different situations.',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Trust Your Instincts',
      description: 'If something feels wrong, trust your gut feeling and seek help.',
      priority: 'high',
    },
    {
      id: '3',
      title: 'Keep Important Documents Safe',
      description: 'Store copies of ID, financial documents, and important papers in a secure location.',
      priority: 'medium',
    },
    {
      id: '4',
      title: 'Establish Code Words',
      description: 'Create code words with trusted friends or family to signal when you need help.',
      priority: 'medium',
    },
    {
      id: '5',
      title: 'Know Your Resources',
      description: 'Familiarize yourself with local support services and how to access them.',
      priority: 'low',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'configured': return CheckCircle;
      case 'inactive': return Clock;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'configured': return '#4CAF50';
      case 'inactive': return '#FF9800';
      default: return '#E53935';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#E53935';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Tools</Text>
        <Text style={styles.subtitle}>Your personal safety toolkit and resources</Text>
      </View>

      {/* Emergency Status */}
      {isEmergencyMode && (
        <View style={styles.emergencyAlert}>
          <AlertTriangle color="#FFFFFF" size={24} />
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Emergency Mode Active</Text>
            <Text style={styles.emergencyDescription}>
              Your emergency contacts have been notified and help is on the way.
            </Text>
          </View>
        </View>
      )}

      {/* Quick Emergency Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Actions</Text>
        <View style={styles.emergencyActions}>
          <TouchableOpacity
            style={[styles.emergencyButton, { backgroundColor: '#E53935' }]}
            onPress={triggerEmergency}
          >
            <Phone color="#FFFFFF" size={24} />
            <Text style={styles.emergencyButtonText}>Call 911</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.emergencyButton, { backgroundColor: '#8B5CF6' }]}
            onPress={triggerEmergency}
          >
            <AlertTriangle color="#FFFFFF" size={24} />
            <Text style={styles.emergencyButtonText}>Silent Alert</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.emergencyButton, { backgroundColor: '#26A69A' }]}
          >
            <Navigation color="#FFFFFF" size={24} />
            <Text style={styles.emergencyButtonText}>Share Location</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Safety Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Features</Text>
        <View style={styles.featuresList}>
          {safetyFeatures.map((feature) => {
            const StatusIcon = getStatusIcon(feature.status);
            return (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureCard}
                onPress={feature.action}
              >
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <feature.icon color="#FFFFFF" size={24} />
                </View>
                <View style={styles.featureContent}>
                  <View style={styles.featureHeader}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <View style={styles.statusContainer}>
                      <StatusIcon color={getStatusColor(feature.status)} size={16} />
                      <Text style={[styles.statusText, { color: getStatusColor(feature.status) }]}>
                        {feature.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity style={styles.manageButton}>
            <Settings color="#6A2CB0" size={16} />
            <Text style={styles.manageButtonText}>Manage</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactsList}>
          {emergencyContacts.slice(0, 3).map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>{contact.relationship}</Text>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Phone color="#FFFFFF" size={16} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Safety Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        <View style={styles.tipsList}>
          {safetyTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(tip.priority) }]} />
                <Text style={styles.tipTitle}>{tip.title}</Text>
              </View>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Safety Plan */}
      <View style={styles.section}>
        <View style={styles.safetyPlanCard}>
          <View style={styles.safetyPlanHeader}>
            <Shield color="#6A2CB0" size={24} />
            <Text style={styles.safetyPlanTitle}>Personal Safety Plan</Text>
          </View>
          <Text style={styles.safetyPlanDescription}>
            Create a personalized safety plan tailored to your specific situation and needs.
          </Text>
          <TouchableOpacity
            style={styles.createPlanButton}
            onPress={() => router.push('/(dashboard)/survivor/safety')}
          >
            <Text style={styles.createPlanButtonText}>Create Safety Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#49455A',
  },
  emergencyAlert: {
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
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  emergencyActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  featuresList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#341A52',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  featureDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
  },
  contactsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  contactRelation: {
    fontSize: 12,
    color: '#49455A',
  },
  callButton: {
    backgroundColor: '#26A69A',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
  },
  tipDescription: {
    fontSize: 12,
    color: '#49455A',
    lineHeight: 16,
  },
  safetyPlanCard: {
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
  safetyPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  safetyPlanTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
  },
  safetyPlanDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
    marginBottom: 16,
  },
  createPlanButton: {
    backgroundColor: '#6A2CB0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createPlanButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});