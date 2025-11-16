/**
 * App Configuration Constants
 * Central place for all app configuration including API URLs, feature flags, etc.
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Environment detection
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

/**
 * Dynamically get the local development machine IP address
 * Works for any developer's machine automatically
 */
const getLocalDevIP = (): string => {
  // Expo provides the debugger host which contains the dev server IP
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    // Extract IP from "192.168.1.100:19000" format
    const ip = debuggerHost.split(':')[0];
    return ip;
  }

  // Fallback to localhost if we can't detect IP
  return '127.0.0.1';
};

/**
 * Get the appropriate API base URL based on environment and platform
 *
 * - Web (localhost): http://127.0.0.1:8000/api
 * - Mobile (development): http://<DYNAMIC_IP>:8000/api (automatically detects your computer's IP)
 * - Production: https://api-kintara.onrender.com/api
 */
const getApiBaseUrl = (): string => {
  // TEMPORARY: Always use production backend for testing
  // TODO: Remove this override when local backend setup is complete
  return 'https://api-kintara.onrender.com/api';

  /* Original logic - uncomment when testing with local backend:
  if (isProduction) {
    return 'https://api-kintara.onrender.com/api';
  }

  // Development mode
  const backendPort = 8000; // Django backend port

  if (Platform.OS === 'web') {
    // Web uses localhost
    return `http://127.0.0.1:${backendPort}/api`;
  } else {
    // Mobile uses dynamically detected local network IP
    const localIP = getLocalDevIP();
    return `http://${localIP}:${backendPort}/api`;
  }
  */
};

// API Configuration
export const APP_CONFIG = {
  // API Settings
  API: {
    // Automatically select the right URL based on platform and environment
    BASE_URL: getApiBaseUrl(),

    // Production URL
    PROD_BASE_URL: 'https://api-kintara.onrender.com/api',

    TIMEOUT: 10000, // 10 seconds
  },
  
  // Authentication Settings
  AUTH: {
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh token 5 minutes before expiry
    MAX_LOGIN_ATTEMPTS: 3,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    BIOMETRIC_PROMPT_MESSAGE: 'Authenticate to access Kintaraa',
  },
  
  // Storage Keys
  STORAGE: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    BIOMETRIC_ENABLED: 'biometric_enabled',
    LAST_LOGIN: 'last_login',
    LOGIN_ATTEMPTS: 'login_attempts',
    LAST_ATTEMPT_TIME: 'last_attempt_time',
  },
  
  // Feature Flags
  FEATURES: {
    BIOMETRIC_AUTH: true,
    ANONYMOUS_REPORTING: true,
    OFFLINE_MODE: false, // Future feature
    PUSH_NOTIFICATIONS: true,
    REAL_TIME_MESSAGING: false, // Will be enabled with WebSocket implementation
  },
  
  // App Metadata
  APP: {
    NAME: 'Kintaraa',
    VERSION: '1.0.0',
    BUILD_NUMBER: 1,
    SUPPORT_EMAIL: 'support@kintaraa.com',
    PRIVACY_URL: 'https://kintaraa.com/privacy',
    TERMS_URL: 'https://kintaraa.com/terms',
  },
  
  // UI Constants
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    TOAST_DURATION: 3000,
    LOADING_TIMEOUT: 30000, // 30 seconds
  },
  
  // Validation Rules
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_REQUIRE_UPPERCASE: true,
    PASSWORD_REQUIRE_LOWERCASE: true,
    PASSWORD_REQUIRE_NUMBERS: true,
    PASSWORD_REQUIRE_SPECIAL: true,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

// User Roles
export const USER_ROLES = {
  SURVIVOR: 'survivor' as const,
  PROVIDER: 'provider' as const,
  ADMIN: 'admin' as const,
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.SURVIVOR]: 'Survivor',
  [USER_ROLES.PROVIDER]: 'Service Provider',
  [USER_ROLES.ADMIN]: 'Administrator',
};

// Provider Types
export const PROVIDER_TYPES = {
  HEALTHCARE: 'healthcare' as const,
  LEGAL: 'legal' as const,
  POLICE: 'police' as const,
  COUNSELING: 'counseling' as const,
  SOCIAL: 'social' as const,
  GBV_RESCUE: 'gbv_rescue' as const,
  CHW: 'chw' as const,
};

export const PROVIDER_TYPE_LABELS = {
  [PROVIDER_TYPES.HEALTHCARE]: 'Healthcare Provider',
  [PROVIDER_TYPES.LEGAL]: 'Legal Professional',
  [PROVIDER_TYPES.POLICE]: 'Law Enforcement',
  [PROVIDER_TYPES.COUNSELING]: 'Counselor/Therapist',
  [PROVIDER_TYPES.SOCIAL]: 'Social Services',
  [PROVIDER_TYPES.GBV_RESCUE]: 'GBV Rescue Organization',
  [PROVIDER_TYPES.CHW]: 'Community Health Worker',
};

// Common Colors (can be extended with theme later)
export const COLORS = {
  PRIMARY: '#6366F1', // Indigo
  SECONDARY: '#8B5CF6', // Purple
  SUCCESS: '#10B981', // Green
  WARNING: '#F59E0B', // Amber
  ERROR: '#EF4444', // Red
  INFO: '#3B82F6', // Blue
  
  // Neutrals
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',
};

// Debug Configuration
export const DEBUG_CONFIG = {
  ENABLE_LOGS: isDevelopment,
  ENABLE_API_LOGS: isDevelopment,
  ENABLE_STATE_LOGS: isDevelopment,
  LOG_LEVEL: isDevelopment ? 'debug' : 'error',
};

// Log API configuration on startup (development only)
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    platform: Platform.OS,
    baseUrl: APP_CONFIG.API.BASE_URL,
    detectedIP: getLocalDevIP(),
    isProduction: isProduction,
  });
}

// Type exports for TypeScript
export type UserRole = keyof typeof USER_ROLES;
export type ProviderType = keyof typeof PROVIDER_TYPES;
