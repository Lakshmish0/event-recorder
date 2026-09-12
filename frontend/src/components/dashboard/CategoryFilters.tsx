import React from 'react';
import type { EventCategory } from '../../types/event';

import { CATEGORY_STYLES } from '../../utils/categoryThemes';
import { LayoutGrid, GraduationCap, PartyPopper, Tent, Trophy, Star } from 'lucide-react';

interface CategoryFiltersProps {
  selectedCategory: EventCategory | 'All';
  onSelectCategory: (category: EventCategory | 'All') => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
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
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2.5 min-w-max">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const Icon = getCategoryIcon(cat);

          if (cat === 'All') {
            return (
              <button
                key="All"
                type="button"
                onClick={() => onSelectCategory('All')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm border ${
                  isSelected
                    ? 'bg-[#c85a28] text-white border-[#c85a28] shadow-md'
                    : 'bg-white text-[#6e5c54] border-[#efe6da] hover:bg-[#fcf8f2]'
                }`}
              >
                <Icon className="w-4 h-4" />
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border ${
                isSelected
                  ? `${style.bg} ${style.text} ${style.border} font-bold ring-2 ring-current/20 shadow-sm`
                  : `bg-white ${style.text} border-[#efe6da] hover:${style.bg}/40`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
