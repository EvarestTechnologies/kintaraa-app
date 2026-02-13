import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { DashboardOverview } from './components/DashboardOverview';
import { CaseManagement } from './components/CaseManagement';
import { SupportServices } from './components/SupportServices';
import { SafetyTools } from './components/SafetyTools';
import { AppointmentReminderService } from '@/services/appointmentReminderService';

export { DashboardOverview, CaseManagement, SupportServices, SafetyTools };

export default function SurvivorDashboard() {
  // Initialize the reminder service when the dashboard loads
  useEffect(() => {
    AppointmentReminderService.initialize();

    // Create some sample reminders for demonstration
    AppointmentReminderService.createSampleReminders();

    // Cleanup on unmount
    return () => {
      AppointmentReminderService.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <DashboardOverview />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
});