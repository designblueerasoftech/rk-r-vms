'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, ChevronDown, ChevronUp, GripVertical, Lock, Eye, EyeOff, CheckCircle, AlertTriangle, X, Save, Upload, ArrowLeft, Zap, Settings, User, Phone, Mail, CreditCard, Camera, FileText, Users, Shield, Hash, Calendar, ToggleLeft, List, Type, Star, Clipboard, Video, HelpCircle, BookOpen, Heart, Play, Clock, CheckSquare } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaletteField {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  category: string;
}

interface CanvasField {
  id: string;
  paletteId: string;
  label: string;
  icon: React.ReactNode;
  mandatory: boolean;
  visibleToHost: boolean;
  visibleToVisitor: boolean;
  locked?: boolean;
  verified?: boolean;
}

interface ConditionRule {
  id: string;
  condition: string;
  action: string;
  type: 'warning' | 'info';
}

interface WorkflowStep {
  id: string;
  number: number;
  title: string;
  color: string;
  fields: CanvasField[];
  conditionRules: ConditionRule[];
  collapsed: boolean;
}

interface FieldProperties {
  fieldId: string;
  stepId: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  mandatory: boolean;
  visibleToHost: boolean;
  visibleToVisitor: boolean;
}

// ─── Palette Data ─────────────────────────────────────────────────────────────

const paletteCategories: { id: string; label: string; fields: PaletteField[] }[] = [
  {
    id: 'identity',
    label: 'IDENTITY & CONTACT',
    fields: [
      { id: 'full-name', label: 'Full Name', description: 'Visitor full name — mandatory', icon: <User size={15} />, category: 'identity' },
      { id: 'mobile-number', label: 'Mobile Number', description: 'OTP 2FA + WhatsApp delivery', icon: <Phone size={15} />, badge: 'OCR', category: 'identity' },
      { id: 'email-address', label: 'Email Address', description: 'Optional — used as fallback channel', icon: <Mail size={15} />, category: 'identity' },
      { id: 'id-type-number', label: 'ID Type & Number', description: 'Aadhaar, PAN, DL, Passport, V...', icon: <CreditCard size={15} />, badge: 'OCR', category: 'identity' },
      { id: 'live-photo', label: 'Live Photo + Liveness', description: 'Front camera capture with liven...', icon: <Camera size={15} />, badge: 'OCR', category: 'identity' },
      { id: 'company-org', label: 'Company / Organisation', description: 'Visitor company name', icon: <Users size={15} />, category: 'identity' },
      { id: 'vehicle-number', label: 'Vehicle Number', description: 'Optional vehicle registration', icon: <Hash size={15} />, category: 'identity' },
    ],
  },
  {
    id: 'visit',
    label: 'VISIT CONTEXT',
    fields: [
      { id: 'host-name', label: 'Host Name', description: 'Predictive search from AD/Okta/HRIS', icon: <User size={15} />, category: 'visit' },
      { id: 'purpose-of-visit', label: 'Purpose of Visit', description: 'Free text or dropdown options', icon: <FileText size={15} />, category: 'visit' },
      { id: 'health-declaration', label: 'Health Declaration', description: 'Symptom checklist with auto-block', icon: <Shield size={15} />, category: 'visit' },
      { id: 'nda-terms', label: 'NDA / Terms & Conditions', description: 'Digital signature or checkbox', icon: <Clipboard size={15} />, category: 'visit' },
      { id: 'expected-duration', label: 'Expected Duration', description: 'Visit duration estimate', icon: <Calendar size={15} />, category: 'visit' },
    ],
  },
  {
    id: 'custom',
    label: 'CUSTOM FIELDS',
    fields: [
      { id: 'text-input', label: 'Text Input', description: 'Single line text field', icon: <Type size={15} />, category: 'custom' },
      { id: 'dropdown', label: 'Dropdown Select', description: 'Single or multi-select options', icon: <List size={15} />, category: 'custom' },
      { id: 'rating', label: 'Rating / Feedback', description: 'Star rating or NPS score', icon: <Star size={15} />, category: 'custom' },
      { id: 'toggle-field', label: 'Yes / No Toggle', description: 'Boolean field with labels', icon: <ToggleLeft size={15} />, category: 'custom' },
    ],
  },
];

// ─── Initial Steps ─────────────────────────────────────────────────────────────

const initialSteps: WorkflowStep[] = [
  {
    id: 'step-1',
    number: 1,
    title: 'Invite Phase',
    color: '#405189',
    collapsed: false,
    conditionRules: [],
    fields: [
      { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
      { id: 'cf-3', paletteId: 'email-address', label: 'Email Address', icon: <Mail size={14} />, mandatory: false, visibleToHost: false, visibleToVisitor: true },
      { id: 'cf-4', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: false, visibleToHost: false, visibleToVisitor: true },
    ],
  },
  {
    id: 'step-2',
    number: 2,
    title: 'Virtual Lobby (Pre-Check-in)',
    color: '#7c3aed',
    collapsed: false,
    conditionRules: [
      { id: 'cr-1', condition: 'IF Health Declaration = No', action: '→ Auto-block visitor', type: 'warning' },
    ],
    fields: [
      { id: 'cf-5', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'cf-6', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'cf-7', paletteId: 'health-declaration', label: 'Health Declaration', icon: <Shield size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'cf-8', paletteId: 'nda-terms', label: 'NDA / Terms & Conditions', icon: <Clipboard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
    ],
  },
  {
    id: 'step-3',
    number: 3,
    title: 'Arrival / Kiosk',
    color: '#d97706',
    collapsed: false,
    conditionRules: [
      { id: 'cr-2', condition: 'IF Visitor Type = VIP', action: '→ Skip quiz + Auto-approve host escort', type: 'info' },
    ],
    fields: [
      { id: 'cf-9', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
      { id: 'cf-10', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'cf-11', paletteId: 'vehicle-number', label: 'Vehicle Number', icon: <Hash size={14} />, mandatory: false, visibleToHost: false, visibleToVisitor: true },
    ],
  },
];

// ─── Per-Visitor-Type Workflow Steps ──────────────────────────────────────────

const visitorTypeSteps: Record<string, WorkflowStep[]> = {
  Vendor: initialSteps,
  Contractor: [
    {
      id: 'step-1',
      number: 1,
      title: 'Registration',
      color: '#405189',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
        { id: 'cf-4', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, badge: 'OCR' } as CanvasField,
      ],
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Compliance & Induction',
      color: '#7c3aed',
      collapsed: false,
      conditionRules: [
        { id: 'cr-1', condition: 'IF Health Declaration = No', action: '→ Auto-block contractor', type: 'warning' },
      ],
      fields: [
        { id: 'cf-5', paletteId: 'health-declaration', label: 'Health Declaration', icon: <Shield size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-6', paletteId: 'nda-terms', label: 'NDA / Terms & Conditions', icon: <Clipboard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-7', paletteId: 'expected-duration', label: 'Expected Duration', icon: <Calendar size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-3',
      number: 3,
      title: 'Site Access',
      color: '#d97706',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-8', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-9', paletteId: 'vehicle-number', label: 'Vehicle Number', icon: <Hash size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true },
        { id: 'cf-10', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      ],
    },
  ],
  Interviewee: [
    {
      id: 'step-1',
      number: 1,
      title: 'Candidate Registration',
      color: '#405189',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'email-address', label: 'Email Address', icon: <Mail size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Pre-Interview Screening',
      color: '#7c3aed',
      collapsed: false,
      conditionRules: [
        { id: 'cr-1', condition: 'IF Health Declaration = No', action: '→ Auto-block candidate', type: 'warning' },
      ],
      fields: [
        { id: 'cf-4', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-5', paletteId: 'health-declaration', label: 'Health Declaration', icon: <Shield size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-6', paletteId: 'nda-terms', label: 'NDA / Terms & Conditions', icon: <Clipboard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-3',
      number: 3,
      title: 'Arrival Check-in',
      color: '#d97706',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-7', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-8', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-9', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
  ],
  'VIP / Executive': [
    {
      id: 'step-1',
      number: 1,
      title: 'VIP Pre-Registration',
      color: '#405189',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'email-address', label: 'Email Address', icon: <Mail size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
        { id: 'cf-4', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Express Check-in',
      color: '#d97706',
      collapsed: false,
      conditionRules: [
        { id: 'cr-1', condition: 'IF Visitor Type = VIP / Executive', action: '→ Skip quiz + Auto-approve host escort', type: 'info' },
      ],
      fields: [
        { id: 'cf-5', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-6', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      ],
    },
  ],
  'Delivery / Courier': [
    {
      id: 'step-1',
      number: 1,
      title: 'Delivery Registration',
      color: '#405189',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Delivery Details',
      color: '#7c3aed',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-4', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-5', paletteId: 'vehicle-number', label: 'Vehicle Number', icon: <Hash size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
        { id: 'cf-6', paletteId: 'expected-duration', label: 'Expected Duration', icon: <Calendar size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-3',
      number: 3,
      title: 'Arrival Gate',
      color: '#d97706',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-7', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-8', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
  ],
  'Govt Official': [
    {
      id: 'step-1',
      number: 1,
      title: 'Official Registration',
      color: '#405189',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, badge: 'OCR' } as CanvasField,
        { id: 'cf-4', paletteId: 'company-org', label: 'Department / Ministry', icon: <Users size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Clearance & Escort',
      color: '#d97706',
      collapsed: false,
      conditionRules: [
        { id: 'cr-1', condition: 'IF Visitor Type = Govt Official', action: '→ Mandatory escort assigned', type: 'info' },
      ],
      fields: [
        { id: 'cf-5', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-6', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-7', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
  ],
  'General Visitor': [
    {
      id: 'step-1',
      number: 1,
      title: 'Visitor Registration',
      color: '#405189',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'email-address', label: 'Email Address', icon: <Mail size={14} />, mandatory: false, visibleToHost: false, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Visit Details',
      color: '#7c3aed',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-4', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-5', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      ],
    },
    {
      id: 'step-3',
      number: 3,
      title: 'Arrival Check-in',
      color: '#d97706',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'cf-6', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
      ],
    },
  ],
};

// ─── Workflow title per visitor type ─────────────────────────────────────────

const visitorTypeWorkflowTitle: Record<string, string> = {
  Vendor: 'Vendor Onboarding Flow',
  Contractor: 'Contractor Access Flow',
  Interviewee: 'Interviewee Check-in Flow',
  'VIP / Executive': 'VIP Executive Express Flow',
  'Delivery / Courier': 'Delivery & Courier Flow',
  'Govt Official': 'Govt Official Access Flow',
  'General Visitor': 'General Visitor Check-in Flow',
};

// ─── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-primary-600' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-1'}`}
      />
    </button>
  );
}

// ─── Induction Hub Data (mirrored from Induction Hub page) ────────────────────

const inductionVideos = [
  { id: 'v1', title: 'Site Safety Videos', duration: '4:30', mustWatch: true },
  { id: 'v2', title: 'Security Protocol Video', duration: '2:45', mustWatch: true },
  { id: 'v3', title: 'Company Intro Video', duration: '3:10', mustWatch: false },
];

const inductionQuizzes = [
  { id: 'q1', name: 'Safety Awareness Quiz', questions: 2, passingScore: 80 },
  { id: 'q2', name: 'Data Handling Compliance Quiz', questions: 1, passingScore: 100 },
];

const inductionDocuments = [
  { id: 'd1', name: 'Non-Disclosure Agreement (NDA)', version: 'v2.1', requireSignature: true },
  { id: 'd2', name: 'Site Rules & Code of Conduct', version: 'v1.3', requireSignature: false },
];

const inductionHealthForms = [
  { id: 'hs1', name: 'General Health Declaration', questions: 2, passingScore: 100 },
  { id: 'hs2', name: 'Travel & Exposure Screening', questions: 2, passingScore: 80 },
];

// ─── Induction Hub Palette Sub-section ───────────────────────────────────────

function InductionHubPalette({
  onDragStart,
  onDragEnd,
}: {
  onDragStart: (e: React.DragEvent, field: PaletteField) => void;
  onDragEnd: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [openSub, setOpenSub] = useState<Record<string, boolean>>({
    videos: true,
    quizzes: true,
    documents: true,
    health: true,
  });

  const toggleSub = (key: string) => setOpenSub(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="mb-1">
      {/* Section Header */}
      <button
        onClick={() => setExpanded(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-surface transition-colors"
      >
        <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">Induction Hub</span>
        {expanded
          ? <ChevronUp size={12} className="text-text-muted" />
          : <ChevronDown size={12} className="text-text-muted" />
        }
      </button>

      {expanded && (
        <div className="px-2 pb-1 space-y-1">

          {/* ── Videos ── */}
          <div className="rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => toggleSub('videos')}
              className="w-full flex items-center justify-between px-3 py-2 bg-surface hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                  <Video size={11} className="text-blue-600" />
                </div>
                <span className="text-[11px] font-semibold text-text-primary">Videos</span>
                <span className="text-[10px] text-text-muted bg-slate-100 px-1.5 py-0.5 rounded-full">{inductionVideos.length}</span>
              </div>
              {openSub.videos ? <ChevronUp size={11} className="text-text-muted" /> : <ChevronDown size={11} className="text-text-muted" />}
            </button>
            {openSub.videos && (
              <div className="divide-y divide-border">
                {inductionVideos.map(v => {
                  const field: PaletteField = {
                    id: `induction-video-${v.id}`,
                    label: v.title,
                    description: `Video · ${v.duration}${v.mustWatch ? ' · Must Watch' : ''}`,
                    icon: <Play size={15} className="text-blue-500" />,
                    category: 'induction',
                  };
                  return (
                    <div
                      key={v.id}
                      draggable
                      onDragStart={e => onDragStart(e, field)}
                      onDragEnd={onDragEnd}
                      className="flex items-center gap-2.5 px-3 py-2 bg-white hover:bg-primary-50 transition-colors cursor-grab active:cursor-grabbing group"
                    >
                      <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0">
                        <Play size={10} className="text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-text-primary truncate">{v.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock size={9} className="text-text-muted" />
                          <span className="text-[10px] text-text-muted">{v.duration}</span>
                          {v.mustWatch && (
                            <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-amber-100 text-amber-700">Must Watch</span>
                          )}
                        </div>
                      </div>
                      <GripVertical size={11} className="text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Quizzes ── */}
          <div className="rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => toggleSub('quizzes')}
              className="w-full flex items-center justify-between px-3 py-2 bg-surface hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center">
                  <HelpCircle size={11} className="text-purple-600" />
                </div>
                <span className="text-[11px] font-semibold text-text-primary">Quizzes</span>
                <span className="text-[10px] text-text-muted bg-slate-100 px-1.5 py-0.5 rounded-full">{inductionQuizzes.length}</span>
              </div>
              {openSub.quizzes ? <ChevronUp size={11} className="text-text-muted" /> : <ChevronDown size={11} className="text-text-muted" />}
            </button>
            {openSub.quizzes && (
              <div className="divide-y divide-border">
                {inductionQuizzes.map(q => {
                  const field: PaletteField = {
                    id: `induction-quiz-${q.id}`,
                    label: q.name,
                    description: `Quiz · ${q.questions} Qs · Pass: ${q.passingScore}%`,
                    icon: <CheckSquare size={15} className="text-purple-500" />,
                    category: 'induction',
                  };
                  return (
                    <div
                      key={q.id}
                      draggable
                      onDragStart={e => onDragStart(e, field)}
                      onDragEnd={onDragEnd}
                      className="flex items-center gap-2.5 px-3 py-2 bg-white hover:bg-primary-50 transition-colors cursor-grab active:cursor-grabbing group"
                    >
                      <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0">
                        <CheckSquare size={10} className="text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-text-primary truncate">{q.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-text-muted">{q.questions} Qs</span>
                          <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-green-100 text-green-700">Pass: {q.passingScore}%</span>
                        </div>
                      </div>
                      <GripVertical size={11} className="text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Document Vault ── */}
          <div className="rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => toggleSub('documents')}
              className="w-full flex items-center justify-between px-3 py-2 bg-surface hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-teal-100 flex items-center justify-center">
                  <BookOpen size={11} className="text-teal-600" />
                </div>
                <span className="text-[11px] font-semibold text-text-primary">Document Vault</span>
                <span className="text-[10px] text-text-muted bg-slate-100 px-1.5 py-0.5 rounded-full">{inductionDocuments.length}</span>
              </div>
              {openSub.documents ? <ChevronUp size={11} className="text-text-muted" /> : <ChevronDown size={11} className="text-text-muted" />}
            </button>
            {openSub.documents && (
              <div className="divide-y divide-border">
                {inductionDocuments.map(d => {
                  const field: PaletteField = {
                    id: `induction-doc-${d.id}`,
                    label: d.name,
                    description: `Document · ${d.version}${d.requireSignature ? ' · Signature Required' : ''}`,
                    icon: <FileText size={15} className="text-teal-500" />,
                    category: 'induction',
                  };
                  return (
                    <div
                      key={d.id}
                      draggable
                      onDragStart={e => onDragStart(e, field)}
                      onDragEnd={onDragEnd}
                      className="flex items-center gap-2.5 px-3 py-2 bg-white hover:bg-primary-50 transition-colors cursor-grab active:cursor-grabbing group"
                    >
                      <div className="w-6 h-6 rounded bg-teal-50 flex items-center justify-center shrink-0">
                        <FileText size={10} className="text-teal-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-text-primary truncate">{d.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-text-muted">{d.version}</span>
                          {d.requireSignature && (
                            <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-blue-100 text-blue-700">Signature</span>
                          )}
                        </div>
                      </div>
                      <GripVertical size={11} className="text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Health Screening ── */}
          <div className="rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => toggleSub('health')}
              className="w-full flex items-center justify-between px-3 py-2 bg-surface hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-red-100 flex items-center justify-center">
                  <Heart size={11} className="text-red-500" />
                </div>
                <span className="text-[11px] font-semibold text-text-primary">Health Screening</span>
                <span className="text-[10px] text-text-muted bg-slate-100 px-1.5 py-0.5 rounded-full">{inductionHealthForms.length}</span>
              </div>
              {openSub.health ? <ChevronUp size={11} className="text-text-muted" /> : <ChevronDown size={11} className="text-text-muted" />}
            </button>
            {openSub.health && (
              <div className="divide-y divide-border">
                {inductionHealthForms.map(h => {
                  const field: PaletteField = {
                    id: `induction-health-${h.id}`,
                    label: h.name,
                    description: `Health Screening · ${h.questions} Qs · Pass: ${h.passingScore}%`,
                    icon: <Shield size={15} className="text-red-400" />,
                    category: 'induction',
                  };
                  return (
                    <div
                      key={h.id}
                      draggable
                      onDragStart={e => onDragStart(e, field)}
                      onDragEnd={onDragEnd}
                      className="flex items-center gap-2.5 px-3 py-2 bg-white hover:bg-primary-50 transition-colors cursor-grab active:cursor-grabbing group"
                    >
                      <div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center shrink-0">
                        <Shield size={10} className="text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-text-primary truncate">{h.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-text-muted">{h.questions} Qs</span>
                          <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-green-100 text-green-700">Pass: {h.passingScore}%</span>
                        </div>
                      </div>
                      <GripVertical size={11} className="text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface WorkflowBuilderProps {
  initialVisitorType?: string;
  initialWorkflowName?: string;
  backHref?: string;
}

export default function WorkflowBuilder({ initialVisitorType, initialWorkflowName, backHref }: WorkflowBuilderProps = {}) {
  const router = useRouter();
  const resolvedVisitorType = initialVisitorType && visitorTypeSteps[initialVisitorType] ? initialVisitorType : 'Vendor';
  const [steps, setSteps] = useState<WorkflowStep[]>(visitorTypeSteps[resolvedVisitorType] ?? initialSteps);
  const [selectedField, setSelectedField] = useState<{ stepId: string; fieldId: string } | null>(null);
  const [fieldProperties, setFieldProperties] = useState<Record<string, FieldProperties>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [visitorType, setVisitorType] = useState(resolvedVisitorType);
  const [showVisitorDropdown, setShowVisitorDropdown] = useState(false);
  const [isDraft] = useState(true);
  const [dragOverStep, setDragOverStep] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingPaletteField, setDraggingPaletteField] = useState<PaletteField | null>(null);
  const [draggingCanvasField, setDraggingCanvasField] = useState<{ stepId: string; fieldId: string; index: number } | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showPublishedToast, setShowPublishedToast] = useState(false);

  const visitorTypes = ['Vendor', 'Contractor', 'Interviewee', 'VIP / Executive', 'Delivery / Courier', 'Govt Official', 'General Visitor'];

  const handleVisitorTypeChange = (vt: string) => {
    setVisitorType(vt);
    setShowVisitorDropdown(false);
    setSteps(visitorTypeSteps[vt] ?? initialSteps);
    setFieldProperties({});
    setSelectedField(null);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getFieldProps = useCallback((stepId: string, fieldId: string): FieldProperties => {
    const key = `${stepId}:${fieldId}`;
    if (fieldProperties[key]) return fieldProperties[key];
    const step = steps.find(s => s.id === stepId);
    const field = step?.fields.find(f => f.id === fieldId);
    return {
      fieldId,
      stepId,
      label: field?.label ?? '',
      placeholder: '',
      defaultValue: '',
      mandatory: field?.mandatory ?? false,
      visibleToHost: field?.visibleToHost ?? true,
      visibleToVisitor: field?.visibleToVisitor ?? true,
    };
  }, [fieldProperties, steps]);

  const updateFieldProps = (stepId: string, fieldId: string, patch: Partial<FieldProperties>) => {
    const key = `${stepId}:${fieldId}`;
    const current = getFieldProps(stepId, fieldId);
    const updated = { ...current, ...patch };
    setFieldProperties(prev => ({ ...prev, [key]: updated }));
    // sync toggles back to canvas
    setSteps(prev => prev.map(s => s.id !== stepId ? s : {
      ...s,
      fields: s.fields.map(f => f.id !== fieldId ? f : {
        ...f,
        mandatory: updated.mandatory,
        visibleToHost: updated.visibleToHost,
        visibleToVisitor: updated.visibleToVisitor,
        label: updated.label,
      }),
    }));
  };

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleStep = (stepId: string) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, collapsed: !s.collapsed } : s));
  };

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      number: steps.length + 1,
      title: `New Step ${steps.length + 1}`,
      color: '#405189',
      collapsed: false,
      conditionRules: [],
      fields: [],
    };
    setSteps(prev => [...prev, newStep]);
  };

  const removeField = (stepId: string, fieldId: string) => {
    setSteps(prev => prev.map(s => s.id !== stepId ? s : {
      ...s,
      fields: s.fields.filter(f => f.id !== fieldId),
    }));
    if (selectedField?.stepId === stepId && selectedField?.fieldId === fieldId) {
      setSelectedField(null);
    }
  };

  const filteredCategories = paletteCategories.map(cat => ({
    ...cat,
    fields: cat.fields.filter(f =>
      f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.fields.length > 0);

  // ── Drag from Palette ─────────────────────────────────────────────────────────

  const handlePaletteDragStart = (e: React.DragEvent, field: PaletteField) => {
    setDraggingPaletteField(field);
    setDraggingCanvasField(null);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handlePaletteDragEnd = () => {
    setDraggingPaletteField(null);
    setDragOverStep(null);
    setDragOverIndex(null);
  };

  // ── Drag within Canvas ────────────────────────────────────────────────────────

  const handleCanvasDragStart = (e: React.DragEvent, stepId: string, fieldId: string, index: number) => {
    setDraggingCanvasField({ stepId, fieldId, index });
    setDraggingPaletteField(null);
    e.dataTransfer.effectAllowed = 'move';
    e.stopPropagation();
  };

  const handleCanvasDragEnd = () => {
    setDraggingCanvasField(null);
    setDragOverStep(null);
    setDragOverIndex(null);
  };

  const handleStepDragOver = (e: React.DragEvent, stepId: string, index?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggingPaletteField ? 'copy' : 'move';
    setDragOverStep(stepId);
    setDragOverIndex(index ?? null);
  };

  const handleStepDrop = (e: React.DragEvent, targetStepId: string, targetIndex?: number) => {
    e.preventDefault();
    setDragOverStep(null);
    setDragOverIndex(null);

    if (draggingPaletteField) {
      // Add new field from palette
      const iconMap: Record<string, React.ReactNode> = {
        'full-name': <User size={14} />, 'mobile-number': <Phone size={14} />,
        'email-address': <Mail size={14} />, 'id-type-number': <CreditCard size={14} />,
        'live-photo': <Camera size={14} />, 'company-org': <Users size={14} />,
        'vehicle-number': <Hash size={14} />, 'host-name': <User size={14} />,
        'purpose-of-visit': <FileText size={14} />, 'health-declaration': <Shield size={14} />,
        'nda-terms': <Clipboard size={14} />, 'expected-duration': <Calendar size={14} />,
        'text-input': <Type size={14} />, 'dropdown': <List size={14} />,
        'rating': <Star size={14} />, 'toggle-field': <ToggleLeft size={14} />,
        'induction-video-v1': <Play size={14} />, 'induction-video-v2': <Play size={14} />, 'induction-video-v3': <Play size={14} />,
        'induction-quiz-q1': <CheckSquare size={14} />, 'induction-quiz-q2': <CheckSquare size={14} />,
        'induction-doc-d1': <FileText size={14} />, 'induction-doc-d2': <FileText size={14} />,
        'induction-health-hs1': <Shield size={14} />, 'induction-health-hs2': <Shield size={14} />,
      };
      const newField: CanvasField = {
        id: `cf-${Date.now()}`,
        paletteId: draggingPaletteField.id,
        label: draggingPaletteField.label,
        icon: iconMap[draggingPaletteField.id] ?? <FileText size={14} />,
        mandatory: false,
        visibleToHost: true,
        visibleToVisitor: true,
      };
      setSteps(prev => prev.map(s => {
        if (s.id !== targetStepId) return s;
        const newFields = [...s.fields];
        const insertAt = targetIndex !== undefined ? targetIndex : newFields.length;
        newFields.splice(insertAt, 0, newField);
        return { ...s, fields: newFields };
      }));
      setDraggingPaletteField(null);
    } else if (draggingCanvasField) {
      // Reorder within same step or move between steps
      const { stepId: srcStepId, fieldId, index: srcIndex } = draggingCanvasField;
      setSteps(prev => {
        let movedField: CanvasField | undefined;
        const newSteps = prev.map(s => {
          if (s.id !== srcStepId) return s;
          movedField = s.fields[srcIndex];
          return { ...s, fields: s.fields.filter((_, i) => i !== srcIndex) };
        });
        return newSteps.map(s => {
          if (s.id !== targetStepId) return s;
          const newFields = [...s.fields];
          const insertAt = targetIndex !== undefined ? targetIndex : newFields.length;
          if (movedField) newFields.splice(insertAt, 0, movedField);
          return { ...s, fields: newFields };
        });
      });
      setDraggingCanvasField(null);
    }
  };

  // ── Save / Publish ────────────────────────────────────────────────────────────

  const handleSaveDraft = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handlePublish = () => {
    setShowPublishedToast(true);
    setTimeout(() => setShowPublishedToast(false), 2500);
  };

  // ── Selected field data ───────────────────────────────────────────────────────

  const selectedProps = selectedField
    ? getFieldProps(selectedField.stepId, selectedField.fieldId)
    : null;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-surface overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 bg-white border-b border-border shadow-topbar">
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-lg hover:bg-surface transition-colors" onClick={() => backHref ? router.push(backHref) : router.back()}>
            <ArrowLeft size={16} className="text-text-secondary" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-text-primary">{initialWorkflowName || (visitorTypeWorkflowTitle[visitorType] ?? 'Workflow Builder')}</h1>
            <Settings size={14} className="text-text-muted cursor-pointer hover:text-text-secondary" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-warning-light text-warning-text border border-warning/20">
            <span className="w-1.5 h-1.5 rounded-full bg-warning-DEFAULT inline-block" />
            DRAFT
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Visitor Type */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-text-secondary font-medium flex items-center gap-1.5">
              <Users size={13} className="text-text-muted" />
              Visitor Type:
            </span>
            <div className="relative">
              <button
                onClick={() => setShowVisitorDropdown(!showVisitorDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white text-[13px] font-medium text-text-primary hover:border-primary-300 transition-colors min-w-[110px] justify-between"
              >
                {visitorType}
                <ChevronDown size={13} className="text-text-muted" />
              </button>
              {showVisitorDropdown && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-dropdown z-50 py-1">
                  {visitorTypes.map(vt => (
                    <button
                      key={vt}
                      onClick={() => handleVisitorTypeChange(vt)}
                      className={`w-full text-left px-3 py-2 text-[13px] hover:bg-surface transition-colors ${vt === visitorType ? 'text-primary-600 font-semibold bg-primary-50' : 'text-text-primary'}`}
                    >
                      {vt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-5 w-px bg-border" />

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-white text-[13px] font-medium text-text-primary hover:bg-surface hover:border-primary-300 transition-colors"
          >
            <Save size={14} />
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-600 text-white text-[13px] font-semibold hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Upload size={14} />
            Publish Workflow
          </button>
        </div>
      </div>

      {/* ── Three-Panel Layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Field Palette ── */}
        <div className="w-[260px] shrink-0 flex flex-col bg-white border-r border-border overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <h2 className="text-[15px] font-semibold text-text-primary">Field Palette</h2>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search fields..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-border rounded-lg bg-surface focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 placeholder:text-text-muted"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
            {filteredCategories.map(cat => (
              <div key={cat.id} className="mb-1">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-surface transition-colors"
                >
                  <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">{cat.label}</span>
                  {collapsedCategories[cat.id]
                    ? <ChevronDown size={12} className="text-text-muted" />
                    : <ChevronUp size={12} className="text-text-muted" />
                  }
                </button>

                {!collapsedCategories[cat.id] && (
                  <div className="px-2 pb-1 space-y-0.5">
                    {cat.fields.map(field => (
                      <div
                        key={field.id}
                        draggable
                        onDragStart={e => handlePaletteDragStart(e, field)}
                        onDragEnd={handlePaletteDragEnd}
                        className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-primary-50 hover:border-primary-100 border border-transparent transition-all duration-150 group"
                      >
                        <div className="w-7 h-7 rounded-md bg-primary-50 flex items-center justify-center text-primary-600 shrink-0 mt-0.5 group-hover:bg-primary-100">
                          {field.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-text-primary truncate">{field.label}</span>
                            {field.badge && (
                              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-info-light text-info-text shrink-0">{field.badge}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-text-muted truncate mt-0.5">{field.description}</p>
                        </div>
                        <GripVertical size={12} className="text-text-muted shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* ── Induction Hub Section ── */}
            <InductionHubPalette
              onDragStart={(e, field) => handlePaletteDragStart(e, field)}
              onDragEnd={handlePaletteDragEnd}
            />

            <div className="px-4 py-3 mt-2">
              <p className="text-[11px] text-text-muted text-center italic">
                Drag fields into workflow steps on the canvas →
              </p>
            </div>
          </div>
        </div>

        {/* ── CENTER: Workflow Canvas ── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-surface px-6 py-5">
          {/* Canvas Header */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[15px] font-semibold text-text-primary">Workflow Canvas</h2>
              <p className="text-[12px] text-text-muted mt-0.5">
                {steps.length} steps · drag fields from the palette to add them
              </p>
            </div>
            <button
              onClick={addStep}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-primary-300 text-primary-600 text-[12px] font-medium hover:bg-primary-50 transition-colors"
            >
              <Plus size={14} />
              Add Step
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-2 mt-4">
            {steps.map((step, stepIdx) => (
              <React.Fragment key={step.id}>
                <StepCard
                  step={step}
                  isActive={selectedField?.stepId === step.id}
                  dragOverStep={dragOverStep}
                  dragOverIndex={dragOverIndex}
                  draggingCanvasField={draggingCanvasField}
                  selectedField={selectedField}
                  onToggleCollapse={() => toggleStep(step.id)}
                  onSelectField={(fieldId) => setSelectedField({ stepId: step.id, fieldId })}
                  onRemoveField={(fieldId) => removeField(step.id, fieldId)}
                  onDragOver={(e, idx) => handleStepDragOver(e, step.id, idx)}
                  onDrop={(e, idx) => handleStepDrop(e, step.id, idx)}
                  onDragLeave={() => { setDragOverStep(null); setDragOverIndex(null); }}
                  onCanvasDragStart={(e, fieldId, idx) => handleCanvasDragStart(e, step.id, fieldId, idx)}
                  onCanvasDragEnd={handleCanvasDragEnd}
                />
                {stepIdx < steps.length - 1 && (
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-px h-4 bg-border" />
                      <div className="w-2 h-2 rounded-full border-2 border-border bg-white" />
                      <div className="w-px h-4 bg-border" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Add step drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOverStep('new'); }}
              onDragLeave={() => setDragOverStep(null)}
              onDrop={e => { e.preventDefault(); addStep(); setDragOverStep(null); }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-150 cursor-pointer ${dragOverStep === 'new' ? 'border-primary-400 bg-primary-50' : 'border-border hover:border-primary-300 hover:bg-primary-50/50'}`}
              onClick={addStep}
            >
              <Plus size={20} className="mx-auto text-text-muted mb-1" />
              <p className="text-[12px] text-text-muted">Add new step or drop a field here</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Field Properties ── */}
        <div className="w-[260px] shrink-0 flex flex-col bg-white border-l border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center">
                <Settings size={13} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-[13px] font-semibold text-text-primary">Field Properties</h2>
                {selectedProps && (
                  <p className="text-[10px] text-text-muted">{selectedProps.label}</p>
                )}
              </div>
            </div>
            {selectedField && (
              <button onClick={() => setSelectedField(null)} className="p-1 rounded hover:bg-surface transition-colors">
                <X size={13} className="text-text-muted" />
              </button>
            )}
          </div>

          {selectedProps ? (
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-4">
              {/* Field Label */}
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Field Label</label>
                <input
                  type="text"
                  value={selectedProps.label}
                  onChange={e => updateFieldProps(selectedField.stepId, selectedField.fieldId, { label: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg bg-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 text-text-primary"
                />
              </div>

              {/* Placeholder Text */}
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Placeholder Text</label>
                <input
                  type="text"
                  value={selectedProps.placeholder}
                  onChange={e => updateFieldProps(selectedField.stepId, selectedField.fieldId, { placeholder: e.target.value })}
                  placeholder="e.g. Enter your full name"
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg bg-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 placeholder:text-text-muted text-text-primary"
                />
              </div>

              {/* Default Value */}
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Default Value</label>
                <input
                  type="text"
                  value={selectedProps.defaultValue}
                  onChange={e => updateFieldProps(selectedField.stepId, selectedField.fieldId, { defaultValue: e.target.value })}
                  placeholder="Leave blank for no default"
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg bg-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 placeholder:text-text-muted text-text-primary"
                />
                <p className="text-[10px] text-text-muted mt-1">Auto-filled from previous visit if return visitor matches</p>
              </div>

              <div className="h-px bg-border" />

              {/* Visibility & Behaviour */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Eye size={13} className="text-text-secondary" />
                  <h3 className="text-[12px] font-semibold text-text-primary">Visibility & Behaviour</h3>
                </div>

                <div className="space-y-3">
                  {/* Mandatory */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Lock size={13} className="text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[12px] font-medium text-text-primary">Mandatory</p>
                        <p className="text-[10px] text-text-muted">Visitor must fill this field to proceed</p>
                      </div>
                    </div>
                    <Toggle
                      checked={selectedProps.mandatory}
                      onChange={v => updateFieldProps(selectedField.stepId, selectedField.fieldId, { mandatory: v })}
                    />
                  </div>

                  {/* Visible to Host */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <User size={13} className="text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[12px] font-medium text-text-primary">Visible to Host</p>
                        <p className="text-[10px] text-text-muted">Host can see this field in notifications</p>
                      </div>
                    </div>
                    <Toggle
                      checked={selectedProps.visibleToHost}
                      onChange={v => updateFieldProps(selectedField.stepId, selectedField.fieldId, { visibleToHost: v })}
                    />
                  </div>

                  {/* Visible to Visitor */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Eye size={13} className="text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[12px] font-medium text-text-primary">Visible to Visitor</p>
                        <p className="text-[10px] text-text-muted">Shown to visitor during check-in flow</p>
                      </div>
                    </div>
                    <Toggle
                      checked={selectedProps.visibleToVisitor}
                      onChange={v => updateFieldProps(selectedField.stepId, selectedField.fieldId, { visibleToVisitor: v })}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center gap-1.5 text-success-text">
                <CheckCircle size={12} />
                <p className="text-[10px]">Changes auto-saved to draft — publish to go live</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-3">
                <Settings size={20} className="text-text-muted" />
              </div>
              <p className="text-[12px] font-medium text-text-secondary mb-1">No field selected</p>
              <p className="text-[11px] text-text-muted">Click any field on the canvas to edit its properties</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Toast Notifications ── */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-text-primary text-white rounded-lg shadow-modal text-[13px] font-medium animate-slide-up z-50">
          <Save size={14} />
          Draft saved successfully
        </div>
      )}
      {showPublishedToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-success text-white rounded-lg shadow-modal text-[13px] font-medium animate-slide-up z-50">
          <CheckCircle size={14} />
          Workflow published successfully
        </div>
      )}
    </div>
  );
}

// ─── Step Card Component ───────────────────────────────────────────────────────

interface StepCardProps {
  step: WorkflowStep;
  isActive: boolean;
  dragOverStep: string | null;
  dragOverIndex: number | null;
  draggingCanvasField: { stepId: string; fieldId: string; index: number } | null;
  selectedField: { stepId: string; fieldId: string } | null;
  onToggleCollapse: () => void;
  onSelectField: (fieldId: string) => void;
  onRemoveField: (fieldId: string) => void;
  onDragOver: (e: React.DragEvent, idx?: number) => void;
  onDrop: (e: React.DragEvent, idx?: number) => void;
  onDragLeave: () => void;
  onCanvasDragStart: (e: React.DragEvent, fieldId: string, idx: number) => void;
  onCanvasDragEnd: () => void;
}

function StepCard({
  step, isActive, dragOverStep, dragOverIndex, draggingCanvasField, selectedField,
  onToggleCollapse, onSelectField, onRemoveField,
  onDragOver, onDrop, onDragLeave, onCanvasDragStart, onCanvasDragEnd,
}: StepCardProps) {
  const isDragTarget = dragOverStep === step.id;

  const stepColors: Record<number, { bg: string; text: string; border: string; badge: string }> = {
    1: { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200', badge: 'bg-primary-600' },
    2: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-600' },
    3: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-500' },
  };
  const colors = stepColors[step.number] ?? stepColors[1];

  return (
    <div
      className={`rounded-xl border-2 bg-white transition-all duration-150 ${isDragTarget ? 'border-emerald-400 shadow-card-md' : isActive ? 'border-emerald-300 shadow-[0_0_0_3px_rgba(110,231,183,0.25)]' : 'border-border shadow-card'}`}
      onDragOver={e => onDragOver(e)}
      onDrop={e => onDrop(e)}
      onDragLeave={onDragLeave}
    >
      {/* Step Header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${colors.bg} border-b ${colors.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full ${colors.badge} text-white text-[12px] font-bold flex items-center justify-center shrink-0`}>
            {step.number}
          </div>
          <div>
            <h3 className={`text-[13px] font-semibold ${colors.text}`}>{step.title}</h3>
            <p className="text-[11px] text-text-muted">{step.fields.length} field{step.fields.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className={`p-1 rounded hover:bg-white/60 transition-colors ${colors.text}`}>
            <Zap size={13} />
          </button>
          <button onClick={onToggleCollapse} className={`p-1 rounded hover:bg-white/60 transition-colors ${colors.text}`}>
            {step.collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Step Body */}
      {!step.collapsed && (
        <div className="p-3 space-y-1">
          {step.fields.length === 0 && (
            <div
              className={`flex items-center justify-center py-6 rounded-lg border-2 border-dashed transition-all ${isDragTarget ? 'border-primary-300 bg-primary-50' : 'border-border'}`}
            >
              <p className="text-[12px] text-text-muted">Drop fields here</p>
            </div>
          )}

          {step.fields.map((field, idx) => {
            const isSelected = selectedField?.stepId === step.id && selectedField?.fieldId === field.id;
            const isDraggingThis = draggingCanvasField?.stepId === step.id && draggingCanvasField?.fieldId === field.id;
            const isDropTarget = isDragTarget && dragOverIndex === idx;

            return (
              <React.Fragment key={field.id}>
                {isDropTarget && (
                  <div className="h-1 rounded-full bg-primary-400 mx-2 transition-all" />
                )}
                <div
                  draggable
                  onDragStart={e => onCanvasDragStart(e, field.id, idx)}
                  onDragEnd={onCanvasDragEnd}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(e, idx); }}
                  onClick={() => onSelectField(field.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-150 group ${isDraggingThis ? 'opacity-40' : ''} ${isSelected ? 'border-emerald-300 bg-emerald-50 shadow-sm' : 'border-border bg-white hover:border-emerald-200 hover:bg-emerald-50/40'}`}
                >
                  <GripVertical size={13} className="text-text-muted cursor-grab shrink-0 opacity-40 group-hover:opacity-100" />
                  <div className="w-6 h-6 rounded-md bg-surface flex items-center justify-center text-text-secondary shrink-0">
                    {field.icon}
                  </div>
                  <span className="flex-1 text-[13px] font-medium text-text-primary truncate">{field.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {field.locked && <Lock size={11} className="text-text-muted" />}
                    {field.verified && <CheckCircle size={11} className="text-success" />}
                    {field.mandatory
                      ? <Eye size={11} className="text-primary-400" />
                      : <EyeOff size={11} className="text-text-muted" />
                    }
                    <button
                      onClick={e => { e.stopPropagation(); onRemoveField(field.id); }}
                      className="p-0.5 rounded hover:bg-danger-light transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={10} className="text-danger" />
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* Drop zone at end */}
          {step.fields.length > 0 && (
            <div
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(e, step.fields.length); }}
              onDrop={e => { e.stopPropagation(); onDrop(e, step.fields.length); }}
              className={`h-8 rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${isDragTarget && dragOverIndex === step.fields.length ? 'border-primary-400 bg-primary-50' : 'border-transparent'}`}
            >
              {isDragTarget && dragOverIndex === step.fields.length && (
                <p className="text-[10px] text-primary-500">Drop here</p>
              )}
            </div>
          )}

          {/* Condition Rules */}
          {step.conditionRules.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 px-1">Condition Rules</p>
              {step.conditionRules.map(rule => (
                <div
                  key={rule.id}
                  className={`flex items-start gap-2 px-3 py-2 rounded-lg ${rule.type === 'warning' ? 'bg-warning-light border border-warning/20' : 'bg-info-light border border-info/20'}`}
                >
                  <AlertTriangle size={12} className={`shrink-0 mt-0.5 ${rule.type === 'warning' ? 'text-warning' : 'text-info'}`} />
                  <div>
                    <p className={`text-[11px] font-semibold ${rule.type === 'warning' ? 'text-warning-text' : 'text-info-text'}`}>{rule.condition}</p>
                    <p className={`text-[11px] ${rule.type === 'warning' ? 'text-warning-text' : 'text-info-text'}`}>{rule.action}</p>
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
