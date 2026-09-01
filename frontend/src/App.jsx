import React from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './views/DashboardView';
import CountersView from './views/CountersView';
import AnalyticsView from './views/AnalyticsView';
import PredictionsView from './views/PredictionsView';
import AlertsView from './views/AlertsView';
import ReportsView from './views/ReportsView';
import HistoryView from './views/HistoryView';
import SettingsView from './views/SettingsView';
import CustomerDisplayView from './views/CustomerDisplayView';
import WhatIfModal from './components/WhatIfModal';
import AddCounterModal from './components/AddCounterModal';

function MainLayout() {
  const { activeTab } = useQueue();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Customer Display':
        return <CustomerDisplayView />;
      case 'Counters':
        return <CountersView />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Predictions':
        return <PredictionsView />;
      case 'Alerts':
        return <AlertsView />;
      case 'Reports':
        return <ReportsView />;
      case 'History':
        return <HistoryView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  if (activeTab === 'Customer Display') {
    return (
      <div className="min-h-screen bg-[#070e1e] text-white">
        <CustomerDisplayView />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FA] dark:bg-[#070D19] transition-colors duration-200">
      {/* Fixed/Sticky Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          <Header />
          {renderActiveView()}
        </div>
      </main>

      {/* Interactive Modals */}
      <WhatIfModal />
      <AddCounterModal />
    </div>
  );
}

export default function App() {
  return (
    <QueueProvider>
      <MainLayout />
    </QueueProvider>
  );
}
