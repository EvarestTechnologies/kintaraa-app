import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Users, Phone, Mail, AlertCircle, Calendar } from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import type { Client } from '../index';

const ClientsList: React.FC = () => {
  const { assignedCases } = useProvider();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'high_risk' | 'completed'>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Convert incidents to clients for counseling
  const clients: Client[] = useMemo(() => {
    return assignedCases
      .filter(c => c.supportServices.includes('counseling'))
      .map((incident, index) => ({
        id: incident.id,
        name: `Client ${incident.caseNumber}`,
        age: 25 + (index % 40), // Mock ages between 25-65
        gender: index % 2 === 0 ? 'Female' : 'Male',
        primaryConcern: incident.type === 'physical' ? 'Trauma Recovery' :
                       incident.type === 'emotional' ? 'Anxiety & Depression' :
                       incident.type === 'sexual' ? 'PTSD Treatment' :
                       incident.type === 'economic' ? 'Stress Management' :
                       'Digital Safety Counseling',
        status: incident.status === 'completed' ? 'completed' as const :
                incident.status === 'in_progress' ? 'active' as const :
                incident.status === 'assigned' ? 'active' as const : 'on_hold' as const,
        riskLevel: incident.priority === 'critical' ? 'critical' :
                   incident.priority === 'high' ? 'high' :
                   incident.priority === 'medium' ? 'medium' : 'low',
        lastSession: incident.updatedAt,
        nextSession: (incident.status === 'in_progress' || incident.status === 'assigned') ? 
          new Date(Date.now() + 86400000 * (1 + index % 7)).toISOString() : undefined,
        phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        email: `client${index + 1}@example.com`,
        emergencyContact: {
          name: `Emergency Contact ${index + 1}`,
          phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          relationship: index % 3 === 0 ? 'Spouse' : index % 3 === 1 ? 'Parent' : 'Sibling'
        },
        caseId: incident.caseNumber,
        therapistNotes: incident.description
      }));
  }, [assignedCases]);

  // Filter clients based on search and filter
  const filteredClients = useMemo(() => {
    let filtered = clients;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.primaryConcern.toLowerCase().includes(query) ||
        client.caseId.toLowerCase().includes(query)
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(client => {
        switch (selectedFilter) {
          case 'active':
            return client.status === 'active';
          case 'high_risk':
            return client.riskLevel === 'high' || client.riskLevel === 'critical';
          case 'completed':
            return client.status === 'completed';
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [clients, searchQuery, selectedFilter]);

  const getRiskLevelColor = (riskLevel: Client['riskLevel']) => {
    switch (riskLevel) {
      case 'critical': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active': return '#059669';
      case 'on_hold': return '#D97706';
      case 'completed': return '#7C3AED';
      case 'referred': return '#0891B2';
      default: return '#6B7280';
    }
  };

  const ClientCard: React.FC<{ client: Client }> = ({ client }) => (
    <TouchableOpacity style={styles.clientCard}>
      <View style={styles.clientHeader}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientDetails}>
            {client.age} years • {client.gender} • {client.caseId}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(client.status) }]}>
            <Text style={styles.statusText}>
              {client.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          <View style={[styles.riskBadge, { backgroundColor: getRiskLevelColor(client.riskLevel) }]}>
            <AlertCircle size={12} color="#FFFFFF" />
            <Text style={styles.riskText}>{client.riskLevel.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.concernContainer}>
        <Text style={styles.concernLabel}>Primary Concern:</Text>
        <Text style={styles.concernText}>{client.primaryConcern}</Text>
      </View>

      <View style={styles.sessionInfo}>
        <View style={styles.sessionItem}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.sessionText}>
            Last: {new Date(client.lastSession).toLocaleDateString()}
          </Text>
        </View>
        {client.nextSession && (
          <View style={styles.sessionItem}>
            <Calendar size={14} color="#059669" />
            <Text style={[styles.sessionText, { color: '#059669' }]}>
              Next: {new Date(client.nextSession).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactItem}>
          <Phone size={14} color="#6B7280" />
          <Text style={styles.contactText}>{client.phone}</Text>
        </View>
        <View style={styles.contactItem}>
          <Mail size={14} color="#6B7280" />
          <Text style={styles.contactText}>{client.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Clients</Text>
        <Text style={styles.subtitle}>
          Manage your counseling clients and their treatment progress
        </Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? '#FFFFFF' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
        {[
          { key: 'all', label: 'All Clients', count: clients.length },
          { key: 'active', label: 'Active', count: clients.filter(c => c.status === 'active').length },
          { key: 'high_risk', label: 'High Risk', count: clients.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length },
          { key: 'completed', label: 'Completed', count: clients.filter(c => c.status === 'completed').length },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.filterTabActive
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter.key && styles.filterTabTextActive
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
          </ScrollView>
        </View>
      )}

      {/* Clients List */}
      <ScrollView style={styles.clientsList} showsVerticalScrollIndicator={false}>
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Users size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No clients found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search criteria' : 'No clients match the selected filter'}
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 8,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  filterScroll: {
    alignItems: 'center',
  },
  filterTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  clientsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 4,
  },
  clientDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#FFFFFF',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '500' as const,
    color: '#FFFFFF',
    marginLeft: 2,
  },
  concernContainer: {
    marginBottom: 12,
  },
  concernLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#6B7280',
    marginBottom: 4,
  },
  concernText: {
    fontSize: 14,
    color: '#111827',
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ClientsList;