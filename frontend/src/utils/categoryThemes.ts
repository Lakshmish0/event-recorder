import type { EventCategory } from '../types/event';


export interface CategoryStyle {
  label: EventCategory;
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  iconName: 'GraduationCap' | 'PartyPopper' | 'Tent' | 'Trophy' | 'Star';
}

export const CATEGORY_STYLES: Record<EventCategory, CategoryStyle> = {
  Class: {
    label: 'Class',
    bg: 'bg-[#e0f2fe]',
    text: 'text-[#0284c7]',
    border: 'border-[#bae6fd]',
    badgeBg: 'bg-[#e0f2fe]',
    badgeText: 'text-[#0369a1]',
    badgeBorder: 'border-[#bfe6fe]',
    dotColor: '#0284c7',
    iconName: 'GraduationCap'
  },
  Celebration: {
    label: 'Celebration',
    bg: 'bg-[#fce7f3]',
    text: 'text-[#db2777]',
    border: 'border-[#fbcfe8]',
    badgeBg: 'bg-[#fce7f3]',
    badgeText: 'text-[#be185d]',
    badgeBorder: 'border-[#f9a8d4]',
    dotColor: '#db2777',
    iconName: 'PartyPopper'
  },
  Camp: {
    label: 'Camp',
    bg: 'bg-[#dcfce7]',
    text: 'text-[#15803d]',
    border: 'border-[#bbf7d0]',
    badgeBg: 'bg-[#dcfce7]',
    badgeText: 'text-[#166534]',
    badgeBorder: 'border-[#86efac]',
    dotColor: '#16a34a',
    iconName: 'Tent'
  },
  Competition: {
    label: 'Competition',
    bg: 'bg-[#fef3c7]',
    text: 'text-[#d97706]',
    border: 'border-[#fde68a]',
    badgeBg: 'bg-[#fef3c7]',
    badgeText: 'text-[#b45309]',
    badgeBorder: 'border-[#fcd34d]',
    dotColor: '#d97706',
    iconName: 'Trophy'
  },
  'Special Event': {
    label: 'Special Event',
    bg: 'bg-[#f3e8ff]',
    text: 'text-[#9333ea]',
    border: 'border-[#e9d5ff]',
    badgeBg: 'bg-[#f3e8ff]',
    badgeText: 'text-[#7e22ce]',
    badgeBorder: 'border-[#d8b4fe]',
    dotColor: '#9333ea',
    iconName: 'Star'
  }
};
