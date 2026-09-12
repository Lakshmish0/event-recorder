import React, { useState, useEffect, useCallback } from 'react';
import { CalendarGrid } from '../components/dashboard/CalendarGrid';
import { useEvents } from '../context/EventContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { events, isLoading, error, refreshEvents } = useEvents();
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // Sept

  const handleMonthChange = useCallback((y: number, m: number) => {
    setCurrentYear(y);
    setCurrentMonth(m);
  }, []);

  useEffect(() => {
    refreshEvents(currentYear, currentMonth, 'All');
  }, [currentYear, currentMonth, refreshEvents]);

  const handleRetry = () => {
    refreshEvents(currentYear, currentMonth, 'All');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2d1f19]">Full Calendar View</h1>
        <p className="text-sm text-[#8c7b75]">View all sangha scheduled activities and key annual runway dates</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">Failed to load calendar events</p>
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

      <CalendarGrid
        events={events}
        selectedCategory="All"
        onMonthChange={handleMonthChange}
        isLoading={isLoading}
      />
    </div>
  );
};
