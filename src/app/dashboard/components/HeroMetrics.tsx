'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const metrics = [
  {
    id: 'metric-visitors-today',
    label: 'TOTAL VISITORS TODAY',
    value: '147',
    change: '+12%',
    trend: 'up' as const,
    sparkData: [82, 95, 88, 110, 125, 138, 147],
    accent: 'blue',
  },
  {
    id: 'metric-live-now',
    label: 'LIVE ON-SITE NOW',
    value: '47',
    change: '+5 vs yesterday',
    trend: 'up' as const,
    sparkData: [30, 38, 42, 40, 44, 46, 47],
    accent: 'green',
    live: true,
  },
  {
    id: 'metric-at-gate',
    label: 'AT GATE — PENDING',
    value: '6',
    change: 'Avg wait 4 min',
    trend: 'neutral' as const,
    sparkData: [2, 5, 4, 7, 3, 6, 6],
    accent: 'amber',
  },
  {
    id: 'metric-pre-registered',
    label: 'PRE-REGISTERED',
    value: '30',
    change: 'Expected by noon',
    trend: 'neutral' as const,
    sparkData: [18, 22, 25, 28, 29, 30, 30],
    accent: 'purple',
  },
  {
    id: 'metric-checked-out',
    label: 'CHECKED-OUT TODAY',
    value: '23',
    change: '+8 vs yesterday',
    trend: 'up' as const,
    sparkData: [8, 11, 14, 16, 19, 21, 23],
    accent: 'teal',
  },
];

const accentMap = {
  blue:   { card: 'bg-white', border: 'border-primary-200', icon: 'bg-primary-50 text-primary-600', value: 'text-primary-700', bar: 'bg-primary-600' },
  green:  { card: 'bg-success/10', border: 'border-success/20', icon: 'bg-success/10 text-success', value: 'text-success-text', bar: 'bg-success' },
  amber:  { card: 'bg-warning/10', border: 'border-warning/20', icon: 'bg-warning/10 text-warning', value: 'text-warning-text', bar: 'bg-warning' },
  purple: { card: 'bg-purple-50', border: 'border-purple-100', icon: 'bg-purple-50 text-purple-600', value: 'text-purple-700', bar: 'bg-purple-500' },
  teal:   { card: 'bg-slate-100', border: 'border-slate-200', icon: 'bg-slate-200 text-slate-600', value: 'text-slate-700', bar: 'bg-primary-500' },
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline
        points={pts.join(' ')}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function HeroMetrics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-3">
      {metrics.map((m) => {
        const ac = accentMap[m.accent];
        return (
          <div
            key={m.id}
            className={`relative ${ac.card} rounded-card border ${ac.border} card-shadow p-4 flex flex-col gap-2 hover:shadow-card-md transition-shadow duration-200`}
          >
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
              {m.trend === 'down' && <TrendingDown size={11} className="text-danger" />}
              <span className={`text-[11px] font-medium ${m.trend === 'up' ? 'text-success-text' : m.trend === 'down' ? 'text-danger-text' : 'text-text-muted'}`}>
                {m.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}