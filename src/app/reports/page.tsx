'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Download, FileText, HelpCircle, ChevronDown, ChevronUp, TrendingUp, TrendingDown, AlertTriangle, Users, Clock, Shield, BarChart2, Activity, Eye, X, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, Calendar, CheckCircle, XCircle, AlertCircle, Zap, MapPin,  } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const visitorTrendData = [
  { date: '01 Apr', Total: 98, PreRegistered: 62, CheckedIn: 80, NoShow: 18 },
  { date: '02 Apr', Total: 112, PreRegistered: 70, CheckedIn: 95, NoShow: 17 },
  { date: '03 Apr', Total: 87, PreRegistered: 55, CheckedIn: 72, NoShow: 15 },
  { date: '04 Apr', Total: 134, PreRegistered: 88, CheckedIn: 115, NoShow: 19 },
  { date: '05 Apr', Total: 156, PreRegistered: 102, CheckedIn: 138, NoShow: 18 },
  { date: '06 Apr', Total: 143, PreRegistered: 94, CheckedIn: 124, NoShow: 19 },
  { date: '07 Apr', Total: 128, PreRegistered: 82, CheckedIn: 110, NoShow: 18 },
  { date: '08 Apr', Total: 165, PreRegistered: 110, CheckedIn: 144, NoShow: 21 },
  { date: '09 Apr', Total: 172, PreRegistered: 115, CheckedIn: 150, NoShow: 22 },
  { date: '10 Apr', Total: 148, PreRegistered: 96, CheckedIn: 128, NoShow: 20 },
  { date: '11 Apr', Total: 139, PreRegistered: 90, CheckedIn: 120, NoShow: 19 },
  { date: '12 Apr', Total: 161, PreRegistered: 108, CheckedIn: 140, NoShow: 21 },
  { date: '13 Apr', Total: 177, PreRegistered: 118, CheckedIn: 155, NoShow: 22 },
  { date: '14 Apr', Total: 154, PreRegistered: 100, CheckedIn: 133, NoShow: 21 },
];

const peakHoursData = [
  { hour: '00', visitors: 2 }, { hour: '01', visitors: 1 }, { hour: '02', visitors: 0 },
  { hour: '03', visitors: 0 }, { hour: '04', visitors: 1 }, { hour: '05', visitors: 3 },
  { hour: '06', visitors: 8 }, { hour: '07', visitors: 22 }, { hour: '08', visitors: 58 },
  { hour: '09', visitors: 87 }, { hour: '10', visitors: 72 }, { hour: '11', visitors: 65 },
  { hour: '12', visitors: 48 }, { hour: '13', visitors: 55 }, { hour: '14', visitors: 68 },
  { hour: '15', visitors: 74 }, { hour: '16', visitors: 62 }, { hour: '17', visitors: 45 },
  { hour: '18', visitors: 28 }, { hour: '19', visitors: 15 }, { hour: '20', visitors: 9 },
  { hour: '21', visitors: 5 }, { hour: '22', visitors: 3 }, { hour: '23', visitors: 2 },
];

const inductionPieData = [
  { name: 'Completed', value: 68, color: '#16A34A' },
  { name: 'Partial', value: 22, color: '#D97706' },
  { name: 'Skipped', value: 10, color: '#DC2626' },
];

const consentBarData = [
  { type: 'Contractor', rate: 94 },
  { type: 'Vendor', rate: 88 },
  { type: 'Guest', rate: 76 },
  { type: 'VIP', rate: 99 },
  { type: 'Delivery', rate: 82 },
  { type: 'Intern', rate: 91 },
];

const noShowTrendData = [
  { date: '01 Apr', Contractor: 4, Vendor: 3, Guest: 8, VIP: 1 },
  { date: '04 Apr', Contractor: 5, Vendor: 2, Guest: 9, VIP: 0 },
  { date: '07 Apr', Contractor: 3, Vendor: 4, Guest: 7, VIP: 1 },
  { date: '10 Apr', Contractor: 6, Vendor: 3, Guest: 10, VIP: 2 },
  { date: '13 Apr', Contractor: 4, Vendor: 2, Guest: 8, VIP: 1 },
];

const headcountData = [
  { time: '08:00', OnSite: 12 }, { time: '09:00', OnSite: 45 }, { time: '10:00', OnSite: 78 },
  { time: '11:00', OnSite: 92 }, { time: '12:00', OnSite: 85 }, { time: '13:00', OnSite: 88 },
  { time: '14:00', OnSite: 95 }, { time: '15:00', OnSite: 102 }, { time: '16:00', OnSite: 88 },
  { time: '17:00', OnSite: 65 }, { time: '18:00', OnSite: 34 }, { time: '19:00', OnSite: 18 },
];

const visitorTrendRows = [
  { date: '14 Apr 2025', total: 154, checkedIn: 133, preRegistered: 100, noShow: 21, avgInduction: '4m 32s' },
  { date: '13 Apr 2025', total: 177, checkedIn: 155, preRegistered: 118, noShow: 22, avgInduction: '4m 18s' },
  { date: '12 Apr 2025', total: 161, checkedIn: 140, preRegistered: 108, noShow: 21, avgInduction: '4m 45s' },
  { date: '11 Apr 2025', total: 139, checkedIn: 120, preRegistered: 90, noShow: 19, avgInduction: '5m 02s' },
  { date: '10 Apr 2025', total: 148, checkedIn: 128, preRegistered: 96, noShow: 20, avgInduction: '4m 55s' },
  { date: '09 Apr 2025', total: 172, checkedIn: 150, preRegistered: 115, noShow: 22, avgInduction: '4m 28s' },
  { date: '08 Apr 2025', total: 165, checkedIn: 144, preRegistered: 110, noShow: 21, avgInduction: '4m 38s' },
  { date: '07 Apr 2025', total: 128, checkedIn: 110, preRegistered: 82, noShow: 18, avgInduction: '5m 10s' },
  { date: '06 Apr 2025', total: 143, checkedIn: 124, preRegistered: 94, noShow: 19, avgInduction: '4m 52s' },
  { date: '05 Apr 2025', total: 156, checkedIn: 138, preRegistered: 102, noShow: 18, avgInduction: '4m 22s' },
];

const complianceRows = [
  { name: 'Rajesh Kumar', date: '14 Apr 2025', inductionSteps: '5/5', consentStamp: 'Verified', docsSigned: 3, purgeStatus: 'Active' },
  { name: 'Priya Sharma', date: '14 Apr 2025', inductionSteps: '3/5', consentStamp: 'Pending', docsSigned: 1, purgeStatus: 'Active' },
  { name: 'Amit Patel', date: '13 Apr 2025', inductionSteps: '5/5', consentStamp: 'Verified', docsSigned: 3, purgeStatus: 'Active' },
  { name: 'Sunita Rao', date: '13 Apr 2025', inductionSteps: '0/5', consentStamp: 'Skipped', docsSigned: 0, purgeStatus: 'Flagged' },
  { name: 'Vikram Singh', date: '12 Apr 2025', inductionSteps: '5/5', consentStamp: 'Verified', docsSigned: 2, purgeStatus: 'Active' },
  { name: 'Meena Iyer', date: '12 Apr 2025', inductionSteps: '4/5', consentStamp: 'Partial', docsSigned: 2, purgeStatus: 'Active' },
  { name: 'Arjun Nair', date: '11 Apr 2025', inductionSteps: '5/5', consentStamp: 'Verified', docsSigned: 3, purgeStatus: 'Due Soon' },
  { name: 'Deepa Menon', date: '11 Apr 2025', inductionSteps: '2/5', consentStamp: 'Pending', docsSigned: 0, purgeStatus: 'Active' },
  { name: 'Kiran Joshi', date: '10 Apr 2025', inductionSteps: '5/5', consentStamp: 'Verified', docsSigned: 3, purgeStatus: 'Active' },
  { name: 'Ananya Gupta', date: '10 Apr 2025', inductionSteps: '5/5', consentStamp: 'Verified', docsSigned: 2, purgeStatus: 'Active' },
];

const noShowRows = [
  { visitor: 'Rahul Mehta', inviteDate: '12 Apr 2025', expectedDate: '14 Apr 2025', status: 'No-Show', reason: 'Not provided', host: 'Sanjay Kapoor' },
  { visitor: 'Pooja Verma', inviteDate: '11 Apr 2025', expectedDate: '13 Apr 2025', status: 'No-Show', reason: 'Cancelled by visitor', host: 'Neha Sharma' },
  { visitor: 'Suresh Babu', inviteDate: '10 Apr 2025', expectedDate: '12 Apr 2025', status: 'No-Show', reason: 'Not provided', host: 'Ravi Kumar' },
  { visitor: 'Kavita Reddy', inviteDate: '09 Apr 2025', expectedDate: '11 Apr 2025', status: 'No-Show', reason: 'Rescheduled', host: 'Anil Desai' },
  { visitor: 'Manoj Tiwari', inviteDate: '08 Apr 2025', expectedDate: '10 Apr 2025', status: 'No-Show', reason: 'Not provided', host: 'Priya Nair' },
  { visitor: 'Lakshmi Pillai', inviteDate: '07 Apr 2025', expectedDate: '09 Apr 2025', status: 'No-Show', reason: 'Emergency', host: 'Vijay Menon' },
  { visitor: 'Dinesh Choudhary', inviteDate: '06 Apr 2025', expectedDate: '08 Apr 2025', status: 'No-Show', reason: 'Not provided', host: 'Smita Joshi' },
  { visitor: 'Rekha Nambiar', inviteDate: '05 Apr 2025', expectedDate: '07 Apr 2025', status: 'No-Show', reason: 'Cancelled by host', host: 'Deepak Rao' },
];

const headcountRows = [
  { datetime: '14 Apr 2025 15:00', onSite: 102, checkedIn: 88, preRegistered: 14, atGate: 5, evacReady: true },
  { datetime: '14 Apr 2025 14:00', onSite: 95, checkedIn: 82, preRegistered: 13, atGate: 3, evacReady: true },
  { datetime: '14 Apr 2025 11:00', onSite: 92, checkedIn: 79, preRegistered: 13, atGate: 4, evacReady: true },
  { datetime: '14 Apr 2025 09:00', onSite: 45, checkedIn: 38, preRegistered: 7, atGate: 2, evacReady: true },
  { datetime: '13 Apr 2025 15:00', onSite: 118, checkedIn: 102, preRegistered: 16, atGate: 6, evacReady: true },
  { datetime: '13 Apr 2025 11:00', onSite: 108, checkedIn: 94, preRegistered: 14, atGate: 4, evacReady: true },
  { datetime: '12 Apr 2025 15:00', onSite: 97, checkedIn: 84, preRegistered: 13, atGate: 3, evacReady: true },
  { datetime: '11 Apr 2025 15:00', onSite: 88, checkedIn: 76, preRegistered: 12, atGate: 2, evacReady: true },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'visitor-trends' | 'peak-hours' | 'compliance' | 'no-show' | 'headcount';

// ─── Sub-components ───────────────────────────────────────────────────────────

function HelpIcon({ tip }: { tip: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-text-muted hover:text-primary-500 transition-colors"
      >
        <HelpCircle size={13} />
      </button>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-800 text-white text-[11px] rounded-lg px-3 py-2 shadow-modal leading-relaxed">
          {tip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, sub, icon, color, tip }: {
  label: string; value: string; sub?: string; icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple'; tip: string;
}) {
  const colorMap = {
    blue: 'bg-primary-50 text-primary-600 border-primary-100',
    green: 'bg-success/10 text-success border-success/20',
    amber: 'bg-warning/10 text-warning border-warning/20',
    red: 'bg-danger/10 text-danger border-danger/20',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };
  const valMap = {
    blue: 'text-primary-700', green: 'text-success-text',
    amber: 'text-warning-text', red: 'text-danger-text', purple: 'text-purple-700',
  };
  return (
    <div className="bg-white rounded-card border border-border shadow-card p-4 flex items-start gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <p className="text-[10px] font-semibold tracking-widest text-text-muted uppercase truncate">{label}</p>
          <HelpIcon tip={tip} />
        </div>
        <p className={`text-2xl font-bold tabular-nums ${valMap[color]}`}>{value}</p>
        {sub && <p className="text-[11px] text-text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl p-3 shadow-dropdown text-[12px]">
      <p className="font-bold text-text-primary mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={`tt-${p.dataKey}`} className="flex items-center justify-between gap-4 mb-0.5">
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

function ExportTabButton() {
  return (
    <div className="flex items-center gap-2">
      <HelpIcon tip="Export the current tab's data as CSV or PDF for audit and reporting purposes." />
      <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-all">
        <Download size={13} /> CSV
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
        <FileText size={13} /> PDF
      </button>
    </div>
  );
}

function Pagination({ total, page, perPage, onPage, onPerPage }: {
  total: number; page: number; perPage: number;
  onPage: (p: number) => void; onPerPage: (n: number) => void;
}) {
  const pages = Math.ceil(total / perPage);
  return (
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
      <div className="flex items-center gap-2 text-[12px] text-text-secondary">
        <span>Show</span>
        {[10, 25, 50].map(n => (
          <button key={n} onClick={() => onPerPage(n)}
            className={`px-2 py-0.5 rounded border text-[11px] font-medium transition-all ${perPage === n ? 'bg-primary-600 text-white border-primary-600' : 'border-border hover:bg-surface'}`}>
            {n}
          </button>
        ))}
        <span className="text-text-muted">of {total} records</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
          className="p-1 rounded border border-border hover:bg-surface disabled:opacity-40 transition-all">
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onPage(p)}
            className={`w-7 h-7 rounded border text-[12px] font-medium transition-all ${page === p ? 'bg-primary-600 text-white border-primary-600' : 'border-border hover:bg-surface text-text-secondary'}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onPage(Math.min(pages, page + 1))} disabled={page === pages}
          className="p-1 rounded border border-border hover:bg-surface disabled:opacity-40 transition-all">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ row, onClose }: { row: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-text-primary">Visit Details</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {Object.entries(row).map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
              <span className="text-[12px] font-semibold text-text-muted capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-[13px] font-medium text-text-primary text-right">{String(v)}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-5 w-full py-2 bg-primary-600 text-white rounded-lg text-[13px] font-semibold hover:bg-primary-700 transition-all">
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Visitor Trends ──────────────────────────────────────────────────────

function VisitorTrendsTab() {
  const [activeLines, setActiveLines] = useState({ Total: true, PreRegistered: true, CheckedIn: true, NoShow: true });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modal, setModal] = useState<any>(null);

  const lines = [
    { key: 'Total', color: '#405189' },
    { key: 'PreRegistered', color: '#A855F7' },
    { key: 'CheckedIn', color: '#16A34A' },
    { key: 'NoShow', color: '#DC2626' },
  ];

  const totalVisitors = visitorTrendRows.reduce((s, r) => s + r.total, 0);
  const avgPerDay = Math.round(totalVisitors / visitorTrendRows.length);
  const peakDay = visitorTrendRows.reduce((a, b) => a.total > b.total ? a : b);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-card border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-text-primary">Daily Visitors</h3>
            <HelpIcon tip="Line chart showing daily visitor counts with optional overlays for Pre-Registered, Checked-In, and No-Show visitors." />
          </div>
          <ExportTabButton />
        </div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {lines.map(l => (
            <button key={l.key}
              onClick={() => setActiveLines(prev => ({ ...prev, [l.key]: !prev[l.key as keyof typeof prev] }))}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${activeLines[l.key as keyof typeof activeLines] ? 'text-white border-transparent' : 'bg-white border-border text-text-muted'}`}
              style={activeLines[l.key as keyof typeof activeLines] ? { background: l.color } : {}}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />{l.key}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={visitorTrendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {lines.map(l => activeLines[l.key as keyof typeof activeLines] ? (
              <Line key={l.key} type="natural" dataKey={l.key} stroke={l.color}
                strokeWidth={l.key === 'Total' ? 1.5 : 1} strokeOpacity={l.key === 'Total' ? 0.85 : 0.65} dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
            ) : null)}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Total Visitors" value={totalVisitors.toLocaleString()} sub="Last 14 days" icon={<Users size={16} />} color="blue" tip="Total unique visitors across the selected date range." />
        <SummaryCard label="Average per Day" value={avgPerDay.toString()} sub="Daily average" icon={<TrendingUp size={16} />} color="green" tip="Average number of visitors per day in the selected period." />
        <SummaryCard label="Peak Day" value={peakDay.total.toString()} sub={peakDay.date} icon={<Zap size={16} />} color="amber" tip="The day with the highest visitor count in the selected range." />
      </div>

      <div className="bg-white rounded-card border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-text-primary">Visitor Log</h3>
            <HelpIcon tip="Detailed daily breakdown. Click any row to view full details. All columns are sortable and exportable." />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border">
                {['Date', 'Total Visitors', 'Checked-In', 'Pre-Registered', 'No-Show', 'Avg Induction Time', 'Actions'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    <div className="flex items-center gap-1">{h} {h !== 'Actions' && <ArrowUpDown size={10} className="text-text-muted/50" />}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visitorTrendRows.slice((page - 1) * perPage, page * perPage).map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface transition-colors cursor-pointer" onClick={() => setModal(row)}>
                  <td className="py-2.5 px-3 font-medium text-text-primary">{row.date}</td>
                  <td className="py-2.5 px-3 font-bold text-primary-700">{row.total}</td>
                  <td className="py-2.5 px-3 text-success-text font-medium">{row.checkedIn}</td>
                  <td className="py-2.5 px-3 text-purple-600 font-medium">{row.preRegistered}</td>
                  <td className="py-2.5 px-3 text-danger-text font-medium">{row.noShow}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{row.avgInduction}</td>
                  <td className="py-2.5 px-3">
                    <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-[11px]">
                      <Eye size={12} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={visitorTrendRows.length} page={page} perPage={perPage} onPage={setPage} onPerPage={n => { setPerPage(n); setPage(1); }} />
      </div>
      {modal && <DetailModal row={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── Tab: Peak Hours ──────────────────────────────────────────────────────────

function PeakHoursTab() {
  const [modal, setModal] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const peakHour = peakHoursData.reduce((a, b) => a.visitors > b.visitors ? a : b);
  const totalVisitors = peakHoursData.reduce((s, r) => s + r.visitors, 0);

  const peakTableRows = peakHoursData.filter(r => r.visitors > 0).map(r => ({
    hour: `${r.hour}:00`,
    total: r.visitors,
    pct: `${Math.round((r.visitors / totalVisitors) * 100)}%`,
    type: r.visitors > 50 ? 'Contractor' : r.visitors > 20 ? 'Guest' : 'Vendor',
  }));

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-card border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-text-primary">Hourly Visitor Distribution</h3>
            <HelpIcon tip="Bar chart showing average visitors per hour across the selected date range. Helps identify peak operational hours." />
          </div>
          <ExportTabButton />
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={peakHoursData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="visitors" radius={[4, 4, 0, 0]}>
              {peakHoursData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.visitors > 60 ? '#405189' : entry.visitors > 30 ? '#6878ba' : '#b3bade'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary-600 inline-block" /> Peak (&gt;60)</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary-400 inline-block" /> Moderate (30–60)</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary-200 inline-block" /> Low (&lt;30)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Peak Hour" value={`${peakHour.hour}:00`} sub={`${peakHour.visitors} visitors`} icon={<Clock size={16} />} color="blue" tip="The hour with the highest average visitor count." />
        <SummaryCard label="Total Daily Visitors" value={totalVisitors.toString()} sub="Across all hours" icon={<Users size={16} />} color="green" tip="Total visitors across all hours in the selected period." />
        <SummaryCard label="Busiest Period" value="09:00–10:00" sub="Morning rush" icon={<Activity size={16} />} color="amber" tip="The busiest 1-hour window based on average traffic." />
      </div>

      <div className="bg-white rounded-card border border-border shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[14px] font-bold text-text-primary">Hourly Breakdown</h3>
          <HelpIcon tip="Detailed hourly breakdown with percentage of daily total and most common visitor type per hour." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border">
                {['Hour', 'Total Visitors', '% of Daily Total', 'Most Common Type', 'Actions'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    <div className="flex items-center gap-1">{h} {h !== 'Actions' && <ArrowUpDown size={10} className="text-text-muted/50" />}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peakTableRows.slice((page - 1) * perPage, page * perPage).map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface transition-colors cursor-pointer" onClick={() => setModal(row)}>
                  <td className="py-2.5 px-3 font-bold text-text-primary">{row.hour}</td>
                  <td className="py-2.5 px-3 font-medium text-primary-700">{row.total}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{row.pct}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[11px] font-medium">{row.type}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-[11px]">
                      <Eye size={12} /> Drill Down
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={peakTableRows.length} page={page} perPage={perPage} onPage={setPage} onPerPage={n => { setPerPage(n); setPage(1); }} />
      </div>
      {modal && <DetailModal row={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── Tab: Compliance Report ───────────────────────────────────────────────────

function ComplianceTab() {
  const [modal, setModal] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-card border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-bold text-text-primary">Induction Completion Rate</h3>
              <HelpIcon tip="Pie chart showing the proportion of visitors who completed, partially completed, or skipped the induction process." />
            </div>
            <ExportTabButton />
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={inductionPieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={renderCustomLabel}>
                  {inductionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any, name: any) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {inductionPieData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-[12px] text-text-secondary">{d.name}</span>
                  <span className="text-[12px] font-bold text-text-primary ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card border border-border shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-[14px] font-bold text-text-primary">Consent Rate by Visitor Type</h3>
            <HelpIcon tip="Bar chart showing the percentage of visitors who provided consent, broken down by visitor type." />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={consentBarData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="type" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Consent Rate']} />
              <Bar dataKey="rate" fill="#405189" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Overall Consent Rate" value="88.4%" sub="+2.1% vs last period" icon={<CheckCircle size={16} />} color="green" tip="Percentage of all visitors who provided valid consent during their visit." />
        <SummaryCard label="Induction Completion" value="68%" sub="32% partial or skipped" icon={<Shield size={16} />} color="blue" tip="Percentage of visitors who completed all induction steps." />
        <SummaryCard label="Pending Purge Records" value="23" sub="Due within 30 days" icon={<AlertTriangle size={16} />} color="amber" tip="Number of visitor records scheduled for PII purge in the next 30 days per DPDP policy." />
      </div>

      <div className="bg-white rounded-card border border-border shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[14px] font-bold text-text-primary">Compliance Details</h3>
          <HelpIcon tip="Detailed compliance records per visitor. All fields are exportable for audit purposes." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border">
                {['Visitor Name', 'Visit Date', 'Induction Steps', 'ConsentStamp', 'Docs Signed', 'PII Purge Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    <div className="flex items-center gap-1">{h} {h !== 'Actions' && <ArrowUpDown size={10} className="text-text-muted/50" />}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complianceRows.slice((page - 1) * perPage, page * perPage).map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface transition-colors cursor-pointer" onClick={() => setModal(row)}>
                  <td className="py-2.5 px-3 font-medium text-text-primary">{row.name}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{row.date}</td>
                  <td className="py-2.5 px-3">
                    <span className={`font-medium ${row.inductionSteps === '5/5' ? 'text-success-text' : row.inductionSteps === '0/5' ? 'text-danger-text' : 'text-warning-text'}`}>
                      {row.inductionSteps}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${row.consentStamp === 'Verified' ? 'bg-success/10 text-success-text' : row.consentStamp === 'Skipped' ? 'bg-danger/10 text-danger-text' : 'bg-warning/10 text-warning-text'}`}>
                      {row.consentStamp}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary">{row.docsSigned}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${row.purgeStatus === 'Active' ? 'bg-success/10 text-success-text' : row.purgeStatus === 'Flagged' ? 'bg-danger/10 text-danger-text' : 'bg-warning/10 text-warning-text'}`}>
                      {row.purgeStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-[11px]">
                      <Eye size={12} /> Audit Trail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={complianceRows.length} page={page} perPage={perPage} onPage={setPage} onPerPage={n => { setPerPage(n); setPage(1); }} />
      </div>
      {modal && <DetailModal row={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── Tab: No-Show Analysis ────────────────────────────────────────────────────

function NoShowTab() {
  const [modal, setModal] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const lines = [
    { key: 'Contractor', color: '#405189' },
    { key: 'Vendor', color: '#A855F7' },
    { key: 'Guest', color: '#DC2626' },
    { key: 'VIP', color: '#D97706' },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-card border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-text-primary">No-Show Trend Over Time</h3>
            <HelpIcon tip="Line chart showing no-show trends broken down by visitor type over the selected date range." />
          </div>
          <ExportTabButton />
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={noShowTrendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {lines.map(l => (
              <Line key={l.key} type="monotone" dataKey={l.key} stroke={l.color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5, strokeWidth: 0 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Total No-Shows" value="8" sub="Last 14 days" icon={<XCircle size={16} />} color="red" tip="Total number of invited visitors who did not show up in the selected period." />
        <SummaryCard label="No-Show Rate" value="13.2%" sub="-1.4% vs last period" icon={<TrendingDown size={16} />} color="amber" tip="Percentage of all invited visitors who did not check in." />
        <SummaryCard label="Top Reason" value="Not Provided" sub="42% of no-shows" icon={<AlertCircle size={16} />} color="purple" tip="The most frequently cited reason for no-shows, if captured at invite cancellation." />
      </div>

      <div className="bg-white rounded-card border border-border shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[14px] font-bold text-text-primary">No-Show Records</h3>
          <HelpIcon tip="Detailed list of all no-show incidents with invite details, expected dates, and host information." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border">
                {['Invited Visitor', 'Invite Date', 'Expected Date', 'Status', 'Reason', 'Host Name', 'Actions'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    <div className="flex items-center gap-1">{h} {h !== 'Actions' && <ArrowUpDown size={10} className="text-text-muted/50" />}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {noShowRows.slice((page - 1) * perPage, page * perPage).map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface transition-colors cursor-pointer" onClick={() => setModal(row)}>
                  <td className="py-2.5 px-3 font-medium text-text-primary">{row.visitor}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{row.inviteDate}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{row.expectedDate}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 bg-danger/10 text-danger-text rounded-full text-[11px] font-semibold">{row.status}</span>
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary italic">{row.reason}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{row.host}</td>
                  <td className="py-2.5 px-3">
                    <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-[11px]">
                      <Eye size={12} /> View Invite
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={noShowRows.length} page={page} perPage={perPage} onPage={setPage} onPerPage={n => { setPerPage(n); setPage(1); }} />
      </div>
      {modal && <DetailModal row={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── Tab: Headcount History ───────────────────────────────────────────────────

function HeadcountTab() {
  const [modal, setModal] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const peakHeadcount = headcountData.reduce((a, b) => a.OnSite > b.OnSite ? a : b);
  const avgOnSite = Math.round(headcountData.reduce((s, r) => s + r.OnSite, 0) / headcountData.length);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-card border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-text-primary">Real-Time Headcount Over Period</h3>
            <HelpIcon tip="Line chart showing the number of checked-in visitors on-site at each hour across the selected date range." />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-danger border border-danger/30 rounded-lg hover:bg-danger/5 transition-all">
              <Download size={13} /> Evacuation List (CSV)
            </button>
            <ExportTabButton />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={headcountData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="OnSite" stroke="#405189" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Peak Headcount" value={peakHeadcount.OnSite.toString()} sub={`At ${peakHeadcount.time}`} icon={<Users size={16} />} color="blue" tip="The highest number of visitors on-site simultaneously in the selected period." />
        <SummaryCard label="Average On-Site" value={avgOnSite.toString()} sub="Hourly average" icon={<Activity size={16} />} color="green" tip="Average number of visitors on-site per hour across the selected date range." />
        <div className="bg-white rounded-card border border-border shadow-card p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border bg-success/10 text-success border-success/20">
            <Zap size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <p className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">Current Live Headcount</p>
              <HelpIcon tip="Live count of visitors currently checked in and on-site right now." />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold tabular-nums text-success-text">47</p>
              <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live
              </span>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">Updated just now</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-card border border-border shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[14px] font-bold text-text-primary">Headcount History</h3>
          <HelpIcon tip="Historical headcount snapshots. Use the Evacuation List button to download a real-time list of all on-site visitors." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border">
                {['Date / Time', 'Total On-Site', 'Checked-In', 'Pre-Registered', 'At Gate', 'Evacuation List'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    <div className="flex items-center gap-1">{h} {!['Evacuation List'].includes(h) && <ArrowUpDown size={10} className="text-text-muted/50" />}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {headcountRows.slice((page - 1) * perPage, page * perPage).map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface transition-colors cursor-pointer" onClick={() => setModal(row)}>
                  <td className="py-2.5 px-3 font-medium text-text-primary">{row.datetime}</td>
                  <td className="py-2.5 px-3 font-bold text-primary-700">{row.onSite}</td>
                  <td className="py-2.5 px-3 text-success-text font-medium">{row.checkedIn}</td>
                  <td className="py-2.5 px-3 text-purple-600 font-medium">{row.preRegistered}</td>
                  <td className="py-2.5 px-3 text-warning-text font-medium">{row.atGate}</td>
                  <td className="py-2.5 px-3">
                    <button className="flex items-center gap-1 px-2.5 py-1 bg-danger/10 text-danger-text rounded-lg text-[11px] font-semibold hover:bg-danger/20 transition-all">
                      <Download size={11} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={headcountRows.length} page={page} perPage={perPage} onPage={setPage} onPerPage={n => { setPerPage(n); setPage(1); }} />
      </div>
      {modal && <DetailModal row={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'visitor-trends', label: 'Visitor Trends', icon: <TrendingUp size={14} /> },
  { id: 'peak-hours', label: 'Peak Hours', icon: <BarChart2 size={14} /> },
  { id: 'compliance', label: 'Compliance Report', icon: <Shield size={14} /> },
  { id: 'no-show', label: 'No-Show Analysis', icon: <XCircle size={14} /> },
  { id: 'headcount', label: 'Headcount History', icon: <Users size={14} /> },
];

const DATE_PRESETS = ['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom'];
const VISITOR_TYPES = ['Contractor', 'Vendor', 'Guest', 'VIP', 'Delivery', 'Intern'];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('visitor-trends');
  const [datePreset, setDatePreset] = useState('Last 14 days');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [comparePrev, setComparePrev] = useState(false);
  const [siteOpen, setSiteOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('All Sites');

  const sites = ['All Sites', 'Mumbai HQ', 'Bengaluru Office', 'Pune Campus', 'Delhi NCR'];

  const toggleType = (t: string) => {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  return (
    <AppLayout>
      <div className="flex h-full min-h-screen bg-surface">
        {/* Main Content */}
        <div className="flex-1 min-w-0 px-6 py-5 max-w-[calc(100%-280px)]">
          {/* Header */}
          <div className="mb-5">
            <h1 className="text-[22px] font-bold text-text-primary">Reports &amp; Analytics</h1>
            <p className="text-[13px] text-text-secondary mt-1">
              View visitor trends, compliance metrics, and detailed reports. All data is exportable and filterable across sites and visitor types.
            </p>
          </div>

          {/* Global Controls */}
          <div className="bg-white rounded-card border border-border shadow-card p-4 mb-5">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Date Presets */}
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-text-muted" />
                <div className="flex items-center gap-1 flex-wrap">
                  {DATE_PRESETS.map(p => (
                    <button key={p} onClick={() => setDatePreset(p)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${datePreset === p ? 'bg-primary-600 text-white' : 'bg-surface text-text-secondary hover:bg-primary-50 hover:text-primary-600 border border-border'}`}>
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 ml-1">
                  <HelpIcon tip="Select a date range to filter all charts and tables. Choose 'Custom' to enter a specific date range." />
                </div>
              </div>

              <div className="h-5 w-px bg-border mx-1" />

              {/* Site Dropdown */}
              <div className="relative">
                <button onClick={() => setSiteOpen(!siteOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-primary-700 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 shadow-sm transition-all">
                  <MapPin size={13} className="text-primary-500" />
                  {selectedSite}
                  {siteOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                {siteOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-border rounded-xl shadow-dropdown z-30 py-1">
                    {sites.map(s => (
                      <button key={s} onClick={() => { setSelectedSite(s); setSiteOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-[12px] transition-all ${selectedSite === s ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-700 hover:bg-surface'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Visitor Type Chips */}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[11px] text-text-muted font-medium">Type:</span>
                {VISITOR_TYPES.map(t => (
                  <button key={t} onClick={() => toggleType(t)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border transition-all ${selectedTypes.includes(t) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-text-secondary border-border hover:border-primary-300 hover:text-primary-600'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <HelpIcon tip="Export all filtered data across all tabs as a combined PDF (summary + charts) or CSV (raw data)." />
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
                  <Download size={13} /> CSV
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
                  <FileText size={13} /> Export All Data
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-5 border-b border-border overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${activeTab === tab.id ? 'border-primary-600 text-primary-700' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'visitor-trends' && <VisitorTrendsTab />}
            {activeTab === 'peak-hours' && <PeakHoursTab />}
            {activeTab === 'compliance' && <ComplianceTab />}
            {activeTab === 'no-show' && <NoShowTab />}
            {activeTab === 'headcount' && <HeadcountTab />}
          </div>

          {/* Footer Note */}
          <p className="text-[11px] text-text-muted text-center mt-8 pb-4">
            All reports respect DPDP retention policies and data encryption. Charts and tables update instantly based on the selected date range and filters. All data is exportable for audit purposes.
          </p>
        </div>

        {/* Right Quick Insights Panel */}
        <aside className="w-[272px] shrink-0 border-l border-border bg-white px-4 py-5 flex flex-col gap-4 sticky top-0 h-screen overflow-y-auto">
          <div>
            <h3 className="text-[13px] font-bold text-text-primary mb-0.5">Quick Insights</h3>
            <p className="text-[11px] text-text-muted">Key metrics snapshot</p>
          </div>

          {/* Key Metrics */}
          <div className="space-y-3">
            {[
              { label: 'Total Visitors', value: '2,142', icon: <Users size={14} />, color: 'text-primary-600', bg: 'bg-primary-50' },
              { label: 'Compliance Rate', value: '88.4%', icon: <Shield size={14} />, color: 'text-success', bg: 'bg-success/10' },
              { label: 'No-Show Rate', value: '13.2%', icon: <XCircle size={14} />, color: 'text-warning', bg: 'bg-warning/10' },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.bg} ${m.color}`}>
                  {m.icon}
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">{m.label}</p>
                  <p className={`text-[16px] font-bold ${m.color}`}>{m.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Compare Toggle */}
          <div className="p-3 bg-surface rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={13} className="text-text-muted" />
                <span className="text-[12px] font-semibold text-text-primary">Compare with Previous Period</span>
              </div>
              <HelpIcon tip="Toggle to overlay the previous period's data on all charts for trend comparison." />
            </div>
            <p className="text-[11px] text-text-muted mt-1 mb-2">Auto-updates all charts</p>
            <button onClick={() => setComparePrev(!comparePrev)}
              className={`w-full py-1.5 rounded-lg text-[12px] font-semibold transition-all ${comparePrev ? 'bg-primary-600 text-white' : 'bg-white border border-border text-text-secondary hover:bg-primary-50 hover:text-primary-600'}`}>
              {comparePrev ? 'Comparing: ON' : 'Enable Comparison'}
            </button>
          </div>

          {/* Download Full Report */}
          <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
            <div className="flex items-center gap-1.5 mb-2">
              <FileText size={14} className="text-primary-600" />
              <span className="text-[12px] font-bold text-primary-700">Download Full Report</span>
              <HelpIcon tip="Download a comprehensive report covering all tabs, charts, and tables in the selected date range." />
            </div>
            <p className="text-[11px] text-text-muted mb-3">All tabs, charts &amp; tables included</p>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 bg-white border border-primary-200 text-primary-700 rounded-lg text-[11px] font-semibold hover:bg-primary-50 transition-all">
                CSV
              </button>
              <button className="flex-1 py-1.5 bg-primary-600 text-white rounded-lg text-[11px] font-semibold hover:bg-primary-700 transition-all">
                PDF
              </button>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="p-3 bg-surface rounded-lg border border-border">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">Active Filters</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Date Range</span>
                <span className="font-medium text-text-primary">{datePreset}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Site</span>
                <span className="font-medium text-text-primary">{selectedSite}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Visitor Types</span>
                <span className="font-medium text-text-primary">{selectedTypes.length === 0 ? 'All' : selectedTypes.length}</span>
              </div>
            </div>
          </div>

          {/* Tab Quick Nav */}
          <div className="p-3 bg-surface rounded-lg border border-border">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">Jump to Tab</p>
            <div className="space-y-1">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] font-medium transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-text-secondary hover:bg-white hover:text-primary-600'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
