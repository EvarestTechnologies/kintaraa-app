import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowRight, 
  Calendar, 
  User, 
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  ExternalLink
} from 'lucide-react-native';
import { HealthReferral } from '../index';

interface ReferralTrackingProps {
  referrals: HealthReferral[];
  onReferralSelect: (referral: HealthReferral) => void;
  onCreateReferral: () => void;
}

const ReferralTracking: React.FC<ReferralTrackingProps> = ({ referrals, onReferralSelect, onCreateReferral }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filterOptions = [
    { key: 'all', label: 'All Referrals', count: referrals.length },
    { key: 'pending', label: 'Pending', count: referrals.filter(r => r.status === 'pending').length },
    { key: 'scheduled', label: 'Scheduled', count: referrals.filter(r => r.status === 'scheduled').length },
    { key: 'completed', label: 'Completed', count: referrals.filter(r => r.status === 'completed').length },
    { key: 'urgent', label: 'Urgent', count: referrals.filter(r => r.urgency === 'urgent' || r.urgency === 'emergent').length },
    { key: 'primary_care', label: 'Primary Care', count: referrals.filter(r => r.referralType === 'primary_care').length },
  ];

  const filteredReferrals = useMemo(() => {
    let filtered = referrals;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(referral => 
        referral.patientName.toLowerCase().includes(query) ||
        referral.provider.toLowerCase().includes(query) ||
        referral.referralType.toLowerCase().includes(query) ||
        referral.reason.toLowerCase().includes(query) ||
        referral.caseId.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'pending':
        filtered = filtered.filter(r => r.status === 'pending');
        break;
      case 'scheduled':
        filtered = filtered.filter(r => r.status === 'scheduled');
        break;
      case 'completed':
        filtered = filtered.filter(r => r.status === 'completed');
        break;
      case 'urgent':
        filtered = filtered.filter(r => r.urgency === 'urgent' || r.urgency === 'emergent');
        break;
      case 'primary_care':
        filtered = filtered.filter(r => r.referralType === 'primary_care');
        break;
    }

    // Sort by urgency and date
    return filtered.sort((a, b) => {
      const urgencyOrder = { emergent: 4, urgent: 3, routine: 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;
      
      return new Date(b.referralDate).getTime() - new Date(a.referralDate).getTime();
    });
  }, [referrals, searchQuery, selectedFilter]);

  const getStatusColor = (status: HealthReferral['status']) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'scheduled': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'missed': return '#EF4444';
      case 'cancelled': return '#6B7280';
      case 'declined': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: HealthReferral['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'scheduled': return Calendar;
      case 'completed': return CheckCircle;
      case 'missed': return AlertTriangle;
      case 'cancelled': return X;
      case 'declined': return X;
      default: return Clock;
    }
  };

  const getUrgencyColor = (urgency: HealthReferral['urgency']) => {
    switch (urgency) {
      case 'emergent': return '#DC2626';
      case 'urgent': return '#EA580C';
      case 'routine': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getReferralTypeColor = (type: HealthReferral['referralType']) => {
    const colors: Record<string, string> = {
      primary_care: '#3B82F6',
      specialist: '#8B5CF6',
      mental_health: '#7C3AED',
      dental: '#06B6D4',
      vision: '#0284C7',
      pharmacy: '#10B981',
      social_services: '#F59E0B',
      emergency: '#DC2626',
    };
    return colors[type] || '#6B7280';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return date.toLocaleDateString();
  };

  const renderReferralCard = (referral: HealthReferral) => {
    const StatusIcon = getStatusIcon(referral.status);
    
    return (
      <TouchableOpacity
        key={referral.id}
        style={styles.referralCard}
        onPress={() => onReferralSelect(referral)}
        activeOpacity={0.7}
      >
        <View style={styles.referralHeader}>
          <View style={styles.referralTitleRow}>
            <View style={styles.referralInfo}>
              <Text style={styles.patientName}>{referral.patientName}</Text>
              <View style={styles.referralTypeRow}>
                <View style={[styles.typeBadge, { backgroundColor: getReferralTypeColor(referral.referralType) + '20' }]}>
                  <Text style={[styles.typeText, { color: getReferralTypeColor(referral.referralType) }]}>
                    {referral.referralType.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(referral.urgency) + '20' }]}>
                  <Text style={[styles.urgencyText, { color: getUrgencyColor(referral.urgency) }]}>
                    {referral.urgency.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(referral.status) + '20' }]}>
              <StatusIcon size={12} color={getStatusColor(referral.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(referral.status) }]}>
                {referral.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.reason} numberOfLines={2}>
          Reason: {referral.reason}
        </Text>

        <View style={styles.providerContainer}>
          <View style={styles.providerInfo}>
            <ExternalLink size={16} color="#3B82F6" />
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>{referral.provider}</Text>
              <Text style={styles.providerContact}>{referral.providerContact}</Text>
            </View>
          </View>
        </View>

        <View style={styles.referralDetails}>
          <View style={styles.detailItem}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.detailText}>
              Referred: {formatDate(referral.referralDate)}
            </Text>
          </View>
          
          {referral.appointmentDate && (
            <View style={styles.detailItem}>
              <Calendar size={14} color="#3B82F6" />
              <Text style={styles.detailText}>
                Appointment: {formatDate(referral.appointmentDate)} at {new Date(referral.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}

          {referral.followUpDate && (
            <View style={styles.detailItem}>
              <Clock size={14} color="#F59E0B" />
              <Text style={styles.detailText}>
                Follow-up: {formatDate(referral.followUpDate)}
              </Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <User size={14} color="#64748B" />
            <Text style={styles.detailText}>Case ID: {referral.caseId}</Text>
          </View>
        </View>

        {referral.outcome && (
          <View style={styles.outcomeContainer}>
            <Text style={styles.outcomeTitle}>Outcome:</Text>
            <Text style={styles.outcomeText} numberOfLines={2}>{referral.outcome}</Text>
          </View>
        )}

        {referral.barriers && referral.barriers.length > 0 && (
          <View style={styles.barriersContainer}>
            <Text style={styles.barriersTitle}>Barriers:</Text>
            <View style={styles.barriersTags}>
              {referral.barriers.slice(0, 3).map((barrier, index) => (
                <View key={`${referral.id}-barrier-${index}`} style={styles.barrierTag}>
                  <Text style={styles.barrierTagText}>{barrier}</Text>
                </View>
              ))}
              {referral.barriers.length > 3 && (
                <View style={styles.barrierTag}>
                  <Text style={styles.barrierTagText}>+{referral.barriers.length - 3}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {referral.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText} numberOfLines={2}>{referral.notes}</Text>
          </View>
        )}

        <View style={styles.referralFooter}>
          <View style={styles.referralFlow}>
            <Text style={styles.flowText}>CHW</Text>
            <ArrowRight size={16} color="#64748B" />
            <Text style={styles.flowText}>{referral.provider}</Text>
          </View>
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
          <Text style={styles.title}>Referral Tracking</Text>
          <TouchableOpacity style={styles.addButton} onPress={onCreateReferral}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search referrals..."
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

      <ScrollView style={styles.referralsList} showsVerticalScrollIndicator={false}>
        {filteredReferrals.length > 0 ? (
          <View style={styles.referralsContainer}>
            {filteredReferrals.map(renderReferralCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <ArrowRight size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No referrals found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Create your first patient referral'}
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
    backgroundColor: '#F59E0B',
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
    backgroundColor: '#F59E0B',
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
    backgroundColor: '#F59E0B',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  referralsList: {
    flex: 1,
  },
  referralsContainer: {
    padding: 16,
    gap: 12,
  },
  referralCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  referralHeader: {
    marginBottom: 12,
  },
  referralTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  referralInfo: {
    flex: 1,
    marginRight: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  referralTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '600',
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
  reason: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  providerContainer: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  providerContact: {
    fontSize: 12,
    color: '#64748B',
  },
  referralDetails: {
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
  outcomeContainer: {
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  outcomeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
    marginBottom: 4,
  },
  outcomeText: {
    fontSize: 12,
    color: '#15803D',
    lineHeight: 16,
  },
  barriersContainer: {
    marginBottom: 8,
  },
  barriersTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 6,
  },
  barriersTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  barrierTag: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  barrierTagText: {
    fontSize: 12,
    color: '#DC2626',
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
  referralFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
  referralFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  flowText: {
    fontSize: 12,
    color: '#64748B',
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

export default ReferralTracking;