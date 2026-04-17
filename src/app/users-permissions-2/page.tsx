'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { UserPlus, Download, Eye, Search, X, Check, Info, HelpCircle, MoreVertical, Edit2, Trash2, Users, UserX, Settings, Plus, ArrowUpDown, CheckSquare, Square, Mail, Phone, Building2, Globe, ClipboardList, Loader2, ChevronRight, Star, Shield, UserCheck } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserStatus = 'active' | 'invited' | 'inactive';
type RoleTab = 'company-admins' | 'site-admins' | 'hosts' | 'receptionists' | 'assistants' | 'security' | 'custom-roles';
type PermissionLevel = 'full' | 'view' | 'none';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  sites: string[];
  lastLogin: string;
  status: UserStatus;
  initials: string;
  color: string;
}

interface PermissionRow {
  category: string;
  key: string;
  description: string;
}

interface CustomRole {
  id: string;
  name: string;
  description: string;
  baseRole: string;
  usersCount: number;
  createdAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SITES = ['Mumbai HQ', 'Delhi NCR Office', 'Bengaluru Tech Park', 'Chennai Data Centre', 'Hyderabad Campus'];

const PERMISSION_ROWS: PermissionRow[] = [
  { category: 'Visitor Management', key: 'visitor_mgmt', description: 'Pre-registration, invite creation, visitor tracking' },
  { category: 'Front Desk Operations', key: 'front_desk', description: 'Walk-in check-ins, badge printing, live lobby monitoring' },
  { category: 'Kiosk & Offline Registration', key: 'kiosk_offline', description: 'Kiosk management, offline auth, self check-in/out' },
  { category: 'Reports & Analytics', key: 'reports', description: 'View and export visitor reports and analytics' },
  { category: 'Induction Hub', key: 'induction', description: 'Manage induction flows, compliance steps, e-signatures' },
  { category: 'Blacklist & Watchlists', key: 'blacklist', description: 'Manage watchlists, screening alerts, flagged visitors' },
  { category: 'Kiosks & Hardware', key: 'hardware', description: 'Configure kiosk devices, printers, access hardware' },
  { category: 'Branding & Appearance', key: 'branding', description: 'Customize portal branding, logos, color themes' },
  { category: 'Compliance & Audit', key: 'compliance', description: 'DPDP audit trails, data retention, consent logs' },
  { category: 'Users & Permissions', key: 'users_perms', description: 'Manage users, roles, and permission assignments' },
  { category: 'Emergency & Evacuation', key: 'emergency', description: 'Emergency broadcasts, evacuation lists, headcount' },
  { category: 'Access Control', key: 'access_ctrl', description: 'Gate access, door control, access logs' },
  { category: 'Workflow Builder', key: 'workflows', description: 'Create and edit visitor workflows and forms' },
  { category: 'Locations & Sites', key: 'locations', description: 'Add, edit, and manage site configurations' },
];

const ROLE_DEFAULTS: Record<string, Record<string, PermissionLevel>> = {
  'Company Admin': { visitor_mgmt: 'full', front_desk: 'full', kiosk_offline: 'full', reports: 'full', induction: 'full', blacklist: 'full', hardware: 'full', branding: 'full', compliance: 'full', users_perms: 'full', emergency: 'full', access_ctrl: 'full', workflows: 'full', locations: 'full' },
  'Site Admin': { visitor_mgmt: 'full', front_desk: 'full', kiosk_offline: 'full', reports: 'full', induction: 'full', blacklist: 'full', hardware: 'full', branding: 'view', compliance: 'view', users_perms: 'view', emergency: 'full', access_ctrl: 'full', workflows: 'full', locations: 'view' },
  'Host': { visitor_mgmt: 'full', front_desk: 'none', kiosk_offline: 'none', reports: 'view', induction: 'none', blacklist: 'none', hardware: 'none', branding: 'none', compliance: 'none', users_perms: 'none', emergency: 'none', access_ctrl: 'none', workflows: 'none', locations: 'none' },
  'Receptionist / Front Desk Operator': { visitor_mgmt: 'full', front_desk: 'full', kiosk_offline: 'full', reports: 'view', induction: 'view', blacklist: 'view', hardware: 'view', branding: 'none', compliance: 'none', users_perms: 'none', emergency: 'view', access_ctrl: 'none', workflows: 'none', locations: 'none' },
  'Assistant': { visitor_mgmt: 'view', front_desk: 'view', kiosk_offline: 'none', reports: 'view', induction: 'none', blacklist: 'none', hardware: 'none', branding: 'none', compliance: 'none', users_perms: 'none', emergency: 'none', access_ctrl: 'none', workflows: 'none', locations: 'none' },
  'Security Staff': { visitor_mgmt: 'view', front_desk: 'view', kiosk_offline: 'full', reports: 'view', induction: 'none', blacklist: 'full', hardware: 'none', branding: 'none', compliance: 'view', users_perms: 'none', emergency: 'full', access_ctrl: 'full', workflows: 'none', locations: 'none' },
};

const USERS_BY_TAB: Record<RoleTab, UserRecord[]> = {
  'company-admins': [
    { id: 'ca-1', name: 'Reeja Patel', email: 'reeja.patel@acmecorp.in', mobile: '+91 98765 43210', role: 'Company Admin', sites: ['All Sites'], lastLogin: '14 Apr 2026, 08:15 AM', status: 'active', initials: 'RP', color: 'bg-primary-600' },
    { id: 'ca-2', name: 'Anand Sharma', email: 'anand.sharma@acmecorp.in', role: 'Company Admin', sites: ['All Sites'], lastLogin: '13 Apr 2026, 06:32 PM', status: 'active', initials: 'AS', color: 'bg-purple-600' },
  ],
  'site-admins': [
    { id: 'sa-1', name: 'Priya Mehta', email: 'priya.mehta@acmecorp.in', role: 'Site Admin', sites: ['Mumbai HQ'], lastLogin: '14 Apr 2026, 07:55 AM', status: 'active', initials: 'PM', color: 'bg-blue-600' },
    { id: 'sa-2', name: 'Rahul Sharma', email: 'rahul.sharma@acmecorp.in', role: 'Site Admin', sites: ['Mumbai HQ', 'Delhi NCR Office'], lastLogin: '14 Apr 2026, 08:02 AM', status: 'active', initials: 'RS', color: 'bg-teal-600' },
    { id: 'sa-3', name: 'Kavita Joshi', email: 'kavita.joshi@acmecorp.in', role: 'Site Admin', sites: ['Bengaluru Tech Park'], lastLogin: '12 Apr 2026, 05:14 PM', status: 'active', initials: 'KJ', color: 'bg-indigo-600' },
  ],
  'hosts': [
    { id: 'h-1', name: 'Deepak Kumar', email: 'deepak.kumar@acmecorp.in', role: 'Host', sites: ['Mumbai HQ'], lastLogin: '14 Apr 2026, 07:30 AM', status: 'active', initials: 'DK', color: 'bg-orange-600' },
    { id: 'h-2', name: 'Sneha Nair', email: 'sneha.nair@acmecorp.in', role: 'Host', sites: ['Bengaluru Tech Park'], lastLogin: '13 Apr 2026, 04:22 PM', status: 'active', initials: 'SN', color: 'bg-green-600' },
    { id: 'h-3', name: 'Vikram Rao', email: 'vikram.rao@acmecorp.in', role: 'Host', sites: ['Hyderabad Campus'], lastLogin: '11 Apr 2026, 11:45 AM', status: 'inactive', initials: 'VR', color: 'bg-red-600' },
    { id: 'h-4', name: 'Pooja Singh', email: 'pooja.singh@acmecorp.in', role: 'Host', sites: ['Delhi NCR Office'], lastLogin: 'Never', status: 'invited', initials: 'PS', color: 'bg-pink-600' },
  ],
  'receptionists': [
    { id: 'r-1', name: 'Meera Gupta', email: 'meera.gupta@acmecorp.in', mobile: '+91 87654 32109', role: 'Receptionist / Front Desk Operator', sites: ['Mumbai HQ'], lastLogin: '14 Apr 2026, 08:00 AM', status: 'active', initials: 'MG', color: 'bg-pink-600' },
    { id: 'r-2', name: 'Arun Tiwari', email: 'arun.tiwari@acmecorp.in', role: 'Receptionist / Front Desk Operator', sites: ['Delhi NCR Office'], lastLogin: '14 Apr 2026, 07:45 AM', status: 'active', initials: 'AT', color: 'bg-cyan-600' },
    { id: 'r-3', name: 'Sunita Reddy', email: 'sunita.reddy@acmecorp.in', role: 'Receptionist / Front Desk Operator', sites: ['Chennai Data Centre'], lastLogin: 'Never', status: 'invited', initials: 'SR', color: 'bg-violet-600' },
  ],
  'assistants': [
    { id: 'ast-1', name: 'Lakshmi Krishnan', email: 'lakshmi.k@acmecorp.in', role: 'Assistant', sites: ['Chennai Data Centre'], lastLogin: '13 Apr 2026, 03:10 PM', status: 'active', initials: 'LK', color: 'bg-violet-600' },
    { id: 'ast-2', name: 'Rohit Verma', email: 'rohit.verma@acmecorp.in', role: 'Assistant', sites: ['Mumbai HQ'], lastLogin: 'Never', status: 'invited', initials: 'RV', color: 'bg-amber-600' },
  ],
  'security': [
    { id: 'sec-1', name: 'Nikhil Bose', email: 'nikhil.bose@acmecorp.in', role: 'Security Staff', sites: ['Hyderabad Campus'], lastLogin: '09 Apr 2026, 09:30 AM', status: 'active', initials: 'NB', color: 'bg-rose-600' },
    { id: 'sec-2', name: 'Ramesh Pillai', email: 'ramesh.pillai@acmecorp.in', role: 'Security Staff', sites: ['Mumbai HQ', 'Bengaluru Tech Park'], lastLogin: '14 Apr 2026, 06:00 AM', status: 'active', initials: 'RP', color: 'bg-slate-600' },
    { id: 'sec-3', name: 'Geeta Yadav', email: 'geeta.yadav@acmecorp.in', role: 'Security Staff', sites: ['Delhi NCR Office'], lastLogin: 'Never', status: 'invited', initials: 'GY', color: 'bg-emerald-600' },
  ],
  'custom-roles': [],
};

const CUSTOM_ROLES: CustomRole[] = [
  { id: 'cr-1', name: 'Hybrid Receptionist-Security', description: 'Front desk operations + watchlist screening + emergency broadcast rights', baseRole: 'Receptionist / Front Desk Operator', usersCount: 3, createdAt: '10 Mar 2026' },
  { id: 'cr-2', name: 'Offline Kiosk Operator', description: 'Kiosk management, offline registration/auth, walk-in handling without full front desk access', baseRole: 'Security Staff', usersCount: 2, createdAt: '22 Feb 2026' },
  { id: 'cr-3', name: 'Multi-Site Host', description: 'Host with cross-site invite creation and basic analytics view', baseRole: 'Host', usersCount: 5, createdAt: '15 Jan 2026' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: UserStatus }) {
  const map = {
    active: 'bg-success-light text-success-text border border-success/20',
    invited: 'bg-warning-light text-warning-text border border-warning/20',
    inactive: 'bg-slate-100 text-slate-500 border border-slate-200',
  };
  const labels = { active: 'Active', invited: 'Invited', inactive: 'Inactive' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-badge text-[11px] font-semibold ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-success' : status === 'invited' ? 'bg-warning' : 'bg-slate-400'}`} />
      {labels[status]}
    </span>
  );
}

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <HelpCircle size={12} className="text-text-muted cursor-help ml-1" />
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 bg-slate-800 text-white text-[11px] rounded-lg px-2.5 py-1.5 z-50 shadow-lg leading-relaxed whitespace-normal">
          {text}
        </span>
      )}
    </span>
  );
}

function SiteBadge({ site }: { site: string }) {
  if (site === 'All Sites') {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-badge text-[11px] font-semibold bg-info-light text-info-text border border-info/20"><Globe size={10} />{site}</span>;
  }
  return <span className="inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-medium bg-primary-50 text-primary-700 border border-primary-100">{site}</span>;
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────

interface InviteModalProps {
  onClose: () => void;
  editUser?: UserRecord | null;
}

function InviteModal({ onClose, editUser }: InviteModalProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: editUser?.name || '',
    email: editUser?.email || '',
    mobile: editUser?.mobile || '',
    role: editUser?.role || '',
    sites: editUser?.sites || [] as string[],
    sendEmail: true,
    sendWhatsApp: false,
    customMessage: '',
    saveAsTemplate: false,
    templateName: '',
    templateDesc: '',
  });
  const [permissions, setPermissions] = useState<Record<string, PermissionLevel>>({});

  const handleRoleChange = (role: string) => {
    setForm(f => ({ ...f, role, sites: role === 'Company Admin' ? ['All Sites'] : [] }));
    setPermissions(ROLE_DEFAULTS[role] || {});
  };

  const handlePermChange = (key: string, level: PermissionLevel) => {
    setPermissions(p => ({ ...p, [key]: level }));
  };

  const toggleSite = (site: string) => {
    setForm(f => ({
      ...f,
      sites: f.sites.includes(site) ? f.sites.filter(s => s !== site) : [...f.sites, site],
    }));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 1400);
  };

  const roleOptions = ['Company Admin', 'Site Admin', 'Host', 'Receptionist / Front Desk Operator', 'Assistant', 'Security Staff', 'Custom Role'];

  const roleColors: Record<string, string> = {
    'Company Admin': 'border-amber-300 bg-amber-50',
    'Site Admin': 'border-primary-300 bg-primary-50',
    'Host': 'border-green-300 bg-green-50',
    'Receptionist / Front Desk Operator': 'border-teal-300 bg-teal-50',
    'Assistant': 'border-slate-300 bg-slate-50',
    'Security Staff': 'border-purple-300 bg-purple-50',
    'Custom Role': 'border-rose-300 bg-rose-50',
  };

  const roleDescriptions: Record<string, string> = {
    'Company Admin': 'Global/tenant-level access — all sites and all settings',
    'Site Admin': 'Full site-level management within assigned sites',
    'Host': 'Invite creation + basic visitor tracking (site-specific)',
    'Receptionist / Front Desk Operator': 'Kiosk ops, walk-in check-ins, badge printing, live lobby (Envoy Front Desk + Veris style)',
    'Assistant': 'Delegation support and basic assistance (site-specific)',
    'Security Staff': 'Watchlist screening, emergency broadcasts, offline auth, access control',
    'Custom Role': 'Select from saved templates or create a new custom role',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm">
              <UserPlus size={17} className="text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-text-primary">{editUser ? 'Edit User' : 'Invite New User'}</h2>
              <p className="text-[11px] text-text-muted">Step {step} of 3 — {step === 1 ? 'Basic Information' : step === 2 ? 'Sites & Permissions' : 'Additional Settings'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center transition-colors">
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-0 px-6 py-3 border-b border-border bg-surface/50">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={`step-${s}`}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${step >= s ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                  {step > s ? <Check size={13} /> : s}
                </div>
                <span className={`text-[12px] font-medium hidden sm:block ${step >= s ? 'text-primary-700' : 'text-text-muted'}`}>
                  {s === 1 ? 'Basic Info' : s === 2 ? 'Sites & Permissions' : 'Settings'}
                </span>
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all ${step > s ? 'bg-primary-400' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">Full Name <span className="text-danger">*</span></label>
                <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="e.g. Priya Mehta" className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">Work Email <span className="text-danger">*</span></label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="priya.mehta@acmecorp.in" className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1 flex items-center gap-1">
                  Mobile Number (optional)
                  <Tooltip text="Used for WhatsApp invite notifications. Not required for email-only invites." />
                </label>
                <input value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} placeholder="+91 98765 43210" className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-2 flex items-center gap-1">
                  Role <span className="text-danger">*</span>
                  <Tooltip text="Role selection auto-populates smart permission defaults (Envoy/Eptura style). Every permission can be overridden in Step 2." />
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {roleOptions.map((role) => (
                    <button key={`role-${role}`} type="button" onClick={() => handleRoleChange(role)}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150 ${form.role === role ? `${roleColors[role]} border-primary-400` : 'border-border hover:border-primary-200 hover:bg-primary-50/30'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${form.role === role ? 'border-primary-600 bg-primary-600' : 'border-slate-300'}`}>
                        {form.role === role && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-text-primary">{role}</p>
                        <p className="text-[11px] text-text-muted">{roleDescriptions[role]}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Sites */}
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-2 flex items-center gap-1">
                  Sites Accessible
                  <Tooltip text="Permissions are scoped to selected sites. Company Admin always has global access." />
                </label>
                {form.role === 'Company Admin' ? (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-info-light border border-info/20">
                    <Globe size={14} className="text-info-text shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-semibold text-info-text">All Sites (Global Access)</p>
                      <p className="text-[11px] text-info-text/80 mt-0.5">Company Admins have unrestricted access to all current and future sites.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {SITES.map((site) => (
                      <label key={`site-${site}`} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:border-primary-200 hover:bg-primary-50/30 cursor-pointer transition-all">
                        <input type="checkbox" checked={form.sites.includes(site)} onChange={() => toggleSite(site)} className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-200" />
                        <Building2 size={13} className="text-text-muted" />
                        <span className="text-[13px] font-medium text-text-primary">{site}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Permission Matrix */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] font-semibold text-text-primary flex items-center gap-1">
                    Permission Matrix
                    <Tooltip text="Smart defaults pre-filled by role. Override freely to match your company's unique workflow — e.g., grant Security Staff 'Front Desk Operations' or Receptionist 'Offline Registration'." />
                  </label>
                  {form.role && <span className="text-[11px] text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-badge">Defaults for: {form.role}</span>}
                </div>
                <div className="text-[11px] text-text-muted mb-3 p-2.5 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                  <Info size={12} className="text-amber-600 shrink-0 mt-0.5" />
                  Permissions are scoped to selected sites. Override defaults freely to match your company's unique workflow (e.g., Security handling offline registration or Receptionist managing watchlists).
                </div>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-4 bg-surface px-4 py-2 border-b border-border">
                    <div className="col-span-1 text-[11px] font-bold text-text-secondary uppercase tracking-wide">Permission Area</div>
                    <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wide text-center">Full Access</div>
                    <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wide text-center">View Only</div>
                    <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wide text-center">No Access</div>
                  </div>
                  <div className="divide-y divide-border">
                    {PERMISSION_ROWS.map((row) => {
                      const current = permissions[row.key] || 'none';
                      return (
                        <div key={`perm-${row.key}`} className="grid grid-cols-4 px-4 py-2.5 hover:bg-surface/60 transition-colors">
                          <div className="col-span-1 flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-text-primary">{row.category}</span>
                            <Tooltip text={row.description} />
                          </div>
                          {(['full', 'view', 'none'] as PermissionLevel[]).map((level) => (
                            <div key={`${row.key}-${level}`} className="flex items-center justify-center">
                              <button type="button" onClick={() => handlePermChange(row.key, level)}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${current === level
                                  ? level === 'full' ? 'border-success bg-success' : level === 'view' ? 'border-info bg-info' : 'border-slate-400 bg-slate-400' :'border-slate-300 hover:border-slate-400'}`}>
                                {current === level && <div className="w-2 h-2 rounded-full bg-white" />}
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary-200 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-primary-600" />
                  <div>
                    <p className="text-[13px] font-semibold text-text-primary">Send Invite via Email</p>
                    <p className="text-[11px] text-text-muted">Invite link + setup instructions sent to their work email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={form.sendEmail} onChange={e => setForm(f => ({ ...f, sendEmail: e.target.checked }))} />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
                </label>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary-200 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-green-600" />
                  <div>
                    <p className="text-[13px] font-semibold text-text-primary">Send Invite via WhatsApp</p>
                    <p className="text-[11px] text-text-muted">Requires mobile number. Sends invite link via WhatsApp.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={form.sendWhatsApp} onChange={e => setForm(f => ({ ...f, sendWhatsApp: e.target.checked }))} />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500" />
                </label>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">Custom Message (optional)</label>
                <textarea value={form.customMessage} onChange={e => setForm(f => ({ ...f, customMessage: e.target.value }))} rows={3} placeholder="Add a personal note to the invite email..." className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all resize-none" />
              </div>
              {(form.role === 'Custom Role') && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 space-y-3">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-rose-600" />
                    <p className="text-[13px] font-bold text-rose-700">Save as New Role Template</p>
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.saveAsTemplate} onChange={e => setForm(f => ({ ...f, saveAsTemplate: e.target.checked }))} className="w-4 h-4 rounded border-rose-300 text-rose-600" />
                    <span className="text-[12px] text-rose-700">Save this permission set as a reusable custom role template</span>
                  </label>
                  {form.saveAsTemplate && (
                    <div className="space-y-2">
                      <input value={form.templateName} onChange={e => setForm(f => ({ ...f, templateName: e.target.value }))} placeholder="Template name (e.g. Hybrid Receptionist-Security)" className="w-full px-3 py-2 text-[12px] border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white" />
                      <input value={form.templateDesc} onChange={e => setForm(f => ({ ...f, templateDesc: e.target.value }))} placeholder="Short description of this role's purpose" className="w-full px-3 py-2 text-[12px] border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white" />
                    </div>
                  )}
                </div>
              )}
              {editUser && (
                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5">
                  <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">Account Info</p>
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div><span className="text-text-muted">Last Login:</span> <span className="font-medium text-text-primary">{editUser.lastLogin}</span></div>
                    <div><span className="text-text-muted">Status:</span> <StatusBadge status={editUser.status} /></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-surface/50">
          <button type="button" onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
            className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button type="button" onClick={() => setStep(s => s + 1)} disabled={step === 1 && (!form.fullName || !form.email || !form.role)}
                className="flex items-center gap-2 px-6 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50">
                Continue <ChevronRight size={14} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-70 min-w-[140px] justify-center">
                {submitting ? <><Loader2 size={14} className="animate-spin" />Sending...</> : <><UserPlus size={14} />{editUser ? 'Save Changes' : 'Send Invite'}</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Users Table ──────────────────────────────────────────────────────────────

interface UsersTableProps {
  users: UserRecord[];
  onEdit: (user: UserRecord) => void;
}

function UsersTableComponent({ users, onEdit }: UsersTableProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'name' | 'status' | 'lastLogin'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [showBulkBar, setShowBulkBar] = useState(false);

  const filtered = users
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortField] as string;
      const bv = b[sortField] as string;
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const toggleSelect = (id: string) => {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    setSelected(next);
    setShowBulkBar(next.length > 0);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) { setSelected([]); setShowBulkBar(false); }
    else { setSelected(filtered.map(u => u.id)); setShowBulkBar(true); }
  };

  const toggleSort = (field: 'name' | 'status' | 'lastLogin') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  return (
    <div className="bg-white rounded-card card-shadow border border-border overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border gap-3 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-[12px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 w-56 transition-all" />
        </div>
        <span className="text-[12px] text-text-muted">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Bulk action bar */}
      {showBulkBar && (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 border-b border-primary-100 flex-wrap">
          <span className="text-[12px] font-semibold text-primary-700">{selected.length} selected</span>
          <div className="flex items-center gap-1.5 ml-2 flex-wrap">
            {['Deactivate Selected', 'Change Role', 'Re-assign Sites', 'Apply Custom Role', 'Delete Selected'].map(action => (
              <button key={`bulk-${action}`} className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${action === 'Delete Selected' ? 'border-danger/30 text-danger bg-danger-light hover:bg-danger hover:text-white' : 'border-primary-200 text-primary-700 bg-white hover:bg-primary-100'}`}>
                {action}
              </button>
            ))}
          </div>
          <button onClick={() => { setSelected([]); setShowBulkBar(false); }} className="ml-auto text-[11px] text-text-muted hover:text-text-primary">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="w-10 px-4 py-2.5">
                <button onClick={toggleAll} className="text-text-muted hover:text-primary-600 transition-colors">
                  {selected.length === filtered.length && filtered.length > 0 ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} />}
                </button>
              </th>
              <th className="px-4 py-2.5 text-left">
                <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-[11px] font-bold text-text-secondary uppercase tracking-wide hover:text-primary-600 transition-colors">
                  Name <ArrowUpDown size={10} />
                </button>
              </th>
              <th className="px-4 py-2.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wide">Role</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1">
                Sites Accessible <Tooltip text="Company Admins have global access. All other roles are site-scoped." />
              </th>
              <th className="px-4 py-2.5 text-left">
                <button onClick={() => toggleSort('lastLogin')} className="flex items-center gap-1 text-[11px] font-bold text-text-secondary uppercase tracking-wide hover:text-primary-600 transition-colors">
                  Last Login <ArrowUpDown size={10} />
                </button>
              </th>
              <th className="px-4 py-2.5 text-left">
                <button onClick={() => toggleSort('status')} className="flex items-center gap-1 text-[11px] font-bold text-text-secondary uppercase tracking-wide hover:text-primary-600 transition-colors">
                  Status <ArrowUpDown size={10} />
                </button>
              </th>
              <th className="px-4 py-2.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center">
                  <Users size={28} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-[13px] text-text-muted">No users found. Try adjusting your search.</p>
                </td>
              </tr>
            ) : filtered.map((user) => (
              <tr key={user.id} className={`hover:bg-surface/60 transition-colors ${selected.includes(user.id) ? 'bg-primary-50/40' : ''}`}>
                <td className="px-4 py-3">
                  <button onClick={() => toggleSelect(user.id)} className="text-text-muted hover:text-primary-600 transition-colors">
                    {selected.includes(user.id) ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>{user.initials}</div>
                    <div>
                      <button onClick={() => onEdit(user)} className="text-[13px] font-semibold text-text-primary hover:text-primary-600 transition-colors">{user.name}</button>
                      <p className="text-[11px] text-text-muted">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] font-medium text-text-secondary bg-surface px-2 py-0.5 rounded-badge border border-border">{user.role}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.sites.slice(0, 2).map(s => <SiteBadge key={`${user.id}-${s}`} site={s} />)}
                    {user.sites.length > 2 && <span className="text-[11px] text-text-muted">+{user.sites.length - 2}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-text-muted whitespace-nowrap">{user.lastLogin}</td>
                <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                <td className="px-4 py-3">
                  <div className="relative flex items-center gap-1">
                    <button onClick={() => onEdit(user)} className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-600 transition-colors" title="Edit user">
                      <Edit2 size={13} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary transition-colors" title="View audit trail">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)} className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary transition-colors">
                      <MoreVertical size={13} />
                    </button>
                    {openMenu === user.id && (
                      <div className="absolute right-0 top-8 z-20 bg-white border border-border rounded-xl shadow-dropdown w-44 py-1 fade-in">
                        {[
                          { label: 'Resend Invite', icon: <Mail size={12} /> },
                          { label: 'Preview Experience', icon: <Eye size={12} /> },
                          { label: 'View Audit Trail', icon: <ClipboardList size={12} /> },
                          { label: 'Deactivate', icon: <UserX size={12} />, danger: false },
                          { label: 'Delete User', icon: <Trash2 size={12} />, danger: true },
                        ].map(item => (
                          <button key={`menu-${item.label}`} onClick={() => setOpenMenu(null)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium transition-colors ${item.danger ? 'text-danger hover:bg-danger-light' : 'text-text-secondary hover:bg-surface'}`}>
                            {item.icon}{item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Custom Roles Tab ─────────────────────────────────────────────────────────

function CustomRolesTab() {
  return (
    <div className="space-y-3">
      {CUSTOM_ROLES.map(role => (
        <div key={role.id} className="bg-white rounded-card card-shadow border border-border p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <Star size={16} className="text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[14px] font-bold text-text-primary">{role.name}</p>
                <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded-badge">Custom</span>
              </div>
              <p className="text-[12px] text-text-muted mb-1.5">{role.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-text-muted">
                <span className="flex items-center gap-1"><Users size={10} />{role.usersCount} users</span>
                <span>Based on: <span className="text-text-secondary font-medium">{role.baseRole}</span></span>
                <span>Created: {role.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="px-3 py-1.5 text-[12px] font-semibold text-primary-700 bg-primary-50 border border-primary-100 rounded-lg hover:bg-primary-100 transition-colors">Apply to Users</button>
            <button className="px-3 py-1.5 text-[12px] font-semibold text-text-secondary bg-surface border border-border rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"><Edit2 size={11} />Edit Template</button>
          </div>
        </div>
      ))}
      {CUSTOM_ROLES.length === 0 && (
        <div className="bg-white rounded-card card-shadow border border-border p-10 text-center">
          <Star size={28} className="text-slate-300 mx-auto mb-2" />
          <p className="text-[13px] text-text-muted">No custom roles yet. Create one to support hybrid workflows.</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

// ─── Permissions Matrix Table ─────────────────────────────────────────────────

const V2_ROLES = ['Company Admin', 'Site Admin', 'Host', 'Receptionist / Front Desk Operator', 'Assistant', 'Security Staff'];

const V2_ROLE_COLORS = [
  'text-amber-700 bg-amber-50 border-amber-200',
  'text-primary-700 bg-primary-50 border-primary-200',
  'text-green-700 bg-green-50 border-green-200',
  'text-teal-700 bg-teal-50 border-teal-200',
  'text-slate-700 bg-slate-100 border-slate-200',
  'text-purple-700 bg-purple-50 border-purple-200',
];

const V2_ROLE_SHORT = ['Co. Admin', 'Site Admin', 'Host', 'Receptionist', 'Assistant', 'Security'];

function PermLevelCell({ level }: { level: PermissionLevel }) {
  if (level === 'full') {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center mx-auto">
          <Check size={11} className="text-white" />
        </div>
        <span className="text-[9px] font-semibold text-success-text">Full</span>
      </div>
    );
  }
  if (level === 'view') {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-5 h-5 rounded-full bg-info flex items-center justify-center mx-auto">
          <Eye size={10} className="text-white" />
        </div>
        <span className="text-[9px] font-semibold text-info-text">View</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center mx-auto">
        <X size={10} className="text-slate-400" />
      </div>
      <span className="text-[9px] font-semibold text-slate-400">None</span>
    </div>
  );
}

function PermissionsMatrixTable() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'Visitor Management', 'Front Desk Operations', 'Reports & Analytics',
  ]);

  // Group PERMISSION_ROWS by category prefix for collapsible sections
  const categoryGroups: { group: string; rows: PermissionRow[] }[] = [
    {
      group: 'Visitor Management',
      rows: PERMISSION_ROWS.filter(r => ['visitor_mgmt', 'front_desk', 'kiosk_offline'].includes(r.key)),
    },
    {
      group: 'Reports & Analytics',
      rows: PERMISSION_ROWS.filter(r => ['reports', 'compliance'].includes(r.key)),
    },
    {
      group: 'Operations & Induction',
      rows: PERMISSION_ROWS.filter(r => ['induction', 'workflows'].includes(r.key)),
    },
    {
      group: 'Security & Access',
      rows: PERMISSION_ROWS.filter(r => ['blacklist', 'emergency', 'access_ctrl'].includes(r.key)),
    },
    {
      group: 'Administration',
      rows: PERMISSION_ROWS.filter(r => ['hardware', 'branding', 'users_perms', 'locations'].includes(r.key)),
    },
  ];

  const toggleGroup = (group: string) => {
    setExpandedCategories(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  return (
    <div className="bg-white rounded-card card-shadow border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-2">
        <div>
          <h2 className="text-[15px] font-bold text-text-primary">Permissions Matrix</h2>
          <p className="text-[12px] text-text-muted">Role-based access control across all {V2_ROLES.length} standard roles — read-only reference</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-success inline-block" />Full Access</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-info inline-block" />View Only</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-200 inline-block" />No Access</span>
          </div>
        </div>
      </div>

      {/* Matrix table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b border-border bg-surface/60">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-widest text-text-muted uppercase w-64">
                Permission Area
              </th>
              {V2_ROLES.map((role, idx) => (
                <th key={`v2-mth-${role}`} className="px-3 py-3 text-center">
                  <span className={`inline-flex text-[10px] font-bold px-2 py-1 rounded-badge border ${V2_ROLE_COLORS[idx]}`}>
                    {V2_ROLE_SHORT[idx]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categoryGroups.map((group) => (
              <React.Fragment key={`v2-group-${group.group}`}>
                {/* Group header row */}
                <tr
                  className="border-b border-border/50 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  onClick={() => toggleGroup(group.group)}
                >
                  <td colSpan={V2_ROLES.length + 1} className="px-5 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                        {group.group}
                      </span>
                      <span className="text-[10px] text-text-muted">({group.rows.length} areas)</span>
                      <span className="ml-auto text-[11px] text-text-muted">
                        {expandedCategories.includes(group.group) ? '▲' : '▼'}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Permission rows */}
                {expandedCategories.includes(group.group) && group.rows.map((row, rowIdx) => (
                  <tr
                    key={`v2-row-${row.key}`}
                    className={`border-b border-border/50 transition-colors hover:bg-primary-50/20 ${rowIdx % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                  >
                    <td className="px-5 py-3">
                      <div>
                        <span className="text-[12px] font-semibold text-text-primary">{row.category}</span>
                        <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{row.description}</p>
                      </div>
                    </td>
                    {V2_ROLES.map((role) => {
                      const level: PermissionLevel = (ROLE_DEFAULTS[role]?.[row.key] as PermissionLevel) || 'none';
                      return (
                        <td key={`v2-${row.key}-${role}`} className="px-3 py-3 text-center">
                          <PermLevelCell level={level} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 px-5 py-3 border-t border-border bg-surface/50 flex-wrap">
        <span className="text-[11px] text-text-muted">
          Defaults shown above. Every permission is overridable per user via the Invite / Edit User flow.
        </span>
        <span className="ml-auto text-[11px] text-text-muted">
          Custom roles available on Enterprise plan
        </span>
      </div>
    </div>
  );
}

const TABS: { id: RoleTab; label: string; tooltip: string }[] = [
  { id: 'company-admins', label: 'Company Admins', tooltip: 'Global/tenant-level access. All sites.' },
  { id: 'site-admins', label: 'Site Admins', tooltip: 'Full site-level management within assigned sites.' },
  { id: 'hosts', label: 'Hosts', tooltip: 'Invite creation + basic visitor tracking (site-specific).' },
  { id: 'receptionists', label: 'Receptionists', tooltip: 'Receptionist / Front Desk Operator — optimised for kiosk, badge printing, walk-ins (like Envoy Front Desk + Veris). Security Staff can be given overlapping Front Desk rights when required.' },
  { id: 'assistants', label: 'Assistants', tooltip: 'Delegation support and basic assistance (site-specific).' },
  { id: 'security', label: 'Security Staff', tooltip: 'Watchlist screening, emergency broadcasts, offline auth, access control.' },
  { id: 'custom-roles', label: 'Custom Roles', tooltip: 'Admins can create and save custom role templates (e.g., "Hybrid Receptionist-Security" or "Offline Kiosk Operator").' },
];

export default function UsersPermissions2Page() {
  const [activeTab, setActiveTab] = useState<RoleTab>('company-admins');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);

  const allUsers = Object.values(USERS_BY_TAB).flat();
  const activeCount = allUsers.filter(u => u.status === 'active').length;
  const invitedCount = allUsers.filter(u => u.status === 'invited').length;
  const inactiveCount = allUsers.filter(u => u.status === 'inactive').length;

  const roleCounts: Record<string, number> = {
    'Company Admins': USERS_BY_TAB['company-admins'].length,
    'Site Admins': USERS_BY_TAB['site-admins'].length,
    'Hosts': USERS_BY_TAB['hosts'].length,
    'Receptionists': USERS_BY_TAB['receptionists'].length,
    'Assistants': USERS_BY_TAB['assistants'].length,
    'Security Staff': USERS_BY_TAB['security'].length,
  };

  const currentUsers = USERS_BY_TAB[activeTab] || [];

  // Summary cards data derived from actual users
  const summaryCards = [
    {
      id: 'sc-company-admins',
      icon: <Settings size={18} className="text-amber-600" />,
      label: 'Company Admins',
      count: USERS_BY_TAB['company-admins'].length,
      desc: 'Full platform access · All sites',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      iconBg: 'bg-amber-100',
      countColor: 'text-amber-700',
    },
    {
      id: 'sc-site-admins',
      icon: <Shield size={18} className="text-primary-600" />,
      label: 'Site Admins',
      count: USERS_BY_TAB['site-admins'].length,
      desc: 'Assigned sites only · Full ops',
      bg: 'bg-primary-50',
      border: 'border-primary-100',
      iconBg: 'bg-primary-100',
      countColor: 'text-primary-700',
    },
    {
      id: 'sc-hosts',
      icon: <Users size={18} className="text-green-600" />,
      label: 'Hosts',
      count: USERS_BY_TAB['hosts'].length,
      desc: 'Invite creation · Visitor tracking',
      bg: 'bg-green-50',
      border: 'border-green-100',
      iconBg: 'bg-green-100',
      countColor: 'text-green-700',
    },
    {
      id: 'sc-receptionists',
      icon: <UserCheck size={18} className="text-teal-600" />,
      label: 'Receptionists',
      count: USERS_BY_TAB['receptionists'].length,
      desc: 'Check-in/out · Kiosk ops · Badge printing',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
      iconBg: 'bg-teal-100',
      countColor: 'text-teal-700',
    },
    {
      id: 'sc-assistants',
      icon: <UserPlus size={18} className="text-slate-600" />,
      label: 'Assistants',
      count: USERS_BY_TAB['assistants'].length,
      desc: 'Delegation support · Basic assistance',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      iconBg: 'bg-slate-100',
      countColor: 'text-slate-700',
    },
    {
      id: 'sc-security',
      icon: <Eye size={18} className="text-purple-600" />,
      label: 'Security Staff',
      count: USERS_BY_TAB['security'].length,
      desc: 'Watchlist · Emergency · Access control',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      iconBg: 'bg-purple-100',
      countColor: 'text-purple-700',
    },
  ];

  return (
    <AppLayout>
      <div className="flex gap-5 px-6 py-5 max-w-screen-2xl mx-auto min-h-full">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Page Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-[22px] font-bold text-text-primary">Users &amp; Permissions</h1>
                <span className="text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 rounded-badge">v2</span>
              </div>
              <p className="text-[13px] text-text-muted max-w-2xl">
                Manage company-wide and site-specific users with highly flexible role-based access control (RBAC). Standard roles have smart defaults; every permission is granular and customizable per company needs.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-text-secondary bg-white border border-border rounded-lg hover:bg-surface transition-all shadow-sm">
                <Eye size={13} />Preview User Experience
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-text-secondary bg-white border border-border rounded-lg hover:bg-surface transition-all shadow-sm">
                <Download size={13} />Export User List
              </button>
              <button onClick={() => { setEditUser(null); setShowInviteModal(true); }}
                className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm">
                <UserPlus size={13} />Invite New User
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-all shadow-sm">
                <Plus size={13} />Create Custom Role
              </button>
            </div>
          </div>

          {/* ── Summary Cards ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {summaryCards.map((card) => (
              <div
                key={card.id}
                className={`bg-white rounded-card card-shadow border ${card.border} p-4 flex items-center gap-3 hover:shadow-card-md transition-shadow duration-200`}
              >
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-[13px] font-bold text-text-primary leading-tight">{card.label}</p>
                    <span className={`text-[12px] font-bold tabular-nums ${card.countColor} bg-white/70 px-1.5 py-0.5 rounded-lg border ${card.border}`}>
                      {card.count}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted truncate mt-0.5">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-end gap-0 border-b border-border overflow-x-auto scrollbar-thin">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === tab.id ? 'text-primary-700 border-primary-600' : 'text-text-muted border-transparent hover:text-text-primary hover:border-slate-300'}`}>
                {tab.label}
                {tab.id !== 'custom-roles' && USERS_BY_TAB[tab.id].length > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                    {tab.id === 'custom-roles' ? CUSTOM_ROLES.length : USERS_BY_TAB[tab.id].length}
                  </span>
                )}
                {tab.id === 'custom-roles' && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                    {CUSTOM_ROLES.length}
                  </span>
                )}
                <Tooltip text={tab.tooltip} />
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'custom-roles' ? (
            <CustomRolesTab />
          ) : (
            <UsersTableComponent users={currentUsers} onEdit={(user) => { setEditUser(user); setShowInviteModal(true); }} />
          )}

          {/* ── Permissions Matrix Table ───────────────────────────────── */}
          <PermissionsMatrixTable />

          {/* Footer note */}
          <p className="text-[11px] text-text-muted text-center pb-2">
            All roles are site-specific except Company Admin. Permissions are fully dynamic and overridable to support any operational model (Receptionist-Security overlap, offline scenarios, multi-site variations). Every action is audited and DPDP compliant.
          </p>
        </div>

        {/* Right Helper Panel */}
        <div className="w-64 shrink-0 space-y-4">
          {/* User Summary Card */}
          <div className="bg-white rounded-card card-shadow border border-border p-4 sticky top-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                <Users size={14} className="text-primary-600" />
              </div>
              <p className="text-[13px] font-bold text-text-primary">User Summary</p>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-muted">Total Users</span>
                <span className="text-[14px] font-bold text-text-primary">{allUsers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-muted flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success inline-block" />Active</span>
                <span className="text-[13px] font-semibold text-success-text">{activeCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-muted flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning inline-block" />Pending Invites</span>
                <span className="text-[13px] font-semibold text-warning-text">{invitedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-muted flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />Inactive</span>
                <span className="text-[13px] font-semibold text-slate-500">{inactiveCount}</span>
              </div>
            </div>

            {/* Role breakdown */}
            <div className="border-t border-border pt-3 mb-3">
              <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide mb-2">By Role</p>
              <div className="space-y-1.5">
                {Object.entries(roleCounts).map(([role, count]) => (
                  <div key={`rc-${role}`} className="flex items-center justify-between">
                    <span className="text-[11px] text-text-muted truncate">{role}</span>
                    <span className="text-[11px] font-semibold text-text-secondary ml-2">{count}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">Custom Roles</span>
                  <span className="text-[11px] font-semibold text-text-secondary">{CUSTOM_ROLES.length} templates</span>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-primary-700 bg-primary-50 border border-primary-100 rounded-lg hover:bg-primary-100 transition-colors">
              <Download size={12} />Download Permissions Audit Report
            </button>
          </div>

          {/* Help Card */}
          <div className="bg-amber-50 rounded-card border border-amber-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-amber-600" />
              <p className="text-[12px] font-bold text-amber-700">RBAC Tips</p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-amber-700">
              <li className="flex items-start gap-1.5"><ChevronRight size={10} className="shrink-0 mt-0.5" />Receptionist role mirrors Envoy Front Desk Admin + Veris front-desk focus</li>
              <li className="flex items-start gap-1.5"><ChevronRight size={10} className="shrink-0 mt-0.5" />Security Staff can be given overlapping Front Desk rights when required</li>
              <li className="flex items-start gap-1.5"><ChevronRight size={10} className="shrink-0 mt-0.5" />Use Custom Roles for hybrid workflows (e.g., offline kiosk operators)</li>
              <li className="flex items-start gap-1.5"><ChevronRight size={10} className="shrink-0 mt-0.5" />All permission changes are DPDP-audited in real time</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-card card-shadow border border-border p-4">
            <p className="text-[12px] font-bold text-text-primary mb-2.5">Quick Actions</p>
            <div className="space-y-1.5">
              {[
                { label: 'Invite New User', icon: <UserPlus size={12} />, action: () => { setEditUser(null); setShowInviteModal(true); } },
                { label: 'Create Custom Role', icon: <Star size={12} />, action: () => {} },
                { label: 'Export User List (CSV)', icon: <Download size={12} />, action: () => {} },
                { label: 'View Audit Trail', icon: <ClipboardList size={12} />, action: () => {} },
              ].map(item => (
                <button key={`qa-${item.label}`} onClick={item.action}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-primary-50 hover:text-primary-700 hover:border-primary-100 transition-all text-left">
                  <span className="text-primary-500">{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showInviteModal && (
        <InviteModal onClose={() => { setShowInviteModal(false); setEditUser(null); }} editUser={editUser} />
      )}
    </AppLayout>
  );
}
