import React from 'react';
import { Lightbulb, ArrowRight, Play, Sparkles } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function AIRecommendation() {
  const { setIsWhatIfModalOpen, setActiveTab } = useQueue();

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 mb-1">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          AI Recommendation
        </h2>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          Smart Suggestion
        </span>
      </div>

      {/* Main Alert Card Box */}
      <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/90 dark:border-rose-900/40 rounded-xl p-4 my-2">
        <div className="flex items-start gap-3.5">
          {/* Glowing Lightbulb */}
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400 shadow-inner">
            <Lightbulb className="w-6 h-6 animate-pulse" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-extrabold text-rose-600 dark:text-rose-400 leading-snug">
              Open an additional counter at Counter 1
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              High crowd expected in next 20 minutes.
            </p>
          </div>
        </div>

        {/* 3 Comparison Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3.5 pt-3 border-t border-rose-200/60 dark:border-rose-900/30">
          {/* Current Situation */}
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Current Situation
            </p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              18 people
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              30 min wait
            </p>
          </div>

          {/* Predicted 20 min */}
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2.5 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Predicted (20 min)
            </p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              30 people
            </p>
            <p className="text-[11px] font-medium text-rose-500">
              ~45 min wait
            </p>
          </div>

          {/* After Action */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-2.5 border border-emerald-300 dark:border-emerald-700">
            <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              After Action
            </p>
            <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              18-20 people
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              ~15-18 min wait
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setIsWhatIfModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Simulate Action
        </button>

        <button
          onClick={() => setActiveTab('Predictions')}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition flex items-center gap-1"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
