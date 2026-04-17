'use client';

import React, { useState, useRef, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { Paintbrush, HelpCircle, Upload, X, Eye, RefreshCw, Monitor, Printer, Trash2, Check, Image as ImageIcon, Type, QrCode, User, Building2, Calendar, Camera, AlignLeft, AlignCenter, AlignRight, Globe, Copy, Save, CheckCircle, Layers, Layout, Moon, Settings, Maximize2, RotateCcw, FileText, Shield, Clock } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'logo' | 'welcome' | 'pass' | 'kiosk';

interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface BadgeField {
  id: string;
  type: 'visitor_name' | 'host_name' | 'company' | 'purpose' | 'validity' | 'qr_code' | 'photo' | 'custom_text' | 'logo';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
  visible: boolean;
  qrSize?: number;
  includeLiveness?: boolean;
}

interface SiteOverride {
  id: string;
  name: string;
  overrideApplied: boolean;
  theme: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ToggleSwitch({ enabled, onChange, size = 'md' }: { enabled: boolean; onChange: (v: boolean) => void; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  const dot = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const on = size === 'sm' ? 'translate-x-4' : 'translate-x-6';
  return (
    <button type="button" onClick={() => onChange(!enabled)}
      className={`relative inline-flex ${h} items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-primary-600' : 'bg-slate-300'}`}>
      <span className={`inline-block ${dot} transform rounded-full bg-white shadow transition-transform ${enabled ? on : 'translate-x-1'}`} />
    </button>
  );
}

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1">
      <button type="button" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        className="text-slate-400 hover:text-primary-500 transition-colors">
        <HelpCircle size={13} />
      </button>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 bg-slate-800 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl leading-relaxed pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}

function ColorPicker({ label, value, onChange, tooltip }: { label: string; value: string; onChange: (v: string) => void; tooltip: string }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-[13px] font-medium text-text-primary w-28 flex items-center gap-1">
        {label}<Tooltip text={tooltip} />
      </label>
      <div className="flex items-center gap-2 flex-1">
        <div className="relative">
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            className="w-9 h-9 rounded-lg border border-border cursor-pointer p-0.5 bg-white" />
        </div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="flex-1 h-9 px-3 text-[13px] border border-border rounded-lg bg-white font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-200" />
      </div>
    </div>
  );
}

// ─── Badge Field Palette ───────────────────────────────────────────────────────

const PALETTE_ITEMS = [
  { type: 'visitor_name', label: 'Visitor Name', icon: <User size={14} /> },
  { type: 'host_name', label: 'Host Name', icon: <User size={14} /> },
  { type: 'company', label: 'Company', icon: <Building2 size={14} /> },
  { type: 'purpose', label: 'Purpose', icon: <FileText size={14} /> },
  { type: 'validity', label: 'Validity Date', icon: <Calendar size={14} /> },
  { type: 'qr_code', label: 'QR Code', icon: <QrCode size={14} /> },
  { type: 'photo', label: 'Live Photo', icon: <Camera size={14} /> },
  { type: 'custom_text', label: 'Custom Text', icon: <Type size={14} /> },
  { type: 'logo', label: 'Company Logo', icon: <ImageIcon size={14} /> },
] as const;

const FIELD_COLORS: Record<string, string> = {
  visitor_name: 'bg-blue-50 border-blue-200 text-blue-700',
  host_name: 'bg-purple-50 border-purple-200 text-purple-700',
  company: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  purpose: 'bg-amber-50 border-amber-200 text-amber-700',
  validity: 'bg-orange-50 border-orange-200 text-orange-700',
  qr_code: 'bg-slate-50 border-slate-200 text-slate-700',
  photo: 'bg-pink-50 border-pink-200 text-pink-700',
  custom_text: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  logo: 'bg-teal-50 border-teal-200 text-teal-700',
};

const DEFAULT_BADGE_FIELDS: BadgeField[] = [
  { id: 'f1', type: 'logo', label: 'Company Logo', x: 10, y: 8, width: 80, height: 30, visible: true },
  { id: 'f2', type: 'photo', label: 'Live Photo', x: 10, y: 48, width: 70, height: 70, visible: true, includeLiveness: true },
  { id: 'f3', type: 'visitor_name', label: 'Visitor Name', x: 90, y: 50, width: 100, height: 20, fontSize: 14, align: 'left', visible: true },
  { id: 'f4', type: 'host_name', label: 'Host Name', x: 90, y: 75, width: 100, height: 16, fontSize: 11, align: 'left', visible: true },
  { id: 'f5', type: 'company', label: 'Company', x: 90, y: 95, width: 100, height: 14, fontSize: 10, align: 'left', visible: true },
  { id: 'f6', type: 'validity', label: 'Validity Date', x: 10, y: 130, width: 90, height: 14, fontSize: 10, align: 'left', visible: true },
  { id: 'f7', type: 'qr_code', label: 'QR Code', x: 130, y: 120, width: 60, height: 60, visible: true, qrSize: 60 },
  { id: 'f8', type: 'purpose', label: 'Purpose', x: 10, y: 150, width: 120, height: 14, fontSize: 10, align: 'left', visible: true },
];

const SITE_OVERRIDES: SiteOverride[] = [
  { id: 's1', name: 'HQ - Mumbai', overrideApplied: true, theme: 'Dark Mode' },
  { id: 's2', name: 'Branch - Delhi', overrideApplied: false, theme: 'Default' },
  { id: 's3', name: 'Factory - Pune', overrideApplied: true, theme: 'High Contrast' },
  { id: 's4', name: 'Office - Bangalore', overrideApplied: false, theme: 'Default' },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function BrandingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('logo');
  const [previewMode, setPreviewMode] = useState<'kiosk' | 'badge'>('kiosk');
  const [publishedAt] = useState('Today, 09:14 AM');
  const [saved, setSaved] = useState(false);

  // Logo & Colors state
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<string | null>(null);
  const [bgImageFile, setBgImageFile] = useState<string | null>(null);
  const [showLogoOnAll, setShowLogoOnAll] = useState(true);
  const [colors, setColors] = useState<BrandColors>({
    primary: '#405189',
    secondary: '#0ab39c',
    accent: '#f06548',
    background: '#f3f6f9',
    text: '#212529',
  });

  // Welcome Screens state
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome to VMSPro! Please check in below to begin your visit. Our team is looking forward to meeting you.');
  const [safetyNotice, setSafetyNotice] = useState('By proceeding, you agree to follow all safety protocols on-site. Please wear your visitor badge at all times and follow the instructions of your host.');
  const [showWelcomeOnLaunch, setShowWelcomeOnLaunch] = useState(true);
  const [requireSafetyAcceptance, setRequireAcceptance] = useState(true);

  // Pass Template state
  const [badgeFields, setBadgeFields] = useState<BadgeField[]>(DEFAULT_BADGE_FIELDS);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [draggingPaletteType, setDraggingPaletteType] = useState<string | null>(null);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Kiosk Theme state
  const [layoutStyle, setLayoutStyle] = useState<'fullscreen' | 'card'>('card');
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [darkModeAuto, setDarkModeAuto] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const [idleTimeout, setIdleTimeout] = useState(5);
  const [applyToAllSites, setApplyToAllSites] = useState(false);
  const [siteOverrides, setSiteOverrides] = useState<SiteOverride[]>(SITE_OVERRIDES);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const selectedField = badgeFields.find(f => f.id === selectedFieldId) ?? null;

  const handlePublish = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateField = (id: string, updates: Partial<BadgeField>) => {
    setBadgeFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setBadgeFields(prev => prev.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const handleCanvasDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left - dragOffset.x);
    const y = Math.round(e.clientY - rect.top - dragOffset.y);

    if (draggingPaletteType) {
      const newField: BadgeField = {
        id: `f${Date.now()}`,
        type: draggingPaletteType as BadgeField['type'],
        label: PALETTE_ITEMS.find(p => p.type === draggingPaletteType)?.label ?? 'Field',
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: draggingPaletteType === 'qr_code' ? 60 : draggingPaletteType === 'photo' ? 70 : draggingPaletteType === 'logo' ? 80 : 100,
        height: draggingPaletteType === 'qr_code' ? 60 : draggingPaletteType === 'photo' ? 70 : draggingPaletteType === 'logo' ? 30 : 18,
        fontSize: 12,
        align: 'left',
        visible: true,
        qrSize: draggingPaletteType === 'qr_code' ? 60 : undefined,
        includeLiveness: draggingPaletteType === 'photo' ? true : undefined,
      };
      setBadgeFields(prev => [...prev, newField]);
      setSelectedFieldId(newField.id);
      setDraggingPaletteType(null);
    } else if (draggingFieldId) {
      updateField(draggingFieldId, { x: Math.max(0, x), y: Math.max(0, y) });
      setDraggingFieldId(null);
    }
  }, [draggingPaletteType, draggingFieldId, dragOffset]);

  const handleFieldMouseDown = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation();
    setSelectedFieldId(fieldId);
    const field = badgeFields.find(f => f.id === fieldId);
    if (!field || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left - field.x, y: e.clientY - rect.top - field.y });
    setDraggingFieldId(fieldId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingFieldId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.round(e.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.round(e.clientY - rect.top - dragOffset.y));
    updateField(draggingFieldId, { x, y });
  };

  const handleCanvasMouseUp = () => {
    setDraggingFieldId(null);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'logo', label: 'Logo & Colors', icon: <Paintbrush size={15} /> },
    { id: 'welcome', label: 'Welcome Screens', icon: <Monitor size={15} /> },
    { id: 'pass', label: 'Pass Template', icon: <Printer size={15} /> },
    { id: 'kiosk', label: 'Kiosk Theme', icon: <Layers size={15} /> },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col h-full min-h-0 bg-surface">
        {/* ── Page Header ── */}
        <div className="shrink-0 px-6 pt-5 pb-4 bg-white border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-bold text-text-primary tracking-tight flex items-center gap-2">
                <Paintbrush size={22} className="text-primary-600" />
                Branding &amp; Appearance
              </h1>
              <p className="text-[13px] text-text-secondary mt-0.5">
                Customize logo, colors, welcome messages, badge templates, and kiosk visuals. Changes apply instantly to visitor-facing flows.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-primary-600 border border-primary-200 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <Eye size={14} />
                Preview Visitor Experience
              </button>
              <button onClick={handlePublish}
                className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                {saved ? <><CheckCircle size={14} /> Published!</> : <><Save size={14} /> Publish All Changes</>}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors border-b-2 ${activeTab === tab.id
                  ? 'text-primary-600 border-primary-600 bg-primary-50/60' :'text-text-secondary border-transparent hover:text-text-primary hover:bg-slate-50'}`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-5 min-w-0">

            {/* ── TAB: Logo & Colors ── */}
            {activeTab === 'logo' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Uploads */}
                  <div className="space-y-5">
                    {/* Company Logo */}
                    <div className="bg-white rounded-xl border border-border p-5">
                      <h3 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-1">
                        Company Logo <Tooltip text="Displayed on kiosk welcome screen, badge header, and all visitor-facing emails. Supports PNG/SVG, max 5MB." />
                      </h3>
                      {logoFile ? (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-border">
                          <div className="w-20 h-12 bg-white rounded border border-border flex items-center justify-center overflow-hidden">
                            <img src={logoFile} alt="Company logo preview" className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px] font-medium text-text-primary">logo.png</p>
                            <p className="text-[11px] text-text-secondary">Uploaded successfully</p>
                          </div>
                          <button onClick={() => setLogoFile(null)} className="p-1.5 text-slate-400 hover:text-danger rounded-lg hover:bg-danger/10 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                            <Upload size={18} className="text-primary-500" />
                          </div>
                          <p className="text-[13px] font-medium text-text-primary">Drag & drop or click to upload</p>
                          <p className="text-[11px] text-text-secondary">PNG, SVG — max 5MB</p>
                          <input type="file" accept=".png,.svg" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) setLogoFile(URL.createObjectURL(f)); }} />
                        </label>
                      )}
                    </div>

                    {/* Favicon */}
                    <div className="bg-white rounded-xl border border-border p-5">
                      <h3 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-1">
                        Favicon <span className="text-[11px] font-normal text-text-secondary ml-1">(optional)</span>
                        <Tooltip text="Small icon shown in browser tabs and bookmarks. Use a square PNG, 32×32 or 64×64 px." />
                      </h3>
                      {faviconFile ? (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-border">
                          <div className="w-10 h-10 bg-white rounded border border-border flex items-center justify-center overflow-hidden">
                            <img src={faviconFile} alt="Favicon preview" className="w-8 h-8 object-contain" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px] font-medium text-text-primary">favicon.png</p>
                          </div>
                          <button onClick={() => setFaviconFile(null)} className="p-1.5 text-slate-400 hover:text-danger rounded-lg hover:bg-danger/10 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <ImageIcon size={14} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-text-primary">Upload Favicon</p>
                            <p className="text-[11px] text-text-secondary">PNG, ICO — 32×32 px recommended</p>
                          </div>
                          <input type="file" accept=".png,.ico" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) setFaviconFile(URL.createObjectURL(f)); }} />
                        </label>
                      )}
                    </div>

                    {/* Background Image */}
                    <div className="bg-white rounded-xl border border-border p-5">
                      <h3 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-1">
                        Kiosk Background Image <Tooltip text="Full-screen background shown on the kiosk welcome screen. Use a high-resolution image (1920×1080 recommended)." />
                      </h3>
                      {bgImageFile ? (
                        <div className="relative rounded-lg overflow-hidden border border-border">
                          <img src={bgImageFile} alt="Kiosk background preview" className="w-full h-28 object-cover" />
                          <button onClick={() => setBgImageFile(null)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-slate-600 hover:text-danger shadow transition-colors">
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                            <ImageIcon size={18} className="text-slate-400 group-hover:text-primary-500" />
                          </div>
                          <p className="text-[13px] font-medium text-text-primary">Upload Background Image</p>
                          <p className="text-[11px] text-text-secondary">JPG, PNG — 1920×1080 recommended</p>
                          <input type="file" accept=".jpg,.jpeg,.png" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) setBgImageFile(URL.createObjectURL(f)); }} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Right: Colors & Options */}
                  <div className="space-y-5">
                    <div className="bg-white rounded-xl border border-border p-5">
                      <h3 className="text-[14px] font-semibold text-text-primary mb-4 flex items-center gap-1">
                        Brand Colors <Tooltip text="These colors are applied across the kiosk UI, badge design, and visitor-facing emails." />
                      </h3>
                      <div className="space-y-3">
                        <ColorPicker label="Primary" value={colors.primary} onChange={v => setColors(c => ({ ...c, primary: v }))} tooltip="Main brand color used for buttons, highlights, and headers." />
                        <ColorPicker label="Secondary" value={colors.secondary} onChange={v => setColors(c => ({ ...c, secondary: v }))} tooltip="Used for secondary actions, badges, and accents." />
                        <ColorPicker label="Accent" value={colors.accent} onChange={v => setColors(c => ({ ...c, accent: v }))} tooltip="Highlight color for alerts, CTAs, and important notices." />
                        <ColorPicker label="Background" value={colors.background} onChange={v => setColors(c => ({ ...c, background: v }))} tooltip="Main background color for kiosk screens." />
                        <ColorPicker label="Text" value={colors.text} onChange={v => setColors(c => ({ ...c, text: v }))} tooltip="Primary text color used across all visitor-facing screens." />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                      <h3 className="text-[14px] font-semibold text-text-primary mb-4">Display Options</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[13px] text-text-primary">Show company logo on all screens</span>
                            <Tooltip text="When enabled, the company logo appears in the header of every kiosk screen." />
                          </div>
                          <ToggleSwitch enabled={showLogoOnAll} onChange={setShowLogoOnAll} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Welcome Screens ── */}
            {activeTab === 'welcome' && (
              <div className="space-y-5">
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="text-[14px] font-semibold text-text-primary mb-1 flex items-center gap-1">
                    Welcome Message <Tooltip text="This message is displayed on the kiosk home screen when a visitor approaches. Supports rich text formatting." />
                  </h3>
                  <p className="text-[12px] text-text-secondary mb-3">Displayed on kiosk launch. Supports bold, italic, lists, and links.</p>

                  {/* Rich Text Toolbar */}
                  <div className="flex items-center gap-1 p-2 bg-slate-50 border border-border rounded-t-lg border-b-0">
                    {['B', 'I', 'U'].map(f => (
                      <button key={f} className="w-7 h-7 text-[12px] font-bold text-text-secondary hover:bg-white hover:text-text-primary rounded transition-colors border border-transparent hover:border-border">
                        {f}
                      </button>
                    ))}
                    <div className="w-px h-5 bg-border mx-1" />
                    {[<AlignLeft size={13} />, <AlignCenter size={13} />, <AlignRight size={13} />].map((icon, i) => (
                      <button key={i} className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-white hover:text-text-primary rounded transition-colors border border-transparent hover:border-border">
                        {icon}
                      </button>
                    ))}
                    <div className="w-px h-5 bg-border mx-1" />
                    <button className="px-2 h-7 text-[11px] font-medium text-text-secondary hover:bg-white hover:text-text-primary rounded transition-colors border border-transparent hover:border-border">H1</button>
                    <button className="px-2 h-7 text-[11px] font-medium text-text-secondary hover:bg-white hover:text-text-primary rounded transition-colors border border-transparent hover:border-border">H2</button>
                    <button className="px-2 h-7 text-[11px] font-medium text-text-secondary hover:bg-white hover:text-text-primary rounded transition-colors border border-transparent hover:border-border">List</button>
                  </div>
                  <textarea value={welcomeMessage} onChange={e => setWelcomeMessage(e.target.value)} rows={5}
                    className="w-full px-3 py-2.5 text-[13px] border border-border rounded-b-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] text-text-primary">Show welcome message on kiosk launch</span>
                      <Tooltip text="When disabled, the kiosk skips the welcome screen and goes directly to check-in." />
                    </div>
                    <ToggleSwitch enabled={showWelcomeOnLaunch} onChange={setShowWelcomeOnLaunch} />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="text-[14px] font-semibold text-text-primary mb-1 flex items-center gap-1">
                    Safety Notice <Tooltip text="Displayed after the welcome message. Visitor must accept before proceeding. Generates ConsentStamp per DPDP Act 2023." />
                  </h3>
                  <p className="text-[12px] text-text-secondary mb-3">Pre-populated with standard disclaimer. Edit as needed.</p>

                  <div className="flex items-center gap-1 p-2 bg-slate-50 border border-border rounded-t-lg border-b-0">
                    {['B', 'I', 'U'].map(f => (
                      <button key={f} className="w-7 h-7 text-[12px] font-bold text-text-secondary hover:bg-white hover:text-text-primary rounded transition-colors border border-transparent hover:border-border">
                        {f}
                      </button>
                    ))}
                  </div>
                  <textarea value={safetyNotice} onChange={e => setSafetyNotice(e.target.value)} rows={4}
                    className="w-full px-3 py-2.5 text-[13px] border border-border rounded-b-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] text-text-primary">Require acceptance of safety notice before proceeding</span>
                      <Tooltip text="Visitor must tap 'I Agree' before they can continue. Generates a ConsentStamp (DPDP Act 2023)." />
                    </div>
                    <ToggleSwitch enabled={requireSafetyAcceptance} onChange={setRequireAcceptance} />
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Pass Template ── */}
            {activeTab === 'pass' && (
              <div className="flex gap-4 h-full min-h-0">
                {/* Left: Field Palette */}
                <div className="w-44 shrink-0">
                  <div className="bg-white rounded-xl border border-border p-3 sticky top-0">
                    <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                      Field Palette <Tooltip text="Drag fields onto the badge canvas to add them to your pass template." />
                    </p>
                    <div className="space-y-1.5">
                      {PALETTE_ITEMS.map(item => (
                        <div key={item.type}
                          draggable
                          onDragStart={e => { setDraggingPaletteType(item.type); setDragOffset({ x: 0, y: 0 }); }}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border cursor-grab active:cursor-grabbing text-[12px] font-medium select-none transition-all hover:shadow-sm ${FIELD_COLORS[item.type]}`}>
                          {item.icon}
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center: Canvas */}
                <div className="flex-1 min-w-0">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[13px] font-semibold text-text-primary flex items-center gap-1">
                      Badge Canvas <Tooltip text="Drag fields from the palette onto this canvas. Click a field to select and edit its properties." />
                    </p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setBadgeFields(DEFAULT_BADGE_FIELDS)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-slate-50 transition-colors">
                        <RotateCcw size={12} /> Reset to Default
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-primary-600 border border-primary-200 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                        <Copy size={12} /> Duplicate Template
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div
                      ref={canvasRef}
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleCanvasDrop}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onClick={() => setSelectedFieldId(null)}
                      className="relative bg-white border-2 border-dashed border-slate-300 rounded-lg overflow-hidden select-none"
                      style={{ width: 210, height: 297, cursor: draggingFieldId ? 'grabbing' : 'default' }}
                    >
                      {/* Badge background */}
                      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.primary}08 0%, white 100%)` }} />
                      <div className="absolute top-0 left-0 right-0 h-1 rounded-t" style={{ background: colors.primary }} />

                      {badgeFields.filter(f => f.visible).map(field => (
                        <div
                          key={field.id}
                          onMouseDown={e => handleFieldMouseDown(e, field.id)}
                          className={`absolute border rounded cursor-grab active:cursor-grabbing transition-shadow ${selectedFieldId === field.id ? 'border-primary-500 shadow-md ring-1 ring-primary-300' : 'border-transparent hover:border-slate-300'} ${FIELD_COLORS[field.type]}`}
                          style={{ left: field.x, top: field.y, width: field.width, height: field.height, fontSize: field.fontSize ?? 11, textAlign: field.align ?? 'left' }}
                        >
                          <div className="w-full h-full flex items-center justify-center overflow-hidden px-1 text-[10px] font-medium leading-tight">
                            {field.type === 'qr_code' ? (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded">
                                <QrCode size={Math.min(field.width, field.height) - 8} className="text-slate-600" />
                              </div>
                            ) : field.type === 'photo' ? (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded">
                                <Camera size={Math.min(field.width, field.height) / 2} className="text-slate-400" />
                              </div>
                            ) : field.type === 'logo' ? (
                              logoFile ? <img src={logoFile} alt="Logo on badge" className="max-w-full max-h-full object-contain" /> : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded">
                                  <ImageIcon size={14} className="text-slate-400" />
                                </div>
                              )
                            ) : (
                              <span className="truncate">{field.label}</span>
                            )}
                          </div>
                          {selectedFieldId === field.id && (
                            <button onMouseDown={e => { e.stopPropagation(); removeField(field.id); }}
                              className="absolute -top-2 -right-2 w-4 h-4 bg-danger text-white rounded-full flex items-center justify-center shadow text-[9px]">
                              ×
                            </button>
                          )}
                        </div>
                      ))}

                      {badgeFields.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                          <Printer size={32} />
                          <p className="text-[11px] mt-2">Drag fields here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Properties */}
                <div className="w-52 shrink-0">
                  <div className="bg-white rounded-xl border border-border p-3 sticky top-0">
                    <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-3">
                      {selectedField ? 'Field Properties' : 'Properties'}
                    </p>
                    {selectedField ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-medium text-text-secondary block mb-1">Label</label>
                          <input type="text" value={selectedField.label}
                            onChange={e => updateField(selectedField.id, { label: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-text-secondary block mb-1 flex items-center gap-1">
                            Font Size <Tooltip text="Font size in pixels for text fields." />
                          </label>
                          <input type="number" value={selectedField.fontSize ?? 12} min={8} max={32}
                            onChange={e => updateField(selectedField.id, { fontSize: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-text-secondary block mb-1">Alignment</label>
                          <div className="flex gap-1">
                            {(['left', 'center', 'right'] as const).map(a => (
                              <button key={a} onClick={() => updateField(selectedField.id, { align: a })}
                                className={`flex-1 py-1.5 flex items-center justify-center rounded-lg border transition-colors ${selectedField.align === a ? 'bg-primary-50 border-primary-300 text-primary-600' : 'border-border text-text-secondary hover:bg-slate-50'}`}>
                                {a === 'left' ? <AlignLeft size={12} /> : a === 'center' ? <AlignCenter size={12} /> : <AlignRight size={12} />}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-text-secondary block mb-1">Width</label>
                          <input type="number" value={selectedField.width} min={20} max={200}
                            onChange={e => updateField(selectedField.id, { width: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-text-secondary block mb-1">Height</label>
                          <input type="number" value={selectedField.height} min={10} max={200}
                            onChange={e => updateField(selectedField.id, { height: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 text-[12px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
                        </div>
                        {selectedField.type === 'qr_code' && (
                          <div>
                            <label className="text-[11px] font-medium text-text-secondary block mb-1 flex items-center gap-1">
                              QR Size <Tooltip text="QR Code size affects print clarity – recommended 2.5 cm (≈71px at 300dpi)." />
                            </label>
                            <input type="range" min={30} max={100} value={selectedField.qrSize ?? 60}
                              onChange={e => updateField(selectedField.id, { qrSize: Number(e.target.value), width: Number(e.target.value), height: Number(e.target.value) })}
                              className="w-full accent-primary-600" />
                            <p className="text-[10px] text-text-secondary text-right">{selectedField.qrSize ?? 60}px</p>
                          </div>
                        )}
                        {selectedField.type === 'photo' && (
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                              Liveness Badge <Tooltip text="Shows a green 'Live' indicator on the photo to confirm liveness detection was performed." />
                            </span>
                            <ToggleSwitch size="sm" enabled={selectedField.includeLiveness ?? false}
                              onChange={v => updateField(selectedField.id, { includeLiveness: v })} />
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-border">
                          <span className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                            Visible <Tooltip text="When disabled, this field is hidden on the printed badge." />
                          </span>
                          <ToggleSwitch size="sm" enabled={selectedField.visible}
                            onChange={v => updateField(selectedField.id, { visible: v })} />
                        </div>
                        <button onClick={() => removeField(selectedField.id)}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-danger border border-danger/30 bg-danger/5 rounded-lg hover:bg-danger/10 transition-colors">
                          <Trash2 size={12} /> Remove Field
                        </button>
                      </div>
                    ) : (
                      <p className="text-[12px] text-text-secondary text-center py-4">Click a field on the canvas to edit its properties</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Kiosk Theme ── */}
            {activeTab === 'kiosk' && (
              <div className="space-y-5">
                {/* Apply to All Sites */}
                <div className="bg-white rounded-xl border border-border p-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Globe size={15} className="text-primary-500" />
                    <span className="text-[13px] font-semibold text-text-primary">Apply to All Sites</span>
                    <Tooltip text="When enabled, these theme settings override all per-site configurations and apply uniformly across every location." />
                  </div>
                  <ToggleSwitch enabled={applyToAllSites} onChange={setApplyToAllSites} />
                </div>

                {/* Section 1: Welcome Screen Theme */}
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="text-[14px] font-semibold text-text-primary mb-4 flex items-center gap-1">
                    Welcome Screen Theme <Tooltip text="Controls the visual layout of the kiosk welcome screen." />
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'fullscreen', label: 'Full-Screen Background', desc: 'Background image fills the entire screen', icon: <Maximize2 size={20} /> },
                      { id: 'card', label: 'Centered Card', desc: 'Content displayed in a centered card overlay', icon: <Layout size={20} /> },
                    ].map(opt => (
                      <button key={opt.id} onClick={() => setLayoutStyle(opt.id as 'fullscreen' | 'card')}
                        className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left ${layoutStyle === opt.id ? 'border-primary-500 bg-primary-50' : 'border-border hover:border-slate-300 bg-white'}`}>
                        <div className={`p-2 rounded-lg ${layoutStyle === opt.id ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                          {opt.icon}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary">{opt.label}</p>
                          <p className="text-[11px] text-text-secondary mt-0.5">{opt.desc}</p>
                        </div>
                        {layoutStyle === opt.id && <Check size={14} className="text-primary-600 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Navigation */}
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="text-[14px] font-semibold text-text-primary mb-4 flex items-center gap-1">
                    Kiosk Navigation <Tooltip text="Controls navigation UI elements shown during the visitor induction flow." />
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] text-text-primary">Show progress bar during induction steps</span>
                      <Tooltip text="Displays a step-by-step progress indicator at the top of the kiosk screen during induction." />
                    </div>
                    <ToggleSwitch enabled={showProgressBar} onChange={setShowProgressBar} />
                  </div>
                </div>

                {/* Section 3: Additional Settings */}
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="text-[14px] font-semibold text-text-primary mb-4 flex items-center gap-1">
                    Additional Theme Settings <Tooltip text="Fine-tune kiosk behavior and appearance." />
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-1">
                        <Moon size={14} className="text-slate-500" />
                        <span className="text-[13px] text-text-primary">Enable dark mode on kiosk (auto-detect)</span>
                        <Tooltip text="Automatically switches to dark mode based on ambient light sensor or time of day." />
                      </div>
                      <ToggleSwitch enabled={darkModeAuto} onChange={setDarkModeAuto} />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-1">
                        <Building2 size={14} className="text-slate-500" />
                        <span className="text-[13px] text-text-primary">Show company footer on every screen</span>
                        <Tooltip text="Displays the company name and logo in a footer bar on all kiosk screens." />
                      </div>
                      <ToggleSwitch enabled={showFooter} onChange={setShowFooter} />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-slate-500" />
                        <span className="text-[13px] text-text-primary">Kiosk idle timeout</span>
                        <Tooltip text="After this many minutes of inactivity, the kiosk returns to the welcome screen and clears any in-progress check-in." />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" value={idleTimeout} min={1} max={30}
                          onChange={e => setIdleTimeout(Number(e.target.value))}
                          className="w-16 px-2 py-1.5 text-[13px] text-center border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
                        <span className="text-[12px] text-text-secondary">min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Per-Site Overrides Table */}
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                    <h3 className="text-[14px] font-semibold text-text-primary flex items-center gap-1">
                      Per-Site Theme Overrides <Tooltip text="Configure different theme settings for individual sites. These override the global settings above." />
                    </h3>
                    {selectedSites.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-text-secondary">{selectedSites.length} selected</span>
                        <button className="px-3 py-1.5 text-[12px] font-medium text-primary-600 border border-primary-200 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                          Bulk Apply Theme
                        </button>
                        <button onClick={() => setSelectedSites([])} className="px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-slate-50 transition-colors">
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-border">
                        <th className="w-10 px-4 py-2.5">
                          <input type="checkbox"
                            checked={selectedSites.length === siteOverrides.length}
                            onChange={e => setSelectedSites(e.target.checked ? siteOverrides.map(s => s.id) : [])}
                            className="rounded border-border accent-primary-600" />
                        </th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Site Name</th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Override Applied</th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Theme</th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {siteOverrides.map(site => (
                        <tr key={site.id} className={`hover:bg-slate-50/50 transition-colors ${selectedSites.includes(site.id) ? 'bg-primary-50/30' : ''}`}>
                          <td className="px-4 py-3">
                            <input type="checkbox"
                              checked={selectedSites.includes(site.id)}
                              onChange={e => setSelectedSites(prev => e.target.checked ? [...prev, site.id] : prev.filter(id => id !== site.id))}
                              className="rounded border-border accent-primary-600" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <MapPinIcon />
                              <span className="text-[13px] font-medium text-text-primary">{site.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${site.overrideApplied ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {site.overrideApplied ? <><Check size={10} /> Applied</> : 'Default'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[13px] text-text-secondary">{site.theme}</td>
                          <td className="px-4 py-3">
                            <button className="px-3 py-1 text-[12px] font-medium text-primary-600 border border-primary-200 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                              Edit Override
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── Live Preview Pane ── */}
          <div className="w-80 shrink-0 border-l border-border bg-white flex flex-col">
            {/* Preview Header */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[13px] font-semibold text-text-primary flex items-center gap-1">
                  Live Preview <Tooltip text="Updates in real-time as you make changes. Switch between Kiosk View and Badge Print View." />
                </p>
                <button className="p-1.5 text-slate-400 hover:text-text-primary rounded-lg hover:bg-slate-100 transition-colors">
                  <RefreshCw size={13} />
                </button>
              </div>
              <div className="flex gap-1 p-0.5 bg-slate-100 rounded-lg">
                <button onClick={() => setPreviewMode('kiosk')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium rounded-md transition-colors ${previewMode === 'kiosk' ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
                  <Monitor size={11} /> Kiosk View
                </button>
                <button onClick={() => setPreviewMode('badge')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium rounded-md transition-colors ${previewMode === 'badge' ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
                  <Printer size={11} /> Badge Print
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              {previewMode === 'kiosk' ? (
                <div className="rounded-xl overflow-hidden border border-border shadow-md" style={{ background: colors.background }}>
                  {/* Kiosk Header */}
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: colors.primary }}>
                    {logoFile ? (
                      <img src={logoFile} alt="Company logo in kiosk preview" className="h-6 object-contain" />
                    ) : (
                      <div className="h-6 w-16 bg-white/20 rounded flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">LOGO</span>
                      </div>
                    )}
                    <span className="text-white text-[11px] font-semibold ml-auto opacity-70">VMSPro</span>
                  </div>

                  {/* Kiosk Body */}
                  <div className="p-4 relative" style={bgImageFile ? { backgroundImage: `url(${bgImageFile})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                    {bgImageFile && <div className="absolute inset-0 bg-black/40" />}
                    <div className={`relative ${layoutStyle === 'card' ? 'bg-white rounded-xl p-4 shadow-lg' : ''}`}>
                      {activeTab === 'welcome' ? (
                        <>
                          {showWelcomeOnLaunch && (
                            <div className="mb-3">
                              <p className="text-[11px] font-semibold mb-1" style={{ color: layoutStyle === 'card' ? colors.text : 'white' }}>Welcome!</p>
                              <p className="text-[10px] leading-relaxed" style={{ color: layoutStyle === 'card' ? colors.text : 'rgba(255,255,255,0.85)' }}>
                                {welcomeMessage.slice(0, 120)}{welcomeMessage.length > 120 ? '…' : ''}
                              </p>
                            </div>
                          )}
                          {requireSafetyAcceptance && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3">
                              <p className="text-[9px] text-amber-700 font-medium mb-1 flex items-center gap-1"><Shield size={9} /> Safety Notice</p>
                              <p className="text-[9px] text-amber-600 leading-relaxed">{safetyNotice.slice(0, 80)}…</p>
                              <button className="mt-2 w-full py-1 text-[9px] font-semibold text-white rounded" style={{ background: colors.accent }}>
                                I Agree &amp; Continue
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-[12px] font-bold mb-1" style={{ color: layoutStyle === 'card' ? colors.text : 'white' }}>Welcome!</p>
                          <p className="text-[10px] mb-3" style={{ color: layoutStyle === 'card' ? colors.text : 'rgba(255,255,255,0.8)' }}>Please check in below</p>
                          {showProgressBar && (
                            <div className="mb-3">
                              <div className="flex justify-between mb-1">
                                {['Check-in', 'Induction', 'Badge'].map((s, i) => (
                                  <span key={s} className={`text-[8px] font-medium ${i === 0 ? 'text-primary-600' : 'text-slate-400'}`}>{s}</span>
                                ))}
                              </div>
                              <div className="h-1 bg-slate-200 rounded-full">
                                <div className="h-1 rounded-full w-1/3" style={{ background: colors.primary }} />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <button className="w-full py-2 text-[11px] font-semibold text-white rounded-lg" style={{ background: colors.primary }}>
                        Start Check-In
                      </button>
                      {showFooter && (
                        <p className="text-center text-[8px] mt-2 opacity-50" style={{ color: layoutStyle === 'card' ? colors.text : 'white' }}>
                          Powered by VMSPro
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Badge Print Preview */
                <div className="flex flex-col items-center gap-3">
                  <div className="relative bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden"
                    style={{ width: 160, height: 226 }}>
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t" style={{ background: colors.primary }} />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.primary}08 0%, white 100%)` }} />
                    {badgeFields.filter(f => f.visible).map(field => (
                      <div key={field.id} className="absolute overflow-hidden"
                        style={{
                          left: field.x * 0.76,
                          top: field.y * 0.76,
                          width: field.width * 0.76,
                          height: field.height * 0.76,
                          fontSize: (field.fontSize ?? 11) * 0.76,
                          textAlign: field.align ?? 'left',
                        }}>
                        {field.type === 'qr_code' ? (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded">
                            <QrCode size={Math.min(field.width, field.height) * 0.5} className="text-slate-600" />
                          </div>
                        ) : field.type === 'photo' ? (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded">
                            <Camera size={Math.min(field.width, field.height) * 0.4} className="text-slate-400" />
                          </div>
                        ) : field.type === 'logo' ? (
                          logoFile ? <img src={logoFile} alt="Logo on badge print preview" className="max-w-full max-h-full object-contain" /> : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded">
                              <ImageIcon size={10} className="text-slate-400" />
                            </div>
                          )
                        ) : (
                          <span className="text-slate-700 font-medium truncate block leading-tight px-0.5">
                            {field.type === 'visitor_name' ? 'John Smith' :
                              field.type === 'host_name' ? 'Host: Reeja Patel' :
                                field.type === 'company' ? 'Acme Corp' :
                                  field.type === 'purpose' ? 'Meeting' :
                                    field.type === 'validity' ? '14 Apr 2026' :
                                      field.label}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                    <Printer size={13} /> Print Test Badge
                  </button>
                </div>
              )}
            </div>

            {/* Branding Summary Card — REMOVED from here, moved to footer */}
          </div>
        </div>

        {/* ── Footer Note + Branding Summary ── */}
        <div className="shrink-0 px-6 py-3 border-t border-border bg-white">
          <div className="flex items-center justify-between gap-6">
            {/* Branding Summary */}
            <div className="flex items-center gap-5">
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider shrink-0">Branding Summary:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-secondary">Logo</span>
                  <span className={`text-[11px] font-medium ${logoFile ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {logoFile ? '✓ Uploaded' : '⚠ Not set'}
                  </span>
                </div>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-secondary">Template</span>
                  <span className="text-[11px] font-medium text-text-primary">Default Badge</span>
                </div>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-secondary">Last Published</span>
                  <span className="text-[11px] font-medium text-text-primary">{publishedAt}</span>
                </div>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-secondary">Badge Fields</span>
                  <span className="text-[11px] font-medium text-text-primary">{badgeFields.filter(f => f.visible).length}</span>
                </div>
              </div>
            </div>
            {/* Footer Note */}
            <p className="text-[11px] text-text-secondary text-right shrink-0 max-w-xs">
              All branding settings are applied tenant-wide and respect site-specific overrides. Changes are live after publishing.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Small inline icon to avoid extra import
function MapPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
