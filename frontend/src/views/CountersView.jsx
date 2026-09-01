import React from 'react';
import { Layers, Plus, User, Clock, Users, Trash2, ArrowUpRight, Activity } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function CountersView() {
  const { counters, setIsAddCounterModalOpen, removeCounter, setActiveCameraCounter, setActiveTab } = useQueue();

  const getStatusColor = (status) => {
    switch (status) {
      case 'High': return 'bg-rose-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Counter Management & Real-Time Queues
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor load, allocate officers, and dynamically balance queue congestion.
          </p>
        </div>

        <button
          onClick={() => setIsAddCounterModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 transition w-fit"
        >
          <Plus className="w-4 h-4" />
          Deploy New Counter
        </button>
      </div>

      {/* Counter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {counters.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Top */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    C{c.id}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{c.category}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${getStatusColor(c.status)}`}>
                  {c.status}
                </span>
              </div>

              {/* Staff and Service details */}
              <div className="mt-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 font-medium">Assigned Officer:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{c.staffName || 'Officer In-Charge'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 font-medium">Avg Service Speed:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{c.serviceRate} min / person</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Waiting</p>
                  <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{c.currentPeople}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Wait Time</p>
                  <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{c.waitTime}m</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">20m Forecast</p>
                  <p className="text-base font-black text-blue-600 dark:text-blue-400 mt-0.5">{c.predicted20Min}</p>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Queue Capacity</span>
                  <span className={c.status === 'High' ? 'text-rose-500' : c.status === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}>
                    {c.capacity}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      c.status === 'High' ? 'bg-rose-500' : c.status === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, c.capacity)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/50">
              <button
                onClick={() => {
                  setActiveCameraCounter(c.id);
                  setActiveTab('Dashboard');
                }}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Activity className="w-3.5 h-3.5" />
                View Camera Feed
              </button>

              {counters.length > 2 && (
                <button
                  onClick={() => removeCounter(c.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Close Counter"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
