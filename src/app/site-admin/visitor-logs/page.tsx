'use client';

import React, { useState, useEffect } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import {
  Search, Filter, Download, RefreshCw, Eye, ChevronDown, X, Calendar,
} from 'lucide-react';

interface VisitorLog {
  id: string;
  visitorName: string;
  type: string;
  checkIn: string;
  checkOut: string;
  status: 'checked-in' | 'checked-out' | 'pre-registered' | 'at-gate' | 'denied';
  host: string;
  gate: string;
  zone: string;
}

const mockLogs: VisitorLog[] = [
  { id: 'vl-001', visitorName: 'Arjun Mehta',       type: 'Contractor',  checkIn: '08:47 AM', checkOut: '—',        status: 'checked-in',     host: 'Priya Mehta',    gate: 'Gate 1',    zone: 'Floor 2 – Operations' },
  { id: 'vl-002', visitorName: 'Priya Sharma',       type: 'Vendor',      checkIn: '08:30 AM', checkOut: '10:15 AM', status: 'checked-out',    host: 'Rahul Gupta',    gate: 'Gate 2',    zone: 'Lobby / Reception' },
  { id: 'vl-003', visitorName: 'Rahul Gupta',        type: 'Guest',       checkIn: '—',        checkOut: '—',        status: 'pre-registered', host: 'Kavita Joshi',   gate: 'Main',      zone: 'Conference Rooms' },
  { id: 'vl-004', visitorName: 'Sneha Patel',        type: 'Visitor',     checkIn: '08:31 AM', checkOut: '—',        status: 'at-gate',        host: 'Anand Gupta',    gate: 'Main',      zone: 'Lobby / Reception' },
  { id: 'vl-005', visitorName: 'Vikram Singh',       type: 'Delivery',    checkIn: '08:28 AM', checkOut: '09:05 AM', status: 'checked-out',    host: 'Mailroom',       gate: 'Gate 1',    zone: 'Lobby / Reception' },
  { id: 'vl-006', visitorName: 'Neha Kapoor',        type: 'Interviewee', checkIn: '—',        checkOut: '—',        status: 'pre-registered', host: 'HR Team',        gate: 'Main',      zone: 'Floor 3 – Tech' },
  { id: 'vl-007', visitorName: 'Deepak Malhotra',    type: 'VIP',         checkIn: '08:15 AM', checkOut: '—',        status: 'checked-in',     host: 'CEO Office',     gate: 'VIP Entry', zone: 'Floor 3 – Tech' },
  { id: 'vl-008', visitorName: 'Anjali Verma',       type: 'Contractor',  checkIn: '07:55 AM', checkOut: '12:30 PM', status: 'checked-out',    host: 'IT Dept',        gate: 'Gate 2',    zone: 'Floor 2 – Operations' },
  { id: 'vl-009', visitorName: 'Suresh Nair',        type: 'Vendor',      checkIn: '09:10 AM', checkOut: '—',        status: 'checked-in',     host: 'Facilities',     gate: 'Gate 1',    zone: 'Lobby / Reception' },
  { id: 'vl-010', visitorName: 'Meera Krishnan',     type: 'Guest',       checkIn: '09:45 AM', checkOut: '11:00 AM', status: 'checked-out',    host: 'Marketing',      gate: 'Main',      zone: 'Conference Rooms' },
  { id: 'vl-011', visitorName: 'Ravi Shankar',       type: 'Delivery',    checkIn: '10:05 AM', checkOut: '10:20 AM', status: 'checked-out',    host: 'Mailroom',       gate: 'Gate 1',    zone: 'Lobby / Reception' },
  { id: 'vl-012', visitorName: 'Pooja Iyer',         type: 'Visitor',     checkIn: '—',        checkOut: '—',        status: 'denied',         host: 'Security',       gate: 'Gate 2',    zone: '—' },
];

const statusConfig: Record<VisitorLog['status'], { label: string; bg: string; text: string }> = {
  'checked-in':     { label: 'Checked-In',     bg: 'bg-green-50',   text: 'text-green-700' },
  'checked-out':    { label: 'Checked-Out',     bg: 'bg-slate-100',  text: 'text-slate-600' },
  'pre-registered': { label: 'Pre-Registered',  bg: 'bg-blue-50',    text: 'text-blue-700' },
  'at-gate':        { label: 'At Gate',         bg: 'bg-amber-50',   text: 'text-amber-700' },
  'denied':         { label: 'Denied',          bg: 'bg-red-50',     text: 'text-red-700' },
};

const visitorTypes = ['All Types', 'Contractor', 'Vendor', 'Guest', 'Visitor', 'Delivery', 'Interviewee', 'VIP'];
const statusOptions = ['All Statuses', 'checked-in', 'checked-out', 'pre-registered', 'at-gate', 'denied'];
const gateOptions = ['All Gates', 'Gate 1', 'Gate 2', 'Main', 'VIP Entry'];
const zoneOptions = ['All Zones', 'Lobby / Reception', 'Floor 2 – Operations', 'Floor 3 – Tech', 'Conference Rooms'];

export default function SiteAdminVisitorLogsPage() {
  const { siteName } = useRole();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [gateFilter, setGateFilter] = useState('All Gates');
  const [zoneFilter, setZoneFilter] = useState('All Zones');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<VisitorLog | null>(null);

  useEffect(() => {
    setLastRefresh('10 Apr 2026, 10:30 IST');
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date().toLocaleTimeString());
    }, 1200);
  };

  const filtered = mockLogs.filter(log => {
    const matchSearch = log.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      log.host.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || log.type === typeFilter;
    const matchStatus = statusFilter === 'All Statuses' || log.status === statusFilter;
    const matchGate = gateFilter === 'All Gates' || log.gate === gateFilter;
    const matchZone = zoneFilter === 'All Zones' || log.zone === zoneFilter;
    return matchSearch && matchType && matchStatus && matchGate && matchZone;
  });

  const activeFilterCount = [typeFilter !== 'All Types', statusFilter !== 'All Statuses', gateFilter !== 'All Gates', zoneFilter !== 'All Zones', dateFrom, dateTo].filter(Boolean).length;

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Visitor Logs</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · All visitor activity for this site</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
              <Download size={13} />
              Export CSV
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
              <Download size={13} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Search + Filter bar */}
        <div className="bg-white rounded-xl border border-border shadow-card p-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search visitor name or host..."
                className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              />
            </div>
            <button
              onClick={() => setShowFilters(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-all ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-border text-text-secondary hover:bg-surface'}`}
            >
              <Filter size={13} />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            {lastRefresh && (
              <span className="text-[11px] text-text-muted ml-auto">Last refreshed: {lastRefresh}</span>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-border">
              {/* Date From */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">From</label>
                <div className="relative">
                  <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-[12px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
                </div>
              </div>
              {/* Date To */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">To</label>
                <div className="relative">
                  <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-[12px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
                </div>
              </div>
              {/* Visitor Type */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Visitor Type</label>
                <div className="relative">
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-7 py-1.5 text-[12px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200">
                    {visitorTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              {/* Status */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Status</label>
                <div className="relative">
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-7 py-1.5 text-[12px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200">
                    {statusOptions.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              {/* Gate */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Gate</label>
                <div className="relative">
                  <select value={gateFilter} onChange={e => setGateFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-7 py-1.5 text-[12px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200">
                    {gateOptions.map(g => <option key={g}>{g}</option>)}
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              {/* Zone */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">Zone</label>
                <div className="relative">
                  <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-7 py-1.5 text-[12px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200">
                    {zoneOptions.map(z => <option key={z}>{z}</option>)}
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-[13px] font-semibold text-text-primary">{filtered.length} records</span>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setTypeFilter('All Types'); setStatusFilter('All Statuses'); setGateFilter('All Gates'); setZoneFilter('All Zones'); setDateFrom(''); setDateTo(''); }}
                className="flex items-center gap-1 text-[11px] text-primary-600 hover:text-primary-700 font-medium"
              >
                <X size={11} /> Clear filters
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {['Visitor Name', 'Type', 'Check-in Time', 'Check-out Time', 'Status', 'Host', 'Gate', 'Zone', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-[13px] text-text-muted">No visitor logs match your filters.</td>
                  </tr>
                ) : filtered.map(log => {
                  const sc = statusConfig[log.status];
                  return (
                    <tr key={log.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-[10px] font-bold shrink-0">
                            {log.visitorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-[13px] font-semibold text-text-primary whitespace-nowrap">{log.visitorName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium whitespace-nowrap">{log.type}</span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary whitespace-nowrap">{log.checkIn}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary whitespace-nowrap">{log.checkOut}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${sc.bg} ${sc.text}`}>{sc.label}</span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary whitespace-nowrap">{log.host}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary whitespace-nowrap">{log.gate}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary whitespace-nowrap max-w-[140px] truncate">{log.zone}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="flex items-center gap-1 text-[12px] font-medium text-primary-600 hover:text-primary-700 transition-colors whitespace-nowrap"
                        >
                          <Eye size={13} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setSelectedLog(null)} />
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-[15px] font-bold text-text-primary">Visitor Details</h2>
              <button onClick={() => setSelectedLog(null)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-[16px] font-bold">
                  {selectedLog.visitorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-text-primary">{selectedLog.visitorName}</p>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusConfig[selectedLog.status].bg} ${statusConfig[selectedLog.status].text}`}>
                    {statusConfig[selectedLog.status].label}
                  </span>
                </div>
              </div>
              {[
                { label: 'Visitor Type', value: selectedLog.type },
                { label: 'Host', value: selectedLog.host },
                { label: 'Check-in Time', value: selectedLog.checkIn },
                { label: 'Check-out Time', value: selectedLog.checkOut },
                { label: 'Gate', value: selectedLog.gate },
                { label: 'Zone', value: selectedLog.zone },
                { label: 'Site', value: siteName },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-[12px] text-text-muted font-medium">{row.label}</span>
                  <span className="text-[13px] font-semibold text-text-primary">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </SiteAdminLayout>
  );
}
