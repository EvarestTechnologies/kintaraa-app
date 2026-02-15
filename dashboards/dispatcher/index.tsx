/**
 * Dispatcher Dashboard Module
 * Central coordination hub for GBV case management
 */

export { default as DashboardOverview } from './components/DashboardOverview';
export { default as DispatcherProfile } from './components/DispatcherProfile';

// Dispatcher-specific types
export interface DispatcherStats {
  totalCases: number;
  newCases: number;
  pendingAssignment: number;
  assignedCases: number;
  inProgressCases: number;
  completedCases: number;
  urgentCases: number;
  responseTime: string;
}

export interface DispatcherProfile {
  id: string;
  name: string;
  title: string;
  employeeId: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  onDutyStatus: boolean;
}
