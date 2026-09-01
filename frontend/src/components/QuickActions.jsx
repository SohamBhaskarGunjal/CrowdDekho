import React from 'react';
import { PlusCircle, FileSpreadsheet, Download, Settings, Layers } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function QuickActions() {
  const { setIsAddCounterModalOpen, setActiveTab, counters, totalPeople, avgWaitTime } = useQueue();

  const handleDownloadData = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      summary: {
        totalPeople,
        avgWaitTime,
        activeCounters: counters.length
      },
      counters: counters
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartqueue-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actions = [
    {
      title: 'Add Counter',
      icon: Layers,
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/60',
      onClick: () => setIsAddCounterModalOpen(true)
    },
    {
      title: 'View Reports',
      icon: FileSpreadsheet,
      color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/60',
      onClick: () => setActiveTab('Reports')
    },
    {
      title: 'Download Data',
      icon: Download,
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/60',
      onClick: handleDownloadData
    },
    {
      title: 'Settings',
      icon: Settings,
      color: 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      onClick: () => setActiveTab('Settings')
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
      <div className="pb-3 border-b border-slate-100 dark:border-slate-700/50 mb-3">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={act.onClick}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 shadow-xs ${act.color}`}
            >
              <Icon className="w-6 h-6 mb-1.5" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 text-center leading-tight">
                {act.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
