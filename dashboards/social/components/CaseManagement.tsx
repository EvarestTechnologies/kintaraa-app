import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Plus, FileText, Calendar, User, AlertTriangle, CheckCircle, Target } from 'lucide-react-native';
import { ServiceAssessment } from '../index';

interface CaseManagementProps {
  assessments: ServiceAssessment[];
  onAssessmentSelect: (assessment: ServiceAssessment) => void;
  onAddAssessment: () => void;
}

const CaseManagement: React.FC<CaseManagementProps> = ({ assessments, onAssessmentSelect, onAddAssessment }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      const matchesSearch = assessment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           assessment.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           assessment.assessor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'all' || assessment.assessmentType === typeFilter;
      const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assessments, searchQuery, typeFilter, statusFilter]);

  const getStatusColor = (status: ServiceAssessment['status']) => {
    switch (status) {
      case 'draft': return '#6B7280';
      case 'completed': return '#10B981';
      case 'pending_review': return '#F59E0B';
      case 'approved': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getAssessmentTypeIcon = (type: ServiceAssessment['assessmentType']) => {
    switch (type) {
      case 'initial': return '📋';
      case 'follow_up': return '🔄';
      case 'crisis': return '🚨';
      case 'closure': return '✅';
      case 'risk_assessment': return '⚠️';
      default: return '📄';
    }
  };

  const typeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Initial', value: 'initial' },
    { label: 'Follow-up', value: 'follow_up' },
    { label: 'Crisis', value: 'crisis' },
    { label: 'Closure', value: 'closure' },
    { label: 'Risk Assessment', value: 'risk_assessment' },
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending Review', value: 'pending_review' },
    { label: 'Approved', value: 'approved' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Case Management</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddAssessment}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>New Assessment</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assessments, clients, or case IDs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.filterGroup}>
            <Filter size={16} color="#64748B" />
            <Text style={styles.filterLabel}>Type:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {typeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterChip,
                    typeFilter === option.value && styles.filterChipActive
                  ]}
                  onPress={() => setTypeFilter(option.value)}
                >
                  <Text style={[
                    styles.filterChipText,
                    typeFilter === option.value && styles.filterChipTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterChip,
                    statusFilter === option.value && styles.filterChipActive
                  ]}
                  onPress={() => setStatusFilter(option.value)}
                >
                  <Text style={[
                    styles.filterChipText,
                    statusFilter === option.value && styles.filterChipTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      <ScrollView style={styles.assessmentsList} showsVerticalScrollIndicator={false}>
        {filteredAssessments.map((assessment) => (
          <TouchableOpacity
            key={assessment.id}
            style={styles.assessmentCard}
            onPress={() => onAssessmentSelect(assessment)}
            activeOpacity={0.7}
          >
            <View style={styles.assessmentHeader}>
              <View style={styles.assessmentInfo}>
                <View style={styles.assessmentTypeRow}>
                  <Text style={styles.assessmentTypeIcon}>
                    {getAssessmentTypeIcon(assessment.assessmentType)}
                  </Text>
                  <Text style={styles.assessmentType}>
                    {assessment.assessmentType.replace('_', ' ').toUpperCase()} ASSESSMENT
                  </Text>
                </View>
                <Text style={styles.clientName}>{assessment.clientName}</Text>
                <Text style={styles.caseId}>Case ID: {assessment.caseId}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(assessment.status) }]}>
                <Text style={styles.statusBadgeText}>
                  {assessment.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.assessmentDetails}>
              <View style={styles.detailRow}>
                <Calendar size={14} color="#64748B" />
                <Text style={styles.detailText}>
                  Assessment Date: {new Date(assessment.assessmentDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <User size={14} color="#64748B" />
                <Text style={styles.detailText}>Assessor: {assessment.assessor}</Text>
              </View>
            </View>

            <View style={styles.findingsSection}>
              <Text style={styles.findingsTitle}>Key Findings</Text>
              <View style={styles.findingsGrid}>
                <View style={styles.findingItem}>
                  <CheckCircle size={12} color="#10B981" />
                  <Text style={styles.findingLabel}>Strengths:</Text>
                  <Text style={styles.findingCount}>{assessment.findings.strengths.length}</Text>
                </View>
                <View style={styles.findingItem}>
                  <AlertTriangle size={12} color="#F59E0B" />
                  <Text style={styles.findingLabel}>Needs:</Text>
                  <Text style={styles.findingCount}>{assessment.findings.needs.length}</Text>
                </View>
                <View style={styles.findingItem}>
                  <AlertTriangle size={12} color="#EF4444" />
                  <Text style={styles.findingLabel}>Risks:</Text>
                  <Text style={styles.findingCount}>{assessment.findings.risks.length}</Text>
                </View>
                <View style={styles.findingItem}>
                  <Target size={12} color="#3B82F6" />
                  <Text style={styles.findingLabel}>Resources:</Text>
                  <Text style={styles.findingCount}>{assessment.findings.resources.length}</Text>
                </View>
              </View>
            </View>

            <View style={styles.servicePlanSection}>
              <Text style={styles.servicePlanTitle}>Service Plan</Text>
              <View style={styles.servicePlanDetails}>
                <View style={styles.planRow}>
                  <Text style={styles.planLabel}>Goals:</Text>
                  <Text style={styles.planValue}>{assessment.servicePlan.goals.length} objectives</Text>
                </View>
                <View style={styles.planRow}>
                  <Text style={styles.planLabel}>Interventions:</Text>
                  <Text style={styles.planValue}>{assessment.servicePlan.interventions.length} planned</Text>
                </View>
                <View style={styles.planRow}>
                  <Text style={styles.planLabel}>Timeline:</Text>
                  <Text style={styles.planValue}>{assessment.servicePlan.timeline}</Text>
                </View>
                <View style={styles.planRow}>
                  <Text style={styles.planLabel}>Review Date:</Text>
                  <Text style={styles.planValue}>
                    {new Date(assessment.servicePlan.reviewDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>

            {assessment.recommendations.length > 0 && (
              <View style={styles.recommendationsSection}>
                <FileText size={14} color="#8B5CF6" />
                <Text style={styles.recommendationsTitle}>
                  {assessment.recommendations.length} Recommendations
                </Text>
                <Text style={styles.recommendationsPreview} numberOfLines={2}>
                  {assessment.recommendations.join(', ')}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filteredAssessments.length === 0 && (
          <View style={styles.emptyState}>
            <FileText size={48} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>No assessments found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first assessment to get started'
              }
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
    padding: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1E293B',
  },
  filtersRow: {
    gap: 12,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  filterScroll: {
    flex: 1,
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  assessmentsList: {
    flex: 1,
    padding: 20,
  },
  assessmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assessmentInfo: {
    flex: 1,
  },
  assessmentTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  assessmentTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  assessmentType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 2,
  },
  caseId: {
    fontSize: 14,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  assessmentDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
  },
  findingsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  findingsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  findingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    minWidth: '45%',
  },
  findingLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  findingCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  servicePlanSection: {
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  servicePlanTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  servicePlanDetails: {
    gap: 6,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planLabel: {
    fontSize: 12,
    color: '#3730A3',
    fontWeight: '600',
  },
  planValue: {
    fontSize: 12,
    color: '#1E40AF',
  },
  recommendationsSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  recommendationsPreview: {
    fontSize: 12,
    color: '#6B46C1',
    flex: 1,
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default CaseManagement;