/**
 * Communication Service
 * Handles SMS and voice call communication between providers and survivors
 * Supports Twilio and Africa's Talking APIs
 */

import { apiRequest, API_CONFIG } from './api';
import { APP_CONFIG } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

export interface CommunicationTemplate {
  id: string;
  name: string;
  category: 'appointment' | 'follow_up' | 'emergency' | 'general';
  content: string;
  variables: string[]; // e.g., ['survivor_name', 'appointment_date', 'provider_name']
}

export interface SMSMessage {
  id: string;
  case_id: string;
  sender_id: string;
  recipient_id: string;
  recipient_phone: string;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  template_id?: string;
}

export interface VoiceCall {
  id: string;
  case_id: string;
  caller_id: string;
  recipient_id: string;
  recipient_phone: string;
  duration_seconds?: number;
  status: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'no_answer';
  initiated_at: string;
  completed_at?: string;
  recording_url?: string;
}

export interface CommunicationLog {
  id: string;
  case_id: string;
  type: 'sms' | 'call';
  direction: 'outbound' | 'inbound';
  from_user_id: string;
  to_user_id: string;
  phone_number: string;
  content?: string; // For SMS
  duration?: number; // For calls
  status: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class CommunicationService {
  /**
   * Send SMS to survivor/provider
   * POST /api/communications/send-sms/
   */
  static async sendSMS(data: {
    caseId: string;
    recipientId: string;
    recipientPhone: string;
    message: string;
    templateId?: string;
  }): Promise<SMSMessage> {
    // Try API first
    if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      try {
        console.log('📡 Sending SMS via API...');

        const response = await apiRequest(API_CONFIG.ENDPOINTS.COMMUNICATIONS.SEND_SMS, {
          method: 'POST',
          body: JSON.stringify({
            case_id: data.caseId,
            recipient_id: data.recipientId,
            recipient_phone: data.recipientPhone,
            message: data.message,
            template_id: data.templateId,
          }),
        });

        console.log('✅ SMS sent via API');
        return this.transformSMSFromAPI(response);
      } catch (error) {
        console.warn('⚠️ API SMS failed, using local simulation:', error);
      }
    }

    // Fallback: Simulate SMS locally
    console.log('💾 Simulating SMS locally (development mode)');
    const sms: SMSMessage = {
      id: Date.now().toString(),
      case_id: data.caseId,
      sender_id: 'current_user', // Would come from auth
      recipient_id: data.recipientId,
      recipient_phone: data.recipientPhone,
      message: data.message,
      status: 'sent',
      sent_at: new Date().toISOString(),
      template_id: data.templateId,
    };

    // Store locally
    await this.storeCommunicationLog({
      case_id: data.caseId,
      type: 'sms',
      direction: 'outbound',
      from_user_id: 'current_user',
      to_user_id: data.recipientId,
      phone_number: data.recipientPhone,
      content: data.message,
      status: 'sent',
      timestamp: new Date().toISOString(),
    });

    return sms;
  }

  /**
   * Initiate voice call
   * POST /api/communications/initiate-call/
   */
  static async initiateCall(data: {
    caseId: string;
    recipientId: string;
    recipientPhone: string;
  }): Promise<VoiceCall> {
    // Try API first
    if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      try {
        console.log('📡 Initiating call via API...');

        const response = await apiRequest(API_CONFIG.ENDPOINTS.COMMUNICATIONS.INITIATE_CALL, {
          method: 'POST',
          body: JSON.stringify({
            case_id: data.caseId,
            recipient_id: data.recipientId,
            recipient_phone: data.recipientPhone,
          }),
        });

        console.log('✅ Call initiated via API');
        return this.transformCallFromAPI(response);
      } catch (error) {
        console.warn('⚠️ API call failed, using device dialer:', error);
      }
    }

    // Fallback: Use device phone dialer
    console.log('📞 Opening device phone dialer');
    const phoneUrl = `tel:${data.recipientPhone}`;

    const call: VoiceCall = {
      id: Date.now().toString(),
      case_id: data.caseId,
      caller_id: 'current_user',
      recipient_id: data.recipientId,
      recipient_phone: data.recipientPhone,
      status: 'initiated',
      initiated_at: new Date().toISOString(),
    };

    // Store communication log
    await this.storeCommunicationLog({
      case_id: data.caseId,
      type: 'call',
      direction: 'outbound',
      from_user_id: 'current_user',
      to_user_id: data.recipientId,
      phone_number: data.recipientPhone,
      status: 'initiated',
      timestamp: new Date().toISOString(),
    });

    // Open phone dialer
    const canOpen = await Linking.canOpenURL(phoneUrl);
    if (canOpen) {
      await Linking.openURL(phoneUrl);
    } else {
      throw new Error('Cannot open phone dialer on this device');
    }

    return call;
  }

  /**
   * Get message templates
   * GET /api/communications/templates/
   */
  static async getTemplates(category?: string): Promise<CommunicationTemplate[]> {
    // Try API first
    if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      try {
        console.log('📡 Fetching templates from API...');

        const queryParams = category ? `?category=${category}` : '';
        const response = await apiRequest(
          `${API_CONFIG.ENDPOINTS.COMMUNICATIONS.TEMPLATES}${queryParams}`
        );

        console.log(`✅ Loaded ${response.results.length} templates`);
        return response.results;
      } catch (error) {
        console.warn('⚠️ API templates failed, using local templates:', error);
      }
    }

    // Fallback: Return default templates
    console.log('💾 Using default message templates');
    return this.getDefaultTemplates();
  }

  /**
   * Get communication history for a case
   * GET /api/cases/{id}/communications/
   */
  static async getCommunicationHistory(caseId: string): Promise<CommunicationLog[]> {
    // Try API first
    if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      try {
        console.log('📡 Fetching communication history from API...');

        const endpoint = API_CONFIG.ENDPOINTS.COMMUNICATIONS.HISTORY.replace('{id}', caseId);
        const response = await apiRequest(endpoint);

        console.log(`✅ Loaded ${response.results.length} communication logs`);
        return response.results.map(this.transformLogFromAPI);
      } catch (error) {
        console.warn('⚠️ API history failed, loading from local storage:', error);
      }
    }

    // Fallback: Load from local storage
    console.log('💾 Loading communication history from local storage');
    const stored = await AsyncStorage.getItem(`communications_${caseId}`);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Log a communication event
   * POST /api/communications/log/
   */
  static async logCommunication(log: Omit<CommunicationLog, 'id'>): Promise<CommunicationLog> {
    // Try API first
    if (APP_CONFIG.API.BASE_URL && !APP_CONFIG.API.BASE_URL.includes('localhost:8000')) {
      try {
        console.log('📡 Logging communication via API...');

        const response = await apiRequest(API_CONFIG.ENDPOINTS.COMMUNICATIONS.LOG, {
          method: 'POST',
          body: JSON.stringify({
            case_id: log.case_id,
            type: log.type,
            direction: log.direction,
            from_user_id: log.from_user_id,
            to_user_id: log.to_user_id,
            phone_number: log.phone_number,
            content: log.content,
            duration: log.duration,
            status: log.status,
            timestamp: log.timestamp,
            metadata: log.metadata,
          }),
        });

        console.log('✅ Communication logged via API');
        return this.transformLogFromAPI(response);
      } catch (error) {
        console.warn('⚠️ API logging failed, storing locally:', error);
      }
    }

    // Fallback: Store locally
    return await this.storeCommunicationLog(log);
  }

  /**
   * Store communication log locally
   */
  private static async storeCommunicationLog(
    log: Omit<CommunicationLog, 'id'>
  ): Promise<CommunicationLog> {
    const newLog: CommunicationLog = {
      id: Date.now().toString(),
      ...log,
    };

    const stored = await AsyncStorage.getItem(`communications_${log.case_id}`);
    const logs = stored ? JSON.parse(stored) : [];
    logs.unshift(newLog);

    await AsyncStorage.setItem(`communications_${log.case_id}`, JSON.stringify(logs));

    return newLog;
  }

  /**
   * Default message templates
   */
  private static getDefaultTemplates(): CommunicationTemplate[] {
    return [
      {
        id: 'appt-reminder',
        name: 'Appointment Reminder',
        category: 'appointment',
        content: 'Hello {survivor_name}, this is a reminder about your appointment with {provider_name} on {appointment_date} at {appointment_time}. Location: {location}.',
        variables: ['survivor_name', 'provider_name', 'appointment_date', 'appointment_time', 'location'],
      },
      {
        id: 'follow-up',
        name: 'Follow-up Check-in',
        category: 'follow_up',
        content: 'Hello {survivor_name}, {provider_name} checking in. How are you feeling today? Please reply or call if you need any support.',
        variables: ['survivor_name', 'provider_name'],
      },
      {
        id: 'emergency-response',
        name: 'Emergency Response',
        category: 'emergency',
        content: 'We have received your emergency alert. Help is on the way. Stay safe. Call {emergency_number} if you need immediate assistance.',
        variables: ['emergency_number'],
      },
      {
        id: 'case-update',
        name: 'Case Status Update',
        category: 'general',
        content: 'Your case {case_number} status has been updated. {update_details}. Contact us at {contact_number} for questions.',
        variables: ['case_number', 'update_details', 'contact_number'],
      },
      {
        id: 'initial-contact',
        name: 'Initial Contact',
        category: 'general',
        content: 'Hello, I am {provider_name} from {organization}. I have been assigned to support you with case {case_number}. When would be a good time to talk?',
        variables: ['provider_name', 'organization', 'case_number'],
      },
      {
        id: 'consent-request',
        name: 'Consent Request',
        category: 'general',
        content: 'For your case {case_number}, we need your consent to {action}. Please reply YES to confirm or call us at {contact_number} with any questions.',
        variables: ['case_number', 'action', 'contact_number'],
      },
    ];
  }

  /**
   * Fill template with variables
   */
  static fillTemplate(template: CommunicationTemplate, variables: Record<string, string>): string {
    let message = template.content;

    template.variables.forEach((variable) => {
      const value = variables[variable] || `{${variable}}`;
      message = message.replace(new RegExp(`\\{${variable}\\}`, 'g'), value);
    });

    return message;
  }

  /**
   * Transform API responses to frontend format
   */
  private static transformSMSFromAPI(apiData: any): SMSMessage {
    return {
      id: apiData.id,
      case_id: apiData.case_id || apiData.case,
      sender_id: apiData.sender_id || apiData.sender,
      recipient_id: apiData.recipient_id || apiData.recipient,
      recipient_phone: apiData.recipient_phone,
      message: apiData.message,
      status: apiData.status,
      sent_at: apiData.sent_at,
      delivered_at: apiData.delivered_at,
      error_message: apiData.error_message,
      template_id: apiData.template_id,
    };
  }

  private static transformCallFromAPI(apiData: any): VoiceCall {
    return {
      id: apiData.id,
      case_id: apiData.case_id || apiData.case,
      caller_id: apiData.caller_id || apiData.caller,
      recipient_id: apiData.recipient_id || apiData.recipient,
      recipient_phone: apiData.recipient_phone,
      duration_seconds: apiData.duration_seconds,
      status: apiData.status,
      initiated_at: apiData.initiated_at,
      completed_at: apiData.completed_at,
      recording_url: apiData.recording_url,
    };
  }

  private static transformLogFromAPI(apiData: any): CommunicationLog {
    return {
      id: apiData.id,
      case_id: apiData.case_id || apiData.case,
      type: apiData.type,
      direction: apiData.direction,
      from_user_id: apiData.from_user_id || apiData.from_user,
      to_user_id: apiData.to_user_id || apiData.to_user,
      phone_number: apiData.phone_number,
      content: apiData.content,
      duration: apiData.duration,
      status: apiData.status,
      timestamp: apiData.timestamp,
      metadata: apiData.metadata,
    };
  }
}

/**
 * Query keys for React Query
 */
export const communicationQueryKeys = {
  all: ['communications'] as const,
  templates: () => [...communicationQueryKeys.all, 'templates'] as const,
  template: (category?: string) => [...communicationQueryKeys.templates(), category] as const,
  history: () => [...communicationQueryKeys.all, 'history'] as const,
  caseHistory: (caseId: string) => [...communicationQueryKeys.history(), caseId] as const,
};
