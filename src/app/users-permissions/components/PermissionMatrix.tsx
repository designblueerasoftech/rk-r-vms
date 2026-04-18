'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Info, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const roles = ['Super Admin', 'Site Admin', 'Operator', 'Security Guard'];

const permissions = [
  {
    id: 'perm-group-visitors',
    group: 'Visitor Management',
    icon: '👤',
    items: [
      { id: 'perm-checkin',     label: 'Check-in / Check-out Visitors',  access: [true, true, true, false]  },
      { id: 'perm-preregister', label: 'Create Pre-Registrations',        access: [true, true, true, false]  },
      { id: 'perm-invite',      label: 'Send WhatsApp Invites',           access: [true, true, true, false]  },
      { id: 'perm-viewlog',     label: 'View Visitor Log',                access: [true, true, true, true]   },
      { id: 'perm-exportlog',   label: 'Export Visitor Reports',          access: [true, true, false, false] },
    ],
  },
  {
    id: 'perm-group-sites',
    group: 'Sites & Kiosks',
    icon: '🏢',
    items: [
      { id: 'perm-managesites', label: 'Add / Edit / Delete Sites',       access: [true, false, false, false] },
      { id: 'perm-configsite',  label: 'Configure Site Settings',         access: [true, true, false, false]  },
      { id: 'perm-kiosks',      label: 'Manage Kiosks & Pair Tablets',    access: [true, true, false, false]  },
      { id: 'perm-gates',       label: 'Configure Gates',                 access: [true, true, false, false]  },
    ],
  },
  {
    id: 'perm-group-security',
    group: 'Security',
    icon: '🔒',
    items: [
      { id: 'perm-blacklist',    label: 'Add / Remove Blacklist Entries', access: [true, true, false, false]  },
      { id: 'perm-viewblacklist',label: 'View Blacklist',                 access: [true, true, true, true]    },
      { id: 'perm-evacuation',   label: 'Download Evacuation List',       access: [true, true, true, true]    },
      { id: 'perm-alerts',       label: 'Receive Security Alerts',        access: [true, true, true, true]    },
    ],
  },
  {
    id: 'perm-group-admin',
    group: 'Administration',
    icon: '⚙️',
    items: [
      { id: 'perm-manageusers',  label: 'Invite / Manage Users',         access: [true, false, false, false] },
      { id: 'perm-roles',        label: 'Assign Roles & Permissions',    access: [true, false, false, false] },
      { id: 'perm-billing',      label: 'Billing & Subscription',        access: [true, false, false, false] },
      { id: 'perm-integrations', label: 'Manage Integrations',           access: [true, false, false, false] },
      { id: 'perm-branding',     label: 'Branding & Appearance',         access: [true, true, false, false]  },
      { id: 'perm-workflows',    label: 'Configure Workflows & Forms',   access: [true, true, false, false]  },
      { id: 'perm-compliance',   label: 'Compliance & Audit Reports',    access: [true, true, false, false]  },
    ],
  },
];

const roleConfig = [
  {
    label: 'Super Admin',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    headerBg: 'bg-amber-50/60',
  },
  {
    label: 'Site Admin',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    headerBg: 'bg-blue-50/60',
  },
  {
    label: 'Operator',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    dot: 'bg-teal-500',
    headerBg: 'bg-teal-50/60',
  },
  {
    label: 'Security Guard',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    headerBg: 'bg-purple-50/60',
  },
];

function AccessCell({ has, roleIdx, disabled }: { has: boolean; roleIdx: number; disabled?: boolean }) {
  if (has) {
    return (
      <div className="flex items-center justify-center">
        <div
          className={`w-5 h-5 flex items-center justify-center rounded-[4px] ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          style={{ minWidth: '20px', minHeight: '20px', backgroundColor: '#4F46E5', border: '1px solid #4338CA' }}
        >
          <Check size={12} strokeWidth={3} className="text-white" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-5 h-5 rounded-[4px] bg-white border border-slate-300 ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-indigo-400'}`}
        style={{ minWidth: '20px', minHeight: '20px' }}
      />
    </div>
  );
}

export default function PermissionMatrix() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(permissions.map((p) => p.id));

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-card card-shadow border border-border overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-2">
        <div>
          <h2 className="text-[15px] font-bold text-text-primary">Permission Matrix</h2>
          <p className="text-[12px] text-text-muted">Role-based access control — read-only reference</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info('Custom role creation — coming in Enterprise v3')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all"
          >
            <Info size={13} /> About Roles
          </button>
          <button
            onClick={() => toast.info('Custom role editor — Enterprise plan feature')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <Sparkles size={12} />
            Create Custom Role
          </button>
        </div>
      </div>

      {/* Matrix table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold tracking-widest text-text-muted uppercase bg-slate-50/80 w-72 sticky left-0 z-10">
                Permission
              </th>
              {roleConfig.map((role, idx) => (
                <th key={`mth-${role.label}`} className={`px-4 py-3.5 text-center w-36 ${role.headerBg}`}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${role.bg} ${role.border}`}>
                      <span className={`w-2 h-2 rounded-full ${role.dot} shrink-0`} />
                      <span className={`text-[11px] font-bold ${role.color} whitespace-nowrap`}>{role.label}</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-medium">
                      {permissions.reduce((acc, g) => acc + g.items.filter(i => i.access[idx]).length, 0)}/
                      {permissions.reduce((acc, g) => acc + g.items.length, 0)} permissions
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((group) => {
              const isExpanded = expandedGroups.includes(group.id);
              return (
                <React.Fragment key={group.id}>
                  {/* Group header row */}
                  <tr
                    className="border-b border-border cursor-pointer select-none group"
                    onClick={() => toggleGroup(group.id)}
                    style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)' }}
                  >
                    <td colSpan={roles.length + 1} className="px-5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 flex items-center justify-center rounded text-text-muted group-hover:text-text-secondary transition-colors">
                          {isExpanded
                            ? <ChevronDown size={14} strokeWidth={2.5} />
                            : <ChevronRight size={14} strokeWidth={2.5} />
                          }
                        </div>
                        <span className="text-[11px]">{group.icon}</span>
                        <span className="text-[12px] font-bold text-text-secondary uppercase tracking-wider">
                          {group.group}
                        </span>
                        <span className="text-[10px] font-medium text-text-muted bg-white border border-border px-1.5 py-0.5 rounded-md">
                          {group.items.length}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Permission rows */}
                  {isExpanded && group.items.map((item, rowIdx) => (
                    <tr
                      key={item.id}
                      className={`border-b border-border/60 transition-colors hover:bg-slate-50/60 ${rowIdx % 2 === 1 ? 'bg-slate-50/20' : 'bg-white'}`}
                    >
                      <td className="px-5 py-3 sticky left-0 bg-inherit">
                        <span className="text-[13px] text-text-secondary">{item.label}</span>
                      </td>
                      {item.access.map((has, roleIdx) => (
                        <td key={`${item.id}-role-${roleIdx}`} className="px-4 py-3 text-center">
                          <AccessCell has={has} roleIdx={roleIdx} disabled={roleIdx === 0} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-5 py-3 border-t border-border bg-slate-50/60 flex-wrap">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Legend</span>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] flex items-center justify-center" style={{ backgroundColor: '#4F46E5', border: '1px solid #4338CA' }}>
            <Check size={11} strokeWidth={3} className="text-white" />
          </div>
          <span className="text-[11px] text-text-secondary font-medium">Full Access</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] bg-white border border-slate-300" />
          <span className="text-[11px] text-text-secondary font-medium">No Access</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] flex items-center justify-center opacity-60" style={{ backgroundColor: '#4F46E5', border: '1px solid #4338CA' }}>
            <Check size={11} strokeWidth={3} className="text-white" />
          </div>
          <span className="text-[11px] text-text-secondary font-medium">Read-only (Super Admin)</span>
        </div>
        <span className="ml-auto text-[11px] text-text-muted">
          Custom roles available on Enterprise plan
        </span>
      </div>
    </div>
  );
}