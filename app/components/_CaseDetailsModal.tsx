/**
 * Shared Case Details Modal Component
 * Used by all provider types to view and manage their assigned cases
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  FileText,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';

export interface CaseDetails {
  id: string;
  incidentId: string;
  caseNumber: string;
  status: string;
  type: string;
  description: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  urgencyLevel: string;
  survivorName?: string;
  survivorContact?: string;
  assignedAt: string;
  acceptedAt?: string;
  supportServices: string[];
}

interface CaseDetailsModalProps {
  visible: boolean;
  case_: CaseDetails | null;
  onClose: () => void;
  onUpdateStatus?: (newStatus: string) => Promise<void>;
  onAddNote?: (note: string) => Promise<void>;
}

export default function CaseDetailsModal({
  visible,
  case_,
  onClose,
  onUpdateStatus,
  onAddNote,
}: CaseDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!case_) return null;

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency?.toLowerCase()) {
      case 'immediate':
        return '#DC2626';
      case 'urgent':
        return '#F59E0B';
      case 'routine':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'in_progress':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      case 'assigned':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!onUpdateStatus) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(newStatus);
      setShowStatusMenu(false);
      Alert.alert('Success', `Case status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update case status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !onAddNote) return;

    setIsUpdating(true);
    try {
      await onAddNote(noteText.trim());
      setNoteText('');
      setShowNoteInput(false);
      Alert.alert('Success', 'Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      Alert.alert('Error', 'Failed to add note');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCall = () => {
    if (!case_.survivorContact) {
      Alert.alert('No Contact', 'Survivor contact information is not available');
      return;
    }
    const phoneNumber = case_.survivorContact.replace(/[^\d+]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessage = () => {
    Alert.alert(
      'Secure Messaging',
      'Secure in-app messaging will be available soon. For now, please use phone contact.',
      [{ text: 'OK' }]
    );
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string): string => {
    try {
      // Handle both time-only and full datetime strings
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Case Details</Text>
            <Text style={styles.caseNumber}>{case_.caseNumber}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color="#6B7280" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status Badge */}
          <View style={styles.section}>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(case_.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {case_.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.urgencyBadge,
                  { backgroundColor: getUrgencyColor(case_.urgencyLevel) },
                ]}
              >
                <AlertTriangle color="#FFFFFF" size={14} />
                <Text style={styles.urgencyText}>
                  {case_.urgencyLevel?.toUpperCase() || 'ROUTINE'}
                </Text>
              </View>
            </View>
          </View>

          {/* Incident Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Incident Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <FileText color="#6B7280" size={20} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Type</Text>
                  <Text style={styles.infoValue}>{case_.type}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Calendar color="#6B7280" size={20} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Incident Date</Text>
                  <Text style={styles.infoValue}>{formatDate(case_.incidentDate)}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Clock color="#6B7280" size={20} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Incident Time</Text>
                  <Text style={styles.infoValue}>{formatTime(case_.incidentTime)}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MapPin color="#6B7280" size={20} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{case_.location || 'Not specified'}</Text>
                </View>
              </View>

              {case_.survivorName && (
                <View style={styles.infoRow}>
                  <User color="#6B7280" size={20} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Survivor</Text>
                    <Text style={styles.infoValue}>{case_.survivorName}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{case_.description}</Text>
            </View>
          </View>

          {/* Support Services */}
          {case_.supportServices && case_.supportServices.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requested Support Services</Text>
              <View style={styles.servicesContainer}>
                {case_.supportServices.map((service, index) => (
                  <View key={index} style={styles.serviceChip}>
                    <Text style={styles.serviceText}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Assignment Timeline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assignment Timeline</Text>
            <View style={styles.infoCard}>
              <View style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Assigned</Text>
                  <Text style={styles.timelineValue}>{formatDate(case_.assignedAt)}</Text>
                </View>
              </View>
              {case_.acceptedAt && (
                <View style={styles.timelineRow}>
                  <View style={[styles.timelineDot, { backgroundColor: '#10B981' }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>Accepted</Text>
                    <Text style={styles.timelineValue}>{formatDate(case_.acceptedAt)}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Contact Actions */}
          {case_.survivorContact && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Survivor</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                  <Phone color="#10B981" size={20} />
                  <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                  onPress={handleMessage}
                >
                  <MessageCircle color="#3B82F6" size={20} />
                  <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>
                    Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Status Update Actions */}
          {onUpdateStatus && case_.status !== 'completed' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Update Case Status</Text>
              <View style={styles.statusActions}>
                {case_.status === 'in_progress' && (
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleStatusUpdate('completed')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <CheckCircle color="#FFFFFF" size={20} />
                        <Text style={styles.completeButtonText}>Mark as Complete</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  caseNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  descriptionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  serviceText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '500',
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  timelineValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  actionButtonSecondary: {
    borderColor: '#3B82F6',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10B981',
  },
  statusActions: {
    gap: 12,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
