import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  MessageCircle,
  FileText,
  Phone,
  AlertTriangle,
  CheckCircle,
  Edit3,
} from 'lucide-react-native';
import { useIncidents } from '@/providers/IncidentProvider';
import { useProvider } from '@/providers/ProviderContext';
import { useAuth } from '@/providers/AuthProvider';

const incidentTypeLabels = {
  physical: 'Physical Violence',
  sexual: 'Sexual Violence',
  emotional: 'Emotional/Psychological Abuse',
  economic: 'Economic Abuse',
  online: 'Online Gender-Based Violence',
  femicide: 'Femicide/Attempted Femicide',
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#43A047';
    case 'in_progress':
      return '#FF9800';
    case 'assigned':
      return '#6A2CB0';
    case 'new':
      return '#49455A';
    case 'closed':
      return '#757575';
    default:
      return '#49455A';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return '#E53935';
    case 'medium':
      return '#FF9800';
    case 'low':
      return '#43A047';
    default:
      return '#49455A';
  }
};

export default function CaseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { incidents } = useIncidents();
  const { assignedCases, updateCaseStatus, isUpdating } = useProvider();

  // Check both incidents and assigned cases for providers
  const incident = incidents.find(inc => inc.id === id) || assignedCases.find(inc => inc.id === id);

  if (!incident) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#6A2CB0" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Case Not Found</Text>
        </View>
        <View style={styles.errorContainer}>
          <AlertTriangle color="#E53935" size={64} />
          <Text style={styles.errorTitle}>Case Not Found</Text>
          <Text style={styles.errorDescription}>
            The requested case could not be found or you don&apos;t have permission to view it.
          </Text>
          <TouchableOpacity
            style={styles.backToListButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToListButtonText}>Back to Cases</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleStatusUpdate = (newStatus: string) => {
    if (Platform.OS === 'web') {
      const confirmed = confirm(`Are you sure you want to update this case status to ${newStatus}?`);
      if (confirmed) {
        updateCaseStatus({
          incidentId: incident.id,
          status: newStatus as any,
        });
      }
    } else {
      Alert.alert(
        'Update Case Status',
        `Are you sure you want to update this case status to ${newStatus}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Update',
            onPress: () => {
              updateCaseStatus({
                incidentId: incident.id,
                status: newStatus as any,
              });
            },
          },
        ]
      );
    }
  };

  const isProvider = user?.role === 'provider';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#6A2CB0" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Case Details</Text>
        {isProvider && (
          <TouchableOpacity style={styles.editButton}>
            <Edit3 color="#6A2CB0" size={20} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Case Header */}
        <View style={styles.caseHeader}>
          <View style={styles.caseInfo}>
            <Text style={styles.caseNumber}>{incident.caseNumber}</Text>
            <Text style={styles.caseType}>
              {incidentTypeLabels[incident.type] || incident.type}
            </Text>
          </View>
          <View style={styles.badges}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(incident.status) },
              ]}
            >
              <Text style={styles.badgeText}>
                {incident.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
            {isProvider && (
              <View
                style={[
                  styles.severityBadge,
                  { backgroundColor: getSeverityColor(incident.severity || 'medium') },
                ]}
              >
                <Text style={styles.badgeText}>
                  {(incident.severity || 'medium').toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Case Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.timelineItem}>
            <Calendar color="#6A2CB0" size={20} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Incident Date</Text>
              <Text style={styles.timelineText}>
                {incident.incidentDate ? new Date(incident.incidentDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'Date not specified'}
              </Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <Clock color="#6A2CB0" size={20} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Reported</Text>
              <Text style={styles.timelineText}>
                {new Date(incident.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Location */}
        {(incident as any).location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationCard}>
              <MapPin color="#E53935" size={20} />
              <View style={styles.locationContent}>
                <Text style={styles.locationText}>
                  {(incident as any).location.address || 'Location provided'}
                </Text>
                {(incident as any).location.description && (
                  <Text style={styles.locationDescription}>
                    {(incident as any).location.description}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incident Description</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{incident.description}</Text>
          </View>
        </View>

        {/* Services Requested */}
        {incident.supportServices && incident.supportServices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services Requested</Text>
            <View style={styles.servicesGrid}>
              {incident.supportServices.map((service: string, index: number) => (
                <View key={`service-${index}`} style={styles.serviceChip}>
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Evidence */}
        {incident.evidence && incident.evidence.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evidence</Text>
            <View style={styles.evidenceList}>
              {incident.evidence.map((evidence, index) => (
                <View key={evidence.id} style={styles.evidenceItem}>
                  <FileText color="#6A2CB0" size={20} />
                  <View style={styles.evidenceContent}>
                    <Text style={styles.evidenceTitle}>
                      {evidence.description || `Evidence ${index + 1}`}
                    </Text>
                    <Text style={styles.evidenceType}>{evidence.type}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Messages */}
        {incident.messages && incident.messages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Communications</Text>
            <View style={styles.messagesContainer}>
              {incident.messages.slice(0, 3).map((message) => (
                <View key={message.id} style={styles.messageItem}>
                  <MessageCircle color="#6A2CB0" size={16} />
                  <View style={styles.messageContent}>
                    <Text style={styles.messageText}>{message.content}</Text>
                    <Text style={styles.messageTime}>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
              {incident.messages.length > 3 && (
                <TouchableOpacity 
                  style={styles.viewAllMessages}
                  onPress={() => router.push(`/messages/${incident.id}`)}
                >
                  <Text style={styles.viewAllMessagesText}>
                    View all {incident.messages.length} messages
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Provider Actions */}
        {isProvider && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.actionsContainer}>
              {incident.status === 'assigned' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.startButton]}
                  onPress={() => handleStatusUpdate('in_progress')}
                  disabled={isUpdating}
                >
                  <Text style={styles.actionButtonText}>Start Case</Text>
                </TouchableOpacity>
              )}
              {incident.status === 'in_progress' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.completeButton]}
                  onPress={() => handleStatusUpdate('completed')}
                  disabled={isUpdating}
                >
                  <CheckCircle color="#FFFFFF" size={20} />
                  <Text style={styles.actionButtonText}>Mark Complete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.actionButton, styles.messageButton]}
                onPress={() => router.push(`/messages/${incident.id}`)}
              >
                <MessageCircle color="#FFFFFF" size={20} />
                <Text style={styles.actionButtonText}>Send Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.callButton]}>
                <Phone color="#FFFFFF" size={20} />
                <Text style={styles.actionButtonText}>Contact Survivor</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0FF',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
  },
  editButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  backToListButton: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backToListButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  caseHeader: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  caseInfo: {
    marginBottom: 16,
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A2CB0',
    marginBottom: 4,
  },
  caseType: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineContent: {
    marginLeft: 12,
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 2,
  },
  timelineText: {
    fontSize: 14,
    color: '#49455A',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationContent: {
    marginLeft: 12,
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: '#49455A',
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 16,
    color: '#341A52',
    lineHeight: 22,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#6A2CB0',
  },
  serviceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  evidenceList: {
    gap: 8,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  evidenceContent: {
    marginLeft: 12,
    flex: 1,
  },
  evidenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
  },
  evidenceType: {
    fontSize: 12,
    color: '#49455A',
  },
  messagesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  messageContent: {
    marginLeft: 8,
    flex: 1,
  },
  messageText: {
    fontSize: 14,
    color: '#341A52',
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 12,
    color: '#49455A',
  },
  viewAllMessages: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F0FF',
  },
  viewAllMessagesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#FF9800',
  },
  completeButton: {
    backgroundColor: '#43A047',
  },
  messageButton: {
    backgroundColor: '#6A2CB0',
  },
  callButton: {
    backgroundColor: '#E24B95',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});