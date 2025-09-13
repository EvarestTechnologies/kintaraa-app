import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  isAnonymous: boolean;
  evidence: Evidence[];
  messages: Message[];
  assignedProviderId?: string;
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
  isAnonymous: boolean;
}

export const [IncidentProvider, useIncidents] = createContextHook(() => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [realTimeUpdates, setRealTimeUpdates] = useState<Incident[]>([]);

  // Generate case number
  const generateCaseNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `KIN-${year}${month}${day}${random}`;
  };

  // Load incidents from storage
  const incidentsQuery = useQuery({
    queryKey: ['incidents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const stored = await AsyncStorage.getItem(`incidents_${user.id}`);
      if (stored) {
        return JSON.parse(stored) as Incident[];
      }
      
      // Return mock data for demo purposes
      const mockIncidents: Incident[] = [
        {
          id: '1',
          caseNumber: 'KIN-241201001',
          survivorId: user.id,
          type: 'physical',
          status: 'in_progress',
          priority: 'high',
          incidentDate: '2024-12-01',
          description: 'Physical altercation requiring medical attention',
          severity: 'high',
          supportServices: ['medical', 'legal', 'counseling'],
          isAnonymous: false,
          evidence: [],
          messages: [
            {
              id: '1',
              incidentId: '1',
              senderId: 'provider-1',
              senderRole: 'provider',
              content: 'We have received your report and assigned a case worker. You will be contacted within 24 hours.',
              type: 'system',
              createdAt: new Date().toISOString(),
            }
          ],
          assignedProviderId: 'provider-1',
          createdAt: '2024-12-01T10:00:00Z',
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          caseNumber: 'KIN-241128002',
          survivorId: user.id,
          type: 'emotional',
          status: 'completed',
          priority: 'medium',
          incidentDate: '2024-11-28',
          description: 'Ongoing emotional abuse and threats',
          severity: 'medium',
          supportServices: ['counseling', 'legal'],
          isAnonymous: false,
          evidence: [],
          messages: [],
          createdAt: '2024-11-28T14:30:00Z',
          updatedAt: '2024-11-30T16:45:00Z',
        }
      ];
      
      // Store mock data
      await AsyncStorage.setItem(`incidents_${user.id}`, JSON.stringify(mockIncidents));
      return mockIncidents;
    },
    enabled: !!user,
  });

  // Create new incident
  const createIncidentMutation = useMutation({
    mutationFn: async (data: CreateIncidentData) => {
      if (!user) throw new Error('User not authenticated');
      
      const newIncident: Incident = {
        id: Date.now().toString(),
        caseNumber: generateCaseNumber(),
        survivorId: user.id,
        type: data.type as any,
        status: 'new',
        priority: data.severity === 'high' ? 'high' : data.severity === 'medium' ? 'medium' : 'low',
        incidentDate: data.incidentDate,
        incidentTime: data.incidentTime,
        location: data.location,
        description: data.description,
        severity: data.severity as any,
        supportServices: data.supportServices,
        isAnonymous: data.isAnonymous,
        evidence: [],
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const existingIncidents = incidentsQuery.data || [];
      const updatedIncidents = [newIncident, ...existingIncidents];
      
      await AsyncStorage.setItem(`incidents_${user.id}`, JSON.stringify(updatedIncidents));
      
      // Simulate real-time update
      setTimeout(() => {
        const updatedIncident = {
          ...newIncident,
          status: 'assigned' as const,
          assignedProviderId: 'provider-1',
          messages: [
            {
              id: Date.now().toString(),
              incidentId: newIncident.id,
              senderId: 'system',
              senderRole: 'admin' as const,
              content: `Your report ${newIncident.caseNumber} has been received and assigned to a case worker. You will be contacted within 24 hours.`,
              type: 'system' as const,
              createdAt: new Date().toISOString(),
            }
          ],
          updatedAt: new Date().toISOString(),
        };
        
        setRealTimeUpdates(prev => {
          const filtered = prev.filter(i => i.id !== newIncident.id);
          return [updatedIncident, ...filtered];
        });
      }, 3000);
      
      return newIncident;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents', user?.id] });
    },
  });

  // Update incident status
  const updateIncidentMutation = useMutation({
    mutationFn: async ({ incidentId, updates }: { incidentId: string; updates: Partial<Incident> }) => {
      if (!user) throw new Error('User not authenticated');
      
      const existingIncidents = incidentsQuery.data || [];
      const updatedIncidents = existingIncidents.map(incident => 
        incident.id === incidentId 
          ? { ...incident, ...updates, updatedAt: new Date().toISOString() }
          : incident
      );
      
      await AsyncStorage.setItem(`incidents_${user.id}`, JSON.stringify(updatedIncidents));
      return updatedIncidents.find(i => i.id === incidentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents', user?.id] });
    },
  });

  // Add message to incident
  const addMessageMutation = useMutation({
    mutationFn: async ({ incidentId, content }: { incidentId: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const newMessage: Message = {
        id: Date.now().toString(),
        incidentId,
        senderId: user.id,
        senderRole: user.role,
        content,
        type: 'text',
        createdAt: new Date().toISOString(),
      };
      
      const existingIncidents = incidentsQuery.data || [];
      const updatedIncidents = existingIncidents.map(incident => 
        incident.id === incidentId 
          ? { 
              ...incident, 
              messages: [...incident.messages, newMessage],
              updatedAt: new Date().toISOString()
            }
          : incident
      );
      
      await AsyncStorage.setItem(`incidents_${user.id}`, JSON.stringify(updatedIncidents));
      return newMessage;
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
      
      return mockProviders;
    },
  });

  // Merge real-time updates with stored data
  const allIncidents = (() => {
    const storedIncidents = incidentsQuery.data || [];
    const updatedIncidents = [...storedIncidents];
    
    realTimeUpdates.forEach(update => {
      const index = updatedIncidents.findIndex(i => i.id === update.id);
      if (index >= 0) {
        updatedIncidents[index] = update;
      } else {
        updatedIncidents.unshift(update);
      }
    });
    
    return updatedIncidents.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  })();

  return {
    incidents: allIncidents,
    providers: providersQuery.data || [],
    isLoading: incidentsQuery.isLoading || providersQuery.isLoading,
    error: incidentsQuery.error || providersQuery.error,
    createIncident: createIncidentMutation.mutate,
    updateIncident: updateIncidentMutation.mutate,
    addMessage: addMessageMutation.mutate,
    isCreating: createIncidentMutation.isPending,
    isUpdating: updateIncidentMutation.isPending,
    createError: createIncidentMutation.error?.message,
  };
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