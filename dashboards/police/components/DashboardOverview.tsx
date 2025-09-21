import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, FileText, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react-native';
import type { PoliceStats } from '../index';

const mockPoliceStats: PoliceStats = {
  totalCases: 156,
  activeCases: 23,
  evidenceItems: 89,
  reportsGenerated: 45,
  casesResolved: 12,
  averageResponseTime: 8.5
};

const DashboardOverview: React.FC = () => {
  const stats = mockPoliceStats;

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          {icon}
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  const QuickAction: React.FC<{
    title: string;
    icon: React.ReactNode;
    color: string;
    onPress: () => void;
  }> = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Police Dashboard</Text>
        <Text style={styles.subtitle}>Case Management & Evidence Tracking</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon={<Shield color="#3B82F6" />}
          color="#3B82F6"
        />
        <StatCard
          title="Active Cases"
          value={stats.activeCases}
          icon={<Search color="#F59E0B" />}
          color="#F59E0B"
        />
        <StatCard
          title="Evidence Items"
          value={stats.evidenceItems}
          icon={<FileText color="#8B5CF6" />}
          color="#8B5CF6"
        />
        <StatCard
          title="Reports Generated"
          value={stats.reportsGenerated}
          icon={<FileText color="#10B981" />}
          color="#10B981"
          subtitle="This month"
        />
        <StatCard
          title="Cases Resolved"
          value={stats.casesResolved}
          icon={<CheckCircle color="#059669" />}
          color="#059669"
          subtitle="This month"
        />
        <StatCard
          title="Avg Response Time"
          value={`${stats.averageResponseTime} min`}
          icon={<Clock color="#DC2626" />}
          color="#DC2626"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            title="New Case"
            icon={<Shield color="white" />}
            color="#3B82F6"
            onPress={() => console.log('New Case')}
          />
          <QuickAction
            title="Add Evidence"
            icon={<FileText color="white" />}
            color="#8B5CF6"
            onPress={() => console.log('Add Evidence')}
          />
          <QuickAction
            title="Generate Report"
            icon={<FileText color="white" />}
            color="#10B981"
            onPress={() => console.log('Generate Report')}
          />
          <QuickAction
            title="Emergency Alert"
            icon={<AlertTriangle color="white" />}
            color="#DC2626"
            onPress={() => console.log('Emergency Alert')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#3B82F620' }]}>
              <Shield color="#3B82F6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New case assigned: DV-2025-001</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#8B5CF620' }]}>
              <FileText color="#8B5CF6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Evidence collected for case SA-2025-003</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#10B98120' }]}>
              <CheckCircle color="#10B981" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Case closed: HR-2025-002</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  statsGrid: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1E293B',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500' as const,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  section: {
    padding: 16,
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1E293B',
    textAlign: 'center',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#1E293B',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default DashboardOverview;