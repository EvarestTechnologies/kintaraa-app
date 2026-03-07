/**
 * Messaging API Service
 *
 * Handles REST API calls for the real-time messaging system:
 * - Fetching conversations (linked to incidents)
 * - Loading message history
 * - Sending messages via REST (fallback when WebSocket unavailable)
 * - Registering Expo push tokens for background notifications
 *
 * WebSocket connections are managed by hooks/useChatSocket.ts
 */

import { apiRequest } from './api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MessageSender {
  id: string;
  email: string;
  full_name: string;
  role: string;
  provider_type?: string;
  provider_type_display?: string;
}

export interface MessageData {
  id: string;
  conversation: string;
  sender: MessageSender;
  content: string;
  message_type: 'user_message' | 'system_event' | 'status_update';
  created_at: string;
  is_edited: boolean;
  edited_at?: string | null;
  is_deleted: boolean;
  read_by?: Array<{ id: string; user: MessageSender; read_at: string }>;
  read_count?: number;
}

export interface ConversationIncident {
  id: string;
  case_number: string;
  type: string;
  type_display: string;
  status: string;
  status_display: string;
  urgency_level: string;
}

export interface ConversationParticipant {
  id: string;
  full_name: string;
  role: string;
  provider_type?: string;
  provider_type_display?: string;
  is_online: boolean;
}

export interface ConversationData {
  id: string;
  incident: ConversationIncident;
  participants: ConversationParticipant[];
  last_message: MessageData | null;
  unread_count: number;
  created_at: string;
  last_message_at: string | null;
  is_active: boolean;
}

/** Shape of a WS `message_received` event's `data` payload */
export interface WsMessageEvent {
  id: string;
  conversation_id: string;
  sender: MessageSender;
  content: string;
  message_type: string;
  created_at: string;
  is_edited: boolean;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── API Calls ────────────────────────────────────────────────────────────────

/**
 * Fetch the conversation linked to a specific incident.
 * A conversation only exists after at least one provider accepts the case assignment.
 *
 * Returns null if no conversation exists yet.
 */
export const getConversationForIncident = async (
  incidentId: string
): Promise<ConversationData | null> => {
  try {
    const data: PaginatedResponse<ConversationData> = await apiRequest(
      `/messaging/conversations/?incident_id=${incidentId}`
    );
    return data.results && data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error('Failed to fetch conversation for incident:', error);
    return null;
  }
};

/**
 * Fetch paginated message history for a conversation.
 * Messages are ordered oldest → newest.
 */
export const getConversationMessages = async (
  conversationId: string
): Promise<MessageData[]> => {
  const data: PaginatedResponse<MessageData> = await apiRequest(
    `/messaging/conversations/${conversationId}/messages/`
  );
  return data.results || [];
};

/**
 * Send a message via REST (fallback when WebSocket is not connected).
 * The WebSocket consumer handles DB persistence; this goes through the REST view.
 */
export const sendMessageRest = async (
  conversationId: string,
  content: string
): Promise<MessageData> => {
  return apiRequest(`/messaging/conversations/${conversationId}/send_message/`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
};

/**
 * Register an Expo push token for background notifications.
 * Call this after obtaining a token via Notifications.getExpoPushTokenAsync().
 *
 * Requires: npx expo install expo-notifications
 */
export const registerPushToken = async (
  token: string,
  platform: string
): Promise<void> => {
  await apiRequest('/messaging/push-token/', {
    method: 'POST',
    body: JSON.stringify({ token, platform }),
  });
};

/**
 * Mark all messages in a conversation as read for the current user.
 */
export const markAllMessagesRead = async (conversationId: string): Promise<void> => {
  await apiRequest(`/messaging/conversations/${conversationId}/mark-all-read/`, {
    method: 'POST',
  });
};
