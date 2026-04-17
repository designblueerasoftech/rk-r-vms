'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Minus, Info } from 'lucide-react';
import { toast } from 'sonner';

const roles = ['Super Admin', 'Site Admin', 'Operator', 'Security Guard'];

const permissions = [
  {
    id: 'perm-group-visitors',
    group: 'Visitor Management',
    items: [
      { id: 'perm-checkin',    label: 'Check-in / Check-out Visitors',  access: [true, true, true, false]  },
      { id: 'perm-preregister',label: 'Create Pre-Registrations',        access: [true, true, true, false]  },
      { id: 'perm-invite',     label: 'Send WhatsApp Invites',           access: [true, true, true, false]  },
      { id: 'perm-viewlog',    label: 'View Visitor Log',                access: [true, true, true, true]   },
      { id: 'perm-exportlog',  label: 'Export Visitor Reports',          access: [true, true, false, false] },
    ],
  },
  {
    id: 'perm-group-sites',
    group: 'Sites & Kiosks',
    items: [
      { id: 'perm-managesites', label: 'Add / Edit / Delete Sites',      access: [true, false, false, false] },
      { id: 'perm-configsite',  label: 'Configure Site Settings',        access: [true, true, false, false]  },
      { id: 'perm-kiosks',      label: 'Manage Kiosks & Pair Tablets',   access: [true, true, false, false]  },
      { id: 'perm-gates',       label: 'Configure Gates',                access: [true, true, false, false]  },
    ],
  },
  {
    id: 'perm-group-security',
    group: 'Security',
    items: [
      { id: 'perm-blacklist',   label: 'Add / Remove Blacklist Entries', access: [true, true, false, false]  },
      { id: 'perm-viewblacklist',label: 'View Blacklist',                access: [true, true, true, true]    },
      { id: 'perm-evacuation',  label: 'Download Evacuation List',       access: [true, true, true, true]    },
      { id: 'perm-alerts',      label: 'Receive Security Alerts',        access: [true, true, true, true]    },
    ],
  },
  {
    id: 'perm-group-admin',
    group: 'Administration',
    items: [
      { id: 'perm-manageusers', label: 'Invite / Manage Users',          access: [true, false, false, false] },
      { id: 'perm-roles',       label: 'Assign Roles & Permissions',     access: [true, false, false, false] },
      { id: 'perm-billing',     label: 'Billing & Subscription',         access: [true, false, false, false] },
      { id: 'perm-integrations',label: 'Manage Integrations',            access: [true, false, false, false] },
      { id: 'perm-branding',    label: 'Branding & Appearance',          access: [true, true, false, false]  },
      { id: 'perm-workflows',   label: 'Configure Workflows & Forms',    access: [true, true, false, false]  },
      { id: 'perm-compliance',  label: 'Compliance & Audit Reports',     access: [true, true, false, false]  },
    ],
  },
];

const roleColors = [
  'text-amber-700 bg-amber-50',
  'text-primary-700 bg-primary-50',
  'text-teal-700 bg-teal-50',
  'text-purple-700 bg-purple-50',
];

function AccessIcon({ has, partial }: { has: boolean; partial?: boolean }) {
  if (partial) return <Minus size={14} className="text-warning mx-auto" />;
  if (has) return <CheckCircle2 size={15} className="text-success mx-auto" />;
  return <XCircle size={15} className="text-slate-300 mx-auto" />;
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
            Create Custom Role
          </button>
        </div>
      </div>

      {/* Matrix table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-widest text-text-muted uppercase w-72">
                PERMISSION
              </th>
              {roles.map((role, idx) => (
                <th key={`mth-${role}`} className="px-4 py-3 text-center w-32">
                  <span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-badge ${roleColors[idx]}`}>
                    {role}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((group) => (
              <React.Fragment key={group.id}>
                {/* Group header */}
                <tr
                  className="border-b border-border bg-slate-50/60 cursor-pointer hover:bg-slate-100/60 transition-colors"
                  onClick={() => toggleGroup(group.id)}
                >
                  <td colSpan={roles.length + 1} className="px-5 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                        {group.group}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        ({group.items.length} permissions)
                      </span>
                      <span className="ml-auto text-[11px] text-text-muted">
                        {expandedGroups.includes(group.id) ? '▲' : '▼'}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Permission rows */}
                {expandedGroups.includes(group.id) && group.items.map((item, rowIdx) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border/50 transition-colors hover:bg-primary-50/20 ${rowIdx % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                  >
                    <td className="px-5 py-2.5">
                      <span className="text-[13px] text-text-secondary">{item.label}</span>
                    </td>
                    {item.access.map((has, roleIdx) => (
                      <td key={`${item.id}-role-${roleIdx}`} className="px-4 py-2.5 text-center">
                        <AccessIcon has={has} />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-3 border-t border-border bg-surface/50 flex-wrap">
        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Legend</span>
        {[
          { icon: <CheckCircle2 size={13} className="text-success" />, label: 'Full Access' },
          { icon: <XCircle size={13} className="text-slate-300" />, label: 'No Access' },
          { icon: <Minus size={13} className="text-warning" />, label: 'Partial / Restricted' },
        ].map((l) => (
          <div key={`legend-${l.label}`} className="flex items-center gap-1.5">
            {l.icon}
            <span className="text-[11px] text-text-secondary">{l.label}</span>
          </div>
        ))}
        <span className="ml-auto text-[11px] text-text-muted">
          Custom roles available on Enterprise plan
        </span>
      </div>
    </div>
  );
}