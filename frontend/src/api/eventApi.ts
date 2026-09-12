import type { Event, EventCategory, QuickStats } from '../types/event';
import { apiClient } from './apiClient';

export const eventApi = {
  /**
   * Fetch events with optional category and month filtering.
   * If year and month are provided, hits GET /api/events/calendar?year=&month=
   * Otherwise hits GET /api/events?category=
   */
  async getEvents(
    category?: EventCategory | 'All',
    year?: number,
    month?: number
  ): Promise<Event[]> {
    if (year !== undefined && month !== undefined) {
      return this.getEventsByMonth(year, month, category);
    }

    const params = new URLSearchParams();
    if (category && category !== 'All') {
      params.append('category', category);
    }

    const query = params.toString();
    const endpoint = `/api/events${query ? `?${query}` : ''}`;
    return apiClient<Event[]>(endpoint);
  },

  /**
   * Fetch events for a specific calendar month.
   * Converts 0-indexed JS month (0-11) to 1-indexed Java YearMonth (1-12).
   */
  async getEventsByMonth(
    year: number,
    month: number,
    category?: EventCategory | 'All'
  ): Promise<Event[]> {
    // Convert 0-indexed JS month to 1-indexed backend month
    const backendMonth = month + 1;
    const endpoint = `/api/events/calendar?year=${year}&month=${backendMonth}`;
    const events = await apiClient<Event[]>(endpoint);

    if (category && category !== 'All') {
      return events.filter((e) => e.category === category);
    }
    return events;
  },

  /**
   * Fetch a single event by ID.
   */
  async getEventById(id: string): Promise<Event> {
    return apiClient<Event>(`/api/events/${id}`);
  },

  /**
   * Create a new event.
   */
  async createEvent(eventData: Omit<Event, 'id' | 'status'> & { status?: string }): Promise<Event> {
    const payload = {
      ...eventData,
      description: eventData.notes || eventData.description || '',
    };
    return apiClient<Event>('/api/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch upcoming events for sidebar / dashboard card.
   */
  async getUpcomingEvents(limit = 4): Promise<Event[]> {
    return apiClient<Event[]>(`/api/events/upcoming?limit=${limit}`);
  },

  /**
   * Get calculated stats for Quick Stats card.
   */
  async getQuickStats(): Promise<QuickStats> {
    return apiClient<QuickStats>('/api/events/stats');
  },

  /**
   * Update an existing event by ID.
   */
  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    const payload = {
      ...data,
      description: data.notes ?? data.description ?? undefined,
    };
    return apiClient<Event>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete an event by ID.
   */
  async deleteEvent(id: string): Promise<void> {
    return apiClient<void>(`/api/events/${id}`, {
      method: 'DELETE',
    });
  },
};
