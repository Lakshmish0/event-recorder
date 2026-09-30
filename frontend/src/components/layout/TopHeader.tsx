import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Sun, Menu } from 'lucide-react';

interface TopHeaderProps {
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onSearch, onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <header className="flex items-center justify-between gap-3 sm:gap-4 py-3 px-4 md:px-8 bg-transparent">
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

      {/* Header Actions: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
    </header>
  );
};

