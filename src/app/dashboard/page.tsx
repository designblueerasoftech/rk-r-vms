import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardHeader from './components/DashboardHeader';
import HeroMetrics from './components/HeroMetrics';
import DashboardFilters from './components/DashboardFilters';
import SiteOverviewGrid from './components/SiteOverviewGrid';
import RealTimeHeadcount from './components/RealTimeHeadcount';
import QuickActions from './components/QuickActions';
import VisitorTrendsChart from './components/VisitorTrendsChart';
import SiteOccupancyPanel from './components/SiteOccupancyPanel';
import RecentActivityFeed from './components/RecentActivityFeed';
import ComplianceSnapshot from './components/ComplianceSnapshot';
import SystemHealth from './components/SystemHealth';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <DashboardHeader />
        <HeroMetrics />
        <DashboardFilters />
        <SiteOverviewGrid />
        <RealTimeHeadcount />
        <QuickActions />
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <VisitorTrendsChart />
          </div>
          <div className="xl:col-span-1">
            <SiteOccupancyPanel />
          </div>
        </div>
        <RecentActivityFeed />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pb-4">
          <ComplianceSnapshot />
          <SystemHealth />
        </div>
      </div>
    </AppLayout>
  );
}