import React from 'react';
import { User, Clock, Users, ArrowUpRight } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function CounterOverview() {
  const { counters, setActiveTab, setActiveCameraCounter } = useQueue();

  const getStatusStyles = (status) => {
    switch (status) {
      case 'High':
        return {
          cardBg: 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40',
          badge: 'bg-rose-500 text-white',
          userIcon: 'text-rose-500',
          barColor: 'bg-rose-500',
          barTrack: 'bg-rose-100 dark:bg-rose-950/50',
          textColor: 'text-rose-600 dark:text-rose-400'
        };
      case 'Medium':
        return {
          cardBg: 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40',
          badge: 'bg-amber-500 text-white',
          userIcon: 'text-amber-500',
          barColor: 'bg-amber-500',
          barTrack: 'bg-amber-100 dark:bg-amber-950/50',
          textColor: 'text-amber-600 dark:text-amber-400'
        };
      default: // Low
        return {
          cardBg: 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40',
          badge: 'bg-emerald-500 text-white',
          userIcon: 'text-emerald-500',
          barColor: 'bg-emerald-500',
          barTrack: 'bg-emerald-100 dark:bg-emerald-950/50',
          textColor: 'text-emerald-600 dark:text-emerald-400'
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/50 mb-4">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Counter Overview
        </h2>
        <button
          onClick={() => setActiveTab('Counters')}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition flex items-center gap-1"
        >
          View All
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Counter Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {counters.slice(0, 4).map((c) => {
          const style = getStatusStyles(c.status);

          return (
            <div
              key={c.id}
              onClick={() => setActiveCameraCounter(c.id)}
              className={`rounded-xl p-3.5 border transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between ${style.cardBg}`}
            >
              {/* Card Top: Counter Name + Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {c.name}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide ${style.badge}`}>
                  {c.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="space-y-2.5 my-1">
                {/* Current People */}
                <div className="flex items-center gap-2">
                  <User className={`w-4 h-4 shrink-0 ${style.userIcon}`} />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      {c.currentPeople}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      People
                    </span>
                  </div>
                </div>

                {/* Waiting Time */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {c.waitTime} min
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Est. Wait Time
                    </span>
                  </div>
                </div>

                {/* Predicted 20 min */}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {c.predicted20Min}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Predicted in 20 min
                    </span>
                  </div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="w-full h-1.5 rounded-full overflow-hidden mb-1.5" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${style.barColor}`}
                    style={{ width: `${Math.min(100, c.capacity)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className={style.textColor}>{c.capacity}% Capacity</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
