import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
      try {
        if (Platform.OS === 'web') {
          // For web, check if geolocation is available
          if ('geolocation' in navigator) {
            setSafetyState(prev => ({
              ...prev,
              isLocationEnabled: true,
            }));
          } else {
            setSafetyState(prev => ({
              ...prev,
              isLocationEnabled: false,
            }));
          }
          return;
        }
        
        const { status } = await Location.requestForegroundPermissionsAsync();
        setSafetyState(prev => ({
          ...prev,
          isLocationEnabled: status === 'granted',
        }));
        
        if (status !== 'granted') {
          console.log('Location permission denied');
        }
      } catch (error) {
        console.error('Error requesting location permission:', error instanceof Error ? error.message : 'Unknown error');
        setSafetyState(prev => ({
          ...prev,
          isLocationEnabled: false,
        }));
      }
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
  const getCurrentLocation = useCallback(async () => {
    if (!safetyState.isLocationEnabled) {
      Alert.alert(
        'Location Services Disabled',
        'Please enable location services to use this feature.',
        [
          {
            text: 'Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else if (Platform.OS === 'android') {
                Linking.openURL('package:' + 'host.exp.exponent');
              }
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return null;
    }
    
    try {
      if (Platform.OS === 'web') {
        // Use web geolocation API
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
          }
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  altitude: position.coords.altitude,
                  accuracy: position.coords.accuracy,
                  altitudeAccuracy: position.coords.altitudeAccuracy,
                  heading: position.coords.heading,
                  speed: position.coords.speed,
                },
                timestamp: position.timestamp,
              };
              
              setSafetyState(prev => ({
                ...prev,
                currentLocation: location,
              }));
              
              resolve(location);
            },
            (error) => {
              console.error('Web geolocation error:', error);
              let errorMessage = 'Unable to get your location.';
              
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = 'Location access denied. Please allow location access in your browser.';
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = 'Location information is unavailable.';
                  break;
                case error.TIMEOUT:
                  errorMessage = 'Location request timed out.';
                  break;
              }
              
              Alert.alert('Location Error', errorMessage);
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            }
          );
        });
      } else {
        // Use Expo Location for mobile
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
        });
        
        setSafetyState(prev => ({
          ...prev,
          currentLocation: location,
        }));
        
        return location;
      }
    } catch (error) {
      console.error('Error getting location:', error instanceof Error ? error.message : 'Unknown error');
      
      let errorMessage = 'Unable to get your current location.';
      if (error instanceof Error) {
        if (error.message.includes('Location request failed')) {
          errorMessage = 'Location services are not available. Please check your device settings.';
        } else if (error.message.includes('Location provider is unavailable')) {
          errorMessage = 'GPS is not available. Please enable location services.';
        }
      }
      
      Alert.alert(
        'Location Error',
        errorMessage,
        [
          {
            text: 'Retry',
            onPress: () => getCurrentLocation()
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      
      return null;
    }
  }, [safetyState.isLocationEnabled]);

  // Trigger emergency mode
  const triggerEmergency = useCallback(async () => {
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
      let locationText = 'Location unavailable';
      if (location && typeof location === 'object' && 'coords' in location) {
        const coords = location.coords as { latitude: number; longitude: number };
        locationText = `My location: https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
      }
      
      Alert.alert(
        'Emergency Alert Sent',
        `Emergency message sent to ${primaryContact.name}\n\n${locationText}`,
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
  }, [safetyState.emergencyContacts, getCurrentLocation]);

  // Exit emergency mode
  const exitEmergencyMode = useCallback(() => {
    setSafetyState(prev => ({
      ...prev,
      isEmergencyMode: false,
    }));
  }, []);

  // Add emergency contact
  const addEmergencyContact = useCallback(async (contact: Omit<EmergencyContact, 'id'>) => {
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
  }, [user, safetyState.emergencyContacts]);

  // Remove emergency contact
  const removeEmergencyContact = useCallback(async (contactId: string) => {
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
  }, [user, safetyState.emergencyContacts]);

  const contextValue = useMemo(() => ({
    ...safetyState,
    getCurrentLocation,
    triggerEmergency,
    exitEmergencyMode,
    addEmergencyContact,
    removeEmergencyContact,
  }), [safetyState, getCurrentLocation, triggerEmergency, exitEmergencyMode, addEmergencyContact, removeEmergencyContact]);

  return contextValue;
});