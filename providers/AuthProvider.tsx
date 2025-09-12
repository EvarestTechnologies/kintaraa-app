import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface User {
  id: string;
  email: string;
  role: 'survivor' | 'provider' | 'admin';
  firstName: string;
  lastName: string;
  isAnonymous: boolean;
  biometricEnabled: boolean;
  emergencyContacts: EmergencyContact[];
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricAvailable: boolean;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    biometricAvailable: false,
  });

  const queryClient = useQueryClient();

  // Check biometric availability
  useEffect(() => {
    const checkBiometric = async () => {
      if (Platform.OS === 'web') return;
      
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      setAuthState(prev => ({
        ...prev,
        biometricAvailable: hasHardware && isEnrolled,
      }));
    };
    
    checkBiometric();
  }, []);

  // Load stored user data
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const userData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('authToken');
      
      if (userData && token) {
        return JSON.parse(userData) as User;
      }
      return null;
    },
  });

  useEffect(() => {
    setAuthState(prev => ({
      ...prev,
      user: userQuery.data || null,
      isAuthenticated: !!userQuery.data,
      isLoading: userQuery.isLoading,
    }));
  }, [userQuery.data, userQuery.isLoading]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password, useBiometric = false }: { 
      email: string; 
      password: string; 
      useBiometric?: boolean; 
    }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (useBiometric && authState.biometricAvailable) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to access Kintaraa',
          cancelLabel: 'Cancel',
          fallbackLabel: 'Use Password',
        });
        
        if (!result.success) {
          throw new Error('Biometric authentication failed');
        }
      }
      
      // Mock user data
      const user: User = {
        id: '1',
        email,
        role: 'survivor',
        firstName: 'Safe',
        lastName: 'User',
        isAnonymous: false,
        biometricEnabled: useBiometric,
        emergencyContacts: [],
        createdAt: new Date().toISOString(),
      };
      
      return { user, token: 'mock-jwt-token' };
    },
    onSuccess: async ({ user, token }) => {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('authToken', token);
      
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
      
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      isAnonymous: boolean;
      role: 'survivor' | 'provider';
    }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: Date.now().toString(),
        ...userData,
        biometricEnabled: false,
        emergencyContacts: [],
        createdAt: new Date().toISOString(),
      };
      
      return { user, token: 'mock-jwt-token' };
    },
    onSuccess: async ({ user, token }) => {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('authToken', token);
      
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
      
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.multiRemove(['user', 'authToken']);
    },
    onSuccess: () => {
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
      
      queryClient.clear();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const updatedUser = { ...authState.user!, ...updates };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    ...authState,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateUser: updateUserMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
});