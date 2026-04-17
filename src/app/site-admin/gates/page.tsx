'use client';

import React, { useState } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Plus, Search, X, ChevronDown } from 'lucide-react';

interface Gate {
  id: string;
  name: string;
  type: string;
  kiosk: string;
  workflow: string;
  status: 'active' | 'inactive' | 'maintenance';
}

const mockGates: Gate[] = [
  { id: 'g-001', name: 'Main Entrance',   type: 'Pedestrian', kiosk: 'Lobby Kiosk 1',   workflow: 'Pre-Registered Flow', status: 'active' },
  { id: 'g-002', name: 'Gate 1',          type: 'Pedestrian', kiosk: 'Gate B Kiosk',    workflow: 'Walk-In Flow',        status: 'active' },
  { id: 'g-003', name: 'Gate 2',          type: 'Vehicle',    kiosk: 'Reception Kiosk', workflow: 'Walk-In Flow',        status: 'active' },
  { id: 'g-004', name: 'VIP Entry',       type: 'Pedestrian', kiosk: '—',               workflow: 'Pre-Registered Flow', status: 'active' },
  { id: 'g-005', name: 'Delivery Bay',    type: 'Vehicle',    kiosk: '—',               workflow: 'Walk-In Flow',        status: 'maintenance' },
  { id: 'g-006', name: 'Emergency Exit',  type: 'Emergency',  kiosk: '—',               workflow: '—',                   status: 'inactive' },
];

const statusConfig = {
  active:      { label: 'Active',      bg: 'bg-green-50',  text: 'text-green-700' },
  inactive:    { label: 'Inactive',    bg: 'bg-slate-100', text: 'text-slate-600' },
  maintenance: { label: 'Maintenance', bg: 'bg-amber-50',  text: 'text-amber-700' },
};

const gateTypes = ['Pedestrian', 'Vehicle', 'Emergency'];
const kioskOptions = ['None', 'Lobby Kiosk 1', 'Gate B Kiosk', 'Reception Kiosk'];
const workflowOptions = ['None', 'Pre-Registered Flow', 'Walk-In Flow'];

interface ModalState {
  name: string;
  type: string;
  kiosk: string;
  workflow: string;
  requireBadge: boolean;
  requireInduction: boolean;
  requireHostApproval: boolean;
}

const defaultModal: ModalState = {
  name: '', type: 'Pedestrian', kiosk: 'None', workflow: 'None',
  requireBadge: true, requireInduction: false, requireHostApproval: false,
};

export default function SiteAdminGatesPage() {
  const { siteName } = useRole();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ModalState>(defaultModal);
  const [gates, setGates] = useState<Gate[]>(mockGates);

  const filtered = gates.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newGate: Gate = {
      id: `g-${Date.now()}`,
      name: form.name,
      type: form.type,
      kiosk: form.kiosk === 'None' ? '—' : form.kiosk,
      workflow: form.workflow === 'None' ? '—' : form.workflow,
      status: 'active',
    };
    setGates(prev => [newGate, ...prev]);
    setShowModal(false);
    setForm(defaultModal);
  };

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Gates & Entry Points</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · Manage all entry and exit gates</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all"
          >
            <Plus size={15} /> Add New Gate
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search gates..."
                className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {['Gate Name', 'Type', 'Assigned Kiosk', 'Assigned Workflow', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-[13px] text-text-muted">No gates found.</td></tr>
                ) : filtered.map(gate => {
                  const sc = statusConfig[gate.status];
                  return (
                    <tr key={gate.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">{gate.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">{gate.type}</span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{gate.kiosk}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{gate.workflow}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{sc.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-[12px] font-medium text-primary-600 hover:text-primary-700 transition-colors">Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Gate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-[15px] font-bold text-text-primary">Add New Gate</h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Gate Name */}
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Gate Name <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Gate 3"
                  className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>
              {/* Gate Type */}
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Gate Type</label>
                <div className="relative">
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full appearance-none px-3 pr-8 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200">
                    {gateTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              {/* Kiosk */}
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Assigned Kiosk</label>
                <div className="relative">
                  <select value={form.kiosk} onChange={e => setForm(p => ({ ...p, kiosk: e.target.value }))}
                    className="w-full appearance-none px-3 pr-8 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200">
                    {kioskOptions.map(k => <option key={k}>{k}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              {/* Workflow */}
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Assigned Workflow</label>
                <div className="relative">
                  <select value={form.workflow} onChange={e => setForm(p => ({ ...p, workflow: e.target.value }))}
                    className="w-full appearance-none px-3 pr-8 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200">
                    {workflowOptions.map(w => <option key={w}>{w}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              {/* Rules Toggles */}
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-2">Access Rules</label>
                <div className="space-y-2">
                  {[
                    { key: 'requireBadge', label: 'Require Badge Print' },
                    { key: 'requireInduction', label: 'Require Induction Completion' },
                    { key: 'requireHostApproval', label: 'Require Host Approval' },
                  ].map(rule => (
                    <label key={rule.key} className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => setForm(p => ({ ...p, [rule.key]: !p[rule.key as keyof ModalState] }))}
                        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${form[rule.key as keyof ModalState] ? 'bg-primary-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form[rule.key as keyof ModalState] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                      <span className="text-[13px] text-text-secondary">{rule.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surface">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-white transition-all">Cancel</button>
              <button onClick={handleAdd} disabled={!form.name.trim()} className="px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                Add Gate
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteAdminLayout>
  );
}
