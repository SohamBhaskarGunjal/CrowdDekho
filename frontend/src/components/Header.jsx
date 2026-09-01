import React from 'react';
import { ChevronDown, Activity, Tv } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function Header() {
  const { 
    lastUpdated,
    isSimulatingLive,
    setIsSimulatingLive,
    activeTab,
    setActiveTab
  } = useQueue();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Crowd Prediction Dashboard
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            AI v2.4 Live
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time queue monitoring and AI powered predictions
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center flex-wrap gap-3.5">
        {/* Customer Display TV Mode Button */}
        <button
          onClick={() => setActiveTab(activeTab === 'Customer Display' ? 'Dashboard' : 'Customer Display')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'Customer Display'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
          }`}
          title="Open Customer Waiting Display for Bank / Hospital TV Screen"
        >
          <Tv className={`w-3.5 h-3.5 ${activeTab === 'Customer Display' ? 'text-white' : 'text-blue-500'}`} />
          <span>{activeTab === 'Customer Display' ? 'Exit Display' : 'Customer Display'}</span>
        </button>

        {/* Live Simulation Pulse Toggle */}
        <button
          onClick={() => setIsSimulatingLive(!isSimulatingLive)}
          title="Toggle dynamic live stream data generator"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isSimulatingLive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
          }`}
        >
          <Activity className={`w-3.5 h-3.5 ${isSimulatingLive ? 'animate-spin text-emerald-500' : ''}`} />
          {isSimulatingLive ? 'Live Feed On' : 'Feed Paused'}
        </button>



        {/* Date Time display */}
        <div className="hidden lg:flex flex-col text-right px-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {lastUpdated}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            22 May 2025
          </span>
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
            A
          </div>
          <div className="hidden sm:flex items-center gap-1 cursor-pointer">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Admin</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
