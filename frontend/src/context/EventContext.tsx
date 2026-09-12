import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Event, EventCategory, QuickStats } from '../types/event';
import { eventApi } from '../api/eventApi';
import { ToastContainer, type ToastMessage } from '../components/layout/Toast';

interface EventContextType {
  events: Event[];
  upcomingEvents: Event[];
  stats: QuickStats;
  isLoading: boolean;
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
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'status'>) => {
    const created = await eventApi.createEvent(eventData);
    await refreshEvents();
    showToast('Event created successfully', 'success');
    return created;
  };

  const handleUpdateEvent = async (id: string, eventData: Partial<Event>) => {
    const updated = await eventApi.updateEvent(id, eventData);
    await refreshEvents();
    showToast('Event updated successfully', 'success');
    return updated;
  };

  const handleDeleteEvent = async (id: string) => {
    await eventApi.deleteEvent(id);
    await refreshEvents();
    showToast('Event deleted', 'success');
  };

  return (
    <EventContext.Provider
      value={{
        events,
        upcomingEvents,
        stats,
        isLoading,
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
