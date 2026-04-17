'use client';

import React from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Settings, Info, Building, Globe, Lock } from 'lucide-react';

export default function SiteAdminSettingsPage() {
  const { siteName, selectedRole } = useRole();

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Settings</h1>
          <p className="text-[12px] text-text-muted mt-0.5">{siteName} · View-only for restricted settings</p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <Info size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-700">
            Retention Policy and API Keys can only be managed by Company Admins. You have view-only access to Company Profile settings.
          </p>
        </div>

        {/* Company Profile (view-only) */}
        <div className="bg-white rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Building size={16} className="text-primary-600" />
            <h2 className="text-[14px] font-semibold text-text-primary">Company Profile</h2>
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface text-text-muted border border-border flex items-center gap-1">
              <Lock size={9} /> View Only
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Company Name', value: 'Acme Corporation' },
              { label: 'Industry', value: 'Technology' },
              { label: 'Country', value: 'India' },
              { label: 'Plan', value: 'Enterprise' },
              { label: 'Assigned Site', value: siteName },
              { label: 'Your Role', value: selectedRole },
            ]?.map(f => (
              <div key={f?.label}>
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">{f?.label}</label>
                <div className="px-3 py-2 bg-surface border border-border rounded-lg text-[13px] text-text-primary">{f?.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Locked sections */}
        {[
          { title: 'Retention Policy', icon: <Globe size={16} />, desc: 'Data retention rules are managed globally by Company Admins.' },
          { title: 'API Keys & Integrations', icon: <Lock size={16} />, desc: 'API key management is restricted to Company Admin access only.' },
        ]?.map(s => (
          <div key={s?.title} className="bg-white rounded-xl border border-border p-5 shadow-card opacity-60">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-text-muted">{s?.icon}</span>
              <h2 className="text-[14px] font-semibold text-text-secondary">{s?.title}</h2>
              <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface text-text-muted border border-border flex items-center gap-1">
                <Lock size={9} /> Company Admin Only
              </span>
            </div>
            <p className="text-[12px] text-text-muted">{s?.desc}</p>
          </div>
        ))}
      </div>
    </SiteAdminLayout>
  );
}
