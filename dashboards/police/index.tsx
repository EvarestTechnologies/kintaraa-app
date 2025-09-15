// Police Dashboard Main Export
// This file serves as the main entry point for the police dashboard

export { default as DashboardOverview } from './components/DashboardOverview';
export { default as CasesList } from './components/CasesList';
export { default as EvidenceManager } from './components/EvidenceManager';
export { default as ReportsList } from './components/ReportsList';

// Police-specific types and utilities
export interface PoliceStats {
  totalCases: number;
  activeCases: number;
  evidenceItems: number;
  reportsGenerated: number;
  casesResolved: number;
  averageResponseTime: number;
}

export interface PoliceCase {
  id: string;
  caseNumber: string;
  incidentType: 'domestic_violence' | 'sexual_assault' | 'harassment' | 'theft' | 'assault' | 'fraud' | 'other';
  status: 'open' | 'under_investigation' | 'closed' | 'cold_case' | 'referred';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reportedDate: string;
  incidentDate: string;
  location: string;
  reportingOfficer: string;
  assignedDetective?: string;
  victimName: string;
  victimId: string;
  suspectName?: string;
  description: string;
  lastActivity: string;
  evidenceCount: number;
  witnessCount: number;
}

export interface Evidence {
  id: string;
  caseId: string;
  caseNumber: string;
  type: 'physical' | 'digital' | 'document' | 'photo' | 'video' | 'audio' | 'forensic';
  description: string;
  collectedDate: string;
  collectedBy: string;
  location: string;
  chainOfCustody: ChainOfCustodyEntry[];
  status: 'collected' | 'analyzed' | 'stored' | 'released' | 'destroyed';
  tags: string[];
  confidential: boolean;
  forensicResults?: string;
}

export interface ChainOfCustodyEntry {
  id: string;
  officer: string;
  action: 'collected' | 'transferred' | 'analyzed' | 'stored' | 'released';
  date: string;
  time: string;
  location: string;
  notes?: string;
}

export interface PoliceReport {
  id: string;
  caseId: string;
  reportNumber: string;
  type: 'incident' | 'arrest' | 'investigation' | 'patrol' | 'traffic' | 'evidence' | 'witness';
  title: string;
  description: string;
  createdDate: string;
  createdBy: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'filed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  involvedParties: string[];
  location: string;
  incidentTime?: string;
  supervisorReview?: boolean;
  attachments?: string[];
}