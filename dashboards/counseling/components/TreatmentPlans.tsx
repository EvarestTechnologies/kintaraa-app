import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FileText, Target, Calendar, CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import type { TreatmentPlan } from '../index';

const TreatmentPlans: React.FC = () => {
  const { assignedCases } = useProvider();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed' | 'on_hold'>('all');

  // Convert incidents to treatment plans
  const treatmentPlans: TreatmentPlan[] = useMemo(() => {
    return assignedCases
      .filter(c => c.supportServices.includes('counseling'))
      .map((incident, index) => ({
        id: `plan-${incident.id}`,
        clientId: incident.id,
        clientName: `Client ${incident.caseNumber}`,
        diagnosis: incident.type === 'physical' ? 'Post-Traumatic Stress Disorder (PTSD)' :
                  incident.type === 'emotional' ? 'Major Depressive Disorder with Anxiety' :
                  incident.type === 'sexual' ? 'Complex PTSD with Dissociative Features' :
                  incident.type === 'economic' ? 'Adjustment Disorder with Anxiety' :
                  'Acute Stress Reaction',
        goals: [
          {
            id: `goal-1-${incident.id}`,
            description: 'Reduce trauma-related symptoms and improve emotional regulation',
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: incident.status === 'completed' ? 'completed' : 'in_progress',
            progress: incident.status === 'completed' ? 100 : 65 + (index % 30)
          },
          {
            id: `goal-2-${incident.id}`,
            description: 'Develop healthy coping strategies and support systems',
            targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: incident.status === 'completed' ? 'completed' : 'in_progress',
            progress: incident.status === 'completed' ? 100 : 45 + (index % 40)
          },
          {
            id: `goal-3-${incident.id}`,
            description: 'Improve interpersonal relationships and communication skills',
            targetDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: incident.status === 'completed' ? 'completed' : 
                   incident.status === 'in_progress' ? 'in_progress' : 'not_started',
            progress: incident.status === 'completed' ? 100 : 
                     incident.status === 'in_progress' ? 25 + (index % 35) : 0
          }
        ],
        interventions: [
          'Cognitive Behavioral Therapy (CBT)',
          'Trauma-Focused Therapy',
          'Mindfulness-Based Stress Reduction',
          'Group Therapy Sessions'
        ],
        frequency: 'Weekly sessions (60 minutes)',
        duration: '6-12 months',
        createdDate: incident.createdAt.split('T')[0],
        lastUpdated: incident.updatedAt.split('T')[0],
        status: incident.status === 'completed' ? 'completed' :
                incident.status === 'in_progress' ? 'active' :
                incident.status === 'assigned' ? 'active' : 'on_hold',
        caseId: incident.caseNumber
      }));
  }, [assignedCases]);

  // Filter treatment plans
  const filteredPlans = useMemo(() => {
    if (selectedFilter === 'all') return treatmentPlans;
    return treatmentPlans.filter(plan => plan.status === selectedFilter);
  }, [treatmentPlans, selectedFilter]);

  const getStatusColor = (status: TreatmentPlan['status']) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'completed': return '#8B5CF6';
      case 'on_hold': return '#F59E0B';
      case 'discontinued': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getGoalStatusColor = (status: TreatmentPlan['goals'][0]['status']) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#3B82F6';
      case 'on_hold': return '#F59E0B';
      case 'not_started': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 60) return '#3B82F6';
    if (progress >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const TreatmentPlanCard: React.FC<{ plan: TreatmentPlan }> = ({ plan }) => {
    const overallProgress = Math.round(
      plan.goals.reduce((sum, goal) => sum + goal.progress, 0) / plan.goals.length
    );

    return (
      <TouchableOpacity style={styles.planCard}>
        <View style={styles.planHeader}>
          <View style={styles.planInfo}>
            <Text style={styles.clientName}>{plan.clientName}</Text>
            <Text style={styles.caseId}>{plan.caseId}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(plan.status) }]}>
            <Text style={styles.statusText}>
              {plan.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.diagnosisContainer}>
          <Text style={styles.diagnosisLabel}>Diagnosis:</Text>
          <Text style={styles.diagnosisText}>{plan.diagnosis}</Text>
        </View>

        <View style={styles.progressOverview}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={[styles.progressPercentage, { color: getProgressColor(overallProgress) }]}>
              {overallProgress}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${overallProgress}%`,
                  backgroundColor: getProgressColor(overallProgress)
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Treatment Goals</Text>
          {plan.goals.slice(0, 2).map((goal) => (
            <View key={goal.id} style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <View style={styles.goalStatus}>
                  <View style={[
                    styles.goalStatusDot, 
                    { backgroundColor: getGoalStatusColor(goal.status) }
                  ]} />
                  <Text style={styles.goalStatusText}>
                    {goal.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.goalProgress}>{goal.progress}%</Text>
              </View>
              <Text style={styles.goalDescription} numberOfLines={2}>
                {goal.description}
              </Text>
              <View style={styles.goalFooter}>
                <View style={styles.goalDate}>
                  <Calendar size={12} color="#6B7280" />
                  <Text style={styles.goalDateText}>
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          {plan.goals.length > 2 && (
            <Text style={styles.moreGoals}>+{plan.goals.length - 2} more goals</Text>
          )}
        </View>

        <View style={styles.interventionsSection}>
          <Text style={styles.sectionTitle}>Interventions</Text>
          <View style={styles.interventionsList}>
            {plan.interventions.slice(0, 3).map((intervention, index) => (
              <View key={`${plan.id}-intervention-${index}`} style={styles.interventionItem}>
                <CheckCircle size={12} color="#10B981" />
                <Text style={styles.interventionText}>{intervention}</Text>
              </View>
            ))}
            {plan.interventions.length > 3 && (
              <Text style={styles.moreInterventions}>
                +{plan.interventions.length - 3} more interventions
              </Text>
            )}
          </View>
        </View>

        <View style={styles.planFooter}>
          <View style={styles.planDetail}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.planDetailText}>{plan.frequency}</Text>
          </View>
          <View style={styles.planDetail}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.planDetailText}>Duration: {plan.duration}</Text>
          </View>
        </View>

        <View style={styles.planMeta}>
          <Text style={styles.planMetaText}>
            Created: {new Date(plan.createdDate).toLocaleDateString()}
          </Text>
          <Text style={styles.planMetaText}>
            Updated: {new Date(plan.lastUpdated).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Treatment Plans</Text>
        <Text style={styles.subtitle}>
          Monitor and manage client treatment plans and progress
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
        {[
          { key: 'all', label: 'All Plans', count: treatmentPlans.length },
          { key: 'active', label: 'Active', count: treatmentPlans.filter(p => p.status === 'active').length },
          { key: 'completed', label: 'Completed', count: treatmentPlans.filter(p => p.status === 'completed').length },
          { key: 'on_hold', label: 'On Hold', count: treatmentPlans.filter(p => p.status === 'on_hold').length },
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

      {/* Treatment Plans List */}
      <ScrollView style={styles.plansList} showsVerticalScrollIndicator={false}>
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <TreatmentPlanCard key={plan.id} plan={plan} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <FileText size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No treatment plans found</Text>
            <Text style={styles.emptySubtitle}>
              No treatment plans match the selected filter
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
  filterTabs: {
    paddingHorizontal: 20,
    paddingBottom: 0,
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
  plansList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 4,
  },
  caseId: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#FFFFFF',
  },
  diagnosisContainer: {
    marginBottom: 16,
  },
  diagnosisLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#6B7280',
    marginBottom: 4,
  },
  diagnosisText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500' as const,
  },
  progressOverview: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#111827',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 12,
  },
  goalItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  goalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  goalStatusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#6B7280',
  },
  goalProgress: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#111827',
  },
  goalDescription: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
    lineHeight: 20,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalDateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  moreGoals: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic' as const,
    textAlign: 'center',
    marginTop: 8,
  },
  interventionsSection: {
    marginBottom: 16,
  },
  interventionsList: {
    marginTop: 8,
  },
  interventionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  interventionText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  moreInterventions: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic' as const,
    marginTop: 4,
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  planDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  planMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  planMetaText: {
    fontSize: 12,
    color: '#9CA3AF',
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

export default TreatmentPlans;