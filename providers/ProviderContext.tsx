import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { useIncidents, Incident } from './IncidentProvider';

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
  providerId: string;
  assignedAt: string;
  acceptedAt?: string;
  status: 'pending' | 'accepted' | 'declined';
  priority: 'low' | 'medium' | 'high' | 'critical';
  serviceType: string;
  estimatedResponseTime?: number;
}

export interface ProviderNotification {
  id: string;
  type: 'new_case' | 'message' | 'status_update' | 'system';
  title: string;
  message: string;
  incidentId?: string;
  isRead: boolean;
  createdAt: string;
}

export const [ProviderContext, useProvider] = createContextHook(() => {
  const { user } = useAuth();
  const { incidents, providers } = useIncidents();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<ProviderNotification[]>([]);

  // Get provider profile
  const providerProfile = providers.find(p => p.userId === user?.id);

  // Get assigned cases for this provider (with additional dummy data for testing)
  const assignedCases = useMemo(() => {
    const realAssignedCases = incidents.filter(incident => 
      incident.assignedProviderId === providerProfile?.id
    );
    
    // Add dummy cases for testing search and filter functionality
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
          assignedProviderId: providerProfile.id,
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
              senderId: providerProfile.userId,
              senderRole: 'provider' as const,
              content: 'I have reviewed your case and scheduled a counseling session for tomorrow.',
              type: 'text' as const,
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            }
          ],
          assignedProviderId: providerProfile.id,
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
          assignedProviderId: providerProfile.id,
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
          assignedProviderId: providerProfile.id,
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
          assignedProviderId: providerProfile.id,
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
          assignedProviderId: providerProfile.id,
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
          assignedProviderId: providerProfile.id,
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
          assignedProviderId: providerProfile.id,
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
          assignedProviderId: providerProfile.id,
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
          assignedProviderId: providerProfile.id,
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
              senderId: providerProfile.userId,
              senderRole: 'provider' as const,
              content: 'Safety plan has been updated. Please check in daily.',
              type: 'text' as const,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            }
          ],
          assignedProviderId: providerProfile.id,
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
          assignedProviderId: providerProfile.id,
          createdAt: '2024-11-29T14:30:00Z',
          updatedAt: '2024-11-29T14:30:00Z',
        }
      ];
      
      return [...realAssignedCases, ...dummyCases];
    }
    
    return realAssignedCases;
  }, [incidents, providerProfile, user?.role]);

  // Get pending case assignments
  const pendingAssignmentsQuery = useQuery({
    queryKey: ['pending-assignments', user?.id, user?.role, providerProfile?.id],
    queryFn: async () => {
      if (!user || user.role !== 'provider') return [];
      
      // Mock pending assignments for demo
      const mockAssignments: CaseAssignment[] = [
        {
          id: 'assign-1',
          incidentId: '3',
          providerId: providerProfile?.id || 'provider-1',
          assignedAt: new Date().toISOString(),
          status: 'pending',
          priority: 'high',
          serviceType: 'medical',
          estimatedResponseTime: 30,
        },
        {
          id: 'assign-2',
          incidentId: '4',
          providerId: providerProfile?.id || 'provider-1',
          assignedAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'pending',
          priority: 'medium',
          serviceType: 'counseling',
          estimatedResponseTime: 60,
        }
      ];
      
      return mockAssignments;
    },
    enabled: !!user && user.role === 'provider',
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

  // Accept case assignment
  const acceptAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      if (!user || !providerProfile) throw new Error('Provider not found');
      
      const assignments = pendingAssignmentsQuery.data || [];
      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) throw new Error('Assignment not found');
      
      // Update assignment status
      const updatedAssignments = assignments.map(a => 
        a.id === assignmentId 
          ? { ...a, status: 'accepted' as const, acceptedAt: new Date().toISOString() }
          : a
      );
      
      // In a real app, this would update the backend
      
      // Add notification
      const notification: ProviderNotification = {
        id: Date.now().toString(),
        type: 'status_update',
        title: 'Case Accepted',
        message: `You have accepted case assignment for incident ${assignment.incidentId}`,
        incidentId: assignment.incidentId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      
      setNotifications(prev => [notification, ...prev]);
      
      return assignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-assignments', user?.id] });
    },
  });

  // Decline case assignment
  const declineAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const assignments = pendingAssignmentsQuery.data || [];
      const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
      
      // In a real app, this would update the backend
      
      return assignmentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-assignments', user?.id] });
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

  return useMemo(() => ({
    providerProfile,
    assignedCases,
    pendingAssignments: pendingAssignmentsQuery.data || [],
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