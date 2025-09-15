import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, Plus, Phone, Mail, AlertCircle, User, Calendar, MapPin } from 'lucide-react-native';
import { SocialClient } from '../index';

interface ClientsListProps {
  clients: SocialClient[];
  onClientSelect: (client: SocialClient) => void;
  onAddClient: () => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ clients, onClientSelect, onAddClient }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           client.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           client.primaryNeeds.some(need => need.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      const matchesRisk = riskFilter === 'all' || client.riskLevel === riskFilter;
      
      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [clients, searchQuery, statusFilter, riskFilter]);

  const getStatusColor = (status: SocialClient['status']) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'completed': return '#8B5CF6';
      case 'referred': return '#3B82F6';
      case 'on_hold': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getRiskColor = (risk: SocialClient['riskLevel']) => {
    switch (risk) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#F97316';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Referred', value: 'referred' },
    { label: 'On Hold', value: 'on_hold' },
  ];

  const riskOptions = [
    { label: 'All Risk Levels', value: 'all' },
    { label: 'Low Risk', value: 'low' },
    { label: 'Medium Risk', value: 'medium' },
    { label: 'High Risk', value: 'high' },
    { label: 'Critical Risk', value: 'critical' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Clients</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddClient}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Client</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients, case IDs, or needs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.filterGroup}>
            <Filter size={16} color="#64748B" />
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

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Risk:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {riskOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterChip,
                    riskFilter === option.value && styles.filterChipActive
                  ]}
                  onPress={() => setRiskFilter(option.value)}
                >
                  <Text style={[
                    styles.filterChipText,
                    riskFilter === option.value && styles.filterChipTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      <ScrollView style={styles.clientsList} showsVerticalScrollIndicator={false}>
        {filteredClients.map((client) => (
          <TouchableOpacity
            key={client.id}
            style={styles.clientCard}
            onPress={() => onClientSelect(client)}
            activeOpacity={0.7}
          >
            <View style={styles.clientHeader}>
              <View style={styles.clientInfo}>
                <View style={styles.clientNameRow}>
                  <User size={16} color="#64748B" />
                  <Text style={styles.clientName}>{client.name}</Text>
                  <View style={[styles.riskBadge, { backgroundColor: getRiskColor(client.riskLevel) }]}>
                    <Text style={styles.riskBadgeText}>{client.riskLevel.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.caseId}>Case ID: {client.caseId}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(client.status) }]}>
                <Text style={styles.statusBadgeText}>{client.status.replace('_', ' ').toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.clientDetails}>
              <View style={styles.detailRow}>
                <Calendar size={14} color="#64748B" />
                <Text style={styles.detailText}>Age: {client.age} • Family Size: {client.familySize}</Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={14} color="#64748B" />
                <Text style={styles.detailText} numberOfLines={1}>{client.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Primary Needs:</Text>
                <Text style={styles.detailText} numberOfLines={1}>
                  {client.primaryNeeds.join(', ')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Assigned Worker:</Text>
                <Text style={styles.detailText}>{client.assignedWorker}</Text>
              </View>
            </View>

            <View style={styles.clientFooter}>
              <View style={styles.contactInfo}>
                <TouchableOpacity style={styles.contactButton}>
                  <Phone size={16} color="#3B82F6" />
                </TouchableOpacity>
                {client.email && (
                  <TouchableOpacity style={styles.contactButton}>
                    <Mail size={16} color="#3B82F6" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.lastContact}>
                <Text style={styles.lastContactText}>
                  Last Contact: {new Date(client.lastContact).toLocaleDateString()}
                </Text>
                {client.nextAppointment && (
                  <Text style={styles.nextAppointmentText}>
                    Next: {new Date(client.nextAppointment).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>

            {client.vulnerabilities.length > 0 && (
              <View style={styles.vulnerabilitiesSection}>
                <AlertCircle size={14} color="#F59E0B" />
                <Text style={styles.vulnerabilitiesText}>
                  Vulnerabilities: {client.vulnerabilities.join(', ')}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filteredClients.length === 0 && (
          <View style={styles.emptyState}>
            <User size={48} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>No clients found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || statusFilter !== 'all' || riskFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first client to get started'
              }
            </Text>
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
  clientsList: {
    flex: 1,
    padding: 20,
  },
  clientCard: {
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
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 6,
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  caseId: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 22,
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
  clientDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },
  clientFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  contactInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastContact: {
    alignItems: 'flex-end',
  },
  lastContactText: {
    fontSize: 12,
    color: '#64748B',
  },
  nextAppointmentText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  vulnerabilitiesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  vulnerabilitiesText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
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

export default ClientsList;