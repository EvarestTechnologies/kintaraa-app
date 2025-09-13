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

  // Get assigned cases for this provider
  const assignedCases = incidents.filter(incident => 
    incident.assignedProviderId === providerProfile?.id
  );

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