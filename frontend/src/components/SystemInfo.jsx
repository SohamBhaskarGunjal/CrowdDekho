import React from 'react';
import { useQueue } from '../context/QueueContext';

export default function SystemInfo() {
  const { modelAccuracy, lastUpdated, systemStatus } = useQueue();

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
      <div className="pb-3 border-b border-slate-100 dark:border-slate-700/50 mb-2">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
          System Info
        </h2>
      </div>

      <div className="space-y-3 text-xs">
        {/* Model Accuracy */}
        <div>
          <div className="flex items-center justify-between font-semibold mb-1">
            <span className="text-slate-500 dark:text-slate-400">Model Accuracy</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{modelAccuracy}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${modelAccuracy}%` }}
            />
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Last Updated</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{lastUpdated}</span>
        </div>

        {/* Data Source */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Data Source</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">Camera + System</span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Status</span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            {systemStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
