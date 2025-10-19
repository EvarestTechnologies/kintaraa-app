/**
 * Provider Routing API Service
 * Backend integration for provider assignment and availability
 */

import { apiRequest, API_CONFIG } from './api';
import { APP_CONFIG } from '@/constants/config';
import { ProviderRoutingService, ProviderAssignment, ProviderProfile } from './providerRouting';
import type { Incident } from '@/providers/IncidentProvider';

export interface ProviderAvailabilityUpdate {
  is_available: boolean;
  current_case_load?: number;
  max_case_load?: number;
  working_hours?: {
    start: string;
    end: string;
    is_24_hours: boolean;
  };
}

export interface RoutingRequest {
  incident_id: string;
  support_services: string[];
  urgency_level: 'immediate' | 'urgent' | 'routine';
  location?: {
    latitude: number;
    longitude: number;
  };
  provider_preferences?: {
    preferred_gender?: 'male' | 'female' | 'no_preference';
    proximity_preference?: 'nearest' | 'specific_facility';
  };
}

export interface RoutingResponse {
  assignments: ProviderAssignment[];
  total_providers_matched: number;
  routing_algorithm_version: string;
}

export class ProviderRoutingApiService {
  /**
   * Assign providers to an incident via API
   * POST /api/routing/assign-providers/
   */
  static async assignProviders(incident: Incident): Promise<ProviderAssignment[]> {
    // Try API first
    if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      try {
        console.log('📡 Routing incident via API...', incident.id);

        const request: RoutingRequest = {
          incident_id: incident.id,
          support_services: incident.supportServices,
          urgency_level: incident.urgencyLevel || 'routine',
          location: incident.location?.coordinates,
          provider_preferences: incident.providerPreferences ? {
            preferred_gender: incident.providerPreferences.preferredGender,
            proximity_preference: incident.providerPreferences.proximityPreference,
          } : undefined,
        };

        const response = await apiRequest(API_CONFIG.ENDPOINTS.ROUTING.ASSIGN_PROVIDERS, {
          method: 'POST',
          body: JSON.stringify(request),
        });

        console.log(`✅ Routed to ${response.assignments.length} providers via API`);
        return response.assignments.map(this.transformAssignmentFromAPI);
      } catch (error) {
        console.warn('⚠️ API routing failed, using local algorithm:', error);
      }
    }

    // Fallback: Use local routing algorithm
    console.log('💾 Using local routing algorithm');
    return await ProviderRoutingService.routeIncident(incident);
  }

  /**
   * Get available providers by type
   * GET /api/providers/available/
   */
  static async getAvailableProviders(params?: {
    provider_type?: string;
    service_types?: string[];
    location?: {
      latitude: number;
      longitude: number;
      radius_km?: number;
    };
  }): Promise<ProviderProfile[]> {
    // Try API first
    if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      try {
        console.log('📡 Fetching available providers from API...');

        const queryParams = new URLSearchParams();
        if (params?.provider_type) queryParams.append('type', params.provider_type);
        if (params?.service_types) {
          params.service_types.forEach(s => queryParams.append('service', s));
        }
        if (params?.location) {
          queryParams.append('latitude', params.location.latitude.toString());
          queryParams.append('longitude', params.location.longitude.toString());
          if (params.location.radius_km) {
            queryParams.append('radius', params.location.radius_km.toString());
          }
        }

        const endpoint = `${API_CONFIG.ENDPOINTS.ROUTING.AVAILABLE_PROVIDERS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiRequest(endpoint);

        console.log(`✅ Found ${response.results.length} available providers`);
        return response.results.map(this.transformProviderFromAPI);
      } catch (error) {
        console.warn('⚠️ API fetch failed, returning empty array:', error);
      }
    }

    // Fallback: Return empty (local routing service handles this internally)
    console.log('💾 No API available, relying on local provider data');
    return [];
  }

  /**
   * Update provider availability status
   * PUT /api/providers/{id}/availability/
   */
  static async updateProviderAvailability(
    providerId: string,
    update: ProviderAvailabilityUpdate
  ): Promise<void> {
    // Try API first
    if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      try {
        console.log('📡 Updating provider availability via API...');

        const endpoint = API_CONFIG.ENDPOINTS.PROVIDERS.AVAILABILITY.replace('{id}', providerId);
        await apiRequest(endpoint, {
          method: 'PUT',
          body: JSON.stringify(update),
        });

        console.log('✅ Provider availability updated');
        return;
      } catch (error) {
        console.warn('⚠️ API update failed, updating locally:', error);
      }
    }

    // Fallback: Update local state
    console.log('💾 Updating provider availability locally');
    ProviderRoutingService.updateProviderStatus(providerId, update.is_available);
  }

  /**
   * Get provider profile
   * GET /api/providers/{id}/
   */
  static async getProviderProfile(providerId: string): Promise<ProviderProfile | null> {
    // Try API first
    if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      try {
        console.log('📡 Fetching provider profile from API...');

        const endpoint = API_CONFIG.ENDPOINTS.PROVIDERS.PROFILE.replace('{id}', providerId);
        const response = await apiRequest(endpoint);

        console.log('✅ Provider profile loaded');
        return this.transformProviderFromAPI(response);
      } catch (error) {
        console.warn('⚠️ API fetch failed, checking local data:', error);
      }
    }

    // Fallback: Get from local service
    console.log('💾 Loading provider from local data');
    return ProviderRoutingService.getProviderById(providerId);
  }

  /**
   * Accept a provider assignment
   * This is handled by CaseManagementProvider, but we provide routing context
   */
  static notifyAssignmentAccepted(assignmentId: string, providerId: string): void {
    console.log(`Provider ${providerId} accepted assignment ${assignmentId}`);
    ProviderRoutingService.acceptAssignment(assignmentId);
    ProviderRoutingService.assignCaseToProvider(providerId);
  }

  /**
   * Decline a provider assignment
   * This triggers re-routing to find alternative providers
   */
  static notifyAssignmentDeclined(assignmentId: string): void {
    console.log(`Assignment ${assignmentId} declined`);
    ProviderRoutingService.declineAssignment(assignmentId);
    // In production, this would trigger re-routing via API
  }

  /**
   * Transform API assignment response to frontend format
   */
  private static transformAssignmentFromAPI(apiData: any): ProviderAssignment {
    return {
      id: apiData.id,
      incidentId: apiData.incident_id || apiData.incident,
      providerId: apiData.provider_id || apiData.provider,
      providerType: apiData.provider_type,
      priority: apiData.priority,
      estimatedResponseTime: apiData.estimated_response_time,
      distance: apiData.distance,
      specializations: apiData.specializations || [],
      contactInfo: {
        phone: apiData.contact_info?.phone,
        email: apiData.contact_info?.email,
        facilityName: apiData.contact_info?.facility_name,
      },
      assignedAt: apiData.assigned_at,
      status: apiData.status,
    };
  }

  /**
   * Transform API provider response to frontend format
   */
  private static transformProviderFromAPI(apiData: any): ProviderProfile {
    return {
      id: apiData.id,
      name: apiData.name,
      type: apiData.type || apiData.provider_type,
      isAvailable: apiData.is_available,
      currentCaseLoad: apiData.current_case_load || 0,
      maxCaseLoad: apiData.max_case_load || 10,
      location: {
        latitude: apiData.location.latitude,
        longitude: apiData.location.longitude,
        address: apiData.location.address,
        facilityName: apiData.location.facility_name,
      },
      specializations: apiData.specializations || [],
      contactInfo: {
        phone: apiData.contact_info?.phone,
        email: apiData.contact_info?.email,
      },
      workingHours: {
        start: apiData.working_hours?.start || '08:00',
        end: apiData.working_hours?.end || '17:00',
        is24Hours: apiData.working_hours?.is_24_hours || false,
      },
      responseTimeMinutes: apiData.response_time_minutes || 30,
      rating: apiData.rating || 0,
      lastActiveTime: new Date(apiData.last_active_time || Date.now()),
    };
  }
}

/**
 * Query keys for React Query
 */
export const routingQueryKeys = {
  all: ['routing'] as const,
  providers: () => [...routingQueryKeys.all, 'providers'] as const,
  availableProviders: (filters?: { type?: string; services?: string[] }) =>
    [...routingQueryKeys.providers(), 'available', filters] as const,
  providerProfile: (id: string) => [...routingQueryKeys.providers(), id] as const,
  assignments: () => [...routingQueryKeys.all, 'assignments'] as const,
  incidentAssignments: (incidentId: string) =>
    [...routingQueryKeys.assignments(), incidentId] as const,
};
