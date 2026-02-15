/**
 * Dispatcher API Service
 * Handles all API calls for dispatcher dashboard and case management
 */

import { apiRequest } from './api';
import { Incident } from '@/providers/IncidentProvider';

/**
 * Dashboard statistics for dispatcher overview
 */
export interface DispatcherDashboardStats {
  total_cases: number;
  active_cases: number;
  pending_dispatcher_review: number;
  unassigned_urgent_cases: number;
  total_providers: number;
  available_providers: number;
  providers_at_capacity: number;
  average_response_time_minutes: number;
  cases_completed_today: number;
  cases_created_today: number;
  cases_by_status: {
    new: number;
    pending_dispatcher_review: number;
    assigned: number;
    in_progress: number;
    completed: number;
    closed: number;
  };
  cases_by_urgency: {
    routine: number;
    urgent: number;
    immediate: number;
  };
}

/**
 * Provider information for dispatcher
 */
export interface DispatcherProvider {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  provider_type: string;
  provider_type_display: string;
  profile?: {
    current_case_load: number;
    max_case_load: number;
    is_currently_available: boolean;
    acceptance_rate: number;
  };
}

/**
 * Get dispatcher dashboard statistics
 */
export const getDispatcherDashboard = async (): Promise<DispatcherDashboardStats> => {
  return apiRequest('/dispatch/dashboard/', { method: 'GET' });
};

/**
 * Transform backend incident data to frontend Incident type
 */
const transformIncidentData = (backendData: any): Incident => {
  return {
    id: backendData.id,
    caseNumber: backendData.case_number,
    survivorId: backendData.survivor?.id || backendData.survivor_id,
    type: backendData.type,
    status: backendData.status,
    priority: backendData.severity || 'medium',
    incidentDate: backendData.incident_date,
    incidentTime: backendData.incident_time,
    location: backendData.location,
    description: backendData.description,
    severity: backendData.severity,
    supportServices: backendData.support_services || [],
    urgencyLevel: backendData.urgency_level,
    providerPreferences: backendData.provider_preferences,
    isAnonymous: backendData.is_anonymous || false,
    evidence: [],
    messages: [],
    assignedProviderId: backendData.assigned_provider?.id,
    createdAt: backendData.date_submitted || backendData.created_at,
    updatedAt: backendData.last_updated || backendData.updated_at,
  };
};

/**
 * Get all cases in the system (for dispatcher view)
 *
 * @param filters - Optional filters for cases
 * @returns List of all incidents
 */
export const getAllCases = async (filters?: {
  status?: string;
  urgency?: string;
  type?: string;
  assigned?: boolean;
  sort?: string;
}): Promise<Incident[]> => {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.urgency) params.append('urgency', filters.urgency);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.assigned !== undefined) params.append('assigned', filters.assigned.toString());
  if (filters?.sort) params.append('sort', filters.sort);

  const queryString = params.toString();
  const endpoint = queryString ? `/dispatch/cases/?${queryString}` : '/dispatch/cases/';

  const data = await apiRequest(endpoint, { method: 'GET' });

  // Transform backend data to match frontend Incident type
  if (Array.isArray(data)) {
    return data.map(transformIncidentData);
  }
  return [];
};

/**
 * Get case detail (dispatcher view with full information)
 *
 * @param incidentId - The incident ID
 * @returns Full incident details with assignments
 */
export const getCaseDetail = async (incidentId: string): Promise<Incident> => {
  const data = await apiRequest(`/dispatch/cases/${incidentId}/`, { method: 'GET' });
  return transformIncidentData(data);
};

/**
 * Manually assign a provider to a case
 *
 * @param incidentId - The incident to assign
 * @param providerId - The provider to assign
 * @param notes - Optional notes about the assignment
 */
export const assignProviderToCase = async (
  incidentId: string,
  providerId: string,
  notes?: string
): Promise<void> => {
  return apiRequest(`/dispatch/cases/${incidentId}/assign/`, {
    method: 'POST',
    body: JSON.stringify({
      provider_id: providerId,
      notes: notes || '',
    }),
  });
};

/**
 * Reassign a case to a different provider
 *
 * @param incidentId - The incident to reassign
 * @param newProviderId - The new provider
 * @param reason - Required reason for reassignment
 */
export const reassignCase = async (
  incidentId: string,
  newProviderId: string,
  reason: string
): Promise<void> => {
  return apiRequest(`/dispatch/cases/${incidentId}/reassign/`, {
    method: 'POST',
    body: JSON.stringify({
      new_provider_id: newProviderId,
      reason,
    }),
  });
};

/**
 * Get provider recommendations for a specific case
 *
 * @param incidentId - The incident needing assignment
 * @returns List of recommended providers
 */
export const getProviderRecommendations = async (
  incidentId: string
): Promise<DispatcherProvider[]> => {
  return apiRequest(`/dispatch/cases/${incidentId}/recommendations/`, {
    method: 'GET',
  });
};

/**
 * Get all available providers
 *
 * @param filters - Optional filters
 * @returns List of providers with availability status
 */
export const getAvailableProviders = async (filters?: {
  provider_type?: string;
  available_only?: boolean;
}): Promise<DispatcherProvider[]> => {
  const params = new URLSearchParams();

  if (filters?.provider_type) params.append('provider_type', filters.provider_type);
  if (filters?.available_only !== undefined) {
    params.append('available_only', filters.available_only.toString());
  }

  const queryString = params.toString();
  const endpoint = queryString
    ? `/dispatch/providers/?${queryString}`
    : '/dispatch/providers/';

  return apiRequest(endpoint, { method: 'GET' });
};
