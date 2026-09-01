import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, Filter, Trash2 } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function AlertsView() {
  const { alerts, setAlerts } = useQueue();
  const [filterLevel, setFilterLevel] = useState('All');

  const filteredAlerts = alerts.filter(a => filterLevel === 'All' || a.level === filterLevel);

  const getAlertIcon = (level) => {
    switch (level) {
      case 'High': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'Medium': return <Info className="w-5 h-5 text-amber-500" />;
      default: return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            System Alerts & Congestion Log
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated threshold violation warnings and status updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {['All', 'High', 'Medium', 'Low'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  filterLevel === lvl
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {alerts.length > 0 && (
            <button
              onClick={clearAlerts}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition"
              title="Clear all alerts"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No active alerts</p>
            <p className="text-xs text-slate-400 mt-0.5">All counters are operating within standard parameters.</p>
          </div>
        ) : (
          filteredAlerts.map(a => (
            <div
              key={a.id}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-start justify-between gap-4 hover:shadow-xs transition"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                  {getAlertIcon(a.level)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {a.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {a.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[11px] font-medium text-slate-400">
                  {a.time}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                  a.level === 'High' 
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' 
                    : a.level === 'Medium' 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' 
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                }`}>
                  {a.level}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
