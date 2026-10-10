import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Sun, Menu, RefreshCw, Loader2 } from 'lucide-react';
import { useEvents } from '../../context/EventContext';


interface TopHeaderProps {
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onSearch, onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { realtimeStatus, isWakingUp } = useEvents();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const renderStatusBadge = () => {
    if (realtimeStatus === 'Live') {
      return (
        <div
          title="Realtime SSE connected"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline">Live</span>
        </div>
      );
    }

    if (realtimeStatus === 'Reconnecting') {
      return (
        <div
          title="Reconnecting SSE stream..."
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs"
        >
          <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
          <span className="hidden sm:inline">Reconnecting</span>
        </div>
      );
    }

    return (
      <div
        title="Disconnected from SSE stream"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs"
      >
        <span className="h-2 w-2 rounded-full bg-rose-500"></span>
        <span className="hidden sm:inline">Offline</span>
      </div>
    );
  };

  return (
    <header className="flex flex-col gap-2 py-3 px-4 md:px-8 bg-transparent">
      {/* Cold Start Banner */}
      {isWakingUp && (
        <div className="flex items-center justify-between gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-medium shadow-2xs animate-pulse">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
            <span>Waking up server (Render free tier cold start)...</span>
          </div>
          <span className="text-[11px] opacity-75 hidden md:inline">This may take ~30 seconds</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Mobile / Tablet Menu Button & Logo */}
        <div className="flex items-center gap-2.5 lg:hidden">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-white border border-[#efe6da] text-[#6e5c54] hover:text-[#2d1f19] hover:bg-[#fcf8f2] shadow-2xs transition-all"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e07a3c] to-[#c85a28] flex items-center justify-center text-white shadow-xs">
              <Sun className="w-4 h-4" />
            </div>
            <span className="font-bold text-base sm:text-lg text-[#2d1f19] tracking-tight">
              EventRecorder
            </span>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9c8a82]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search events, categories..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white/90 backdrop-blur-xs border border-[#efe6da] rounded-full focus:outline-none focus:ring-2 focus:ring-[#c85a28]/30 focus:border-[#c85a28] text-[#2d1f19] placeholder-[#a3948e] shadow-2xs transition-all"
          />
        </div>

        {/* Header Actions: Realtime Status, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {renderStatusBadge()}

          <button
            type="button"
            className="relative p-2 rounded-full bg-white border border-[#efe6da] text-[#6e5c54] hover:text-[#c85a28] hover:bg-[#fcf8f2] shadow-2xs transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#c85a28] ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-1.5 pl-1 cursor-pointer group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-white">
              LY
            </div>
            <ChevronDown className="w-4 h-4 text-[#8c7b75] group-hover:text-[#2d1f19] transition-colors hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
};


