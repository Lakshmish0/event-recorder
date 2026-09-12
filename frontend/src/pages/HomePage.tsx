import React, { useState, useEffect, useCallback } from 'react';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { CategoryFilters } from '../components/dashboard/CategoryFilters';
import { CalendarGrid } from '../components/dashboard/CalendarGrid';
import { UpcomingEvents } from '../components/dashboard/UpcomingEvents';
import { QuickStats } from '../components/dashboard/QuickStats';
import { useEvents } from '../context/EventContext';
import type { EventCategory } from '../types/event';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    events,
    upcomingEvents,
    stats,
    isLoading,
    error,
    refreshEvents,
    openAddModal,
  } = useEvents();

  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 0-indexed Sept

  const handleMonthChange = useCallback((y: number, m: number) => {
    setCurrentYear(y);
    setCurrentMonth(m);
  }, []);

  useEffect(() => {
    refreshEvents(currentYear, currentMonth, selectedCategory);
  }, [currentYear, currentMonth, selectedCategory, refreshEvents]);

  const handleRetry = () => {
    refreshEvents(currentYear, currentMonth, selectedCategory);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-6">
      {/* Hero Banner Section */}
      <HeroBanner onAddEventClick={openAddModal} />

      {/* Global Fetch Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">Failed to sync with backend API</p>
              <p className="text-xs text-[#b91c1c]">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#ef4444] text-white hover:bg-[#dc2626] rounded-full transition-all shrink-0 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Category Filters Horizontal Row */}
      <section>
        <CategoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {/* Main Content 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left / Primary Column (Calendar Grid - spans 2 cols on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <CalendarGrid
            events={events}
            selectedCategory={selectedCategory}
            onMonthChange={handleMonthChange}
            isLoading={isLoading}
          />
        </div>

        {/* Right / Secondary Column (Upcoming Events & Quick Stats) */}
        <div className="space-y-6 lg:col-span-1">
          <UpcomingEvents
            events={upcomingEvents}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
          <QuickStats stats={stats} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
