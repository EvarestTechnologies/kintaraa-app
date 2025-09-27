import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Home, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react-native';
import { SocialServicesStats } from '../index';

interface DashboardOverviewProps {
  stats: SocialServicesStats;
  onNavigate: (screen: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, onNavigate }) => {
  const quickStats = useMemo(() => [
    {
      title: 'Total Clients',
      value: stats.totalClients.toString(),
      icon: Users,
      color: '#3B82F6',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Services',
      value: stats.activeServices.toString(),
      icon: Home,
      color: '#10B981',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Completed Referrals',
      value: stats.completedReferrals.toString(),
      icon: CheckCircle,
      color: '#8B5CF6',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Assessments',
      value: stats.pendingAssessments.toString(),
      icon: Clock,
      color: '#F59E0B',
      change: '-5%',
      changeType: 'negative' as const,
    },
  ], [stats]);

  const serviceMetrics = useMemo(() => [
    {
      title: 'Community Programs',
      value: stats.communityPrograms.toString(),
      subtitle: 'Active programs',
      color: '#EC4899',
    },
    {
      title: 'Resources Provided',
      value: stats.resourcesProvided.toString(),
      subtitle: 'This month',
      color: '#06B6D4',
    },
    {
      title: 'Avg Service Time',
      value: `${stats.averageServiceTime} days`,
      subtitle: 'From request to completion',
      color: '#84CC16',
    },
    {
      title: 'Client Satisfaction',
      value: `${stats.clientSatisfactionRate}%`,
      subtitle: 'Based on feedback',
      color: '#F97316',
    },
  ], [stats]);

  const quickActions = [
    { title: 'New Client Intake', screen: 'clients', icon: Users, color: '#3B82F6' },
    { title: 'Service Requests', screen: 'services', icon: Home, color: '#10B981' },
    { title: 'Resource Directory', screen: 'resources', icon: DollarSign, color: '#8B5CF6' },
    { title: 'Community Programs', screen: 'outreach', icon: Calendar, color: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Social Services Dashboard</Text>
        <Text style={styles.subtitle}>Comprehensive community support and case management</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                    <IconComponent size={24} color={stat.color} />
                  </View>
                  <View style={[styles.changeIndicator, {
                    backgroundColor: stat.changeType === 'positive' ? '#10B98120' : '#EF444420'
                  }]}>
                    <Text style={[styles.changeText, {
                      color: stat.changeType === 'positive' ? '#10B981' : '#EF4444'
                    }]}>
                      {stat.change}
                    </Text>
                  </View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.metricsSection}>
        <Text style={styles.sectionTitle}>Service Metrics</Text>
        <View style={styles.metricsGrid}>
          {serviceMetrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={[styles.metricIndicator, { backgroundColor: metric.color }]} />
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricTitle}>{metric.title}</Text>
              <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => onNavigate(action.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <IconComponent size={28} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.alertsSection}>
        <View style={styles.alertsHeader}>
          <AlertTriangle size={20} color="#F59E0B" />
          <Text style={styles.alertsTitle}>Priority Alerts</Text>
        </View>
        <View style={styles.alertCard}>
          <Text style={styles.alertText}>
            3 clients require urgent housing assistance
          </Text>
          <TouchableOpacity style={styles.alertAction}>
            <Text style={styles.alertActionText}>Review Cases</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.alertCard}>
          <Text style={styles.alertText}>
            Food bank inventory running low - 2 days remaining
          </Text>
          <TouchableOpacity style={styles.alertAction}>
            <Text style={styles.alertActionText}>Check Inventory</Text>
          </TouchableOpacity>
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
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  statsSection: {
    padding: 20,
    paddingBottom: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
  },
  metricsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  actionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  alertsSection: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  alertCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    marginRight: 12,
  },
  alertAction: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  alertActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DashboardOverview;