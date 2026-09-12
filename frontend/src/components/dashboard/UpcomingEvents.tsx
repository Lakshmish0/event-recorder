import React from 'react';
import type { Event } from '../../types/event';
import { CATEGORY_STYLES } from '../../utils/categoryThemes';
import { ArrowRight, GraduationCap, PartyPopper, Tent, Trophy, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpcomingEventsProps {
  events: Event[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  events,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Class':
        return GraduationCap;
      case 'Celebration':
        return PartyPopper;
      case 'Camp':
        return Tent;
      case 'Competition':
        return Trophy;
      case 'Special Event':
        return Star;
      default:
        return Star;
    }
  };

  const formatMonthShort = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, (m || 1) - 1, d || 1);
    return dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  };

  const formatDayNum = (dateStr: string) => {
    if (!dateStr) return '';
    const d = dateStr.split('-')[2];
    return d;
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-[#efe6da] shadow-card p-5 sm:p-6 w-full space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-[#2d1f19]">
          Upcoming Events
        </h3>
        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#c85a28] hover:text-[#b44f21] transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#faf7f2] border border-[#efe6da]"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-gray-200 shrink-0" />
                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Error State with Retry */}
      {!isLoading && error && (
        <div className="p-4 rounded-2xl bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#ef4444]" />
            <span className="text-xs font-semibold">Failed to load upcoming events</span>
          </div>
          <p className="text-[11px] text-[#b91c1c]">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#ef4444] text-white hover:bg-[#dc2626] rounded-full transition-all shadow-xs"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && events.length === 0 && (
        <div className="p-6 text-center text-[#8c7b75] text-xs">
          No upcoming events found.
        </div>
      )}

      {/* List of Events */}
      {!isLoading && !error && events.length > 0 && (
        <div className="space-y-3">
          {events.slice(0, 4).map((ev) => {
            const Icon = getCategoryIcon(ev.category);
            const style = CATEGORY_STYLES[ev.category];

            return (
              <div
                key={ev.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#faf7f2] hover:bg-[#f5eee3] border border-[#efe6da] transition-all duration-200 group relative"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Date Block Badge */}
                  <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-white border border-[#efe6da] shadow-xs text-center shrink-0">
                    <span className="text-[10px] font-bold text-[#8c7b75] uppercase tracking-wider leading-none">
                      {formatMonthShort(ev.startDate)}
                    </span>
                    <span className="text-sm font-extrabold text-[#2d1f19] leading-tight">
                      {formatDayNum(ev.startDate)}
                    </span>
                  </div>

                  {/* Category Icon Circle */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${style?.bg || 'bg-orange-100'} ${style?.text || 'text-orange-600'}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Title & Time */}
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#2d1f19] group-hover:text-[#c85a28] transition-colors truncate">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-[#8c7b75] truncate">
                      {ev.startTime} – {ev.endTime}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 flex items-center gap-2 pl-2">
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                      ev.status === 'Upcoming'
                        ? 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]'
                        : ev.status === 'Completed'
                        ? 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]'
                        : 'bg-[#f1e8ff] text-[#7e22ce] border-[#e9d5ff]'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
