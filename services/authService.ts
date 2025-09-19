/**
 * Authentication Service for Kintara GBV Platform
 * Handles all authentication-related API calls
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest, API_CONFIG, ApiError, STORAGE_KEYS } from './api';

// Types matching the Django backend
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  role: 'survivor' | 'provider' | 'admin';
  is_anonymous?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'survivor' | 'provider' | 'admin';
  role_display: string;
  is_anonymous: boolean;
  biometric_enabled: boolean;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
}

export interface UserRole {
  value: string;
  label: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        false // Don't include auth headers for registration
      );

      if (response.success && response.tokens) {
        await this.storeAuthData(response.user, response.tokens);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Registration failed', 0, error);
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        false // Don't include auth headers for login
      );

      if (response.success && response.tokens) {
        await this.storeAuthData(response.user, response.tokens);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Login failed', 0, error);
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (refreshToken) {
        // Call backend logout to blacklist token
        await apiRequest(
          API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
          {
            method: 'POST',
            body: JSON.stringify({ refresh: refreshToken }),
          },
          true
        );
      }
    } catch (error) {
      // Even if backend logout fails, we still clear local data
      console.warn('Backend logout failed:', error);
    } finally {
      // Always clear local auth data
      await this.clearAuthData();
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<{ success: boolean; user: User }> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE,
        { method: 'GET' },
        true
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to get profile', 0, error);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateProfileRequest): Promise<{ success: boolean; user: User }> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        },
        true
      );

      // Update stored user data
      if (response.success && response.user) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update profile', 0, error);
    }
  }

  /**
   * Enable biometric authentication
   */
  static async enableBiometric(): Promise<{ success: boolean; biometric_enabled: boolean }> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.AUTH.BIOMETRIC_ENABLE,
        { method: 'POST' },
        true
      );

      if (response.success) {
        await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to enable biometric', 0, error);
    }
  }

  /**
   * Disable biometric authentication
   */
  static async disableBiometric(): Promise<{ success: boolean; biometric_enabled: boolean }> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.AUTH.BIOMETRIC_DISABLE,
        { method: 'POST' },
        true
      );

      if (response.success) {
        await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'false');
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to disable biometric', 0, error);
    }
  }

  /**
   * Get available user roles
   */
  static async getUserRoles(): Promise<{ success: boolean; roles: UserRole[] }> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.AUTH.ROLES,
        { method: 'GET' },
        false
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to get user roles', 0, error);
    }
  }

  /**
   * Check API health
   */
  static async healthCheck(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.AUTH.HEALTH,
        { method: 'GET' },
        false
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Health check failed', 0, error);
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        return false;
      }

      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        },
        false
      );

      if (response.success && response.access) {
        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access);
        
        // Update refresh token if provided
        if (response.refresh) {
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh);
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Store authentication data securely
   */
  private static async storeAuthData(user: User, tokens: { access: string; refresh: string }): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, tokens.access],
        [STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
        [STORAGE_KEYS.BIOMETRIC_ENABLED, user.biometric_enabled.toString()],
        [STORAGE_KEYS.LAST_LOGIN, new Date().toISOString()],
      ]);
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw new ApiError('Failed to store authentication data', 0, error);
    }
  }

  /**
   * Clear all authentication data
   */
  private static async clearAuthData(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  /**
   * Get stored authentication data
   */
  static async getStoredAuthData(): Promise<{
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    biometricEnabled: boolean;
  }> {
    try {
      const [userData, accessToken, refreshToken, biometricEnabled] = await AsyncStorage.multiGet([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.BIOMETRIC_ENABLED,
      ]);

      return {
        user: userData[1] ? JSON.parse(userData[1]) : null,
        accessToken: accessToken[1],
        refreshToken: refreshToken[1],
        biometricEnabled: biometricEnabled[1] === 'true',
      };
    } catch (error) {
      console.error('Failed to get stored auth data:', error);
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        biometricEnabled: false,
      };
    }
  }

  /**
   * Check if user is authenticated (has valid tokens)
   */
  static async isAuthenticated(): Promise<boolean> {
    const { accessToken, refreshToken } = await this.getStoredAuthData();
    return !!(accessToken && refreshToken);
  }
}
