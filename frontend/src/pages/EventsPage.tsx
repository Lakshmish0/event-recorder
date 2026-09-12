import React, { useState, useEffect } from "react";
import { useEvents } from "../context/EventContext";
import { CATEGORY_STYLES } from "../utils/categoryThemes";
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Pencil,
  Trash2,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export const EventsPage: React.FC = () => {
  const { events, isLoading, error, refreshEvents, openEditModal, openDeleteModal, openAddModal } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all events when navigating to the All Events page
    refreshEvents();
  }, [refreshEvents]);

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.location && e.location.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2d1f19]">
            All Events
          </h1>
          <p className="text-sm text-[#8c7b75]">
            Manage and browse all registered sangha events
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#efe6da] rounded-full focus:outline-none focus:ring-2 focus:ring-[#c85a28]/30 text-[#2d1f19]"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#9c8a82]" />
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#c85a28] text-white hover:bg-[#b44f21] rounded-full shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">Failed to load events</p>
              <p className="text-xs text-[#b91c1c]">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refreshEvents()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#ef4444] text-white hover:bg-[#dc2626] rounded-full transition-all shrink-0 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#efe6da] p-5 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="w-20 h-6 bg-gray-200 rounded-full" />
                <div className="w-16 h-5 bg-gray-200 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-5 bg-gray-200 rounded" />
                <div className="w-full h-3 bg-gray-200 rounded" />
              </div>
              <div className="space-y-2 pt-2 border-t border-[#efe6da]">
                <div className="w-1/2 h-3.5 bg-gray-200 rounded" />
                <div className="w-2/3 h-3.5 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredEvents.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#efe6da] p-8 text-center text-[#8c7b75]">
          No events found.
        </div>
      )}

      {!isLoading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((ev) => {
            const style = CATEGORY_STYLES[ev.category];
            return (
              <div
                key={ev.id}
                className="group relative bg-white rounded-2xl border border-[#efe6da] shadow-card p-5 space-y-4 hover:border-[#c85a28]/40 transition-all duration-200"
              >
                {/* Category & Status Bar with Action Icons */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${style?.badgeBg || "bg-orange-50"} ${style?.badgeText || "text-orange-800"} ${style?.badgeBorder || "border-orange-200"}`}
                  >
                    {ev.category}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openEditModal(ev)}
                        className="p-1.5 rounded-lg bg-[#faf7f2] hover:bg-[#f3ece2] text-[#6e5c54] hover:text-[#c85a28] border border-[#efe6da] transition-all"
                        title="Edit event"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(ev)}
                        className="p-1.5 rounded-lg bg-[#fff2f2] hover:bg-[#fee2e2] text-[#ef4444] border border-[#fecaca] transition-all"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#faf7f2] text-[#8c7b75] border border-[#efe6da]">
                      {ev.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2d1f19] mb-1">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-[#8c7b75] line-clamp-2">
                    {ev.notes || ev.description || "No extra description."}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-[#6e5c54] pt-2 border-t border-[#efe6da]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#c85a28]" />
                    <span>{ev.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#c85a28]" />
                    <span>
                      {ev.startTime} – {ev.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#c85a28]" />
                    <span>{ev.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
