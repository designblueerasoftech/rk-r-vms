'use client';

import React, { useState } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Plus, Search, X } from 'lucide-react';

interface AccessZone {
  id: string;
  name: string;
  description: string;
  allowedTypes: string[];
  rules: string;
  status: 'active' | 'inactive';
}

const mockZones: AccessZone[] = [
  { id: 'az-001', name: 'Lobby / Reception',    description: 'Ground floor public area',         allowedTypes: ['Guest', 'Visitor', 'Contractor', 'Vendor', 'Delivery', 'VIP', 'Interviewee'], rules: 'Badge required',                  status: 'active' },
  { id: 'az-002', name: 'Floor 2 – Operations', description: 'East wing operational floor',       allowedTypes: ['Contractor', 'Vendor', 'VIP'],                                                rules: 'Badge + Induction required',      status: 'active' },
  { id: 'az-003', name: 'Floor 3 – Tech',       description: 'West wing technology floor',        allowedTypes: ['Contractor', 'VIP'],                                                          rules: 'Badge + Host approval required',  status: 'active' },
  { id: 'az-004', name: 'Conference Rooms',      description: 'Floors 2 & 3 meeting rooms',       allowedTypes: ['Guest', 'Visitor', 'VIP', 'Interviewee'],                                     rules: 'Badge required',                  status: 'active' },
  { id: 'az-005', name: 'Security Checkpoint',  description: 'Gate B security area',             allowedTypes: ['Contractor'],                                                                  rules: 'Full verification required',      status: 'active' },
  { id: 'az-006', name: 'Server Room',          description: 'Restricted IT infrastructure area', allowedTypes: ['Contractor'],                                                                  rules: 'Escort required + pre-approval',  status: 'inactive' },
];

const allVisitorTypes = ['Guest', 'Visitor', 'Contractor', 'Vendor', 'Delivery', 'VIP', 'Interviewee'];

const statusConfig = {
  active:   { label: 'Active',   bg: 'bg-green-50',  text: 'text-green-700' },
  inactive: { label: 'Inactive', bg: 'bg-slate-100', text: 'text-slate-600' },
};

interface ModalState {
  name: string;
  description: string;
  allowedTypes: string[];
  requireBadge: boolean;
  requireInduction: boolean;
  requireHostApproval: boolean;
  requireEscort: boolean;
}

const defaultModal: ModalState = {
  name: '', description: '', allowedTypes: [],
  requireBadge: true, requireInduction: false, requireHostApproval: false, requireEscort: false,
};

export default function SiteAdminAccessZonesPage() {
  const { siteName } = useRole();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ModalState>(defaultModal);
  const [zones, setZones] = useState<AccessZone[]>(mockZones);

  const filtered = zones.filter(z =>
    z.name.toLowerCase().includes(search.toLowerCase()) ||
    z.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleType = (type: string) => {
    setForm(p => ({
      ...p,
      allowedTypes: p.allowedTypes.includes(type)
        ? p.allowedTypes.filter(t => t !== type)
        : [...p.allowedTypes, type],
    }));
  };

  const buildRules = (f: ModalState) => {
    const parts = [];
    if (f.requireBadge) parts.push('Badge required');
    if (f.requireInduction) parts.push('Induction required');
    if (f.requireHostApproval) parts.push('Host approval required');
    if (f.requireEscort) parts.push('Escort required');
    return parts.join(' + ') || 'No rules set';
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newZone: AccessZone = {
      id: `az-${Date.now()}`,
      name: form.name,
      description: form.description,
      allowedTypes: form.allowedTypes.length > 0 ? form.allowedTypes : ['All'],
      rules: buildRules(form),
      status: 'active',
    };
    setZones(prev => [newZone, ...prev]);
    setShowModal(false);
    setForm(defaultModal);
  };

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Access Zones</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · Define and manage visitor access zones</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all"
          >
            <Plus size={15} /> Add New Zone
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
                placeholder="Search zones..."
                className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {['Zone Name', 'Description', 'Allowed Visitor Types', 'Rules', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-[13px] text-text-muted">No zones found.</td></tr>
                ) : filtered.map(zone => {
                  const sc = statusConfig[zone.status];
                  return (
                    <tr key={zone.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 text-[13px] font-semibold text-text-primary whitespace-nowrap">{zone.name}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary max-w-[160px] truncate">{zone.description}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {zone.allowedTypes.slice(0, 3).map(t => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-50 text-primary-700 font-medium">{t}</span>
                          ))}
                          {zone.allowedTypes.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">+{zone.allowedTypes.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary max-w-[180px] truncate">{zone.rules}</td>
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

      {/* Add Zone Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-[15px] font-bold text-text-primary">Add New Zone</h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Zone Name */}
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Zone Name <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Floor 4 – Executive"
                  className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Description</label>
                <input
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of this zone"
                  className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>
              {/* Allowed Visitor Types */}
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-2">Allowed Visitor Types</label>
                <div className="flex flex-wrap gap-2">
                  {allVisitorTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`text-[12px] px-2.5 py-1 rounded-full border font-medium transition-all ${form.allowedTypes.includes(type) ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-border text-text-secondary hover:border-primary-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              {/* Access Rules */}
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-2">Access Rules</label>
                <div className="space-y-2">
                  {[
                    { key: 'requireBadge', label: 'Require Badge' },
                    { key: 'requireInduction', label: 'Require Induction Completion' },
                    { key: 'requireHostApproval', label: 'Require Host Approval' },
                    { key: 'requireEscort', label: 'Require Escort' },
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
                Add Zone
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteAdminLayout>
  );
}
