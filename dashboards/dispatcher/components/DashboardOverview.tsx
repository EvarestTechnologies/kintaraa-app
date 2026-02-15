import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  Bell,
  MapPin,
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useIncidents } from '@/providers/IncidentProvider';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface DispatcherStats {
  totalCases: number;
  newCases: number;
  pendingAssignment: number;
  assignedCases: number;
  inProgressCases: number;
  completedCases: number;
  urgentCases: number;
  responseTime: string;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const { incidents, isLoading, refetch } = useIncidents();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Calculate dispatcher-specific stats
  const stats: DispatcherStats = {
    totalCases: incidents.length,
    newCases: incidents.filter(i => i.status === 'new').length,
    pendingAssignment: incidents.filter(i => i.status === 'new').length,
    assignedCases: incidents.filter(i => i.status === 'assigned').length,
    inProgressCases: incidents.filter(i => i.status === 'in_progress').length,
    completedCases: incidents.filter(i => i.status === 'completed').length,
    urgentCases: incidents.filter(
      i => i.urgencyLevel === 'immediate' || i.urgencyLevel === 'urgent'
    ).length,
    responseTime: '15 min',
  };

  const statCards = [
    {
      id: 'total',
      title: 'Total Cases',
      value: stats.totalCases,
      icon: ClipboardList,
      color: '#6A2CB0',
      gradient: ['#6A2CB0', '#8B5CF6'],
    },
    {
      id: 'new',
      title: 'New Cases',
      value: stats.newCases,
      icon: AlertTriangle,
      color: '#E24B95',
      gradient: ['#E24B95', '#F472B6'],
    },
    {
      id: 'pending',
      title: 'Pending Assignment',
      value: stats.pendingAssignment,
      icon: Clock,
      color: '#FF6B35',
      gradient: ['#FF6B35', '#FB923C'],
    },
    {
      id: 'assigned',
      title: 'Assigned',
      value: stats.assignedCases,
      icon: Users,
      color: '#4ECDC4',
      gradient: ['#4ECDC4', '#67E8F9'],
    },
    {
      id: 'progress',
      title: 'In Progress',
      value: stats.inProgressCases,
      icon: Activity,
      color: '#FFE66D',
      gradient: ['#FFE66D', '#FDE047'],
    },
    {
      id: 'completed',
      title: 'Completed',
      value: stats.completedCases,
      icon: CheckCircle2,
      color: '#95E1D3',
      gradient: ['#95E1D3', '#A7F3D0'],
    },
  ];

  const quickActions = [
    {
      id: 'view-all',
      title: 'View All Cases',
      subtitle: `${stats.totalCases} total cases`,
      icon: LayoutDashboard,
      color: '#6A2CB0',
      onPress: () => router.push('/(dashboard)/dispatcher/cases'),
    },
    {
      id: 'assignments',
      title: 'Manage Assignments',
      subtitle: `${stats.pendingAssignment} pending`,
      icon: Users,
      color: '#E24B95',
      onPress: () => router.push('/(dashboard)/dispatcher/assignments'),
    },
    {
      id: 'urgent',
      title: 'Urgent Cases',
      subtitle: `${stats.urgentCases} require attention`,
      icon: AlertTriangle,
      color: '#FF6B35',
      onPress: () => router.push('/(dashboard)/dispatcher/cases?filter=urgent'),
    },
    {
      id: 'providers',
      title: 'Provider Network',
      subtitle: 'View availability',
      icon: MapPin,
      color: '#4ECDC4',
      onPress: () => router.push('/(dashboard)/dispatcher/providers'),
    },
  ];

  const StatCard = ({ item }: { item: typeof statCards[0] }) => (
    <TouchableOpacity
      style={styles.statCard}
      activeOpacity={0.7}
      onPress={() => {
        if (item.id === 'new' || item.id === 'pending') {
          router.push('/(dashboard)/dispatcher/cases?filter=new');
        } else if (item.id === 'assigned') {
          router.push('/(dashboard)/dispatcher/assignments');
        }
      }}
    >
      <LinearGradient
        colors={item.gradient}
        style={styles.statGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <item.icon size={24} color="#FFFFFF" />
        <Text style={styles.statValue}>{item.value}</Text>
        <Text style={styles.statTitle}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ item }: { item: typeof quickActions[0] }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${item.color}15` }]}>
        <item.icon size={24} color={item.color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{item.title}</Text>
        <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={['#6A2CB0', '#8B5CF6']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{user?.firstName || 'Dispatcher'}</Text>
              <Text style={styles.role}>Dispatch Coordinator</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => {
                // Navigate to notifications
              }}
            >
              <Bell size={24} color="#FFFFFF" />
              {stats.urgentCases > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {stats.urgentCases}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Statistics Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <View style={styles.statsGrid}>
            {statCards.map(item => (
              <StatCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Urgent Alert */}
        {stats.urgentCases > 0 && (
          <View style={styles.urgentAlert}>
            <AlertTriangle size={20} color="#FF6B35" />
            <Text style={styles.urgentAlertText}>
              {stats.urgentCases} urgent case{stats.urgentCases > 1 ? 's' : ''}{' '}
              require immediate attention
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map(item => (
              <QuickActionCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsCard}>
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <TrendingUp size={20} color="#10B981" />
                <Text style={styles.metricLabel}>Avg Response Time</Text>
                <Text style={styles.metricValue}>{stats.responseTime}</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Activity size={20} color="#3B82F6" />
                <Text style={styles.metricLabel}>Active Cases</Text>
                <Text style={styles.metricValue}>
                  {stats.inProgressCases + stats.assignedCases}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notificationBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsSection: {
    marginTop: -20,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 44) / 2,
    aspectRatio: 1.5,
  },
  statGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  urgentAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    gap: 12,
  },
  urgentAlertText: {
    flex: 1,
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  actionsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  metricsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  metricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  metricDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});
