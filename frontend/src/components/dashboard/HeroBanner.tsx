import React from "react";
import { Plus } from "lucide-react";

interface HeroBannerProps {
  onAddEventClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onAddEventClick }) => {
  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-card border border-[#efe6da]">
      {/* Background Image with Warm Soft Overlay Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}assets/hero_banner.png')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content Content Container */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6 text-white">
        <div className="max-w-xl space-y-2">
          <div className="inline-block">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#f5d0be] bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
              Vivekananda Balaka Sangha
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
            Yearly Runway
          </h1>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm sm:text-base font-medium text-[#fbebe3] bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-md border border-white/15">
              Sep 2026 – Aug 2027
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-light tracking-wide pt-1">
            Events bring people together, ideas build the future.
          </p>
        </div>

        {/* Add Event Button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onAddEventClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#d96b27] to-[#c85a28] text-white font-semibold text-sm shadow-lg hover:from-[#c85a28] hover:to-[#b44f21] transform hover:-translate-y-0.5 transition-all duration-200 border border-amber-300/30 active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Add Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};
