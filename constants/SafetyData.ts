// Safety and Emergency Dummy Data
// This file contains dummy data for safety features, emergency contacts, and location-based services

export interface SafeLocation {
  id: string;
  name: string;
  type: 'shelter' | 'police_station' | 'hospital' | 'safe_house' | 'community_center' | 'legal_aid';
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  hours: string;
  services: string[];
  capacity?: number;
  currentOccupancy?: number;
  isVerified: boolean;
  accessibility: string[];
  languages: string[];
  specializations?: string[];
  emergencyOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyPlan {
  id: string;
  userId: string;
  title: string;
  isActive: boolean;
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
    isPrimary: boolean;
  }[];
  safeLocations: {
    locationId: string;
    name: string;
    address: string;
    notes?: string;
  }[];
  importantDocuments: {
    type: string;
    location: string;
    notes?: string;
  }[];
  emergencyBag: {
    item: string;
    isReady: boolean;
    location?: string;
  }[];
  codeWords: {
    word: string;
    meaning: string;
    contacts: string[];
  }[];
  digitalSafety: {
    action: string;
    isCompleted: boolean;
    priority: 'high' | 'medium' | 'low';
  }[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyAlert {
  id: string;
  userId: string;
  type: 'panic' | 'check_in' | 'safe_arrival' | 'help_needed';
  status: 'active' | 'resolved' | 'false_alarm';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  message?: string;
  contactsNotified: string[];
  responseTime?: number; // in seconds
  resolvedAt?: string;
  createdAt: string;
}

export interface SafetyResource {
  id: string;
  title: string;
  description: string;
  category: 'digital_safety' | 'physical_safety' | 'legal_protection' | 'emergency_planning';
  type: 'checklist' | 'guide' | 'video' | 'app' | 'website';
  content?: string;
  url?: string;
  downloadUrl?: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  isEmergency: boolean;
  createdAt: string;
}

// Dummy Safe Locations
export const dummySafeLocations: SafeLocation[] = [
  {
    id: 'safe-loc-1',
    name: 'Safe Haven Women\'s Shelter',
    type: 'shelter',
    address: '123 Sanctuary St, New York, NY 10001',
    coordinates: {
      latitude: 40.7505,
      longitude: -73.9934
    },
    phone: '+1-555-SHELTER',
    hours: '24/7',
    services: ['Emergency Shelter', 'Counseling', 'Legal Aid', 'Childcare'],
    capacity: 50,
    currentOccupancy: 32,
    isVerified: true,
    accessibility: ['Wheelchair Accessible', 'Sign Language Interpreter'],
    languages: ['English', 'Spanish', 'Arabic'],
    specializations: ['Domestic Violence', 'Human Trafficking'],
    emergencyOnly: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-10T10:00:00Z'
  },
  {
    id: 'safe-loc-2',
    name: 'NYPD 1st Precinct',
    type: 'police_station',
    address: '16 Ericsson Pl, New York, NY 10013',
    coordinates: {
      latitude: 40.7143,
      longitude: -74.0086
    },
    phone: '911',
    hours: '24/7',
    services: ['Emergency Response', 'Report Filing', 'Victim Services'],
    isVerified: true,
    accessibility: ['Wheelchair Accessible'],
    languages: ['English', 'Spanish'],
    emergencyOnly: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'safe-loc-3',
    name: 'NewYork-Presbyterian Hospital',
    type: 'hospital',
    address: '525 E 68th St, New York, NY 10065',
    coordinates: {
      latitude: 40.7648,
      longitude: -73.9540
    },
    phone: '+1-212-746-5454',
    hours: '24/7 Emergency',
    services: ['Emergency Medicine', 'SANE Exams', 'Mental Health Crisis'],
    isVerified: true,
    accessibility: ['Wheelchair Accessible', 'Multiple Language Services'],
    languages: ['English', 'Spanish', 'Mandarin', 'Arabic', 'Russian'],
    specializations: ['Trauma Care', 'Forensic Medicine'],
    emergencyOnly: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'safe-loc-4',
    name: 'Legal Aid Society - Domestic Violence Unit',
    type: 'legal_aid',
    address: '199 Water St, New York, NY 10038',
    coordinates: {
      latitude: 40.7074,
      longitude: -74.0113
    },
    phone: '+1-212-577-3300',
    hours: 'Mon-Fri 9AM-5PM',
    services: ['Legal Representation', 'Restraining Orders', 'Immigration Help'],
    isVerified: true,
    accessibility: ['Wheelchair Accessible'],
    languages: ['English', 'Spanish', 'Chinese'],
    specializations: ['Domestic Violence Law', 'Immigration Law'],
    emergencyOnly: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'safe-loc-5',
    name: 'YMCA Community Center',
    type: 'community_center',
    address: '5 W 63rd St, New York, NY 10023',
    coordinates: {
      latitude: 40.7713,
      longitude: -73.9799
    },
    phone: '+1-212-912-2600',
    hours: 'Mon-Fri 6AM-10PM, Sat-Sun 7AM-8PM',
    services: ['Support Groups', 'Childcare', 'Job Training', 'Fitness'],
    isVerified: true,
    accessibility: ['Wheelchair Accessible', 'Childcare Available'],
    languages: ['English', 'Spanish'],
    emergencyOnly: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Dummy Safety Plans
export const dummySafetyPlans: SafetyPlan[] = [
  {
    id: 'safety-plan-1',
    userId: 'user-1',
    title: 'My Personal Safety Plan',
    isActive: true,
    emergencyContacts: [
      {
        name: 'Sarah Johnson',
        relationship: 'Sister',
        phone: '+1-555-0101',
        isPrimary: true
      },
      {
        name: 'Maria Rodriguez',
        relationship: 'Best Friend',
        phone: '+1-555-0102',
        isPrimary: false
      },
      {
        name: 'Dr. Emily Chen',
        relationship: 'Therapist',
        phone: '+1-555-0103',
        isPrimary: false
      }
    ],
    safeLocations: [
      {
        locationId: 'safe-loc-1',
        name: 'Safe Haven Women\'s Shelter',
        address: '123 Sanctuary St, New York, NY 10001',
        notes: 'Ask for Maria at front desk'
      },
      {
        locationId: 'safe-loc-4',
        name: 'Legal Aid Society',
        address: '199 Water St, New York, NY 10038',
        notes: 'Attorney: Michael Chen'
      }
    ],
    importantDocuments: [
      {
        type: 'ID/Passport',
        location: 'Safety deposit box at Chase Bank',
        notes: 'Box #1234, key hidden in bedroom'
      },
      {
        type: 'Birth Certificate',
        location: 'With sister Sarah',
        notes: 'She has copies of all important docs'
      },
      {
        type: 'Medical Records',
        location: 'Digital copies in secure cloud storage'
      }
    ],
    emergencyBag: [
      {
        item: 'Change of clothes',
        isReady: true,
        location: 'Hidden in closet'
      },
      {
        item: 'Cash ($500)',
        isReady: true,
        location: 'In emergency bag'
      },
      {
        item: 'Medications',
        isReady: false,
        location: 'Need to prepare'
      },
      {
        item: 'Phone charger',
        isReady: true,
        location: 'In emergency bag'
      },
      {
        item: 'Keys (car, house)',
        isReady: true,
        location: 'Spare set with Sarah'
      }
    ],
    codeWords: [
      {
        word: 'Red roses',
        meaning: 'I need help immediately',
        contacts: ['Sarah Johnson', 'Maria Rodriguez']
      },
      {
        word: 'Blue sky',
        meaning: 'I am safe and okay',
        contacts: ['Sarah Johnson']
      }
    ],
    digitalSafety: [
      {
        action: 'Change all passwords',
        isCompleted: true,
        priority: 'high'
      },
      {
        action: 'Enable two-factor authentication',
        isCompleted: true,
        priority: 'high'
      },
      {
        action: 'Check for tracking apps',
        isCompleted: false,
        priority: 'high'
      },
      {
        action: 'Secure social media accounts',
        isCompleted: true,
        priority: 'medium'
      }
    ],
    notes: 'Remember to update this plan regularly. Trust your instincts. Your safety is the priority.',
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-12-10T14:30:00Z'
  }
];

// Dummy Emergency Alerts
export const dummyEmergencyAlerts: EmergencyAlert[] = [
  {
    id: 'alert-1',
    userId: 'user-1',
    type: 'check_in',
    status: 'resolved',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'Times Square, New York, NY'
    },
    message: 'Arrived safely at meeting location',
    contactsNotified: ['Sarah Johnson', 'Maria Rodriguez'],
    responseTime: 45,
    resolvedAt: '2024-12-10T15:30:00Z',
    createdAt: '2024-12-10T15:00:00Z'
  },
  {
    id: 'alert-2',
    userId: 'user-1',
    type: 'panic',
    status: 'resolved',
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '123 Main St, New York, NY'
    },
    contactsNotified: ['Sarah Johnson', '911'],
    responseTime: 120,
    resolvedAt: '2024-12-08T20:15:00Z',
    createdAt: '2024-12-08T20:00:00Z'
  }
];

// Dummy Safety Resources
export const dummySafetyResources: SafetyResource[] = [
  {
    id: 'safety-res-1',
    title: 'Digital Safety Checklist',
    description: 'Comprehensive checklist to secure your digital life and protect your privacy',
    category: 'digital_safety',
    type: 'checklist',
    content: 'Digital Safety Checklist: Change all passwords, enable two-factor authentication, check for tracking apps, review privacy settings, use VPN, create new email accounts if necessary, backup data securely, clear browser history, use private browsing, be cautious about location sharing, review app permissions, consider using different device if possible.',
    priority: 'high',
    tags: ['privacy', 'security', 'technology', 'stalking'],
    isEmergency: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'safety-res-2',
    title: 'Emergency Bag Essentials',
    description: 'What to pack in your emergency bag for quick departure',
    category: 'emergency_planning',
    type: 'checklist',
    content: 'Emergency Bag Essentials: Important documents (ID, passport, birth certificate), cash and credit cards, medications, change of clothes, phone and charger, keys, personal hygiene items, comfort items for children, emergency contact information, copies of legal documents, flashlight and batteries, non-perishable snacks.',
    priority: 'high',
    tags: ['emergency', 'preparation', 'safety_planning'],
    isEmergency: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'safety-res-3',
    title: 'Recognizing Stalking Behaviors',
    description: 'Learn to identify stalking behaviors and document evidence',
    category: 'physical_safety',
    type: 'guide',
    content: 'Stalking behaviors include: following or surveillance, unwanted gifts or messages, monitoring activities, showing up at locations, threatening you or family, damaging property, using technology to track. Document with detailed logs, save all messages, take photos, get witness statements, report to police.',
    priority: 'medium',
    tags: ['stalking', 'documentation', 'evidence', 'legal'],
    isEmergency: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'safety-res-4',
    title: 'Legal Protection Options',
    description: 'Understanding restraining orders and other legal protections',
    category: 'legal_protection',
    type: 'guide',
    content: 'Types of Legal Protection: Restraining Order (prohibits contact or proximity), No-Contact Order (part of criminal proceedings), Civil Protection Order (available in civil court). To obtain: contact courthouse or legal aid, gather evidence, complete forms, attend hearing, serve papers.',
    priority: 'high',
    tags: ['legal', 'restraining_order', 'protection', 'court'],
    isEmergency: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'safety-res-5',
    title: 'Safety Apps for Survivors',
    description: 'Recommended mobile apps for safety and emergency situations',
    category: 'digital_safety',
    type: 'app',
    url: 'https://www.techsafety.org/resources-survivors',
    content: 'Recommended Safety Apps: MyPlan (safety planning), bSafe (personal safety with GPS), Aspire News (disguised safety app), TechSafety (digital security resources), One Love Escalation Workshop (relationship health). Look for: quick emergency contacts, GPS location sharing, evidence documentation, disguised appearance, offline functionality.',
    priority: 'medium',
    tags: ['apps', 'technology', 'emergency', 'GPS'],
    isEmergency: false,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Export all safety data
export const SafetyData = {
  safeLocations: dummySafeLocations,
  safetyPlans: dummySafetyPlans,
  emergencyAlerts: dummyEmergencyAlerts,
  safetyResources: dummySafetyResources
};

export default SafetyData;