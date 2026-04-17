'use client';

import React, { useState } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Plus, Search, AlertTriangle, Info } from 'lucide-react';

const watchlistEntries = [
  { id: 1, name: 'John Doe', reason: 'Trespassing', addedBy: 'Site Admin', date: '12 Apr 2026', severity: 'high' },
  { id: 2, name: 'Unknown Person', reason: 'Suspicious behaviour', addedBy: 'Security', date: '10 Apr 2026', severity: 'medium' },
  { id: 3, name: 'Vendor XYZ Rep', reason: 'Contract violation', addedBy: 'Site Admin', date: '8 Apr 2026', severity: 'low' },
];

export default function SiteAdminBlacklistPage() {
  const { siteName } = useRole();
  const [search, setSearch] = useState('');

  const filtered = watchlistEntries?.filter(e => e?.name?.toLowerCase()?.includes(search?.toLowerCase()));

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Blacklist & Watchlists</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · Site-specific watchlist only</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
            <Plus size={15} /> Add to Watchlist
          </button>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[12px] text-blue-700">
            You are viewing the <strong>{siteName}</strong> watchlist only. The Global Blacklist is managed by Company Admins and is not accessible from this view.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={e => setSearch(e?.target?.value)}
                placeholder="Search watchlist..."
                className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                {['Name', 'Reason', 'Severity', 'Added By', 'Date']?.map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered?.map((e) => (
                <tr key={e?.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={13} className="text-red-500" />
                      <span className="text-[13px] font-semibold text-text-primary">{e?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary">{e?.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${e?.severity === 'high' ? 'bg-red-50 text-red-700' : e?.severity === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                      {e?.severity?.charAt(0)?.toUpperCase() + e?.severity?.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary">{e?.addedBy}</td>
                  <td className="px-4 py-3 text-[13px] text-text-muted">{e?.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SiteAdminLayout>
  );
}
