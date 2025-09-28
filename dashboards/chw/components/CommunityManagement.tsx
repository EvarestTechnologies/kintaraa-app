import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  Plus,
  Users,
  MapPin,
  Calendar,
  AlertTriangle,
  Clock,
  Target,
  Home,
  Activity,
  Shield,
  Thermometer,
  BookOpen,
  ChevronRight,
} from 'lucide-react-native';
import { CommunityCase } from '../index';

interface CommunityManagementProps {
  cases: CommunityCase[];
  onCaseSelect: (communityCase: CommunityCase) => void;
  onAddCase: () => void;
}

const CommunityManagement: React.FC<CommunityManagementProps> = ({ cases, onCaseSelect, onAddCase }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filterOptions = [
    { key: 'all', label: 'All Cases', count: cases.length },
    { key: 'active', label: 'Active', count: cases.filter(c => c.status === 'active').length },
    { key: 'outbreak', label: 'Outbreaks', count: cases.filter(c => c.caseType === 'outbreak').length },
    { key: 'household', label: 'Household', count: cases.filter(c => c.caseType === 'household').length },
    { key: 'program', label: 'Programs', count: cases.filter(c => c.caseType === 'program').length },
    { key: 'urgent', label: 'Urgent', count: cases.filter(c => c.priority === 'urgent' || c.priority === 'high').length },
  ];

  const filteredCases = useMemo(() => {
    let filtered = cases;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(communityCase =>
        communityCase.title.toLowerCase().includes(query) ||
        communityCase.description.toLowerCase().includes(query) ||
        communityCase.caseNumber.toLowerCase().includes(query) ||
        communityCase.location.area.toLowerCase().includes(query) ||
        communityCase.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply type/status filter
    switch (selectedFilter) {
      case 'active':
        filtered = filtered.filter(c => c.status === 'active');
        break;
      case 'outbreak':
        filtered = filtered.filter(c => c.caseType === 'outbreak');
        break;
      case 'household':
        filtered = filtered.filter(c => c.caseType === 'household');
        break;
      case 'program':
        filtered = filtered.filter(c => c.caseType === 'program');
        break;
      case 'urgent':
        filtered = filtered.filter(c => c.priority === 'urgent' || c.priority === 'high');
        break;
    }

    // Sort by priority and date
    return filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
    });
  }, [cases, searchQuery, selectedFilter]);

  const getCaseTypeIcon = (type: CommunityCase['caseType']) => {
    switch (type) {
      case 'outbreak': return Thermometer;
      case 'household': return Home;
      case 'program': return BookOpen;
      case 'referral': return Target;
      case 'environmental': return Shield;
      case 'emergency': return AlertTriangle;
      default: return Activity;
    }
  };

  const getCaseTypeColor = (type: CommunityCase['caseType']) => {
    switch (type) {
      case 'outbreak': return '#DC2626';
      case 'household': return '#059669';
      case 'program': return '#3B82F6';
      case 'referral': return '#7C3AED';
      case 'environmental': return '#F59E0B';
      case 'emergency': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: CommunityCase['status']) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'monitoring': return '#3B82F6';
      case 'resolved': return '#8B5CF6';
      case 'escalated': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: CommunityCase['priority']) => {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#65A30D';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderCaseCard = (communityCase: CommunityCase) => {
    const TypeIcon = getCaseTypeIcon(communityCase.caseType);
    const typeColor = getCaseTypeColor(communityCase.caseType);

    return (
      <TouchableOpacity
        key={communityCase.id}
        style={styles.caseCard}
        onPress={() => onCaseSelect(communityCase)}
        activeOpacity={0.7}
      >
        <View style={styles.caseHeader}>
          <View style={styles.caseTypeContainer}>
            <View style={[styles.caseTypeIcon, { backgroundColor: typeColor + '20' }]}>
              <TypeIcon size={20} color={typeColor} />
            </View>
            <View style={styles.caseInfo}>
              <Text style={styles.caseNumber}>{communityCase.caseNumber}</Text>
              <Text style={styles.caseType}>{communityCase.caseType.replace('_', ' ').toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.caseBadges}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(communityCase.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(communityCase.priority) }]}>
                {communityCase.priority.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(communityCase.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(communityCase.status) }]}>
                {communityCase.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.caseContent}>
          <Text style={styles.caseTitle}>{communityCase.title}</Text>
          <Text style={styles.caseDescription} numberOfLines={2}>
            {communityCase.description}
          </Text>

          <View style={styles.caseMetrics}>
            <View style={styles.metricItem}>
              <Home size={14} color="#64748B" />
              <Text style={styles.metricText}>{communityCase.affectedHouseholds} households</Text>
            </View>
            <View style={styles.metricItem}>
              <Users size={14} color="#64748B" />
              <Text style={styles.metricText}>{communityCase.affectedIndividuals} individuals</Text>
            </View>
            <View style={styles.metricItem}>
              <MapPin size={14} color="#64748B" />
              <Text style={styles.metricText}>{communityCase.location.area}</Text>
            </View>
          </View>

          {communityCase.interventions.length > 0 && (
            <View style={styles.interventionsContainer}>
              <Activity size={14} color="#3B82F6" />
              <Text style={styles.interventionsText}>
                {communityCase.interventions.length} intervention{communityCase.interventions.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}

          <View style={styles.caseFooter}>
            <View style={styles.lastUpdate}>
              <Clock size={14} color="#64748B" />
              <Text style={styles.lastUpdateText}>Updated: {formatDate(communityCase.lastUpdate)}</Text>
            </View>
            {communityCase.followUpDate && (
              <View style={styles.followUp}>
                <Calendar size={14} color="#F59E0B" />
                <Text style={styles.followUpText}>
                  Follow-up: {new Date(communityCase.followUpDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          {communityCase.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {communityCase.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {communityCase.tags.length > 3 && (
                <Text style={styles.moreTagsText}>+{communityCase.tags.length - 3} more</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.caseAction}>
          <ChevronRight size={20} color="#94A3B8" />
        </View>
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

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const activeCases = cases.filter(c => c.status === 'active').length;
    const totalHouseholds = cases.reduce((sum, c) => sum + c.affectedHouseholds, 0);
    const totalIndividuals = cases.reduce((sum, c) => sum + c.affectedIndividuals, 0);
    const urgentCases = cases.filter(c => c.priority === 'urgent' || c.priority === 'high').length;

    return [
      { label: 'Active Cases', value: activeCases.toString(), icon: Activity, color: '#10B981' },
      { label: 'Households', value: totalHouseholds.toString(), icon: Home, color: '#3B82F6' },
      { label: 'Individuals', value: totalIndividuals.toString(), icon: Users, color: '#7C3AED' },
      { label: 'Urgent Cases', value: urgentCases.toString(), icon: AlertTriangle, color: '#EF4444' },
    ];
  }, [cases]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Community Cases</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddCase}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          {summaryStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={16} color={stat.color} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cases..."
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

      <ScrollView style={styles.casesList} showsVerticalScrollIndicator={false}>
        {filteredCases.length > 0 ? (
          <View style={styles.casesContainer}>
            {filteredCases.map(renderCaseCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Users size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No community cases found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Create your first community case to get started'}
            </Text>
            <TouchableOpacity style={styles.emptyAction} onPress={onAddCase}>
              <Plus size={20} color="#3B82F6" />
              <Text style={styles.emptyActionText}>Add New Case</Text>
            </TouchableOpacity>
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
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
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
    backgroundColor: '#3B82F6',
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
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  casesList: {
    flex: 1,
  },
  casesContainer: {
    padding: 16,
    gap: 12,
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  caseTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  caseTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  caseInfo: {
    flex: 1,
  },
  caseNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  caseType: {
    fontSize: 12,
    color: '#64748B',
  },
  caseBadges: {
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  caseContent: {
    gap: 8,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  caseDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  caseMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#64748B',
  },
  interventionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 8,
  },
  interventionsText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#64748B',
  },
  followUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  followUpText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: '#64748B',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  caseAction: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
    marginBottom: 24,
  },
  emptyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActionText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default CommunityManagement;