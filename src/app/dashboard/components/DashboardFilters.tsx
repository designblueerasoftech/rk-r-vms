'use client';

import React, { useState } from 'react';
import { Filter } from 'lucide-react';

const timeFilters = [
  { id: 'tf-today', label: 'Today' },
  { id: 'tf-7d', label: '7 Days' },
  { id: 'tf-30d', label: '30 Days' },
  { id: 'tf-custom', label: 'Custom' },
];

const siteFilters = [
  { id: 'sf-all', label: 'All Sites' },
  { id: 'sf-mumbai', label: 'Mumbai HQ' },
  { id: 'sf-bangalore', label: 'Bengaluru Tech' },
  { id: 'sf-delhi', label: 'Delhi NCR' },
  { id: 'sf-chennai', label: 'Chennai DC' },
  { id: 'sf-hyderabad', label: 'Hyderabad' },
];

export default function DashboardFilters() {
  const [activeTime, setActiveTime] = useState('tf-today');
  const [activeSite, setActiveSite] = useState('sf-all');

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
          <Filter size={13} />
          <span className="font-medium">Filters</span>
        </div>
        <div className="flex items-center bg-white border border-border rounded-lg p-0.5 gap-0.5">
          {timeFilters?.map((f) => (
            <button
              key={f?.id}
              onClick={() => setActiveTime(f?.id)}
              className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all duration-150 ${
                activeTime === f?.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              {f?.label}
            </button>
          ))}
        </div>
        <div className="flex items-center bg-white border border-border rounded-lg p-0.5 gap-0.5">
          {siteFilters?.map((f) => (
            <button
              key={f?.id}
              onClick={() => setActiveSite(f?.id)}
              className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all duration-150 ${
                activeSite === f?.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              {f?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="text-[11px] text-text-muted">
        Last sync: 2 mins ago · <span className="font-medium text-text-secondary">10 Apr 2026, 08:15 IST</span>
      </div>
    </div>
  );
}