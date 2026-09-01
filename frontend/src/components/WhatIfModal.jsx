import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, TrendingDown, Layers, Clock, Users, Play } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function WhatIfModal() {
  const { isWhatIfModalOpen, setIsWhatIfModalOpen, counters, addCounter } = useQueue();
  
  const [extraCounters, setExtraCounters] = useState(1);
  const [redirectPercent, setRedirectPercent] = useState(40);
  const [serviceSpeedMultiplier, setServiceSpeedMultiplier] = useState(1.0);
  const [applied, setApplied] = useState(false);

  if (!isWhatIfModalOpen) return null;

  // Base values for Counter 1 (heaviest queue)
  const c1 = counters.find(c => c.id === 1) || { currentPeople: 18, waitTime: 30 };
  const basePeople = c1.currentPeople;
  const baseWait = c1.waitTime;

  // Simulated calculation
  const totalActiveCounters = counters.length + extraCounters;
  const simulatedPeople = Math.max(5, Math.round(basePeople * (1 - (redirectPercent / 100))));
  const simulatedWait = Math.max(4, Math.round((simulatedPeople * 1.6) / serviceSpeedMultiplier));
  const waitReduction = Math.round(((baseWait - simulatedWait) / baseWait) * 100);

  const handleApplyToLive = () => {
    // Add extra counter in state
    if (extraCounters > 0) {
      addCounter({
        name: `Counter ${counters.length + 1} (Overflow)`,
        category: 'Dynamic AI Reliever',
        staffName: 'Automated Overflow Unit'
      });
    }
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setIsWhatIfModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                "What-If" AI Action Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Predict impact before deploying staff or modifying queue flow
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWhatIfModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Action Tuning Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Open Extra Counters */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-500" />
                  Additional Counters to Open
                </label>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  +{extraCounters} Counter
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                value={extraCounters}
                onChange={(e) => setExtraCounters(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>0 (None)</span>
                <span>+1</span>
                <span>+2</span>
                <span>+3 Extra</span>
              </div>
            </div>

            {/* Redirect % of Crowd to idle counters */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-500" />
                  Crowd Load Redistribution
                </label>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {redirectPercent}% Shift
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                step="5"
                value={redirectPercent}
                onChange={(e) => setRedirectPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>0% (Stay)</span>
                <span>25%</span>
                <span>50%</span>
                <span>75% (Max)</span>
              </div>
            </div>
          </div>

          {/* Real-time Predictive Impact Comparison */}
          <div className="bg-gradient-to-r from-blue-50/50 to-emerald-50/50 dark:from-slate-800/60 dark:to-slate-800/60 p-5 rounded-2xl border border-blue-200/60 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Predicted Outcome Comparison
            </h4>

            <div className="grid grid-cols-3 gap-3 text-center">
              {/* Current */}
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <p className="text-[11px] font-semibold text-slate-500">Current (C1)</p>
                <p className="text-2xl font-black text-rose-600 mt-1">{basePeople}</p>
                <p className="text-xs font-bold text-slate-500">{baseWait} min wait</p>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  -{waitReduction}% Time
                </span>
              </div>

              {/* After Simulation */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-700/80">
                <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">Simulated Target</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{simulatedPeople}</p>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{simulatedWait} min wait</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-900/40 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Simulating this action reduces bottleneck at Counter 1 by <strong>{waitReduction}%</strong> and maintains <strong>Counter 2 & 4</strong> within safe operating margins (under 60% capacity).
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setIsWhatIfModalOpen(false)}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleApplyToLive}
            disabled={applied}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
          >
            {applied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Action Dispatched!
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Execute Recommendation in Live System
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
