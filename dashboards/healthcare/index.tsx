// Healthcare Dashboard Main Export
// This file serves as the main entry point for the healthcare dashboard

export { default as DashboardOverview } from './components/DashboardOverview';
export { default as PatientsList } from './components/PatientsList';
export { default as AppointmentsList } from './components/AppointmentsList';
export { default as MedicalRecords } from './components/MedicalRecords';
export { default as ProviderProfile } from './components/ProviderProfile';

// Healthcare-specific types and utilities
export interface HealthcareStats {
  totalPatients: number;
  todayAppointments: number;
  pendingRecords: number;
  emergencyCases: number;
  completedToday: number;
  averageConsultationTime: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: 'active' | 'recovering' | 'stable' | 'critical';
  lastVisit: string;
  nextAppointment?: string;
  phone: string;
  address: string;
  caseId: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  type: 'consultation' | 'follow_up' | 'emergency' | 'therapy';
  mode: 'in_person' | 'video_call' | 'phone_call';
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  location?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  caseId: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  type: 'consultation' | 'diagnosis' | 'treatment' | 'lab_result' | 'prescription' | 'therapy_note';
  title: string;
  description: string;
  date: string;
  provider: string;
  status: 'draft' | 'completed' | 'pending_review' | 'approved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  caseId: string;
}