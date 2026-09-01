import React from 'react';
import StatCards from '../components/StatCards';
import LiveCameraFeed from '../components/LiveCameraFeed';
import CounterOverview from '../components/CounterOverview';
import CrowdPredictionChart from '../components/CrowdPredictionChart';
import AIRecommendation from '../components/AIRecommendation';
import RecentAlerts from '../components/RecentAlerts';
import QuickActions from '../components/QuickActions';
import SystemInfo from '../components/SystemInfo';

export default function DashboardView() {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Top KPI Row */}
      <StatCards />

      {/* 2. Middle Row: Live Camera Feed + Counter Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 xl:col-span-5">
          <LiveCameraFeed />
        </div>
        <div className="lg:col-span-6 xl:col-span-7">
          <CounterOverview />
        </div>
      </div>

      {/* 3. Lower Middle Row: Crowd Prediction Chart + AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 xl:col-span-6">
          <CrowdPredictionChart />
        </div>
        <div className="lg:col-span-6 xl:col-span-6">
          <AIRecommendation />
        </div>
      </div>

      {/* 4. Bottom Row: Recent Alerts + Quick Actions + System Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <RecentAlerts />
        <QuickActions />
        <SystemInfo />
      </div>
    </div>
  );
}
