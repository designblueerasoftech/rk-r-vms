'use client';

import React, { useState, useEffect } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import {
  Sun, Download, RefreshCw, TrendingUp, TrendingDown,
  Users, CalendarCheck, Clock, CalendarPlus, LogOut, AlertOctagon,
  Send, ShieldOff, Tablet, FileDown,
  Eye, UserX, Flag, ChevronRight,
  CheckCircle, AlertTriangle, Shield,
  RefreshCw as RefreshIcon, AlertCircle, CheckCircle2, XCircle,
  MonitorSmartphone, Filter,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';
import StatusBadge from '@/components/ui/StatusBadge';
import VisitorTypeBadge from '@/components/ui/VisitorTypeBadge';

// ─── Mock data scoped to Site A ───────────────────────────────────────────────

const heroMetrics = [
  {
    id: 'metric-visitors-today',
    label: 'TOTAL VISITORS TODAY',
    value: '83',
    change: '+17%',
    trend: 'up' as const,
    sparkData: [40, 52, 48, 61, 70, 78, 83],
    accent: 'blue',
  },
  {
    id: 'metric-live-now',
    label: 'LIVE ON-SITE NOW',
    value: '47',
    change: '+3 in last hour',
    trend: 'up' as const,
    sparkData: [28, 33, 38, 36, 41, 44, 47],
    accent: 'green',
    live: true,
  },
  {
    id: 'metric-at-gate',
    label: 'AT GATE — PENDING',
    value: '6',
    change: 'Avg wait 4 min',
    trend: 'neutral' as const,
    sparkData: [1, 4, 3, 6, 2, 5, 6],
    accent: 'amber',
  },
  {
    id: 'metric-pre-registered',
    label: 'PRE-REGISTERED',
    value: '18',
    change: 'Expected by noon',
    trend: 'neutral' as const,
    sparkData: [10, 12, 14, 15, 16, 17, 18],
    accent: 'purple',
  },
  {
    id: 'metric-checked-out',
    label: 'CHECKED-OUT TODAY',
    value: '14',
    change: '+5 vs yesterday',
    trend: 'up' as const,
    sparkData: [4, 6, 8, 9, 11, 12, 14],
    accent: 'teal',
  },
];

const accentMap: Record<string, { card: string; border: string; icon: string; value: string; bar: string }> = {
  blue:   { card: 'bg-white',        border: 'border-primary-200',  icon: 'bg-primary-50 text-primary-600',  value: 'text-primary-700',  bar: 'bg-primary-600' },
  green:  { card: 'bg-success/10',   border: 'border-success/20',   icon: 'bg-success/10 text-success',      value: 'text-success-text', bar: 'bg-success' },
  amber:  { card: 'bg-warning/10',   border: 'border-warning/20',   icon: 'bg-warning/10 text-warning',      value: 'text-warning-text', bar: 'bg-warning' },
  purple: { card: 'bg-purple-50',    border: 'border-purple-100',   icon: 'bg-purple-50 text-purple-600',    value: 'text-purple-700',   bar: 'bg-purple-500' },
  teal:   { card: 'bg-slate-100',    border: 'border-slate-200',    icon: 'bg-slate-200 text-slate-600',     value: 'text-slate-700',    bar: 'bg-primary-500' },
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts.join(' ')} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

const realTimeMetrics = [
  { id: 'rt-onsite',     icon: <Users size={22} className="text-primary-500" />,      value: '47', label: 'Total On-Site',    sub: '+3 vs yesterday',    subColor: 'text-success-text', border: 'border-primary-200',  valueColor: 'text-primary-700' },
  { id: 'rt-checkedin',  icon: <CalendarCheck size={22} className="text-success" />,  value: '28', label: 'Checked-In',       sub: '+9 in last hour',    subColor: 'text-success-text', border: 'border-success/20',   valueColor: 'text-success-text' },
  { id: 'rt-atgate',     icon: <Clock size={22} className="text-warning" />,          value: '6',  label: 'At Gate',          sub: 'Avg wait: 4 min',    subColor: 'text-warning-text', border: 'border-warning/20',   valueColor: 'text-warning-text' },
  { id: 'rt-prereg',     icon: <CalendarPlus size={22} className="text-purple-500" />,value: '18', label: 'Pre-Registered',   sub: 'Expected by noon',   subColor: 'text-text-muted',   border: 'border-purple-100',   valueColor: 'text-purple-700' },
  { id: 'rt-checkedout', icon: <LogOut size={22} className="text-slate-500" />,       value: '14', label: 'Checked-Out',      sub: 'Today total',        subColor: 'text-text-muted',   border: 'border-slate-200',    valueColor: 'text-slate-700' },
];

const quickActions = [
  { id: 'qa-invite',    icon: <Send size={18} className="text-primary-600" />,      label: 'Create New Invite',  desc: 'Send WhatsApp pre-registration',       bg: 'bg-primary-50',  border: 'border-primary-200', hover: 'hover:bg-primary-100' },
  { id: 'qa-blacklist', icon: <ShieldOff size={18} className="text-red-600" />,     label: 'Add to Watchlist',   desc: 'Block visitor from this site',          bg: 'bg-red-50/60',   border: 'border-red-100',     hover: 'hover:bg-red-50' },
  { id: 'qa-kiosk',     icon: <Tablet size={18} className="text-primary-600" />,    label: 'Manage Kiosks',      desc: 'View & manage site kiosks',             bg: 'bg-primary-50',  border: 'border-primary-200', hover: 'hover:bg-primary-100' },
  { id: 'qa-export',    icon: <FileDown size={18} className="text-purple-600" />,   label: 'Export Site Report', desc: 'Download compliance PDF/CSV',           bg: 'bg-purple-50',   border: 'border-purple-100',  hover: 'hover:bg-purple-100/60' },
];

const trendData = [
  { date: '04 Apr', Total: 62, Contractors: 22, Vendors: 12, Guests: 18, VIP: 5, Delivery: 5 },
  { date: '05 Apr', Total: 71, Contractors: 25, Vendors: 10, Guests: 24, VIP: 7, Delivery: 5 },
  { date: '06 Apr', Total: 54, Contractors: 17, Vendors: 13, Guests: 15, VIP: 4, Delivery: 5 },
  { date: '07 Apr', Total: 79, Contractors: 27, Vendors: 15, Guests: 25, VIP: 7, Delivery: 5 },
  { date: '08 Apr', Total: 74, Contractors: 24, Vendors: 14, Guests: 23, VIP: 8, Delivery: 5 },
  { date: '09 Apr', Total: 88, Contractors: 29, Vendors: 17, Guests: 28, VIP: 9, Delivery: 5 },
  { date: '10 Apr', Total: 83, Contractors: 27, Vendors: 15, Guests: 26, VIP: 8, Delivery: 7 },
];

const trendLines = [
  { key: 'Total',       color: '#2563EB', active: true },
  { key: 'Contractors', color: '#F97316', active: true },
  { key: 'Vendors',     color: '#A855F7', active: true },
  { key: 'Guests',      color: '#3B82F6', active: false },
  { key: 'VIP',         color: '#EAB308', active: false },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl p-3 shadow-dropdown text-[12px]">
      <p className="font-bold text-text-primary mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={`tooltip-${p.dataKey}`} className="flex items-center justify-between gap-4 mb-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-text-secondary">{p.dataKey}</span>
          </div>
          <span className="font-bold tabular-nums text-text-primary">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// Site A zones for occupancy panel
const siteAZones = [
  { id: 'zone-lobby',    name: 'Lobby / Reception',   address: 'Ground Floor',        current: 12, capacity: 50,  pct: 24, alert: false },
  { id: 'zone-floor2',   name: 'Floor 2 – Operations', address: 'East Wing',           current: 18, capacity: 80,  pct: 23, alert: false },
  { id: 'zone-floor3',   name: 'Floor 3 – Tech',       address: 'West Wing',           current: 11, capacity: 60,  pct: 18, alert: false },
  { id: 'zone-conf',     name: 'Conference Rooms',     address: 'Floors 2 & 3',        current: 4,  capacity: 20,  pct: 20, alert: false },
  { id: 'zone-security', name: 'Security Checkpoint',  address: 'Gate B',              current: 2,  capacity: 10,  pct: 20, alert: true  },
];

const recentActivities = [
  { id: 'act-001', initials: 'AM', color: 'bg-blue-500',   name: 'Arjun Mehta',       type: 'Contractor',  host: 'Priya Mehta',    site: 'Site A', gate: 'Gate 1',    status: 'checked-in'     as const, time: '08:47 AM', flagged: false },
  { id: 'act-002', initials: 'PS', color: 'bg-green-500',  name: 'Priya Sharma',      type: 'Vendor',      host: 'Rahul Gupta',    site: 'Site A', gate: 'Gate 2',    status: 'checked-out'    as const, time: '08:43 AM', flagged: false },
  { id: 'act-003', initials: 'RG', color: 'bg-indigo-500', name: 'Rahul Gupta',       type: 'Guest',       host: 'Kavita Joshi',   site: 'Site A', gate: 'Gate 2',    status: 'pre-registered' as const, time: '08:38 AM', flagged: false },
  { id: 'act-004', initials: 'SP', color: 'bg-orange-500', name: 'Sneha Patel',       type: 'Visitor',     host: 'Anand Gupta',    site: 'Site A', gate: 'Main',      status: 'at-gate'        as const, time: '08:31 AM', flagged: true  },
  { id: 'act-005', initials: 'VS', color: 'bg-red-500',    name: 'Vikram Singh',      type: 'Delivery',    host: 'Mailroom',       site: 'Site A', gate: 'Gate 1',    status: 'checked-in'     as const, time: '08:28 AM', flagged: false },
  { id: 'act-006', initials: 'NK', color: 'bg-teal-500',   name: 'Neha Kapoor',       type: 'Interviewee', host: 'HR Team',        site: 'Site A', gate: 'Main',      status: 'invited'        as const, time: '08:22 AM', flagged: false },
  { id: 'act-007', initials: 'DM', color: 'bg-yellow-600', name: 'Deepak Malhotra',   type: 'VIP',         host: 'CEO Office',     site: 'Site A', gate: 'VIP Entry', status: 'checked-in'     as const, time: '08:15 AM', flagged: false },
];

type TabKey = 'all' | 'checked-in' | 'at-gate' | 'pre-registered' | 'invited' | 'checked-out';
const activityTabs: { id: TabKey; label: string; count: number }[] = [
  { id: 'all',            label: 'All',            count: 7 },
  { id: 'checked-in',     label: 'Checked-In',     count: 3 },
  { id: 'at-gate',        label: 'At Gate',        count: 1 },
  { id: 'pre-registered', label: 'Pre-Registered', count: 1 },
  { id: 'invited',        label: 'Invited',        count: 1 },
  { id: 'checked-out',    label: 'Checked-Out',    count: 1 },
];

const complianceItems = [
  { id: 'comp-consent',   label: 'Consent Rate',          sub: 'DPDP Act 2023 · ConsentStamp active',  value: '97.4%',    pct: 97,  status: 'good' as const, action: 'View log' },
  { id: 'comp-pii',       label: 'Pending PII Purge',     sub: 'Due within 7 days — review queue',     value: '12 records', pct: 65, status: 'warn' as const, action: 'Review queue' },
  { id: 'comp-induction', label: 'Induction Completion',  sub: 'Safety video + quiz — this month',     value: '91%',      pct: 91,  status: 'good' as const, action: 'View report' },
  { id: 'comp-audit',     label: 'Audit Trail',           sub: 'All events logged — No gaps',          value: '100%',     pct: 100, status: 'good' as const, action: 'View log' },
  { id: 'comp-dpdp',      label: 'DPDP Act 2023 Compliant', sub: 'Certificate valid · Renews 01 Jan 2027', value: 'Valid', pct: 100, status: 'good' as const, action: 'Download' },
];

const systemSystems = [
  { id: 'sys-kiosk1',  name: 'Lobby Kiosk 1',        sub: 'Site A · Ground Floor · 99.8% uptime',  status: 'connected' as const, lastSync: '1 min ago' },
  { id: 'sys-kiosk2',  name: 'Gate B Kiosk',          sub: 'Site A · Gate B · 98.2% uptime',        status: 'connected' as const, lastSync: '2 mins ago' },
  { id: 'sys-kiosk3',  name: 'Reception Kiosk',       sub: 'Site A · Reception · 94.1% uptime',     status: 'partial'   as const, lastSync: '3 mins ago' },
  { id: 'sys-badge',   name: 'Badge Printer',         sub: 'Brother QL-820NWB · Gate 1',            status: 'connected' as const, lastSync: '3 mins ago' },
  { id: 'sys-access',  name: 'Access Control',        sub: 'HID Origo · Gate 1, 2, B',              status: 'connected' as const, lastSync: '1 min ago' },
];

const statusConfig = {
  connected: { icon: <CheckCircle2 size={16} className="text-success" />,       label: 'Connected', color: 'text-success-text', bg: 'bg-success/10' },
  partial:   { icon: <AlertTriangle size={16} className="text-warning" />,      label: 'Partial',   color: 'text-warning-text', bg: 'bg-warning/10' },
  offline:   { icon: <XCircle size={16} className="text-red-500" />,            label: 'Offline',   color: 'text-red-600',      bg: 'bg-red-50' },
};

const timeFilters = [
  { id: 'tf-today', label: 'Today' },
  { id: 'tf-7d',    label: '7 Days' },
  { id: 'tf-30d',   label: '30 Days' },
  { id: 'tf-custom',label: 'Custom' },
];

// ─── Page Component ────────────────────────────────────────────────────────────

export default function SiteAdminDashboardPage() {
  const { siteName } = useRole();
  const [greeting, setGreeting] = useState('Good morning');
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState('');
  const [activeTime, setActiveTime] = useState('tf-today');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [activeLines, setActiveLines] = useState<Record<string, boolean>>(
    Object.fromEntries(trendLines.map((l) => [l.key, l.active]))
  );
  const [trendRange, setTrendRange] = useState('7d');

  useEffect(() => {
    setLastSync('10 Apr 2026, 08:15 IST');
    const h = new Date()?.getHours();
    if (h >= 12 && h < 17) setGreeting('Good afternoon');
    else if (h >= 17) setGreeting('Good evening');
    else setGreeting('Good morning');
  }, []);

  const toggleLine = (key: string) => setActiveLines((prev) => ({ ...prev, [key]: !prev[key] }));
  const filteredActivities = activeTab === 'all' ? recentActivities : recentActivities.filter((a) => a.status === activeTab);
  const issueCount = systemSystems.filter((s) => s.status !== 'connected').length;
  const totalCurrent = siteAZones.reduce((a, z) => a + z.current, 0);
  const totalCapacity = siteAZones.reduce((a, z) => a + z.capacity, 0);

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Sun size={20} className="text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary leading-tight">
                {greeting}, Reeja
              </h1>
              <p className="text-[12px] text-text-muted mt-0.5">
                {siteName} · Friday, 10 Apr 2026 · 08:15 IST
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-text-muted hidden sm:block">
              Last sync: 2 mins ago · <span className="font-medium text-text-secondary">{lastSync}</span>
            </p>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all duration-150">
              <Download size={13} />
              Export Today
            </button>
            <button
              onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1400); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all duration-150"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Hero Metrics ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-3">
          {heroMetrics.map((m) => {
            const ac = accentMap[m.accent];
            return (
              <div key={m.id} className={`relative ${ac.card} rounded-card border ${ac.border} card-shadow p-4 flex flex-col gap-2 hover:shadow-card-md transition-shadow duration-200`}>
                {m.live && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-success status-dot-pulse" />
                    Live
                  </span>
                )}
                <p className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">{m.label}</p>
                <div className="flex items-end justify-between">
                  <span className={`text-3xl font-bold tabular-nums ${ac.value}`}>{m.value}</span>
                  <MiniSparkline data={m.sparkData} color={m.trend === 'up' ? '#16A34A' : m.trend === 'down' ? '#DC2626' : '#D97706'} />
                </div>
                <div className="flex items-center gap-1">
                  {m.trend === 'up' && <TrendingUp size={11} className="text-success" />}
                  {m.trend === 'down' && <TrendingDown size={11} className="text-red-500" />}
                  <span className={`text-[11px] font-medium ${m.trend === 'up' ? 'text-success-text' : m.trend === 'down' ? 'text-red-600' : 'text-text-muted'}`}>
                    {m.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
              <Filter size={13} />
              <span className="font-medium">Filters</span>
            </div>
            <div className="flex items-center bg-white border border-border rounded-lg p-0.5 gap-0.5">
              {timeFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveTime(f.id)}
                  className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all duration-150 ${
                    activeTime === f.id ? 'bg-primary-600 text-white shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center bg-white border border-border rounded-lg px-3 py-1">
              <span className="text-[12px] font-semibold text-primary-600">{siteName}</span>
              <span className="text-[11px] text-text-muted ml-1.5">(locked)</span>
            </div>
          </div>
          <div className="text-[11px] text-text-muted">
            Last sync: 2 mins ago · <span className="font-medium text-text-secondary">10 Apr 2026, 08:15 IST</span>
          </div>
        </div>

        {/* ── Site Overview Grid (single site) ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-bold text-text-primary">Zone-wise Overview</h2>
              <p className="text-[12px] text-text-muted">Real-time headcount across {siteName} zones</p>
            </div>
            <button className="flex items-center gap-1 text-[12px] font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              View Floor Plan <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-3">
            {siteAZones.map((zone) => (
              <div key={zone.id} className={`bg-white rounded-card card-shadow border border-border border-t-2 ${zone.alert ? 'border-t-warning' : 'border-t-success'} p-4 hover:shadow-card-md transition-shadow duration-200 cursor-pointer`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-text-primary truncate">{zone.name}</p>
                    <p className="text-[11px] text-text-muted truncate">{zone.address}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ml-1 ${zone.alert ? 'bg-warning/10 text-warning-text border border-warning/20' : 'bg-success/10 text-success-text border border-success/20'}`}>
                    {zone.alert ? 'High' : 'Normal'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Users size={14} className="text-text-muted" />
                  <span className="text-2xl font-bold tabular-nums text-text-primary">{zone.current}</span>
                  <span className="text-[11px] text-text-muted">inside now</span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-text-muted mb-1">
                    <span>Occupancy</span>
                    <span className="font-semibold text-text-secondary">{zone.pct}% of {zone.capacity}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${zone.pct > 80 ? 'bg-danger' : zone.pct > 50 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${zone.pct}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <MonitorSmartphone size={12} className="text-text-muted" />
                  <span className="text-[11px] text-text-muted">{siteName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Real-Time Headcount ── */}
        <div className="bg-white rounded-card card-shadow border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-text-primary">Real-Time Headcount</h2>
              <p className="text-[12px] text-text-muted">{siteName} · Live</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all duration-150">
              <AlertOctagon size={13} />
              Evacuation List
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {realTimeMetrics.map((m) => (
              <div key={m.id} className={`bg-white rounded-card border ${m.border} card-shadow p-4 flex flex-col items-center text-center gap-1 hover:shadow-card-md transition-shadow duration-200`}>
                <div className="mb-1">{m.icon}</div>
                <span className={`text-3xl font-bold tabular-nums ${m.valueColor}`}>{m.value}</span>
                <span className="text-[12px] font-semibold text-text-primary">{m.label}</span>
                <span className={`text-[11px] font-medium ${m.subColor}`}>{m.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="text-[14px] font-bold text-text-primary mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {quickActions.map((a) => (
              <button key={a.id} className={`flex items-center gap-3 p-4 rounded-card border ${a.bg} ${a.border} ${a.hover} active:scale-95 transition-all duration-150 text-left group`}>
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">{a.icon}</div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-text-primary truncate">{a.label}</p>
                  <p className="text-[11px] text-text-muted truncate">{a.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Visitor Trends + Site Occupancy ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
          {/* Visitor Trends Chart */}
          <div className="xl:col-span-2 bg-white rounded-card card-shadow border border-border p-5 h-full">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-[15px] font-bold text-text-primary">Visitor Trends</h2>
                <p className="text-[12px] text-text-muted">Daily check-ins by visitor type · {siteName}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {['7d', '14d', '30d'].map((r) => (
                  <button key={`range-${r}`} onClick={() => setTrendRange(r)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all duration-150 ${trendRange === r ? 'bg-primary-600 text-white' : 'bg-surface text-text-secondary hover:bg-primary-50 hover:text-primary-600 border border-border'}`}>
                    {r}
                  </button>
                ))}
                <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all duration-150">
                  <Download size={11} /> Export
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {trendLines.map((l) => (
                <button key={`legend-${l.key}`} onClick={() => toggleLine(l.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150 ${activeLines[l.key] ? 'border-transparent text-white' : 'bg-white border-border text-text-secondary'}`}
                  style={activeLines[l.key] ? { background: l.color } : {}}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />{l.key}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {trendLines.map((l) => activeLines[l.key] ? (
                  <Line key={`line-${l.key}`} type="monotone" dataKey={l.key} stroke={l.color} strokeWidth={l.key === 'Total' ? 2.5 : 1.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                ) : null)}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Site Occupancy Panel */}
          <div className="xl:col-span-1 bg-white rounded-card card-shadow border border-border p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[15px] font-bold text-text-primary">Zone Occupancy</h2>
              <button className="flex items-center gap-0.5 text-[12px] font-semibold text-primary-600 hover:text-primary-700">
                All Zones <ChevronRight size={13} />
              </button>
            </div>
            <p className="text-[12px] text-text-muted mb-4">{totalCurrent} / {totalCapacity} total capacity · {siteName}</p>
            <div className="space-y-3 flex-1">
              {siteAZones.map((zone) => (
                <div key={zone.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] font-semibold text-text-primary truncate">{zone.name}</p>
                        {zone.alert && <span className="shrink-0 text-[9px] font-bold text-warning-text bg-warning/10 px-1.5 py-0.5 rounded-full border border-warning/20">HIGH</span>}
                      </div>
                      <p className="text-[10px] text-text-muted truncate">{zone.address}</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[14px] font-bold tabular-nums text-text-primary">{zone.current}</span>
                      <span className="text-[11px] text-text-muted"> / {zone.capacity}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${zone.pct > 80 ? 'bg-danger' : zone.pct > 50 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${zone.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">{zone.pct}% capacity</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Activity Feed ── */}
        <div className="bg-white rounded-card card-shadow border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success status-dot-pulse" />
              <h2 className="text-[15px] font-bold text-text-primary">Recent Activity</h2>
              <span className="text-[12px] text-text-muted">Last 30 minutes · {siteName}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors">
                <RefreshCw size={12} /> Refresh
              </button>
              <button className="flex items-center gap-1 text-[12px] font-semibold text-primary-600 hover:text-primary-700">
                View Full Log <ChevronRight size={12} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 px-5 py-2 border-b border-border overflow-x-auto scrollbar-thin">
            {activityTabs.map((tab) => (
              <button key={`tab-${tab.id}`} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all duration-150 ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}>
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-text-muted'}`}>{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['VISITOR', 'TYPE', 'HOST', 'SITE / GATE', 'STATUS', 'TIME', 'ACTIONS'].map((col) => (
                    <th key={`th-${col}`} className="px-5 py-2.5 text-left text-[10px] font-semibold tracking-widest text-text-muted uppercase whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((row) => (
                  <tr key={row.id} onMouseEnter={() => setHoveredRow(row.id)} onMouseLeave={() => setHoveredRow(null)}
                    className={`border-b border-border/50 transition-colors duration-100 ${hoveredRow === row.id ? 'bg-primary-50/40' : ''}`}>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full ${row.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{row.initials}</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[13px] font-semibold text-text-primary whitespace-nowrap">{row.name}</span>
                            {row.flagged && <Flag size={11} className="text-warning fill-warning" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2.5"><VisitorTypeBadge type={row.type as any} /></td>
                    <td className="px-5 py-2.5"><span className="text-[13px] text-text-secondary whitespace-nowrap">{row.host}</span></td>
                    <td className="px-5 py-2.5">
                      <p className="text-[12px] font-medium text-text-primary whitespace-nowrap">{row.site}</p>
                      <p className="text-[11px] text-text-muted">{row.gate}</p>
                    </td>
                    <td className="px-5 py-2.5"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-2.5"><span className="text-[12px] font-mono tabular-nums text-text-secondary whitespace-nowrap">{row.time}</span></td>
                    <td className="px-5 py-2.5">
                      <div className={`flex items-center gap-1 transition-opacity duration-150 ${hoveredRow === row.id ? 'opacity-100' : 'opacity-0'}`}>
                        <button className="w-7 h-7 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center transition-colors" title="View details">
                          <Eye size={13} className="text-primary-600" />
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors" title="Flag visitor">
                          <UserX size={13} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 flex items-center justify-between border-t border-border">
            <p className="text-[12px] text-text-muted">Showing {filteredActivities.length} of {recentActivities.length} recent events</p>
            <button className="text-[12px] font-semibold text-primary-600 hover:text-primary-700 transition-colors">Open full visitor log →</button>
          </div>
        </div>

        {/* ── Compliance Snapshot + System Health ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pb-4">
          {/* Compliance Snapshot */}
          <div className="bg-white rounded-card card-shadow border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Shield size={16} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-text-primary">Compliance Snapshot</h2>
                  <p className="text-[12px] text-text-muted">DPDP Act 2023 · {siteName} · Today</p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-[12px] font-semibold text-primary-600 hover:text-primary-700">
                Full Report <ChevronRight size={13} />
              </button>
            </div>
            <div className="space-y-3">
              {complianceItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="shrink-0">
                    {item.status === 'good' ? <CheckCircle size={16} className="text-success" /> : <AlertTriangle size={16} className="text-warning" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[13px] font-semibold text-text-primary">{item.label}</p>
                      <span className={`text-[12px] font-bold tabular-nums shrink-0 ml-2 ${item.status === 'warn' ? 'text-warning-text' : 'text-success-text'}`}>{item.value}</span>
                    </div>
                    <p className="text-[11px] text-text-muted mb-1">{item.sub}</p>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${item.status === 'warn' ? 'bg-warning' : 'bg-success'}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                  <button className="shrink-0 text-[11px] font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap">{item.action} →</button>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-card card-shadow border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${issueCount > 0 ? 'bg-warning/10' : 'bg-success/10'}`}>
                  <AlertCircle size={16} className={issueCount > 0 ? 'text-warning' : 'text-success'} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-bold text-text-primary">System Health</h2>
                    {issueCount > 0 && (
                      <span className="text-[10px] font-bold text-warning-text bg-warning/10 border border-warning/20 px-1.5 py-0.5 rounded-full">{issueCount} Issue</span>
                    )}
                  </div>
                  <p className="text-[12px] text-text-muted">{siteName} · Last sync: 2 mins ago</p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors">
                <RefreshIcon size={12} /> Refresh Status
              </button>
            </div>
            <div className="space-y-2">
              {systemSystems.map((sys) => {
                const cfg = statusConfig[sys.status];
                return (
                  <div key={sys.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-border hover:bg-surface/50 transition-all duration-150">
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>{cfg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-text-primary">{sys.name}</p>
                      <p className="text-[11px] text-text-muted truncate">{sys.sub}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-[12px] font-bold ${cfg.color}`}>{cfg.label}</p>
                      <p className="text-[10px] text-text-muted">{sys.lastSync}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </SiteAdminLayout>
  );
}
