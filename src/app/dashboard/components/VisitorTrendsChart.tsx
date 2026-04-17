'use client';

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

// Backend: GET /api/analytics/visitor-trends?range=7d&site=all
const data7d = [
  { date: '04 Apr', Total: 112, Contractors: 38, Vendors: 22, Guests: 35, VIP: 8, Delivery: 9 },
  { date: '05 Apr', Total: 128, Contractors: 42, Vendors: 19, Guests: 44, VIP: 11, Delivery: 12 },
  { date: '06 Apr', Total: 98,  Contractors: 30, Vendors: 24, Guests: 28, VIP: 7,  Delivery: 9  },
  { date: '07 Apr', Total: 143, Contractors: 47, Vendors: 28, Guests: 46, VIP: 12, Delivery: 10 },
  { date: '08 Apr', Total: 135, Contractors: 44, Vendors: 25, Guests: 42, VIP: 14, Delivery: 10 },
  { date: '09 Apr', Total: 156, Contractors: 51, Vendors: 30, Guests: 50, VIP: 15, Delivery: 10 },
  { date: '10 Apr', Total: 147, Contractors: 48, Vendors: 27, Guests: 47, VIP: 13, Delivery: 12 },
];

const lines = [
  { key: 'Total',       color: '#2563EB', active: true },
  { key: 'Contractors', color: '#F97316', active: true },
  { key: 'Vendors',     color: '#A855F7', active: true },
  { key: 'Guests',      color: '#3B82F6', active: false },
  { key: 'VIP',         color: '#EAB308', active: false },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl p-3 shadow-dropdown text-[12px]">
      <p className="font-bold text-text-primary mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={`tooltip-${p.dataKey}`} className="flex items-center justify-between gap-4 mb-0.5">
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

export default function VisitorTrendsChart() {
  const [activeLines, setActiveLines] = useState<Record<string, boolean>>(
    Object.fromEntries(lines.map((l) => [l.key, l.active]))
  );
  const [range, setRange] = useState('7d');

  const toggleLine = (key: string) => {
    setActiveLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-card card-shadow border border-border p-5 h-full">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-[15px] font-bold text-text-primary">Visitor Trends</h2>
          <p className="text-[12px] text-text-muted">Daily check-ins by visitor type</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['7d', '14d', '30d'].map((r) => (
            <button
              key={`range-${r}`}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all duration-150 ${
                range === r ? 'bg-primary-600 text-white' : 'bg-surface text-text-secondary hover:bg-primary-50 hover:text-primary-600 border border-border'
              }`}
            >
              {r}
            </button>
          ))}
          {['Company-wide', 'Mumbai HQ', 'Bengaluru'].map((s) => (
            <button
              key={`site-${s}`}
              className="px-2.5 py-1 text-[11px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all duration-150"
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => toast.info('Exporting visitor trends...')}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all duration-150"
          >
            <Download size={11} /> Export
          </button>
        </div>
      </div>

      {/* Legend toggles */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {lines.map((l) => (
          <button
            key={`legend-${l.key}`}
            onClick={() => toggleLine(l.key)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150 ${
              activeLines[l.key]
                ? 'border-transparent text-white' :'bg-white border-border text-text-muted'
            }`}
            style={activeLines[l.key] ? { background: l.color } : {}}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {l.key}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data7d} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          {lines.map((l) =>
            activeLines[l.key] ? (
              <Line
                key={`line-${l.key}`}
                type="monotone"
                dataKey={l.key}
                stroke={l.color}
                strokeWidth={l.key === 'Total' ? 2.5 : 1.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}