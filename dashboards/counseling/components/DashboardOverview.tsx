import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Users, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import type { CounselingStats } from '../index';

const DashboardOverview: React.FC = () => {
  const { assignedCases } = useProvider();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Calculate counseling-specific stats
  const counselingStats: CounselingStats = useMemo(() => {
    const counselingCases = assignedCases.filter(c => 
      c.supportServices.includes('counseling')
    );
    
    const today = new Date().toDateString();
    const todayCases = counselingCases.filter(c => 
      new Date(c.createdAt).toDateString() === today
    );

    return {
      totalClients: counselingCases.length,
      todaySessions: todayCases.length,
      activeTreatmentPlans: counselingCases.filter(c => 
        ['assigned', 'in_progress'].includes(c.status)
      ).length,
      completedSessions: counselingCases.filter(c => c.status === 'completed').length,
      pendingAssessments: counselingCases.filter(c => c.status === 'assigned').length,
      averageSessionDuration: 60, // Mock data
    };
  }, [assignedCases]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          {icon}
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <TrendingUp size={12} />
            <Text style={styles.trendText}>{trend}</Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const QuickAction: React.FC<{
    title: string;
    icon: React.ReactNode;
    color: string;
    onPress: () => void;
  }> = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Counseling Dashboard</Text>
        <Text style={styles.subtitle}>
          Welcome back! Here&apos;s your counseling practice overview.
        </Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['today', 'week', 'month'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.periodButtonTextActive
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Clients"
          value={counselingStats.totalClients}
          icon={<Users size={20} />}
          color="#3B82F6"
          trend="+12%"
        />
        <StatCard
          title="Today's Sessions"
          value={counselingStats.todaySessions}
          icon={<Calendar size={20} />}
          color="#10B981"
          trend="+5%"
        />
        <StatCard
          title="Active Treatment Plans"
          value={counselingStats.activeTreatmentPlans}
          icon={<FileText size={20} />}
          color="#F59E0B"
        />
        <StatCard
          title="Completed Sessions"
          value={counselingStats.completedSessions}
          icon={<CheckCircle size={20} />}
          color="#8B5CF6"
          trend="+8%"
        />
        <StatCard
          title="Pending Assessments"
          value={counselingStats.pendingAssessments}
          icon={<AlertTriangle size={20} />}
          color="#EF4444"
        />
        <StatCard
          title="Avg Session Duration"
          value={`${counselingStats.averageSessionDuration}min`}
          icon={<Clock size={20} />}
          color="#06B6D4"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            title="New Session"
            icon={<Calendar size={20} />}
            color="#3B82F6"
            onPress={() => console.log('New Session')}
          />
          <QuickAction
            title="Add Client"
            icon={<Users size={20} />}
            color="#10B981"
            onPress={() => console.log('Add Client')}
          />
          <QuickAction
            title="Treatment Plan"
            icon={<FileText size={20} />}
            color="#F59E0B"
            onPress={() => console.log('Treatment Plan')}
          />
          <QuickAction
            title="Progress Notes"
            icon={<Activity size={24} />}
            color="#8B5CF6"
            onPress={() => console.log('Progress Notes')}
          />
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {assignedCases.slice(0, 5).map((incident) => (
            <View key={incident.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Activity size={16} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Session with {incident.caseNumber}
                </Text>
                <Text style={styles.activityTime}>
                  {new Date(incident.updatedAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: incident.status === 'completed' ? '#10B981' : '#F59E0B' }
              ]}>
                <Text style={styles.statusText}>
                  {incident.status === 'completed' ? 'Completed' : 'In Progress'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#111827',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginRight: '2%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 2,
    fontWeight: '500' as const,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginRight: '2%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#111827',
    textAlign: 'center',
  },
  activityList: {
    paddingHorizontal: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
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
});

export default DashboardOverview;