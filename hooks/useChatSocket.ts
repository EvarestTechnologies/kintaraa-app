/**
 * useChatSocket — Real-time WebSocket hook for conversation messaging.
 *
 * Connects to the Django Channels WebSocket endpoint:
 *   ws(s)://<host>/ws/conversations/<conversation_id>/?token=<JWT>
 *
 * Protocol (sent by client):
 *   {"type": "send_message",  "data": {"content": "..."}}
 *   {"type": "typing_start",  "data": {}}
 *   {"type": "typing_stop",   "data": {}}
 *   {"type": "mark_read",     "data": {"message_id": "..."}}
 *
 * Protocol (received from server):
 *   {"type": "message_received", "data": WsMessageEvent}
 *   {"type": "user_typing",      "data": {user_id, full_name, is_typing}}
 *   {"type": "message_read",     "data": {message_id, user_id, read_at}}
 *   {"type": "user_online",      "data": {user_id, full_name}}
 *   {"type": "user_offline",     "data": {user_id, last_seen}}
 *   {"type": "error",            "data": {code, message}}
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '@/constants/config';
import type { WsMessageEvent } from '@/services/messaging';

export interface TypingEvent {
  user_id: string;
  full_name: string;
  is_typing: boolean;
}

export interface UseChatSocketReturn {
  isConnected: boolean;
  incomingMessage: WsMessageEvent | null;
  typingEvent: TypingEvent | null;
  sendMessage: (content: string) => void;
  sendTypingStart: () => void;
  sendTypingStop: () => void;
  markRead: (messageId: string) => void;
}

/**
 * @param conversationId - UUID of the conversation. Pass null/undefined to stay
 *   disconnected (e.g. while conversation is still loading).
 */
export const useChatSocket = (
  conversationId: string | null | undefined
): UseChatSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState<WsMessageEvent | null>(null);
  const [typingEvent, setTypingEvent] = useState<TypingEvent | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!conversationId) {
      // Clean up any existing connection when conversationId is removed
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    let cancelled = false;
    let ws: WebSocket | null = null;

    const connect = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (!token || cancelled) return;

      const url = `${APP_CONFIG.API.WS_BASE_URL}/ws/conversations/${conversationId}/?token=${encodeURIComponent(token)}`;

      try {
        ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!cancelled) {
            setIsConnected(true);
          }
        };

        ws.onmessage = (event: MessageEvent) => {
          if (cancelled) return;
          try {
            const envelope = JSON.parse(event.data as string);

            switch (envelope.type) {
              case 'message_received':
                setIncomingMessage(envelope.data as WsMessageEvent);
                break;

              case 'user_typing':
                setTypingEvent(envelope.data as TypingEvent);
                // Clear typing indicator after 3 seconds
                setTimeout(() => setTypingEvent(null), 3000);
                break;

              case 'error':
                console.warn('[WS] Server error:', envelope.data);
                break;

              default:
                // user_online, user_offline, message_read — ignore for now
                break;
            }
          } catch {
            console.error('[WS] Failed to parse message:', event.data);
          }
        };

        ws.onerror = () => {
          // onerror is always followed by onclose; logging here would be redundant
        };

        ws.onclose = (event: CloseEvent) => {
          if (!cancelled) {
            setIsConnected(false);
            if (event.code !== 1000) {
              // Abnormal closure — attempt reconnect after 3 seconds
              setTimeout(() => {
                if (!cancelled) connect();
              }, 3000);
            }
          }
        };
      } catch (err) {
        console.error('[WS] Connection error:', err);
      }
    };

    connect();

    return () => {
      cancelled = true;
      if (ws) {
        ws.close(1000, 'Component unmounted');
        ws = null;
      }
      wsRef.current = null;
      setIsConnected(false);
    };
  }, [conversationId]);

  const send = useCallback((payload: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const sendMessage = useCallback(
    (content: string) => send({ type: 'send_message', data: { content } }),
    [send]
  );

  const sendTypingStart = useCallback(
    () => send({ type: 'typing_start', data: {} }),
    [send]
  );

  const sendTypingStop = useCallback(
    () => send({ type: 'typing_stop', data: {} }),
    [send]
  );

  const markRead = useCallback(
    (messageId: string) => send({ type: 'mark_read', data: { message_id: messageId } }),
    [send]
  );

  return {
    isConnected,
    incomingMessage,
    typingEvent,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
    markRead,
  };
};
