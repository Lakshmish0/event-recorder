import React from 'react';
import type { QuickStats as QuickStatsType } from '../../types/event';
import { Calendar, Users, Star, Trophy } from 'lucide-react';

interface QuickStatsProps {
  stats: QuickStatsType;
  isLoading?: boolean;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats, isLoading = false }) => {
  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      bgColor: 'bg-[#e0f2fe]',
      textColor: 'text-[#0284c7]',
      cardBg: 'bg-[#f0f9ff]/60',
    },
    {
      title: 'This Month',
      value: stats.thisMonth,
      icon: Users,
      bgColor: 'bg-[#dcfce7]',
      textColor: 'text-[#16a34a]',
      cardBg: 'bg-[#f0fdf4]/60',
    },
    {
      title: 'Upcoming',
      value: stats.upcoming,
      icon: Star,
      bgColor: 'bg-[#f3e8ff]',
      textColor: 'text-[#9333ea]',
      cardBg: 'bg-[#faf5ff]/60',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: Trophy,
      bgColor: 'bg-[#fef3c7]',
      textColor: 'text-[#d97706]',
      cardBg: 'bg-[#fffbeb]/60',
    },
  ];

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-[#efe6da] shadow-card p-5 sm:p-6 w-full space-y-4">
      <h3 className="text-base sm:text-lg font-bold text-[#2d1f19]">
        Quick Stats
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-3.5 rounded-2xl border border-[#efe6da] ${card.cardBg} flex flex-col justify-between space-y-3 transition-transform hover:-translate-y-0.5`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.bgColor} ${card.textColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div>
                {isLoading ? (
                  <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                ) : (
                  <div className="text-xl sm:text-2xl font-extrabold text-[#2d1f19]">
                    {card.value}
                  </div>
                )}
                <div className="text-[11px] font-semibold text-[#8c7b75]">
                  {card.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
