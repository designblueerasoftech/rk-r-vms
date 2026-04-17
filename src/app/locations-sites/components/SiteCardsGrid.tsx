'use client';

import React, { useState } from 'react';
import {
  Users, MonitorSmartphone, DoorOpen, Settings,
  AlertTriangle, TrendingUp, MapPin, MoreVertical, Edit, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';

// Backend: GET /api/sites
const sites = [
  {
    id: 'site-card-mumbai',
    name: 'Mumbai HQ',
    address: 'Bandra Kurla Complex, Mumbai — 400051',
    timezone: 'IST (UTC+5:30)',
    status: 'normal' as const,
    inside: 44,
    capacity: 312,
    occupancyPct: 14,
    gates: 3,
    kiosks: { total: 4, online: 4 },
    todayVisitors: 87,
    weekAvg: 92,
    trend: 'up' as const,
    alert: null,
  },
  {
    id: 'site-card-bangalore',
    name: 'Bengaluru Tech Park',
    address: 'Outer Ring Road, Marathahalli, Bengaluru — 560037',
    timezone: 'IST (UTC+5:30)',
    status: 'high-wait' as const,
    inside: 34,
    capacity: 189,
    occupancyPct: 18,
    gates: 2,
    kiosks: { total: 3, online: 3 },
    todayVisitors: 56,
    weekAvg: 61,
    trend: 'down' as const,
    alert: 'High wait time at Gate 1 — avg 9 min',
  },
  {
    id: 'site-card-delhi',
    name: 'Delhi NCR Office',
    address: 'Cyber City, DLF Phase 2, Gurugram — 122002',
    timezone: 'IST (UTC+5:30)',
    status: 'normal' as const,
    inside: 19,
    capacity: 94,
    occupancyPct: 20,
    gates: 1,
    kiosks: { total: 2, online: 1 },
    todayVisitors: 34,
    weekAvg: 38,
    trend: 'neutral' as const,
    alert: 'Kiosk SLR-D01 offline since 07:30 AM',
  },
  {
    id: 'site-card-chennai',
    name: 'Chennai Data Centre',
    address: 'TIDEL Park, Rajiv Gandhi Salai, Taramani, Chennai — 600113',
    timezone: 'IST (UTC+5:30)',
    status: 'normal' as const,
    inside: 10,
    capacity: 48,
    occupancyPct: 21,
    gates: 2,
    kiosks: { total: 2, online: 2 },
    todayVisitors: 18,
    weekAvg: 20,
    trend: 'up' as const,
    alert: null,
  },
  {
    id: 'site-card-hyderabad',
    name: 'Hyderabad Campus',
    address: 'HITEC City, Hitech City Rd, Madhapur, Hyderabad — 500081',
    timezone: 'IST (UTC+5:30)',
    status: 'alert' as const,
    inside: 23,
    capacity: 147,
    occupancyPct: 16,
    gates: 3,
    kiosks: { total: 4, online: 0 },
    todayVisitors: 41,
    weekAvg: 35,
    trend: 'up' as const,
    alert: 'All kiosks offline — manual check-in active',
  },
];

const statusBorderMap = {
  normal: 'border-t-success',
  'high-wait': 'border-t-warning',
  alert: 'border-t-danger',
};

export default function SiteCardsGrid() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-[15px] font-bold text-text-primary mb-3">All Sites</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
        {sites.map((site) => {
          const borderColor = statusBorderMap[site.status];
          return (
            <div
              key={site.id}
              className={`bg-white rounded-card card-shadow border border-border border-t-2 ${borderColor} p-5 hover:shadow-card-md transition-all duration-200 relative`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} className="text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-text-primary">{site.name}</p>
                    <p className="text-[11px] text-text-muted leading-snug">{site.address}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{site.timezone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <StatusBadge status={site.status} size="sm" />
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === site.id ? null : site.id)}
                      className="w-7 h-7 rounded-lg hover:bg-surface flex items-center justify-center transition-colors"
                    >
                      <MoreVertical size={14} className="text-text-muted" />
                    </button>
                    {openMenu === site.id && (
                      <div className="absolute right-0 top-8 w-36 bg-white rounded-xl border border-border shadow-dropdown z-10 py-1 fade-in">
                        <button
                          onClick={() => { toast.info(`Edit ${site.name}`); setOpenMenu(null); }}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-text-secondary hover:bg-surface hover:text-text-primary"
                        >
                          <Edit size={12} /> Edit Site
                        </button>
                        <button
                          onClick={() => { toast.info(`Configure gates for ${site.name}`); setOpenMenu(null); }}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-text-secondary hover:bg-surface hover:text-text-primary"
                        >
                          <Settings size={12} /> Configure
                        </button>
                        <div className="h-px bg-border mx-2 my-1" />
                        <button
                          onClick={() => { toast.error(`Delete ${site.name}?`); setOpenMenu(null); }}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-danger-text hover:bg-danger/5"
                        >
                          <Trash2 size={12} /> Delete Site
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Alert */}
              {site.alert && (
                <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-warning/8 border border-warning/20 mb-3">
                  <AlertTriangle size={12} className="text-warning shrink-0 mt-0.5" />
                  <p className="text-[11px] text-warning-text font-medium">{site.alert}</p>
                </div>
              )}

              {/* Occupancy bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-text-muted" />
                    <span className="text-[20px] font-bold tabular-nums text-text-primary">{site.inside}</span>
                    <span className="text-[11px] text-text-muted">inside now</span>
                  </div>
                  <span className="text-[12px] font-semibold text-text-secondary tabular-nums">
                    {site.occupancyPct}% / {site.capacity} cap
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      site.occupancyPct > 80 ? 'bg-danger' : site.occupancyPct > 50 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${site.occupancyPct}%` }}
                  />
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { id: `${site.id}-gates`, icon: <DoorOpen size={13} className="text-text-muted" />, val: site.gates, label: 'Gates' },
                  { id: `${site.id}-kiosks`, icon: <MonitorSmartphone size={13} className={site.kiosks.online < site.kiosks.total ? 'text-warning' : 'text-text-muted'} />, val: `${site.kiosks.online}/${site.kiosks.total}`, label: 'Kiosks' },
                  { id: `${site.id}-today`, icon: <Users size={13} className="text-text-muted" />, val: site.todayVisitors, label: 'Today' },
                  { id: `${site.id}-wavg`, icon: <TrendingUp size={13} className="text-text-muted" />, val: site.weekAvg, label: 'Wk Avg' },
                ].map((stat) => (
                  <div key={stat.id} className="bg-surface rounded-lg p-2 text-center">
                    <div className="flex justify-center mb-0.5">{stat.icon}</div>
                    <p className="text-[13px] font-bold tabular-nums text-text-primary">{stat.val}</p>
                    <p className="text-[9px] text-text-muted font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => toast.info(`Viewing ${site.name} details`)}
                  className="flex-1 py-1.5 text-[12px] font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => toast.info(`Configure gates for ${site.name}`)}
                  className="flex-1 py-1.5 text-[12px] font-semibold text-text-secondary bg-surface hover:bg-slate-100 rounded-lg border border-border transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}