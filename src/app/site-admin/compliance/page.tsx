'use client';

import React from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { ClipboardList, Download, Filter, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const auditLogs = [
  { id: 1, action: 'Visitor Checked In', user: 'Kiosk – Lobby', detail: 'Arjun Mehta (Contractor)', time: '10:42 AM', type: 'checkin' },
  { id: 2, action: 'Watchlist Alert Triggered', user: 'System', detail: 'Unknown Person flagged', time: '10:31 AM', type: 'alert' },
  { id: 3, action: 'Workflow Published', user: 'Reeja Patel', detail: 'Walk-In Contractor flow updated', time: '09:55 AM', type: 'config' },
  { id: 4, action: 'User Invited', user: 'Reeja Patel', detail: 'priya@acme.com – Receptionist', time: '09:20 AM', type: 'user' },
  { id: 5, action: 'Visitor Checked Out', user: 'Kiosk – Gate B', detail: 'Priya Sharma (Visitor)', time: '09:05 AM', type: 'checkout' },
  { id: 6, action: 'Kiosk Restarted', user: 'System', detail: 'Reception Kiosk – auto-recovery', time: '08:47 AM', type: 'system' },
];

const typeColors: Record<string, string> = {
  checkin: 'bg-green-50 text-green-700',
  checkout: 'bg-blue-50 text-blue-700',
  alert: 'bg-red-50 text-red-700',
  config: 'bg-purple-50 text-purple-700',
  user: 'bg-amber-50 text-amber-700',
  system: 'bg-surface text-text-muted',
};

export default function SiteAdminCompliancePage() {
  const { siteName } = useRole();

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Compliance & Audit</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · Audit trail scoped to this site</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
              <Filter size={13} /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
              <Download size={13} /> Export Audit Log
            </button>
          </div>
        </div>

        {/* Compliance Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Compliance Score', value: '94%', icon: <CheckCircle size={16} />, color: 'text-green-600 bg-green-50' },
            { label: 'Open Alerts', value: '3', icon: <AlertTriangle size={16} />, color: 'text-red-600 bg-red-50' },
            { label: 'Audit Events Today', value: '47', icon: <ClipboardList size={16} />, color: 'text-blue-600 bg-blue-50' },
            { label: 'Data Retention', value: '90 days', icon: <Info size={16} />, color: 'text-purple-600 bg-purple-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-border p-4 shadow-card">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-xl font-bold text-text-primary">{s.value}</p>
              <p className="text-[12px] text-text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-[14px] font-semibold text-text-primary">Audit Trail – Today</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                {['Time', 'Action', 'Performed By', 'Detail'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3 text-[12px] text-text-muted font-mono">{log.time}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeColors[log.type]}`}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary">{log.user}</td>
                  <td className="px-4 py-3 text-[12px] text-text-muted">{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SiteAdminLayout>
  );
}
