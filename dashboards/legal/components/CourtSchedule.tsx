import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
} from 'lucide-react-native';
import type { CourtHearing } from '../index';

type ViewType = 'list' | 'calendar';
type FilterType = 'all' | 'today' | 'week' | 'month' | 'scheduled' | 'confirmed';

interface HearingCardProps {
  hearing: CourtHearing;
  onPress: (hearing: CourtHearing) => void;
  onEdit: (hearing: CourtHearing) => void;
  onDelete: (hearing: CourtHearing) => void;
}

function HearingCard({ hearing, onPress, onEdit, onDelete }: HearingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#F59E0B';
      case 'confirmed': return '#10B981';
      case 'postponed': return '#8B5CF6';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock size={16} color={getStatusColor(status)} />;
      case 'confirmed': return <CheckCircle size={16} color={getStatusColor(status)} />;
      case 'postponed': return <Pause size={16} color={getStatusColor(status)} />;
      case 'completed': return <CheckCircle size={16} color={getStatusColor(status)} />;
      case 'cancelled': return <XCircle size={16} color={getStatusColor(status)} />;
      default: return <Clock size={16} color={getStatusColor(status)} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hearing': return '⚖️';
      case 'trial': return '🏛️';
      case 'mediation': return '🤝';
      case 'deposition': return '📝';
      case 'conference': return '💼';
      default: return '⚖️';
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Cancel Hearing',
      `Are you sure you want to cancel the ${hearing.type} for ${hearing.caseName}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => onDelete(hearing) },
      ]
    );
  };

  const isUpcoming = new Date(hearing.date + ' ' + hearing.time) > new Date();
  const isToday = new Date(hearing.date).toDateString() === new Date().toDateString();

  return (
    <TouchableOpacity
      style={[
        styles.hearingCard,
        isToday && styles.todayCard,
        hearing.priority === 'urgent' && styles.urgentCard,
      ]}
      onPress={() => onPress(hearing)}
      activeOpacity={0.7}
    >
      <View style={styles.hearingHeader}>
        <View style={styles.hearingInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.typeIcon}>{getTypeIcon(hearing.type)}</Text>
            <Text style={styles.hearingTitle}>
              {hearing.type.charAt(0).toUpperCase() + hearing.type.slice(1)}
            </Text>
            {hearing.priority === 'urgent' && (
              <AlertTriangle size={16} color="#EF4444" style={styles.urgentIcon} />
            )}
          </View>
          <Text style={styles.caseName}>{hearing.caseName}</Text>
          <Text style={styles.caseNumber}>Case: {hearing.caseNumber}</Text>
        </View>
        <View style={styles.statusContainer}>
          {getStatusIcon(hearing.status)}
          <Text style={[styles.statusText, { color: getStatusColor(hearing.status) }]}>
            {hearing.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.hearingDetails}>
        <View style={styles.detailItem}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {hearing.date} at {hearing.time}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            Duration: {hearing.duration} minutes
          </Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.detailText}>{hearing.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <User size={16} color="#6B7280" />
          <Text style={styles.detailText}>Judge: {hearing.judge}</Text>
        </View>
      </View>

      {hearing.attendees.length > 0 && (
        <View style={styles.attendeesContainer}>
          <Text style={styles.attendeesLabel}>Attendees:</Text>
          <Text style={styles.attendeesText}>
            {hearing.attendees.join(', ')}
          </Text>
        </View>
      )}

      {hearing.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesText} numberOfLines={2}>
            {hearing.notes}
          </Text>
        </View>
      )}

      {isUpcoming && (
        <View style={styles.hearingActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(hearing)}
          >
            <Edit3 size={16} color="#3B82F6" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={styles.actionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {hearing.outcome && (
        <View style={styles.outcomeContainer}>
          <Text style={styles.outcomeLabel}>Outcome:</Text>
          <Text style={styles.outcomeText}>{hearing.outcome}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function CourtSchedule() {
  const [viewType, setViewType] = useState<ViewType>('list');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Mock court hearings data
  const mockHearings: CourtHearing[] = useMemo(() => [
    {
      id: '1',
      caseId: 'case-1',
      caseName: 'Johnson vs. Smith',
      caseNumber: 'CASE-2024-001',
      type: 'hearing',
      date: '2024-02-01',
      time: '09:00',
      duration: 120,
      location: 'Family Court Building A, Room 201',
      judge: 'Hon. Margaret Wilson',
      status: 'confirmed',
      priority: 'high',
      notes: 'Restraining order hearing. Client testimony required.',
      attendees: ['Sarah Johnson', 'John Smith', 'Attorney Williams'],
    },
    {
      id: '2',
      caseId: 'case-2',
      caseName: 'Rodriguez vs. State',
      caseNumber: 'CASE-2024-002',
      type: 'trial',
      date: '2024-02-05',
      time: '10:30',
      duration: 240,
      location: 'Criminal Court Building B, Room 105',
      judge: 'Hon. Robert Chen',
      status: 'scheduled',
      priority: 'urgent',
      notes: 'Sexual assault trial. Expert witnesses scheduled.',
      attendees: ['Maria Rodriguez', 'State Prosecutor', 'Expert Witness Dr. Smith'],
    },
    {
      id: '3',
      caseId: 'case-3',
      caseName: 'Chen vs. Employer Corp',
      caseNumber: 'CASE-2023-045',
      type: 'mediation',
      date: '2024-01-25',
      time: '14:00',
      duration: 180,
      location: 'Mediation Center, Room 3',
      judge: 'Mediator Jane Thompson',
      status: 'completed',
      priority: 'medium',
      notes: 'Settlement mediation session.',
      outcome: 'Settlement agreement reached',
      attendees: ['Emily Chen', 'Employer Corp Representative', 'Mediator'],
    },
    {
      id: '4',
      caseId: 'case-4',
      caseName: 'Thompson vs. City',
      caseNumber: 'CASE-2024-003',
      type: 'conference',
      date: '2024-02-10',
      time: '11:00',
      duration: 60,
      location: 'Employment Court, Conference Room A',
      judge: 'Hon. David Martinez',
      status: 'scheduled',
      priority: 'medium',
      notes: 'Pre-trial conference to discuss case management.',
      attendees: ['Lisa Thompson', 'City Attorney', 'HR Representative'],
    },
    {
      id: '5',
      caseId: 'case-5',
      caseName: 'Davis vs. Ex-Spouse',
      caseNumber: 'CASE-2023-038',
      type: 'hearing',
      date: '2024-02-15',
      time: '13:30',
      duration: 90,
      location: 'Appeals Court, Room 301',
      judge: 'Hon. Patricia Lee',
      status: 'confirmed',
      priority: 'high',
      notes: 'Child custody modification appeal hearing.',
      attendees: ['Amanda Davis', 'Ex-Spouse', 'Child Advocate'],
    },
  ], []);

  const filteredHearings = useMemo(() => {
    let filtered = mockHearings;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    switch (activeFilter) {
      case 'today':
        filtered = filtered.filter(h => {
          const hearingDate = new Date(h.date);
          return hearingDate.toDateString() === today.toDateString();
        });
        break;
      case 'week':
        filtered = filtered.filter(h => {
          const hearingDate = new Date(h.date);
          return hearingDate >= today && hearingDate <= weekFromNow;
        });
        break;
      case 'month':
        filtered = filtered.filter(h => {
          const hearingDate = new Date(h.date);
          return hearingDate >= today && hearingDate <= monthFromNow;
        });
        break;
      case 'scheduled':
        filtered = filtered.filter(h => h.status === 'scheduled');
        break;
      case 'confirmed':
        filtered = filtered.filter(h => h.status === 'confirmed');
        break;
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }, [mockHearings, activeFilter]);

  const handleHearingPress = (hearing: CourtHearing) => {
    console.log('Opening hearing details for:', hearing.caseName);
    // Navigate to hearing details
  };

  const handleEdit = (hearing: CourtHearing) => {
    console.log('Editing hearing:', hearing.caseName);
    // Navigate to hearing editor
  };

  const handleDelete = (hearing: CourtHearing) => {
    console.log('Cancelling hearing:', hearing.caseName);
    // Implement cancel functionality
  };

  const handleNewHearing = () => {
    console.log('Creating new hearing');
    // Navigate to hearing creation
  };

  const getFilterCount = (filter: FilterType) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case 'all': return mockHearings.length;
      case 'today': return mockHearings.filter(h => new Date(h.date).toDateString() === today.toDateString()).length;
      case 'week': return mockHearings.filter(h => {
        const hearingDate = new Date(h.date);
        return hearingDate >= today && hearingDate <= weekFromNow;
      }).length;
      case 'month': return mockHearings.filter(h => {
        const hearingDate = new Date(h.date);
        return hearingDate >= today && hearingDate <= monthFromNow;
      }).length;
      case 'scheduled': return mockHearings.filter(h => h.status === 'scheduled').length;
      case 'confirmed': return mockHearings.filter(h => h.status === 'confirmed').length;
      default: return 0;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Court Schedule</Text>
          <Text style={styles.subtitle}>{filteredHearings.length} hearings found</Text>
        </View>
        <TouchableOpacity
          style={styles.newButton}
          onPress={handleNewHearing}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>

      {/* View Toggle and Filters */}
      <View style={styles.controlsContainer}>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewType === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewType('list')}
          >
            <Text style={[styles.toggleText, viewType === 'list' && styles.toggleTextActive]}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewType === 'calendar' && styles.toggleButtonActive]}
            onPress={() => setViewType('calendar')}
          >
            <Text style={[styles.toggleText, viewType === 'calendar' && styles.toggleTextActive]}>
              Calendar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Options */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {(['all', 'today', 'week', 'month', 'scheduled', 'confirmed'] as FilterType[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              {` (${getFilterCount(filter)})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hearings List */}
      <FlatList
        data={filteredHearings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HearingCard
            hearing={item}
            onPress={handleHearingPress}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Calendar size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No hearings found</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by scheduling your first court hearing'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    fontSize: 14,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  toggleTextActive: {
    color: '#374151',
    fontWeight: '600' as const,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  hearingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  todayCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  hearingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  hearingInfo: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  hearingTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    flex: 1,
  },
  urgentIcon: {
    marginLeft: 8,
  },
  caseName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 2,
  },
  caseNumber: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500' as const,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  hearingDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  attendeesContainer: {
    marginBottom: 12,
  },
  attendeesLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 4,
  },
  attendeesText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  notesContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  hearingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  outcomeContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  outcomeLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#166534',
    marginBottom: 4,
  },
  outcomeText: {
    fontSize: 14,
    color: '#15803D',
    fontWeight: '500' as const,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});