'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Settings, Building2, Clock, Key, Upload, Plus, Trash2, Eye, EyeOff, Copy, HelpCircle, CheckCircle, AlertCircle, Globe, Mail, Phone, MapPin, Edit2, X, Webhook, ChevronDown,  } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SettingsTab = 'company' | 'retention' | 'apikeys';

interface RetentionPolicy {
  id: string;
  dataType: string;
  description: string;
  purgeDays: number;
  category: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  permissions: string[];
  status: 'Active' | 'Revoked';
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'Active' | 'Inactive';
  lastTriggered: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const RETENTION_POLICIES: RetentionPolicy[] = [
  { id: 'RP-001', dataType: 'Visitor Logs', description: 'Full visit records including check-in/out times and host details', purgeDays: 365, category: 'Visit Records' },
  { id: 'RP-002', dataType: 'Visitor Photos', description: 'Profile photos captured at kiosk during check-in', purgeDays: 30, category: 'Media' },
  { id: 'RP-003', dataType: 'ID Scan Data', description: 'Government ID scan data collected at entry points', purgeDays: 90, category: 'Identity' },
  { id: 'RP-004', dataType: 'Health Declarations', description: 'Health screening responses from visitors', purgeDays: 60, category: 'Health' },
  { id: 'RP-005', dataType: 'Induction Records', description: 'Induction completion and acknowledgement records', purgeDays: 180, category: 'Compliance' },
  { id: 'RP-006', dataType: 'Consent Records', description: 'Visitor consent and data processing agreements', purgeDays: 730, category: 'Compliance' },
  { id: 'RP-007', dataType: 'Audit Logs', description: 'System and user activity audit trail', purgeDays: 1095, category: 'Security' },
  { id: 'RP-008', dataType: 'Blacklist Records', description: 'Blacklisted and watchlisted visitor records', purgeDays: 1825, category: 'Security' },
];

const API_KEYS: ApiKey[] = [
  { id: 'AK-001', name: 'Production Integration Key', key: 'vmsp_live_sk_a1b2c3d4e5f6g7h8i9j0', created: '01 Jan 2026', lastUsed: '17 Apr 2026', permissions: ['read:visitors', 'write:visitors', 'read:reports'], status: 'Active' },
  { id: 'AK-002', name: 'WhatsApp Service Key', key: 'vmsp_live_sk_z9y8x7w6v5u4t3s2r1q0', created: '15 Feb 2026', lastUsed: '17 Apr 2026', permissions: ['read:visitors', 'write:notifications'], status: 'Active' },
  { id: 'AK-003', name: 'Reporting Dashboard Key', key: 'vmsp_live_sk_m1n2o3p4q5r6s7t8u9v0', created: '01 Mar 2026', lastUsed: '10 Apr 2026', permissions: ['read:reports', 'read:analytics'], status: 'Active' },
  { id: 'AK-004', name: 'Legacy Integration Key', key: 'vmsp_live_sk_old_deprecated_key', created: '01 Jan 2025', lastUsed: '01 Jan 2026', permissions: ['read:visitors'], status: 'Revoked' },
];

const WEBHOOKS: Webhook[] = [
  { id: 'WH-001', name: 'Visitor Check-In Webhook', url: 'https://api.acme.com/webhooks/visitor-checkin', events: ['visitor.checked_in', 'visitor.checked_out'], status: 'Active', lastTriggered: '17 Apr 2026, 09:42 AM' },
  { id: 'WH-002', name: 'Blacklist Alert Webhook', url: 'https://security.acme.com/alerts/blacklist', events: ['blacklist.match_detected'], status: 'Active', lastTriggered: '15 Apr 2026, 02:10 PM' },
  { id: 'WH-003', name: 'Emergency Broadcast Webhook', url: 'https://ops.acme.com/emergency', events: ['emergency.broadcast_sent'], status: 'Inactive', lastTriggered: 'Never' },
];

const PERMISSIONS_OPTIONS = ['read:visitors', 'write:visitors', 'read:reports', 'read:analytics', 'write:notifications', 'admin:all'];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');
  const [autoSaved, setAutoSaved] = useState(false);

  // Company Profile State
  const [company, setCompany] = useState({
    name: 'Acme Corporation',
    industry: 'Technology',
    website: 'https://acmecorp.com',
    email: 'admin@acmecorp.com',
    phone: '+91 22 4567 8900',
    address: '5th Floor, Acme Tower, BKC, Mumbai 400051',
    timezone: 'Asia/Kolkata (IST)',
    dateFormat: 'DD MMM YYYY',
    logo: '',
  });

  // Retention State
  const [retention, setRetention] = useState<RetentionPolicy[]>(RETENTION_POLICIES);
  const [editingRetention, setEditingRetention] = useState<string | null>(null);
  const [editRetentionDays, setEditRetentionDays] = useState(0);

  // API Keys State
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(API_KEYS);
  const [webhooks, setWebhooks] = useState<Webhook[]>(WEBHOOKS);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPerms, setNewKeyPerms] = useState<string[]>([]);
  const [generatedKey, setGeneratedKey] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const triggerAutoSave = () => {
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 3000);
  };

  const handleCompanyChange = (field: string, value: string) => {
    setCompany(p => ({ ...p, [field]: value }));
    triggerAutoSave();
  };

  const handleSaveRetention = (id: string) => {
    setRetention(prev => prev.map(r => r.id === id ? { ...r, purgeDays: editRetentionDays } : r));
    setEditingRetention(null);
    triggerAutoSave();
  };

  const handleGenerateKey = () => {
    const key = `vmsp_live_sk_${Math.random().toString(36).substring(2, 22)}`;
    const newKey: ApiKey = {
      id: `AK-${String(apiKeys.length + 1).padStart(3, '0')}`,
      name: newKeyName,
      key,
      created: '17 Apr 2026',
      lastUsed: 'Never',
      permissions: newKeyPerms,
      status: 'Active',
    };
    setApiKeys(prev => [newKey, ...prev]);
    setGeneratedKey(key);
    setNewKeyName('');
    setNewKeyPerms([]);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'Revoked' } : k));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'company', label: 'Company Profile', icon: <Building2 size={14} /> },
    { id: 'retention', label: 'Retention Policy', icon: <Clock size={14} /> },
    { id: 'apikeys', label: 'API Keys', icon: <Key size={14} /> },
  ];

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[20px] font-bold text-text-primary">Settings</h1>
              <button className="w-5 h-5 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-primary-50 transition-colors group relative">
                <HelpCircle size={12} className="text-text-muted" />
                <div className="absolute left-6 top-0 z-20 hidden group-hover:block w-56 p-2.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl">
                  Configure your company profile, data retention policies, and API access.
                </div>
              </button>
            </div>
            <p className="text-[13px] text-text-muted mt-0.5">Manage company profile, data retention policies, and API keys.</p>
          </div>
          {autoSaved && (
            <span className="flex items-center gap-1.5 text-[11px] text-success font-medium">
              <CheckCircle size={13} /> Auto-saved
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 flex-1 justify-center px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary-700 shadow-sm border border-border'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Company Profile ── */}
        {activeTab === 'company' && (
          <div className="grid grid-cols-3 gap-5">
            {/* Form */}
            <div className="col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="text-[13px] font-bold text-text-primary mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Company Name</label>
                    <input
                      type="text"
                      value={company.name}
                      onChange={e => handleCompanyChange('name', e.target.value)}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Industry</label>
                    <div className="relative">
                      <select
                        value={company.industry}
                        onChange={e => handleCompanyChange('industry', e.target.value)}
                        className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white pr-8"
                      >
                        {['Technology', 'Manufacturing', 'Healthcare', 'Finance', 'Retail', 'Education', 'Government', 'Other'].map(i => (
                          <option key={i}>{i}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">
                      <Globe size={12} className="inline mr-1" />Website
                    </label>
                    <input
                      type="url"
                      value={company.website}
                      onChange={e => handleCompanyChange('website', e.target.value)}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">
                      <Mail size={12} className="inline mr-1" />Admin Email
                    </label>
                    <input
                      type="email"
                      value={company.email}
                      onChange={e => handleCompanyChange('email', e.target.value)}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">
                      <Phone size={12} className="inline mr-1" />Phone
                    </label>
                    <input
                      type="tel"
                      value={company.phone}
                      onChange={e => handleCompanyChange('phone', e.target.value)}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Timezone</label>
                    <div className="relative">
                      <select
                        value={company.timezone}
                        onChange={e => handleCompanyChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white pr-8"
                      >
                        {['Asia/Kolkata (IST)', 'Asia/Dubai (GST)', 'Europe/London (GMT)', 'America/New_York (EST)', 'America/Los_Angeles (PST)'].map(tz => (
                          <option key={tz}>{tz}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">
                      <MapPin size={12} className="inline mr-1" />Registered Address
                    </label>
                    <textarea
                      rows={2}
                      value={company.address}
                      onChange={e => handleCompanyChange('address', e.target.value)}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="text-[13px] font-bold text-text-primary mb-4">Company Logo</h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-primary-50 border-2 border-dashed border-primary-200 flex items-center justify-center">
                    <Building2 size={32} className="text-primary-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-[12px] text-text-muted">PNG, JPG or SVG</p>
                    <p className="text-[11px] text-text-muted">Max 2MB · 512×512px recommended</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-primary-700 border border-primary-200 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors w-full justify-center">
                    <Upload size={13} />
                    Upload Logo
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="text-[13px] font-bold text-text-primary mb-3">Date Format</h3>
                <div className="space-y-2">
                  {['DD MMM YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(fmt => (
                    <label key={fmt} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="dateFormat"
                        value={fmt}
                        checked={company.dateFormat === fmt}
                        onChange={() => handleCompanyChange('dateFormat', fmt)}
                        className="accent-primary-600"
                      />
                      <span className="text-[12px] text-text-secondary font-mono">{fmt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Retention Policy ── */}
        {activeTab === 'retention' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg">
              <AlertCircle size={14} className="text-blue-600 shrink-0" />
              <p className="text-[12px] text-blue-700">Changes to retention policies take effect at the next scheduled purge run. Existing data is not immediately affected.</p>
            </div>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['Data Type', 'Category', 'Description', 'Purge After (Days)', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap border-b border-border">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {retention.map(r => (
                      <tr key={r.id} className="hover:bg-surface/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-[13px] font-semibold text-text-primary">{r.dataType}</p>
                          <p className="text-[11px] text-text-muted">{r.id}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-surface text-text-secondary text-[11px] font-semibold rounded border border-border">{r.category}</span>
                        </td>
                        <td className="px-4 py-3 max-w-[220px]">
                          <p className="text-[12px] text-text-secondary truncate">{r.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          {editingRetention === r.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={1}
                                value={editRetentionDays}
                                onChange={e => setEditRetentionDays(Number(e.target.value))}
                                className="w-20 px-2 py-1 text-[12px] border border-primary-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-200"
                              />
                              <button onClick={() => handleSaveRetention(r.id)} className="text-[11px] text-primary-700 font-semibold hover:underline">Save</button>
                              <button onClick={() => setEditingRetention(null)} className="text-[11px] text-text-muted hover:underline">Cancel</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-bold text-text-primary">{r.purgeDays}</span>
                              <span className="text-[11px] text-text-muted">days</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => { setEditingRetention(r.id); setEditRetentionDays(r.purgeDays); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-primary-700 bg-primary-50 border border-primary-100 rounded-lg hover:bg-primary-100 transition-colors"
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
          </div>
        )}

        {/* ── API Keys ── */}
        {activeTab === 'apikeys' && (
          <div className="space-y-5">
            {/* API Keys Section */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h3 className="text-[13px] font-bold text-text-primary">API Keys</h3>
                  <p className="text-[12px] text-text-muted mt-0.5">Manage API keys for external integrations</p>
                </div>
                <button
                  onClick={() => setShowNewKeyModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 transition-all shadow-sm"
                >
                  <Plus size={14} />
                  Generate New Key
                </button>
              </div>

              {generatedKey && (
                <div className="mx-5 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-green-700">Key generated! Copy it now — it won&apos;t be shown again.</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <code className="text-[11px] font-mono text-green-800 bg-green-100 px-2 py-1 rounded truncate flex-1">{generatedKey}</code>
                        <button onClick={() => handleCopy(generatedKey, 'new')} className="shrink-0 flex items-center gap-1 text-[11px] text-green-700 font-semibold">
                          {copied === 'new' ? <CheckCircle size={12} /> : <Copy size={12} />}
                          {copied === 'new' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <button onClick={() => setGeneratedKey('')} className="text-green-500 hover:text-green-700">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-border">
                {apiKeys.map(key => (
                  <div key={key.id} className={`px-5 py-4 flex items-start gap-4 ${key.status === 'Revoked' ? 'opacity-50' : ''}`}>
                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <Key size={16} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[13px] font-bold text-text-primary">{key.name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          key.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {key.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <code className="text-[11px] font-mono text-text-muted">
                          {showKey[key.id] ? key.key : key.key.substring(0, 16) + '••••••••••••••••'}
                        </code>
                        <button onClick={() => setShowKey(p => ({ ...p, [key.id]: !p[key.id] }))} className="text-text-muted hover:text-text-secondary">
                          {showKey[key.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                        <button onClick={() => handleCopy(key.key, key.id)} className="text-text-muted hover:text-text-secondary">
                          {copied === key.id ? <CheckCircle size={12} className="text-green-600" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-text-muted">
                        <span>Created: {key.created}</span>
                        <span>·</span>
                        <span>Last used: {key.lastUsed}</span>
                        <span>·</span>
                        <span>{key.permissions.length} permissions</span>
                      </div>
                    </div>
                    {key.status === 'Active' && (
                      <button
                        onClick={() => handleRevokeKey(key.id)}
                        className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={11} />
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Webhooks Section */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h3 className="text-[13px] font-bold text-text-primary">Webhooks</h3>
                  <p className="text-[12px] text-text-muted mt-0.5">Receive real-time event notifications to your endpoints</p>
                </div>
                <button className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-primary-700 border border-primary-200 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  <Plus size={14} />
                  Add Webhook
                </button>
              </div>
              <div className="divide-y divide-border">
                {webhooks.map(wh => (
                  <div key={wh.id} className="px-5 py-4 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <Globe size={16} className="text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[13px] font-bold text-text-primary">{wh.name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          wh.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {wh.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-text-muted truncate mb-1.5">{wh.url}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {wh.events.map(ev => (
                          <span key={ev} className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded">{ev}</span>
                        ))}
                        <span className="text-[11px] text-text-muted">· Last: {wh.lastTriggered}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface border border-transparent hover:border-border transition-all" title="Edit">
                        <Edit2 size={13} className="text-text-secondary" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 transition-all" title="Delete">
                        <Trash2 size={13} className="text-danger" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Generate Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold text-text-primary">Generate New API Key</h2>
              <button onClick={() => setShowNewKeyModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface">
                <X size={16} className="text-text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Key Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Mobile App Integration Key"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-2">Permissions</label>
                <div className="space-y-1.5">
                  {PERMISSIONS_OPTIONS.map(perm => (
                    <label key={perm} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-surface">
                      <input
                        type="checkbox"
                        checked={newKeyPerms.includes(perm)}
                        onChange={() => setNewKeyPerms(p => p.includes(perm) ? p.filter(x => x !== perm) : [...p, perm])}
                        className="accent-primary-600"
                      />
                      <code className="text-[12px] font-mono text-text-secondary">{perm}</code>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 mt-5">
              <button onClick={() => setShowNewKeyModal(false)} className="flex-1 px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface">
                Cancel
              </button>
              <button
                onClick={() => { handleGenerateKey(); setShowNewKeyModal(false); }}
                disabled={!newKeyName}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 disabled:opacity-60"
              >
                <Key size={13} />
                Generate Key
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
