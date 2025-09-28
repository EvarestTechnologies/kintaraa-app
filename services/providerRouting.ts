import { Incident } from '@/providers/IncidentProvider';

export interface ProviderAssignment {
  providerId: string;
  providerType: 'healthcare' | 'police' | 'legal' | 'counseling' | 'social' | 'gbv_rescue' | 'chw';
  priority: number; // 1 = highest priority
  estimatedResponseTime: number; // in minutes
  distance: number; // in kilometers
  specializations: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    facilityName?: string;
  };
}

export interface ProviderProfile {
  id: string;
  name: string;
  type: 'healthcare' | 'police' | 'legal' | 'counseling' | 'social' | 'gbv_rescue' | 'chw';
  isAvailable: boolean;
  currentCaseLoad: number;
  maxCaseLoad: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    facilityName?: string;
  };
  specializations: string[];
  contactInfo: {
    phone?: string;
    email?: string;
  };
  workingHours: {
    start: string; // "08:00"
    end: string;   // "17:00"
    is24Hours: boolean;
  };
  responseTimeMinutes: number;
  rating: number;
  lastActiveTime: Date;
}

// Mock provider data - in real app this would come from database
const mockProviders: ProviderProfile[] = [
  {
    id: 'healthcare-001',
    name: 'Dr. Sarah Mwangi',
    type: 'healthcare',
    isAvailable: true,
    currentCaseLoad: 3,
    maxCaseLoad: 8,
    location: {
      latitude: -1.286389,
      longitude: 36.817223,
      address: 'Kenyatta National Hospital, Nairobi',
      facilityName: 'Kenyatta National Hospital'
    },
    specializations: ['post_rape_care', 'emergency_medicine', 'gynecology'],
    contactInfo: {
      phone: '+254712345001',
      email: 'sarah.mwangi@knh.go.ke'
    },
    workingHours: {
      start: '08:00',
      end: '17:00',
      is24Hours: false
    },
    responseTimeMinutes: 15,
    rating: 4.8,
    lastActiveTime: new Date()
  },
  {
    id: 'healthcare-002',
    name: 'Dr. James Kiprotich',
    type: 'healthcare',
    isAvailable: true,
    currentCaseLoad: 2,
    maxCaseLoad: 6,
    location: {
      latitude: -1.276389,
      longitude: 36.807223,
      address: 'Nairobi Hospital, Nairobi',
      facilityName: 'Nairobi Hospital'
    },
    specializations: ['post_rape_care', 'trauma_care', 'pediatric_care'],
    contactInfo: {
      phone: '+254712345002',
      email: 'james.kiprotich@nbi.hospital.ke'
    },
    workingHours: {
      start: '00:00',
      end: '23:59',
      is24Hours: true
    },
    responseTimeMinutes: 12,
    rating: 4.9,
    lastActiveTime: new Date()
  },
  {
    id: 'police-001',
    name: 'Inspector Mary Wanjiku',
    type: 'police',
    isAvailable: true,
    currentCaseLoad: 4,
    maxCaseLoad: 10,
    location: {
      latitude: -1.286389,
      longitude: 36.817223,
      address: 'Central Police Station, Nairobi',
      facilityName: 'Central Police Station'
    },
    specializations: ['gbv_investigations', 'sexual_offences', 'evidence_collection'],
    contactInfo: {
      phone: '+254712345101'
    },
    workingHours: {
      start: '00:00',
      end: '23:59',
      is24Hours: true
    },
    responseTimeMinutes: 20,
    rating: 4.5,
    lastActiveTime: new Date()
  },
  {
    id: 'gbv_rescue-001',
    name: 'GBV Rescue Team Alpha',
    type: 'gbv_rescue',
    isAvailable: true,
    currentCaseLoad: 1,
    maxCaseLoad: 3,
    location: {
      latitude: -1.291389,
      longitude: 36.812223,
      address: 'GBV Response Center, Nairobi',
      facilityName: 'GBV Response Center'
    },
    specializations: ['emergency_response', 'crisis_intervention', 'safe_transport'],
    contactInfo: {
      phone: '+254712345201'
    },
    workingHours: {
      start: '00:00',
      end: '23:59',
      is24Hours: true
    },
    responseTimeMinutes: 8,
    rating: 4.7,
    lastActiveTime: new Date()
  }
];

export class ProviderRoutingService {

  /**
   * Main routing function - assigns providers to an incident
   */
  static async routeIncident(incident: Incident): Promise<ProviderAssignment[]> {
    console.log('Routing incident:', incident.id, 'Services:', incident.supportServices);

    // Get all available providers
    const availableProviders = this.getAvailableProviders();

    // Filter providers by requested services
    const relevantProviders = this.filterProvidersByServices(
      availableProviders,
      incident.supportServices
    );

    // Calculate assignments with priority scoring
    const assignments = this.calculateAssignments(incident, relevantProviders);

    // Sort by priority (1 = highest)
    const sortedAssignments = assignments.sort((a, b) => a.priority - b.priority);

    // Limit to top 3 providers per service type
    const finalAssignments = this.limitAssignmentsPerType(sortedAssignments);

    console.log('Routing complete. Assigned providers:', finalAssignments.length);
    return finalAssignments;
  }

  /**
   * Get providers that are currently available
   */
  private static getAvailableProviders(): ProviderProfile[] {
    const now = new Date();

    return mockProviders.filter(provider => {
      // Check availability
      if (!provider.isAvailable) return false;

      // Check capacity
      if (provider.currentCaseLoad >= provider.maxCaseLoad) return false;

      // Check working hours (if not 24/7)
      if (!provider.workingHours.is24Hours) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        const [startHour, startMin] = provider.workingHours.start.split(':').map(Number);
        const [endHour, endMin] = provider.workingHours.end.split(':').map(Number);
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        if (currentTime < startTime || currentTime > endTime) return false;
      }

      return true;
    });
  }

  /**
   * Filter providers by requested services
   */
  private static filterProvidersByServices(
    providers: ProviderProfile[],
    requestedServices: string[]
  ): ProviderProfile[] {
    const serviceToProviderType: { [key: string]: string[] } = {
      'medical': ['healthcare'],
      'emergency': ['gbv_rescue', 'healthcare'],
      'police': ['police'],
      'legal': ['legal'],
      'counseling': ['counseling'],
      'shelter': ['social'],
      'financial': ['social']
    };

    const neededProviderTypes = new Set<string>();

    requestedServices.forEach(service => {
      const providerTypes = serviceToProviderType[service] || [];
      providerTypes.forEach(type => neededProviderTypes.add(type));
    });

    return providers.filter(provider =>
      neededProviderTypes.has(provider.type)
    );
  }

  /**
   * Calculate priority assignments for each provider
   */
  private static calculateAssignments(
    incident: Incident,
    providers: ProviderProfile[]
  ): ProviderAssignment[] {
    const incidentLocation = incident.location?.coordinates;

    return providers.map(provider => {
      // Calculate distance (if location available)
      let distance = 0;
      if (incidentLocation) {
        distance = this.calculateDistance(
          incidentLocation.latitude,
          incidentLocation.longitude,
          provider.location.latitude,
          provider.location.longitude
        );
      }

      // Calculate priority score (lower = higher priority)
      let priorityScore = 0;

      // Urgency factor
      switch (incident.urgencyLevel) {
        case 'immediate':
          priorityScore += provider.type === 'gbv_rescue' ? 1 :
                          provider.type === 'healthcare' ? 2 : 5;
          break;
        case 'urgent':
          priorityScore += provider.type === 'healthcare' ? 1 :
                          provider.type === 'gbv_rescue' ? 2 : 3;
          break;
        case 'routine':
          priorityScore += 3;
          break;
      }

      // Distance factor (closer = better)
      priorityScore += Math.min(distance / 5, 10); // Max 10 points for distance

      // Capacity factor (less loaded = better)
      const capacityRatio = provider.currentCaseLoad / provider.maxCaseLoad;
      priorityScore += capacityRatio * 5;

      // Response time factor
      priorityScore += provider.responseTimeMinutes / 10;

      // Rating factor (higher rating = better)
      priorityScore -= (provider.rating - 3) * 2;

      // 24/7 availability bonus for urgent cases
      if ((incident.urgencyLevel === 'immediate' || incident.urgencyLevel === 'urgent') &&
          provider.workingHours.is24Hours) {
        priorityScore -= 2;
      }

      return {
        providerId: provider.id,
        providerType: provider.type,
        priority: Math.round(priorityScore),
        estimatedResponseTime: provider.responseTimeMinutes + Math.round(distance * 2), // 2 min per km
        distance,
        specializations: provider.specializations,
        contactInfo: {
          phone: provider.contactInfo.phone,
          email: provider.contactInfo.email,
          facilityName: provider.location.facilityName
        }
      };
    });
  }

  /**
   * Limit assignments to top providers per service type
   */
  private static limitAssignmentsPerType(assignments: ProviderAssignment[]): ProviderAssignment[] {
    const typeGroups: { [key: string]: ProviderAssignment[] } = {};

    assignments.forEach(assignment => {
      if (!typeGroups[assignment.providerType]) {
        typeGroups[assignment.providerType] = [];
      }
      typeGroups[assignment.providerType].push(assignment);
    });

    const result: ProviderAssignment[] = [];
    Object.values(typeGroups).forEach(group => {
      // Take top 2 providers per type
      result.push(...group.slice(0, 2));
    });

    return result;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private static calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get provider details by ID
   */
  static getProviderById(providerId: string): ProviderProfile | null {
    return mockProviders.find(p => p.id === providerId) || null;
  }

  /**
   * Update provider availability
   */
  static updateProviderStatus(providerId: string, isAvailable: boolean): void {
    const provider = mockProviders.find(p => p.id === providerId);
    if (provider) {
      provider.isAvailable = isAvailable;
      provider.lastActiveTime = new Date();
    }
  }

  /**
   * Increment provider case load
   */
  static assignCaseToProvider(providerId: string): void {
    const provider = mockProviders.find(p => p.id === providerId);
    if (provider) {
      provider.currentCaseLoad += 1;
    }
  }
}