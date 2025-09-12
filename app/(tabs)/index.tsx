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
import {
  Plus,
  Shield,
  Phone,
  MapPin,
  Heart,
  Users,
  AlertTriangle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { isEmergencyMode, triggerEmergency } = useSafety();

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {user?.isAnonymous ? 'Friend' : user?.firstName}
            </Text>
            <Text style={styles.subtitle}>You are safe and supported</Text>
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

        {/* Safety Status */}
        <View style={styles.section}>
          <View style={styles.safetyCard}>
            <View style={styles.safetyHeader}>
              <Shield color="#43A047" size={24} />
              <Text style={styles.safetyTitle}>Safety Status</Text>
            </View>
            <Text style={styles.safetyDescription}>
              Your location services are active and emergency contacts are configured.
            </Text>
            <TouchableOpacity
              style={styles.safetyButton}
              onPress={() => router.push('/(tabs)/safety')}
            >
              <Text style={styles.safetyButtonText}>View Safety Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Resources</Text>
          <View style={styles.resources}>
            {resources.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                style={styles.resourceCard}
                testID={`resource-${resource.id}`}
              >
                <View
                  style={[styles.resourceIcon, { backgroundColor: resource.color }]}
                >
                  <Users color="#FFFFFF" size={20} />
                </View>
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceDescription}>
                    {resource.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Check-in */}
        <View style={styles.section}>
          <View style={styles.checkinCard}>
            <Text style={styles.checkinTitle}>How are you feeling today?</Text>
            <Text style={styles.checkinDescription}>
              Take a moment to check in with yourself
            </Text>
            <TouchableOpacity
              style={styles.checkinButton}
              onPress={() => router.push('/(tabs)/wellbeing')}
            >
              <Heart color="#E24B95" size={20} />
              <Text style={styles.checkinButtonText}>Daily Check-in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
});