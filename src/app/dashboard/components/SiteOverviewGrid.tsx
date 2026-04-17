'use client';

import React from 'react';
import { Users, MonitorSmartphone, ChevronRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';

const sites = [
  {
    id: 'site-mumbai',
    name: 'Mumbai HQ',
    address: 'Bandra Kurla Complex',
    status: 'normal' as const,
    inside: 18,
    capacity: 80,
    occupancyPct: 23,
    kiosks: { total: 3, online: 3 },
    waiting: 3,
    preReg: 12,
    expected: 24,
  },
  {
    id: 'site-bangalore',
    name: 'Bengaluru T...',
    address: 'Outer Ring Road',
    status: 'high-wait' as const,
    inside: 11,
    capacity: 94,
    occupancyPct: 12,
    kiosks: { total: 2, online: 2 },
    waiting: 7,
    preReg: 8,
    expected: 18,
  },
  {
    id: 'site-delhi',
    name: 'Delhi NCR Office',
    address: 'Cyber City, Gurugram',
    status: 'normal' as const,
    inside: 9,
    capacity: 44,
    occupancyPct: 21,
    kiosks: { total: 1, online: 1 },
    waiting: 1,
    preReg: 5,
    expected: 11,
    kioskAlert: true,
  },
  {
    id: 'site-chennai',
    name: 'Chennai Data...',
    address: 'TIDEL Park, Taramani',
    status: 'normal' as const,
    inside: 6,
    capacity: 25,
    occupancyPct: 34,
    kiosks: { total: 1, online: 1 },
    waiting: 0,
    preReg: 3,
    expected: 7,
  },
  {
    id: 'site-hyderabad',
    name: 'Hyderabad Cam...',
    address: 'HITEC City, Madhapur',
    status: 'alert' as const,
    inside: 3,
    capacity: 36,
    occupancyPct: 10,
    kiosks: { total: 2, online: 0 },
    waiting: 4,
    preReg: 2,
    expected: 6,
    kioskAlert: true,
  },
];

const statusBorderMap = {
  normal: 'border-t-success',
  'high-wait': 'border-t-warning',
  alert: 'border-t-danger',
};

export default function SiteOverviewGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-[15px] font-bold text-text-primary">Site-wise Overview</h2>
          <p className="text-[12px] text-text-muted">Real-time headcount across all active locations</p>
        </div>
        <Link href="/locations-sites">
          <button className="flex items-center gap-1 text-[12px] font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            View All Sites <ChevronRight size={13} />
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-3">
        {sites.map((site) => {
          const borderColor = statusBorderMap[site.status];
          return (
            <div
              key={site.id}
              className={`bg-white rounded-card card-shadow border border-border border-t-2 ${borderColor} p-4 hover:shadow-card-md transition-shadow duration-200 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-text-primary truncate">{site.name}</p>
                  <p className="text-[11px] text-text-muted truncate">{site.address}</p>
                </div>
                <StatusBadge status={site.status} size="sm" />
              </div>

              {/* Inside count */}
              <div className="flex items-center gap-1.5 mb-2">
                <Users size={14} className="text-text-muted" />
                <span className="text-2xl font-bold tabular-nums text-text-primary">{site.inside}</span>
                <span className="text-[11px] text-text-muted">inside now</span>
              </div>

              {/* Occupancy bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-text-muted mb-1">
                  <span>Occupancy</span>
                  <span className="font-semibold text-text-secondary">{site.occupancyPct}% of {site.capacity}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      site.occupancyPct > 80 ? 'bg-danger' : site.occupancyPct > 50 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${site.occupancyPct}%` }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-1 mb-3">
                {[
                  { label: 'Waiting', val: site.waiting },
                  { label: 'Pre-Reg', val: site.preReg },
                  { label: 'Expected', val: site.expected },
                ].map((s) => (
                  <div key={`${site.id}-${s.label}`} className="text-center bg-surface rounded-lg py-1.5">
                    <p className="text-[14px] font-bold tabular-nums text-text-primary">{s.val}</p>
                    <p className="text-[9px] text-text-muted font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Kiosks */}
              <div className="flex items-center gap-1.5">
                <MonitorSmartphone size={12} className="text-text-muted" />
                <span className="text-[11px] text-text-muted">Kiosks</span>
                <span className={`ml-auto text-[11px] font-bold ${site.kiosks.online === 0 ? 'text-danger-text' : site.kiosks.online < site.kiosks.total ? 'text-warning-text' : 'text-success-text'}`}>
                  {site.kiosks.online}/{site.kiosks.total} online
                </span>
                {site.kioskAlert && <AlertTriangle size={11} className="text-warning" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}