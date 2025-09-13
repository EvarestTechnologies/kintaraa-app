// Comprehensive Dummy Data for Kintaraa Platform
// This file contains realistic dummy data for testing and development

export interface Survivor {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  contactInfo: {
    phone?: string;
    email?: string;
    preferredContact: 'phone' | 'email' | 'app';
  };
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
  }[];
  safetyStatus: 'safe' | 'at_risk' | 'immediate_danger';
  isAnonymous: boolean;
  registeredAt: string;
}

export interface ServiceProviderProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  organization: string;
  specializations: string[];
  services: string[];
  credentials: string[];
  experience: number; // years
  languages: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  availability: {
    isAvailable: boolean;
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: string[];
    capacity: number;
    currentCaseload: number;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  verified: boolean;
  rating: number;
  totalReviews: number;
  responseTime: number; // in minutes
  completedCases: number;
  joinedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'medical' | 'counseling' | 'shelter' | 'financial' | 'educational' | 'emergency';
  type: 'article' | 'video' | 'document' | 'hotline' | 'service' | 'guide';
  content?: string;
  url?: string;
  phoneNumber?: string;
  tags: string[];
  language: string;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  category: 'digital' | 'physical' | 'emotional' | 'financial' | 'legal';
  priority: 'low' | 'medium' | 'high';
  applicableScenarios: string[];
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  organization: string;
  phoneNumber: string;
  type: 'police' | 'medical' | 'crisis_hotline' | 'legal_aid' | 'shelter';
  availability: '24/7' | 'business_hours' | 'emergency_only';
  location: {
    city: string;
    state: string;
    country: string;
  };
  languages: string[];
  isVerified: boolean;
}

// Dummy Survivors Data
export const dummySurvivors: Survivor[] = [
  {
    id: 'survivor-1',
    name: 'Anonymous User 1',
    age: 28,
    gender: 'Female',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    contactInfo: {
      email: 'survivor1@secure.com',
      preferredContact: 'app'
    },
    emergencyContacts: [
      {
        name: 'Sarah Johnson',
        relationship: 'Sister',
        phone: '+1-555-0101'
      }
    ],
    safetyStatus: 'at_risk',
    isAnonymous: true,
    registeredAt: '2024-11-15T10:30:00Z'
  },
  {
    id: 'survivor-2',
    name: 'Maria Rodriguez',
    age: 34,
    gender: 'Female',
    location: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA'
    },
    contactInfo: {
      phone: '+1-555-0102',
      email: 'maria.r@email.com',
      preferredContact: 'phone'
    },
    emergencyContacts: [
      {
        name: 'Carlos Rodriguez',
        relationship: 'Brother',
        phone: '+1-555-0103'
      },
      {
        name: 'Ana Martinez',
        relationship: 'Friend',
        phone: '+1-555-0104'
      }
    ],
    safetyStatus: 'safe',
    isAnonymous: false,
    registeredAt: '2024-10-22T14:15:00Z'
  },
  {
    id: 'survivor-3',
    name: 'Anonymous User 3',
    age: 22,
    gender: 'Non-binary',
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA'
    },
    contactInfo: {
      email: 'survivor3@secure.com',
      preferredContact: 'app'
    },
    emergencyContacts: [
      {
        name: 'Alex Thompson',
        relationship: 'Partner',
        phone: '+1-555-0105'
      }
    ],
    safetyStatus: 'immediate_danger',
    isAnonymous: true,
    registeredAt: '2024-12-08T09:45:00Z'
  }
];

// Dummy Service Providers Data
export const dummyServiceProviders: ServiceProviderProfile[] = [
  {
    id: 'provider-1',
    userId: 'user-provider-1',
    name: 'Dr. Sarah Johnson',
    title: 'Licensed Clinical Social Worker',
    organization: 'Women\'s Crisis Center',
    specializations: ['Trauma Therapy', 'PTSD Treatment', 'Crisis Intervention'],
    services: ['medical', 'counseling'],
    credentials: ['LCSW', 'EMDR Certified', 'Trauma-Informed Care'],
    experience: 8,
    languages: ['English', 'Spanish'],
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Support St',
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    availability: {
      isAvailable: true,
      workingHours: { start: '09:00', end: '17:00' },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      capacity: 15,
      currentCaseload: 8
    },
    contact: {
      phone: '+1-555-0201',
      email: 'sarah.johnson@wcc.org',
      website: 'https://womenscrisiscenter.org'
    },
    verified: true,
    rating: 4.8,
    totalReviews: 127,
    responseTime: 30,
    completedCases: 245,
    joinedAt: '2022-03-15T08:00:00Z'
  },
  {
    id: 'provider-2',
    userId: 'user-provider-2',
    name: 'Attorney Michael Chen',
    title: 'Legal Aid Attorney',
    organization: 'Community Legal Services',
    specializations: ['Domestic Violence Law', 'Restraining Orders', 'Family Law'],
    services: ['legal', 'advocacy'],
    credentials: ['JD', 'Bar Certified', 'DV Legal Specialist'],
    experience: 12,
    languages: ['English', 'Mandarin', 'Cantonese'],
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '456 Justice Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    availability: {
      isAvailable: true,
      workingHours: { start: '08:00', end: '18:00' },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      capacity: 20,
      currentCaseload: 12
    },
    contact: {
      phone: '+1-555-0202',
      email: 'michael.chen@cls.org'
    },
    verified: true,
    rating: 4.6,
    totalReviews: 89,
    responseTime: 60,
    completedCases: 178,
    joinedAt: '2021-08-10T09:30:00Z'
  },
  {
    id: 'provider-3',
    userId: 'user-provider-3',
    name: 'Dr. Emily Rodriguez',
    title: 'Emergency Medicine Physician',
    organization: 'Metropolitan Hospital',
    specializations: ['Emergency Medicine', 'Forensic Medicine', 'Trauma Care'],
    services: ['medical', 'emergency'],
    credentials: ['MD', 'Board Certified EM', 'SANE Certified'],
    experience: 15,
    languages: ['English', 'Spanish', 'Portuguese'],
    location: {
      latitude: 40.7831,
      longitude: -73.9712,
      address: '789 Medical Center Dr',
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    availability: {
      isAvailable: true,
      workingHours: { start: '00:00', end: '23:59' },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      capacity: 25,
      currentCaseload: 18
    },
    contact: {
      phone: '+1-555-0203',
      email: 'emily.rodriguez@metrohosp.org'
    },
    verified: true,
    rating: 4.9,
    totalReviews: 203,
    responseTime: 15,
    completedCases: 412,
    joinedAt: '2020-01-20T07:00:00Z'
  },
  {
    id: 'provider-4',
    userId: 'user-provider-4',
    name: 'Lisa Thompson',
    title: 'Certified Counselor',
    organization: 'Safe Haven Counseling',
    specializations: ['Domestic Violence Counseling', 'Group Therapy', 'Art Therapy'],
    services: ['counseling', 'support_groups'],
    credentials: ['LPC', 'Art Therapy Certified', 'DV Specialist'],
    experience: 6,
    languages: ['English'],
    location: {
      latitude: 40.6892,
      longitude: -74.0445,
      address: '321 Healing Way',
      city: 'Brooklyn',
      state: 'NY',
      country: 'USA'
    },
    availability: {
      isAvailable: true,
      workingHours: { start: '10:00', end: '19:00' },
      workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      capacity: 12,
      currentCaseload: 7
    },
    contact: {
      phone: '+1-555-0204',
      email: 'lisa.thompson@safehaven.org'
    },
    verified: true,
    rating: 4.7,
    totalReviews: 64,
    responseTime: 45,
    completedCases: 98,
    joinedAt: '2023-05-12T11:00:00Z'
  }
];

// Dummy Resources Data
export const dummyResources: Resource[] = [
  {
    id: 'resource-1',
    title: 'National Domestic Violence Hotline',
    description: '24/7 confidential support for domestic violence survivors and their loved ones.',
    category: 'emergency',
    type: 'hotline',
    phoneNumber: '1-800-799-7233',
    tags: ['24/7', 'confidential', 'multilingual', 'crisis'],
    language: 'English',
    isEmergency: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'resource-2',
    title: 'Safety Planning Guide',
    description: 'Comprehensive guide to creating a personalized safety plan for domestic violence situations.',
    category: 'educational',
    type: 'guide',
    content: 'A safety plan is a personalized, practical plan that includes ways to remain safe while in a relationship, planning to leave, or after you leave...',
    tags: ['safety', 'planning', 'prevention', 'self-help'],
    language: 'English',
    isEmergency: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-01T14:30:00Z'
  },
  {
    id: 'resource-3',
    title: 'Legal Rights for Survivors',
    description: 'Understanding your legal rights and options as a domestic violence survivor.',
    category: 'legal',
    type: 'article',
    content: 'As a survivor of domestic violence, you have specific legal rights and protections...',
    tags: ['legal', 'rights', 'protection', 'restraining orders'],
    language: 'English',
    isEmergency: false,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z'
  },
  {
    id: 'resource-4',
    title: 'Trauma Recovery Techniques',
    description: 'Evidence-based techniques for healing from trauma and building resilience.',
    category: 'counseling',
    type: 'video',
    url: 'https://example.com/trauma-recovery-video',
    tags: ['trauma', 'healing', 'therapy', 'self-care'],
    language: 'English',
    isEmergency: false,
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z'
  },
  {
    id: 'resource-5',
    title: 'Financial Independence Toolkit',
    description: 'Resources and tools for achieving financial independence after leaving an abusive relationship.',
    category: 'financial',
    type: 'document',
    url: 'https://example.com/financial-toolkit.pdf',
    tags: ['financial', 'independence', 'budgeting', 'employment'],
    language: 'English',
    isEmergency: false,
    createdAt: '2024-02-05T13:00:00Z',
    updatedAt: '2024-02-05T13:00:00Z'
  }
];

// Dummy Safety Tips Data
export const dummySafetyTips: SafetyTip[] = [
  {
    id: 'tip-1',
    title: 'Digital Safety: Secure Your Devices',
    content: 'Change all passwords on your devices and accounts. Enable two-factor authentication where possible. Check for tracking apps or spyware.',
    category: 'digital',
    priority: 'high',
    applicableScenarios: ['leaving_relationship', 'ongoing_abuse', 'stalking'],
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'tip-2',
    title: 'Create a Safety Plan',
    content: 'Identify safe places to go in an emergency. Keep important documents in a safe location. Have a bag packed with essentials.',
    category: 'physical',
    priority: 'high',
    applicableScenarios: ['planning_to_leave', 'immediate_danger'],
    createdAt: '2024-01-10T08:15:00Z'
  },
  {
    id: 'tip-3',
    title: 'Document Evidence Safely',
    content: 'Take photos of injuries and property damage. Keep records in a secure location away from your abuser. Consider cloud storage with strong passwords.',
    category: 'legal',
    priority: 'medium',
    applicableScenarios: ['ongoing_abuse', 'legal_proceedings'],
    createdAt: '2024-01-10T08:30:00Z'
  },
  {
    id: 'tip-4',
    title: 'Financial Safety Measures',
    content: 'Open a separate bank account if possible. Keep some cash hidden in a safe place. Know your financial rights and resources.',
    category: 'financial',
    priority: 'medium',
    applicableScenarios: ['planning_to_leave', 'financial_abuse'],
    createdAt: '2024-01-10T08:45:00Z'
  },
  {
    id: 'tip-5',
    title: 'Emotional Self-Care',
    content: 'Practice grounding techniques during stress. Connect with supportive friends and family. Consider professional counseling.',
    category: 'emotional',
    priority: 'medium',
    applicableScenarios: ['ongoing_abuse', 'recovery', 'healing'],
    createdAt: '2024-01-10T09:00:00Z'
  }
];

// Dummy Emergency Contacts Data
export const dummyEmergencyContacts: EmergencyContact[] = [
  {
    id: 'emergency-1',
    name: 'Emergency Services',
    organization: 'Local Police/Fire/Medical',
    phoneNumber: '911',
    type: 'police',
    availability: '24/7',
    location: {
      city: 'Nationwide',
      state: 'All States',
      country: 'USA'
    },
    languages: ['English', 'Spanish'],
    isVerified: true
  },
  {
    id: 'emergency-2',
    name: 'National Domestic Violence Hotline',
    organization: 'National Coalition Against Domestic Violence',
    phoneNumber: '1-800-799-7233',
    type: 'crisis_hotline',
    availability: '24/7',
    location: {
      city: 'Nationwide',
      state: 'All States',
      country: 'USA'
    },
    languages: ['English', 'Spanish', 'Over 200 languages via interpretation'],
    isVerified: true
  },
  {
    id: 'emergency-3',
    name: 'RAINN National Sexual Assault Hotline',
    organization: 'Rape, Abuse & Incest National Network',
    phoneNumber: '1-800-656-4673',
    type: 'crisis_hotline',
    availability: '24/7',
    location: {
      city: 'Nationwide',
      state: 'All States',
      country: 'USA'
    },
    languages: ['English', 'Spanish'],
    isVerified: true
  },
  {
    id: 'emergency-4',
    name: 'NYC Family Justice Centers',
    organization: 'New York City Government',
    phoneNumber: '1-800-621-4673',
    type: 'legal_aid',
    availability: 'business_hours',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    languages: ['English', 'Spanish', 'Arabic', 'Chinese'],
    isVerified: true
  },
  {
    id: 'emergency-5',
    name: 'Safe Horizon',
    organization: 'Safe Horizon',
    phoneNumber: '1-800-621-4673',
    type: 'shelter',
    availability: '24/7',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    languages: ['English', 'Spanish'],
    isVerified: true
  }
];

// Additional dummy data for testing
export const dummyStatistics = {
  totalCases: 1247,
  activeCases: 89,
  completedCases: 1158,
  averageResponseTime: 42, // minutes
  successRate: 94.2, // percentage
  totalProviders: 156,
  availableProviders: 134,
  totalSurvivors: 892,
  activeSurvivors: 234
};

export const dummyNotifications = [
  {
    id: 'notif-1',
    type: 'new_case',
    title: 'New Case Assignment',
    message: 'You have been assigned a new high-priority case KIN-241210001',
    incidentId: 'dummy-1',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'New Message',
    message: 'You have received a new message from a survivor',
    incidentId: 'dummy-2',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'notif-3',
    type: 'status_update',
    title: 'Case Status Updated',
    message: 'Case KIN-241208003 has been marked as completed',
    incidentId: 'dummy-3',
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

// Export all dummy data as a single object for easy importing
export const DummyData = {
  survivors: dummySurvivors,
  serviceProviders: dummyServiceProviders,
  resources: dummyResources,
  safetyTips: dummySafetyTips,
  emergencyContacts: dummyEmergencyContacts,
  statistics: dummyStatistics,
  notifications: dummyNotifications
};

export default DummyData;