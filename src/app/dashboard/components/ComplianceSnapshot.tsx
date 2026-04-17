'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, ChevronRight, Shield } from 'lucide-react';
import { toast } from 'sonner';

// Backend: GET /api/compliance/snapshot?framework=DPDP&date=today
const items = [
  {
    id: 'comp-consent',
    label: 'Consent Rate',
    sub: 'DPDP Act 2023 · ConsentStamp active',
    value: '98.2%',
    pct: 98,
    status: 'good' as const,
    action: 'View log',
  },
  {
    id: 'comp-pii',
    label: 'Pending PII Purge',
    sub: 'Due within 7 days — review queue',
    value: '47 records',
    pct: 65,
    status: 'warn' as const,
    action: 'Review queue',
  },
  {
    id: 'comp-induction',
    label: 'Induction Completion',
    sub: 'Safety video + quiz — this month',
    value: '94%',
    pct: 94,
    status: 'good' as const,
    action: 'View report',
  },
  {
    id: 'comp-audit',
    label: 'Audit Trail',
    sub: 'All events logged — No gaps',
    value: '100%',
    pct: 100,
    status: 'good' as const,
    action: 'View log',
  },
  {
    id: 'comp-dpdp',
    label: 'DPDP Act 2023 Compliant',
    sub: 'Certificate valid · Renews 01 Jan 2027',
    value: 'Valid',
    pct: 100,
    status: 'good' as const,
    action: 'Download',
  },
];

export default function ComplianceSnapshot() {
  return (
    <div className="bg-white rounded-card card-shadow border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <Shield size={16} className="text-primary-600" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-text-primary">Compliance Snapshot</h2>
            <p className="text-[12px] text-text-muted">DPDP Act 2023 · Today</p>
          </div>
        </div>
        <button
          onClick={() => toast.info('Opening full compliance report...')}
          className="flex items-center gap-1 text-[12px] font-semibold text-primary-600 hover:text-primary-700"
        >
          Full Report <ChevronRight size={13} />
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="shrink-0">
              {item.status === 'good'
                ? <CheckCircle size={16} className="text-success" />
                : <AlertTriangle size={16} className="text-warning" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[13px] font-semibold text-text-primary">{item.label}</p>
                <span className={`text-[12px] font-bold tabular-nums shrink-0 ml-2 ${item.status === 'warn' ? 'text-warning-text' : 'text-success-text'}`}>
                  {item.value}
                </span>
              </div>
              <p className="text-[11px] text-text-muted mb-1">{item.sub}</p>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.status === 'warn' ? 'bg-warning' : 'bg-success'}`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => toast.info(`${item.action} for ${item.label}`)}
              className="shrink-0 text-[11px] font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap"
            >
              {item.action} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}