import React, { useState, useEffect } from "react";
import type { Event, CalendarViewMode, EventCategory } from "../../types/event";
import { useEvents } from "../../context/EventContext";
import { CATEGORY_STYLES } from "../../utils/categoryThemes";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Clock, Pencil, Trash2 } from "lucide-react";

interface CalendarGridProps {
  events: Event[];
  selectedCategory: EventCategory | "All";
  onSelectDate?: (dateStr: string) => void;
  onMonthChange?: (year: number, month: number) => void;
  isLoading?: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const WEEKDAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const ROW_HEIGHT = 56;
const START_MINUTES = 6 * 60; // 6:00 AM = 360 mins

const formatDateStr = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseDateStr = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const getWeekDays = (date: Date): Date[] => {
  const dayOfWeek = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - dayOfWeek);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    days.push(d);
  }
  return days;
};

const formatWeekRangeStr = (weekDays: Date[]): string => {
  const start = weekDays[0];
  const end = weekDays[6];

  const startMonthStr = MONTH_NAMES_SHORT[start.getMonth()];
  const endMonthStr = MONTH_NAMES_SHORT[end.getMonth()];

  if (start.getFullYear() !== end.getFullYear()) {
    return `${startMonthStr} ${start.getDate()}, ${start.getFullYear()} – ${endMonthStr} ${end.getDate()}, ${end.getFullYear()}`;
  } else if (start.getMonth() !== end.getMonth()) {
    return `${startMonthStr} ${start.getDate()} – ${endMonthStr} ${end.getDate()}, ${start.getFullYear()}`;
  } else {
    return `${startMonthStr} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  }
};

const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3] ? match[3].toUpperCase() : null;

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const formatHourLabel = (hour: number): string => {
  if (hour === 12) return "12:00 PM";
  if (hour > 12) return `${hour - 12}:00 PM`;
  return `${hour}:00 AM`;
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  events,
  selectedCategory,
  onSelectDate,
  onMonthChange,
  isLoading = false,
}) => {
  const { openEditModal, openDeleteModal } = useEvents();

  // Default to September 22, 2026 as per reference design
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 22));
  const [viewMode, setViewMode] = useState<CalendarViewMode>("Month");
  const [selectedDayStr, setSelectedDayStr] = useState<string>("2026-09-22");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(year, month);
    }
  }, [year, month, onMonthChange]);

  const handlePrev = () => {
    if (viewMode === "Month") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === "Week") {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else if (viewMode === "Day") {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
      setSelectedDayStr(formatDateStr(d));
    }
  };

  const handleNext = () => {
    if (viewMode === "Month") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === "Week") {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else if (viewMode === "Day") {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
      setSelectedDayStr(formatDateStr(d));
    }
  };

  const handleModeChange = (mode: CalendarViewMode) => {
    setViewMode(mode);
    if (mode === "Day") {
      const selectedDate = parseDateStr(selectedDayStr);
      setCurrentDate(selectedDate);
    }
  };

  // Filter events based on selected category filter
  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  // Month Grid Calculation
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: Array<{
    dayNumber: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }> = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const prevMonthIdx = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, "0")}-${String(prevDay).padStart(2, "0")}`;
    calendarDays.push({ dayNumber: prevDay, isCurrentMonth: false, dateStr });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarDays.push({ dayNumber: day, isCurrentMonth: true, dateStr });
  }

  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthIdx = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarDays.push({ dayNumber: day, isCurrentMonth: false, dateStr });
  }

  // Week Grid Calculation
  const weekDays = getWeekDays(currentDate);

  const getEventsForDate = (dateStr: string) => {
    return filteredEvents.filter((e) => dateStr >= e.startDate && dateStr <= e.endDate);
  };

  const handleCellClick = (dateStr: string) => {
    setSelectedDayStr(dateStr);
    setCurrentDate(parseDateStr(dateStr));
    if (onSelectDate) {
      onSelectDate(dateStr);
    }
  };

  const getHeaderTitle = () => {
    if (viewMode === "Month") {
      return `${MONTH_NAMES[month]} ${year}`;
    } else if (viewMode === "Week") {
      return formatWeekRangeStr(weekDays);
    } else {
      const selectedDate = parseDateStr(selectedDayStr);
      return `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    }
  };

  return (
    <div className={`bg-white rounded-2xl md:rounded-3xl border border-[#efe6da] shadow-card p-4 sm:p-6 w-full relative ${isLoading ? "opacity-75 transition-opacity" : ""}`}>
      {isLoading && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs text-[#c85a28] font-semibold bg-white/90 px-3 py-1.5 rounded-full border border-[#efe6da] shadow-xs">
          <div className="w-3 h-3 border-2 border-[#c85a28] border-t-transparent rounded-full animate-spin" />
          <span>Loading events...</span>
        </div>
      )}
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-[#efe6da] text-[#6e5c54] hover:bg-[#fcf8f2] hover:text-[#2d1f19] transition-all"
              aria-label="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-[#efe6da] text-[#6e5c54] hover:bg-[#fcf8f2] hover:text-[#2d1f19] transition-all"
              aria-label="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#2d1f19]">
            {getHeaderTitle()}
          </h2>
        </div>

        {/* View Mode Switcher */}
        <div className="inline-flex p-1 bg-[#f7f2ea] rounded-xl border border-[#efe6da] self-start sm:self-auto">
          {(["Month", "Week", "Day"] as CalendarViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleModeChange(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === mode
                  ? "bg-[#c85a28] text-white shadow-sm"
                  : "text-[#6e5c54] hover:text-[#2d1f19]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === "Month" && (
        <>
          {/* Weekday Header Row */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="py-1 text-xs font-semibold text-[#8c7b75] uppercase tracking-wider"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((item) => {
              const dayEvents = getEventsForDate(item.dateStr);
              const isSelected = item.dateStr === selectedDayStr;

              return (
                <div
                  key={item.dateStr}
                  onClick={() => handleCellClick(item.dateStr)}
                  className={`min-h-20 sm:min-h-24 p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    !item.isCurrentMonth
                      ? "bg-[#fcfaf7]/50 text-[#c5b8b1] border-transparent"
                      : isSelected
                        ? "bg-[#fdf6f0] border-[#c85a28] ring-2 ring-[#c85a28]/20 shadow-sm"
                        : "bg-[#faf8f5]/40 hover:bg-white border-[#f3ece2] hover:border-[#e5dcd0] text-[#2d1f19]"
                  }`}
                >
                  {/* Day Number Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        isSelected
                          ? "bg-[#c85a28] text-white font-bold"
                          : item.isCurrentMonth
                            ? "text-[#4a3b34]"
                            : "text-[#c5b8b1]"
                      }`}
                    >
                      {item.dayNumber}
                    </span>

                    {/* Event Dots indicator if multiple */}
                    {dayEvents.length > 0 && (
                      <div className="flex items-center gap-1">
                        {dayEvents.slice(0, 3).map((ev) => {
                          const style = CATEGORY_STYLES[ev.category];
                          return (
                            <span
                              key={ev.id}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: style?.dotColor || "#c85a28" }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Event Badge preview inside cell */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => {
                      const style = CATEGORY_STYLES[ev.category];
                      return (
                        <div
                          key={ev.id}
                          className={`text-[10px] sm:text-[11px] leading-tight px-1.5 py-0.5 rounded-md font-semibold border flex items-center justify-between gap-1 group/badge ${style?.badgeBg || "bg-orange-50"} ${style?.badgeText || "text-orange-800"} ${style?.badgeBorder || "border-orange-200"}`}
                          title={`${ev.title} (${ev.startTime})`}
                        >
                          <span className="truncate flex-1">{ev.title}</span>

                          {/* Hover Pencil/Delete Icons */}
                          <div className="hidden group-hover/badge:flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(ev);
                              }}
                              className="hover:opacity-75 p-0.5"
                              title="Edit event"
                            >
                              <Pencil className="w-2.5 h-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(ev);
                              }}
                              className="hover:opacity-75 p-0.5 text-red-600"
                              title="Delete event"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-[#9c8a82] font-semibold pl-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* WEEK VIEW */}
      {viewMode === "Week" && (
        <div className="overflow-x-auto">
          <div className="min-w-162.5">
            {/* Week Header Row */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0 border-b border-[#efe6da] pb-3 mb-2">
              <div />
              {weekDays.map((d) => {
                const dateStr = formatDateStr(d);
                const isSelected = dateStr === selectedDayStr;
                const dayNum = d.getDate();
                const dayName = WEEKDAYS[d.getDay()];

                return (
                  <div
                    key={dateStr}
                    onClick={() => handleCellClick(dateStr)}
                    className="text-center cursor-pointer group"
                  >
                    <div className="text-[11px] font-semibold text-[#8c7b75] uppercase tracking-wider">
                      {dayName}
                    </div>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-[#c85a28] text-white shadow-sm"
                            : "text-[#2d1f19] group-hover:bg-[#f3ece2]"
                        }`}
                      >
                        {dayNum}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Week Time Grid Body */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0 relative">
              {/* Left Column: Time Slot Labels */}
              <div className="relative">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="flex items-start justify-end pr-2 text-[11px] font-medium text-[#8c7b75] select-none"
                    style={{ height: `${ROW_HEIGHT}px` }}
                  >
                    <span className="-mt-2.5">{formatHourLabel(hour)}</span>
                  </div>
                ))}
              </div>

              {/* 7 Day Grid Columns */}
              <div className="col-span-7 grid grid-cols-7 relative border-l border-[#efe6da]/60">
                {/* Horizontal Hour Lines (background) */}
                <div className="absolute inset-0 pointer-events-none flex flex-col">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="border-b border-[#efe6da]/60 w-full"
                      style={{ height: `${ROW_HEIGHT}px` }}
                    />
                  ))}
                </div>

                {/* Day Columns */}
                {weekDays.map((d) => {
                  const dateStr = formatDateStr(d);
                  const dayEvents = getEventsForDate(dateStr);

                  return (
                    <div
                      key={dateStr}
                      className="relative border-r border-[#efe6da]/40 hover:bg-[#faf8f5]/40 transition-colors"
                      style={{ height: `${HOURS.length * ROW_HEIGHT}px` }}
                      onClick={() => handleCellClick(dateStr)}
                    >
                      {/* Events in day */}
                      {dayEvents.map((ev) => {
                        const style = CATEGORY_STYLES[ev.category];
                        const startMins = parseTimeToMinutes(ev.startTime);
                        let endMins = parseTimeToMinutes(ev.endTime);
                        if (endMins <= startMins) endMins = startMins + 120;

                        const startOffsetMins = Math.max(0, startMins - START_MINUTES);
                        const durationMins = Math.max(30, endMins - startMins);

                        const topPx = (startOffsetMins / 60) * ROW_HEIGHT;
                        const heightPx = Math.max(44, (durationMins / 60) * ROW_HEIGHT);

                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCellClick(dateStr);
                            }}
                            className={`group/card absolute left-1 right-1 p-2 rounded-xl border text-xs overflow-hidden shadow-xs transition-all hover:shadow-md hover:z-20 cursor-pointer flex flex-col justify-between ${style?.badgeBg || "bg-orange-50"} ${style?.badgeText || "text-orange-800"} ${style?.badgeBorder || "border-orange-200"}`}
                            style={{
                              top: `${topPx}px`,
                              height: `${heightPx}px`,
                            }}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-1">
                                <div className="font-bold truncate text-[11px]">
                                  {ev.title}
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0 opacity-100 sm:opacity-0 group-hover/card:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditModal(ev);
                                    }}
                                    className="p-0.5 rounded hover:bg-black/10 transition-colors"
                                    title="Edit event"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeleteModal(ev);
                                    }}
                                    className="p-0.5 rounded hover:bg-red-500/20 text-red-600 transition-colors"
                                    title="Delete event"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="text-[10px] opacity-85 font-medium mt-0.5">
                                {ev.startTime} – {ev.endTime}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === "Day" && (
        <div>
          {(() => {
            const selectedDate = parseDateStr(selectedDayStr);
            const dayNum = selectedDate.getDate();
            const dayName = WEEKDAYS_FULL[selectedDate.getDay()];
            const dayEvents = getEventsForDate(selectedDayStr);

            return (
              <>
                {/* Day Sub-Header */}
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#efe6da]">
                  <span className="w-8 h-8 rounded-full bg-[#c85a28] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    {dayNum}
                  </span>
                  <span className="text-xl font-bold text-[#2d1f19]">
                    {dayName}
                  </span>
                </div>

                {/* Day Time Grid Body */}
                <div className="grid grid-cols-[60px_1fr] gap-0 relative">
                  {/* Left Column: Time Slot Labels */}
                  <div className="relative">
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        className="flex items-start justify-end pr-2 text-[11px] font-medium text-[#8c7b75] select-none"
                        style={{ height: `${ROW_HEIGHT}px` }}
                      >
                        <span className="-mt-2.5">{formatHourLabel(hour)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Single Day Content Column */}
                  <div className="relative border-l border-[#efe6da]/60">
                    {/* Horizontal Hour Lines */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col">
                      {HOURS.map((hour) => (
                        <div
                          key={hour}
                          className="border-b border-[#efe6da]/60 w-full"
                          style={{ height: `${ROW_HEIGHT}px` }}
                        />
                      ))}
                    </div>

                    {/* Day Column Events Container */}
                    <div
                      className="relative w-full"
                      style={{ height: `${HOURS.length * ROW_HEIGHT}px` }}
                    >
                      {dayEvents.length === 0 ? (
                        <div className="absolute top-12 left-4 text-sm text-[#8c7b75] italic">
                          No events scheduled for this day
                        </div>
                      ) : (
                        dayEvents.map((ev) => {
                          const style = CATEGORY_STYLES[ev.category];
                          const startMins = parseTimeToMinutes(ev.startTime);
                          let endMins = parseTimeToMinutes(ev.endTime);
                          if (endMins <= startMins) endMins = startMins + 120;

                          const startOffsetMins = Math.max(0, startMins - START_MINUTES);
                          const durationMins = Math.max(30, endMins - startMins);

                          const topPx = (startOffsetMins / 60) * ROW_HEIGHT;
                          const heightPx = Math.max(64, (durationMins / 60) * ROW_HEIGHT);

                          return (
                            <div
                              key={ev.id}
                              className={`absolute left-2 right-4 p-3 sm:p-4 rounded-xl border shadow-sm transition-all hover:shadow-md ${style?.badgeBg || "bg-orange-50"} ${style?.badgeText || "text-orange-800"} ${style?.badgeBorder || "border-orange-200"}`}
                              style={{
                                top: `${topPx}px`,
                                height: `${heightPx}px`,
                              }}
                            >
                              <div className="flex flex-col h-full justify-between">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                                      <Calendar className="w-4 h-4 shrink-0" />
                                      <span>{ev.title}</span>
                                    </div>
                                    <div className="text-xs sm:text-sm font-medium opacity-90 mt-1 flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>
                                        {ev.startTime} – {ev.endTime}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Edit & Delete Actions */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(ev);
                                      }}
                                      className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-[#6e5c54] hover:text-[#c85a28] border border-[#efe6da] transition-all"
                                      title="Edit event"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(ev);
                                      }}
                                      className="p-1.5 rounded-lg bg-[#fff2f2] hover:bg-[#fee2e2] text-[#ef4444] border border-[#fecaca] transition-all"
                                      title="Delete event"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {ev.location && (
                                  <div className="text-xs font-semibold opacity-90 flex items-center gap-1 mt-2">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    <span>{ev.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
