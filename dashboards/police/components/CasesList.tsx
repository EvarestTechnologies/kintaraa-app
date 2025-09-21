import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Plus, Shield, AlertTriangle, Clock, CheckCircle } from 'lucide-react-native';
import type { PoliceCase } from '../index';
import NewCaseModal from './NewCaseModal';
import FilterCasesModal, { type CaseFilters } from './FilterCasesModal';

const mockPoliceCases: PoliceCase[] = [
  {
    id: '1',
    caseNumber: 'DV-2025-001',
    incidentType: 'domestic_violence',
    status: 'under_investigation',
    priority: 'high',
    reportedDate: '2025-01-15',
    incidentDate: '2025-01-14',
    location: '123 Main St, Downtown',
    reportingOfficer: 'Officer Johnson',
    assignedDetective: 'Det. Smith',
    victimName: 'Sarah Wilson',
    victimId: 'victim_001',
    suspectName: 'John Wilson',
    description: 'Domestic violence incident with physical assault',
    lastActivity: '2025-01-15T10:30:00Z',
    evidenceCount: 3,
    witnessCount: 2
  },
  {
    id: '2',
    caseNumber: 'SA-2025-003',
    incidentType: 'sexual_assault',
    status: 'open',
    priority: 'urgent',
    reportedDate: '2025-01-14',
    incidentDate: '2025-01-13',
    location: 'University Campus',
    reportingOfficer: 'Officer Davis',
    assignedDetective: 'Det. Brown',
    victimName: 'Anonymous',
    victimId: 'victim_002',
    description: 'Sexual assault reported on university campus',
    lastActivity: '2025-01-14T16:45:00Z',
    evidenceCount: 5,
    witnessCount: 1
  },
  {
    id: '3',
    caseNumber: 'HR-2025-002',
    incidentType: 'harassment',
    status: 'closed',
    priority: 'medium',
    reportedDate: '2025-01-10',
    incidentDate: '2025-01-09',
    location: 'Workplace - Tech Corp',
    reportingOfficer: 'Officer Martinez',
    victimName: 'Lisa Chen',
    victimId: 'victim_003',
    description: 'Workplace harassment case',
    lastActivity: '2025-01-12T14:20:00Z',
    evidenceCount: 2,
    witnessCount: 3
  }
];

const CasesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [cases, setCases] = useState<PoliceCase[]>(mockPoliceCases);
  const [showNewCaseModal, setShowNewCaseModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<CaseFilters>({
    status: [],
    incidentType: [],
    priority: [],
    dateRange: { startDate: null, endDate: null },
    assignedDetective: '',
    reportingOfficer: '',
    location: '',
  });

  const filteredCases = cases.filter(caseItem => {
    // Search filter
    const matchesSearch = caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.victimName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Basic tab filter (for backward compatibility)
    const matchesBasicFilter = selectedFilter === 'all' || caseItem.status === selectedFilter;

    // Advanced filters
    const matchesStatus = activeFilters.status.length === 0 || activeFilters.status.includes(caseItem.status);
    const matchesIncidentType = activeFilters.incidentType.length === 0 || activeFilters.incidentType.includes(caseItem.incidentType);
    const matchesPriority = activeFilters.priority.length === 0 || activeFilters.priority.includes(caseItem.priority);

    // Date range filter
    let matchesDateRange = true;
    if (activeFilters.dateRange.startDate || activeFilters.dateRange.endDate) {
      const caseDate = new Date(caseItem.incidentDate);
      if (activeFilters.dateRange.startDate) {
        matchesDateRange = matchesDateRange && caseDate >= new Date(activeFilters.dateRange.startDate);
      }
      if (activeFilters.dateRange.endDate) {
        matchesDateRange = matchesDateRange && caseDate <= new Date(activeFilters.dateRange.endDate);
      }
    }

    // Text filters
    const matchesDetective = !activeFilters.assignedDetective ||
      (caseItem.assignedDetective && caseItem.assignedDetective.toLowerCase().includes(activeFilters.assignedDetective.toLowerCase()));
    const matchesOfficer = !activeFilters.reportingOfficer ||
      caseItem.reportingOfficer.toLowerCase().includes(activeFilters.reportingOfficer.toLowerCase());
    const matchesLocation = !activeFilters.location ||
      caseItem.location.toLowerCase().includes(activeFilters.location.toLowerCase());

    return matchesSearch && matchesBasicFilter && matchesStatus && matchesIncidentType &&
           matchesPriority && matchesDateRange && matchesDetective && matchesOfficer && matchesLocation;
  });

  const hasActiveFilters = (): boolean => {
    return activeFilters.status.length > 0 ||
           activeFilters.incidentType.length > 0 ||
           activeFilters.priority.length > 0 ||
           activeFilters.dateRange.startDate !== null ||
           activeFilters.dateRange.endDate !== null ||
           activeFilters.assignedDetective !== '' ||
           activeFilters.reportingOfficer !== '' ||
           activeFilters.location !== '';
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    count += activeFilters.status.length;
    count += activeFilters.incidentType.length;
    count += activeFilters.priority.length;
    if (activeFilters.dateRange.startDate || activeFilters.dateRange.endDate) count += 1;
    if (activeFilters.assignedDetective) count += 1;
    if (activeFilters.reportingOfficer) count += 1;
    if (activeFilters.location) count += 1;
    return count;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'open': return '#F59E0B';
      case 'under_investigation': return '#3B82F6';
      case 'closed': return '#10B981';
      case 'cold_case': return '#6B7280';
      case 'referred': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle color="#F59E0B" />;
      case 'under_investigation': return <Search color="#3B82F6" />;
      case 'closed': return <CheckCircle color="#10B981" />;
      case 'cold_case': return <Clock color="#6B7280" />;
      case 'referred': return <Shield color="#8B5CF6" />;
      default: return <Shield color="#6B7280" />;
    }
  };

  const CaseCard: React.FC<{ caseItem: PoliceCase }> = ({ caseItem }) => (
    <TouchableOpacity style={styles.caseCard}>
      <View style={styles.caseHeader}>
        <View style={styles.caseInfo}>
          <Text style={styles.caseNumber}>{caseItem.caseNumber}</Text>
          <Text style={styles.incidentType}>{caseItem.incidentType.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(caseItem.status) + '20' }]}>
            {getStatusIcon(caseItem.status)}
            <Text style={[styles.statusText, { color: getStatusColor(caseItem.status) }]}>
              {caseItem.status.replace('_', ' ')}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(caseItem.priority) }]}>
            <Text style={styles.priorityText}>{caseItem.priority.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.caseDetails}>
        <Text style={styles.description} numberOfLines={2}>{caseItem.description}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Victim:</Text>
          <Text style={styles.detailValue}>{caseItem.victimName}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{caseItem.location}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Assigned:</Text>
          <Text style={styles.detailValue}>{caseItem.assignedDetective || 'Unassigned'}</Text>
        </View>
      </View>

      <View style={styles.caseFooter}>
        <View style={styles.counters}>
          <View style={styles.counter}>
            <Text style={styles.counterValue}>{caseItem.evidenceCount}</Text>
            <Text style={styles.counterLabel}>Evidence</Text>
          </View>
          <View style={styles.counter}>
            <Text style={styles.counterValue}>{caseItem.witnessCount}</Text>
            <Text style={styles.counterLabel}>Witnesses</Text>
          </View>
        </View>
        <Text style={styles.lastActivity}>
          Last activity: {new Date(caseItem.lastActivity).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Police Cases</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowNewCaseModal(true)}
        >
          <Plus color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cases..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters() && styles.filterButtonActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter color={hasActiveFilters() ? "#1E40AF" : "#64748B"} />
          {hasActiveFilters() && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        {['all', 'open', 'under_investigation', 'closed'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              selectedFilter === filter && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter && styles.activeFilterTabText
            ]}>
              {filter === 'all' ? 'All' : filter.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.casesList} showsVerticalScrollIndicator={false}>
        {filteredCases.map((caseItem) => (
          <CaseCard key={caseItem.id} caseItem={caseItem} />
        ))}
        {filteredCases.length === 0 && (
          <View style={styles.emptyState}>
            <Shield color="#94A3B8" />
            <Text style={styles.emptyStateText}>No cases found</Text>
          </View>
        )}
      </ScrollView>

      <NewCaseModal
        visible={showNewCaseModal}
        onClose={() => setShowNewCaseModal(false)}
        onSuccess={(newCase) => {
          setCases(prev => [newCase, ...prev]);
          setShowNewCaseModal(false);
        }}
      />

      <FilterCasesModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={(filters) => {
          setActiveFilters(filters);
          setShowFilterModal(false);
        }}
        currentFilters={activeFilters}
        cases={cases}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  filterButton: {
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#1E40AF',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  activeFilterTab: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#64748B',
    textTransform: 'capitalize',
  },
  activeFilterTabText: {
    color: 'white',
  },
  casesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  caseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  caseInfo: {
    flex: 1,
  },
  caseNumber: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 4,
  },
  incidentType: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500' as const,
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 8,
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
    fontSize: 12,
    fontWeight: '500' as const,
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: 'white',
  },
  caseDetails: {
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500' as const,
    width: 70,
  },
  detailValue: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  counters: {
    flexDirection: 'row',
    gap: 16,
  },
  counter: {
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1E293B',
  },
  counterLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  lastActivity: {
    fontSize: 10,
    color: '#94A3B8',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
});

export default CasesList;