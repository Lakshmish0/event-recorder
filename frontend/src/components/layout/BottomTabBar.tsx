import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, LayoutGrid, Image, MoreHorizontal } from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: LayoutGrid },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Gallery', path: '/gallery', icon: Image },
    { name: 'More', path: '/settings', icon: MoreHorizontal },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fcf8f2]/95 backdrop-blur-md border-t border-[#efe6da] px-3 py-2 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'text-[#c85a28] font-semibold'
                  : 'text-[#8c7b75] hover:text-[#2d1f19]'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{tab.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
