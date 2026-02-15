/**
 * Incident API Service
 * Handles all incident-related API calls for creating, reading, updating incidents
 */

import { apiRequest, API_CONFIG, ApiError } from './api';

/**
 * Backend Incident Response Format
 * Maps to Django IncidentListSerializer and IncidentDetailSerializer
 */
export interface BackendIncident {
  id: string;
  case_number: string;
  type: string;
  incident_type_display: string;
  status: string;
  status_display: string;
  severity?: string;
  severity_display?: string;
  urgency_level: string;
  urgency_display?: string;
  incident_date?: string; // YYYY-MM-DD
  incident_time?: string; // HH:MM:SS
  description?: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  support_services?: string[];
  provider_preferences?: any;
  is_anonymous?: boolean;
  voice_recording?: string | null;
  voice_recording_duration?: number | null;
  voice_transcription?: string | null;
  message_count: number;
  date_submitted: string; // ISO datetime
  last_updated?: string; // ISO datetime
  assignments?: any[];
}

/**
 * Frontend Incident Format (used throughout the app)
 */
export interface AppIncident {
  id: string;
  caseNumber: string;
  type: string;
  typeDisplay: string;
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  status: 'new' | 'assigned' | 'in_progress' | 'completed' | 'closed';
  statusDisplay: string;
  urgency: 'immediate' | 'urgent' | 'routine';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  supportServices?: string[];
  isAnonymous: boolean;
  reportedAt: Date;
  updatedAt?: Date;
  incidentDate?: Date;
  messageCount: number;
  assignments?: any[];
}

/**
 * Convert backend incident format to frontend format
 */
export const convertBackendIncidentToApp = (backendIncident: BackendIncident): AppIncident => {
  return {
    id: backendIncident.id,
    caseNumber: backendIncident.case_number,
    type: backendIncident.type,
    typeDisplay: backendIncident.incident_type_display,
    description: backendIncident.description || '',
    location: backendIncident.location,
    status: backendIncident.status as any,
    statusDisplay: backendIncident.status_display,
    urgency: backendIncident.urgency_level as any,
    severity: backendIncident.severity as any,
    supportServices: backendIncident.support_services,
    isAnonymous: backendIncident.is_anonymous || false,
    reportedAt: new Date(backendIncident.date_submitted),
    updatedAt: backendIncident.last_updated ? new Date(backendIncident.last_updated) : undefined,
    incidentDate: backendIncident.incident_date ? new Date(backendIncident.incident_date) : undefined,
    messageCount: backendIncident.message_count,
    assignments: backendIncident.assignments,
  };
};

/**
 * Incident Creation Payload
 */
export interface CreateIncidentPayload {
  type: string; // physical_abuse, emotional_abuse, sexual_violence, etc.
  incident_date: string; // YYYY-MM-DD
  incident_time: string; // HH:MM:SS
  description: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    description?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  support_services: string[]; // ['medical', 'legal', 'police', etc.]
  urgency_level: 'immediate' | 'urgent' | 'routine';
  provider_preferences?: {
    communicationMethod: 'sms' | 'call' | 'secure_message';
    preferredGender?: 'male' | 'female' | 'no_preference';
    proximityPreference?: 'nearest' | 'specific_facility';
  };
  is_anonymous?: boolean;
}

/**
 * Incident Service
 */
export const incidentService = {
  /**
   * Get all incidents (filtered by user role on backend)
   * - Survivors see only their own incidents
   * - Providers see assigned incidents
   * - Dispatchers see all incidents
   */
  async getIncidents(): Promise<AppIncident[]> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.INCIDENTS.LIST,
        { method: 'GET' },
        true // requires authentication
      );

      // Convert backend format to app format
      return response.map(convertBackendIncidentToApp);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
      throw error;
    }
  },

  /**
   * Get a single incident by ID
   */
  async getIncidentById(id: string): Promise<AppIncident> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.INCIDENTS.DETAIL.replace('{id}', id);
      const response = await apiRequest(
        endpoint,
        { method: 'GET' },
        true
      );

      return convertBackendIncidentToApp(response);
    } catch (error) {
      console.error(`Failed to fetch incident ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new incident
   */
  async createIncident(data: CreateIncidentPayload): Promise<AppIncident> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.INCIDENTS.CREATE,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        true
      );

      return convertBackendIncidentToApp(response);
    } catch (error) {
      console.error('Failed to create incident:', error);
      throw error;
    }
  },

  /**
   * Update an existing incident
   */
  async updateIncident(id: string, data: Partial<CreateIncidentPayload>): Promise<AppIncident> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.INCIDENTS.DETAIL.replace('{id}', id);
      const response = await apiRequest(
        endpoint,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        },
        true
      );

      return convertBackendIncidentToApp(response);
    } catch (error) {
      console.error(`Failed to update incident ${id}:`, error);
      throw error;
    }
  },

  /**
   * Soft delete an incident
   */
  async deleteIncident(id: string): Promise<void> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.INCIDENTS.DETAIL.replace('{id}', id);
      await apiRequest(
        endpoint,
        { method: 'DELETE' },
        true
      );
    } catch (error) {
      console.error(`Failed to delete incident ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload voice recording for an incident
   * @param file - Audio file blob
   * @param duration - Duration in seconds
   */
  async uploadVoiceRecording(file: Blob, duration: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('voice_recording', file as any);
      formData.append('duration', duration.toString());

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INCIDENTS.UPLOAD_VOICE}`,
        {
          method: 'POST',
          headers: {
            // Don't set Content-Type, let browser set it for FormData
            'Authorization': `Bearer ${await import('@react-native-async-storage/async-storage').then(m => m.default.getItem('access_token'))}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new ApiError('Voice upload failed', response.status, await response.json());
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to upload voice recording:', error);
      throw error;
    }
  },

  /**
   * Get incident statistics (for dashboards)
   */
  async getIncidentStats(): Promise<any> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.INCIDENTS.STATS,
        { method: 'GET' },
        true
      );

      return response;
    } catch (error) {
      console.error('Failed to fetch incident stats:', error);
      throw error;
    }
  },
};
