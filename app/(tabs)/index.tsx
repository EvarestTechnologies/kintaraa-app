import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useSafety } from '@/providers/SafetyProvider';
import { useProvider } from '@/providers/ProviderContext';
import { useIncidents } from '@/providers/IncidentProvider';
import { DashboardOverview as HealthcareDashboard } from '@/dashboards/healthcare';
import GBVRescueDashboard from '@/dashboards/gbv_rescue';
import SurvivorDashboard from '@/dashboards/survivor';
import {
  Plus,
  Shield,
  Phone,
  MapPin,
  Heart,
  Users,
  AlertTriangle,
  Briefcase,
  Clock,
  CheckCircle,
  MessageSquare,
  Star,
  TrendingUp,
  Stethoscope,
  Scale,
  Calendar,
  FileText,
  UserCheck,
  Activity,
  LifeBuoy,
  UserPlus,
  Home,
  Siren,
  Headphones,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { isEmergencyMode, triggerEmergency } = useSafety();
  const { stats, pendingAssignments, assignedCases, unreadCount, acceptAssignment, declineAssignment, isAccepting, isDeclining } = useProvider();
  const { incidents } = useIncidents();
  
  // Calculate survivor stats from incidents
  const survivorStats = {
    totalCases: incidents.length,
    activeCases: incidents.filter(i => i.status === 'assigned' || i.status === 'in_progress').length,
    completedCases: incidents.filter(i => i.status === 'completed').length,
    newCases: incidents.filter(i => i.status === 'new').length,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
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
      title: 'Emergency',
      icon: Phone,
      color: '#E53935',
      onPress: triggerEmergency,
    },
    {
      id: 'safety',
      title: 'Safety Map',
      icon: MapPin,
      color: '#26A69A',
      onPress: () => router.push('/(tabs)/safety'),
    },
    {
      id: 'wellbeing',
      title: 'Wellbeing',
      icon: Heart,
      color: '#F3B52F',
      onPress: () => router.push('/(tabs)/wellbeing'),
    },
  ];

  const resources = [
    {
      id: 'counseling',
      title: 'Counseling Services',
      description: 'Professional mental health support',
      color: '#4527A0',
    },
    {
      id: 'legal',
      title: 'Legal Aid',
      description: 'Free legal consultation and support',
      color: '#1565C0',
    },
    {
      id: 'shelter',
      title: 'Safe Housing',
      description: 'Emergency shelter and accommodation',
      color: '#00695C',
    },
    {
      id: 'community',
      title: 'Support Groups',
      description: 'Connect with others in your journey',
      color: '#673AB7',
    },
  ];

  // Get provider-specific content
  const getProviderContent = () => {
    const providerType = user?.providerType;
    
    const getProviderTitle = () => {
      switch (providerType) {
        case 'healthcare': return 'Dr.';
        case 'legal': return 'Atty.';
        case 'police': return 'Officer';
        case 'counseling': return 'Counselor';
        case 'social': return 'Social Worker';
        case 'gbv_rescue': return 'Responder';
        case 'chw': return 'CHW';
        default: return 'Provider';
      }
    };

    const getProviderSubtitle = () => {
      switch (providerType) {
        case 'healthcare': return 'Healthcare Dashboard';
        case 'legal': return 'Legal Services Dashboard';
        case 'police': return 'Law Enforcement Dashboard';
        case 'counseling': return 'Counseling Dashboard';
        case 'social': return 'Social Services Dashboard';
        case 'gbv_rescue': return 'GBV Rescue Center Dashboard';
        case 'chw': return 'Community Health Worker Dashboard';
        default: return 'Provider Dashboard';
      }
    };

    const getProviderQuickActions = () => {
      switch (providerType) {
        case 'healthcare':
          return [
            { 
              id: 'new-patient', 
              title: 'New Patient', 
              icon: UserCheck, 
              color: '#10B981',
              onPress: () => {
                console.log('New Patient action pressed');
                // Navigate to new patient form or show modal
              }
            },
            { 
              id: 'appointments', 
              title: 'Appointments', 
              icon: Calendar, 
              color: '#3B82F6',
              onPress: () => {
                console.log('Appointments action pressed');
                // Navigate to appointments screen
              }
            },
            { 
              id: 'records', 
              title: 'Medical Records', 
              icon: FileText, 
              color: '#8B5CF6',
              onPress: () => {
                console.log('Medical Records action pressed');
                // Navigate to medical records screen
              }
            },
            { 
              id: 'emergency', 
              title: 'Emergency', 
              icon: Phone, 
              color: '#E53935',
              onPress: () => {
                console.log('Emergency action pressed');
                triggerEmergency();
              }
            },
          ];
        case 'legal':
          return [
            { 
              id: 'new-case', 
              title: 'New Case', 
              icon: Scale, 
              color: '#3B82F6',
              onPress: () => console.log('New Case action pressed')
            },
            { 
              id: 'documents', 
              title: 'Documents', 
              icon: FileText, 
              color: '#8B5CF6',
              onPress: () => console.log('Documents action pressed')
            },
            { 
              id: 'court', 
              title: 'Court Schedule', 
              icon: Calendar, 
              color: '#F59E0B',
              onPress: () => console.log('Court Schedule action pressed')
            },
            { 
              id: 'consultation', 
              title: 'Consultation', 
              icon: MessageSquare, 
              color: '#10B981',
              onPress: () => console.log('Consultation action pressed')
            },
          ];
        case 'police':
          return [
            { 
              id: 'new-report', 
              title: 'New Report', 
              icon: Shield, 
              color: '#EF4444',
              onPress: () => console.log('New Report action pressed')
            },
            { 
              id: 'evidence', 
              title: 'Evidence', 
              icon: FileText, 
              color: '#8B5CF6',
              onPress: () => console.log('Evidence action pressed')
            },
            { 
              id: 'patrol', 
              title: 'Patrol Log', 
              icon: MapPin, 
              color: '#10B981',
              onPress: () => console.log('Patrol Log action pressed')
            },
            { 
              id: 'emergency', 
              title: 'Emergency', 
              icon: Phone, 
              color: '#E53935',
              onPress: () => triggerEmergency()
            },
          ];
        case 'counseling':
          return [
            { 
              id: 'new-session', 
              title: 'New Session', 
              icon: Heart, 
              color: '#F59E0B',
              onPress: () => console.log('New Session action pressed')
            },
            { 
              id: 'clients', 
              title: 'Client Notes', 
              icon: FileText, 
              color: '#8B5CF6',
              onPress: () => console.log('Client Notes action pressed')
            },
            { 
              id: 'resources', 
              title: 'Resources', 
              icon: Users, 
              color: '#10B981',
              onPress: () => console.log('Resources action pressed')
            },
            { 
              id: 'crisis', 
              title: 'Crisis Support', 
              icon: Phone, 
              color: '#E53935',
              onPress: () => triggerEmergency()
            },
          ];
        case 'social':
          return [
            { 
              id: 'new-case', 
              title: 'New Case', 
              icon: Users, 
              color: '#8B5CF6',
              onPress: () => console.log('New Case action pressed')
            },
            { 
              id: 'services', 
              title: 'Services', 
              icon: Heart, 
              color: '#F59E0B',
              onPress: () => console.log('Services action pressed')
            },
            { 
              id: 'resources', 
              title: 'Resources', 
              icon: FileText, 
              color: '#10B981',
              onPress: () => console.log('Resources action pressed')
            },
            { 
              id: 'home-visit', 
              title: 'Home Visit', 
              icon: MapPin, 
              color: '#3B82F6',
              onPress: () => console.log('Home Visit action pressed')
            },
          ];
        case 'gbv_rescue':
          return [
            { 
              id: 'emergency-response', 
              title: 'Emergency Response', 
              icon: Siren, 
              color: '#DC2626',
              onPress: () => console.log('Emergency Response action pressed')
            },
            { 
              id: 'hotline', 
              title: 'Hotline Support', 
              icon: Headphones, 
              color: '#7C3AED',
              onPress: () => console.log('Hotline Support action pressed')
            },
            { 
              id: 'safe-house', 
              title: 'Safe House', 
              icon: Home, 
              color: '#059669',
              onPress: () => console.log('Safe House action pressed')
            },
            { 
              id: 'crisis-intervention', 
              title: 'Crisis Intervention', 
              icon: LifeBuoy, 
              color: '#EA580C',
              onPress: () => console.log('Crisis Intervention action pressed')
            },
          ];
        case 'chw':
          return [
            { 
              id: 'community-outreach', 
              title: 'Community Outreach', 
              icon: UserPlus, 
              color: '#059669',
              onPress: () => console.log('Community Outreach action pressed')
            },
            { 
              id: 'home-visits', 
              title: 'Home Visits', 
              icon: Home, 
              color: '#0891B2',
              onPress: () => console.log('Home Visits action pressed')
            },
            { 
              id: 'health-education', 
              title: 'Health Education', 
              icon: Heart, 
              color: '#DC2626',
              onPress: () => console.log('Health Education action pressed')
            },
            { 
              id: 'referrals', 
              title: 'Referrals', 
              icon: Users, 
              color: '#7C3AED',
              onPress: () => console.log('Referrals action pressed')
            },
          ];
        default:
          return [
            { 
              id: 'cases', 
              title: 'Cases', 
              icon: Briefcase, 
              color: '#6A2CB0',
              onPress: () => router.push('/(tabs)/reports')
            },
            { 
              id: 'messages', 
              title: 'Messages', 
              icon: MessageSquare, 
              color: '#E24B95',
              onPress: () => console.log('Messages action pressed')
            },
            { 
              id: 'calendar', 
              title: 'Calendar', 
              icon: Calendar, 
              color: '#26A69A',
              onPress: () => console.log('Calendar action pressed')
            },
            { 
              id: 'reports', 
              title: 'Reports', 
              icon: FileText, 
              color: '#F3B52F',
              onPress: () => console.log('Reports action pressed')
            },
          ];
      }
    };

    return {
      title: getProviderTitle(),
      subtitle: getProviderSubtitle(),
      quickActions: getProviderQuickActions(),
    };
  };

  // Render provider dashboard if user is a provider
  if (user?.role === 'provider') {
    // Use modular dashboard based on provider type
    if (user.providerType === 'healthcare') {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()}, Dr. {user?.firstName}
              </Text>
              <Text style={styles.subtitle}>Healthcare Dashboard</Text>
            </View>
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <MessageSquare color="#FFFFFF" size={16} />
                <Text style={styles.notificationText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <HealthcareDashboard />
        </SafeAreaView>
      );
    }
    
    if (user.providerType === 'gbv_rescue') {
      return (
        <SafeAreaView style={styles.container}>
          <GBVRescueDashboard />
        </SafeAreaView>
      );
    }
    
    const providerContent = getProviderContent();
    
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Provider Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()}, {providerContent.title} {user?.firstName}
              </Text>
              <Text style={styles.subtitle}>{providerContent.subtitle}</Text>
            </View>
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <MessageSquare color="#FFFFFF" size={16} />
                <Text style={styles.notificationText}>{unreadCount}</Text>
              </View>
            )}
          </View>

          {/* Provider Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              {providerContent.quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickAction}
                  onPress={action.onPress}
                  testID={`provider-action-${action.id}`}
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

          {/* Provider Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Briefcase color="#6A2CB0" size={24} />
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
                <Star color="#F3B52F" size={24} />
                <Text style={styles.statNumber}>{stats.rating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>

          {/* Pending Assignments */}
          {pendingAssignments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pending Assignments ({pendingAssignments.length})</Text>
              <View style={styles.assignmentsList}>
                {pendingAssignments.slice(0, 3).map((assignment) => (
                  <View key={assignment.id} style={styles.assignmentCard}>
                    <View style={styles.assignmentHeader}>
                      <Text style={styles.assignmentType}>{assignment.serviceType}</Text>
                      <View style={[
                        styles.priorityBadge,
                        { backgroundColor: assignment.priority === 'high' ? '#E53935' : '#FF9800' }
                      ]}>
                        <Text style={styles.priorityText}>{assignment.priority.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.assignmentTime}>
                      Assigned {new Date(assignment.assignedAt).toLocaleTimeString()}
                    </Text>
                    <View style={styles.assignmentActions}>
                      <TouchableOpacity 
                        style={[styles.acceptButton, isAccepting && styles.buttonDisabled]}
                        onPress={() => {
                          console.log('Accepting assignment:', assignment.id);
                          acceptAssignment(assignment.id);
                        }}
                        disabled={isAccepting || isDeclining}
                      >
                        <Text style={styles.acceptButtonText}>
                          {isAccepting ? 'Accepting...' : 'Accept'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.declineButton, isDeclining && styles.buttonDisabled]}
                        onPress={() => {
                          console.log('Declining assignment:', assignment.id);
                          declineAssignment(assignment.id);
                        }}
                        disabled={isAccepting || isDeclining}
                      >
                        <Text style={styles.declineButtonText}>
                          {isDeclining ? 'Declining...' : 'Decline'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recent Cases */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Cases</Text>
            <View style={styles.casesList}>
              {assignedCases.slice(0, 3).map((incident) => (
                <TouchableOpacity 
                  key={incident.id} 
                  style={styles.caseCard}
                  onPress={() => {
                    console.log('Navigating to case details:', incident.id);
                    router.push(`/case-details/${incident.id}`);
                  }}
                >
                  <View style={styles.caseHeader}>
                    <Text style={styles.caseNumber}>{incident.caseNumber}</Text>
                    <Text style={styles.caseStatus}>{incident.status}</Text>
                  </View>
                  <Text style={styles.caseType}>{incident.type}</Text>
                  <Text style={styles.caseDate}>
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.section}>
            <View style={styles.performanceCard}>
              <View style={styles.performanceHeader}>
                <TrendingUp color="#43A047" size={24} />
                <Text style={styles.performanceTitle}>Performance</Text>
              </View>
              <View style={styles.performanceMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{stats.averageResponseTime}min</Text>
                  <Text style={styles.metricLabel}>Avg Response</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{stats.totalMessages}</Text>
                  <Text style={styles.metricLabel}>Messages</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Default survivor dashboard - use modular dashboard
  return (
    <View style={styles.container}>
      <SurvivorDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  scrollContent: {
    paddingBottom: 24,
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
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  safetyButtonText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
  resources: {
    paddingHorizontal: 24,
    gap: 12,
  },
  resourceCard: {
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
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 18,
  },
  checkinCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  checkinTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 8,
    textAlign: 'center',
  },
  checkinDescription: {
    fontSize: 14,
    color: '#49455A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  checkinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
  },
  checkinButtonText: {
    color: '#E24B95',
    fontSize: 16,
    fontWeight: '600',
  },
  // Provider-specific styles
  notificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E24B95',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 80) / 2,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
  assignmentsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assignmentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  assignmentTime: {
    fontSize: 12,
    color: '#49455A',
    marginBottom: 12,
  },
  assignmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#43A047',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#F5F0FF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8CEE8',
  },
  declineButtonText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  casesList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caseNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A2CB0',
  },
  caseStatus: {
    fontSize: 12,
    color: '#49455A',
    textTransform: 'capitalize',
  },
  caseType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  caseDate: {
    fontSize: 12,
    color: '#49455A',
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
  performanceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#341A52',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#49455A',
  },
  // Survivor Dashboard Styles
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
  caseOverviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  caseOverviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#341A52',
  },
  caseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  caseStat: {
    alignItems: 'center',
  },
  caseStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6A2CB0',
    marginBottom: 4,
  },
  caseStatLabel: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
  },
  viewCasesButton: {
    backgroundColor: '#F5F0FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewCasesButtonText: {
    color: '#6A2CB0',
    fontSize: 14,
    fontWeight: '600',
  },
  updatesContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#341A52',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#341A52',
  },
  updateDescription: {
    fontSize: 14,
    color: '#49455A',
    lineHeight: 20,
    marginBottom: 8,
  },
  updateTime: {
    fontSize: 12,
    color: '#43A047',
    fontWeight: '500',
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
  supportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#341A52',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  supportDescription: {
    fontSize: 12,
    color: '#49455A',
    textAlign: 'center',
    marginBottom: 4,
  },
  supportAvailable: {
    fontSize: 10,
    color: '#43A047',
    fontWeight: '600',
    textAlign: 'center',
  },
});