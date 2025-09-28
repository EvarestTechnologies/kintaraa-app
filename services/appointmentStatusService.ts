import { NotificationService, SurvivorNotification } from './notificationService';

export interface AppointmentStatusUpdate {
  appointmentId: string;
  previousStatus: AppointmentStatus;
  newStatus: AppointmentStatus;
  updatedBy: 'provider' | 'survivor' | 'system';
  updatedAt: string;
  reason?: string;
  rescheduleDetails?: {
    newDate: string;
    newTime: string;
  };
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'declined' | 'reschedule_requested' | 'rescheduled' | 'completed' | 'cancelled';

export class AppointmentStatusService {
  private static statusUpdates: AppointmentStatusUpdate[] = [];
  private static appointmentStatuses: Map<string, AppointmentStatus> = new Map();

  /**
   * Update appointment status
   */
  static updateAppointmentStatus(
    appointmentId: string,
    newStatus: AppointmentStatus,
    updatedBy: 'provider' | 'survivor' | 'system',
    reason?: string,
    rescheduleDetails?: { newDate: string; newTime: string }
  ): void {
    const previousStatus = this.appointmentStatuses.get(appointmentId) || 'pending';

    // Don't update if status is the same
    if (previousStatus === newStatus) return;

    const statusUpdate: AppointmentStatusUpdate = {
      appointmentId,
      previousStatus,
      newStatus,
      updatedBy,
      updatedAt: new Date().toISOString(),
      reason,
      rescheduleDetails,
    };

    this.statusUpdates.unshift(statusUpdate);
    this.appointmentStatuses.set(appointmentId, newStatus);

    console.log('Appointment status updated:', statusUpdate);

    // Create notifications for status changes
    this.createStatusNotifications(statusUpdate);
  }

  /**
   * Get current appointment status
   */
  static getAppointmentStatus(appointmentId: string): AppointmentStatus {
    return this.appointmentStatuses.get(appointmentId) || 'pending';
  }

  /**
   * Get all status updates for an appointment
   */
  static getAppointmentStatusHistory(appointmentId: string): AppointmentStatusUpdate[] {
    return this.statusUpdates.filter(update => update.appointmentId === appointmentId);
  }

  /**
   * Get recent status updates for provider dashboard
   */
  static getRecentStatusUpdates(limit: number = 10): AppointmentStatusUpdate[] {
    return this.statusUpdates.slice(0, limit);
  }

  /**
   * Get status updates that need provider attention
   */
  static getStatusUpdatesNeedingAttention(): AppointmentStatusUpdate[] {
    return this.statusUpdates.filter(update =>
      update.updatedBy === 'survivor' &&
      ['declined', 'reschedule_requested'].includes(update.newStatus)
    );
  }

  /**
   * Create notifications for status changes
   */
  private static createStatusNotifications(statusUpdate: AppointmentStatusUpdate): void {
    const { appointmentId, newStatus, updatedBy, reason, rescheduleDetails } = statusUpdate;

    // Create notification based on who updated and what the new status is
    if (updatedBy === 'survivor') {
      // Survivor updated appointment - notify provider
      let title: string;
      let message: string;

      switch (newStatus) {
        case 'confirmed':
          title = 'Appointment Confirmed';
          message = 'Patient has confirmed their upcoming appointment.';
          break;
        case 'declined':
          title = 'Appointment Declined';
          message = `Patient has declined their appointment. ${reason ? `Reason: ${reason}` : ''}`;
          break;
        case 'reschedule_requested':
          title = 'Reschedule Requested';
          message = rescheduleDetails
            ? `Patient requested to reschedule to ${rescheduleDetails.newDate} at ${rescheduleDetails.newTime}. ${reason ? `Reason: ${reason}` : ''}`
            : `Patient has requested to reschedule their appointment. ${reason ? `Reason: ${reason}` : ''}`;
          break;
        default:
          return;
      }

      // In a real app, this would create a provider notification
      console.log('Provider notification created:', { title, message, appointmentId });

    } else if (updatedBy === 'provider') {
      // Provider updated appointment - notify survivor
      let title: string;
      let message: string;

      switch (newStatus) {
        case 'confirmed':
          title = 'Appointment Confirmed by Provider';
          message = 'Your healthcare provider has confirmed your appointment.';
          break;
        case 'rescheduled':
          title = 'Appointment Rescheduled';
          message = rescheduleDetails
            ? `Your appointment has been rescheduled to ${rescheduleDetails.newDate} at ${rescheduleDetails.newTime}.`
            : 'Your appointment has been rescheduled. New details will be sent shortly.';
          break;
        case 'cancelled':
          title = 'Appointment Cancelled';
          message = `Your appointment has been cancelled by the provider. ${reason ? `Reason: ${reason}` : ''}`;
          break;
        default:
          return;
      }

      // Create survivor notification
      const survivorNotification: SurvivorNotification = {
        id: `appointment-status-${appointmentId}-${Date.now()}`,
        type: 'case_update',
        title,
        message,
        incidentId: 'dummy-1', // This would be the actual incident ID
        isRead: false,
        createdAt: new Date().toISOString(),
        actionRequired: newStatus === 'rescheduled' || newStatus === 'cancelled',
      };

      NotificationService.storeSurvivorNotification(survivorNotification);
    }
  }

  /**
   * Get appointment status summary for dashboard
   */
  static getStatusSummary(): {
    pending: number;
    confirmed: number;
    declined: number;
    rescheduleRequested: number;
    completed: number;
    cancelled: number;
  } {
    const summary = {
      pending: 0,
      confirmed: 0,
      declined: 0,
      rescheduleRequested: 0,
      completed: 0,
      cancelled: 0,
    };

    for (const status of this.appointmentStatuses.values()) {
      switch (status) {
        case 'pending':
          summary.pending++;
          break;
        case 'confirmed':
          summary.confirmed++;
          break;
        case 'declined':
          summary.declined++;
          break;
        case 'reschedule_requested':
          summary.rescheduleRequested++;
          break;
        case 'completed':
          summary.completed++;
          break;
        case 'cancelled':
          summary.cancelled++;
          break;
      }
    }

    return summary;
  }

  /**
   * Mark appointment as completed
   */
  static markAppointmentCompleted(appointmentId: string, notes?: string): void {
    this.updateAppointmentStatus(appointmentId, 'completed', 'provider', notes);
  }

  /**
   * Cancel appointment
   */
  static cancelAppointment(appointmentId: string, reason: string, cancelledBy: 'provider' | 'survivor'): void {
    this.updateAppointmentStatus(appointmentId, 'cancelled', cancelledBy, reason);
  }

  /**
   * Process survivor appointment response (called from appointment confirmation modal)
   */
  static processSurvivorAppointmentResponse(
    appointmentId: string,
    response: 'confirm' | 'decline' | 'reschedule',
    reason?: string,
    rescheduleDetails?: { newDate: string; newTime: string }
  ): void {
    switch (response) {
      case 'confirm':
        this.updateAppointmentStatus(appointmentId, 'confirmed', 'survivor');
        break;
      case 'decline':
        this.updateAppointmentStatus(appointmentId, 'declined', 'survivor', reason);
        break;
      case 'reschedule':
        this.updateAppointmentStatus(appointmentId, 'reschedule_requested', 'survivor', reason, rescheduleDetails);
        break;
    }
  }

  /**
   * Get formatted status text for display
   */
  static getStatusDisplayText(status: AppointmentStatus): string {
    const statusMap: Record<AppointmentStatus, string> = {
      pending: 'Pending Confirmation',
      confirmed: 'Confirmed',
      declined: 'Declined',
      reschedule_requested: 'Reschedule Requested',
      rescheduled: 'Rescheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };

    return statusMap[status] || status;
  }

  /**
   * Get status color for UI display
   */
  static getStatusColor(status: AppointmentStatus): string {
    const colorMap: Record<AppointmentStatus, string> = {
      pending: '#F59E0B',
      confirmed: '#10B981',
      declined: '#EF4444',
      reschedule_requested: '#F59E0B',
      rescheduled: '#3B82F6',
      completed: '#059669',
      cancelled: '#6B7280',
    };

    return colorMap[status] || '#6B7280';
  }
}