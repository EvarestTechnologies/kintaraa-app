import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getAllCases } from '@/services/dispatcher';
import CaseDetailsModal, { CaseDetails } from '@/app/components/_CaseDetailsModal';

export default function DispatcherCases() {
  const router = useRouter();
  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseDetails | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch cases from dispatcher API with optional filter
  const { data: incidents = [], isLoading, refetch } = useQuery({
    queryKey: ['dispatcher-all-cases', filter],
    queryFn: () => getAllCases(filter ? { status: filter } : undefined),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Get header title based on filter
  const getHeaderTitle = () => {
    if (filter === 'new') return 'New Cases';
    if (filter === 'assigned') return 'Assigned Cases';
    if (filter === 'in_progress') return 'Cases In Progress';
    if (filter === 'completed') return 'Completed Cases';
    return 'All Cases';
  };

  const getSectionTitle = () => {
    if (filter === 'new') return `New Cases (${incidents.length})`;
    if (filter === 'assigned') return `Assigned to Providers (${incidents.length})`;
    if (filter === 'in_progress') return `Cases In Progress (${incidents.length})`;
    if (filter === 'completed') return `Completed Cases (${incidents.length})`;
    return `All Incidents (${incidents.length})`;
  };

  // Convert dispatcher incident to CaseDetails format for modal
  const convertToCaseDetails = (incident: any): CaseDetails => {
    return {
      id: incident.id,
      incidentId: incident.id,
      caseNumber: incident.caseNumber,
      type: incident.type,
      status: incident.status,
      description: incident.description,
      incidentDate: incident.createdAt,
      incidentTime: incident.createdAt,
      location: incident.location?.address || 'Location not provided',
      urgencyLevel: incident.urgencyLevel || 'routine',
      supportServices: incident.supportServices || [],
      assignedAt: incident.assignedProviders?.[0]?.assigned_at || incident.createdAt,
    };
  };

  // Handle case card click
  const handleCaseClick = (incident: any) => {
    setSelectedCase(convertToCaseDetails(incident));
    setModalVisible(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCase(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>

        {isLoading && incidents.length === 0 ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#6A2CB0" />
          </View>
        ) : (
          <>
            {incidents.map((incident) => (
              <TouchableOpacity
                key={incident.id}
                style={styles.caseCard}
                onPress={() => handleCaseClick(incident)}
                activeOpacity={0.7}
              >
                <View style={styles.caseHeader}>
                  <Text style={styles.caseNumber}>{incident.caseNumber}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(incident.status) }]}>
                    <Text style={styles.statusText}>{incident.status}</Text>
                  </View>
                </View>
                <Text style={styles.caseType}>{incident.type}</Text>
                <Text style={styles.caseDescription} numberOfLines={2}>
                  {incident.description}
                </Text>

                {/* Show assigned provider info for in_progress and assigned cases */}
                {incident.assignedProviders && incident.assignedProviders.length > 0 && (
                  <View style={styles.providerInfo}>
                    <View style={styles.providerHeader}>
                      <Text style={styles.providerLabel}>Assigned Provider:</Text>
                    </View>
                    {incident.assignedProviders.map((provider) => (
                      <View key={provider.provider_id} style={styles.providerDetails}>
                        <View style={styles.providerRow}>
                          <Text style={styles.providerName}>{provider.provider_name}</Text>
                          <View style={[styles.providerTypeBadge, { backgroundColor: getProviderTypeColor(provider.provider_type) }]}>
                            <Text style={styles.providerTypeText}>{provider.provider_type}</Text>
                          </View>
                        </View>
                        <Text style={styles.providerAssignedDate}>
                          Accepted: {new Date(provider.assigned_at).toLocaleDateString()} at {new Date(provider.assigned_at).toLocaleTimeString()}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.caseDate}>
                  Reported: {new Date(incident.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}

            {incidents.length === 0 && !isLoading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No cases found</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Case Details Modal - Read-only for dispatcher */}
      <CaseDetailsModal
        visible={modalVisible}
        case_={selectedCase}
        onClose={handleCloseModal}
      />
    </View>
  );
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    new: '#FF6B35',
    assigned: '#4ECDC4',
    in_progress: '#FFE66D',
    completed: '#95E1D3',
    closed: '#999',
  };
  return colors[status] || '#999';
}

function getProviderTypeColor(providerType: string) {
  const colors: Record<string, string> = {
    gbv_rescue: '#DC2626',
    healthcare: '#059669',
    legal: '#7C3AED',
    police: '#1E40AF',
    counseling: '#DB2777',
    social: '#EA580C',
    chw: '#10B981',
  };
  return colors[providerType] || '#6A2CB0';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#6A2CB0',
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  caseType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  caseDescription: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  caseDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  providerInfo: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  providerHeader: {
    marginBottom: 8,
  },
  providerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  providerDetails: {
    marginBottom: 4,
  },
  providerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  providerTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  providerTypeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  providerAssignedDate: {
    fontSize: 11,
    color: '#6B7280',
  },
});
