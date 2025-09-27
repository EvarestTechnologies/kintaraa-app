import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Users, Shield, MapPin, Clock, User, Phone, Search, Filter, CheckCircle, AlertTriangle, X, Send, Radio, Navigation, Headphones } from 'lucide-react-native';

interface ResponseTeam {
  id: string;
  name: string;
  type: 'emergency' | 'medical' | 'counseling' | 'legal';
  status: 'available' | 'deployed' | 'busy' | 'off_duty';
  members: TeamMember[];
  currentLocation?: string;
  currentCase?: string;
  lastActivity: string;
  responseTime: number; // in minutes
  completedCases: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'busy' | 'off_duty';
  phone: string;
}

export default function ResponseTeam() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<ResponseTeam | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);

  // Mock response teams data
  const responseTeams: ResponseTeam[] = [
    {
      id: 'team-1',
      name: 'Emergency Team Alpha',
      type: 'emergency',
      status: 'available',
      members: [
        { id: 'member-1', name: 'Sarah Johnson', role: 'Team Lead', status: 'available', phone: '+1-555-0101' },
        { id: 'member-2', name: 'Michael Chen', role: 'Crisis Counselor', status: 'available', phone: '+1-555-0102' },
        { id: 'member-3', name: 'Emily Rodriguez', role: 'Medical Support', status: 'available', phone: '+1-555-0103' }
      ],
      lastActivity: '2024-12-10T12:30:00Z',
      responseTime: 8,
      completedCases: 45
    },
    {
      id: 'team-2',
      name: 'Emergency Team Beta',
      type: 'emergency',
      status: 'deployed',
      members: [
        { id: 'member-4', name: 'David Wilson', role: 'Team Lead', status: 'busy', phone: '+1-555-0104' },
        { id: 'member-5', name: 'Lisa Thompson', role: 'Crisis Counselor', status: 'busy', phone: '+1-555-0105' },
        { id: 'member-6', name: 'James Brown', role: 'Security Specialist', status: 'busy', phone: '+1-555-0106' }
      ],
      currentLocation: '456 Oak Ave, Manhattan, NY',
      currentCase: 'EMG-241210002',
      lastActivity: '2024-12-10T14:30:00Z',
      responseTime: 12,
      completedCases: 38
    },
    {
      id: 'team-3',
      name: 'Medical Response Unit',
      type: 'medical',
      status: 'available',
      members: [
        { id: 'member-7', name: 'Dr. Amanda Davis', role: 'Emergency Physician', status: 'available', phone: '+1-555-0107' },
        { id: 'member-8', name: 'Nurse Patricia Miller', role: 'Trauma Nurse', status: 'available', phone: '+1-555-0108' }
      ],
      lastActivity: '2024-12-10T11:15:00Z',
      responseTime: 15,
      completedCases: 67
    },
    {
      id: 'team-4',
      name: 'Crisis Counseling Team',
      type: 'counseling',
      status: 'busy',
      members: [
        { id: 'member-9', name: 'Dr. Robert Garcia', role: 'Lead Counselor', status: 'busy', phone: '+1-555-0109' },
        { id: 'member-10', name: 'Maria Martinez', role: 'Trauma Specialist', status: 'available', phone: '+1-555-0110' },
        { id: 'member-11', name: 'Jennifer Lee', role: 'Family Counselor', status: 'busy', phone: '+1-555-0111' }
      ],
      lastActivity: '2024-12-10T13:45:00Z',
      responseTime: 20,
      completedCases: 89
    },
    {
      id: 'team-5',
      name: 'Legal Support Team',
      type: 'legal',
      status: 'available',
      members: [
        { id: 'member-12', name: 'Attorney John Smith', role: 'Legal Advocate', status: 'available', phone: '+1-555-0112' },
        { id: 'member-13', name: 'Paralegal Susan White', role: 'Legal Assistant', status: 'available', phone: '+1-555-0113' }
      ],
      lastActivity: '2024-12-10T10:00:00Z',
      responseTime: 30,
      completedCases: 23
    }
  ];

  const filteredTeams = responseTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.members.some(member => member.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || team.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'deployed': return '#F59E0B';
      case 'busy': return '#EF4444';
      case 'off_duty': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return '#DC2626';
      case 'medical': return '#059669';
      case 'counseling': return '#7C3AED';
      case 'legal': return '#2563EB';
      default: return '#6B7280';
    }
  };

  const handleDispatchTeam = (teamId: string) => {
    const team = responseTeams.find(t => t.id === teamId);
    if (team) {
      setSelectedTeam(team);
      setShowDispatchModal(true);
    }
  };

  const handleContactTeam = (teamId: string) => {
    const team = responseTeams.find(t => t.id === teamId);
    if (team) {
      setSelectedTeam(team);
      setShowContactModal(true);
    }
  };

  const handleViewDetails = (teamId: string) => {
    const team = responseTeams.find(t => t.id === teamId);
    if (team) {
      setSelectedTeam(team);
      setShowDetailsModal(true);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Response Teams</Text>
        <Text style={styles.subtitle}>Emergency response team coordination</Text>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Deployed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Busy</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>15m</Text>
          <Text style={styles.statLabel}>Avg Response</Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search teams..."
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
            {['all', 'available', 'deployed', 'busy', 'off_duty'].map((status) => (
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
                  {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Teams List */}
      <ScrollView style={styles.teamsList} showsVerticalScrollIndicator={false}>
        {filteredTeams.map((team) => (
          <View key={team.id} style={styles.teamCard}>
            {/* Team Header */}
            <View style={styles.teamHeader}>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{team.name}</Text>
                <View style={styles.teamBadges}>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeColor(team.type) + '20' }]}>
                    <Text style={[styles.typeText, { color: getTypeColor(team.type) }]}>
                      {team.type.toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(team.status) + '20' }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(team.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(team.status) }]}>
                      {team.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Team Stats */}
            <View style={styles.teamStats}>
              <View style={styles.statRow}>
                <Users color="#6B7280" size={16} />
                <Text style={styles.statText}>{team.members.length} members</Text>
              </View>
              <View style={styles.statRow}>
                <Clock color="#6B7280" size={16} />
                <Text style={styles.statText}>{team.responseTime}m avg response</Text>
              </View>
              <View style={styles.statRow}>
                <CheckCircle color="#6B7280" size={16} />
                <Text style={styles.statText}>{team.completedCases} cases completed</Text>
              </View>
            </View>

            {/* Current Assignment */}
            {team.status === 'deployed' && team.currentCase && (
              <View style={styles.currentAssignment}>
                <AlertTriangle color="#F59E0B" size={16} />
                <View style={styles.assignmentDetails}>
                  <Text style={styles.assignmentTitle}>Currently Deployed</Text>
                  <Text style={styles.assignmentText}>Case: {team.currentCase}</Text>
                  {team.currentLocation && (
                    <Text style={styles.assignmentLocation}>Location: {team.currentLocation}</Text>
                  )}
                </View>
              </View>
            )}

            {/* Team Members */}
            <View style={styles.membersContainer}>
              <Text style={styles.membersTitle}>Team Members</Text>
              {team.members.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  <View style={styles.memberStatus}>
                    <View style={[styles.memberStatusDot, { backgroundColor: getStatusColor(member.status) }]} />
                    <Text style={[styles.memberStatusText, { color: getStatusColor(member.status) }]}>
                      {member.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Last Activity */}
            <View style={styles.lastActivity}>
              <Clock color="#6B7280" size={14} />
              <Text style={styles.lastActivityText}>Last activity: {formatTime(team.lastActivity)}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {team.status === 'available' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.dispatchButton]}
                  onPress={() => handleDispatchTeam(team.id)}
                >
                  <Shield color="#FFFFFF" size={16} />
                  <Text style={styles.dispatchButtonText}>Dispatch</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.contactButton]}
                onPress={() => handleContactTeam(team.id)}
              >
                <Phone color="#3B82F6" size={16} />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.detailsButton]}
                onPress={() => handleViewDetails(team.id)}
              >
                <User color="#6B7280" size={16} />
                <Text style={styles.detailsButtonText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Team Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Team Details</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedTeam && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.teamOverview}>
                <Text style={styles.modalSectionTitle}>Team Overview</Text>
                <Text style={styles.teamDetailName}>{selectedTeam.name}</Text>
                <Text style={styles.teamDetailType}>{selectedTeam.type.toUpperCase()} TEAM</Text>

                <View style={styles.statusContainer}>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(selectedTeam.status) }]}>
                    <Text style={styles.statusIndicatorText}>{selectedTeam.status.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.teamMetrics}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{selectedTeam.responseTime}m</Text>
                    <Text style={styles.metricLabel}>Avg Response</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{selectedTeam.completedCases}</Text>
                    <Text style={styles.metricLabel}>Cases Completed</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{selectedTeam.members.length}</Text>
                    <Text style={styles.metricLabel}>Team Members</Text>
                  </View>
                </View>
              </View>

              <View style={styles.membersDetailSection}>
                <Text style={styles.modalSectionTitle}>Team Members</Text>
                {selectedTeam.members.map((member) => (
                  <View key={member.id} style={styles.memberDetailCard}>
                    <View style={styles.memberDetailInfo}>
                      <Text style={styles.memberDetailName}>{member.name}</Text>
                      <Text style={styles.memberDetailRole}>{member.role}</Text>
                      <Text style={styles.memberDetailPhone}>{member.phone}</Text>
                    </View>
                    <View style={[styles.memberDetailStatus, { backgroundColor: getStatusColor(member.status) + '20' }]}>
                      <Text style={[styles.memberDetailStatusText, { color: getStatusColor(member.status) }]}>
                        {member.status.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {selectedTeam.status === 'deployed' && selectedTeam.currentCase && (
                <View style={styles.currentMissionSection}>
                  <Text style={styles.modalSectionTitle}>Current Mission</Text>
                  <View style={styles.missionCard}>
                    <Text style={styles.missionTitle}>Active Deployment</Text>
                    <Text style={styles.missionDetails}>Case: {selectedTeam.currentCase}</Text>
                    {selectedTeam.currentLocation && (
                      <Text style={styles.missionLocation}>Location: {selectedTeam.currentLocation}</Text>
                    )}
                  </View>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Contact Team Modal */}
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
            <Text style={styles.modalTitle}>Contact Team</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedTeam && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.contactOverview}>
                <Text style={styles.modalSectionTitle}>Team Information</Text>
                <Text style={styles.contactTeamName}>{selectedTeam.name}</Text>
                <Text style={styles.contactTeamStatus}>Status: {selectedTeam.status.toUpperCase()}</Text>
                {selectedTeam.currentLocation && (
                  <Text style={styles.contactTeamLocation}>Location: {selectedTeam.currentLocation}</Text>
                )}
              </View>

              <View style={styles.communicationOptions}>
                <Text style={styles.modalSectionTitle}>Communication Options</Text>

                <TouchableOpacity
                  style={styles.communicationButton}
                  onPress={() => {
                    Alert.alert('Radio Contact', `Connecting to ${selectedTeam.name} via radio...`);
                    setShowContactModal(false);
                  }}
                >
                  <Radio size={24} color="#DC2626" />
                  <View style={styles.communicationButtonText}>
                    <Text style={styles.communicationButtonTitle}>Radio Contact</Text>
                    <Text style={styles.communicationButtonSubtitle}>Direct radio communication</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.communicationButton}
                  onPress={() => {
                    Alert.alert('Call Team Lead', `Calling ${selectedTeam.members[0].name}...`);
                    setShowContactModal(false);
                  }}
                >
                  <Phone size={24} color="#3B82F6" />
                  <View style={styles.communicationButtonText}>
                    <Text style={styles.communicationButtonTitle}>Call Team Lead</Text>
                    <Text style={styles.communicationButtonSubtitle}>{selectedTeam.members[0].name} - {selectedTeam.members[0].phone}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.communicationButton}
                  onPress={() => {
                    Alert.alert('Emergency Hotline', 'Connecting to emergency coordination hotline...');
                    setShowContactModal(false);
                  }}
                >
                  <Headphones size={24} color="#059669" />
                  <View style={styles.communicationButtonText}>
                    <Text style={styles.communicationButtonTitle}>Emergency Hotline</Text>
                    <Text style={styles.communicationButtonSubtitle}>24/7 coordination center</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.teamContactsSection}>
                <Text style={styles.modalSectionTitle}>Team Member Contacts</Text>
                {selectedTeam.members.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberContactCard}
                    onPress={() => {
                      Alert.alert('Call Member', `Calling ${member.name} at ${member.phone}...`);
                      setShowContactModal(false);
                    }}
                  >
                    <View style={styles.memberContactInfo}>
                      <Text style={styles.memberContactName}>{member.name}</Text>
                      <Text style={styles.memberContactRole}>{member.role}</Text>
                    </View>
                    <Text style={styles.memberContactPhone}>{member.phone}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

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
            <Text style={styles.modalTitle}>Dispatch Team</Text>
            <TouchableOpacity onPress={() => {
              Alert.alert('Team Dispatched', `${selectedTeam?.name} has been dispatched successfully.`);
              setShowDispatchModal(false);
            }}>
              <Send size={24} color="#DC2626" />
            </TouchableOpacity>
          </View>

          {selectedTeam && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.dispatchOverview}>
                <Text style={styles.modalSectionTitle}>Team Ready for Dispatch</Text>
                <Text style={styles.dispatchTeamName}>{selectedTeam.name}</Text>
                <Text style={styles.dispatchTeamMembers}>{selectedTeam.members.length} members ready</Text>
                <Text style={styles.dispatchResponseTime}>Estimated response time: {selectedTeam.responseTime} minutes</Text>
              </View>

              <View style={styles.missionDetailsSection}>
                <Text style={styles.modalSectionTitle}>Mission Assignment</Text>
                <TextInput
                  style={styles.dispatchInput}
                  placeholder="Mission location..."
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={[styles.dispatchInput, styles.dispatchTextArea]}
                  placeholder="Mission description and objectives..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                />
                <TextInput
                  style={styles.dispatchInput}
                  placeholder="Expected duration (hours)..."
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.prioritySection}>
                <Text style={styles.modalSectionTitle}>Priority Level</Text>
                <View style={styles.priorityOptions}>
                  {['critical', 'high', 'medium', 'low'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[styles.priorityOption, { borderColor: getStatusColor(priority) }]}
                    >
                      <Text style={[styles.priorityOptionText, { color: getStatusColor(priority) }]}>
                        {priority.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.resourcesSection}>
                <Text style={styles.modalSectionTitle}>Required Resources</Text>
                <Text style={styles.resourcesText}>
                  • Emergency response vehicle{'\n'}
                  • Medical equipment kit{'\n'}
                  • Communication devices{'\n'}
                  • Safety gear for all members
                </Text>
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
  teamsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  teamHeader: {
    marginBottom: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  teamBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  teamStats: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  currentAssignment: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assignmentDetails: {
    marginLeft: 8,
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  assignmentText: {
    fontSize: 13,
    color: '#92400E',
    marginBottom: 2,
  },
  assignmentLocation: {
    fontSize: 13,
    color: '#92400E',
  },
  membersContainer: {
    marginBottom: 12,
  },
  membersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  memberRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  memberStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lastActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastActivityText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
  detailsButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailsButtonText: {
    color: '#6B7280',
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
  // Team Details Modal
  teamOverview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  teamDetailName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  teamDetailType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 16,
  },
  statusContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  teamMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  membersDetailSection: {
    marginBottom: 20,
  },
  memberDetailCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  memberDetailInfo: {
    flex: 1,
  },
  memberDetailName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  memberDetailRole: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  memberDetailPhone: {
    fontSize: 12,
    color: '#3B82F6',
  },
  memberDetailStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  memberDetailStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  currentMissionSection: {
    marginBottom: 20,
  },
  missionCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  missionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  missionDetails: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 2,
  },
  missionLocation: {
    fontSize: 12,
    color: '#92400E',
  },
  // Contact Modal
  contactOverview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  contactTeamName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  contactTeamStatus: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactTeamLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  communicationOptions: {
    marginBottom: 20,
  },
  communicationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  communicationButtonText: {
    marginLeft: 12,
    flex: 1,
  },
  communicationButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  communicationButtonSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  teamContactsSection: {
    marginBottom: 20,
  },
  memberContactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  memberContactInfo: {
    flex: 1,
  },
  memberContactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  memberContactRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  memberContactPhone: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
  },
  // Dispatch Modal
  dispatchOverview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  dispatchTeamName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  dispatchTeamMembers: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  dispatchResponseTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  missionDetailsSection: {
    marginBottom: 20,
  },
  dispatchInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  dispatchTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  prioritySection: {
    marginBottom: 20,
  },
  priorityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resourcesSection: {
    marginBottom: 20,
  },
  resourcesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});