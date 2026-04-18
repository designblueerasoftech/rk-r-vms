'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { HelpCircle, RefreshCw, Download, Search, Plus, Upload, X, ChevronDown, Check, ToggleLeft, ToggleRight, Crown, Shield, UserCheck, Eye, Headphones, Users, Calendar, Camera, CheckCircle2, XCircle, Send, FileText, Link2, Loader2, ChevronRight, RotateCcw, Lock } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleType = 'Super Admin' | 'Site Admin' | 'Front Desk Admin' | 'Security Admin' | 'Host' | 'Assistant';
type StatusType = 'Active' | 'Inactive';

interface Employee {
  id: string;
  initials: string;
  color: string;
  name: string;
  email: string;
  mobile: string;
  role: RoleType;
  title: string;
  department: string;
  primarySite: string;
  assignedSites: string[];
  manager: string;
  assistants: string[];
  showAsHost: boolean;
  lastLogin: string;
  status: StatusType;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SITES = ['Mumbai HQ', 'Delhi NCR', 'Bengaluru Tech Park', 'Hyderabad Campus', 'Chennai Data Centre'];

const EMPLOYEES: Employee[] = [
  { id: 'e-001', initials: 'RP', color: 'bg-amber-600', name: 'Reeja Patel', email: 'reeja.patel@acmecorp.in', mobile: '+91 98765 43210', role: 'Super Admin', title: 'CTO', department: 'Technology', primarySite: 'Mumbai HQ', assignedSites: ['Mumbai HQ', 'Delhi NCR', 'Bengaluru Tech Park', 'Hyderabad Campus', 'Chennai Data Centre'], manager: 'None', assistants: ['Anand Sharma'], showAsHost: false, lastLogin: '10 Apr 2026, 08:15 AM', status: 'Active' },
  { id: 'e-002', initials: 'AS', color: 'bg-blue-600', name: 'Anand Sharma', email: 'anand.sharma@acmecorp.in', mobile: '+91 98765 43211', role: 'Site Admin', title: 'Site Manager', department: 'Operations', primarySite: 'Mumbai HQ', assignedSites: ['Mumbai HQ', 'Delhi NCR'], manager: 'Reeja Patel', assistants: [], showAsHost: false, lastLogin: '09 Apr 2026, 06:32 PM', status: 'Active' },
  { id: 'e-003', initials: 'PM', color: 'bg-indigo-600', name: 'Priya Mehta', email: 'priya.mehta@acmecorp.in', mobile: '+91 98765 43212', role: 'Front Desk Admin', title: 'Receptionist', department: 'Administration', primarySite: 'Bengaluru Tech Park', assignedSites: ['Bengaluru Tech Park'], manager: 'Anand Sharma', assistants: [], showAsHost: false, lastLogin: '10 Apr 2026, 07:55 AM', status: 'Active' },
  { id: 'e-004', initials: 'RS', color: 'bg-purple-600', name: 'Rahul Sharma', email: 'rahul.sharma@acmecorp.in', mobile: '+91 98765 43213', role: 'Security Admin', title: 'Security Lead', department: 'Security', primarySite: 'Delhi NCR', assignedSites: ['Delhi NCR', 'Mumbai HQ'], manager: 'Reeja Patel', assistants: [], showAsHost: false, lastLogin: '10 Apr 2026, 08:02 AM', status: 'Active' },
  { id: 'e-005', initials: 'KJ', color: 'bg-orange-600', name: 'Kavita Joshi', email: 'kavita.joshi@acmecorp.in', mobile: '+91 98765 43214', role: 'Host', title: 'Engineering Manager', department: 'Engineering', primarySite: 'Bengaluru Tech Park', assignedSites: ['Bengaluru Tech Park'], manager: 'Anand Sharma', assistants: ['Meera Gupta'], showAsHost: true, lastLogin: '08 Apr 2026, 05:14 PM', status: 'Active' },
  { id: 'e-006', initials: 'MG', color: 'bg-pink-600', name: 'Meera Gupta', email: 'meera.gupta@acmecorp.in', mobile: '+91 98765 43215', role: 'Assistant', title: 'Executive Assistant', department: 'Administration', primarySite: 'Bengaluru Tech Park', assignedSites: ['Bengaluru Tech Park'], manager: 'Kavita Joshi', assistants: [], showAsHost: true, lastLogin: '10 Apr 2026, 08:00 AM', status: 'Active' },
  { id: 'e-007', initials: 'DK', color: 'bg-teal-600', name: 'Deepak Kumar', email: 'deepak.kumar@acmecorp.in', mobile: '+91 98765 43216', role: 'Host', title: 'Product Manager', department: 'Product', primarySite: 'Mumbai HQ', assignedSites: ['Mumbai HQ'], manager: 'Reeja Patel', assistants: [], showAsHost: true, lastLogin: '10 Apr 2026, 07:30 AM', status: 'Active' },
  { id: 'e-008', initials: 'AT', color: 'bg-cyan-600', name: 'Arun Tiwari', email: 'arun.tiwari@acmecorp.in', mobile: '+91 98765 43217', role: 'Front Desk Admin', title: 'Front Desk Officer', department: 'Administration', primarySite: 'Hyderabad Campus', assignedSites: ['Hyderabad Campus'], manager: 'Anand Sharma', assistants: [], showAsHost: false, lastLogin: '10 Apr 2026, 07:45 AM', status: 'Inactive' },
  { id: 'e-009', initials: 'SN', color: 'bg-green-600', name: 'Sneha Nair', email: 'sneha.nair@acmecorp.in', mobile: '+91 98765 43218', role: 'Security Admin', title: 'Security Officer', department: 'Security', primarySite: 'Chennai Data Centre', assignedSites: ['Chennai Data Centre'], manager: 'Rahul Sharma', assistants: [], showAsHost: false, lastLogin: '09 Apr 2026, 04:22 PM', status: 'Active' },
  { id: 'e-010', initials: 'LK', color: 'bg-violet-600', name: 'Lakshmi Krishnan', email: 'lakshmi.k@acmecorp.in', mobile: '+91 98765 43219', role: 'Assistant', title: 'PA to Director', department: 'Administration', primarySite: 'Chennai Data Centre', assignedSites: ['Chennai Data Centre'], manager: 'Deepak Kumar', assistants: [], showAsHost: false, lastLogin: '09 Apr 2026, 03:10 PM', status: 'Active' },
];

const ROLE_CONFIG: Record<RoleType, { color: string; bg: string; border: string; icon: React.ReactNode; desc: string }> = {
  'Super Admin': { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: <Crown size={16} className="text-amber-600" />, desc: 'Full platform access across all sites' },
  'Site Admin': { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: <Shield size={16} className="text-blue-600" />, desc: 'Manages one or more specific sites' },
  'Front Desk Admin': { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: <UserCheck size={16} className="text-green-600" />, desc: 'Handles reception, manual check-in/out, badge printing' },
  'Security Admin': { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: <Eye size={16} className="text-purple-600" />, desc: 'Security staff, blacklist alerts, live headcount, evacuation' },
  'Host': { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: <Users size={16} className="text-orange-600" />, desc: 'Regular employee who invites visitors and receives notifications' },
  'Assistant': { color: 'text-pink-700', bg: 'bg-pink-50', border: 'border-pink-200', icon: <Headphones size={16} className="text-pink-600" />, desc: 'Delegate who can act on behalf of one or more Hosts' },
};

const ROLE_CARD_CONFIG = [
  { role: 'Super Admin' as RoleType, iconBg: 'bg-amber-100', countBg: 'bg-amber-100 text-amber-700' },
  { role: 'Site Admin' as RoleType, iconBg: 'bg-blue-100', countBg: 'bg-blue-100 text-blue-700' },
  { role: 'Front Desk Admin' as RoleType, iconBg: 'bg-green-100', countBg: 'bg-green-100 text-green-700' },
  { role: 'Security Admin' as RoleType, iconBg: 'bg-purple-100', countBg: 'bg-purple-100 text-purple-700' },
  { role: 'Host' as RoleType, iconBg: 'bg-orange-100', countBg: 'bg-orange-100 text-orange-700' },
  { role: 'Assistant' as RoleType, iconBg: 'bg-pink-100', countBg: 'bg-pink-100 text-pink-700' },
];

// ─── Permission Matrix Data ───────────────────────────────────────────────────

const FEATURE_MODULES = [
  'Dashboard',
  'Visitor Logs',
  'Visitor Types',
  'Work Flows',
  'Induction Hub',
  'Branding & Appearance',
  'Blacklist & Watchlists',
  'Sites & Locations',
  'Gates & Entry Points',
  'Access Zones',
  'Kiosks & Hardware',
  'Users & Permissions',
  'Integrations',
  'Notifications',
  'Reports & Analytics',
  'Compliance & Audit',
  'Settings',
  'Invite Visitors',
  'Approve / Reject Visits',
  'Print Badges',
];

const ORDERED_ROLES: RoleType[] = ['Super Admin', 'Site Admin', 'Front Desk Admin', 'Security Admin', 'Host', 'Assistant'];

// Default permissions per role per feature
const DEFAULT_PERMISSIONS: Record<RoleType, Record<string, boolean>> = {
  'Super Admin': Object.fromEntries(FEATURE_MODULES.map(f => [f, true])),
  'Site Admin': Object.fromEntries(FEATURE_MODULES.map(f => [f, ['Dashboard','Visitor Logs','Visitor Types','Work Flows','Induction Hub','Branding & Appearance','Blacklist & Watchlists','Sites & Locations','Gates & Entry Points','Access Zones','Kiosks & Hardware','Notifications','Reports & Analytics','Compliance & Audit','Settings','Invite Visitors','Approve / Reject Visits','Print Badges'].includes(f)])),
  'Front Desk Admin': Object.fromEntries(FEATURE_MODULES.map(f => [f, ['Dashboard','Visitor Logs','Visitor Types','Induction Hub','Blacklist & Watchlists','Notifications','Invite Visitors','Approve / Reject Visits','Print Badges'].includes(f)])),
  'Security Admin': Object.fromEntries(FEATURE_MODULES.map(f => [f, ['Dashboard','Visitor Logs','Blacklist & Watchlists','Gates & Entry Points','Access Zones','Notifications','Reports & Analytics','Compliance & Audit'].includes(f)])),
  'Host': Object.fromEntries(FEATURE_MODULES.map(f => [f, ['Dashboard','Visitor Logs','Notifications','Invite Visitors','Approve / Reject Visits'].includes(f)])),
  'Assistant': Object.fromEntries(FEATURE_MODULES.map(f => [f, ['Dashboard','Visitor Logs','Notifications','Invite Visitors','Approve / Reject Visits','Print Badges'].includes(f)])),
};

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: RoleType }) {
  const cfg = ROLE_CONFIG[role];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
      {cfg.icon}
      {role}
    </span>
  );
}

// ─── Status Pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: StatusType }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
      {status}
    </span>
  );
}

// ─── Kiosk Toggle ─────────────────────────────────────────────────────────────

function KioskToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center">
      {value
        ? <ToggleRight size={22} className="text-indigo-600" />
        : <ToggleLeft size={22} className="text-slate-300" />
      }
    </button>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <HelpCircle size={15} className="text-text-muted cursor-help" />
      {show && (
        <div className="absolute left-6 top-0 z-50 w-56 bg-slate-800 text-white text-[11px] rounded-lg px-3 py-2 shadow-xl whitespace-normal">
          {text}
        </div>
      )}
    </div>
  );
}

// ─── Multi-Select Dropdown ────────────────────────────────────────────────────

function MultiSelect({ options, value, onChange, placeholder }: { options: string[]; value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-[12px] bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 text-left"
      >
        <span className={value.length === 0 ? 'text-text-muted' : 'text-text-primary'}>
          {value.length === 0 ? placeholder : value.join(', ')}
        </span>
        <ChevronDown size={13} className="text-text-muted shrink-0" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-border rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => toggle(opt)}
              className="flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-surface cursor-pointer"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${value.includes(opt) ? 'bg-primary-600 border-primary-600' : 'border-border'}`}>
                {value.includes(opt) && <Check size={10} className="text-white" />}
              </div>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Employee Drawer ──────────────────────────────────────────────────────────

interface DrawerProps {
  employee: Employee | null;
  onClose: () => void;
  onSave: (emp: Employee) => void;
}

function EmployeeDrawer({ employee, onClose, onSave }: DrawerProps) {
  const isNew = !employee?.id || employee.id === 'new';
  const [form, setForm] = useState<Employee>(employee || {
    id: 'new', initials: '', color: 'bg-primary-600', name: '', email: '', mobile: '',
    role: 'Host', title: '', department: '', primarySite: '', assignedSites: [],
    manager: 'None', assistants: [], showAsHost: false, lastLogin: '', status: 'Active',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Employee, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      onSave(form);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const showKioskToggle = form.role === 'Host' || form.role === 'Assistant';

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-[480px] bg-white h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-[15px] font-bold text-text-primary">{isNew ? 'Add New Employee / Invite User' : form.name}</h2>
            <p className="text-[11px] text-text-muted">{isNew ? 'Fill in details and send an invite' : form.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold bg-green-50 border border-green-200 px-2 py-1 rounded-lg">
                <CheckCircle2 size={12} /> Saved
              </span>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-text-muted">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Photo */}
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-full ${form.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
              {form.initials || (form.name ? form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?')}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-border rounded-lg hover:bg-surface text-text-secondary">
              <Camera size={13} /> Upload Photo
            </button>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Contact</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Full Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Priya Mehta" className="w-full px-3 py-2 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Email Address <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="e.g. priya@company.com" className="w-full px-3 py-2 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Mobile Number</label>
                <input value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="+91 98765 43210" className="w-full px-3 py-2 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
              </div>
            </div>
          </div>

          {/* Work */}
          <div>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Work</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-text-secondary mb-1">Title</label>
                  <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Site Manager" className="w-full px-3 py-2 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-text-secondary mb-1">Department</label>
                  <input value={form.department} onChange={e => set('department', e.target.value)} placeholder="e.g. Operations" className="w-full px-3 py-2 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Manager</label>
                <select value={form.manager} onChange={e => set('manager', e.target.value)} className="w-full px-3 py-2 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white">
                  <option value="None">None</option>
                  {EMPLOYEES.filter(e => e.id !== form.id).map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Assistant(s)</label>
                <MultiSelect options={EMPLOYEES.filter(e => e.id !== form.id).map(e => e.name)} value={form.assistants} onChange={v => set('assistants', v)} placeholder="Select assistants..." />
              </div>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Locations</h3>
            <div>
              <label className="block text-[12px] font-medium text-text-secondary mb-1">Assigned Sites {form.role !== 'Super Admin' && <span className="text-red-500">*</span>}</label>
              <MultiSelect options={SITES} value={form.assignedSites} onChange={v => set('assignedSites', v)} placeholder="Select sites..." />
              {form.role === 'Super Admin' && <p className="text-[11px] text-text-muted mt-1">Super Admin has access to all sites automatically.</p>}
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Additional Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Role</label>
                <select value={form.role} onChange={e => set('role', e.target.value as RoleType)} className="w-full px-3 py-2 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white">
                  {(Object.keys(ROLE_CONFIG) as RoleType[]).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {showKioskToggle && (
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                  <div>
                    <p className="text-[12px] font-medium text-text-primary">Show as Host on Kiosk</p>
                    <p className="text-[11px] text-text-muted">Visitor can select this person as their host at the kiosk</p>
                  </div>
                  <KioskToggle value={form.showAsHost} onChange={v => set('showAsHost', v)} />
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                <div>
                  <p className="text-[12px] font-medium text-text-primary">Calendar Sync</p>
                  <p className="text-[11px] text-text-muted">Sync calendar for availability-based visitor scheduling</p>
                </div>
                <KioskToggle value={false} onChange={() => {}} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-5 py-4 border-t border-border shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-[12px] font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            {isNew ? 'Send Invite' : 'Save Changes'}
          </button>
          <button onClick={onClose} className="px-4 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Import Modal ─────────────────────────────────────────────────────────────

function ImportModal({ onClose }: { onClose: () => void }) {
  const [method, setMethod] = useState<'csv' | 'hris'>('csv');
  const [step, setStep] = useState<'select' | 'preview'>('select');
  const [dragging, setDragging] = useState(false);

  const previewRows = [
    { name: 'Test User 1', email: 'test1@company.com', role: 'Host', department: 'Engineering', site: 'Mumbai HQ' },
    { name: 'Test User 2', email: 'test2@company.com', role: 'Front Desk Admin', department: 'Admin', site: 'Delhi NCR' },
    { name: 'Test User 3', email: 'test3@company.com', role: 'Assistant', department: 'Operations', site: 'Bengaluru Tech Park' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-[15px] font-bold text-text-primary">Import Employees</h2>
            <p className="text-[12px] text-text-muted">Import from CSV file or sync from your HRIS</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-text-muted"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {step === 'select' && (
            <>
              {/* Method Tabs */}
              <div className="flex gap-2">
                {(['csv', 'hris'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-[13px] font-semibold transition-all ${method === m ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-border text-text-secondary hover:border-primary-200'}`}
                  >
                    {m === 'csv' ? <><FileText size={16} /> Import from CSV</> : <><Link2 size={16} /> Sync from HRIS</>}
                  </button>
                ))}
              </div>

              {method === 'csv' && (
                <div>
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); }}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragging ? 'border-primary-400 bg-primary-50' : 'border-border hover:border-primary-300'}`}
                  >
                    <Upload size={32} className="mx-auto text-text-muted mb-3" />
                    <p className="text-[13px] font-semibold text-text-primary mb-1">Drag & drop your CSV file here</p>
                    <p className="text-[12px] text-text-muted mb-3">or click to browse</p>
                    <button className="px-4 py-2 bg-primary-600 text-white text-[12px] font-semibold rounded-lg hover:bg-primary-700">Browse File</button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Download size={13} className="text-primary-600" />
                    <a href="#" className="text-[12px] text-primary-600 hover:underline font-medium">Download CSV Template</a>
                  </div>
                </div>
              )}

              {method === 'hris' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-text-primary">Active Directory / Okta</p>
                        <p className="text-[11px] text-green-600 font-medium">Connected · Last sync: 15 min ago</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-primary-600 text-white text-[12px] font-semibold rounded-lg hover:bg-primary-700">Sync Now</button>
                  </div>
                  <div className="p-3 bg-surface rounded-lg border border-border text-[12px] text-text-muted">
                    Syncing will import all employees from your connected HRIS. Existing records will be updated, new ones will be added.
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'preview' && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} className="text-green-600" />
                <p className="text-[13px] font-semibold text-text-primary">3 employees ready to import</p>
              </div>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead className="bg-surface">
                    <tr>
                      {['Name', 'Email', 'Role', 'Department', 'Site'].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr key={i} className="border-t border-border hover:bg-surface/50">
                        <td className="px-3 py-2 font-medium text-text-primary">{row.name}</td>
                        <td className="px-3 py-2 text-text-muted">{row.email}</td>
                        <td className="px-3 py-2"><RoleBadge role={row.role as RoleType} /></td>
                        <td className="px-3 py-2 text-text-secondary">{row.department}</td>
                        <td className="px-3 py-2 text-text-secondary">{row.site}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface">Cancel</button>
          <div className="flex items-center gap-2">
            {step === 'preview' && (
              <button onClick={() => setStep('select')} className="px-4 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface">Back</button>
            )}
            <button
              onClick={() => step === 'select' ? setStep('preview') : onClose()}
              className="px-4 py-2 bg-primary-600 text-white text-[12px] font-semibold rounded-lg hover:bg-primary-700"
            >
              {step === 'select' ? 'Preview Import' : 'Import'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Directory Tab ───────────────────────────────────────────────────

function EmployeeDirectoryTab() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerEmployee, setDrawerEmployee] = useState<Employee | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [saved, setSaved] = useState(false);
  const [kioskStates, setKioskStates] = useState<Record<string, boolean>>(
    Object.fromEntries(EMPLOYEES.map(e => [e.id, e.showAsHost]))
  );

  // Build a map: assistant name -> list of hosts they assist
  const assistantToMap = React.useMemo(() => {
    const map: Record<string, string[]> = {};
    employees.forEach(emp => {
      emp.assistants.forEach(assistantName => {
        if (!map[assistantName]) map[assistantName] = [];
        map[assistantName].push(emp.name);
      });
    });
    return map;
  }, [employees]);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(e => e.id));
  const toggleOne = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSave = (emp: Employee) => {
    setEmployees(prev => prev.some(e => e.id === emp.id) ? prev.map(e => e.id === emp.id ? emp : e) : [...prev, { ...emp, id: `e-${Date.now()}` }]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setDrawerEmployee(null);
  };

  const handleKioskToggle = (id: string, val: boolean) => {
    setKioskStates(prev => ({ ...prev, [id]: val }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="pl-8 pr-3 py-2 text-[12px] bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 w-56"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface bg-white">
            <Download size={13} /> Export CSV
          </button>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold bg-green-50 border border-green-200 px-2 py-1 rounded-lg">
              <CheckCircle2 size={12} /> Saved
            </span>
          )}
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface bg-white"
          >
            <Upload size={13} /> Import Employees
          </button>
          <button
            onClick={() => setDrawerEmployee({ id: 'new', initials: '', color: 'bg-primary-600', name: '', email: '', mobile: '', role: 'Host', title: '', department: '', primarySite: '', assignedSites: [], manager: 'None', assistants: [], showAsHost: false, lastLogin: '', status: 'Active' })}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-[12px] font-semibold rounded-lg transition-colors"
          >
            <Plus size={13} /> Add New Employee / Invite User
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 border border-primary-200 rounded-xl">
          <span className="text-[12px] font-semibold text-primary-700">{selected.length} selected</span>
          <div className="w-px h-4 bg-primary-200 mx-1" />
          <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-primary-700 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
            <Send size={12} /> Invite Selected
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">
            <XCircle size={12} /> Deactivate
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-text-secondary bg-white border border-border rounded-lg hover:bg-surface">
            <Download size={12} /> Export CSV
          </button>
          <button onClick={() => setSelected([])} className="ml-auto p-1 rounded hover:bg-primary-100 text-primary-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-card card-shadow border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] min-w-[1300px]">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-border" />
                </th>
                {['USER', 'MOBILE', 'ROLE', 'TITLE / DEPT', 'PRIMARY SITE / ASSIGNED', 'MANAGER', 'ASSISTANT(S)', 'ASSISTANT TO', 'HOST ON KIOSK', 'LAST LOGIN', 'STATUS'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
                <th className="px-3 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const assistantTo = assistantToMap[emp.name] || [];
                return (
                  <tr
                    key={emp.id}
                    onClick={() => setDrawerEmployee(emp)}
                    className="border-t border-border hover:bg-surface/60 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3" onClick={e => { e.stopPropagation(); toggleOne(emp.id); }}>
                      <input type="checkbox" checked={selected.includes(emp.id)} onChange={() => toggleOne(emp.id)} className="rounded border-border" />
                    </td>
                    {/* User */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${emp.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                          {emp.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-text-primary truncate">{emp.name}</p>
                          <p className="text-[11px] text-text-muted truncate">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Mobile */}
                    <td className="px-3 py-3 text-text-secondary whitespace-nowrap">{emp.mobile}</td>
                    {/* Role */}
                    <td className="px-3 py-3"><RoleBadge role={emp.role} /></td>
                    {/* Title/Dept */}
                    <td className="px-3 py-3">
                      <p className="font-medium text-text-primary">{emp.title}</p>
                      <p className="text-[11px] text-text-muted">{emp.department}</p>
                    </td>
                    {/* Sites */}
                    <td className="px-3 py-3">
                      <p className="font-medium text-text-primary">{emp.primarySite}</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {emp.assignedSites.slice(0, 2).map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md">{s}</span>
                        ))}
                        {emp.assignedSites.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md">+{emp.assignedSites.length - 2}</span>
                        )}
                      </div>
                    </td>
                    {/* Manager */}
                    <td className="px-3 py-3 text-text-secondary">{emp.manager}</td>
                    {/* Assistants */}
                    <td className="px-3 py-3 text-text-secondary">
                      {emp.assistants.length === 0 ? '—' : emp.assistants.length === 1 ? emp.assistants[0] : `${emp.assistants.length} assistants`}
                    </td>
                    {/* Assistant To */}
                    <td className="px-3 py-3">
                      {emp.role === 'Assistant' && assistantTo.length > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          {assistantTo.map(name => (
                            <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-50 text-pink-700 border border-pink-200 rounded-full text-[10px] font-semibold whitespace-nowrap">
                              {name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-text-muted text-[11px]">—</span>
                      )}
                    </td>
                    {/* Kiosk Toggle */}
                    <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                      {(emp.role === 'Host' || emp.role === 'Assistant') ? (
                        <KioskToggle value={kioskStates[emp.id] ?? emp.showAsHost} onChange={v => handleKioskToggle(emp.id, v)} />
                      ) : (
                        <span className="text-text-muted text-[11px]">—</span>
                      )}
                    </td>
                    {/* Last Login */}
                    <td className="px-3 py-3 text-text-muted whitespace-nowrap">{emp.lastLogin || '—'}</td>
                    {/* Status */}
                    <td className="px-3 py-3"><StatusPill status={emp.status} /></td>
                    {/* Actions */}
                    <td className="px-3 py-3">
                      <button onClick={e => { e.stopPropagation(); setDrawerEmployee(emp); }} className="p-1.5 rounded-lg hover:bg-surface text-text-muted">
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={13} className="px-4 py-10 text-center text-text-muted text-[13px]">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <p className="text-[12px] text-text-muted">{filtered.length} of {employees.length} employees</p>
        </div>
      </div>

      {drawerEmployee && <EmployeeDrawer employee={drawerEmployee} onClose={() => setDrawerEmployee(null)} onSave={handleSave} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}

// ─── Permission Matrix ────────────────────────────────────────────────────────

type PermissionsState = Record<RoleType, Record<string, boolean>>;

const ROLE_MATRIX_CONFIG: Record<RoleType, { dot: string; badge: string; icon: React.ReactNode; lockColor: string }> = {
  'Super Admin': { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Crown size={13} className="text-amber-600" />, lockColor: 'text-amber-400' },
  'Site Admin': { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Shield size={13} className="text-blue-600" />, lockColor: 'text-blue-300' },
  'Front Desk Admin': { dot: 'bg-green-500', badge: 'bg-green-50 text-green-700 border-green-200', icon: <UserCheck size={13} className="text-green-600" />, lockColor: 'text-green-300' },
  'Security Admin': { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 border-purple-200', icon: <Eye size={13} className="text-purple-600" />, lockColor: 'text-purple-300' },
  'Host': { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200', icon: <Users size={13} className="text-orange-600" />, lockColor: 'text-orange-300' },
  'Assistant': { dot: 'bg-pink-500', badge: 'bg-pink-50 text-pink-700 border-pink-200', icon: <Headphones size={13} className="text-pink-600" />, lockColor: 'text-pink-300' },
};

function PermissionCell({
  role,
  feature,
  isChecked,
  onToggle,
}: {
  role: RoleType;
  feature: string;
  isChecked: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isSuperAdmin = role === 'Super Admin';

  return (
    <td
      className="px-2 py-2.5 text-center relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isSuperAdmin ? (
        <div className="flex items-center justify-center">
          <div className="relative group">
            <div
              className="w-5 h-5 rounded-[4px] flex items-center justify-center opacity-60 cursor-not-allowed"
              style={{ background: '#4F46E5', border: '1px solid #4338CA', minWidth: '20px', minHeight: '20px' }}
            >
              <Check size={12} strokeWidth={3} className="text-white" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center">
              <Lock size={7} className="text-amber-600" />
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded-[4px] flex items-center justify-center mx-auto transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300 ${
            isChecked
              ? 'hover:opacity-80' :'bg-white border border-slate-300 hover:border-indigo-400'
          }`}
          style={isChecked ? { background: '#4F46E5', border: '1px solid #4338CA', minWidth: '20px', minHeight: '20px' } : { minWidth: '20px', minHeight: '20px' }}
          title={`${isChecked ? 'Remove' : 'Grant'} ${role} access to ${feature}`}
        >
          {isChecked && <Check size={12} strokeWidth={3} className="text-white" />}
        </button>
      )}
      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-52 bg-slate-800 text-white text-[10px] rounded-xl px-3 py-2 shadow-2xl whitespace-normal pointer-events-none leading-relaxed">
          <span className="font-semibold">{role}</span>
          {isChecked || isSuperAdmin ? (
            <span className="text-indigo-300"> can access </span>
          ) : (
            <span className="text-slate-400"> cannot access </span>
          )}
          <span className="font-medium">{feature}</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </td>
  );
}

function PermissionMatrixSection() {
  const [permissions, setPermissions] = useState<PermissionsState>(() =>
    JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS))
  );
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const filteredFeatures = FEATURE_MODULES.filter(f =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  const togglePermission = useCallback((role: RoleType, feature: string) => {
    if (role === 'Super Admin') return;
    setPermissions(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as PermissionsState;
      next[role][feature] = !next[role][feature];
      return next;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  const handleReset = () => {
    setPermissions(JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div
      className="rounded-2xl border border-slate-200/80 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.90) 100%)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Matrix Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-slate-200/70 flex-wrap gap-3"
        style={{ background: 'linear-gradient(to right, rgba(248,250,252,0.8), rgba(241,245,249,0.6))' }}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-text-primary">Roles &amp; Permissions Matrix</h2>
          <div
            className="relative inline-flex"
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
          >
            <HelpCircle size={15} className="text-text-muted cursor-help" />
            {showHelp && (
              <div className="absolute left-6 top-0 z-50 w-72 bg-slate-800 text-white text-[11px] rounded-xl px-3 py-2.5 shadow-2xl whitespace-normal leading-relaxed">
                Click any circle to toggle a permission ON or OFF for that role. Super Admin permissions are fixed and always enabled. Changes are auto-saved instantly.
                <div className="absolute top-2 -left-1.5 border-4 border-transparent border-r-slate-800" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Legend */}
          <div className="flex items-center gap-3 px-3.5 py-2 bg-white/70 rounded-xl border border-slate-200/80 text-[11px] shadow-sm">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Legend</span>
            <div className="w-px h-3.5 bg-slate-200" />
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-5 h-5 rounded-[4px] flex items-center justify-center inline-flex" style={{ background: '#4F46E5', border: '1px solid #4338CA' }}>
                <Check size={11} strokeWidth={3} className="text-white" />
              </span>
              Full Access
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <span className="w-5 h-5 rounded-[4px] bg-white border border-slate-300 inline-block" />
              No Access
            </span>
          </div>

          {/* Auto-save indicator */}
          {saved && (
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-sm">
              <CheckCircle2 size={13} className="text-emerald-500" /> Saved
            </span>
          )}

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 bg-white/80 transition-all duration-150 shadow-sm"
          >
            <RotateCcw size={13} /> Reset to Default
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-3 border-b border-slate-200/60" style={{ background: 'rgba(248,250,252,0.5)' }}>
        <div className="relative max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search feature modules..."
            className="pl-8 pr-3 py-2 text-[12px] bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 w-full shadow-sm"
          />
        </div>
      </div>

      {/* Scrollable Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]" style={{ minWidth: '960px' }}>
          <thead>
            <tr
              className="border-b border-slate-200/70"
              style={{ background: 'linear-gradient(to right, rgba(248,250,252,0.9), rgba(241,245,249,0.7))' }}
            >
              {/* Feature column header */}
              <th className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest sticky left-0 z-10 min-w-[200px]"
                style={{ background: 'rgba(248,250,252,0.95)' }}
              >
                Module / Feature
              </th>
              {ORDERED_ROLES.map(role => {
                const cfg = ROLE_MATRIX_CONFIG[role];
                const count = FEATURE_MODULES.filter(f => permissions[role][f]).length;
                return (
                  <th key={role} className="px-2 py-3.5 text-center min-w-[110px]">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.badge} shadow-sm`}>
                        {cfg.icon}
                        <span className="truncate max-w-[72px]">{role}</span>
                        {role === 'Super Admin' && <Lock size={9} className="text-amber-500 shrink-0" />}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {count}/{FEATURE_MODULES.length}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredFeatures.map((feature, rowIdx) => (
              <tr
                key={feature}
                className={`border-b border-slate-100/80 transition-colors duration-100 hover:bg-primary-50/30 ${rowIdx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white/60'}`}
              >
                <td
                  className="px-5 py-3 font-medium text-slate-600 sticky left-0 z-10 whitespace-nowrap text-[12px]"
                  style={{ background: rowIdx % 2 === 1 ? 'rgba(248,250,252,0.95)' : 'rgba(255,255,255,0.95)' }}
                >
                  {feature}
                </td>
                {ORDERED_ROLES.map(role => (
                  <PermissionCell
                    key={role}
                    role={role}
                    feature={feature}
                    isChecked={permissions[role][feature] ?? false}
                    onToggle={() => togglePermission(role, feature)}
                  />
                ))}
              </tr>
            ))}
            {filteredFeatures.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-text-muted text-[13px]">
                  No modules match your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div
        className="px-6 py-3 border-t border-slate-200/60 flex items-center gap-2"
        style={{ background: 'linear-gradient(to right, rgba(255,251,235,0.5), rgba(254,252,232,0.3))' }}
      >
        <Lock size={13} className="text-amber-500 shrink-0" />
        <p className="text-[11px] text-slate-500">
          <span className="font-semibold text-amber-700">Super Admin</span> row is read-only — Super Admins always have full access to all modules and cannot be restricted.
        </p>
      </div>
    </div>
  );
}

// ─── Roles & Permissions Tab ──────────────────────────────────────────────────

function RolesPermissionsTab() {
  const roleCounts = (Object.keys(ROLE_CONFIG) as RoleType[]).reduce((acc, r) => {
    acc[r] = EMPLOYEES.filter(e => e.role === r).length;
    return acc;
  }, {} as Record<RoleType, number>);

  return (
    <div className="space-y-5">
      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
        {ROLE_CARD_CONFIG.map(({ role, iconBg, countBg }) => {
          const cfg = ROLE_CONFIG[role];
          return (
            <div
              key={role}
              className="bg-white rounded-card card-shadow border border-border p-4 flex items-center gap-3 hover:shadow-card-md transition-all duration-150"
            >
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                {cfg.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-[13px] font-bold text-text-primary leading-tight">{role}</p>
                  <span className={`text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded-lg ${countBg}`}>{roleCounts[role]} users</span>
                </div>
                <p className="text-[10px] text-text-muted mt-0.5 leading-tight line-clamp-2">{cfg.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix */}
      <PermissionMatrixSection />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersPermissionsPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'roles'>('directory');
  const [saved, setSaved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-text-primary">Users &amp; Permissions</h1>
              <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                <HelpCircle size={16} className="text-text-muted cursor-help" />
                {showTooltip && (
                  <div className="absolute left-6 top-0 z-50 w-64 bg-slate-800 text-white text-[11px] rounded-lg px-3 py-2 shadow-xl">
                    Manage all admin accounts, assign roles, control site-level access, and maintain your employee directory from this page.
                  </div>
                )}
              </div>
            </div>
            <p className="text-[13px] text-text-muted mt-0.5">Manage admin accounts, roles, employee directory, and site-level access control</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold bg-green-50 border border-green-200 px-2 py-1 rounded-lg">
                <CheckCircle2 size={12} /> Saved
              </span>
            )}
            <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface bg-white">
              <Download size={13} /> Export All Users
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface bg-white"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-0">
            {[
              { id: 'directory' as const, label: 'Employee Directory' },
              { id: 'roles' as const, label: 'Roles & Permissions' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-[13px] font-semibold border-b-2 transition-all duration-150 -mb-px ${activeTab === tab.id ? 'border-primary-600 text-primary-700' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-slate-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'directory' ? <EmployeeDirectoryTab /> : <RolesPermissionsTab />}
      </div>
    </AppLayout>
  );
}