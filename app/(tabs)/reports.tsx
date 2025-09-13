import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, MessageCircle, Filter, Search, Briefcase, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useIncidents, Incident } from '@/providers/IncidentProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useProvider } from '@/providers/ProviderContext';

const incidentTypeLabels: Record<string, string> = {
  physical: 'Physical Violence',
  sexual: 'Sexual Violence',
  emotional: 'Emotional/Psychological Abuse',
  economic: 'Economic Abuse',
  online: 'Online Gender-Based Violence',
  femicide: 'Femicide/Attempted Femicide',
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle color="#43A047" size={20} />;
    case 'in_progress':
      return <Clock color="#FF9800" size={20} />;
    case 'assigned':
      return <AlertCircle color="#6A2CB0" size={20} />;
    case 'new':
      return <FileText color="#49455A" size={20} />;
    case 'closed':
      return <CheckCircle color="#757575" size={20} />;
    default:
      return <FileText color="#49455A" size={20} />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
      return 'In Progress';
    case 'assigned':
      return 'Assigned';
    case 'new':
      return 'New';
    case 'closed':
      return 'Closed';
    default:
      return 'Unknown';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return '#E53935';
    case 'medium':
      return '#FF9800';
    case 'low':
      return '#43A047';
    default:
      return '#49455A';
  }
};

type CaseFilter = 'all' | 'assigned' | 'in_progress' | 'completed';

const CASES_PER_PAGE = 10;

export default function ReportsScreen() {
  const { user } = useAuth();
  const { incidents, isLoading } = useIncidents();
  const { assignedCases, updateCaseStatus } = useProvider();
  const [currentFilter, setCurrentFilter] = useState<CaseFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Always calculate these values at the top level
  const allCases = assignedCases.length > 0 ? assignedCases : incidents;
  
  // Filter and search cases
  const filteredCases = useMemo(() => {
    if (user?.role !== 'provider') return [];
    
    let filtered = allCases;
    
    // Apply status filter
    switch (currentFilter) {
      case 'assigned':
        filtered = filtered.filter(c => c.status === 'assigned');
        break;
      case 'in_progress':
        filtered = filtered.filter(c => c.status === 'in_progress');
        break;
      case 'completed':
        filtered = filtered.filter(c => c.status === 'completed');
        break;
      default:
        // Show all cases
        break;
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.caseNumber.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        (incidentTypeLabels[c.type as keyof typeof incidentTypeLabels] || c.type).toLowerCase().includes(query)
      );
    }
    
    // Apply additional filters
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(c => c.priority === selectedPriority);
    }
    
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(c => c.severity === selectedSeverity);
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(c => c.type === selectedType);
    }
    
    return filtered;
  }, [allCases, currentFilter, user?.role, searchQuery, selectedPriority, selectedSeverity, selectedType]);
  
  // Calculate stats
  const stats = useMemo(() => ({
    assigned: allCases.filter(c => c.status === 'assigned').length,
    inProgress: allCases.filter(c => c.status === 'in_progress').length,
    completed: allCases.filter(c => c.status === 'completed').length,
  }), [allCases]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{user?.role === 'provider' ? 'Case Management' : 'My Reports'}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading {user?.role === 'provider' ? 'cases' : 'reports'}...</Text>
        </View>
      </View>
    );
  }

  // Provider case management view
  if (user?.role === 'provider') {
    // Calculate pagination
    const totalPages = Math.ceil(filteredCases.length / CASES_PER_PAGE);
    const startIndex = (currentPage - 1) * CASES_PER_PAGE;
    const endIndex = startIndex + CASES_PER_PAGE;
    const casesToShow = filteredCases.slice(startIndex, endIndex);
    
    const handleFilterChange = (filter: CaseFilter) => {
      if (filter && typeof filter === 'string') {
        setCurrentFilter(filter);
        setCurrentPage(1); // Reset to first page when filter changes
      }
    };
    
    const handlePageChange = (page: number) => {
      if (typeof page === 'number' && page > 0) {
        setCurrentPage(page);
      }
    };
    
    const renderCaseItem = ({ item: incident }: { item: Incident }) => (
      <TouchableOpacity
        key={incident.id}
        style={styles.providerCaseCard}
        testID={`case-${incident.id}`}
        onPress={() => router.push(`/case-details/${incident.id}`)}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportInfo}>
            <Text style={styles.reportId}>{incident.caseNumber}</Text>
            <Text style={styles.reportType}>
              {incidentTypeLabels[incident.type as keyof typeof incidentTypeLabels] || incident.type}
            </Text>
          </View>
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(incident.severity || 'medium') },
            ]}
          >
            <Text style={styles.severityText}>
              {(incident.severity || 'medium').toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.reportDetails}>
          <View style={styles.reportStatus}>
            {getStatusIcon(incident.status)}
            <Text style={styles.statusText}>
              {getStatusText(incident.status)}
            </Text>
          </View>
          <Text style={styles.reportDate}>
            {new Date(incident.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Provider Actions */}
        <View style={styles.providerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/case-details/${incident.id}`);
            }}
          >
            <Text style={styles.actionButtonText}>View Case</Text>
          </TouchableOpacity>
          
          {incident.status !== 'completed' && (
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={(e) => {
                e.stopPropagation();
                updateCaseStatus({
                  incidentId: incident.id,
                  status: incident.status === 'assigned' ? 'in_progress' : 'completed'
                });
              }}
            >
              <Text style={styles.updateButtonText}>
                {incident.status === 'assigned' ? 'Start Case' : 'Complete'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {incident.messages.length > 0 && (
          <View style={styles.messageInfo}>
            <MessageCircle color="#6A2CB0" size={16} />
            <Text style={styles.messageInfoText}>
              {incident.messages.length} message{incident.messages.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Case Management</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Filter color="#6A2CB0" size={20} />
              {(selectedPriority !== 'all' || selectedSeverity !== 'all' || selectedType !== 'all') && (
                <View style={styles.filterIndicatorDot} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => setShowSearchModal(true)}
            >
              <Search color="#6A2CB0" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Case Statistics */}
          <View style={styles.statsSection}>
            <TouchableOpacity 
              style={[
                styles.statItem,
                currentFilter === 'assigned' && styles.statItemActive
              ]}
              onPress={() => handleFilterChange('assigned')}
            >
              <Text style={[
                styles.statNumber,
                currentFilter === 'assigned' && styles.statNumberActive
              ]}>{stats.assigned}</Text>
              <Text style={[
                styles.statLabel,
                currentFilter === 'assigned' && styles.statLabelActive
              ]}>Assigned Cases</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.statItem,
                currentFilter === 'in_progress' && styles.statItemActive
              ]}
              onPress={() => handleFilterChange('in_progress')}
            >
              <Text style={[
                styles.statNumber,
                currentFilter === 'in_progress' && styles.statNumberActive
              ]}>{stats.inProgress}</Text>
              <Text style={[
                styles.statLabel,
                currentFilter === 'in_progress' && styles.statLabelActive
              ]}>In Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.statItem,
                currentFilter === 'completed' && styles.statItemActive
              ]}
              onPress={() => handleFilterChange('completed')}
            >
              <Text style={[
                styles.statNumber,
                currentFilter === 'completed' && styles.statNumberActive
              ]}>{stats.completed}</Text>
              <Text style={[
                styles.statLabel,
                currentFilter === 'completed' && styles.statLabelActive
              ]}>Completed</Text>
            </TouchableOpacity>
          </View>
          
          {/* Filter Indicator */}
          {currentFilter !== 'all' && (
            <View style={styles.filterIndicator}>
              <Text style={styles.filterText}>
                Showing {currentFilter.replace('_', ' ')} cases ({filteredCases.length})
              </Text>
              <TouchableOpacity 
                style={styles.clearFilterButton}
                onPress={() => handleFilterChange('all')}
              >
                <Text style={styles.clearFilterText}>Show All</Text>
              </TouchableOpacity>
            </View>
          )}

          {filteredCases.length === 0 ? (
            <View style={styles.emptyState}>
              <Briefcase color="#D8CEE8" size={64} />
              <Text style={styles.emptyTitle}>
                {currentFilter === 'all' ? 'No Cases Assigned' : `No ${currentFilter.replace('_', ' ')} Cases`}
              </Text>
              <Text style={styles.emptyDescription}>
                {currentFilter === 'all' 
                  ? "You don't have any cases assigned yet. New cases will appear here when assigned to you."
                  : `No cases with ${currentFilter.replace('_', ' ')} status found.`
                }
              </Text>
            </View>
          ) : (
            <>
              <FlatList
                data={casesToShow}
                renderItem={renderCaseItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.reportsList}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={[
                      styles.paginationButton,
                      currentPage === 1 && styles.paginationButtonDisabled
                    ]}
                    onPress={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft color={currentPage === 1 ? '#D8CEE8' : '#6A2CB0'} size={20} />
                  </TouchableOpacity>
                  
                  <View style={styles.paginationInfo}>
                    <Text style={styles.paginationText}>
                      Page {currentPage} of {totalPages}
                    </Text>
                    <Text style={styles.paginationSubtext}>
                      {startIndex + 1}-{Math.min(endIndex, filteredCases.length)} of {filteredCases.length} cases
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.paginationButton,
                      currentPage === totalPages && styles.paginationButtonDisabled
                    ]}
                    onPress={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight color={currentPage === totalPages ? '#D8CEE8' : '#6A2CB0'} size={20} />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>
        
        {/* Search Modal */}
        <Modal
          visible={showSearchModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Cases</Text>
              <TouchableOpacity 
                onPress={() => setShowSearchModal(false)}
                style={styles.modalCloseButton}
              >
                <X color="#49455A" size={24} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by case number, description, or type..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity 
                style={styles.searchClearButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.searchClearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.modalApplyButton}
              onPress={() => setShowSearchModal(false)}
            >
              <Text style={styles.modalApplyText}>Apply Search</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        
        {/* Filter Modal */}
        <Modal
          visible={showFilterModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Cases</Text>
              <TouchableOpacity 
                onPress={() => setShowFilterModal(false)}
                style={styles.modalCloseButton}
              >
                <X color="#49455A" size={24} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filterContent}>
              {/* Priority Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Priority</Text>
                <View style={styles.filterOptions}>
                  {['all', 'low', 'medium', 'high', 'critical'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.filterOption,
                        selectedPriority === priority && styles.filterOptionSelected
                      ]}
                      onPress={() => setSelectedPriority(priority)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedPriority === priority && styles.filterOptionTextSelected
                      ]}>
                        {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Severity Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Severity</Text>
                <View style={styles.filterOptions}>
                  {['all', 'low', 'medium', 'high'].map((severity) => (
                    <TouchableOpacity
                      key={severity}
                      style={[
                        styles.filterOption,
                        selectedSeverity === severity && styles.filterOptionSelected
                      ]}
                      onPress={() => setSelectedSeverity(severity)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedSeverity === severity && styles.filterOptionTextSelected
                      ]}>
                        {severity === 'all' ? 'All Severities' : severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Type Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Incident Type</Text>
                <View style={styles.filterOptions}>
                  {['all', 'physical', 'sexual', 'emotional', 'economic', 'online', 'femicide'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterOption,
                        selectedType === type && styles.filterOptionSelected
                      ]}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedType === type && styles.filterOptionTextSelected
                      ]}>
                        {type === 'all' ? 'All Types' : incidentTypeLabels[type as keyof typeof incidentTypeLabels] || type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalClearButton}
                onPress={() => {
                  setSelectedPriority('all');
                  setSelectedSeverity('all');
                  setSelectedType('all');
                }}
              >
                <Text style={styles.modalClearText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalApplyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.modalApplyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Default survivor reports view
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        <TouchableOpacity
          style={styles.newReportButton}
          onPress={() => router.push('/report')}
          testID="new-report-button"
        >
          <Plus color="#FFFFFF" size={20} />
          <Text style={styles.newReportButtonText}>New Report</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {incidents.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText color="#D8CEE8" size={64} />
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptyDescription}>
              When you submit incident reports, they will appear here for tracking and follow-up.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/report')}
            >
              <Text style={styles.emptyButtonText}>Create First Report</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportsList}>
            {incidents.map((incident) => (
              <TouchableOpacity
                key={incident.id}
                style={styles.reportCard}
                testID={`report-${incident.id}`}
              >
                <View style={styles.reportHeader}>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportId}>{incident.caseNumber}</Text>
                    <Text style={styles.reportType}>
                      {incidentTypeLabels[incident.type as keyof typeof incidentTypeLabels] || incident.type}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(incident.severity || 'medium') },
                    ]}
                  >
                    <Text style={styles.severityText}>
                      {(incident.severity || 'medium').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.reportDetails}>
                  <View style={styles.reportStatus}>
                    {getStatusIcon(incident.status)}
                    <Text style={styles.statusText}>
                      {getStatusText(incident.status)}
                    </Text>
                  </View>
                  <Text style={styles.reportDate}>
                    {new Date(incident.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>

                <View style={styles.reportActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </TouchableOpacity>
                  {incident.messages.length > 0 && (
                    <TouchableOpacity style={styles.messageButton}>
                      <MessageCircle color="#6A2CB0" size={16} />
                      <Text style={styles.messageButtonText}>
                        {incident.messages.length} message{incident.messages.length !== 1 ? 's' : ''}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {incident.assignedProviderId && (
                  <View style={styles.providerInfo}>
                    <Text style={styles.providerText}>
                      Assigned to case worker
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpDescription}>
            Our support team is here to assist you with your reports and connect you with appropriate services.
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#341A52',
  },
  newReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  newReportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reportsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2CB0',
    marginBottom: 4,
  },
  reportType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  reportDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
  },
  reportDate: {
    fontSize: 14,
    color: '#49455A',
  },
  reportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F5F0FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#49455A',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  messageButtonText: {
    color: '#6A2CB0',
    fontSize: 12,
    fontWeight: '600',
  },
  providerInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F0FF',
  },
  providerText: {
    fontSize: 12,
    color: '#43A047',
    fontWeight: '600',
  },
  helpSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 32,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 8,
  },
  helpDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: '#E24B95',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Provider-specific styles
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F0FF',
  },
  searchButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F0FF',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
  },
  providerCaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#6A2CB0',
  },
  providerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#43A047',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F0FF',
    gap: 6,
  },
  messageInfoText: {
    fontSize: 12,
    color: '#6A2CB0',
    fontWeight: '600',
  },
  // New styles for dynamic stats and pagination
  statItemActive: {
    backgroundColor: '#6A2CB0',
    borderWidth: 2,
    borderColor: '#341A52',
  },
  statNumberActive: {
    color: '#FFFFFF',
  },
  statLabelActive: {
    color: '#FFFFFF',
  },
  filterIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F5F0FF',
    marginHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  filterText: {
    fontSize: 14,
    color: '#341A52',
    fontWeight: '600',
  },
  clearFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#6A2CB0',
    borderRadius: 16,
  },
  clearFilterText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 16,
  },
  paginationButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F0FF',
    borderWidth: 1,
    borderColor: '#6A2CB0',
  },
  paginationButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D8CEE8',
  },
  paginationInfo: {
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
  },
  paginationSubtext: {
    fontSize: 12,
    color: '#49455A',
    marginTop: 2,
  },
  // Search and Filter Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D8CEE8',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
  },
  modalCloseButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D8CEE8',
    marginBottom: 12,
  },
  searchClearButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F0FF',
    borderRadius: 8,
  },
  searchClearText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  filterOptionSelected: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#49455A',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#D8CEE8',
  },
  modalClearButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F5F0FF',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6A2CB0',
  },
  modalClearText: {
    color: '#6A2CB0',
    fontSize: 16,
    fontWeight: '600',
  },
  modalApplyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#6A2CB0',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalApplyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  filterIndicatorDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: '#E24B95',
    borderRadius: 4,
  },
});