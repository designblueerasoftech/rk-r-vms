'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, ChevronDown, ChevronUp, GripVertical, Lock, Eye, EyeOff,
  CheckCircle, AlertTriangle, X, Save, Upload, ArrowLeft, Zap, Settings,
  User, Phone, Mail, CreditCard, Camera, FileText, Users, Shield, Hash,
  Calendar, ToggleLeft, List, Type, Star, Clipboard, GitBranch, Printer,
  QrCode, Bell, DoorOpen, Video, HelpCircle, BookOpen, Heart, Play, Clock, CheckSquare,
  UsersRound, UserCog, Table2, Download, UserPlus, LayoutList, BadgeCheck,
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
  type: 'warning' | 'info' | 'orange';
}

interface WorkflowStep {
  id: string;
  number: number;
  title: string;
  color: string;
  fields: CanvasField[];
  conditionRules: ConditionRule[];
  collapsed: boolean;
  isConditionBlock?: boolean;
  isFinalAction?: boolean;
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
      { id: 'visitor-type', label: 'Visitor Type', description: 'Contractor, Vendor, VIP, Delivery...', icon: <Users size={15} />, category: 'visit' },
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

// ─── Initial Walk-In Steps ─────────────────────────────────────────────────────

const initialWalkInSteps: WorkflowStep[] = [
  {
    id: 'wi-step-1',
    number: 1,
    title: 'Capture Identity',
    color: '#ea580c',
    collapsed: false,
    conditionRules: [],
    fields: [
      { id: 'wi-cf-1', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
      { id: 'wi-cf-2', paletteId: 'id-type-number', label: 'ID Type & Number (Aadhaar / PAN / DL)', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
      { id: 'wi-cf-3', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'wi-cf-4', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
    ],
  },
  {
    id: 'wi-step-2',
    number: 2,
    title: 'Visit Details',
    color: '#ea580c',
    collapsed: false,
    conditionRules: [],
    fields: [
      { id: 'wi-cf-5', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'wi-cf-6', paletteId: 'visitor-type', label: 'Visitor Type', icon: <Users size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'wi-cf-7', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'wi-cf-8', paletteId: 'company-org', label: 'Company / Representing Organisation', icon: <Users size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true },
    ],
  },
  {
    id: 'wi-step-3',
    number: 3,
    title: 'Compliance',
    color: '#ea580c',
    collapsed: false,
    conditionRules: [
      { id: 'wi-cr-1', condition: 'IF Health Declaration = Fail', action: '→ Auto-block visitor + notify security', type: 'warning' },
    ],
    fields: [
      { id: 'wi-cf-9', paletteId: 'health-declaration', label: 'Health Declaration / Screening', icon: <Shield size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'wi-cf-10', paletteId: 'nda-terms', label: 'Induction Hub — Safety Video / Quiz', icon: <Clipboard size={14} />, mandatory: false, visibleToHost: false, visibleToVisitor: true },
    ],
  },
  {
    id: 'wi-condition',
    number: 4,
    title: 'Condition Block',
    color: '#ea580c',
    collapsed: false,
    isConditionBlock: true,
    conditionRules: [
      { id: 'wi-cr-2', condition: 'IF Visitor Type = Contractor', action: '→ Require validity period + QR pass print', type: 'orange' },
    ],
    fields: [],
  },
  {
    id: 'wi-final',
    number: 5,
    title: 'Final Action',
    color: '#ea580c',
    collapsed: false,
    isFinalAction: true,
    conditionRules: [],
    fields: [
      { id: 'wi-cf-11', paletteId: 'host-name', label: 'Host receives instant photo + approval request', icon: <Bell size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: false, locked: true },
      { id: 'wi-cf-12', paletteId: 'toggle-field', label: 'On Approval → Print branded pass', icon: <Printer size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      { id: 'wi-cf-13', paletteId: 'toggle-field', label: 'Auto Turnstile Open', icon: <DoorOpen size={14} />, mandatory: true, visibleToHost: false, visibleToVisitor: false, locked: true },
    ],
  },
];

// ─── Per-Visitor-Type Walk-In Steps ───────────────────────────────────────────

const walkInVisitorTypeSteps: Record<string, WorkflowStep[]> = {
  Vendor: initialWalkInSteps,
  Contractor: [
    {
      id: 'wi-step-1',
      number: 1,
      title: 'Capture Identity',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-1', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'wi-cf-2', paletteId: 'id-type-number', label: 'ID Type & Number (Aadhaar / PAN / DL)', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'wi-cf-3', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-4', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
      ],
    },
    {
      id: 'wi-step-2',
      number: 2,
      title: 'Compliance & Induction',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [
        { id: 'wi-cr-1', condition: 'IF Health Declaration = Fail', action: '→ Auto-block contractor + notify security', type: 'warning' },
      ],
      fields: [
        { id: 'wi-cf-5', paletteId: 'health-declaration', label: 'Health Declaration / Screening', icon: <Shield size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-6', paletteId: 'nda-terms', label: 'NDA / Terms & Conditions', icon: <Clipboard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-7', paletteId: 'expected-duration', label: 'Expected Duration', icon: <Calendar size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'wi-step-3',
      number: 3,
      title: 'Site Access',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [
        { id: 'wi-cr-2', condition: 'IF Visitor Type = Contractor', action: '→ Require validity period + QR pass print', type: 'orange' },
      ],
      fields: [
        { id: 'wi-cf-8', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-9', paletteId: 'vehicle-number', label: 'Vehicle Number', icon: <Hash size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true },
        { id: 'wi-cf-10', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'wi-final',
      number: 4,
      title: 'Final Action',
      color: '#ea580c',
      collapsed: false,
      isFinalAction: true,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-11', paletteId: 'host-name', label: 'Host receives instant photo + approval request', icon: <Bell size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: false, locked: true },
        { id: 'wi-cf-12', paletteId: 'toggle-field', label: 'On Approval → Print branded pass', icon: <Printer size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-13', paletteId: 'toggle-field', label: 'Auto Turnstile Open', icon: <DoorOpen size={14} />, mandatory: true, visibleToHost: false, visibleToVisitor: false, locked: true },
      ],
    },
  ],
  Interviewee: [
    {
      id: 'wi-step-1',
      number: 1,
      title: 'Candidate Identity',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-1', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'wi-cf-2', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-3', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'wi-cf-4', paletteId: 'email-address', label: 'Email Address', icon: <Mail size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'wi-step-2',
      number: 2,
      title: 'Visit Details',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-5', paletteId: 'host-name', label: 'Host Name (Interviewer)', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-6', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-7', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'wi-final',
      number: 3,
      title: 'Final Action',
      color: '#ea580c',
      collapsed: false,
      isFinalAction: true,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-8', paletteId: 'host-name', label: 'Host receives instant photo + approval request', icon: <Bell size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: false, locked: true },
        { id: 'wi-cf-9', paletteId: 'toggle-field', label: 'On Approval → Print branded pass', icon: <Printer size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      ],
    },
  ],
  'VIP / Executive': [
    {
      id: 'wi-step-1',
      number: 1,
      title: 'VIP Identity',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-1', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'wi-cf-2', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-3', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'wi-cf-4', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'wi-step-2',
      number: 2,
      title: 'Express Check-in',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [
        { id: 'wi-cr-1', condition: 'IF Visitor Type = VIP / Executive', action: '→ Skip quiz + Auto-approve host escort', type: 'info' },
      ],
      fields: [
        { id: 'wi-cf-5', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-6', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'wi-final',
      number: 3,
      title: 'Final Action',
      color: '#ea580c',
      collapsed: false,
      isFinalAction: true,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-7', paletteId: 'host-name', label: 'Host receives instant photo + approval request', icon: <Bell size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: false, locked: true },
        { id: 'wi-cf-8', paletteId: 'toggle-field', label: 'On Approval → Auto Turnstile Open', icon: <DoorOpen size={14} />, mandatory: true, visibleToHost: false, visibleToVisitor: false, locked: true },
      ],
    },
  ],
  'Delivery / Courier': [
    {
      id: 'wi-step-1',
      number: 1,
      title: 'Delivery Identity',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-1', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'wi-cf-2', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-3', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
        { id: 'wi-cf-4', paletteId: 'company-org', label: 'Company / Organisation', icon: <Users size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'wi-step-2',
      number: 2,
      title: 'Delivery Details',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-5', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-6', paletteId: 'vehicle-number', label: 'Vehicle Number', icon: <Hash size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
        { id: 'wi-cf-7', paletteId: 'expected-duration', label: 'Expected Duration', icon: <Calendar size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'wi-final',
      number: 3,
      title: 'Final Action',
      color: '#ea580c',
      collapsed: false,
      isFinalAction: true,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-8', paletteId: 'toggle-field', label: 'Print delivery receipt pass', icon: <Printer size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-9', paletteId: 'toggle-field', label: 'Auto Turnstile Open', icon: <DoorOpen size={14} />, mandatory: true, visibleToHost: false, visibleToVisitor: false, locked: true },
      ],
    },
  ],
  'Govt Official': [
    {
      id: 'wi-step-1',
      number: 1,
      title: 'Official Identity',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-1', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'wi-cf-2', paletteId: 'id-type-number', label: 'ID Type & Number (Govt ID)', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'wi-cf-3', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-4', paletteId: 'company-org', label: 'Department / Ministry', icon: <Users size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true },
      ],
    },
    {
      id: 'wi-step-2',
      number: 2,
      title: 'Clearance & Escort',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [
        { id: 'wi-cr-1', condition: 'IF Visitor Type = Govt Official', action: '→ Mandatory escort assigned', type: 'info' },
      ],
      fields: [
        { id: 'wi-cf-5', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-6', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
      ],
    },
    {
      id: 'wi-final',
      number: 3,
      title: 'Final Action',
      color: '#ea580c',
      collapsed: false,
      isFinalAction: true,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-7', paletteId: 'host-name', label: 'Host receives instant photo + approval request', icon: <Bell size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: false, locked: true },
        { id: 'wi-cf-8', paletteId: 'toggle-field', label: 'On Approval → Print branded pass', icon: <Printer size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-9', paletteId: 'toggle-field', label: 'Auto Turnstile Open', icon: <DoorOpen size={14} />, mandatory: true, visibleToHost: false, visibleToVisitor: false, locked: true },
      ],
    },
  ],
  'General Visitor': [
    {
      id: 'wi-step-1',
      number: 1,
      title: 'Capture Identity',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-1', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true },
        { id: 'wi-cf-2', paletteId: 'full-name', label: 'Full Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-3', paletteId: 'mobile-number', label: 'Mobile Number', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, verified: true },
      ],
    },
    {
      id: 'wi-step-2',
      number: 2,
      title: 'Visit Details',
      color: '#ea580c',
      collapsed: false,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-4', paletteId: 'purpose-of-visit', label: 'Purpose of Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-5', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-6', paletteId: 'email-address', label: 'Email Address', icon: <Mail size={14} />, mandatory: false, visibleToHost: false, visibleToVisitor: true },
      ],
    },
    {
      id: 'wi-final',
      number: 3,
      title: 'Final Action',
      color: '#ea580c',
      collapsed: false,
      isFinalAction: true,
      conditionRules: [],
      fields: [
        { id: 'wi-cf-7', paletteId: 'host-name', label: 'Host receives instant photo + approval request', icon: <Bell size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: false, locked: true },
        { id: 'wi-cf-8', paletteId: 'toggle-field', label: 'On Approval → Print branded pass', icon: <Printer size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true },
        { id: 'wi-cf-9', paletteId: 'toggle-field', label: 'Auto Turnstile Open', icon: <DoorOpen size={14} />, mandatory: true, visibleToHost: false, visibleToVisitor: false, locked: true },
      ],
    },
  ],
  'Group Visit': [
    {
      id: 'wi-step-1',
      number: 1,
      title: 'Group Registration',
      color: '#0d9488',
      collapsed: false,
      conditionRules: [],
      groupApplyTo: 'leader',
      fields: [
        { id: 'wi-cf-1', paletteId: 'group-name', label: 'Group Name', icon: <UsersRound size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, isGroupField: true, groupScope: 'group_level' },
        { id: 'wi-cf-2', paletteId: 'group-size', label: 'Group Size', icon: <Hash size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, isGroupField: true, groupScope: 'group_level' },
        { id: 'wi-cf-3', paletteId: 'group-leader-name', label: 'Group Leader Name', icon: <UserCog size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, isGroupField: true, groupScope: 'leader' },
        { id: 'wi-cf-4', paletteId: 'group-leader-mobile', label: 'Group Leader Mobile', icon: <Phone size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, isGroupField: true, groupScope: 'leader' },
        { id: 'wi-cf-5', paletteId: 'group-leader-email', label: 'Group Leader Email', icon: <Mail size={14} />, mandatory: false, visibleToHost: true, visibleToVisitor: true, isGroupField: true, groupScope: 'leader' },
        { id: 'wi-cf-6', paletteId: 'group-purpose', label: 'Purpose of Group Visit', icon: <FileText size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, isGroupField: true, groupScope: 'group_level' },
      ],
    },
    {
      id: 'wi-step-2',
      number: 2,
      title: 'Member Details',
      color: '#0d9488',
      collapsed: false,
      conditionRules: [],
      groupApplyTo: 'all_members',
      fields: [
        { id: 'wi-cf-7', paletteId: 'group-members', label: 'Group Members', icon: <Table2 size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, isGroupField: true, groupScope: 'all_members' },
        { id: 'wi-cf-8', paletteId: 'id-type-number', label: 'ID Type & Number', icon: <CreditCard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, groupScope: 'all_members' },
      ],
    },
    {
      id: 'wi-step-3',
      number: 3,
      title: 'Compliance & NDA',
      color: '#0d9488',
      collapsed: false,
      conditionRules: [
        { id: 'wi-cr-1', condition: 'IF Group Size > 20', action: '→ Require advance approval', type: 'warning' },
      ],
      groupApplyTo: 'leader',
      fields: [
        { id: 'wi-cf-9', paletteId: 'health-declaration', label: 'Health Declaration', icon: <Shield size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, groupScope: 'leader' },
        { id: 'wi-cf-10', paletteId: 'nda-terms', label: 'NDA / Terms & Conditions', icon: <Clipboard size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, groupScope: 'leader' },
      ],
    },
    {
      id: 'wi-step-4',
      number: 4,
      title: 'Arrival & Check-in',
      color: '#0d9488',
      collapsed: false,
      conditionRules: [],
      groupApplyTo: 'all_members',
      fields: [
        { id: 'wi-cf-11', paletteId: 'live-photo', label: 'Live Photo + Liveness Check', icon: <Camera size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, verified: true, groupScope: 'all_members' },
        { id: 'wi-cf-12', paletteId: 'host-name', label: 'Host Name', icon: <User size={14} />, mandatory: true, visibleToHost: true, visibleToVisitor: true, locked: true, groupScope: 'leader' },
      ],
    },
  ],
};

// ─── Walk-In Workflow title per visitor type ──────────────────────────────────

const walkInVisitorTypeTitle: Record<string, string> = {
  Vendor: 'Vendor Walk-In Flow',
  Contractor: 'Contractor Walk-In Flow',
  Interviewee: 'Interviewee Walk-In Flow',
  'VIP / Executive': 'VIP Executive Walk-In Flow',
  'Delivery / Courier': 'Delivery & Courier Walk-In Flow',
  'Govt Official': 'Govt Official Walk-In Flow',
  'General Visitor': 'General Visitor Walk-In Flow',
  'Group Visit': 'Group Visit Walk-In Flow',
};

// ─── Induction Hub Data ───────────────────────────────────────────────────────

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
                      <GripVertical size={12} className="text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                      <GripVertical size={12} className="text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                      <GripVertical size={12} className="text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                    icon: <Heart size={15} className="text-red-500" />,
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
                        <Heart size={10} className="text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-text-primary truncate">{h.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-text-muted">{h.questions} Qs</span>
                          <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-green-100 text-green-700">Pass: {h.passingScore}%</span>
                        </div>
                      </div>
                      <GripVertical size={12} className="text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
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

// ─── Group Details Palette Section ───────────────────────────────────────────

function GroupDetailsPalette({
  onDragStart,
  onDragEnd,
}: {
  onDragStart: (e: React.DragEvent, field: PaletteField) => void;
  onDragEnd: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-1">
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

// ─── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-orange-500' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-1'}`}
      />
    </button>
  );
}

// ─── Group Preview Modal ──────────────────────────────────────────────────────

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
              <p className="text-[11px] text-text-muted">Simulating group walk-in check-in experience</p>
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

interface WalkInWorkflowBuilderProps {
  initialVisitorType?: string;
  initialWorkflowName?: string;
  backHref?: string;
}

export default function WalkInWorkflowBuilder({ initialVisitorType = 'General Visitor', initialWorkflowName = '', backHref }: WalkInWorkflowBuilderProps) {
  const router = useRouter();
  const resolvedVisitorType = initialVisitorType && walkInVisitorTypeSteps[initialVisitorType] ? initialVisitorType : 'General Visitor';
  const resolvedTitle = initialWorkflowName || walkInVisitorTypeTitle[resolvedVisitorType] || 'Walk-In Visitor Flow';

  const isGroupVisit = resolvedVisitorType === 'Group Visit';

  const [steps, setSteps] = useState<WorkflowStep[]>(walkInVisitorTypeSteps[resolvedVisitorType] ?? initialWalkInSteps);
  const [selectedField, setSelectedField] = useState<{ stepId: string; fieldId: string } | null>(null);
  const [fieldProperties, setFieldProperties] = useState<Record<string, FieldProperties>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [visitorType] = useState(resolvedVisitorType);
  const [workflowTitle] = useState(resolvedTitle);
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
      fieldId,
      stepId,
      label: field?.label ?? '',
      placeholder: '',
      defaultValue: '',
      mandatory: field?.mandatory ?? false,
      visibleToHost: field?.visibleToHost ?? true,
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

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleStep = (stepId: string) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, collapsed: !s.collapsed } : s));
  };

  const toggleStepGroupApplyTo = (stepId: string) => {
    setSteps(prev => prev.map(s => s.id !== stepId ? s : {
      ...s,
      groupApplyTo: s.groupApplyTo === 'all_members' ? 'leader' : 'all_members',
    }));
  };

  const addStep = () => {
    const regularSteps = steps.filter(s => !s.isConditionBlock && !s.isFinalAction);
    const newStep: WorkflowStep = {
      id: `wi-step-${Date.now()}`,
      number: regularSteps.length + 1,
      title: `New Step ${regularSteps.length + 1}`,
      color: '#ea580c',
      collapsed: false,
      conditionRules: [],
      fields: [],
      groupApplyTo: isGroupVisit ? 'leader' : undefined,
    };
    // Insert before condition block
    const conditionIdx = steps.findIndex(s => s.isConditionBlock);
    if (conditionIdx >= 0) {
      const newSteps = [...steps];
      newSteps.splice(conditionIdx, 0, newStep);
      setSteps(newSteps);
    } else {
      setSteps(prev => [...prev, newStep]);
    }
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

    const iconMap: Record<string, React.ReactNode> = {
      'full-name': <User size={14} />, 'mobile-number': <Phone size={14} />,
      'email-address': <Mail size={14} />, 'id-type-number': <CreditCard size={14} />,
      'live-photo': <Camera size={14} />, 'company-org': <Users size={14} />,
      'vehicle-number': <Hash size={14} />, 'host-name': <User size={14} />,
      'purpose-of-visit': <FileText size={14} />, 'visitor-type': <Users size={14} />,
      'health-declaration': <Shield size={14} />, 'nda-terms': <Clipboard size={14} />,
      'expected-duration': <Calendar size={14} />, 'text-input': <Type size={14} />,
      'dropdown': <List size={14} />, 'rating': <Star size={14} />,
      'toggle-field': <ToggleLeft size={14} />,
      'group-name': <UsersRound size={14} />, 'group-size': <Hash size={14} />,
      'group-leader-name': <UserCog size={14} />, 'group-leader-mobile': <Phone size={14} />,
      'group-leader-email': <Mail size={14} />, 'group-purpose': <FileText size={14} />,
      'group-members': <Table2 size={14} />,
      'induction-video-v1': <Play size={14} className="text-blue-500" />,
      'induction-video-v2': <Play size={14} className="text-blue-500" />,
      'induction-video-v3': <Play size={14} className="text-blue-500" />,
      'induction-quiz-q1': <CheckSquare size={14} className="text-purple-500" />,
      'induction-quiz-q2': <CheckSquare size={14} className="text-purple-500" />,
      'induction-doc-d1': <FileText size={14} className="text-teal-500" />,
      'induction-doc-d2': <FileText size={14} className="text-teal-500" />,
      'induction-health-hs1': <Heart size={14} className="text-red-500" />,
      'induction-health-hs2': <Heart size={14} className="text-red-500" />,
    };

    if (draggingPaletteField) {
      const newField: CanvasField = {
        id: `wi-cf-${Date.now()}`,
        paletteId: draggingPaletteField.id,
        label: draggingPaletteField.label,
        icon: iconMap[draggingPaletteField.id] ?? <FileText size={14} />,
        mandatory: false,
        visibleToHost: true,
        visibleToVisitor: true,
        isGroupField: draggingPaletteField.isGroupField,
        groupScope: draggingPaletteField.isGroupField ? 'group_level' : undefined,
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
      const { stepId: srcStepId, index: srcIndex } = draggingCanvasField;
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

  const handleSaveDraft = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handlePublish = () => {
    setShowPublishedToast(true);
    setTimeout(() => setShowPublishedToast(false), 2500);
  };

  const selectedProps = selectedField
    ? getFieldProps(selectedField.stepId, selectedField.fieldId)
    : null;

  const selectedCanvasField = selectedField
    ? steps.find(s => s.id === selectedField.stepId)?.fields.find(f => f.id === selectedField.fieldId)
    : null;

  const regularSteps = steps.filter(s => !s.isConditionBlock && !s.isFinalAction);
  const conditionBlock = steps.find(s => s.isConditionBlock);
  const finalAction = steps.find(s => s.isFinalAction);

  return (
    <div className="flex flex-col h-full bg-surface overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 bg-white border-b border-border shadow-topbar">
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-lg hover:bg-surface transition-colors" onClick={() => router.push(backHref ?? '/workflows/walk-in')}>
            <ArrowLeft size={16} className="text-text-secondary" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isGroupVisit ? 'bg-teal-100' : 'bg-orange-100'}`}>
                <GitBranch size={12} className={isGroupVisit ? 'text-teal-600' : 'text-orange-600'} />
              </div>
              <h1 className="text-[15px] font-semibold text-text-primary">{workflowTitle}</h1>
            </div>
            {/* Group Visit Badge */}
            {isGroupVisit && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                <UsersRound size={11} /> Group Visit
              </span>
            )}
            <Settings size={14} className="text-text-muted cursor-pointer hover:text-text-secondary" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
            DRAFT
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-white text-[13px] font-medium text-text-primary hover:bg-surface hover:border-orange-300 transition-colors"
          >
            <Save size={14} />
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-semibold transition-colors shadow-sm ${isGroupVisit ? 'bg-teal-600 hover:bg-teal-700' : 'bg-orange-500 hover:bg-orange-600'}`}
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
                className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-border rounded-lg bg-surface focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 placeholder:text-text-muted"
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

            {filteredCategories.filter(cat => cat.id !== 'custom').map(cat => (
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
                        className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-orange-50 hover:border-orange-100 border border-transparent transition-all duration-150 group"
                      >
                        <div className="w-7 h-7 rounded-md bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 mt-0.5 group-hover:bg-orange-100">
                          {field.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-text-primary truncate">{field.label}</span>
                            {field.badge && (
                              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-orange-100 text-orange-700 shrink-0">{field.badge}</span>
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

            {filteredCategories.filter(cat => cat.id === 'custom').map(cat => (
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
                        className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-orange-50 hover:border-orange-100 border border-transparent transition-all duration-150 group"
                      >
                        <div className="w-7 h-7 rounded-md bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 mt-0.5 group-hover:bg-orange-100">
                          {field.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-text-primary truncate">{field.label}</span>
                            {field.badge && (
                              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-orange-100 text-orange-700 shrink-0">{field.badge}</span>
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

            <div className="px-4 py-3 mt-2">
              <p className="text-[11px] text-text-muted text-center italic">
                Drag fields into workflow steps on the canvas →
              </p>
            </div>
          </div>
        </div>

        {/* ── CENTER: Workflow Canvas ── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-surface px-6 py-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[15px] font-semibold text-text-primary">Workflow Canvas</h2>
              <p className="text-[12px] text-text-muted mt-0.5">
                {regularSteps.length} steps · drag fields from the palette to add them
              </p>
            </div>
            <button
              onClick={addStep}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-dashed text-[12px] font-medium transition-colors ${isGroupVisit ? 'border-teal-300 text-teal-600 hover:bg-teal-50' : 'border-orange-300 text-orange-600 hover:bg-orange-50'}`}
            >
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

          <div className="space-y-4 mt-4">
            {/* Regular Steps */}
            {regularSteps.map((step, stepIdx) => (
              <React.Fragment key={step.id}>
                <WalkInStepCard
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
                {stepIdx < regularSteps.length - 1 && (
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-px h-4 ${isGroupVisit ? 'bg-teal-200' : 'bg-orange-200'}`} />
                      <div className={`w-2 h-2 rounded-full border-2 bg-white ${isGroupVisit ? 'border-teal-300' : 'border-orange-300'}`} />
                      <div className={`w-px h-4 ${isGroupVisit ? 'bg-teal-200' : 'bg-orange-200'}`} />
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
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-150 cursor-pointer ${dragOverStep === 'new' ? (isGroupVisit ? 'border-teal-400 bg-teal-50' : 'border-orange-400 bg-orange-50') : (isGroupVisit ? 'border-border hover:border-teal-300 hover:bg-teal-50/50' : 'border-border hover:border-orange-300 hover:bg-orange-50/50')}`}
              onClick={addStep}
            >
              <Plus size={18} className="mx-auto text-text-muted mb-1" />
              <p className="text-[12px] text-text-muted">Add new step or drop a field here</p>
            </div>

            {/* Only show condition/final blocks for non-group visitor types */}
            {!isGroupVisit && (
              <>
                {/* Connector to Condition Block */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 bg-orange-200" />
                    <div className="w-2 h-2 rounded-full border-2 border-orange-300 bg-white" />
                    <div className="w-px h-4 bg-orange-200" />
                  </div>
                </div>

                {/* Condition Block */}
                {conditionBlock && (
                  <div className="rounded-xl border-2 border-orange-300 bg-white shadow-card overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-orange-50 border-b border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                          <GitBranch size={13} />
                        </div>
                        <div>
                          <h3 className="text-[13px] font-semibold text-orange-700">Condition Block</h3>
                          <p className="text-[11px] text-text-muted">Branching logic based on visitor type</p>
                        </div>
                      </div>
                      <button onClick={() => toggleStep(conditionBlock.id)} className="p-1 rounded hover:bg-orange-100 transition-colors text-orange-600">
                        {conditionBlock.collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>
                    </div>
                    {!conditionBlock.collapsed && (
                      <div className="p-3 space-y-2">
                        {conditionBlock.conditionRules.map(rule => (
                          <div
                            key={rule.id}
                            className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-orange-50 border border-orange-200"
                          >
                            <GitBranch size={13} className="text-orange-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[12px] font-semibold text-orange-700">{rule.condition}</p>
                              <p className="text-[11px] text-orange-600 mt-0.5">{rule.action}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 border border-dashed border-orange-200">
                          <QrCode size={13} className="text-orange-400 shrink-0" />
                          <p className="text-[11px] text-orange-600">Contractor → Validity period input + QR pass generation + Print</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Connector to Final Action */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 bg-orange-200" />
                    <div className="w-2 h-2 rounded-full border-2 border-orange-300 bg-white" />
                    <div className="w-px h-4 bg-orange-200" />
                  </div>
                </div>

                {/* Final Action Block */}
                {finalAction && (
                  <div className="rounded-xl border-2 border-orange-400 bg-white shadow-card overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                          <Zap size={13} />
                        </div>
                        <div>
                          <h3 className="text-[13px] font-semibold text-orange-700">Final Action</h3>
                          <p className="text-[11px] text-text-muted">Triggered on workflow completion</p>
                        </div>
                      </div>
                      <button onClick={() => toggleStep(finalAction.id)} className="p-1 rounded hover:bg-orange-100 transition-colors text-orange-600">
                        {finalAction.collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>
                    </div>
                    {!finalAction.collapsed && (
                      <div className="p-3 space-y-1.5">
                        {finalAction.fields.map(field => (
                          <div
                            key={field.id}
                            onClick={() => setSelectedField({ stepId: finalAction.id, fieldId: field.id })}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-150 group ${selectedField?.stepId === finalAction.id && selectedField?.fieldId === field.id ? 'border-orange-300 bg-orange-50 shadow-sm' : 'border-border bg-white hover:border-orange-200 hover:bg-surface'}`}
                          >
                            <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                              {field.icon}
                            </div>
                            <span className="flex-1 text-[13px] font-medium text-text-primary truncate">{field.label}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {field.locked && <Lock size={11} className="text-text-muted" />}
                              <CheckCircle size={11} className="text-orange-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Field Properties ── */}
        <div className="w-[260px] shrink-0 flex flex-col bg-white border-l border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isGroupVisit ? 'bg-teal-50' : 'bg-orange-50'}`}>
                <Settings size={13} className={isGroupVisit ? 'text-teal-600' : 'text-orange-600'} />
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
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Field Label</label>
                <input
                  type="text"
                  value={selectedProps.label}
                  onChange={e => updateFieldProps(selectedField!.stepId, selectedField!.fieldId, { label: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg bg-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 text-text-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Placeholder Text</label>
                <input
                  type="text"
                  value={selectedProps.placeholder}
                  onChange={e => updateFieldProps(selectedField!.stepId, selectedField!.fieldId, { placeholder: e.target.value })}
                  placeholder="e.g. Enter your full name"
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg bg-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 placeholder:text-text-muted text-text-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Default Value</label>
                <input
                  type="text"
                  value={selectedProps.defaultValue}
                  onChange={e => updateFieldProps(selectedField!.stepId, selectedField!.fieldId, { defaultValue: e.target.value })}
                  placeholder="Leave blank for no default"
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg bg-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 placeholder:text-text-muted text-text-primary"
                />
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
                        { value: 'leader', label: 'Group Leader only', color: 'amber' },
                        { value: 'all_members', label: 'All Group Members', color: 'teal' },
                        { value: 'group_level', label: 'Group Level (shared)', color: 'purple' },
                      ] as const).map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => updateFieldProps(selectedField!.stepId, selectedField!.fieldId, { groupScope: opt.value })}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-[11px] transition-all ${selectedProps.groupScope === opt.value
                            ? opt.color === 'amber' ? 'border-amber-300 bg-amber-50 text-amber-800 font-semibold'
                              : opt.color === 'teal'? 'border-teal-300 bg-teal-50 text-teal-800 font-semibold' :'border-purple-300 bg-purple-50 text-purple-800 font-semibold' :'border-border bg-white text-text-secondary hover:bg-surface'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {selectedProps.groupScope === opt.value && <CheckCircle size={12} className={opt.color === 'amber' ? 'text-amber-600' : opt.color === 'teal' ? 'text-teal-600' : 'text-purple-600'} />}
                        </button>
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

              <div className="flex items-center gap-1.5" style={{ color: '#16a34a' }}>
                <CheckCircle size={12} />
                <p className="text-[10px]">Changes auto-saved to draft — publish to go live</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isGroupVisit ? 'bg-teal-50' : 'bg-orange-50'}`}>
                <Settings size={20} className={isGroupVisit ? 'text-teal-400' : 'text-orange-400'} />
              </div>
              <p className="text-[12px] font-medium text-text-secondary mb-1">No field selected</p>
              <p className="text-[11px] text-text-muted">Click any field on the canvas to edit its properties</p>
            </div>
          )}

          {/* QR & Badge Panel — only for Group Visit, shown at bottom of right panel when no field selected */}
          {isGroupVisit && !selectedField && <GroupQRBadgePanel />}
        </div>
      </div>

      {/* ── Toast Notifications ── */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-text-primary text-white rounded-lg shadow-modal text-[13px] font-medium z-50">
          <Save size={14} />
          Draft saved successfully
        </div>
      )}
      {showPublishedToast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 text-white rounded-lg shadow-modal text-[13px] font-medium z-50 ${isGroupVisit ? 'bg-teal-600' : 'bg-orange-500'}`}>
          <CheckCircle size={14} />
          Walk-In workflow published successfully
        </div>
      )}

      {/* ── Group Preview Modal ── */}
      {showGroupPreview && <GroupPreviewModal onClose={() => setShowGroupPreview(false)} />}
    </div>
  );
}

// ─── Walk-In Step Card ─────────────────────────────────────────────────────────

interface WalkInStepCardProps {
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

function WalkInStepCard({
  step, isActive, isGroupVisit, dragOverStep, dragOverIndex, draggingCanvasField, selectedField,
  onToggleCollapse, onSelectField, onRemoveField,
  onDragOver, onDrop, onDragLeave, onCanvasDragStart, onCanvasDragEnd, onToggleGroupApplyTo,
}: WalkInStepCardProps) {
  const isDragTarget = dragOverStep === step.id;

  const stepBadgeColors = isGroupVisit
    ? ['bg-teal-600', 'bg-teal-500', 'bg-teal-700', 'bg-teal-400']
    : ['bg-orange-500', 'bg-orange-600', 'bg-amber-500', 'bg-orange-400'];
  const badgeColor = stepBadgeColors[(step.number - 1) % stepBadgeColors.length];

  const headerBg = isGroupVisit ? 'bg-teal-50 border-teal-200' : 'bg-orange-50 border-orange-200';
  const headerText = isGroupVisit ? 'text-teal-700' : 'text-orange-700';
  const borderActive = isGroupVisit ? 'border-teal-400 shadow-card-md' : 'border-orange-400 shadow-card-md';
  const borderSelected = isGroupVisit ? 'border-teal-200 shadow-card' : 'border-orange-200 shadow-card';

  return (
    <div
      className={`rounded-xl border-2 bg-white transition-all duration-150 ${isDragTarget ? borderActive : isActive ? borderSelected : 'border-border shadow-card'}`}
      onDragOver={e => onDragOver(e)}
      onDrop={e => onDrop(e)}
      onDragLeave={onDragLeave}
    >
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${headerBg} border-b`}>
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full ${badgeColor} text-white text-[12px] font-bold flex items-center justify-center shrink-0`}>
            {step.number}
          </div>
          <div>
            <h3 className={`text-[13px] font-semibold ${headerText}`}>{step.title}</h3>
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
          <button className={`p-1 rounded hover:bg-white/60 transition-colors ${headerText}`}>
            <Zap size={13} />
          </button>
          <button onClick={onToggleCollapse} className={`p-1 rounded hover:bg-white/60 transition-colors ${headerText}`}>
            {step.collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {!step.collapsed && (
        <div className="p-3 space-y-1">
          {step.fields.length === 0 && (
            <div className={`flex items-center justify-center py-6 rounded-lg border-2 border-dashed transition-all ${isDragTarget ? (isGroupVisit ? 'border-teal-300 bg-teal-50' : 'border-orange-300 bg-orange-50') : 'border-border'}`}>
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
                  <div className={`h-1 rounded-full mx-2 transition-all ${isGroupVisit ? 'bg-teal-400' : 'bg-orange-400'}`} />
                )}
                <div
                  draggable
                  onDragStart={e => onCanvasDragStart(e, field.id, idx)}
                  onDragEnd={onCanvasDragEnd}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(e, idx); }}
                  onClick={() => onSelectField(field.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-150 group ${isDraggingThis ? 'opacity-40' : ''} ${
                    isSelected
                      ? (isGroupVisit ? 'border-teal-300 bg-teal-50 shadow-sm' : 'border-orange-300 bg-orange-50 shadow-sm')
                      : field.isGroupField
                        ? 'border-teal-100 bg-teal-50/30 hover:border-teal-200 hover:bg-teal-50/60' : (isGroupVisit ?'border-border bg-white hover:border-teal-200 hover:bg-teal-50/40' : 'border-border bg-white hover:border-orange-200 hover:bg-surface')
                  }`}
                >
                  <GripVertical size={13} className="text-text-muted cursor-grab shrink-0 opacity-40 group-hover:opacity-100" />
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${field.isGroupField ? 'bg-teal-100 text-teal-700' : (isGroupVisit ? 'bg-teal-50 text-teal-500' : 'bg-orange-50 text-orange-500')}`}>
                    {field.icon}
                  </div>
                  <span className="flex-1 text-[13px] font-medium text-text-primary truncate">{field.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isGroupVisit && field.groupScope && <GroupScopeBadge scope={field.groupScope} />}
                    {field.locked && <Lock size={11} className="text-text-muted" />}
                    {field.verified && <CheckCircle size={11} className={isGroupVisit ? 'text-teal-500' : 'text-orange-500'} />}
                    {field.mandatory
                      ? <Eye size={11} className={isGroupVisit ? 'text-teal-400' : 'text-orange-400'} />
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

          {step.fields.length > 0 && (
            <div
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(e, step.fields.length); }}
              onDrop={e => { e.stopPropagation(); onDrop(e, step.fields.length); }}
              className={`h-8 rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${isDragTarget && dragOverIndex === step.fields.length ? (isGroupVisit ? 'border-teal-400 bg-teal-50' : 'border-orange-400 bg-orange-50') : 'border-transparent'}`}
            >
              {isDragTarget && dragOverIndex === step.fields.length && (
                <p className={`text-[10px] ${isGroupVisit ? 'text-teal-500' : 'text-orange-500'}`}>Drop here</p>
              )}
            </div>
          )}

          {step.conditionRules.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 px-1">Condition Rules</p>
              {step.conditionRules.map(rule => (
                <div
                  key={rule.id}
                  className={`flex items-start gap-2 px-3 py-2 rounded-lg ${rule.type === 'warning' ? 'bg-amber-50 border border-amber-200' : rule.type === 'info' ? 'bg-blue-50 border border-blue-100' : 'bg-orange-50 border border-orange-200'}`}
                >
                  <AlertTriangle size={12} className={`shrink-0 mt-0.5 ${rule.type === 'warning' ? 'text-amber-500' : rule.type === 'info' ? 'text-blue-500' : 'text-orange-500'}`} />
                  <div>
                    <p className={`text-[11px] font-semibold ${rule.type === 'warning' ? 'text-amber-700' : rule.type === 'info' ? 'text-blue-700' : 'text-orange-700'}`}>{rule.condition}</p>
                    <p className={`text-[11px] ${rule.type === 'warning' ? 'text-amber-600' : rule.type === 'info' ? 'text-blue-600' : 'text-orange-600'}`}>{rule.action}</p>
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
