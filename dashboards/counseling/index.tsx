// Counseling Dashboard Main Export
// This file serves as the main entry point for the counseling dashboard

export { default as DashboardOverview } from './components/DashboardOverview';
export { default as ClientsList } from './components/ClientsList';
export { default as SessionsList } from './components/SessionsList';
export { default as TreatmentPlans } from './components/TreatmentPlans';
export { default as TherapyNotes } from './components/TherapyNotes';

// Counseling-specific types and utilities
export interface CounselingStats {
  totalClients: number;
  todaySessions: number;
  activeTreatmentPlans: number;
  completedSessions: number;
  pendingAssessments: number;
  averageSessionDuration: number;
}

export interface Client {
  id: string;
  name: string;
  age: number;
  gender: string;
  primaryConcern: string;
  status: 'active' | 'on_hold' | 'completed' | 'referred';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastSession: string;
  nextSession?: string;
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  caseId: string;
  therapistNotes?: string;
}

export interface CounselingSession {
  id: string;
  clientName: string;
  clientId: string;
  type: 'individual' | 'group' | 'family' | 'couples' | 'crisis';
  mode: 'in_person' | 'video_call' | 'phone_call';
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  location?: string;
  sessionNotes?: string;
  goals: string[];
  progress: 'excellent' | 'good' | 'fair' | 'poor' | 'no_progress';
  nextSteps?: string;
  caseId: string;
}

export interface TreatmentPlan {
  id: string;
  clientId: string;
  clientName: string;
  diagnosis: string;
  goals: {
    id: string;
    description: string;
    targetDate: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
    progress: number;
  }[];
  interventions: string[];
  frequency: string;
  duration: string;
  createdDate: string;
  lastUpdated: string;
  status: 'active' | 'completed' | 'on_hold' | 'discontinued';
  caseId: string;
}

export interface TherapyNote {
  id: string;
  clientId: string;
  clientName: string;
  sessionId?: string;
  type: 'session_note' | 'progress_note' | 'assessment' | 'crisis_note' | 'discharge_summary';
  title: string;
  content: string;
  date: string;
  therapist: string;
  status: 'draft' | 'completed' | 'pending_review' | 'approved';
  confidentiality: 'standard' | 'restricted' | 'high_security';
  tags: string[];
  caseId: string;
}