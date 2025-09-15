import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { 
  Activity, 
  Calendar, 
  User, 
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Heart,
  Eye
} from 'lucide-react-native';
import { HealthScreening } from '../index';

interface HealthScreeningsProps {
  screenings: HealthScreening[];
  onScreeningSelect: (screening: HealthScreening) => void;
  onScheduleScreening: () => void;
}

const HealthScreenings: React.FC<HealthScreeningsProps> = ({ screenings, onScreeningSelect, onScheduleScreening }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filterOptions = [
    { key: 'all', label: 'All Screenings', count: screenings.length },
    { key: 'scheduled', label: 'Scheduled', count: screenings.filter(s => s.status === 'scheduled').length },
    { key: 'completed', label: 'Completed', count: screenings.filter(s => s.status === 'completed').length },
    { key: 'follow_up_needed', label: 'Follow-up Needed', count: screenings.filter(s => s.status === 'follow_up_needed').length },
    { key: 'blood_pressure', label: 'Blood Pressure', count: screenings.filter(s => s.screeningType === 'blood_pressure').length },
    { key: 'diabetes', label: 'Diabetes', count: screenings.filter(s => s.screeningType === 'diabetes').length },
  ];

  const filteredScreenings = useMemo(() => {
    let filtered = screenings;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(screening => 
        screening.patientName.toLowerCase().includes(query) ||
        screening.screeningType.toLowerCase().includes(query) ||
        screening.caseId.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'scheduled':
        filtered = filtered.filter(s => s.status === 'scheduled');
        break;
      case 'completed':
        filtered = filtered.filter(s => s.status === 'completed');
        break;
      case 'follow_up_needed':
        filtered = filtered.filter(s => s.status === 'follow_up_needed');
        break;
      case 'blood_pressure':
        filtered = filtered.filter(s => s.screeningType === 'blood_pressure');
        break;
      case 'diabetes':
        filtered = filtered.filter(s => s.screeningType === 'diabetes');
        break;
    }

    // Sort by date
    return filtered.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  }, [screenings, searchQuery, selectedFilter]);

  const getStatusColor = (status: HealthScreening['status']) => {
    switch (status) {
      case 'scheduled': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'missed': return '#EF4444';
      case 'cancelled': return '#6B7280';
      case 'follow_up_needed': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: HealthScreening['status']) => {
    switch (status) {
      case 'scheduled': return Calendar;
      case 'completed': return CheckCircle;
      case 'missed': return AlertTriangle;
      case 'cancelled': return AlertTriangle;
      case 'follow_up_needed': return Clock;
      default: return Calendar;
    }
  };

  const getScreeningTypeIcon = (type: HealthScreening['screeningType']) => {
    switch (type) {
      case 'blood_pressure': return Heart;
      case 'diabetes': return Activity;
      case 'vision': return Eye;
      case 'bmi': return TrendingUp;
      default: return Activity;
    }
  };

  const getScreeningTypeColor = (type: HealthScreening['screeningType']) => {
    const colors: Record<string, string> = {
      blood_pressure: '#DC2626',
      diabetes: '#EA580C',
      cholesterol: '#D97706',
      bmi: '#65A30D',
      depression: '#7C3AED',
      substance_use: '#BE185D',
      cancer: '#EC4899',
      immunization: '#06B6D4',
      vision: '#0284C7',
      hearing: '#7C2D12',
    };
    return colors[type] || '#6B7280';
  };

  const getResultsInterpretationColor = (interpretation?: string) => {
    switch (interpretation) {
      case 'normal': return '#10B981';
      case 'borderline': return '#F59E0B';
      case 'abnormal': return '#EF4444';
      case 'critical': return '#DC2626';
      default: return '#6B7280';
    }
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

  const renderScreeningCard = (screening: HealthScreening) => {
    const StatusIcon = getStatusIcon(screening.status);
    const TypeIcon = getScreeningTypeIcon(screening.screeningType);
    
    return (
      <TouchableOpacity
        key={screening.id}
        style={styles.screeningCard}
        onPress={() => onScreeningSelect(screening)}
        activeOpacity={0.7}
      >
        <View style={styles.screeningHeader}>
          <View style={styles.screeningTitleRow}>
            <View style={styles.screeningInfo}>
              <Text style={styles.patientName}>{screening.patientName}</Text>
              <View style={styles.screeningTypeRow}>
                <TypeIcon size={16} color={getScreeningTypeColor(screening.screeningType)} />
                <Text style={[styles.screeningType, { color: getScreeningTypeColor(screening.screeningType) }]}>
                  {screening.screeningType.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(screening.status) + '20' }]}>
              <StatusIcon size={12} color={getStatusColor(screening.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(screening.status) }]}>
                {screening.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.screeningDetails}>
          <View style={styles.detailItem}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.detailText}>
              Scheduled: {formatDate(screening.scheduledDate)} at {new Date(screening.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          {screening.completedDate && (
            <View style={styles.detailItem}>
              <CheckCircle size={14} color="#10B981" />
              <Text style={styles.detailText}>
                Completed: {formatDate(screening.completedDate)}
              </Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <User size={14} color="#64748B" />
            <Text style={styles.detailText}>Case ID: {screening.caseId}</Text>
          </View>
        </View>

        {screening.results && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Results</Text>
              <View style={[styles.interpretationBadge, { 
                backgroundColor: getResultsInterpretationColor(screening.results.interpretation) + '20' 
              }]}>
                <Text style={[styles.interpretationText, { 
                  color: getResultsInterpretationColor(screening.results.interpretation) 
                }]}>
                  {screening.results.interpretation.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.resultsValues}>
              {Object.entries(screening.results.values).map(([key, value]) => (
                <View key={`${screening.id}-${key}`} style={styles.resultValue}>
                  <Text style={styles.resultKey}>{key.replace('_', ' ')}:</Text>
                  <Text style={styles.resultValueText}>{String(value)}</Text>
                </View>
              ))}
            </View>

            {screening.results.recommendations.length > 0 && (
              <View style={styles.recommendations}>
                <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                {screening.results.recommendations.slice(0, 2).map((rec, index) => (
                  <Text key={`${screening.id}-rec-${index}`} style={styles.recommendationText}>• {rec}</Text>
                ))}
                {screening.results.recommendations.length > 2 && (
                  <Text style={styles.moreRecommendations}>+{screening.results.recommendations.length - 2} more</Text>
                )}
              </View>
            )}
          </View>
        )}

        {screening.followUpRequired && (
          <View style={styles.followUpContainer}>
            <View style={styles.followUpHeader}>
              <Clock size={14} color="#F59E0B" />
              <Text style={styles.followUpTitle}>Follow-up Required</Text>
            </View>
            {screening.followUpDate && (
              <Text style={styles.followUpDate}>
                Due: {formatDate(screening.followUpDate)}
              </Text>
            )}
          </View>
        )}

        {screening.referralNeeded && (
          <View style={styles.referralContainer}>
            <View style={styles.referralHeader}>
              <TrendingUp size={14} color="#3B82F6" />
              <Text style={styles.referralTitle}>Referral Needed</Text>
            </View>
            {screening.referralProvider && (
              <Text style={styles.referralProvider}>
                Provider: {screening.referralProvider}
              </Text>
            )}
          </View>
        )}

        {screening.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText} numberOfLines={2}>{screening.notes}</Text>
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
          <Text style={styles.title}>Health Screenings</Text>
          <TouchableOpacity style={styles.addButton} onPress={onScheduleScreening}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search screenings..."
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

      <ScrollView style={styles.screeningsList} showsVerticalScrollIndicator={false}>
        {filteredScreenings.length > 0 ? (
          <View style={styles.screeningsContainer}>
            {filteredScreenings.map(renderScreeningCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Activity size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No screenings found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Schedule your first health screening'}
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
    backgroundColor: '#DC2626',
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
    backgroundColor: '#DC2626',
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
    backgroundColor: '#DC2626',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  screeningsList: {
    flex: 1,
  },
  screeningsContainer: {
    padding: 16,
    gap: 12,
  },
  screeningCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  screeningHeader: {
    marginBottom: 12,
  },
  screeningTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  screeningInfo: {
    flex: 1,
    marginRight: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  screeningTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screeningType: {
    fontSize: 12,
    fontWeight: '600',
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
  screeningDetails: {
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
  resultsContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    marginBottom: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  interpretationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  interpretationText: {
    fontSize: 10,
    fontWeight: '600',
  },
  resultsValues: {
    gap: 4,
    marginBottom: 8,
  },
  resultValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultKey: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  resultValueText: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
  },
  recommendations: {
    marginTop: 4,
  },
  recommendationsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  moreRecommendations: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginTop: 2,
  },
  followUpContainer: {
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  followUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  followUpTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  followUpDate: {
    fontSize: 12,
    color: '#D97706',
  },
  referralContainer: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  referralTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  referralProvider: {
    fontSize: 12,
    color: '#2563EB',
  },
  notesContainer: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
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

export default HealthScreenings;