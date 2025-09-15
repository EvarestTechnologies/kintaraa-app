import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Plus,
  Search,
  Filter,
  Target,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp
} from 'lucide-react-native';
import { CommunityOutreachEvent } from '../index';

interface CommunityOutreachProps {
  events: CommunityOutreachEvent[];
  onEventSelect: (event: CommunityOutreachEvent) => void;
  onCreateEvent: () => void;
}

const CommunityOutreach: React.FC<CommunityOutreachProps> = ({ events, onEventSelect, onCreateEvent }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filterOptions = [
    { key: 'all', label: 'All Events', count: events.length },
    { key: 'planning', label: 'Planning', count: events.filter(e => e.status === 'planning').length },
    { key: 'active', label: 'Active', count: events.filter(e => e.status === 'active').length },
    { key: 'completed', label: 'Completed', count: events.filter(e => e.status === 'completed').length },
    { key: 'health_fair', label: 'Health Fairs', count: events.filter(e => e.type === 'health_fair').length },
    { key: 'screening_event', label: 'Screenings', count: events.filter(e => e.type === 'screening_event').length },
  ];

  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.coordinator.toLowerCase().includes(query) ||
        event.services.some(service => service.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'planning':
        filtered = filtered.filter(e => e.status === 'planning');
        break;
      case 'active':
        filtered = filtered.filter(e => e.status === 'active');
        break;
      case 'completed':
        filtered = filtered.filter(e => e.status === 'completed');
        break;
      case 'health_fair':
        filtered = filtered.filter(e => e.type === 'health_fair');
        break;
      case 'screening_event':
        filtered = filtered.filter(e => e.type === 'screening_event');
        break;
    }

    // Sort by date
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, searchQuery, selectedFilter]);

  const getStatusColor = (status: CommunityOutreachEvent['status']) => {
    switch (status) {
      case 'planning': return '#3B82F6';
      case 'active': return '#10B981';
      case 'completed': return '#8B5CF6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: CommunityOutreachEvent['status']) => {
    switch (status) {
      case 'planning': return Calendar;
      case 'active': return Target;
      case 'completed': return CheckCircle;
      case 'cancelled': return AlertCircle;
      default: return Calendar;
    }
  };

  const getTypeColor = (type: CommunityOutreachEvent['type']) => {
    const colors: Record<string, string> = {
      health_fair: '#DC2626',
      screening_event: '#EA580C',
      vaccination_clinic: '#65A30D',
      education_workshop: '#059669',
      support_group: '#7C3AED',
      awareness_campaign: '#BE185D',
    };
    return colors[type] || '#6B7280';
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

  const renderEventCard = (event: CommunityOutreachEvent) => {
    const StatusIcon = getStatusIcon(event.status);
    
    return (
      <TouchableOpacity
        key={event.id}
        style={styles.eventCard}
        onPress={() => onEventSelect(event)}
        activeOpacity={0.7}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleRow}>
            <Text style={styles.eventTitle} numberOfLines={2}>{event.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) + '20' }]}>
              <StatusIcon size={12} color={getStatusColor(event.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(event.status) }]}>
                {event.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.typeRow}>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(event.type) + '20' }]}>
              <Text style={[styles.typeText, { color: getTypeColor(event.type) }]}>
                {event.type.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.detailItem}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.detailText}>
              {formatDate(event.date)} • {event.startTime} - {event.endTime}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Users size={14} color="#64748B" />
            <Text style={styles.detailText}>
              {event.actualAttendance !== undefined 
                ? `${event.actualAttendance} attended (expected ${event.expectedAttendance})`
                : `Expected: ${event.expectedAttendance} attendees`
              }
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Target size={14} color="#64748B" />
            <Text style={styles.detailText}>
              Target: {event.targetPopulation.join(', ')}
            </Text>
          </View>
        </View>

        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>Services:</Text>
          <View style={styles.servicesTags}>
            {event.services.slice(0, 3).map((service, index) => (
              <View key={`${event.id}-service-${index}`} style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>{service}</Text>
              </View>
            ))}
            {event.services.length > 3 && (
              <View style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>+{event.services.length - 3}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.eventFooter}>
          <Text style={styles.coordinator}>Coordinator: {event.coordinator}</Text>
          {event.budget && (
            <View style={styles.budget}>
              <DollarSign size={14} color="#10B981" />
              <Text style={styles.budgetText}>${event.budget.toLocaleString()}</Text>
            </View>
          )}
        </View>

        {event.outcomes && (
          <View style={styles.outcomes}>
            <Text style={styles.outcomesTitle}>Outcomes:</Text>
            <View style={styles.outcomesGrid}>
              <View style={styles.outcomeItem}>
                <TrendingUp size={12} color="#10B981" />
                <Text style={styles.outcomeText}>{event.outcomes.screeningsCompleted} screenings</Text>
              </View>
              <View style={styles.outcomeItem}>
                <Users size={12} color="#3B82F6" />
                <Text style={styles.outcomeText}>{event.outcomes.referralsMade} referrals</Text>
              </View>
              <View style={styles.outcomeItem}>
                <CheckCircle size={12} color="#8B5CF6" />
                <Text style={styles.outcomeText}>{event.outcomes.newPatientRegistrations} new patients</Text>
              </View>
            </View>
          </View>
        )}

        {event.feedback && (
          <View style={styles.feedback}>
            <View style={styles.rating}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{event.feedback.rating.toFixed(1)} rating</Text>
            </View>
          </View>
        )}

        {event.partners.length > 0 && (
          <View style={styles.partners}>
            <Text style={styles.partnersTitle}>Partners:</Text>
            <Text style={styles.partnersText} numberOfLines={1}>
              {event.partners.join(', ')}
            </Text>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Community Outreach</Text>
          <TouchableOpacity style={styles.addButton} onPress={onCreateEvent}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search events..."
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

      <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
        {filteredEvents.length > 0 ? (
          <View style={styles.eventsContainer}>
            {filteredEvents.map(renderEventCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MapPin size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Create your first community outreach event'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    backgroundColor: '#8B5CF6',
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
    backgroundColor: '#8B5CF6',
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
    backgroundColor: '#8B5CF6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  eventsList: {
    flex: 1,
  },
  eventsContainer: {
    padding: 16,
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    marginBottom: 12,
  },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
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
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
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
  servicesContainer: {
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  servicesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceTagText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coordinator: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  budget: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  budgetText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  outcomes: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    marginBottom: 8,
  },
  outcomesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  outcomesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  outcomeText: {
    fontSize: 12,
    color: '#64748B',
  },
  feedback: {
    marginBottom: 8,
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
  partners: {
    backgroundColor: '#FEF7FF',
    padding: 8,
    borderRadius: 8,
  },
  partnersTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  partnersText: {
    fontSize: 12,
    color: '#8B5CF6',
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

export default CommunityOutreach;