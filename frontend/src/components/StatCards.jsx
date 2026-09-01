import React from 'react';
import { Users, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function StatCards() {
  const { totalPeople, avgWaitTime, predictedIn20Min, overallCrowdStatus, highCounterCount } = useQueue();

  const cards = [
    {
      title: 'Total People',
      value: totalPeople,
      unit: '',
      subtitle: 'Across all counters',
      icon: Users,
      iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
      valueColor: 'text-slate-900 dark:text-white',
    },
    {
      title: 'Avg. Waiting Time',
      value: `${avgWaitTime}`,
      unit: ' min',
      subtitle: 'Across all counters',
      icon: Clock,
      iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
      valueColor: 'text-slate-900 dark:text-white',
    },
    {
      title: 'Predicted in 20 min',
      value: predictedIn20Min,
      unit: '',
      subtitle: 'Total people',
      icon: TrendingUp,
      iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
      valueColor: 'text-slate-900 dark:text-white',
    },
    {
      title: 'Crowd Status',
      value: overallCrowdStatus,
      unit: '',
      subtitle: `At ${highCounterCount} counters`,
      icon: AlertTriangle,
      iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
      valueColor: overallCrowdStatus === 'High' ? 'text-rose-600 dark:text-rose-400' : overallCrowdStatus === 'Medium' ? 'text-amber-500' : 'text-emerald-500',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4"
          >
            {/* Round Icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${card.iconBg}`}>
              <Icon className="w-7 h-7" />
            </div>

            {/* Metric Content */}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                {card.title}
              </p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${card.valueColor}`}>
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {card.unit}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 truncate">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
