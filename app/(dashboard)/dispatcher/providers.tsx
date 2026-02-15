import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, User, CheckCircle2, XCircle, Briefcase } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { getAvailableProviders } from '@/services/dispatcher';

export default function ProvidersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);

  // Fetch all providers
  const { data: providers = [], isLoading, refetch } = useQuery({
    queryKey: ['dispatcher-providers', filterType],
    queryFn: () => getAvailableProviders(filterType ? { provider_type: filterType } : undefined),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const providerTypes = [
    { id: undefined, label: 'All Providers' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'legal', label: 'Legal' },
    { id: 'counseling', label: 'Counseling' },
    { id: 'social', label: 'Social Services' },
    { id: 'police', label: 'Police' },
    { id: 'gbv_rescue', label: 'GBV Rescue' },
    { id: 'chw', label: 'CHW' },
  ];

  const availableProviders = providers.filter(p => p.profile?.is_currently_available);
  const unavailableProviders = providers.filter(p => !p.profile?.is_currently_available);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Provider Network</Text>
        <Text style={styles.headerSubtitle}>
          {providers.length} providers ({availableProviders.length} available)
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {providerTypes.map((type) => (
          <TouchableOpacity
            key={type.id || 'all'}
            style={[
              styles.filterTab,
              filterType === type.id && styles.filterTabActive,
            ]}
            onPress={() => setFilterType(type.id)}
          >
            <Text
              style={[
                styles.filterTabText,
                filterType === type.id && styles.filterTabTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {isLoading && providers.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6A2CB0" />
            </View>
          ) : (
            <>
              {/* Available Providers */}
              {availableProviders.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Available Now ({availableProviders.length})
                  </Text>
                  {availableProviders.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </View>
              )}

              {/* Unavailable Providers */}
              {unavailableProviders.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Currently Unavailable ({unavailableProviders.length})
                  </Text>
                  {unavailableProviders.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </View>
              )}

              {providers.length === 0 && !isLoading && (
                <View style={styles.emptyState}>
                  <MapPin size={64} color="#D1D5DB" />
                  <Text style={styles.emptyText}>No providers found</Text>
                  <Text style={styles.emptySubtext}>
                    {filterType ? 'Try changing the filter' : 'No providers registered yet'}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ProviderCardProps {
  provider: any;
}

function ProviderCard({ provider }: ProviderCardProps) {
  const isAvailable = provider.profile?.is_currently_available;
  const currentLoad = provider.profile?.current_case_load || 0;
  const maxLoad = provider.profile?.max_case_load || 10;
  const acceptanceRate = provider.profile?.acceptance_rate || 0;

  return (
    <View style={styles.providerCard}>
      <View style={styles.providerHeader}>
        <View style={styles.providerInfo}>
          <View style={styles.providerNameRow}>
            <User size={18} color="#6A2CB0" />
            <Text style={styles.providerName}>{provider.full_name}</Text>
          </View>
          <View style={styles.providerTypeRow}>
            <Briefcase size={14} color="#666" />
            <Text style={styles.providerType}>{provider.provider_type_display}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, isAvailable ? styles.statusAvailable : styles.statusUnavailable]}>
          {isAvailable ? (
            <CheckCircle2 size={16} color="#10B981" />
          ) : (
            <XCircle size={16} color="#EF4444" />
          )}
          <Text style={[styles.statusText, isAvailable ? styles.statusTextAvailable : styles.statusTextUnavailable]}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>

      <View style={styles.providerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Case Load</Text>
          <Text style={styles.statValue}>
            {currentLoad}/{maxLoad}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(currentLoad / maxLoad) * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Acceptance Rate</Text>
          <Text style={styles.statValue}>{Math.round(acceptanceRate * 100)}%</Text>
        </View>
      </View>

      <Text style={styles.providerEmail}>{provider.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6A2CB0',
    padding: 24,
    paddingTop: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#6A2CB0',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  providerCard: {
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
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  providerTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  providerType: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusAvailable: {
    backgroundColor: '#D1FAE5',
  },
  statusUnavailable: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextAvailable: {
    color: '#10B981',
  },
  statusTextUnavailable: {
    color: '#EF4444',
  },
  providerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6A2CB0',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  providerEmail: {
    fontSize: 13,
    color: '#6B7280',
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#D1D5DB',
  },
});
