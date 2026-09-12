import React, { useState } from 'react';
import type { Event } from '../../types/event';
import { X, Calendar as CalendarIcon, MapPin, AlertCircle } from 'lucide-react';

interface DeleteEventModalProps {
  isOpen: boolean;
  event: Event | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  isOpen,
  event,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onConfirm(event.id);
      onClose();
    } catch (err: unknown) {
      console.error('Error deleting event:', err);
      const msg = (err as { message?: string })?.message || 'Failed to delete event';
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, (m || 1) - 1, d || 1);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });
    return `${day} ${monthStr} ${dateObj.getFullYear()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      {/* Modal Container Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-modal border border-[#efe6da] overflow-hidden flex flex-col md:flex-row my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#6e5c54] hover:text-[#2d1f19] shadow-sm transition-all border border-[#efe6da]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Decorative Side Banner */}
        <div className="w-full md:w-2/5 bg-linear-to-b from-[#f9f1e4] via-[#f5e7d3] to-[#ebdcc4] p-6 flex flex-col justify-between items-center text-center relative border-r border-[#eae0d0] shrink-0">
          <div className="w-full pt-4">
            {/* Calendar with Orange X Badge Illustration */}
            <div className="relative inline-block p-4 rounded-2xl bg-white/70 shadow-xs mb-2">
              <div className="w-20 h-20 rounded-2xl bg-[#f7eedf] border border-[#efe6da] flex flex-col items-center justify-center relative">
                <CalendarIcon className="w-10 h-10 text-[#c85a28]" />
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#c85a28] text-white flex items-center justify-center shadow-md font-bold text-xs">
                  ✕
                </div>
              </div>
            </div>
          </div>

          <div className="my-auto space-y-2 max-w-xs py-4">
            <blockquote className="font-serif italic text-xs sm:text-sm text-[#6e564a] leading-relaxed">
              "Great events create lasting memories."
            </blockquote>
            <div className="w-10 h-0.5 bg-[#c85a28]/40 mx-auto rounded-full" />
          </div>

          <div className="text-[10px] text-[#9c8a82] uppercase tracking-wider font-semibold">
            VIVEKANANDA BALAKA SANGHA
          </div>
        </div>

        {/* Right Content Container */}
        <div className="w-full md:w-3/5 p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-[#2d1f19]">
              Delete Event
            </h2>
            <p className="text-xs sm:text-sm text-[#8c7b75]">
              Are you sure you want to delete this event?
            </p>
          </div>

          {deleteError && (
            <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#ef4444]" />
              <span>{deleteError}</span>
            </div>
          )}

          {/* Scoped Event Preview Card */}
          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#efe6da] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#efe6da] flex items-center justify-center shrink-0 shadow-xs text-[#c85a28]">
              <CalendarIcon className="w-5 h-5" />
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <h4 className="text-sm font-bold text-[#2d1f19] truncate">
                {event.title}
              </h4>
              <div className="text-xs text-[#6e5c54] flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#8c7b75]" />
                <span>
                  {formatDateDisplay(event.startDate)} · {event.startTime} – {event.endTime}
                </span>
              </div>
              {event.location && (
                <div className="text-xs text-[#6e5c54] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8c7b75]" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Danger Warning Alert Box */}
          <div className="p-3.5 rounded-2xl bg-[#fff2f2] border border-[#fee2e2] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
            <p className="text-xs text-[#b91c1c] leading-relaxed font-medium">
              This action cannot be undone. The event will be permanently removed from your calendar.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6e5c54] hover:bg-[#f5ede0] border border-[#efe6da] transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#c85a28] text-white hover:bg-[#b44f21] shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting && (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
