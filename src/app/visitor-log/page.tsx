'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { Search, Download, Plus, RefreshCw, ChevronDown, X, Filter, Eye, MoreVertical, CheckSquare, Square, ChevronLeft, ChevronRight, Users, LogIn, AlertTriangle, LogOut, ChevronUp } from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type VisitorStatus = 'Invited' | 'Pre-Registered' | 'At Gate' | 'Checked-In' | 'Checked-Out';
type VisitorType = 'VIP' | 'Contractor' | 'Vendor' | 'Interviewee' | 'Delivery' | 'Business Guest' | 'Govt Official' | 'Group Visit';

interface Visitor {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  type: VisitorType;
  company: string;
  host: string;
  status: VisitorStatus;
  checkIn: string;
  checkOut: string;
  duration: string;
  gate: string;
  purpose: string;
  mobile: string;
  email: string;
}

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
const mockVisitors: Visitor[] = [
  { id: 'v1', name: 'Meera Pillai', initials: 'MP', avatarColor: 'bg-purple-500', type: 'VIP', company: 'TechVision Corp', host: 'Rahul Agarwal', status: 'Checked-Out', checkIn: '10:48 pm', checkOut: '01:14 am', duration: '3h 26m', gate: 'Gate A', purpose: 'Partnership discussion - Q2 ro', mobile: '+91 98765 43210', email: 'meera@techvision.com' },
  { id: 'v2', name: 'Kiran Mehta', initials: 'KM', avatarColor: 'bg-teal-500', type: 'Interviewee', company: 'Self', host: 'Deepa Krishnan', status: 'Checked-Out', checkIn: '10:18 pm', checkOut: '01:15 am', duration: '3h 57m', gate: 'Gate A', purpose: 'Job interview - Senior Develop', mobile: '+91 87654 32109', email: 'kiran.mehta@gmail.com' },
  { id: 'v3', name: 'Sunita Rao', initials: 'SR', avatarColor: 'bg-orange-500', type: 'Vendor', company: 'VendorCo Solutions', host: 'Rahul Agarwal', status: 'Checked-Out', checkIn: '09:18 pm', checkOut: '10:19 pm', duration: '13h 1m', gate: 'Gate B', purpose: 'Software demo and product revi', mobile: '+91 76543 21098', email: 'sunita@vendorco.com' },
  { id: 'v4', name: 'Amit Verma', initials: 'AV', avatarColor: 'bg-green-500', type: 'Contractor', company: 'BuildRight Infra', host: 'Deepa Krishnan', status: 'Checked-In', checkIn: '08:18 pm', checkOut: '—', duration: '92h 47m', gate: 'Gate A', purpose: 'Office renovation work - Floor', mobile: '+91 65432 10987', email: 'amit@buildright.com' },
  { id: 'v5', name: 'Rajesh Kumar', initials: 'RK', avatarColor: 'bg-blue-500', type: 'Contractor', company: 'Regal Facilities', host: 'Sunil Gupta', status: 'Checked-In', checkIn: '07:18 pm', checkOut: '—', duration: '93h 47m', gate: 'Main Gate', purpose: 'HVAC maintenance and inspectio', mobile: '+91 54321 09876', email: 'rajesh@regal.com' },
  { id: 'v6', name: 'Pradeep Singh', initials: 'PS', avatarColor: 'bg-pink-500', type: 'Delivery', company: 'Logistix India', host: 'Deepa Krishnan', status: 'Checked-Out', checkIn: '05:18 pm', checkOut: '06:18 pm', duration: '1h 0m', gate: 'Gate B', purpose: 'Office supplies delivery', mobile: '+91 43210 98765', email: 'pradeep@logistix.com' },
  { id: 'v7', name: 'Ananya Das', initials: 'AD', avatarColor: 'bg-indigo-500', type: 'Business Guest', company: 'ConsultPro', host: 'Rahul Agarwal', status: 'Checked-Out', checkIn: '03:18 pm', checkOut: '06:18 pm', duration: '3h 0m', gate: 'Gate A', purpose: 'Strategy consulting session', mobile: '+91 32109 87654', email: 'ananya@consultpro.com' },
  { id: 'v8', name: 'Vikram Nair', initials: 'VN', avatarColor: 'bg-red-500', type: 'Govt Official', company: 'Ministry of IT', host: 'Rahul Agarwal', status: 'Pre-Registered', checkIn: '—', checkOut: '—', duration: '—', gate: 'Gate A', purpose: 'Regulatory compliance audit', mobile: '+91 21098 76543', email: 'vikram.nair@gov.in' },
  { id: 'v9', name: 'Priya Nair', initials: 'PN', avatarColor: 'bg-yellow-500', type: 'Contractor', company: 'XYZ Ltd', host: 'Sunil Gupta', status: 'Checked-Out', checkIn: '04:18 pm', checkOut: '07:18 pm', duration: '3h 0m', gate: 'Main Gate', purpose: 'Electrical work', mobile: '+91 10987 65432', email: 'priya@xyz.com' },
  { id: 'v10', name: 'Rahul Sharma', initials: 'RS', avatarColor: 'bg-cyan-500', type: 'Vendor', company: 'ABC Corp', host: 'Deepa Krishnan', status: 'Checked-Out', checkIn: '02:18 pm', checkOut: '05:18 pm', duration: '3h 0m', gate: 'Gate A', purpose: 'Product demo', mobile: '+91 09876 54321', email: 'rahul.s@abc.com' },
  { id: 'v11', name: 'Lakshmi Iyer', initials: 'LI', avatarColor: 'bg-emerald-500', type: 'Group Visit', company: 'IIT Bangalore', host: 'Deepa Krishnan', status: 'Invited', checkIn: '—', checkOut: '—', duration: '—', gate: 'Gate B', purpose: 'Campus recruitment drive', mobile: '+91 98765 11111', email: 'lakshmi@iitb.ac.in' },
  { id: 'v12', name: 'Sneha Reddy', initials: 'SR', avatarColor: 'bg-violet-500', type: 'Interviewee', company: 'MNO Tech', host: 'Deepa Krishnan', status: 'Checked-Out', checkIn: '03:18 pm', checkOut: '05:18 pm', duration: '2h 0m', gate: 'Gate B', purpose: 'Interview', mobile: '+91 87654 22222', email: 'sneha@mno.com' },
  { id: 'v13', name: 'Arun Kumar', initials: 'AK', avatarColor: 'bg-amber-500', type: 'Business Guest', company: 'PQR Services', host: 'Rahul Agarwal', status: 'Checked-Out', checkIn: '01:18 pm', checkOut: '04:18 pm', duration: '3h 0m', gate: 'Gate A', purpose: 'Business meeting', mobile: '+91 76543 33333', email: 'arun@pqr.com' },
  { id: 'v14', name: 'Kavitha Menon', initials: 'KM', avatarColor: 'bg-rose-500', type: 'VIP', company: 'IKL Corp', host: 'Rahul Agarwal', status: 'Checked-Out', checkIn: '04:18 pm', checkOut: '07:18 pm', duration: '3h 0m', gate: 'Gate A', purpose: 'Board meeting', mobile: '+91 65432 44444', email: 'kavitha@ikl.com' },
  { id: 'v15', name: 'Vijay Patel', initials: 'VP', avatarColor: 'bg-lime-500', type: 'Contractor', company: 'GHI Infra', host: 'Rahul Agarwal', status: 'Checked-Out', checkIn: '02:18 pm', checkOut: '04:18 pm', duration: '2h 0m', gate: 'Main Gate', purpose: 'Plumbing repair', mobile: '+91 54321 55555', email: 'vijay@ghi.com' },
  { id: 'v16', name: 'Mohan Das', initials: 'MD', avatarColor: 'bg-sky-500', type: 'Delivery', company: 'STU Logistics', host: 'Deepa Krishnan', status: 'Checked-Out', checkIn: '01:18 pm', checkOut: '02:18 pm', duration: '1h 0m', gate: 'Gate B', purpose: 'Equipment delivery', mobile: '+91 43210 66666', email: 'mohan@stu.com' },
  { id: 'v17', name: 'Divya Krishnan', initials: 'DK', avatarColor: 'bg-fuchsia-500', type: 'Vendor', company: 'VWX Solutions', host: 'Deepa Krishnan', status: 'Checked-Out', checkIn: '02:18 pm', checkOut: '05:18 pm', duration: '3h 0m', gate: 'Gate A', purpose: 'Software review', mobile: '+91 32109 77777', email: 'divya@vwx.com' },
  { id: 'v18', name: 'Sanjay Gupta', initials: 'SG', avatarColor: 'bg-orange-400', type: 'Business Guest', company: 'YZA Tech', host: 'Rahul Agarwal', status: 'Checked-Out', checkIn: '03:18 pm', checkOut: '06:18 pm', duration: '3h 0m', gate: 'Gate A', purpose: 'Partnership discussion', mobile: '+91 21098 88888', email: 'sanjay@yza.com' },
  { id: 'v19', name: 'Rekha Iyer', initials: 'RI', avatarColor: 'bg-teal-400', type: 'Contractor', company: 'BCD Corp', host: 'Sunil Gupta', status: 'At Gate', checkIn: '—', checkOut: '—', duration: '—', gate: 'Main Gate', purpose: 'Security system install', mobile: '+91 10987 99999', email: 'rekha@bcd.com' },
];

/* ─── Status Config ──────────────────────────────────────────────────────── */
const statusConfig: Record<VisitorStatus, { bg: string; text: string; dot: string; label: string }> = {
  'Invited': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Invited' },
  'Pre-Registered': { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500', label: 'Pre-Registered' },
  'At Gate': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'At Gate' },
  'Checked-In': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Checked-In' },
  'Checked-Out': { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Checked-Out' },
};

const typeConfig: Record<VisitorType, { bg: string; text: string }> = {
  'VIP': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Contractor': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Vendor': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Interviewee': { bg: 'bg-violet-100', text: 'text-violet-700' },
  'Delivery': { bg: 'bg-teal-100', text: 'text-teal-700' },
  'Business Guest': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  'Govt Official': { bg: 'bg-red-100', text: 'text-red-700' },
  'Group Visit': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

/* ─── Type Badge ─────────────────────────────────────────────────────────── */
function TypeBadge({ type }: { type: VisitorType }) {
  const cfg = typeConfig[type];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      {type}
    </span>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: VisitorStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function VisitorLogPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VisitorStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'Today' | 'Last 7 days' | 'Last 30 days' | 'All Time'>('Today');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Visitor>('checkIn');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 10;

  // Live counter animation
  useEffect(() => {
    const timer = setTimeout(() => setLiveCount(19), 300);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) setShowTypeDropdown(false);
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) setShowExportDropdown(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const allTypes: VisitorType[] = ['VIP', 'Contractor', 'Vendor', 'Interviewee', 'Delivery', 'Business Guest', 'Govt Official', 'Group Visit'];

  const filtered = visitors.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.company.toLowerCase().includes(search.toLowerCase()) || v.host.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchType = typeFilter.length === 0 || typeFilter.includes(v.type);
    return matchSearch && matchStatus && matchType;
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortField] as string;
    const bv = b[sortField] as string;
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: keyof Visitor) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleRow = (id: string) => setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  const toggleAll = () => setSelectedRows(prev => prev.length === paginated.length ? [] : paginated.map(v => v.id));

  const SortIcon = ({ field }: { field: keyof Visitor }) => (
    <span className="ml-1 inline-flex flex-col gap-0.5">
      <ChevronUp size={9} className={sortField === field && sortDir === 'asc' ? 'text-primary-600' : 'text-slate-300'} />
      <ChevronDown size={9} className={sortField === field && sortDir === 'desc' ? 'text-primary-600' : 'text-slate-300'} />
    </span>
  );

  const checkedIn = visitors.filter(v => v.status === 'Checked-In').length;
  const atGate = visitors.filter(v => v.status === 'At Gate').length;
  const checkedOut = visitors.filter(v => v.status === 'Checked-Out').length;

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-bold text-slate-800">Visitor Log</h1>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-[11px] font-semibold text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-dot-pulse" />
                Live
              </span>
            </div>
            <p className="text-[13px] text-slate-500 mt-0.5">Real-time visitor tracking across all sites</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <div className="relative" ref={exportDropdownRef}>
              <button
                onClick={() => setShowExportDropdown(p => !p)}
                className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download size={14} />
                Export
                <ChevronDown size={12} />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-dropdown z-20">
                  <button className="w-full text-left px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 rounded-t-lg">Export CSV</button>
                  <button className="w-full text-left px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 rounded-b-lg">Export PDF</button>
                </div>
              )}
            </div>
            <button
              onClick={() => router.push('/visitor-log/new-invite')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Plus size={15} />
              New Invite
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { icon: <Users size={18} className="text-primary-600" />, value: liveCount, label: 'Total Today', bg: 'bg-primary-50', border: 'border-primary-100' },
            { icon: <LogIn size={18} className="text-green-600" />, value: checkedIn, label: 'Checked In', bg: 'bg-green-50', border: 'border-green-100' },
            { icon: <AlertTriangle size={18} className="text-amber-600" />, value: atGate, label: 'At Gate', bg: 'bg-amber-50', border: 'border-amber-100' },
            { icon: <LogOut size={18} className="text-slate-500" />, value: checkedOut, label: 'Checked Out', bg: 'bg-slate-50', border: 'border-slate-200' },
          ].map((card, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${card.bg} ${card.border}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg} border ${card.border}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[24px] font-bold text-slate-800 leading-none">{card.value}</p>
                <p className="text-[12px] text-slate-500 mt-0.5">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 mb-4">
          {/* Top Row */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search visitors, hosts..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 bg-slate-50"
              />
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {(['Today', 'Last 7 days', 'Last 30 days', 'All Time'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDateRange(d)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${dateRange === d ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Type Multi-select */}
            <div className="relative" ref={typeDropdownRef}>
              <button
                onClick={() => setShowTypeDropdown(p => !p)}
                className="flex items-center gap-2 px-3 py-2 text-[13px] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white"
              >
                <Filter size={13} className="text-slate-400" />
                <span className="text-slate-600">{typeFilter.length > 0 ? `${typeFilter.length} Types` : 'All Types'}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>
              {showTypeDropdown && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-dropdown z-20 py-1">
                  {allTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        setTypeFilter(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
                        setPage(1);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${typeFilter.includes(t) ? 'bg-primary-600 border-primary-600' : 'border-slate-300'}`}>
                        {typeFilter.includes(t) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {(statusFilter !== 'All' || typeFilter.length > 0 || search) && (
              <button
                onClick={() => { setStatusFilter('All'); setTypeFilter([]); setSearch(''); setPage(1); }}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X size={12} />
                Clear Filters
              </button>
            )}

            <span className="ml-auto text-[12px] text-slate-400">{filtered.length} records</span>
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap gap-2">
            {(['All', 'Invited', 'Pre-Registered', 'At Gate', 'Checked-In', 'Checked-Out'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-full border transition-colors ${statusFilter === s
                  ? 'bg-primary-600 text-white border-primary-600' :'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {s}
                {s !== 'All' && (
                  <span className="ml-1.5 text-[10px] opacity-70">
                    {visitors.filter(v => v.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-primary-50 border border-primary-200 rounded-lg mb-3">
            <span className="text-[13px] font-semibold text-primary-700">{selectedRows.length} selected</span>
            <div className="h-4 w-px bg-primary-200" />
            <button className="text-[12px] font-medium text-primary-600 hover:text-primary-800">Export Selected</button>
            <button className="text-[12px] font-medium text-red-600 hover:text-red-800">Bulk Check-Out</button>
            <button onClick={() => setSelectedRows([])} className="ml-auto text-[12px] text-slate-500 hover:text-slate-700">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="w-10 px-4 py-3">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-slate-600">
                      {selectedRows.length === paginated.length && paginated.length > 0
                        ? <CheckSquare size={16} className="text-primary-600" />
                        : <Square size={16} />
                      }
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort('name')} className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wide hover:text-slate-700">
                      Visitor <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort('type')} className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wide hover:text-slate-700">
                      Type <SortIcon field="type" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort('host')} className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wide hover:text-slate-700">
                      Host <SortIcon field="host" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort('status')} className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wide hover:text-slate-700">
                      Status <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort('checkIn')} className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wide hover:text-slate-700">
                      Check-In <SortIcon field="checkIn" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Duration</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Gate</th>
                  <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                          <Users size={24} className="text-slate-400" />
                        </div>
                        <p className="text-[15px] font-semibold text-slate-600">No visitors found</p>
                        <p className="text-[13px] text-slate-400">Try adjusting your filters or search</p>
                        <button
                          onClick={() => router.push('/visitor-log/new-invite')}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-[13px] font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <Plus size={14} />
                          New Invite
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((visitor, idx) => (
                    <tr
                      key={visitor.id}
                      className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors group ${idx % 2 === 0 ? '' : 'bg-slate-50/30'}`}
                    >
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <button onClick={() => toggleRow(visitor.id)} className="text-slate-400 hover:text-slate-600">
                          {selectedRows.includes(visitor.id)
                            ? <CheckSquare size={16} className="text-primary-600" />
                            : <Square size={16} />
                          }
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/visitor-log/${visitor.id}`} className="flex items-center gap-3 hover:opacity-80">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0 ${visitor.avatarColor}`}>
                            {visitor.initials}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-800 leading-tight group-hover:text-primary-700 transition-colors">{visitor.name}</p>
                            <p className="text-[11px] text-slate-400">{visitor.company}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/visitor-log/${visitor.id}`}>
                          <TypeBadge type={visitor.type} />
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/visitor-log/${visitor.id}`} className="text-[13px] text-slate-600 hover:text-primary-700 transition-colors">
                          {visitor.host}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/visitor-log/${visitor.id}`}>
                          <StatusBadge status={visitor.status} />
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/visitor-log/${visitor.id}`} className="text-[13px] text-slate-600 tabular-nums">
                          {visitor.checkIn}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[13px] tabular-nums font-medium ${visitor.status === 'Checked-In' ? 'text-green-600' : 'text-slate-500'}`}>
                          {visitor.duration}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] text-slate-500">{visitor.gate}</span>
                      </td>
                      <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          {visitor.status === 'Checked-In' && (
                            <button
                              onClick={() => {
                                setVisitors(prev => prev.map(v =>
                                  v.id === visitor.id
                                    ? { ...v, status: 'Checked-Out' as VisitorStatus, checkOut: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
                                    : v
                                ));
                              }}
                              className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                              title="Checkout Visitor"
                            >
                              <LogOut size={12} />
                              Checkout
                            </button>
                          )}
                          <Link
                            href={`/visitor-log/${visitor.id}`}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </Link>
                          <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
              <span className="text-[12px] text-slate-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium transition-colors ${page === p ? 'bg-primary-600 text-white border border-primary-600' : 'border border-slate-200 text-slate-600 hover:bg-white'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
