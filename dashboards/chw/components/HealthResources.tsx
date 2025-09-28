import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Clock,
  Plus,
  Search,
  Filter,
  Star,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react-native';
import { HealthResource } from '../index';

interface HealthResourcesProps {
  resources: HealthResource[];
  onResourceSelect: (resource: HealthResource) => void;
  onAddResource: () => void;
}

const HealthResources: React.FC<HealthResourcesProps> = ({ resources, onResourceSelect, onAddResource }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filterOptions = [
    { key: 'all', label: 'All Resources', count: resources.length },
    { key: 'healthcare_provider', label: 'Healthcare', count: resources.filter(r => r.category === 'healthcare_provider').length },
    { key: 'pharmacy', label: 'Pharmacy', count: resources.filter(r => r.category === 'pharmacy').length },
    { key: 'social_service', label: 'Social Services', count: resources.filter(r => r.category === 'social_service').length },
    { key: 'free', label: 'Free Services', count: resources.filter(r => r.cost === 'free').length },
    { key: 'active', label: 'Active', count: resources.filter(r => r.isActive).length },
  ];

  const filteredResources = useMemo(() => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.name.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.services.some(service => service.toLowerCase().includes(query)) ||
        resource.address.toLowerCase().includes(query) ||
        resource.contactPerson.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'healthcare_provider':
        filtered = filtered.filter(r => r.category === 'healthcare_provider');
        break;
      case 'pharmacy':
        filtered = filtered.filter(r => r.category === 'pharmacy');
        break;
      case 'social_service':
        filtered = filtered.filter(r => r.category === 'social_service');
        break;
      case 'free':
        filtered = filtered.filter(r => r.cost === 'free');
        break;
      case 'active':
        filtered = filtered.filter(r => r.isActive);
        break;
    }

    // Sort by rating and name
    return filtered.sort((a, b) => {
      if (a.rating && b.rating) {
        const ratingDiff = b.rating - a.rating;
        if (ratingDiff !== 0) return ratingDiff;
      }
      return a.name.localeCompare(b.name);
    });
  }, [resources, searchQuery, selectedFilter]);

  const getCategoryColor = (category: HealthResource['category']) => {
    const colors: Record<string, string> = {
      healthcare_provider: '#3B82F6',
      pharmacy: '#10B981',
      social_service: '#8B5CF6',
      food_assistance: '#F59E0B',
      transportation: '#06B6D4',
      housing: '#EF4444',
      education: '#84CC16',
      employment: '#F97316',
      legal_aid: '#7C3AED',
    };
    return colors[category] || '#6B7280';
  };

  const getCostColor = (cost: HealthResource['cost']) => {
    switch (cost) {
      case 'free': return '#10B981';
      case 'sliding_scale': return '#F59E0B';
      case 'insurance_accepted': return '#3B82F6';
      case 'private_pay': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderResourceCard = (resource: HealthResource) => {
    return (
      <TouchableOpacity
        key={resource.id}
        style={[styles.resourceCard, !resource.isActive && styles.inactiveCard]}
        onPress={() => onResourceSelect(resource)}
        activeOpacity={0.7}
      >
        <View style={styles.resourceHeader}>
          <View style={styles.resourceTitleRow}>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceName} numberOfLines={2}>{resource.name}</Text>
              <View style={styles.categoryRow}>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(resource.category) + '20' }]}>
                  <Text style={[styles.categoryText, { color: getCategoryColor(resource.category) }]}>
                    {resource.category.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.costBadge, { backgroundColor: getCostColor(resource.cost) + '20' }]}>
                  <DollarSign size={10} color={getCostColor(resource.cost)} />
                  <Text style={[styles.costText, { color: getCostColor(resource.cost) }]}>
                    {resource.cost.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.statusContainer}>
              {resource.isActive ? (
                <CheckCircle size={16} color="#10B981" />
              ) : (
                <AlertCircle size={16} color="#EF4444" />
              )}
              {resource.rating && (
                <View style={styles.rating}>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{resource.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.resourceDescription} numberOfLines={2}>
          {resource.description}
        </Text>

        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.contactText} numberOfLines={1}>{resource.address}</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Phone size={14} color="#64748B" />
            <Text style={styles.contactText}>{resource.phone}</Text>
          </View>
          
          {resource.email && (
            <View style={styles.contactItem}>
              <ExternalLink size={14} color="#64748B" />
              <Text style={styles.contactText}>{resource.email}</Text>
            </View>
          )}

          {resource.website && (
            <View style={styles.contactItem}>
              <Globe size={14} color="#3B82F6" />
              <Text style={[styles.contactText, { color: '#3B82F6' }]} numberOfLines={1}>
                {resource.website}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.operationalInfo}>
          <View style={styles.operationalItem}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.operationalText}>{resource.hours}</Text>
          </View>
          
          <View style={styles.operationalItem}>
            <Users size={14} color="#64748B" />
            <Text style={styles.operationalText}>Contact: {resource.contactPerson}</Text>
          </View>

          <View style={styles.operationalItem}>
            <Clock size={14} color="#F59E0B" />
            <Text style={styles.operationalText}>Wait time: {resource.waitTime}</Text>
          </View>
        </View>

        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>Services:</Text>
          <View style={styles.servicesTags}>
            {resource.services.slice(0, 3).map((service, index) => (
              <View key={`${resource.id}-service-${index}`} style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>{service}</Text>
              </View>
            ))}
            {resource.services.length > 3 && (
              <View style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>+{resource.services.length - 3}</Text>
              </View>
            )}
          </View>
        </View>

        {resource.languages.length > 0 && (
          <View style={styles.languagesContainer}>
            <Text style={styles.languagesTitle}>Languages:</Text>
            <Text style={styles.languagesText} numberOfLines={1}>
              {resource.languages.join(', ')}
            </Text>
          </View>
        )}

        {resource.eligibility.length > 0 && (
          <View style={styles.eligibilityContainer}>
            <Text style={styles.eligibilityTitle}>Eligibility:</Text>
            {resource.eligibility.slice(0, 2).map((criteria, index) => (
              <Text key={`${resource.id}-eligibility-${index}`} style={styles.eligibilityText}>
                • {criteria}
              </Text>
            ))}
            {resource.eligibility.length > 2 && (
              <Text style={styles.moreEligibility}>+{resource.eligibility.length - 2} more criteria</Text>
            )}
          </View>
        )}

        {resource.accessibility.length > 0 && (
          <View style={styles.accessibilityContainer}>
            <Text style={styles.accessibilityTitle}>Accessibility:</Text>
            <View style={styles.accessibilityTags}>
              {resource.accessibility.slice(0, 3).map((feature, index) => (
                <View key={`${resource.id}-accessibility-${index}`} style={styles.accessibilityTag}>
                  <Text style={styles.accessibilityTagText}>{feature}</Text>
                </View>
              ))}
              {resource.accessibility.length > 3 && (
                <View style={styles.accessibilityTag}>
                  <Text style={styles.accessibilityTagText}>+{resource.accessibility.length - 3}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {resource.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText} numberOfLines={2}>{resource.notes}</Text>
          </View>
        )}

        <View style={styles.resourceFooter}>
          <Text style={styles.lastUpdated}>
            Updated: {new Date(resource.lastUpdated).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (filter: typeof filterOptions[0]) => (
    <TouchableOpacity
      key={filter.key}
      style={[
        styles.filterChip,
        selectedFilter === filter.key && styles.filterChipActive
      ]}
      onPress={() => setSelectedFilter(filter.key)}
    >
      <Text style={[
        styles.filterChipText,
        selectedFilter === filter.key && styles.filterChipTextActive
      ]}>
        {filter.label} ({filter.count})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Health Resources</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddResource}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? "#FFFFFF" : "#64748B"} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {filterOptions.map(renderFilterChip)}
          </ScrollView>
        )}
      </View>

      <ScrollView style={styles.resourcesList} showsVerticalScrollIndicator={false}>
        {filteredResources.length > 0 ? (
          <View style={styles.resourcesContainer}>
            {filteredResources.map(renderResourceCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MapPin size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No resources found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Add your first health resource'}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
    backgroundColor: '#06B6D4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  filterButton: {
    backgroundColor: '#F1F5F9',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#06B6D4',
  },
  filtersContainer: {
    marginTop: 8,
  },
  filtersContent: {
    paddingRight: 20,
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#06B6D4',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  resourcesList: {
    flex: 1,
  },
  resourcesContainer: {
    padding: 16,
    gap: 12,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveCard: {
    opacity: 0.6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resourceHeader: {
    marginBottom: 12,
  },
  resourceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resourceInfo: {
    flex: 1,
    marginRight: 12,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  costText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactInfo: {
    gap: 6,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  operationalInfo: {
    gap: 4,
    marginBottom: 12,
  },
  operationalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  operationalText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  servicesContainer: {
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  servicesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceTagText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  languagesContainer: {
    backgroundColor: '#F0F9FF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  languagesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 2,
  },
  languagesText: {
    fontSize: 12,
    color: '#0369A1',
  },
  eligibilityContainer: {
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  eligibilityTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 4,
  },
  eligibilityText: {
    fontSize: 12,
    color: '#D97706',
    lineHeight: 16,
  },
  moreEligibility: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
    marginTop: 2,
  },
  accessibilityContainer: {
    marginBottom: 8,
  },
  accessibilityTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 6,
  },
  accessibilityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  accessibilityTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accessibilityTagText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  notesContainer: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  resourceFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default HealthResources;