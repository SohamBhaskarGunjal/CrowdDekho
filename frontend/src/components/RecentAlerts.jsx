import React from 'react';
import { useQueue } from '../context/QueueContext';

export default function RecentAlerts() {
  const { alerts, setActiveTab } = useQueue();

  const getAlertBadge = (level) => {
    switch (level) {
      case 'High':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900';
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900';
    }
  };

  const getDotColor = (level) => {
    switch (level) {
      case 'High': return 'bg-rose-500';
      case 'Medium': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/50 mb-2">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Recent Alerts
        </h2>
        <button
          onClick={() => setActiveTab('Alerts')}
          className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition"
        >
          History
        </button>
      </div>

      <div className="space-y-2.5">
        {alerts.slice(0, 3).map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDotColor(a.level)}`} />
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {a.title}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                {a.time}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${getAlertBadge(a.level)}`}>
                {a.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
