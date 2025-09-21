import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSafety } from '@/providers/SafetyProvider';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Phone,
  X,
  MapPin,
  Users,
  AlertTriangle,
} from 'lucide-react-native';

export default function EmergencyScreen() {
  const { emergencyContacts, getCurrentLocation, exitEmergencyMode } = useSafety();

  useEffect(() => {
    // Auto-get location when emergency screen opens
    getCurrentLocation();
  }, []);

  const handleCall911 = () => {
    Linking.openURL('tel:911');
  };

  const handleCallContact = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleCallHotline = () => {
    Linking.openURL('tel:1-800-799-7233');
  };

  const handleClose = () => {
    Alert.alert(
      'Exit Emergency Mode',
      'Are you sure you want to exit emergency mode?',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Exit',
          onPress: () => {
            exitEmergencyMode();
            router.back();
          },
        },
      ]
    );
  };

  const primaryContact = emergencyContacts.find(c => c.isPrimary);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E53935', '#D32F2F']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            testID="close-emergency"
          >
            <X color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.emergencyIcon}>
            <AlertTriangle color="#FFFFFF" size={64} />
          </View>

          <Text style={styles.title}>Emergency Mode</Text>
          <Text style={styles.subtitle}>
            Help is available. Choose how you'd like to get support.
          </Text>

          <View style={styles.actions}>
            {/* Call 911 */}
            <TouchableOpacity
              style={styles.primaryAction}
              onPress={handleCall911}
              testID="call-911"
            >
              <Phone color="#E53935" size={24} />
              <Text style={styles.primaryActionText}>Call 911</Text>
            </TouchableOpacity>

            {/* Call Primary Contact */}
            {primaryContact && (
              <TouchableOpacity
                style={styles.secondaryAction}
                onPress={() => handleCallContact(primaryContact.phone)}
                testID="call-primary-contact"
              >
                <Users color="#FFFFFF" size={20} />
                <Text style={styles.secondaryActionText}>
                  Call {primaryContact.name}
                </Text>
              </TouchableOpacity>
            )}

            {/* Call Hotline */}
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={handleCallHotline}
              testID="call-hotline"
            >
              <Phone color="#FFFFFF" size={20} />
              <Text style={styles.secondaryActionText}>
                National DV Hotline
              </Text>
            </TouchableOpacity>

            {/* Share Location */}
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={getCurrentLocation}
              testID="share-location"
            >
              <MapPin color="#FFFFFF" size={20} />
              <Text style={styles.secondaryActionText}>
                Share My Location
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Your emergency contacts have been notified automatically.
            </Text>
            <Text style={styles.footerSubtext}>
              You are not alone. Help is available 24/7.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emergencyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  actions: {
    width: '100%',
    gap: 16,
    marginBottom: 48,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    gap: 12,
  },
  primaryActionText: {
    color: '#E53935',
    fontSize: 20,
    fontWeight: '700',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  secondaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  footerSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});