export type EventCategory = 'Class' | 'Celebration' | 'Camp' | 'Competition' | 'Special Event';

export type CalendarViewMode = 'Month' | 'Week' | 'Day';

export type EventStatus = 'Upcoming' | 'Later' | 'Completed' | 'Ongoing';

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  startTime: string; // HH:mm format e.g. "09:00 AM"
  endTime: string;   // HH:mm format e.g. "05:00 PM"
  location: string;
  notes?: string;
  description?: string;
  imageUrl?: string;
  status: EventStatus;
  startDateTime?: string;
  endDateTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuickStats {
  totalEvents: number;
  thisMonth: number;
  upcoming: number;
  completed: number;
}

export interface CategoryTheme {
  label: EventCategory;
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  iconName: string;
}
