import { Incident } from '@/providers/IncidentProvider';
import { NotificationService, SurvivorNotification } from './notificationService';

export interface ProviderResponse {
  id: string;
  incidentId: string;
  providerId: string;
  providerName: string;
  providerType: string;
  responseType: 'assignment' | 'contact_attempt' | 'contact_successful' | 'appointment_scheduled' | 'case_update';
  message?: string;
  metadata?: {
    contactMethod?: 'sms' | 'call' | 'secure_message';
    appointmentDetails?: {
      date: string;
      time: string;
      location?: string;
      type: 'consultation' | 'follow_up' | 'examination' | 'counseling';
    };
    statusUpdate?: string;
  };
  timestamp: string;
  survivorNotified: boolean;
}

export class ProviderResponseService {
  private static responses: ProviderResponse[] = [];
  private static survivorNotifications: SurvivorNotification[] = [];

  /**
   * Record when a provider accepts a case assignment
   */
  static recordProviderAssignment(
    incident: Incident,
    providerId: string,
    providerName: string,
    providerType: string
  ): SurvivorNotification {
    const response: ProviderResponse = {
      id: `response-${incident.id}-${providerId}-${Date.now()}`,
      incidentId: incident.id,
      providerId,
      providerName,
      providerType,
      responseType: 'assignment',
      timestamp: new Date().toISOString(),
      survivorNotified: false,
    };

    this.responses.push(response);

    // Create survivor notification
    const survivorNotification = NotificationService.createSurvivorProviderResponseNotification(
      incident,
      providerName,
      providerType,
      'assignment',
      providerId,
      'You will be contacted shortly via your preferred communication method.'
    );

    this.survivorNotifications.push(survivorNotification);
    response.survivorNotified = true;

    return survivorNotification;
  }

  /**
   * Record when a provider attempts to contact a survivor
   */
  static recordContactAttempt(
    incident: Incident,
    providerId: string,
    providerName: string,
    providerType: string,
    contactMethod: 'sms' | 'call' | 'secure_message',
    successful: boolean = false
  ): SurvivorNotification {
    const response: ProviderResponse = {
      id: `response-${incident.id}-${providerId}-${Date.now()}`,
      incidentId: incident.id,
      providerId,
      providerName,
      providerType,
      responseType: successful ? 'contact_successful' : 'contact_attempt',
      metadata: { contactMethod },
      timestamp: new Date().toISOString(),
      survivorNotified: false,
    };

    this.responses.push(response);

    // Create survivor notification
    const contactMethodText = contactMethod === 'sms' ? 'SMS' :
                             contactMethod === 'call' ? 'phone call' : 'secure message';

    const additionalMessage = successful ?
      `They reached you via ${contactMethodText}. Please respond when you're ready.` :
      `They attempted to reach you via ${contactMethodText}. Please check your ${contactMethodText}s or contact them back.`;

    const survivorNotification = NotificationService.createSurvivorProviderResponseNotification(
      incident,
      providerName,
      providerType,
      'contact',
      providerId,
      additionalMessage
    );

    this.survivorNotifications.push(survivorNotification);
    response.survivorNotified = true;

    return survivorNotification;
  }

  /**
   * Record when a provider schedules an appointment
   */
  static recordAppointmentScheduled(
    incident: Incident,
    providerId: string,
    providerName: string,
    providerType: string,
    appointmentDetails: {
      date: string;
      time: string;
      location?: string;
      type: 'consultation' | 'follow_up' | 'examination' | 'counseling';
    }
  ): SurvivorNotification {
    const response: ProviderResponse = {
      id: `response-${incident.id}-${providerId}-${Date.now()}`,
      incidentId: incident.id,
      providerId,
      providerName,
      providerType,
      responseType: 'appointment_scheduled',
      metadata: { appointmentDetails },
      timestamp: new Date().toISOString(),
      survivorNotified: false,
    };

    this.responses.push(response);

    // Create survivor notification
    const survivorNotification = NotificationService.createSurvivorAppointmentNotification(
      incident,
      providerName,
      providerType,
      appointmentDetails
    );

    this.survivorNotifications.push(survivorNotification);
    response.survivorNotified = true;

    return survivorNotification;
  }

  /**
   * Record a case status update from provider
   */
  static recordCaseUpdate(
    incident: Incident,
    providerId: string,
    providerName: string,
    updateType: 'status_change' | 'progress_update' | 'completion',
    updateMessage: string
  ): SurvivorNotification {
    const response: ProviderResponse = {
      id: `response-${incident.id}-${providerId}-${Date.now()}`,
      incidentId: incident.id,
      providerId,
      providerName,
      providerType: 'provider', // Generic type for updates
      responseType: 'case_update',
      message: updateMessage,
      metadata: { statusUpdate: updateMessage },
      timestamp: new Date().toISOString(),
      survivorNotified: false,
    };

    this.responses.push(response);

    // Create survivor notification
    const survivorNotification = NotificationService.createSurvivorCaseUpdateNotification(
      incident,
      updateType,
      updateMessage,
      providerName
    );

    this.survivorNotifications.push(survivorNotification);
    response.survivorNotified = true;

    return survivorNotification;
  }

  /**
   * Record when a provider sends a message to survivor
   */
  static recordProviderMessage(
    incident: Incident,
    providerId: string,
    providerName: string,
    messageContent: string
  ): SurvivorNotification {
    const response: ProviderResponse = {
      id: `response-${incident.id}-${providerId}-${Date.now()}`,
      incidentId: incident.id,
      providerId,
      providerName,
      providerType: 'provider',
      responseType: 'case_update',
      message: messageContent,
      timestamp: new Date().toISOString(),
      survivorNotified: false,
    };

    this.responses.push(response);

    // Create survivor notification
    const survivorNotification = NotificationService.createSurvivorMessageNotification(
      incident,
      providerName,
      messageContent,
      'provider'
    );

    this.survivorNotifications.push(survivorNotification);
    response.survivorNotified = true;

    return survivorNotification;
  }

  /**
   * Get all survivor notifications for a specific incident
   */
  static getSurvivorNotificationsForIncident(incidentId: string): SurvivorNotification[] {
    return this.survivorNotifications.filter(n => n.incidentId === incidentId);
  }

  /**
   * Get all survivor notifications (for survivor dashboard)
   */
  static getAllSurvivorNotifications(): SurvivorNotification[] {
    return this.survivorNotifications;
  }

  /**
   * Get provider response history for an incident
   */
  static getProviderResponseHistory(incidentId: string): ProviderResponse[] {
    return this.responses.filter(r => r.incidentId === incidentId);
  }

  /**
   * Mark survivor notification as read
   */
  static markSurvivorNotificationRead(notificationId: string): void {
    const notification = this.survivorNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  /**
   * Clear old notifications (cleanup function)
   */
  static clearOldNotifications(daysOld: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    this.survivorNotifications = this.survivorNotifications.filter(
      n => new Date(n.createdAt) > cutoffDate
    );

    this.responses = this.responses.filter(
      r => new Date(r.timestamp) > cutoffDate
    );
  }

  /**
   * Simulate provider responses for testing (creates mock notifications)
   */
  static simulateProviderResponses(): void {
    // This is for testing purposes - simulates provider activity
    const mockIncident: Incident = {
      id: 'incident-test-001',
      caseNumber: 'KIN-TEST-001',
      survivorId: 'survivor-1',
      type: 'physical',
      status: 'assigned',
      priority: 'high',
      incidentDate: new Date().toISOString(),
      location: {
        address: 'Test Location',
        coordinates: { latitude: -1.2921, longitude: 36.8219 },
        description: 'Test incident location'
      },
      description: 'Test incident for notification simulation',
      severity: 'high',
      supportServices: ['medical', 'legal'],
      isAnonymous: false,
      evidence: [],
      messages: [],
      assignedProviderId: 'provider-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      urgencyLevel: 'urgent',
      providerPreferences: {
        communicationMethod: 'sms',
        preferredGender: 'no_preference',
        proximityPreference: 'nearest'
      }
    };

    // Simulate assignment notification
    setTimeout(() => {
      this.recordProviderAssignment(
        mockIncident,
        'provider-001',
        'Dr. Sarah Johnson',
        'healthcare'
      );
    }, 1000);

    // Simulate contact attempt
    setTimeout(() => {
      this.recordContactAttempt(
        mockIncident,
        'provider-001',
        'Dr. Sarah Johnson',
        'healthcare',
        'sms',
        true
      );
    }, 5000);

    // Simulate appointment scheduling
    setTimeout(() => {
      this.recordAppointmentScheduled(
        mockIncident,
        'provider-001',
        'Dr. Sarah Johnson',
        'healthcare',
        {
          date: 'Tomorrow',
          time: '2:00 PM',
          location: 'Kenyatta National Hospital',
          type: 'examination'
        }
      );
    }, 10000);
  }
}

// Auto-cleanup old notifications every hour
if (typeof window !== 'undefined') {
  setInterval(() => {
    ProviderResponseService.clearOldNotifications();
  }, 60 * 60 * 1000); // 1 hour
}