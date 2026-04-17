'use client';

import React from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Paintbrush, Upload, Eye, Save } from 'lucide-react';

export default function SiteAdminBrandingPage() {
  const { siteName } = useRole();

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Branding & Appearance</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · Customise your visitor-facing experience</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
              <Eye size={13} /> Preview
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Logo & Colors */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-card space-y-5">
            <h2 className="text-[14px] font-semibold text-text-primary flex items-center gap-2"><Paintbrush size={15} /> Logo & Colors</h2>
            <div>
              <label className="text-[12px] font-medium text-text-secondary block mb-2">Site Logo</label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary-300 transition-colors cursor-pointer">
                <Upload size={20} className="text-text-muted" />
                <p className="text-[12px] text-text-muted">Click to upload or drag & drop</p>
                <p className="text-[11px] text-text-muted">PNG, JPG up to 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ label: 'Primary Color', value: '#405189' }, { label: 'Accent Color', value: '#10B981' }]?.map(c => (
                <div key={c?.label}>
                  <label className="text-[12px] font-medium text-text-secondary block mb-2">{c?.label}</label>
                  <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
                    <div className="w-5 h-5 rounded" style={{ background: c?.value }} />
                    <span className="text-[12px] text-text-primary font-mono">{c?.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kiosk Welcome Screen */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-card space-y-4">
            <h2 className="text-[14px] font-semibold text-text-primary">Kiosk Welcome Screen</h2>
            {[
              { label: 'Welcome Message', value: `Welcome to ${siteName}` },
              { label: 'Sub-heading', value: 'Please check in to proceed' },
              { label: 'Footer Text', value: 'For assistance, contact reception' },
            ]?.map(f => (
              <div key={f?.label}>
                <label className="text-[12px] font-medium text-text-secondary block mb-1.5">{f?.label}</label>
                <input
                  defaultValue={f?.value}
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-surface"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteAdminLayout>
  );
}
