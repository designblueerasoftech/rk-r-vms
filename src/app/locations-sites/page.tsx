import React from 'react';
import AppLayout from '@/components/AppLayout';
import LocationsHeader from './components/LocationsHeader';
import LocationsSummaryBar from './components/LocationsSummaryBar';
import SiteCardsGrid from './components/SiteCardsGrid';
import SitesTable from './components/SitesTable';

export default function LocationsSitesPage() {
  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <LocationsHeader />
        <LocationsSummaryBar />
        <SiteCardsGrid />
        <SitesTable />
      </div>
    </AppLayout>
  );
}