import type { Event } from './event';

export type ConnectionStatus = 'Live' | 'Reconnecting' | 'Offline';

export interface SseCreatedPayload {
  type: 'CREATED';
  event: Event;
  timestamp: string;
}

export interface SseUpdatedPayload {
  type: 'UPDATED';
  event: Event;
  timestamp: string;
}

export interface SseDeletedPayload {
  type: 'DELETED';
  event: { id: string };
  timestamp: string;
}

export type SseEventPayload = SseCreatedPayload | SseUpdatedPayload | SseDeletedPayload;
