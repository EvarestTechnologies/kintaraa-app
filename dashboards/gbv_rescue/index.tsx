import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useProvider } from '@/providers/ProviderContext';
import { Siren, Headphones, Home, LifeBuoy, AlertTriangle, Clock, Users, Shield } from 'lucide-react-native';

export default function GBVRescueDashboard() {
  const { user } = useAuth();
  const { stats, assignedCases } = useProvider();

  // GBV Rescue specific metrics
  const emergencyCases = assignedCases.filter(c => c.priority === 'critical' && ['assigned', 'in_progress'].includes(c.status));
  const hotlineCalls = 47; // Mock data
  const safeHouseBeds = { occupied: 12, total: 20 };
  const responseTime = 8; // minutes average

  const handleEmergencyResponse = () => {
    Alert.alert(
      'Emergency Response',
      'Activating emergency response protocol. All available responders will be notified.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Activate', style: 'destructive', onPress: () => console.log('Emergency response activated') }
      ]
    );
  };

  const handleHotlineSupport = () => {
    console.log('Opening hotline support interface');
  };

  const handleSafeHouseManagement = () => {
    console.log('Opening safe house management');
  };

  const handleCrisisIntervention = () => {
    console.log('Opening crisis intervention tools');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Shield color="#DC2626" size={28} />
            <View style={styles.titleText}>
              <Text style={styles.title}>GBV Rescue Center</Text>
              <Text style={styles.subtitle}>Emergency Response Dashboard</Text>
            </View>
          </View>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
      </View>

      {/* Emergency Alert Banner */}
      {emergencyCases.length > 0 && (
        <View style={styles.emergencyBanner}>
          <AlertTriangle color="#DC2626" size={20} />
          <Text style={styles.emergencyText}>
            {emergencyCases.length} critical case{emergencyCases.length > 1 ? 's' : ''} requiring immediate attention
          </Text>
        </View>
      )}

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: '#FEF2F2' }]}>
            <Siren color="#DC2626" size={24} />
            <Text style={styles.metricValue}>{emergencyCases.length}</Text>
            <Text style={styles.metricLabel}>Emergency Cases</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#F3E8FF' }]}>
            <Headphones color="#7C3AED" size={24} />
            <Text style={styles.metricValue}>{hotlineCalls}</Text>
            <Text style={styles.metricLabel}>Hotline Calls Today</Text>
          </View>
        </View>
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: '#ECFDF5' }]}>
            <Home color="#059669" size={24} />
            <Text style={styles.metricValue}>{safeHouseBeds.occupied}/{safeHouseBeds.total}</Text>
            <Text style={styles.metricLabel}>Safe House Beds</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#FFF7ED' }]}>
            <Clock color="#EA580C" size={24} />
            <Text style={styles.metricValue}>{responseTime}m</Text>
            <Text style={styles.metricLabel}>Avg Response Time</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#FEF2F2' }]}
            onPress={handleEmergencyResponse}
          >
            <Siren color="#DC2626" size={32} />
            <Text style={[styles.actionTitle, { color: '#DC2626' }]}>Emergency Response</Text>
            <Text style={styles.actionDescription}>Activate emergency protocol</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#F3E8FF' }]}
            onPress={handleHotlineSupport}
          >
            <Headphones color="#7C3AED" size={32} />
            <Text style={[styles.actionTitle, { color: '#7C3AED' }]}>Hotline Support</Text>
            <Text style={styles.actionDescription}>Manage crisis calls</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#ECFDF5' }]}
            onPress={handleSafeHouseManagement}
          >
            <Home color="#059669" size={32} />
            <Text style={[styles.actionTitle, { color: '#059669' }]}>Safe House</Text>
            <Text style={styles.actionDescription}>Manage accommodations</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#FFF7ED' }]}
            onPress={handleCrisisIntervention}
          >
            <LifeBuoy color="#EA580C" size={32} />
            <Text style={[styles.actionTitle, { color: '#EA580C' }]}>Crisis Intervention</Text>
            <Text style={styles.actionDescription}>Immediate support tools</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#FEF2F2' }]}>
              <Siren color="#DC2626" size={16} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Emergency case assigned</Text>
              <Text style={styles.activityTime}>2 minutes ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#F3E8FF' }]}>
              <Headphones color="#7C3AED" size={16} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Hotline call completed</Text>
              <Text style={styles.activityTime}>15 minutes ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#ECFDF5' }]}>
              <Home color="#059669" size={16} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Safe house bed allocated</Text>
              <Text style={styles.activityTime}>1 hour ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Team Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Response Team Status</Text>
        <View style={styles.teamContainer}>
          <View style={styles.teamMember}>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.teamName}>Emergency Team Alpha</Text>
            <Text style={styles.teamStatus}>Available</Text>
          </View>
          <View style={styles.teamMember}>
            <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.teamName}>Crisis Counselors</Text>
            <Text style={styles.teamStatus}>Busy (2/4 available)</Text>
          </View>
          <View style={styles.teamMember}>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.teamName}>Safe House Staff</Text>
            <Text style={styles.teamStatus}>Available</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  emergencyBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    margin: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
    flex: 1,
  },
  metricsContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 6,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  activityContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  teamContainer: {
    gap: 12,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  teamStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
});