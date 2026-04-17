'use client';

import React from 'react';
import { Send, ShieldOff, Tablet, FileDown } from 'lucide-react';
import { toast } from 'sonner';

const actions = [
  {
    id: 'qa-invite',
    icon: <Send size={18} className="text-primary-600" />,
    label: 'Create New Invite',
    desc: 'Send WhatsApp pre-registration',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    hover: 'hover:bg-primary-100',
  },
  {
    id: 'qa-blacklist',
    icon: <ShieldOff size={18} className="text-danger-text" />,
    label: 'Add to Blacklist',
    desc: 'Block visitor from all sites instantly',
    bg: 'bg-danger/5',
    border: 'border-danger/15',
    hover: 'hover:bg-danger/10',
  },
  {
    id: 'qa-kiosk',
    icon: <Tablet size={18} className="text-primary-600" />,
    label: 'Deploy Kiosk',
    desc: 'Generate QR code for tablet pairing',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    hover: 'hover:bg-primary-100',
  },
  {
    id: 'qa-export',
    icon: <FileDown size={18} className="text-purple-600" />,
    label: 'Export Report',
    desc: 'Download compliance PDF/CSV',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    hover: 'hover:bg-purple-100/60',
  },
];

export default function QuickActions() {
  return (
    <div>
      <h2 className="text-[14px] font-bold text-text-primary mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {actions?.map((a) => (
          <button
            key={a?.id}
            onClick={() => toast?.info(`${a?.label} — coming soon`)}
            className={`flex items-center gap-3 p-4 rounded-card border ${a?.bg} ${a?.border} ${a?.hover} active:scale-95 transition-all duration-150 text-left group`}
          >
            <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
              {a?.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-text-primary truncate">{a?.label}</p>
              <p className="text-[11px] text-text-muted truncate">{a?.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}