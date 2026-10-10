import { describe, test, expect } from 'bun:test';
import type { Event } from '../types/event';
import type { SseEventPayload } from '../types/realtime';

function handleRealtimeEvent(
  events: Event[],
  payload: SseEventPayload
): Event[] {
  if (payload.type === 'CREATED') {
    const newEv = payload.event as Event;
    if (events.some((e) => e.id === newEv.id)) {
      return events;
    }
    return [...events, newEv];
  } else if (payload.type === 'UPDATED') {
    const updatedEv = payload.event as Event;
    return events.map((e) => (e.id === updatedEv.id ? updatedEv : e));
  } else if (payload.type === 'DELETED') {
    const deletedId = (payload.event as { id: string }).id;
    return events.filter((e) => e.id !== deletedId);
  }
  return events;
}

describe('Realtime Event Reducer Logic', () => {
  const sampleEvent1: Event = {
    id: 'evt-1',
    title: 'Morning Prayers',
    category: 'Class',
    startDate: '2026-10-10',
    endDate: '2026-10-10',
    startTime: '08:00 AM',
    endTime: '09:00 AM',
    location: 'Main Temple',
    status: 'Upcoming',
  };

  const sampleEvent2: Event = {
    id: 'evt-2',
    title: 'Evening Bhajan',
    category: 'Celebration',
    startDate: '2026-10-10',
    endDate: '2026-10-10',
    startTime: '06:00 PM',
    endTime: '08:00 PM',
    location: 'Auditorium',
    status: 'Upcoming',
  };

  test('handles CREATED payload and inserts new event', () => {
    const initialEvents = [sampleEvent1];
    const payload: SseEventPayload = {
      type: 'CREATED',
      event: sampleEvent2,
      timestamp: new Date().toISOString(),
    };

    const nextState = handleRealtimeEvent(initialEvents, payload);
    expect(nextState).toHaveLength(2);
    expect(nextState[1].id).toBe('evt-2');
  });

  test('dedupes CREATED payload if event ID already exists', () => {
    const initialEvents = [sampleEvent1];
    const payload: SseEventPayload = {
      type: 'CREATED',
      event: sampleEvent1,
      timestamp: new Date().toISOString(),
    };

    const nextState = handleRealtimeEvent(initialEvents, payload);
    expect(nextState).toHaveLength(1);
  });

  test('handles UPDATED payload and replaces existing event by ID', () => {
    const initialEvents = [sampleEvent1, sampleEvent2];
    const updatedSample1: Event = {
      ...sampleEvent1,
      title: 'Morning Prayers (Updated)',
    };

    const payload: SseEventPayload = {
      type: 'UPDATED',
      event: updatedSample1,
      timestamp: new Date().toISOString(),
    };

    const nextState = handleRealtimeEvent(initialEvents, payload);
    expect(nextState).toHaveLength(2);
    expect(nextState[0].title).toBe('Morning Prayers (Updated)');
  });

  test('handles DELETED payload and removes event by ID', () => {
    const initialEvents = [sampleEvent1, sampleEvent2];
    const payload: SseEventPayload = {
      type: 'DELETED',
      event: { id: 'evt-1' },
      timestamp: new Date().toISOString(),
    };

    const nextState = handleRealtimeEvent(initialEvents, payload);
    expect(nextState).toHaveLength(1);
    expect(nextState[0].id).toBe('evt-2');
  });
});
