'use client';

import React, { useState } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import {
  GitBranch, Plus, Clock, CheckCircle, X, Briefcase, HardHat, UserCheck,
  Star, Truck, Shield, Users, Pencil, Eye, MoreVertical, Zap, FileText, Download,
} from 'lucide-react';

interface WalkInWorkflow {
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
  'General Visitor': <Users size={18} />,
  'Delivery / Courier': <Truck size={18} />,
  'Contractor': <HardHat size={18} />,
  'Vendor': <Briefcase size={18} />,
  'Interviewee': <UserCheck size={18} />,
  'VIP / Executive': <Star size={18} />,
  'Govt Official': <Shield size={18} />,
};

const visitorTypeColors: Record<string, string> = {
  'General Visitor': 'bg-slate-100 text-slate-600',
  'Delivery / Courier': 'bg-orange-100 text-orange-600',
  'Contractor': 'bg-amber-100 text-amber-600',
  'Vendor': 'bg-blue-100 text-blue-600',
  'Interviewee': 'bg-green-100 text-green-600',
  'VIP / Executive': 'bg-purple-100 text-purple-600',
  'Govt Official': 'bg-red-100 text-red-600',
};

const allVisitorTypes = [
  { name: 'General Visitor', description: 'General public and unscheduled walk-in visitors' },
  { name: 'Delivery / Courier', description: 'Delivery personnel and courier services' },
  { name: 'Contractor', description: 'On-site contractors and service workers' },
  { name: 'Vendor', description: 'External vendors, service providers and business partners' },
  { name: 'Interviewee', description: 'Job candidates and interview attendees' },
  { name: 'VIP / Executive', description: 'VIP guests, executives and high-priority visitors' },
  { name: 'Govt Official', description: 'Government officials and regulatory inspectors' },
];

// Global Walk-In Workflows (master list from Global login)
const globalWalkInWorkflows: WalkInWorkflow[] = [
  {
    id: 1,
    name: 'General Walk-In Flow',
    visitorType: 'General Visitor',
    status: 'active',
    steps: 3,
    fields: 5,
    lastUpdated: '1 day ago',
    description: 'Quick ID capture, host notification and temporary badge issuance.',
  },
  {
    id: 2,
    name: 'Delivery Check-In Flow',
    visitorType: 'Delivery / Courier',
    status: 'active',
    steps: 2,
    fields: 4,
    lastUpdated: '3 days ago',
    description: 'Package logging, recipient confirmation and dock access assignment.',
  },
  {
    id: 3,
    name: 'Unplanned Contractor Entry',
    visitorType: 'Contractor',
    status: 'draft',
    steps: 4,
    fields: 8,
    lastUpdated: '5 days ago',
    description: 'Safety briefing, permit verification and site supervisor approval.',
  },
  {
    id: 4,
    name: 'VIP Walk-In Express',
    visitorType: 'VIP / Executive',
    status: 'active',
    steps: 2,
    fields: 5,
    lastUpdated: '4 days ago',
    description: 'Fast-track entry with auto-escort and executive lounge access.',
  },
];

// Site A local workflows
const initialWorkflows: WalkInWorkflow[] = [
  {
    id: 1,
    name: 'General Walk-In Flow',
    visitorType: 'General Visitor',
    status: 'active',
    steps: 3,
    fields: 5,
    lastUpdated: '1 day ago',
    description: 'Quick ID capture, host notification and temporary badge issuance.',
  },
  {
    id: 2,
    name: 'Delivery Check-In Flow',
    visitorType: 'Delivery / Courier',
    status: 'active',
    steps: 2,
    fields: 4,
    lastUpdated: '3 days ago',
    description: 'Package logging, recipient confirmation and dock access assignment.',
  },
  {
    id: 3,
    name: 'Unplanned Contractor Entry',
    visitorType: 'Contractor',
    status: 'draft',
    steps: 4,
    fields: 8,
    lastUpdated: '5 days ago',
    description: 'Safety briefing, permit verification and site supervisor approval.',
  },
];

export default function SiteAWalkInWorkflowsPage() {
  const router = useRouter();
  const { siteName } = useRole();
  const [workflows, setWorkflows] = useState<WalkInWorkflow[]>(initialWorkflows);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [importedIds, setImportedIds] = useState<number[]>([]);

  const handleSelectVisitorType = (typeName: string) => {
    setShowTypeModal(false);
    router.push(`/site-admin/workflows/walk-in/builder?visitorType=${encodeURIComponent(typeName)}`);
  };

  const handleEditWorkflow = (w: WalkInWorkflow) => {
    router.push(`/site-admin/workflows/walk-in/builder?visitorType=${encodeURIComponent(w.visitorType)}&workflowId=${w.id}&workflowName=${encodeURIComponent(w.name)}`);
  };

  const handlePublish = (id: number) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: 'active' } : w));
    setOpenMenuId(null);
  };

  const handleSaveDraft = (id: number) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: 'draft' } : w));
    setOpenMenuId(null);
  };

  const handleImportWorkflow = (globalWorkflow: WalkInWorkflow) => {
    const alreadyExists = workflows.some(w => w.name === globalWorkflow.name);
    if (alreadyExists) return;
    const newId = Math.max(...workflows.map(w => w.id), 0) + 1;
    setWorkflows(prev => [...prev, { ...globalWorkflow, id: newId }]);
    setImportedIds(prev => [...prev, globalWorkflow.id]);
  };

  const activeCount = workflows.filter(w => w.status === 'active').length;
  const draftCount = workflows.filter(w => w.status === 'draft').length;

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Walk-In Visitor Workflows</h1>
            <p className="text-[12px] text-text-muted mt-0.5">
              {siteName} · {workflows.length} workflows · {activeCount} active · {draftCount} draft
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 transition-all shadow-sm"
            >
              <Download size={15} />
              Import from Global
            </button>
            <button
              onClick={() => setShowTypeModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all shadow-sm"
            >
              <Plus size={15} />
              Create New Workflow
            </button>
          </div>
        </div>

        {/* Summary Bar */}
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

        {/* Workflow Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {workflows.map((w) => {
            const iconBg = visitorTypeColors[w.visitorType] ?? 'bg-slate-100 text-slate-600';
            const icon = visitorTypeIcons[w.visitorType] ?? <GitBranch size={18} />;
            return (
              <div
                key={w.id}
                className="bg-white rounded-xl border border-border shadow-card hover:shadow-md transition-shadow flex flex-col"
              >
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
                        w.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
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

                <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface/50 rounded-b-xl">
                  <button
                    onClick={() => handleEditWorkflow(w)}
                    className="flex items-center gap-1 text-[12px] font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <Pencil size={12} />
                    Edit Workflow
                  </button>
                  <button
                    onClick={() => router.push(`/site-admin/workflows/walk-in/builder?visitorType=${encodeURIComponent(w.visitorType)}&workflowId=${w.id}&mode=view`)}
                    className="flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Eye size={12} />
                    Preview
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add new tile */}
          <button
            onClick={() => setShowTypeModal(true)}
            className="bg-white rounded-xl border-2 border-dashed border-border hover:border-primary-300 hover:bg-primary-50/30 transition-all flex flex-col items-center justify-center gap-3 p-8 min-h-[180px] group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <Plus size={20} className="text-primary-600" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-text-primary">New Workflow</p>
              <p className="text-[11px] text-text-muted mt-0.5">Create a new walk-in workflow</p>
            </div>
          </button>
        </div>
      </div>

      {/* Visitor Type Selection Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-[15px] font-bold text-text-primary">Select Visitor Type</h2>
                <p className="text-[12px] text-text-muted mt-0.5">Choose the visitor type for this workflow</p>
              </div>
              <button onClick={() => setShowTypeModal(false)} className="p-1.5 rounded-lg hover:bg-surface transition-colors text-text-muted">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
              {allVisitorTypes.map((type) => {
                const icon = visitorTypeIcons[type.name] ?? <GitBranch size={18} />;
                const colorClass = visitorTypeColors[type.name] ?? 'bg-slate-100 text-slate-600';
                return (
                  <button
                    key={type.name}
                    onClick={() => handleSelectVisitorType(type.name)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary-300 hover:bg-primary-50/30 transition-all text-left group"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-text-primary">{type.name}</p>
                      <p className="text-[11px] text-text-muted">{type.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Import from Global Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-[15px] font-bold text-text-primary">Import from Global</h2>
                <p className="text-[12px] text-text-muted mt-0.5">Select a walk-in workflow from the Global master library</p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-1.5 rounded-lg hover:bg-surface transition-colors text-text-muted">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-[460px] overflow-y-auto">
              {globalWalkInWorkflows.map((gw) => {
                const icon = visitorTypeIcons[gw.visitorType] ?? <GitBranch size={18} />;
                const colorClass = visitorTypeColors[gw.visitorType] ?? 'bg-slate-100 text-slate-600';
                const alreadyImported = importedIds.includes(gw.id) || workflows.some(w => w.name === gw.name);
                return (
                  <div
                    key={gw.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white hover:bg-surface/50 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-text-primary leading-tight">{gw.name}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{gw.visitorType} · {gw.steps} steps · {gw.fields} fields</p>
                      <p className="text-[11px] text-text-secondary mt-0.5 truncate">{gw.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        gw.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {gw.status === 'active' ? '● Active' : '○ Draft'}
                      </span>
                      <button
                        onClick={() => handleImportWorkflow(gw)}
                        disabled={alreadyImported}
                        className={`flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all ${
                          alreadyImported
                            ? 'bg-green-50 text-green-600 border border-green-200 cursor-default' :'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {alreadyImported ? (
                          <>
                            <CheckCircle size={12} />
                            Imported
                          </>
                        ) : (
                          <>
                            <Download size={12} />
                            Import
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-[13px] font-semibold text-text-secondary bg-surface hover:bg-border rounded-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteAdminLayout>
  );
}
