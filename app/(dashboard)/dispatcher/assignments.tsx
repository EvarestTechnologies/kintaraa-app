import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, AlertTriangle, User, X, Briefcase, CheckCircle2 } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCases, getAvailableProviders, assignProviderToCase } from '@/services/dispatcher';

export default function DispatcherAssignments() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showProviderModal, setShowProviderModal] = useState(false);

  // Fetch cases pending assignment
  const { data: allCases = [], isLoading, refetch } = useQuery({
    queryKey: ['dispatcher-pending-cases'],
    queryFn: () => getAllCases({ status: 'pending_dispatcher_review' }),
    refetchInterval: 10000,
  });

  // Fetch available providers for assignment (filtered by incident needs)
  const { data: allProviders = [] } = useQuery({
    queryKey: ['available-providers-for-assignment'],
    queryFn: () => getAvailableProviders({ available_only: true }),
    enabled: showProviderModal,
  });

  // Map incident type and support services to provider types
  const getRelevantProviderTypes = (incident: any): string[] => {
    if (!incident) return [];

    const providerTypes = new Set<string>();

    // Always include GBV rescue for all cases
    providerTypes.add('gbv_rescue');

    // Based on incident type
    switch (incident.type) {
      case 'physical':
        providerTypes.add('healthcare');
        providerTypes.add('police');
        providerTypes.add('counseling');
        break;
      case 'sexual':
        providerTypes.add('healthcare');
        providerTypes.add('police');
        providerTypes.add('counseling');
        providerTypes.add('legal');
        break;
      case 'emotional':
        providerTypes.add('counseling');
        providerTypes.add('social');
        break;
      case 'economic':
        providerTypes.add('social');
        providerTypes.add('legal');
        break;
      case 'online':
        providerTypes.add('police');
        providerTypes.add('legal');
        providerTypes.add('counseling');
        break;
      case 'femicide':
        providerTypes.add('police');
        providerTypes.add('healthcare');
        providerTypes.add('legal');
        providerTypes.add('counseling');
        break;
    }

    // Based on support services requested
    if (incident.supportServices) {
      const services = Array.isArray(incident.supportServices)
        ? incident.supportServices
        : [];

      services.forEach((service: string) => {
        switch (service.toLowerCase()) {
          case 'medical':
          case 'healthcare':
            providerTypes.add('healthcare');
            providerTypes.add('chw');
            break;
          case 'legal':
          case 'legal_aid':
            providerTypes.add('legal');
            break;
          case 'police':
          case 'law_enforcement':
            providerTypes.add('police');
            break;
          case 'counseling':
          case 'therapy':
          case 'mental_health':
            providerTypes.add('counseling');
            break;
          case 'social':
          case 'social_services':
          case 'shelter':
            providerTypes.add('social');
            providerTypes.add('gbv_rescue');
            break;
          case 'community':
            providerTypes.add('chw');
            break;
        }
      });
    }

    return Array.from(providerTypes);
  };

  // Filter providers based on incident needs
  const providers = selectedCase
    ? allProviders.filter(provider => {
        const relevantTypes = getRelevantProviderTypes(selectedCase);
        return relevantTypes.includes(provider.provider_type);
      })
    : allProviders;

  // Mutation for assigning provider
  const assignMutation = useMutation({
    mutationFn: ({ caseId, providerId }: { caseId: string; providerId: string }) =>
      assignProviderToCase(caseId, providerId, 'Manual assignment by dispatcher'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatcher-pending-cases'] });
      queryClient.invalidateQueries({ queryKey: ['dispatcher-all-cases'] });
      queryClient.invalidateQueries({ queryKey: ['dispatcher-dashboard'] });
      setShowProviderModal(false);
      setSelectedCase(null);
      Alert.alert('Success', 'Provider assigned successfully!');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to assign provider');
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAssignCase = (incident: any) => {
    setSelectedCase(incident);
    setShowProviderModal(true);
  };

  const handleSelectProvider = (providerId: string) => {
    if (!selectedCase) return;

    Alert.alert(
      'Confirm Assignment',
      `Assign this provider to case ${selectedCase.caseNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          onPress: () => {
            assignMutation.mutate({
              caseId: selectedCase.id,
              providerId,
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Assignments</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>
          Cases Awaiting Assignment ({allCases.length})
        </Text>

        {isLoading && allCases.length === 0 ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#6A2CB0" />
          </View>
        ) : (
          <>
            {allCases.map((incident) => (
              <View key={incident.id} style={styles.caseCard}>
                <View style={styles.caseHeader}>
                  <View>
                    <Text style={styles.caseNumber}>{incident.caseNumber}</Text>
                    <View style={styles.urgencyBadge}>
                      <AlertTriangle size={14} color={getUrgencyColor(incident.urgencyLevel)} />
                      <Text style={[styles.urgencyText, { color: getUrgencyColor(incident.urgencyLevel) }]}>
                        {incident.urgencyLevel?.toUpperCase() || 'ROUTINE'}
                      </Text>
                    </View>
                  </View>
                  <Clock size={20} color="#999" />
                </View>

                <Text style={styles.caseType}>{incident.type}</Text>
                <Text style={styles.caseDescription} numberOfLines={2}>
                  {incident.description}
                </Text>

                <View style={styles.servicesRow}>
                  <Text style={styles.servicesLabel}>Services needed:</Text>
                  <Text style={styles.servicesText} numberOfLines={1}>
                    {incident.supportServices?.join(', ') || 'None specified'}
                  </Text>
                </View>

                <View style={styles.caseFooter}>
                  <Text style={styles.caseDate}>
                    {new Date(incident.createdAt).toLocaleDateString()} {new Date(incident.createdAt).toLocaleTimeString()}
                  </Text>
                  <TouchableOpacity
                    style={styles.assignButton}
                    onPress={() => handleAssignCase(incident)}
                  >
                    <User size={16} color="#FFFFFF" />
                    <Text style={styles.assignButtonText}>Assign Provider</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {allCases.length === 0 && !isLoading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No cases pending assignment</Text>
                <Text style={styles.emptySubtext}>All cases have been assigned to providers</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Provider Selection Modal */}
      <Modal
        visible={showProviderModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProviderModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Select Provider</Text>
              <Text style={styles.modalSubtitle}>
                Case: {selectedCase?.caseNumber}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowProviderModal(false)}
              style={styles.modalCloseButton}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedCase && (
              <View style={styles.filterInfo}>
                <Text style={styles.filterInfoText}>
                  Showing providers for: <Text style={styles.filterInfoBold}>{selectedCase.type}</Text> incident
                </Text>
                {selectedCase.supportServices && selectedCase.supportServices.length > 0 && (
                  <Text style={styles.filterInfoSubtext}>
                    Services needed: {selectedCase.supportServices.join(', ')}
                  </Text>
                )}
              </View>
            )}

            {providers.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No matching providers available</Text>
                <Text style={styles.emptySubtext}>
                  {allProviders.length > 0
                    ? 'No providers match this incident type. Try viewing all providers in the Providers tab.'
                    : 'All providers are currently at capacity'}
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.providerCount}>
                  {providers.length} relevant provider{providers.length !== 1 ? 's' : ''} available
                </Text>
                {providers.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  style={styles.providerOption}
                  onPress={() => handleSelectProvider(provider.id)}
                  disabled={assignMutation.isPending}
                >
                  <View style={styles.providerOptionHeader}>
                    <View style={styles.providerOptionInfo}>
                      <View style={styles.providerNameRow}>
                        <User size={18} color="#6A2CB0" />
                        <Text style={styles.providerOptionName}>
                          {provider.full_name}
                        </Text>
                      </View>
                      <View style={styles.providerTypeRow}>
                        <Briefcase size={14} color="#666" />
                        <Text style={styles.providerOptionType}>
                          {provider.provider_type_display}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.providerAvailableBadge}>
                      <CheckCircle2 size={16} color="#10B981" />
                    </View>
                  </View>

                  <View style={styles.providerOptionStats}>
                    <Text style={styles.providerOptionStat}>
                      Case Load: {provider.profile?.current_case_load || 0}/
                      {provider.profile?.max_case_load || 10}
                    </Text>
                    <Text style={styles.providerOptionStat}>
                      Acceptance: {Math.round((provider.profile?.acceptance_rate || 0) * 100)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function getUrgencyColor(urgency?: string) {
  const colors: Record<string, string> = {
    immediate: '#E53935',
    urgent: '#FF8F00',
    routine: '#43A047',
  };
  return colors[urgency || 'routine'] || '#43A047';
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
    borderRadius: 12,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A2CB0',
    marginBottom: 4,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  caseType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  caseDescription: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  servicesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  servicesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  servicesText: {
    fontSize: 13,
    color: '#1A1A1A',
    flex: 1,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  caseDate: {
    fontSize: 12,
    color: '#999',
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A2CB0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  assignButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#6A2CB0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterInfo: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  filterInfoText: {
    fontSize: 14,
    color: '#1E40AF',
    marginBottom: 4,
  },
  filterInfoBold: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  filterInfoSubtext: {
    fontSize: 12,
    color: '#60A5FA',
    fontStyle: 'italic',
  },
  providerCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  providerOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  providerOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerOptionInfo: {
    flex: 1,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  providerOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  providerTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  providerOptionType: {
    fontSize: 14,
    color: '#6B7280',
  },
  providerAvailableBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerOptionStats: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  providerOptionStat: {
    fontSize: 13,
    color: '#6B7280',
  },
});
