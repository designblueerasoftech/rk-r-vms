'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Briefcase, HardHat, UserCheck, Star, Truck, Shield, Users, Plus, Clock,
  FileText, ShieldCheck, CheckCircle, AlertTriangle, Eye, CreditCard, X,
  Pencil, Trash2, Tag,
} from 'lucide-react';

interface ComplianceTag {
  label: string;
  color: 'blue' | 'orange' | 'red' | 'green' | 'purple';
}

interface ComplianceRequirement {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface VisitorCategory {
  id: string;
  name: string;
  code: string;
  icon: React.ReactNode;
  iconBg: string;
  tier: string;
  tierColor: 'standard' | 'enhanced' | 'restricted' | 'vip';
  description: string;
  onSite: number;
  totalVisits: number;
  complianceTags: ComplianceTag[];
  maxDuration: string;
  maxDurationMins: number;
  active: boolean;
  compliance: ComplianceRequirement[];
  accessZones: string[];
  acceptedIdProofs: string[];
  ndaRequired: boolean;
  safetyInduction: boolean;
  escortRequired: boolean;
  preRegistration: boolean;
  hostApproval: boolean;
}

const tierConfig = {
  standard: { label: 'Standard', bg: 'bg-slate-100', text: 'text-slate-600' },
  enhanced: { label: 'Enhanced', bg: 'bg-amber-100', text: 'text-amber-700' },
  restricted: { label: 'Restricted', bg: 'bg-red-100', text: 'text-red-600' },
  vip: { label: 'VIP', bg: 'bg-purple-100', text: 'text-purple-700' },
};

const tagConfig: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  green: { bg: 'bg-green-50', text: 'text-green-700' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700' },
};

function makeCompliance(ndaOn: boolean, inductionOn: boolean, hostOn: boolean, watchOn: boolean, photoOn: boolean, idOn: boolean): ComplianceRequirement[] {
  return [
    { id: 'nda', label: 'NDA Required', description: 'Visitor must sign NDA before entry', icon: <FileText size={16} />, enabled: ndaOn },
    { id: 'induction', label: 'Induction Required', description: 'Safety induction mandatory', icon: <ShieldCheck size={16} />, enabled: inductionOn },
    { id: 'host', label: 'Host Approval', description: 'Requires host to approve visit', icon: <CheckCircle size={16} />, enabled: hostOn },
    { id: 'watchlist', label: 'Watchlist Screening', description: 'Screen against watchlist', icon: <AlertTriangle size={16} />, enabled: watchOn },
    { id: 'photo', label: 'Photo Capture', description: 'Capture visitor photo', icon: <Eye size={16} />, enabled: photoOn },
    { id: 'id', label: 'ID Verification', description: 'Verify government-issued ID', icon: <CreditCard size={16} />, enabled: idOn },
  ];
}

const initialCategories: VisitorCategory[] = [
  {
    id: 'vendor', name: 'Vendor', code: 'VEND',
    icon: <Briefcase size={20} />, iconBg: 'bg-blue-100 text-blue-600',
    tier: 'Standard', tierColor: 'standard',
    description: 'External vendors, service providers, and business partners visiting for meetings or demos.',
    onSite: 4, totalVisits: 312,
    complianceTags: [{ label: 'NDA', color: 'blue' }, { label: 'Pre-Reg', color: 'green' }],
    maxDuration: 'Max 8 hours', maxDurationMins: 480, active: true,
    compliance: makeCompliance(true, false, true, false, true, false),
    accessZones: ['Reception', 'Meeting Rooms', 'Cafeteria'],
    acceptedIdProofs: ['Aadhaar', 'Passport', 'Driving Licence'],
    ndaRequired: true, safetyInduction: false, escortRequired: false, preRegistration: true, hostApproval: true,
  },
  {
    id: 'contractor', name: 'Contractor', code: 'CONT',
    icon: <HardHat size={20} />, iconBg: 'bg-amber-100 text-amber-600',
    tier: 'Enhanced', tierColor: 'enhanced',
    description: 'External contractors and service providers working on-site.',
    onSite: 5, totalVisits: 189,
    complianceTags: [{ label: 'NDA', color: 'blue' }, { label: 'Induction', color: 'orange' }, { label: 'Escort', color: 'red' }, { label: 'Pre-Reg', color: 'green' }],
    maxDuration: 'Max 12 hours', maxDurationMins: 720, active: true,
    compliance: makeCompliance(true, true, true, true, true, true),
    accessZones: ['Reception', 'Work Areas', 'Loading Bay'],
    acceptedIdProofs: ['Aadhaar', 'Driving Licence'],
    ndaRequired: true, safetyInduction: true, escortRequired: true, preRegistration: true, hostApproval: true,
  },
  {
    id: 'interviewee', name: 'Interviewee', code: 'INTV',
    icon: <UserCheck size={20} />, iconBg: 'bg-purple-100 text-purple-600',
    tier: 'Standard', tierColor: 'standard',
    description: 'Candidates attending job interviews, assessments, or HR-related visits.',
    onSite: 2, totalVisits: 94,
    complianceTags: [],
    maxDuration: 'Max 4 hours', maxDurationMins: 240, active: true,
    compliance: makeCompliance(false, false, true, false, true, false),
    accessZones: ['Reception', 'HR Floor'],
    acceptedIdProofs: ['Aadhaar', 'Passport'],
    ndaRequired: false, safetyInduction: false, escortRequired: false, preRegistration: true, hostApproval: true,
  },
  {
    id: 'vip', name: 'VIP / Executive', code: 'VIP',
    icon: <Star size={20} />, iconBg: 'bg-yellow-100 text-yellow-600',
    tier: 'Standard', tierColor: 'standard',
    description: 'Board members, investors, senior executives, and high-profile guests.',
    onSite: 1, totalVisits: 47,
    complianceTags: [{ label: 'Escort', color: 'red' }, { label: 'Pre-Reg', color: 'green' }],
    maxDuration: 'Max Unlimited', maxDurationMins: 0, active: true,
    compliance: makeCompliance(false, false, true, true, true, true),
    accessZones: ['All Zones'],
    acceptedIdProofs: ['Passport', 'Driving Licence'],
    ndaRequired: false, safetyInduction: false, escortRequired: true, preRegistration: true, hostApproval: false,
  },
  {
    id: 'delivery', name: 'Delivery / Courier', code: 'DLVR',
    icon: <Truck size={20} />, iconBg: 'bg-teal-100 text-teal-600',
    tier: 'Standard', tierColor: 'standard',
    description: 'Parcel delivery, courier services, and logistics personnel.',
    onSite: 1, totalVisits: 521,
    complianceTags: [],
    maxDuration: 'Max 30 minutes', maxDurationMins: 30, active: true,
    compliance: makeCompliance(false, false, false, true, true, true),
    accessZones: ['Reception', 'Loading Bay'],
    acceptedIdProofs: ['Aadhaar', 'Driving Licence', 'Passport'],
    ndaRequired: false, safetyInduction: false, escortRequired: false, preRegistration: false, hostApproval: false,
  },
  {
    id: 'govt', name: 'Govt Official', code: 'GOVT',
    icon: <Shield size={20} />, iconBg: 'bg-red-100 text-red-600',
    tier: 'Restricted', tierColor: 'restricted',
    description: 'Government inspectors, tax officials, regulatory auditors, and law enforcement.',
    onSite: 0, totalVisits: 12,
    complianceTags: [{ label: 'Escort', color: 'red' }],
    maxDuration: 'Max As required', maxDurationMins: 0, active: true,
    compliance: makeCompliance(false, false, true, true, true, true),
    accessZones: ['Reception', 'Conference Room', 'Compliance Office'],
    acceptedIdProofs: ['Govt ID', 'Passport'],
    ndaRequired: false, safetyInduction: false, escortRequired: true, preRegistration: false, hostApproval: true,
  },
  {
    id: 'general', name: 'General Visitor', code: 'GEN',
    icon: <Users size={20} />, iconBg: 'bg-slate-100 text-slate-600',
    tier: 'Standard', tierColor: 'standard',
    description: 'Personal visitors, family members, and general guests.',
    onSite: 0, totalVisits: 78,
    complianceTags: [],
    maxDuration: 'Max 4 hours', maxDurationMins: 240, active: false,
    compliance: makeCompliance(false, false, false, false, true, false),
    accessZones: ['Reception', 'Cafeteria'],
    acceptedIdProofs: ['Aadhaar', 'Driving Licence', 'Passport'],
    ndaRequired: false, safetyInduction: false, escortRequired: false, preRegistration: false, hostApproval: false,
  },
];

/* ─── Toggle Switch ─────────────────────────────────────────────────────── */
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-primary-600' : 'bg-slate-300'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

/* ─── Tier Badge ─────────────────────────────────────────────────────────── */
function TierBadge({ tier, color }: { tier: string; color: keyof typeof tierConfig }) {
  const cfg = tierConfig[color];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      {tier}
    </span>
  );
}

/* ─── Compliance Tag Badge ───────────────────────────────────────────────── */
function ComplianceTagBadge({ tag }: { tag: ComplianceTag }) {
  const cfg = tagConfig[tag.color];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${cfg.bg} ${cfg.text} border-current/20`}>
      {tag.label}
    </span>
  );
}

/* ─── Visitor Category Card ──────────────────────────────────────────────── */
function VisitorCategoryCard({
  category,
  onToggleActive,
  onView,
  onDelete,
}: {
  category: VisitorCategory;
  onToggleActive: (id: string) => void;
  onView: (category: VisitorCategory) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${category.iconBg}`}>
            {category.icon}
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-slate-800 leading-tight">{category.name}</h3>
            <div className="mt-1">
              <TierBadge tier={category.tier} color={category.tierColor} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <ToggleSwitch enabled={category.active} onChange={() => onToggleActive(category.id)} />
          <span className={`text-[10px] font-medium ${category.active ? 'text-green-600' : 'text-slate-400'}`}>
            {category.active ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-primary-600 leading-relaxed">
        {category.description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
          <Users size={13} className="text-slate-400" />
          <span className="font-semibold text-slate-700">{category.onSite}</span>
          <span>on-site</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
          <span className="font-semibold text-slate-700">{category.totalVisits}</span>
          <span>total visits</span>
        </div>
      </div>

      {/* Compliance Tags */}
      {category.complianceTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {category.complianceTags.map((tag) => (
            <ComplianceTagBadge key={tag.label} tag={tag} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <Clock size={12} className="text-slate-400" />
          <span>{category.maxDuration}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(category)}
            className="flex items-center gap-1 text-[12px] font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-md transition-colors"
          >
            <Pencil size={11} />
            Edit/View
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="flex items-center justify-center w-7 h-7 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
            title="Delete category"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Category Card ──────────────────────────────────────────────────── */
function AddCategoryCard() {
  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-5 flex flex-col items-center justify-center gap-2 min-h-[200px] hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-200 cursor-pointer group">
      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
        <Plus size={20} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
      </div>
      <p className="text-[14px] font-semibold text-slate-600 group-hover:text-primary-700 transition-colors">Add Category</p>
      <p className="text-[12px] text-slate-400 group-hover:text-primary-500 transition-colors">Define a new visitor type</p>
    </div>
  );
}

/* ─── Requirement Row ────────────────────────────────────────────────────── */
function RequirementRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-[13px] text-slate-700">{label}</span>
      <span className={`flex items-center gap-1 text-[12px] font-medium ${value ? 'text-green-600' : 'text-slate-400'}`}>
        {value ? (
          <><CheckCircle size={13} /> Yes</>
        ) : (
          <><X size={13} /> No</>
        )}
      </span>
    </div>
  );
}

/* ─── Detail Panel ───────────────────────────────────────────────────────── */
interface DetailPanelProps {
  category: VisitorCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (category: VisitorCategory) => void;
  onDelete: (id: string) => void;
}

function DetailPanel({ category, isOpen, onClose, onEdit, onDelete }: DetailPanelProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen && category ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen && category ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {category && (
          <>
            {/* Panel Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${category.iconBg}`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-slate-800 leading-tight">{category.name}</h2>
                  <div className="mt-1">
                    <TierBadge tier={category.tier} color={category.tierColor} />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0 mt-0.5"
              >
                <X size={17} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                  <p className="text-[26px] font-bold text-slate-800 leading-none">{category.onSite}</p>
                  <p className="text-[12px] text-slate-500 mt-1">Currently On-Site</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                  <p className="text-[26px] font-bold text-slate-800 leading-none">{category.totalVisits}</p>
                  <p className="text-[12px] text-slate-500 mt-1">Total Visits</p>
                </div>
              </div>

              {/* Access Zones */}
              <div>
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Access Zones</h3>
                <div className="flex flex-wrap gap-1.5">
                  {category.accessZones.map((zone) => (
                    <span key={zone} className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {zone}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accepted ID Proofs */}
              <div>
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Accepted ID Proofs</h3>
                <div className="flex flex-wrap gap-1.5">
                  {category.acceptedIdProofs.map((proof) => (
                    <span key={proof} className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {proof}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Requirements</h3>
                <div className="bg-slate-50 rounded-xl border border-slate-100 px-4 py-1">
                  <RequirementRow label="NDA Required" value={category.ndaRequired} />
                  <RequirementRow label="Safety Induction" value={category.safetyInduction} />
                  <RequirementRow label="Escort Required" value={category.escortRequired} />
                  <RequirementRow label="Pre-Registration" value={category.preRegistration} />
                  <RequirementRow label="Host Approval" value={category.hostApproval} />
                </div>
              </div>

              {/* Maximum Duration */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3">
                <Clock size={16} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 leading-none mb-0.5">Maximum Duration</p>
                  <p className="text-[15px] font-bold text-slate-800">{category.maxDuration.replace('Max ', '')}</p>
                </div>
              </div>

            </div>

            {/* Panel Footer */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-200 shrink-0">
              <button
                onClick={() => onEdit(category)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={() => { onDelete(category.id); onClose(); }}
                className="w-11 h-10 flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors"
                title="Delete category"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ─── Edit Drawer ────────────────────────────────────────────────────────── */
interface EditDrawerProps {
  category: VisitorCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: VisitorCategory) => void;
}

function EditDrawer({ category, isOpen, onClose, onSave }: EditDrawerProps) {
  const [form, setForm] = useState<VisitorCategory | null>(null);
  const [zonesInput, setZonesInput] = useState('');
  const [idProofsInput, setIdProofsInput] = useState('');

  React.useEffect(() => {
    if (category) {
      setForm({ ...category, compliance: category.compliance.map((c) => ({ ...c })) });
      setZonesInput('');
      setIdProofsInput('');
    }
  }, [category]);

  if (!form) return null;

  const addZone = () => {
    const trimmed = zonesInput.trim();
    if (trimmed && !form.accessZones.includes(trimmed)) {
      setForm({ ...form, accessZones: [...form.accessZones, trimmed] });
    }
    setZonesInput('');
  };

  const removeZone = (zone: string) => {
    setForm({ ...form, accessZones: form.accessZones.filter((z) => z !== zone) });
  };

  const addIdProof = () => {
    const trimmed = idProofsInput.trim();
    if (trimmed && !form.acceptedIdProofs.includes(trimmed)) {
      setForm({ ...form, acceptedIdProofs: [...form.acceptedIdProofs, trimmed] });
    }
    setIdProofsInput('');
  };

  const removeIdProof = (proof: string) => {
    setForm({ ...form, acceptedIdProofs: form.acceptedIdProofs.filter((p) => p !== proof) });
  };

  const handleSave = () => {
    if (form) {
      onSave(form);
    }
  };

  const tierOptions: { value: 'standard' | 'enhanced' | 'restricted' | 'vip'; label: string; desc: string; color: string }[] = [
    { value: 'standard', label: 'Standard', desc: 'Basic access level', color: 'bg-slate-50 border-slate-400' },
    { value: 'enhanced', label: 'Enhanced', desc: 'Additional requirements', color: 'bg-amber-50 border-amber-400' },
    { value: 'restricted', label: 'Restricted', desc: 'Strict access control', color: 'bg-red-50 border-red-400' },
    { value: 'vip', label: 'VIP', desc: 'Priority treatment', color: 'bg-purple-50 border-purple-400' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Panel Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${form.iconBg}`}>
              {form.icon}
            </div>
            <div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-[16px] font-bold text-slate-800 leading-tight bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary-400 focus:outline-none w-full transition-colors"
              />
              <div className="mt-1">
                <TierBadge tier={form.tier} color={form.tierColor} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0 mt-0.5"
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Tier Selection */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tier</h3>
            <div className="grid grid-cols-2 gap-2">
              {tierOptions.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => setForm({ ...form, tierColor: tier.value, tier: tier.label })}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                    form.tierColor === tier.value
                      ? tier.color
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                    form.tierColor === tier.value ? 'border-primary-600 bg-primary-600' : 'border-slate-300'
                  }`}>
                    {form.tierColor === tier.value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-slate-800">{tier.label}</p>
                    <p className="text-[11px] text-slate-500 leading-tight">{tier.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Access Zones */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Access Zones</h3>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.accessZones.map((zone) => (
                <span key={zone} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {zone}
                  <button type="button" onClick={() => removeZone(zone)} className="ml-0.5 text-blue-400 hover:text-blue-700 transition-colors">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={zonesInput}
                onChange={(e) => setZonesInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addZone(); } }}
                placeholder="Add zone and press Enter"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
              />
              <button type="button" onClick={addZone} className="px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-[12px] font-semibold transition-colors">
                Add
              </button>
            </div>
          </div>

          {/* Accepted ID Proofs */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Accepted ID Proofs</h3>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.acceptedIdProofs.map((proof) => (
                <span key={proof} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  {proof}
                  <button type="button" onClick={() => removeIdProof(proof)} className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={idProofsInput}
                onChange={(e) => setIdProofsInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIdProof(); } }}
                placeholder="Add ID proof and press Enter"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
              />
              <button type="button" onClick={addIdProof} className="px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-[12px] font-semibold transition-colors">
                Add
              </button>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Requirements</h3>
            <div className="bg-slate-50 rounded-xl border border-slate-100 px-4 py-1">
              {[
                { key: 'ndaRequired', label: 'NDA Required' },
                { key: 'safetyInduction', label: 'Safety Induction' },
                { key: 'escortRequired', label: 'Escort Required' },
                { key: 'preRegistration', label: 'Pre-Registration' },
                { key: 'hostApproval', label: 'Host Approval' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                  <span className="text-[13px] text-slate-700">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[12px] font-medium ${(form[key as keyof VisitorCategory] as boolean) ? 'text-green-600' : 'text-slate-400'}`}>
                      {(form[key as keyof VisitorCategory] as boolean) ? 'Yes' : 'No'}
                    </span>
                    <ToggleSwitch
                      enabled={form[key as keyof VisitorCategory] as boolean}
                      onChange={(v) => setForm({ ...form, [key]: v })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maximum Duration */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3">
            <Clock size={16} className="text-slate-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] text-slate-400 leading-none mb-1">Maximum Duration</p>
              <input
                type="number"
                min={0}
                value={form.maxDurationMins}
                onChange={(e) => setForm({ ...form, maxDurationMins: Number(e.target.value), maxDuration: `Max ${e.target.value} minutes` })}
                className="w-full bg-transparent text-[15px] font-bold text-slate-800 focus:outline-none border-b border-transparent hover:border-slate-300 focus:border-primary-400 transition-colors"
                placeholder="Enter minutes"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">minutes</p>
            </div>
          </div>

        </div>

        {/* Panel Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-200 shrink-0">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Pencil size={14} />
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="w-11 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            title="Cancel"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── New Category Modal ─────────────────────────────────────────────────── */
interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newCategory: VisitorCategory) => void;
}

const defaultNewForm = (): Omit<VisitorCategory, 'id' | 'icon' | 'onSite' | 'totalVisits' | 'complianceTags' | 'compliance'> => ({
  name: '',
  code: '',
  iconBg: 'bg-slate-100 text-slate-600',
  tier: 'Standard',
  tierColor: 'standard',
  description: '',
  maxDuration: 'Max 8 hours',
  maxDurationMins: 480,
  active: true,
  accessZones: [],
  acceptedIdProofs: [],
  ndaRequired: false,
  safetyInduction: false,
  escortRequired: false,
  preRegistration: false,
  hostApproval: false,
});

function NewCategoryModal({ isOpen, onClose, onSave }: NewCategoryModalProps) {
  const [form, setForm] = useState(defaultNewForm());
  const [zonesInput, setZonesInput] = useState('');
  const [idProofsInput, setIdProofsInput] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setForm(defaultNewForm());
      setZonesInput('');
      setIdProofsInput('');
    }
  }, [isOpen]);

  const addZone = () => {
    const trimmed = zonesInput.trim();
    if (trimmed && !form.accessZones.includes(trimmed)) {
      setForm({ ...form, accessZones: [...form.accessZones, trimmed] });
    }
    setZonesInput('');
  };

  const removeZone = (zone: string) => {
    setForm({ ...form, accessZones: form.accessZones.filter((z) => z !== zone) });
  };

  const addIdProof = () => {
    const trimmed = idProofsInput.trim();
    if (trimmed && !form.acceptedIdProofs.includes(trimmed)) {
      setForm({ ...form, acceptedIdProofs: [...form.acceptedIdProofs, trimmed] });
    }
    setIdProofsInput('');
  };

  const removeIdProof = (proof: string) => {
    setForm({ ...form, acceptedIdProofs: form.acceptedIdProofs.filter((p) => p !== proof) });
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const newCategory: VisitorCategory = {
      ...form,
      id: form.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      icon: <Tag size={20} />,
      onSite: 0,
      totalVisits: 0,
      complianceTags: [],
      compliance: makeCompliance(
        form.ndaRequired,
        form.safetyInduction,
        form.hostApproval,
        false,
        false,
        false,
      ),
    };
    onSave(newCategory);
  };

  const tierOptions: { value: 'standard' | 'enhanced' | 'restricted' | 'vip'; label: string; desc: string; color: string }[] = [
    { value: 'standard', label: 'Standard', desc: 'Basic access level', color: 'bg-slate-50 border-slate-400' },
    { value: 'enhanced', label: 'Enhanced', desc: 'Additional requirements', color: 'bg-amber-50 border-amber-400' },
    { value: 'restricted', label: 'Restricted', desc: 'Strict access control', color: 'bg-red-50 border-red-400' },
    { value: 'vip', label: 'VIP', desc: 'Priority treatment', color: 'bg-purple-50 border-purple-400' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[90vh] flex flex-col pointer-events-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                <Plus size={18} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-slate-800 leading-tight">New Visitor Type</h2>
                <p className="text-[12px] text-slate-500">Fill in the details to create a new category</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={17} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Name & Code */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Vendor"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VEND"
                  maxLength={6}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of this visitor type..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition resize-none"
              />
            </div>

            {/* Tier Selection */}
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tier</h3>
              <div className="grid grid-cols-2 gap-2">
                {tierOptions.map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setForm({ ...form, tierColor: tier.value, tier: tier.label })}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                      form.tierColor === tier.value
                        ? tier.color
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                      form.tierColor === tier.value ? 'border-primary-600 bg-primary-600' : 'border-slate-300'
                    }`}>
                      {form.tierColor === tier.value && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-slate-800">{tier.label}</p>
                      <p className="text-[11px] text-slate-500 leading-tight">{tier.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Access Zones */}
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Access Zones</h3>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.accessZones.map((zone) => (
                  <span key={zone} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {zone}
                    <button type="button" onClick={() => removeZone(zone)} className="ml-0.5 text-blue-400 hover:text-blue-700 transition-colors">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={zonesInput}
                  onChange={(e) => setZonesInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addZone(); } }}
                  placeholder="Add zone and press Enter"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
                />
                <button type="button" onClick={addZone} className="px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-[12px] font-semibold transition-colors">
                  Add
                </button>
              </div>
            </div>

            {/* Accepted ID Proofs */}
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Accepted ID Proofs</h3>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.acceptedIdProofs.map((proof) => (
                  <span key={proof} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {proof}
                    <button type="button" onClick={() => removeIdProof(proof)} className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={idProofsInput}
                  onChange={(e) => setIdProofsInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIdProof(); } }}
                  placeholder="Add ID proof and press Enter"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
                />
                <button type="button" onClick={addIdProof} className="px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-[12px] font-semibold transition-colors">
                  Add
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Requirements</h3>
              <div className="bg-slate-50 rounded-xl border border-slate-100 px-4 py-1">
                {[
                  { key: 'ndaRequired', label: 'NDA Required' },
                  { key: 'safetyInduction', label: 'Safety Induction' },
                  { key: 'escortRequired', label: 'Escort Required' },
                  { key: 'preRegistration', label: 'Pre-Registration' },
                  { key: 'hostApproval', label: 'Host Approval' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                    <span className="text-[13px] text-slate-700">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[12px] font-medium ${(form[key as keyof typeof form] as boolean) ? 'text-green-600' : 'text-slate-400'}`}>
                        {(form[key as keyof typeof form] as boolean) ? 'Yes' : 'No'}
                      </span>
                      <ToggleSwitch
                        enabled={form[key as keyof typeof form] as boolean}
                        onChange={(v) => setForm({ ...form, [key]: v })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Maximum Duration */}
            <div className="bg-slate-50 rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3">
              <Clock size={16} className="text-slate-400 shrink-0" />
              <div className="flex-1">
                <p className="text-[11px] text-slate-400 leading-none mb-1">Maximum Duration</p>
                <input
                  type="number"
                  min={0}
                  value={form.maxDurationMins}
                  onChange={(e) => setForm({ ...form, maxDurationMins: Number(e.target.value), maxDuration: `Max ${e.target.value} minutes` })}
                  className="w-full bg-transparent text-[15px] font-bold text-slate-800 focus:outline-none border-b border-transparent hover:border-slate-300 focus:border-primary-400 transition-colors"
                  placeholder="Enter minutes"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">minutes (0 = unlimited)</p>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between bg-slate-50 rounded-xl border border-slate-100 px-4 py-3">
              <div>
                <p className="text-[13px] font-semibold text-slate-700">Active</p>
                <p className="text-[11px] text-slate-400">Enable this visitor type immediately</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[12px] font-medium ${form.active ? 'text-green-600' : 'text-slate-400'}`}>
                  {form.active ? 'Enabled' : 'Disabled'}
                </span>
                <ToggleSwitch enabled={form.active} onChange={(v) => setForm({ ...form, active: v })} />
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-200 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.name.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Plus size={14} />
              Create Visitor Type
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function VisitorTypesPage() {
  const [categories, setCategories] = useState<VisitorCategory[]>(initialCategories);
  const [viewingCategory, setViewingCategory] = useState<VisitorCategory | null>(null);
  const [editingCategory, setEditingCategory] = useState<VisitorCategory | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);

  const handleToggleActive = (id: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const handleView = (category: VisitorCategory) => {
    setViewingCategory(category);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setTimeout(() => setViewingCategory(null), 300);
  };

  const handleEditFromDetail = (category: VisitorCategory) => {
    setDetailOpen(false);
    setTimeout(() => {
      setEditingCategory(category);
      setEditOpen(true);
    }, 300);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setTimeout(() => setEditingCategory(null), 300);
  };

  const handleSave = (updated: VisitorCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    handleCloseEdit();
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreateCategory = (newCategory: VisitorCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    setNewCategoryOpen(false);
  };

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Users size={20} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-slate-800 leading-tight">Visitor Types</h1>
              <p className="text-[13px] text-slate-500 mt-0.5">Define visitor types, access rules, and compliance requirements</p>
            </div>
          </div>
          <button
            onClick={() => setNewCategoryOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus size={15} />
            New Category
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((category) => (
            <VisitorCategoryCard
              key={category.id}
              category={category}
              onToggleActive={handleToggleActive}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
          <AddCategoryCard />
        </div>
      </div>

      {/* Detail Panel */}
      <DetailPanel
        category={viewingCategory}
        isOpen={detailOpen}
        onClose={handleCloseDetail}
        onEdit={handleEditFromDetail}
        onDelete={handleDelete}
      />

      {/* Edit Drawer */}
      <EditDrawer
        category={editingCategory}
        isOpen={editOpen}
        onClose={handleCloseEdit}
        onSave={handleSave}
      />

      {/* New Category Modal */}
      <NewCategoryModal
        isOpen={newCategoryOpen}
        onClose={() => setNewCategoryOpen(false)}
        onSave={handleCreateCategory}
      />
    </AppLayout>
  );
}
