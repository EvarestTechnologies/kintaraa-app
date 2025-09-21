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
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useIncidents } from '@/providers/IncidentProvider';
import { useSafety } from '@/providers/SafetyProvider';
import {
  Heart,
  Shield,
  Phone,
  MapPin,
  FileText,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  BookOpen,
  Settings,
  Activity,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export function DashboardOverview() {
  const { user } = useAuth();
  const { incidents } = useIncidents();
  const { isEmergencyMode, triggerEmergency } = useSafety();

  // Calculate survivor stats
  const stats = {
    totalCases: incidents.length,
    activeCases: incidents.filter(i => i.status === 'assigned' || i.status === 'in_progress').length,
    completedCases: incidents.filter(i => i.status === 'completed').length,
    pendingCases: incidents.filter(i => i.status === 'new').length,
  };

  const quickActions = [
    {
      id: 'report',
      title: 'Report Incident',
      icon: Plus,
      color: '#E24B95',
      onPress: () => router.push('/report'),
    },
    {
      id: 'emergency',
      title: 'Emergency Help',
      icon: Phone,
      color: '#E53935',
      onPress: triggerEmergency,
    },
    {
      id: 'safety',
      title: 'Safety Tools',
      icon: Shield,
      color: '#26A69A',
      onPress: () => router.push('/(dashboard)/survivor/safety'),
    },
    {
      id: 'wellbeing',
      title: 'Wellbeing Check',
      icon: Heart,
      color: '#F3B52F',
      onPress: () => router.push('/(dashboard)/survivor/wellbeing'),
    },
  ];

  const supportServices = [
    {
      id: 'counseling',
      title: 'Counseling',
      description: 'Mental health support',
      icon: Heart,
      color: '#8B5CF6',
      available: 5,
    },
    {
      id: 'legal',
      title: 'Legal Aid',
      description: 'Legal consultation',
      icon: FileText,
      color: '#3B82F6',
      available: 3,
    },
    {
      id: 'medical',
      title: 'Medical Care',
      description: 'Healthcare services',
      icon: Activity,
      color: '#10B981',
      available: 4,
    },
    {
      id: 'shelter',
      title: 'Safe Housing',
      description: 'Emergency shelter',
      icon: MapPin,
      color: '#F59E0B',
      available: 2,
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'case_update',
      title: 'Case Update',
      description: 'Your counseling case has been assigned to Dr. Sarah Johnson',
      time: '2 hours ago',
      icon: CheckCircle,
      color: '#10B981',
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Upcoming Appointment',
      description: 'Legal consultation scheduled for tomorrow at 2:00 PM',
      time: '1 day',
      icon: Calendar,
      color: '#3B82F6',
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      description: 'You have a new message from your counselor',
      time: '3 hours ago',
      icon: MessageSquare,
      color: '#8B5CF6',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Welcome back, {user?.isAnonymous ? 'Friend' : user?.firstName}
          </Text>
          <Text style={styles.subtitle}>Your safe space for healing and support</Text>
        </View>
        {isEmergencyMode && (
          <View style={styles.emergencyBadge}>
            <AlertTriangle color="#FFFFFF" size={16} />
            <Text style={styles.emergencyText}>Emergency Mode</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickAction}
              onPress={action.onPress}
              testID={`quick-action-${action.id}`}
            >
              <LinearGradient
                colors={[action.color, `${action.color}CC`]}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <action.icon color="#FFFFFF" size={24} />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Case Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Cases</Text>
        <View style={styles.caseOverviewCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <FileText color="#6A2CB0" size={24} />
              <Text style={styles.statNumber}>{stats.totalCases}</Text>
              <Text style={styles.statLabel}>Total Cases</Text>
            </View>
            <View style={styles.statCard}>
              <Clock color="#FF9800" size={24} />
              <Text style={styles.statNumber}>{stats.activeCases}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <CheckCircle color="#43A047" size={24} />
              <Text style={styles.statNumber}>{stats.completedCases}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <AlertTriangle color="#E53935" size={24} />
              <Text style={styles.statNumber}>{stats.pendingCases}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push('/(dashboard)/survivor/reports')}
          >
            <Text style={styles.viewAllButtonText}>View All Cases</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Support Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Support</Text>
        <View style={styles.supportGrid}>
          {supportServices.map((service) => (
            <TouchableOpacity key={service.id} style={styles.supportCard}>
              <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                <service.icon color="#FFFFFF" size={20} />
              </View>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <Text style={styles.serviceAvailable}>
                {service.available} providers available
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <View style={styles.activitiesList}>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                <activity.icon color="#FFFFFF" size={16} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Wellbeing Check-in */}
      <View style={styles.section}>
        <View style={styles.wellbeingCard}>
          <View style={styles.wellbeingHeader}>
            <Heart color="#E24B95" size={24} />
            <Text style={styles.wellbeingTitle}>Daily Check-in</Text>
          </View>
          <Text style={styles.wellbeingDescription}>
            How are you feeling today? Take a moment to check in with yourself.
          </Text>
          <TouchableOpacity
            style={styles.checkinButton}
            onPress={() => router.push('/(dashboard)/survivor/wellbeing')}
          >
            <Text style={styles.checkinButtonText}>Start Check-in</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Safety Status */}
      <View style={styles.section}>
        <View style={styles.safetyCard}>
          <View style={styles.safetyHeader}>
            <Shield color="#26A69A" size={24} />
            <Text style={styles.safetyTitle}>Safety Status</Text>
          </View>
          <Text style={styles.safetyDescription}>
            Your emergency contacts are configured and location services are active.
          </Text>
          <TouchableOpacity
            style={styles.safetyButton}
            onPress={() => router.push('/(dashboard)/survivor/safety')}
          >
            <Text style={styles.safetyButtonText}>Review Safety Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Resources */}
      <View style={styles.section}>
        <View style={styles.resourcesCard}>
          <View style={styles.resourcesHeader}>
            <BookOpen color="#8B5CF6" size={24} />
            <Text style={styles.resourcesTitle}>Learning Resources</Text>
          </View>
          <Text style={styles.resourcesDescription}>
            Access educational materials, self-help guides, and recovery resources.
          </Text>
          <TouchableOpacity
            style={styles.resourcesButton}
            onPress={() => router.push('/learning-resources')}
          >
            <Text style={styles.resourcesButtonText}>Browse Resources</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#49455A',
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  quickAction: {
    width: (width - 48) / 2,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  caseOverviewCard: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#F5F0FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 96) / 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#341A52',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
  },
  viewAllButton: {
    backgroundColor: '#6A2CB0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 56) / 2,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
    marginBottom: 4,
  },
  serviceAvailable: {
    fontSize: 10,
    color: '#43A047',
    fontWeight: '600',
    textAlign: 'center',
  },
  activitiesList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#49455A',
    lineHeight: 16,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 10,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  wellbeingCard: {
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
  wellbeingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  wellbeingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
  },
  wellbeingDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
    marginBottom: 16,
  },
  checkinButton: {
    backgroundColor: '#F5F0FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkinButtonText: {
    color: '#E24B95',
    fontSize: 14,
    fontWeight: '600',
  },
  safetyCard: {
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
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
  },
  safetyDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
    marginBottom: 16,
  },
  safetyButton: {
    backgroundColor: '#F5F0FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  safetyButtonText: {
    color: '#26A69A',
    fontSize: 14,
    fontWeight: '600',
  },
  resourcesCard: {
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
  resourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
  },
  resourcesDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
    marginBottom: 16,
  },
  resourcesButton: {
    backgroundColor: '#F5F0FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resourcesButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
});