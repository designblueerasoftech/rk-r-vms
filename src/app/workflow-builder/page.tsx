'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import {
  Search, ChevronDown, Eye, Save, Upload, X, GripVertical,
  Lock, Plus, AlertTriangle, Zap, ChevronUp, User,
  Phone, Mail, CreditCard, Camera, Building2, Target,
  ArrowDown, ArrowLeft, Settings2,
  Settings, Trash2, CircleCheck, Package, Car,
  Heart, FilePenLine, Type, List, SquareCheckBig, Calendar,
  PenTool, Users, ParkingCircle
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PaletteField {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  colorClass: string;
  bgClass: string;
}

interface PaletteCategory {
  id: string;
  label: string;
  fields: PaletteField[];
}

interface WorkflowField {
  id: string;
  label: string;
  mandatory?: boolean;
  verified?: boolean;
  visible?: boolean;
}

interface ConditionRule {
  condition: string;
  action: string;
  type: 'warning' | 'info';
}

interface WorkflowStep {
  id: string;
  number: number;
  title: string;
  fieldCount: number;
  fields: WorkflowField[];
  conditionRules?: ConditionRule[];
  color: string;
  droppableId: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const paletteCategories: PaletteCategory[] = [
  {
    id: 'identity',
    label: 'Identity & Contact',
    fields: [
      { id: 'full-name', label: 'Full Name', description: 'Visitor full name — mandatory', icon: <User className="w-3.5 h-3.5" />, colorClass: 'text-violet-600', bgClass: 'bg-violet-100' },
      { id: 'mobile', label: 'Mobile Number', description: 'OTP 2FA + WhatsApp delivery', icon: <Phone className="w-3.5 h-3.5" />, badge: 'OCR', colorClass: 'text-violet-600', bgClass: 'bg-violet-100' },
      { id: 'email', label: 'Email Address', description: 'Optional — used as fallback channel', icon: <Mail className="w-3.5 h-3.5" />, colorClass: 'text-violet-600', bgClass: 'bg-violet-100' },
      { id: 'id-type', label: 'ID Type & Number', description: 'Aadhaar, PAN, DL, Passport, Voter ID', icon: <CreditCard className="w-3.5 h-3.5" />, badge: 'OCR', colorClass: 'text-violet-600', bgClass: 'bg-violet-100' },
      { id: 'live-photo', label: 'Live Photo + Liveness', description: 'Front camera capture with liveness check', icon: <Camera className="w-3.5 h-3.5" />, badge: 'OCR', colorClass: 'text-violet-600', bgClass: 'bg-violet-100' },
    ],
  },
  {
    id: 'visit',
    label: 'Visit Context',
    fields: [
      { id: 'host-name', label: 'Host Name', description: 'Predictive search from AD/Okta/HRIS', icon: <Users className="w-3.5 h-3.5" />, colorClass: 'text-blue-600', bgClass: 'bg-blue-100' },
      { id: 'purpose', label: 'Purpose of Visit', description: 'Free text or dropdown options', icon: <Target className="w-3.5 h-3.5" />, colorClass: 'text-blue-600', bgClass: 'bg-blue-100' },
      { id: 'company', label: 'Company / Organisation', description: 'Representing company name', icon: <Building2 className="w-3.5 h-3.5" />, colorClass: 'text-blue-600', bgClass: 'bg-blue-100' },
      { id: 'items-carried', label: 'Items Carried / Assets', description: 'Laptop serial, tools, parcels', icon: <Package className="w-3.5 h-3.5" />, colorClass: 'text-blue-600', bgClass: 'bg-blue-100' },
    ],
  },
  {
    id: 'logistics',
    label: 'Logistics & Compliance',
    fields: [
      { id: 'vehicle-no', label: 'Vehicle Number', description: 'Vehicle registration + parking slot', icon: <Car className="w-3.5 h-3.5" />, colorClass: 'text-amber-600', bgClass: 'bg-amber-100' },
      { id: 'parking-slot', label: 'Parking Slot', description: 'Assigned parking bay number', icon: <ParkingCircle className="w-3.5 h-3.5" />, colorClass: 'text-amber-600', bgClass: 'bg-amber-100' },
      { id: 'health-declaration', label: 'Health Declaration', description: 'Screening — can trigger auto-block', icon: <Heart className="w-3.5 h-3.5" />, colorClass: 'text-amber-600', bgClass: 'bg-amber-100' },
      { id: 'document-signing', label: 'Document Signing', description: 'NDA / T&Cs with ConsentStamp eSignature', icon: <FilePenLine className="w-3.5 h-3.5" />, badge: 'OCR', colorClass: 'text-amber-600', bgClass: 'bg-amber-100' },
    ],
  },
  {
    id: 'custom',
    label: 'Custom Fields',
    fields: [
      { id: 'custom-text', label: 'Text Input', description: 'Single-line or multi-line text field', icon: <Type className="w-3.5 h-3.5" />, colorClass: 'text-teal-600', bgClass: 'bg-teal-100' },
      { id: 'custom-dropdown', label: 'Dropdown Select', description: 'Single or multi-select options list', icon: <List className="w-3.5 h-3.5" />, colorClass: 'text-teal-600', bgClass: 'bg-teal-100' },
      { id: 'custom-checkbox', label: 'Checkbox', description: 'Boolean yes/no or multi-check', icon: <SquareCheckBig className="w-3.5 h-3.5" />, colorClass: 'text-teal-600', bgClass: 'bg-teal-100' },
      { id: 'custom-date', label: 'Date Picker', description: 'Date or date-time selection', icon: <Calendar className="w-3.5 h-3.5" />, colorClass: 'text-teal-600', bgClass: 'bg-teal-100' },
      { id: 'custom-file', label: 'File Upload', description: 'PDF, image, or document upload', icon: <Upload className="w-3.5 h-3.5" />, colorClass: 'text-teal-600', bgClass: 'bg-teal-100' },
      { id: 'custom-signature', label: 'Signature Pad', description: 'Digital signature capture pad', icon: <PenTool className="w-3.5 h-3.5" />, colorClass: 'text-teal-600', bgClass: 'bg-teal-100' },
    ],
  },
];

const workflowSteps: WorkflowStep[] = [
  {
    id: 'step-1',
    number: 1,
    title: 'Invite Phase',
    fieldCount: 4,
    color: '#6C47FF',
    droppableId: 'step-invite',
    fields: [
      { id: 'cf-name', label: 'Full Name', mandatory: true, visible: true },
      { id: 'cf-mobile', label: 'Mobile Number', mandatory: true, verified: true, visible: true },
      { id: 'cf-email', label: 'Email Address', visible: true },
      { id: 'cf-company', label: 'Company / Organisation', visible: true },
    ],
  },
  {
    id: 'step-2',
    number: 2,
    title: 'Virtual Lobby (Pre-Check-in)',
    fieldCount: 4,
    color: '#00C9A7',
    droppableId: 'step-pre-checkin',
    fields: [
      { id: 'cf-id-type', label: 'ID Type & Number', mandatory: true, verified: true, visible: true },
      { id: 'cf-purpose', label: 'Purpose of Visit', mandatory: true, visible: true },
      { id: 'cf-health', label: 'Health Declaration', mandatory: true, visible: true },
      { id: 'cf-nda', label: 'NDA / Terms & Conditions', mandatory: true, visible: true },
    ],
    conditionRules: [
      { condition: 'IF Health Declaration = No', action: '→ Auto-block visitor', type: 'warning' },
    ],
  },
  {
    id: 'step-3',
    number: 3,
    title: 'Arrival / Kiosk',
    fieldCount: 3,
    color: '#F59E0B',
    droppableId: 'step-arrival',
    fields: [
      { id: 'cf-photo', label: 'Live Photo + Liveness Check', mandatory: true, verified: true, visible: true },
      { id: 'cf-host', label: 'Host Name', mandatory: true, visible: true },
      { id: 'cf-vehicle', label: 'Vehicle Number', visible: true },
    ],
    conditionRules: [
      { condition: 'IF Visitor Type = VIP', action: '→ Skip quiz + Auto-approve host escort', type: 'info' },
    ],
  },
];

const visitorTypes = ['Vendor', 'Employee', 'Guest', 'Contractor', 'VIP', 'Delivery'];

// ─── Toggle Component ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
        checked ? 'bg-[#6C47FF]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

// ─── Canvas Field Row ─────────────────────────────────────────────────────────

function CanvasFieldRow({
  field,
  isSelected,
  onClick,
}: {
  field: WorkflowField;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all duration-150 group ${
        isSelected
          ? 'border-[#6C47FF]/60 bg-[#6C47FF]/5 shadow-sm'
          : 'border-gray-200 bg-white hover:border-[#6C47FF]/40 hover:shadow-sm'
      }`}
    >
      <div className="text-gray-300 hover:text-gray-500 flex-shrink-0 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 truncate">{field.label}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {field.mandatory && (
          <span title="Mandatory" className="w-4 h-4 flex items-center justify-center">
            <Lock className="w-3 h-3 text-[#6C47FF]" />
          </span>
        )}
        {field.verified && (
          <span title="Verified (OCR/OTP)" className="w-4 h-4 flex items-center justify-center">
            <CircleCheck className="w-3 h-3 text-emerald-500" />
          </span>
        )}
        {field.visible && (
          <span title="Visible to visitor" className="w-4 h-4 flex items-center justify-center">
            <Eye className="w-3 h-3 text-gray-400" />
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          className="p-1 rounded-lg hover:bg-[#6C47FF]/10 text-gray-400 hover:text-[#6C47FF] transition-colors"
          title="Edit field properties"
          onClick={e => { e.stopPropagation(); onClick(); }}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
        <button
          className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="Remove field from step"
          onClick={e => e.stopPropagation()}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────

function StepCard({
  step,
  selectedFieldId,
  onFieldClick,
}: {
  step: WorkflowStep;
  selectedFieldId: string | null;
  onFieldClick: (fieldId: string, fieldLabel: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const isActive = selectedFieldId !== null && step.fields.some(f => f.id === selectedFieldId);

  return (
    <div
      className="rounded-2xl border-2 bg-white transition-all duration-200"
      style={{
        borderColor: isActive ? step.color : '#E5E7EB',
        boxShadow: isActive
          ? `0 10px 15px -3px ${step.color}26, 0 4px 6px -4px ${step.color}26`
          : 'none',
      }}
    >
      {/* Step Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0"
            style={{ background: step.color }}
          >
            {step.number}
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">{step.title}</h4>
            <p className="text-[10px] text-gray-400">{step.fieldCount} fields</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
            title="Add condition rule"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            title={collapsed ? 'Expand step' : 'Collapse step'}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Fields */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <div className="min-h-16 rounded-xl transition-all duration-150 space-y-2 p-2 border-2 border-dashed border-transparent">
            {step.fields.map(field => (
              <CanvasFieldRow
                key={field.id}
                field={field}
                isSelected={selectedFieldId === field.id}
                onClick={() => onFieldClick(field.id, field.label)}
              />
            ))}
          </div>

          {/* Condition Rules */}
          {step.conditionRules && step.conditionRules.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Condition Rules</p>
              {step.conditionRules.map((rule, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border border-dashed ${
                    rule.type === 'warning' ?'border-red-300 bg-red-50/60 text-red-700' :'border-violet-300 bg-violet-50/60 text-violet-700'
                  }`}
                >
                  <AlertTriangle
                    className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                      rule.type === 'warning' ? 'text-red-500' : 'text-violet-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{rule.condition}</p>
                    <p className="text-[10px] mt-0.5 opacity-80">{rule.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorkflowBuilderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['identity', 'visit', 'logistics', 'custom']);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedFieldLabel, setSelectedFieldLabel] = useState<string>('');
  const [visitorType, setVisitorType] = useState('Vendor');
  const [visitorTypeOpen, setVisitorTypeOpen] = useState(false);

  // Field Properties state
  const [fieldLabel, setFieldLabel] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const [isMandatory, setIsMandatory] = useState(true);
  const [visibleToHost, setVisibleToHost] = useState(true);
  const [visibleToVisitor, setVisibleToVisitor] = useState(true);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleFieldClick = (fieldId: string, label: string) => {
    setSelectedFieldId(fieldId);
    setSelectedFieldLabel(label);
    setFieldLabel(label);
    setPlaceholderText(`e.g. Enter ${label.toLowerCase()}`);
  };

  const filteredCategories = paletteCategories.map(cat => ({
    ...cat,
    fields: cat.fields.filter(f =>
      f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.fields.length > 0);

  return (
    <AppLayout>
      <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

        {/* ── Sub-Toolbar ── */}
        <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200 flex-shrink-0 gap-4">
          {/* Left: Back + Workflow Name + Status */}
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard">
              <button
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <button className="flex items-center gap-2 font-bold text-gray-900 hover:text-[#6C47FF] transition-colors min-w-0 group">
              <span className="truncate max-w-48">Vendor Onboarding Flow</span>
              <Settings2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#6C47FF] flex-shrink-0" />
            </button>
            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Draft
            </span>
          </div>

          {/* Center: Visitor Type */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
              <Users className="w-3.5 h-3.5" />
              <span>Visitor Type:</span>
            </div>
            <div className="w-44 relative">
              <button
                type="button"
                onClick={() => setVisitorTypeOpen(!visitorTypeOpen)}
                className="flex w-full cursor-pointer select-none items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition-all hover:border-[#6C47FF]/50"
              >
                <span className="truncate">{visitorType}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    visitorTypeOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {visitorTypeOpen && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  {visitorTypes.map(type => (
                    <button
                      key={type}
                      className={`flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors text-gray-700 hover:text-[#6C47FF] ${
                        visitorType === type
                          ? 'bg-[#6C47FF]/10 text-[#6C47FF] font-semibold'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => { setVisitorType(type); setVisitorTypeOpen(false); }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-all">
              <Eye className="w-3.5 h-3.5" />
              Preview as Visitor
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-all active:scale-95">
              <Save className="w-3.5 h-3.5" />
              Save Draft
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #6C47FF, #9B6DFF)' }}
            >
              <Upload className="w-3.5 h-3.5" />
              Publish Workflow
            </button>
          </div>
        </div>

        {/* ── Three-Panel Layout ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left: Field Palette ── */}
          <div className="w-64 xl:w-72 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white overflow-hidden">
            {/* Palette Header */}
            <div className="px-4 py-4 border-b border-gray-200">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Field Palette</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  placeholder="Search fields…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#6C47FF] focus:ring-2 focus:ring-[#6C47FF]/20"
                />
              </div>
            </div>

            {/* Palette Fields */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              {filteredCategories.map(cat => (
                <div key={cat.id} className="mb-2">
                  <button
                    className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors mb-1"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {cat.label}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                        expandedCategories.includes(cat.id) ? '' : '-rotate-90'
                      }`}
                    />
                  </button>
                  {expandedCategories.includes(cat.id) && (
                    <div>
                      {cat.fields.map(field => (
                        <div
                          key={field.id}
                          className="drag-field-item mb-1.5"
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              field.colorClass
                            } ${field.bgClass}`}
                          >
                            {field.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{field.label}</p>
                            <p className="text-[10px] text-gray-400 truncate leading-tight">{field.description}</p>
                          </div>
                          {field.badge && (
                            <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#6C47FF]/10 text-[#6C47FF]">
                              {field.badge}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Palette Footer */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                Drag fields into workflow steps on the canvas →
              </p>
            </div>
          </div>

          {/* ── Center: Workflow Canvas ── */}
          <div className="flex-1 overflow-y-auto bg-[#F8F9FC] px-6 py-6">
            {/* Canvas Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900">Workflow Canvas</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {workflowSteps.length} steps · drag fields from the palette to add them
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-all active:scale-95">
                  <Plus className="w-3.5 h-3.5" />
                  Add Step
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4 max-w-2xl mx-auto">
              {workflowSteps.map((step, index) => (
                <div key={step.id}>
                  <StepCard
                    step={step}
                    selectedFieldId={selectedFieldId}
                    onFieldClick={handleFieldClick}
                  />
                  {index < workflowSteps.length - 1 && (
                    <div className="flex justify-center my-2">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-px h-4 bg-gray-300" />
                        <ArrowDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Field Properties Panel ── */}
          <div className="w-72 xl:w-80 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
            {selectedFieldId ? (
              <>
                {/* Properties Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#6C47FF]/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-sm bg-[#6C47FF]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">Field Properties</p>
                      <p className="text-[10px] text-[#6C47FF] font-medium truncate max-w-32">{selectedFieldLabel}</p>
                    </div>
                  </div>
                  <button
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"
                    onClick={() => setSelectedFieldId(null)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Properties Form */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-4 py-4 space-y-4">
                    {/* Field Label */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1.5">Field Label</label>
                      <input
                        type="text"
                        value={fieldLabel}
                        onChange={e => setFieldLabel(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-900 outline-none transition-all focus:border-[#6C47FF] focus:ring-2 focus:ring-[#6C47FF]/20"
                      />
                    </div>

                    {/* Placeholder Text */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1.5">Placeholder Text</label>
                      <input
                        type="text"
                        value={placeholderText}
                        onChange={e => setPlaceholderText(e.target.value)}
                        placeholder="e.g. Enter your full name"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-400 placeholder:text-gray-400 outline-none transition-all focus:border-[#6C47FF] focus:ring-2 focus:ring-[#6C47FF]/20"
                      />
                    </div>

                    {/* Default Value */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1.5">Default Value</label>
                      <input
                        type="text"
                        value={defaultValue}
                        onChange={e => setDefaultValue(e.target.value)}
                        placeholder="Leave blank for no default"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-400 placeholder:text-gray-400 outline-none transition-all focus:border-[#6C47FF] focus:ring-2 focus:ring-[#6C47FF]/20"
                      />
                      <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                        Auto-filled from previous visit if return visitor matches
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-[11px] font-semibold text-gray-600 mb-3">Visibility &amp; Behaviour</p>

                      {/* Mandatory */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-2">
                          <Lock className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[12px] font-semibold text-gray-800">Mandatory</p>
                            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                              Visitor must fill this field to proceed
                            </p>
                          </div>
                        </div>
                        <Toggle checked={isMandatory} onChange={() => setIsMandatory(!isMandatory)} />
                      </div>

                      {/* Visible to Host */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-2">
                          <User className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[12px] font-semibold text-gray-800">Visible to Host</p>
                            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                              Host can see this field in notifications
                            </p>
                          </div>
                        </div>
                        <Toggle checked={visibleToHost} onChange={() => setVisibleToHost(!visibleToHost)} />
                      </div>

                      {/* Visible to Visitor */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <Eye className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[12px] font-semibold text-gray-800">Visible to Visitor</p>
                            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                              Shown to visitor during check-in flow
                            </p>
                          </div>
                        </div>
                        <Toggle checked={visibleToVisitor} onChange={() => setVisibleToVisitor(!visibleToVisitor)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Properties Footer */}
                <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Changes auto-saved to draft — publish to go live
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Settings2 className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-500">Select a field</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Click any field on the canvas to configure its properties here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
