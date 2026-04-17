'use client';

import React from 'react';
import { Users, CalendarCheck, Clock, CalendarPlus, LogOut, AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';

const metrics = [
  {
    id: 'rt-onsite',
    icon: <Users size={22} className="text-primary-500" />,
    value: '47',
    label: 'Total On-Site',
    sub: '+5 vs yesterday',
    subColor: 'text-success-text',
    border: 'border-primary-200',
    valueColor: 'text-primary-700',
  },
  {
    id: 'rt-checkedin',
    icon: <CalendarCheck size={22} className="text-success" />,
    value: '38',
    label: 'Checked-In',
    sub: '+13 in last hour',
    subColor: 'text-success-text',
    border: 'border-success/20',
    valueColor: 'text-success-text',
  },
  {
    id: 'rt-atgate',
    icon: <Clock size={22} className="text-warning" />,
    value: '6',
    label: 'At Gate',
    sub: 'Avg wait: 4 min',
    subColor: 'text-warning-text',
    border: 'border-warning/20',
    valueColor: 'text-warning-text',
  },
  {
    id: 'rt-prereg',
    icon: <CalendarPlus size={22} className="text-purple-500" />,
    value: '30',
    label: 'Pre-Registered',
    sub: 'Expected by noon',
    subColor: 'text-text-muted',
    border: 'border-purple-100',
    valueColor: 'text-purple-700',
  },
  {
    id: 'rt-checkedout',
    icon: <LogOut size={22} className="text-slate-500" />,
    value: '23',
    label: 'Checked-Out',
    sub: 'Today total',
    subColor: 'text-text-muted',
    border: 'border-slate-200',
    valueColor: 'text-slate-700',
  },
];

export default function RealTimeHeadcount() {
  return (
    <div className="bg-white rounded-card card-shadow border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-bold text-text-primary">Real-Time Headcount</h2>
          <p className="text-[12px] text-text-muted">Company-wide · All sites · Live</p>
        </div>
        <button
          onClick={() => toast?.warning('Evacuation list downloaded for all sites.', { duration: 4000 })}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-danger-text bg-danger/10 border border-danger/20 rounded-lg hover:bg-danger/15 transition-all duration-150"
        >
          <AlertOctagon size={13} />
          Evacuation List
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics?.map((m) => (
          <div key={m?.id} className={`bg-white rounded-card border ${m?.border} card-shadow p-4 flex flex-col items-center text-center gap-1 hover:shadow-card-md transition-shadow duration-200`}>
            <div className="mb-1">{m?.icon}</div>
            <span className={`text-3xl font-bold tabular-nums ${m?.valueColor}`}>{m?.value}</span>
            <span className="text-[12px] font-semibold text-text-primary">{m?.label}</span>
            <span className={`text-[11px] font-medium ${m?.subColor}`}>{m?.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}