'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Link2, HelpCircle, Plus, Search, Edit2, Trash2, FlaskConical,
  CheckCircle, AlertCircle, WifiOff, X, MapPin, Layers, Shield,
  ChevronDown,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type DeviceStatus = 'Connected' | 'Error' | 'Offline';

interface MappedDevice {
  id: string;
  name: string;
  deviceType: string;
  linkedGate: string;
  linkedZones: string[];
  protocol: string;
  status: DeviceStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SITES = [
  { id: 'site-a', name: 'Site A – HQ' },
  { id: 'site-b', name: 'Site B – Warehouse' },
  { id: 'site-c', name: 'Site C – Branch' },
  { id: 'site-d', name: 'Site D – Factory' },
];

const SITE_GATES: Record<string, string[]> = {
  'site-a': ['Main Entrance', 'Side Gate A', 'Loading Bay', 'Emergency Exit'],
  'site-b': ['Warehouse Gate 1', 'Warehouse Gate 2', 'Staff Entrance'],
  'site-c': ['Branch Front Door', 'Branch Back Door'],
  'site-d': ['Factory Main Gate', 'Factory Side Gate', 'Delivery Entrance', 'Admin Block Entry'],
};

const SITE_ZONES: Record<string, string[]> = {
  'site-a': ['Reception', 'Server Room', 'Executive Floor', 'General Office', 'Parking'],
  'site-b': ['Warehouse Floor', 'Cold Storage', 'Staff Lounge', 'Loading Dock'],
  'site-c': ['Public Area', 'Staff Only', 'Meeting Rooms'],
  'site-d': ['Production Floor', 'Quality Control', 'Admin Zone', 'Restricted Lab'],
};

const DEVICE_TYPES = ['Turnstile', 'Door Controller', 'Boom Barrier', 'Flap Gate', 'Speed Gate', 'Biometric Reader'];
const PROTOCOLS = ['API', 'OSDP', 'Wiegand', 'RS-485', 'TCP/IP', 'BACnet'];

const INITIAL_DEVICES_BY_SITE: Record<string, MappedDevice[]> = {
  'site-a': [
    { id: 'dev-a1', name: 'Turnstile-01', deviceType: 'Turnstile', linkedGate: 'Main Entrance', linkedZones: ['Reception', 'General Office'], protocol: 'OSDP', status: 'Connected' },
    { id: 'dev-a2', name: 'Door-ServerRoom', deviceType: 'Door Controller', linkedGate: 'Side Gate A', linkedZones: ['Server Room'], protocol: 'Wiegand', status: 'Error' },
    { id: 'dev-a3', name: 'Boom-LoadingBay', deviceType: 'Boom Barrier', linkedGate: 'Loading Bay', linkedZones: ['Parking'], protocol: 'API', status: 'Connected' },
  ],
  'site-b': [
    { id: 'dev-b1', name: 'Gate-WH1', deviceType: 'Flap Gate', linkedGate: 'Warehouse Gate 1', linkedZones: ['Warehouse Floor'], protocol: 'TCP/IP', status: 'Connected' },
    { id: 'dev-b2', name: 'Door-Cold', deviceType: 'Door Controller', linkedGate: 'Warehouse Gate 2', linkedZones: ['Cold Storage'], protocol: 'OSDP', status: 'Offline' },
  ],
  'site-c': [
    { id: 'dev-c1', name: 'Turnstile-Branch', deviceType: 'Turnstile', linkedGate: 'Branch Front Door', linkedZones: ['Public Area', 'Meeting Rooms'], protocol: 'Wiegand', status: 'Connected' },
  ],
  'site-d': [
    { id: 'dev-d1', name: 'Boom-Factory', deviceType: 'Boom Barrier', linkedGate: 'Factory Main Gate', linkedZones: ['Production Floor'], protocol: 'API', status: 'Connected' },
    { id: 'dev-d2', name: 'Bio-Admin', deviceType: 'Biometric Reader', linkedGate: 'Admin Block Entry', linkedZones: ['Admin Zone', 'Restricted Lab'], protocol: 'RS-485', status: 'Error' },
  ],
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  if (status === 'Connected') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-100">
        <CheckCircle size={11} />
        Connected
      </span>
    );
  }
  if (status === 'Error') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-100">
        <AlertCircle size={11} />
        Error
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
      <WifiOff size={11} />
      Offline
    </span>
  );
}

// ─── Add / Edit Device Modal ──────────────────────────────────────────────────

interface DeviceModalProps {
  siteId: string;
  onClose: () => void;
  onSave: (device: MappedDevice) => void;
  editDevice?: MappedDevice | null;
}

function DeviceModal({ siteId, onClose, onSave, editDevice }: DeviceModalProps) {
  const gates = SITE_GATES[siteId] || SITE_GATES['site-a'];
  const zones = SITE_ZONES[siteId] || SITE_ZONES['site-a'];

  const [form, setForm] = useState({
    name: editDevice?.name || '',
    deviceType: editDevice?.deviceType || DEVICE_TYPES[0],
    linkedGate: editDevice?.linkedGate || gates[0],
    linkedZones: editDevice?.linkedZones || [] as string[],
    protocol: editDevice?.protocol || PROTOCOLS[0],
    status: editDevice?.status || 'Connected' as DeviceStatus,
  });

  const toggleZone = (zone: string) => {
    setForm(prev => ({
      ...prev,
      linkedZones: prev.linkedZones.includes(zone)
        ? prev.linkedZones.filter(z => z !== zone)
        : [...prev.linkedZones, zone],
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave({
      id: editDevice?.id || `dev-${Date.now()}`,
      name: form.name.trim(),
      deviceType: form.deviceType,
      linkedGate: form.linkedGate,
      linkedZones: form.linkedZones,
      protocol: form.protocol,
      status: form.status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Link2 size={15} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-text-primary">
                {editDevice ? 'Edit Device' : 'Add Device'}
              </h3>
              <p className="text-[11px] text-text-muted">Map device to gate &amp; access zone</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface transition-colors">
            <X size={14} className="text-text-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Device ID / Name */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">
              Device ID / Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Turnstile-01, Door-ServerRoom"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
            />
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Device Type</label>
            <div className="relative">
              <select
                value={form.deviceType}
                onChange={e => setForm(p => ({ ...p, deviceType: e.target.value }))}
                className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white appearance-none pr-8"
              >
                {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Linked Gate */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">
              <span className="flex items-center gap-1.5"><MapPin size={11} className="text-text-muted" /> Linked Gate / Entry Point</span>
            </label>
            <div className="relative">
              <select
                value={form.linkedGate}
                onChange={e => setForm(p => ({ ...p, linkedGate: e.target.value }))}
                className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white appearance-none pr-8"
              >
                {gates.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Linked Access Zones */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">
              <span className="flex items-center gap-1.5"><Layers size={11} className="text-text-muted" /> Linked Access Zone(s)</span>
            </label>
            <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-surface/40 min-h-[44px]">
              {zones.map(zone => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => toggleZone(zone)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                    form.linkedZones.includes(zone)
                      ? 'bg-indigo-600 text-white border-indigo-600' :'bg-white text-text-secondary border-border hover:border-indigo-300 hover:text-indigo-700'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
            {form.linkedZones.length === 0 && (
              <p className="text-[11px] text-text-muted mt-1">Click zones above to select one or more</p>
            )}
          </div>

          {/* Protocol */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Protocol / Integration Method</label>
            <div className="relative">
              <select
                value={form.protocol}
                onChange={e => setForm(p => ({ ...p, protocol: e.target.value }))}
                className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white appearance-none pr-8"
              >
                {PROTOCOLS.map(pr => <option key={pr} value={pr}>{pr}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Status</label>
            <div className="flex gap-2">
              {(['Connected', 'Error', 'Offline'] as DeviceStatus[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, status: s }))}
                  className={`flex-1 py-2 rounded-lg text-[12px] font-semibold border transition-all ${
                    form.status === s
                      ? s === 'Connected' ?'bg-green-50 text-green-700 border-green-300'
                        : s === 'Error' ?'bg-red-50 text-red-700 border-red-300' :'bg-slate-100 text-slate-600 border-slate-300' :'bg-white text-text-secondary border-border hover:bg-surface'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim()}
            className="flex-1 px-4 py-2 text-[13px] font-semibold text-white rounded-lg hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
          >
            {editDevice ? 'Save Changes' : 'Add Device'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Site Tab Content ─────────────────────────────────────────────────────────

interface SiteTabContentProps {
  siteId: string;
  siteName: string;
}

function SiteTabContent({ siteId, siteName }: SiteTabContentProps) {
  const [devices, setDevices] = useState<MappedDevice[]>(INITIAL_DEVICES_BY_SITE[siteId] || []);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDevice, setEditDevice] = useState<MappedDevice | null>(null);
  const [saved, setSaved] = useState(false);

  const triggerSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSave = (device: MappedDevice) => {
    if (editDevice) {
      setDevices(prev => prev.map(d => d.id === device.id ? device : d));
    } else {
      setDevices(prev => [...prev, device]);
    }
    setEditDevice(null);
    triggerSaved();
  };

  const handleDelete = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    triggerSaved();
  };

  const handleEdit = (device: MappedDevice) => {
    setEditDevice(device);
    setShowModal(true);
  };

  const filtered = devices.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.linkedGate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Tab Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-[15px] font-bold text-text-primary">
            Device &amp; Gate Mapping for {siteName}
          </h2>
          <p className="text-[12px] text-text-muted mt-0.5">
            {devices.length} device{devices.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg">
              <CheckCircle size={13} />
              Saved
            </span>
          )}
          <button
            onClick={() => { setEditDevice(null); setShowModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
          >
            <Plus size={14} />
            Add Device
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by device name or gate…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 border border-dashed border-border rounded-xl bg-surface/40">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
            <Link2 size={20} className="text-text-muted" />
          </div>
          <p className="text-[13px] font-semibold text-text-secondary">
            {search ? 'No devices match your search' : 'No devices mapped yet'}
          </p>
          <p className="text-[12px] text-text-muted mt-1">
            {search ? 'Try a different search term.' : 'Click "+ Add Device" to link your first hardware device.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-text-secondary whitespace-nowrap">Device ID / Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-secondary whitespace-nowrap">Device Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-secondary whitespace-nowrap">Linked Gate / Entry Point</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-secondary whitespace-nowrap">Linked Access Zone(s)</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-secondary whitespace-nowrap">Protocol</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-secondary whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((device, idx) => (
                  <tr
                    key={device.id}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-indigo-50/20 ${idx % 2 === 1 ? 'bg-surface/30' : 'bg-white'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                          <Shield size={12} className="text-indigo-600" />
                        </div>
                        <span className="font-semibold text-text-primary whitespace-nowrap">{device.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-text-secondary text-[11px] font-medium whitespace-nowrap">
                        {device.deviceType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-text-secondary whitespace-nowrap">
                        <MapPin size={11} className="text-text-muted shrink-0" />
                        {device.linkedGate}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {device.linkedZones.length === 0 ? (
                          <span className="text-text-muted">—</span>
                        ) : device.linkedZones.map(zone => (
                          <span key={zone} className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-medium whitespace-nowrap border border-indigo-100">
                            {zone}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-medium whitespace-nowrap border border-amber-100">
                        {device.protocol}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <DeviceStatusBadge status={device.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(device)}
                          title="Edit"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-indigo-50 text-text-muted hover:text-indigo-700 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          title="Test Connection"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-50 text-text-muted hover:text-amber-600 transition-colors"
                        >
                          <FlaskConical size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(device.id)}
                          title="Delete"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <DeviceModal
          siteId={siteId}
          onClose={() => { setShowModal(false); setEditDevice(null); }}
          onSave={handleSave}
          editDevice={editDevice}
        />
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DeviceGateMappingPage() {
  const [activeTab, setActiveTab] = useState('site-a');

  const activeSite = SITES.find(s => s.id === activeTab) || SITES[0];

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Page Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[20px] font-bold text-text-primary">Device &amp; Gate Mapping</h1>
              <div className="relative group">
                <button className="w-5 h-5 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-indigo-50 transition-colors">
                  <HelpCircle size={12} className="text-text-muted" />
                </button>
                <div className="absolute left-6 top-0 z-20 hidden group-hover:block w-72 p-2.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl leading-relaxed">
                  Map access control devices (turnstiles, door controllers, boom barriers) to specific gates and access zones. Gates are auto-populated from the Gates &amp; Entry Points page. Changes are auto-saved.
                </div>
              </div>
            </div>
            <p className="text-[13px] text-text-muted mt-0.5">
              Map access control devices to gates and access zones across all sites
            </p>
          </div>
        </div>

        {/* Site Tabs */}
        <div className="border-b border-border">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-thin">
            {SITES.map(site => (
              <button
                key={site.id}
                onClick={() => setActiveTab(site.id)}
                className={`flex-shrink-0 px-4 py-3 text-[13px] font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === site.id
                    ? 'border-indigo-600 text-indigo-700' :'border-transparent text-text-muted hover:text-text-secondary hover:border-border'
                }`}
              >
                {site.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          <SiteTabContent siteId={activeSite.id} siteName={activeSite.name} />
        </div>

      </div>
    </AppLayout>
  );
}
