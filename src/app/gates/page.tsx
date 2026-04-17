'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { DoorOpen, Plus, Search, Edit2, Trash2, X, ChevronDown, HelpCircle, RefreshCw, CheckCircle, XCircle, AlertCircle, ToggleLeft, ToggleRight,  } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type GateStatus = 'Active' | 'Inactive' | 'Maintenance';
type GateType = 'Entry' | 'Exit' | 'Entry & Exit';

interface Gate {
  id: string;
  name: string;
  site: string;
  type: GateType;
  assignedKiosk: string;
  assignedWorkflow: string;
  status: GateStatus;
  requiresApproval: boolean;
  idScanRequired: boolean;
  inductionRequired: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_GATES: Gate[] = [
  { id: 'G-001', name: 'Main Reception Gate', site: 'HQ Mumbai', type: 'Entry & Exit', assignedKiosk: 'Reception Kiosk A', assignedWorkflow: 'Standard Visitor Flow', status: 'Active', requiresApproval: true, idScanRequired: true, inductionRequired: true },
  { id: 'G-002', name: 'Security Checkpoint Gate 2', site: 'HQ Mumbai', type: 'Entry', assignedKiosk: 'Security Gate Kiosk', assignedWorkflow: 'Contractor Check-In', status: 'Active', requiresApproval: false, idScanRequired: true, inductionRequired: false },
  { id: 'G-003', name: 'Warehouse Entry Gate', site: 'Pune Factory', type: 'Entry', assignedKiosk: 'Warehouse Entry', assignedWorkflow: 'Vendor Flow', status: 'Maintenance', requiresApproval: true, idScanRequired: true, inductionRequired: true },
  { id: 'G-004', name: 'VIP Executive Entrance', site: 'HQ Mumbai', type: 'Entry & Exit', assignedKiosk: 'VIP Lounge Kiosk', assignedWorkflow: 'VIP Visitor Flow', status: 'Active', requiresApproval: false, idScanRequired: false, inductionRequired: false },
  { id: 'G-005', name: 'Delivery Bay Gate', site: 'Pune Factory', type: 'Entry & Exit', assignedKiosk: '—', assignedWorkflow: 'Vendor Flow', status: 'Inactive', requiresApproval: false, idScanRequired: false, inductionRequired: false },
  { id: 'G-006', name: 'Staff Car Park Exit', site: 'Delhi Office', type: 'Exit', assignedKiosk: '—', assignedWorkflow: '—', status: 'Active', requiresApproval: false, idScanRequired: false, inductionRequired: false },
];

const SITES = ['HQ Mumbai', 'Pune Factory', 'Delhi Office', 'Bangalore Hub'];
const KIOSKS = ['Reception Kiosk A', 'Security Gate Kiosk', 'Warehouse Entry', 'VIP Lounge Kiosk', 'New Kiosk Setup'];
const WORKFLOWS = ['Standard Visitor Flow', 'Contractor Check-In', 'Vendor Flow', 'VIP Visitor Flow'];
const GATE_TYPES: GateType[] = ['Entry', 'Exit', 'Entry & Exit'];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: GateStatus }) {
  const cfg = {
    Active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    Inactive: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
    Maintenance: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: GateType }) {
  const cfg = {
    'Entry': { bg: 'bg-blue-50', text: 'text-blue-700' },
    'Exit': { bg: 'bg-purple-50', text: 'text-purple-700' },
    'Entry & Exit': { bg: 'bg-teal-50', text: 'text-teal-700' },
  }[type];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      {type}
    </span>
  );
}

// ─── Add Gate Modal ───────────────────────────────────────────────────────────

interface AddGateModalProps {
  onClose: () => void;
  onSave: (gate: Partial<Gate>) => void;
}

function AddGateModal({ onClose, onSave }: AddGateModalProps) {
  const [form, setForm] = useState({
    name: '',
    site: SITES[0],
    type: 'Entry & Exit' as GateType,
    assignedKiosk: '',
    assignedWorkflow: '',
    requiresApproval: false,
    idScanRequired: true,
    inductionRequired: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, status: 'Active' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-[15px] font-bold text-text-primary">Add New Gate</h2>
            <p className="text-[12px] text-text-muted mt-0.5">Configure a new gate or entry point</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors">
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Gate Name */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Gate Name <span className="text-danger">*</span></label>
            <input
              required
              type="text"
              placeholder="e.g. Main Reception Gate"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
            />
          </div>

          {/* Site + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Site <span className="text-danger">*</span></label>
              <div className="relative">
                <select
                  value={form.site}
                  onChange={e => setForm(p => ({ ...p, site: e.target.value }))}
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white pr-8"
                >
                  {SITES.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Gate Type <span className="text-danger">*</span></label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value as GateType }))}
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white pr-8"
                >
                  {GATE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Assigned Kiosk */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Assigned Kiosk</label>
            <div className="relative">
              <select
                value={form.assignedKiosk}
                onChange={e => setForm(p => ({ ...p, assignedKiosk: e.target.value }))}
                className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white pr-8"
              >
                <option value="">— None —</option>
                {KIOSKS.map(k => <option key={k}>{k}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Assigned Workflow */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Assigned Workflow</label>
            <div className="relative">
              <select
                value={form.assignedWorkflow}
                onChange={e => setForm(p => ({ ...p, assignedWorkflow: e.target.value }))}
                className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white pr-8"
              >
                <option value="">— None —</option>
                {WORKFLOWS.map(w => <option key={w}>{w}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Rules Toggles */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-2">Gate Rules</label>
            <div className="space-y-2.5 p-3 bg-surface rounded-xl border border-border">
              {[
                { key: 'requiresApproval', label: 'Host Approval Required', desc: 'Visitor must be approved by host before entry' },
                { key: 'idScanRequired', label: 'ID Scan Required', desc: 'Visitor must scan government-issued ID' },
                { key: 'inductionRequired', label: 'Induction Required', desc: 'Visitor must complete induction before entry' },
              ].map(rule => (
                <div key={rule.key} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-medium text-text-primary">{rule.label}</p>
                    <p className="text-[11px] text-text-muted">{rule.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, [rule.key]: !p[rule.key as keyof typeof p] }))}
                    className="shrink-0"
                  >
                    {(form as Record<string, unknown>)[rule.key]
                      ? <ToggleRight size={24} className="text-primary-600" />
                      : <ToggleLeft size={24} className="text-text-muted" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 transition-all shadow-sm">
              Add Gate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GatesPage() {
  const [gates, setGates] = useState<Gate[]>(MOCK_GATES);
  const [search, setSearch] = useState('');
  const [filterSite, setFilterSite] = useState('All Sites');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  const filtered = gates.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.site.toLowerCase().includes(search.toLowerCase());
    const matchSite = filterSite === 'All Sites' || g.site === filterSite;
    const matchStatus = filterStatus === 'All' || g.status === filterStatus;
    return matchSearch && matchSite && matchStatus;
  });

  const handleSave = (data: Partial<Gate>) => {
    const newGate: Gate = {
      id: `G-${String(gates.length + 1).padStart(3, '0')}`,
      name: data.name || '',
      site: data.site || SITES[0],
      type: data.type || 'Entry & Exit',
      assignedKiosk: data.assignedKiosk || '—',
      assignedWorkflow: data.assignedWorkflow || '—',
      status: 'Active',
      requiresApproval: data.requiresApproval || false,
      idScanRequired: data.idScanRequired || false,
      inductionRequired: data.inductionRequired || false,
    };
    setGates(prev => [newGate, ...prev]);
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 3000);
  };

  const handleDelete = (id: string) => {
    setGates(prev => prev.filter(g => g.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setGates(prev => prev.map(g =>
      g.id === id ? { ...g, status: g.status === 'Active' ? 'Inactive' : 'Active' } : g
    ));
  };

  const stats = {
    total: gates.length,
    active: gates.filter(g => g.status === 'Active').length,
    inactive: gates.filter(g => g.status === 'Inactive').length,
    maintenance: gates.filter(g => g.status === 'Maintenance').length,
  };

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[20px] font-bold text-text-primary">Gates &amp; Entry Points</h1>
              <button className="w-5 h-5 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-primary-50 transition-colors group relative">
                <HelpCircle size={12} className="text-text-muted" />
                <div className="absolute left-6 top-0 z-20 hidden group-hover:block w-56 p-2.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl">
                  Manage physical gates and entry points across all sites. Assign kiosks and workflows to each gate.
                </div>
              </button>
            </div>
            <p className="text-[13px] text-text-muted mt-0.5">Configure physical gates, assign kiosks and workflows, and set entry rules.</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {autoSaved && (
              <span className="flex items-center gap-1.5 text-[11px] text-success font-medium">
                <CheckCircle size={13} /> Auto-saved
              </span>
            )}
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm">
              <Plus size={15} />
              Add New Gate
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Gates', value: stats.total, icon: <DoorOpen size={16} />, color: 'text-primary-600', bg: 'bg-primary-50' },
            { label: 'Active', value: stats.active, icon: <CheckCircle size={16} />, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Inactive', value: stats.inactive, icon: <XCircle size={16} />, color: 'text-slate-500', bg: 'bg-slate-100' },
            { label: 'Maintenance', value: stats.maintenance, icon: <AlertCircle size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg} ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[20px] font-bold text-text-primary leading-tight">{s.value}</p>
                <p className="text-[11px] text-text-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search gates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
            />
          </div>
          <div className="relative">
            <select
              value={filterSite}
              onChange={e => setFilterSite(e.target.value)}
              className="pl-3 pr-8 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white"
            >
              <option>All Sites</option>
              {SITES.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="pl-3 pr-8 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white"
            >
              <option value="All">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Maintenance</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors">
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Gate Name', 'Site', 'Type', 'Assigned Kiosk', 'Assigned Workflow', 'Rules', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap border-b border-border">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-[13px] text-text-muted">
                      No gates found matching your filters.
                    </td>
                  </tr>
                ) : filtered.map(gate => (
                  <tr key={gate.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                          <DoorOpen size={15} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary">{gate.name}</p>
                          <p className="text-[11px] text-text-muted">{gate.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-text-secondary">{gate.site}</td>
                    <td className="px-4 py-3"><TypeBadge type={gate.type} /></td>
                    <td className="px-4 py-3 text-[13px] text-text-secondary">{gate.assignedKiosk || '—'}</td>
                    <td className="px-4 py-3 text-[13px] text-text-secondary">{gate.assignedWorkflow || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {gate.idScanRequired && (
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">ID Scan</span>
                        )}
                        {gate.requiresApproval && (
                          <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded">Approval</span>
                        )}
                        {gate.inductionRequired && (
                          <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-semibold rounded">Induction</span>
                        )}
                        {!gate.idScanRequired && !gate.requiresApproval && !gate.inductionRequired && (
                          <span className="text-[11px] text-text-muted">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={gate.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleStatus(gate.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface border border-transparent hover:border-border transition-all"
                          title={gate.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {gate.status === 'Active'
                            ? <ToggleRight size={15} className="text-green-600" />
                            : <ToggleLeft size={15} className="text-text-muted" />
                          }
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface border border-transparent hover:border-border transition-all" title="Edit">
                          <Edit2 size={13} className="text-text-secondary" />
                        </button>
                        <button
                          onClick={() => handleDelete(gate.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={13} className="text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Table Footer */}
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-[12px] text-text-muted">Showing {filtered.length} of {gates.length} gates</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-text-muted">Last updated: just now</span>
            </div>
          </div>
        </div>

      </div>

      {showModal && <AddGateModal onClose={() => setShowModal(false)} onSave={handleSave} />}
    </AppLayout>
  );
}
