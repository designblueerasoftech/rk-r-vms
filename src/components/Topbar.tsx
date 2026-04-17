'use client';

import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Wifi } from 'lucide-react';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [searchVal, setSearchVal] = useState('');

  return (
    <header
      className="h-14 flex items-center gap-4 px-6 shrink-0 bg-white"
      style={{ boxShadow: '0 1px 0 #E2E8F0, 0 2px 8px rgba(0,0,0,0.04)' }}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search visitors, sites, workflows..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 placeholder:text-text-muted transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted bg-surface border border-border rounded px-1 py-0.5">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Live sync indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-success/10 border border-success/20">
          <div className="w-1.5 h-1.5 rounded-full bg-success status-dot-pulse" />
          <span className="text-[11px] font-semibold text-success-text">Live</span>
        </div>

        {/* Preview */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface hover:border-border/80 transition-all duration-150">
          <Wifi size={13} />
          Preview
        </button>

        {/* Publish */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm">
          Publish All
        </button>

        {/* Bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface border border-transparent hover:border-border transition-all duration-150">
          <Bell size={16} className="text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-white" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border ml-1 cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-[11px] font-bold">
            RP
          </div>
          <div className="hidden sm:block">
            <p className="text-[12px] font-semibold text-text-primary leading-tight">Reeja Pillai</p>
            <p className="text-[10px] text-text-muted leading-tight">Acme Corp</p>
          </div>
          <ChevronDown size={12} className="text-text-muted group-hover:text-text-secondary transition-colors" />
        </div>
      </div>
    </header>
  );
}