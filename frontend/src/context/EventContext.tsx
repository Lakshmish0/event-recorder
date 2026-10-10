import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Event, EventCategory, QuickStats } from '../types/event';
import type { ConnectionStatus, SseEventPayload } from '../types/realtime';
import { eventApi } from '../api/eventApi';
import { useEventsRealtime } from '../hooks/useEventsRealtime';
import { ToastContainer, type ToastMessage } from '../components/layout/Toast';

interface EventContextType {
  events: Event[];
  upcomingEvents: Event[];
  stats: QuickStats;
  isLoading: boolean;
  isWakingUp: boolean;
  realtimeStatus: ConnectionStatus;
  error: string | null;
  toasts: ToastMessage[];
  isAddModalOpen: boolean;
  editingEvent: Event | null;
  deletingEvent: Event | null;
  refreshEvents: (year?: number, month?: number, category?: EventCategory | 'All') => Promise<void>;
  createEvent: (eventData: Omit<Event, 'id' | 'status'>) => Promise<Event>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (event: Event) => void;
  closeEditModal: () => void;
  openDeleteModal: (event: Event) => void;
  closeDeleteModal: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<QuickStats>({
    totalEvents: 0,
    thisMonth: 0,
    upcoming: 0,
    completed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshEvents = useCallback(
    async (year?: number, month?: number, category?: EventCategory | 'All') => {
      setIsLoading(true);
      setError(null);

      // Render cold-start detector: show "Waking up server..." if request takes > 3000ms
      const coldStartTimer = setTimeout(() => {
        setIsWakingUp(true);
      }, 3000);

      try {
        const [fetchedEvents, upcomingList, quickStats] = await Promise.all([
          year !== undefined && month !== undefined
            ? eventApi.getEventsByMonth(year, month, category)
            : eventApi.getEvents(category),
          eventApi.getUpcomingEvents(4),
          eventApi.getQuickStats(),
        ]);

        setEvents(fetchedEvents);
        setUpcomingEvents(upcomingList);
        setStats(quickStats);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch events from backend';
        setError(message);
        console.error('Error fetching events in Context:', err);
      } finally {
        clearTimeout(coldStartTimer);
        setIsWakingUp(false);
        setIsLoading(false);
      }
    },
    []
  );

  const refreshMetadata = useCallback(async () => {
    try {
      const [upcomingList, quickStats] = await Promise.all([
        eventApi.getUpcomingEvents(4),
        eventApi.getQuickStats(),
      ]);
      setUpcomingEvents(upcomingList);
      setStats(quickStats);
    } catch (e) {
      console.error('Error refreshing metadata:', e);
    }
  }, []);

  const handleRealtimeEventChange = useCallback((payload: SseEventPayload) => {
    if (payload.type === 'CREATED') {
      const newEv = payload.event as Event;
      setEvents((prev) => {
        if (prev.some((e) => e.id === newEv.id)) {
          return prev;
        }
        return [...prev, newEv];
      });
      refreshMetadata();
    } else if (payload.type === 'UPDATED') {
      const updatedEv = payload.event as Event;
      setEvents((prev) =>
        prev.map((e) => (e.id === updatedEv.id ? updatedEv : e))
      );
      refreshMetadata();
    } else if (payload.type === 'DELETED') {
      const deletedId = (payload.event as { id: string }).id;
      setEvents((prev) => prev.filter((e) => e.id !== deletedId));
      refreshMetadata();
    }
  }, [refreshMetadata]);

  const handleRealtimeReconnect = useCallback(() => {
    refreshEvents();
  }, [refreshEvents]);

  const { status: realtimeStatus } = useEventsRealtime({
    onEventChange: handleRealtimeEventChange,
    onReconnect: handleRealtimeReconnect,
  });

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'status'>) => {
    const created = await eventApi.createEvent(eventData);
    // Optimistically insert to state if absent, then resync
    setEvents((prev) => prev.some((e) => e.id === created.id) ? prev : [...prev, created]);
    refreshMetadata();
    showToast('Event created successfully', 'success');
    return created;
  };

  const handleUpdateEvent = async (id: string, eventData: Partial<Event>) => {
    const updated = await eventApi.updateEvent(id, eventData);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    refreshMetadata();
    showToast('Event updated successfully', 'success');
    return updated;
  };

  const handleDeleteEvent = async (id: string) => {
    await eventApi.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    refreshMetadata();
    showToast('Event deleted', 'success');
  };

  return (
    <EventContext.Provider
      value={{
        events,
        upcomingEvents,
        stats,
        isLoading,
        isWakingUp,
        realtimeStatus,
        error,
        toasts,
        isAddModalOpen,
        editingEvent,
        deletingEvent,
        refreshEvents,
        createEvent: handleCreateEvent,
        updateEvent: handleUpdateEvent,
        deleteEvent: handleDeleteEvent,
        showToast,
        dismissToast,
        openAddModal: () => setIsAddModalOpen(true),
        closeAddModal: () => setIsAddModalOpen(false),
        openEditModal: (ev) => setEditingEvent(ev),
        closeEditModal: () => setEditingEvent(null),
        openDeleteModal: (ev) => setDeletingEvent(ev),
        closeDeleteModal: () => setDeletingEvent(null),
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
