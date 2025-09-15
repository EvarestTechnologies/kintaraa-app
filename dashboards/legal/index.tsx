// Legal Dashboard Main Export
// This file serves as the main entry point for the legal dashboard

export { default as DashboardOverview } from './components/DashboardOverview';
export { default as CasesList } from './components/CasesList';
export { default as DocumentsList } from './components/DocumentsList';
export { default as CourtSchedule } from './components/CourtSchedule';

// Legal-specific types and utilities
export interface LegalStats {
  totalCases: number;
  activeCases: number;
  upcomingHearings: number;
  documentsReview: number;
  casesWon: number;
  averageCaseDuration: number;
}

export interface LegalCase {
  id: string;
  caseNumber: string;
  clientName: string;
  clientId: string;
  caseType: 'domestic_violence' | 'sexual_assault' | 'harassment' | 'discrimination' | 'family_law' | 'criminal';
  status: 'active' | 'pending' | 'closed' | 'on_hold' | 'appeal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dateOpened: string;
  lastActivity: string;
  nextHearing?: string;
  assignedLawyer: string;
  description: string;
  outcome?: string;
  courtLocation?: string;
  estimatedDuration?: number;
}

export interface LegalDocument {
  id: string;
  caseId: string;
  caseName: string;
  title: string;
  type: 'contract' | 'motion' | 'brief' | 'evidence' | 'correspondence' | 'court_order' | 'affidavit';
  status: 'draft' | 'review' | 'approved' | 'filed' | 'rejected';
  createdDate: string;
  lastModified: string;
  createdBy: string;
  fileSize?: string;
  tags: string[];
  confidential: boolean;
  description?: string;
}

export interface CourtHearing {
  id: string;
  caseId: string;
  caseName: string;
  caseNumber: string;
  type: 'hearing' | 'trial' | 'mediation' | 'deposition' | 'conference';
  date: string;
  time: string;
  duration: number;
  location: string;
  judge: string;
  status: 'scheduled' | 'confirmed' | 'postponed' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  outcome?: string;
  attendees: string[];
}