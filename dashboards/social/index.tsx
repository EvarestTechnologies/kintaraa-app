// Social Services Dashboard Main Export
// This file serves as the main entry point for the social services dashboard

export { default as DashboardOverview } from './components/DashboardOverview';
export { default as ClientsList } from './components/ClientsList';
export { default as ServicesList } from './components/ServicesList';
export { default as CaseManagement } from './components/CaseManagement';
export { default as ResourceDirectory } from './components/ResourceDirectory';
export { default as CommunityOutreach } from './components/CommunityOutreach';

// Social Services-specific types and utilities
export interface SocialServicesStats {
  totalClients: number;
  activeServices: number;
  completedReferrals: number;
  pendingAssessments: number;
  communityPrograms: number;
  resourcesProvided: number;
  averageServiceTime: number;
  clientSatisfactionRate: number;
}

export interface SocialClient {
  id: string;
  name: string;
  age: number;
  gender: string;
  familySize: number;
  primaryNeeds: string[];
  status: 'active' | 'pending' | 'completed' | 'referred' | 'on_hold';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastContact: string;
  nextAppointment?: string;
  phone: string;
  email?: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  caseId: string;
  assignedWorker: string;
  notes?: string;
  vulnerabilities: string[];
  supportNetwork: string[];
}

export interface SocialService {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: 'housing' | 'food_assistance' | 'financial_aid' | 'childcare' | 'transportation' | 'job_training' | 'education' | 'healthcare_referral' | 'legal_aid' | 'counseling_referral' | 'emergency_assistance';
  status: 'requested' | 'approved' | 'in_progress' | 'completed' | 'denied' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestDate: string;
  approvalDate?: string;
  completionDate?: string;
  description: string;
  eligibilityCriteria: string[];
  documentsRequired: string[];
  documentsSubmitted: string[];
  provider: string;
  cost?: number;
  fundingSource?: string;
  notes?: string;
  caseId: string;
}

export interface CommunityResource {
  id: string;
  name: string;
  category: 'housing' | 'food' | 'healthcare' | 'education' | 'employment' | 'legal' | 'childcare' | 'transportation' | 'financial' | 'emergency';
  description: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  hours: string;
  eligibility: string[];
  services: string[];
  capacity: number;
  currentAvailability: number;
  waitingList: number;
  lastUpdated: string;
  isActive: boolean;
  contactPerson: string;
  notes?: string;
}

export interface CommunityProgram {
  id: string;
  name: string;
  type: 'workshop' | 'support_group' | 'training' | 'outreach' | 'awareness' | 'prevention';
  description: string;
  targetAudience: string[];
  startDate: string;
  endDate?: string;
  schedule: string;
  location: string;
  capacity: number;
  enrolled: number;
  facilitator: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled' | 'on_hold';
  objectives: string[];
  materials: string[];
  outcomes?: string[];
  feedback?: {
    rating: number;
    comments: string[];
  };
}

export interface ServiceAssessment {
  id: string;
  clientId: string;
  clientName: string;
  assessmentType: 'initial' | 'follow_up' | 'crisis' | 'closure' | 'risk_assessment';
  assessmentDate: string;
  assessor: string;
  findings: {
    strengths: string[];
    needs: string[];
    risks: string[];
    resources: string[];
  };
  recommendations: string[];
  servicePlan: {
    goals: string[];
    interventions: string[];
    timeline: string;
    reviewDate: string;
  };
  status: 'draft' | 'completed' | 'pending_review' | 'approved';
  caseId: string;
}