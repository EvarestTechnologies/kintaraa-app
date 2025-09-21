import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Calendar,
  User,
  Lock,
  Tag,
} from 'lucide-react-native';
import type { LegalDocument } from '../index';

type FilterType = 'all' | 'draft' | 'review' | 'approved' | 'filed' | 'confidential';
type SortType = 'date' | 'title' | 'type' | 'status';

interface DocumentCardProps {
  document: LegalDocument;
  onPress: (document: LegalDocument) => void;
  onDownload: (document: LegalDocument) => void;
  onEdit: (document: LegalDocument) => void;
  onDelete: (document: LegalDocument) => void;
}

function DocumentCard({ document, onPress, onDownload, onEdit, onDelete }: DocumentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6B7280';
      case 'review': return '#F59E0B';
      case 'approved': return '#10B981';
      case 'filed': return '#3B82F6';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return '📄';
      case 'motion': return '⚖️';
      case 'brief': return '📋';
      case 'evidence': return '🔍';
      case 'correspondence': return '✉️';
      case 'court_order': return '🏛️';
      case 'affidavit': return '📝';
      default: return '📄';
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${document.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(document) },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.documentCard}
      onPress={() => onPress(document)}
      activeOpacity={0.7}
    >
      <View style={styles.documentHeader}>
        <View style={styles.documentInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.typeIcon}>{getTypeIcon(document.type)}</Text>
            <Text style={styles.documentTitle} numberOfLines={1}>
              {document.title}
            </Text>
            {document.confidential && (
              <Lock size={16} color="#EF4444" style={styles.lockIcon} />
            )}
          </View>
          <Text style={styles.caseReference}>Case: {document.caseName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(document.status) }]}>
            {document.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.documentMeta}>
        <View style={styles.metaItem}>
          <Calendar size={14} color="#9CA3AF" />
          <Text style={styles.metaText}>Created: {document.createdDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <User size={14} color="#9CA3AF" />
          <Text style={styles.metaText}>By: {document.createdBy}</Text>
        </View>
        {document.fileSize && (
          <View style={styles.metaItem}>
            <FileText size={14} color="#9CA3AF" />
            <Text style={styles.metaText}>{document.fileSize}</Text>
          </View>
        )}
      </View>

      {document.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <Tag size={12} color="#9CA3AF" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {document.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.documentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onPress(document)}
        >
          <Eye size={16} color="#3B82F6" />
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDownload(document)}
        >
          <Download size={16} color="#10B981" />
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(document)}
        >
          <Edit3 size={16} color="#F59E0B" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
        >
          <Trash2 size={16} color="#EF4444" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function DocumentsList() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Mock legal documents data
  const mockDocuments: LegalDocument[] = useMemo(() => [
    {
      id: '1',
      caseId: 'case-1',
      caseName: 'Johnson vs. Smith',
      title: 'Restraining Order Motion',
      type: 'motion',
      status: 'filed',
      createdDate: '2024-01-20',
      lastModified: '2024-01-22',
      createdBy: 'John Smith',
      fileSize: '2.3 MB',
      tags: ['urgent', 'domestic violence', 'restraining order'],
      confidential: true,
      description: 'Motion for temporary restraining order in domestic violence case.',
    },
    {
      id: '2',
      caseId: 'case-2',
      caseName: 'Rodriguez vs. State',
      title: 'Evidence Collection Report',
      type: 'evidence',
      status: 'approved',
      createdDate: '2024-01-18',
      lastModified: '2024-01-19',
      createdBy: 'Jane Doe',
      fileSize: '5.7 MB',
      tags: ['evidence', 'sexual assault', 'forensic'],
      confidential: true,
      description: 'Comprehensive evidence collection and analysis report.',
    },
    {
      id: '3',
      caseId: 'case-3',
      caseName: 'Chen vs. Employer Corp',
      title: 'Settlement Agreement Draft',
      type: 'contract',
      status: 'review',
      createdDate: '2024-01-15',
      lastModified: '2024-01-20',
      createdBy: 'Robert Wilson',
      fileSize: '1.2 MB',
      tags: ['settlement', 'harassment', 'employment'],
      confidential: false,
      description: 'Draft settlement agreement for workplace harassment case.',
    },
    {
      id: '4',
      caseId: 'case-4',
      caseName: 'Thompson vs. City',
      title: 'Discrimination Complaint',
      type: 'brief',
      status: 'draft',
      createdDate: '2024-01-12',
      lastModified: '2024-01-16',
      createdBy: 'Michael Brown',
      fileSize: '3.1 MB',
      tags: ['discrimination', 'employment', 'civil rights'],
      confidential: false,
      description: 'Legal brief outlining discrimination complaint details.',
    },
    {
      id: '5',
      caseId: 'case-5',
      caseName: 'Davis vs. Ex-Spouse',
      title: 'Custody Modification Order',
      type: 'court_order',
      status: 'filed',
      createdDate: '2024-01-10',
      lastModified: '2024-01-14',
      createdBy: 'Sarah Williams',
      fileSize: '800 KB',
      tags: ['custody', 'family law', 'modification'],
      confidential: true,
      description: 'Court order for child custody arrangement modification.',
    },
  ], []);

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = mockDocuments;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.caseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          doc.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'confidential') {
        filtered = filtered.filter((doc) => doc.confidential);
      } else {
        filtered = filtered.filter((doc) => doc.status === activeFilter);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockDocuments, searchQuery, activeFilter, sortBy]);

  const handleDocumentPress = (document: LegalDocument) => {
    console.log('Opening document:', document.title);
    // Navigate to document viewer
  };

  const handleDownload = (document: LegalDocument) => {
    console.log('Downloading document:', document.title);
    // Implement download functionality
  };

  const handleEdit = (document: LegalDocument) => {
    console.log('Editing document:', document.title);
    // Navigate to document editor
  };

  const handleDelete = (document: LegalDocument) => {
    console.log('Deleting document:', document.title);
    // Implement delete functionality
  };

  const handleNewDocument = () => {
    console.log('Creating new document');
    // Navigate to document creation
  };

  const getFilterCount = (filter: FilterType) => {
    if (filter === 'all') return mockDocuments.length;
    if (filter === 'confidential') return mockDocuments.filter(d => d.confidential).length;
    return mockDocuments.filter(d => d.status === filter).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Legal Documents</Text>
          <Text style={styles.subtitle}>{filteredAndSortedDocuments.length} documents found</Text>
        </View>
        <TouchableOpacity
          style={styles.newButton}
          onPress={handleNewDocument}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.newButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents, cases, or tags..."
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
            {(['all', 'draft', 'review', 'approved', 'filed', 'confidential'] as FilterType[]).map((filter) => (
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
                  {filter !== 'all' && ` (${getFilterCount(filter)})`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(['date', 'title', 'type', 'status'] as SortType[]).map((sort) => (
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

      {/* Documents List */}
      <FlatList
        data={filteredAndSortedDocuments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DocumentCard
            document={item}
            onPress={handleDocumentPress}
            onDownload={handleDownload}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No documents found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || activeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by creating your first legal document'}
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
  documentCard: {
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
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentInfo: {
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
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    flex: 1,
  },
  lockIcon: {
    marginLeft: 8,
  },
  caseReference: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500' as const,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
  },
  documentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  documentActions: {
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