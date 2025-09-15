import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  Search,
  Filter,
  Plus,
  FileText,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit3,
  Eye,
  Download,
  Paperclip,
  ChevronRight,
} from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import { router } from 'expo-router';
import type { MedicalRecord } from '../index';

type RecordType = 'consultation' | 'diagnosis' | 'treatment' | 'lab_result' | 'prescription' | 'therapy_note';
type RecordStatus = 'draft' | 'completed' | 'pending_review' | 'approved';
type FilterType = 'all' | 'consultation' | 'diagnosis' | 'treatment' | 'lab_result' | 'prescription' | 'therapy_note';

const statusConfig = {
  draft: { color: '#9CA3AF', icon: Edit3, label: 'Draft' },
  completed: { color: '#10B981', icon: CheckCircle, label: 'Completed' },
  pending_review: { color: '#F59E0B', icon: Clock, label: 'Pending Review' },
  approved: { color: '#059669', icon: CheckCircle, label: 'Approved' },
};

const typeConfig = {
  consultation: { color: '#3B82F6', label: 'Consultation', icon: User },
  diagnosis: { color: '#EF4444', label: 'Diagnosis', icon: AlertCircle },
  treatment: { color: '#10B981', label: 'Treatment', icon: CheckCircle },
  lab_result: { color: '#8B5CF6', label: 'Lab Result', icon: FileText },
  prescription: { color: '#F59E0B', label: 'Prescription', icon: FileText },
  therapy_note: { color: '#06B6D4', label: 'Therapy Note', icon: Edit3 },
};

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All Records' },
  { key: 'consultation', label: 'Consultations' },
  { key: 'diagnosis', label: 'Diagnoses' },
  { key: 'treatment', label: 'Treatments' },
  { key: 'lab_result', label: 'Lab Results' },
  { key: 'prescription', label: 'Prescriptions' },
  { key: 'therapy_note', label: 'Therapy Notes' },
];

export default function MedicalRecords() {
  const { assignedCases } = useProvider();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Transform cases to medical records
  const medicalRecords: MedicalRecord[] = useMemo(() => {
    const recordsList: MedicalRecord[] = [];
    
    assignedCases.forEach((case_, index) => {
      // Create 2-5 medical records per case
      const numRecords = 2 + (index % 4);
      
      for (let i = 0; i < numRecords; i++) {
        const recordDate = new Date();
        recordDate.setDate(recordDate.getDate() - (index * 3) - i);
        
        const types: RecordType[] = ['consultation', 'diagnosis', 'treatment', 'lab_result', 'prescription', 'therapy_note'];
        const statuses: RecordStatus[] = ['draft', 'completed', 'pending_review', 'approved'];
        
        const recordType = types[i % types.length];
        
        const titles = {
          consultation: 'Initial Consultation',
          diagnosis: 'Medical Diagnosis',
          treatment: 'Treatment Plan',
          lab_result: 'Laboratory Results',
          prescription: 'Medication Prescription',
          therapy_note: 'Therapy Session Notes',
        };
        
        const descriptions = {
          consultation: 'Comprehensive initial assessment and evaluation of patient condition.',
          diagnosis: 'Clinical diagnosis based on examination findings and test results.',
          treatment: 'Detailed treatment plan including medications and therapy recommendations.',
          lab_result: 'Complete blood count, chemistry panel, and other diagnostic tests.',
          prescription: 'Prescribed medications with dosage instructions and duration.',
          therapy_note: 'Progress notes from therapy session including patient response.',
        };
        
        recordsList.push({
          id: `${case_.id}-record-${i}`,
          patientId: case_.id,
          patientName: `Patient ${case_.caseNumber.split('-')[2] || index + 1}`,
          type: recordType,
          title: `${titles[recordType]} ${i > 0 ? `- Session ${i + 1}` : ''}`,
          description: descriptions[recordType],
          date: recordDate.toISOString(),
          provider: 'Dr. Sarah Johnson', // Mock provider name
          status: statuses[i % statuses.length],
          priority: (['low', 'medium', 'high', 'urgent'] as const)[i % 4],
          attachments: i % 3 === 0 ? ['lab_report.pdf', 'xray_image.jpg'] : undefined,
          caseId: case_.id,
        });
      }
    });
    
    return recordsList.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [assignedCases]);

  // Filter medical records
  const filteredRecords = useMemo(() => {
    let filtered = medicalRecords;

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(record => record.type === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        record.patientName.toLowerCase().includes(query) ||
        record.title.toLowerCase().includes(query) ||
        record.description.toLowerCase().includes(query) ||
        record.provider.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [medicalRecords, selectedFilter, searchQuery]);

  const handleRecordPress = (record: MedicalRecord) => {
    console.log('Navigate to record details:', record.id);
    router.push(`/case-details/${record.caseId}`);
  };

  const handleAddRecord = () => {
    Alert.alert(
      'Create Medical Record',
      'Medical record creation functionality will be implemented in the next phase.',
      [{ text: 'OK' }]
    );
  };

  const handleEditRecord = (record: MedicalRecord) => {
    Alert.alert(
      'Edit Record',
      `Edit ${record.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: () => console.log('Editing record:', record.id) },
      ]
    );
  };

  const handleDownloadRecord = (record: MedicalRecord) => {
    Alert.alert(
      'Download Record',
      `Download ${record.title} as PDF?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => console.log('Downloading record:', record.id) },
      ]
    );
  };

  const getStatusIcon = (status: RecordStatus) => {
    const StatusIcon = statusConfig[status].icon;
    return <StatusIcon color={statusConfig[status].color} size={16} />;
  };

  const getTypeIcon = (type: RecordType) => {
    const TypeIcon = typeConfig[type].icon;
    return <TypeIcon color={typeConfig[type].color} size={16} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Medical Records</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddRecord}
            testID="add-record-button"
          >
            <Plus color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search records..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter color={showFilters ? '#6A2CB0' : '#9CA3AF'} size={20} />
          </TouchableOpacity>
        </View>

        {/* Filter Options */}
        {showFilters && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterChip,
                  selectedFilter === option.key && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(option.key)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === option.key && styles.filterChipTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Records List */}
      <ScrollView 
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText color="#9CA3AF" size={48} />
            <Text style={styles.emptyTitle}>No Records Found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'No medical records match the selected filter'}
            </Text>
          </View>
        ) : (
          filteredRecords.map((record) => (
            <TouchableOpacity
              key={record.id}
              style={styles.recordCard}
              onPress={() => handleRecordPress(record)}
              testID={`record-card-${record.id}`}
            >
              <View style={styles.recordHeader}>
                <View style={styles.recordInfo}>
                  <View style={styles.titleRow}>
                    <View style={styles.typeIndicator}>
                      {getTypeIcon(record.type)}
                      <Text style={[
                        styles.typeText,
                        { color: typeConfig[record.type].color }
                      ]}>
                        {typeConfig[record.type].label}
                      </Text>
                    </View>
                    
                    <View style={styles.statusBadge}>
                      {getStatusIcon(record.status)}
                      <Text style={[
                        styles.statusText,
                        { color: statusConfig[record.status].color }
                      ]}>
                        {statusConfig[record.status].label}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.recordTitle}>{record.title}</Text>
                  <Text style={styles.patientName}>{record.patientName}</Text>
                </View>
                <ChevronRight color="#9CA3AF" size={20} />
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {record.description}
              </Text>

              <View style={styles.recordDetails}>
                <View style={styles.providerInfo}>
                  <View style={styles.infoRow}>
                    <User color="#6B7280" size={14} />
                    <Text style={styles.infoText}>{record.provider}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Calendar color="#6B7280" size={14} />
                    <Text style={styles.infoText}>
                      {formatDate(record.date)}
                    </Text>
                  </View>
                </View>
                
                {record.attachments && record.attachments.length > 0 && (
                  <View style={styles.attachmentInfo}>
                    <View style={styles.infoRow}>
                      <Paperclip color="#6B7280" size={14} />
                      <Text style={styles.infoText}>
                        {record.attachments.length} attachment{record.attachments.length > 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {record.priority === 'urgent' && (
                <View style={styles.urgentBanner}>
                  <AlertCircle color="#EF4444" size={16} />
                  <Text style={styles.urgentText}>Urgent - Requires immediate attention</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleRecordPress(record)}
                >
                  <Eye color="#6A2CB0" size={16} />
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                
                {record.status === 'draft' && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditRecord(record)}
                  >
                    <Edit3 color="#F59E0B" size={16} />
                    <Text style={[styles.actionButtonText, { color: '#F59E0B' }]}>Edit</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDownloadRecord(record)}
                >
                  <Download color="#10B981" size={16} />
                  <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Download</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
  },
  addButton: {
    backgroundColor: '#6A2CB0',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    padding: 4,
  },
  filtersContainer: {
    marginTop: 16,
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 24,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  providerInfo: {
    flex: 1,
    gap: 4,
  },
  attachmentInfo: {
    alignItems: 'flex-end',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  urgentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  urgentText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A2CB0',
  },
});