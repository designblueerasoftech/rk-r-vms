'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ShieldAlert, Plus, Search, Edit2, Trash2, Eye, Download, X, ChevronDown, AlertTriangle, Shield, Clock, Phone, CheckSquare, Square, Info, RefreshCw, GripVertical, ArrowRight, Zap, Settings, Calendar } from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type EntryStatus = 'Blocked' | 'Watch';

interface BlacklistEntry {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  mobile: string;
  reason: string;
  addedBy: string;
  addedDate: string;
  expiry: string;
  status: EntryStatus;
  source?: string;
}

interface WatchlistRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  status: boolean;
  lastModified: string;
}

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
const internalBlacklist: BlacklistEntry[] = [
  { id: 'bl-001', name: 'Ramesh Tiwari', initials: 'RT', avatarColor: 'bg-red-500', mobile: '+91 99999 00001', reason: 'Previous trespassing incident at HQ', addedBy: 'Reeja Patel', addedDate: '15 Jan 2026', expiry: 'Never', status: 'Blocked' },
  { id: 'bl-002', name: 'Suresh Babu', initials: 'SB', avatarColor: 'bg-orange-500', mobile: '+91 88888 00002', reason: 'Fraudulent contractor credentials presented', addedBy: 'Anand Sharma', addedDate: '22 Feb 2026', expiry: '22 Aug 2026', status: 'Blocked' },
  { id: 'bl-003', name: 'Kavita Desai', initials: 'KD', avatarColor: 'bg-amber-500', mobile: '+91 77777 00003', reason: 'Unauthorized access attempt — server room', addedBy: 'Reeja Patel', addedDate: '05 Mar 2026', expiry: 'Never', status: 'Blocked' },
  { id: 'bl-004', name: 'Mohan Lal', initials: 'ML', avatarColor: 'bg-purple-500', mobile: '+91 66666 00004', reason: 'Aggressive behaviour towards staff', addedBy: 'Priya Mehta', addedDate: '10 Mar 2026', expiry: '10 Sep 2026', status: 'Watch' },
  { id: 'bl-005', name: 'Priya Shankar', initials: 'PS', avatarColor: 'bg-pink-500', mobile: '+91 55555 00005', reason: 'Suspected industrial espionage', addedBy: 'Anand Sharma', addedDate: '01 Apr 2026', expiry: 'Never', status: 'Blocked' },
  { id: 'bl-006', name: 'Arun Mishra', initials: 'AM', avatarColor: 'bg-teal-500', mobile: '+91 44444 00006', reason: 'Repeated policy violations during visits', addedBy: 'Reeja Patel', addedDate: '08 Apr 2026', expiry: '08 Jul 2026', status: 'Watch' },
];

const thirdPartyWatchlist: BlacklistEntry[] = [
  { id: 'tp-001', name: 'Vikram Nair', initials: 'VN', avatarColor: 'bg-red-600', mobile: '+91 33333 00007', reason: 'Listed on national security watchlist', addedBy: 'System (NCRB Feed)', addedDate: '01 Jan 2026', expiry: 'Never', status: 'Blocked', source: 'NCRB' },
  { id: 'tp-002', name: 'Deepak Sinha', initials: 'DS', avatarColor: 'bg-orange-600', mobile: '+91 22222 00008', reason: 'Fraud case — financial crimes bureau', addedBy: 'System (RBI Watchlist)', addedDate: '15 Feb 2026', expiry: 'Never', status: 'Blocked', source: 'RBI' },
  { id: 'tp-003', name: 'Sunita Verma', initials: 'SV', avatarColor: 'bg-yellow-600', mobile: '+91 11111 00009', reason: 'Pending investigation — corporate fraud', addedBy: 'System (SEBI Feed)', addedDate: '20 Feb 2026', expiry: '20 Aug 2026', status: 'Watch', source: 'SEBI' },
  { id: 'tp-004', name: 'Rajiv Kapoor', initials: 'RK', avatarColor: 'bg-blue-600', mobile: '+91 00000 00010', reason: 'Blacklisted by industry consortium', addedBy: 'System (NASSCOM)', addedDate: '01 Mar 2026', expiry: 'Never', status: 'Blocked', source: 'NASSCOM' },
  { id: 'tp-005', name: 'Meena Pillai', initials: 'MP', avatarColor: 'bg-indigo-600', mobile: '+91 99990 00011', reason: 'Reported for data theft at previous employer', addedBy: 'System (NASSCOM)', addedDate: '12 Mar 2026', expiry: '12 Sep 2026', status: 'Watch', source: 'NASSCOM' },
  { id: 'tp-006', name: 'Harish Gupta', initials: 'HG', avatarColor: 'bg-violet-600', mobile: '+91 88880 00012', reason: 'Involved in supply chain fraud', addedBy: 'System (CBI Feed)', addedDate: '05 Apr 2026', expiry: 'Never', status: 'Blocked', source: 'CBI' },
];

const watchlistRules: WatchlistRule[] = [
  { id: 'rule-001', name: 'Failed ID Scan Auto-Block', condition: 'IF ID Scan fails 3+ times', action: 'Auto-block + Notify Security', status: true, lastModified: '10 Apr 2026' },
  { id: 'rule-002', name: 'Health Declaration Watchlist', condition: 'IF Health Declaration = No', action: 'Add to Watchlist + Alert Host', status: true, lastModified: '08 Apr 2026' },
  { id: 'rule-003', name: 'Repeat Visitor Flagging', condition: 'IF Same visitor visits > 5x/week', action: 'Add to Watchlist + Review Required', status: false, lastModified: '01 Apr 2026' },
];

/* ─── Status Badge ───────────────────────────────────────────────────────── */
function EntryStatusBadge({ status }: { status: EntryStatus }) {
  if (status === 'Blocked') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Blocked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Watch
    </span>
  );
}

/* ─── Add Entry Modal ────────────────────────────────────────────────────── */
interface AddEntryModalProps {
  onClose: () => void;
  editEntry?: BlacklistEntry | null;
}

function AddEntryModal({ onClose, editEntry }: AddEntryModalProps) {
  const [fullName, setFullName] = useState(editEntry?.name || 'Ramesh Tiwari');
  const [mobile, setMobile] = useState(editEntry?.mobile || '+91 99999 00001');
  const [reason, setReason] = useState(editEntry?.reason ? 'trespassing' : 'trespassing');
  const [otherReason, setOtherReason] = useState('');
  const [notes, setNotes] = useState(editEntry ? 'Incident reported by security team on 15 Jan 2026. CCTV footage archived.' : 'Incident reported by security team on 15 Jan 2026. CCTV footage archived.');
  const [expiry, setExpiry] = useState('');
  const [status, setStatus] = useState<EntryStatus>(editEntry?.status || 'Blocked');

  const reasons = [
    { value: 'trespassing', label: 'Trespassing / Unauthorized Access' },
    { value: 'fraud', label: 'Fraudulent Credentials' },
    { value: 'aggressive', label: 'Aggressive Behaviour' },
    { value: 'espionage', label: 'Suspected Espionage' },
    { value: 'policy', label: 'Repeated Policy Violations' },
    { value: 'other', label: 'Other (specify below)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <ShieldAlert size={16} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-text-primary">{editEntry ? 'Edit Entry' : 'Add to Blacklist'}</h2>
              <p className="text-[11px] text-text-muted">Fill in the details to {editEntry ? 'update this' : 'add a new'} entry</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center transition-colors">
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-semibold text-text-primary mb-1">Full Name <span className="text-danger">*</span></label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Tiwari"
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
            />
          </div>

          {/* Mobile / Email */}
          <div>
            <label className="block text-[12px] font-semibold text-text-primary mb-1">Mobile / Email <span className="text-danger">*</span></label>
            <input
              type="text"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="+91 99999 00001 or email@example.com"
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[12px] font-semibold text-text-primary mb-1">Reason <span className="text-danger">*</span></label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all bg-white"
            >
              {reasons.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Other reason free text */}
          {reason === 'other' && (
            <div>
              <label className="block text-[12px] font-semibold text-text-primary mb-1">Specify Reason <span className="text-danger">*</span></label>
              <input
                type="text"
                value={otherReason}
                onChange={e => setOtherReason(e.target.value)}
                placeholder="Describe the reason..."
                className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-[12px] font-semibold text-text-primary mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Additional context or incident details..."
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted resize-none"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-[12px] font-semibold text-text-primary mb-1">Expiry Date <span className="text-[11px] font-normal text-text-muted">(optional — leave blank for Never)</span></label>
            <input
              type="date"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all bg-white"
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-[12px] font-semibold text-text-primary mb-2">Status</label>
            <div className="flex items-center gap-2 p-1 bg-surface border border-border rounded-lg w-fit">
              <button
                onClick={() => setStatus('Blocked')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150 ${status === 'Blocked' ? 'bg-red-600 text-white shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
              >
                <Shield size={12} /> Blocked
              </button>
              <button
                onClick={() => setStatus('Watch')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150 ${status === 'Watch' ? 'bg-amber-500 text-white shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
              >
                <Eye size={12} /> Watch
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border bg-surface/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
          >
            <Shield size={14} />
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Entry Table ────────────────────────────────────────────────────────── */
interface EntryTableProps {
  entries: BlacklistEntry[];
  showSource?: boolean;
  onAdd: () => void;
}

function EntryTable({ entries, showSource, onAdd }: EntryTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | EntryStatus>('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [editEntry, setEditEntry] = useState<BlacklistEntry | null>(null);

  const filtered = entries.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.mobile.includes(search);
    const matchStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(e => e.id));

  return (
    <>
      {editEntry && <AddEntryModal onClose={() => setEditEntry(null)} editEntry={editEntry} />}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search name or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-surface transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-0.5">
          {(['All', 'Blocked', 'Watch'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all duration-150 ${statusFilter === s ? 'bg-white text-text-primary shadow-sm border border-border' : 'text-text-muted hover:text-text-secondary'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface cursor-pointer transition-all">
          <Calendar size={13} />
          Expiry Range
          <ChevronDown size={11} />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
            <Download size={13} />
            Export CSV
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
          >
            <Plus size={15} />
            Add Entry
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 mb-3 bg-primary-50 border border-primary-200 rounded-lg">
          <span className="text-[13px] font-semibold text-primary-700">{selected.length} selected</span>
          <div className="h-4 w-px bg-primary-200" />
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-danger-text hover:text-danger transition-colors">
            <Trash2 size={13} /> Delete Selected
          </button>
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors">
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => setSelected([])} className="ml-auto text-[12px] text-text-muted hover:text-text-secondary transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <ShieldAlert size={24} className="text-slate-400" />
            </div>
            <p className="text-[15px] font-semibold text-text-primary mb-1">No entries yet</p>
            <p className="text-[13px] text-text-muted mb-4">Add individuals to the blacklist to restrict their access.</p>
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 transition-all shadow-sm"
            >
              <Plus size={14} /> Add Entry
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface/60">
                <th className="w-10 px-4 py-3">
                  <button onClick={toggleAll} className="text-text-muted hover:text-primary-600 transition-colors">
                    {allSelected ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Added By</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Expiry</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                {showSource && <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Source</th>}
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, idx) => (
                <tr
                  key={entry.id}
                  onMouseEnter={() => setHoveredRow(entry.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`border-b border-border last:border-0 transition-colors cursor-pointer ${hoveredRow === entry.id ? 'bg-slate-50' : idx % 2 === 0 ? 'bg-white' : 'bg-white'}`}
                >
                  <td className="px-4 py-3">
                    <button onClick={() => toggleSelect(entry.id)} className="text-text-muted hover:text-primary-600 transition-colors">
                      {selected.includes(entry.id) ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${entry.avatarColor} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                        {entry.initials}
                      </div>
                      <span className="text-[13px] font-semibold text-text-primary">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
                      <Phone size={12} className="text-text-muted shrink-0" />
                      {entry.mobile}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-text-secondary max-w-[200px] truncate block" title={entry.reason}>{entry.reason}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{entry.addedBy}</p>
                      <p className="text-[11px] text-text-muted">{entry.addedDate}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className={entry.expiry === 'Never' ? 'text-text-muted' : 'text-amber-500'} />
                      <span className={`text-[13px] font-medium ${entry.expiry === 'Never' ? 'text-text-muted' : 'text-amber-700'}`}>{entry.expiry}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <EntryStatusBadge status={entry.status} />
                  </td>
                  {showSource && (
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">{entry.source}</span>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditEntry(entry)}
                        className="w-7 h-7 rounded-lg hover:bg-primary-50 flex items-center justify-center transition-colors group"
                        title="Edit"
                      >
                        <Edit2 size={13} className="text-text-muted group-hover:text-primary-600" />
                      </button>
                      <button
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors group"
                        title="View Details"
                      >
                        <Eye size={13} className="text-text-muted group-hover:text-text-primary" />
                      </button>
                      <button
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors group"
                        title="Delete"
                      >
                        <Trash2 size={13} className="text-text-muted group-hover:text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* ─── Watchlist Rules Tab ────────────────────────────────────────────────── */
function WatchlistRulesTab() {
  const [rules, setRules] = useState<WatchlistRule[]>(watchlistRules);
  const [editingRule, setEditingRule] = useState<string | null>('rule-001');

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r));
  };

  const conditions = [
    { id: 'c1', label: 'IF Health Declaration = No', icon: <AlertTriangle size={14} className="text-amber-500" /> },
    { id: 'c2', label: 'IF ID Scan fails 3+ times', icon: <Shield size={14} className="text-red-500" /> },
    { id: 'c3', label: 'IF Visitor on Watchlist', icon: <Eye size={14} className="text-orange-500" /> },
    { id: 'c4', label: 'IF Same visitor > 5x/week', icon: <RefreshCw size={14} className="text-blue-500" /> },
    { id: 'c5', label: 'IF Blacklisted ID detected', icon: <ShieldAlert size={14} className="text-red-600" /> },
  ];

  const actions = [
    { id: 'a1', label: 'Auto-block visitor', color: 'text-red-600' },
    { id: 'a2', label: 'Add to Watchlist', color: 'text-amber-600' },
    { id: 'a3', label: 'Notify Security Team', color: 'text-blue-600' },
    { id: 'a4', label: 'Alert Host', color: 'text-purple-600' },
    { id: 'a5', label: 'Require Manual Review', color: 'text-teal-600' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-bold text-text-primary">Manage Automatic Rules</h2>
          <p className="text-[12px] text-text-muted mt-0.5">Define conditions that automatically trigger blacklist or watchlist actions</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm">
          <Plus size={15} />
          Add Rule
        </button>
      </div>

      {/* Visual Rule Builder */}
      <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface/60">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-primary-600" />
            <span className="text-[13px] font-bold text-text-primary">Visual Rule Builder</span>
            <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[11px] font-semibold rounded-full">Editing: Failed ID Scan Auto-Block</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">Discard</button>
            <button className="px-3 py-1.5 text-[12px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 transition-all shadow-sm">Save Rule</button>
          </div>
        </div>

        <div className="flex h-[320px]">
          {/* Left: Condition Palette */}
          <div className="w-52 border-r border-border bg-surface/40 p-3 overflow-y-auto scrollbar-thin shrink-0">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2.5 px-1">Conditions</p>
            <div className="space-y-1.5">
              {conditions.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 px-3 py-2.5 bg-white border border-border rounded-lg cursor-grab hover:border-primary-300 hover:shadow-sm transition-all text-[12px] font-medium text-text-secondary group"
                >
                  <GripVertical size={12} className="text-text-muted group-hover:text-primary-400 shrink-0" />
                  {c.icon}
                  <span className="truncate">{c.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2.5 px-1 mt-4">Actions</p>
            <div className="space-y-1.5">
              {actions.map(a => (
                <div
                  key={a.id}
                  className="flex items-center gap-2 px-3 py-2.5 bg-white border border-border rounded-lg cursor-grab hover:border-primary-300 hover:shadow-sm transition-all text-[12px] font-medium group"
                >
                  <GripVertical size={12} className="text-text-muted group-hover:text-primary-400 shrink-0" />
                  <ArrowRight size={12} className={a.color} />
                  <span className={`truncate ${a.color}`}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Canvas */}
          <div className="flex-1 p-5 overflow-auto scrollbar-thin bg-[#f8fafc]" style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <div className="flex flex-col items-center gap-3 min-h-full justify-center">
              {/* Rule Card */}
              <div className="bg-white rounded-xl border-2 border-primary-300 shadow-card-md p-4 w-80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wider">Rule: Failed ID Scan Auto-Block</span>
                  <button className="w-5 h-5 rounded hover:bg-slate-100 flex items-center justify-center">
                    <Settings size={11} className="text-text-muted" />
                  </button>
                </div>
                {/* IF block */}
                <div className="flex items-start gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase shrink-0 mt-0.5">IF</span>
                  <div className="flex-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-[12px] font-medium text-amber-800">
                    ID Scan fails 3+ times in a session
                  </div>
                </div>
                {/* Arrow */}
                <div className="flex justify-center my-1">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-px h-3 bg-slate-300" />
                    <ArrowRight size={12} className="text-slate-400 rotate-90" />
                  </div>
                </div>
                {/* THEN block */}
                <div className="flex items-start gap-2">
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase shrink-0 mt-0.5">THEN</span>
                  <div className="flex-1 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] font-medium text-red-800">
                    Auto-block visitor + Notify Security Team
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-text-muted">Drag conditions and actions from the left panel to build rules</p>
            </div>
          </div>

          {/* Right: Properties Panel */}
          <div className="w-56 border-l border-border bg-white p-4 overflow-y-auto scrollbar-thin shrink-0">
            <p className="text-[11px] font-bold text-text-primary uppercase tracking-wider mb-3">Rule Properties</p>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">Rule Name</label>
                <input
                  type="text"
                  defaultValue="Failed ID Scan Auto-Block"
                  className="w-full px-2.5 py-1.5 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">Trigger Count</label>
                <input
                  type="number"
                  defaultValue={3}
                  className="w-full px-2.5 py-1.5 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">Severity</label>
                <select className="w-full px-2.5 py-1.5 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white transition-all">
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">Notify</label>
                <div className="space-y-1.5">
                  {['Security Team', 'Site Admin', 'Host'].map(n => (
                    <label key={n} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={n !== 'Host'} className="w-3.5 h-3.5 rounded accent-primary-600" />
                      <span className="text-[12px] text-text-secondary">{n}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1.5">Status</label>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-5 bg-primary-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                  <span className="text-[12px] font-semibold text-success-text">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Rules Table */}
      <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-[14px] font-bold text-text-primary">Active Rules</h3>
            <p className="text-[12px] text-text-muted">{rules.filter(r => r.status).length} active · {rules.length} total</p>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/60">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Rule Name</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Condition</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Action</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">Last Modified</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, idx) => (
              <tr
                key={rule.id}
                className={`border-b border-border last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${editingRule === rule.id ? 'bg-primary-50/40' : ''}`}
                onClick={() => setEditingRule(rule.id)}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {editingRule === rule.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />}
                    <span className="text-[13px] font-semibold text-text-primary">{rule.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[13px] text-text-secondary">{rule.condition}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[13px] font-medium text-text-primary">{rule.action}</span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={e => { e.stopPropagation(); toggleRule(rule.id); }}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${rule.status ? 'bg-primary-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${rule.status ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                    <span className={`text-[12px] font-semibold ${rule.status ? 'text-success-text' : 'text-text-muted'}`}>
                      {rule.status ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[13px] text-text-muted">{rule.lastModified}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={e => e.stopPropagation()} className="w-7 h-7 rounded-lg hover:bg-primary-50 flex items-center justify-center transition-colors group" title="Edit">
                      <Edit2 size={13} className="text-text-muted group-hover:text-primary-600" />
                    </button>
                    <button onClick={e => e.stopPropagation()} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors group" title="Delete">
                      <Trash2 size={13} className="text-text-muted group-hover:text-danger" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
type TabId = 'internal' | 'third-party' | 'rules';

export default function BlacklistWatchlistsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('internal');
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'internal', label: 'Internal Blacklist', count: internalBlacklist.length },
    { id: 'third-party', label: 'Third-Party Watchlist', count: thirdPartyWatchlist.length },
    { id: 'rules', label: 'Watchlist Rules' },
  ];

  const totalBlocked = internalBlacklist.filter(e => e.status === 'Blocked').length + thirdPartyWatchlist.filter(e => e.status === 'Blocked').length;
  const totalWatch = internalBlacklist.filter(e => e.status === 'Watch').length + thirdPartyWatchlist.filter(e => e.status === 'Watch').length;
  const totalEntries = internalBlacklist.length + thirdPartyWatchlist.length;

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <ShieldAlert size={20} className="text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-text-primary leading-tight">Blacklist &amp; Watchlists</h1>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 status-dot-pulse" />
                  <span className="text-[11px] font-semibold text-red-700">{totalBlocked} Blocked</span>
                </div>
                <button className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors" title="Security screening and blacklist management">
                  <Info size={11} className="text-text-muted" />
                </button>
              </div>
              <p className="text-[12px] text-text-muted mt-0.5">Security screening and blacklist management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all duration-150">
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all duration-150">
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { icon: <Shield size={18} className="text-slate-600" />, value: totalEntries, label: 'Total Entries', bg: 'bg-slate-50', border: 'border-slate-200', iconBg: 'bg-slate-100' },
            { icon: <ShieldAlert size={18} className="text-red-600" />, value: totalBlocked, label: 'Blocked', bg: 'bg-red-50', border: 'border-red-100', iconBg: 'bg-red-100' },
            { icon: <Eye size={18} className="text-amber-600" />, value: totalWatch, label: 'On Watch', bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100' },
            { icon: <Zap size={18} className="text-primary-600" />, value: watchlistRules.filter(r => r.status).length, label: 'Active Rules', bg: 'bg-primary-50', border: 'border-primary-100', iconBg: 'bg-primary-100' },
          ].map((card, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${card.bg} ${card.border}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg} shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[24px] font-bold text-slate-800 leading-none">{card.value}</p>
                <p className="text-[12px] text-slate-500 mt-0.5">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-border mb-5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all duration-150 -mb-px ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-700' :'border-transparent text-text-muted hover:text-text-secondary hover:border-border'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-text-muted'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'internal' && (
          <EntryTable entries={internalBlacklist} onAdd={() => setShowAddModal(true)} />
        )}
        {activeTab === 'third-party' && (
          <EntryTable entries={thirdPartyWatchlist} showSource onAdd={() => setShowAddModal(true)} />
        )}
        {activeTab === 'rules' && (
          <WatchlistRulesTab />
        )}

        {/* Add Entry Modal */}
        {showAddModal && <AddEntryModal onClose={() => setShowAddModal(false)} />}
      </div>
    </AppLayout>
  );
}
