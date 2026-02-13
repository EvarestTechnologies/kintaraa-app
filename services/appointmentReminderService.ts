import { NotificationService, SurvivorNotification } from './notificationService';
import { AppointmentStatusService } from './appointmentStatusService';

export interface ReminderPreferences {
  userId: string;
  userType: 'survivor' | 'provider';
  enable24HourReminder: boolean;
  enable2HourReminder: boolean;
  enable30MinuteReminder: boolean;
  preferredMethod: 'in_app' | 'sms' | 'both';
  customReminderTimes?: number[]; // Custom reminder times in minutes before appointment
}

export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  recipientId: string;
  recipientType: 'survivor' | 'provider';
  reminderType: '24_hour' | '2_hour' | '30_minute' | 'custom';
  scheduledTime: string;
  sentTime?: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  message: string;
  method: 'in_app' | 'sms' | 'both';
  appointmentDetails: {
    patientName: string;
    providerName: string;
    appointmentDate: string;
    appointmentTime: string;
    location: string;
    type: string;
  };
}

export class AppointmentReminderService {
  private static reminders: AppointmentReminder[] = [];
  private static preferences: Map<string, ReminderPreferences> = new Map();
  private static isRunning = false;
  private static intervalId: NodeJS.Timeout | null = null;

  /**
   * Initialize the reminder service
   */
  static initialize(): void {
    if (!this.isRunning) {
      this.startReminderEngine();
      this.isRunning = true;
      console.log('Appointment Reminder Service initialized');
    }
  }

  /**
   * Stop the reminder service
   */
  static stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('Appointment Reminder Service stopped');
    }
  }

  /**
   * Set reminder preferences for a user
   */
  static setReminderPreferences(preferences: ReminderPreferences): void {
    this.preferences.set(preferences.userId, preferences);
    console.log('Reminder preferences updated for user:', preferences.userId);
  }

  /**
   * Get reminder preferences for a user
   */
  static getReminderPreferences(userId: string): ReminderPreferences {
    const existing = this.preferences.get(userId);
    if (existing) return existing;

    // Default preferences
    const defaultPrefs: ReminderPreferences = {
      userId,
      userType: 'survivor', // Will be updated when setting preferences
      enable24HourReminder: true,
      enable2HourReminder: true,
      enable30MinuteReminder: false,
      preferredMethod: 'in_app',
    };

    this.preferences.set(userId, defaultPrefs);
    return defaultPrefs;
  }

  /**
   * Schedule reminders for a new appointment
   */
  static scheduleAppointmentReminders(
    appointmentId: string,
    appointmentDate: string,
    appointmentTime: string,
    survivorId: string,
    providerId: string,
    appointmentDetails: {
      patientName: string;
      providerName: string;
      location: string;
      type: string;
    }
  ): void {
    const appointmentDateTime = new Date(`${appointmentDate} ${appointmentTime}`);

    // Don't schedule reminders for past appointments
    if (appointmentDateTime <= new Date()) {
      console.log('Skipping reminders for past appointment:', appointmentId);
      return;
    }

    // Get preferences for both users
    const survivorPrefs = this.getReminderPreferences(survivorId);
    const providerPrefs = this.getReminderPreferences(providerId);

    // Schedule survivor reminders
    this.scheduleUserReminders(
      appointmentId,
      appointmentDateTime,
      survivorId,
      'survivor',
      survivorPrefs,
      appointmentDetails
    );

    // Schedule provider reminders
    this.scheduleUserReminders(
      appointmentId,
      appointmentDateTime,
      providerId,
      'provider',
      providerPrefs,
      appointmentDetails
    );

    console.log('Reminders scheduled for appointment:', appointmentId);
  }

  /**
   * Schedule reminders for a specific user
   */
  private static scheduleUserReminders(
    appointmentId: string,
    appointmentDateTime: Date,
    userId: string,
    userType: 'survivor' | 'provider',
    preferences: ReminderPreferences,
    appointmentDetails: any
  ): void {
    const reminderTimes = this.getReminderTimes(preferences);

    reminderTimes.forEach(({ type, minutesBefore }) => {
      const reminderTime = new Date(appointmentDateTime.getTime() - (minutesBefore * 60 * 1000));

      // Only schedule if reminder time is in the future
      if (reminderTime > new Date()) {
        const reminder: AppointmentReminder = {
          id: `reminder-${appointmentId}-${userId}-${type}-${Date.now()}`,
          appointmentId,
          recipientId: userId,
          recipientType: userType,
          reminderType: type,
          scheduledTime: reminderTime.toISOString(),
          status: 'scheduled',
          message: this.generateReminderMessage(type, userType, appointmentDateTime, appointmentDetails),
          method: preferences.preferredMethod,
          appointmentDetails: {
            patientName: appointmentDetails.patientName,
            providerName: appointmentDetails.providerName,
            appointmentDate: appointmentDateTime.toISOString().split('T')[0],
            appointmentTime: appointmentDateTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            location: appointmentDetails.location,
            type: appointmentDetails.type,
          },
        };

        this.reminders.push(reminder);
      }
    });
  }

  /**
   * Get reminder times based on user preferences
   */
  private static getReminderTimes(preferences: ReminderPreferences): Array<{type: any, minutesBefore: number}> {
    const times: Array<{type: any, minutesBefore: number}> = [];

    if (preferences.enable24HourReminder) {
      times.push({ type: '24_hour', minutesBefore: 24 * 60 });
    }
    if (preferences.enable2HourReminder) {
      times.push({ type: '2_hour', minutesBefore: 2 * 60 });
    }
    if (preferences.enable30MinuteReminder) {
      times.push({ type: '30_minute', minutesBefore: 30 });
    }

    // Add custom reminder times
    if (preferences.customReminderTimes) {
      preferences.customReminderTimes.forEach(minutes => {
        times.push({ type: 'custom', minutesBefore: minutes });
      });
    }

    return times;
  }

  /**
   * Generate reminder message
   */
  private static generateReminderMessage(
    reminderType: string,
    userType: 'survivor' | 'provider',
    appointmentDateTime: Date,
    appointmentDetails: any
  ): string {
    const timeUntil = this.getTimeUntilText(reminderType);
    const dateStr = appointmentDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = appointmentDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    if (userType === 'survivor') {
      return `Reminder: You have an appointment with ${appointmentDetails.providerName} ${timeUntil}. ` +
             `Date: ${dateStr} at ${timeStr}. Location: ${appointmentDetails.location}. ` +
             `Please arrive 15 minutes early and bring your ID.`;
    } else {
      return `Reminder: You have an appointment with ${appointmentDetails.patientName} ${timeUntil}. ` +
             `Date: ${dateStr} at ${timeStr}. Type: ${appointmentDetails.type}. ` +
             `Location: ${appointmentDetails.location}.`;
    }
  }

  /**
   * Get time until text for reminder type
   */
  private static getTimeUntilText(reminderType: string): string {
    switch (reminderType) {
      case '24_hour': return 'tomorrow';
      case '2_hour': return 'in 2 hours';
      case '30_minute': return 'in 30 minutes';
      default: return 'soon';
    }
  }

  /**
   * Start the reminder engine that checks for due reminders
   */
  private static startReminderEngine(): void {
    // Check for due reminders every minute
    this.intervalId = setInterval(() => {
      this.processDueReminders();
    }, 60 * 1000); // Check every minute

    console.log('Reminder engine started - checking every minute');
  }

  /**
   * Process reminders that are due to be sent
   */
  private static processDueReminders(): void {
    const now = new Date();
    const dueReminders = this.reminders.filter(
      reminder => reminder.status === 'scheduled' && new Date(reminder.scheduledTime) <= now
    );

    dueReminders.forEach(reminder => {
      this.sendReminder(reminder);
    });

    if (dueReminders.length > 0) {
      console.log(`Processed ${dueReminders.length} due reminders`);
    }
  }

  /**
   * Send a reminder notification
   */
  private static sendReminder(reminder: AppointmentReminder): void {
    try {
      if (reminder.recipientType === 'survivor') {
        // Create survivor notification
        const survivorNotification: SurvivorNotification = {
          id: `reminder-notification-${reminder.id}`,
          type: 'appointment',
          title: this.getReminderTitle(reminder.reminderType),
          message: reminder.message,
          incidentId: 'dummy-1', // This would be the actual incident ID
          providerName: reminder.appointmentDetails.providerName,
          providerType: 'healthcare',
          isRead: false,
          createdAt: new Date().toISOString(),
          actionRequired: reminder.reminderType === '30_minute',
        };

        NotificationService.storeSurvivorNotification(survivorNotification);
      } else {
        // For providers, we could create provider notifications here
        // For now, we'll just log it
        console.log('Provider reminder sent:', {
          providerId: reminder.recipientId,
          message: reminder.message,
          appointmentId: reminder.appointmentId
        });
      }

      // Mark reminder as sent
      reminder.status = 'sent';
      reminder.sentTime = new Date().toISOString();

      console.log('Reminder sent successfully:', reminder.id);

    } catch (error) {
      console.error('Failed to send reminder:', reminder.id, error);
      reminder.status = 'failed';
    }
  }

  /**
   * Get reminder title based on type
   */
  private static getReminderTitle(reminderType: string): string {
    switch (reminderType) {
      case '24_hour': return 'Appointment Tomorrow';
      case '2_hour': return 'Appointment in 2 Hours';
      case '30_minute': return 'Appointment Starting Soon';
      default: return 'Appointment Reminder';
    }
  }

  /**
   * Cancel reminders for an appointment
   */
  static cancelAppointmentReminders(appointmentId: string): void {
    const appointmentReminders = this.reminders.filter(
      reminder => reminder.appointmentId === appointmentId && reminder.status === 'scheduled'
    );

    appointmentReminders.forEach(reminder => {
      reminder.status = 'cancelled';
    });

    console.log(`Cancelled ${appointmentReminders.length} reminders for appointment:`, appointmentId);
  }

  /**
   * Reschedule reminders for an appointment
   */
  static rescheduleAppointmentReminders(
    appointmentId: string,
    newDate: string,
    newTime: string,
    appointmentDetails: {
      patientName: string;
      providerName: string;
      location: string;
      type: string;
    }
  ): void {
    // Cancel existing reminders
    this.cancelAppointmentReminders(appointmentId);

    // Schedule new reminders with updated time
    // We'll use dummy IDs for now - in a real app these would come from the appointment data
    this.scheduleAppointmentReminders(
      appointmentId,
      newDate,
      newTime,
      'survivor-1', // This would be the actual survivor ID
      'provider-1', // This would be the actual provider ID
      appointmentDetails
    );

    console.log('Reminders rescheduled for appointment:', appointmentId);
  }

  /**
   * Get reminder statistics
   */
  static getReminderStatistics(): {
    total: number;
    scheduled: number;
    sent: number;
    failed: number;
    cancelled: number;
  } {
    const total = this.reminders.length;
    const scheduled = this.reminders.filter(r => r.status === 'scheduled').length;
    const sent = this.reminders.filter(r => r.status === 'sent').length;
    const failed = this.reminders.filter(r => r.status === 'failed').length;
    const cancelled = this.reminders.filter(r => r.status === 'cancelled').length;

    return { total, scheduled, sent, failed, cancelled };
  }

  /**
   * Get upcoming reminders for a user
   */
  static getUpcomingReminders(userId: string): AppointmentReminder[] {
    return this.reminders.filter(
      reminder => reminder.recipientId === userId &&
      reminder.status === 'scheduled' &&
      new Date(reminder.scheduledTime) > new Date()
    ).sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  }

  /**
   * Get reminder history for a user
   */
  static getReminderHistory(userId: string, limit: number = 20): AppointmentReminder[] {
    return this.reminders.filter(
      reminder => reminder.recipientId === userId && reminder.status === 'sent'
    ).sort((a, b) =>
      new Date(b.sentTime!).getTime() - new Date(a.sentTime!).getTime()
    ).slice(0, limit);
  }

  /**
   * Test function to create sample reminders for demonstration
   */
  static createSampleReminders(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0); // 2:00 PM tomorrow

    this.scheduleAppointmentReminders(
      'sample-appointment-1',
      tomorrow.toISOString().split('T')[0],
      '14:00',
      'survivor-1',
      'provider-1',
      {
        patientName: 'Patient 1',
        providerName: 'Dr. Sarah Johnson',
        location: 'Kenyatta National Hospital',
        type: 'Medical Examination'
      }
    );

    console.log('Sample reminders created for testing');
  }
}