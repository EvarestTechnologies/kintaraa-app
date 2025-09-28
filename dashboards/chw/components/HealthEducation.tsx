import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  Plus,
  Search,
  Filter,
  Play,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react-native';
import { HealthEducationSession } from '../index';

interface HealthEducationProps {
  sessions: HealthEducationSession[];
  onSessionSelect: (session: HealthEducationSession) => void;
  onCreateSession: () => void;
}

const HealthEducation: React.FC<HealthEducationProps> = ({ sessions, onSessionSelect, onCreateSession }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filterOptions = [
    { key: 'all', label: 'All Sessions', count: sessions.length },
    { key: 'planned', label: 'Planned', count: sessions.filter(s => s.status === 'planned').length },
    { key: 'active', label: 'Active', count: sessions.filter(s => s.status === 'active').length },
    { key: 'completed', label: 'Completed', count: sessions.filter(s => s.status === 'completed').length },
    { key: 'individual', label: 'Individual', count: sessions.filter(s => s.type === 'individual').length },
    { key: 'group', label: 'Group', count: sessions.filter(s => s.type === 'group').length },
  ];

  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(query) ||
        session.topic.toLowerCase().includes(query) ||
        session.description.toLowerCase().includes(query) ||
        session.facilitator.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'planned':
        filtered = filtered.filter(s => s.status === 'planned');
        break;
      case 'active':
        filtered = filtered.filter(s => s.status === 'active');
        break;
      case 'completed':
        filtered = filtered.filter(s => s.status === 'completed');
        break;
      case 'individual':
        filtered = filtered.filter(s => s.type === 'individual');
        break;
      case 'group':
        filtered = filtered.filter(s => s.type === 'group');
        break;
    }

    // Sort by date
    return filtered.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  }, [sessions, searchQuery, selectedFilter]);

  const getStatusColor = (status: HealthEducationSession['status']) => {
    switch (status) {
      case 'planned': return '#3B82F6';
      case 'active': return '#10B981';
      case 'completed': return '#8B5CF6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: HealthEducationSession['status']) => {
    switch (status) {
      case 'planned': return Calendar;
      case 'active': return Play;
      case 'completed': return CheckCircle;
      case 'cancelled': return AlertCircle;
      default: return Calendar;
    }
  };

  const getTopicColor = (topic: HealthEducationSession['topic']) => {
    const colors: Record<string, string> = {
      diabetes_management: '#DC2626',
      hypertension: '#EA580C',
      nutrition: '#65A30D',
      exercise: '#059669',
      mental_health: '#7C3AED',
      substance_abuse: '#BE185D',
      maternal_health: '#EC4899',
      child_health: '#06B6D4',
      preventive_care: '#0284C7',
      medication_management: '#7C2D12',
    };
    return colors[topic] || '#6B7280';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return date.toLocaleDateString();
  };

  const renderSessionCard = (session: HealthEducationSession) => {
    const StatusIcon = getStatusIcon(session.status);
    
    return (
      <TouchableOpacity
        key={session.id}
        style={styles.sessionCard}
        onPress={() => onSessionSelect(session)}
        activeOpacity={0.7}
      >
        <View style={styles.sessionHeader}>
          <View style={styles.sessionTitleRow}>
            <Text style={styles.sessionTitle} numberOfLines={2}>{session.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) + '20' }]}>
              <StatusIcon size={12} color={getStatusColor(session.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(session.status) }]}>
                {session.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.topicRow}>
            <View style={[styles.topicBadge, { backgroundColor: getTopicColor(session.topic) + '20' }]}>
              <Text style={[styles.topicText, { color: getTopicColor(session.topic) }]}>
                {session.topic.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.sessionType}>{session.type.replace('_', ' ')}</Text>
          </View>
        </View>

        <Text style={styles.sessionDescription} numberOfLines={2}>
          {session.description}
        </Text>

        <View style={styles.sessionDetails}>
          <View style={styles.detailItem}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.detailText}>
              {formatDate(session.scheduledDate)} at {new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.detailText}>{session.duration} minutes</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.detailText} numberOfLines={1}>{session.location}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Users size={14} color="#64748B" />
            <Text style={styles.detailText}>
              {session.attendedParticipants !== undefined 
                ? `${session.attendedParticipants}/${session.registeredParticipants} attended`
                : `${session.registeredParticipants}${session.maxParticipants ? `/${session.maxParticipants}` : ''} registered`
              }
            </Text>
          </View>
        </View>

        <View style={styles.sessionFooter}>
          <Text style={styles.facilitator}>Facilitator: {session.facilitator}</Text>
          {session.feedback && (
            <View style={styles.rating}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{session.feedback.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {session.objectives.length > 0 && (
          <View style={styles.objectives}>
            <Text style={styles.objectivesTitle}>Objectives:</Text>
            {session.objectives.slice(0, 2).map((objective, index) => (
              <Text key={index} style={styles.objectiveText}>• {objective}</Text>
            ))}
            {session.objectives.length > 2 && (
              <Text style={styles.moreObjectives}>+{session.objectives.length - 2} more</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (filter: typeof filterOptions[0]) => (
    <TouchableOpacity
      key={filter.key}
      style={[
        styles.filterChip,
        selectedFilter === filter.key && styles.filterChipActive
      ]}
      onPress={() => setSelectedFilter(filter.key)}
    >
      <Text style={[
        styles.filterChipText,
        selectedFilter === filter.key && styles.filterChipTextActive
      ]}>
        {filter.label} ({filter.count})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Health Education</Text>
          <TouchableOpacity style={styles.addButton} onPress={onCreateSession}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search sessions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? "#FFFFFF" : "#64748B"} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {filterOptions.map(renderFilterChip)}
          </ScrollView>
        )}
      </View>

      <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
        {filteredSessions.length > 0 ? (
          <View style={styles.sessionsContainer}>
            {filteredSessions.map(renderSessionCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <BookOpen size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No sessions found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Create your first health education session'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#10B981',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  filterButton: {
    backgroundColor: '#F1F5F9',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#10B981',
  },
  filtersContainer: {
    marginTop: 8,
  },
  filtersContent: {
    paddingRight: 20,
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#10B981',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sessionsList: {
    flex: 1,
  },
  sessionsContainer: {
    padding: 16,
    gap: 12,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    marginBottom: 12,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  topicText: {
    fontSize: 10,
    fontWeight: '600',
  },
  sessionType: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  sessionDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  sessionDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilitator: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  objectives: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  objectivesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  objectiveText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  moreObjectives: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default HealthEducation;