import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Headphones, Phone, Clock, User, MessageCircle, Search, Filter, CheckCircle } from 'lucide-react-native';

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
}

export default function HotlineSupport() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock hotline calls data
  const hotlineCalls: HotlineCall[] = [
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
      followUpRequired: false
    }
  ];

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

  const handleAnswerCall = (callId: string) => {
    console.log('Answering call:', callId);
  };

  const handleTransferCall = (callId: string) => {
    Alert.alert(
      'Transfer Call',
      'Select a counselor to transfer this call to:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sarah Johnson', onPress: () => console.log('Transferred to Sarah Johnson') },
        { text: 'Michael Chen', onPress: () => console.log('Transferred to Michael Chen') },
        { text: 'Emily Rodriguez', onPress: () => console.log('Transferred to Emily Rodriguez') }
      ]
    );
  };

  const handleAddNotes = (callId: string) => {
    console.log('Adding notes for call:', callId);
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
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#6B7280" size={20} />
        </TouchableOpacity>
      </View>

      {/* Status Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
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
                  onPress={() => handleAnswerCall(call.id)}
                >
                  <Phone color="#FFFFFF" size={16} />
                  <Text style={styles.answerButtonText}>Answer</Text>
                </TouchableOpacity>
              )}
              {call.status === 'active' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.transferButton]}
                  onPress={() => handleTransferCall(call.id)}
                >
                  <Headphones color="#7C3AED" size={16} />
                  <Text style={styles.transferButtonText}>Transfer</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.notesButton]}
                onPress={() => handleAddNotes(call.id)}
              >
                <MessageCircle color="#3B82F6" size={16} />
                <Text style={styles.notesButtonText}>Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#7C3AED',
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
});