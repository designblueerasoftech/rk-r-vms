'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Shield, FileText, Trash2, Download, HelpCircle, CheckCircle, AlertCircle, Clock, Search, Calendar, User, Filter, Award,  } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ComplianceTab = 'consent' | 'purge' | 'audit' | 'certificate';

interface ConsentRecord {
  id: string;
  visitorName: string;
  visitorType: string;
  site: string;
  consentDate: string;
  consentType: string;
  status: 'Granted' | 'Denied' | 'Expired';
  dataRetained: string;
}

interface PurgePolicy {
  id: string;
  dataType: string;
  description: string;
  retentionDays: number;
  lastPurge: string;
  nextPurge: string;
  recordsEligible: number;
  status: 'Active' | 'Paused';
}

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  details: string;
  severity: 'Info' | 'Warning' | 'Critical';
  ip: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CONSENT_RECORDS: ConsentRecord[] = [
  { id: 'CON-001', visitorName: 'Meera Pillai', visitorType: 'VIP', site: 'HQ Mumbai', consentDate: '14 Apr 2026', consentType: 'Data Collection & Photography', status: 'Granted', dataRetained: '90 days' },
  { id: 'CON-002', visitorName: 'Kiran Mehta', visitorType: 'Interviewee', site: 'HQ Mumbai', consentDate: '14 Apr 2026', consentType: 'Data Collection', status: 'Granted', dataRetained: '30 days' },
  { id: 'CON-003', visitorName: 'Sunita Rao', visitorType: 'Vendor', site: 'Pune Factory', consentDate: '13 Apr 2026', consentType: 'Data Collection & NDA', status: 'Granted', dataRetained: '180 days' },
  { id: 'CON-004', visitorName: 'Amit Verma', visitorType: 'Contractor', site: 'HQ Mumbai', consentDate: '12 Apr 2026', consentType: 'Data Collection', status: 'Granted', dataRetained: '180 days' },
  { id: 'CON-005', visitorName: 'Vikram Nair', visitorType: 'Govt Official', site: 'HQ Mumbai', consentDate: '10 Apr 2026', consentType: 'Data Collection', status: 'Denied', dataRetained: '—' },
  { id: 'CON-006', visitorName: 'Priya Nair', visitorType: 'Contractor', site: 'Delhi Office', consentDate: '01 Jan 2026', consentType: 'Data Collection & Photography', status: 'Expired', dataRetained: 'Purged' },
];

const PURGE_POLICIES: PurgePolicy[] = [
  { id: 'PP-001', dataType: 'Visitor Photos', description: 'Profile photos captured at kiosk during check-in', retentionDays: 30, lastPurge: '01 Apr 2026', nextPurge: '01 May 2026', recordsEligible: 142, status: 'Active' },
  { id: 'PP-002', dataType: 'ID Scan Data', description: 'Government ID scan data collected at entry', retentionDays: 90, lastPurge: '15 Mar 2026', nextPurge: '15 Jun 2026', recordsEligible: 38, status: 'Active' },
  { id: 'PP-003', dataType: 'Visitor Logs', description: 'Full visit records including check-in/out times', retentionDays: 365, lastPurge: '01 Jan 2026', nextPurge: '01 Jan 2027', recordsEligible: 0, status: 'Active' },
  { id: 'PP-004', dataType: 'Health Declarations', description: 'Health screening responses from visitors', retentionDays: 60, lastPurge: '15 Feb 2026', nextPurge: '15 Apr 2026', recordsEligible: 89, status: 'Paused' },
  { id: 'PP-005', dataType: 'Induction Records', description: 'Induction completion and acknowledgement records', retentionDays: 180, lastPurge: '01 Mar 2026', nextPurge: '01 Sep 2026', recordsEligible: 12, status: 'Active' },
];

const AUDIT_TRAIL: AuditEntry[] = [
  { id: 'AUD-001', timestamp: '17 Apr 2026, 09:42 AM', actor: 'Reeja Pillai', action: 'Blacklist Entry Added', resource: 'Blacklist / Ramesh Tiwari', details: 'Added to internal blacklist — trespassing incident', severity: 'Warning', ip: '192.168.1.45' },
  { id: 'AUD-002', timestamp: '17 Apr 2026, 09:15 AM', actor: 'System', action: 'Visitor Auto-Checked-Out', resource: 'Visitor Log / Meera Pillai', details: 'Auto checkout triggered after 8-hour limit', severity: 'Info', ip: '—' },
  { id: 'AUD-003', timestamp: '16 Apr 2026, 06:30 PM', actor: 'Anand Sharma', action: 'Workflow Modified', resource: 'Workflow / Contractor Check-In', details: 'Added ID scan step to contractor workflow', severity: 'Info', ip: '10.0.0.22' },
  { id: 'AUD-004', timestamp: '16 Apr 2026, 03:12 PM', actor: 'Reeja Pillai', action: 'User Role Changed', resource: 'Users / Deepa Krishnan', details: 'Role changed from Receptionist to Site Admin', severity: 'Warning', ip: '192.168.1.45' },
  { id: 'AUD-005', timestamp: '15 Apr 2026, 11:55 AM', actor: 'System', action: 'PII Purge Executed', resource: 'Purge / Visitor Photos', details: '142 visitor photos purged per retention policy', severity: 'Info', ip: '—' },
  { id: 'AUD-006', timestamp: '15 Apr 2026, 09:00 AM', actor: 'Priya Mehta', action: 'Kiosk Unlinked', resource: 'Kiosks / Warehouse Entry', details: 'Kiosk unlinked from Warehouse Block B gate', severity: 'Warning', ip: '10.0.0.31' },
  { id: 'AUD-007', timestamp: '14 Apr 2026, 04:22 PM', actor: 'Reeja Pillai', action: 'API Key Generated', resource: 'Settings / API Keys', details: 'New API key generated for integration use', severity: 'Critical', ip: '192.168.1.45' },
  { id: 'AUD-008', timestamp: '14 Apr 2026, 02:10 PM', actor: 'System', action: 'Failed Login Attempt', resource: 'Auth / admin@acme.com', details: '3 consecutive failed login attempts detected', severity: 'Critical', ip: '203.0.113.42' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ConsentStatusBadge({ status }: { status: ConsentRecord['status'] }) {
  const cfg = {
    Granted: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    Denied: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    Expired: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: AuditEntry['severity'] }) {
  const cfg = {
    Info: { bg: 'bg-blue-50', text: 'text-blue-700' },
    Warning: { bg: 'bg-amber-50', text: 'text-amber-700' },
    Critical: { bg: 'bg-red-50', text: 'text-red-700' },
  }[severity];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      {severity}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<ComplianceTab>('consent');
  const [search, setSearch] = useState('');
  const [purgeData, setPurgeData] = useState<PurgePolicy[]>(PURGE_POLICIES);
  const [editingPurge, setEditingPurge] = useState<string | null>(null);
  const [editDays, setEditDays] = useState<number>(30);

  const tabs: { id: ComplianceTab; label: string; icon: React.ReactNode }[] = [
    { id: 'consent', label: 'Consent Log', icon: <Shield size={14} /> },
    { id: 'purge', label: 'PII Purge Scheduler', icon: <Trash2 size={14} /> },
    { id: 'audit', label: 'Audit Trail', icon: <FileText size={14} /> },
    { id: 'certificate', label: 'DPDP Certificate', icon: <Award size={14} /> },
  ];

  const filteredConsent = CONSENT_RECORDS.filter(r =>
    r.visitorName.toLowerCase().includes(search.toLowerCase()) ||
    r.site.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAudit = AUDIT_TRAIL.filter(a =>
    a.actor.toLowerCase().includes(search.toLowerCase()) ||
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    a.resource.toLowerCase().includes(search.toLowerCase())
  );

  const handleSavePurge = (id: string) => {
    setPurgeData(prev => prev.map(p => p.id === id ? { ...p, retentionDays: editDays } : p));
    setEditingPurge(null);
  };

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[20px] font-bold text-text-primary">Compliance &amp; Audit</h1>
              <button className="w-5 h-5 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-primary-50 transition-colors group relative">
                <HelpCircle size={12} className="text-text-muted" />
                <div className="absolute left-6 top-0 z-20 hidden group-hover:block w-56 p-2.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl">
                  Manage data privacy compliance, consent records, PII purge schedules, and audit trails.
                </div>
              </button>
            </div>
            <p className="text-[13px] text-text-muted mt-0.5">Manage consent logs, PII purge schedules, audit trails, and DPDP compliance certificates.</p>
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors">
            <Download size={14} />
            Export Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Consents', value: CONSENT_RECORDS.length, icon: <Shield size={16} />, color: 'text-primary-600', bg: 'bg-primary-50' },
            { label: 'Granted', value: CONSENT_RECORDS.filter(r => r.status === 'Granted').length, icon: <CheckCircle size={16} />, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Purge Policies', value: PURGE_POLICIES.length, icon: <Trash2 size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Audit Events (Today)', value: AUDIT_TRAIL.filter(a => a.timestamp.includes('17 Apr')).length, icon: <FileText size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
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

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch(''); }}
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

        {/* Search (for consent + audit) */}
        {(activeTab === 'consent' || activeTab === 'audit') && (
          <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder={activeTab === 'consent' ? 'Search by visitor name or site...' : 'Search audit events...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors">
              <Filter size={13} />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors">
              <Download size={13} />
              Export
            </button>
          </div>
        )}

        {/* ── Consent Log ── */}
        {activeTab === 'consent' && (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Visitor', 'Type', 'Site', 'Consent Date', 'Consent Type', 'Status', 'Data Retained'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredConsent.map(r => (
                    <tr key={r.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                            <User size={13} className="text-primary-600" />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-text-primary">{r.visitorName}</p>
                            <p className="text-[11px] text-text-muted">{r.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary">{r.visitorType}</td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary">{r.site}</td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary">{r.consentDate}</td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary">{r.consentType}</td>
                      <td className="px-4 py-3"><ConsentStatusBadge status={r.status} /></td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary">{r.dataRetained}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border">
              <p className="text-[12px] text-text-muted">Showing {filteredConsent.length} of {CONSENT_RECORDS.length} consent records</p>
            </div>
          </div>
        )}

        {/* ── PII Purge Scheduler ── */}
        {activeTab === 'purge' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle size={14} className="text-amber-600 shrink-0" />
              <p className="text-[12px] text-amber-700">Purge policies run automatically at midnight UTC. Manual purge can be triggered per policy.</p>
            </div>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['Data Type', 'Description', 'Retention (Days)', 'Last Purge', 'Next Purge', 'Eligible Records', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap border-b border-border">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {purgeData.map(p => (
                      <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-[13px] font-semibold text-text-primary">{p.dataType}</p>
                          <p className="text-[11px] text-text-muted">{p.id}</p>
                        </td>
                        <td className="px-4 py-3 max-w-[180px]">
                          <p className="text-[12px] text-text-secondary truncate">{p.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          {editingPurge === p.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editDays}
                                onChange={e => setEditDays(Number(e.target.value))}
                                className="w-16 px-2 py-1 text-[12px] border border-primary-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-200"
                              />
                              <button onClick={() => handleSavePurge(p.id)} className="text-[11px] text-primary-700 font-semibold hover:underline">Save</button>
                              <button onClick={() => setEditingPurge(null)} className="text-[11px] text-text-muted hover:underline">Cancel</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-semibold text-text-primary">{p.retentionDays}</span>
                              <button
                                onClick={() => { setEditingPurge(p.id); setEditDays(p.retentionDays); }}
                                className="text-[11px] text-primary-600 hover:underline"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-text-secondary">{p.lastPurge}</td>
                        <td className="px-4 py-3 text-[12px] text-text-secondary">{p.nextPurge}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[13px] font-bold ${p.recordsEligible > 0 ? 'text-amber-600' : 'text-text-muted'}`}>
                            {p.recordsEligible}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            p.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`} />
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            disabled={p.recordsEligible === 0}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={11} />
                            Purge Now
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

        {/* ── Audit Trail ── */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Timestamp', 'Actor', 'Action', 'Resource', 'Details', 'Severity', 'IP Address'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAudit.map(a => (
                    <tr key={a.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
                          <Clock size={11} className="text-text-muted shrink-0" />
                          {a.timestamp}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                            <User size={11} className="text-primary-600" />
                          </div>
                          <span className="text-[12px] font-medium text-text-primary whitespace-nowrap">{a.actor}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] font-semibold text-text-primary whitespace-nowrap">{a.action}</td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary whitespace-nowrap">{a.resource}</td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="text-[12px] text-text-secondary truncate">{a.details}</p>
                      </td>
                      <td className="px-4 py-3"><SeverityBadge severity={a.severity} /></td>
                      <td className="px-4 py-3 text-[12px] font-mono text-text-muted">{a.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border">
              <p className="text-[12px] text-text-muted">Showing {filteredAudit.length} of {AUDIT_TRAIL.length} audit events</p>
            </div>
          </div>
        )}

        {/* ── DPDP Certificate ── */}
        {activeTab === 'certificate' && (
          <div className="space-y-4">
            {/* Certificate Card */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Award size={28} className="text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-text-primary">DPDP Compliance Certificate</h2>
                    <p className="text-[13px] text-text-muted mt-0.5">Digital Personal Data Protection Act, 2023 — India</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">
                        <CheckCircle size={11} />
                        Compliant
                      </span>
                      <span className="text-[12px] text-text-muted">Valid until: 31 Dec 2026</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 transition-all shadow-sm">
                  <Download size={14} />
                  Download Certificate
                </button>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-[13px] font-bold text-text-primary mb-4">Compliance Checklist</h3>
              <div className="space-y-3">
                {[
                  { item: 'Consent collection implemented for all visitor types', status: true },
                  { item: 'Data retention policies configured and active', status: true },
                  { item: 'PII purge scheduler enabled', status: true },
                  { item: 'Audit trail logging active', status: true },
                  { item: 'Data Processing Agreement (DPA) signed', status: true },
                  { item: 'Privacy notice displayed at kiosk', status: true },
                  { item: 'Data Fiduciary registration completed', status: false },
                  { item: 'Grievance officer designated', status: false },
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
                    {check.status
                      ? <CheckCircle size={16} className="text-green-600 shrink-0" />
                      : <AlertCircle size={16} className="text-amber-500 shrink-0" />
                    }
                    <span className={`text-[13px] ${check.status ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {check.item}
                    </span>
                    {!check.status && (
                      <span className="ml-auto text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Action Required</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate History */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-[13px] font-bold text-text-primary mb-4">Certificate History</h3>
              <div className="space-y-2">
                {[
                  { period: 'Jan 2026 – Dec 2026', issued: '01 Jan 2026', status: 'Current' },
                  { period: 'Jan 2025 – Dec 2025', issued: '01 Jan 2025', status: 'Expired' },
                  { period: 'Jan 2024 – Dec 2024', issued: '01 Jan 2024', status: 'Expired' },
                ].map((cert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar size={14} className="text-text-muted" />
                      <div>
                        <p className="text-[13px] font-semibold text-text-primary">{cert.period}</p>
                        <p className="text-[11px] text-text-muted">Issued: {cert.issued}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        cert.status === 'Current' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cert.status}
                      </span>
                      <button className="flex items-center gap-1 text-[12px] text-primary-600 hover:underline">
                        <Download size={12} />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
