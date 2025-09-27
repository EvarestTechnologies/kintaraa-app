import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Linking } from 'react-native';
import { useProvider } from '@/providers/ProviderContext';
import { Siren, AlertTriangle, Clock, MapPin, User, Phone, Search, Filter, Users, MessageCircle, X, Send } from 'lucide-react-native';

interface EmergencyCase {
  id: string;
  caseNumber: string;
  survivorName: string;
  location: string;
  priority: 'critical' | 'high' | 'medium';
  status: 'pending' | 'responding' | 'resolved';
  reportedAt: string;
  description: string;
  responseTeam?: string;
  estimatedArrival?: string;
  contactNumber?: string;
  lastContact?: string;
  activityLog: Array<{
    timestamp: string;
    action: string;
    details: string;
    user: string;
  }>;
}

export default function EmergencyCases() {
  const { assignedCases } = useProvider();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([]);

  // Mock emergency cases data with enhanced fields
  const mockCases: EmergencyCase[] = [
    {
      id: 'emergency-1',
      caseNumber: 'EMG-241210001',
      survivorName: 'Anonymous Survivor',
      location: '123 Main St, Brooklyn, NY',
      priority: 'critical',
      status: 'pending',
      reportedAt: '2024-12-10T14:30:00Z',
      description: 'Immediate physical danger reported. Suspect still on premises.',
      responseTeam: 'Team Alpha',
      estimatedArrival: '8 minutes',
      contactNumber: '+1-555-****-**01',
      lastContact: '2024-12-10T14:28:00Z',
      activityLog: [
        {
          timestamp: '2024-12-10T14:30:00Z',
          action: 'Case Created',
          details: 'Emergency case reported via hotline',
          user: 'Operator-001'
        }
      ]
    },
    {
      id: 'emergency-2',
      caseNumber: 'EMG-241210002',
      survivorName: 'Maria Rodriguez',
      location: '456 Oak Ave, Manhattan, NY',
      priority: 'high',
      status: 'responding',
      reportedAt: '2024-12-10T13:45:00Z',
      description: 'Escalating domestic violence situation. Survivor in safe room.',
      responseTeam: 'Team Beta',
      estimatedArrival: 'On scene',
      contactNumber: '+1-555-****-**02',
      lastContact: '2024-12-10T13:50:00Z',
      activityLog: [
        {
          timestamp: '2024-12-10T13:45:00Z',
          action: 'Case Created',
          details: 'Emergency case reported',
          user: 'Operator-002'
        },
        {
          timestamp: '2024-12-10T13:48:00Z',
          action: 'Team Dispatched',
          details: 'Team Beta dispatched to location',
          user: 'Dispatcher-001'
        }
      ]
    },
    {
      id: 'emergency-3',
      caseNumber: 'EMG-241210003',
      survivorName: 'Sarah Johnson',
      location: '789 Pine St, Queens, NY',
      priority: 'medium',
      status: 'resolved',
      reportedAt: '2024-12-10T12:15:00Z',
      description: 'Survivor safely relocated to shelter. Follow-up scheduled.',
      responseTeam: 'Team Gamma',
      contactNumber: '+1-555-****-**03',
      lastContact: '2024-12-10T15:30:00Z',
      activityLog: [
        {
          timestamp: '2024-12-10T12:15:00Z',
          action: 'Case Created',
          details: 'Emergency case reported',
          user: 'Operator-003'
        },
        {
          timestamp: '2024-12-10T14:20:00Z',
          action: 'Case Resolved',
          details: 'Survivor safely relocated to shelter',
          user: 'Team Gamma'
        }
      ]
    },
    {
      id: 'emergency-4',
      caseNumber: 'EMG-241210004',
      survivorName: 'Anonymous Survivor',
      location: 'Location withheld for safety',
      priority: 'critical',
      status: 'pending',
      reportedAt: '2024-12-10T14:45:00Z',
      description: 'Sexual assault reported. Medical attention required.',
      responseTeam: 'Team Alpha',
      estimatedArrival: '12 minutes',
      contactNumber: '+1-555-****-**04',
      lastContact: '2024-12-10T14:43:00Z',
      activityLog: [
        {
          timestamp: '2024-12-10T14:45:00Z',
          action: 'Case Created',
          details: 'Critical emergency case - sexual assault reported',
          user: 'Operator-001'
        }
      ]
    }
  ];

  // Initialize cases with state management
  React.useEffect(() => {
    setEmergencyCases(mockCases);
  }, []);

  const filteredCases = emergencyCases.filter(emergencyCase => {
    const matchesSearch = emergencyCase.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emergencyCase.survivorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emergencyCase.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || emergencyCase.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#DC2626';
      case 'responding': return '#D97706';
      case 'resolved': return '#059669';
      default: return '#6B7280';
    }
  };

  const availableTeams = [
    { id: 'team-alpha', name: 'Team Alpha', status: 'available', eta: '8-12 minutes', specialization: 'Critical Response' },
    { id: 'team-beta', name: 'Team Beta', status: 'busy', eta: '15-20 minutes', specialization: 'Medical Support' },
    { id: 'team-gamma', name: 'Team Gamma', status: 'available', eta: '10-15 minutes', specialization: 'Safe Transport' },
    { id: 'team-delta', name: 'Team Delta', status: 'available', eta: '12-18 minutes', specialization: 'Crisis Intervention' }
  ];

  const handleDispatchTeam = (emergencyCase: EmergencyCase) => {
    setSelectedCase(emergencyCase);
    setShowDispatchModal(true);
  };

  const handleContactSurvivor = (emergencyCase: EmergencyCase) => {
    setSelectedCase(emergencyCase);
    setShowContactModal(true);
  };

  const dispatchTeam = (teamId: string) => {
    if (!selectedCase) return;

    const team = availableTeams.find(t => t.id === teamId);
    if (!team) return;

    // Update case with dispatch information
    setEmergencyCases(prev => prev.map(case_ =>
      case_.id === selectedCase.id
        ? {
            ...case_,
            status: 'responding' as const,
            responseTeam: team.name,
            estimatedArrival: team.eta,
            activityLog: [
              ...case_.activityLog,
              {
                timestamp: new Date().toISOString(),
                action: 'Team Dispatched',
                details: `${team.name} dispatched to location - ETA: ${team.eta}`,
                user: 'Dispatcher-001'
              }
            ]
          }
        : case_
    ));

    setShowDispatchModal(false);
    setSelectedCase(null);

    Alert.alert(
      'Team Dispatched Successfully',
      `${team.name} has been dispatched to ${selectedCase.location}. ETA: ${team.eta}`,
      [{ text: 'OK' }]
    );
  };

  const contactSurvivor = (method: 'call' | 'sms' | 'secure') => {
    if (!selectedCase) return;

    const contactMethods = {
      call: () => {
        const phoneNumber = selectedCase.contactNumber?.replace(/[^\d+]/g, '') || '';
        if (phoneNumber) {
          Linking.openURL(`tel:${phoneNumber}`);
        } else {
          Alert.alert('Error', 'No contact number available for this case.');
        }
      },
      sms: () => {
        const phoneNumber = selectedCase.contactNumber?.replace(/[^\d+]/g, '') || '';
        if (phoneNumber) {
          Linking.openURL(`sms:${phoneNumber}`);
        } else {
          Alert.alert('Error', 'No contact number available for this case.');
        }
      },
      secure: () => {
        Alert.alert('Secure Messaging', 'Opening secure communication channel...', [{ text: 'OK' }]);
      }
    };

    // Log contact attempt
    setEmergencyCases(prev => prev.map(case_ =>
      case_.id === selectedCase.id
        ? {
            ...case_,
            lastContact: new Date().toISOString(),
            activityLog: [
              ...case_.activityLog,
              {
                timestamp: new Date().toISOString(),
                action: 'Contact Attempt',
                details: `${method.toUpperCase()} contact initiated`,
                user: 'Operator-001'
              }
            ]
          }
        : case_
    ));

    contactMethods[method]();
    setShowContactModal(false);
    setSelectedCase(null);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Cases</Text>
        <Text style={styles.subtitle}>Real-time emergency response management</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cases..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? '#FFFFFF' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      {/* Priority Filter */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
        {['all', 'critical', 'high', 'medium'].map((priority) => (
          <TouchableOpacity
            key={priority}
            style={[
              styles.filterChip,
              filterPriority === priority && styles.filterChipActive
            ]}
            onPress={() => setFilterPriority(priority)}
          >
            <Text style={[
              styles.filterChipText,
              filterPriority === priority && styles.filterChipTextActive
            ]}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
          </ScrollView>
        </View>
      )}

      {/* Emergency Cases List */}
      <ScrollView style={styles.casesList} showsVerticalScrollIndicator={false}>
        {filteredCases.map((emergencyCase) => (
          <View key={emergencyCase.id} style={styles.caseCard}>
            {/* Case Header */}
            <View style={styles.caseHeader}>
              <View style={styles.caseInfo}>
                <Text style={styles.caseNumber}>{emergencyCase.caseNumber}</Text>
                <View style={styles.priorityBadge}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(emergencyCase.priority) }]} />
                  <Text style={[styles.priorityText, { color: getPriorityColor(emergencyCase.priority) }]}>
                    {emergencyCase.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(emergencyCase.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(emergencyCase.status) }]}>
                  {emergencyCase.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Case Details */}
            <View style={styles.caseDetails}>
              <View style={styles.detailRow}>
                <User color="#6B7280" size={16} />
                <Text style={styles.detailText}>{emergencyCase.survivorName}</Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin color="#6B7280" size={16} />
                <Text style={styles.detailText}>{emergencyCase.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock color="#6B7280" size={16} />
                <Text style={styles.detailText}>Reported at {formatTime(emergencyCase.reportedAt)}</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.description}>{emergencyCase.description}</Text>

            {/* Response Info */}
            {emergencyCase.responseTeam && (
              <View style={styles.responseInfo}>
                <Text style={styles.responseTeam}>Response Team: {emergencyCase.responseTeam}</Text>
                {emergencyCase.estimatedArrival && (
                  <Text style={styles.estimatedArrival}>ETA: {emergencyCase.estimatedArrival}</Text>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {emergencyCase.status === 'pending' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.dispatchButton]}
                  onPress={() => handleDispatchTeam(emergencyCase)}
                >
                  <Siren color="#FFFFFF" size={16} />
                  <Text style={styles.dispatchButtonText}>Dispatch Team</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.contactButton]}
                onPress={() => handleContactSurvivor(emergencyCase)}
              >
                <Phone color="#3B82F6" size={16} />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dispatch Team Modal */}
      <Modal
        visible={showDispatchModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDispatchModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDispatchModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Dispatch Emergency Team</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedCase && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.caseOverview}>
                <Text style={styles.modalSectionTitle}>Case Overview</Text>
                <Text style={styles.caseNumber}>{selectedCase.caseNumber}</Text>
                <Text style={styles.caseLocation}>{selectedCase.location}</Text>
                <Text style={styles.casePriority}>Priority: {selectedCase.priority.toUpperCase()}</Text>
              </View>

              <View style={styles.teamsSection}>
                <Text style={styles.modalSectionTitle}>Available Teams</Text>
                {availableTeams.map((team) => (
                  <TouchableOpacity
                    key={team.id}
                    style={[
                      styles.teamCard,
                      team.status === 'busy' && styles.teamCardDisabled
                    ]}
                    onPress={() => team.status === 'available' && dispatchTeam(team.id)}
                    disabled={team.status === 'busy'}
                  >
                    <View style={styles.teamInfo}>
                      <Text style={styles.teamName}>{team.name}</Text>
                      <Text style={styles.teamSpecialization}>{team.specialization}</Text>
                      <Text style={styles.teamEta}>ETA: {team.eta}</Text>
                    </View>
                    <View style={[
                      styles.teamStatus,
                      { backgroundColor: team.status === 'available' ? '#10B981' : '#F59E0B' }
                    ]}>
                      <Text style={styles.teamStatusText}>
                        {team.status.toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Contact Survivor Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowContactModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Contact Survivor</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedCase && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.caseOverview}>
                <Text style={styles.modalSectionTitle}>Contact Information</Text>
                <Text style={styles.caseNumber}>{selectedCase.caseNumber}</Text>
                <Text style={styles.survivorName}>{selectedCase.survivorName}</Text>
                <Text style={styles.contactNumber}>
                  {selectedCase.contactNumber || 'No contact number available'}
                </Text>
                <Text style={styles.lastContact}>
                  Last Contact: {selectedCase.lastContact ?
                    new Date(selectedCase.lastContact).toLocaleString() : 'Never'
                  }
                </Text>
              </View>

              <View style={styles.contactMethods}>
                <Text style={styles.modalSectionTitle}>Contact Methods</Text>

                <TouchableOpacity
                  style={styles.contactMethodCard}
                  onPress={() => contactSurvivor('call')}
                >
                  <Phone size={24} color="#10B981" />
                  <View style={styles.contactMethodInfo}>
                    <Text style={styles.contactMethodTitle}>Voice Call</Text>
                    <Text style={styles.contactMethodDescription}>
                      Direct phone call to survivor
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.contactMethodCard}
                  onPress={() => contactSurvivor('sms')}
                >
                  <MessageCircle size={24} color="#3B82F6" />
                  <View style={styles.contactMethodInfo}>
                    <Text style={styles.contactMethodTitle}>Text Message</Text>
                    <Text style={styles.contactMethodDescription}>
                      Send SMS message
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.contactMethodCard}
                  onPress={() => contactSurvivor('secure')}
                >
                  <Send size={24} color="#7C3AED" />
                  <View style={styles.contactMethodInfo}>
                    <Text style={styles.contactMethodTitle}>Secure Channel</Text>
                    <Text style={styles.contactMethodDescription}>
                      Encrypted messaging system
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  filterScroll: {
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  casesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  caseInfo: {
    flex: 1,
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  caseDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  responseInfo: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  responseTeam: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  estimatedArrival: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  dispatchButton: {
    backgroundColor: '#DC2626',
  },
  dispatchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  contactButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  contactButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  caseOverview: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  caseLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  casePriority: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  survivorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  lastContact: {
    fontSize: 12,
    color: '#6B7280',
  },
  teamsSection: {
    marginBottom: 20,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  teamCardDisabled: {
    opacity: 0.5,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  teamSpecialization: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  teamEta: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  teamStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  teamStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactMethods: {
    marginBottom: 20,
  },
  contactMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  contactMethodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactMethodDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});