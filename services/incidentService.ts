/**
 * Incident Service - Django API Integration
 * Handles all incident and case management API calls
 */

import { apiRequest, API_CONFIG } from './api';
import type { Incident, CreateIncidentData, Message, Evidence } from '@/providers/IncidentProvider';

/**
 * Incident API Response Types
 */
export interface IncidentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Incident[];
}

export interface CaseAssignment {
  id: string;
  incident: string;
  provider: string;
  provider_type: string;
  status: 'pending' | 'accepted' | 'rejected';
  assigned_at: string;
  accepted_at?: string;
  notes?: string;
}

export interface CaseResponse {
  id: string;
  incident: string;
  responder_id: string;
  responder_name: string;
  response_type: 'initial_contact' | 'update' | 'resolution';
  content: string;
  created_at: string;
}

export interface CaseNote {
  id: string;
  incident: string;
  author: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

/**
 * Incident Service
 * All methods follow Django REST API conventions
 */
export class IncidentService {
  /**
   * Create a new incident report
   * POST /api/incidents/
   */
  static async createIncident(data: CreateIncidentData): Promise<Incident> {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.INCIDENTS.CREATE,
        {
          method: 'POST',
          body: JSON.stringify({
            type: data.type,
            incident_date: data.incidentDate,
            incident_time: data.incidentTime,
            location: data.location,
            description: data.description,
            severity: data.severity,
            support_services: data.supportServices,
            urgency_level: data.urgencyLevel,
            provider_preferences: data.providerPreferences,
            is_anonymous: data.isAnonymous,
          }),
        }
      );

      return this.transformIncidentFromAPI(response);
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  }

  /**
   * Get all incidents for the current user
   * GET /api/incidents/
   * Automatically filtered by user on backend
   */
  static async getIncidents(params?: {
    status?: string;
    type?: string;
    page?: number;
  }): Promise<IncidentListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.page) queryParams.append('page', params.page.toString());

      const endpoint = `${API_CONFIG.ENDPOINTS.INCIDENTS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await apiRequest(endpoint);

      return {
        count: response.count,
        next: response.next,
        previous: response.previous,
        results: response.results.map(this.transformIncidentFromAPI),
      };
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw error;
    }
  }

  /**
   * Get a specific incident by ID
   * GET /api/incidents/{id}/
   */
  static async getIncidentById(incidentId: string): Promise<Incident> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.INCIDENTS.DETAIL.replace('{id}', incidentId);
      const response = await apiRequest(endpoint);

      return this.transformIncidentFromAPI(response);
    } catch (error) {
      console.error(`Error fetching incident ${incidentId}:`, error);
      throw error;
    }
  }

  /**
   * Update an incident
   * PUT /api/incidents/{id}/
   */
  static async updateIncident(
    incidentId: string,
    updates: Partial<CreateIncidentData>
  ): Promise<Incident> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.INCIDENTS.DETAIL.replace('{id}', incidentId);
      const response = await apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify({
          type: updates.type,
          incident_date: updates.incidentDate,
          incident_time: updates.incidentTime,
          location: updates.location,
          description: updates.description,
          severity: updates.severity,
          support_services: updates.supportServices,
          urgency_level: updates.urgencyLevel,
          provider_preferences: updates.providerPreferences,
          is_anonymous: updates.isAnonymous,
        }),
      });

      return this.transformIncidentFromAPI(response);
    } catch (error) {
      console.error(`Error updating incident ${incidentId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an incident (soft delete)
   * DELETE /api/incidents/{id}/
   */
  static async deleteIncident(incidentId: string): Promise<void> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.INCIDENTS.DETAIL.replace('{id}', incidentId);
      await apiRequest(endpoint, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Error deleting incident ${incidentId}:`, error);
      throw error;
    }
  }

  /**
   * Update incident status
   * PATCH /api/incidents/{id}/status/
   */
  static async updateIncidentStatus(
    incidentId: string,
    status: Incident['status']
  ): Promise<Incident> {
    try {
      const response = await apiRequest(`/api/incidents/${incidentId}/status/`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      return this.transformIncidentFromAPI(response);
    } catch (error) {
      console.error(`Error updating incident status ${incidentId}:`, error);
      throw error;
    }
  }

  /**
   * Get incident timeline
   * GET /api/incidents/{id}/timeline/
   */
  static async getIncidentTimeline(incidentId: string): Promise<{
    incident: Incident;
    timeline: Array<{
      id: string;
      event_type: string;
      description: string;
      created_at: string;
      created_by?: string;
    }>;
  }> {
    try {
      const response = await apiRequest(`/api/incidents/${incidentId}/timeline/`);

      return {
        incident: this.transformIncidentFromAPI(response.incident),
        timeline: response.timeline,
      };
    } catch (error) {
      console.error(`Error fetching incident timeline ${incidentId}:`, error);
      throw error;
    }
  }

  /**
   * Add a note to an incident
   * POST /api/incidents/{id}/notes/
   */
  static async addIncidentNote(
    incidentId: string,
    content: string,
    isInternal: boolean = false
  ): Promise<CaseNote> {
    try {
      const response = await apiRequest(`/api/incidents/${incidentId}/notes/`, {
        method: 'POST',
        body: JSON.stringify({
          content,
          is_internal: isInternal,
        }),
      });

      return response;
    } catch (error) {
      console.error(`Error adding note to incident ${incidentId}:`, error);
      throw error;
    }
  }

  /**
   * Upload evidence to an incident
   * POST /api/incidents/{id}/evidence/
   */
  static async uploadEvidence(
    incidentId: string,
    evidence: {
      type: Evidence['type'];
      uri: string;
      description?: string;
    }
  ): Promise<Evidence> {
    try {
      // For file uploads, we'll need to use FormData
      const formData = new FormData();
      formData.append('type', evidence.type);
      formData.append('description', evidence.description || '');

      // In React Native, file upload requires special handling
      // This is a placeholder - actual implementation depends on file structure
      const response = await apiRequest(`/api/incidents/${incidentId}/evidence/`, {
        method: 'POST',
        headers: {
          // Remove Content-Type header to let browser set it with boundary
          'Content-Type': 'multipart/form-data',
        },
        body: formData as any,
      });

      return response;
    } catch (error) {
      console.error(`Error uploading evidence to incident ${incidentId}:`, error);
      throw error;
    }
  }

  /**
   * PROVIDER-SPECIFIC ENDPOINTS
   */

  /**
   * Get cases assigned to the current provider
   * GET /api/cases/assigned-to-me/
   */
  static async getAssignedCases(params?: {
    status?: string;
    page?: number;
  }): Promise<{
    count: number;
    results: Array<{
      assignment: CaseAssignment;
      incident: Incident;
    }>;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());

      const endpoint = `/api/cases/assigned-to-me/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiRequest(endpoint);

      return {
        count: response.count,
        results: response.results.map((item: any) => ({
          assignment: item.assignment,
          incident: this.transformIncidentFromAPI(item.incident),
        })),
      };
    } catch (error) {
      console.error('Error fetching assigned cases:', error);
      throw error;
    }
  }

  /**
   * Accept a case assignment
   * POST /api/cases/{id}/accept/
   */
  static async acceptCase(
    assignmentId: string,
    notes?: string
  ): Promise<CaseAssignment> {
    try {
      const response = await apiRequest(`/api/cases/${assignmentId}/accept/`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });

      return response;
    } catch (error) {
      console.error(`Error accepting case ${assignmentId}:`, error);
      throw error;
    }
  }

  /**
   * Reject a case assignment
   * POST /api/cases/{id}/reject/
   */
  static async rejectCase(
    assignmentId: string,
    reason?: string
  ): Promise<CaseAssignment> {
    try {
      const response = await apiRequest(`/api/cases/${assignmentId}/reject/`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });

      return response;
    } catch (error) {
      console.error(`Error rejecting case ${assignmentId}:`, error);
      throw error;
    }
  }

  /**
   * Add a response to a case
   * POST /api/cases/{id}/respond/
   */
  static async respondToCase(
    incidentId: string,
    data: {
      responseType: CaseResponse['response_type'];
      content: string;
    }
  ): Promise<CaseResponse> {
    try {
      const response = await apiRequest(`/api/cases/${incidentId}/respond/`, {
        method: 'POST',
        body: JSON.stringify({
          response_type: data.responseType,
          content: data.content,
        }),
      });

      return response;
    } catch (error) {
      console.error(`Error responding to case ${incidentId}:`, error);
      throw error;
    }
  }

  /**
   * Transform Django API response to frontend Incident type
   * Handles snake_case to camelCase conversion
   */
  private static transformIncidentFromAPI(apiData: any): Incident {
    return {
      id: apiData.id,
      caseNumber: apiData.case_number,
      survivorId: apiData.survivor_id || apiData.survivor,
      type: apiData.type,
      status: apiData.status,
      priority: apiData.priority,
      incidentDate: apiData.incident_date,
      incidentTime: apiData.incident_time,
      location: apiData.location,
      description: apiData.description,
      severity: apiData.severity,
      supportServices: apiData.support_services,
      urgencyLevel: apiData.urgency_level,
      providerPreferences: apiData.provider_preferences,
      isAnonymous: apiData.is_anonymous,
      evidence: apiData.evidence || [],
      messages: apiData.messages || [],
      assignedProviderId: apiData.assigned_provider_id || apiData.assigned_provider,
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
    };
  }

  /**
   * Transform frontend Incident to Django API format
   * Handles camelCase to snake_case conversion
   */
  private static transformIncidentToAPI(incident: Partial<Incident>): any {
    return {
      id: incident.id,
      case_number: incident.caseNumber,
      survivor_id: incident.survivorId,
      type: incident.type,
      status: incident.status,
      priority: incident.priority,
      incident_date: incident.incidentDate,
      incident_time: incident.incidentTime,
      location: incident.location,
      description: incident.description,
      severity: incident.severity,
      support_services: incident.supportServices,
      urgency_level: incident.urgencyLevel,
      provider_preferences: incident.providerPreferences,
      is_anonymous: incident.isAnonymous,
      evidence: incident.evidence,
      messages: incident.messages,
      assigned_provider_id: incident.assignedProviderId,
      created_at: incident.createdAt,
      updated_at: incident.updatedAt,
    };
  }
}

/**
 * Query Keys for React Query
 * Centralized query key management
 */
export const incidentQueryKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentQueryKeys.all, 'list'] as const,
  list: (filters?: { status?: string; type?: string }) =>
    [...incidentQueryKeys.lists(), filters] as const,
  details: () => [...incidentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...incidentQueryKeys.details(), id] as const,
  timeline: (id: string) => [...incidentQueryKeys.detail(id), 'timeline'] as const,

  // Provider-specific keys
  assignedCases: () => ['cases', 'assigned'] as const,
  assignedCasesList: (filters?: { status?: string }) =>
    [...incidentQueryKeys.assignedCases(), filters] as const,
};
