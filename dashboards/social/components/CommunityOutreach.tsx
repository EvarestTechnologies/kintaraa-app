import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, Plus, Calendar, MapPin, Users, Target, Star, Clock, CheckCircle, AlertCircle } from 'lucide-react-native';
import { CommunityProgram } from '../index';

interface CommunityOutreachProps {
  programs: CommunityProgram[];
  onProgramSelect: (program: CommunityProgram) => void;
  onAddProgram: () => void;
}

const CommunityOutreach: React.FC<CommunityOutreachProps> = ({ programs, onProgramSelect, onAddProgram }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           program.facilitator.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'all' || program.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [programs, searchQuery, typeFilter, statusFilter]);

  const getStatusColor = (status: CommunityProgram['status']) => {
    switch (status) {
      case 'planning': return '#6B7280';
      case 'active': return '#10B981';
      case 'completed': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      case 'on_hold': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getProgramTypeIcon = (type: CommunityProgram['type']) => {
    switch (type) {
      case 'workshop': return '🛠️';
      case 'support_group': return '🤝';
      case 'training': return '📚';
      case 'outreach': return '📢';
      case 'awareness': return '💡';
      case 'prevention': return '🛡️';
      default: return '📋';
    }
  };

  const getEnrollmentStatus = (program: CommunityProgram) => {
    const enrollmentPercentage = (program.enrolled / program.capacity) * 100;
    
    if (enrollmentPercentage >= 100) {
      return { status: 'Full', color: '#EF4444', icon: AlertCircle };
    } else if (enrollmentPercentage >= 80) {
      return { status: 'Almost Full', color: '#F59E0B', icon: AlertCircle };
    } else {
      return { status: 'Open', color: '#10B981', icon: CheckCircle };
    }
  };

  const typeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Workshop', value: 'workshop' },
    { label: 'Support Group', value: 'support_group' },
    { label: 'Training', value: 'training' },
    { label: 'Outreach', value: 'outreach' },
    { label: 'Awareness', value: 'awareness' },
    { label: 'Prevention', value: 'prevention' },
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Planning', value: 'planning' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'On Hold', value: 'on_hold' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Community Outreach</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddProgram}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>New Program</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search programs, facilitators, or descriptions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.filterGroup}>
            <Filter size={16} color="#64748B" />
            <Text style={styles.filterLabel}>Type:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
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
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
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
        </View>
      </View>

      <ScrollView style={styles.programsList} showsVerticalScrollIndicator={false}>
        {filteredPrograms.map((program) => {
          const enrollment = getEnrollmentStatus(program);
          const EnrollmentIcon = enrollment.icon;
          
          return (
            <TouchableOpacity
              key={program.id}
              style={styles.programCard}
              onPress={() => onProgramSelect(program)}
              activeOpacity={0.7}
            >
              <View style={styles.programHeader}>
                <View style={styles.programInfo}>
                  <View style={styles.programNameRow}>
                    <Text style={styles.programTypeIcon}>
                      {getProgramTypeIcon(program.type)}
                    </Text>
                    <Text style={styles.programName}>{program.name}</Text>
                  </View>
                  <Text style={styles.programType}>
                    {program.type.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(program.status) }]}>
                    <Text style={styles.statusBadgeText}>
                      {program.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.enrollmentBadge, { backgroundColor: enrollment.color }]}>
                    <EnrollmentIcon size={12} color="#FFFFFF" />
                    <Text style={styles.enrollmentBadgeText}>{enrollment.status}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.programDescription} numberOfLines={2}>
                {program.description}
              </Text>

              <View style={styles.programDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={14} color="#64748B" />
                  <Text style={styles.detailText}>
                    Start: {new Date(program.startDate).toLocaleDateString()}
                    {program.endDate && ` - ${new Date(program.endDate).toLocaleDateString()}`}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={14} color="#64748B" />
                  <Text style={styles.detailText}>Schedule: {program.schedule}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={14} color="#64748B" />
                  <Text style={styles.detailText} numberOfLines={1}>{program.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Users size={14} color="#64748B" />
                  <Text style={styles.detailText}>Facilitator: {program.facilitator}</Text>
                </View>
              </View>

              <View style={styles.enrollmentSection}>
                <Text style={styles.enrollmentTitle}>Enrollment</Text>
                <View style={styles.enrollmentDetails}>
                  <View style={styles.enrollmentItem}>
                    <Text style={styles.enrollmentLabel}>Enrolled:</Text>
                    <Text style={styles.enrollmentValue}>{program.enrolled}</Text>
                  </View>
                  <View style={styles.enrollmentItem}>
                    <Text style={styles.enrollmentLabel}>Capacity:</Text>
                    <Text style={styles.enrollmentValue}>{program.capacity}</Text>
                  </View>
                  <View style={styles.enrollmentItem}>
                    <Text style={styles.enrollmentLabel}>Available:</Text>
                    <Text style={[styles.enrollmentValue, { color: enrollment.color }]}>
                      {program.capacity - program.enrolled}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${(program.enrolled / program.capacity) * 100}%`,
                        backgroundColor: enrollment.color
                      }
                    ]}
                  />
                </View>
              </View>

              <View style={styles.targetAudienceSection}>
                <Text style={styles.targetAudienceTitle}>Target Audience</Text>
                <View style={styles.audienceGrid}>
                  {program.targetAudience.slice(0, 3).map((audience, index) => (
                    <View key={`${program.id}-audience-${index}`} style={styles.audienceTag}>
                      <Text style={styles.audienceTagText}>{audience}</Text>
                    </View>
                  ))}
                  {program.targetAudience.length > 3 && (
                    <View style={styles.audienceTag}>
                      <Text style={styles.audienceTagText}>+{program.targetAudience.length - 3} more</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.objectivesSection}>
                <Target size={14} color="#8B5CF6" />
                <Text style={styles.objectivesTitle}>
                  {program.objectives.length} Objectives
                </Text>
                <Text style={styles.objectivesPreview} numberOfLines={2}>
                  {program.objectives.join(', ')}
                </Text>
              </View>

              {program.feedback && (
                <View style={styles.feedbackSection}>
                  <View style={styles.feedbackHeader}>
                    <Star size={14} color="#F59E0B" />
                    <Text style={styles.feedbackTitle}>Program Feedback</Text>
                  </View>
                  <View style={styles.feedbackDetails}>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingValue}>{program.feedback.rating.toFixed(1)}</Text>
                      <Text style={styles.ratingLabel}>/ 5.0</Text>
                    </View>
                    <Text style={styles.feedbackComments}>
                      {program.feedback.comments.length} comments received
                    </Text>
                  </View>
                </View>
              )}

              {program.outcomes && program.outcomes.length > 0 && (
                <View style={styles.outcomesSection}>
                  <CheckCircle size={14} color="#10B981" />
                  <Text style={styles.outcomesTitle}>Program Outcomes</Text>
                  <Text style={styles.outcomesText} numberOfLines={2}>
                    {program.outcomes.join(', ')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {filteredPrograms.length === 0 && (
          <View style={styles.emptyState}>
            <Users size={48} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>No programs found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first community program to get started'
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
  programsList: {
    flex: 1,
    padding: 20,
  },
  programCard: {
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
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  programInfo: {
    flex: 1,
  },
  programNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  programTypeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  programName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  programType: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  enrollmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  enrollmentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  programDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  programDetails: {
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
  enrollmentSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  enrollmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  enrollmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  enrollmentItem: {
    alignItems: 'center',
  },
  enrollmentLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  enrollmentValue: {
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
  targetAudienceSection: {
    marginBottom: 12,
  },
  targetAudienceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  audienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  audienceTag: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  audienceTagText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '500',
  },
  objectivesSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    marginBottom: 12,
  },
  objectivesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  objectivesPreview: {
    fontSize: 12,
    color: '#6B46C1',
    flex: 1,
    lineHeight: 16,
  },
  feedbackSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
  },
  feedbackDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#A16207',
    marginLeft: 2,
  },
  feedbackComments: {
    fontSize: 12,
    color: '#A16207',
  },
  outcomesSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
  },
  outcomesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 4,
  },
  outcomesText: {
    fontSize: 12,
    color: '#047857',
    flex: 1,
    lineHeight: 16,
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

export default CommunityOutreach;