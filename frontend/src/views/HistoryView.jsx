import React, { useState } from 'react';
import { History, Calendar, Clock, Filter, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function HistoryView() {
  const [selectedRange, setSelectedRange] = useState('Today');

  const historyLogs = [
    {
      id: 1,
      time: '10:15 AM',
      date: '22 May 2025',
      event: 'Counter 1 Surge Alert Triggered',
      details: 'Queue climbed to 18 people (>90% capacity). Predicted 30 in 20 min.',
      type: 'alert',
      badge: 'High'
    },
    {
      id: 2,
      time: '09:45 AM',
      date: '22 May 2025',
      event: 'AI Recommendation Dispatched',
      details: 'Advised opening overflow counter or shifting 40% flow to Counter 2.',
      type: 'action',
      badge: 'Action'
    },
    {
      id: 3,
      time: '09:00 AM',
      date: '22 May 2025',
      event: 'Morning Shift Initialization',
      details: '4 Counters deployed. Initial queue depth: 14 citizens. Baseline avg wait: 12m.',
      type: 'system',
      badge: 'System'
    },
    {
      id: 4,
      time: '04:30 PM',
      date: '21 May 2025',
      event: 'Daily Shift Closed (Yesterday)',
      details: 'Processed 1,120 citizens total. Peak wait recorded: 34 mins at 11:20 AM.',
      type: 'system',
      badge: 'Audit'
    },
    {
      id: 5,
      time: '02:10 PM',
      date: '21 May 2025',
      event: 'Counter 3 Temporary Offline',
      details: 'Staff rotation change. Queue automatically rebalanced to Counter 1 & 2.',
      type: 'alert',
      badge: 'Medium'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Historical Events & Audit Log
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chronological audit of crowd surges, AI recommendation executions, and counter activations.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          {['Today', 'Yesterday', 'Past 7 Days'].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRange(r)}
              className={`px-3 py-1 font-bold rounded-lg transition ${
                selectedRange === r ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="relative border-l border-slate-200 dark:border-slate-700 ml-4 space-y-8 py-2">
          {historyLogs.map(log => (
            <div key={log.id} className="relative pl-6">
              {/* Dot */}
              <div className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 shadow-sm" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {log.event}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    log.badge === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                    log.badge === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                  }`}>
                    {log.badge}
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {log.date} • {log.time}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {log.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
