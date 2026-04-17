'use client';

import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, ArrowUpDown, Edit, Trash2, Eye, MoreVertical, Shield, ShieldOff, CheckCircle2, XCircle, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';

// Backend: GET /api/users?page=1&limit=12&sort=name
const usersData = [
  {
    id: 'usr-001',
    initials: 'RP',
    color: 'bg-primary-600',
    name: 'Reeja Patel',
    email: 'reeja.patel@acmecorp.in',
    role: 'Super Admin',
    roleColor: 'bg-amber-100 text-amber-700',
    sites: ['All Sites'],
    lastLogin: '10 Apr 2026, 08:15 AM',
    twoFA: true,
    status: 'active' as const,
    createdAt: '15 Jan 2024',
  },
  {
    id: 'usr-002',
    initials: 'AS',
    color: 'bg-purple-600',
    name: 'Anand Sharma',
    email: 'anand.sharma@acmecorp.in',
    role: 'Super Admin',
    roleColor: 'bg-amber-100 text-amber-700',
    sites: ['All Sites'],
    lastLogin: '09 Apr 2026, 06:32 PM',
    twoFA: true,
    status: 'active' as const,
    createdAt: '15 Jan 2024',
  },
  {
    id: 'usr-003',
    initials: 'PM',
    color: 'bg-blue-600',
    name: 'Priya Mehta',
    email: 'priya.mehta@acmecorp.in',
    role: 'Site Admin',
    roleColor: 'bg-primary-100 text-primary-700',
    sites: ['Mumbai HQ'],
    lastLogin: '10 Apr 2026, 07:55 AM',
    twoFA: true,
    status: 'active' as const,
    createdAt: '03 Mar 2024',
  },
  {
    id: 'usr-004',
    initials: 'RS',
    color: 'bg-teal-600',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@acmecorp.in',
    role: 'Site Admin',
    roleColor: 'bg-primary-100 text-primary-700',
    sites: ['Mumbai HQ', 'Delhi NCR'],
    lastLogin: '10 Apr 2026, 08:02 AM',
    twoFA: false,
    status: 'active' as const,
    createdAt: '22 Apr 2024',
  },
  {
    id: 'usr-005',
    initials: 'KJ',
    color: 'bg-indigo-600',
    name: 'Kavita Joshi',
    email: 'kavita.joshi@acmecorp.in',
    role: 'Site Admin',
    roleColor: 'bg-primary-100 text-primary-700',
    sites: ['Bengaluru Tech Park'],
    lastLogin: '08 Apr 2026, 05:14 PM',
    twoFA: true,
    status: 'active' as const,
    createdAt: '10 Jun 2024',
  },
  {
    id: 'usr-006',
    initials: 'DK',
    color: 'bg-orange-600',
    name: 'Deepak Kumar',
    email: 'deepak.kumar@acmecorp.in',
    role: 'Operator',
    roleColor: 'bg-teal-100 text-teal-700',
    sites: ['Mumbai HQ'],
    lastLogin: '10 Apr 2026, 07:30 AM',
    twoFA: false,
    status: 'active' as const,
    createdAt: '28 Aug 2024',
  },
  {
    id: 'usr-007',
    initials: 'SN',
    color: 'bg-green-600',
    name: 'Sneha Nair',
    email: 'sneha.nair@acmecorp.in',
    role: 'Operator',
    roleColor: 'bg-teal-100 text-teal-700',
    sites: ['Bengaluru Tech Park'],
    lastLogin: '09 Apr 2026, 04:22 PM',
    twoFA: false,
    status: 'active' as const,
    createdAt: '15 Sep 2024',
  },
  {
    id: 'usr-008',
    initials: 'VR',
    color: 'bg-red-600',
    name: 'Vikram Rao',
    email: 'vikram.rao@acmecorp.in',
    role: 'Operator',
    roleColor: 'bg-teal-100 text-teal-700',
    sites: ['Hyderabad Campus'],
    lastLogin: '07 Apr 2026, 11:45 AM',
    twoFA: false,
    status: 'inactive' as const,
    createdAt: '01 Oct 2024',
  },
  {
    id: 'usr-009',
    initials: 'MG',
    color: 'bg-pink-600',
    name: 'Meera Gupta',
    email: 'meera.gupta@acmecorp.in',
    role: 'Security Guard',
    roleColor: 'bg-purple-100 text-purple-700',
    sites: ['Mumbai HQ'],
    lastLogin: '10 Apr 2026, 08:00 AM',
    twoFA: false,
    status: 'active' as const,
    createdAt: '15 Nov 2024',
  },
  {
    id: 'usr-010',
    initials: 'AT',
    color: 'bg-cyan-600',
    name: 'Arun Tiwari',
    email: 'arun.tiwari@acmecorp.in',
    role: 'Security Guard',
    roleColor: 'bg-purple-100 text-purple-700',
    sites: ['Delhi NCR Office'],
    lastLogin: '10 Apr 2026, 07:45 AM',
    twoFA: false,
    status: 'active' as const,
    createdAt: '01 Dec 2024',
  },
  {
    id: 'usr-011',
    initials: 'LK',
    color: 'bg-violet-600',
    name: 'Lakshmi Krishnan',
    email: 'lakshmi.k@acmecorp.in',
    role: 'Operator',
    roleColor: 'bg-teal-100 text-teal-700',
    sites: ['Chennai Data Centre'],
    lastLogin: '09 Apr 2026, 03:10 PM',
    twoFA: true,
    status: 'active' as const,
    createdAt: '10 Jan 2025',
  },
  {
    id: 'usr-012',
    initials: 'NB',
    color: 'bg-rose-600',
    name: 'Nikhil Bose',
    email: 'nikhil.bose@acmecorp.in',
    role: 'Security Guard',
    roleColor: 'bg-purple-100 text-purple-700',
    sites: ['Hyderabad Campus'],
    lastLogin: '05 Apr 2026, 09:30 AM',
    twoFA: false,
    status: 'pending' as const,
    createdAt: '20 Feb 2025',
  },
];

type SortField = 'name' | 'role' | 'lastLogin' | 'status';

export default function UsersTable() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const roles = ['All', 'Super Admin', 'Site Admin', 'Operator', 'Security Guard'];

  const filtered = usersData
    .filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      const av = a[sortField] as string;
      const bv = b[sortField] as string;
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const allSelected = selected.length === filtered.length && filtered.length > 0;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={11} className="text-text-muted ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="text-primary-600 ml-1" />
      : <ChevronDown size={11} className="text-primary-600 ml-1" />;
  };

  return (
    <div className="bg-white rounded-card card-shadow border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border gap-3 flex-wrap">
        <div>
          <h2 className="text-[15px] font-bold text-text-primary">All Users</h2>
          <p className="text-[12px] text-text-muted">{usersData.length} total · {usersData.filter(u => u.status === 'active').length} active</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-[12px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 w-48 transition-all"
            />
          </div>
          {/* Role filter chips */}
          <div className="flex items-center bg-surface border border-border rounded-lg p-0.5 gap-0.5">
            {roles.map((r) => (
              <button
                key={`rf-${r}`}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md whitespace-nowrap transition-all duration-150 ${
                  roleFilter === r
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-5 py-2.5 bg-primary-50 border-b border-primary-100 slide-up">
          <span className="text-[12px] font-semibold text-primary-700">{selected.length} user(s) selected</span>
          <button onClick={() => toast.info(`Resending invite to ${selected.length} users`)} className="text-[12px] font-medium text-primary-600 hover:text-primary-700">Resend Invite</button>
          <button onClick={() => { toast.error(`Deactivating ${selected.length} users`); setSelected([]); }} className="text-[12px] font-medium text-danger-text hover:text-danger">Deactivate</button>
          <button onClick={() => setSelected([])} className="ml-auto text-[12px] text-text-muted hover:text-text-secondary">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="px-5 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? [] : filtered.map((u) => u.id))}
                  className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-200"
                />
              </th>
              {[
                { label: 'USER', field: 'name' as SortField },
                { label: 'ROLE', field: 'role' as SortField },
                { label: 'ASSIGNED SITES', field: null },
                { label: 'LAST LOGIN', field: 'lastLogin' as SortField },
                { label: '2FA', field: null },
                { label: 'STATUS', field: 'status' as SortField },
                { label: 'ACTIONS', field: null },
              ].map((col) => (
                <th
                  key={`th-usr-${col.label}`}
                  onClick={() => col.field && toggleSort(col.field)}
                  className={`px-5 py-3 text-left text-[10px] font-semibold tracking-widest text-text-muted uppercase whitespace-nowrap ${col.field ? 'cursor-pointer hover:text-text-secondary' : ''}`}
                >
                  <div className="flex items-center">
                    {col.label}
                    {col.field && <SortIcon field={col.field} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                onMouseEnter={() => setHoveredRow(user.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b border-border/50 transition-colors duration-100 ${hoveredRow === user.id ? 'bg-primary-50/30' : ''} ${selected.includes(user.id) ? 'bg-primary-50/20' : ''}`}
              >
                {/* Checkbox */}
                <td className="px-5 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-200"
                  />
                </td>

                {/* User */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                      {user.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-text-primary whitespace-nowrap">{user.name}</p>
                      <p className="text-[11px] text-text-muted truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-badge ${user.roleColor}`}>
                    {user.role}
                  </span>
                </td>

                {/* Sites */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                    {user.sites.map((site) => (
                      <span
                        key={`${user.id}-site-${site}`}
                        className="text-[10px] font-medium text-text-secondary bg-slate-100 px-1.5 py-0.5 rounded-md whitespace-nowrap"
                      >
                        {site}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Last Login */}
                <td className="px-5 py-3">
                  <span className="text-[12px] text-text-secondary whitespace-nowrap">{user.lastLogin}</span>
                </td>

                {/* 2FA */}
                <td className="px-5 py-3">
                  {user.twoFA ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-success" />
                      <span className="text-[11px] font-semibold text-success-text">Enabled</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <XCircle size={14} className="text-text-muted" />
                      <span className="text-[11px] font-medium text-text-muted">Off</span>
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-5 py-3">
                  <StatusBadge status={user.status} />
                </td>

                {/* Actions */}
                <td className="px-5 py-3">
                  <div className={`flex items-center gap-1 transition-opacity duration-150 ${hoveredRow === user.id ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                      onClick={() => toast.info(`Viewing ${user.name}'s profile`)}
                      className="w-7 h-7 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center"
                      title="View profile"
                    >
                      <Eye size={13} className="text-primary-600" />
                    </button>
                    <button
                      onClick={() => toast.info(`Editing ${user.name}`)}
                      className="w-7 h-7 rounded-lg bg-surface hover:bg-slate-100 flex items-center justify-center border border-border"
                      title="Edit user"
                    >
                      <Edit size={13} className="text-text-secondary" />
                    </button>
                    <button
                      onClick={() => toast.info(`Reset password for ${user.name}`)}
                      className="w-7 h-7 rounded-lg bg-surface hover:bg-slate-100 flex items-center justify-center border border-border"
                      title="Reset password"
                    >
                      <KeyRound size={13} className="text-text-secondary" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="w-7 h-7 rounded-lg bg-surface hover:bg-slate-100 flex items-center justify-center border border-border"
                        title="More actions"
                      >
                        <MoreVertical size={13} className="text-text-secondary" />
                      </button>
                      {openMenu === user.id && (
                        <div className="absolute right-0 top-8 w-40 bg-white rounded-xl border border-border shadow-dropdown z-10 py-1 fade-in">
                          <button
                            onClick={() => { toast.info(`Toggling 2FA for ${user.name}`); setOpenMenu(null); }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-text-secondary hover:bg-surface hover:text-text-primary"
                          >
                            <Shield size={12} /> Toggle 2FA
                          </button>
                          <button
                            onClick={() => { toast.warning(`Deactivating ${user.name}`); setOpenMenu(null); }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-text-secondary hover:bg-surface hover:text-text-primary"
                          >
                            <ShieldOff size={12} /> Deactivate
                          </button>
                          <div className="h-px bg-border mx-2 my-1" />
                          <button
                            onClick={() => { toast.error(`Remove ${user.name}?`); setOpenMenu(null); }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-danger-text hover:bg-danger/5"
                          >
                            <Trash2 size={12} /> Remove User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border flex-wrap gap-2">
        <p className="text-[12px] text-text-muted">
          Showing {filtered.length} of {usersData.length} users
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
            <span>Rows per page:</span>
            <select className="text-[12px] border border-border rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
              <option value="12">12</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all disabled:opacity-40" disabled>
              Previous
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={`page-${p}`}
                className={`px-3 py-1 text-[12px] font-semibold rounded-lg transition-all ${
                  p === 1 ? 'bg-primary-600 text-white' : 'text-text-secondary border border-border hover:bg-surface'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="px-3 py-1 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}