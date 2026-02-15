import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

// Import real authentication service
import { AuthService, User as ApiUser, LoginRequest, RegisterRequest } from '../services/authService';
import { ApiError } from '../services/api';

export type ProviderType = 'healthcare' | 'legal' | 'police' | 'counseling' | 'social' | 'gbv_rescue' | 'chw';

// Enhanced User interface matching Django backend
export interface User {
  id: string;
  email: string;
  role: 'survivor' | 'provider' | 'dispatcher' | 'admin';
  providerType?: ProviderType; // For future provider implementation
  firstName: string;
  lastName: string;
  fullName: string;
  isAnonymous: boolean;
  biometricEnabled: boolean;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  // Keep legacy fields for backward compatibility
  emergencyContacts?: EmergencyContact[];
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
  isOnline: boolean;
}

// Convert API user to app user format
const convertApiUserToAppUser = (apiUser: ApiUser): User => {
  console.log('🔄 Converting API user to app user:', {
    email: apiUser.email,
    apiRole: apiUser.role,
    roleType: typeof apiUser.role,
  });

  const user = {
    id: apiUser.id,
    email: apiUser.email,
    role: apiUser.role,
    providerType: apiUser.provider_type as ProviderType, // Map provider_type from backend
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    fullName: apiUser.full_name,
    isAnonymous: apiUser.is_anonymous,
    biometricEnabled: apiUser.biometric_enabled,
    isActive: apiUser.is_active,
    lastLogin: apiUser.last_login,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
    emergencyContacts: [], // Default empty for now
  };

  console.log('✅ Converted user role:', user.role, '(type:', typeof user.role, ')');
  return user;
};

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    biometricAvailable: false,
    isOnline: true,
  });

  const queryClient = useQueryClient();

  // Check biometric availability
  useEffect(() => {
    const checkBiometric = async () => {
      if (Platform.OS === 'web') return;
      
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        
        setAuthState(prev => ({
          ...prev,
          biometricAvailable: hasHardware && isEnrolled,
        }));
      } catch (error) {
        console.warn('Biometric check failed:', error);
      }
    };
    
    checkBiometric();
  }, []);

  // Load stored user data on app start
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const authData = await AuthService.getStoredAuthData();
        
        if (authData.user && authData.accessToken) {
          // Verify token is still valid by fetching profile
          try {
            const profileResponse = await AuthService.getProfile();
            if (profileResponse.success) {
              return convertApiUserToAppUser(profileResponse.user);
            }
          } catch (error) {
            console.warn('Token validation failed, user needs to login again:', error);
            // Clear invalid auth data
            await AuthService.logout();
            return null;
          }
        }
        
        return authData.user ? convertApiUserToAppUser(authData.user) : null;
      } catch (error) {
        console.error('Failed to load user data:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update auth state when user data changes
  useEffect(() => {
    setAuthState(prev => ({
      ...prev,
      user: userQuery.data || null,
      isAuthenticated: !!userQuery.data,
      isLoading: userQuery.isLoading,
    }));
  }, [userQuery.data, userQuery.isLoading]);

  // Health check mutation
  const healthCheckMutation = useMutation({
    mutationFn: AuthService.healthCheck,
    onSuccess: () => {
      setAuthState(prev => ({ ...prev, isOnline: true }));
    },
    onError: () => {
      setAuthState(prev => ({ ...prev, isOnline: false }));
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      useBiometric = false 
    }: { 
      email: string; 
      password: string; 
      useBiometric?: boolean; 
    }) => {
      // Handle biometric authentication if requested
      if (useBiometric && authState.biometricAvailable) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to access Kintaraa',
          cancelLabel: 'Cancel',
          fallbackLabel: 'Use Password',
          disableDeviceFallback: false,
        });
        
        if (!result.success) {
          throw new Error('Biometric authentication failed');
        }
      }
      
      // Call real authentication API
      const loginData: LoginRequest = { email, password };
      const response = await AuthService.login(loginData);
      
      return convertApiUserToAppUser(response.user);
    },
    onSuccess: async (user) => {
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
      
      // Refresh user query cache
      queryClient.setQueryData(['user'], user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      console.error('Login failed:', getDetailedErrorMessage(error));
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      confirmPassword: string;
      firstName: string;
      lastName: string;
      isAnonymous: boolean;
      role: 'survivor' | 'provider';
      providerType?: ProviderType;
    }) => {
      const registerData: RegisterRequest = {
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirmPassword,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        provider_type: userData.providerType,
        is_anonymous: userData.isAnonymous,
      };
      
      const response = await AuthService.register(registerData);
      return convertApiUserToAppUser(response.user);
    },
    onSuccess: async (user) => {
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
      
      // Refresh user query cache
      queryClient.setQueryData(['user'], user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      console.error('Registration failed:', getDetailedErrorMessage(error));
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
      
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error: Error) => {
      console.error('Logout failed:', getDetailedErrorMessage(error));
      // Even if logout fails, clear local state
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
      queryClient.clear();
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (updates: { firstName?: string; lastName?: string }) => {
      const response = await AuthService.updateProfile({
        first_name: updates.firstName,
        last_name: updates.lastName,
      });
      
      return convertApiUserToAppUser(response.user);
    },
    onSuccess: (updatedUser) => {
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      queryClient.setQueryData(['user'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      console.error('Update user failed:', getDetailedErrorMessage(error));
    },
  });

  // Biometric toggle mutations
  const enableBiometricMutation = useMutation({
    mutationFn: AuthService.enableBiometric,
    onSuccess: () => {
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, biometricEnabled: true } : null,
      }));
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const disableBiometricMutation = useMutation({
    mutationFn: AuthService.disableBiometric,
    onSuccess: () => {
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, biometricEnabled: false } : null,
      }));
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Check API connection on mount
  useEffect(() => {
    healthCheckMutation.mutate();
  }, []);

  // Helper function to get error message from ApiError
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof ApiError) {
      return error.getConciseMessage();
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  // Helper function to get detailed error message for logging
  const getDetailedErrorMessage = (error: unknown): string => {
    if (error instanceof ApiError) {
      return error.getDetailedMessage();
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  return {
    ...authState,
    // Auth actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateUserMutation.mutate,
    enableBiometric: enableBiometricMutation.mutate,
    disableBiometric: disableBiometricMutation.mutate,
    
    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateUserMutation.isPending,
    isEnablingBiometric: enableBiometricMutation.isPending,
    isDisablingBiometric: disableBiometricMutation.isPending,
    
    // Error messages
    loginError: loginMutation.error ? getErrorMessage(loginMutation.error) : null,
    registerError: registerMutation.error ? getErrorMessage(registerMutation.error) : null,
    updateError: updateUserMutation.error ? getErrorMessage(updateUserMutation.error) : null,
    
    // Utility functions
    checkHealth: healthCheckMutation.mutate,
    clearErrors: () => {
      loginMutation.reset();
      registerMutation.reset();
      updateUserMutation.reset();
    },
    
    // Refresh user data
    refreshUser: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  };
});
