import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProviderRoutingService } from '@/services/providerRouting';
import { NotificationService } from '@/services/notificationService';
import { ProviderResponseService } from '@/services/providerResponseService';
import * as IncidentsAPI from '@/services/incidents';
import { handleApiError } from '@/services/api';

export interface Incident {
  id: string;
  caseNumber: string;
  survivorId: string;
  type: 'physical' | 'sexual' | 'emotional' | 'economic' | 'online' | 'femicide';
  status: 'new' | 'assigned' | 'in_progress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  incidentDate?: string;
  incidentTime?: string;
  location?: {
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    description?: string;
  };
  description?: string;
  severity?: 'low' | 'medium' | 'high';
  supportServices: string[];
  urgencyLevel?: 'immediate' | 'urgent' | 'routine';
  providerPreferences?: {
    communicationMethod?: 'sms' | 'call' | 'secure_message';
    preferredGender?: 'male' | 'female' | 'no_preference';
    proximityPreference?: 'nearest' | 'specific_facility';
  };
  isAnonymous: boolean;
  evidence: Evidence[];
  messages: Message[];
  assignedProviderId?: string;
  assignedProviders?: Array<{
    provider_id: string;
    provider_name: string;
    provider_type: string;
    assigned_at: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  incidentId: string;
  type: 'photo' | 'document' | 'audio' | 'video';
  uri: string;
  description?: string;
  uploadedAt: string;
}

export interface Message {
  id: string;
  incidentId: string;
  senderId: string;
  senderRole: 'survivor' | 'provider' | 'admin';
  content: string;
  type: 'text' | 'system';
  readAt?: string;
  createdAt: string;
}

export interface ServiceProvider {
  id: string;
  userId: string;
  name: string;
  organization: string;
  services: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  availability: {
    isAvailable: boolean;
    workingHours: {
      start: string;
      end: string;
    };
    capacity: number;
  };
  verified: boolean;
  rating: number;
  responseTime: number; // in minutes
}

export interface CreateIncidentData {
  type: string;
  incidentDate?: string;
  incidentTime?: string;
  location?: {
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    description?: string;
  };
  description?: string;
  severity?: string;
  supportServices: string[];
  urgencyLevel?: 'immediate' | 'urgent' | 'routine';
  providerPreferences?: {
    communicationMethod?: 'sms' | 'call' | 'secure_message';
    preferredGender?: 'male' | 'female' | 'no_preference';
    proximityPreference?: 'nearest' | 'specific_facility';
  };
  isAnonymous: boolean;
}

/**
 * Transform API response to frontend Incident format
 */
const transformApiIncidentToFrontend = (apiIncident: IncidentsAPI.IncidentResponse): Incident => {
  return {
    id: apiIncident.id,
    caseNumber: apiIncident.case_number,
    survivorId: '', // Will be set from user context
    type: apiIncident.type as any,
    status: apiIncident.status as any,
    priority: apiIncident.severity as any, // Map severity to priority
    incidentDate: apiIncident.incident_date,
    incidentTime: apiIncident.incident_time,
    location: apiIncident.location,
    description: apiIncident.description,
    severity: apiIncident.severity as any,
    supportServices: apiIncident.support_services,
    urgencyLevel: apiIncident.urgency_level as any,
    providerPreferences: apiIncident.provider_preferences as any,
    isAnonymous: apiIncident.is_anonymous,
    evidence: [], // Not yet implemented in backend
    messages: [], // Not yet implemented in backend
    assignedProviderId: undefined, // Not yet implemented in backend
    createdAt: apiIncident.date_submitted,
    updatedAt: apiIncident.last_updated,
  };
};

/**
 * Transform frontend CreateIncidentData to API payload
 */
const transformFrontendToApiPayload = (data: CreateIncidentData): IncidentsAPI.CreateIncidentPayload => {
  // Use description as address if no address provided
  const address = data.location?.address || data.location?.description || 'Location provided';

  // Use actual coordinates if available, otherwise use default Kenya coordinates
  const latitude = data.location?.coordinates?.latitude || -1.2921;  // Nairobi default
  const longitude = data.location?.coordinates?.longitude || 36.8219;  // Nairobi default

  return {
    type: data.type as any,
    incident_date: data.incidentDate || new Date().toISOString().split('T')[0],
    incident_time: data.incidentTime || new Date().toISOString().split('T')[1].split('.')[0],
    description: data.description || '',
    location: {
      address: address,
      coordinates: {
        latitude: latitude,
        longitude: longitude,
      },
      description: data.location?.description,
    },
    severity: (data.severity || 'medium') as any,
    support_services: data.supportServices,
    urgency_level: data.urgencyLevel || 'routine',
    provider_preferences: data.providerPreferences,
    is_anonymous: data.isAnonymous,
  };
};

export const [IncidentProvider, useIncidents] = createContextHook(() => {
  console.log('IncidentProvider initializing...');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Load incidents from API
  const incidentsQuery = useQuery({
    queryKey: ['incidents', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        // Fetch incidents from backend API
        console.log('🔄 Fetching incidents from API...');
        const apiIncidents = await IncidentsAPI.getIncidents();

        // Transform API response to frontend format
        const incidents = apiIncidents.map(apiIncident => {
          const transformed = transformApiIncidentToFrontend(apiIncident as any);
          return {
            ...transformed,
            survivorId: user.id,
          };
        });

        console.log('✅ Successfully fetched incidents from API:', incidents.length);
        return incidents;
      } catch (error: any) {
        // Use reusable error handler (logs error internally)
        throw handleApiError(error, 'Failed to load incidents.');
      }
    },
    enabled: !!user,
    retry: 2, // Retry failed requests twice
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Remove mock data - keeping this comment as placeholder for future reference
  /*
      const mockIncidents: Incident[] = [
        // COMPLETED CASES
        {
          id: '1',
          caseNumber: 'KIN-241128002',
          survivorId: user.id,
          type: 'emotional',
          status: 'completed',
          priority: 'medium',
          incidentDate: '2024-11-28',
          description: 'Ongoing emotional abuse and threats - Case resolved with counseling support',
          severity: 'medium',
          supportServices: ['counseling', 'legal'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: '1-1',
              incidentId: '1',
              senderId: 'provider-1',
              senderRole: 'provider',
              content: 'Case has been successfully completed. All support services have been provided.',
              type: 'system',
              createdAt: '2024-11-30T16:45:00Z',
            }
          ],
          assignedProviderId: 'provider-1',
          createdAt: '2024-11-28T14:30:00Z',
          updatedAt: '2024-11-30T16:45:00Z',
        },
        {
          id: '2',
          caseNumber: 'KIN-241125003',
          survivorId: user.id,
          type: 'physical',
          status: 'completed',
          priority: 'high',
          incidentDate: '2024-11-25',
          description: 'Physical assault case - Medical treatment completed, legal proceedings finalized',
          severity: 'high',
          supportServices: ['medical', 'legal', 'counseling'],
          isAnonymous: false,
          evidence: [],
          messages: [],
          assignedProviderId: 'provider-2',
          createdAt: '2024-11-25T09:15:00Z',
          updatedAt: '2024-12-05T14:20:00Z',
        },
        
        // IN PROGRESS CASES
        {
          id: '3',
          caseNumber: 'KIN-241201001',
          survivorId: user.id,
          type: 'physical',
          status: 'in_progress',
          priority: 'high',
          incidentDate: '2024-12-01',
          description: 'Physical altercation requiring medical attention - Currently receiving treatment',
          severity: 'high',
          supportServices: ['medical', 'legal', 'counseling'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: '3-1',
              incidentId: '3',
              senderId: 'provider-1',
              senderRole: 'provider',
              content: 'Medical examination completed. Legal consultation scheduled for tomorrow.',
              type: 'text',
              createdAt: '2024-12-02T11:30:00Z',
            },
            {
              id: '3-2',
              incidentId: '3',
              senderId: 'system',
              senderRole: 'admin',
              content: 'Case assigned to Dr. Sarah Johnson. Initial assessment in progress.',
              type: 'system',
              createdAt: '2024-12-01T10:00:00Z',
            }
          ],
          assignedProviderId: 'provider-1',
          createdAt: '2024-12-01T10:00:00Z',
          updatedAt: '2024-12-02T11:30:00Z',
        },
        {
          id: '4',
          caseNumber: 'KIN-241203004',
          survivorId: user.id,
          type: 'economic',
          status: 'in_progress',
          priority: 'medium',
          incidentDate: '2024-12-03',
          description: 'Financial abuse and control - Working on financial independence plan',
          severity: 'medium',
          supportServices: ['legal', 'counseling', 'financial'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: '4-1',
              incidentId: '4',
              senderId: 'provider-2',
              senderRole: 'provider',
              content: 'Financial assessment completed. Setting up separate banking arrangements.',
              type: 'text',
              createdAt: '2024-12-04T14:15:00Z',
            }
          ],
          assignedProviderId: 'provider-2',
          createdAt: '2024-12-03T16:20:00Z',
          updatedAt: '2024-12-04T14:15:00Z',
        },
        {
          id: '5',
          caseNumber: 'KIN-241205005',
          survivorId: user.id,
          type: 'online',
          status: 'in_progress',
          priority: 'high',
          incidentDate: '2024-12-05',
          description: 'Cyberstalking and digital harassment - Security measures being implemented',
          severity: 'high',
          supportServices: ['legal', 'digital_safety', 'counseling'],
          isAnonymous: true,
          evidence: [],
          messages: [
            {
              id: '5-1',
              incidentId: '5',
              senderId: 'provider-1',
              senderRole: 'provider',
              content: 'Digital security audit completed. Implementing enhanced privacy measures.',
              type: 'text',
              createdAt: '2024-12-06T09:45:00Z',
            }
          ],
          assignedProviderId: 'provider-1',
          createdAt: '2024-12-05T13:30:00Z',
          updatedAt: '2024-12-06T09:45:00Z',
        },
        
        // ASSIGNED CASES
        {
          id: '6',
          caseNumber: 'KIN-241208006',
          survivorId: user.id,
          type: 'sexual',
          status: 'assigned',
          priority: 'critical',
          incidentDate: '2024-12-08',
          description: 'Sexual assault case - Awaiting initial consultation with specialized provider',
          severity: 'high',
          supportServices: ['medical', 'legal', 'counseling', 'advocacy'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: '6-1',
              incidentId: '6',
              senderId: 'system',
              senderRole: 'admin',
              content: 'Case assigned to specialized trauma team. You will be contacted within 2 hours.',
              type: 'system',
              createdAt: '2024-12-08T15:20:00Z',
            }
          ],
          assignedProviderId: 'provider-1',
          createdAt: '2024-12-08T15:00:00Z',
          updatedAt: '2024-12-08T15:20:00Z',
        },
        {
          id: '7',
          caseNumber: 'KIN-241209007',
          survivorId: user.id,
          type: 'emotional',
          status: 'assigned',
          priority: 'medium',
          incidentDate: '2024-12-09',
          description: 'Psychological abuse and manipulation - Case assigned, awaiting provider contact',
          severity: 'medium',
          supportServices: ['counseling', 'support_groups'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: '7-1',
              incidentId: '7',
              senderId: 'system',
              senderRole: 'admin',
              content: 'Your report has been received and assigned to a counseling specialist.',
              type: 'system',
              createdAt: '2024-12-09T10:30:00Z',
            }
          ],
          assignedProviderId: 'provider-2',
          createdAt: '2024-12-09T10:15:00Z',
          updatedAt: '2024-12-09T10:30:00Z',
        },
        {
          id: '8',
          caseNumber: 'KIN-241210008',
          survivorId: user.id,
          type: 'physical',
          status: 'assigned',
          priority: 'high',
          incidentDate: '2024-12-10',
          description: 'Domestic violence incident - Medical evaluation pending, case worker assigned',
          severity: 'high',
          supportServices: ['medical', 'legal', 'shelter'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: '8-1',
              incidentId: '8',
              senderId: 'system',
              senderRole: 'admin',
              content: 'Emergency response team notified. Case assigned to Dr. Sarah Johnson.',
              type: 'system',
              createdAt: '2024-12-10T08:45:00Z',
            }
          ],
          assignedProviderId: 'provider-1',
          createdAt: '2024-12-10T08:30:00Z',
          updatedAt: '2024-12-10T08:45:00Z',
        },
        {
          id: '9',
          caseNumber: 'KIN-241211009',
          survivorId: user.id,
          type: 'economic',
          status: 'assigned',
          priority: 'low',
          incidentDate: '2024-12-11',
          description: 'Financial control and withholding resources - Legal aid consultation scheduled',
          severity: 'low',
          supportServices: ['legal', 'financial'],
          isAnonymous: true,
          evidence: [],
          messages: [
            {
              id: '9-1',
              incidentId: '9',
              senderId: 'system',
              senderRole: 'admin',
              content: 'Case assigned to Legal Aid Society. Consultation scheduled for this week.',
              type: 'system',
              createdAt: '2024-12-11T14:20:00Z',
            }
          ],
          assignedProviderId: 'provider-2',
          createdAt: '2024-12-11T14:00:00Z',
          updatedAt: '2024-12-11T14:20:00Z',
        }
      ];
      */

  // Create new incident
  const createIncidentMutation = useMutation({
    mutationFn: async (data: CreateIncidentData) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        console.log('🔄 Creating incident via API...', data);

        // Transform frontend data to API payload format
        const payload = transformFrontendToApiPayload(data);

        // Send to backend API
        const apiResponse = await IncidentsAPI.createIncident(payload);

        // Transform API response back to frontend format
        const newIncident = transformApiIncidentToFrontend(apiResponse);
        newIncident.survivorId = user.id;

        console.log('✅ Successfully created incident:', newIncident.caseNumber);

        // Return the new incident
        return newIncident;
      } catch (error: any) {
        // Use reusable error handler (logs error internally)
        throw handleApiError(error, 'Failed to submit incident report.');
      }

      /* TODO: Provider routing will be handled by backend
      // Automatically route incident to providers and create notifications
      // This logic should be moved to backend after provider assignment APIs are implemented
      */
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents', user?.id] });
    },
  });

  // Update incident (limited fields)
  const updateIncidentMutation = useMutation({
    mutationFn: async ({ incidentId, updates }: { incidentId: string; updates: Partial<Incident> }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        console.log('🔄 Updating incident via API...', incidentId);

        // Only allow updating specific fields (matching backend UpdateSerializer)
        const payload: any = {};
        if (updates.description) payload.description = updates.description;
        if (updates.supportServices) payload.support_services = updates.supportServices;
        if (updates.providerPreferences) payload.provider_preferences = updates.providerPreferences;

        // Send update to backend API
        const apiResponse = await IncidentsAPI.updateIncident(incidentId, payload);

        // Transform API response back to frontend format
        const updatedIncident = transformApiIncidentToFrontend(apiResponse);
        updatedIncident.survivorId = user.id;

        console.log('✅ Successfully updated incident:', updatedIncident.caseNumber);
        return updatedIncident;
      } catch (error: any) {
        // Use reusable error handler (logs error internally)
        throw handleApiError(error, 'Failed to update incident.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents', user?.id] });
    },
  });

  // Add message to incident
  // TODO: Implement messaging API endpoint in backend
  const addMessageMutation = useMutation({
    mutationFn: async ({ incidentId, content }: { incidentId: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');

      // TODO: Replace with API call when messaging endpoint is implemented
      // const apiResponse = await MessagingAPI.sendMessage(incidentId, content);

      throw new Error('Messaging feature is not yet implemented on the backend.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents', user?.id] });
    },
  });

  // Load service providers
  const providersQuery = useQuery({
    queryKey: ['providers', user?.id],
    queryFn: async () => {
      const mockProviders: ServiceProvider[] = [
        {
          id: 'provider-1',
          userId: 'user-provider-1',
          name: 'Dr. Sarah Johnson',
          organization: 'Women\'s Crisis Center',
          services: ['medical', 'counseling'],
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            address: '123 Support St, New York, NY 10001'
          },
          availability: {
            isAvailable: true,
            workingHours: { start: '09:00', end: '17:00' },
            capacity: 5
          },
          verified: true,
          rating: 4.8,
          responseTime: 30
        },
        {
          id: 'provider-2',
          userId: 'user-provider-2',
          name: 'Legal Aid Society',
          organization: 'Community Legal Services',
          services: ['legal', 'advocacy'],
          location: {
            latitude: 40.7589,
            longitude: -73.9851,
            address: '456 Justice Ave, New York, NY 10002'
          },
          availability: {
            isAvailable: true,
            workingHours: { start: '08:00', end: '18:00' },
            capacity: 10
          },
          verified: true,
          rating: 4.6,
          responseTime: 60
        }
      ];

      // Add current user as a provider if they have provider role
      if (user?.role === 'provider') {
        const currentUserProvider: ServiceProvider = {
          id: `provider-${user.id}`,
          userId: user.id,
          name: user.fullName || 'Healthcare Provider',
          organization: user.providerType || 'Healthcare Center',
          services: ['medical', 'counseling'], // Default services for healthcare providers
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            address: 'Healthcare Facility' // Default address
          },
          availability: {
            isAvailable: true,
            workingHours: { start: '09:00', end: '17:00' },
            capacity: 10
          },
          verified: true,
          rating: 4.5,
          responseTime: 45
        };

        // Add current user provider to the beginning of the array
        mockProviders.unshift(currentUserProvider);
      }

      return mockProviders;
    },
  });

  // Return context value
  const result = {
    incidents: incidentsQuery.data || [],
    providers: providersQuery.data || [],
    isLoading: incidentsQuery.isLoading || providersQuery.isLoading,
    error: incidentsQuery.error || providersQuery.error,
    createIncident: createIncidentMutation.mutateAsync,
    updateIncident: updateIncidentMutation.mutate,
    addMessage: addMessageMutation.mutate,
    isCreating: createIncidentMutation.isPending,
    isUpdating: updateIncidentMutation.isPending,
    createError: createIncidentMutation.error?.message,
  };
  
  console.log('IncidentProvider returning:', {
    incidentsCount: result.incidents.length,
    isLoading: result.isLoading,
    hasError: !!result.error
  });
  
  return result;
});

// Helper hooks
export const useIncidentById = (incidentId: string) => {
  const { incidents } = useIncidents();
  return incidents.find(incident => incident.id === incidentId);
};

export const useIncidentsByStatus = (status: Incident['status']) => {
  const { incidents } = useIncidents();
  return incidents.filter(incident => incident.status === status);
};

export const useProvidersByService = (serviceType: string) => {
  const { providers } = useIncidents();
  return providers.filter(provider => 
    provider.services.includes(serviceType) && provider.availability.isAvailable
  );
};