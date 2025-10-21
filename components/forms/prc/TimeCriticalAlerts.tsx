/**
 * Time-Critical Alerts Component
 * Displays PEP and EC deadline alerts with countdown timers
 *
 * PEP (Post-Exposure Prophylaxis): Must start within 72 hours
 * EC (Emergency Contraception): Must provide within 120 hours
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TimeCriticalWindows } from '@/types/forms';

interface TimeCriticalAlertsProps {
  incidentDate: string; // ISO 8601
  incidentTime?: string; // HH:mm
  pepAdministered: boolean;
  ecAdministered: boolean;
}

export const TimeCriticalAlerts: React.FC<TimeCriticalAlertsProps> = ({
  incidentDate,
  incidentTime,
  pepAdministered,
  ecAdministered,
}) => {
  const [windows, setWindows] = useState<TimeCriticalWindows | null>(null);

  useEffect(() => {
    // Calculate time windows
    const calculateWindows = (): TimeCriticalWindows => {
      const incident = new Date(`${incidentDate}${incidentTime ? `T${incidentTime}` : ''}`);
      const now = new Date();
      const hoursAfterIncident = (now.getTime() - incident.getTime()) / (1000 * 60 * 60);

      const pepDeadline = new Date(incident.getTime() + 72 * 60 * 60 * 1000);
      const ecDeadline = new Date(incident.getTime() + 120 * 60 * 60 * 1000);

      const pepHoursRemaining = Math.max(0, 72 - hoursAfterIncident);
      const ecHoursRemaining = Math.max(0, 120 - hoursAfterIncident);

      // Determine urgency level
      let urgencyLevel: 'critical' | 'urgent' | 'warning' | 'expired' = 'expired';
      if (hoursAfterIncident <= 24) {
        urgencyLevel = 'warning';
      } else if (hoursAfterIncident <= 48) {
        urgencyLevel = 'urgent';
      } else if (hoursAfterIncident <= 72) {
        urgencyLevel = 'critical';
      }

      return {
        pepWithinWindow: hoursAfterIncident <= 72,
        ecWithinWindow: hoursAfterIncident <= 120,
        hoursAfterIncident,
        pepDeadline: pepDeadline.toISOString(),
        ecDeadline: ecDeadline.toISOString(),
        pepHoursRemaining,
        ecHoursRemaining,
        urgencyLevel,
      };
    };

    setWindows(calculateWindows());

    // Update every minute
    const interval = setInterval(() => {
      setWindows(calculateWindows());
    }, 60000);

    return () => clearInterval(interval);
  }, [incidentDate, incidentTime]);

  if (!windows) {
    return null;
  }

  const formatHoursRemaining = (hours: number): string => {
    if (hours <= 0) return 'EXPIRED';
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    const minutes = Math.floor((hours % 1) * 60);

    if (days > 0) {
      return `${days}d ${remainingHours}h ${minutes}m`;
    }
    return `${remainingHours}h ${minutes}m`;
  };

  const getAlertColor = (urgency: string, administered: boolean) => {
    if (administered) return styles.alertSuccess;

    switch (urgency) {
      case 'warning':
        return styles.alertWarning;
      case 'urgent':
        return styles.alertUrgent;
      case 'critical':
        return styles.alertCritical;
      case 'expired':
        return styles.alertExpired;
      default:
        return styles.alertWarning;
    }
  };

  const getUrgencyIcon = (urgency: string, administered: boolean) => {
    if (administered) return '✅';

    switch (urgency) {
      case 'warning':
        return '⚠️';
      case 'urgent':
        return '🔴';
      case 'critical':
        return '🚨';
      case 'expired':
        return '❌';
      default:
        return '⚠️';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ Time-Critical Treatment Alerts</Text>
      <Text style={styles.subtitle}>
        {windows.hoursAfterIncident.toFixed(1)} hours since incident
      </Text>

      {/* PEP Alert */}
      <View style={[styles.alert, getAlertColor(windows.urgencyLevel, pepAdministered)]}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertIcon}>
            {getUrgencyIcon(windows.urgencyLevel, pepAdministered)}
          </Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>
              PEP (Post-Exposure Prophylaxis)
            </Text>
            <Text style={styles.alertDescription}>
              HIV prevention medication - must start within 72 hours
            </Text>
          </View>
        </View>

        <View style={styles.alertDetails}>
          {pepAdministered ? (
            <Text style={styles.alertStatusComplete}>✅ PEP ADMINISTERED</Text>
          ) : windows.pepWithinWindow ? (
            <>
              <Text style={styles.alertCountdown}>
                {formatHoursRemaining(windows.pepHoursRemaining)} remaining
              </Text>
              <Text style={styles.alertDeadline}>
                Deadline: {new Date(windows.pepDeadline).toLocaleString()}
              </Text>
            </>
          ) : (
            <Text style={styles.alertStatusExpired}>❌ PEP WINDOW EXPIRED</Text>
          )}
        </View>
      </View>

      {/* EC Alert */}
      <View style={[styles.alert, getAlertColor(
        windows.ecWithinWindow ? 'warning' : 'expired',
        ecAdministered
      )]}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertIcon}>
            {ecAdministered ? '✅' : windows.ecWithinWindow ? '⚠️' : '❌'}
          </Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>
              EC (Emergency Contraception)
            </Text>
            <Text style={styles.alertDescription}>
              Emergency contraceptive pills - must provide within 120 hours
            </Text>
          </View>
        </View>

        <View style={styles.alertDetails}>
          {ecAdministered ? (
            <Text style={styles.alertStatusComplete}>✅ EC ADMINISTERED</Text>
          ) : windows.ecWithinWindow ? (
            <>
              <Text style={styles.alertCountdown}>
                {formatHoursRemaining(windows.ecHoursRemaining)} remaining
              </Text>
              <Text style={styles.alertDeadline}>
                Deadline: {new Date(windows.ecDeadline).toLocaleString()}
              </Text>
            </>
          ) : (
            <Text style={styles.alertStatusExpired}>❌ EC WINDOW EXPIRED</Text>
          )}
        </View>
      </View>

      {/* Clinical Guidelines */}
      <View style={styles.guidelines}>
        <Text style={styles.guidelinesTitle}>📋 Clinical Guidelines</Text>
        <Text style={styles.guidelinesText}>
          • PEP (72h): Start as soon as possible. Most effective within first 24 hours.
        </Text>
        <Text style={styles.guidelinesText}>
          • EC (120h): Most effective within first 72 hours. Can be given up to 120 hours.
        </Text>
        <Text style={styles.guidelinesText}>
          • STI Prophylaxis: Should be given at first visit regardless of timing.
        </Text>
        <Text style={styles.guidelinesText}>
          • Hepatitis B & Tetanus: As per standard protocols.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFA000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  alert: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  alertWarning: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFA000',
  },
  alertUrgent: {
    backgroundColor: '#FFE0B2',
    borderColor: '#F57C00',
  },
  alertCritical: {
    backgroundColor: '#FFEBEE',
    borderColor: '#D32F2F',
  },
  alertExpired: {
    backgroundColor: '#FAFAFA',
    borderColor: '#9E9E9E',
  },
  alertSuccess: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 12,
    color: '#616161',
  },
  alertDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  alertCountdown: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 4,
  },
  alertDeadline: {
    fontSize: 12,
    color: '#757575',
  },
  alertStatusComplete: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  alertStatusExpired: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9E9E9E',
  },
  guidelines: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 12,
    color: '#424242',
    marginBottom: 4,
    lineHeight: 18,
  },
});
