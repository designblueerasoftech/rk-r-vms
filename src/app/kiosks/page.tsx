'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { Monitor, Printer, HelpCircle, Plus, RefreshCw, ExternalLink, Search, ChevronDown, Battery, BatteryLow, BatteryMedium, WifiOff, Trash2, Edit2, Eye, Unlink, PlayCircle, CheckCircle, XCircle, AlertTriangle, QrCode, Copy, X, RotateCcw, Camera, Terminal, Activity, Clock, Zap, Download, Tablet, Cpu, Radio, ScanLine, CheckSquare, Square, ArrowUpDown, Info, BookOpen, Send, MapPin } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type MainTab = 'kiosks' | 'printers';
type KioskStatus = 'Online' | 'Offline' | 'Pairing Mode';
type PrinterStatus = 'Connected' | 'Offline';
type DeviceType = 'iPad' | 'Android Tablet';

interface Kiosk {
  id: string;
  name: string;
  location: string;
  site: string;
  deviceType: DeviceType;
  lastOnline: string;
  battery: number;
  assignedWorkflow: string;
  status: KioskStatus;
  ipAddress: string;
  osVersion: string;
  appVersion: string;
}

interface PrinterDevice {
  id: string;
  name: string;
  model: string;
  location: string;
  site: string;
  status: PrinterStatus;
  lastTestPrint: string;
  connectionType: string;
  printServiceStatus: string;
}

interface Peripheral {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  site: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_KIOSKS: Kiosk[] = [
  { id: 'KSK-001', name: 'Reception Kiosk A', location: 'Main Lobby – Ground Floor', site: 'HQ Mumbai', deviceType: 'iPad', lastOnline: '2 min ago', battery: 87, assignedWorkflow: 'Standard Visitor Flow', status: 'Online', ipAddress: '192.168.1.101', osVersion: 'iOS 17.4', appVersion: 'v3.2.1' },
  { id: 'KSK-002', name: 'Security Gate Kiosk', location: 'Gate 2 – Security Checkpoint', site: 'HQ Mumbai', deviceType: 'Android Tablet', lastOnline: '15 min ago', battery: 34, assignedWorkflow: 'Contractor Check-In', status: 'Online', ipAddress: '192.168.1.102', osVersion: 'Android 13', appVersion: 'v3.2.0' },
  { id: 'KSK-003', name: 'Warehouse Entry', location: 'Warehouse Block B', site: 'Pune Factory', deviceType: 'Android Tablet', lastOnline: '2 hours ago', battery: 12, assignedWorkflow: 'Vendor Flow', status: 'Offline', ipAddress: '10.0.2.45', osVersion: 'Android 12', appVersion: 'v3.1.8' },
  { id: 'KSK-004', name: 'VIP Lounge Kiosk', location: 'Executive Floor – 5th', site: 'HQ Mumbai', deviceType: 'iPad', lastOnline: '5 min ago', battery: 100, assignedWorkflow: 'VIP Visitor Flow', status: 'Online', ipAddress: '192.168.1.105', osVersion: 'iOS 17.4', appVersion: 'v3.2.1' },
  { id: 'KSK-005', name: 'New Kiosk Setup', location: 'Conference Room C', site: 'Delhi Office', deviceType: 'iPad', lastOnline: 'Never', battery: 0, assignedWorkflow: 'Unassigned', status: 'Pairing Mode', ipAddress: '—', osVersion: '—', appVersion: '—' },
];

const MOCK_PRINTERS: PrinterDevice[] = [
  { id: 'PRT-001', name: 'Reception Badge Printer', model: 'Brother QL-820NWB', location: 'Main Lobby', site: 'HQ Mumbai', status: 'Connected', lastTestPrint: '1 hour ago', connectionType: 'Windows Print Service', printServiceStatus: 'Running' },
  { id: 'PRT-002', name: 'Gate Printer', model: 'Brother QL-820NWB', location: 'Gate 2', site: 'HQ Mumbai', status: 'Connected', lastTestPrint: '3 hours ago', connectionType: 'Network (TCP/IP)', printServiceStatus: 'Running' },
  { id: 'PRT-003', name: 'Warehouse Printer', model: 'Generic Label Printer', location: 'Warehouse Block B', site: 'Pune Factory', status: 'Offline', lastTestPrint: '2 days ago', connectionType: 'Windows Print Service', printServiceStatus: 'Stopped' },
];

const MOCK_PERIPHERALS: Peripheral[] = [
  { id: 'PER-001', name: 'ID Scanner – Reception', type: 'ID Scanner', status: 'Active', location: 'Main Lobby', site: 'HQ Mumbai' },
  { id: 'PER-002', name: 'RFID Reader – Gate 2', type: 'RFID Reader', status: 'Active', location: 'Gate 2', site: 'HQ Mumbai' },
  { id: 'PER-003', name: 'Barcode Scanner – Warehouse', type: 'Barcode Scanner', status: 'Inactive', location: 'Warehouse Block B', site: 'Pune Factory' },
  { id: 'PER-004', name: 'NFC Reader – VIP Lounge', type: 'NFC Reader', status: 'Active', location: 'Executive Floor', site: 'HQ Mumbai' },
];

const SITES = ['All Sites', 'HQ Mumbai', 'Pune Factory', 'Delhi Office'];
const WORKFLOWS = ['Standard Visitor Flow', 'Contractor Check-In', 'Vendor Flow', 'VIP Visitor Flow', 'Unassigned'];
const PRINTER_MODELS = ['Brother QL-820NWB', 'Brother QL-810W', 'Zebra ZD421', 'Generic Label Printer', 'Dymo LabelWriter 450'];
const CONNECTION_TYPES = ['Windows Print Service', 'WebUSB', 'Network (TCP/IP)', 'Bluetooth'];

// ─── Helper Components ────────────────────────────────────────────────────────

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1">
      <span role="button" tabIndex={0} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        className="text-slate-400 hover:text-primary-500 transition-colors cursor-pointer">
        <HelpCircle size={12} />
      </span>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-slate-800 text-white text-[11px] rounded-lg px-3 py-2 shadow-xl leading-relaxed pointer-events-none whitespace-normal">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-primary-600' : 'bg-slate-300'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
  );
}

function StatusBadge({ status }: { status: KioskStatus | PrinterStatus | string }) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    'Online': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'Offline': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    'Pairing Mode': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    'Connected': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'Active': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'Inactive': { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
    'Running': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    'Stopped': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  };
  const s = map[status] || { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function BatteryIcon({ pct }: { pct: number }) {
  if (pct < 20) return <BatteryLow size={14} className="text-red-500" />;
  if (pct < 50) return <BatteryMedium size={14} className="text-amber-500" />;
  return <Battery size={14} className="text-emerald-500" />;
}

function BatteryBar({ pct }: { pct: number }) {
  const color = pct < 20 ? 'bg-red-500' : pct < 50 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-1.5">
      <BatteryIcon pct={pct} />
      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[11px] font-medium ${pct < 20 ? 'text-red-600' : pct < 50 ? 'text-amber-600' : 'text-emerald-600'}`}>{pct}%</span>
    </div>
  );
}

function DeviceTypeChip({ type }: { type: DeviceType }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${type === 'iPad' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
      <Tablet size={11} />
      {type}
    </span>
  );
}

// ─── QR Code Placeholder ──────────────────────────────────────────────────────

function QRCodeDisplay({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-48 h-48 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden shadow-inner">
        {/* Simulated QR pattern */}
        <div className="grid grid-cols-7 gap-0.5 p-3">
          {Array.from({ length: 49 }).map((_, i) => {
            const corners = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,48];
            const filled = corners.includes(i) || Math.random() > 0.5;
            return <div key={i} className={`w-4 h-4 rounded-sm ${filled ? 'bg-slate-900' : 'bg-white'}`} />;
          })}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-1 rounded">
            <QrCode size={28} className="text-slate-900" />
          </div>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 text-center max-w-[200px]">Scan this QR code on the tablet in Single App Mode / COSU to pair the kiosk.</p>
    </div>
  );
}

// ─── Add Kiosk Modal ──────────────────────────────────────────────────────────

function AddKioskModal({ onClose, onSave }: { onClose: () => void; onSave: (k: Partial<Kiosk>) => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: `KSK-00${Math.floor(Math.random() * 900) + 100}`, location: '', site: SITES[1], deviceType: 'iPad' as DeviceType, workflow: WORKFLOWS[0] });
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-[15px] font-bold text-text-primary">Add New Kiosk</h2>
            <p className="text-[12px] text-text-secondary mt-0.5">Step {step} of 2 – {step === 1 ? 'Basic Info' : 'Generate Pairing QR'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 px-6 pt-4">
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 text-[12px] font-medium ${step >= s ? 'text-primary-600' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > s ? 'bg-primary-600 text-white' : step === s ? 'bg-primary-100 text-primary-700 border-2 border-primary-400' : 'bg-slate-100 text-slate-400'}`}>
                  {step > s ? <CheckCircle size={12} /> : s}
                </div>
                {s === 1 ? 'Basic Info' : 'Pairing QR'}
              </div>
              {s < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-primary-400' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="px-6 py-5 space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1.5">
                  Kiosk Name <Tooltip text="Auto-generated ID or enter a custom name for this kiosk device." />
                </label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full h-9 px-3 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1.5">
                  Location / Site <Tooltip text="Select the site and physical location where this kiosk will be deployed." />
                </label>
                <SiteDropdown value={form.site} onChange={v => setForm(f => ({ ...f, site: v }))} options={SITES} />
                <input placeholder="Physical location (e.g., Main Lobby – Ground Floor)" value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className="w-full h-9 px-3 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1.5">
                  Device Type <Tooltip text="Select the tablet type. iPad uses Single App Mode; Android uses COSU (Kiosk Mode)." />
                </label>
                <div className="flex gap-3">
                  {(['iPad', 'Android Tablet'] as DeviceType[]).map(dt => (
                    <button key={dt} onClick={() => setForm(f => ({ ...f, deviceType: dt }))}
                      className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border-2 text-[13px] font-medium transition-all ${form.deviceType === dt ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                      <Tablet size={14} /> {dt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1.5">
                  Assigned Workflow (Optional) <Tooltip text="Pre-assign a visitor workflow to this kiosk. Can be changed later." />
                </label>
                <select value={form.workflow} onChange={e => setForm(f => ({ ...f, workflow: e.target.value }))}
                  className="w-full h-9 px-3 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white">
                  {WORKFLOWS.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <QRCodeDisplay value={`vmspro://pair/${form.name}/${form.site}`} />
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <Info size={14} className="text-amber-600 shrink-0" />
                  <p className="text-[12px] text-amber-700">Pairing QR works with React Native Single App Mode – scan on tablet to connect instantly.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {}} className="flex-1 flex items-center justify-center gap-1.5 h-9 border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <RefreshCw size={13} /> Regenerate QR
                  </button>
                  <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-1.5 h-9 border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    {copied ? <><CheckCircle size={13} className="text-emerald-500" /> Copied!</> : <><Copy size={13} /> Copy Pairing Link</>}
                  </button>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">Kiosk Summary</p>
                  <div className="grid grid-cols-2 gap-1 text-[12px]">
                    <span className="text-slate-500">Name:</span><span className="font-medium text-text-primary">{form.name}</span>
                    <span className="text-slate-500">Site:</span><span className="font-medium text-text-primary">{form.site}</span>
                    <span className="text-slate-500">Device:</span><span className="font-medium text-text-primary">{form.deviceType}</span>
                    <span className="text-slate-500">Workflow:</span><span className="font-medium text-text-primary">{form.workflow}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button onClick={step === 1 ? onClose : () => setStep(1)}
            className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-800 transition-colors">
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          <button onClick={step === 1 ? () => setStep(2) : () => onSave({ name: form.name, location: form.location, site: form.site, deviceType: form.deviceType, assignedWorkflow: form.workflow, status: 'Pairing Mode', battery: 0, lastOnline: 'Never' })}
            className="px-5 py-2 bg-primary-600 text-white text-[13px] font-semibold rounded-xl hover:bg-primary-700 transition-colors">
            {step === 1 ? 'Next: Generate QR →' : 'Save Kiosk'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Kiosk Detail Modal ───────────────────────────────────────────────────────

function KioskDetailModal({ kiosk, onClose }: { kiosk: Kiosk; onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'workflow' | 'activity' | 'commands'>('overview');
  const [cmdSent, setCmdSent] = useState<string | null>(null);

  const sendCommand = (cmd: string) => {
    setCmdSent(cmd);
    setTimeout(() => setCmdSent(null), 3000);
  };

  const activityLog = [
    { time: '10:32 AM', event: 'Visitor check-in: Rahul Sharma (Vendor)', type: 'checkin' },
    { time: '10:15 AM', event: 'Badge printed successfully', type: 'print' },
    { time: '09:58 AM', event: 'Induction completed by Priya Nair', type: 'induction' },
    { time: '09:45 AM', event: 'Kiosk restarted remotely', type: 'command' },
    { time: '09:30 AM', event: 'Visitor check-in: Amit Kumar (Contractor)', type: 'checkin' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[620px] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
              <Monitor size={18} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-text-primary">{kiosk.name}</h2>
              <p className="text-[12px] text-text-secondary">{kiosk.id} · {kiosk.location}</p>
            </div>
            <StatusBadge status={kiosk.status} />
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X size={16} /></button>
        </div>

        {/* Inner tabs */}
        <div className="flex border-b border-slate-100 px-6">
          {[{ id: 'overview', label: 'Overview' }, { id: 'workflow', label: 'Assigned Workflow' }, { id: 'activity', label: 'Activity Log' }, { id: 'commands', label: 'Remote Commands' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`px-4 py-3 text-[12px] font-semibold border-b-2 transition-colors ${tab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Device Type', value: kiosk.deviceType },
                  { label: 'Site', value: kiosk.site },
                  { label: 'IP Address', value: kiosk.ipAddress },
                  { label: 'OS Version', value: kiosk.osVersion },
                  { label: 'App Version', value: kiosk.appVersion },
                  { label: 'Last Online', value: kiosk.lastOnline },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[11px] text-slate-500 mb-0.5">{item.label}</p>
                    <p className="text-[13px] font-semibold text-text-primary">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[11px] text-slate-500 mb-1.5">Battery Status</p>
                <BatteryBar pct={kiosk.battery} />
              </div>
            </div>
          )}
          {tab === 'workflow' && (
            <div className="space-y-3">
              <div className="p-4 border border-primary-100 bg-primary-50 rounded-xl">
                <p className="text-[11px] text-primary-600 font-semibold mb-1">Currently Assigned</p>
                <p className="text-[15px] font-bold text-primary-700">{kiosk.assignedWorkflow}</p>
              </div>
              <p className="text-[12px] text-slate-500">Change the workflow assigned to this kiosk. Visitors will follow the selected flow when checking in.</p>
              <select className="w-full h-9 px-3 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white">
                {WORKFLOWS.map(w => <option key={w} selected={w === kiosk.assignedWorkflow}>{w}</option>)}
              </select>
              <button className="px-4 py-2 bg-primary-600 text-white text-[13px] font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                Update Workflow
              </button>
            </div>
          )}
          {tab === 'activity' && (
            <div className="space-y-2">
              {activityLog.map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${log.type === 'checkin' ? 'bg-emerald-100' : log.type === 'print' ? 'bg-blue-100' : log.type === 'command' ? 'bg-amber-100' : 'bg-purple-100'}`}>
                    {log.type === 'checkin' ? <CheckCircle size={13} className="text-emerald-600" /> : log.type === 'print' ? <Printer size={13} className="text-blue-600" /> : log.type === 'command' ? <Terminal size={13} className="text-amber-600" /> : <Activity size={13} className="text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-text-primary">{log.event}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{log.time} today</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'commands' && (
            <div className="space-y-3">
              {cmdSent && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle size={14} className="text-emerald-600" />
                  <p className="text-[12px] text-emerald-700 font-medium">Command "{cmdSent}" sent successfully.</p>
                </div>
              )}
              <p className="text-[12px] text-slate-500">Send remote commands to this kiosk device. Commands are executed immediately if the device is online.</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { cmd: 'Restart Kiosk', icon: <RotateCcw size={15} />, desc: 'Restarts the kiosk app and device', color: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' },
                  { cmd: 'Clear Cache', icon: <Trash2 size={15} />, desc: 'Clears app cache and temporary files', color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100' },
                  { cmd: 'Take Screenshot', icon: <Camera size={15} />, desc: 'Captures current kiosk screen', color: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100' },
                ].map(item => (
                  <button key={item.cmd} onClick={() => sendCommand(item.cmd)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors ${item.color} ${kiosk.status === 'Offline' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={kiosk.status === 'Offline'}>
                    <span className="shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-[13px] font-semibold">{item.cmd}</p>
                      <p className="text-[11px] opacity-70">{item.desc}</p>
                    </div>
                    <Send size={13} className="ml-auto opacity-50" />
                  </button>
                ))}
              </div>
              {kiosk.status === 'Offline' && (
                <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertTriangle size={11} /> Device is offline. Commands will be queued and executed when the device reconnects.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Test Print Modal ─────────────────────────────────────────────────────────

function TestPrintModal({ printer, onClose }: { printer: PrinterDevice; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[420px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[15px] font-bold text-text-primary">Test Print – {printer.name}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <p className="text-[15px] font-bold text-text-primary">Test badge sent successfully.</p>
              <p className="text-[12px] text-slate-500 text-center">The test badge has been sent to {printer.name}. Check the printer for output.</p>
            </div>
          ) : (
            <>
              <p className="text-[12px] text-slate-500">Preview of the test badge that will be printed:</p>
              {/* Sample badge preview */}
              <div className="mx-auto w-48 bg-white border-2 border-slate-200 rounded-xl p-4 shadow-md">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-primary-100 mx-auto flex items-center justify-center">
                    <span className="text-[18px] font-bold text-primary-600">JD</span>
                  </div>
                  <p className="text-[13px] font-bold text-slate-900">John Doe</p>
                  <p className="text-[10px] text-slate-500">Visitor · Acme Corp</p>
                  <div className="border-t border-slate-100 pt-1.5">
                    <p className="text-[10px] text-slate-400">Host: Sarah Johnson</p>
                    <p className="text-[10px] text-slate-400">Valid: Today 9AM–6PM</p>
                  </div>
                  <div className="flex justify-center pt-1">
                    <QrCode size={28} className="text-slate-700" />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-[12px] text-slate-600">
                <span className="font-semibold">Printer:</span> {printer.name} ({printer.model})<br />
                <span className="font-semibold">Connection:</span> {printer.connectionType}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-800 transition-colors">Close</button>
          {!sent && (
            <button onClick={() => setSent(true)} className="px-5 py-2 bg-primary-600 text-white text-[13px] font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-1.5">
              <Send size={13} /> Send to Printer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Printer Modal ────────────────────────────────────────────────────────

function AddPrinterModal({ onClose, onSave }: { onClose: () => void; onSave: (p: Partial<PrinterDevice>) => void }) {
  const [form, setForm] = useState({ name: '', model: PRINTER_MODELS[0], site: SITES[1], location: '', connectionType: CONNECTION_TYPES[0] });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null);

  const testConnection = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => { setTesting(false); setTestResult('success'); }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[460px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[15px] font-bold text-text-primary">Add Printer</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-text-primary mb-1.5">Printer Name <Tooltip text="A friendly name to identify this printer in the admin portal." /></label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Reception Badge Printer"
              className="w-full h-9 px-3 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-text-primary mb-1.5">Model <Tooltip text="Brother QL-820NWB is the recommended badge printer for VMSPro." /></label>
            <select value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
              className="w-full h-9 px-3 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white">
              {PRINTER_MODELS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-text-primary mb-1.5">Site <Tooltip text="The site where this printer is physically located." /></label>
              <select value={form.site} onChange={e => setForm(f => ({ ...f, site: e.target.value }))}
                className="w-full h-9 px-3 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white">
                {SITES.filter(s => s !== 'All Sites').map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-primary mb-1.5">Location</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g., Main Lobby"
                className="w-full h-9 px-3 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-text-primary mb-1.5">Connection Type <Tooltip text="Windows Print Service is recommended for Brother QL-820NWB. WebUSB works for direct browser printing." /></label>
            <select value={form.connectionType} onChange={e => setForm(f => ({ ...f, connectionType: e.target.value }))}
              className="w-full h-9 px-3 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white">
              {CONNECTION_TYPES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={testConnection} disabled={testing}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-[12px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60">
              {testing ? <><RefreshCw size={13} className="animate-spin" /> Testing...</> : <><Zap size={13} /> Test Connection</>}
            </button>
            {testResult === 'success' && <span className="flex items-center gap-1 text-[12px] text-emerald-600 font-medium"><CheckCircle size={13} /> Connection successful</span>}
            {testResult === 'fail' && <span className="flex items-center gap-1 text-[12px] text-red-600 font-medium"><XCircle size={13} /> Connection failed</span>}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
          <button onClick={() => onSave({ name: form.name, model: form.model, site: form.site, location: form.location, connectionType: form.connectionType, status: 'Connected', lastTestPrint: 'Never', printServiceStatus: 'Running' })}
            className="px-5 py-2 bg-primary-600 text-white text-[13px] font-semibold rounded-xl hover:bg-primary-700 transition-colors">
            Add Printer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Site Dropdown ─────────────────────────────────────────────────────

function SiteDropdown({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 h-9 pl-3 pr-3 text-[13px] font-medium text-primary-700 border border-primary-200 rounded-lg bg-white hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer"
      >
        {value}
        <ChevronDown size={13} className={`text-primary-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 min-w-[160px] bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${
                value === opt
                  ? 'bg-primary-50 text-primary-700 font-semibold' :'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Kiosks Tab ───────────────────────────────────────────────────────────────

function KiosksTab({ kiosks, onAddKiosk }: { kiosks: Kiosk[]; onAddKiosk: () => void }) {
  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('All Sites');
  const [selected, setSelected] = useState<string[]>([]);
  const [detailKiosk, setDetailKiosk] = useState<Kiosk | null>(null);
  const [sortCol, setSortCol] = useState<string>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = kiosks.filter(k =>
    (siteFilter === 'All Sites' || k.site === siteFilter) &&
    (k.id.toLowerCase().includes(search.toLowerCase()) || k.location.toLowerCase().includes(search.toLowerCase()) || k.name.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(k => k.id));

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const SortBtn = ({ col, label, tooltip }: { col: string; label: string; tooltip: string }) => (
    <button onClick={() => handleSort(col)} className="flex items-center gap-1 group">
      {label}<Tooltip text={tooltip} />
      <ArrowUpDown size={11} className={`ml-0.5 ${sortCol === col ? 'text-primary-500' : 'text-slate-300'}`} />
    </button>
  );

  return (
    <>
      {detailKiosk && <KioskDetailModal kiosk={detailKiosk} onClose={() => setDetailKiosk(null)} />}

      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Kiosk ID or Location…"
            className="w-full h-9 pl-8 pr-3 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white" />
        </div>
        <div className="relative">
          <SiteDropdown value={siteFilter} onChange={setSiteFilter} options={SITES} />
        </div>
        <button onClick={onAddKiosk} className="flex items-center gap-1.5 h-9 px-4 bg-primary-600 text-white text-[13px] font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm">
          <Plus size={14} /> Add Kiosk
        </button>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2 mb-3 p-2.5 bg-primary-50 border border-primary-100 rounded-xl">
          <span className="text-[12px] font-semibold text-primary-700">{selected.length} selected</span>
          <div className="flex gap-2 ml-2">
            {[{ label: 'Unpair Selected', color: 'text-amber-700 bg-amber-50 border-amber-200' }, { label: 'Assign Workflow', color: 'text-blue-700 bg-blue-50 border-blue-200' }, { label: 'Delete Selected', color: 'text-red-700 bg-red-50 border-red-200' }].map(a => (
              <button key={a.label} className={`px-3 py-1 text-[11px] font-semibold rounded-lg border ${a.color} hover:opacity-80 transition-opacity`}>{a.label}</button>
            ))}
          </div>
          <button onClick={() => setSelected([])} className="ml-auto text-slate-400 hover:text-slate-600"><X size={14} /></button>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Monitor size={28} className="text-slate-300" />
          </div>
          <p className="text-[15px] font-semibold text-text-primary mb-1">No kiosks registered yet</p>
          <p className="text-[13px] text-slate-400 mb-4">Add your first kiosk to begin managing hardware.</p>
          <button onClick={onAddKiosk} className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 text-white text-[13px] font-semibold rounded-xl hover:bg-primary-700 transition-colors">
            <Plus size={14} /> Add Kiosk
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-10 px-3 py-3">
                  <button onClick={toggleAll} className="text-slate-400 hover:text-primary-600">
                    {selected.length === filtered.length ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap"><SortBtn col="id" label="Kiosk ID" tooltip="Unique identifier for this kiosk device." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap"><SortBtn col="location" label="Location" tooltip="Physical site and location of this kiosk." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap"><SortBtn col="deviceType" label="Device Type" tooltip="iPad uses Single App Mode; Android uses COSU kiosk mode." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap"><SortBtn col="lastOnline" label="Last Online" tooltip="Timestamp of the last successful heartbeat from this device." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Battery Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap"><SortBtn col="workflow" label="Workflow" tooltip="The visitor check-in workflow assigned to this kiosk." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap"><SortBtn col="status" label="Status" tooltip="Real-time connection status of the kiosk device." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Actions <Tooltip text="Available actions for this kiosk device." /></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((kiosk, i) => (
                <tr key={kiosk.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                  <td className="px-3 py-3">
                    <button onClick={() => toggleSelect(kiosk.id)} className="text-slate-400 hover:text-primary-600">
                      {selected.includes(kiosk.id) ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDetailKiosk(kiosk)} className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">{kiosk.id}</button>
                    <p className="text-[11px] text-slate-400">{kiosk.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{kiosk.site}</p>
                    <p className="text-[11px] text-slate-400">{kiosk.location}</p>
                  </td>
                  <td className="px-4 py-3"><DeviceTypeChip type={kiosk.deviceType} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${kiosk.status === 'Online' ? 'bg-emerald-500' : kiosk.status === 'Pairing Mode' ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <span className="text-text-primary">{kiosk.lastOnline}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><BatteryBar pct={kiosk.battery} /></td>
                  <td className="px-4 py-3">
                    <span className="text-text-primary">{kiosk.assignedWorkflow}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={kiosk.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setDetailKiosk(kiosk)} title="View Details" className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={13} /></button>
                      <button title="Edit" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><Edit2 size={13} /></button>
                      <button title="Unpair" className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"><Unlink size={13} /></button>
                      <button title="Test Kiosk" className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"><PlayCircle size={13} /></button>
                      <button title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── Printers & Peripherals Tab ───────────────────────────────────────────────

function PrintersTab({ printers, peripherals, onAddPrinter }: { printers: PrinterDevice[]; peripherals: Peripheral[]; onAddPrinter: () => void }) {
  const [search, setSearch] = useState('');
  const [testPrinter, setTestPrinter] = useState<PrinterDevice | null>(null);

  const filtered = printers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {testPrinter && <TestPrintModal printer={testPrinter} onClose={() => setTestPrinter(null)} />}

      {/* Printers section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-bold text-text-primary flex items-center gap-2">
            <Printer size={16} className="text-primary-600" /> Printers
            <Tooltip text="Badge printers connected to kiosk sites. Brother QL-820NWB is the recommended model." />
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search printers…"
                className="h-8 pl-7 pr-3 text-[12px] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white w-48" />
            </div>
            <button onClick={onAddPrinter} className="flex items-center gap-1.5 h-8 px-3 bg-primary-600 text-white text-[12px] font-semibold rounded-xl hover:bg-primary-700 transition-colors">
              <Plus size={13} /> Add Printer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Printer Name <Tooltip text="Friendly name for this printer device." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Model <Tooltip text="Printer model. Brother QL-820NWB recommended for badge printing." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Location / Site <Tooltip text="Physical location and site of this printer." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status <Tooltip text="Real-time connection status of the printer." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Print Service <Tooltip text="Windows Print Service status. Must be Running for badge printing to work." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Last Test Print <Tooltip text="Timestamp of the last successful test print." /></th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Actions <Tooltip text="Test, edit, or delete this printer." /></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                  <td className="px-4 py-3 font-semibold text-text-primary">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.model}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{p.site}</p>
                    <p className="text-[11px] text-slate-400">{p.location}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.printServiceStatus} /></td>
                  <td className="px-4 py-3 text-slate-500">{p.lastTestPrint}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setTestPrinter(p)} className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-[11px] font-semibold rounded-lg hover:bg-primary-100 transition-colors">
                        <Printer size={11} /> Test Print
                      </button>
                      <button title="Edit" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><Edit2 size={13} /></button>
                      <button title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Peripherals section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-bold text-text-primary flex items-center gap-2">
            <Cpu size={16} className="text-purple-600" /> Peripherals
            <Tooltip text="Connected scanners, RFID readers, and other peripheral devices." />
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {peripherals.map(p => (
            <div key={p.id} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    {p.type === 'ID Scanner' ? <ScanLine size={15} className="text-purple-600" /> :
                     p.type === 'RFID Reader' ? <Radio size={15} className="text-purple-600" /> :
                     p.type === 'NFC Reader' ? <Zap size={15} className="text-purple-600" /> :
                     <Cpu size={15} className="text-purple-600" />}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-text-primary">{p.name}</p>
                    <p className="text-[11px] text-slate-400">{p.type}</p>
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin size={10} /> {p.location} · {p.site}
              </div>
              <div className="flex gap-1 mt-3">
                <button className="flex-1 py-1 text-[11px] font-medium border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">Edit</button>
                <button className="flex-1 py-1 text-[11px] font-medium border border-red-100 rounded-lg hover:bg-red-50 text-red-600 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Hardware Health Summary Panel ────────────────────────────────────────────

function HealthPanel({ kiosks, printers }: { kiosks: Kiosk[]; printers: PrinterDevice[] }) {
  const onlineKiosks = kiosks.filter(k => k.status === 'Online').length;
  const readyPrinters = printers.filter(p => p.status === 'Connected').length;
  const offlineKiosks = kiosks.filter(k => k.status === 'Offline').length;
  const lowBattery = kiosks.filter(k => k.battery < 20 && k.status !== 'Pairing Mode').length;

  return (
    <div className="w-64 shrink-0 space-y-3">
      {/* Health Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={15} className="text-primary-600" />
          <h3 className="text-[13px] font-bold text-text-primary">Hardware Health</h3>
          <Tooltip text="Real-time summary of all connected hardware devices across all sites." />
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-slate-500 flex items-center gap-1"><Monitor size={12} /> Kiosks Online</span>
            <span className="text-[13px] font-bold text-text-primary">{onlineKiosks} / {kiosks.length}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${kiosks.length ? (onlineKiosks / kiosks.length) * 100 : 0}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-slate-500 flex items-center gap-1"><Printer size={12} /> Printers Ready</span>
            <span className="text-[13px] font-bold text-text-primary">{readyPrinters} / {printers.length}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${printers.length ? (readyPrinters / printers.length) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Alerts */}
        {(offlineKiosks > 0 || lowBattery > 0) && (
          <div className="mt-3 space-y-1.5">
            {offlineKiosks > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle size={12} className="text-red-500 shrink-0" />
                <span className="text-[11px] text-red-700 font-medium">{offlineKiosks} kiosk{offlineKiosks > 1 ? 's' : ''} offline</span>
              </div>
            )}
            {lowBattery > 0 && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <BatteryLow size={12} className="text-amber-500 shrink-0" />
                <span className="text-[11px] text-amber-700 font-medium">Low battery on {lowBattery} device{lowBattery > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}

        {/* Quick links */}
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
          <button className="w-full flex items-center gap-2 text-[12px] text-primary-600 hover:text-primary-700 font-medium transition-colors">
            <WifiOff size={12} /> View All Offline Devices
          </button>
          <button className="w-full flex items-center gap-2 text-[12px] text-primary-600 hover:text-primary-700 font-medium transition-colors">
            <Download size={12} /> Download Hardware Report
          </button>
        </div>
      </div>

      {/* Last Refresh */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Clock size={12} />
          <span>Auto-refreshes every 30s</span>
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-[11px] text-emerald-600 font-medium">
          <CheckCircle size={11} /> Last synced: just now
        </div>
      </div>

      {/* Deploy Guide */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={14} className="text-primary-600" />
          <h4 className="text-[12px] font-bold text-primary-700">Kiosk Setup Guide</h4>
        </div>
        <p className="text-[11px] text-primary-600 mb-2.5">Step-by-step guide for deploying kiosks in Single App Mode / COSU.</p>
        <button className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-primary-600 text-white text-[11px] font-semibold rounded-lg hover:bg-primary-700 transition-colors">
          <ExternalLink size={11} /> Deploy Kiosk Guide
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KiosksPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('kiosks');
  const [kiosks, setKiosks] = useState<Kiosk[]>(MOCK_KIOSKS);
  const [printers, setPrinters] = useState<PrinterDevice[]>(MOCK_PRINTERS);
  const [peripherals] = useState<Peripheral[]>(MOCK_PERIPHERALS);
  const [showAddKiosk, setShowAddKiosk] = useState(false);
  const [showAddPrinter, setShowAddPrinter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState('just now');

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh('just now');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); setLastRefresh('just now'); }, 1200);
  };

  const handleAddKiosk = (k: Partial<Kiosk>) => {
    const newKiosk: Kiosk = {
      id: `KSK-00${kiosks.length + 1}`,
      name: k.name || 'New Kiosk',
      location: k.location || '—',
      site: k.site || 'HQ Mumbai',
      deviceType: k.deviceType || 'iPad',
      lastOnline: 'Never',
      battery: 0,
      assignedWorkflow: k.assignedWorkflow || 'Unassigned',
      status: 'Pairing Mode',
      ipAddress: '—',
      osVersion: '—',
      appVersion: '—',
    };
    setKiosks(prev => [...prev, newKiosk]);
    setShowAddKiosk(false);
  };

  const handleAddPrinter = (p: Partial<PrinterDevice>) => {
    const newPrinter: PrinterDevice = {
      id: `PRT-00${printers.length + 1}`,
      name: p.name || 'New Printer',
      model: p.model || 'Brother QL-820NWB',
      location: p.location || '—',
      site: p.site || 'HQ Mumbai',
      status: 'Connected',
      lastTestPrint: 'Never',
      connectionType: p.connectionType || 'Windows Print Service',
      printServiceStatus: 'Running',
    };
    setPrinters(prev => [...prev, newPrinter]);
    setShowAddPrinter(true);
  };

  const onlineCount = kiosks.filter(k => k.status === 'Online').length;

  return (
    <AppLayout>
      {showAddKiosk && <AddKioskModal onClose={() => setShowAddKiosk(false)} onSave={handleAddKiosk} />}
      {showAddPrinter && <AddPrinterModal onClose={() => setShowAddPrinter(false)} onSave={handleAddPrinter} />}

      <div className="px-6 py-5 max-w-screen-2xl mx-auto">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-bold text-text-primary flex items-center gap-2">
              <Monitor size={22} className="text-primary-600" />
              Kiosks &amp; Hardware
            </h1>
            <p className="text-[13px] text-text-secondary mt-1 max-w-xl">
              Manage kiosk devices, printers, and peripherals across all sites. Monitor real-time status, pair new hardware, and run diagnostics.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 h-9 px-4 border border-slate-200 text-[13px] font-medium text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <PlayCircle size={14} className="text-primary-600" /> Test Kiosk Flow
              <Tooltip text="Opens a simulated visitor kiosk preview using current paired devices." />
            </div>
            <button onClick={handleRefresh} disabled={refreshing}
              className="flex items-center gap-1.5 h-9 px-4 border border-slate-200 text-[13px] font-medium text-slate-600 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-60">
              <RefreshCw size={14} className={refreshing ? 'animate-spin text-primary-600' : ''} />
              Refresh All
            </button>
            <button onClick={() => setShowAddKiosk(true)}
              className="flex items-center gap-1.5 h-9 px-4 bg-primary-600 text-white text-[13px] font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm">
              <Plus size={14} /> Add Kiosk
            </button>
          </div>
        </div>

        {/* Tabs + Content + Panel */}
        <div className="flex gap-5 items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-5">
              {[
                { id: 'kiosks', label: 'Kiosks', icon: <Monitor size={14} />, count: kiosks.length },
                { id: 'printers', label: 'Printers & Peripherals', icon: <Printer size={14} />, count: printers.length + peripherals.length },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as MainTab)}
                  className={`flex items-center gap-2 px-5 py-3 text-[13px] font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  {tab.icon} {tab.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              {activeTab === 'kiosks' && (
                <KiosksTab kiosks={kiosks} onAddKiosk={() => setShowAddKiosk(true)} />
              )}
              {activeTab === 'printers' && (
                <PrintersTab printers={printers} peripherals={peripherals} onAddPrinter={() => setShowAddPrinter(true)} />
              )}
            </div>
          </div>

          {/* Right panel */}
          <HealthPanel kiosks={kiosks} printers={printers} />
        </div>

        {/* Footer note */}
        <p className="mt-6 text-[11px] text-slate-400 text-center">
          All kiosks run in locked Single App Mode / COSU. Printers use Windows Print Service (Brother QL-820NWB recommended). Hardware status is synced in real time with offline data sync support.
        </p>
      </div>
    </AppLayout>
  );
}
