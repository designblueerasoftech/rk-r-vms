'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Backend: GET /api/sites/occupancy-summary
const sites = [
  { id: 'occ-mumbai',     name: 'Mumbai HQ',          address: 'Bandra Kurla Complex',  current: 44, capacity: 312, pct: 14, alert: false },
  { id: 'occ-bangalore',  name: 'Bengaluru Tech Park', address: 'Outer Ring Road',       current: 34, capacity: 189, pct: 18, alert: true  },
  { id: 'occ-delhi',      name: 'Delhi NCR Office',    address: 'Cyber City, Gurugram',  current: 19, capacity: 94,  pct: 20, alert: false },
  { id: 'occ-chennai',    name: 'Chennai Data Centre', address: 'TIDEL Park, Taramani',  current: 10, capacity: 48,  pct: 21, alert: false },
  { id: 'occ-hyderabad',  name: 'Hyderabad Campus',    address: 'HITEC City, Madhapur',  current: 23, capacity: 147, pct: 16, alert: true  },
];

const totalCurrent = sites?.reduce((a, s) => a + s?.current, 0);
const totalCapacity = sites?.reduce((a, s) => a + s?.capacity, 0);

export default function SiteOccupancyPanel() {
  return (
    <div className="bg-white rounded-card card-shadow border border-border p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[15px] font-bold text-text-primary">Site Occupancy</h2>
        <Link href="/locations-sites">
          <button className="flex items-center gap-0.5 text-[12px] font-semibold text-primary-600 hover:text-primary-700">
            All Sites <ChevronRight size={13} />
          </button>
        </Link>
      </div>
      <p className="text-[12px] text-text-muted mb-4">
        {totalCurrent} / {totalCapacity} total capacity
      </p>
      <div className="space-y-3 flex-1">
        {sites?.map((site) => (
          <div key={site?.id}>
            <div className="flex items-center justify-between mb-1">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[12px] font-semibold text-text-primary truncate">{site?.name}</p>
                  {site?.alert && (
                    <span className="shrink-0 text-[9px] font-bold text-warning-text bg-warning/10 px-1.5 py-0.5 rounded-full border border-warning/20">
                      HIGH
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-text-muted truncate">{site?.address}</p>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="text-[14px] font-bold tabular-nums text-text-primary">{site?.current}</span>
                <span className="text-[11px] text-text-muted"> / {site?.capacity}</span>
              </div>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  site?.pct > 80 ? 'bg-danger' : site?.pct > 50 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${site?.pct}%` }}
              />
            </div>
            <p className="text-[10px] text-text-muted mt-0.5">{site?.pct}% capacity</p>
          </div>
        ))}
      </div>
    </div>
  );
}