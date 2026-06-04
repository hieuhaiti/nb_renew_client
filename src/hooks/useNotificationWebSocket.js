import { useEffect, useRef } from 'react';
import { env } from '@/config/env';

function debugNotificationSocket(event, payload = {}) {
  if (!env.isDev) return;
  console.info(`[notificationSocket] ${event}`, {
    at: new Date().toISOString(),
    ...payload,
  });
}

function buildNotificationSocketUrl(token) {
  if (!env.notificationWsUrl) return '';

  try {
    const url = new URL(env.notificationWsUrl);
    if (token) url.searchParams.set('token', token);
    return url.toString();
  } catch {
    return '';
  }
}

export function useNotificationWebSocket({ enabled = true, token, onMessage } = {}) {
  const onMessageRef = useRef(onMessage);
  const reconnectTimerRef = useRef(null);
  const refetchGuardTimerRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectAttemptRef = useRef(0);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const socketUrl = buildNotificationSocketUrl(token);
    let isActive = true;
    debugNotificationSocket('effect:start', {
      enabled,
      hasToken: Boolean(token),
      socketUrl,
    });

    function clearTimers() {
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (refetchGuardTimerRef.current) {
        window.clearTimeout(refetchGuardTimerRef.current);
        refetchGuardTimerRef.current = null;
      }
    }

    function closeSocket() {
      if (!socketRef.current) return;
      debugNotificationSocket('socket:close:manual');
      socketRef.current.onopen = null;
      socketRef.current.onmessage = null;
      socketRef.current.onerror = null;
      socketRef.current.onclose = null;
      socketRef.current.close();
      socketRef.current = null;
    }

    function scheduleMessageHandler() {
      if (refetchGuardTimerRef.current) return;
      debugNotificationSocket('message:received');

      refetchGuardTimerRef.current = window.setTimeout(() => {
        refetchGuardTimerRef.current = null;
        debugNotificationSocket('message:dispatch');
        onMessageRef.current?.();
      }, 500);
    }

    function connect() {
      if (!isActive || !enabled || !socketUrl) return;

      closeSocket();
      debugNotificationSocket('socket:connect', {
        reconnectAttempt: reconnectAttemptRef.current,
      });
      const socket = new WebSocket(socketUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptRef.current = 0;
        debugNotificationSocket('socket:open');
      };

      socket.onmessage = () => {
        scheduleMessageHandler();
      };

      socket.onerror = () => {
        debugNotificationSocket('socket:error');
        socket.close();
      };

      socket.onclose = () => {
        if (!isActive) return;
        socketRef.current = null;
        reconnectAttemptRef.current += 1;
        const retryDelay = Math.min(30000, 1000 * 2 ** reconnectAttemptRef.current);
        debugNotificationSocket('socket:closed', {
          retryDelay,
          reconnectAttempt: reconnectAttemptRef.current,
        });
        reconnectTimerRef.current = window.setTimeout(connect, retryDelay);
      };
    }

    connect();

    return () => {
      isActive = false;
      debugNotificationSocket('effect:cleanup');
      clearTimers();
      closeSocket();
    };
  }, [enabled, token]);
}
