/**
 * API Configuration for Kintara GBV Platform
 * Handles base URL, headers, and authentication setup
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../constants/config';
import { apiLog } from '../utils/logger';

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
    // Incidents endpoints
    INCIDENTS: {
      LIST: '/incidents/',
      CREATE: '/incidents/',
      DETAIL: '/incidents/{id}/',
      STATS: '/incidents/stats/',
      UPLOAD_VOICE: '/incidents/upload-voice/',
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

      // Log API error response for debugging
      apiLog.error('API Error Response', {
        status: response.status,
        url: endpoint,
        fullResponse: data,
        hasErrors: !!data?.errors,
        errorKeys: data?.errors ? Object.keys(data.errors) : [],
      });

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
    // Handle both error formats:
    // Format 1 (Authentication): { success, message, errors: {...} }
    // Format 2 (Incidents/DRF): { field: [...], field2: [...] }

    let errors;

    if (this.data?.errors) {
      // Format 1: Wrapped errors
      errors = this.data.errors;
    } else if (this.data && typeof this.data === 'object') {
      // Format 2: Check if data itself contains field errors
      const hasFieldErrors = Object.keys(this.data).some(key =>
        key !== 'success' &&
        key !== 'message' &&
        (Array.isArray(this.data[key]) || typeof this.data[key] === 'string')
      );

      if (hasFieldErrors) {
        errors = this.data;
      } else {
        return this.message;
      }
    } else {
      return this.message;
    }

    // Parse Django REST framework validation errors
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
    // Log error message extraction
    apiLog.debug('Extracting concise error message', {
      hasData: !!this.data,
      hasErrors: !!this.data?.errors,
      dataKeys: this.data ? Object.keys(this.data) : [],
      errors: this.data?.errors,
      fallbackMessage: this.message,
    });

    // Handle both error formats:
    // Format 1 (Authentication): { success, message, errors: {...} }
    // Format 2 (Incidents/DRF): { field: [...], field2: [...] }

    let errors;

    if (this.data?.errors) {
      // Format 1: Wrapped errors (authentication endpoints)
      apiLog.debug('Using wrapped error format (data.errors)');
      errors = this.data.errors;
    } else if (this.data && typeof this.data === 'object') {
      // Format 2: Check if data itself contains field errors (DRF default)
      // DRF validation errors are objects with field names as keys and arrays as values
      const hasFieldErrors = Object.keys(this.data).some(key =>
        key !== 'success' &&
        key !== 'message' &&
        (Array.isArray(this.data[key]) || typeof this.data[key] === 'string')
      );

      if (hasFieldErrors) {
        apiLog.debug('Using unwrapped error format (data is errors)');
        errors = this.data;
      } else {
        apiLog.debug('No errors field in response, using fallback', { message: this.message });
        return this.message;
      }
    } else {
      apiLog.debug('No valid error data, using fallback', { message: this.message });
      return this.message;
    }

    // Prioritize common fields based on context
    // Auth fields: email, password, etc.
    // Incident fields: description, location, type, etc.
    const priorityFields = [
      'email', 'password', 'confirm_password',
      'first_name', 'last_name',
      'description', 'location', 'type', 'severity',
      'urgency_level', 'incident_date', 'incident_time'
    ];

    for (const field of priorityFields) {
      if (errors[field]) {
        const fieldErrors = errors[field];
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          apiLog.debug('Extracted priority field error', { field, error: fieldErrors[0] });
          return fieldErrors[0];
        }
        if (typeof fieldErrors === 'string') {
          apiLog.debug('Extracted priority field error', { field, error: fieldErrors });
          return fieldErrors;
        }
      }
    }

    // Handle non_field_errors
    if (errors.non_field_errors && Array.isArray(errors.non_field_errors) && errors.non_field_errors.length > 0) {
      apiLog.debug('Extracted non_field_errors', { error: errors.non_field_errors[0] });
      return errors.non_field_errors[0];
    }

    // Return first error from any field
    const firstField = Object.keys(errors)[0];
    if (firstField && errors[firstField]) {
      const fieldErrors = errors[firstField];
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        apiLog.debug('Extracted first field error', { field: firstField, error: fieldErrors[0] });
        return fieldErrors[0];
      }
      if (typeof fieldErrors === 'string') {
        apiLog.debug('Extracted first field error', { field: firstField, error: fieldErrors });
        return fieldErrors;
      }
    }

    apiLog.debug('Could not extract any field errors, using fallback', { message: this.message });
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
    apiLog.error('Token refresh failed', error);
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

/**
 * Handle API errors and return user-friendly error messages
 *
 * This function analyzes the error object and returns appropriate error messages
 * based on HTTP status codes:
 * - 401/403: Authentication errors
 * - 400-499: Client errors (user's fault)
 * - 500-599: Server errors (backend issue)
 * - 0 or undefined: Network errors
 *
 * @param error - The error object from API call
 * @param defaultMessage - Optional default message if no specific error is found
 * @returns Error object with user-friendly message
 */
export const handleApiError = (error: any, defaultMessage?: string): Error => {
  apiLog.error('API Error', error);

  // Authentication errors
  if (error?.status === 401 || error?.status === 403) {
    return new Error('Authentication failed. Please log in again.');
  }

  // Client errors (400-499) - user's fault
  if (error?.status >= 400 && error?.status < 500) {
    // Try to get detailed message from ApiError class
    const message = error?.getConciseMessage?.() ||
                   error?.getDetailedMessage?.() ||
                   error?.message ||
                   'Invalid request. Please check your input and try again.';
    return new Error(message);
  }

  // Server errors (500-599) - backend issue
  if (error?.status >= 500) {
    return new Error('Server error. Please try again later or contact support.');
  }

  // Network errors (no status code or 0)
  if (error?.status === 0 || !error?.status) {
    return new Error('Network error. Please check your internet connection.');
  }

  // Unknown error - use provided default or generic message
  return new Error(
    error?.message ||
    defaultMessage ||
    'An unexpected error occurred. Please try again.'
  );
};
