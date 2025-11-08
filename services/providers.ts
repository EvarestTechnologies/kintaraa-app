/**
 * Providers API Service
 * Handles all API calls related to service provider management
 *
 * NOTE: These endpoints are prepared for backend integration.
 * Currently the backend may not have all provider endpoints implemented yet.
 * When backend endpoints are ready, uncomment and use these functions.
 */

import { apiRequest, API_CONFIG } from './api';

/**
 * Provider profile from backend
 */
export interface ProviderProfile {
  id: string;
  user_id: string;
  provider_type: 'healthcare' | 'legal' | 'police' | 'counseling' | 'social' | 'gbv_rescue' | 'chw';
  organization: string;
  specializations: string[];
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    facility_name?: string;
  };
  contact_info: {
    phone?: string;
    email?: string;
  };
  working_hours: {
    start: string;
    end: string;
    is_24_hours: boolean;
  };
  is_available: boolean;
  current_case_load: number;
  max_case_load: number;
  response_time_minutes: number;
  rating: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Provider assignment from backend
 */
export interface ProviderAssignment {
  id: string;
  incident_id: string;
  provider_id: string;
  provider_type: string;
  priority: number;
  estimated_response_time: number;
  distance: number;
  assigned_at: string;
  accepted_at?: string;
  declined_at?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  notification_sent: boolean;
}

/**
 * Provider statistics
 */
export interface ProviderStats {
  total_cases: number;
  active_cases: number;
  completed_cases: number;
  pending_assignments: number;
  average_response_time: number;
  rating: number;
  total_messages: number;
}

// Add provider endpoints to API config when backend is ready
// These would be added to services/api.ts:
/*
PROVIDERS: {
  LIST: '/providers/',
  DETAIL: '/providers/{id}/',
  MY_PROFILE: '/providers/me/',
  UPDATE_PROFILE: '/providers/me/update/',
  STATS: '/providers/stats/',
  ASSIGNMENTS: '/providers/assignments/',
  ASSIGNMENT_DETAIL: '/providers/assignments/{id}/',
  ACCEPT_ASSIGNMENT: '/providers/assignments/{id}/accept/',
  DECLINE_ASSIGNMENT: '/providers/assignments/{id}/decline/',
  AVAILABILITY: '/providers/me/availability/',
}
*/

/**
 * Get list of available providers
 * Backend endpoint: GET /api/providers/
 */
export const getProviders = async (filters?: {
  provider_type?: string;
  is_available?: boolean;
  location?: { latitude: number; longitude: number; radius_km?: number };
}): Promise<ProviderProfile[]> => {
  const params = new URLSearchParams();
  if (filters?.provider_type) params.append('provider_type', filters.provider_type);
  if (filters?.is_available !== undefined) params.append('is_available', filters.is_available.toString());
  if (filters?.location) {
    params.append('latitude', filters.location.latitude.toString());
    params.append('longitude', filters.location.longitude.toString());
    if (filters.location.radius_km) params.append('radius_km', filters.location.radius_km.toString());
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/providers/?${queryString}` : '/providers/';

  return apiRequest(endpoint, { method: 'GET' });
};

/**
 * Get provider profile by ID
 * Backend endpoint: GET /api/providers/{id}/
 */
export const getProviderProfile = async (id: string): Promise<ProviderProfile> => {
  return apiRequest(`/providers/${id}/`, { method: 'GET' });
};

/**
 * Get current provider's profile
 * Backend endpoint: GET /api/providers/me/
 */
export const getMyProviderProfile = async (): Promise<ProviderProfile> => {
  return apiRequest('/providers/me/', { method: 'GET' });
};

/**
 * Update current provider's profile
 * Backend endpoint: PUT /api/providers/me/update/
 */
export const updateProviderProfile = async (data: {
  specializations?: string[];
  working_hours?: {
    start: string;
    end: string;
    is_24_hours: boolean;
  };
  contact_info?: {
    phone?: string;
    email?: string;
  };
}): Promise<ProviderProfile> => {
  return apiRequest('/providers/me/update/', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Get provider statistics
 * Backend endpoint: GET /api/providers/stats/
 */
export const getProviderStats = async (): Promise<ProviderStats> => {
  return apiRequest('/providers/stats/', { method: 'GET' });
};

/**
 * Get provider assignments (cases assigned to provider)
 * Backend endpoint: GET /api/providers/assignments/
 */
export const getProviderAssignments = async (filters?: {
  status?: 'pending' | 'accepted' | 'declined';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}): Promise<ProviderAssignment[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);

  const queryString = params.toString();
  const endpoint = queryString ? `/providers/assignments/?${queryString}` : '/providers/assignments/';

  return apiRequest(endpoint, { method: 'GET' });
};

/**
 * Accept a case assignment
 * Backend endpoint: POST /api/providers/assignments/{id}/accept/
 */
export const acceptAssignment = async (assignmentId: string): Promise<{
  success: boolean;
  assignment: ProviderAssignment;
  message: string;
}> => {
  return apiRequest(`/providers/assignments/${assignmentId}/accept/`, {
    method: 'POST',
  });
};

/**
 * Decline a case assignment
 * Backend endpoint: POST /api/providers/assignments/{id}/decline/
 */
export const declineAssignment = async (
  assignmentId: string,
  reason?: string
): Promise<{
  success: boolean;
  assignment: ProviderAssignment;
  message: string;
}> => {
  return apiRequest(`/providers/assignments/${assignmentId}/decline/`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
};

/**
 * Update provider availability
 * Backend endpoint: POST /api/providers/me/availability/
 */
export const updateAvailability = async (isAvailable: boolean): Promise<{
  success: boolean;
  is_available: boolean;
  message: string;
}> => {
  return apiRequest('/providers/me/availability/', {
    method: 'POST',
    body: JSON.stringify({ is_available: isAvailable }),
  });
};
