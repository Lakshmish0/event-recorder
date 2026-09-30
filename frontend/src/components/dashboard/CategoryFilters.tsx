import React, { useRef } from 'react';
import type { EventCategory } from '../../types/event';
import { CATEGORY_STYLES } from '../../utils/categoryThemes';
import { LayoutGrid, GraduationCap, PartyPopper, Tent, Trophy, Star, ChevronRight } from 'lucide-react';

interface CategoryFiltersProps {
  selectedCategory: EventCategory | 'All';
  onSelectCategory: (category: EventCategory | 'All') => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

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
        return LayoutGrid;
    }
  };

  const categories: (EventCategory | 'All')[] = [
    'All',
    'Class',
    'Celebration',
    'Camp',
    'Competition',
    'Special Event',
  ];

  return (
    <div className="relative flex items-center gap-2 w-full">
      {/* Scrollable Filter Pills Track */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar py-1 flex items-center gap-2.5 scroll-smooth"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const Icon = getCategoryIcon(cat);

          if (cat === 'All') {
            return (
              <button
                key="All"
                type="button"
                onClick={() => onSelectCategory('All')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#c85a28] text-white border-[#c85a28] shadow-xs'
                    : 'bg-white text-[#6e5c54] border-[#efe6da] hover:bg-[#fcf8f2]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>All</span>
              </button>
            );
          }

          const style = CATEGORY_STYLES[cat];

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border whitespace-nowrap ${
                isSelected
                  ? `${style.bg} ${style.text} ${style.border} ring-2 ring-current/20 shadow-xs font-bold`
                  : `bg-white ${style.text} border-[#efe6da] hover:${style.bg}/40`
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Right Scroll Indicator Button matching reference design */}
      <button
        type="button"
        onClick={handleScrollRight}
        className="shrink-0 p-2 rounded-full bg-white border border-[#efe6da] text-[#6e5c54] hover:text-[#c85a28] hover:bg-[#fcf8f2] shadow-2xs transition-all"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

