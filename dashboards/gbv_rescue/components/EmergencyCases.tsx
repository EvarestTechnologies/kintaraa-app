import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useProvider } from '@/providers/ProviderContext';
import { Siren, AlertTriangle, Clock, MapPin, User, Phone, Search, Filter } from 'lucide-react-native';

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
}

export default function EmergencyCases() {
  const { assignedCases } = useProvider();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Mock emergency cases data
  const emergencyCases: EmergencyCase[] = [
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
      estimatedArrival: '8 minutes'
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
      estimatedArrival: 'On scene'
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
      responseTeam: 'Team Gamma'
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
      estimatedArrival: '12 minutes'
    }
  ];

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

  const handleDispatchTeam = (caseId: string) => {
    Alert.alert(
      'Dispatch Emergency Team',
      'Are you sure you want to dispatch the emergency response team?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Dispatch', style: 'destructive', onPress: () => console.log('Team dispatched for case:', caseId) }
      ]
    );
  };

  const handleContactSurvivor = (caseId: string) => {
    console.log('Contacting survivor for case:', caseId);
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
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#6B7280" size={20} />
        </TouchableOpacity>
      </View>

      {/* Priority Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
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
                  onPress={() => handleDispatchTeam(emergencyCase.id)}
                >
                  <Siren color="#FFFFFF" size={16} />
                  <Text style={styles.dispatchButtonText}>Dispatch Team</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.contactButton]}
                onPress={() => handleContactSurvivor(emergencyCase.id)}
              >
                <Phone color="#3B82F6" size={16} />
                <Text style={styles.contactButtonText}>Contact</Text>
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
});