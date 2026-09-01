import React from 'react';
import { 
  LayoutDashboard, 
  Tv,
  Layers, 
  BarChart3, 
  Compass, 
  Bell, 
  FileText, 
  History, 
  Settings, 
  ShieldCheck, 
  Moon, 
  Sun,
  Radio
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    darkMode, 
    setDarkMode, 
    systemStatus,
    alerts 
  } = useQueue();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Customer Display', icon: Tv, isNew: true },
    { name: 'Counters', icon: Layers },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Predictions', icon: Compass },
    { name: 'Alerts', icon: Bell, badge: alerts.length },
    { name: 'Reports', icon: FileText },
    { name: 'History', icon: History },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#081226] text-slate-300 flex flex-col justify-between shrink-0 select-none min-h-screen border-r border-slate-800 transition-colors duration-200">
      <div>
        {/* Logo Section */}
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              SmartQueue <span className="text-blue-400 font-extrabold">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">Predictive Queue OS</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.isNew && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-bold uppercase tracking-wider ${
                    isActive 
                      ? 'bg-white text-blue-600' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    Live TV
                  </span>
                )}
                {item.badge && item.name === 'Alerts' && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Widgets */}
      <div className="p-4 space-y-3">
        {/* System Status box */}
        <div className="bg-[#0f1d38] border border-slate-800/90 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              System Status
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-4"></span>
            <span>All Systems {systemStatus}</span>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
            {darkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>Dark Mode</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              darkMode ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center pt-1 text-[11px] text-slate-500">
          © 2025 SmartQueue AI
        </div>
      </div>
    </aside>
  );
}
