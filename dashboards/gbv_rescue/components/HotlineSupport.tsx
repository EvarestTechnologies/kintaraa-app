import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Headphones, Phone, Clock, User, MessageCircle, Search, Filter, CheckCircle, X, Send, UserCheck, AlertTriangle, Shield, FileText, Calendar } from 'lucide-react-native';

interface HotlineCall {
  id: string;
  callId: string;
  callerName: string;
  phoneNumber: string;
  status: 'active' | 'waiting' | 'completed' | 'missed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  startTime: string;
  duration?: number;
  notes?: string;
  assignedCounselor?: string;
  followUpRequired: boolean;
  callType?: 'crisis' | 'information' | 'support' | 'referral';
  riskLevel?: 'high' | 'medium' | 'low';
  resourcesProvided?: string[];
  transferHistory?: Array<{
    from: string;
    to: string;
    timestamp: string;
    reason: string;
  }>;
  safetyPlan?: {
    created: boolean;
    planDetails?: string;
  };
}

export default function HotlineSupport() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCall, setSelectedCall] = useState<HotlineCall | null>(null);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [showAnswerModal, setShowAnswerModal] = useState<boolean>(false);
  const [hotlineCalls, setHotlineCalls] = useState<HotlineCall[]>([]);
  const [activeCallTimers, setActiveCallTimers] = useState<{[key: string]: number}>({});
  const [callNotes, setCallNotes] = useState<string>('');

  const availableCounselors = [
    { id: 'sarah', name: 'Sarah Johnson', specialization: 'Crisis Intervention', status: 'available' },
    { id: 'michael', name: 'Michael Chen', specialization: 'Trauma Counseling', status: 'busy' },
    { id: 'emily', name: 'Emily Rodriguez', specialization: 'Legal Support', status: 'available' },
    { id: 'david', name: 'David Kim', specialization: 'Youth Services', status: 'available' },
    { id: 'maria', name: 'Maria Santos', specialization: 'Bilingual Support', status: 'busy' }
  ];

  // Initialize hotline calls data
  useEffect(() => {
    const initialCalls: HotlineCall[] = [
    {
      id: 'call-1',
      callId: 'HOT-241210001',
      callerName: 'Anonymous Caller',
      phoneNumber: '+1-555-****-**01',
      status: 'active',
      priority: 'critical',
      startTime: '2024-12-10T14:30:00Z',
      assignedCounselor: 'Sarah Johnson',
      followUpRequired: true
    },
    {
      id: 'call-2',
      callId: 'HOT-241210002',
      callerName: 'Maria R.',
      phoneNumber: '+1-555-****-**02',
      status: 'waiting',
      priority: 'high',
      startTime: '2024-12-10T14:25:00Z',
      followUpRequired: false
    },
    {
      id: 'call-3',
      callId: 'HOT-241210003',
      callerName: 'Jennifer S.',
      phoneNumber: '+1-555-****-**03',
      status: 'completed',
      priority: 'medium',
      startTime: '2024-12-10T13:45:00Z',
      duration: 25,
      notes: 'Provided safety planning resources. Caller in stable situation.',
      assignedCounselor: 'Michael Chen',
      followUpRequired: true
    },
    {
      id: 'call-4',
      callId: 'HOT-241210004',
      callerName: 'Anonymous Caller',
      phoneNumber: '+1-555-****-**04',
      status: 'missed',
      priority: 'high',
      startTime: '2024-12-10T13:30:00Z',
      followUpRequired: true
    },
    {
      id: 'call-5',
      callId: 'HOT-241210005',
      callerName: 'Lisa M.',
      phoneNumber: '+1-555-****-**05',
      status: 'completed',
      priority: 'low',
      startTime: '2024-12-10T12:15:00Z',
      duration: 15,
      notes: 'Information request about legal resources.',
      assignedCounselor: 'Emily Rodriguez',
      followUpRequired: false,
      callType: 'information',
      riskLevel: 'low',
      resourcesProvided: ['Legal Resources Directory'],
      transferHistory: [],
      safetyPlan: { created: false }
    }
    ];
    setHotlineCalls(initialCalls);
  }, []);

  // Call timer management
  useEffect(() => {
    const interval = setInterval(() => {
      const activeCalls = hotlineCalls.filter(call => call.status === 'active');
      const timers: {[key: string]: number} = {};

      activeCalls.forEach(call => {
        const startTime = new Date(call.startTime).getTime();
        const currentTime = new Date().getTime();
        const duration = Math.floor((currentTime - startTime) / 1000 / 60); // minutes
        timers[call.id] = duration;
      });

      setActiveCallTimers(timers);
    }, 1000);

    return () => clearInterval(interval);
  }, [hotlineCalls]);

  const filteredCalls = hotlineCalls.filter(call => {
    const matchesSearch = call.callId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         call.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (call.assignedCounselor && call.assignedCounselor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'waiting': return '#F59E0B';
      case 'completed': return '#6B7280';
      case 'missed': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const handleAnswerCall = (call: HotlineCall) => {
    setSelectedCall(call);
    setShowAnswerModal(true);
  };

  const handleTransferCall = (call: HotlineCall) => {
    setSelectedCall(call);
    setShowTransferModal(true);
  };

  const handleAddNotes = (call: HotlineCall) => {
    setSelectedCall(call);
    setCallNotes(call.notes || '');
    setShowNotesModal(true);
  };

  const answerCall = () => {
    if (!selectedCall) return;

    setHotlineCalls(prev => prev.map(call =>
      call.id === selectedCall.id
        ? {
            ...call,
            status: 'active' as const,
            assignedCounselor: 'Current Operator',
            startTime: new Date().toISOString()
          }
        : call
    ));

    setShowAnswerModal(false);
    setSelectedCall(null);

    Alert.alert(
      'Call Connected',
      `You are now connected to ${selectedCall.callerName}. Call timer started.`,
      [{ text: 'OK' }]
    );
  };

  const transferCall = (counselorId: string) => {
    if (!selectedCall) return;

    const counselor = availableCounselors.find(c => c.id === counselorId);
    if (!counselor) return;

    setHotlineCalls(prev => prev.map(call =>
      call.id === selectedCall.id
        ? {
            ...call,
            assignedCounselor: counselor.name,
            transferHistory: [
              ...(call.transferHistory || []),
              {
                from: call.assignedCounselor || 'Current Operator',
                to: counselor.name,
                timestamp: new Date().toISOString(),
                reason: `Transferred to ${counselor.specialization} specialist`
              }
            ]
          }
        : call
    ));

    setShowTransferModal(false);
    setSelectedCall(null);

    Alert.alert(
      'Call Transferred',
      `Call successfully transferred to ${counselor.name} (${counselor.specialization})`,
      [{ text: 'OK' }]
    );
  };

  const saveNotes = () => {
    if (!selectedCall) return;

    setHotlineCalls(prev => prev.map(call =>
      call.id === selectedCall.id
        ? { ...call, notes: callNotes }
        : call
    ));

    setShowNotesModal(false);
    setSelectedCall(null);
    setCallNotes('');

    Alert.alert('Notes Saved', 'Call notes have been saved successfully.', [{ text: 'OK' }]);
  };

  const completeCall = (callId: string) => {
    setHotlineCalls(prev => prev.map(call =>
      call.id === callId
        ? {
            ...call,
            status: 'completed' as const,
            duration: activeCallTimers[callId] || 0
          }
        : call
    ));

    Alert.alert('Call Completed', 'Call has been marked as completed.', [{ text: 'OK' }]);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hotline Support</Text>
        <Text style={styles.subtitle}>Crisis hotline call management</Text>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Active Calls</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Waiting</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>47</Text>
          <Text style={styles.statLabel}>Today's Calls</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>18m</Text>
          <Text style={styles.statLabel}>Avg Duration</Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search calls..."
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

      {/* Status Filter */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
        {['all', 'active', 'waiting', 'completed', 'missed'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterChip,
              filterStatus === status && styles.filterChipActive
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[
              styles.filterChipText,
              filterStatus === status && styles.filterChipTextActive
            ]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
          </ScrollView>
        </View>
      )}

      {/* Calls List */}
      <ScrollView style={styles.callsList} showsVerticalScrollIndicator={false}>
        {filteredCalls.map((call) => (
          <View key={call.id} style={styles.callCard}>
            {/* Call Header */}
            <View style={styles.callHeader}>
              <View style={styles.callInfo}>
                <Text style={styles.callId}>{call.callId}</Text>
                <View style={styles.priorityBadge}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(call.priority) }]} />
                  <Text style={[styles.priorityText, { color: getPriorityColor(call.priority) }]}>
                    {call.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(call.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(call.status) }]}>
                  {call.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Call Details */}
            <View style={styles.callDetails}>
              <View style={styles.detailRow}>
                <User color="#6B7280" size={16} />
                <Text style={styles.detailText}>{call.callerName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Phone color="#6B7280" size={16} />
                <Text style={styles.detailText}>{call.phoneNumber}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock color="#6B7280" size={16} />
                <Text style={styles.detailText}>
                  Started at {formatTime(call.startTime)}
                  {call.duration && ` • Duration: ${formatDuration(call.duration)}`}
                </Text>
              </View>
              {call.assignedCounselor && (
                <View style={styles.detailRow}>
                  <Headphones color="#6B7280" size={16} />
                  <Text style={styles.detailText}>Counselor: {call.assignedCounselor}</Text>
                </View>
              )}
            </View>

            {/* Notes */}
            {call.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notes:</Text>
                <Text style={styles.notesText}>{call.notes}</Text>
              </View>
            )}

            {/* Follow-up indicator */}
            {call.followUpRequired && (
              <View style={styles.followUpBadge}>
                <CheckCircle color="#F59E0B" size={16} />
                <Text style={styles.followUpText}>Follow-up required</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {call.status === 'waiting' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.answerButton]}
                  onPress={() => handleAnswerCall(call)}
                >
                  <Phone color="#FFFFFF" size={16} />
                  <Text style={styles.answerButtonText}>Answer</Text>
                </TouchableOpacity>
              )}
              {call.status === 'active' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.transferButton]}
                  onPress={() => handleTransferCall(call)}
                >
                  <Headphones color="#7C3AED" size={16} />
                  <Text style={styles.transferButtonText}>Transfer</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.notesButton]}
                onPress={() => handleAddNotes(call)}
              >
                <MessageCircle color="#3B82F6" size={16} />
                <Text style={styles.notesButtonText}>Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Answer Call Modal */}
      <Modal
        visible={showAnswerModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAnswerModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAnswerModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Answer Call</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedCall && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.callOverview}>
                <Text style={styles.modalSectionTitle}>Incoming Call</Text>
                <Text style={styles.callId}>{selectedCall.callId}</Text>
                <Text style={styles.callerName}>{selectedCall.callerName}</Text>
                <Text style={styles.phoneNumber}>{selectedCall.phoneNumber}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(selectedCall.priority) + '20' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(selectedCall.priority) }]}>
                    {selectedCall.priority.toUpperCase()} PRIORITY
                  </Text>
                </View>
              </View>

              <View style={styles.crisisTools}>
                <Text style={styles.modalSectionTitle}>Crisis Intervention Tools</Text>
                <TouchableOpacity style={styles.toolButton}>
                  <Shield size={20} color="#DC2626" />
                  <Text style={styles.toolButtonText}>Safety Assessment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolButton}>
                  <AlertTriangle size={20} color="#F59E0B" />
                  <Text style={styles.toolButtonText}>Risk Evaluation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolButton}>
                  <FileText size={20} color="#3B82F6" />
                  <Text style={styles.toolButtonText}>Resource Directory</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.answerCallButton} onPress={answerCall}>
                <Phone size={24} color="#FFFFFF" />
                <Text style={styles.answerCallButtonText}>Answer Call</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Transfer Call Modal */}
      <Modal
        visible={showTransferModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTransferModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTransferModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Transfer Call</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedCall && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.callOverview}>
                <Text style={styles.modalSectionTitle}>Current Call</Text>
                <Text style={styles.callId}>{selectedCall.callId}</Text>
                <Text style={styles.callerName}>{selectedCall.callerName}</Text>
                <Text style={styles.currentCounselor}>
                  Current: {selectedCall.assignedCounselor || 'Current Operator'}
                </Text>
                {activeCallTimers[selectedCall.id] && (
                  <Text style={styles.callDuration}>
                    Duration: {activeCallTimers[selectedCall.id]} minutes
                  </Text>
                )}
              </View>

              <View style={styles.counselorsSection}>
                <Text style={styles.modalSectionTitle}>Available Counselors</Text>
                {availableCounselors.map((counselor) => (
                  <TouchableOpacity
                    key={counselor.id}
                    style={[
                      styles.counselorCard,
                      counselor.status === 'busy' && styles.counselorCardDisabled
                    ]}
                    onPress={() => counselor.status === 'available' && transferCall(counselor.id)}
                    disabled={counselor.status === 'busy'}
                  >
                    <View style={styles.counselorInfo}>
                      <Text style={styles.counselorName}>{counselor.name}</Text>
                      <Text style={styles.counselorSpecialization}>{counselor.specialization}</Text>
                    </View>
                    <View style={[
                      styles.counselorStatus,
                      { backgroundColor: counselor.status === 'available' ? '#10B981' : '#F59E0B' }
                    ]}>
                      <Text style={styles.counselorStatusText}>
                        {counselor.status.toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Notes Modal */}
      <Modal
        visible={showNotesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNotesModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Call Notes</Text>
            <TouchableOpacity onPress={saveNotes}>
              <Send size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {selectedCall && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.callOverview}>
                <Text style={styles.modalSectionTitle}>Call Information</Text>
                <Text style={styles.callId}>{selectedCall.callId}</Text>
                <Text style={styles.callerName}>{selectedCall.callerName}</Text>
                {activeCallTimers[selectedCall.id] && (
                  <Text style={styles.callDuration}>
                    Duration: {activeCallTimers[selectedCall.id]} minutes
                  </Text>
                )}
              </View>

              <View style={styles.notesSection}>
                <Text style={styles.modalSectionTitle}>Notes</Text>
                <TextInput
                  style={styles.notesInput}
                  multiline
                  numberOfLines={10}
                  placeholder="Enter detailed call notes, assessments, resources provided, and follow-up actions..."
                  placeholderTextColor="#9CA3AF"
                  value={callNotes}
                  onChangeText={setCallNotes}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.quickNotes}>
                <Text style={styles.modalSectionTitle}>Quick Templates</Text>
                <TouchableOpacity
                  style={styles.templateButton}
                  onPress={() => setCallNotes(prev => prev + '\n\nCrisis Assessment:\n- Immediate danger: \n- Safety plan needed: \n- Resources provided: \n')}
                >
                  <Text style={styles.templateButtonText}>Crisis Assessment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.templateButton}
                  onPress={() => setCallNotes(prev => prev + '\n\nResources Provided:\n- Legal aid referral\n- Shelter information\n- Counseling services\n')}
                >
                  <Text style={styles.templateButtonText}>Resources Provided</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.templateButton}
                  onPress={() => setCallNotes(prev => prev + '\n\nFollow-up Required:\n- Date: \n- Action: \n- Responsible: \n')}
                >
                  <Text style={styles.templateButtonText}>Follow-up Plan</Text>
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
  statsBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
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
  callsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  callCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  callInfo: {
    flex: 1,
  },
  callId: {
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
  callDetails: {
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
  notesContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  followUpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  followUpText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
    marginLeft: 4,
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
  answerButton: {
    backgroundColor: '#10B981',
  },
  answerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  transferButton: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  transferButtonText: {
    color: '#7C3AED',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  notesButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  notesButtonText: {
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
  callOverview: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  callerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  currentCounselor: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  callDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  crisisTools: {
    marginBottom: 20,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  toolButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  answerCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  answerCallButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  counselorsSection: {
    marginBottom: 20,
  },
  counselorCard: {
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
  counselorCardDisabled: {
    opacity: 0.5,
  },
  counselorInfo: {
    flex: 1,
  },
  counselorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  counselorSpecialization: {
    fontSize: 14,
    color: '#6B7280',
  },
  counselorStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  counselorStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 150,
  },
  quickNotes: {
    marginBottom: 20,
  },
  templateButton: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 8,
  },
  templateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
});