/**
 * Assignments API Service
 * Handles all API calls related to provider assignment management
 */

import { apiRequest, API_CONFIG } from './api';

/**
 * Assignment from backend CaseAssignment model
 * Maps to CaseAssignmentSerializer
 */
export interface Assignment {
  id: string;
  incident_id: string;
  provider_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  assigned_at: string;
  accepted_at?: string;
  rejected_at?: string;
  notes?: string;
  rejection_reason?: string;
}

/**
 * Assigned case response
 * Full incident data with assignment info
 * Maps to AssignedCaseSerializer
 */
export interface AssignedCase {
  id: string;
  case_number: string;
  type: string;
  incident_type_display: string;
  status: string;
  status_display: string;
  severity: string;
  urgency_level: string;
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
  date_submitted: string;
  last_updated: string;
  assignment_status?: 'pending' | 'accepted' | 'rejected';
  assigned_at?: string;
}

/**
 * Available provider info
 * Maps to AvailableProviderSerializer
 */
export interface AvailableProvider {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  provider_type: string;
  phone_number?: string;
  is_available: boolean;
}

/**
 * Get all cases assigned to the authenticated provider
 *
 * @param status - Optional filter by assignment status
 * @returns List of assigned cases with full incident details
 */
export const getAssignedCases = async (
  status?: 'pending' | 'accepted' | 'rejected'
): Promise<AssignedCase[]> => {
  const params = new URLSearchParams();
  if (status) {
    params.append('status', status);
  }

  const queryString = params.toString();
  const endpoint = queryString
    ? `/providers/assigned-cases/?${queryString}`
    : '/providers/assigned-cases/';

  return apiRequest(endpoint, { method: 'GET' });
};

/**
 * Accept a case assignment
 *
 * @param incidentId - The incident ID to accept
 * @param notes - Optional notes about acceptance
 * @returns Updated assignment data
 */
export const acceptAssignment = async (
  incidentId: string,
  notes?: string
): Promise<Assignment> => {
  const endpoint = `/incidents/${incidentId}/accept/`;

  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify({
      notes: notes || '',
    }),
  });
};

/**
 * Reject a case assignment
 *
 * @param incidentId - The incident ID to reject
 * @param reason - Required reason for rejection
 * @returns Updated assignment data
 */
export const rejectAssignment = async (
  incidentId: string,
  reason: string
): Promise<Assignment> => {
  const endpoint = `/incidents/${incidentId}/reject/`;

  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify({
      reason,
    }),
  });
};

/**
 * Manually assign a provider to an incident
 * (Admin or incident owner only)
 *
 * @param incidentId - The incident to assign provider to
 * @param providerId - The provider to assign
 * @returns Created assignment data
 */
export const assignProvider = async (
  incidentId: string,
  providerId: string
): Promise<Assignment> => {
  const endpoint = `/incidents/${incidentId}/assign/`;

  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      provider_id: providerId,
    }),
  });
};

/**
 * Get list of available providers by type
 *
 * @param providerType - Type of provider to filter by
 * @returns List of available providers
 */
export const getAvailableProviders = async (
  providerType: 'healthcare' | 'legal' | 'police' | 'counseling' | 'social' | 'gbv_rescue' | 'chw'
): Promise<AvailableProvider[]> => {
  const params = new URLSearchParams();
  params.append('provider_type', providerType);

  const endpoint = `/providers/available/?${params.toString()}`;

  return apiRequest(endpoint, { method: 'GET' });
};

/**
 * Get assignment statistics for provider dashboard
 * (If backend endpoint exists)
 */
export const getAssignmentStats = async (): Promise<{
  total_assignments: number;
  pending: number;
  accepted: number;
  rejected: number;
}> => {
  // TODO: Add backend endpoint for assignment stats
  // For now, client will calculate from getAssignedCases()
  throw new Error('Assignment stats endpoint not implemented yet');
};
