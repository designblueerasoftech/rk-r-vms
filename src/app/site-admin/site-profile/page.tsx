'use client';

import React, { useState } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Upload, Save, CheckCircle } from 'lucide-react';

const timezones = [
  'Asia/Kolkata (IST, UTC+5:30)',
  'Asia/Dubai (GST, UTC+4)',
  'Asia/Singapore (SGT, UTC+8)',
  'Europe/London (GMT, UTC+0)',
  'America/New_York (EST, UTC-5)',
  'America/Los_Angeles (PST, UTC-8)',
];

const countries = ['India', 'UAE', 'Singapore', 'United Kingdom', 'United States', 'Australia'];

export default function SiteAdminSiteProfilePage() {
  const { siteName } = useRole();
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    siteName: 'Site A – Mumbai HQ',
    siteCode: 'SITE-A-MUM',
    address: '14th Floor, One BKC, Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    country: 'India',
    contactName: 'Reeja Pillai',
    contactEmail: 'reeja.pillai@company.com',
    contactPhone: '+91 98765 43210',
    timezone: 'Asia/Kolkata (IST, UTC+5:30)',
    capacity: '500',
    operatingHours: '08:00 AM – 08:00 PM',
    emergencyContact: '+91 98765 00000',
    notes: 'Primary headquarters. All visitor data is subject to DPDP Act 2023 compliance.',
  });

  const update = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Site Profile</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · Manage site identity and contact information</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all"
          >
            {saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Logo Upload */}
        <div className="bg-white rounded-xl border border-border shadow-card p-5">
          <h2 className="text-[13px] font-bold text-text-primary mb-4">Site Logo</h2>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border bg-surface flex items-center justify-center overflow-hidden shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Site logo preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-3xl">🏢</span>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 px-4 py-2 text-[12px] font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 cursor-pointer transition-all">
                <Upload size={13} />
                Upload Logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </label>
              <p className="text-[11px] text-text-muted mt-1.5">PNG, JPG or SVG · Max 2MB · Recommended 200×200px</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-border shadow-card p-5 space-y-4">
          <h2 className="text-[13px] font-bold text-text-primary">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Site Name</label>
              <input value={form.siteName} onChange={e => update('siteName', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Site Code</label>
              <input value={form.siteCode} onChange={e => update('siteCode', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Timezone</label>
              <select value={form.timezone} onChange={e => update('timezone', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200">
                {timezones.map(tz => <option key={tz}>{tz}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Site Capacity</label>
              <input value={form.capacity} onChange={e => update('capacity', e.target.value)} type="number"
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Operating Hours</label>
              <input value={form.operatingHours} onChange={e => update('operatingHours', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Emergency Contact</label>
              <input value={form.emergencyContact} onChange={e => update('emergencyContact', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-border shadow-card p-5 space-y-4">
          <h2 className="text-[13px] font-bold text-text-primary">Address</h2>
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Street Address</label>
            <input value={form.address} onChange={e => update('address', e.target.value)}
              className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">City</label>
              <input value={form.city} onChange={e => update('city', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">State</label>
              <input value={form.state} onChange={e => update('state', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Pincode</label>
              <input value={form.pincode} onChange={e => update('pincode', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Country</label>
              <select value={form.country} onChange={e => update('country', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200">
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-border shadow-card p-5 space-y-4">
          <h2 className="text-[13px] font-bold text-text-primary">Primary Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Contact Name</label>
              <input value={form.contactName} onChange={e => update('contactName', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Email</label>
              <input value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} type="email"
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Phone</label>
              <input value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-border shadow-card p-5 space-y-3">
          <h2 className="text-[13px] font-bold text-text-primary">Additional Notes</h2>
          <textarea
            value={form.notes}
            onChange={e => update('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 resize-none"
          />
        </div>

        {/* Save Footer */}
        <div className="flex justify-end pb-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all"
          >
            {saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saved ? 'Changes Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </SiteAdminLayout>
  );
}
