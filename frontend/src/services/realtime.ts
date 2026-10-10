import { BASE_URL } from '../api/apiClient';
import type { ConnectionStatus, SseEventPayload } from '../types/realtime';

export type EventChangeCallback = (payload: SseEventPayload) => void;
export type StatusChangeCallback = (status: ConnectionStatus) => void;
export type ReconnectCallback = () => void;

export class RealtimeService {
  private eventSource: EventSource | null = null;
  private onEventChangeCallbacks: Set<EventChangeCallback> = new Set();
  private onStatusChangeCallbacks: Set<StatusChangeCallback> = new Set();
  private onReconnectCallbacks: Set<ReconnectCallback> = new Set();
  private currentStatus: ConnectionStatus = 'Offline';
  private hasConnectedBefore = false;

  public connect(): void {
    if (this.eventSource) {
      return;
    }

    const streamUrl = `${BASE_URL}/api/events/stream`;
    
    try {
      this.eventSource = new EventSource(streamUrl, { withCredentials: true });

      this.eventSource.onopen = () => {
        const isReconnect = this.hasConnectedBefore;
        this.hasConnectedBefore = true;
        this.setStatus('Live');

        if (isReconnect) {
          this.onReconnectCallbacks.forEach((cb) => cb());
        }
      };

      this.eventSource.onerror = () => {
        // EventSource automatically retries on network error or server disconnect
        if (this.eventSource?.readyState === EventSource.CONNECTING) {
          this.setStatus('Reconnecting');
        } else {
          this.setStatus('Offline');
        }
      };

      this.eventSource.addEventListener('event-change', (e: MessageEvent) => {
        try {
          const data: SseEventPayload = JSON.parse(e.data);
          this.onEventChangeCallbacks.forEach((cb) => cb(data));
        } catch (err) {
          console.error('Failed to parse SSE payload:', err, e.data);
        }
      });

      this.eventSource.addEventListener('ping', () => {
        // Keep-alive heartbeat ping received
      });
    } catch (err) {
      console.error('Error creating EventSource stream:', err);
      this.setStatus('Offline');
    }
  }

  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.setStatus('Offline');
    }
  }

  public subscribeEventChange(callback: EventChangeCallback): () => void {
    this.onEventChangeCallbacks.add(callback);
    return () => {
      this.onEventChangeCallbacks.delete(callback);
    };
  }

  public subscribeStatusChange(callback: StatusChangeCallback): () => void {
    this.onStatusChangeCallbacks.add(callback);
    callback(this.currentStatus);
    return () => {
      this.onStatusChangeCallbacks.delete(callback);
    };
  }

  public subscribeReconnect(callback: ReconnectCallback): () => void {
    this.onReconnectCallbacks.add(callback);
    return () => {
      this.onReconnectCallbacks.delete(callback);
    };
  }

  public getStatus(): ConnectionStatus {
    return this.currentStatus;
  }

  private setStatus(status: ConnectionStatus): void {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.onStatusChangeCallbacks.forEach((cb) => cb(status));
    }
  }
}

export const realtimeService = new RealtimeService();
