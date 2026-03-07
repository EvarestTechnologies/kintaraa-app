/**
 * useProviderWebSocket
 *
 * Maintains a persistent WebSocket connection to the backend's
 * ``ws/providers/`` endpoint for real-time case-assignment notifications.
 *
 * Strategy (enterprise hybrid):
 * - Primary:  WS push invalidates React Query cache instantly.
 * - Fallback: ProviderContext queries keep a 60-second refetchInterval so
 *             stale data is recovered even if the socket silently drops.
 *
 * Reconnection uses capped exponential back-off with jitter:
 *   delay = min(BASE * 2^attempt, MAX_DELAY) + random jitter
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/providers/AuthProvider';
import { APP_CONFIG } from '@/constants/config';

const MAX_RECONNECT_ATTEMPTS = 6;
const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;

export function useProviderWebSocket(): void {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const wsRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'provider') return;

    unmountedRef.current = false;
    attemptsRef.current = 0;

    function scheduleReconnect(): void {
      if (unmountedRef.current) return;
      if (attemptsRef.current >= MAX_RECONNECT_ATTEMPTS) return;

      const jitter = Math.random() * 500;
      const delay = Math.min(
        BASE_BACKOFF_MS * Math.pow(2, attemptsRef.current),
        MAX_BACKOFF_MS,
      ) + jitter;

      attemptsRef.current += 1;
      timerRef.current = setTimeout(connect, delay);
    }

    async function connect(): Promise<void> {
      if (unmountedRef.current) return;

      const token = await AsyncStorage.getItem(APP_CONFIG.STORAGE.ACCESS_TOKEN);
      if (!token || unmountedRef.current) return;

      const url = `${APP_CONFIG.API.WS_BASE_URL}/ws/providers/?token=${token}`;

      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = (): void => {
          attemptsRef.current = 0;
        };

        ws.onmessage = (event: MessageEvent): void => {
          try {
            const msg: { type: string; data?: unknown } = JSON.parse(event.data as string);

            if (msg.type === 'case_assigned') {
              // New pending assignment — refresh the pending list immediately
              queryClient.invalidateQueries({
                queryKey: ['pending-assignments', user.id],
              });
            } else if (msg.type === 'case_updated') {
              // Assignment accepted or rejected — refresh both lists
              queryClient.invalidateQueries({
                queryKey: ['pending-assignments', user.id],
              });
              queryClient.invalidateQueries({
                queryKey: ['accepted-cases', user.id],
              });
            }
            // 'pong' and other control frames are intentionally ignored
          } catch {
            // Malformed frame — ignore silently
          }
        };

        ws.onclose = (): void => {
          wsRef.current = null;
          scheduleReconnect();
        };

        ws.onerror = (): void => {
          // onclose fires right after onerror, so reconnect is handled there
          ws.close();
        };
      } catch {
        // new WebSocket() itself threw (e.g. invalid URL in tests)
        scheduleReconnect();
      }
    }

    void connect();

    return (): void => {
      unmountedRef.current = true;
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (wsRef.current !== null) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isAuthenticated, user?.id, user?.role, queryClient]);
}
