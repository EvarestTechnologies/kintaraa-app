import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, Plus, FileText, Camera, Video, Mic, Shield, Eye, Lock } from 'lucide-react-native';
import type { Evidence } from '../index';

const mockEvidence: Evidence[] = [
  {
    id: '1',
    caseId: '1',
    caseNumber: 'DV-2025-001',
    type: 'photo',
    description: 'Photos of injuries sustained by victim',
    collectedDate: '2025-01-15',
    collectedBy: 'Officer Johnson',
    location: '123 Main St, Downtown',
    chainOfCustody: [
      {
        id: '1',
        officer: 'Officer Johnson',
        action: 'collected',
        date: '2025-01-15',
        time: '14:30',
        location: 'Crime Scene',
        notes: 'Initial evidence collection'
      }
    ],
    status: 'stored',
    tags: ['injury', 'victim', 'domestic_violence'],
    confidential: true
  },
  {
    id: '2',
    caseId: '1',
    caseNumber: 'DV-2025-001',
    type: 'physical',
    description: 'Torn clothing from victim',
    collectedDate: '2025-01-15',
    collectedBy: 'Officer Johnson',
    location: '123 Main St, Downtown',
    chainOfCustody: [
      {
        id: '2',
        officer: 'Officer Johnson',
        action: 'collected',
        date: '2025-01-15',
        time: '14:45',
        location: 'Crime Scene'
      },
      {
        id: '3',
        officer: 'Det. Smith',
        action: 'transferred',
        date: '2025-01-15',
        time: '16:00',
        location: 'Evidence Room'
      }
    ],
    status: 'analyzed',
    tags: ['clothing', 'physical_evidence'],
    confidential: true,
    forensicResults: 'DNA analysis pending'
  },
  {
    id: '3',
    caseId: '2',
    caseNumber: 'SA-2025-003',
    type: 'digital',
    description: 'Security camera footage from campus',
    collectedDate: '2025-01-14',
    collectedBy: 'Officer Davis',
    location: 'University Campus',
    chainOfCustody: [
      {
        id: '4',
        officer: 'Officer Davis',
        action: 'collected',
        date: '2025-01-14',
        time: '18:00',
        location: 'Campus Security Office'
      }
    ],
    status: 'analyzed',
    tags: ['video', 'surveillance', 'campus'],
    confidential: true,
    forensicResults: 'Video enhanced and analyzed'
  }
];

const EvidenceManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [evidence] = useState<Evidence[]>(mockEvidence);

  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = item.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera color="#3B82F6" />;
      case 'video': return <Video color="#8B5CF6" />;
      case 'audio': return <Mic color="#F59E0B" />;
      case 'document': return <FileText color="#10B981" />;
      case 'digital': return <Shield color="#6366F1" />;
      case 'physical': return <Eye color="#DC2626" />;
      case 'forensic': return <Shield color="#059669" />;
      default: return <FileText color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'collected': return '#F59E0B';
      case 'analyzed': return '#3B82F6';
      case 'stored': return '#10B981';
      case 'released': return '#6B7280';
      case 'destroyed': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const EvidenceCard: React.FC<{ item: Evidence }> = ({ item }) => (
    <TouchableOpacity style={styles.evidenceCard}>
      <View style={styles.evidenceHeader}>
        <View style={styles.evidenceInfo}>
          <View style={styles.typeContainer}>
            {getTypeIcon(item.type)}
            <Text style={styles.evidenceType}>{item.type.toUpperCase()}</Text>
            {item.confidential && <Lock color="#DC2626" />}
          </View>
          <Text style={styles.caseNumber}>{item.caseNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.evidenceDetails}>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Collected By:</Text>
            <Text style={styles.detailValue}>{item.collectedBy}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{new Date(item.collectedDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{item.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Chain Length:</Text>
            <Text style={styles.detailValue}>{item.chainOfCustody.length} entries</Text>
          </View>
        </View>

        {item.forensicResults && (
          <View style={styles.forensicResults}>
            <Text style={styles.forensicLabel}>Forensic Results:</Text>
            <Text style={styles.forensicText}>{item.forensicResults}</Text>
          </View>
        )}

        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.evidenceFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Chain</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Update Status</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Evidence Manager</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search evidence..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        {['all', 'photo', 'video', 'physical', 'digital', 'document'].map((filter) => (
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
              {filter === 'all' ? 'All' : filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.evidenceList} showsVerticalScrollIndicator={false}>
        {filteredEvidence.map((item) => (
          <EvidenceCard key={item.id} item={item} />
        ))}
        {filteredEvidence.length === 0 && (
          <View style={styles.emptyState}>
            <Shield color="#94A3B8" />
            <Text style={styles.emptyStateText}>No evidence found</Text>
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
    backgroundColor: '#8B5CF6',
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
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  activeFilterTab: {
    backgroundColor: '#8B5CF6',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#64748B',
    textTransform: 'capitalize',
  },
  activeFilterTabText: {
    color: 'white',
  },
  evidenceList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  evidenceCard: {
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
  evidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  evidenceInfo: {
    flex: 1,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  evidenceType: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#64748B',
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: 'white',
  },
  evidenceDetails: {
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    width: '48%',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500' as const,
  },
  detailValue: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500' as const,
  },
  forensicResults: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  forensicLabel: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 4,
  },
  forensicText: {
    fontSize: 12,
    color: '#374151',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500' as const,
  },
  evidenceFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#475569',
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

export default EvidenceManager;