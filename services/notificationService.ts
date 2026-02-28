import { ProviderNotification } from '@/providers/ProviderContext';
import { Incident } from '@/providers/IncidentProvider';
import { ProviderAssignment } from './providerRouting';

export interface SurvivorNotification {
  id: string;
  type: 'provider_response' | 'case_update' | 'appointment' | 'message';
  title: string;
  message: string;
  incidentId?: string;
  providerId?: string;
  providerName?: string;
  providerType?: string;
  isRead: boolean;
  createdAt: string;
  actionRequired?: boolean;
}

export class NotificationService {
  // Store survivor notifications in memory (in real app, this would be in database/storage)
  private static survivorNotifications: SurvivorNotification[] = [];

  /**
   * Create notifications for providers when incident is routed
   */
  static createProviderNotifications(
    incident: Incident,
    assignments: ProviderAssignment[]
  ): ProviderNotification[] {
    const notifications: ProviderNotification[] = [];

    assignments.forEach((assignment) => {
      const notification: ProviderNotification = {
        id: `notification-${incident.id}-${assignment.providerId}-${Date.now()}`,
        type: 'new_case',
        title: this.getNotificationTitle(incident, assignment),
        message: this.getNotificationMessage(incident, assignment),
        incidentId: incident.id,
        urgencyLevel: incident.urgencyLevel,
        estimatedResponseTime: assignment.estimatedResponseTime,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      notifications.push(notification);
    });

    return notifications;
  }

  /**
   * Generate notification title based on incident and assignment
   */
  private static getNotificationTitle(
    incident: Incident,
    assignment: ProviderAssignment
  ): string {
    const urgencyPrefix = incident.urgencyLevel === 'immediate' ? 'URGENT: ' :
                         incident.urgencyLevel === 'urgent' ? 'Priority: ' : '';

    const typeMap: { [key: string]: string } = {
      'healthcare': 'New Medical Case',
      'police': 'New Police Case',
      'gbv_rescue': 'Emergency Response',
      'counseling': 'New Counseling Case',
      'legal': 'New Legal Case',
      'social': 'New Social Services Case',
      'chw': 'New Community Case'
    };

    return `${urgencyPrefix}${typeMap[assignment.providerType] || 'New Case'}`;
  }

  /**
   * Generate notification message based on incident details
   */
  private static getNotificationMessage(
    incident: Incident,
    assignment: ProviderAssignment
  ): string {
    const incidentTypeMap: { [key: string]: string } = {
      'sexual': 'Sexual assault',
      'physical': 'Physical violence',
      'emotional': 'Emotional/psychological abuse',
      'economic': 'Economic abuse',
      'online': 'Online GBV',
      'femicide': 'Femicide/attempted femicide'
    };

    const incidentDescription = incidentTypeMap[incident.type] || 'GBV incident';

    let message = `${incidentDescription} case assigned to you.`;

    // Add service-specific details
    if (assignment.providerType === 'healthcare') {
      const services = incident.supportServices;
      if (services.includes('medical')) {
        if (incident.urgencyLevel === 'immediate') {
          const timeElapsed = this.calculateTimeElapsed(incident.createdAt);
          message += ` PEP window: ${72 - timeElapsed} hours remaining.`;
        } else {
          message += ' Medical examination and care required.';
        }
      }
    } else if (assignment.providerType === 'police') {
      message += ' Evidence collection and investigation required.';
    } else if (assignment.providerType === 'gbv_rescue') {
      message += ' Immediate intervention and safe transport needed.';
    } else if (assignment.providerType === 'counseling') {
      message += ' Psychological support and trauma counseling needed.';
    }

    // Add location if available
    if (incident.location?.address) {
      const shortAddress = incident.location.address.length > 30
        ? incident.location.address.substring(0, 30) + '...'
        : incident.location.address;
      message += ` Location: ${shortAddress}`;
    }

    // Add communication preference
    if (incident.providerPreferences?.communicationMethod) {
      const method = incident.providerPreferences.communicationMethod;
      const methodText = method === 'sms' ? 'SMS' :
                        method === 'call' ? 'phone call' : 'secure message';
      message += ` Preferred contact: ${methodText}.`;
    }

    return message;
  }

  /**
   * Calculate time elapsed since incident creation in hours
   */
  private static calculateTimeElapsed(createdAt: string): number {
    const now = new Date();
    const created = new Date(createdAt);
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
  }

  /**
   * Create status update notification
   */
  static createStatusUpdateNotification(
    incident: Incident,
    providerId: string,
    statusMessage: string
  ): ProviderNotification {
    return {
      id: `status-${incident.id}-${providerId}-${Date.now()}`,
      type: 'status_update',
      title: `Case ${incident.caseNumber} Update`,
      message: statusMessage,
      incidentId: incident.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Create system notification
   */
  static createSystemNotification(
    title: string,
    message: string,
    providerId?: string
  ): ProviderNotification {
    return {
      id: `system-${providerId || 'all'}-${Date.now()}`,
      type: 'system',
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Create message notification
   */
  static createMessageNotification(
    incident: Incident,
    senderName: string,
    messageContent: string,
    providerId: string
  ): ProviderNotification {
    return {
      id: `message-${incident.id}-${providerId}-${Date.now()}`,
      type: 'message',
      title: `New message from ${senderName}`,
      message: messageContent.length > 100
        ? messageContent.substring(0, 100) + '...'
        : messageContent,
      incidentId: incident.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Format notification for display
   */
  static formatNotificationTime(createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return created.toLocaleDateString();
  }

  /**
   * Get notification priority score (for sorting)
   */
  static getNotificationPriority(notification: ProviderNotification): number {
    let priority = 0;

    // Urgency level
    if (notification.urgencyLevel === 'immediate') priority += 100;
    else if (notification.urgencyLevel === 'urgent') priority += 50;

    // Type priority
    if (notification.type === 'new_case') priority += 30;
    else if (notification.type === 'message') priority += 20;
    else if (notification.type === 'status_update') priority += 10;

    // Unread bonus
    if (!notification.isRead) priority += 40;

    // Recency (more recent = higher priority)
    const ageInHours = (Date.now() - new Date(notification.createdAt).getTime()) / (1000 * 60 * 60);
    priority += Math.max(0, 24 - ageInHours); // Max 24 points for very recent notifications

    return priority;
  }

  /**
   * Group notifications by type for display
   */
  static groupNotifications(notifications: ProviderNotification[]): {
    urgent: ProviderNotification[];
    newCases: ProviderNotification[];
    messages: ProviderNotification[];
    updates: ProviderNotification[];
  } {
    return {
      urgent: notifications.filter(n => n.urgencyLevel === 'immediate' && !n.isRead),
      newCases: notifications.filter(n => n.type === 'new_case'),
      messages: notifications.filter(n => n.type === 'message'),
      updates: notifications.filter(n => n.type === 'status_update' || n.type === 'system'),
    };
  }

  // ===== SURVIVOR NOTIFICATION METHODS =====

  /**
   * Create notification for survivor when provider responds to their case
   */
  static createSurvivorProviderResponseNotification(
    incident: Incident,
    providerName: string,
    providerType: string,
    responseType: 'assignment' | 'contact' | 'appointment',
    providerId: string,
    additionalMessage?: string
  ): SurvivorNotification {
    const typeMap = {
      healthcare: 'Healthcare Provider',
      police: 'Police Officer',
      gbv_rescue: 'Emergency Response Team',
      counseling: 'Counselor',
      legal: 'Legal Aid Advocate',
      social: 'Social Worker',
      chw: 'Community Health Worker'
    };

    const providerTypeDisplay = typeMap[providerType as keyof typeof typeMap] || 'Support Provider';

    let title: string;
    let message: string;
    let actionRequired = false;

    switch (responseType) {
      case 'assignment':
        title = `${providerTypeDisplay} Assigned`;
        message = `${providerName} has been assigned to your case. They will contact you shortly via your preferred method.`;
        actionRequired = false;
        break;
      case 'contact':
        title = `${providerTypeDisplay} Contacted You`;
        message = `${providerName} has attempted to reach you. Please check your SMS/calls or contact them back.`;
        actionRequired = true;
        break;
      case 'appointment':
        title = `Appointment Scheduled`;
        message = `${providerName} has scheduled an appointment with you. Please check the details and confirm your availability.`;
        actionRequired = true;
        break;
    }

    if (additionalMessage) {
      message += ` ${additionalMessage}`;
    }

    return {
      id: `survivor-${incident.id}-${providerId}-${responseType}-${Date.now()}`,
      type: 'provider_response',
      title,
      message,
      incidentId: incident.id,
      providerId,
      providerName,
      providerType,
      isRead: false,
      createdAt: new Date().toISOString(),
      actionRequired,
    };
  }

  /**
   * Create case update notification for survivor
   */
  static createSurvivorCaseUpdateNotification(
    incident: Incident,
    updateType: 'status_change' | 'progress_update' | 'completion',
    updateMessage: string,
    providerName?: string
  ): SurvivorNotification {
    let title: string;

    switch (updateType) {
      case 'status_change':
        title = 'Case Status Updated';
        break;
      case 'progress_update':
        title = 'Case Progress Update';
        break;
      case 'completion':
        title = 'Case Completed';
        break;
    }

    return {
      id: `survivor-update-${incident.id}-${Date.now()}`,
      type: 'case_update',
      title,
      message: updateMessage,
      incidentId: incident.id,
      providerName,
      isRead: false,
      createdAt: new Date().toISOString(),
      actionRequired: updateType === 'completion',
    };
  }

  /**
   * Create appointment notification for survivor
   */
  static createSurvivorAppointmentNotification(
    incident: Incident,
    providerName: string,
    providerType: string,
    appointmentDetails: {
      date: string;
      time: string;
      location?: string;
      type: 'consultation' | 'follow_up' | 'examination' | 'counseling';
    }
  ): SurvivorNotification {
    const appointmentTypeMap = {
      consultation: 'consultation',
      follow_up: 'follow-up appointment',
      examination: 'medical examination',
      counseling: 'counseling session'
    };

    const appointmentType = appointmentTypeMap[appointmentDetails.type];

    let message = `${providerName} has scheduled a ${appointmentType} for ${appointmentDetails.date} at ${appointmentDetails.time}.`;

    if (appointmentDetails.location) {
      message += ` Location: ${appointmentDetails.location}`;
    }

    message += ' Please confirm your attendance.';

    return {
      id: `survivor-appointment-${incident.id}-${Date.now()}`,
      type: 'appointment',
      title: 'New Appointment Scheduled',
      message,
      incidentId: incident.id,
      providerName,
      providerType,
      isRead: false,
      createdAt: new Date().toISOString(),
      actionRequired: true,
    };
  }

  /**
   * Create message notification for survivor
   */
  static createSurvivorMessageNotification(
    incident: Incident,
    senderName: string,
    messageContent: string,
    senderType: 'provider' | 'system' | 'coordinator'
  ): SurvivorNotification {
    return {
      id: `survivor-message-${incident.id}-${Date.now()}`,
      type: 'message',
      title: `New message from ${senderName}`,
      message: messageContent.length > 100
        ? messageContent.substring(0, 100) + '...'
        : messageContent,
      incidentId: incident.id,
      providerName: senderType === 'provider' ? senderName : undefined,
      isRead: false,
      createdAt: new Date().toISOString(),
      actionRequired: messageContent.toLowerCase().includes('urgent') || messageContent.toLowerCase().includes('immediate'),
    };
  }

  /**
   * Format survivor notification time (same logic as provider notifications)
   */
  static formatSurvivorNotificationTime(createdAt: string): string {
    return this.formatNotificationTime(createdAt);
  }

  /**
   * Get survivor notification priority score (for sorting)
   */
  static getSurvivorNotificationPriority(notification: SurvivorNotification): number {
    let priority = 0;

    // Action required notifications get highest priority
    if (notification.actionRequired) priority += 100;

    // Type priority
    if (notification.type === 'provider_response') priority += 50;
    else if (notification.type === 'appointment') priority += 40;
    else if (notification.type === 'case_update') priority += 30;
    else if (notification.type === 'message') priority += 20;

    // Unread bonus
    if (!notification.isRead) priority += 40;

    // Recency (more recent = higher priority)
    const ageInHours = (Date.now() - new Date(notification.createdAt).getTime()) / (1000 * 60 * 60);
    priority += Math.max(0, 24 - ageInHours); // Max 24 points for very recent notifications

    return priority;
  }

  /**
   * Group survivor notifications by type for display
   */
  static groupSurvivorNotifications(notifications: SurvivorNotification[]): {
    actionRequired: SurvivorNotification[];
    providerResponses: SurvivorNotification[];
    appointments: SurvivorNotification[];
    caseUpdates: SurvivorNotification[];
    messages: SurvivorNotification[];
  } {
    return {
      actionRequired: notifications.filter(n => n.actionRequired && !n.isRead),
      providerResponses: notifications.filter(n => n.type === 'provider_response'),
      appointments: notifications.filter(n => n.type === 'appointment'),
      caseUpdates: notifications.filter(n => n.type === 'case_update'),
      messages: notifications.filter(n => n.type === 'message'),
    };
  }

  // ===== SURVIVOR NOTIFICATION STORAGE METHODS =====

  /**
   * Store a survivor notification
   */
  static storeSurvivorNotification(notification: SurvivorNotification): void {
    this.survivorNotifications.unshift(notification); // Add to beginning for newest first
    console.log('Stored survivor notification:', notification.title);
  }

  /**
   * Get survivor notifications for a specific incident
   */
  static getSurvivorNotifications(incidentId: string): SurvivorNotification[] {
    return this.survivorNotifications.filter(n => n.incidentId === incidentId);
  }

  /**
   * Get all survivor notifications for a survivor (across all their incidents)
   */
  static getAllSurvivorNotifications(survivorIncidentIds: string[]): SurvivorNotification[] {
    return this.survivorNotifications.filter(n =>
      n.incidentId && survivorIncidentIds.includes(n.incidentId)
    );
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
   * Get unread survivor notification count
   */
  static getUnreadSurvivorNotificationCount(survivorIncidentIds: string[]): number {
    return this.getAllSurvivorNotifications(survivorIncidentIds)
      .filter(n => !n.isRead).length;
  }
}