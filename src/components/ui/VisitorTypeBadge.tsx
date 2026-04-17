import React from 'react';

type VisitorType = 'Contractor' | 'Vendor' | 'Guest' | 'VIP' | 'Delivery' | 'Interviewee' | 'Govt Official';

const typeConfig: Record<VisitorType, { bg: string; text: string }> = {
  'Contractor':    { bg: 'bg-orange-100', text: 'text-orange-700' },
  'Vendor':        { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Guest':         { bg: 'bg-blue-100', text: 'text-blue-700' },
  'VIP':           { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Delivery':      { bg: 'bg-teal-100', text: 'text-teal-700' },
  'Interviewee':   { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  'Govt Official': { bg: 'bg-red-100', text: 'text-red-700' },
};

export default function VisitorTypeBadge({ type }: { type: VisitorType }) {
  const cfg = typeConfig[type] ?? { bg: 'bg-slate-100', text: 'text-slate-600' };
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-badge ${cfg.bg} ${cfg.text}`}>
      {type}
    </span>
  );
}