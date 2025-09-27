import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  // Helper function to get date range based on selected period
  const getDateRange = (period: 'today' | 'week' | 'month') => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (period) {
      case 'today':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
        };
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
        weekEnd.setHours(23, 59, 59, 999);
        return { start: weekStart, end: weekEnd };
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        return { start: monthStart, end: monthEnd };
      default:
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) };
    }
  };

  // Calculate counseling-specific stats based on selected period
  const counselingStats: CounselingStats = useMemo(() => {
    const counselingCases = assignedCases.filter(c =>
      c.supportServices.includes('counseling')
    );

    const { start: periodStart, end: periodEnd } = getDateRange(selectedPeriod);

    // Filter sessions by selected period based on last update date
    const periodSessions = counselingCases.filter(c => {
      const sessionDate = new Date(c.updatedAt);
      return sessionDate >= periodStart && sessionDate <= periodEnd;
    });

    // Filter completed cases by selected period
    const periodCompletedSessions = counselingCases.filter(c => {
      if (c.status !== 'completed') return false;
      const completedDate = new Date(c.updatedAt);
      return completedDate >= periodStart && completedDate <= periodEnd;
    });

    return {
      totalClients: counselingCases.length, // Always show total
      todaySessions: periodSessions.length,
      activeTreatmentPlans: counselingCases.filter(c =>
        ['assigned', 'in_progress'].includes(c.status)
      ).length, // Always show current active plans
      completedSessions: periodCompletedSessions.length,
      pendingAssessments: counselingCases.filter(c => c.status === 'assigned').length, // Always show current pending
      averageSessionDuration: 60, // Mock data - could be calculated from period data
    };
  }, [assignedCases, selectedPeriod]);

  // Helper functions to get period-specific labels
  const getPeriodLabel = (period: 'today' | 'week' | 'month') => {
    switch (period) {
      case 'today': return "Today's";
      case 'week': return "This Week's";
      case 'month': return "This Month's";
      default: return "Today's";
    }
  };

  const getCompletedLabel = (period: 'today' | 'week' | 'month') => {
    switch (period) {
      case 'today': return "Completed Today";
      case 'week': return "Completed This Week";
      case 'month': return "Completed This Month";
      default: return "Completed Today";
    }
  };

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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Counseling Dashboard</Text>
        <Text style={styles.subtitle}>
          Welcome back! Here&apos;s your counseling practice overview.
        </Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodSelectorContent}
        >
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
        </ScrollView>
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
          title={`${getPeriodLabel(selectedPeriod)} Sessions`}
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
          title={getCompletedLabel(selectedPeriod)}
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
  periodSelector: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    marginBottom: 16,
  },
  periodSelectorContent: {
    alignItems: 'center',
  },
  periodButton: {
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
  periodButtonActive: {
    backgroundColor: '#6A2CB0',
    borderColor: '#6A2CB0',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
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