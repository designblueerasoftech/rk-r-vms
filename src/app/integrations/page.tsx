'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Plug, X, CheckCircle, XCircle, AlertCircle, HelpCircle,
  RefreshCw, Eye, EyeOff, Zap, Settings,
  MessageSquare, Users, Shield, Printer, Calendar, Bell,
  ChevronLeft, Edit2, Globe, Building2, Plus, Trash2,
  FlaskConical, MapPin, Layers, Info,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type IntegrationStatus = 'Connected' | 'Disconnected' | 'Error' | 'Pending';
type DeviceStatus = 'Connected' | 'Error';

interface AccessDevice {
  id: string;
  name: string;
  deviceType: string;
  linkedGate: string;
  linkedZones: string[];
  protocol: string;
  status: DeviceStatus;
}

interface SiteConfig {
  siteId: string;
  siteName: string;
  status: IntegrationStatus;
  lastSync?: string;
  fields: Record<string, string>;
}

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: IntegrationStatus;
  configuredSites: number;
  totalSites: number;
  icon: React.ReactNode;
  iconBg: string;
  globalFields: { key: string; label: string; type: 'text' | 'password' | 'url'; placeholder: string }[];
  siteFields: { key: string; label: string; type: 'text' | 'password' | 'url'; placeholder: string }[];
  siteConfigs: SiteConfig[];
}

// ─── Mock Sites ───────────────────────────────────────────────────────────────

const ALL_SITES = [
  { id: 'all', name: 'All Sites' },
  { id: 'site-a', name: 'Site A – HQ' },
  { id: 'site-b', name: 'Site B – Warehouse' },
  { id: 'site-c', name: 'Site C – Branch' },
  { id: 'site-d', name: 'Site D – Factory' },
];

// ─── Mock Gates & Zones per site ─────────────────────────────────────────────

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

// ─── Mock Access Devices ──────────────────────────────────────────────────────

const INITIAL_DEVICES: AccessDevice[] = [
  { id: 'dev-1', name: 'Turnstile-01', deviceType: 'Turnstile', linkedGate: 'Main Entrance', linkedZones: ['Reception', 'General Office'], protocol: 'OSDP', status: 'Connected' },
  { id: 'dev-2', name: 'Door-ServerRoom', deviceType: 'Door Controller', linkedGate: 'Side Gate A', linkedZones: ['Server Room'], protocol: 'Wiegand', status: 'Error' },
  { id: 'dev-3', name: 'Boom-LoadingBay', deviceType: 'Boom Barrier', linkedGate: 'Loading Bay', linkedZones: ['Parking'], protocol: 'API', status: 'Connected' },
];

const DEVICE_TYPES = ['Turnstile', 'Door Controller', 'Boom Barrier', 'Flap Gate', 'Speed Gate', 'Biometric Reader'];
const PROTOCOLS = ['API', 'OSDP', 'Wiegand', 'RS-485', 'TCP/IP', 'BACnet'];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INTEGRATIONS: Integration[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    category: 'Messaging',
    description: 'Send visitor invites, OTPs, and check-in notifications via WhatsApp.',
    status: 'Connected',
    configuredSites: 4,
    totalSites: 4,
    icon: <MessageSquare size={22} />,
    iconBg: 'bg-green-500',
    globalFields: [
      { key: 'phone_id', label: 'Phone Number ID', type: 'text', placeholder: 'Enter Phone Number ID' },
      { key: 'access_token', label: 'Access Token', type: 'password', placeholder: 'Enter Access Token' },
      { key: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://your-webhook.com/whatsapp' },
    ],
    siteFields: [
      { key: 'site_phone_id', label: 'Site Phone Number ID', type: 'text', placeholder: 'Override phone ID for this site' },
      { key: 'site_template', label: 'Message Template', type: 'text', placeholder: 'e.g. visitor_invite_v2' },
    ],
    siteConfigs: [
      { siteId: 'site-a', siteName: 'Site A – HQ', status: 'Connected', lastSync: '2 min ago', fields: {} },
      { siteId: 'site-b', siteName: 'Site B – Warehouse', status: 'Connected', lastSync: '5 min ago', fields: {} },
      { siteId: 'site-c', siteName: 'Site C – Branch', status: 'Connected', lastSync: '12 min ago', fields: {} },
      { siteId: 'site-d', siteName: 'Site D – Factory', status: 'Connected', lastSync: '1 hour ago', fields: {} },
    ],
  },
  {
    id: 'hris',
    name: 'HRIS (AD / Okta)',
    category: 'Identity & Access',
    description: 'Sync employee directory from Active Directory or Okta for host lookup.',
    status: 'Connected',
    configuredSites: 4,
    totalSites: 4,
    icon: <Users size={22} />,
    iconBg: 'bg-blue-600',
    globalFields: [
      { key: 'tenant_id', label: 'Tenant ID', type: 'text', placeholder: 'Enter Tenant / Domain ID' },
      { key: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter Client ID' },
      { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: 'Enter Client Secret' },
    ],
    siteFields: [
      { key: 'ou_path', label: 'OU / Group Path', type: 'text', placeholder: 'e.g. OU=SiteA,DC=company,DC=com' },
      { key: 'sync_filter', label: 'Sync Filter', type: 'text', placeholder: 'e.g. department=Engineering' },
    ],
    siteConfigs: [
      { siteId: 'site-a', siteName: 'Site A – HQ', status: 'Connected', lastSync: '15 min ago', fields: {} },
      { siteId: 'site-b', siteName: 'Site B – Warehouse', status: 'Connected', lastSync: '15 min ago', fields: {} },
      { siteId: 'site-c', siteName: 'Site C – Branch', status: 'Connected', lastSync: '20 min ago', fields: {} },
      { siteId: 'site-d', siteName: 'Site D – Factory', status: 'Connected', lastSync: '30 min ago', fields: {} },
    ],
  },
  {
    id: 'access-control',
    name: 'Access Control',
    category: 'Physical Security',
    description: 'Integrate with door controllers and turnstiles for automated gate access.',
    status: 'Error',
    configuredSites: 2,
    totalSites: 4,
    icon: <Shield size={22} />,
    iconBg: 'bg-red-500',
    globalFields: [
      { key: 'system_type', label: 'System Type', type: 'text', placeholder: 'e.g. HID Origo, Lenel S2' },
      { key: 'api_key', label: 'Global API Key', type: 'password', placeholder: 'Enter API Key' },
    ],
    siteFields: [
      { key: 'controller_ip', label: 'Controller IP Address', type: 'text', placeholder: '192.168.1.100' },
      { key: 'site_api_key', label: 'Site API Key', type: 'password', placeholder: 'Enter site-specific API Key' },
      { key: 'port', label: 'Port', type: 'text', placeholder: '8080' },
    ],
    siteConfigs: [
      { siteId: 'site-a', siteName: 'Site A – HQ', status: 'Connected', lastSync: '1 hour ago', fields: {} },
      { siteId: 'site-b', siteName: 'Site B – Warehouse', status: 'Error', lastSync: '2 hours ago', fields: {} },
      { siteId: 'site-c', siteName: 'Site C – Branch', status: 'Disconnected', fields: {} },
      { siteId: 'site-d', siteName: 'Site D – Factory', status: 'Disconnected', fields: {} },
    ],
  },
  {
    id: 'slack',
    name: 'Slack / Microsoft Teams',
    category: 'Collaboration',
    description: 'Notify hosts on Slack or Teams when their visitor arrives or needs approval.',
    status: 'Disconnected',
    configuredSites: 0,
    totalSites: 4,
    icon: <Bell size={22} />,
    iconBg: 'bg-purple-600',
    globalFields: [
      { key: 'platform', label: 'Platform', type: 'text', placeholder: 'Slack or Microsoft Teams' },
      { key: 'webhook_url', label: 'Incoming Webhook URL', type: 'url', placeholder: 'https://hooks.slack.com/...' },
      { key: 'bot_token', label: 'Bot Token (optional)', type: 'password', placeholder: 'xoxb-...' },
    ],
    siteFields: [
      { key: 'channel', label: 'Default Channel', type: 'text', placeholder: '#visitor-alerts-site-a' },
      { key: 'notify_roles', label: 'Notify Roles', type: 'text', placeholder: 'e.g. host, security' },
    ],
    siteConfigs: [
      { siteId: 'site-a', siteName: 'Site A – HQ', status: 'Disconnected', fields: {} },
      { siteId: 'site-b', siteName: 'Site B – Warehouse', status: 'Disconnected', fields: {} },
      { siteId: 'site-c', siteName: 'Site C – Branch', status: 'Disconnected', fields: {} },
      { siteId: 'site-d', siteName: 'Site D – Factory', status: 'Disconnected', fields: {} },
    ],
  },
  {
    id: 'printer',
    name: 'Printer Service',
    category: 'Hardware',
    description: 'Connect to Windows Print Service or network printers for badge printing.',
    status: 'Connected',
    configuredSites: 3,
    totalSites: 4,
    icon: <Printer size={22} />,
    iconBg: 'bg-slate-600',
    globalFields: [
      { key: 'service_url', label: 'Print Service URL', type: 'url', placeholder: 'http://localhost:8181' },
      { key: 'api_key', label: 'Service API Key', type: 'password', placeholder: 'Enter API Key' },
    ],
    siteFields: [
      { key: 'printer_ip', label: 'Printer IP Address', type: 'text', placeholder: '192.168.1.100' },
      { key: 'printer_model', label: 'Printer Model', type: 'text', placeholder: 'e.g. Brother QL-820NWB' },
      { key: 'badge_template', label: 'Badge Template', type: 'text', placeholder: 'default-badge-v2' },
    ],
    siteConfigs: [
      { siteId: 'site-a', siteName: 'Site A – HQ', status: 'Connected', lastSync: '1 hour ago', fields: {} },
      { siteId: 'site-b', siteName: 'Site B – Warehouse', status: 'Connected', lastSync: '2 hours ago', fields: {} },
      { siteId: 'site-c', siteName: 'Site C – Branch', status: 'Connected', lastSync: '3 hours ago', fields: {} },
      { siteId: 'site-d', siteName: 'Site D – Factory', status: 'Disconnected', fields: {} },
    ],
  },
  {
    id: 'calendar',
    name: 'Calendar (Google / Outlook)',
    category: 'Productivity',
    description: 'Sync meeting invites and auto-create visitor pre-registrations from calendar events.',
    status: 'Pending',
    configuredSites: 1,
    totalSites: 4,
    icon: <Calendar size={22} />,
    iconBg: 'bg-amber-500',
    globalFields: [
      { key: 'client_id', label: 'OAuth Client ID', type: 'text', placeholder: 'Enter Client ID' },
      { key: 'client_secret', label: 'OAuth Client Secret', type: 'password', placeholder: 'Enter Client Secret' },
      { key: 'redirect_uri', label: 'Redirect URI', type: 'url', placeholder: 'https://your-app.com/oauth/callback' },
    ],
    siteFields: [
      { key: 'calendar_id', label: 'Calendar ID', type: 'text', placeholder: 'e.g. site-a@company.com' },
      { key: 'sync_interval', label: 'Sync Interval (minutes)', type: 'text', placeholder: '15' },
    ],
    siteConfigs: [
      { siteId: 'site-a', siteName: 'Site A – HQ', status: 'Pending', fields: {} },
      { siteId: 'site-b', siteName: 'Site B – Warehouse', status: 'Disconnected', fields: {} },
      { siteId: 'site-c', siteName: 'Site C – Branch', status: 'Disconnected', fields: {} },
      { siteId: 'site-d', siteName: 'Site D – Factory', status: 'Disconnected', fields: {} },
    ],
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: IntegrationStatus }) {
  const cfg = {
    Connected: { bg: 'bg-green-50', text: 'text-green-700', icon: <CheckCircle size={11} /> },
    Disconnected: { bg: 'bg-slate-100', text: 'text-slate-600', icon: <XCircle size={11} /> },
    Error: { bg: 'bg-red-50', text: 'text-red-700', icon: <AlertCircle size={11} /> },
    Pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: <RefreshCw size={11} /> },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.icon}
      {status}
    </span>
  );
}

function DeviceStatusPill({ status }: { status: DeviceStatus }) {
  if (status === 'Connected') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        Connected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-100">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
      Error
    </span>
  );
}

// ─── Add Device Modal ─────────────────────────────────────────────────────────

interface AddDeviceModalProps {
  siteId: string;
  onClose: () => void;
  onAdd: (device: AccessDevice) => void;
  editDevice?: AccessDevice | null;
}

function AddDeviceModal({ siteId, onClose, onAdd, editDevice }: AddDeviceModalProps) {
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
    onAdd({
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <Shield size={15} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-text-primary">
                {editDevice ? 'Edit Device' : 'Add Access Control Device'}
              </h3>
              <p className="text-[11px] text-text-muted">Map device to gate & access zone</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface transition-colors">
            <X size={14} className="text-text-muted" />
          </button>
        </div>

        {/* Modal Body */}
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
            <select
              value={form.deviceType}
              onChange={e => setForm(p => ({ ...p, deviceType: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
            >
              {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Linked Gate */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">
              <span className="flex items-center gap-1.5"><MapPin size={11} className="text-text-muted" /> Linked Gate / Entry Point</span>
            </label>
            <select
              value={form.linkedGate}
              onChange={e => setForm(p => ({ ...p, linkedGate: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
            >
              {gates.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
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
                      ? 'bg-primary-600 text-white border-primary-600' :'bg-white text-text-secondary border-border hover:border-primary-300 hover:text-primary-700'
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
            <select
              value={form.protocol}
              onChange={e => setForm(p => ({ ...p, protocol: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
            >
              {PROTOCOLS.map(pr => <option key={pr} value={pr}>{pr}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Status</label>
            <div className="flex gap-2">
              {(['Connected', 'Error'] as DeviceStatus[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, status: s }))}
                  className={`flex-1 py-2 rounded-lg text-[12px] font-semibold border transition-all ${
                    form.status === s
                      ? s === 'Connected' ?'bg-green-50 text-green-700 border-green-300' :'bg-red-50 text-red-700 border-red-300' :'bg-white text-text-secondary border-border hover:bg-surface'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
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
            className="flex-1 px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editDevice ? 'Save Changes' : 'Add Device'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Device & Gate Mapping Section ───────────────────────────────────────────

interface DeviceGateMappingProps {
  siteId: string;
  siteName: string;
}

function DeviceGateMapping({ siteId, siteName }: DeviceGateMappingProps) {
  const [devices, setDevices] = useState<AccessDevice[]>(INITIAL_DEVICES);
  const [showModal, setShowModal] = useState(false);
  const [editDevice, setEditDevice] = useState<AccessDevice | null>(null);

  const handleAdd = (device: AccessDevice) => {
    if (editDevice) {
      setDevices(prev => prev.map(d => d.id === device.id ? device : d));
    } else {
      setDevices(prev => [...prev, device]);
    }
    setEditDevice(null);
  };

  const handleRemove = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  const handleEdit = (device: AccessDevice) => {
    setEditDevice(device);
    setShowModal(true);
  };

  return (
    <>
      <div className="mt-5 space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-bold text-text-primary">Device &amp; Gate Mapping</h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              {devices.length} device{devices.length !== 1 ? 's' : ''} mapped for {siteName}
            </p>
          </div>
          <button
            onClick={() => { setEditDevice(null); setShowModal(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <Plus size={13} />
            Add Device
          </button>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-blue-700 leading-relaxed">
            Map your physical doors/turnstiles to specific Gates and Access Zones so visitor check-in automatically grants access.
          </p>
        </div>

        {/* Devices Table */}
        {devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border rounded-xl bg-surface/40">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-2.5">
              <Shield size={18} className="text-text-muted" />
            </div>
            <p className="text-[13px] font-semibold text-text-secondary">No devices mapped yet</p>
            <p className="text-[11px] text-text-muted mt-1">Click &quot;Add Device&quot; to link your first hardware device.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    <th className="text-left px-3 py-2.5 font-semibold text-text-secondary whitespace-nowrap">Device ID / Name</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-text-secondary whitespace-nowrap">Type</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-text-secondary whitespace-nowrap">Linked Gate</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-text-secondary whitespace-nowrap">Access Zone(s)</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-text-secondary whitespace-nowrap">Protocol</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-text-secondary whitespace-nowrap">Status</th>
                    <th className="px-3 py-2.5 font-semibold text-text-secondary whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device, idx) => (
                    <tr
                      key={device.id}
                      className={`border-b border-border last:border-0 transition-colors hover:bg-primary-50/20 ${idx % 2 === 1 ? 'bg-surface/30' : 'bg-white'}`}
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center shrink-0">
                            <Shield size={11} className="text-red-500" />
                          </div>
                          <span className="font-semibold text-text-primary whitespace-nowrap">{device.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-text-secondary text-[11px] font-medium whitespace-nowrap">
                          {device.deviceType}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1 text-text-secondary whitespace-nowrap">
                          <MapPin size={10} className="text-text-muted shrink-0" />
                          {device.linkedGate}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {device.linkedZones.length === 0 ? (
                            <span className="text-text-muted">—</span>
                          ) : device.linkedZones.map(zone => (
                            <span key={zone} className="px-1.5 py-0.5 rounded bg-primary-50 text-primary-700 text-[10px] font-medium whitespace-nowrap">
                              {zone}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-medium whitespace-nowrap border border-amber-100">
                          {device.protocol}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <DeviceStatusPill status={device.status} />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(device)}
                            title="Edit"
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-primary-50 text-text-muted hover:text-primary-700 transition-colors"
                          >
                            <Edit2 size={11} />
                          </button>
                          <button
                            title="Test Connection"
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-amber-50 text-text-muted hover:text-amber-600 transition-colors"
                          >
                            <FlaskConical size={11} />
                          </button>
                          <button
                            onClick={() => handleRemove(device.id)}
                            title="Remove"
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={11} />
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
      </div>

      {showModal && (
        <AddDeviceModal
          siteId={siteId}
          onClose={() => { setShowModal(false); setEditDevice(null); }}
          onAdd={handleAdd}
          editDevice={editDevice}
        />
      )}
    </>
  );
}

// ─── Configure Drawer ─────────────────────────────────────────────────────────

interface ConfigDrawerProps {
  integration: Integration;
  onClose: () => void;
}

function ConfigDrawer({ integration, onClose }: ConfigDrawerProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'per-site'>('global');
  const [globalValues, setGlobalValues] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [editingSite, setEditingSite] = useState<SiteConfig | null>(null);
  const [siteValues, setSiteValues] = useState<Record<string, string>>({});
  const [autoSaved, setAutoSaved] = useState(false);

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult('success');
    }, 1800);
  };

  const handleFieldChange = (key: string, value: string) => {
    setGlobalValues(p => ({ ...p, [key]: value }));
    setAutoSaved(false);
    setTimeout(() => setAutoSaved(true), 800);
  };

  const handleSiteFieldChange = (key: string, value: string) => {
    setSiteValues(p => ({ ...p, [key]: value }));
    setAutoSaved(false);
    setTimeout(() => setAutoSaved(true), 800);
  };

  const openSiteEdit = (site: SiteConfig) => {
    setEditingSite(site);
    setSiteValues(site.fields || {});
  };

  const isAccessControl = integration.id === 'access-control';

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} style={{ background: 'rgba(0,0,0,0.35)' }} />
      <div className="w-full max-w-[520px] bg-white h-full shadow-2xl flex flex-col overflow-hidden">

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${integration.iconBg}`}>
              {integration.icon}
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-text-primary">{integration.name}</h2>
              <p className="text-[11px] text-text-muted">{integration.category} · Global Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {autoSaved && (
              <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                <CheckCircle size={11} /> Auto-saved
              </span>
            )}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors">
              <X size={16} className="text-text-muted" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0">
          <button
            onClick={() => { setActiveTab('global'); setEditingSite(null); }}
            className={`flex items-center gap-2 px-5 py-3 text-[13px] font-semibold border-b-2 transition-all ${
              activeTab === 'global' ? 'border-primary-600 text-primary-700' : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            <Globe size={14} />
            Global Configuration
          </button>
          <button
            onClick={() => { setActiveTab('per-site'); setEditingSite(null); }}
            className={`flex items-center gap-2 px-5 py-3 text-[13px] font-semibold border-b-2 transition-all ${
              activeTab === 'per-site' ? 'border-primary-600 text-primary-700' : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            <Building2 size={14} />
            Per-Site Configuration
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Global Configuration Tab ── */}
          {activeTab === 'global' && (
            <div className="px-5 py-5 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border">
                <span className="text-[12px] font-semibold text-text-secondary">Current Status</span>
                <StatusBadge status={integration.status} />
              </div>

              <p className="text-[13px] text-text-secondary leading-relaxed">{integration.description}</p>

              {/* Credential Fields */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-text-primary uppercase tracking-wider">Company-Wide Credentials</p>
                {integration.globalFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.type === 'password' && !showPass[field.key] ? 'password' : 'text'}
                        placeholder={field.placeholder}
                        value={globalValues[field.key] || ''}
                        onChange={e => handleFieldChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white pr-9"
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => setShowPass(p => ({ ...p, [field.key]: !p[field.key] }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                        >
                          {showPass[field.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Test Connection */}
              <div>
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-2 border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-all disabled:opacity-60"
                >
                  {testing ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                  {testing ? 'Testing Connection...' : 'Test Connection'}
                </button>
                {testResult === 'success' && (
                  <div className="mt-2 flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle size={14} className="text-green-600 shrink-0" />
                    <span className="text-[12px] text-green-700 font-medium">Connection successful! Credentials are valid.</span>
                  </div>
                )}
                {testResult === 'error' && (
                  <div className="mt-2 flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle size={14} className="text-red-600 shrink-0" />
                    <span className="text-[12px] text-red-700 font-medium">Connection failed. Please check your credentials.</span>
                  </div>
                )}
              </div>

              {/* Help tooltip */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <HelpCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[12px] text-blue-700 leading-relaxed">
                  Global credentials apply to all sites by default. You can override them per-site in the <strong>Per-Site Configuration</strong> tab.
                </p>
              </div>
            </div>
          )}

          {/* ── Per-Site Configuration Tab ── */}
          {activeTab === 'per-site' && !editingSite && (
            <div className="px-5 py-5 space-y-4">
              <p className="text-[13px] text-text-secondary">
                Configure site-specific overrides. Sites without overrides use the global credentials.
              </p>

              {/* Sites Table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-surface border-b border-border">
                      <th className="text-left px-4 py-2.5 font-semibold text-text-secondary">Site</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-text-secondary">Status</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-text-secondary">Last Sync</th>
                      <th className="px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {integration.siteConfigs.map((site, idx) => (
                      <tr
                        key={site.siteId}
                        className={`border-b border-border last:border-0 hover:bg-surface/60 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-surface/30'}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center">
                              <Building2 size={12} className="text-primary-600" />
                            </div>
                            <span className="font-medium text-text-primary">{site.siteName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={site.status} />
                        </td>
                        <td className="px-4 py-3 text-text-muted">
                          {site.lastSync || '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => openSiteEdit(site)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-all"
                          >
                            <Edit2 size={11} />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Per-Site Edit View ── */}
          {activeTab === 'per-site' && editingSite && (
            <div className="px-5 py-5 space-y-5">
              {/* Back */}
              <button
                onClick={() => setEditingSite(null)}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-primary-700 hover:text-primary-800 transition-colors"
              >
                <ChevronLeft size={14} />
                Back to all sites
              </button>

              {/* Site Header */}
              <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Building2 size={15} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-text-primary">{editingSite.siteName}</p>
                    <p className="text-[11px] text-text-muted">Site-specific overrides</p>
                  </div>
                </div>
                <StatusBadge status={editingSite.status} />
              </div>

              {/* Site-Specific Fields */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-text-primary uppercase tracking-wider">Site Credentials / Overrides</p>
                {integration.siteFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.type === 'password' && !showPass['site_' + field.key] ? 'password' : 'text'}
                        placeholder={field.placeholder}
                        value={siteValues[field.key] || ''}
                        onChange={e => handleSiteFieldChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white pr-9"
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => setShowPass(p => ({ ...p, ['site_' + field.key]: !p['site_' + field.key] }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                        >
                          {showPass['site_' + field.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <HelpCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[12px] text-amber-700 leading-relaxed">
                  Leave fields empty to inherit global credentials. Filled fields override the global settings for this site only.
                </p>
              </div>

              {/* Device & Gate Mapping — only for Access Control */}
              {isAccessControl && (
                <div className="border-t border-border pt-5">
                  <DeviceGateMapping siteId={editingSite.siteId} siteName={editingSite.siteName} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-border flex items-center gap-2.5 bg-surface">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-white transition-colors">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 transition-all shadow-sm"
          >
            {editingSite ? 'Save Site Config' : 'Save & Connect'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────

interface IntegrationCardProps {
  integration: Integration;
  onConfigure: (integration: Integration) => void;
}

function IntegrationCard({ integration, onConfigure }: IntegrationCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 ${integration.iconBg}`}>
            {integration.icon}
          </div>
          <div>
            <p className="text-[13px] font-bold text-text-primary">{integration.name}</p>
            <p className="text-[11px] text-text-muted">{integration.category}</p>
          </div>
        </div>
        <StatusBadge status={integration.status} />
      </div>

      <p className="text-[12px] text-text-secondary leading-relaxed flex-1">{integration.description}</p>

      <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
        <Building2 size={12} className="text-text-muted" />
        <span>
          Configured for <span className="font-semibold text-text-secondary">{integration.configuredSites}</span> of {integration.totalSites} sites
        </span>
      </div>

      <button
        onClick={() => onConfigure(integration)}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-primary-700 border border-primary-200 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
      >
        <Settings size={13} />
        Configure
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [activeDrawer, setActiveDrawer] = useState<Integration | null>(null);
  const [activeSite, setActiveSite] = useState('all');

  const filteredIntegrations = activeSite === 'all'
    ? INTEGRATIONS
    : INTEGRATIONS.filter(i =>
        i.siteConfigs.some(sc => sc.siteId === activeSite && sc.status !== 'Disconnected')
      );

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[20px] font-bold text-text-primary">Integrations</h1>
              <div className="relative group">
                <button className="w-5 h-5 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-primary-50 transition-colors">
                  <HelpCircle size={12} className="text-text-muted" />
                </button>
                <div className="absolute left-6 top-0 z-20 hidden group-hover:block w-60 p-2.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl">
                  Connect VMSPro with your existing tools and services. Global credentials apply to all sites; override per-site as needed.
                </div>
              </div>
            </div>
            <p className="text-[13px] text-text-muted mt-0.5">Connect tools &amp; services across all your sites</p>
          </div>

          {/* Stats summary */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg">
              <CheckCircle size={13} className="text-green-600" />
              <span className="text-[12px] font-semibold text-green-700">
                {INTEGRATIONS.filter(i => i.status === 'Connected').length} Connected
              </span>
            </div>
            {INTEGRATIONS.filter(i => i.status === 'Error').length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg">
                <AlertCircle size={13} className="text-red-600" />
                <span className="text-[12px] font-semibold text-red-700">
                  {INTEGRATIONS.filter(i => i.status === 'Error').length} Error
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Site Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mr-1">Filter by site:</span>
          {ALL_SITES.map(site => (
            <button
              key={site.id}
              onClick={() => setActiveSite(site.id)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                activeSite === site.id
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white text-text-secondary border-border hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {site.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map(integration => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConfigure={setActiveDrawer}
            />
          ))}
          {filteredIntegrations.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-3">
                <Plug size={22} className="text-text-muted" />
              </div>
              <p className="text-[14px] font-semibold text-text-secondary">No integrations configured for this site</p>
              <p className="text-[12px] text-text-muted mt-1">Select &quot;All Sites&quot; to see all available integrations.</p>
            </div>
          )}
        </div>

      </div>

      {activeDrawer && (
        <ConfigDrawer
          integration={activeDrawer}
          onClose={() => setActiveDrawer(null)}
        />
      )}
    </AppLayout>
  );
}
