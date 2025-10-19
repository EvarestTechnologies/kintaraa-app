/**
 * Case Management Provider
 * Provider-specific hooks for managing assigned cases
 */

import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthProvider';
import { IncidentService, incidentQueryKeys } from '@/services/incidentService';
import type { Incident } from './IncidentProvider';
import { APP_CONFIG } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CaseAssignment {
  id: string;
  incident: Incident;
  provider_id: string;
  provider_type: string;
  status: 'pending' | 'accepted' | 'rejected';
  assigned_at: string;
  accepted_at?: string;
  notes?: string;
}

export const [CaseManagementProvider, useCaseManagement] = createContextHook(() => {
  console.log('CaseManagementProvider initializing...');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Only enable for providers
  const isProvider = user?.role === 'provider';

  /**
   * Get all cases assigned to the current provider
   */
  const assignedCasesQuery = useQuery({
    queryKey: incidentQueryKeys.assignedCases(),
    queryFn: async () => {
      if (!user || !isProvider) return [];

      // Try API first
      if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
        try {
          console.log('📡 Fetching assigned cases from API...');
          const response = await IncidentService.getAssignedCases();
          console.log(`✅ Loaded ${response.results.length} assigned cases from API`);
          return response.results.map(r => ({
            ...r.assignment,
            incident: r.incident,
          }));
        } catch (error) {
          console.warn('⚠️ API fetch failed for assigned cases, falling back:', error);
        }
      }

      // Fallback: Load from local incidents
      console.log('💾 Loading assigned cases from local storage');
      const stored = await AsyncStorage.getItem(`incidents_${user.id}`);
      if (stored) {
        const incidents = JSON.parse(stored) as Incident[];
        // Filter incidents assigned to this provider
        const assignedIncidents = incidents.filter(
          inc => inc.assignedProviderId === user.id || inc.assignedProviderId === `provider-${user.id}`
        );

        return assignedIncidents.map(incident => ({
          id: `assignment-${incident.id}`,
          incident,
          provider_id: user.id,
          provider_type: user.providerType || 'healthcare',
          status: incident.status === 'assigned' ? ('pending' as const) : ('accepted' as const),
          assigned_at: incident.createdAt,
          accepted_at: incident.status !== 'assigned' ? incident.updatedAt : undefined,
        }));
      }

      return [];
    },
    enabled: isProvider,
  });

  /**
   * Accept a case assignment
   */
  const acceptCaseMutation = useMutation({
    mutationFn: async ({ assignmentId, notes }: { assignmentId: string; notes?: string }) => {
      if (!user || !isProvider) throw new Error('Only providers can accept cases');

      // Try API first
      if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
        try {
          console.log('📡 Accepting case via API...');
          const result = await IncidentService.acceptCase(assignmentId, notes);
          console.log('✅ Case accepted via API');
          return result;
        } catch (error) {
          console.warn('⚠️ API accept failed, falling back to local update:', error);
        }
      }

      // Fallback: Local update
      console.log('💾 Accepting case locally');
      const cases = assignedCasesQuery.data || [];
      const caseToAccept = cases.find(c => c.id === assignmentId);

      if (!caseToAccept) throw new Error('Case not found');

      // Update incident status
      const stored = await AsyncStorage.getItem(`incidents_${user.id}`);
      if (stored) {
        const incidents = JSON.parse(stored) as Incident[];
        const updatedIncidents = incidents.map(inc =>
          inc.id === caseToAccept.incident.id
            ? { ...inc, status: 'in_progress' as const, updatedAt: new Date().toISOString() }
            : inc
        );
        await AsyncStorage.setItem(`incidents_${user.id}`, JSON.stringify(updatedIncidents));
      }

      return {
        ...caseToAccept,
        status: 'accepted' as const,
        accepted_at: new Date().toISOString(),
        notes,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentQueryKeys.assignedCases() });
      queryClient.invalidateQueries({ queryKey: incidentQueryKeys.lists() });
    },
  });

  /**
   * Reject a case assignment
   */
  const rejectCaseMutation = useMutation({
    mutationFn: async ({ assignmentId, reason }: { assignmentId: string; reason?: string }) => {
      if (!user || !isProvider) throw new Error('Only providers can reject cases');

      // Try API first
      if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
        try {
          console.log('📡 Rejecting case via API...');
          const result = await IncidentService.rejectCase(assignmentId, reason);
          console.log('✅ Case rejected via API');
          return result;
        } catch (error) {
          console.warn('⚠️ API reject failed, falling back to local update:', error);
        }
      }

      // Fallback: Local update (just remove from assigned cases)
      console.log('💾 Rejecting case locally');
      return {
        id: assignmentId,
        status: 'rejected' as const,
        notes: reason,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentQueryKeys.assignedCases() });
    },
  });

  /**
   * Add a response/note to a case
   */
  const respondToCaseMutation = useMutation({
    mutationFn: async ({
      incidentId,
      responseType,
      content,
    }: {
      incidentId: string;
      responseType: 'initial_contact' | 'update' | 'resolution';
      content: string;
    }) => {
      if (!user || !isProvider) throw new Error('Only providers can respond to cases');

      // Try API first
      if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
        try {
          console.log('📡 Adding case response via API...');
          const result = await IncidentService.respondToCase(incidentId, {
            responseType,
            content,
          });
          console.log('✅ Case response added via API');
          return result;
        } catch (error) {
          console.warn('⚠️ API response failed, falling back to local update:', error);
        }
      }

      // Fallback: Add to incident messages
      console.log('💾 Adding case response locally');
      const stored = await AsyncStorage.getItem(`incidents_${user.id}`);
      if (stored) {
        const incidents = JSON.parse(stored) as Incident[];
        const updatedIncidents = incidents.map(inc =>
          inc.id === incidentId
            ? {
                ...inc,
                messages: [
                  ...inc.messages,
                  {
                    id: Date.now().toString(),
                    incidentId,
                    senderId: user.id,
                    senderRole: 'provider' as const,
                    content,
                    type: 'text' as const,
                    createdAt: new Date().toISOString(),
                  },
                ],
                updatedAt: new Date().toISOString(),
              }
            : inc
        );
        await AsyncStorage.setItem(`incidents_${user.id}`, JSON.stringify(updatedIncidents));
      }

      return {
        id: Date.now().toString(),
        incident: incidentId,
        responder_id: user.id,
        responder_name: user.fullName || 'Provider',
        response_type: responseType,
        content,
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentQueryKeys.assignedCases() });
      queryClient.invalidateQueries({ queryKey: incidentQueryKeys.lists() });
    },
  });

  /**
   * Update case status (provider workflow)
   */
  const updateCaseStatusMutation = useMutation({
    mutationFn: async ({ incidentId, status }: { incidentId: string; status: Incident['status'] }) => {
      if (!user || !isProvider) throw new Error('Only providers can update case status');

      // Try API first
      if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
        try {
          console.log('📡 Updating case status via API...');
          const result = await IncidentService.updateIncidentStatus(incidentId, status);
          console.log('✅ Case status updated via API');
          return result;
        } catch (error) {
          console.warn('⚠️ API status update failed, falling back:', error);
        }
      }

      // Fallback: Local update
      console.log('💾 Updating case status locally');
      const stored = await AsyncStorage.getItem(`incidents_${user.id}`);
      if (stored) {
        const incidents = JSON.parse(stored) as Incident[];
        const updatedIncidents = incidents.map(inc =>
          inc.id === incidentId
            ? { ...inc, status, updatedAt: new Date().toISOString() }
            : inc
        );
        await AsyncStorage.setItem(`incidents_${user.id}`, JSON.stringify(updatedIncidents));
        return updatedIncidents.find(inc => inc.id === incidentId);
      }

      throw new Error('Incident not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentQueryKeys.assignedCases() });
      queryClient.invalidateQueries({ queryKey: incidentQueryKeys.lists() });
    },
  });

  const result = {
    assignedCases: assignedCasesQuery.data || [],
    isLoading: assignedCasesQuery.isLoading,
    error: assignedCasesQuery.error,
    acceptCase: acceptCaseMutation.mutateAsync,
    rejectCase: rejectCaseMutation.mutateAsync,
    respondToCase: respondToCaseMutation.mutateAsync,
    updateCaseStatus: updateCaseStatusMutation.mutateAsync,
    isAccepting: acceptCaseMutation.isPending,
    isRejecting: rejectCaseMutation.isPending,
    isResponding: respondToCaseMutation.isPending,
    isUpdatingStatus: updateCaseStatusMutation.isPending,
  };

  console.log('CaseManagementProvider returning:', {
    casesCount: result.assignedCases.length,
    isLoading: result.isLoading,
    isProvider,
  });

  return result;
});

/**
 * Helper hooks
 */

// Get cases by status
export const useCasesByStatus = (status: CaseAssignment['status']) => {
  const { assignedCases } = useCaseManagement();
  return assignedCases.filter(c => c.status === status);
};

// Get pending cases (need acceptance)
export const usePendingCases = () => useCasesByStatus('pending');

// Get accepted/active cases
export const useActiveCases = () => useCasesByStatus('accepted');

// Get case by ID
export const useCaseById = (caseId: string) => {
  const { assignedCases } = useCaseManagement();
  return assignedCases.find(c => c.id === caseId);
};
