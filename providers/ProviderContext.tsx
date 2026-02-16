import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useIncidents, Incident } from './IncidentProvider';
import { ProviderRoutingService, ProviderAssignment } from '@/services/providerRouting';
import { NotificationService } from '@/services/notificationService';
import { ProviderResponseService } from '@/services/providerResponseService';
import { getAssignedCases, acceptAssignment as acceptAssignmentAPI, rejectAssignment as rejectAssignmentAPI, updateIncidentStatus } from '@/services/assignments';

export interface ProviderStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  averageResponseTime: number;
  rating: number;
  totalMessages: number;
}

export interface CaseAssignment {
  id: string;
  incidentId: string;
  caseNumber: string;
  providerId: string;
  assignedAt: string;
  reportedAt: string; // When incident was originally submitted
  acceptedAt?: string;
  status: 'pending' | 'accepted' | 'declined';
  priority: 'low' | 'medium' | 'high' | 'critical';
  serviceType: string;
  estimatedResponseTime?: number;
  survivorName: string;
  isAnonymous: boolean;
  location?: string;
  description?: string;
}

export interface ProviderNotification {
  id: string;
  type: 'new_case' | 'message' | 'status_update' | 'system';
  title: string;
  message: string;
  incidentId?: string;
  urgencyLevel?: 'immediate' | 'urgent' | 'routine';
  estimatedResponseTime?: number;
  isRead: boolean;
  createdAt: string;
}

export interface ProviderAssignmentData {
  id: string;
  incidentId: string;
  providerId: string;
  providerType: string;
  priority: number;
  estimatedResponseTime: number;
  distance: number;
  assignedAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export const [ProviderContext, useProvider] = createContextHook(() => {
  console.log('ProviderContext initializing...');
  const { user } = useAuth();
  const { incidents, providers } = useIncidents();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<ProviderNotification[]>([]);
  const [providerAssignments, setProviderAssignments] = useState<ProviderAssignment[]>([]);

  // Get provider profile
  const providerProfile = providers.find(p => p.userId === user?.id);

  // Poll for provider assignments from routing service
  useEffect(() => {
    if (!providerProfile?.id || !user?.role) return;

    // Register this provider with the routing service
    ProviderRoutingService.registerCurrentProvider({
      id: providerProfile.id,
      name: providerProfile.name,
      type: user.role as any, // Use user role as provider type
      isAvailable: true,
      location: providerProfile.location
    });

    // Get initial assignments
    const assignments = ProviderRoutingService.getProviderAssignments(providerProfile.id);
    setProviderAssignments(assignments);

    const interval = setInterval(() => {
      // Get assignments for this provider
      const currentAssignments = ProviderRoutingService.getProviderAssignments(providerProfile.id);
      setProviderAssignments(prev => {
        // Only update if assignments have actually changed
        if (JSON.stringify(prev) !== JSON.stringify(currentAssignments)) {
          return currentAssignments;
        }
        return prev;
      });
    }, 5000); // Poll every 5 seconds instead of 2

    return () => clearInterval(interval);
  }, [providerProfile?.id, providerProfile?.name, user?.role]); // Add stable dependencies

  // Get accepted case assignments from backend API
  const acceptedCasesQuery = useQuery({
    queryKey: ['accepted-cases', user?.id, user?.role],
    queryFn: async () => {
      if (!user || user.role !== 'provider') return [];

      console.log('🔄 Fetching assigned cases from API (status: accepted)...');

      try {
        // Get all assigned cases with 'accepted' status from backend
        const acceptedCases = await getAssignedCases('accepted');

        console.log('✅ Successfully fetched accepted cases:', acceptedCases.length);

        // Debug: Log first case data
        if (acceptedCases.length > 0) {
          console.log('🔍 First accepted case raw data:', {
            location: acceptedCases[0].location,
            incident_time: acceptedCases[0].incident_time,
            incident_date: acceptedCases[0].incident_date,
          });
        }

        // Map backend response to Incident format for display
        const incidents: Incident[] = acceptedCases.map(incident => ({
          id: incident.id,
          caseNumber: incident.case_number,
          survivorId: '', // Not exposed in API for privacy
          type: incident.type as any,
          status: incident.status as any,
          priority: incident.urgency_level === 'immediate' ? 'critical' as const :
                    incident.urgency_level === 'urgent' ? 'high' as const : 'medium' as const,
          incidentDate: incident.incident_date,
          incidentTime: incident.incident_time, // Add incident time from API
          location: incident.location,
          description: incident.description,
          severity: incident.severity as any,
          urgencyLevel: incident.urgency_level as any, // Add urgency level
          supportServices: incident.support_services,
          isAnonymous: incident.is_anonymous,
          evidence: [],
          messages: [],
          assignedProviderId: user.id,
          createdAt: incident.date_submitted,
          updatedAt: incident.last_updated,
        }));

        return incidents;
      } catch (error) {
        console.error('❌ Error fetching accepted cases:', error);
        return [];
      }
    },
    enabled: !!user && user.role === 'provider',
    refetchInterval: 5000, // Poll every 5 seconds for updates
  });

  // Get assigned cases for this provider
  const assignedCases = useMemo(() => {
    // Return accepted cases from backend API
    return acceptedCasesQuery.data || [];
  }, [acceptedCasesQuery.data]);

  // Get pending case assignments from backend API
  const pendingAssignmentsQuery = useQuery({
    queryKey: ['pending-assignments', user?.id, user?.role],
    queryFn: async () => {
      if (!user || user.role !== 'provider') return [];

      console.log('🔄 Fetching assigned cases from API (status: pending)...');

      try {
        // Get all assigned cases with 'pending' status from backend
        const assignedCases = await getAssignedCases('pending');

        console.log('✅ Successfully fetched pending assignments:', assignedCases.length);

        // Debug: Log first assignment raw data
        if (assignedCases.length > 0) {
          console.log('🔍 First raw API assignment:', {
            assigned_at: assignedCases[0].assigned_at,
            date_submitted: assignedCases[0].date_submitted,
            incident_date: assignedCases[0].incident_date,
            incident_time: assignedCases[0].incident_time,
            last_updated: assignedCases[0].last_updated,
            case_number: assignedCases[0].case_number,
          });
        }

        // Map backend response to CaseAssignment format
        const assignments: CaseAssignment[] = assignedCases.map(incident => {
          // Construct reportedAt from incident_date and incident_time if available
          let reportedAt = incident.date_submitted;
          if (!reportedAt && incident.incident_date) {
            // Use incident_date with time, defaulting to noon if incident_time is not available
            const time = incident.incident_time || '12:00:00';
            reportedAt = `${incident.incident_date}T${time}`;
          }
          if (!reportedAt) {
            // Stable fallback to avoid changing timestamps on every render
            const fallbackDate = incident.last_updated || new Date().toISOString().split('T')[0];
            reportedAt = `${fallbackDate}T12:00:00Z`;
          }

          return {
            id: incident.id,
            incidentId: incident.id,
            caseNumber: incident.case_number,
            providerId: user.id,
            assignedAt: incident.assigned_at || reportedAt, // Use reportedAt as fallback for assignedAt
            reportedAt: reportedAt,
            status: 'pending',
            priority: incident.urgency_level === 'immediate' ? 'critical' as const :
                      incident.urgency_level === 'urgent' ? 'high' as const : 'medium' as const,
            serviceType: incident.type,
            estimatedResponseTime: incident.urgency_level === 'immediate' ? 15 :
                                    incident.urgency_level === 'urgent' ? 30 : 60,
            survivorName: incident.survivor_name,
            isAnonymous: incident.is_anonymous,
            location: incident.location?.address,
            description: incident.description,
          };
        });

        return assignments;
      } catch (error) {
        console.error('❌ Error fetching pending assignments:', error);
        return [];
      }
    },
    enabled: !!user && user.role === 'provider',
    refetchInterval: 5000, // Poll every 5 seconds for new assignments
  });

  // Calculate provider statistics
  const stats: ProviderStats = useMemo(() => ({
    totalCases: assignedCases.length,
    activeCases: assignedCases.filter((c: Incident) => ['assigned', 'in_progress'].includes(c.status)).length,
    completedCases: assignedCases.filter((c: Incident) => c.status === 'completed').length,
    averageResponseTime: providerProfile?.responseTime || 45,
    rating: providerProfile?.rating || 4.5,
    totalMessages: assignedCases.reduce((total: number, incident: Incident) => total + incident.messages.length, 0),
  }), [assignedCases, providerProfile]);

  // Accept case assignment - call backend API
  const acceptAssignmentMutation = useMutation({
    mutationFn: async (incidentId: string) => {
      if (!user || user.role !== 'provider') throw new Error('Provider not found');

      console.log('🔄 Accepting assignment for incident:', incidentId);

      // Call backend API to accept assignment
      const result = await acceptAssignmentAPI(incidentId, 'Accepted assignment');

      console.log('✅ Assignment accepted:', result);

      // Add notification
      const notification: ProviderNotification = {
        id: Date.now().toString(),
        type: 'status_update',
        title: 'Case Accepted',
        message: `You have accepted case assignment for incident ${incidentId}`,
        incidentId: incidentId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications(prev => [notification, ...prev]);

      return result;
    },
    onSuccess: () => {
      // Refresh both pending assignments and accepted cases
      queryClient.invalidateQueries({ queryKey: ['pending-assignments', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['accepted-cases', user?.id] });
    },
  });

  // Decline/reject case assignment - call backend API
  const declineAssignmentMutation = useMutation({
    mutationFn: async ({ incidentId, reason }: { incidentId: string; reason: string }) => {
      if (!user || user.role !== 'provider') throw new Error('User not authenticated');

      console.log('🔄 Rejecting assignment for incident:', incidentId);

      // Call backend API to reject assignment
      const result = await rejectAssignmentAPI(incidentId, reason || 'Not available at this time');

      console.log('✅ Assignment rejected:', result);

      return result;
    },
    onSuccess: () => {
      // Refresh both pending assignments and accepted cases
      queryClient.invalidateQueries({ queryKey: ['pending-assignments', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['accepted-cases', user?.id] });
    },
  });

  // Update case status
  const updateCaseStatusMutation = useMutation({
    mutationFn: async ({ incidentId, status, notes }: {
      incidentId: string;
      status: Incident['status'];
      notes?: string;
    }) => {
      if (!user || !providerProfile) throw new Error('Provider not found');

      console.log('🔄 Updating case status:', { incidentId, status, notes });

      // Call backend API to update incident status
      const result = await updateIncidentStatus(incidentId, status, notes);

      console.log('✅ Case status updated:', result);

      // Add notification for the provider
      const notification: ProviderNotification = {
        id: Date.now().toString(),
        type: 'status_update',
        title: 'Case Status Updated',
        message: `Case ${incidentId} status updated to ${status}`,
        incidentId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications(prev => [notification, ...prev]);

      return result;
    },
    onSuccess: () => {
      // Refresh accepted cases to show updated status
      queryClient.invalidateQueries({ queryKey: ['accepted-cases', user?.id] });
    },
  });

  // Mark notification as read
  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  }, []);

  // Get unread notification count
  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const result = useMemo(() => ({
    providerProfile,
    assignedCases,
    pendingAssignments: pendingAssignmentsQuery.data || [],
    providerAssignments,
    stats,
    notifications,
    unreadCount,
    isLoading: pendingAssignmentsQuery.isLoading || acceptedCasesQuery.isLoading,
    acceptAssignment: acceptAssignmentMutation.mutate,
    declineAssignment: declineAssignmentMutation.mutate,
    updateCaseStatus: updateCaseStatusMutation.mutate,
    markNotificationRead,
    isAccepting: acceptAssignmentMutation.isPending,
    isDeclining: declineAssignmentMutation.isPending,
    isUpdating: updateCaseStatusMutation.isPending,
  }), [
    providerProfile,
    assignedCases,
    pendingAssignmentsQuery.data,
    providerAssignments,
    stats,
    notifications,
    unreadCount,
    pendingAssignmentsQuery.isLoading,
    acceptedCasesQuery.isLoading,
    acceptAssignmentMutation.mutate,
    declineAssignmentMutation.mutate,
    updateCaseStatusMutation.mutate,
    markNotificationRead,
    acceptAssignmentMutation.isPending,
    declineAssignmentMutation.isPending,
    updateCaseStatusMutation.isPending,
  ]);
  
  console.log('ProviderContext returning:', {
    assignedCasesCount: result.assignedCases.length,
    hasProviderProfile: !!result.providerProfile,
    isLoading: result.isLoading
  });
  
  return result;
});

// Helper hooks
export const useProviderStats = () => {
  const { stats } = useProvider();
  return stats;
};

export const usePendingAssignments = () => {
  const { pendingAssignments, acceptAssignment, declineAssignment } = useProvider();
  return { pendingAssignments, acceptAssignment, declineAssignment };
};

export const useProviderNotifications = () => {
  const { notifications, unreadCount, markNotificationRead } = useProvider();
  return { notifications, unreadCount, markNotificationRead };
};