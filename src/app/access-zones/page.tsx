'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Lock, Plus, Search, Edit2, Trash2, X, ChevronDown, HelpCircle, RefreshCw, CheckCircle, Shield, MapPin, ToggleLeft, ToggleRight,  } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ZoneStatus = 'Active' | 'Inactive';

interface AccessZone {
  id: string;
  name: string;
  site: string;
  description: string;
  allowedVisitorTypes: string[];
  rules: string[];
  status: ZoneStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ZONES: AccessZone[] = [
  { id: 'AZ-001', name: 'Main Lobby', site: 'HQ Mumbai', description: 'Public reception area accessible to all visitor types', allowedVisitorTypes: ['VIP', 'Contractor', 'Vendor', 'Business Guest', 'Delivery', 'Interviewee'], rules: ['ID Scan Required', 'Host Notification'], status: 'Active' },
  { id: 'AZ-002', name: 'Executive Floor (5th)', site: 'HQ Mumbai', description: 'Restricted floor for VIP and senior management meetings', allowedVisitorTypes: ['VIP', 'Business Guest'], rules: ['Host Escort Required', 'Pre-Approval Mandatory', 'No Photography'], status: 'Active' },
  { id: 'AZ-003', name: 'Server Room', site: 'HQ Mumbai', description: 'High-security IT infrastructure area', allowedVisitorTypes: ['Contractor'], rules: ['Biometric Access', 'Supervisor Escort', 'Induction Required', 'Time-Limited Access'], status: 'Active' },
  { id: 'AZ-004', name: 'Warehouse Block B', site: 'Pune Factory', description: 'Manufacturing and storage area for vendors and contractors', allowedVisitorTypes: ['Contractor', 'Vendor', 'Delivery'], rules: ['Safety Induction Required', 'PPE Mandatory', 'ID Scan Required'], status: 'Active' },
  { id: 'AZ-005', name: 'Conference Rooms', site: 'Delhi Office', description: 'Meeting rooms for business guests and interviewees', allowedVisitorTypes: ['Business Guest', 'Interviewee', 'VIP'], rules: ['Host Notification', 'Sign-In Required'], status: 'Active' },
  { id: 'AZ-006', name: 'R&D Lab', site: 'Bangalore Hub', description: 'Research and development area — restricted access', allowedVisitorTypes: ['VIP'], rules: ['NDA Required', 'Biometric Access', 'No Recording Devices'], status: 'Inactive' },
];

const SITES = ['HQ Mumbai', 'Pune Factory', 'Delhi Office', 'Bangalore Hub'];
const ALL_VISITOR_TYPES = ['VIP', 'Contractor', 'Vendor', 'Business Guest', 'Delivery', 'Interviewee', 'Govt Official', 'Group Visit'];
const ALL_RULES = ['ID Scan Required', 'Host Notification', 'Host Escort Required', 'Pre-Approval Mandatory', 'Induction Required', 'Biometric Access', 'PPE Mandatory', 'NDA Required', 'Time-Limited Access', 'No Photography', 'Sign-In Required'];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ZoneStatus }) {
  const cfg = {
    Active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    Inactive: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ─── Add Zone Modal ───────────────────────────────────────────────────────────

interface AddZoneModalProps {
  onClose: () => void;
  onSave: (zone: Partial<AccessZone>) => void;
}

function AddZoneModal({ onClose, onSave }: AddZoneModalProps) {
  const [form, setForm] = useState({
    name: '',
    site: SITES[0],
    description: '',
    allowedVisitorTypes: [] as string[],
    rules: [] as string[],
  });

  const toggleVisitorType = (vt: string) => {
    setForm(p => ({
      ...p,
      allowedVisitorTypes: p.allowedVisitorTypes.includes(vt)
        ? p.allowedVisitorTypes.filter(x => x !== vt)
        : [...p.allowedVisitorTypes, vt],
    }));
  };

  const toggleRule = (rule: string) => {
    setForm(p => ({
      ...p,
      rules: p.rules.includes(rule)
        ? p.rules.filter(x => x !== rule)
        : [...p.rules, rule],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, status: 'Active' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-[15px] font-bold text-text-primary">Add New Access Zone</h2>
            <p className="text-[12px] text-text-muted mt-0.5">Define a new restricted or open zone</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors">
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Zone Name <span className="text-danger">*</span></label>
            <input
              required
              type="text"
              placeholder="e.g. Executive Floor"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Linked Site <span className="text-danger">*</span></label>
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
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of this zone..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-2">Allowed Visitor Types</label>
            <div className="flex flex-wrap gap-2">
              {ALL_VISITOR_TYPES.map(vt => (
                <button
                  key={vt}
                  type="button"
                  onClick={() => toggleVisitorType(vt)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    form.allowedVisitorTypes.includes(vt)
                      ? 'bg-primary-600 text-white border-primary-600' :'bg-white text-text-secondary border-border hover:border-primary-300'
                  }`}
                >
                  {vt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-2">Access Rules</label>
            <div className="flex flex-wrap gap-2">
              {ALL_RULES.map(rule => (
                <button
                  key={rule}
                  type="button"
                  onClick={() => toggleRule(rule)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    form.rules.includes(rule)
                      ? 'bg-teal-600 text-white border-teal-600' :'bg-white text-text-secondary border-border hover:border-teal-300'
                  }`}
                >
                  {rule}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 transition-all shadow-sm">
              Add Zone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AccessZonesPage() {
  const [zones, setZones] = useState<AccessZone[]>(MOCK_ZONES);
  const [search, setSearch] = useState('');
  const [filterSite, setFilterSite] = useState('All Sites');
  const [showModal, setShowModal] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  const filtered = zones.filter(z => {
    const matchSearch = z.name.toLowerCase().includes(search.toLowerCase()) || z.site.toLowerCase().includes(search.toLowerCase());
    const matchSite = filterSite === 'All Sites' || z.site === filterSite;
    return matchSearch && matchSite;
  });

  const handleSave = (data: Partial<AccessZone>) => {
    const newZone: AccessZone = {
      id: `AZ-${String(zones.length + 1).padStart(3, '0')}`,
      name: data.name || '',
      site: data.site || SITES[0],
      description: data.description || '',
      allowedVisitorTypes: data.allowedVisitorTypes || [],
      rules: data.rules || [],
      status: 'Active',
    };
    setZones(prev => [newZone, ...prev]);
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 3000);
  };

  const handleDelete = (id: string) => setZones(prev => prev.filter(z => z.id !== id));

  const handleToggleStatus = (id: string) => {
    setZones(prev => prev.map(z =>
      z.id === id ? { ...z, status: z.status === 'Active' ? 'Inactive' : 'Active' } : z
    ));
  };

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[20px] font-bold text-text-primary">Access Zones</h1>
              <button className="w-5 h-5 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-primary-50 transition-colors group relative">
                <HelpCircle size={12} className="text-text-muted" />
                <div className="absolute left-6 top-0 z-20 hidden group-hover:block w-56 p-2.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl">
                  Define access zones and control which visitor types can access each area.
                </div>
              </button>
            </div>
            <p className="text-[13px] text-text-muted mt-0.5">Define restricted and open zones, assign allowed visitor types and access rules.</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {autoSaved && (
              <span className="flex items-center gap-1.5 text-[11px] text-success font-medium">
                <CheckCircle size={13} /> Auto-saved
              </span>
            )}
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm">
              <Plus size={15} />
              Add New Zone
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Zones', value: zones.length, icon: <Lock size={16} />, color: 'text-primary-600', bg: 'bg-primary-50' },
            { label: 'Active Zones', value: zones.filter(z => z.status === 'Active').length, icon: <Shield size={16} />, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Sites Covered', value: new Set(zones.map(z => z.site)).size, icon: <MapPin size={16} />, color: 'text-teal-600', bg: 'bg-teal-50' },
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
              placeholder="Search zones..."
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
                  {['Zone Name', 'Site', 'Description', 'Allowed Visitor Types', 'Rules', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap border-b border-border">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[13px] text-text-muted">
                      No zones found matching your filters.
                    </td>
                  </tr>
                ) : filtered.map(zone => (
                  <tr key={zone.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                          <Lock size={14} className="text-teal-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary">{zone.name}</p>
                          <p className="text-[11px] text-text-muted">{zone.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
                        <MapPin size={12} className="text-text-muted shrink-0" />
                        {zone.site}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-[12px] text-text-secondary truncate">{zone.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {zone.allowedVisitorTypes.slice(0, 3).map(vt => (
                          <span key={vt} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">{vt}</span>
                        ))}
                        {zone.allowedVisitorTypes.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-surface text-text-muted text-[10px] font-semibold rounded">+{zone.allowedVisitorTypes.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {zone.rules.slice(0, 2).map(r => (
                          <span key={r} className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded">{r}</span>
                        ))}
                        {zone.rules.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-surface text-text-muted text-[10px] font-semibold rounded">+{zone.rules.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={zone.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleStatus(zone.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface border border-transparent hover:border-border transition-all"
                          title={zone.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {zone.status === 'Active'
                            ? <ToggleRight size={15} className="text-green-600" />
                            : <ToggleLeft size={15} className="text-text-muted" />
                          }
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface border border-transparent hover:border-border transition-all" title="Edit">
                          <Edit2 size={13} className="text-text-secondary" />
                        </button>
                        <button
                          onClick={() => handleDelete(zone.id)}
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
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-[12px] text-text-muted">Showing {filtered.length} of {zones.length} zones</p>
          </div>
        </div>

      </div>

      {showModal && <AddZoneModal onClose={() => setShowModal(false)} onSave={handleSave} />}
    </AppLayout>
  );
}
