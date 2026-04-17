'use client';

import React, { useState } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Monitor, Plus, Wifi, WifiOff, Settings, RefreshCw } from 'lucide-react';

const kiosks = [
  { id: 1, name: 'Lobby Kiosk 1', model: 'VMSPro K3', ip: '192.168.1.101', status: 'online', uptime: '99.8%', lastSeen: '1 min ago', checkins: 47 },
  { id: 2, name: 'Gate B Kiosk', model: 'VMSPro K2', ip: '192.168.1.102', status: 'online', uptime: '98.2%', lastSeen: '3 min ago', checkins: 23 },
  { id: 3, name: 'Reception Kiosk', model: 'VMSPro K3', ip: '192.168.1.103', status: 'warning', uptime: '94.1%', lastSeen: '12 min ago', checkins: 13 },
];

export default function SiteAdminKiosksPage() {
  const { siteName } = useRole();

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Kiosks & Hardware</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · {kiosks?.length} kiosks</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
            <Plus size={15} /> Add Kiosk
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kiosks?.map((k) => (
            <div key={k?.id} className="bg-white rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center">
                  <Monitor size={18} className={k?.status === 'online' ? 'text-green-500' : 'text-amber-500'} />
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${k?.status === 'online' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {k?.status === 'online' ? <Wifi size={9} /> : <WifiOff size={9} />}
                  {k?.status === 'online' ? 'Online' : 'Warning'}
                </span>
              </div>
              <h3 className="text-[14px] font-semibold text-text-primary">{k?.name}</h3>
              <p className="text-[11px] text-text-muted mt-0.5">{k?.model} · {k?.ip}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Uptime', value: k?.uptime },
                  { label: 'Last Seen', value: k?.lastSeen },
                  { label: 'Check-ins', value: k?.checkins },
                ]?.map(s => (
                  <div key={s?.label} className="p-2 rounded-lg bg-surface">
                    <p className="text-[12px] font-bold text-text-primary">{s?.value}</p>
                    <p className="text-[10px] text-text-muted">{s?.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium text-text-secondary border border-border px-3 py-1.5 rounded-lg hover:bg-surface transition-all">
                  <Settings size={12} /> Configure
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium text-text-secondary border border-border px-3 py-1.5 rounded-lg hover:bg-surface transition-all">
                  <RefreshCw size={12} /> Restart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteAdminLayout>
  );
}
