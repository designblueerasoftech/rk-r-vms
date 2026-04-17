import React from 'react';

type StatusType =
  | 'checked-in' |'checked-out' |'at-gate' |'pre-registered' |'invited' |'blocked' |'normal' |'high-wait' |'alert' |'connected' |'partial' |'offline' |'active' |'inactive' |'pending';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string; label: string }> = {
  'checked-in':     { bg: 'bg-success/10', text: 'text-success-text', dot: 'bg-success', label: 'Checked-In' },
  'checked-out':    { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Checked-Out' },
  'at-gate':        { bg: 'bg-warning/10', text: 'text-warning-text', dot: 'bg-warning', label: 'At Gate' },
  'pre-registered': { bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500', label: 'Pre-Registered' },
  'invited':        { bg: 'bg-info/10', text: 'text-info-text', dot: 'bg-info', label: 'Invited' },
  'blocked':        { bg: 'bg-danger/10', text: 'text-danger-text', dot: 'bg-danger', label: 'Blocked' },
  'normal':         { bg: 'bg-success/10', text: 'text-success-text', dot: 'bg-success', label: 'Normal' },
  'high-wait':      { bg: 'bg-warning/10', text: 'text-warning-text', dot: 'bg-warning', label: 'High Wait' },
  'alert':          { bg: 'bg-danger/10', text: 'text-danger-text', dot: 'bg-danger', label: 'Alert' },
  'connected':      { bg: 'bg-success/10', text: 'text-success-text', dot: 'bg-success', label: 'Connected' },
  'partial':        { bg: 'bg-warning/10', text: 'text-warning-text', dot: 'bg-warning', label: 'Partial' },
  'offline':        { bg: 'bg-danger/10', text: 'text-danger-text', dot: 'bg-danger', label: 'Offline' },
  'active':         { bg: 'bg-success/10', text: 'text-success-text', dot: 'bg-success', label: 'Active' },
  'inactive':       { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400', label: 'Inactive' },
  'pending':        { bg: 'bg-warning/10', text: 'text-warning-text', dot: 'bg-warning', label: 'Pending' },
};

export default function StatusBadge({ status, label, size = 'md', dot = true }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  const displayLabel = label ?? cfg.label;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-badge
        ${cfg.bg} ${cfg.text}
        ${size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />}
      {displayLabel}
    </span>
  );
}