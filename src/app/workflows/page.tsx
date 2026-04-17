'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GitBranch, Plus, Clock, CheckCircle, X, Briefcase, HardHat, UserCheck, Star, Truck, Shield, Users, Pencil, Eye, MoreVertical, Zap, FileText, ArrowRight,  } from 'lucide-react';

interface Workflow {
  id: number;
  name: string;
  visitorType: string;
  status: 'active' | 'draft';
  steps: number;
  lastUpdated: string;
  fields: number;
  description: string;
}

const visitorTypeIcons: Record<string, React.ReactNode> = {
  'Vendor': <Briefcase size={18} />,
  'Contractor': <HardHat size={18} />,
  'Interviewee': <UserCheck size={18} />,
  'VIP / Executive': <Star size={18} />,
  'Delivery / Courier': <Truck size={18} />,
  'Govt Official': <Shield size={18} />,
  'General Visitor': <Users size={18} />,
};

const visitorTypeColors: Record<string, string> = {
  'Vendor': 'bg-blue-100 text-blue-600',
  'Contractor': 'bg-amber-100 text-amber-600',
  'Interviewee': 'bg-green-100 text-green-600',
  'VIP / Executive': 'bg-purple-100 text-purple-600',
  'Delivery / Courier': 'bg-orange-100 text-orange-600',
  'Govt Official': 'bg-red-100 text-red-600',
  'General Visitor': 'bg-slate-100 text-slate-600',
};

const allVisitorTypes = [
  { name: 'Vendor', description: 'External vendors, service providers and business partners' },
  { name: 'Contractor', description: 'On-site contractors and service workers' },
  { name: 'Interviewee', description: 'Job candidates and interview attendees' },
  { name: 'VIP / Executive', description: 'VIP guests, executives and high-priority visitors' },
  { name: 'Delivery / Courier', description: 'Delivery personnel and courier services' },
  { name: 'Govt Official', description: 'Government officials and regulatory inspectors' },
  { name: 'General Visitor', description: 'General public and walk-in visitors' },
];

const initialWorkflows: Workflow[] = [
  {
    id: 1,
    name: 'Vendor Onboarding Flow',
    visitorType: 'Vendor',
    status: 'active',
    steps: 3,
    fields: 7,
    lastUpdated: '2 days ago',
    description: 'NDA sign-off, ID verification, host approval and badge issuance.',
  },
  {
    id: 2,
    name: 'Contractor Access Flow',
    visitorType: 'Contractor',
    status: 'active',
    steps: 3,
    fields: 10,
    lastUpdated: '5 days ago',
    description: 'Safety induction, compliance check, site access and escort assignment.',
  },
  {
    id: 3,
    name: 'VIP Executive Express Flow',
    visitorType: 'VIP / Executive',
    status: 'draft',
    steps: 2,
    fields: 6,
    lastUpdated: '1 week ago',
    description: 'Express check-in with auto-escort and host notification.',
  },
  {
    id: 4,
    name: 'Interviewee Check-in Flow',
    visitorType: 'Interviewee',
    status: 'active',
    steps: 3,
    fields: 9,
    lastUpdated: '3 days ago',
    description: 'Candidate registration, pre-screening and arrival check-in.',
  },
];

export default function WorkflowsPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleSelectVisitorType = (typeName: string) => {
    setShowTypeModal(false);
    router.push(`/workflows/builder?visitorType=${encodeURIComponent(typeName)}`);
  };

  const handlePublish = (id: number) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: 'active' } : w));
    setOpenMenuId(null);
  };

  const handleSaveDraft = (id: number) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: 'draft' } : w));
    setOpenMenuId(null);
  };

  const activeCount = workflows.filter(w => w.status === 'active').length;
  const draftCount = workflows.filter(w => w.status === 'draft').length;

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Pre-registered Workflows</h1>
            <p className="text-[12px] text-text-muted mt-0.5">
              {workflows.length} workflows · {activeCount} active · {draftCount} draft
            </p>
          </div>
          <button
            onClick={() => setShowTypeModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all shadow-sm"
          >
            <Plus size={15} />
            Create New Workflow
          </button>
        </div>

        {/* ── Summary Bar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-[12px] font-medium text-green-700">{activeCount} Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span className="text-[12px] font-medium text-amber-700">{draftCount} Draft</span>
          </div>
        </div>

        {/* ── Workflow Tiles ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {workflows.map((w) => {
            const iconBg = visitorTypeColors[w.visitorType] ?? 'bg-slate-100 text-slate-600';
            const icon = visitorTypeIcons[w.visitorType] ?? <GitBranch size={18} />;
            return (
              <div
                key={w.id}
                className="bg-white rounded-xl border border-border shadow-card hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Card Top */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-text-primary leading-tight">{w.name}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">{w.visitorType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        w.status === 'active' ?'bg-green-50 text-green-700 border border-green-100' :'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {w.status === 'active' ? '● Active' : '○ Draft'}
                      </span>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === w.id ? null : w.id)}
                          className="p-1 rounded-lg hover:bg-surface transition-colors text-text-muted"
                        >
                          <MoreVertical size={14} />
                        </button>
                        {openMenuId === w.id && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-border rounded-lg shadow-dropdown z-20 py-1">
                            {w.status === 'draft' ? (
                              <button
                                onClick={() => handlePublish(w.id)}
                                className="w-full text-left px-3 py-2 text-[12px] text-green-700 hover:bg-green-50 flex items-center gap-2"
                              >
                                <Zap size={12} /> Publish
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSaveDraft(w.id)}
                                className="w-full text-left px-3 py-2 text-[12px] text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                              >
                                <FileText size={12} /> Set as Draft
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-relaxed mb-3">{w.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <CheckCircle size={11} className="text-primary-400" />
                      {w.steps} steps
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={11} className="text-primary-400" />
                      {w.fields} fields
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {w.lastUpdated}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface/50 rounded-b-xl">
                  <Link
                    href={`/workflows/builder?visitorType=${encodeURIComponent(w.visitorType)}&workflowId=${w.id}`}
                    className="flex items-center gap-1 text-[12px] font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <Pencil size={12} />
                    Edit Workflow
                  </Link>
                  <Link
                    href={`/workflows/builder?visitorType=${encodeURIComponent(w.visitorType)}&workflowId=${w.id}&mode=view`}
                    className="flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Eye size={12} />
                    Preview
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Empty state / Add new tile */}
          <button
            onClick={() => setShowTypeModal(true)}
            className="bg-white rounded-xl border-2 border-dashed border-border hover:border-primary-300 hover:bg-primary-50/30 transition-all flex flex-col items-center justify-center gap-3 p-8 min-h-[180px] group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <Plus size={20} className="text-primary-600" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-text-primary">Create New Workflow</p>
              <p className="text-[11px] text-text-muted mt-0.5">Select a visitor type to get started</p>
            </div>
          </button>
        </div>
      </div>

      {/* ── Visitor Type Selector Modal ── */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-[15px] font-bold text-text-primary">Select Visitor Type</h2>
                <p className="text-[12px] text-text-muted mt-0.5">Choose the visitor type to create a workflow for</p>
              </div>
              <button
                onClick={() => setShowTypeModal(false)}
                className="p-1.5 rounded-lg hover:bg-surface transition-colors text-text-muted"
              >
                <X size={16} />
              </button>
            </div>

            {/* Visitor Type List */}
            <div className="p-4 space-y-2 max-h-[420px] overflow-y-auto">
              {allVisitorTypes.map((vt) => {
                const iconBg = visitorTypeColors[vt.name] ?? 'bg-slate-100 text-slate-600';
                const icon = visitorTypeIcons[vt.name] ?? <Users size={18} />;
                const alreadyExists = workflows.some(w => w.visitorType === vt.name);
                return (
                  <button
                    key={vt.name}
                    onClick={() => handleSelectVisitorType(vt.name)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-border hover:border-primary-300 hover:bg-primary-50/40 transition-all text-left group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-semibold text-text-primary">{vt.name}</p>
                        {alreadyExists && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                            Workflow exists
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5 truncate">{vt.description}</p>
                    </div>
                    <ArrowRight size={14} className="text-text-muted group-hover:text-primary-600 transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-border bg-surface/50 flex justify-end">
              <button
                onClick={() => setShowTypeModal(false)}
                className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
