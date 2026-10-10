import { useEffect, useState } from 'react';
import { realtimeService } from '../services/realtime';
import type { ConnectionStatus, SseEventPayload } from '../types/realtime';

interface UseEventsRealtimeOptions {
  onEventChange: (payload: SseEventPayload) => void;
  onReconnect: () => void;
}

export const useEventsRealtime = ({
  onEventChange,
  onReconnect,
}: UseEventsRealtimeOptions) => {
  const [status, setStatus] = useState<ConnectionStatus>(realtimeService.getStatus());

  useEffect(() => {
    // Connect SSE stream
    realtimeService.connect();

    const unsubStatus = realtimeService.subscribeStatusChange((newStatus) => {
      setStatus(newStatus);
    });

    const unsubEvent = realtimeService.subscribeEventChange((payload) => {
      onEventChange(payload);
    });

    const unsubReconnect = realtimeService.subscribeReconnect(() => {
      onReconnect();
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        realtimeService.disconnect();
      } else {
        realtimeService.connect();
        onReconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubStatus();
      unsubEvent();
      unsubReconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      realtimeService.disconnect();
    };
  }, [onEventChange, onReconnect]);

  return { status };
};
