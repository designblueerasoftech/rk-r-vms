import React from 'react';
import { Building2, Users, TrendingUp, MonitorSmartphone, AlertTriangle } from 'lucide-react';

const stats = [
  { id: 'lstat-sites',    icon: <Building2 size={18} className="text-primary-500" />,  label: 'Total Sites',       value: '5',    sub: '5 active', bg: 'bg-primary-50',  border: 'border-primary-100' },
  { id: 'lstat-cap',      icon: <Users size={18} className="text-teal-600" />,          label: 'Total Capacity',    value: '790',  sub: 'across all sites', bg: 'bg-teal-50', border: 'border-teal-100' },
  { id: 'lstat-occ',      icon: <TrendingUp size={18} className="text-success" />,      label: 'Avg Occupancy',     value: '16%',  sub: '130 on-site now', bg: 'bg-success/10', border: 'border-success/20' },
  { id: 'lstat-kiosks',   icon: <MonitorSmartphone size={18} className="text-purple-500" />, label: 'Kiosks Online', value: '13/15', sub: '2 offline', bg: 'bg-purple-50', border: 'border-purple-100' },
  { id: 'lstat-alerts',   icon: <AlertTriangle size={18} className="text-warning" />,   label: 'Sites with Alerts', value: '2',    sub: 'Requires attention', bg: 'bg-warning/10', border: 'border-warning/20' },
];

export default function LocationsSummaryBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-3">
      {stats?.map((s) => (
        <div key={s?.id} className={`bg-white rounded-card card-shadow border ${s?.border} p-4 flex items-center gap-3`}>
          <div className={`w-10 h-10 rounded-xl ${s?.bg} flex items-center justify-center shrink-0`}>
            {s?.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide truncate">{s?.label}</p>
            <p className="text-[20px] font-bold tabular-nums text-text-primary leading-tight">{s?.value}</p>
            <p className="text-[11px] text-text-muted truncate">{s?.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}