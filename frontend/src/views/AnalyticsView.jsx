import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Users, Clock, Zap } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function AnalyticsView() {
  const { darkMode } = useQueue();

  const hourlyTrends = [
    { time: '08:00', arrivals: 15, served: 12, waiting: 8 },
    { time: '09:00', arrivals: 34, served: 28, waiting: 14 },
    { time: '10:00', arrivals: 72, served: 50, waiting: 36 },
    { time: '11:00', arrivals: 95, served: 62, waiting: 69 },
    { time: '12:00', arrivals: 88, served: 64, waiting: 63 },
    { time: '13:00', arrivals: 45, served: 48, waiting: 40 },
    { time: '14:00', arrivals: 60, served: 55, waiting: 45 },
    { time: '15:00', arrivals: 75, served: 58, waiting: 52 },
    { time: '16:00', arrivals: 40, served: 46, waiting: 26 },
    { time: '17:00', arrivals: 20, served: 30, waiting: 10 },
  ];

  const counterComparison = [
    { name: 'Counter 1', totalServed: 184, avgWait: 28, efficiency: 78 },
    { name: 'Counter 2', totalServed: 242, avgWait: 9, efficiency: 94 },
    { name: 'Counter 3', totalServed: 198, avgWait: 19, efficiency: 86 },
    { name: 'Counter 4', totalServed: 270, avgWait: 6, efficiency: 98 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Crowd & Queue Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Historical influx patterns, counter throughput rates, and bottleneck forensics.
        </p>
      </div>

      {/* Analytics KPI mini cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <p className="text-xs font-semibold text-slate-500">Peak Rush Window</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">10:30 AM – 12:00 PM</p>
          <p className="text-[11px] text-rose-500 font-semibold mt-0.5">+140% surge volume</p>
        </div>
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <p className="text-xs font-semibold text-slate-500">Total Processed Today</p>
          <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">894 Citizens</p>
          <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">91.4% satisfaction score</p>
        </div>
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <p className="text-xs font-semibold text-slate-500">Fastest Queue Throughput</p>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">Counter 4 (1.4m)</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Express Fast Track</p>
        </div>
      </div>

      {/* Hourly Influx vs Served Chart */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
          Hourly Influx vs Processed Customers (Today)
        </h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'} />
              <XAxis dataKey="time" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={11} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="arrivals" name="Arrival Influx" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="served" name="Processed / Served" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="waiting" name="Active Queue" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Counter Efficiency Comparison */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
          Counter Efficiency & Average Wait Duration
        </h3>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={counterComparison}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'} />
              <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={11} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="totalServed" name="Total Served Today" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="avgWait" name="Avg Wait Time (min)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
