import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Home,
  Building2,
  Users,
  Plus,
  Search,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Phone,
  Calendar,
  Activity,
  Droplets,
  Zap,
  Car,
  TrendingUp,
  UserCheck,
  Baby,
  Clock
} from 'lucide-react-native';
import { CHWLocation, LocationStats } from '../index';

interface LocationManagementProps {
  locations: CHWLocation[];
  stats: LocationStats;
  onLocationSelect: (location: CHWLocation) => void;
  onAddLocation: () => void;
}

const LocationManagement: React.FC<LocationManagementProps> = ({
  locations,
  stats,
  onLocationSelect,
  onAddLocation
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filterOptions = [
    { key: 'all', label: 'All Locations', count: locations.length },
    { key: 'household', label: 'Households', count: locations.filter(l => l.type === 'household').length },
    { key: 'health_facility', label: 'Health Facilities', count: locations.filter(l => l.type === 'health_facility').length },
    { key: 'community_infrastructure', label: 'Community Infrastructure', count: locations.filter(l => l.type === 'community_infrastructure').length },
    { key: 'high_risk', label: 'High Risk', count: locations.filter(l => l.status === 'high_risk').length },
    { key: 'monitoring', label: 'Monitoring', count: locations.filter(l => l.status === 'monitoring').length },
  ];

  const filteredLocations = useMemo(() => {
    let filtered = locations;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query) ||
        location.zone.toLowerCase().includes(query) ||
        location.assignedCHW.toLowerCase().includes(query) ||
        location.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply status/type filter
    switch (selectedFilter) {
      case 'household':
        filtered = filtered.filter(l => l.type === 'household');
        break;
      case 'health_facility':
        filtered = filtered.filter(l => l.type === 'health_facility');
        break;
      case 'community_infrastructure':
        filtered = filtered.filter(l => l.type === 'community_infrastructure');
        break;
      case 'high_risk':
        filtered = filtered.filter(l => l.status === 'high_risk');
        break;
      case 'monitoring':
        filtered = filtered.filter(l => l.status === 'monitoring');
        break;
    }

    // Sort by last updated (most recent first)
    return filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }, [locations, searchQuery, selectedFilter]);

  const getStatusColor = (status: CHWLocation['status']) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'monitoring': return '#F59E0B';
      case 'high_risk': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: CHWLocation['status']) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return Eye;
      case 'monitoring': return Activity;
      case 'high_risk': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getTypeIcon = (type: CHWLocation['type']) => {
    switch (type) {
      case 'household': return Home;
      case 'health_facility': return Building2;
      case 'community_infrastructure': return Users;
      case 'risk_area': return Shield;
      case 'service_point': return MapPin;
      default: return MapPin;
    }
  };

  const getTypeColor = (type: CHWLocation['type']) => {
    const colors: Record<string, string> = {
      household: '#059669',
      health_facility: '#DC2626',
      community_infrastructure: '#3B82F6',
      risk_area: '#EF4444',
      service_point: '#8B5CF6',
    };
    return colors[type] || '#6B7280';
  };

  const renderStatsCard = (title: string, value: string | number, icon: any, color: string, subtitle?: string) => {
    const Icon = icon;
    return (
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Icon color={color} size={20} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    );
  };

  const renderLocationCard = (location: CHWLocation) => {
    const StatusIcon = getStatusIcon(location.status);
    const TypeIcon = getTypeIcon(location.type);

    return (
      <TouchableOpacity
        key={location.id}
        style={styles.locationCard}
        onPress={() => onLocationSelect(location)}
        activeOpacity={0.7}
      >
        <View style={styles.locationHeader}>
          <View style={styles.locationTitleRow}>
            <View style={styles.locationTitle}>
              <View style={[styles.typeIcon, { backgroundColor: getTypeColor(location.type) + '20' }]}>
                <TypeIcon color={getTypeColor(location.type)} size={16} />
              </View>
              <Text style={styles.locationName} numberOfLines={2}>{location.name}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(location.status) + '20' }]}>
              <StatusIcon size={12} color={getStatusColor(location.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(location.status) }]}>
                {location.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.typeRow}>
            <Text style={[styles.typeText, { color: getTypeColor(location.type) }]}>
              {location.type.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.zoneText}>Zone: {location.zone}</Text>
          </View>
        </View>

        <View style={styles.locationDetails}>
          <View style={styles.detailItem}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.detailText} numberOfLines={1}>{location.address}</Text>
          </View>

          <View style={styles.detailItem}>
            <UserCheck size={14} color="#64748B" />
            <Text style={styles.detailText}>CHW: {location.assignedCHW}</Text>
          </View>

          {location.population && (
            <View style={styles.detailItem}>
              <Users size={14} color="#64748B" />
              <Text style={styles.detailText}>
                Population: {location.population.total}
                ({location.population.children} children, {location.population.elderly} elderly)
              </Text>
            </View>
          )}

          {location.contacts?.phone && (
            <View style={styles.detailItem}>
              <Phone size={14} color="#64748B" />
              <Text style={styles.detailText}>{location.contacts.phone}</Text>
            </View>
          )}
        </View>

        {location.healthData && (
          <View style={styles.healthDataContainer}>
            <Text style={styles.healthDataTitle}>Health Indicators:</Text>
            <View style={styles.healthMetrics}>
              <View style={styles.healthMetric}>
                <UserCheck size={12} color="#10B981" />
                <Text style={styles.healthMetricText}>
                  {location.healthData.vaccinationRate}% vaccinated
                </Text>
              </View>
              {location.healthData.lastVisit && (
                <View style={styles.healthMetric}>
                  <Calendar size={12} color="#3B82F6" />
                  <Text style={styles.healthMetricText}>
                    Last visit: {new Date(location.healthData.lastVisit).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {location.facilities && (
          <View style={styles.facilitiesContainer}>
            <Text style={styles.facilitiesTitle}>Facilities:</Text>
            <View style={styles.facilitiesGrid}>
              <View style={[styles.facilityItem, { opacity: location.facilities.waterAccess ? 1 : 0.4 }]}>
                <Droplets size={12} color={location.facilities.waterAccess ? "#3B82F6" : "#9CA3AF"} />
                <Text style={styles.facilityText}>Water</Text>
              </View>
              <View style={[styles.facilityItem, { opacity: location.facilities.electricityAccess ? 1 : 0.4 }]}>
                <Zap size={12} color={location.facilities.electricityAccess ? "#F59E0B" : "#9CA3AF"} />
                <Text style={styles.facilityText}>Power</Text>
              </View>
              <View style={[styles.facilityItem, { opacity: location.facilities.roadAccess !== 'none' ? 1 : 0.4 }]}>
                <Car size={12} color={location.facilities.roadAccess !== 'none' ? "#10B981" : "#9CA3AF"} />
                <Text style={styles.facilityText}>Road</Text>
              </View>
            </View>
          </View>
        )}

        {location.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {location.tags.slice(0, 3).map((tag, index) => (
              <View key={`${location.id}-tag-${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {location.tags.length > 3 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>+{location.tags.length - 3}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.locationFooter}>
          <Text style={styles.lastUpdated}>
            Updated: {new Date(location.lastUpdated).toLocaleDateString()}
          </Text>
          <Text style={styles.category}>{location.category}</Text>
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
          <Text style={styles.title}>Community Locations</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddLocation}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          {renderStatsCard('Total Locations', stats.totalLocations, MapPin, '#8B5CF6')}
          {renderStatsCard('Active Households', stats.activeHouseholds, Home, '#10B981')}
          {renderStatsCard('Total Population', stats.totalPopulation, Users, '#3B82F6')}
          {renderStatsCard('Health Facilities', stats.healthFacilities, Building2, '#DC2626')}
        </View>

        <View style={styles.secondaryStats}>
          {renderStatsCard('High Risk Areas', stats.highRiskAreas, AlertTriangle, '#EF4444')}
          {renderStatsCard('Recent Visits', stats.recentVisits, Calendar, '#059669')}
          {renderStatsCard('Vaccination Rate', `${stats.vaccinationCoverage}%`, TrendingUp, '#F59E0B')}
          {renderStatsCard('Pending Visits', stats.pendingVisits, Clock, '#6366F1')}
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
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

      <ScrollView style={styles.locationsList} showsVerticalScrollIndicator={false}>
        {filteredLocations.length > 0 ? (
          <View style={styles.locationsContainer}>
            {filteredLocations.map(renderLocationCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MapPin size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No locations found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Add your first community location to get started'}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#059669',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  secondaryStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
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
    backgroundColor: '#059669',
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
    backgroundColor: '#059669',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  locationsList: {
    flex: 1,
  },
  locationsContainer: {
    padding: 16,
    gap: 12,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    marginBottom: 12,
  },
  locationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  locationTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  zoneText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  locationDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  healthDataContainer: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    marginBottom: 12,
  },
  healthDataTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  healthMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  healthMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  healthMetricText: {
    fontSize: 12,
    color: '#64748B',
  },
  facilitiesContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  facilitiesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  facilityText: {
    fontSize: 12,
    color: '#64748B',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '500',
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#94A3B8',
  },
  category: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
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

export default LocationManagement;