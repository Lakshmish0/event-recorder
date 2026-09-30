import React from "react";
import { Plus } from "lucide-react";

interface HeroBannerProps {
  onAddEventClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onAddEventClick }) => {
  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-card border border-[#efe6da]">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-102"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}assets/hero_banner.png')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white">
        <div className="max-w-xl space-y-2">
          <div className="inline-block">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#f5d0be] bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
              VIVEKANANDA BALAKA SANGHA
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-white drop-shadow-sm">
            Yearly Runway
          </h1>

          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-xs sm:text-sm font-semibold text-[#fbebe3] bg-white/15 backdrop-blur-md px-3 py-0.5 rounded-md border border-white/20">
              Sep 2026 – Aug 2027
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-normal tracking-wide pt-1">
            Events bring people together, ideas build the future.
          </p>
        </div>

        {/* Add Event Button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onAddEventClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#e07a3c] to-[#c85a28] text-white font-bold text-xs sm:text-sm shadow-lg hover:from-[#c85a28] hover:to-[#b44f21] transform hover:-translate-y-0.5 transition-all duration-200 border border-amber-300/30 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};

