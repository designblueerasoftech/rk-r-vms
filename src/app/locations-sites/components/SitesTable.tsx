'use client';

import React, { useState } from 'react';
import {
  Search, ChevronUp, ChevronDown, Edit, Settings,
  Trash2, Eye, MonitorSmartphone, Filter, ArrowUpDown
} from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';

// Backend: GET /api/sites?page=1&limit=10&sort=name&order=asc
const sitesData = [
  { id: 'stbl-001', name: 'Mumbai HQ',            city: 'Mumbai',    state: 'Maharashtra', capacity: 312, inside: 44, pct: 14, gates: 3, kiosks: 4, kOnline: 4, status: 'normal' as const,    lastActivity: '2 min ago',  created: '15 Jan 2024' },
  { id: 'stbl-002', name: 'Bengaluru Tech Park',  city: 'Bengaluru', state: 'Karnataka',   capacity: 189, inside: 34, pct: 18, gates: 2, kiosks: 3, kOnline: 3, status: 'high-wait' as const, lastActivity: '1 min ago',  created: '03 Mar 2024' },
  { id: 'stbl-003', name: 'Delhi NCR Office',     city: 'Gurugram',  state: 'Haryana',     capacity: 94,  inside: 19, pct: 20, gates: 1, kiosks: 2, kOnline: 1, status: 'normal' as const,    lastActivity: '5 min ago',  created: '22 Apr 2024' },
  { id: 'stbl-004', name: 'Chennai Data Centre',  city: 'Chennai',   state: 'Tamil Nadu',  capacity: 48,  inside: 10, pct: 21, gates: 2, kiosks: 2, kOnline: 2, status: 'normal' as const,    lastActivity: '8 min ago',  created: '10 Jun 2024' },
  { id: 'stbl-005', name: 'Hyderabad Campus',     city: 'Hyderabad', state: 'Telangana',   capacity: 147, inside: 23, pct: 16, gates: 3, kiosks: 4, kOnline: 0, status: 'alert' as const,     lastActivity: '12 min ago', created: '28 Aug 2024' },
];

type SortField = 'name' | 'capacity' | 'inside' | 'pct' | 'kiosks';

export default function SitesTable() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = sitesData
    .filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
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
    if (sortField !== field) return <ArrowUpDown size={12} className="text-text-muted ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-primary-600 ml-1" />
      : <ChevronDown size={12} className="text-primary-600 ml-1" />;
  };

  return (
    <div className="bg-white rounded-card card-shadow border border-border overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border gap-3 flex-wrap">
        <h2 className="text-[15px] font-bold text-text-primary">Site Directory</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search sites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-[12px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 w-52 transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
            <Filter size={12} /> Filter
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-5 py-2.5 bg-primary-50 border-b border-primary-100 slide-up">
          <span className="text-[12px] font-semibold text-primary-700">{selected.length} site(s) selected</span>
          <button onClick={() => toast.info(`Exporting ${selected.length} sites`)} className="text-[12px] font-medium text-primary-600 hover:text-primary-700">Export</button>
          <button onClick={() => { toast.error(`Deleting ${selected.length} sites`); setSelected([]); }} className="text-[12px] font-medium text-danger-text hover:text-danger">Delete</button>
          <button onClick={() => setSelected([])} className="ml-auto text-[12px] text-text-muted hover:text-text-secondary">Clear</button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="px-5 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? [] : filtered.map((s) => s.id))}
                  className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-200"
                />
              </th>
              {[
                { label: 'SITE NAME', field: 'name' as SortField },
                { label: 'LOCATION', field: null },
                { label: 'CAPACITY', field: 'capacity' as SortField },
                { label: 'OCCUPANCY', field: 'inside' as SortField },
                { label: 'GATES', field: null },
                { label: 'KIOSKS', field: 'kiosks' as SortField },
                { label: 'STATUS', field: null },
                { label: 'LAST ACTIVITY', field: null },
                { label: 'ACTIONS', field: null },
              ].map((col) => (
                <th
                  key={`th-loc-${col.label}`}
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
            {filtered.map((site) => (
              <tr
                key={site.id}
                onMouseEnter={() => setHoveredRow(site.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b border-border/50 transition-colors duration-100 ${hoveredRow === site.id ? 'bg-primary-50/30' : ''} ${selected.includes(site.id) ? 'bg-primary-50/20' : ''}`}
              >
                <td className="px-5 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(site.id)}
                    onChange={() => toggleSelect(site.id)}
                    className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-200"
                  />
                </td>
                <td className="px-5 py-3">
                  <p className="text-[13px] font-semibold text-text-primary whitespace-nowrap">{site.name}</p>
                  <p className="text-[11px] text-text-muted">{site.created}</p>
                </td>
                <td className="px-5 py-3">
                  <p className="text-[12px] text-text-secondary whitespace-nowrap">{site.city}</p>
                  <p className="text-[11px] text-text-muted">{site.state}</p>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[13px] font-semibold tabular-nums text-text-primary">{site.capacity}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold tabular-nums text-text-primary">{site.inside}</span>
                    <div className="w-16">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${site.pct > 80 ? 'bg-danger' : site.pct > 50 ? 'bg-warning' : 'bg-success'}`}
                          style={{ width: `${site.pct}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-text-muted mt-0.5">{site.pct}%</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[13px] tabular-nums text-text-secondary">{site.gates}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <MonitorSmartphone size={12} className={site.kOnline === 0 ? 'text-danger-text' : site.kOnline < site.kiosks ? 'text-warning' : 'text-success'} />
                    <span className={`text-[12px] font-semibold tabular-nums ${site.kOnline === 0 ? 'text-danger-text' : site.kOnline < site.kiosks ? 'text-warning-text' : 'text-success-text'}`}>
                      {site.kOnline}/{site.kiosks}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={site.status} />
                </td>
                <td className="px-5 py-3">
                  <span className="text-[12px] text-text-muted whitespace-nowrap">{site.lastActivity}</span>
                </td>
                <td className="px-5 py-3">
                  <div className={`flex items-center gap-1 transition-opacity duration-150 ${hoveredRow === site.id ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                      onClick={() => toast.info(`Viewing ${site.name}`)}
                      className="w-7 h-7 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center"
                      title="View site"
                    >
                      <Eye size={13} className="text-primary-600" />
                    </button>
                    <button
                      onClick={() => toast.info(`Edit ${site.name}`)}
                      className="w-7 h-7 rounded-lg bg-surface hover:bg-slate-100 flex items-center justify-center border border-border"
                      title="Edit site"
                    >
                      <Edit size={13} className="text-text-secondary" />
                    </button>
                    <button
                      onClick={() => toast.info(`Configure ${site.name}`)}
                      className="w-7 h-7 rounded-lg bg-surface hover:bg-slate-100 flex items-center justify-center border border-border"
                      title="Configure"
                    >
                      <Settings size={13} className="text-text-secondary" />
                    </button>
                    <button
                onClick={() => toast.error(`Delete ${site.name}?`)}
                      className="w-7 h-7 rounded-lg bg-danger/10 hover:bg-danger/20 flex items-center justify-center"
                      title="Delete site"
                    >
                      <Trash2 size={13} className="text-danger-text" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
        <p className="text-[12px] text-text-muted">Showing {filtered.length} of {sitesData.length} sites</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all disabled:opacity-40" disabled>
            Previous
          </button>
          <span className="px-3 py-1 text-[12px] font-semibold text-white bg-primary-600 rounded-lg">1</span>
          <button className="px-3 py-1 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all disabled:opacity-40" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}