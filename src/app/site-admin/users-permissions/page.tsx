'use client';

import React, { useState } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Plus, Search, Mail, Shield, Info } from 'lucide-react';

const users = [
  { id: 1, name: 'Reeja Patel', email: 'reeja@acme.com', role: 'Site Admin', site: 'Site A', status: 'active', lastLogin: '2 hrs ago' },
  { id: 2, name: 'Arjun Mehta', email: 'arjun@acme.com', role: 'Receptionist', site: 'Site A', status: 'active', lastLogin: '1 day ago' },
  { id: 3, name: 'Priya Sharma', email: 'priya@acme.com', role: 'Security Officer', site: 'Site A', status: 'active', lastLogin: '3 hrs ago' },
  { id: 4, name: 'Rahul Gupta', email: 'rahul@acme.com', role: 'Receptionist', site: 'Site A', status: 'inactive', lastLogin: '5 days ago' },
];

export default function SiteAdminUsersPermissionsPage() {
  const { siteName } = useRole();
  const [search, setSearch] = useState('');

  const filtered = users?.filter(u => u?.name?.toLowerCase()?.includes(search?.toLowerCase()) || u?.email?.toLowerCase()?.includes(search?.toLowerCase()));

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Users & Permissions</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · {users?.length} users</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
            <Plus size={15} /> Invite User
          </button>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[12px] text-blue-700">
            You can manage users assigned to <strong>{siteName}</strong> only. Company Admin accounts are not visible here. Role assignments are limited to site-level roles.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={e => setSearch(e?.target?.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                {['User', 'Role', 'Status', 'Last Login']?.map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered?.map((u) => (
                <tr key={u?.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-[11px] font-bold">
                        {u?.name?.split(' ')?.map(n => n?.[0])?.join('')?.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-text-primary">{u?.name}</p>
                        <p className="text-[11px] text-text-muted flex items-center gap-1"><Mail size={10} /> {u?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 flex items-center gap-1 w-fit">
                      <Shield size={9} /> {u?.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${u?.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-surface text-text-muted'}`}>
                      {u?.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-muted">{u?.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-text-muted text-center pb-2">
          Permissions are dynamically scoped to {siteName}. Role changes take effect immediately.
        </p>
      </div>
    </SiteAdminLayout>
  );
}
