import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Users, Shield, MapPin, Clock, User, Phone, Search, Filter, CheckCircle, AlertTriangle } from 'lucide-react-native';

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
    console.log('Dispatching team:', teamId);
  };

  const handleContactTeam = (teamId: string) => {
    console.log('Contacting team:', teamId);
  };

  const handleViewDetails = (teamId: string) => {
    console.log('Viewing team details:', teamId);
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
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#6B7280" size={20} />
        </TouchableOpacity>
      </View>

      {/* Status Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
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
    backgroundColor: '#DC2626',
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
});