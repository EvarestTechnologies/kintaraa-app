import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, Plus, FileText, Eye, Edit, CheckCircle, Clock, AlertTriangle } from 'lucide-react-native';
import type { PoliceReport } from '../index';

const mockReports: PoliceReport[] = [
  {
    id: '1',
    caseId: '1',
    reportNumber: 'RPT-2025-001',
    type: 'incident',
    title: 'Domestic Violence Incident Report',
    description: 'Initial incident report for domestic violence case DV-2025-001. Victim sustained minor injuries, suspect fled scene.',
    createdDate: '2025-01-15',
    createdBy: 'Officer Johnson',
    status: 'approved',
    priority: 'high',
    involvedParties: ['Sarah Wilson', 'John Wilson'],
    location: '123 Main St, Downtown',
    incidentTime: '2025-01-14T22:30:00Z',
    supervisorReview: true,
    attachments: ['photos.zip', 'witness_statements.pdf']
  },
  {
    id: '2',
    caseId: '2',
    reportNumber: 'RPT-2025-002',
    type: 'investigation',
    title: 'Sexual Assault Investigation Report',
    description: 'Ongoing investigation report for campus sexual assault case. Evidence collected, interviews conducted.',
    createdDate: '2025-01-14',
    createdBy: 'Det. Brown',
    status: 'submitted',
    priority: 'urgent',
    involvedParties: ['Anonymous Victim', 'Campus Security'],
    location: 'University Campus',
    incidentTime: '2025-01-13T20:15:00Z',
    supervisorReview: false,
    attachments: ['security_footage.mp4', 'forensic_report.pdf']
  },
  {
    id: '3',
    caseId: '3',
    reportNumber: 'RPT-2025-003',
    type: 'patrol',
    title: 'Routine Patrol Report',
    description: 'Daily patrol report covering downtown district. No incidents reported during shift.',
    createdDate: '2025-01-15',
    createdBy: 'Officer Martinez',
    status: 'draft',
    priority: 'low',
    involvedParties: [],
    location: 'Downtown District',
    supervisorReview: false
  },
  {
    id: '4',
    caseId: '1',
    reportNumber: 'RPT-2025-004',
    type: 'evidence',
    title: 'Evidence Collection Report',
    description: 'Detailed report of evidence collected from domestic violence scene including photos and physical items.',
    createdDate: '2025-01-15',
    createdBy: 'Officer Johnson',
    status: 'reviewed',
    priority: 'medium',
    involvedParties: ['Sarah Wilson'],
    location: '123 Main St, Downtown',
    supervisorReview: true,
    attachments: ['evidence_log.pdf', 'chain_of_custody.pdf']
  }
];

const ReportsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [reports] = useState<PoliceReport[]>(mockReports);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || report.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft': return '#F59E0B';
      case 'submitted': return '#3B82F6';
      case 'reviewed': return '#8B5CF6';
      case 'approved': return '#10B981';
      case 'filed': return '#059669';
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
      case 'draft': return <Edit color="#F59E0B" />;
      case 'submitted': return <Clock color="#3B82F6" />;
      case 'reviewed': return <Eye color="#8B5CF6" />;
      case 'approved': return <CheckCircle color="#10B981" />;
      case 'filed': return <FileText color="#059669" />;
      default: return <FileText color="#6B7280" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'incident': return <AlertTriangle color="#DC2626" />;
      case 'investigation': return <Search color="#3B82F6" />;
      case 'patrol': return <Eye color="#10B981" />;
      case 'evidence': return <FileText color="#8B5CF6" />;
      case 'arrest': return <AlertTriangle color="#F59E0B" />;
      case 'traffic': return <Eye color="#6366F1" />;
      case 'witness': return <Eye color="#059669" />;
      default: return <FileText color="#6B7280" />;
    }
  };

  const ReportCard: React.FC<{ report: PoliceReport }> = ({ report }) => (
    <TouchableOpacity style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.reportInfo}>
          <View style={styles.typeContainer}>
            {getTypeIcon(report.type)}
            <Text style={styles.reportNumber}>{report.reportNumber}</Text>
          </View>
          <Text style={styles.reportTitle} numberOfLines={1}>{report.title}</Text>
          <Text style={styles.reportType}>{report.type.toUpperCase()}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
            {getStatusIcon(report.status)}
            <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
              {report.status.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(report.priority) }]}>
            <Text style={styles.priorityText}>{report.priority.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.reportDetails}>
        <Text style={styles.description} numberOfLines={2}>{report.description}</Text>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Created By:</Text>
            <Text style={styles.detailValue}>{report.createdBy}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{new Date(report.createdDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{report.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Parties:</Text>
            <Text style={styles.detailValue}>{report.involvedParties.length} involved</Text>
          </View>
        </View>

        {report.incidentTime && (
          <View style={styles.incidentTime}>
            <Text style={styles.incidentLabel}>Incident Time:</Text>
            <Text style={styles.incidentValue}>
              {new Date(report.incidentTime).toLocaleString()}
            </Text>
          </View>
        )}

        {report.attachments && report.attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
            <Text style={styles.attachmentsLabel}>Attachments ({report.attachments.length}):</Text>
            <View style={styles.attachmentsList}>
              {report.attachments.slice(0, 2).map((attachment, index) => (
                <View key={`${report.id}-${attachment}-${index}`} style={styles.attachment}>
                  <FileText color="#64748B" />
                  <Text style={styles.attachmentText} numberOfLines={1}>{attachment}</Text>
                </View>
              ))}
              {report.attachments.length > 2 && (
                <Text style={styles.moreAttachments}>
                  +{report.attachments.length - 2} more
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      <View style={styles.reportFooter}>
        <View style={styles.reviewStatus}>
          {report.supervisorReview ? (
            <View style={styles.reviewBadge}>
              <CheckCircle color="#10B981" />
              <Text style={styles.reviewText}>Supervisor Reviewed</Text>
            </View>
          ) : (
            <View style={styles.reviewBadge}>
              <Clock color="#F59E0B" />
              <Text style={styles.reviewText}>Pending Review</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Eye color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Edit color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Police Reports</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        {['all', 'draft', 'submitted', 'reviewed', 'approved'].map((filter) => (
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

      <ScrollView style={styles.reportsList} showsVerticalScrollIndicator={false}>
        {filteredReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
        {filteredReports.length === 0 && (
          <View style={styles.emptyState}>
            <FileText color="#94A3B8" />
            <Text style={styles.emptyStateText}>No reports found</Text>
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
    backgroundColor: '#10B981',
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
    backgroundColor: '#10B981',
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
  reportsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  reportNumber: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1E293B',
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 2,
  },
  reportType: {
    fontSize: 11,
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
    fontSize: 10,
    fontWeight: '600' as const,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: 'bold' as const,
    color: 'white',
  },
  reportDetails: {
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 18,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  detailItem: {
    width: '48%',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500' as const,
  },
  detailValue: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500' as const,
  },
  incidentTime: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  incidentLabel: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 2,
  },
  incidentValue: {
    fontSize: 11,
    color: '#374151',
  },
  attachmentsContainer: {
    marginBottom: 8,
  },
  attachmentsLabel: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 6,
  },
  attachmentsList: {
    gap: 4,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 6,
  },
  attachmentText: {
    fontSize: 10,
    color: '#475569',
    flex: 1,
  },
  moreAttachments: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 2,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  reviewStatus: {
    flex: 1,
  },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500' as const,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
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

export default ReportsList;