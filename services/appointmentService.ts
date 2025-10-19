/**
 * Appointment Service
 * Handles appointment management with backend API integration
 * Supports local storage fallback and state synchronization
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, apiRequest } from './api';
import { AppointmentReminderService } from './appointmentReminderService';

// Storage keys
const STORAGE_KEYS = {
  APPOINTMENTS: 'appointments',
  PENDING_SYNC: 'appointments_pending_sync',
  LAST_SYNC: 'appointments_last_sync',
};

// Types
export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentType =
  | 'medical_exam'
  | 'counseling'
  | 'legal_consultation'
  | 'follow_up'
  | 'court_appearance'
  | 'other';

export interface Appointment {
  id: string;
  caseId: string;
  providerId: string;
  providerName: string;
  providerType: string;
  survivorId: string;
  survivorName: string;
  type: AppointmentType;
  date: string; // ISO 8601
  time: string; // HH:mm format
  duration: number; // minutes
  location: string;
  status: AppointmentStatus;
  notes?: string;
  reminders?: AppointmentReminder[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  reminderTime: string; // ISO 8601
  method: 'push' | 'sms' | 'both';
  sent: boolean;
  sentAt?: string;
}

export interface CreateAppointmentRequest {
  caseId: string;
  providerId: string;
  survivorId: string;
  type: AppointmentType;
  date: string;
  time: string;
  duration: number;
  location: string;
  notes?: string;
  sendReminders?: boolean;
}

export interface UpdateAppointmentRequest {
  date?: string;
  time?: string;
  duration?: number;
  location?: string;
  notes?: string;
  status?: AppointmentStatus;
}

export interface ScheduleReminderRequest {
  appointmentId: string;
  reminderTime: string;
  method: 'push' | 'sms' | 'both';
}

/**
 * Appointment Service Class
 */
export class AppointmentService {
  /**
   * Create a new appointment
   */
  static async createAppointment(
    request: CreateAppointmentRequest
  ): Promise<Appointment> {
    try {
      // Attempt API call
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.APPOINTMENTS.CREATE,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

      if (response.ok) {
        const appointment = await response.json();

        // Store locally
        await this.storeAppointmentLocally(appointment);

        // Schedule reminders if requested
        if (request.sendReminders) {
          await this.scheduleAppointmentReminders(this.transformAppointment(appointment));
        }

        return this.transformAppointment(appointment);
      }

      throw new Error('Failed to create appointment');
    } catch (error) {
      console.error('API create appointment failed, using local storage:', error);

      // Fallback to local creation
      const localAppointment: Appointment = {
        id: `local-${Date.now()}`,
        ...request,
        providerName: 'TBD',
        providerType: 'TBD',
        survivorName: 'TBD',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current_user', // TODO: Get from auth context
      };

      // Store locally
      await this.storeAppointmentLocally(localAppointment);

      // Schedule reminders if requested
      if (request.sendReminders) {
        await this.scheduleAppointmentReminders(localAppointment);
      }

      // Queue for sync
      await this.addToPendingSync({
        action: 'create',
        data: request,
        timestamp: new Date().toISOString(),
      });

      return localAppointment;
    }
  }

  /**
   * Get all appointments
   */
  static async getAppointments(filters?: {
    caseId?: string;
    providerId?: string;
    status?: AppointmentStatus;
    fromDate?: string;
    toDate?: string;
  }): Promise<Appointment[]> {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters?.caseId) params.append('case_id', filters.caseId);
      if (filters?.providerId) params.append('provider_id', filters.providerId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.fromDate) params.append('from_date', filters.fromDate);
      if (filters?.toDate) params.append('to_date', filters.toDate);

      const url = `${API_CONFIG.ENDPOINTS.APPOINTMENTS.LIST}?${params.toString()}`;
      const response = await apiRequest(url, { method: 'GET' });

      if (response.ok) {
        const data = await response.json();
        const appointments = data.results || data;

        // Update local storage
        await this.updateLocalAppointments(appointments);

        return appointments.map(this.transformAppointment);
      }

      throw new Error('Failed to fetch appointments');
    } catch (error) {
      console.error('API get appointments failed, using local storage:', error);

      // Fallback to local storage
      return this.getLocalAppointments(filters);
    }
  }

  /**
   * Get upcoming appointments
   */
  static async getUpcomingAppointments(limit: number = 10): Promise<Appointment[]> {
    try {
      const url = `${API_CONFIG.ENDPOINTS.APPOINTMENTS.UPCOMING}?limit=${limit}`;
      const response = await apiRequest(url, { method: 'GET' });

      if (response.ok) {
        const appointments = await response.json();
        return appointments.map(this.transformAppointment);
      }

      throw new Error('Failed to fetch upcoming appointments');
    } catch (error) {
      console.error('API get upcoming failed, using local storage:', error);

      // Fallback to local - get appointments from today onwards
      const today = new Date().toISOString().split('T')[0];
      const local = await this.getLocalAppointments({
        fromDate: today,
        status: 'scheduled',
      });

      // Sort by date/time and limit
      return local
        .sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, limit);
    }
  }

  /**
   * Get appointment by ID
   */
  static async getAppointment(id: string): Promise<Appointment | null> {
    try {
      const url = API_CONFIG.ENDPOINTS.APPOINTMENTS.DETAIL.replace('{id}', id);
      const response = await apiRequest(url, { method: 'GET' });

      if (response.ok) {
        const appointment = await response.json();
        await this.storeAppointmentLocally(appointment);
        return this.transformAppointment(appointment);
      }

      throw new Error('Failed to fetch appointment');
    } catch (error) {
      console.error('API get appointment failed, using local storage:', error);

      // Fallback to local storage
      const local = await this.getLocalAppointments();
      return local.find(apt => apt.id === id) || null;
    }
  }

  /**
   * Update an appointment
   */
  static async updateAppointment(
    id: string,
    updates: UpdateAppointmentRequest
  ): Promise<Appointment> {
    try {
      const url = API_CONFIG.ENDPOINTS.APPOINTMENTS.UPDATE.replace('{id}', id);
      const response = await apiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const appointment = await response.json();
        await this.storeAppointmentLocally(appointment);
        return this.transformAppointment(appointment);
      }

      throw new Error('Failed to update appointment');
    } catch (error) {
      console.error('API update appointment failed, using local storage:', error);

      // Update locally
      const local = await this.getLocalAppointments();
      const index = local.findIndex(apt => apt.id === id);

      if (index === -1) {
        throw new Error('Appointment not found');
      }

      const updated = {
        ...local[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      local[index] = updated;
      await AsyncStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(local));

      // Queue for sync
      await this.addToPendingSync({
        action: 'update',
        id,
        data: updates,
        timestamp: new Date().toISOString(),
      });

      return updated;
    }
  }

  /**
   * Update appointment status
   */
  static async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus
  ): Promise<Appointment> {
    try {
      const url = API_CONFIG.ENDPOINTS.APPOINTMENTS.STATUS.replace('{id}', id);
      const response = await apiRequest(url, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const appointment = await response.json();
        await this.storeAppointmentLocally(appointment);
        return this.transformAppointment(appointment);
      }

      throw new Error('Failed to update appointment status');
    } catch (error) {
      console.error('API update status failed, using local storage:', error);
      return this.updateAppointment(id, { status });
    }
  }

  /**
   * Schedule reminder for appointment
   */
  static async scheduleReminder(
    request: ScheduleReminderRequest
  ): Promise<AppointmentReminder> {
    try {
      const url = API_CONFIG.ENDPOINTS.APPOINTMENTS.REMINDERS.replace(
        '{id}',
        request.appointmentId
      );
      const response = await apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const reminder = await response.json();
        return this.transformReminder(reminder);
      }

      throw new Error('Failed to schedule reminder');
    } catch (error) {
      console.error('API schedule reminder failed, using local storage:', error);

      // Create local reminder
      const localReminder: AppointmentReminder = {
        id: `local-reminder-${Date.now()}`,
        appointmentId: request.appointmentId,
        reminderTime: request.reminderTime,
        method: request.method,
        sent: false,
      };

      // Queue for sync
      await this.addToPendingSync({
        action: 'schedule_reminder',
        data: request,
        timestamp: new Date().toISOString(),
      });

      return localReminder;
    }
  }

  /**
   * Sync pending changes with backend
   */
  static async syncPendingChanges(): Promise<{
    success: number;
    failed: number;
  }> {
    try {
      const pending = await this.getPendingSync();
      let success = 0;
      let failed = 0;

      for (const item of pending) {
        try {
          switch (item.action) {
            case 'create':
              await this.createAppointment(item.data);
              success++;
              break;
            case 'update':
              await this.updateAppointment(item.id, item.data);
              success++;
              break;
            case 'schedule_reminder':
              await this.scheduleReminder(item.data);
              success++;
              break;
          }
        } catch (error) {
          console.error('Failed to sync item:', error);
          failed++;
        }
      }

      // Clear successfully synced items
      if (success > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify([]));
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      }

      return { success, failed };
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: 0, failed: 0 };
    }
  }

  /**
   * Helper: Store appointment locally
   */
  private static async storeAppointmentLocally(appointment: Appointment): Promise<void> {
    const local = await this.getLocalAppointments();
    const index = local.findIndex(apt => apt.id === appointment.id);

    if (index >= 0) {
      local[index] = appointment;
    } else {
      local.push(appointment);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(local));
  }

  /**
   * Helper: Update multiple local appointments
   */
  private static async updateLocalAppointments(appointments: Appointment[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }

  /**
   * Helper: Get local appointments with filters
   */
  private static async getLocalAppointments(filters?: {
    caseId?: string;
    providerId?: string;
    status?: AppointmentStatus;
    fromDate?: string;
    toDate?: string;
  }): Promise<Appointment[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      let appointments: Appointment[] = stored ? JSON.parse(stored) : [];

      // Apply filters
      if (filters) {
        if (filters.caseId) {
          appointments = appointments.filter(apt => apt.caseId === filters.caseId);
        }
        if (filters.providerId) {
          appointments = appointments.filter(apt => apt.providerId === filters.providerId);
        }
        if (filters.status) {
          appointments = appointments.filter(apt => apt.status === filters.status);
        }
        if (filters.fromDate) {
          appointments = appointments.filter(apt => apt.date >= filters.fromDate!);
        }
        if (filters.toDate) {
          appointments = appointments.filter(apt => apt.date <= filters.toDate!);
        }
      }

      return appointments;
    } catch (error) {
      console.error('Failed to get local appointments:', error);
      return [];
    }
  }

  /**
   * Helper: Schedule automatic reminders for an appointment
   */
  private static async scheduleAppointmentReminders(appointment: Appointment): Promise<void> {
    try {
      // Initialize reminder service if not already running
      AppointmentReminderService.initialize();

      // Schedule appointment with reminder service
      AppointmentReminderService.scheduleAppointmentReminders(
        appointment.id,
        appointment.date,
        appointment.time,
        appointment.survivorId,
        appointment.providerId,
        {
          patientName: appointment.survivorName,
          providerName: appointment.providerName,
          location: appointment.location,
          type: appointment.type,
        }
      );

      console.log(`Scheduled reminders for appointment ${appointment.id}`);
    } catch (error) {
      console.error('Failed to schedule reminders:', error);
    }
  }

  /**
   * Helper: Add to pending sync queue
   */
  private static async addToPendingSync(item: any): Promise<void> {
    try {
      const pending = await this.getPendingSync();
      pending.push(item);
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(pending));
    } catch (error) {
      console.error('Failed to add to pending sync:', error);
    }
  }

  /**
   * Helper: Get pending sync queue
   */
  private static async getPendingSync(): Promise<any[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get pending sync:', error);
      return [];
    }
  }

  /**
   * Helper: Transform snake_case API response to camelCase
   */
  private static transformAppointment(appointment: any): Appointment {
    return {
      id: appointment.id,
      caseId: appointment.case_id || appointment.caseId,
      providerId: appointment.provider_id || appointment.providerId,
      providerName: appointment.provider_name || appointment.providerName,
      providerType: appointment.provider_type || appointment.providerType,
      survivorId: appointment.survivor_id || appointment.survivorId,
      survivorName: appointment.survivor_name || appointment.survivorName,
      type: appointment.type,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      location: appointment.location,
      status: appointment.status,
      notes: appointment.notes,
      reminders: appointment.reminders?.map(this.transformReminder),
      createdAt: appointment.created_at || appointment.createdAt,
      updatedAt: appointment.updated_at || appointment.updatedAt,
      createdBy: appointment.created_by || appointment.createdBy,
    };
  }

  /**
   * Helper: Transform reminder response
   */
  private static transformReminder(reminder: any): AppointmentReminder {
    return {
      id: reminder.id,
      appointmentId: reminder.appointment_id || reminder.appointmentId,
      reminderTime: reminder.reminder_time || reminder.reminderTime,
      method: reminder.method,
      sent: reminder.sent,
      sentAt: reminder.sent_at || reminder.sentAt,
    };
  }
}
