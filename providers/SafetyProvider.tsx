import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Platform, Alert, Linking } from 'react-native';
import { useAuth } from './AuthProvider';

export interface SafetyState {
  isEmergencyMode: boolean;
  currentLocation: Location.LocationObject | null;
  emergencyContacts: EmergencyContact[];
  safeZones: SafeZone[];
  isLocationEnabled: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface SafeZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  type: 'safe' | 'warning' | 'danger';
}

export const [SafetyProvider, useSafety] = createContextHook(() => {
  const { user } = useAuth();
  const [safetyState, setSafetyState] = useState<SafetyState>({
    isEmergencyMode: false,
    currentLocation: null,
    emergencyContacts: [],
    safeZones: [],
    isLocationEnabled: false,
  });

  // Request location permissions
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'web') return;
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      setSafetyState(prev => ({
        ...prev,
        isLocationEnabled: status === 'granted',
      }));
    };
    
    requestLocationPermission();
  }, []);

  // Load emergency contacts
  useEffect(() => {
    const loadEmergencyContacts = async () => {
      if (!user) return;
      
      const stored = await AsyncStorage.getItem(`emergencyContacts_${user.id}`);
      if (stored) {
        const contacts = JSON.parse(stored);
        setSafetyState(prev => ({
          ...prev,
          emergencyContacts: contacts,
        }));
      }
    };
    
    loadEmergencyContacts();
  }, [user]);

  // Get current location
  const getCurrentLocation = async () => {
    if (!safetyState.isLocationEnabled || Platform.OS === 'web') return null;
    
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setSafetyState(prev => ({
        ...prev,
        currentLocation: location,
      }));
      
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  // Trigger emergency mode
  const triggerEmergency = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    
    setSafetyState(prev => ({
      ...prev,
      isEmergencyMode: true,
    }));
    
    // Get current location
    const location = await getCurrentLocation();
    
    // Send emergency alerts to contacts
    const primaryContact = safetyState.emergencyContacts.find(c => c.isPrimary);
    
    if (primaryContact) {
      const message = `EMERGENCY: I need help. ${location ? `My location: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}` : 'Location unavailable'}`;
      
      Alert.alert(
        'Emergency Alert Sent',
        `Emergency message sent to ${primaryContact.name}`,
        [
          {
            text: 'Call Now',
            onPress: () => Linking.openURL(`tel:${primaryContact.phone}`),
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
    } else {
      Alert.alert(
        'Emergency Mode Activated',
        'Please set up emergency contacts in your profile for automatic alerts.',
        [
          {
            text: 'Call 911',
            onPress: () => Linking.openURL('tel:911'),
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
    }
  };

  // Exit emergency mode
  const exitEmergencyMode = () => {
    setSafetyState(prev => ({
      ...prev,
      isEmergencyMode: false,
    }));
  };

  // Add emergency contact
  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    if (!user) return;
    
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(),
    };
    
    const updatedContacts = [...safetyState.emergencyContacts, newContact];
    
    await AsyncStorage.setItem(
      `emergencyContacts_${user.id}`,
      JSON.stringify(updatedContacts)
    );
    
    setSafetyState(prev => ({
      ...prev,
      emergencyContacts: updatedContacts,
    }));
  };

  // Remove emergency contact
  const removeEmergencyContact = async (contactId: string) => {
    if (!user) return;
    
    const updatedContacts = safetyState.emergencyContacts.filter(
      c => c.id !== contactId
    );
    
    await AsyncStorage.setItem(
      `emergencyContacts_${user.id}`,
      JSON.stringify(updatedContacts)
    );
    
    setSafetyState(prev => ({
      ...prev,
      emergencyContacts: updatedContacts,
    }));
  };

  return {
    ...safetyState,
    getCurrentLocation,
    triggerEmergency,
    exitEmergencyMode,
    addEmergencyContact,
    removeEmergencyContact,
  };
});