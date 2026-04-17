import React from 'react';
import { Crown, Shield, UserCheck, Eye } from 'lucide-react';

const roles = [
  {
    id: 'role-superadmin',
    icon: <Crown size={20} className="text-amber-600" />,
    label: 'Super Admin',
    count: 2,
    desc: 'Full platform access · All sites',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
  },
  {
    id: 'role-siteadmin',
    icon: <Shield size={20} className="text-primary-600" />,
    label: 'Site Admin',
    count: 5,
    desc: 'Assigned sites only · Full ops',
    bg: 'bg-primary-50',
    border: 'border-primary-100',
    iconBg: 'bg-primary-100',
  },
  {
    id: 'role-operator',
    icon: <UserCheck size={20} className="text-teal-600" />,
    label: 'Operator',
    count: 8,
    desc: 'Check-in/out · No config access',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    iconBg: 'bg-teal-100',
  },
  {
    id: 'role-security',
    icon: <Eye size={20} className="text-purple-600" />,
    label: 'Security Guard',
    count: 12,
    desc: 'View-only · Blacklist alerts',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
  },
];

export default function RoleSummaryCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-3">
      {roles?.map((role) => (
        <div
          key={role?.id}
          className={`bg-white rounded-card card-shadow border ${role?.border} p-4 flex items-center gap-3 hover:shadow-card-md transition-shadow duration-200`}
        >
          <div className={`w-11 h-11 rounded-xl ${role?.iconBg} flex items-center justify-center shrink-0`}>
            {role?.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-bold text-text-primary">{role?.label}</p>
              <span className="text-[12px] font-bold tabular-nums text-text-secondary bg-slate-100 px-1.5 py-0.5 rounded-lg">
                {role?.count}
              </span>
            </div>
            <p className="text-[11px] text-text-muted truncate">{role?.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}