// Community Health Worker (CHW) Dashboard Main Export
// This file serves as the main entry point for the CHW dashboard

export { default as DashboardOverview } from './components/DashboardOverview';
export { default as PatientsList } from './components/PatientsList';
export { default as HealthEducation } from './components/HealthEducation';
export { default as CommunityOutreach } from './components/CommunityOutreach';
export { default as HealthScreenings } from './components/HealthScreenings';
export { default as ReferralTracking } from './components/ReferralTracking';
export { default as HealthResources } from './components/HealthResources';

// CHW-specific types and utilities
export interface CHWStats {
  totalPatients: number;
  activePatients: number;
  completedScreenings: number;
  pendingReferrals: number;
  educationSessions: number;
  communityEvents: number;
  averageFollowUpTime: number;
  patientSatisfactionRate: number;
}

export interface CHWPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  healthConditions: string[];
  riskFactors: string[];
  lastVisit: string;
  nextAppointment?: string;
  status: 'active' | 'inactive' | 'referred' | 'completed' | 'lost_to_followup';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  insuranceStatus: 'insured' | 'uninsured' | 'underinsured' | 'medicaid' | 'medicare';
  preferredLanguage: string;
  culturalConsiderations?: string[];
  socialDeterminants: {
    housing: 'stable' | 'unstable' | 'homeless';
    food: 'secure' | 'insecure';
    transportation: 'available' | 'limited' | 'none';
    employment: 'employed' | 'unemployed' | 'underemployed';
    education: string;
  };
  caseId: string;
  assignedCHW: string;
  notes?: string;
}

export interface HealthScreening {
  id: string;
  patientId: string;
  patientName: string;
  screeningType: 'blood_pressure' | 'diabetes' | 'cholesterol' | 'bmi' | 'depression' | 'substance_use' | 'cancer' | 'immunization' | 'vision' | 'hearing';
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled' | 'follow_up_needed';
  scheduledDate: string;
  completedDate?: string;
  results?: {
    values: Record<string, any>;
    interpretation: 'normal' | 'borderline' | 'abnormal' | 'critical';
    recommendations: string[];
  };
  followUpRequired: boolean;
  followUpDate?: string;
  referralNeeded: boolean;
  referralProvider?: string;
  notes?: string;
  caseId: string;
}

export interface HealthEducationSession {
  id: string;
  title: string;
  topic: 'diabetes_management' | 'hypertension' | 'nutrition' | 'exercise' | 'mental_health' | 'substance_abuse' | 'maternal_health' | 'child_health' | 'preventive_care' | 'medication_management';
  type: 'individual' | 'group' | 'community_event' | 'workshop' | 'webinar';
  description: string;
  targetAudience: string[];
  scheduledDate: string;
  duration: number; // in minutes
  location: string;
  facilitator: string;
  maxParticipants?: number;
  registeredParticipants: number;
  attendedParticipants?: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  materials: string[];
  objectives: string[];
  outcomes?: string[];
  feedback?: {
    rating: number;
    comments: string[];
  };
  followUpActions?: string[];
}

export interface CommunityOutreachEvent {
  id: string;
  name: string;
  type: 'health_fair' | 'screening_event' | 'vaccination_clinic' | 'education_workshop' | 'support_group' | 'awareness_campaign';
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  targetPopulation: string[];
  expectedAttendance: number;
  actualAttendance?: number;
  services: string[];
  partners: string[];
  coordinator: string;
  volunteers: string[];
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  budget?: number;
  outcomes?: {
    screeningsCompleted: number;
    referralsMade: number;
    educationMaterialsDistributed: number;
    newPatientRegistrations: number;
  };
  feedback?: {
    rating: number;
    comments: string[];
  };
}

export interface HealthReferral {
  id: string;
  patientId: string;
  patientName: string;
  referralType: 'primary_care' | 'specialist' | 'mental_health' | 'dental' | 'vision' | 'pharmacy' | 'social_services' | 'emergency';
  provider: string;
  providerContact: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'emergent';
  referralDate: string;
  appointmentDate?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'missed' | 'cancelled' | 'declined';
  followUpDate?: string;
  outcome?: string;
  barriers?: string[];
  notes?: string;
  caseId: string;
}

export interface HealthResource {
  id: string;
  name: string;
  category: 'healthcare_provider' | 'pharmacy' | 'social_service' | 'food_assistance' | 'transportation' | 'housing' | 'education' | 'employment' | 'legal_aid';
  description: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  hours: string;
  services: string[];
  eligibility: string[];
  languages: string[];
  accessibility: string[];
  cost: 'free' | 'sliding_scale' | 'insurance_accepted' | 'private_pay';
  waitTime: string;
  lastUpdated: string;
  isActive: boolean;
  contactPerson: string;
  notes?: string;
  rating?: number;
  reviews?: string[];
}