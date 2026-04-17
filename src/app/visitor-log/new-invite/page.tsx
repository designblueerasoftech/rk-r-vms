'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import {
  ArrowLeft, Search, Phone, Mail, Building2, UserCheck, Calendar, Clock,
  FileText, Users, Send, ChevronDown, CheckCircle,
} from 'lucide-react';

const hosts = ['Rahul Agarwal', 'Deepa Krishnan', 'Sunil Gupta', 'Priya Sharma', 'Ankit Mehta'];
const visitorTypes = ['Business Guest', 'VIP', 'Contractor', 'Vendor', 'Interviewee', 'Delivery', 'Govt Official'];

export default function NewVisitorInvitePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '', company: '', host: '', visitDate: '', visitTime: '',
    purpose: '', visitorType: 'Business Guest', isGroupVisit: false, returnVisitor: '', dpdp: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!form?.fullName || !form?.mobile) return;
    setShowSuccess(true);
    setTimeout(() => {
      router?.push('/visitor-log');
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-md mx-auto">
        {/* Back Button */}
        <div className="mb-5">
          <Link
            href="/visitor-log"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-primary-700 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Visitor Log
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-slate-800">New Visitor Invite</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Create invite → sends WhatsApp pre-check-in link</p>
        </div>

        {/* Success Banner */}
        {showSuccess && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <CheckCircle size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-green-800">Invite sent successfully!</p>
              <p className="text-[12px] text-green-600">WhatsApp pre-check-in link delivered. Redirecting to Visitor Log…</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 space-y-5">

          {/* Return Visitor Search */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Return Visitor Search</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search existing visitor to auto-fill..."
                value={form?.returnVisitor}
                onChange={e => setForm(f => ({ ...f, returnVisitor: e?.target?.value }))}
                className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 bg-slate-50"
              />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
              Visitor Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter visitor full name"
              value={form?.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e?.target?.value }))}
              className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
            />
          </div>

          {/* Mobile + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form?.mobile}
                  onChange={e => setForm(f => ({ ...f, mobile: e?.target?.value }))}
                  className="w-full pl-8 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                Email <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="visitor@company.com"
                  value={form?.email}
                  onChange={e => setForm(f => ({ ...f, email: e?.target?.value }))}
                  className="w-full pl-8 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                />
              </div>
            </div>
          </div>

          {/* Company + Visitor Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Company / Organization</label>
              <div className="relative">
                <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Company or organization name"
                  value={form?.company}
                  onChange={e => setForm(f => ({ ...f, company: e?.target?.value }))}
                  className="w-full pl-8 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Visitor Type</label>
              <div className="relative">
                <select
                  value={form?.visitorType}
                  onChange={e => setForm(f => ({ ...f, visitorType: e?.target?.value }))}
                  className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 appearance-none bg-white"
                >
                  {visitorTypes?.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Host */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Host Name</label>
            <div className="relative">
              <UserCheck size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search host..."
                value={form?.host}
                onChange={e => setForm(f => ({ ...f, host: e?.target?.value }))}
                list="hosts-list"
                className="w-full pl-8 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
              />
              <datalist id="hosts-list">
                {hosts?.map(h => <option key={h} value={h} />)}
              </datalist>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Date of Visit</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={form?.visitDate}
                  onChange={e => setForm(f => ({ ...f, visitDate: e?.target?.value }))}
                  className="w-full pl-8 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Time of Visit</label>
              <div className="relative">
                <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="time"
                  value={form?.visitTime}
                  onChange={e => setForm(f => ({ ...f, visitTime: e?.target?.value }))}
                  className="w-full pl-8 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                />
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Purpose of Visit</label>
            <div className="relative">
              <FileText size={13} className="absolute left-3 top-3 text-slate-400" />
              <textarea
                placeholder="Describe the purpose of visit"
                value={form?.purpose}
                onChange={e => setForm(f => ({ ...f, purpose: e?.target?.value }))}
                rows={3}
                className="w-full pl-8 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 resize-none"
              />
            </div>
          </div>

          {/* Group Visit Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <Users size={16} className="text-slate-500" />
              <div>
                <p className="text-[13px] font-semibold text-slate-700">This is a Group Visit</p>
                <p className="text-[11px] text-slate-400">Multiple visitors under one invite</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isGroupVisit: !f?.isGroupVisit }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form?.isGroupVisit ? 'bg-primary-600' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form?.isGroupVisit ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* DPDP Consent */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <input
              type="checkbox"
              id="dpdp"
              checked={form?.dpdp}
              onChange={e => setForm(f => ({ ...f, dpdp: e?.target?.checked }))}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-400"
            />
            <label htmlFor="dpdp" className="text-[12px] text-slate-600 cursor-pointer">
              <span className="font-semibold text-slate-700">DPDP Act 2023</span> consent obtained from visitor for data collection and processing.
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <Link
            href="/visitor-log"
            className="flex-1 sm:flex-none sm:w-36 flex items-center justify-center py-2.5 text-[13px] font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!form?.fullName || !form?.mobile}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Send size={14} />
            Send Invite
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
