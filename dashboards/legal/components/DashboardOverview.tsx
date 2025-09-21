import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Scale,
  FileText,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Users,
} from 'lucide-react-native';
import type { LegalStats } from '../index';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  onPress?: () => void;
}

function StatCard({ title, value, icon, color, subtitle, onPress }: StatCardProps) {
  return (
    <TouchableOpacity
      style={[styles.statCard, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {React.cloneElement(icon as React.ReactElement<any>, {
          size: 24,
          color: color,
        })}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
}

interface QuickActionProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

function QuickAction({ title, icon, color, onPress }: QuickActionProps) {
  return (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        {React.cloneElement(icon as React.ReactElement<any>, {
          size: 20,
          color: color,
        })}
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function DashboardOverview() {
  // Mock legal statistics
  const stats: LegalStats = {
    totalCases: 45,
    activeCases: 23,
    upcomingHearings: 8,
    documentsReview: 12,
    casesWon: 38,
    averageCaseDuration: 4.2,
  };

  const handleStatPress = (statType: string) => {
    console.log(`Navigating to ${statType} details`);
  };

  const handleQuickAction = (action: string) => {
    console.log(`Executing quick action: ${action}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Legal Dashboard</Text>
        <Text style={styles.subtitleText}>Manage cases, documents, and court schedules</Text>
      </View>

      {/* Statistics Grid */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon={<Scale />}
          color="#3B82F6"
          subtitle="All time"
          onPress={() => handleStatPress('total-cases')}
        />
        <StatCard
          title="Active Cases"
          value={stats.activeCases}
          icon={<FileText />}
          color="#10B981"
          subtitle="In progress"
          onPress={() => handleStatPress('active-cases')}
        />
        <StatCard
          title="Upcoming Hearings"
          value={stats.upcomingHearings}
          icon={<Calendar />}
          color="#F59E0B"
          subtitle="This month"
          onPress={() => handleStatPress('hearings')}
        />
        <StatCard
          title="Documents Review"
          value={stats.documentsReview}
          icon={<AlertTriangle />}
          color="#EF4444"
          subtitle="Pending"
          onPress={() => handleStatPress('documents')}
        />
        <StatCard
          title="Cases Won"
          value={stats.casesWon}
          icon={<CheckCircle />}
          color="#8B5CF6"
          subtitle="Success rate: 84%"
          onPress={() => handleStatPress('cases-won')}
        />
        <StatCard
          title="Avg Duration"
          value={`${stats.averageCaseDuration} mo`}
          icon={<Clock />}
          color="#06B6D4"
          subtitle="Per case"
          onPress={() => handleStatPress('duration')}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            title="New Case"
            icon={<FileText />}
            color="#3B82F6"
            onPress={() => handleQuickAction('new-case')}
          />
          <QuickAction
            title="Schedule Hearing"
            icon={<Calendar />}
            color="#10B981"
            onPress={() => handleQuickAction('schedule-hearing')}
          />
          <QuickAction
            title="Upload Document"
            icon={<FileText />}
            color="#F59E0B"
            onPress={() => handleQuickAction('upload-document')}
          />
          <QuickAction
            title="Client Meeting"
            icon={<Users />}
            color="#8B5CF6"
            onPress={() => handleQuickAction('client-meeting')}
          />
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#10B981' + '20' }]}>
              <CheckCircle size={16} color="#10B981" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Case #2024-001 hearing completed</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#3B82F6' + '20' }]}>
              <FileText size={16} color="#3B82F6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New document uploaded for Sarah Johnson</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#F59E0B' + '20' }]}>
              <Calendar size={16} color="#F59E0B" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Hearing scheduled for next week</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Performance Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.metricTitle}>Success Rate</Text>
            </View>
            <Text style={styles.metricValue}>84%</Text>
            <Text style={styles.metricSubtext}>+5% from last month</Text>
          </View>
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Clock size={20} color="#3B82F6" />
              <Text style={styles.metricTitle}>Avg Response Time</Text>
            </View>
            <Text style={styles.metricValue}>2.3 hrs</Text>
            <Text style={styles.metricSubtext}>-30 min improvement</Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#64748B',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 15,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 60) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    color: '#374151',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#6B7280',
    marginLeft: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 12,
    color: '#10B981',
  },
});