import React, { useState } from 'react';
import { Settings, Server, Sliders, ShieldCheck, CheckCircle2, RefreshCcw, Moon, Sun } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function SettingsView() {
  const { darkMode, setDarkMode, isSimulatingLive, setIsSimulatingLive } = useQueue();
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('smartqueue_api_url') || 'http://localhost:8000');
  const [cvStreamUrl, setCvStreamUrl] = useState('ws://localhost:8001/ws/cv');
  const [highThreshold, setHighThreshold] = useState(15);
  const [maxCapacityLimit, setMaxCapacityLimit] = useState(20);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('smartqueue_api_url', apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          System & Integration Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure backend API bridges, CV camera pipelines, and alert thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Backend & CV Pipeline */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <Server className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Team Integration Endpoints (Member 2 & Member 3)
              </h3>
              <p className="text-[11px] text-slate-400">
                Connect your React UI directly to Python FastAPI backend and OpenCV/YOLO node
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Backend REST API Endpoint (Member 2)
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Endpoints: /api/counters, /api/simulate, /api/predict</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Computer Vision WebSocket (Member 3)
              </label>
              <input
                type="text"
                value={cvStreamUrl}
                onChange={(e) => setCvStreamUrl(e.target.value)}
                placeholder="ws://localhost:8001/ws/cv"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Streams real-time YOLO bounding box coordinates</p>
            </div>
          </div>
        </div>

        {/* Thresholds & Rule Engine */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <Sliders className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Queue Congestion Thresholds
              </h3>
              <p className="text-[11px] text-slate-400">
                Trigger automated alerts when counters exceed configured tolerances
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">High Crowd Trigger (People)</span>
                <span className="text-rose-500">{highThreshold} People</span>
              </div>
              <input
                type="range"
                min="8"
                max="30"
                value={highThreshold}
                onChange={(e) => setHighThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Max Queue Capacity Limit</span>
                <span className="text-blue-500">{maxCapacityLimit} Max</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={maxCapacityLimit}
                onChange={(e) => setMaxCapacityLimit(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Display and Simulator Toggles */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Dark / Light Interface Mode</h4>
              <p className="text-[11px] text-slate-400">Switch color theme across the entire dashboard</p>
            </div>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"
            >
              {darkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              {darkMode ? 'Dark Theme' : 'Light Theme'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Simulated Live Fluctuation Stream</h4>
              <p className="text-[11px] text-slate-400">Generates realistic micro-changes every 7 seconds for live demo</p>
            </div>
            <button
              type="button"
              onClick={() => setIsSimulatingLive(!isSimulatingLive)}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${
                isSimulatingLive ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isSimulatingLive ? 'Enabled (Demo Mode)' : 'Disabled (Static)'}
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Settings Updated!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
