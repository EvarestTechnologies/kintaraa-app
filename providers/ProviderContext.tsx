import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useIncidents, Incident } from './IncidentProvider';
import { ProviderRoutingService, ProviderAssignment } from '@/services/providerRouting';
import { NotificationService } from '@/services/notificationService';
import { ProviderResponseService } from '@/services/providerResponseService';
import { getAssignedCases, acceptAssignment as acceptAssignmentAPI, rejectAssignment as rejectAssignmentAPI } from '@/services/assignments';

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

  // Get assigned cases for this provider
  const assignedCases = useMemo(() => {
    // Get real incidents assigned through routing system
    const routedIncidents = incidents.filter(incident => {
      // Check if this provider has an ACCEPTED assignment for this incident
      return providerAssignments.some(assignment =>
        assignment.incidentId === incident.id &&
        assignment.providerId === providerProfile?.id &&
        assignment.status === 'accepted'
      );
    });

    console.log('Routed incidents for provider:', routedIncidents.length);
    console.log('Provider assignments:', providerAssignments.length);

    // Return only real incidents from backend (no mock data)
    return routedIncidents;

    // REMOVED: Mock data - now using real backend assignments
    // eslint-disable-next-line no-unreachable
    if (user?.role === 'provider' && providerProfile) {
      const dummyCases = [
        {
          id: 'dummy-1',
          caseNumber: 'KIN-241210001',
          survivorId: 'survivor-1',
          type: 'physical' as const,
          status: 'assigned' as const,
          priority: 'high' as const,
          incidentDate: '2024-12-10',
          location: {
            address: '123 Main St, New York, NY 10001',
            coordinates: { latitude: 40.7128, longitude: -74.0060 },
            description: 'Residential apartment building'
          },
          description: 'Domestic violence incident requiring immediate medical attention and legal support',
          severity: 'high' as const,
          supportServices: ['medical', 'legal', 'counseling'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: 'msg-1',
              incidentId: 'dummy-1',
              senderId: 'survivor-1',
              senderRole: 'survivor' as const,
              content: 'I need help urgently. The situation has escalated.',
              type: 'text' as const,
              createdAt: new Date().toISOString(),
            }
          ],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-12-10T08:30:00Z',
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'dummy-2',
          caseNumber: 'KIN-241209002',
          survivorId: 'survivor-2',
          type: 'emotional' as const,
          status: 'in_progress' as const,
          priority: 'medium' as const,
          incidentDate: '2024-12-09',
          location: {
            address: '456 Oak Ave, Brooklyn, NY 11201',
            coordinates: { latitude: 40.6892, longitude: -73.9442 },
            description: 'Private residence'
          },
          description: 'Ongoing psychological abuse and threats from partner',
          severity: 'medium' as const,
          supportServices: ['counseling', 'legal'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: 'msg-2',
              incidentId: 'dummy-2',
              senderId: providerProfile?.userId || '',
              senderRole: 'provider' as const,
              content: 'I have reviewed your case and scheduled a counseling session for tomorrow.',
              type: 'text' as const,
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            }
          ],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-12-09T14:15:00Z',
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'dummy-3',
          caseNumber: 'KIN-241208003',
          survivorId: 'survivor-3',
          type: 'sexual' as const,
          status: 'completed' as const,
          priority: 'critical' as const,
          incidentDate: '2024-12-08',
          location: {
            address: 'Location withheld for safety',
            description: 'Confidential location'
          },
          description: 'Sexual assault case requiring comprehensive support services',
          severity: 'high' as const,
          supportServices: ['medical', 'legal', 'counseling', 'police'],
          isAnonymous: true,
          evidence: [],
          messages: [],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-12-08T10:00:00Z',
          updatedAt: '2024-12-08T18:30:00Z',
        },
        {
          id: 'dummy-4',
          caseNumber: 'KIN-241207004',
          survivorId: 'survivor-4',
          type: 'economic' as const,
          status: 'assigned' as const,
          priority: 'low' as const,
          incidentDate: '2024-12-07',
          location: {
            address: '789 Pine St, Queens, NY 11375',
            coordinates: { latitude: 40.7282, longitude: -73.7949 },
            description: 'Family home'
          },
          description: 'Financial abuse and control by spouse, need assistance with financial independence',
          severity: 'low' as const,
          supportServices: ['financial', 'legal', 'counseling'],
          isAnonymous: false,
          evidence: [],
          messages: [],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-12-07T16:45:00Z',
          updatedAt: '2024-12-07T16:45:00Z',
        },
        {
          id: 'dummy-5',
          caseNumber: 'KIN-241206005',
          survivorId: 'survivor-5',
          type: 'online' as const,
          status: 'in_progress' as const,
          priority: 'medium' as const,
          incidentDate: '2024-12-06',
          location: {
            address: 'Online/Digital platforms',
            description: 'Multiple social media and digital platforms'
          },
          description: 'Cyberstalking and online harassment, need digital safety support',
          severity: 'medium' as const,
          supportServices: ['legal', 'counseling'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: 'msg-3',
              incidentId: 'dummy-5',
              senderId: 'survivor-5',
              senderRole: 'survivor' as const,
              content: 'The harassment has moved to multiple platforms now.',
              type: 'text' as const,
              createdAt: new Date(Date.now() - 7200000).toISOString(),
            }
          ],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-12-06T11:20:00Z',
          updatedAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'dummy-6',
          caseNumber: 'KIN-241205006',
          survivorId: 'survivor-6',
          type: 'physical' as const,
          status: 'completed' as const,
          priority: 'high' as const,
          incidentDate: '2024-12-05',
          location: {
            address: '321 Elm St, Manhattan, NY 10003',
            coordinates: { latitude: 40.7505, longitude: -73.9934 },
            description: 'Public area near subway station'
          },
          description: 'Physical assault case with medical documentation',
          severity: 'high' as const,
          supportServices: ['medical', 'legal'],
          isAnonymous: false,
          evidence: [],
          messages: [],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-12-05T09:15:00Z',
          updatedAt: '2024-12-05T17:30:00Z',
        },
        {
          id: 'dummy-7',
          caseNumber: 'KIN-241204007',
          survivorId: 'survivor-7',
          type: 'femicide' as const,
          status: 'assigned' as const,
          priority: 'critical' as const,
          incidentDate: '2024-12-04',
          location: {
            address: 'Emergency shelter location',
            description: 'Secure location - details confidential'
          },
          description: 'Attempted femicide case requiring immediate intervention and protection',
          severity: 'high' as const,
          supportServices: ['medical', 'legal', 'police', 'shelter'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: 'msg-4',
              incidentId: 'dummy-7',
              senderId: 'system',
              senderRole: 'admin' as const,
              content: 'URGENT: This case requires immediate attention and safety planning.',
              type: 'system' as const,
              createdAt: '2024-12-04T07:00:00Z',
            }
          ],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-12-04T07:00:00Z',
          updatedAt: '2024-12-04T07:00:00Z',
        },
        {
          id: 'dummy-8',
          caseNumber: 'KIN-241203008',
          survivorId: 'survivor-8',
          type: 'emotional' as const,
          status: 'in_progress' as const,
          priority: 'low' as const,
          incidentDate: '2024-12-03',
          location: {
            address: '555 Business Plaza, Manhattan, NY 10016',
            coordinates: { latitude: 40.7549, longitude: -73.9840 },
            description: 'Corporate office building'
          },
          description: 'Workplace harassment and emotional abuse from supervisor',
          severity: 'low' as const,
          supportServices: ['counseling', 'legal'],
          isAnonymous: true,
          evidence: [],
          messages: [],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-12-03T13:45:00Z',
          updatedAt: '2024-12-03T15:20:00Z',
        },
        {
          id: 'dummy-9',
          caseNumber: 'KIN-241202009',
          survivorId: 'survivor-9',
          type: 'economic' as const,
          status: 'completed' as const,
          priority: 'medium' as const,
          incidentDate: '2024-12-02',
          location: {
            address: '888 Court St, Brooklyn, NY 11201',
            coordinates: { latitude: 40.6892, longitude: -73.9900 },
            description: 'Legal aid office'
          },
          description: 'Economic coercion and financial control resolved through legal intervention',
          severity: 'medium' as const,
          supportServices: ['financial', 'legal'],
          isAnonymous: false,
          evidence: [],
          messages: [],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-12-02T10:30:00Z',
          updatedAt: '2024-12-02T16:45:00Z',
        },
        {
          id: 'dummy-10',
          caseNumber: 'KIN-241201010',
          survivorId: 'survivor-10',
          type: 'online' as const,
          status: 'assigned' as const,
          priority: 'high' as const,
          incidentDate: '2024-12-01',
          location: {
            address: 'Online platforms and social media',
            description: 'Digital harassment across multiple platforms'
          },
          description: 'Image-based sexual abuse and revenge porn distribution',
          severity: 'high' as const,
          supportServices: ['legal', 'counseling'],
          isAnonymous: false,
          evidence: [],
          messages: [],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-12-01T12:00:00Z',
          updatedAt: '2024-12-01T12:00:00Z',
        },
        {
          id: 'dummy-11',
          caseNumber: 'KIN-241130011',
          survivorId: 'survivor-11',
          type: 'physical' as const,
          status: 'in_progress' as const,
          priority: 'critical' as const,
          incidentDate: '2024-11-30',
          location: {
            address: '999 Safety Ave, Bronx, NY 10451',
            coordinates: { latitude: 40.8176, longitude: -73.9182 },
            description: 'Residential area with ongoing safety concerns'
          },
          description: 'Severe domestic violence with ongoing threats and stalking behavior',
          severity: 'high' as const,
          supportServices: ['medical', 'legal', 'police', 'shelter'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: 'msg-5',
              incidentId: 'dummy-11',
              senderId: providerProfile?.userId || '',
              senderRole: 'provider' as const,
              content: 'Safety plan has been updated. Please check in daily.',
              type: 'text' as const,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            }
          ],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-11-30T08:15:00Z',
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'dummy-12',
          caseNumber: 'KIN-241129012',
          survivorId: 'survivor-12',
          type: 'sexual' as const,
          status: 'assigned' as const,
          priority: 'high' as const,
          incidentDate: '2024-11-29',
          location: {
            address: 'University Campus, Manhattan, NY 10027',
            coordinates: { latitude: 40.8075, longitude: -73.9626 },
            description: 'Educational institution campus'
          },
          description: 'Sexual harassment in educational institution',
          severity: 'medium' as const,
          supportServices: ['counseling', 'legal'],
          isAnonymous: true,
          evidence: [],
          messages: [],
          assignedProviderId: providerProfile?.id || '',
          createdAt: '2024-11-29T14:30:00Z',
          updatedAt: '2024-11-29T14:30:00Z',
        }
      ];
      
      return [...routedIncidents, ...dummyCases];
    }

    return routedIncidents;
  }, [incidents, providerProfile, user?.role, providerAssignments]);

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
    activeCases: assignedCases.filter(c => ['assigned', 'in_progress'].includes(c.status)).length,
    completedCases: assignedCases.filter(c => c.status === 'completed').length,
    averageResponseTime: providerProfile?.responseTime || 45,
    rating: providerProfile?.rating || 4.5,
    totalMessages: assignedCases.reduce((total, incident) => total + incident.messages.length, 0),
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
      // Refresh both pending assignments and incidents
      queryClient.invalidateQueries({ queryKey: ['pending-assignments', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
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
      // Refresh pending assignments
      queryClient.invalidateQueries({ queryKey: ['pending-assignments', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
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
      
      // This would typically call the incident update mutation
      // For now, we'll simulate the update
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
      
      return { incidentId, status, notes };
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
    isLoading: pendingAssignmentsQuery.isLoading,
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