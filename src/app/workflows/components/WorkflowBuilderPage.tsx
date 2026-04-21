'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search, Plus, ChevronDown, ChevronUp, GripVertical, Lock, Eye, EyeOff,
  CheckCircle, AlertTriangle, X, Save, Upload, ArrowLeft, Zap, Settings,
  User, Phone, Mail, CreditCard, Camera, FileText, Users, Shield, Hash,
  Calendar, ToggleLeft, List, Type, Star, Clipboard, Video, HelpCircle,
  BookOpen, Heart, Play, CheckSquare, UsersRound, UserCog, QrCode, Printer,
  Download, Table2, UserPlus, LayoutList, BadgeCheck,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaletteField {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  category: string;
  isGroupField?: boolean;
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
  // Group-specific
  groupScope?: 'leader' | 'all_members' | 'group_level';
  isGroupField?: boolean;
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
  // Group-specific
  groupApplyTo?: 'leader' | 'all_members';
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
  // Group-specific
  groupScope?: 'leader' | 'all_members' | 'group_level';
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
      { id: 'id-type-number', label: 'ID Type & Number', description: 'Aadhaar, PAN, DL, Passport...', icon: <CreditCard size={15} />, badge: 'OCR', category: 'identity' },
      { id: 'live-photo', label: 'Live Photo + Liveness', description: 'Front camera capture with liveness', icon: <Camera size={15} />, badge: 'OCR', category: 'identity' },
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

// ─── Group-Specific Palette Fields ────────────────────────────────────────────

const groupDetailFields: PaletteField[] = [
  { id: 'group-name', label: 'Group Name', description: 'Name of the visiting group — mandatory', icon: <UsersRound size={15} />, category: 'group', isGroupField: true },
  { id: 'group-size', label: 'Group Size', description: 'Total number of visitors in the group — mandatory', icon: <Hash size={15} />, badge: 'Num', category: 'group', isGroupField: true },
  { id: 'group-leader-name', label: 'Group Leader Name', description: 'Name of the group representative', icon: <UserCog size={15} />, category: 'group', isGroupField: true },
  { id: 'group-leader-mobile', label: 'Group Leader Mobile', description: 'Mobile number of the group leader', icon: <Phone size={15} />, category: 'group', isGroupField: true },
  { id: 'group-leader-email', label: 'Group Leader Email', description: 'Email address of the group leader', icon: <Mail size={15} />, category: 'group', isGroupField: true },
  { id: 'group-purpose', label: 'Purpose of Group Visit', description: 'Dropdown or free text — reason for group visit', icon: <FileText size={15} />, category: 'group', isGroupField: true },
];

const groupMembersField: PaletteField = {
  id: 'group-members',
  label: 'Group Members',
  description: 'Repeatable member table — Name, Mobile, Email, ID, Photo. Supports CSV bulk upload.',
  icon: <Table2 size={15} />,
  badge: 'Repeatable',
  category: 'group',
  isGroupField: true,
};

// ─── Per-Visitor-Type Workflow Steps ──────────────────────────────────────────

const defaultSteps: WorkflowStep[] = [
  {
    id: 'step-1', number: 1, title: 'Registration', color: '#405189', collapsed: false, conditionRules: [],
    fields: [
      { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
    ],
  },
  {
    id: 'step-2', number: 2, title: 'Verification', color: '#7c3aed', collapsed: false, conditionRules: [],
    fields: [
      { id: 'cf-3', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'cf-4', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
    ],
  },
  {
    id: 'step-3', number: 3, title: 'Arrival Check-in', color: '#d97706', collapsed: false, conditionRules: [],
    fields: [
      { id: 'cf-5', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
      { id: 'cf-6', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
    ],
  },
];

const visitorTypeSteps: Record<string, WorkflowStep[]> = {
  Vendor: [
    {
      id: 'step-1', number: 1, title: 'Invite Phase', color: '#405189', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'email-address', label: 'Email Address', icon: <Mail size={14} />, mandatory: false, visibleToHost: false, visibleToVisitor: true },
        { id: 'cf-4', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: false, visibleToHost: false, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2', number: 2, title: 'Virtual Lobby (Pre-Check-in)', color: '#7c3aed', collapsed: false,
      conditionRules: [{ id: 'cr-1', condition: 'IF Health Declaration = No', action: '→ Auto-block visitor', type: 'warning' }],
      fields: [
        { id: 'cf-5', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-6', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-7', paletteId: 'health-declaration', label: 'Health Declaration', icon: <Shield size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-8', paletteId: 'nda-terms', label: 'NDA / Terms & Conditions', icon: <Clipboard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      ],
    },
    {
      id: 'step-3', number: 3, title: 'Arrival / Kiosk', color: '#d97706', collapsed: false,
      conditionRules: [{ id: 'cr-2', condition: 'IF Visitor Type = VIP', action: '→ Skip quiz + Auto-approve host escort', type: 'info' }],
      fields: [
        { id: 'cf-9', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-10', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-11', paletteId: 'vehicle-number', label: 'Vehicle Number', icon: <Hash size={14} />, mandatory: false, visibleToHost: false, visibleToVisitor: true },
      ],
    },
  ],
  Contractor: [
    {
      id: 'step-1', number: 1, title: 'Registration', color: '#405189', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
        { id: 'cf-4', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2', number: 2, title: 'Compliance & Induction', color: '#7c3aed', collapsed: false,
      conditionRules: [{ id: 'cr-1', condition: 'IF Health Declaration = No', action: '→ Auto-block contractor', type: 'warning' }],
      fields: [
        { id: 'cf-5', paletteId: 'health-declaration', label: 'Health Declaration', icon: <Shield size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-6', paletteId: 'nda-terms', label: 'NDA / Terms & Conditions', icon: <Clipboard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-7', paletteId: 'expected-duration', label: 'Expected Duration', icon: <Calendar size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-3', number: 3, title: 'Site Access', color: '#d97706', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-8', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-9', paletteId: 'vehicle-number', label: 'Vehicle Number', icon: <Hash size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true },
        { id: 'cf-10', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      ],
    },
  ],
  Interviewee: [
    {
      id: 'step-1', number: 1, title: 'Candidate Registration', color: '#405189', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'email-address', label: 'Email Address', icon: <Mail size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2', number: 2, title: 'Pre-Interview Screening', color: '#7c3aed', collapsed: false,
      conditionRules: [{ id: 'cr-1', condition: 'IF Health Declaration = No', action: '→ Auto-block candidate', type: 'warning' }],
      fields: [
        { id: 'cf-4', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-5', paletteId: 'health-declaration', label: 'Health Declaration', icon: <Shield size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-6', paletteId: 'nda-terms', label: 'NDA / Terms & Conditions', icon: <Clipboard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-3', number: 3, title: 'Arrival Check-in', color: '#d97706', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-7', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-8', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-9', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
  ],
  'VIP / Executive': [
    {
      id: 'step-1', number: 1, title: 'VIP Pre-Registration', color: '#405189', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'email-address', label: 'Email Address', icon: <Mail size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
        { id: 'cf-4', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2', number: 2, title: 'Express Check-in', color: '#d97706', collapsed: false,
      conditionRules: [{ id: 'cr-1', condition: 'IF Visitor Type = VIP / Executive', action: '→ Skip quiz + Auto-approve host escort', type: 'info' }],
      fields: [
        { id: 'cf-5', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-6', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      ],
    },
  ],
  'Delivery / Courier': [
    {
      id: 'step-1', number: 1, title: 'Delivery Registration', color: '#405189', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2', number: 2, title: 'Delivery Details', color: '#7c3aed', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-4', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-5', paletteId: 'vehicle-number', label: 'Vehicle Number', icon: <Hash size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
        { id: 'cf-6', paletteId: 'expected-duration', label: 'Expected Duration', icon: <Calendar size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-3', number: 3, title: 'Arrival Gate', color: '#d97706', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-7', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-8', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
  ],
  'Govt Official': [
    {
      id: 'step-1', number: 1, title: 'Official Registration', color: '#405189', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
        { id: 'cf-4', paletteId: 'company-org', label: 'Department / Ministry', icon: <Users size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2', number: 2, title: 'Clearance & Escort', color: '#d97706', collapsed: false,
      conditionRules: [{ id: 'cr-1', condition: 'IF Visitor Type = Govt Official', action: '→ Mandatory escort assigned', type: 'info' }],
      fields: [
        { id: 'cf-5', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'cf-6', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-7', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
  ],
  'General Visitor': [
    {
      id: 'step-1', number: 1, title: 'Visitor Registration', color: '#405189', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-1', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-2', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'cf-3', paletteId: 'email-address', label: 'Email Address', icon: <Mail size={14} />, mandatory: false, visibleToHost: false, visibleToVisitor: true },
      ],
    },
    {
      id: 'step-2', number: 2, title: 'Visit Details', color: '#7c3aed', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-4', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'cf-5', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      ],
    },
    {
      id: 'step-3', number: 3, title: 'Arrival Check-in', color: '#d97706', collapsed: false, conditionRules: [],
      fields: [
        { id: 'cf-6', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
      ],
    },
  ],
  'Group Visit': [
    {
      id: 'step-1', number: 1, title: 'Group Registration', color: '#0d9488', collapsed: false, conditionRules: [],
      groupApplyTo: 'leader',
      fields: [
        { id: 'cf-1', paletteId: 'group-name', label: 'Group Name', icon: <UsersRound size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, isGroupField: true, groupScope: 'group_level' },
        { id: 'cf-2', paletteId: 'group-size', label: 'Group Size', icon: <Hash size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, isGroupField: true, groupScope: 'group_level' },
        { id: 'cf-3', paletteId: 'group-leader-name', label: 'Group Leader Name', icon: <UserCog size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, isGroupField: true, groupScope: 'leader' },
        { id: 'cf-4', paletteId: 'group-leader-mobile', label: 'Group Leader Mobile', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, isGroupField: true, groupScope: 'leader' },
        { id: 'cf-5', paletteId: 'group-leader-email', label: 'Group Leader Email', icon: <Mail size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true, isGroupField: true, groupScope: 'leader' },
        { id: 'cf-6', paletteId: 'group-purpose', label: 'Purpose of Group Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, isGroupField: true, groupScope: 'group_level' },
      ],
    },
    {
      id: 'step-2', number: 2, title: 'Member Details', color: '#7c3aed', collapsed: false, conditionRules: [],
      groupApplyTo: 'all_members',
      fields: [
        { id: 'cf-7', paletteId: 'group-members', label: 'Group Members', icon: <Table2 size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, isGroupField: true, groupScope: 'all_members' },
        { id: 'cf-8', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, groupScope: 'all_members' },
      ],
    },
    {
      id: 'step-3', number: 3, title: 'Compliance & NDA', color: '#405189', collapsed: false,
      conditionRules: [{ id: 'cr-1', condition: 'IF Group Size > 20', action: '→ Require advance approval', type: 'warning' }],
      groupApplyTo: 'leader',
      fields: [
        { id: 'cf-9', paletteId: 'health-declaration', label: 'Health Declaration', icon: <Shield size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, groupScope: 'leader' },
        { id: 'cf-10', paletteId: 'nda-terms', label: 'NDA / Terms & Conditions', icon: <Clipboard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, groupScope: 'leader' },
      ],
    },
    {
      id: 'step-4', number: 4, title: 'Arrival & Check-in', color: '#d97706', collapsed: false, conditionRules: [],
      groupApplyTo: 'all_members',
      fields: [
        { id: 'cf-11', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true, groupScope: 'all_members' },
        { id: 'cf-12', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, groupScope: 'leader' },
      ],
    },
  ],
};

const visitorTypeWorkflowTitle: Record<string, string> = {
  Vendor: 'Vendor Onboarding Flow',
  Contractor: 'Contractor Access Flow',
  Interviewee: 'Interviewee Check-in Flow',
  'VIP / Executive': 'VIP Executive Express Flow',
  'Delivery / Courier': 'Delivery & Courier Flow',
  'Govt Official': 'Govt Official Access Flow',
  'General Visitor': 'General Visitor Check-in Flow',
  'Group Visit': 'Group Visit Workflow',
};

// ─── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-primary-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
  );
}

// ─── Induction Hub Data ────────────────────────────────────────────────────────

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

// ─── Induction Hub Palette ────────────────────────────────────────────────────

function InductionHubPalette({ onDragStart, onDragEnd }: { onDragStart: (e: React.DragEvent, field: PaletteField) => void; onDragEnd: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const [openSub, setOpenSub] = useState<Record<string, boolean>>({ videos: true, quizzes: true, documents: true, health: true });
  const toggleSub = (key: string) => setOpenSub(prev => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    {
      key: 'videos', label: 'Videos', count: inductionVideos.length,
      icon: <Video size={11} className="text-blue-600" />, iconBg: 'bg-blue-100',
      items: inductionVideos.map(v => ({
        id: `induction-video-${v.id}`, label: v.title,
        description: `Video · ${v.duration}${v.mustWatch ? ' · Must Watch' : ''}`,
        icon: <Play size={15} className="text-blue-500" />, category: 'induction',
        renderIcon: <Play size={10} className="text-blue-500" />, iconBg: 'bg-blue-50',
        sub: v.mustWatch ? <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-amber-100 text-amber-700">Must Watch</span> : null,
        meta: v.duration,
      })),
    },
    {
      key: 'quizzes', label: 'Quizzes', count: inductionQuizzes.length,
      icon: <HelpCircle size={11} className="text-purple-600" />, iconBg: 'bg-purple-100',
      items: inductionQuizzes.map(q => ({
        id: `induction-quiz-${q.id}`, label: q.name,
        description: `Quiz · ${q.questions} Qs · Pass: ${q.passingScore}%`,
        icon: <CheckSquare size={15} className="text-purple-500" />, category: 'induction',
        renderIcon: <CheckSquare size={10} className="text-purple-500" />, iconBg: 'bg-purple-50',
        sub: <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-green-100 text-green-700">Pass: {q.passingScore}%</span>,
        meta: `${q.questions} Qs`,
      })),
    },
    {
      key: 'documents', label: 'Document Vault', count: inductionDocuments.length,
      icon: <BookOpen size={11} className="text-teal-600" />, iconBg: 'bg-teal-100',
      items: inductionDocuments.map(d => ({
        id: `induction-doc-${d.id}`, label: d.name,
        description: `Document · ${d.version}${d.requireSignature ? ' · Signature Required' : ''}`,
        icon: <FileText size={15} className="text-teal-500" />, category: 'induction',
        renderIcon: <FileText size={10} className="text-teal-500" />, iconBg: 'bg-teal-50',
        sub: d.requireSignature ? <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-blue-100 text-blue-700">Signature</span> : null,
        meta: d.version,
      })),
    },
    {
      key: 'health', label: 'Health Screening', count: inductionHealthForms.length,
      icon: <Heart size={11} className="text-red-500" />, iconBg: 'bg-red-100',
      items: inductionHealthForms.map(h => ({
        id: `induction-health-${h.id}`, label: h.name,
        description: `Health Screening · ${h.questions} Qs · Pass: ${h.passingScore}%`,
        icon: <Shield size={15} className="text-red-400" />, category: 'induction',
        renderIcon: <Shield size={10} className="text-red-400" />, iconBg: 'bg-red-50',
        sub: <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-green-100 text-green-700">Pass: {h.passingScore}%</span>,
        meta: `${h.questions} Qs`,
      })),
    },
  ];

  return (
    <div className="mb-1">
      <button onClick={() => setExpanded(o => !o)} className="w-full flex items-center justify-between px-4 py-2 hover:bg-surface transition-colors">
        <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">Induction Hub</span>
        {expanded ? <ChevronUp size={12} className="text-text-muted" /> : <ChevronDown size={12} className="text-text-muted" />}
      </button>
      {expanded && (
        <div className="px-2 pb-1 space-y-1">
          {sections.map(sec => (
            <div key={sec.key} className="rounded-lg border border-border overflow-hidden">
              <button onClick={() => toggleSub(sec.key)} className="w-full flex items-center justify-between px-3 py-2 bg-surface hover:bg-primary-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${sec.iconBg}`}>{sec.icon}</div>
                  <span className="text-[11px] font-semibold text-text-primary">{sec.label}</span>
                  <span className="text-[10px] text-text-muted bg-slate-100 px-1.5 py-0.5 rounded-full">{sec.count}</span>
                </div>
                {openSub[sec.key] ? <ChevronUp size={11} className="text-text-muted" /> : <ChevronDown size={11} className="text-text-muted" />}
              </button>
              {openSub[sec.key] && (
                <div className="divide-y divide-border">
                  {sec.items.map(item => {
                    const field: PaletteField = { id: item.id, label: item.label, description: item.description, icon: item.icon, category: item.category };
                    return (
                      <div key={item.id} draggable onDragStart={e => onDragStart(e, field)} onDragEnd={onDragEnd}
                        className="flex items-center gap-2.5 px-3 py-2 bg-white hover:bg-primary-50 transition-colors cursor-grab active:cursor-grabbing group">
                        <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${item.iconBg}`}>{item.renderIcon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-text-primary truncate">{item.label}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-text-muted">{item.meta}</span>
                            {item.sub}
                          </div>
                        </div>
                        <GripVertical size={11} className="text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Group Details Palette Section ────────────────────────────────────────────

function GroupDetailsPalette({ onDragStart, onDragEnd }: { onDragStart: (e: React.DragEvent, field: PaletteField) => void; onDragEnd: () => void }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-1">
      {/* Section Header */}
      <button
        onClick={() => setExpanded(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-teal-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-teal-100 flex items-center justify-center">
            <UsersRound size={10} className="text-teal-600" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-teal-700 uppercase">Group Details</span>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">Group Only</span>
        </div>
        {expanded ? <ChevronUp size={12} className="text-teal-500" /> : <ChevronDown size={12} className="text-teal-500" />}
      </button>

      {expanded && (
        <div className="px-2 pb-2 space-y-0.5">
          {/* Group Detail Fields */}
          {groupDetailFields.map(field => (
            <div
              key={field.id}
              draggable
              onDragStart={e => onDragStart(e, field)}
              onDragEnd={onDragEnd}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all duration-150 group"
            >
              <div className="w-7 h-7 rounded-md bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 mt-0.5 group-hover:bg-teal-100">
                {field.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-medium text-text-primary truncate">{field.label}</span>
                  {field.badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 shrink-0">{field.badge}</span>}
                </div>
                <p className="text-[10px] text-text-muted truncate mt-0.5">{field.description}</p>
              </div>
              <GripVertical size={12} className="text-text-muted shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {/* Group Members special field */}
          <div
            draggable
            onDragStart={e => onDragStart(e, groupMembersField)}
            onDragEnd={onDragEnd}
            className="flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg cursor-grab active:cursor-grabbing border border-teal-200 bg-teal-50/60 hover:bg-teal-50 hover:border-teal-300 transition-all duration-150 group mt-1"
          >
            <div className="w-7 h-7 rounded-md bg-teal-100 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
              <Table2 size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[12px] font-semibold text-teal-800">Group Members</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-200 text-teal-800">Repeatable</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">CSV Upload</span>
              </div>
              <p className="text-[10px] text-teal-700 mt-0.5 leading-relaxed">Repeatable member table — Name, Mobile, Email, ID, Photo. Supports CSV bulk upload.</p>
            </div>
            <GripVertical size={12} className="text-text-muted shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Group Scope Badge ────────────────────────────────────────────────────────

function GroupScopeBadge({ scope }: { scope?: 'leader' | 'all_members' | 'group_level' }) {
  if (!scope) return null;
  if (scope === 'leader') return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">
      <UserCog size={8} /> Leader
    </span>
  );
  if (scope === 'all_members') return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700 shrink-0">
      <Users size={8} /> All Members
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 shrink-0">
      <UsersRound size={8} /> Group
    </span>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────

interface StepCardProps {
  step: WorkflowStep;
  isActive: boolean;
  isGroupVisit: boolean;
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
  onToggleGroupApplyTo: () => void;
}

function StepCard({
  step, isActive, isGroupVisit, dragOverStep, dragOverIndex, draggingCanvasField,
  selectedField, onToggleCollapse, onSelectField, onRemoveField, onDragOver, onDrop,
  onDragLeave, onCanvasDragStart, onCanvasDragEnd, onToggleGroupApplyTo,
}: StepCardProps) {
  const isDragTarget = dragOverStep === step.id;
  const stepColors: Record<number, { bg: string; text: string; border: string; badge: string }> = {
    1: { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200', badge: 'bg-primary-600' },
    2: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-600' },
    3: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-500' },
    4: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', badge: 'bg-teal-600' },
  };
  const colors = stepColors[step.number] ?? stepColors[1];

  return (
    <div
      className={`rounded-xl border-2 bg-white transition-all duration-150 ${isDragTarget ? 'border-emerald-400 shadow-md' : isActive ? 'border-emerald-300' : 'border-border shadow-card'}`}
      onDragOver={e => onDragOver(e)}
      onDrop={e => onDrop(e)}
      onDragLeave={onDragLeave}
    >
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${colors.bg} border-b ${colors.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full ${colors.badge} text-white text-[12px] font-bold flex items-center justify-center shrink-0`}>{step.number}</div>
          <div>
            <h3 className={`text-[13px] font-semibold ${colors.text}`}>{step.title}</h3>
            <p className="text-[11px] text-text-muted">{step.fields.length} field{step.fields.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Group Apply-To Toggle */}
          {isGroupVisit && (
            <button
              onClick={onToggleGroupApplyTo}
              title="Toggle: Group Leader only / All Members"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                step.groupApplyTo === 'all_members' ?'bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200' :'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200'
              }`}
            >
              {step.groupApplyTo === 'all_members'
                ? <><Users size={10} /> All Members</>
                : <><UserCog size={10} /> Leader Only</>
              }
            </button>
          )}
          <button className={`p-1 rounded hover:bg-white/60 transition-colors ${colors.text}`}><Zap size={13} /></button>
          <button onClick={onToggleCollapse} className={`p-1 rounded hover:bg-white/60 transition-colors ${colors.text}`}>
            {step.collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {!step.collapsed && (
        <div className="p-3 space-y-1">
          {step.fields.length === 0 && (
            <div className={`flex items-center justify-center py-6 rounded-lg border-2 border-dashed transition-all ${isDragTarget ? 'border-primary-300 bg-primary-50' : 'border-border'}`}>
              <p className="text-[12px] text-text-muted">Drop fields here</p>
            </div>
          )}
          {step.fields.map((field, idx) => {
            const isSelected = selectedField?.stepId === step.id && selectedField?.fieldId === field.id;
            const isDraggingThis = draggingCanvasField?.stepId === step.id && draggingCanvasField?.fieldId === field.id;
            const isDropTarget = isDragTarget && dragOverIndex === idx;
            return (
              <React.Fragment key={field.id}>
                {isDropTarget && <div className="h-1 rounded-full bg-primary-400 mx-2 transition-all" />}
                <div
                  draggable
                  onDragStart={e => onCanvasDragStart(e, field.id, idx)}
                  onDragEnd={onCanvasDragEnd}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(e, idx); }}
                  onClick={() => onSelectField(field.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-150 group ${isDraggingThis ? 'opacity-40' : ''} ${isSelected ? 'border-emerald-300 bg-emerald-50 shadow-sm' : field.isGroupField ? 'border-teal-100 bg-teal-50/30 hover:border-teal-200 hover:bg-teal-50/60' : 'border-border bg-white hover:border-emerald-200 hover:bg-emerald-50/40'}`}
                >
                  <GripVertical size={13} className="text-text-muted cursor-grab shrink-0 opacity-40 group-hover:opacity-100" />
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${field.isGroupField ? 'bg-teal-100 text-teal-700' : 'bg-surface text-text-secondary'}`}>{field.icon}</div>
                  <span className="flex-1 text-[13px] font-medium text-text-primary truncate">{field.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isGroupVisit && field.groupScope && <GroupScopeBadge scope={field.groupScope} />}
                    {field.locked && <Lock size={11} className="text-text-muted" />}
                    {field.verified && <CheckCircle size={11} className="text-green-500" />}
                    {field.mandatory ? <Eye size={11} className="text-primary-400" /> : <EyeOff size={11} className="text-text-muted" />}
                    <button onClick={e => { e.stopPropagation(); onRemoveField(field.id); }} className="p-0.5 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                      <X size={10} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          {step.fields.length > 0 && (
            <div
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(e, step.fields.length); }}
              onDrop={e => { e.stopPropagation(); onDrop(e, step.fields.length); }}
              className={`h-8 rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${isDragTarget && dragOverIndex === step.fields.length ? 'border-primary-400 bg-primary-50' : 'border-transparent'}`}
            >
              {isDragTarget && dragOverIndex === step.fields.length && <p className="text-[10px] text-primary-500">Drop here</p>}
            </div>
          )}
          {step.conditionRules.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 px-1">Condition Rules</p>
              {step.conditionRules.map(rule => (
                <div key={rule.id} className={`flex items-start gap-2 px-3 py-2 rounded-lg ${rule.type === 'warning' ? 'bg-amber-50 border border-amber-100' : 'bg-blue-50 border border-blue-100'}`}>
                  <AlertTriangle size={12} className={`shrink-0 mt-0.5 ${rule.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}`} />
                  <div>
                    <p className={`text-[11px] font-semibold ${rule.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}`}>{rule.condition}</p>
                    <p className={`text-[11px] ${rule.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}`}>{rule.action}</p>
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

// ─── Group Preview Modal ───────────────────────────────────────────────────────

function GroupPreviewModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'leader' | 'members'>('leader');
  const [memberCount, setMemberCount] = useState(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
              <UsersRound size={16} className="text-teal-700" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-text-primary">Preview as Visitor — Group Flow</h2>
              <p className="text-[11px] text-text-muted">Simulating group check-in experience</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-teal-100 transition-colors text-text-muted">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          <button
            onClick={() => setActiveTab('leader')}
            className={`flex items-center gap-1.5 px-4 py-3 text-[12px] font-semibold border-b-2 transition-colors ${activeTab === 'leader' ? 'border-teal-600 text-teal-700' : 'border-transparent text-text-muted hover:text-text-secondary'}`}
          >
            <UserCog size={13} /> Group Leader Screen
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-1.5 px-4 py-3 text-[12px] font-semibold border-b-2 transition-colors ${activeTab === 'members' ? 'border-teal-600 text-teal-700' : 'border-transparent text-text-muted hover:text-text-secondary'}`}
          >
            <Users size={13} /> Member Check-in ({memberCount})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'leader' ? (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                <p className="text-[12px] font-semibold text-teal-800 mb-3 flex items-center gap-2">
                  <UserCog size={14} /> Step 1 — Group Registration (Leader fills)
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Group Name', placeholder: 'e.g. TechCorp Training Batch 2024', mandatory: true },
                    { label: 'Group Size', placeholder: 'e.g. 15', mandatory: true },
                    { label: 'Group Leader Name', placeholder: 'Your full name', mandatory: true },
                    { label: 'Group Leader Mobile', placeholder: '+91 98765 43210', mandatory: true },
                    { label: 'Group Leader Email', placeholder: 'leader@company.com', mandatory: false },
                    { label: 'Purpose of Group Visit', placeholder: 'Select purpose...', mandatory: true },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                        {f.label} {f.mandatory && <span className="text-red-500">*</span>}
                      </label>
                      <div className="w-full px-3 py-2 text-[12px] border border-border rounded-lg bg-white text-text-muted">
                        {f.placeholder}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-[12px] font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <Clipboard size={14} /> Step 3 — NDA & Health Declaration (Leader signs)
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-100">
                    <CheckSquare size={14} className="text-amber-600" />
                    <span className="text-[12px] text-text-secondary">I agree to the NDA and Terms & Conditions on behalf of the group</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-100">
                    <Shield size={14} className="text-amber-600" />
                    <span className="text-[12px] text-text-secondary">Health Declaration — All group members are symptom-free</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-semibold text-text-primary">Group Members Check-in</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMemberCount(c => Math.max(1, c - 1))}
                    className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-text-muted hover:bg-surface text-[14px] font-bold"
                  >−</button>
                  <span className="text-[12px] font-semibold text-text-primary w-6 text-center">{memberCount}</span>
                  <button
                    onClick={() => setMemberCount(c => Math.min(10, c + 1))}
                    className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-text-muted hover:bg-surface text-[14px] font-bold"
                  >+</button>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
                <Download size={13} className="text-blue-600 shrink-0" />
                <span className="text-[11px] text-blue-700">Download CSV template to bulk-add members, then upload to auto-populate the table.</span>
                <button className="ml-auto text-[11px] font-semibold text-blue-700 underline whitespace-nowrap">Download CSV</button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-surface border-b border-border">
                      <th className="text-left px-3 py-2 font-semibold text-text-secondary">#</th>
                      <th className="text-left px-3 py-2 font-semibold text-text-secondary">Name</th>
                      <th className="text-left px-3 py-2 font-semibold text-text-secondary">Mobile</th>
                      <th className="text-left px-3 py-2 font-semibold text-text-secondary">Email</th>
                      <th className="text-left px-3 py-2 font-semibold text-text-secondary">ID Type</th>
                      <th className="text-left px-3 py-2 font-semibold text-text-secondary">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: memberCount }, (_, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-surface/50">
                        <td className="px-3 py-2 text-text-muted">{i + 1}</td>
                        <td className="px-3 py-2 text-text-muted italic">Member {i + 1}</td>
                        <td className="px-3 py-2 text-text-muted">—</td>
                        <td className="px-3 py-2 text-text-muted">—</td>
                        <td className="px-3 py-2 text-text-muted">—</td>
                        <td className="px-3 py-2">
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold">Pending</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-dashed border-teal-300 text-teal-700 text-[12px] font-medium hover:bg-teal-50 transition-colors">
                <UserPlus size={14} /> Add Member Manually
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-surface/50 flex items-center justify-between">
          <p className="text-[11px] text-text-muted">This is a preview simulation — no data is saved</p>
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── QR & Badge Config Panel ──────────────────────────────────────────────────

function GroupQRBadgePanel() {
  const [qrMode, setQrMode] = useState<'master' | 'individual'>('master');
  const [badgeMode, setBadgeMode] = useState<'group' | 'individual'>('group');

  return (
    <div className="mx-4 mb-4 rounded-xl border border-teal-200 bg-teal-50/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-teal-100 bg-teal-50">
        <QrCode size={14} className="text-teal-700" />
        <span className="text-[12px] font-semibold text-teal-800">QR Code & Badge Generation</span>
        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-teal-200 text-teal-800">Group Only</span>
      </div>
      <div className="p-4 space-y-4">
        {/* QR Code */}
        <div>
          <p className="text-[11px] font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
            <QrCode size={12} className="text-teal-600" /> QR Code Generation
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setQrMode('master')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-center transition-all ${qrMode === 'master' ? 'border-teal-500 bg-teal-50' : 'border-border bg-white hover:border-teal-200'}`}
            >
              <QrCode size={18} className={qrMode === 'master' ? 'text-teal-600' : 'text-text-muted'} />
              <span className={`text-[11px] font-semibold ${qrMode === 'master' ? 'text-teal-700' : 'text-text-secondary'}`}>One Master QR</span>
              <span className="text-[10px] text-text-muted">Entire group</span>
            </button>
            <button
              onClick={() => setQrMode('individual')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-center transition-all ${qrMode === 'individual' ? 'border-teal-500 bg-teal-50' : 'border-border bg-white hover:border-teal-200'}`}
            >
              <LayoutList size={18} className={qrMode === 'individual' ? 'text-teal-600' : 'text-text-muted'} />
              <span className={`text-[11px] font-semibold ${qrMode === 'individual' ? 'text-teal-700' : 'text-text-secondary'}`}>Individual QR</span>
              <span className="text-[10px] text-text-muted">Per member</span>
            </button>
          </div>
        </div>
        {/* Badge Printing */}
        <div>
          <p className="text-[11px] font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
            <Printer size={12} className="text-teal-600" /> Badge Printing
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setBadgeMode('group')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-center transition-all ${badgeMode === 'group' ? 'border-teal-500 bg-teal-50' : 'border-border bg-white hover:border-teal-200'}`}
            >
              <BadgeCheck size={18} className={badgeMode === 'group' ? 'text-teal-600' : 'text-text-muted'} />
              <span className={`text-[11px] font-semibold ${badgeMode === 'group' ? 'text-teal-700' : 'text-text-secondary'}`}>Group Badge</span>
              <span className="text-[10px] text-text-muted">Single badge</span>
            </button>
            <button
              onClick={() => setBadgeMode('individual')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-center transition-all ${badgeMode === 'individual' ? 'border-teal-500 bg-teal-50' : 'border-border bg-white hover:border-teal-200'}`}
            >
              <Printer size={18} className={badgeMode === 'individual' ? 'text-teal-600' : 'text-text-muted'} />
              <span className={`text-[11px] font-semibold ${badgeMode === 'individual' ? 'text-teal-700' : 'text-text-secondary'}`}>Individual Badges</span>
              <span className="text-[10px] text-text-muted">Per member</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 bg-teal-100/60 rounded-lg">
          <CheckCircle size={12} className="text-teal-600 shrink-0" />
          <p className="text-[10px] text-teal-700">
            {qrMode === 'master' ? 'One master QR' : 'Individual QRs'} + {badgeMode === 'group' ? 'group badge' : 'individual badges'} will be generated on publish.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function WorkflowBuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const visitorType = searchParams.get('visitorType') ?? 'Vendor';
  const isGroupVisit = visitorType === 'Group Visit';

  const [steps, setSteps] = useState<WorkflowStep[]>(() => visitorTypeSteps[visitorType] ?? defaultSteps);
  const [selectedField, setSelectedField] = useState<{ stepId: string; fieldId: string } | null>(null);
  const [fieldProperties, setFieldProperties] = useState<Record<string, FieldProperties>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [workflowStatus, setWorkflowStatus] = useState<'draft' | 'active'>('draft');
  const [dragOverStep, setDragOverStep] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingPaletteField, setDraggingPaletteField] = useState<PaletteField | null>(null);
  const [draggingCanvasField, setDraggingCanvasField] = useState<{ stepId: string; fieldId: string; index: number } | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showPublishedToast, setShowPublishedToast] = useState(false);
  const [showGroupPreview, setShowGroupPreview] = useState(false);

  const getFieldProps = useCallback((stepId: string, fieldId: string): FieldProperties => {
    const key = `${stepId}:${fieldId}`;
    if (fieldProperties[key]) return fieldProperties[key];
    const step = steps.find(s => s.id === stepId);
    const field = step?.fields.find(f => f.id === fieldId);
    return {
      fieldId, stepId, label: field?.label ?? '', placeholder: '', defaultValue: '',
      mandatory: field?.mandatory ?? false, visibleToHost: field?.visibleToHost ?? true,
      visibleToVisitor: field?.visibleToVisitor ?? true,
      groupScope: (field as CanvasField)?.groupScope,
    };
  }, [fieldProperties, steps]);

  const updateFieldProps = (stepId: string, fieldId: string, patch: Partial<FieldProperties>) => {
    const key = `${stepId}:${fieldId}`;
    const current = getFieldProps(stepId, fieldId);
    const updated = { ...current, ...patch };
    setFieldProperties(prev => ({ ...prev, [key]: updated }));
    setSteps(prev => prev.map(s => s.id !== stepId ? s : {
      ...s,
      fields: s.fields.map(f => f.id !== fieldId ? f : {
        ...f,
        mandatory: updated.mandatory,
        visibleToHost: updated.visibleToHost,
        visibleToVisitor: updated.visibleToVisitor,
        label: updated.label,
        groupScope: updated.groupScope,
      }),
    }));
  };

  const toggleCategory = (catId: string) => setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  const toggleStep = (stepId: string) => setSteps(prev => prev.map(s => s.id === stepId ? { ...s, collapsed: !s.collapsed } : s));

  const toggleStepGroupApplyTo = (stepId: string) => {
    setSteps(prev => prev.map(s => s.id !== stepId ? s : {
      ...s,
      groupApplyTo: s.groupApplyTo === 'all_members' ? 'leader' : 'all_members',
    }));
  };

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`, number: steps.length + 1, title: `New Step ${steps.length + 1}`,
      color: '#405189', collapsed: false, conditionRules: [], fields: [],
      groupApplyTo: isGroupVisit ? 'leader' : undefined,
    };
    setSteps(prev => [...prev, newStep]);
  };

  const removeField = (stepId: string, fieldId: string) => {
    setSteps(prev => prev.map(s => s.id !== stepId ? s : { ...s, fields: s.fields.filter(f => f.id !== fieldId) }));
    if (selectedField?.stepId === stepId && selectedField?.fieldId === fieldId) setSelectedField(null);
  };

  const filteredCategories = paletteCategories.map(cat => ({
    ...cat,
    fields: cat.fields.filter(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase())),
  })).filter(cat => cat.fields.length > 0);

  const handlePaletteDragStart = (e: React.DragEvent, field: PaletteField) => {
    setDraggingPaletteField(field);
    setDraggingCanvasField(null);
    e.dataTransfer.effectAllowed = 'copy';
  };
  const handlePaletteDragEnd = () => { setDraggingPaletteField(null); setDragOverStep(null); setDragOverIndex(null); };

  const handleCanvasDragStart = (e: React.DragEvent, stepId: string, fieldId: string, index: number) => {
    setDraggingCanvasField({ stepId, fieldId, index });
    setDraggingPaletteField(null);
    e.dataTransfer.effectAllowed = 'move';
    e.stopPropagation();
  };
  const handleCanvasDragEnd = () => { setDraggingCanvasField(null); setDragOverStep(null); setDragOverIndex(null); };

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
      const iconMap: Record<string, React.ReactNode> = {
        'full-name': <User size={14} />, 'mobile-number': <Phone size={14} />, 'email-address': <Mail size={14} />,
        'id-type-number': <CreditCard size={14} />, 'live-photo': <Camera size={14} />, 'company-org': <Users size={14} />,
        'vehicle-number': <Hash size={14} />, 'host-name': <User size={14} />, 'purpose-of-visit': <FileText size={14} />,
        'health-declaration': <Shield size={14} />, 'nda-terms': <Clipboard size={14} />, 'expected-duration': <Calendar size={14} />,
        'text-input': <Type size={14} />, 'dropdown': <List size={14} />, 'rating': <Star size={14} />, 'toggle-field': <ToggleLeft size={14} />,
        'group-name': <UsersRound size={14} />, 'group-size': <Hash size={14} />, 'group-leader-name': <UserCog size={14} />,
        'group-leader-mobile': <Phone size={14} />, 'group-leader-email': <Mail size={14} />, 'group-purpose': <FileText size={14} />,
        'group-members': <Table2 size={14} />,
      };
      const newField: CanvasField = {
        id: `cf-${Date.now()}`, paletteId: draggingPaletteField.id, label: draggingPaletteField.label,
        icon: iconMap[draggingPaletteField.id] ?? <FileText size={14} />, mandatory: false,
        visibleToHost: true, visibleToVisitor: true,
        isGroupField: draggingPaletteField.isGroupField,
        groupScope: draggingPaletteField.isGroupField ? 'group_level' : undefined,
      };
      setSteps(prev => prev.map(s => {
        if (s.id !== targetStepId) return s;
        const newFields = [...s.fields];
        newFields.splice(targetIndex !== undefined ? targetIndex : newFields.length, 0, newField);
        return { ...s, fields: newFields };
      }));
      setDraggingPaletteField(null);
    } else if (draggingCanvasField) {
      const { stepId: srcStepId, fieldId, index: srcIndex } = draggingCanvasField;
      setSteps(prev => {
        let movedField: CanvasField | undefined;
        const newSteps = prev.map(s => { if (s.id !== srcStepId) return s; movedField = s.fields[srcIndex]; return { ...s, fields: s.fields.filter((_, i) => i !== srcIndex) }; });
        return newSteps.map(s => { if (s.id !== targetStepId) return s; const newFields = [...s.fields]; if (movedField) newFields.splice(targetIndex !== undefined ? targetIndex : newFields.length, 0, movedField); return { ...s, fields: newFields }; });
      });
      setDraggingCanvasField(null);
    }
  };

  const handleSaveDraft = () => {
    setWorkflowStatus('draft');
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handlePublish = () => {
    setWorkflowStatus('active');
    setShowPublishedToast(true);
    setTimeout(() => setShowPublishedToast(false), 2500);
  };

  const selectedProps = selectedField ? getFieldProps(selectedField.stepId, selectedField.fieldId) : null;
  const selectedCanvasField = selectedField
    ? steps.find(s => s.id === selectedField.stepId)?.fields.find(f => f.id === selectedField.fieldId)
    : null;

  return (
    <div className="flex flex-col h-full bg-surface overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 bg-white border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/workflows')} className="p-1.5 rounded-lg hover:bg-surface transition-colors">
            <ArrowLeft size={16} className="text-text-secondary" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-text-primary">{visitorTypeWorkflowTitle[visitorType] ?? 'Workflow Builder'}</h1>
            {/* Group Visit Badge */}
            {isGroupVisit && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                <UsersRound size={11} /> Group Visit
              </span>
            )}
            <Settings size={14} className="text-text-muted cursor-pointer hover:text-text-secondary" />
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
            workflowStatus === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${workflowStatus === 'active' ? 'bg-green-500' : 'bg-amber-400'}`} />
            {workflowStatus === 'active' ? 'ACTIVE' : 'DRAFT'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-text-secondary font-medium flex items-center gap-1.5">
              <Users size={13} className="text-text-muted" />
              Visitor Type:
            </span>
            <span className={`px-3 py-1.5 rounded-lg border text-[13px] font-medium ${isGroupVisit ? 'border-teal-200 bg-teal-50 text-teal-800' : 'border-border bg-white text-text-primary'}`}>
              {visitorType}
            </span>
          </div>
          <div className="h-5 w-px bg-border" />
          {/* Preview as Visitor */}
          <button
            onClick={() => isGroupVisit ? setShowGroupPreview(true) : undefined}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-[13px] font-medium transition-colors ${isGroupVisit ? 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100' : 'border-border bg-white text-text-secondary hover:bg-surface cursor-default opacity-60'}`}
            title={isGroupVisit ? 'Preview group visitor flow' : 'Preview as Visitor'}
          >
            <Eye size={14} />
            Preview as Visitor
          </button>
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
            <h2 className="text-[13px] font-semibold text-text-primary mb-2.5">Field Palette</h2>
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
            {/* Group Details Section — only for Group Visit */}
            {isGroupVisit && (
              <GroupDetailsPalette
                onDragStart={(e, field) => handlePaletteDragStart(e, field)}
                onDragEnd={handlePaletteDragEnd}
              />
            )}
            {filteredCategories.map(cat => (
              <div key={cat.id} className="mb-1">
                <button onClick={() => toggleCategory(cat.id)} className="w-full flex items-center justify-between px-4 py-2 hover:bg-surface transition-colors">
                  <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">{cat.label}</span>
                  {collapsedCategories[cat.id] ? <ChevronDown size={12} className="text-text-muted" /> : <ChevronUp size={12} className="text-text-muted" />}
                </button>
                {!collapsedCategories[cat.id] && (
                  <div className="px-2 pb-1 space-y-0.5">
                    {cat.fields.map(field => (
                      <div key={field.id} draggable onDragStart={e => handlePaletteDragStart(e, field)} onDragEnd={handlePaletteDragEnd}
                        className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-primary-50 border border-transparent hover:border-primary-100 transition-all duration-150 group">
                        <div className="w-7 h-7 rounded-md bg-primary-50 flex items-center justify-center text-primary-600 shrink-0 mt-0.5 group-hover:bg-primary-100">{field.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-text-primary truncate">{field.label}</span>
                            {field.badge && <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-blue-50 text-blue-700 shrink-0">{field.badge}</span>}
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
            <InductionHubPalette onDragStart={(e, field) => handlePaletteDragStart(e, field)} onDragEnd={handlePaletteDragEnd} />
            <div className="px-4 py-3 mt-2">
              <p className="text-[11px] text-text-muted text-center italic">Drag fields into workflow steps on the canvas →</p>
            </div>
          </div>
        </div>

        {/* ── CENTER: Workflow Canvas ── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-surface px-6 py-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[15px] font-semibold text-text-primary">Workflow Canvas</h2>
              <p className="text-[12px] text-text-muted mt-0.5">{steps.length} steps · drag fields from the palette to add them</p>
            </div>
            <button onClick={addStep} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-primary-300 text-primary-600 text-[12px] font-medium hover:bg-primary-50 transition-colors">
              <Plus size={14} />
              Add Step
            </button>
          </div>

          {/* Group Visit info banner */}
          {isGroupVisit && (
            <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-teal-50 border border-teal-200">
              <UsersRound size={15} className="text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-semibold text-teal-800">Group Visit Mode Active</p>
                <p className="text-[11px] text-teal-700 mt-0.5">Each step has a toggle to apply it to the <strong>Group Leader only</strong> or <strong>All Members</strong>. Fields show scope badges. Group-specific fields are highlighted in teal.</p>
              </div>
            </div>
          )}

          <div className="space-y-2 mt-4">
            {steps.map((step, stepIdx) => (
              <React.Fragment key={step.id}>
                <StepCard
                  step={step}
                  isActive={selectedField?.stepId === step.id}
                  isGroupVisit={isGroupVisit}
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
                  onToggleGroupApplyTo={() => toggleStepGroupApplyTo(step.id)}
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
                {selectedProps && <p className="text-[10px] text-text-muted">{selectedProps.label}</p>}
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
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Field Label</label>
                <input type="text" value={selectedProps.label} onChange={e => updateFieldProps(selectedField!.stepId, selectedField!.fieldId, { label: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg bg-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 text-text-primary" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Placeholder Text</label>
                <input type="text" value={selectedProps.placeholder} onChange={e => updateFieldProps(selectedField!.stepId, selectedField!.fieldId, { placeholder: e.target.value })}
                  placeholder="e.g. Enter your full name"
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg bg-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 placeholder:text-text-muted text-text-primary" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Default Value</label>
                <input type="text" value={selectedProps.defaultValue} onChange={e => updateFieldProps(selectedField!.stepId, selectedField!.fieldId, { defaultValue: e.target.value })}
                  placeholder="Leave blank for no default"
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg bg-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 placeholder:text-text-muted text-text-primary" />
                <p className="text-[10px] text-text-muted mt-1">Auto-filled from previous visit if return visitor matches</p>
              </div>
              <div className="h-px bg-border" />

              {/* Group-specific: Field Applies To */}
              {isGroupVisit && (
                <>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <UsersRound size={13} className="text-teal-600" />
                      <h3 className="text-[12px] font-semibold text-text-primary">This field applies to</h3>
                    </div>
                    <div className="space-y-1.5">
                      {([
                        { value: 'leader', label: 'Group Leader only', icon: <UserCog size={12} />, color: 'amber' },
                        { value: 'all_members', label: 'All Group Members', icon: <Users size={12} />, color: 'teal' },
                        { value: 'group_level', label: 'Group Level (shared)', icon: <UsersRound size={12} />, color: 'purple' },
                      ] as const).map(opt => (
                        <div key={opt.value} className="flex items-center justify-between">
                          <span className="text-[11px] text-text-secondary">{opt.label}</span>
                          <div className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${selectedProps.groupScope === opt.value ? opt.color === 'amber' ? 'bg-amber-500' : opt.color === 'teal' ? 'bg-teal-500' : 'bg-purple-500' : 'bg-gray-200'}`}>
                            <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${selectedProps.groupScope === opt.value ? opt.color === 'amber' ? 'translate-x-4' : opt.color === 'teal' ? 'translate-x-4' : 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Group Members field config */}
                  {selectedCanvasField?.paletteId === 'group-members' && (
                    <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-3">
                      <p className="text-[11px] font-semibold text-teal-800 mb-2 flex items-center gap-1.5">
                        <Table2 size={12} /> Member Fields Configuration
                      </p>
                      <div className="space-y-1.5">
                        {[
                          { label: 'Name', checked: true },
                          { label: 'Mobile', checked: true },
                          { label: 'Email', checked: true },
                          { label: 'ID Type & Number', checked: true },
                          { label: 'Live Photo', checked: false },
                          { label: 'Custom Field', checked: false },
                        ].map(mf => (
                          <div key={mf.label} className="flex items-center justify-between">
                            <span className="text-[11px] text-text-secondary">{mf.label}</span>
                            <div className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${mf.checked ? 'bg-teal-500' : 'bg-gray-200'}`}>
                              <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${mf.checked ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-teal-600 mt-2">These fields will appear in the repeatable member table and CSV template.</p>
                    </div>
                  )}
                  <div className="h-px bg-border" />
                </>
              )}

              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Eye size={13} className="text-text-secondary" />
                  <h3 className="text-[12px] font-semibold text-text-primary">Visibility & Behaviour</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Lock size={13} className="text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[12px] font-medium text-text-primary">Mandatory</p>
                        <p className="text-[10px] text-text-muted">Visitor must fill this field to proceed</p>
                      </div>
                    </div>
                    <Toggle checked={selectedProps.mandatory} onChange={v => updateFieldProps(selectedField!.stepId, selectedField!.fieldId, { mandatory: v })} />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <User size={13} className="text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[12px] font-medium text-text-primary">Visible to Host</p>
                        <p className="text-[10px] text-text-muted">Host can see this field in notifications</p>
                      </div>
                    </div>
                    <Toggle checked={selectedProps.visibleToHost} onChange={v => updateFieldProps(selectedField!.stepId, selectedField!.fieldId, { visibleToHost: v })} />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Eye size={13} className="text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[12px] font-medium text-text-primary">Visible to Visitor</p>
                        <p className="text-[10px] text-text-muted">Shown to visitor during check-in flow</p>
                      </div>
                    </div>
                    <Toggle checked={selectedProps.visibleToVisitor} onChange={v => updateFieldProps(selectedField!.stepId, selectedField!.fieldId, { visibleToVisitor: v })} />
                  </div>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-1.5 text-green-600">
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

          {/* QR & Badge Panel — only for Group Visit, shown at bottom of right panel */}
          {isGroupVisit && !selectedField && <GroupQRBadgePanel />}
        </div>
      </div>

      {/* ── Toast Notifications ── */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg shadow-lg text-[13px] font-medium z-50">
          <Save size={14} />
          Draft saved successfully
        </div>
      )}
      {showPublishedToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg shadow-lg text-[13px] font-medium z-50">
          <CheckCircle size={14} />
          Workflow published — status set to Active
        </div>
      )}

      {/* ── Group Preview Modal ── */}
      {showGroupPreview && <GroupPreviewModal onClose={() => setShowGroupPreview(false)} />}
    </div>
  );
}
