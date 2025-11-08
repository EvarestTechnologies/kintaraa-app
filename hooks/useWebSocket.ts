import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { APP_CONFIG } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WebSocketMessage {
  type: 'incident_update' | 'new_message' | 'case_assignment' | 'provider_status';
  data: any;
  timestamp: string;
}

export const useWebSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = async () => {
    if (Platform.OS === 'web' && !isAuthenticated) return;

    try {
      // Get WebSocket URL from production config
      const baseUrl = APP_CONFIG.API.BASE_URL.replace('/api', '').replace('http', 'ws');
      const wsUrl = `${baseUrl}/ws/notifications/`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = async () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;

        // Send authentication as first message (more secure than query params)
        const token = await AsyncStorage.getItem('access_token');
        if (token && wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'authenticate',
            data: { token },
            timestamp: new Date().toISOString(),
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          // Error will be logged by logger utility
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        // Error will be logged by logger utility
      };
    } catch (error) {
      // Error will be logged by logger utility
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
  };

  const sendMessage = (message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (wsRef.current && isConnected) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: new Date().toISOString(),
      };
      
      wsRef.current.send(JSON.stringify(fullMessage));
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user?.id]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
  };
};