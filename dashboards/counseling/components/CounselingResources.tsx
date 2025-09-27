import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  Brain,
  FileText,
  Phone,
  Users,
  Heart,
  BookOpen,
  Stethoscope,
  Scale,
  Pill,
  Globe,
  MapPin,
  Clock,
  Star,
  Download,
  ExternalLink,
  Mail,
  Plus,
  AlertCircle,
  Shield,
  GraduationCap,
} from 'lucide-react-native';
import type { CounselingResource } from '../index';

interface CounselingResourcesProps {
  resources: CounselingResource[];
  onResourceSelect?: (resource: CounselingResource) => void;
  onAddResource?: () => void;
}

const CounselingResources: React.FC<CounselingResourcesProps> = ({
  resources,
  onResourceSelect,
  onAddResource
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const resourceCategories = [
    { key: 'all', label: 'All Resources', icon: BookOpen, color: '#6B7280' },
    { key: 'mental_health', label: 'Mental Health Tools', icon: Brain, color: '#8B5CF6' },
    { key: 'assessments', label: 'Assessments & Forms', icon: FileText, color: '#3B82F6' },
    { key: 'crisis', label: 'Crisis Intervention', icon: AlertCircle, color: '#EF4444' },
    { key: 'group_therapy', label: 'Group Therapy', icon: Users, color: '#10B981' },
    { key: 'referrals', label: 'Referral Network', icon: Stethoscope, color: '#F59E0B' },
    { key: 'education', label: 'Educational Materials', icon: GraduationCap, color: '#06B6D4' },
    { key: 'community', label: 'Community Support', icon: Heart, color: '#EC4899' },
    { key: 'professional', label: 'Professional Development', icon: Shield, color: '#84CC16' },
    { key: 'medication', label: 'Medication Resources', icon: Pill, color: '#F97316' },
    { key: 'legal', label: 'Legal & Ethics', icon: Scale, color: '#6366F1' },
  ];

  const resourceTypes = [
    { key: 'all', label: 'All Types' },
    { key: 'form', label: 'Forms' },
    { key: 'guide', label: 'Guides' },
    { key: 'contact', label: 'Contacts' },
    { key: 'website', label: 'Websites' },
    { key: 'document', label: 'Documents' },
    { key: 'assessment', label: 'Assessments' },
    { key: 'hotline', label: 'Hotlines' },
    { key: 'video', label: 'Videos' },
    { key: 'article', label: 'Articles' },
  ];

  const filteredResources = useMemo(() => {
    let filtered = resources.filter(resource => resource.isActive);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (resource.contactPerson && resource.contactPerson.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Sort: featured first, then by rating, then by title
    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.rating && b.rating && a.rating !== b.rating) return b.rating - a.rating;
      return a.title.localeCompare(b.title);
    });
  }, [resources, searchQuery, selectedCategory, selectedType]);

  const getResourceIcon = (type: CounselingResource['type']) => {
    switch (type) {
      case 'form': return FileText;
      case 'guide': return BookOpen;
      case 'contact': return Phone;
      case 'website': return Globe;
      case 'document': return Download;
      case 'assessment': return FileText;
      case 'hotline': return Phone;
      case 'video': return ExternalLink;
      case 'article': return BookOpen;
      default: return FileText;
    }
  };

  const getCostColor = (cost?: CounselingResource['cost']) => {
    switch (cost) {
      case 'free': return '#10B981';
      case 'low_cost': return '#F59E0B';
      case 'insurance': return '#3B82F6';
      case 'paid': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleResourcePress = (resource: CounselingResource) => {
    if (onResourceSelect) {
      onResourceSelect(resource);
    } else {
      // Default behavior - open URL or show contact info
      if (resource.url) {
        Linking.openURL(resource.url);
      } else if (resource.phone) {
        Alert.alert(
          resource.title,
          `Contact: ${resource.phone}${resource.email ? `\nEmail: ${resource.email}` : ''}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Call', onPress: () => Linking.openURL(`tel:${resource.phone}`) },
          ]
        );
      } else {
        Alert.alert('Resource Information', resource.description);
      }
    }
  };

  const ResourceCard: React.FC<{ resource: CounselingResource }> = ({ resource }) => {
    const IconComponent = getResourceIcon(resource.type);
    const categoryInfo = resourceCategories.find(cat => cat.key === resource.category);

    return (
      <TouchableOpacity style={styles.resourceCard} onPress={() => handleResourcePress(resource)}>
        {resource.featured && (
          <View style={styles.featuredBadge}>
            <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.featuredText}>FEATURED</Text>
          </View>
        )}

        <View style={styles.resourceHeader}>
          <View style={styles.resourceIconContainer}>
            <IconComponent size={20} color={categoryInfo?.color || '#6B7280'} />
          </View>
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle} numberOfLines={2}>
              {resource.title}
            </Text>
            <Text style={styles.resourceType}>
              {resourceTypes.find(t => t.key === resource.type)?.label} • {categoryInfo?.label}
            </Text>
          </View>
          {resource.rating && (
            <View style={styles.ratingContainer}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{resource.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.resourceDescription} numberOfLines={3}>
          {resource.description}
        </Text>

        <View style={styles.resourceFooter}>
          <View style={styles.resourceDetails}>
            {resource.cost && (
              <View style={[styles.costBadge, { backgroundColor: getCostColor(resource.cost) + '20' }]}>
                <Text style={[styles.costText, { color: getCostColor(resource.cost) }]}>
                  {resource.cost.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            )}

            {resource.phone && (
              <View style={styles.contactDetail}>
                <Phone size={12} color="#6B7280" />
                <Text style={styles.contactText}>{resource.phone}</Text>
              </View>
            )}

            {resource.address && (
              <View style={styles.contactDetail}>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.contactText} numberOfLines={1}>{resource.address}</Text>
              </View>
            )}

            {resource.hours && (
              <View style={styles.contactDetail}>
                <Clock size={12} color="#6B7280" />
                <Text style={styles.contactText}>{resource.hours}</Text>
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            {resource.url && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => Linking.openURL(resource.url!)}
              >
                <ExternalLink size={16} color="#059669" />
              </TouchableOpacity>
            )}

            {resource.downloadUrl && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => Linking.openURL(resource.downloadUrl!)}
              >
                <Download size={16} color="#059669" />
              </TouchableOpacity>
            )}

            {resource.email && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => Linking.openURL(`mailto:${resource.email}`)}
              >
                <Mail size={16} color="#059669" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {resource.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {resource.tags.slice(0, 3).map((tag, index) => (
              <View key={`${resource.id}-tag-${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {resource.tags.length > 3 && (
              <Text style={styles.moreTags}>+{resource.tags.length - 3}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Counseling Resources</Text>
        <Text style={styles.subtitle}>
          Professional tools and resources for mental health counseling
        </Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
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
        {onAddResource && (
          <TouchableOpacity style={styles.addButton} onPress={onAddResource}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Options */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterSectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {resourceCategories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.filterChip,
                  selectedCategory === category.key && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <category.icon size={16} color={selectedCategory === category.key ? '#FFFFFF' : category.color} />
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category.key && styles.filterChipTextActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterSectionTitle}>Resource Types</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {resourceTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.typeChip,
                  selectedType === type.key && styles.typeChipActive
                ]}
                onPress={() => setSelectedType(type.key)}
              >
                <Text style={[
                  styles.typeChipText,
                  selectedType === type.key && styles.typeChipTextActive
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Resources List */}
      <ScrollView style={styles.resourcesList} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Brain size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No resources found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search criteria' : 'No resources match the selected filters'}
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
    marginBottom: 16,
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
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  addButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#6B7280',
    marginLeft: 6,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  typeChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#6B7280',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  resourcesList: {
    flex: 1,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resourceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
    marginRight: 8,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 4,
  },
  resourceType: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
    marginLeft: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  resourceDetails: {
    flex: 1,
  },
  costBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  costText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  contactDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  moreTags: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic' as const,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
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

export default CounselingResources;