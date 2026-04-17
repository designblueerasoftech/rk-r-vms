'use client';

import React, { useState, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { Video, HelpCircle, FileText, Heart, Plus, Search, GripVertical, Eye, Pencil, Trash2, Play, ChevronDown, X, Check, Clock, BarChart2, Shield, Upload, Copy, CheckSquare, Square, BookOpen, ChevronRight, RefreshCw, Save, List,  } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

const VISITOR_TYPES = ['Interviewee', 'Vendor', 'Contractor', 'VIP', 'Delivery', 'Govt Official', 'General Visitor'];

interface VideoItem {
  id: string;
  order: number;
  title: string;
  link: string;
  duration: string;
  mustWatch: boolean;
  forceWatchPct: number;
  linkedTypes: string[];
}

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

interface QuizItem {
  id: string;
  name: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  linkedTypes: string[];
}

interface DocumentItem {
  id: string;
  name: string;
  version: string;
  content: string;
  requireSignature: boolean;
  linkedTypes: string[];
  versions: { version: string; timestamp: string }[];
}

interface HealthQuestion {
  id: string;
  text: string;
  type: 'Yes/No' | 'MCQ' | 'Text Input' | 'Declaration';
  options: string[];
  mandatory: boolean;
  linkedTypes: string[];
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
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 bg-slate-800 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl leading-relaxed pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}

function TypeChips({ types }: { types: string[] }) {
  if (!types.length) return <span className="text-slate-400 text-xs">All Types</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {types.map(t => (
        <span key={t} className="px-1.5 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-medium rounded border border-primary-100">{t}</span>
      ))}
    </div>
  );
}

function MultiSelect({ options, selected, onChange, placeholder }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  };
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white hover:border-primary-400 transition-colors">
        <span className="text-slate-600 truncate">
          {selected.length ? selected.join(', ') : (placeholder || 'Select...')}
        </span>
        <ChevronDown size={14} className="text-slate-400 shrink-0 ml-2" />
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer">
              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected.includes(opt) ? 'bg-primary-600 border-primary-600' : 'border-slate-300'}`}>
                {selected.includes(opt) && <Check size={10} className="text-white" />}
              </span>
              <span className="text-sm text-slate-700">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ModalOverlay({ onClose, children, wide }: { onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.55)' }}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} max-h-[90vh] overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
      <h3 className="text-[16px] font-semibold text-slate-800">{title}</h3>
      <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><X size={16} className="text-slate-500" /></button>
    </div>
  );
}

function FormField({ label, tooltip, children }: { label: string; tooltip?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center text-[13px] font-medium text-slate-700 mb-1.5">
        {label}{tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition-colors" />
  );
}

function EmptyState({ icon, title, desc, onAdd, addLabel }: { icon: React.ReactNode; title: string; desc: string; onAdd: () => void; addLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">{icon}</div>
      <h4 className="text-[15px] font-semibold text-slate-700 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 mb-5 max-w-xs">{desc}</p>
      <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
        <Plus size={15} />{addLabel}
      </button>
    </div>
  );
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initVideos: VideoItem[] = [
  { id: 'v1', order: 1, title: 'Site Safety Videos', link: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '4:30', mustWatch: true, forceWatchPct: 80, linkedTypes: ['Contractor', 'Vendor'] },
  { id: 'v2', order: 2, title: 'Security Protocol Video', link: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '2:45', mustWatch: true, forceWatchPct: 100, linkedTypes: ['Contractor', 'Vendor', 'Interviewee'] },
  { id: 'v3', order: 3, title: 'Company Intro Video', link: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '3:10', mustWatch: false, forceWatchPct: 0, linkedTypes: [] },
];

const initQuizzes: QuizItem[] = [
  {
    id: 'q1', name: 'Safety Awareness Quiz', description: 'Basic safety knowledge test for all site visitors',
    questions: [
      { id: 'qq1', text: 'What should you do in case of a fire alarm?', options: ['Ignore it', 'Evacuate immediately', 'Call a colleague', 'Wait for instructions'], correctIndex: 1 },
      { id: 'qq2', text: 'Where is the nearest emergency exit?', options: ['Near reception', 'Near cafeteria', 'Near server room', 'Marked with green signs'], correctIndex: 3 },
    ],
    passingScore: 80, linkedTypes: ['Contractor', 'Vendor'],
  },
  {
    id: 'q2', name: 'Data Handling Compliance Quiz', description: 'DPDP Act 2023 compliance awareness',
    questions: [
      { id: 'qq3', text: 'Under DPDP Act 2023, personal data must be?', options: ['Shared freely', 'Processed with consent', 'Stored indefinitely', 'Sold to third parties'], correctIndex: 1 },
    ],
    passingScore: 100, linkedTypes: ['Vendor', 'Interviewee'],
  },
];

const initDocuments: DocumentItem[] = [
  {
    id: 'd1', name: 'Non-Disclosure Agreement (NDA)', version: 'v2.1',
    content: 'This Non-Disclosure Agreement ("Agreement") is entered into between the visitor and the Company. The visitor agrees to keep all confidential information strictly private...',
    requireSignature: true, linkedTypes: ['Vendor', 'Contractor', 'Interviewee'],
    versions: [{ version: 'v2.1', timestamp: '2024-01-15 10:30' }, { version: 'v2.0', timestamp: '2023-11-01 09:00' }, { version: 'v1.0', timestamp: '2023-06-01 08:00' }],
  },
  {
    id: 'd2', name: 'Site Rules & Code of Conduct', version: 'v1.3',
    content: 'All visitors must adhere to the following site rules: 1. Wear visitor badge at all times. 2. No photography in restricted areas...',
    requireSignature: false, linkedTypes: [],
    versions: [{ version: 'v1.3', timestamp: '2024-02-10 14:00' }, { version: 'v1.2', timestamp: '2023-12-01 11:00' }],
  },
];

// ─── Health Screening Types ───────────────────────────────────────────────────

interface HealthScreeningForm {
  id: string;
  name: string;
  description: string;
  questions: HealthQuestion[];
  passingScore: number;
}

const initHealthForms: HealthScreeningForm[] = [
  {
    id: 'hs1',
    name: 'General Health Declaration',
    description: 'Standard health screening for all visitors',
    questions: [
      { id: 'h1', text: 'Do you have any fever, cough, or cold symptoms today?', type: 'Yes/No', options: [], mandatory: true, linkedTypes: [] },
      { id: 'h3', text: 'I declare that I am in good health and have no known communicable diseases.', type: 'Declaration', options: [], mandatory: true, linkedTypes: [] },
    ],
    passingScore: 100,
  },
  {
    id: 'hs2',
    name: 'Travel & Exposure Screening',
    description: 'For visitors with recent travel history',
    questions: [
      { id: 'h2', text: 'Have you travelled internationally in the last 14 days?', type: 'Yes/No', options: [], mandatory: true, linkedTypes: [] },
      { id: 'h4', text: 'What is your current health status?', type: 'MCQ', options: ['Excellent', 'Good', 'Fair', 'Unwell'], mandatory: false, linkedTypes: [] },
    ],
    passingScore: 80,
  },
];

// ─── Tab: Videos ───────────────────────────────────────────────────────────────

function VideosTab() {
  const [videos, setVideos] = useState<VideoItem[]>(initVideos);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<VideoItem | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [previewLink, setPreviewLink] = useState<string | null>(null);

  const filtered = videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (v: VideoItem) => { setEditItem(v); setShowModal(true); };
  const deleteItem = (id: string) => setVideos(vs => vs.filter(v => v.id !== id));
  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(v => v.id));

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const reordered = [...videos];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    reordered.forEach((v, i) => v.order = i + 1);
    setVideos(reordered);
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  const saveVideo = (item: VideoItem) => {
    if (editItem) {
      setVideos(vs => vs.map(v => v.id === item.id ? item : v));
    } else {
      setVideos(vs => [...vs, { ...item, id: `v${Date.now()}`, order: vs.length + 1 }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{selected.length} selected</span>
              <button onClick={() => setVideos(vs => vs.filter(v => !selected.includes(v.id)))}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                <Trash2 size={12} />Delete Selected
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                <Copy size={12} />Duplicate
              </button>
            </div>
          )}
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
            <Plus size={15} />Add Video
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Video size={28} />} title="No Videos Yet"
          desc="Add orientation videos that visitors must watch before receiving their badge."
          onAdd={openAdd} addLabel="Add Video" />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-10 px-3 py-3">
                  <button onClick={toggleAll} className="text-slate-400 hover:text-primary-600">
                    {selected.length === filtered.length ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                </th>
                <th className="w-8 px-2 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">Order<Tooltip text="Drag rows to reorder the sequence visitors see" /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">Video Title<Tooltip text="Click to edit video details" /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">Duration<Tooltip text="Video length shown to visitors" /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">Must Watch<Tooltip text="Disables Next button until video finishes – per Veris VMS safety video logic" /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, idx) => (
                <tr key={v.id} draggable onDragStart={() => handleDragStart(idx)} onDragOver={e => handleDragOver(e, idx)} onDragEnd={handleDragEnd}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${dragIdx === idx ? 'opacity-50' : ''}`}>
                  <td className="px-3 py-3">
                    <button onClick={() => toggleSelect(v.id)} className="text-slate-400 hover:text-primary-600">
                      {selected.includes(v.id) ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1.5">
                      <GripVertical size={14} className="text-slate-300 cursor-grab active:cursor-grabbing" />
                      <span className="text-xs font-medium text-slate-500 w-4 text-center">{v.order}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(v)} className="text-sm font-medium text-primary-600 hover:text-primary-800 hover:underline text-left">{v.title}</button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-slate-600"><Clock size={12} className="text-slate-400" />{v.duration}</span>
                  </td>
                  <td className="px-4 py-3">
                    <ToggleSwitch enabled={v.mustWatch} onChange={val => setVideos(vs => vs.map(x => x.id === v.id ? { ...x, mustWatch: val } : x))} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors" title="Edit"><Pencil size={13} /></button>
                      <button onClick={() => setPreviewLink(v.link)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Preview"><Eye size={13} /></button>
                      <button onClick={() => deleteItem(v.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <VideoModal item={editItem} onSave={saveVideo} onClose={() => setShowModal(false)} />}
      {previewLink && (
        <ModalOverlay onClose={() => setPreviewLink(null)}>
          <ModalHeader title="Video Preview" onClose={() => setPreviewLink(null)} />
          <div className="p-6">
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <iframe src={previewLink} className="w-full h-full" allowFullScreen title="Video Preview" />
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

function VideoModal({ item, onSave, onClose }: { item: VideoItem | null; onSave: (v: VideoItem) => void; onClose: () => void }) {
  const [title, setTitle] = useState(item?.title || '');
  const [link, setLink] = useState(item?.link || '');
  const [duration, setDuration] = useState(item?.duration || '');
  const [mustWatch, setMustWatch] = useState(item?.mustWatch ?? true);
  const [forceWatchPct, setForceWatchPct] = useState(item?.forceWatchPct ?? 80);
  const [linkedTypes, setLinkedTypes] = useState<string[]>(item?.linkedTypes || []);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ id: item?.id || '', order: item?.order || 0, title, link, duration, mustWatch, forceWatchPct, linkedTypes });
  };

  return (
    <ModalOverlay onClose={onClose}>
      <ModalHeader title={item ? 'Edit Video' : 'Add Safety Video'} onClose={onClose} />
      <div className="p-6 space-y-4">
        <FormField label="Video Title" tooltip="Descriptive name shown to visitors during induction">
          <Input value={title} onChange={setTitle} placeholder="e.g. Site Safety Orientation" />
        </FormField>
        <FormField label="Embed Link (YouTube / MP4)" tooltip="Paste a YouTube embed URL or direct MP4 link">
          <div className="flex gap-2">
            <Input value={link} onChange={setLink} placeholder="https://www.youtube.com/embed/..." />
            <button onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors whitespace-nowrap">
              <Play size={13} />Test Embed
            </button>
          </div>
        </FormField>
        {showPreview && link && (
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <iframe src={link} className="w-full h-full" allowFullScreen title="Preview" />
          </div>
        )}
        <FormField label="Duration" tooltip="Video length (auto-detect or enter manually e.g. 4:30)">
          <Input value={duration} onChange={setDuration} placeholder="e.g. 4:30" />
        </FormField>
        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
          <div>
            <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
              Must Watch<Tooltip text="Disables Next button until video finishes – per Veris/Envoy best practice" />
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Visitor cannot proceed until video completes</p>
          </div>
          <ToggleSwitch enabled={mustWatch} onChange={setMustWatch} />
        </div>
        {mustWatch && (
          <FormField label={`Force-Watch Completion: ${forceWatchPct}%`} tooltip="Require this percentage of video to be watched before proceeding">
            <input type="range" min={0} max={100} step={5} value={forceWatchPct} onChange={e => setForceWatchPct(Number(e.target.value))}
              className="w-full accent-primary-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
          </FormField>
        )}
        <FormField label="Linked Visitor Types" tooltip="Select which visitor categories must watch this video">
          <MultiSelect options={VISITOR_TYPES} selected={linkedTypes} onChange={setLinkedTypes} placeholder="All visitor types" />
        </FormField>
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
        <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
        <button onClick={handleSave} className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          {item ? 'Save Changes' : 'Add Video'}
        </button>
      </div>
    </ModalOverlay>
  );
}

// ─── Tab: Quizzes ─────────────────────────────────────────────────────────────

function QuizzesTab() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>(initQuizzes);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<QuizItem | null>(null);

  const filtered = quizzes.filter(q => q.name.toLowerCase().includes(search.toLowerCase()));
  const openAdd = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (q: QuizItem) => { setEditItem(q); setShowModal(true); };
  const deleteItem = (id: string) => setQuizzes(qs => qs.filter(q => q.id !== id));
  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const saveQuiz = (item: QuizItem) => {
    if (editItem) setQuizzes(qs => qs.map(q => q.id === item.id ? item : q));
    else setQuizzes(qs => [...qs, { ...item, id: `q${Date.now()}` }]);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quizzes..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button onClick={() => setQuizzes(qs => qs.filter(q => !selected.includes(q.id)))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
              <Trash2 size={12} />Delete Selected
            </button>
          )}
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
            <Plus size={15} />Create Quiz
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<HelpCircle size={28} />} title="No Quizzes Yet"
          desc="Create knowledge-check quizzes to verify visitors understand safety and compliance requirements."
          onAdd={openAdd} addLabel="Create Quiz" />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-10 px-3 py-3">
                  <button onClick={() => setSelected(selected.length === filtered.length ? [] : filtered.map(q => q.id))} className="text-slate-400 hover:text-primary-600">
                    {selected.length === filtered.length ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Quiz Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">Questions<Tooltip text="Number of MCQ questions in this quiz (max 5 per SAD)" /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">Passing Score<Tooltip text="Minimum score required to pass and proceed to next induction step" /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3">
                    <button onClick={() => toggleSelect(q.id)} className="text-slate-400 hover:text-primary-600">
                      {selected.includes(q.id) ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(q)} className="text-sm font-medium text-primary-600 hover:text-primary-800 hover:underline text-left">{q.name}</button>
                    {q.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{q.description}</p>}
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-slate-700 font-medium">{q.questions.length}</span></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${q.passingScore >= 80 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {q.passingScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors" title="Edit"><Pencil size={13} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Preview"><Eye size={13} /></button>
                      <button onClick={() => deleteItem(q.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <QuizModal item={editItem} onSave={saveQuiz} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function QuizModal({ item, onSave, onClose }: { item: QuizItem | null; onSave: (q: QuizItem) => void; onClose: () => void }) {
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [passingScore, setPassingScore] = useState(item?.passingScore ?? 80);
  const [linkedTypes, setLinkedTypes] = useState<string[]>(item?.linkedTypes || []);
  const [questions, setQuestions] = useState<QuizQuestion[]>(item?.questions || []);
  const [previewQ, setPreviewQ] = useState<number | null>(null);

  const addQuestion = () => {
    if (questions.length >= 5) return;
    setQuestions(qs => [...qs, { id: `qq${Date.now()}`, text: '', options: ['', '', '', ''], correctIndex: 0 }]);
  };

  const updateQuestion = (idx: number, field: keyof QuizQuestion, value: string | number | string[]) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ id: item?.id || '', name, description, questions, passingScore, linkedTypes });
  };

  return (
    <ModalOverlay onClose={onClose} wide>
      <ModalHeader title={item ? 'Edit Quiz' : 'Create Quiz'} onClose={onClose} />
      <div className="flex gap-0 divide-x divide-slate-100">
        {/* Left: Builder */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <FormField label="Quiz Name">
            <Input value={name} onChange={setName} placeholder="e.g. Safety Awareness Quiz" />
          </FormField>
          <FormField label="Description (optional)">
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of this quiz..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-primary-400 resize-none h-20 transition-colors" />
          </FormField>
          <FormField label={`Passing Score: ${passingScore}%`} tooltip="Minimum percentage required to pass this quiz">
            <input type="range" min={50} max={100} step={5} value={passingScore} onChange={e => setPassingScore(Number(e.target.value))}
              className="w-full accent-primary-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>50%</span><span>75%</span><span>100%</span></div>
          </FormField>
          <FormField label="Linked Visitor Types" tooltip="Which visitor categories must complete this quiz">
            <MultiSelect options={VISITOR_TYPES} selected={linkedTypes} onChange={setLinkedTypes} placeholder="All visitor types" />
          </FormField>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[13px] font-semibold text-slate-700 flex items-center gap-1">
                Questions ({questions.length}/5)<Tooltip text="Add up to 5 MCQ questions per SAD specification" />
              </h4>
              <button onClick={addQuestion} disabled={questions.length >= 5}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium hover:bg-primary-100 transition-colors disabled:opacity-40">
                <Plus size={12} />Add Question
              </button>
            </div>
            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Q{qi + 1}</span>
                    <button onClick={() => setQuestions(qs => qs.filter((_, i) => i !== qi))}
                      className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><X size={12} /></button>
                  </div>
                  <textarea value={q.text} onChange={e => updateQuestion(qi, 'text', e.target.value)} placeholder="Enter question text..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-400 resize-none h-16 mb-3 transition-colors" />
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <button onClick={() => updateQuestion(qi, 'correctIndex', oi)}
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${q.correctIndex === oi ? 'border-primary-600 bg-primary-600' : 'border-slate-300'}`}>
                          {q.correctIndex === oi && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </button>
                        <input value={opt} onChange={e => {
                          const newOpts = [...q.options]; newOpts[oi] = e.target.value;
                          updateQuestion(qi, 'options', newOpts);
                        }} placeholder={`Option ${oi + 1}${q.correctIndex === oi ? ' (correct)' : ''}`}
                          className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="w-72 p-5 bg-slate-50 flex flex-col gap-3 overflow-y-auto max-h-[70vh]">
          <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1"><Eye size={12} />Visitor Preview</h4>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h5 className="text-sm font-semibold text-slate-800 mb-1">{name || 'Quiz Name'}</h5>
            {description && <p className="text-xs text-slate-500 mb-3">{description}</p>}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">Pass: {passingScore}%</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{questions.length} Q</span>
            </div>
            {questions.slice(0, 2).map((q, qi) => (
              <div key={q.id} className="mb-3">
                <p className="text-xs font-medium text-slate-700 mb-1">Q{qi + 1}. {q.text || 'Question text...'}</p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${previewQ === qi && oi === q.correctIndex ? 'bg-green-50 border-green-200 text-green-700' : 'border-slate-200 text-slate-600'}`}>
                      <span className="w-3 h-3 rounded-full border border-current shrink-0" />
                      {opt || `Option ${oi + 1}`}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {questions.length > 2 && <p className="text-xs text-slate-400 text-center">+{questions.length - 2} more questions</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
        <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
        <button onClick={handleSave} className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          {item ? 'Save Changes' : 'Create Quiz'}
        </button>
      </div>
    </ModalOverlay>
  );
}

// ─── Tab: Document Vault ──────────────────────────────────────────────────────

function DocumentVaultTab() {
  const [documents, setDocuments] = useState<DocumentItem[]>(initDocuments);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<DocumentItem | null>(null);
  const [versionDoc, setVersionDoc] = useState<DocumentItem | null>(null);

  const filtered = documents.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  const openAdd = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (d: DocumentItem) => { setEditItem(d); setShowModal(true); };
  const deleteItem = (id: string) => setDocuments(ds => ds.filter(d => d.id !== id));
  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const saveDoc = (item: DocumentItem) => {
    if (editItem) setDocuments(ds => ds.map(d => d.id === item.id ? item : d));
    else setDocuments(ds => [...ds, { ...item, id: `d${Date.now()}` }]);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button onClick={() => setDocuments(ds => ds.filter(d => !selected.includes(d.id)))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
              <Trash2 size={12} />Delete Selected
            </button>
          )}
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
            <Plus size={15} />Add Document
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FileText size={28} />} title="No Documents Yet"
          desc="Add NDAs, terms & conditions, and compliance documents for visitors to review and sign."
          onAdd={openAdd} addLabel="Add Document" />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-10 px-3 py-3">
                  <button onClick={() => setSelected(selected.length === filtered.length ? [] : filtered.map(d => d.id))} className="text-slate-400 hover:text-primary-600">
                    {selected.length === filtered.length ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Document Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">Version<Tooltip text="Click version number to view full version history" /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Content Preview</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">eSignature<Tooltip text="Generates ConsentStamp per DPDP Act 2023 when enabled" /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3">
                    <button onClick={() => toggleSelect(d.id)} className="text-slate-400 hover:text-primary-600">
                      {selected.includes(d.id) ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(d)} className="text-sm font-medium text-primary-600 hover:text-primary-800 hover:underline text-left">{d.name}</button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setVersionDoc(d)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors">
                      {d.version}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500 truncate max-w-[200px] block">{d.content.substring(0, 60)}...</span>
                  </td>
                  <td className="px-4 py-3">
                    <ToggleSwitch enabled={d.requireSignature} onChange={val => setDocuments(ds => ds.map(x => x.id === d.id ? { ...x, requireSignature: val } : x))} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors" title="Edit"><Pencil size={13} /></button>
                      <button onClick={() => setVersionDoc(d)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Version History"><RefreshCw size={13} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600 transition-colors" title="Preview"><Eye size={13} /></button>
                      <button onClick={() => deleteItem(d.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <DocumentModal item={editItem} onSave={saveDoc} onClose={() => setShowModal(false)} />}
      {versionDoc && (
        <ModalOverlay onClose={() => setVersionDoc(null)}>
          <ModalHeader title={`Version History — ${versionDoc.name}`} onClose={() => setVersionDoc(null)} />
          <div className="p-6 space-y-3">
            {versionDoc.versions.map((v, i) => (
              <div key={v.version} className={`flex items-center justify-between p-3 rounded-xl border ${i === 0 ? 'border-primary-200 bg-primary-50' : 'border-slate-200 bg-white'}`}>
                <div>
                  <span className={`text-sm font-semibold ${i === 0 ? 'text-primary-700' : 'text-slate-700'}`}>{v.version}</span>
                  {i === 0 && <span className="ml-2 text-[10px] bg-primary-600 text-white px-1.5 py-0.5 rounded font-medium">Current</span>}
                  <p className="text-xs text-slate-400 mt-0.5">{v.timestamp}</p>
                </div>
                {i !== 0 && (
                  <button className="text-xs text-primary-600 hover:text-primary-800 font-medium px-3 py-1.5 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                    Restore
                  </button>
                )}
              </div>
            ))}
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

function DocumentModal({ item, onSave, onClose }: { item: DocumentItem | null; onSave: (d: DocumentItem) => void; onClose: () => void }) {
  const [name, setName] = useState(item?.name || '');
  const [content, setContent] = useState(item?.content || '');
  const [requireSignature, setRequireSignature] = useState(item?.requireSignature ?? false);
  const [linkedTypes, setLinkedTypes] = useState<string[]>(item?.linkedTypes || []);
  const [contentTab, setContentTab] = useState<'editor' | 'upload'>('editor');

  const handleSave = () => {
    if (!name.trim()) return;
    const newVersion = item ? `v${(parseFloat(item.version.replace('v', '')) + 0.1).toFixed(1)}` : 'v1.0';
    onSave({
      id: item?.id || '',
      name, content, requireSignature, linkedTypes,
      version: newVersion,
      versions: item ? [{ version: newVersion, timestamp: new Date().toLocaleString() }, ...item.versions] : [{ version: 'v1.0', timestamp: new Date().toLocaleString() }],
    });
  };

  return (
    <ModalOverlay onClose={onClose} wide>
      <ModalHeader title={item ? 'Edit Document' : 'Add Document'} onClose={onClose} />
      <div className="p-6 space-y-4">
        <FormField label="Document Name" tooltip="Name of the document shown to visitors">
          <Input value={name} onChange={setName} placeholder="e.g. Non-Disclosure Agreement" />
        </FormField>
        <FormField label="Linked Visitor Types" tooltip="Which visitor categories must review this document">
          <MultiSelect options={VISITOR_TYPES} selected={linkedTypes} onChange={setLinkedTypes} placeholder="All visitor types" />
        </FormField>

        {/* Content tabs */}
        <div>
          <div className="flex gap-1 mb-3 p-1 bg-slate-100 rounded-lg w-fit">
            {(['editor', 'upload'] as const).map(t => (
              <button key={t} onClick={() => setContentTab(t)}
                className="px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white hover:shadow-sm transition-colors">{t === 'editor' ? 'Rich Text Editor' : 'Upload PDF'}</button>
            ))}
          </div>
          {contentTab === 'editor' ? (
            <div>
              <div className="flex gap-1 mb-2 p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                {['B', 'I', 'U', 'H1', 'H2', '• List'].map(f => (
                  <button key={f} className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded transition-colors">{f}</button>
                ))}
              </div>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Enter document content here..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-primary-400 resize-none h-40 transition-colors" />
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
              <Upload size={24} className="text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 font-medium">Drop PDF here or click to upload</p>
              <p className="text-xs text-slate-400 mt-1">Max 10MB · PDF only</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div>
            <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
              Require eSignature<Tooltip text="Generates ConsentStamp per DPDP Act 2023 – creates an auditable digital signature record" />
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Visitor must digitally sign before proceeding</p>
          </div>
          <ToggleSwitch enabled={requireSignature} onChange={setRequireSignature} />
        </div>
        {requireSignature && (
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
            <Shield size={14} className="text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-green-700">ConsentStamp will be generated and stored per DPDP Act 2023 compliance requirements.</p>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
        <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
        <button onClick={handleSave} className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          {item ? 'Save Changes' : 'Add Document'}
        </button>
      </div>
    </ModalOverlay>
  );
}

// ─── Tab: Health Screening ────────────────────────────────────────────────────

function HealthScreeningTab() {
  const [forms, setForms] = useState<HealthScreeningForm[]>(initHealthForms);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<HealthScreeningForm | null>(null);

  const filtered = forms.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const openAdd = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (f: HealthScreeningForm) => { setEditItem(f); setShowModal(true); };
  const deleteItem = (id: string) => setForms(fs => fs.filter(f => f.id !== id));
  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const saveForm = (item: HealthScreeningForm) => {
    if (editItem) setForms(fs => fs.map(f => f.id === item.id ? item : f));
    else setForms(fs => [...fs, { ...item, id: `hs${Date.now()}` }]);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search health screenings..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button onClick={() => setForms(fs => fs.filter(f => !selected.includes(f.id)))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
              <Trash2 size={12} />Delete Selected
            </button>
          )}
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
            <Plus size={15} />Create Screening
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Heart size={28} />} title="No Health Screenings Yet"
          desc="Create health screening forms with questions to ensure visitor safety compliance."
          onAdd={openAdd} addLabel="Create Screening" />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-10 px-3 py-3">
                  <button onClick={() => setSelected(selected.length === filtered.length ? [] : filtered.map(f => f.id))} className="text-slate-400 hover:text-primary-600">
                    {selected.length === filtered.length ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Screening Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">Questions<Tooltip text="Number of health screening questions in this form" /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">Passing Score<Tooltip text="Minimum score required to pass health screening" /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3">
                    <button onClick={() => toggleSelect(f.id)} className="text-slate-400 hover:text-primary-600">
                      {selected.includes(f.id) ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(f)} className="text-sm font-medium text-primary-600 hover:text-primary-800 hover:underline text-left">{f.name}</button>
                    {f.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{f.description}</p>}
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-slate-700 font-medium">{f.questions.length}</span></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${f.passingScore >= 80 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {f.passingScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors" title="Edit"><Pencil size={13} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Preview"><Eye size={13} /></button>
                      <button onClick={() => deleteItem(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <HealthScreeningModal item={editItem} onSave={saveForm} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function HealthScreeningModal({ item, onSave, onClose }: { item: HealthScreeningForm | null; onSave: (f: HealthScreeningForm) => void; onClose: () => void }) {
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [passingScore, setPassingScore] = useState(item?.passingScore ?? 100);
  const [questions, setQuestions] = useState<HealthQuestion[]>(item?.questions || []);

  const addQuestion = () => {
    setQuestions(qs => [...qs, { id: `hq${Date.now()}`, text: '', type: 'Yes/No', options: [], mandatory: true, linkedTypes: [] }]);
  };

  const updateQuestion = (idx: number, field: keyof HealthQuestion, value: string | boolean | string[]) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ id: item?.id || '', name, description, questions, passingScore });
  };

  const typeColors: Record<string, string> = {
    'Yes/No': 'bg-green-50 text-green-700',
    'MCQ': 'bg-blue-50 text-blue-700',
    'Text Input': 'bg-purple-50 text-purple-700',
    'Declaration': 'bg-amber-50 text-amber-700',
  };

  return (
    <ModalOverlay onClose={onClose} wide>
      <ModalHeader title={item ? 'Edit Health Screening' : 'Create Health Screening'} onClose={onClose} />
      <div className="flex gap-0 divide-x divide-slate-100">
        {/* Left: Builder */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <FormField label="Screening Name">
            <Input value={name} onChange={setName} placeholder="e.g. General Health Declaration" />
          </FormField>
          <FormField label="Description (optional)">
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of this screening..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-primary-400 resize-none h-20 transition-colors" />
          </FormField>
          <FormField label={`Passing Score: ${passingScore}%`} tooltip="Minimum percentage required to pass this health screening">
            <input type="range" min={50} max={100} step={5} value={passingScore} onChange={e => setPassingScore(Number(e.target.value))}
              className="w-full accent-primary-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>50%</span><span>75%</span><span>100%</span></div>
          </FormField>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[13px] font-semibold text-slate-700">Questions ({questions.length})</h4>
              <button onClick={addQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium hover:bg-primary-100 transition-colors">
                <Plus size={12} />Add Question
              </button>
            </div>
            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Q{qi + 1}</span>
                    <button onClick={() => setQuestions(qs => qs.filter((_, i) => i !== qi))}
                      className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><X size={12} /></button>
                  </div>
                  <textarea value={q.text} onChange={e => updateQuestion(qi, 'text', e.target.value)} placeholder="Enter question text..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-400 resize-none h-16 mb-3 transition-colors" />
                  <div className="flex items-center gap-3 mb-2">
                    <select value={q.type} onChange={e => updateQuestion(qi, 'type', e.target.value as HealthQuestion['type'])}
                      className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary-400 transition-colors">
                        {['Yes/No', 'MCQ', 'Text Input', 'Declaration'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <ToggleSwitch enabled={q.mandatory} onChange={val => updateQuestion(qi, 'mandatory', val)} size="sm" />
                      Mandatory
                    </label>
                  </div>
                  {q.type === 'MCQ' && (
                    <div className="space-y-1.5 mt-2">
                      {(q.options.length ? q.options : ['', '', '', '']).map((opt, oi) => (
                        <input key={oi} value={opt} onChange={e => {
                          const newOpts = [...(q.options.length ? q.options : ['', '', '', ''])]; newOpts[oi] = e.target.value;
                          updateQuestion(qi, 'options', newOpts);
                        }} placeholder={`Option ${oi + 1}${q.correctIndex === oi ? ' (correct)' : ''}`}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary-400 transition-colors" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="w-72 p-5 bg-slate-50 flex flex-col gap-3 overflow-y-auto max-h-[70vh]">
          <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1"><Eye size={12} />Visitor Preview</h4>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h5 className="text-sm font-semibold text-slate-800 mb-1">{name || 'Screening Name'}</h5>
            {description && <p className="text-xs text-slate-500 mb-3">{description}</p>}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">Pass: {passingScore}%</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{questions.length} Q</span>
            </div>
            {questions.slice(0, 2).map((q, qi) => (
              <div key={q.id} className="mb-3">
                <p className="text-xs font-medium text-slate-700 mb-1">Q{qi + 1}. {q.text || 'Question text...'}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${typeColors[q.type] || 'bg-slate-100 text-slate-600'}`}>{q.type}</span>
              </div>
            ))}
            {questions.length > 2 && <p className="text-xs text-slate-400 text-center">+{questions.length - 2} more questions</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
        <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
        <button onClick={handleSave} className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          {item ? 'Save Changes' : 'Create Screening'}
        </button>
      </div>
    </ModalOverlay>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'videos', label: 'Videos', icon: <Video size={15} /> },
  { id: 'quizzes', label: 'Quizzes', icon: <HelpCircle size={15} /> },
  { id: 'documents', label: 'Document Vault', icon: <FileText size={15} /> },
  { id: 'health', label: 'Health Screening', icon: <Heart size={15} /> },
] as const;

type TabId = typeof TABS[number]['id'];

export default function InductionHubPage() {
  const [activeTab, setActiveTab] = useState<TabId>('videos');
  const [requireInduction, setRequireInduction] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const sequenceSteps = [
    { label: 'Site Safety Orientation', type: 'video', color: 'bg-blue-500' },
    { label: 'Emergency Evacuation', type: 'video', color: 'bg-blue-500' },
    { label: 'Safety Awareness Quiz', type: 'quiz', color: 'bg-purple-500' },
    { label: 'NDA', type: 'document', color: 'bg-amber-500' },
    { label: 'Health Declaration', type: 'health', color: 'bg-green-500' },
  ];

  const typeIcons: Record<string, React.ReactNode> = {
    video: <Video size={11} />,
    quiz: <HelpCircle size={11} />,
    document: <FileText size={11} />,
    health: <Heart size={11} />,
  };

  return (
    <AppLayout>
      <div className="flex h-full min-h-screen bg-slate-50">
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[22px] font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen size={22} className="text-primary-600" />
                  Induction Hub
                </h1>
                <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                  Define mandatory pre-badge safety &amp; compliance steps. Sequence videos, quizzes, documents, and health checks before visitors receive their pass.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => setShowPreviewModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  <Eye size={15} />Preview Full Induction Flow
                </button>
              </div>
            </div>

            {/* Global Toggle */}
            <div className="mt-4 flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  Require full Induction before badge print
                  <Tooltip text="When enabled, all induction steps must be completed before badge issuance and ConsentStamp is applied per DPDP Act 2023" />
                </p>
                <p className="text-xs text-slate-500 mt-0.5">All steps must be completed before badge issuance and ConsentStamp is applied</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold ${requireInduction ? 'text-primary-700' : 'text-slate-400'}`}>
                  {requireInduction ? 'Enabled' : 'Disabled'}
                </span>
                <ToggleSwitch enabled={requireInduction} onChange={setRequireInduction} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-slate-200 px-6">
            <div className="flex gap-1">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-primary-600 text-primary-700' :'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'videos' && <VideosTab />}
            {activeTab === 'quizzes' && <QuizzesTab />}
            {activeTab === 'documents' && <DocumentVaultTab />}
            {activeTab === 'health' && <HealthScreeningTab />}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-200 bg-white">
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Shield size={11} className="text-slate-400" />
              All induction steps automatically generate ConsentStamp (DPDP Act 2023), are fully audited, and respect retention policies set in Settings.
            </p>
          </div>
        </div>

        {/* Right Panel: Induction Sequence Summary */}
        <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="px-4 py-4 border-b border-slate-100">
            <h3 className="text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
              <List size={14} className="text-primary-600" />
              Induction Sequence Summary
              <Tooltip text="This shows the exact order visitors experience the induction steps" />
            </h3>
          </div>

          {/* Sequence */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2 mb-5">
              {sequenceSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full ${step.color} flex items-center justify-center text-white shrink-0`}>
                      {typeIcons[step.type]}
                    </div>
                    {i < sequenceSteps.length - 1 && <div className="w-px h-4 bg-slate-200 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{step.label}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{step.type}</p>
                  </div>
                  <ChevronRight size={11} className="text-slate-300 shrink-0" />
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={13} className="text-primary-600" />
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Avg. Completion Time</span>
                </div>
                <p className="text-lg font-bold text-slate-800">12 min</p>
                <p className="text-[10px] text-slate-400">Based on last 30 days</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart2 size={13} className="text-green-600" />
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Completion Rate</span>
                </div>
                <p className="text-lg font-bold text-slate-800">94.2%</p>
                <p className="text-[10px] text-slate-400">Last 30 days</p>
                <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '94.2%' }} />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-2">
                  <Shield size={13} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">ConsentStamp Active</p>
                    <p className="text-xs text-blue-600 mt-0.5">DPDP Act 2023 compliant. All signatures are timestamped and audited.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PreviewFull Flow Modal */}
      {showPreviewModal && (
        <ModalOverlay onClose={() => setShowPreviewModal(false)} wide>
          <ModalHeader title="Preview Full Induction Flow (Visitor View)" onClose={() => setShowPreviewModal(false)} />
          <div className="p-6">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                {sequenceSteps.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className={`flex flex-col items-center gap-1`}>
                      <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center text-white`}>
                        {typeIcons[step.type]}
                      </div>
                      <span className="text-[9px] text-slate-500 font-medium max-w-[60px] text-center leading-tight">{step.label}</span>
                    </div>
                    {i < sequenceSteps.length - 1 && <ChevronRight size={14} className="text-slate-300 mb-4 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-sm mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Video size={22} className="text-blue-600" />
                </div>
                <h4 className="text-base font-semibold text-slate-800 mb-1">Site Safety Orientation</h4>
                <p className="text-xs text-slate-500 mb-4">Step 1 of {sequenceSteps.length} · Video · 4:30</p>
                <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                  <Play size={32} className="text-white/60" />
                </div>
                <div className="flex items-center justify-between">
                  <button className="px-4 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg">Back</button>
                  <button className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg opacity-50 cursor-not-allowed">Next (watch to enable)</button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">This is a preview of how visitors experience the induction flow</p>
            </div>
          </div>
        </ModalOverlay>
      )}
    </AppLayout>
  );
}
