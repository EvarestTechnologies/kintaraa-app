import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, Plus, Calendar, DollarSign, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { SocialService } from '../index';

interface ServicesListProps {
  services: SocialService[];
  onServiceSelect: (service: SocialService) => void;
  onAddService: () => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ services, onServiceSelect, onAddService }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           service.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
      const matchesType = typeFilter === 'all' || service.serviceType === typeFilter;
      const matchesPriority = priorityFilter === 'all' || service.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });
  }, [services, searchQuery, statusFilter, typeFilter, priorityFilter]);

  const getStatusColor = (status: SocialService['status']) => {
    switch (status) {
      case 'requested': return '#F59E0B';
      case 'approved': return '#3B82F6';
      case 'in_progress': return '#8B5CF6';
      case 'completed': return '#10B981';
      case 'denied': return '#EF4444';
      case 'cancelled': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: SocialService['priority']) => {
    switch (priority) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#F97316';
      case 'urgent': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getServiceTypeIcon = (type: SocialService['serviceType']) => {
    switch (type) {
      case 'housing': return '🏠';
      case 'food_assistance': return '🍽️';
      case 'financial_aid': return '💰';
      case 'childcare': return '👶';
      case 'transportation': return '🚗';
      case 'job_training': return '💼';
      case 'education': return '📚';
      case 'healthcare_referral': return '🏥';
      case 'legal_aid': return '⚖️';
      case 'counseling_referral': return '🧠';
      case 'emergency_assistance': return '🚨';
      default: return '📋';
    }
  };

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Requested', value: 'requested' },
    { label: 'Approved', value: 'approved' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Denied', value: 'denied' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const typeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Housing', value: 'housing' },
    { label: 'Food Assistance', value: 'food_assistance' },
    { label: 'Financial Aid', value: 'financial_aid' },
    { label: 'Childcare', value: 'childcare' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Job Training', value: 'job_training' },
    { label: 'Education', value: 'education' },
    { label: 'Healthcare', value: 'healthcare_referral' },
    { label: 'Legal Aid', value: 'legal_aid' },
    { label: 'Counseling', value: 'counseling_referral' },
    { label: 'Emergency', value: 'emergency_assistance' },
  ];

  const priorityOptions = [
    { label: 'All Priorities', value: 'all' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Services</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddService}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>New Service</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services, clients, or descriptions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Filter size={16} color="#64748B" />
            <Text style={styles.filterLabel}>Status:</Text>
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
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Type:</Text>
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
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Priority:</Text>
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterChip,
                  priorityFilter === option.value && styles.filterChipActive
                ]}
                onPress={() => setPriorityFilter(option.value)}
              >
                <Text style={[
                  styles.filterChipText,
                  priorityFilter === option.value && styles.filterChipTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.servicesList} showsVerticalScrollIndicator={false}>
        {filteredServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={() => onServiceSelect(service)}
            activeOpacity={0.7}
          >
            <View style={styles.serviceHeader}>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceTypeRow}>
                  <Text style={styles.serviceTypeIcon}>
                    {getServiceTypeIcon(service.serviceType)}
                  </Text>
                  <Text style={styles.serviceType}>
                    {service.serviceType.replace('_', ' ').toUpperCase()}
                  </Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(service.priority) }]}>
                    <Text style={styles.priorityBadgeText}>{service.priority.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.clientName}>{service.clientName}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(service.status) }]}>
                <Text style={styles.statusBadgeText}>
                  {service.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.serviceDescription} numberOfLines={2}>
              {service.description}
            </Text>

            <View style={styles.serviceDetails}>
              <View style={styles.detailRow}>
                <Calendar size={14} color="#64748B" />
                <Text style={styles.detailText}>
                  Requested: {new Date(service.requestDate).toLocaleDateString()}
                </Text>
              </View>
              
              {service.approvalDate && (
                <View style={styles.detailRow}>
                  <CheckCircle size={14} color="#10B981" />
                  <Text style={styles.detailText}>
                    Approved: {new Date(service.approvalDate).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {service.completionDate && (
                <View style={styles.detailRow}>
                  <CheckCircle size={14} color="#8B5CF6" />
                  <Text style={styles.detailText}>
                    Completed: {new Date(service.completionDate).toLocaleDateString()}
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Provider:</Text>
                <Text style={styles.detailText}>{service.provider}</Text>
              </View>

              {service.cost && (
                <View style={styles.detailRow}>
                  <DollarSign size={14} color="#64748B" />
                  <Text style={styles.detailText}>
                    Cost: ${service.cost.toLocaleString()}
                    {service.fundingSource && ` (${service.fundingSource})`}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.documentsSection}>
              <View style={styles.documentsHeader}>
                <FileText size={14} color="#64748B" />
                <Text style={styles.documentsTitle}>Documents</Text>
              </View>
              <View style={styles.documentsProgress}>
                <Text style={styles.documentsText}>
                  {service.documentsSubmitted.length} of {service.documentsRequired.length} submitted
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${(service.documentsSubmitted.length / service.documentsRequired.length) * 100}%`,
                        backgroundColor: service.documentsSubmitted.length === service.documentsRequired.length ? '#10B981' : '#F59E0B'
                      }
                    ]}
                  />
                </View>
              </View>
            </View>

            {service.eligibilityCriteria.length > 0 && (
              <View style={styles.eligibilitySection}>
                <AlertCircle size={14} color="#3B82F6" />
                <Text style={styles.eligibilityText}>
                  Eligibility: {service.eligibilityCriteria.join(', ')}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filteredServices.length === 0 && (
          <View style={styles.emptyState}>
            <FileText size={48} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>No services found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first service request to get started'
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
  filtersContainer: {
    marginBottom: 8,
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
  servicesList: {
    flex: 1,
    padding: 20,
  },
  serviceCard: {
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
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clientName: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 24,
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
  serviceDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceDetails: {
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
  documentsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  documentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  documentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  documentsProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  documentsText: {
    fontSize: 12,
    color: '#64748B',
    minWidth: 120,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  eligibilitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
  },
  eligibilityText: {
    fontSize: 12,
    color: '#1E40AF',
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

export default ServicesList;