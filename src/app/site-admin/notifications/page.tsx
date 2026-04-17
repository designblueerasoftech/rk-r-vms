'use client';

import React, { useState } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Send, Bold, Italic, Link, List, Eye, Code } from 'lucide-react';

type TabId = 'invite-sent' | 'pre-checkin' | 'host-approval' | 'emergency';

interface NotificationTab {
  id: TabId;
  label: string;
  subject: string;
  body: string;
}

const defaultTabs: NotificationTab[] = [
  {
    id: 'invite-sent',
    label: 'Invite Sent',
    subject: 'Your visit to {{site_name}} is confirmed',
    body: `Hi {{visitor_name}},

You have been invited to visit {{site_name}} on {{visit_date}} at {{visit_time}}.

Your host: {{host_name}}
Purpose: {{visit_purpose}}

Please complete your pre-check-in at the link below before your visit:
{{checkin_link}}

If you have any questions, contact {{host_email}}.

Regards,
{{site_name}} Security Team`,
  },
  {
    id: 'pre-checkin',
    label: 'Pre-Check-in Complete',
    subject: 'Pre-check-in complete – {{visitor_name}} is on their way',
    body: `Hi {{host_name}},

{{visitor_name}} has completed their pre-check-in for their visit to {{site_name}} on {{visit_date}}.

Visitor Type: {{visitor_type}}
Expected Arrival: {{visit_time}}
Gate: {{gate_name}}

You will be notified again when they arrive at the gate.

Regards,
{{site_name}} Security Team`,
  },
  {
    id: 'host-approval',
    label: 'Host Approval Request',
    subject: 'Action required: Approve visitor {{visitor_name}}',
    body: `Hi {{host_name}},

{{visitor_name}} is at {{gate_name}} and requires your approval to enter {{site_name}}.

Visitor Type: {{visitor_type}}
Arrived At: {{arrival_time}}
Purpose: {{visit_purpose}}

Please approve or deny their entry:
✅ Approve: {{approve_link}}
❌ Deny: {{deny_link}}

This request will expire in 10 minutes.

Regards,
{{site_name}} Security Team`,
  },
  {
    id: 'emergency',
    label: 'Emergency Broadcast',
    subject: '🚨 EMERGENCY ALERT – {{site_name}}',
    body: `URGENT NOTICE TO ALL VISITORS AND STAFF AT {{site_name}}:

{{emergency_message}}

Please follow the instructions of security personnel immediately.

Emergency Contact: {{emergency_contact}}
Time: {{alert_time}}

This is an automated emergency broadcast from {{site_name}} Security.`,
  },
];

const variables = [
  '{{visitor_name}}', '{{host_name}}', '{{site_name}}', '{{visit_date}}',
  '{{visit_time}}', '{{visit_purpose}}', '{{visitor_type}}', '{{gate_name}}',
  '{{checkin_link}}', '{{approve_link}}', '{{deny_link}}', '{{host_email}}',
  '{{arrival_time}}', '{{alert_time}}', '{{emergency_message}}', '{{emergency_contact}}',
];

export default function SiteAdminNotificationsPage() {
  const { siteName } = useRole();
  const [tabs, setTabs] = useState<NotificationTab[]>(defaultTabs);
  const [activeTab, setActiveTab] = useState<TabId>('invite-sent');
  const [showPreview, setShowPreview] = useState(false);
  const [sendTestSent, setSendTestSent] = useState(false);

  const current = tabs.find(t => t.id === activeTab)!;

  const updateCurrent = (field: 'subject' | 'body', value: string) => {
    setTabs(prev => prev.map(t => t.id === activeTab ? { ...t, [field]: value } : t));
  };

  const insertVariable = (v: string) => {
    updateCurrent('body', current.body + v);
  };

  const handleSendTest = () => {
    setSendTestSent(true);
    setTimeout(() => setSendTestSent(false), 3000);
  };

  const renderPreview = (text: string) => {
    return text
      .replace(/{{visitor_name}}/g, 'Arjun Mehta')
      .replace(/{{host_name}}/g, 'Priya Mehta')
      .replace(/{{site_name}}/g, siteName)
      .replace(/{{visit_date}}/g, '10 Apr 2026')
      .replace(/{{visit_time}}/g, '10:00 AM')
      .replace(/{{visit_purpose}}/g, 'Business Meeting')
      .replace(/{{visitor_type}}/g, 'Contractor')
      .replace(/{{gate_name}}/g, 'Gate 1')
      .replace(/{{checkin_link}}/g, 'https://vmspro.app/checkin/abc123')
      .replace(/{{approve_link}}/g, 'https://vmspro.app/approve/abc123')
      .replace(/{{deny_link}}/g, 'https://vmspro.app/deny/abc123')
      .replace(/{{host_email}}/g, 'priya.mehta@company.com')
      .replace(/{{arrival_time}}/g, '09:58 AM')
      .replace(/{{alert_time}}/g, '10:15 AM')
      .replace(/{{emergency_message}}/g, 'Please evacuate the building immediately via the nearest exit.')
      .replace(/{{emergency_contact}}/g, '+91 98765 43210');
  };

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Notification Templates</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · Manage visitor notification messages</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg border transition-all ${showPreview ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-border text-text-secondary hover:bg-surface'}`}
            >
              <Eye size={13} />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={handleSendTest}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all"
            >
              <Send size={13} />
              {sendTestSent ? 'Sent!' : 'Send Test'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 w-fit flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-[12px] font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-primary-700 shadow-sm border border-border' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={`grid gap-5 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor */}
          <div className="space-y-4">
            {/* Subject */}
            <div className="bg-white rounded-xl border border-border shadow-card p-4 space-y-3">
              <label className="block text-[12px] font-semibold text-text-secondary">Subject Line</label>
              <input
                value={current.subject}
                onChange={e => updateCurrent('subject', e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              />
            </div>

            {/* Body Editor */}
            <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-4 py-2.5 border-b border-border bg-surface">
                {[
                  { icon: <Bold size={13} />, title: 'Bold' },
                  { icon: <Italic size={13} />, title: 'Italic' },
                  { icon: <Link size={13} />, title: 'Link' },
                  { icon: <List size={13} />, title: 'List' },
                  { icon: <Code size={13} />, title: 'Code' },
                ].map(btn => (
                  <button
                    key={btn.title}
                    title={btn.title}
                    className="w-7 h-7 flex items-center justify-center rounded text-text-secondary hover:bg-white hover:text-text-primary transition-all border border-transparent hover:border-border"
                  >
                    {btn.icon}
                  </button>
                ))}
                <div className="ml-auto text-[11px] text-text-muted">{current.body.length} chars</div>
              </div>
              <textarea
                value={current.body}
                onChange={e => updateCurrent('body', e.target.value)}
                rows={14}
                className="w-full px-4 py-3 text-[13px] text-text-primary font-mono leading-relaxed resize-none focus:outline-none"
                placeholder="Write your notification message here..."
              />
            </div>

            {/* Variables Panel */}
            <div className="bg-white rounded-xl border border-border shadow-card p-4">
              <p className="text-[12px] font-semibold text-text-secondary mb-3">Available Variables — click to insert</p>
              <div className="flex flex-wrap gap-2">
                {variables.map(v => (
                  <button
                    key={v}
                    onClick={() => insertVariable(v)}
                    className="text-[11px] px-2 py-1 rounded-md bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 font-mono transition-all"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end">
              <button className="px-5 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
                Save Template
              </button>
            </div>
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
                <Eye size={13} className="text-text-muted" />
                <span className="text-[12px] font-semibold text-text-secondary">Live Preview</span>
                <span className="ml-auto text-[10px] text-text-muted">Sample data substituted</span>
              </div>
              <div className="p-5 space-y-4">
                {/* Email-like preview */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="px-4 py-3 bg-surface border-b border-border">
                    <p className="text-[11px] text-text-muted">Subject</p>
                    <p className="text-[13px] font-semibold text-text-primary mt-0.5">{renderPreview(current.subject)}</p>
                  </div>
                  <div className="px-4 py-4">
                    <pre className="text-[12px] text-text-secondary leading-relaxed whitespace-pre-wrap font-sans">
                      {renderPreview(current.body)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteAdminLayout>
  );
}
