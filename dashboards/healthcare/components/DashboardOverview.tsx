import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Stethoscope,
  Calendar,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Heart,
} from 'lucide-react-native';
import { useProvider } from '@/providers/ProviderContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface HealthcareStats {
  totalPatients: number;
  todayAppointments: number;
  pendingRecords: number;
  emergencyCases: number;
  completedToday: number;
  averageConsultationTime: number;
}

export default function DashboardOverview() {
  const { stats, assignedCases, pendingAssignments } = useProvider();

  // Calculate healthcare-specific stats
  const healthcareStats: HealthcareStats = {
    totalPatients: stats.totalCases,
    todayAppointments: pendingAssignments.length,
    pendingRecords: assignedCases.filter(c => c.status === 'in_progress').length,
    emergencyCases: assignedCases.filter(c => c.priority === 'critical' || c.priority === 'high').length,
    completedToday: assignedCases.filter(c => {
      const today = new Date().toDateString();
      return c.status === 'completed' && new Date(c.updatedAt).toDateString() === today;
    }).length,
    averageConsultationTime: stats.averageResponseTime,
  };

  const quickActions = [
    {
      id: 'new-patient',
      title: 'New Patient',
      subtitle: 'Register patient',
      icon: Users,
      color: '#10B981',
      onPress: () => {
        console.log('Navigate to new patient registration');
        // TODO: Navigate to patient registration
      },
    },
    {
      id: 'appointments',
      title: 'Appointments',
      subtitle: `${healthcareStats.todayAppointments} today`,
      icon: Calendar,
      color: '#3B82F6',
      onPress: () => {
        console.log('Navigate to appointments');
        router.push('/(tabs)/wellbeing'); // Appointments tab
      },
    },
    {
      id: 'medical-records',
      title: 'Medical Records',
      subtitle: `${healthcareStats.pendingRecords} pending`,
      icon: FileText,
      color: '#8B5CF6',
      onPress: () => {
        console.log('Navigate to medical records');
        router.push('/(tabs)/safety'); // Records tab
      },
    },
    {
      id: 'emergency',
      title: 'Emergency Cases',
      subtitle: `${healthcareStats.emergencyCases} active`,
      icon: AlertTriangle,
      color: '#EF4444',
      onPress: () => {
        console.log('Navigate to emergency cases');
        router.push('/(tabs)/reports'); // Cases tab with emergency filter
      },
    },
  ];

  const statCards = [
    {
      title: 'Total Patients',
      value: healthcareStats.totalPatients.toString(),
      icon: Users,
      color: '#10B981',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Today\'s Appointments',
      value: healthcareStats.todayAppointments.toString(),
      icon: Calendar,
      color: '#3B82F6',
      change: '+3',
      changeType: 'positive' as const,
    },
    {
      title: 'Completed Today',
      value: healthcareStats.completedToday.toString(),
      icon: CheckCircle,
      color: '#059669',
      change: '+5',
      changeType: 'positive' as const,
    },
    {
      title: 'Avg Consultation',
      value: `${healthcareStats.averageConsultationTime}min`,
      icon: Clock,
      color: '#F59E0B',
      change: '-2min',
      changeType: 'positive' as const,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={action.onPress}
              testID={`healthcare-action-${action.id}`}
            >
              <LinearGradient
                colors={[action.color, `${action.color}CC`]}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <action.icon color="#FFFFFF" size={28} />
                <View style={styles.quickActionText}>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Statistics Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today\'s Overview</Text>
        <View style={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                  <stat.icon color={stat.color} size={24} />
                </View>
                <View style={[
                  styles.changeIndicator,
                  { backgroundColor: stat.changeType === 'positive' ? '#10B98120' : '#EF444420' }
                ]}>
                  <TrendingUp 
                    color={stat.changeType === 'positive' ? '#10B981' : '#EF4444'} 
                    size={12} 
                  />
                  <Text style={[
                    styles.changeText,
                    { color: stat.changeType === 'positive' ? '#10B981' : '#EF4444' }
                  ]}>
                    {stat.change}
                  </Text>
                </View>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Emergency Alert */}
      {healthcareStats.emergencyCases > 0 && (
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.emergencyAlert}
            onPress={() => router.push('/(tabs)/reports')}
          >
            <View style={styles.emergencyHeader}>
              <AlertTriangle color="#EF4444" size={24} />
              <Text style={styles.emergencyTitle}>Emergency Cases Require Attention</Text>
            </View>
            <Text style={styles.emergencyDescription}>
              {healthcareStats.emergencyCases} high-priority cases need immediate medical attention
            </Text>
            <View style={styles.emergencyAction}>
              <Text style={styles.emergencyActionText}>View Emergency Cases</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Performance Metrics */}
      <View style={styles.section}>
        <View style={styles.performanceCard}>
          <View style={styles.performanceHeader}>
            <Activity color="#6A2CB0" size={24} />
            <Text style={styles.performanceTitle}>Performance Metrics</Text>
          </View>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>{stats.rating.toFixed(1)}</Text>
              <Text style={styles.performanceLabel}>Patient Rating</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Heart 
                    key={star}
                    color={star <= Math.floor(stats.rating) ? '#F59E0B' : '#D1D5DB'}
                    size={12}
                    fill={star <= Math.floor(stats.rating) ? '#F59E0B' : 'transparent'}
                  />
                ))}
              </View>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>{stats.completedCases}</Text>
              <Text style={styles.performanceLabel}>Cases Completed</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue}>{healthcareStats.averageConsultationTime}min</Text>
              <Text style={styles.performanceLabel}>Avg Response Time</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  quickActionsGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  quickActionCard: {
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  quickActionGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: (width - 56) / 2,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#49455A',
    fontWeight: '500',
  },
  emergencyAlert: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
    marginBottom: 12,
  },
  emergencyAction: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emergencyActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6A2CB0',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  },
});