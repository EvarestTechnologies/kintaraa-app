import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  Scale,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Pause,
  X,
} from 'lucide-react-native';
import type { LegalCase } from '../index';

type FilterType = 'all' | 'active' | 'pending' | 'closed' | 'urgent';
type SortType = 'date' | 'priority' | 'status' | 'client';

interface CaseCardProps {
  case: LegalCase;
  onPress: (caseItem: LegalCase) => void;
}

function CaseCard({ case: caseItem, onPress }: CaseCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'closed': return '#6B7280';
      case 'on_hold': return '#8B5CF6';
      case 'appeal': return '#EF4444';
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
      case 'active': return <CheckCircle size={16} color={getStatusColor(status)} />;
      case 'pending': return <Clock size={16} color={getStatusColor(status)} />;
      case 'closed': return <X size={16} color={getStatusColor(status)} />;
      case 'on_hold': return <Pause size={16} color={getStatusColor(status)} />;
      case 'appeal': return <AlertCircle size={16} color={getStatusColor(status)} />;
      default: return <Clock size={16} color={getStatusColor(status)} />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.caseCard}
      onPress={() => onPress(caseItem)}
      activeOpacity={0.7}
    >
      <View style={styles.caseHeader}>
        <View style={styles.caseInfo}>
          <Text style={styles.caseNumber}>{caseItem.caseNumber}</Text>
          <Text style={styles.caseType}>{caseItem.caseType.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <View style={styles.statusContainer}>
          {getStatusIcon(caseItem.status)}
          <Text style={[styles.statusText, { color: getStatusColor(caseItem.status) }]}>
            {caseItem.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.clientInfo}>
        <User size={16} color="#6B7280" />
        <Text style={styles.clientName}>{caseItem.clientName}</Text>
      </View>

      <Text style={styles.caseDescription} numberOfLines={2}>
        {caseItem.description}
      </Text>

      <View style={styles.caseFooter}>
        <View style={styles.dateInfo}>
          <Calendar size={14} color="#9CA3AF" />
          <Text style={styles.dateText}>Opened: {caseItem.dateOpened}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(caseItem.priority) + '20' }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(caseItem.priority) }]}>
            {caseItem.priority.toUpperCase()}
          </Text>
        </View>
      </View>

      {caseItem.nextHearing && (
        <View style={styles.hearingInfo}>
          <AlertCircle size={14} color="#F59E0B" />
          <Text style={styles.hearingText}>Next hearing: {caseItem.nextHearing}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function CasesList() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Mock legal cases data
  const mockCases: LegalCase[] = [
    {
      id: '1',
      caseNumber: 'CASE-2024-001',
      clientName: 'Sarah Johnson',
      clientId: 'client-1',
      caseType: 'domestic_violence',
      status: 'active',
      priority: 'high',
      dateOpened: '2024-01-15',
      lastActivity: '2024-01-20',
      nextHearing: '2024-02-01',
      assignedLawyer: 'John Smith',
      description: 'Domestic violence case involving restraining order and custody issues.',
      courtLocation: 'Family Court Building A',
      estimatedDuration: 6,
    },
    {
      id: '2',
      caseNumber: 'CASE-2024-002',
      clientName: 'Maria Rodriguez',
      clientId: 'client-2',
      caseType: 'sexual_assault',
      status: 'pending',
      priority: 'urgent',
      dateOpened: '2024-01-10',
      lastActivity: '2024-01-18',
      assignedLawyer: 'Jane Doe',
      description: 'Sexual assault case requiring immediate attention and evidence collection.',
      courtLocation: 'Criminal Court Building B',
      estimatedDuration: 8,
    },
    {
      id: '3',
      caseNumber: 'CASE-2023-045',
      clientName: 'Emily Chen',
      clientId: 'client-3',
      caseType: 'harassment',
      status: 'closed',
      priority: 'medium',
      dateOpened: '2023-11-20',
      lastActivity: '2024-01-05',
      assignedLawyer: 'Robert Wilson',
      description: 'Workplace harassment case successfully resolved with settlement.',
      outcome: 'Settlement reached',
      courtLocation: 'Civil Court Building C',
      estimatedDuration: 3,
    },
    {
      id: '4',
      caseNumber: 'CASE-2024-003',
      clientName: 'Lisa Thompson',
      clientId: 'client-4',
      caseType: 'discrimination',
      status: 'on_hold',
      priority: 'medium',
      dateOpened: '2024-01-08',
      lastActivity: '2024-01-15',
      assignedLawyer: 'Michael Brown',
      description: 'Employment discrimination case pending additional documentation.',
      courtLocation: 'Employment Court',
      estimatedDuration: 4,
    },
    {
      id: '5',
      caseNumber: 'CASE-2023-038',
      clientName: 'Amanda Davis',
      clientId: 'client-5',
      caseType: 'family_law',
      status: 'appeal',
      priority: 'high',
      dateOpened: '2023-10-15',
      lastActivity: '2024-01-12',
      nextHearing: '2024-02-15',
      assignedLawyer: 'Sarah Williams',
      description: 'Child custody case currently under appeal process.',
      courtLocation: 'Appeals Court',
      estimatedDuration: 12,
    },
  ];

  const filteredAndSortedCases = useMemo(() => {
    let filtered = mockCases;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (caseItem) =>
          caseItem.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          caseItem.caseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          caseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'urgent') {
        filtered = filtered.filter((caseItem) => caseItem.priority === 'urgent');
      } else {
        filtered = filtered.filter((caseItem) => caseItem.status === activeFilter);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateOpened).getTime() - new Date(a.dateOpened).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          return a.status.localeCompare(b.status);
        case 'client':
          return a.clientName.localeCompare(b.clientName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockCases, searchQuery, activeFilter, sortBy]);

  const handleCasePress = (caseItem: LegalCase) => {
    console.log('Opening case details for:', caseItem.caseNumber);
    // Navigate to case details
  };

  const getFilterCount = (filter: FilterType) => {
    if (filter === 'all') return mockCases.length;
    if (filter === 'urgent') return mockCases.filter(c => c.priority === 'urgent').length;
    return mockCases.filter(c => c.status === filter).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Legal Cases</Text>
        <Text style={styles.subtitle}>{filteredAndSortedCases.length} cases found</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cases, clients, or case numbers..."
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

      {/* Filter Options */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {(['all', 'active', 'pending', 'closed', 'urgent'] as FilterType[]).map((filter) => (
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
                  {filter === 'all' ? 'All' : filter.replace('_', ' ')}
                  {filter !== 'all' && ` (${getFilterCount(filter)})`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(['date', 'priority', 'status', 'client'] as SortType[]).map((sort) => (
                <TouchableOpacity
                  key={sort}
                  style={[
                    styles.sortChip,
                    sortBy === sort && styles.sortChipActive,
                  ]}
                  onPress={() => setSortBy(sort)}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      sortBy === sort && styles.sortChipTextActive,
                    ]}
                  >
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Cases List */}
      <FlatList
        data={filteredAndSortedCases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CaseCard case={item} onPress={handleCasePress} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Scale size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No cases found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || activeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by creating your first legal case'}
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
    padding: 20,
    paddingBottom: 10,
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 12,
    fontWeight: '500' as const,
  },
  sortChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  sortChipActive: {
    backgroundColor: '#EBF4FF',
  },
  sortChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  sortChipTextActive: {
    color: '#3B82F6',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  caseCard: {
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
  caseType: {
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
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#374151',
  },
  caseDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priorityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
  },
  hearingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    gap: 6,
  },
  hearingText: {
    fontSize: 12,
    color: '#92400E',
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