import React, { useState } from 'react';
import { X, Plus, Layers, User, Tag } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function AddCounterModal() {
  const { isAddCounterModalOpen, setIsAddCounterModalOpen, addCounter, counters } = useQueue();
  const [name, setName] = useState(`Counter ${counters.length + 1}`);
  const [category, setCategory] = useState('Document Verification & Fast Track');
  const [staffName, setStaffName] = useState('');

  if (!isAddCounterModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addCounter({
      name: name.trim() || `Counter ${counters.length + 1}`,
      category: category.trim() || 'General Assistance',
      staffName: staffName.trim() || 'Assigned Officer'
    });
    setIsAddCounterModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Open New Counter
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Deploy staff to handle surge crowd
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddCounterModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Counter Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Counter 5"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Service Category
            </label>
            <div className="relative">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Token Billing, Inquiry"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Assigned Staff Officer
            </label>
            <div className="relative">
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g. Officer Vikram Sen"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddCounterModalOpen(false)}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              Open Counter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
