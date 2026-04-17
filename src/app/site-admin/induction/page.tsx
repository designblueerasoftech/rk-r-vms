'use client';

import React from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useRole } from '@/context/RoleContext';
import { Plus, BookOpen, Clock, Users } from 'lucide-react';

const modules = [
  { id: 1, name: 'Site Safety Induction', duration: '15 min', completions: 234, required: true, status: 'active' },
  { id: 2, name: 'Emergency Procedures', duration: '8 min', completions: 198, required: true, status: 'active' },
  { id: 3, name: 'Visitor Code of Conduct', duration: '5 min', completions: 312, required: false, status: 'active' },
  { id: 4, name: 'Data Privacy & NDA', duration: '10 min', completions: 156, required: true, status: 'draft' },
];

export default function SiteAdminInductionPage() {
  const { siteName } = useRole();

  return (
    <SiteAdminLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Induction Hub</h1>
            <p className="text-[12px] text-text-muted mt-0.5">{siteName} · {modules?.length} modules</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
            <Plus size={15} /> New Module
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules?.map((m) => (
            <div key={m?.id} className="bg-white rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                    <BookOpen size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-text-primary">{m?.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {m?.required && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600">Required</span>}
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${m?.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {m?.status === 'active' ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-text-muted">
                <span className="flex items-center gap-1"><Clock size={11} /> {m?.duration}</span>
                <span className="flex items-center gap-1"><Users size={11} /> {m?.completions} completions</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <button className="flex-1 text-[12px] font-medium text-primary-600 border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-all">Edit</button>
                <button className="flex-1 text-[12px] font-medium text-text-secondary border border-border px-3 py-1.5 rounded-lg hover:bg-surface transition-all">Preview</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteAdminLayout>
  );
}
