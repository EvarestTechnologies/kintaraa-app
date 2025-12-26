/**
 * Incidents API Service
 * Handles all API calls related to incident management
 */

import { apiRequest, API_CONFIG } from './api';

// Extract incident endpoints for easier access
const ENDPOINTS = API_CONFIG.ENDPOINTS.INCIDENTS;

/**
 * Data structure for creating a new incident
 * Maps to the backend IncidentCreateSerializer
 */
export interface CreateIncidentPayload {
  type: 'physical' | 'sexual' | 'emotional' | 'economic' | 'online' | 'femicide';
  incident_date: string; // YYYY-MM-DD format
  incident_time: string; // HH:MM:SS format
  description: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    description?: string;
  };
  severity: 'low' | 'medium' | 'high';
  support_services: string[]; // ['medical', 'legal', 'counseling', etc.]
  urgency_level: 'routine' | 'urgent' | 'immediate';
  provider_preferences?: {
    communicationMethod: 'sms' | 'call' | 'secure_message';
    preferredGender?: 'male' | 'female' | 'no_preference';
    proximityPreference?: 'nearest' | 'specific_facility';
  };
  is_anonymous: boolean;
  voice_recording?: any; // File upload - will be handled separately
  voice_recording_duration?: number;
  voice_transcription?: string;
}

/**
 * Incident response from backend
 * Maps to the backend IncidentDetailSerializer
 */
export interface IncidentResponse {
  id: string;
  case_number: string;
  type: string;
  incident_type_display: string;
  status: string;
  status_display: string;
  severity: string;
  severity_display: string;
  urgency_level: string;
  urgency_display: string;
  incident_date: string;
  incident_time: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    description?: string;
  };
  support_services: string[];
  provider_preferences?: {
    communicationMethod: string;
    preferredGender?: string;
    proximityPreference?: string;
  };
  is_anonymous: boolean;
  voice_recording?: string;
  voice_recording_duration?: number;
  voice_transcription?: string;
  message_count: number;
  date_submitted: string;
  last_updated: string;
}

/**
 * Simplified incident for list view
 * Maps to the backend IncidentListSerializer
 */
export interface IncidentListItem {
  id: string;
  case_number: string;
  type: string;
  incident_type_display: string;
  status: string;
  status_display: string;
  date_submitted: string;
  urgency_level: string;
  message_count: number;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    description?: string;
  };
}

/**
 * Dashboard statistics
 */
export interface IncidentStats {
  total_incidents: number;
  by_status: {
    new: number;
    assigned: number;
    in_progress: number;
    completed: number;
    closed: number;
  };
  by_type: Array<{
    type: string;
    count: number;
  }>;
  recent_incidents: number;
}

/**
 * Create a new incident report
 */
export const createIncident = async (
  data: CreateIncidentPayload
): Promise<IncidentResponse> => {
  return apiRequest(ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Get list of survivor's incidents
 * @param filters Optional filters (status, type, sort)
 */
export const getIncidents = async (filters?: {
  status?: string;
  type?: string;
  sort?: string;
}): Promise<IncidentListItem[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.sort) params.append('sort', filters.sort);

  const queryString = params.toString();
  const endpoint = queryString ? `${ENDPOINTS.LIST}?${queryString}` : ENDPOINTS.LIST;

  return apiRequest(endpoint, { method: 'GET' });
};

/**
 * Get detailed information about a specific incident
 */
export const getIncidentDetail = async (id: string): Promise<IncidentResponse> => {
  const endpoint = ENDPOINTS.DETAIL.replace('{id}', id);
  return apiRequest(endpoint, { method: 'GET' });
};

/**
 * Update an incident (limited fields)
 */
export const updateIncident = async (
  id: string,
  data: {
    description?: string;
    support_services?: string[];
    provider_preferences?: any;
  }
): Promise<IncidentResponse> => {
  const endpoint = ENDPOINTS.DETAIL.replace('{id}', id);
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

/**
 * Soft delete an incident
 */
export const deleteIncident = async (id: string): Promise<void> => {
  const endpoint = ENDPOINTS.DETAIL.replace('{id}', id);
  return apiRequest(endpoint, { method: 'DELETE' });
};

/**
 * Get dashboard statistics for survivor
 */
export const getIncidentStats = async (): Promise<IncidentStats> => {
  return apiRequest(ENDPOINTS.STATS, { method: 'GET' });
};

/**
 * Upload voice recording for incident
 * Note: This is a separate endpoint that should be called before creating the incident
 */
export const uploadVoiceRecording = async (
  file: File | Blob,
  duration?: number
): Promise<{
  success: boolean;
  file_name: string;
  file_size: number;
  duration?: number;
  transcription?: string;
  message: string;
}> => {
  const formData = new FormData();
  formData.append('file', file);
  if (duration) {
    formData.append('duration', duration.toString());
  }

  return apiRequest(
    ENDPOINTS.UPLOAD_VOICE,
    {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type - let the browser set it with boundary
      },
    },
    true
  );
};
