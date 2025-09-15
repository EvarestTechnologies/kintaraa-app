import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { Search, Filter, Plus, MapPin, Phone, Mail, Globe, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react-native';
import { CommunityResource } from '../index';

interface ResourceDirectoryProps {
  resources: CommunityResource[];
  onResourceSelect: (resource: CommunityResource) => void;
  onAddResource: () => void;
}

const ResourceDirectory: React.FC<ResourceDirectoryProps> = ({ resources, onResourceSelect, onAddResource }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
      
      let matchesAvailability = true;
      if (availabilityFilter === 'available') {
        matchesAvailability = resource.currentAvailability > 0;
      } else if (availabilityFilter === 'full') {
        matchesAvailability = resource.currentAvailability === 0;
      } else if (availabilityFilter === 'waitlist') {
        matchesAvailability = resource.waitingList > 0;
      }
      
      return matchesSearch && matchesCategory && matchesAvailability && resource.isActive;
    });
  }, [resources, searchQuery, categoryFilter, availabilityFilter]);

  const getCategoryColor = (category: CommunityResource['category']) => {
    switch (category) {
      case 'housing': return '#3B82F6';
      case 'food': return '#10B981';
      case 'healthcare': return '#EF4444';
      case 'education': return '#8B5CF6';
      case 'employment': return '#F59E0B';
      case 'legal': return '#6B7280';
      case 'childcare': return '#EC4899';
      case 'transportation': return '#06B6D4';
      case 'financial': return '#84CC16';
      case 'emergency': return '#F97316';
      default: return '#64748B';
    }
  };

  const getCategoryIcon = (category: CommunityResource['category']) => {
    switch (category) {
      case 'housing': return '🏠';
      case 'food': return '🍽️';
      case 'healthcare': return '🏥';
      case 'education': return '📚';
      case 'employment': return '💼';
      case 'legal': return '⚖️';
      case 'childcare': return '👶';
      case 'transportation': return '🚗';
      case 'financial': return '💰';
      case 'emergency': return '🚨';
      default: return '📋';
    }
  };

  const getAvailabilityStatus = (resource: CommunityResource) => {
    const availabilityPercentage = (resource.currentAvailability / resource.capacity) * 100;
    
    if (availabilityPercentage === 0) {
      return { status: 'Full', color: '#EF4444', icon: AlertCircle };
    } else if (availabilityPercentage < 25) {
      return { status: 'Limited', color: '#F59E0B', icon: AlertCircle };
    } else {
      return { status: 'Available', color: '#10B981', icon: CheckCircle };
    }
  };

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Housing', value: 'housing' },
    { label: 'Food', value: 'food' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Education', value: 'education' },
    { label: 'Employment', value: 'employment' },
    { label: 'Legal', value: 'legal' },
    { label: 'Childcare', value: 'childcare' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Financial', value: 'financial' },
    { label: 'Emergency', value: 'emergency' },
  ];

  const availabilityOptions = [
    { label: 'All', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Full', value: 'full' },
    { label: 'Has Waitlist', value: 'waitlist' },
  ];

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = (website: string) => {
    Linking.openURL(website);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Resource Directory</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddResource}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Resource</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources, services, or organizations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.filterGroup}>
            <Filter size={16} color="#64748B" />
            <Text style={styles.filterLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {categoryOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterChip,
                    categoryFilter === option.value && styles.filterChipActive
                  ]}
                  onPress={() => setCategoryFilter(option.value)}
                >
                  <Text style={[
                    styles.filterChipText,
                    categoryFilter === option.value && styles.filterChipTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Availability:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {availabilityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterChip,
                    availabilityFilter === option.value && styles.filterChipActive
                  ]}
                  onPress={() => setAvailabilityFilter(option.value)}
                >
                  <Text style={[
                    styles.filterChipText,
                    availabilityFilter === option.value && styles.filterChipTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      <ScrollView style={styles.resourcesList} showsVerticalScrollIndicator={false}>
        {filteredResources.map((resource) => {
          const availability = getAvailabilityStatus(resource);
          const AvailabilityIcon = availability.icon;
          
          return (
            <TouchableOpacity
              key={resource.id}
              style={styles.resourceCard}
              onPress={() => onResourceSelect(resource)}
              activeOpacity={0.7}
            >
              <View style={styles.resourceHeader}>
                <View style={styles.resourceInfo}>
                  <View style={styles.resourceNameRow}>
                    <Text style={styles.categoryIcon}>
                      {getCategoryIcon(resource.category)}
                    </Text>
                    <Text style={styles.resourceName}>{resource.name}</Text>
                  </View>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(resource.category) }]}>
                    <Text style={styles.categoryBadgeText}>
                      {resource.category.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={[styles.availabilityBadge, { backgroundColor: availability.color }]}>
                  <AvailabilityIcon size={12} color="#FFFFFF" />
                  <Text style={styles.availabilityBadgeText}>{availability.status}</Text>
                </View>
              </View>

              <Text style={styles.resourceDescription} numberOfLines={2}>
                {resource.description}
              </Text>

              <View style={styles.resourceDetails}>
                <View style={styles.detailRow}>
                  <MapPin size={14} color="#64748B" />
                  <Text style={styles.detailText} numberOfLines={1}>{resource.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={14} color="#64748B" />
                  <Text style={styles.detailText}>{resource.hours}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Users size={14} color="#64748B" />
                  <Text style={styles.detailText}>
                    Contact: {resource.contactPerson}
                  </Text>
                </View>
              </View>

              <View style={styles.capacitySection}>
                <Text style={styles.capacityTitle}>Capacity & Availability</Text>
                <View style={styles.capacityDetails}>
                  <View style={styles.capacityItem}>
                    <Text style={styles.capacityLabel}>Total Capacity:</Text>
                    <Text style={styles.capacityValue}>{resource.capacity}</Text>
                  </View>
                  <View style={styles.capacityItem}>
                    <Text style={styles.capacityLabel}>Available:</Text>
                    <Text style={[styles.capacityValue, { color: availability.color }]}>
                      {resource.currentAvailability}
                    </Text>
                  </View>
                  {resource.waitingList > 0 && (
                    <View style={styles.capacityItem}>
                      <Text style={styles.capacityLabel}>Waiting List:</Text>
                      <Text style={[styles.capacityValue, { color: '#F59E0B' }]}>
                        {resource.waitingList}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${((resource.capacity - resource.currentAvailability) / resource.capacity) * 100}%`,
                        backgroundColor: availability.color
                      }
                    ]}
                  />
                </View>
              </View>

              <View style={styles.servicesSection}>
                <Text style={styles.servicesTitle}>Services Offered</Text>
                <View style={styles.servicesGrid}>
                  {resource.services.slice(0, 4).map((service, index) => (
                    <View key={index} style={styles.serviceTag}>
                      <Text style={styles.serviceTagText}>{service}</Text>
                    </View>
                  ))}
                  {resource.services.length > 4 && (
                    <View style={styles.serviceTag}>
                      <Text style={styles.serviceTagText}>+{resource.services.length - 4} more</Text>
                    </View>
                  )}
                </View>
              </View>

              {resource.eligibility.length > 0 && (
                <View style={styles.eligibilitySection}>
                  <AlertCircle size={14} color="#3B82F6" />
                  <Text style={styles.eligibilityTitle}>Eligibility Requirements</Text>
                  <Text style={styles.eligibilityText} numberOfLines={2}>
                    {resource.eligibility.join(', ')}
                  </Text>
                </View>
              )}

              <View style={styles.contactSection}>
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleCall(resource.phone)}
                >
                  <Phone size={16} color="#3B82F6" />
                  <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>
                
                {resource.email && (
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => resource.email && handleEmail(resource.email)}
                  >
                    <Mail size={16} color="#3B82F6" />
                    <Text style={styles.contactButtonText}>Email</Text>
                  </TouchableOpacity>
                )}
                
                {resource.website && (
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => resource.website && handleWebsite(resource.website)}
                  >
                    <Globe size={16} color="#3B82F6" />
                    <Text style={styles.contactButtonText}>Website</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.lastUpdated}>
                Last updated: {new Date(resource.lastUpdated).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          );
        })}

        {filteredResources.length === 0 && (
          <View style={styles.emptyState}>
            <MapPin size={48} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>No resources found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || categoryFilter !== 'all' || availabilityFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first resource to get started'
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
  resourcesList: {
    flex: 1,
    padding: 20,
  },
  resourceCard: {
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
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  availabilityBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  resourceDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },
  capacitySection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  capacityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  capacityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  capacityItem: {
    alignItems: 'center',
  },
  capacityLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  capacityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  servicesSection: {
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceTag: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceTagText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  eligibilitySection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    marginBottom: 12,
  },
  eligibilityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  eligibilityText: {
    fontSize: 12,
    color: '#3730A3',
    flex: 1,
    lineHeight: 16,
  },
  contactSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  contactButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
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

export default ResourceDirectory;