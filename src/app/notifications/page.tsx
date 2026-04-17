'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Bell, Send, Eye, HelpCircle, CheckCircle, RefreshCw, Mail, MessageSquare, Smartphone, X, Bold, Italic, Link, AlignLeft,  } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationTab {
  id: string;
  label: string;
  description: string;
}

interface TemplateChannel {
  id: 'email' | 'whatsapp' | 'sms';
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TABS: NotificationTab[] = [
  { id: 'invite', label: 'Invite Sent', description: 'Sent when a visitor is invited by a host' },
  { id: 'precheckin', label: 'Pre-Check-in Complete', description: 'Sent when visitor completes pre-check-in form' },
  { id: 'approval', label: 'Host Approval Request', description: 'Sent to host when visitor arrives and needs approval' },
  { id: 'emergency', label: 'Emergency Broadcast', description: 'Sent to all on-site visitors during emergencies' },
];

const VARIABLES = [
  { label: '{{visitor_name}}', desc: 'Full name of the visitor' },
  { label: '{{host_name}}', desc: 'Name of the host employee' },
  { label: '{{visit_date}}', desc: 'Scheduled visit date' },
  { label: '{{visit_time}}', desc: 'Scheduled visit time' },
  { label: '{{site_name}}', desc: 'Name of the site/location' },
  { label: '{{gate_name}}', desc: 'Assigned gate for entry' },
  { label: '{{company_name}}', desc: 'Your company name' },
  { label: '{{checkin_link}}', desc: 'Pre-check-in URL link' },
  { label: '{{otp_code}}', desc: 'One-time password for entry' },
  { label: '{{qr_code}}', desc: 'QR code for gate access' },
];

const DEFAULT_TEMPLATES: Record<string, string> = {
  invite: `Dear {{visitor_name}},

You have been invited to visit {{company_name}} at {{site_name}}.

📅 Date: {{visit_date}}
🕐 Time: {{visit_time}}
🚪 Gate: {{gate_name}}
👤 Host: {{host_name}}

Please complete your pre-check-in before your visit:
{{checkin_link}}

Your entry OTP: {{otp_code}}

We look forward to welcoming you.

Best regards,
{{company_name}} Security Team`,

  precheckin: `Hi {{visitor_name}},

Your pre-check-in for {{company_name}} is complete! ✅

📅 Visit: {{visit_date}} at {{visit_time}}
📍 Location: {{site_name}} — {{gate_name}}

Please show this QR code at the gate:
{{qr_code}}

See you soon!`,

  approval: `Hi {{host_name}},

Your visitor {{visitor_name}} has arrived at {{gate_name}} and is waiting for your approval.

Please approve or deny their entry within 5 minutes.

[Approve Entry] [Deny Entry]

— VMSPro Security`,

  emergency: `⚠️ EMERGENCY ALERT — {{company_name}}

This is an urgent message for all visitors currently on-site at {{site_name}}.

Please follow the instructions of security personnel immediately and proceed to the nearest emergency exit.

Stay calm and await further instructions.

— {{company_name}} Emergency Response Team`,
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('invite');
  const [templates, setTemplates] = useState<Record<string, string>>(DEFAULT_TEMPLATES);
  const [subject, setSubject] = useState('Your Visit Invitation — {{company_name}}');
  const [channels, setChannels] = useState<TemplateChannel[]>([
    { id: 'email', label: 'Email', icon: <Mail size={14} />, enabled: true },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={14} />, enabled: true },
    { id: 'sms', label: 'SMS', icon: <Smartphone size={14} />, enabled: false },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);

  const currentTemplate = templates[activeTab] || '';

  const handleTemplateChange = (value: string) => {
    setTemplates(prev => ({ ...prev, [activeTab]: value }));
    setAutoSaved(false);
    setTimeout(() => setAutoSaved(true), 800);
    setTimeout(() => setAutoSaved(false), 3800);
  };

  const insertVariable = (variable: string) => {
    setTemplates(prev => ({ ...prev, [activeTab]: prev[activeTab] + variable }));
  };

  const toggleChannel = (id: string) => {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const handleSendTest = () => {
    setSendingTest(true);
    setTimeout(() => {
      setSendingTest(false);
      setTestSent(true);
      setShowTestModal(false);
      setTimeout(() => setTestSent(false), 3000);
    }, 1500);
  };

  const previewContent = currentTemplate
    .replace(/{{visitor_name}}/g, 'Meera Pillai')
    .replace(/{{host_name}}/g, 'Rahul Agarwal')
    .replace(/{{visit_date}}/g, '18 Apr 2026')
    .replace(/{{visit_time}}/g, '10:00 AM')
    .replace(/{{site_name}}/g, 'HQ Mumbai')
    .replace(/{{gate_name}}/g, 'Main Reception Gate')
    .replace(/{{company_name}}/g, 'Acme Corp')
    .replace(/{{checkin_link}}/g, 'https://checkin.acme.com/v/abc123')
    .replace(/{{otp_code}}/g, '847291')
    .replace(/{{qr_code}}/g, '[QR Code Image]');

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[20px] font-bold text-text-primary">Notification Templates</h1>
              <button className="w-5 h-5 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-primary-50 transition-colors group relative">
                <HelpCircle size={12} className="text-text-muted" />
                <div className="absolute left-6 top-0 z-20 hidden group-hover:block w-56 p-2.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl">
                  Customize notification messages sent to visitors and hosts at each stage of the visit.
                </div>
              </button>
            </div>
            <p className="text-[13px] text-text-muted mt-0.5">Customize messages sent to visitors and hosts. Use variables to personalize content.</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {autoSaved && (
              <span className="flex items-center gap-1.5 text-[11px] text-success font-medium">
                <CheckCircle size={13} /> Auto-saved
              </span>
            )}
            {testSent && (
              <span className="flex items-center gap-1.5 text-[11px] text-success font-medium">
                <CheckCircle size={13} /> Test sent!
              </span>
            )}
            <button
              onClick={() => setShowTestModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-primary-700 border border-primary-200 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Send size={14} />
              Send Test
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold rounded-lg border transition-colors ${showPreview ? 'bg-primary-600 text-white border-primary-600' : 'text-text-secondary border-border hover:bg-surface'}`}
            >
              <Eye size={14} />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max px-4 py-2 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-primary-700 shadow-sm border border-border'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Description */}
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
          <Bell size={13} className="text-blue-600 shrink-0" />
          <p className="text-[12px] text-blue-700">{TABS.find(t => t.id === activeTab)?.description}</p>
        </div>

        <div className={`grid gap-5 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor Panel */}
          <div className="space-y-4">
            {/* Channels */}
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-3">Send Via</p>
              <div className="flex items-center gap-2.5">
                {channels.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${
                      ch.enabled
                        ? 'bg-primary-600 text-white border-primary-600' :'bg-white text-text-muted border-border hover:border-primary-300'
                    }`}
                  >
                    {ch.icon}
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject (email only) */}
            {channels.find(c => c.id === 'email')?.enabled && (
              <div className="bg-white rounded-xl border border-border p-4">
                <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Email Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
                />
              </div>
            )}

            {/* Editor */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-surface">
                {[
                  { icon: <Bold size={13} />, title: 'Bold' },
                  { icon: <Italic size={13} />, title: 'Italic' },
                  { icon: <Link size={13} />, title: 'Link' },
                  { icon: <AlignLeft size={13} />, title: 'Align' },
                ].map(tool => (
                  <button
                    key={tool.title}
                    title={tool.title}
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-white hover:border hover:border-border text-text-secondary transition-all"
                  >
                    {tool.icon}
                  </button>
                ))}
                <div className="h-4 w-px bg-border mx-1" />
                <span className="text-[11px] text-text-muted">Plain text mode</span>
              </div>
              <textarea
                value={currentTemplate}
                onChange={e => handleTemplateChange(e.target.value)}
                rows={16}
                className="w-full px-4 py-3 text-[13px] text-text-primary font-mono resize-none focus:outline-none bg-white leading-relaxed"
                placeholder="Enter your notification template..."
              />
            </div>

            {/* Variables Panel */}
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-3">Available Variables</p>
              <div className="grid grid-cols-2 gap-1.5">
                {VARIABLES.map(v => (
                  <button
                    key={v.label}
                    onClick={() => insertVariable(v.label)}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-primary-50 border border-transparent hover:border-primary-100 transition-all text-left group"
                    title={`Insert ${v.label}`}
                  >
                    <code className="text-[11px] font-mono text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded shrink-0 group-hover:bg-primary-100">{v.label}</code>
                    <span className="text-[10px] text-text-muted leading-tight">{v.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between">
                  <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider">Live Preview</p>
                  <span className="text-[11px] text-text-muted">Sample data applied</span>
                </div>
                {/* Email Preview */}
                <div className="p-5">
                  <div className="border border-border rounded-xl overflow-hidden">
                    {/* Email Header */}
                    <div className="px-4 py-3 bg-primary-600 text-white">
                      <p className="text-[13px] font-bold">Acme Corp</p>
                      <p className="text-[11px] text-white/70">noreply@acmecorp.com</p>
                    </div>
                    {channels.find(c => c.id === 'email')?.enabled && (
                      <div className="px-4 py-2 bg-surface border-b border-border">
                        <p className="text-[11px] text-text-muted">Subject:</p>
                        <p className="text-[12px] font-semibold text-text-primary">
                          {subject.replace(/{{company_name}}/g, 'Acme Corp')}
                        </p>
                      </div>
                    )}
                    <div className="px-4 py-4">
                      <pre className="text-[12px] text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
                        {previewContent}
                      </pre>
                    </div>
                    <div className="px-4 py-3 bg-surface border-t border-border">
                      <p className="text-[10px] text-text-muted">© 2026 Acme Corp · Unsubscribe · Privacy Policy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Preview */}
              {channels.find(c => c.id === 'whatsapp')?.enabled && (
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="px-4 py-3 border-b border-border bg-surface">
                    <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider">WhatsApp Preview</p>
                  </div>
                  <div className="p-5">
                    <div className="max-w-xs mx-auto">
                      <div className="bg-[#DCF8C6] rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-sm">
                        <pre className="text-[12px] text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                          {previewContent.substring(0, 200)}{previewContent.length > 200 ? '...' : ''}
                        </pre>
                        <p className="text-[10px] text-gray-500 text-right mt-1">10:32 AM ✓✓</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Send Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold text-text-primary">Send Test Notification</h2>
              <button onClick={() => setShowTestModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface">
                <X size={16} className="text-text-muted" />
              </button>
            </div>
            <p className="text-[12px] text-text-muted mb-4">Send a test of the &quot;{TABS.find(t => t.id === activeTab)?.label}&quot; template with sample data.</p>
            <div className="mb-4">
              <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">Test Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={() => setShowTestModal(false)} className="flex-1 px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface">
                Cancel
              </button>
              <button
                onClick={handleSendTest}
                disabled={sendingTest || !testEmail}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 disabled:opacity-60"
              >
                {sendingTest ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                {sendingTest ? 'Sending...' : 'Send Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
