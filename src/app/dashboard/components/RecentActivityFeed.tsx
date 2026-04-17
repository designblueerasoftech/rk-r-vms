'use client';

import React, { useState } from 'react';
import { Eye, UserX, RefreshCw, ChevronRight, Flag } from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';
import VisitorTypeBadge from '@/components/ui/VisitorTypeBadge';
import Link from 'next/link';

// Backend: GET /api/visitors/recent-activity?limit=10&site=all
const allActivities = [
  { id: 'act-001', initials: 'AN', color: 'bg-blue-500',   name: 'Arjun Nair',           type: 'Contractor',   host: 'Priya Mehta',    site: 'Mumbai HQ',          gate: 'Gate 1',    status: 'checked-in'     as const, time: '08:47 AM', flagged: false },
  { id: 'act-002', initials: 'SK', color: 'bg-green-500',  name: 'Sunita Krishnamurthy', type: 'Vendor',       host: 'Rahul Sharma',   site: 'Mumbai HQ',          gate: 'Gate 2',    status: 'at-gate'        as const, time: '08:43 AM', flagged: false },
  { id: 'act-003', initials: 'DP', color: 'bg-indigo-500', name: 'Dev Patel',             type: 'Interviewee',  host: 'Kavita Joshi',   site: 'Mumbai HQ',          gate: 'Gate 2',    status: 'pre-registered' as const, time: '08:38 AM', flagged: false },
  { id: 'act-004', initials: 'MA', color: 'bg-orange-500', name: 'Meena Agarwal',         type: 'VIP',          host: 'Anand Gupta',    site: 'Bengaluru Tech Park', gate: 'VIP Entry', status: 'checked-in'     as const, time: '08:31 AM', flagged: false },
  { id: 'act-005', initials: 'RS', color: 'bg-red-500',    name: 'Ravi Shankar',          type: 'Delivery',     host: 'Mailroom',       site: 'Mumbai HQ',          gate: 'Gate 1',    status: 'checked-out'    as const, time: '08:28 AM', flagged: false },
  { id: 'act-006', initials: 'PV', color: 'bg-teal-500',   name: 'Pooja Venkataraman',    type: 'Guest',        host: 'Deepak Sinha',   site: 'Delhi NCR Office',   gate: 'Main',      status: 'invited'        as const, time: '08:22 AM', flagged: false },
  { id: 'act-007', initials: 'KB', color: 'bg-yellow-600', name: 'Kiran Bose',            type: 'Govt Official', host: 'CEO Office',    site: 'Mumbai HQ',          gate: 'VIP Entry', status: 'checked-in'     as const, time: '08:15 AM', flagged: true  },
  { id: 'act-008', initials: 'HI', color: 'bg-purple-500', name: 'Harish Iyer',           type: 'Contractor',   host: 'Facilities Team',site: 'Chennai Data Centre', gate: 'Gate 1',  status: 'at-gate'        as const, time: '08:09 AM', flagged: false },
  { id: 'act-009', initials: 'LA', color: 'bg-pink-500',   name: 'Laleh Ahmadi',          type: 'Vendor',       host: 'Procurement',    site: 'Hyderabad Campus',   gate: 'Main',      status: 'pre-registered' as const, time: '07:58 AM', flagged: false },
  { id: 'act-010', initials: 'SN', color: 'bg-cyan-600',   name: 'Suresh Nambiar',        type: 'Guest',        host: 'Marketing Dept', site: 'Mumbai HQ',          gate: 'Gate 2',    status: 'checked-in'     as const, time: '07:47 AM', flagged: false },
];

type TabKey = 'all' | 'checked-in' | 'at-gate' | 'pre-registered' | 'invited' | 'checked-out';

const tabs: { id: TabKey; label: string; count: number }[] = [
  { id: 'all',             label: 'All',            count: 11 },
  { id: 'checked-in',      label: 'Checked-In',     count: 4  },
  { id: 'at-gate',         label: 'At Gate',        count: 2  },
  { id: 'pre-registered',  label: 'Pre-Registered', count: 2  },
  { id: 'invited',         label: 'Invited',        count: 1  },
  { id: 'checked-out',     label: 'Checked-Out',    count: 1  },
];

export default function RecentActivityFeed() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const filtered = activeTab === 'all'
    ? allActivities
    : allActivities.filter((a) => a.status === activeTab);

  return (
    <div className="bg-white rounded-card card-shadow border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success status-dot-pulse" />
          <h2 className="text-[15px] font-bold text-text-primary">Recent Activity</h2>
          <span className="text-[12px] text-text-muted">Last 30 minutes · All sites</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Activity feed refreshed')}
            className="flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <RefreshCw size={12} /> Refresh
          </button>
          <Link href="/visitors">
            <button className="flex items-center gap-1 text-[12px] font-semibold text-primary-600 hover:text-primary-700">
              View Full Log <ChevronRight size={12} />
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-5 py-2 border-b border-border overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white' :'text-text-secondary hover:bg-surface hover:text-text-primary'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-text-muted'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['VISITOR', 'TYPE', 'HOST', 'SITE / GATE', 'STATUS', 'TIME', 'ACTIONS'].map((col) => (
                <th
                  key={`th-${col}`}
                  className="px-5 py-2.5 text-left text-[10px] font-semibold tracking-widest text-text-muted uppercase whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b border-border/50 transition-colors duration-100 ${hoveredRow === row.id ? 'bg-primary-50/40' : ''}`}
              >
                {/* Visitor */}
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full ${row.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {row.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] font-semibold text-text-primary whitespace-nowrap">{row.name}</span>
                        {row.flagged && <Flag size={11} className="text-warning fill-warning" />}
                      </div>
                    </div>
                  </div>
                </td>
                {/* Type */}
                <td className="px-5 py-2.5">
                  <VisitorTypeBadge type={row.type as any} />
                </td>
                {/* Host */}
                <td className="px-5 py-2.5">
                  <span className="text-[13px] text-text-secondary whitespace-nowrap">{row.host}</span>
                </td>
                {/* Site / Gate */}
                <td className="px-5 py-2.5">
                  <p className="text-[12px] font-medium text-text-primary whitespace-nowrap">{row.site}</p>
                  <p className="text-[11px] text-text-muted">{row.gate}</p>
                </td>
                {/* Status */}
                <td className="px-5 py-2.5">
                  <StatusBadge status={row.status} />
                </td>
                {/* Time */}
                <td className="px-5 py-2.5">
                  <span className="text-[12px] font-mono tabular-nums text-text-secondary whitespace-nowrap">{row.time}</span>
                </td>
                {/* Actions */}
                <td className="px-5 py-2.5">
                  <div className={`flex items-center gap-1 transition-opacity duration-150 ${hoveredRow === row.id ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                      onClick={() => toast.info(`Viewing ${row.name}'s visit details`)}
                      className="w-7 h-7 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center transition-colors"
                      title="View details"
                    >
                      <Eye size={13} className="text-primary-600" />
                    </button>
                    <button
                      onClick={() => toast.warning(`${row.name} flagged for review`)}
                      className="w-7 h-7 rounded-lg bg-danger/10 hover:bg-danger/20 flex items-center justify-center transition-colors"
                      title="Flag visitor"
                    >
                      <UserX size={13} className="text-danger-text" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 flex items-center justify-between border-t border-border">
        <p className="text-[12px] text-text-muted">Showing {filtered.length} of {allActivities.length} recent events</p>
        <Link href="/visitors">
          <button className="text-[12px] font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            Open full visitor log →
          </button>
        </Link>
      </div>
    </div>
  );
}