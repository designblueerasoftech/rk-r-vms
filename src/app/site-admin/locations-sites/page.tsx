'use client';

import React from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { MapPin, Info, Building, Users, Monitor } from 'lucide-react';

export default function SiteAdminLocationsSitesPage() {
  const { siteName, selectedRole } = useRole();

  const siteData = {
    name: siteName,
    address: selectedRole === 'Site A Admin' ? '14th Floor, Bandra Kurla Complex, Mumbai – 400051' : '3rd Floor, Prestige Tech Park, Bangalore – 560103',
    capacity: selectedRole === 'Site A Admin' ? 250 : 180,
    currentOccupancy: selectedRole === 'Site A Admin' ? 47 : 32,
    kiosks: selectedRole === 'Site A Admin' ? 3 : 2,
    zones: selectedRole === 'Site A Admin' ? ['Lobby', 'Floor 14 – East Wing', 'Floor 14 – West Wing', 'Terrace'] : ['Reception', 'Open Office', 'Conference Zone'],
  };

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Locations & Sites</h1>
          <p className="text-[12px] text-text-muted mt-0.5">{siteName} · View-only access</p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <Info size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-700">
            As a Site Admin, you can view your assigned site details. To add, edit, or delete sites, please contact your Company Admin.
          </p>
        </div>

        {/* Site Card */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <Building size={22} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-text-primary">{siteData?.name}</h2>
              <p className="text-[12px] text-text-muted mt-0.5 flex items-center gap-1"><MapPin size={11} /> {siteData?.address}</p>
            </div>
            <span className="ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700">Active</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: 'Capacity', value: siteData?.capacity, icon: <Building size={15} className="text-blue-500" /> },
              { label: 'Current Occupancy', value: siteData?.currentOccupancy, icon: <Users size={15} className="text-green-500" /> },
              { label: 'Kiosks', value: siteData?.kiosks, icon: <Monitor size={15} className="text-purple-500" /> },
            ]?.map(s => (
              <div key={s?.label} className="p-4 rounded-xl bg-surface border border-border text-center">
                <div className="flex justify-center mb-2">{s?.icon}</div>
                <p className="text-xl font-bold text-text-primary">{s?.value}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{s?.label}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-[13px] font-semibold text-text-primary mb-3">Zones / Areas</h3>
            <div className="flex flex-wrap gap-2">
              {siteData?.zones?.map(z => (
                <span key={z} className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-surface border border-border text-text-secondary">
                  {z}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteAdminLayout>
  );
}
