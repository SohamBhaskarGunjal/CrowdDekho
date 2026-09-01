import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function CrowdPredictionChart() {
  const { 
    predictionHorizon, 
    setPredictionHorizon, 
    getPredictionChartData,
    darkMode 
  } = useQueue();

  const fullData = getPredictionChartData();
  
  // Filter data based on horizon selector
  let chartData = fullData.slice(0, 4);
  if (predictionHorizon === 'Next 10 Minutes') chartData = fullData.slice(0, 2);
  else if (predictionHorizon === 'Next 20 Minutes') chartData = fullData.slice(0, 3);
  else if (predictionHorizon === 'Next 30 Minutes') chartData = fullData.slice(0, 4);
  else if (predictionHorizon === 'Next 60 Minutes') chartData = fullData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
          <p className="font-bold text-slate-300">{label}</p>
          <p className="text-blue-400 font-extrabold text-sm mt-1">
            {payload[0].value} Total People
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Model Confidence: 94.2%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
      {/* Header & Filter */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/50 mb-3">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Crowd Prediction <span className="text-xs font-normal text-slate-400">(Total People)</span>
        </h2>

        <div className="relative">
          <select
            value={predictionHorizon}
            onChange={(e) => setPredictionHorizon(e.target.value)}
            className="appearance-none bg-slate-50 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="Next 10 Minutes">Next 10 Minutes</option>
            <option value="Next 20 Minutes">Next 20 Minutes</option>
            <option value="Next 30 Minutes">Next 30 Minutes</option>
            <option value="Next 60 Minutes">Next 60 Minutes</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={darkMode ? '#334155' : '#f1f5f9'} 
            />

            <XAxis 
              dataKey="time" 
              tickLine={false} 
              axisLine={{ stroke: darkMode ? '#334155' : '#e2e8f0' }}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 500 }}
            />

            <YAxis 
              tickLine={false} 
              axisLine={false}
              domain={[0, 'auto']}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#predictedGrad)"
              dot={{ r: 4, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#ffffff', strokeWidth: 2 }}
              label={{
                position: 'top',
                fill: darkMode ? '#e2e8f0' : '#0f172a',
                fontSize: 11,
                fontWeight: 700,
                offset: 8
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Indicator matching mockup */}
      <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-1">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Predicted Crowd
        </span>
      </div>
    </div>
  );
}
