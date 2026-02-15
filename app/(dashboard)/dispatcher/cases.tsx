import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getAllCases } from '@/services/dispatcher';

export default function DispatcherCases() {
  const router = useRouter();
  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const [refreshing, setRefreshing] = useState(false);

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
              <View key={incident.id} style={styles.caseCard}>
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
                <Text style={styles.caseDate}>
                  {new Date(incident.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}

            {incidents.length === 0 && !isLoading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No cases found</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
});
