'use client';

import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

// Backend: GET /api/system/health
const systems = [
  {
    id: 'sys-whatsapp',
    name: 'WhatsApp Business API',
    sub: 'Meta Cloud API · 99.9% uptime',
    status: 'connected' as const,
    lastSync: '2 mins ago',
  },
  {
    id: 'sys-kiosks',
    name: 'Kiosks Online',
    sub: '3/4 online · SLR-K01 offline',
    status: 'partial' as const,
    lastSync: '1 min ago',
  },
  {
    id: 'sys-hris',
    name: 'HRIS / AD Sync',
    sub: 'Data · Last sync: 2 mins ago',
    status: 'connected' as const,
    lastSync: '2 mins ago',
  },
  {
    id: 'sys-badge',
    name: 'Badge Printer',
    sub: 'Brother QL-820NWB · Gate 1',
    status: 'connected' as const,
    lastSync: '3 mins ago',
  },
  {
    id: 'sys-access',
    name: 'Access Control',
    sub: 'HID Origo · Gate 1, 2, 3',
    status: 'connected' as const,
    lastSync: '1 min ago',
  },
];

const statusConfig = {
  connected: { icon: <CheckCircle2 size={16} className="text-success" />, label: 'Connected', color: 'text-success-text', bg: 'bg-success/10' },
  partial:   { icon: <AlertTriangle size={16} className="text-warning" />, label: 'Partial',   color: 'text-warning-text', bg: 'bg-warning/10' },
  offline:   { icon: <XCircle size={16} className="text-danger-text" />,   label: 'Offline',   color: 'text-danger-text',  bg: 'bg-danger/10'  },
};

const issueCount = systems.filter((s) => s.status !== 'connected').length;

export default function SystemHealth() {
  return (
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
                <span className="text-[10px] font-bold text-warning-text bg-warning/10 border border-warning/20 px-1.5 py-0.5 rounded-full">
                  {issueCount} Issue
                </span>
              )}
            </div>
            <p className="text-[12px] text-text-muted">Last sync: 2 mins ago</p>
          </div>
        </div>
        <button
          onClick={() => toast.info('Refreshing system health status...')}
          className="flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <RefreshCw size={12} /> Refresh Status
        </button>
      </div>

      <div className="space-y-2">
        {systems.map((sys) => {
          const cfg = statusConfig[sys.status];
          return (
            <div
              key={sys.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-border hover:bg-surface/50 transition-all duration-150"
            >
              <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                {cfg.icon}
              </div>
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
  );
}