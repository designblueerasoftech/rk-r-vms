'use client';

import React, { useState } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Download, TrendingUp, Users, Clock, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { day: 'Mon', visitors: 42 }, { day: 'Tue', visitors: 58 }, { day: 'Wed', visitors: 71 },
  { day: 'Thu', visitors: 49 }, { day: 'Fri', visitors: 83 }, { day: 'Sat', visitors: 22 }, { day: 'Sun', visitors: 15 },
];

const monthlyData = [
  { month: 'Jan', visitors: 820 }, { month: 'Feb', visitors: 940 }, { month: 'Mar', visitors: 1100 },
  { month: 'Apr', visitors: 780 }, { month: 'May', visitors: 1240 }, { month: 'Jun', visitors: 1050 },
];

export default function SiteAdminReportsPage() {
  const { siteName } = useRole();
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Reports & Analytics</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · All data scoped to this site</p>
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(['week', 'month'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-[12px] font-medium transition-all ${period === p ? 'bg-primary-600 text-white' : 'bg-white text-text-secondary hover:bg-surface'}`}
                >
                  {p === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Total Visitors', value: period === 'week' ? '340' : '1,240', icon: <Users size={16} />, color: 'text-blue-600 bg-blue-50' },
            { label: 'Avg. Visit Duration', value: '42 min', icon: <Clock size={16} />, color: 'text-green-600 bg-green-50' },
            { label: 'Compliance Rate', value: '94%', icon: <ShieldCheck size={16} />, color: 'text-purple-600 bg-purple-50' },
            { label: 'Peak Day', value: period === 'week' ? 'Friday' : 'May', icon: <TrendingUp size={16} />, color: 'text-amber-600 bg-amber-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-border p-4 shadow-card">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-xl font-bold text-text-primary">{s.value}</p>
              <p className="text-[12px] text-text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-border p-5 shadow-card">
            <h2 className="text-[14px] font-semibold text-text-primary mb-4">
              {period === 'week' ? 'Daily Visitor Count – This Week' : 'Monthly Visitor Trend'}
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={period === 'week' ? weeklyData : monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey={period === 'week' ? 'day' : 'month'} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Bar dataKey="visitors" fill="#405189" radius={[4, 4, 0, 0]} name="Visitors" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 shadow-card">
            <h2 className="text-[14px] font-semibold text-text-primary mb-4">Visitor Type Breakdown</h2>
            <div className="space-y-3 mt-2">
              {[
                { type: 'Visitor', count: 142, pct: 42, color: 'bg-blue-500' },
                { type: 'Contractor', count: 89, pct: 26, color: 'bg-orange-500' },
                { type: 'Employee', count: 67, pct: 20, color: 'bg-green-500' },
                { type: 'Delivery', count: 42, pct: 12, color: 'bg-purple-500' },
              ].map(t => (
                <div key={t.type}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-text-secondary font-medium">{t.type}</span>
                    <span className="text-text-primary font-semibold">{t.count} ({t.pct}%)</span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteAdminLayout>
  );
}
