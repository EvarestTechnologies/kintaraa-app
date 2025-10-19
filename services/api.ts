/**
 * API Configuration for Kintara GBV Platform
 * Handles base URL, headers, and authentication setup
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../constants/config';

// API Configuration using centralized config
export const API_CONFIG = {
  // Base URL from centralized configuration
  BASE_URL: APP_CONFIG.API.BASE_URL,
  
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register/',
      LOGIN: '/auth/login/',
      LOGOUT: '/auth/logout/',
      REFRESH: '/auth/refresh/',
      PROFILE: '/auth/me/',
      UPDATE_PROFILE: '/auth/me/update/',
      HEALTH: '/auth/health/',
      ROLES: '/auth/roles/',
      BIOMETRIC_ENABLE: '/auth/biometric/enable/',
      BIOMETRIC_DISABLE: '/auth/biometric/disable/',
    },
    // Incident & Case Management endpoints
    INCIDENTS: {
      LIST: '/api/incidents/',
      CREATE: '/api/incidents/',
      DETAIL: '/api/incidents/{id}/',
      UPDATE: '/api/incidents/{id}/',
      DELETE: '/api/incidents/{id}/',
      STATUS: '/api/incidents/{id}/status/',
      TIMELINE: '/api/incidents/{id}/timeline/',
      NOTES: '/api/incidents/{id}/notes/',
      EVIDENCE: '/api/incidents/{id}/evidence/',
    },
    CASES: {
      ASSIGNED: '/api/cases/assigned-to-me/',
      ACCEPT: '/api/cases/{id}/accept/',
      REJECT: '/api/cases/{id}/reject/',
      RESPOND: '/api/cases/{id}/respond/',
    },
    // Provider Routing & Availability endpoints
    ROUTING: {
      ASSIGN_PROVIDERS: '/api/routing/assign-providers/',
      AVAILABLE_PROVIDERS: '/api/providers/available/',
    },
    PROVIDERS: {
      AVAILABILITY: '/api/providers/{id}/availability/',
      PROFILE: '/api/providers/{id}/',
    },
    // Notification endpoints
    NOTIFICATIONS: {
      LIST: '/api/notifications/',
      SEND: '/api/notifications/send/',
      READ: '/api/notifications/{id}/read/',
      REGISTER_TOKEN: '/api/notifications/register-token/',
      UNREAD_COUNT: '/api/notifications/unread-count/',
    },
    // Communication endpoints (SMS/Call)
    COMMUNICATIONS: {
      SEND_SMS: '/api/communications/send-sms/',
      INITIATE_CALL: '/api/communications/initiate-call/',
      TEMPLATES: '/api/communications/templates/',
      LOG: '/api/communications/log/',
      HISTORY: '/api/cases/{id}/communications/',
    },
  },
  
  TIMEOUT: APP_CONFIG.API.TIMEOUT,
};

// Request configuration with authentication
export const createApiConfig = async (includeAuth = true) => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (includeAuth) {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }

  return config;
};

// API request wrapper with error handling
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  includeAuth = true
): Promise<any> => {
  try {
    const config = await createApiConfig(includeAuth);
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...config,
      ...options,
      headers: {
        ...config.headers,
        ...options.headers,
      },
    });

    // Handle non-JSON responses (like 204 No Content)
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    const data = hasJsonContent ? await response.json() : null;

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // Token might be expired, try to refresh
        const refreshSuccess = await refreshAuthToken();
        if (refreshSuccess) {
          // Retry the original request with new token
          return apiRequest(endpoint, options, includeAuth);
        } else {
          // Refresh failed, redirect to login
          throw new ApiError('Authentication failed', 401, data);
        }
      }

      throw new ApiError(
        data?.message || `HTTP Error: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      'Network error. Please check your connection.',
      0,
      null
    );
  }
};

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: any = null
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Get detailed error message from backend validation errors
   */
  getDetailedMessage(): string {
    if (!this.data?.errors) {
      return this.message;
    }

    // Parse Django REST framework validation errors
    const errors = this.data.errors;
    const errorMessages: string[] = [];

    // Handle field-specific errors
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((error: string) => {
          // Format field name for display
          const fieldName = field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          errorMessages.push(`${fieldName}: ${error}`);
        });
      } else if (typeof fieldErrors === 'string') {
        const fieldName = field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        errorMessages.push(`${fieldName}: ${fieldErrors}`);
      }
    });

    // Handle non_field_errors (general validation errors)
    if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
      errorMessages.push(...errors.non_field_errors);
    }

    // Return formatted error message or fallback to generic message
    return errorMessages.length > 0 ? errorMessages.join('\n') : this.message;
  }

  /**
   * Get a concise error message for UI display
   */
  getConciseMessage(): string {
    if (!this.data?.errors) {
      return this.message;
    }

    const errors = this.data.errors;
    
    // For registration/login, prioritize common fields
    const priorityFields = ['email', 'password', 'confirm_password', 'first_name', 'last_name'];
    
    for (const field of priorityFields) {
      if (errors[field]) {
        const fieldErrors = errors[field];
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          return fieldErrors[0];
        }
        if (typeof fieldErrors === 'string') {
          return fieldErrors;
        }
      }
    }

    // Handle non_field_errors
    if (errors.non_field_errors && Array.isArray(errors.non_field_errors) && errors.non_field_errors.length > 0) {
      return errors.non_field_errors[0];
    }

    // Return first error from any field
    const firstField = Object.keys(errors)[0];
    if (firstField && errors[firstField]) {
      const fieldErrors = errors[firstField];
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        return fieldErrors[0];
      }
      if (typeof fieldErrors === 'string') {
        return fieldErrors;
      }
    }

    return this.message;
  }
}

// Token refresh function
const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    if (!refreshToken) {
      return false;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem('access_token', data.access);
      
      // Update refresh token if provided
      if (data.refresh) {
        await AsyncStorage.setItem('refresh_token', data.refresh);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

// Utility function to check if we're in development
export const isDevelopment = __DEV__;

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Storage keys constants from centralized config
export const STORAGE_KEYS = APP_CONFIG.STORAGE;

// Helper function to clear all auth data
export const clearAuthData = async (): Promise<void> => {
  const keys = Object.values(STORAGE_KEYS);
  await AsyncStorage.multiRemove(keys);
};
