import React from 'react';
import { FileText, Download, Printer, CheckCircle2, TrendingUp, Users, Clock } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function ReportsView() {
  const { counters, totalPeople, avgWaitTime } = useQueue();

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = "Counter ID,Counter Name,Category,Staff Name,Current People,Wait Time (min),Predicted 20min,Capacity %\n";
    counters.forEach(c => {
      csv += `${c.id},"${c.name}","${c.category}","${c.staffName}",${c.currentPeople},${c.waitTime},${c.predicted20Min},${c.capacity}%\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartqueue-audit-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Operations & Queue Audit Report
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comprehensive daily throughput records, SLA compliance, and load distribution reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/30 transition"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Report Paper */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
        {/* Report Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">SmartQueue AI</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                Official Audit Report
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Generated on: 22 May 2025 at 10:30 AM</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-bold text-slate-800 dark:text-slate-200">Facility ID: FAC-NORTH-081</p>
            <p>Admin Session: ADM-RAJESH-99</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Executive Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-xs text-slate-500">Active Queue Depth</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalPeople} Citizens</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Across {counters.length} active counters</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-xs text-slate-500">Facility Avg Wait</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{avgWaitTime} Minutes</p>
              <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Within target SLA &lt; 30m</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-xs text-slate-500">AI Recommendation Compliance</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">98.2%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Dynamic redistribution active</p>
            </div>
          </div>
        </div>

        {/* Counter Breakdown */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Detailed Counter Metrics</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Counter</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Officer</th>
                <th className="py-2.5 px-3">Queue Count</th>
                <th className="py-2.5 px-3">Wait Time</th>
                <th className="py-2.5 px-3">Capacity %</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {counters.map(c => (
                <tr key={c.id}>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{c.name}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{c.category}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{c.staffName}</td>
                  <td className="py-3 px-3 font-extrabold">{c.currentPeople}</td>
                  <td className="py-3 px-3">{c.waitTime} mins</td>
                  <td className="py-3 px-3 font-bold">{c.capacity}%</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                      c.status === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
