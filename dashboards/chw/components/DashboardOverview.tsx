import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Heart, 
  BookOpen, 
  MapPin, 
  Clock,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Stethoscope
} from 'lucide-react-native';
import { CHWStats } from '../index';

interface DashboardOverviewProps {
  stats: CHWStats;
  onNavigate: (section: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, onNavigate }) => {
  const quickStats = useMemo(() => [
    {
      title: 'Total Patients',
      value: stats.totalPatients.toString(),
      icon: Users,
      color: '#3B82F6',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Patients',
      value: stats.activePatients.toString(),
      icon: UserCheck,
      color: '#10B981',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Screenings Done',
      value: stats.completedScreenings.toString(),
      icon: Stethoscope,
      color: '#8B5CF6',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Referrals',
      value: stats.pendingReferrals.toString(),
      icon: AlertCircle,
      color: '#F59E0B',
      change: '-5%',
      changeType: 'negative' as const,
    },
  ], [stats]);

  const activityStats = useMemo(() => [
    {
      title: 'Education Sessions',
      value: stats.educationSessions.toString(),
      icon: BookOpen,
      color: '#06B6D4',
    },
    {
      title: 'Community Events',
      value: stats.communityEvents.toString(),
      icon: MapPin,
      color: '#84CC16',
    },
    {
      title: 'Avg Follow-up Time',
      value: `${stats.averageFollowUpTime}h`,
      icon: Clock,
      color: '#EF4444',
    },
    {
      title: 'Patient Satisfaction',
      value: `${stats.patientSatisfactionRate}%`,
      icon: Heart,
      color: '#EC4899',
    },
  ], [stats]);

  const quickActions = [
    {
      title: 'Schedule Screening',
      description: 'Book health screenings for patients',
      icon: Activity,
      color: '#3B82F6',
      action: () => onNavigate('screenings'),
    },
    {
      title: 'Plan Education Session',
      description: 'Create health education programs',
      icon: BookOpen,
      color: '#10B981',
      action: () => onNavigate('education'),
    },
    {
      title: 'Community Outreach',
      description: 'Organize community health events',
      icon: MapPin,
      color: '#8B5CF6',
      action: () => onNavigate('outreach'),
    },
    {
      title: 'Track Referrals',
      description: 'Monitor patient referral status',
      icon: TrendingUp,
      color: '#F59E0B',
      action: () => onNavigate('referrals'),
    },
  ];

  const renderStatCard = (stat: typeof quickStats[0], index: number) => (
    <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
      <View style={styles.statHeader}>
        <stat.icon size={24} color={stat.color} />
        <View style={[styles.changeIndicator, { 
          backgroundColor: stat.changeType === 'positive' ? '#DCFCE7' : '#FEF2F2' 
        }]}>
          <Text style={[styles.changeText, { 
            color: stat.changeType === 'positive' ? '#16A34A' : '#DC2626' 
          }]}>
            {stat.change}
          </Text>
        </View>
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statTitle}>{stat.title}</Text>
    </View>
  );

  const renderActivityCard = (activity: typeof activityStats[0], index: number) => (
    <View key={index} style={styles.activityCard}>
      <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
        <activity.icon size={20} color={activity.color} />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityValue}>{activity.value}</Text>
        <Text style={styles.activityTitle}>{activity.title}</Text>
      </View>
    </View>
  );

  const renderQuickAction = (action: typeof quickActions[0], index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.actionCard}
      onPress={action.action}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
        <action.icon size={24} color={action.color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionDescription}>{action.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>CHW Dashboard</Text>
        <Text style={styles.subtitle}>Community Health Worker Overview</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.statsGrid}>
          {quickStats.map(renderStatCard)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Summary</Text>
        <View style={styles.activityGrid}>
          {activityStats.map(renderActivityCard)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map(renderQuickAction)}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <AlertCircle size={20} color="#F59E0B" />
            <Text style={styles.alertTitle}>Today&apos;s Priorities</Text>
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.alertText}>Follow up with 3 high-risk patients</Text>
            </View>
            <View style={styles.alertItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.alertText}>Diabetes education session at 2 PM</Text>
            </View>
            <View style={styles.alertItem}>
              <AlertCircle size={16} color="#F59E0B" />
              <Text style={styles.alertText}>Review 5 pending referrals</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
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
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
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
  activityInfo: {
    flex: 1,
  },
  activityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  activityTitle: {
    fontSize: 12,
    color: '#64748B',
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  alertContent: {
    gap: 8,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
});

export default DashboardOverview;