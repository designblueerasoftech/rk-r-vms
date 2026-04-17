'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardHeader() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState('');
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    setLastSync('10 Apr 2026, 08:15 IST');
    const h = new Date()?.getHours();
    if (h >= 12 && h < 17) setGreeting('Good afternoon');
    else if (h >= 17) setGreeting('Good evening');
    else setGreeting('Good morning');
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast?.success('Dashboard refreshed', { description: 'All data is up to date.' });
    }, 1400);
  };

  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Sun size={20} className="text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary leading-tight">
            {greeting}, Reeja
          </h1>
          <p className="text-[12px] text-text-muted mt-0.5">
            Friday, 10 Apr 2026 · 08:15 IST · Acme Corp · 5 active sites
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-[11px] text-text-muted hidden sm:block">
          Last sync: 2 mins ago · {lastSync}
        </p>
        <button
          onClick={() => toast?.info('Exporting today\'s visitor report...')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface hover:border-border transition-all duration-150"
        >
          <Download size={13} />
          Export Today
        </button>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface hover:border-border transition-all duration-150"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
    </div>
  );
}