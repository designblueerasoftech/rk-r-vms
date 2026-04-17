'use client';

import React, { useState } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { X, CheckCircle, AlertCircle, Settings, Loader } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  fields: { key: string; label: string; type: string; placeholder: string }[];
}

const integrations: Integration[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    description: 'Send visitor invites, OTPs, and check-in notifications via WhatsApp.',
    icon: '💬',
    status: 'connected',
    fields: [
      { key: 'phone_id', label: 'Phone Number ID', type: 'text', placeholder: 'e.g. 123456789012345' },
      { key: 'access_token', label: 'Access Token', type: 'password', placeholder: 'EAAxxxxxxxxxxxxxxx' },
      { key: 'waba_id', label: 'WhatsApp Business Account ID', type: 'text', placeholder: 'e.g. 987654321098765' },
    ],
  },
  {
    id: 'hris',
    name: 'HRIS (AD / Okta)',
    description: 'Sync employee directory for host lookup and auto-provisioning.',
    icon: '🏢',
    status: 'connected',
    fields: [
      { key: 'provider', label: 'Provider', type: 'text', placeholder: 'e.g. Okta or Azure AD' },
      { key: 'tenant_id', label: 'Tenant / Domain', type: 'text', placeholder: 'yourcompany.okta.com' },
      { key: 'client_id', label: 'Client ID', type: 'text', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx' },
      { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••••••••••' },
    ],
  },
  {
    id: 'access-control',
    name: 'Access Control',
    description: 'Integrate with HID, Lenel, or other access control systems.',
    icon: '🔐',
    status: 'connected',
    fields: [
      { key: 'system', label: 'System Type', type: 'text', placeholder: 'e.g. HID Origo, Lenel S2' },
      { key: 'api_url', label: 'API Endpoint', type: 'text', placeholder: 'https://access.yourcompany.com/api' },
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: '••••••••••••••••' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack / Teams',
    description: 'Notify hosts instantly when their visitor arrives at the gate.',
    icon: '📣',
    status: 'disconnected',
    fields: [
      { key: 'platform', label: 'Platform', type: 'text', placeholder: 'Slack or Microsoft Teams' },
      { key: 'webhook_url', label: 'Webhook URL', type: 'text', placeholder: 'https://hooks.slack.com/services/...' },
      { key: 'channel', label: 'Default Channel', type: 'text', placeholder: '#visitor-alerts' },
    ],
  },
  {
    id: 'printer',
    name: 'Printer Service',
    description: 'Configure badge printers for automatic visitor badge printing.',
    icon: '🖨️',
    status: 'connected',
    fields: [
      { key: 'printer_model', label: 'Printer Model', type: 'text', placeholder: 'e.g. Brother QL-820NWB' },
      { key: 'printer_ip', label: 'Printer IP Address', type: 'text', placeholder: '192.168.1.100' },
      { key: 'template', label: 'Badge Template', type: 'text', placeholder: 'default-badge-v2' },
    ],
  },
  {
    id: 'calendar',
    name: 'Calendar Integration',
    description: 'Sync visitor invites with Google Calendar or Outlook.',
    icon: '📅',
    status: 'error',
    fields: [
      { key: 'provider', label: 'Calendar Provider', type: 'text', placeholder: 'Google Calendar or Outlook' },
      { key: 'client_id', label: 'OAuth Client ID', type: 'text', placeholder: 'xxxxxxxx.apps.googleusercontent.com' },
      { key: 'client_secret', label: 'OAuth Client Secret', type: 'password', placeholder: '••••••••••••••••' },
    ],
  },
];

const statusConfig = {
  connected:    { label: 'Connected',    bg: 'bg-green-50',  text: 'text-green-700',  icon: <CheckCircle size={13} className="text-green-600" /> },
  disconnected: { label: 'Not Connected', bg: 'bg-slate-100', text: 'text-slate-600', icon: <AlertCircle size={13} className="text-slate-400" /> },
  error:        { label: 'Error',         bg: 'bg-red-50',    text: 'text-red-700',   icon: <AlertCircle size={13} className="text-red-500" /> },
};

export default function SiteAdminIntegrationsPage() {
  const { siteName } = useRole();
  const [activeDrawer, setActiveDrawer] = useState<Integration | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const openDrawer = (integration: Integration) => {
    setActiveDrawer(integration);
    setFormValues({});
    setTestResult(null);
  };

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult('success');
    }, 1800);
  };

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">Integrations</h1>
          <p className="text-[12px] text-text-muted mt-0.5">{siteName} · Connect third-party services to enhance visitor management</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map(integration => {
            const sc = statusConfig[integration.status];
            return (
              <div key={integration.id} className="bg-white rounded-xl border border-border shadow-card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-2xl shrink-0">
                      {integration.icon}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-text-primary leading-tight">{integration.name}</p>
                      <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-text-secondary leading-relaxed flex-1">{integration.description}</p>
                <button
                  onClick={() => openDrawer(integration)}
                  className="flex items-center justify-center gap-1.5 w-full px-4 py-2 text-[12px] font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-all"
                >
                  <Settings size={13} />
                  Configure
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configure Drawer */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setActiveDrawer(null)} />
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeDrawer.icon}</span>
                <div>
                  <h2 className="text-[15px] font-bold text-text-primary">{activeDrawer.name}</h2>
                  <p className="text-[11px] text-text-muted">{siteName}</p>
                </div>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <p className="text-[12px] text-text-secondary leading-relaxed">{activeDrawer.description}</p>
              <div className="space-y-3">
                {activeDrawer.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      value={formValues[field.key] || ''}
                      onChange={e => setFormValues(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    />
                  </div>
                ))}
              </div>

              {testResult === 'success' && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle size={14} className="text-green-600 shrink-0" />
                  <span className="text-[12px] text-green-700 font-medium">Connection successful!</span>
                </div>
              )}
              {testResult === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={14} className="text-red-600 shrink-0" />
                  <span className="text-[12px] text-red-700 font-medium">Connection failed. Check your credentials.</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-surface">
              <button
                onClick={handleTest}
                disabled={testing}
                className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-white disabled:opacity-60 transition-all"
              >
                {testing ? <Loader size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                {testing ? 'Testing…' : 'Test Connection'}
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveDrawer(null)} className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-white transition-all">Cancel</button>
                <button className="px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteAdminLayout>
  );
}
