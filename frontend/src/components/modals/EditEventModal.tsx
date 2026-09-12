import React, { useState, useEffect } from 'react';
import type { EventCategory, Event } from '../../types/event';
import { X, Calendar as CalendarIcon, Clock, MapPin, UploadCloud, Tag, FileText, AlertCircle } from 'lucide-react';

interface EditEventModalProps {
  isOpen: boolean;
  event: Event | null;
  onClose: () => void;
  onSave: (id: string, updatedData: Partial<Event>) => Promise<void>;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  event,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Special Event');
  const [startDate, setStartDate] = useState('2026-09-25');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endDate, setEndDate] = useState('2026-09-25');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [location, setLocation] = useState('Vivekananda Hall');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setCategory(event.category || 'Special Event');
      setStartDate(event.startDate || '2026-09-25');
      setStartTime(event.startTime || '09:00 AM');
      setEndDate(event.endDate || '2026-09-25');
      setEndTime(event.endTime || '05:00 PM');
      setLocation(event.location || '');
      setNotes(event.notes || event.description || '');
      setImageFileName(event.imageUrl ? 'Uploaded Image' : null);
      setFormError(null);
      setFieldErrors({});
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (!title.trim()) {
      setFieldErrors((prev) => ({ ...prev, title: 'Title is required' }));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(event.id, {
        title,
        category,
        startDate,
        endDate,
        startTime,
        endTime,
        location,
        notes,
      });
      onClose();
    } catch (err: unknown) {
      console.error('Error updating event:', err);
      const msg = (err as { message?: string })?.message || 'Failed to update event';
      setFormError(msg);

      const errDetails = (err as { errors?: string[] })?.errors;
      if (Array.isArray(errDetails)) {
        const fields: { [key: string]: string } = {};
        errDetails.forEach((eStr) => {
          const lower = eStr.toLowerCase();
          if (lower.includes('title')) fields.title = eStr;
          if (lower.includes('category')) fields.category = eStr;
          if (lower.includes('start date')) fields.startDate = eStr;
          if (lower.includes('location')) fields.location = eStr;
        });
        setFieldErrors(fields);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      {/* Modal Container Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-none sm:rounded-3xl shadow-modal border border-[#efe6da] overflow-hidden flex flex-col md:flex-row min-h-screen sm:min-h-0 my-auto">
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
        <div className="w-full md:w-2/5 bg-linear-to-b from-[#f9f1e4] via-[#f5e7d3] to-[#ebdcc4] p-6 sm:p-8 flex flex-col justify-between items-center text-center relative border-r border-[#eae0d0] shrink-0">
          <div className="w-full pt-4">
            <div className="inline-block p-2 rounded-2xl bg-white/70 shadow-xs mb-4">
              <img
                src="/assets/temple_illustration.png"
                alt="Temple art"
                className="h-36 sm:h-44 object-contain mx-auto"
              />
            </div>
          </div>

          <div className="my-auto space-y-2 max-w-xs">
            <blockquote className="font-serif italic text-sm sm:text-base text-[#6e564a] leading-relaxed">
              "Great events create lasting memories."
            </blockquote>
            <div className="w-12 h-0.5 bg-[#c85a28]/40 mx-auto rounded-full" />
          </div>

          <div className="text-[11px] text-[#9c8a82] uppercase tracking-wider font-semibold pt-4">
            VIVEKANANDA BALAKA SANGHA
          </div>
        </div>

        {/* Right Form Container */}
        <div className="w-full md:w-3/5 p-6 sm:p-8 space-y-5 overflow-y-auto max-h-[85vh]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2d1f19]">
              Edit Event
            </h2>
            <p className="text-xs sm:text-sm text-[#8c7b75]">
              Update the event details
            </p>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#ef4444]" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-[#4a3b34] uppercase tracking-wider mb-1.5">
                Title <span className="text-[#c85a28]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Special Event"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm bg-[#faf8f5] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c85a28]/30 focus:border-[#c85a28] text-[#2d1f19] ${
                    fieldErrors.title ? 'border-[#ef4444]' : 'border-[#efe6da]'
                  }`}
                />
                <FileText className="absolute left-3 top-3 w-4 h-4 text-[#9c8a82]" />
              </div>
              {fieldErrors.title && (
                <p className="text-[11px] text-[#ef4444] mt-1 font-semibold">{fieldErrors.title}</p>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#4a3b34] uppercase tracking-wider mb-1.5">
                Category <span className="text-[#c85a28]">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className={`w-full px-4 py-2.5 text-sm bg-[#faf8f5] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c85a28]/30 focus:border-[#c85a28] text-[#2d1f19] appearance-none ${
                    fieldErrors.category ? 'border-[#ef4444]' : 'border-[#efe6da]'
                  }`}
                >
                  <option value="Special Event">★ Special Event</option>
                  <option value="Class">🎓 Class</option>
                  <option value="Celebration">🎉 Celebration</option>
                  <option value="Camp">⛺ Camp</option>
                  <option value="Competition">🏆 Competition</option>
                </select>
                <Tag className="absolute right-3.5 top-3 w-4 h-4 text-[#9c8a82] pointer-events-none" />
              </div>
              {fieldErrors.category && (
                <p className="text-[11px] text-[#ef4444] mt-1 font-semibold">{fieldErrors.category}</p>
              )}
            </div>

            {/* Start Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4a3b34] uppercase tracking-wider mb-1.5">
                  Start Date & Time <span className="text-[#c85a28]">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 text-xs bg-[#faf8f5] border border-[#efe6da] rounded-xl text-[#2d1f19]"
                    />
                    <CalendarIcon className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#9c8a82]" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="09:00 AM"
                      className="w-full pl-8 pr-2 py-2 text-xs bg-[#faf8f5] border border-[#efe6da] rounded-xl text-[#2d1f19]"
                    />
                    <Clock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#9c8a82]" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3b34] uppercase tracking-wider mb-1.5">
                  End Date & Time <span className="text-[#c85a28]">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 text-xs bg-[#faf8f5] border border-[#efe6da] rounded-xl text-[#2d1f19]"
                    />
                    <CalendarIcon className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#9c8a82]" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="05:00 PM"
                      className="w-full pl-8 pr-2 py-2 text-xs bg-[#faf8f5] border border-[#efe6da] rounded-xl text-[#2d1f19]"
                    />
                    <Clock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#9c8a82]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-[#4a3b34] uppercase tracking-wider mb-1.5">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Vivekananda Hall"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-[#faf8f5] border border-[#efe6da] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c85a28]/30 focus:border-[#c85a28] text-[#2d1f19]"
                />
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-[#9c8a82]" />
              </div>
            </div>

            {/* Notes / Description */}
            <div>
              <label className="block text-xs font-bold text-[#4a3b34] uppercase tracking-wider mb-1.5">
                Notes / Description
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add event details, agenda, etc..."
                className="w-full px-4 py-2 text-sm bg-[#faf8f5] border border-[#efe6da] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c85a28]/30 focus:border-[#c85a28] text-[#2d1f19] resize-none"
              />
            </div>

            {/* Upload Image Drag and Drop */}
            <div>
              <label className="block text-xs font-bold text-[#4a3b34] uppercase tracking-wider mb-1.5">
                Upload Image <span className="text-normal text-[#9c8a82] font-normal">(optional)</span>
              </label>
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#e2d7c9] hover:border-[#c85a28] rounded-2xl bg-[#faf8f5] hover:bg-[#fefaf6] cursor-pointer transition-colors text-center">
                <UploadCloud className="w-6 h-6 text-[#9c8a82] mb-1" />
                <span className="text-xs font-semibold text-[#6e5c54]">
                  {imageFileName ? (
                    <span className="text-[#c85a28] font-bold">{imageFileName}</span>
                  ) : (
                    <span>
                      <span className="text-[#c85a28] underline">Click to upload</span> or drag and drop
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-[#a3948e] mt-0.5">JPG, PNG (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#efe6da]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6e5c54] hover:bg-[#f5ede0] border border-[#efe6da] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#c85a28] text-white hover:bg-[#b44f21] shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
