/**
 * Shared My Cases Component
 * Displays assigned cases for all provider types with details view
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useProvider } from '@/providers/ProviderContext';
import {
  Briefcase,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
} from 'lucide-react-native';
import CaseDetailsModal, { CaseDetails } from './_CaseDetailsModal';

type FilterStatus = 'all' | 'in_progress' | 'completed';

export default function MyCases() {
  const { assignedCases, pendingAssignments, isLoading, updateCaseStatus } = useProvider();
  const [selectedCase, setSelectedCase] = useState<CaseDetails | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Convert assigned cases to CaseDetails format
  // Includes both accepted cases (assignedCases) and pending assignments
  const cases: CaseDetails[] = useMemo(() => {
    // First, map accepted/in-progress cases
    const acceptedCases = assignedCases.map((incident) => ({
      id: incident.id,
      incidentId: incident.id,
      caseNumber: incident.caseNumber,
      status: incident.status,
      type: incident.type,
      description: incident.description || 'No description provided',
      incidentDate: incident.incidentDate || incident.createdAt,
      incidentTime: (incident as any).incidentTime || incident.incidentDate || incident.createdAt,
      location: typeof incident.location === 'string' ? incident.location : incident.location?.address || 'Not specified',
      urgencyLevel: (incident as any).urgencyLevel || incident.priority || 'routine',
      survivorName: incident.isAnonymous ? 'Anonymous' : `Survivor ${incident.survivorId.substring(0, 8)}`,
      survivorContact: undefined, // Not available in current Incident model
      assignedAt: incident.createdAt,
      acceptedAt: incident.updatedAt !== incident.createdAt ? incident.updatedAt : undefined,
      supportServices: incident.supportServices || [],
    }));

    // Then, map pending assignments (not yet accepted)
    const pendingCases: CaseDetails[] = pendingAssignments.map((assignment) => ({
      id: assignment.id,
      incidentId: assignment.incidentId,
      caseNumber: assignment.caseNumber,
      status: 'assigned', // Status is 'assigned' until provider accepts
      type: assignment.serviceType,
      description: assignment.description || 'Pending assignment',
      incidentDate: assignment.reportedAt,
      incidentTime: assignment.reportedAt,
      location: assignment.location || 'Not specified',
      urgencyLevel: assignment.priority,
      survivorName: assignment.isAnonymous ? 'Anonymous' : assignment.survivorName,
      survivorContact: undefined,
      assignedAt: assignment.assignedAt,
      acceptedAt: undefined, // Not accepted yet
      supportServices: [assignment.serviceType],
    }));

    // Combine both accepted and pending cases
    return [...acceptedCases, ...pendingCases];
  }, [assignedCases, pendingAssignments]);

  // Filter cases
  const filteredCases = useMemo(() => {
    let result = cases;

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter((c) => c.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.caseNumber.toLowerCase().includes(query) ||
          c.type.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.survivorName?.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    return result.sort(
      (a, b) =>
        new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
    );
  }, [cases, filterStatus, searchQuery]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Clock color="#3B82F6" size={18} />;
      case 'completed':
        return <CheckCircle color="#10B981" size={18} />;
      default:
        return <FileText color="#F59E0B" size={18} />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'in_progress':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      default:
        return '#F59E0B';
    }
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency?.toLowerCase()) {
      case 'immediate':
        return '#DC2626';
      case 'urgent':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleCasePress = (case_: CaseDetails) => {
    setSelectedCase(case_);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedCase(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A2CB0" />
        <Text style={styles.loadingText}>Loading your cases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>My Cases</Text>
            <Text style={styles.headerSubtitle}>
              {filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter color="#6B7280" size={20} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color="#9CA3AF" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cases..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Pills */}
        {showFilters && (
          <View style={styles.filterPills}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                filterStatus === 'all' && styles.filterPillActive,
              ]}
              onPress={() => setFilterStatus('all')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterStatus === 'all' && styles.filterPillTextActive,
                ]}
              >
                All Cases
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterPill,
                filterStatus === 'in_progress' && styles.filterPillActive,
              ]}
              onPress={() => setFilterStatus('in_progress')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterStatus === 'in_progress' && styles.filterPillTextActive,
                ]}
              >
                In Progress
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterPill,
                filterStatus === 'completed' && styles.filterPillActive,
              ]}
              onPress={() => setFilterStatus('completed')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterStatus === 'completed' && styles.filterPillTextActive,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Cases List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredCases.length === 0 ? (
          <View style={styles.emptyState}>
            <Briefcase color="#D1D5DB" size={64} />
            <Text style={styles.emptyTitle}>No cases found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Your assigned cases will appear here'}
            </Text>
          </View>
        ) : (
          <View style={styles.casesList}>
            {filteredCases.map((case_) => (
              <TouchableOpacity
                key={case_.id}
                style={styles.caseCard}
                onPress={() => handleCasePress(case_)}
                activeOpacity={0.7}
              >
                {/* Header Row */}
                <View style={styles.caseHeader}>
                  <View style={styles.caseHeaderLeft}>
                    {getStatusIcon(case_.status)}
                    <Text style={styles.caseNumber}>{case_.caseNumber}</Text>
                  </View>
                  <View
                    style={[
                      styles.urgencyBadge,
                      { backgroundColor: getUrgencyColor(case_.urgencyLevel) },
                    ]}
                  >
                    <AlertTriangle color="#FFFFFF" size={12} />
                    <Text style={styles.urgencyText}>
                      {case_.urgencyLevel?.toUpperCase() || 'ROUTINE'}
                    </Text>
                  </View>
                </View>

                {/* Case Info */}
                <View style={styles.caseInfo}>
                  <Text style={styles.caseType}>{case_.type}</Text>
                  <Text style={styles.caseDescription} numberOfLines={2}>
                    {case_.description}
                  </Text>
                </View>

                {/* Footer Row */}
                <View style={styles.caseFooter}>
                  <View style={styles.caseFooterLeft}>
                    <Calendar color="#9CA3AF" size={14} />
                    <Text style={styles.caseDate}>{formatDate(case_.assignedAt)}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(case_.status)}15` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: getStatusColor(case_.status) },
                      ]}
                    >
                      {case_.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Case Details Modal */}
      <CaseDetailsModal
        visible={showDetailsModal}
        case_={selectedCase}
        onClose={handleCloseModal}
        onUpdateStatus={async (newStatus) => {
          if (!selectedCase) return;

          try {
            // Call the updateCaseStatus mutation from ProviderContext
            await updateCaseStatus({
              incidentId: selectedCase.incidentId,
              status: newStatus as any,
              notes: `Case marked as ${newStatus} by provider`,
            });

            // Close modal after successful update
            handleCloseModal();
          } catch (error) {
            console.error('Failed to update case status:', error);
            // Error will be handled by the modal's error handling
            throw error;
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterPillActive: {
    backgroundColor: '#6A2CB0',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  casesList: {
    padding: 16,
    gap: 12,
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  caseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  caseNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  caseInfo: {
    marginBottom: 12,
  },
  caseType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  caseDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  caseDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
