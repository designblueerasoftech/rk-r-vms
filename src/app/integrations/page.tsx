'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Plug, X, CheckCircle, XCircle, AlertCircle, HelpCircle,
  RefreshCw, ChevronRight, Eye, EyeOff, Zap, Settings,
  MessageSquare, Users, Shield, Printer, Calendar, Bell,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type IntegrationStatus = 'Connected' | 'Disconnected' | 'Error' | 'Pending';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: IntegrationStatus;
  lastSync?: string;
  icon: React.ReactNode;
  iconBg: string;
  fields: { key: string; label: string; type: 'text' | 'password' | 'url'; placeholder: string }[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INTEGRATIONS: Integration[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    category: 'Messaging',
    description: 'Send visitor invites, OTPs, and check-in notifications via WhatsApp.',
    status: 'Connected',
    lastSync: '2 min ago',
    icon: <MessageSquare size={22} />,
    iconBg: 'bg-green-500',
    fields: [
      { key: 'phone_id', label: 'Phone Number ID', type: 'text', placeholder: 'Enter Phone Number ID' },
      { key: 'access_token', label: 'Access Token', type: 'password', placeholder: 'Enter Access Token' },
      { key: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://your-webhook.com/whatsapp' },
    ],
  },
  {
    id: 'hris',
    name: 'HRIS (AD / Okta)',
    category: 'Identity & Access',
    description: 'Sync employee directory from Active Directory or Okta for host lookup.',
    status: 'Connected',
    lastSync: '15 min ago',
    icon: <Users size={22} />,
    iconBg: 'bg-blue-600',
    fields: [
      { key: 'tenant_id', label: 'Tenant ID', type: 'text', placeholder: 'Enter Tenant / Domain ID' },
      { key: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter Client ID' },
      { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: 'Enter Client Secret' },
    ],
  },
  {
    id: 'access-control',
    name: 'Access Control (Door/Turnstile)',
    category: 'Physical Security',
    description: 'Integrate with door controllers and turnstiles for automated gate access.',
    status: 'Error',
    lastSync: '2 hours ago',
    icon: <Shield size={22} />,
    iconBg: 'bg-red-500',
    fields: [
      { key: 'controller_ip', label: 'Controller IP Address', type: 'text', placeholder: '192.168.1.100' },
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'Enter API Key' },
      { key: 'port', label: 'Port', type: 'text', placeholder: '8080' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack / Microsoft Teams',
    category: 'Collaboration',
    description: 'Notify hosts on Slack or Teams when their visitor arrives or needs approval.',
    status: 'Disconnected',
    icon: <Bell size={22} />,
    iconBg: 'bg-purple-600',
    fields: [
      { key: 'webhook_url', label: 'Incoming Webhook URL', type: 'url', placeholder: 'https://hooks.slack.com/...' },
      { key: 'bot_token', label: 'Bot Token (optional)', type: 'password', placeholder: 'xoxb-...' },
    ],
  },
  {
    id: 'printer',
    name: 'Printer Service',
    category: 'Hardware',
    description: 'Connect to Windows Print Service or network printers for badge printing.',
    status: 'Connected',
    lastSync: '1 hour ago',
    icon: <Printer size={22} />,
    iconBg: 'bg-slate-600',
    fields: [
      { key: 'service_url', label: 'Print Service URL', type: 'url', placeholder: 'http://localhost:8181' },
      { key: 'api_key', label: 'Service API Key', type: 'password', placeholder: 'Enter API Key' },
    ],
  },
  {
    id: 'calendar',
    name: 'Calendar (Google / Outlook)',
    category: 'Productivity',
    description: 'Sync meeting invites and auto-create visitor pre-registrations from calendar events.',
    status: 'Pending',
    icon: <Calendar size={22} />,
    iconBg: 'bg-amber-500',
    fields: [
      { key: 'client_id', label: 'OAuth Client ID', type: 'text', placeholder: 'Enter Client ID' },
      { key: 'client_secret', label: 'OAuth Client Secret', type: 'password', placeholder: 'Enter Client Secret' },
      { key: 'redirect_uri', label: 'Redirect URI', type: 'url', placeholder: 'https://your-app.com/oauth/callback' },
    ],
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: IntegrationStatus }) {
  const cfg = {
    Connected: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', icon: <CheckCircle size={11} /> },
    Disconnected: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', icon: <XCircle size={11} /> },
    Error: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', icon: <AlertCircle size={11} /> },
    Pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', icon: <RefreshCw size={11} /> },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.icon}
      {status}
    </span>
  );
}

// ─── Configure Drawer ─────────────────────────────────────────────────────────

interface ConfigDrawerProps {
  integration: Integration;
  onClose: () => void;
  onConnect: (id: string) => void;
}

function ConfigDrawer({ integration, onClose, onConnect }: ConfigDrawerProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult('success');
    }, 1800);
  };

  const handleSave = () => {
    onConnect(integration.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} style={{ background: 'rgba(0,0,0,0.35)' }} />
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${integration.iconBg}`}>
              {integration.icon}
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-text-primary">{integration.name}</h2>
              <p className="text-[11px] text-text-muted">{integration.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors">
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border">
            <span className="text-[12px] font-semibold text-text-secondary">Current Status</span>
            <StatusBadge status={integration.status} />
          </div>

          <p className="text-[13px] text-text-secondary">{integration.description}</p>

          {/* Credential Fields */}
          <div className="space-y-3">
            <p className="text-[12px] font-bold text-text-primary uppercase tracking-wider">Credentials</p>
            {integration.fields.map(field => (
              <div key={field.key}>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">{field.label}</label>
                <div className="relative">
                  <input
                    type={field.type === 'password' && !showPass[field.key] ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    value={values[field.key] || ''}
                    onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
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
        </div>

        {/* Drawer Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-border flex items-center gap-2.5">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 transition-all shadow-sm">
            Save & Connect
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

      {integration.lastSync && (
        <p className="text-[11px] text-text-muted">Last sync: {integration.lastSync}</p>
      )}

      <button
        onClick={() => onConfigure(integration)}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-primary-700 border border-primary-200 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
      >
        <Settings size={13} />
        Configure
        <ChevronRight size={12} />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [activeDrawer, setActiveDrawer] = useState<Integration | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(INTEGRATIONS.map(i => i.category)))];

  const filtered = integrations.filter(i =>
    filterCategory === 'All' || i.category === filterCategory
  );

  const handleConnect = (id: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'Connected' as IntegrationStatus, lastSync: 'just now' } : i
    ));
  };

  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.status === 'Connected').length,
    errors: integrations.filter(i => i.status === 'Error').length,
  };

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[20px] font-bold text-text-primary">Integrations</h1>
              <button className="w-5 h-5 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-primary-50 transition-colors group relative">
                <HelpCircle size={12} className="text-text-muted" />
                <div className="absolute left-6 top-0 z-20 hidden group-hover:block w-56 p-2.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl">
                  Connect VMSPro with your existing tools and services.
                </div>
              </button>
            </div>
            <p className="text-[13px] text-text-muted mt-0.5">Connect VMSPro with messaging, identity, access control, and productivity tools.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Integrations', value: stats.total, icon: <Plug size={16} />, color: 'text-primary-600', bg: 'bg-primary-50' },
            { label: 'Connected', value: stats.connected, icon: <CheckCircle size={16} />, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Errors', value: stats.errors, icon: <AlertCircle size={16} />, color: 'text-red-600', bg: 'bg-red-50' },
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

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                filterCategory === cat
                  ? 'bg-primary-600 text-white border-primary-600' :'bg-white text-text-secondary border-border hover:border-primary-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(integration => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConfigure={setActiveDrawer}
            />
          ))}
        </div>

      </div>

      {activeDrawer && (
        <ConfigDrawer
          integration={activeDrawer}
          onClose={() => setActiveDrawer(null)}
          onConnect={handleConnect}
        />
      )}
    </AppLayout>
  );
}
