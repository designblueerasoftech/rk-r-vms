'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import {
  ArrowLeft, Phone, Mail, Building2, UserCheck, MapPin, Clock, FileText,
  Shield, CheckCircle, AlertTriangle, Send, MessageSquare, Download,
  Printer, LogOut, Ban, RefreshCw, ChevronRight, X, Car, Package,
  CreditCard, Camera, Wifi,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type VisitorStatus = 'Invited' | 'Pre-Registered' | 'At Gate' | 'Checked-In' | 'Checked-Out';
type VisitorType = 'VIP' | 'Contractor' | 'Vendor' | 'Interviewee' | 'Delivery' | 'Business Guest' | 'Govt Official' | 'Group Visit';
type TabId = 'overview' | 'timeline' | 'documents' | 'chat';

interface TimelineStep {
  status: VisitorStatus;
  time: string;
  date: string;
  note: string;
  completed: boolean;
  active: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'system' | 'visitor' | 'host';
  text: string;
  time: string;
  senderName: string;
}

/* ─── Mock Visitor Data ──────────────────────────────────────────────────── */
const mockVisitorDetails: Record<string, {
  id: string; name: string; initials: string; avatarColor: string;
  type: VisitorType; company: string; host: string; status: VisitorStatus;
  checkIn: string; checkOut: string; duration: string; gate: string;
  purpose: string; mobile: string; email: string; idType: string; idNumber: string;
  vehicle: string; items: string; site: string; floor: string;
  timeline: TimelineStep[]; chat: ChatMessage[];
}> = {
  v1: {
    id: 'v1', name: 'Meera Pillai', initials: 'MP', avatarColor: 'bg-purple-500',
    type: 'VIP', company: 'TechVision Corp', host: 'Rahul Agarwal', status: 'Checked-Out',
    checkIn: '10:48 PM', checkOut: '01:14 AM', duration: '3h 26m', gate: 'Gate A',
    purpose: 'Partnership discussion - Q2 roadmap review and strategic alignment meeting',
    mobile: '+91 98765 43210', email: 'meera@techvision.com',
    idType: 'Passport', idNumber: 'P1234567', vehicle: 'MH 01 AB 1234', items: 'Laptop, Presentation materials',
    site: 'HQ - Mumbai', floor: 'Floor 12 - Executive Suite',
    timeline: [
      { status: 'Invited', time: '09:00 AM', date: 'Apr 12, 2026', note: 'Invite sent via WhatsApp', completed: true, active: false },
      { status: 'Pre-Registered', time: '09:45 AM', date: 'Apr 12, 2026', note: 'Pre-check-in form completed', completed: true, active: false },
      { status: 'At Gate', time: '10:42 PM', date: 'Apr 12, 2026', note: 'Arrived at Gate A, ID verified', completed: true, active: false },
      { status: 'Checked-In', time: '10:48 PM', date: 'Apr 12, 2026', note: 'Checked in by security officer', completed: true, active: false },
      { status: 'Checked-Out', time: '01:14 AM', date: 'Apr 13, 2026', note: 'Checked out, pass returned', completed: true, active: true },
    ],
    chat: [
      { id: 'c1', sender: 'system', senderName: 'VMSPro', text: 'Your visit invite has been created. Please complete pre-check-in.', time: '09:00 AM' },
      { id: 'c2', sender: 'visitor', senderName: 'Meera Pillai', text: 'Thank you! I have completed the pre-check-in form.', time: '09:45 AM' },
      { id: 'c3', sender: 'host', senderName: 'Rahul Agarwal', text: 'Hi Meera, looking forward to meeting you. Please proceed to Gate A.', time: '10:30 PM' },
      { id: 'c4', sender: 'visitor', senderName: 'Meera Pillai', text: 'On my way! Will be there in 10 minutes.', time: '10:38 PM' },
      { id: 'c5', sender: 'system', senderName: 'VMSPro', text: 'Visitor has checked in successfully at Gate A.', time: '10:48 PM' },
    ],
  },
};

// Fallback for unknown IDs
const defaultVisitor = mockVisitorDetails['v1'];

/* ─── Status Config ──────────────────────────────────────────────────────── */
const statusConfig: Record<VisitorStatus, { bg: string; text: string; dot: string }> = {
  'Invited': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Pre-Registered': { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
  'At Gate': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Checked-In': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  'Checked-Out': { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

const typeConfig: Record<VisitorType, { bg: string; text: string }> = {
  'VIP': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Contractor': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Vendor': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Interviewee': { bg: 'bg-violet-100', text: 'text-violet-700' },
  'Delivery': { bg: 'bg-teal-100', text: 'text-teal-700' },
  'Business Guest': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  'Govt Official': { bg: 'bg-red-100', text: 'text-red-700' },
  'Group Visit': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

const timelineStatusConfig: Record<VisitorStatus, { icon: React.ReactNode; color: string; bg: string }> = {
  'Invited': { icon: <Send size={14} />, color: 'text-blue-600', bg: 'bg-blue-100' },
  'Pre-Registered': { icon: <FileText size={14} />, color: 'text-teal-600', bg: 'bg-teal-100' },
  'At Gate': { icon: <MapPin size={14} />, color: 'text-amber-600', bg: 'bg-amber-100' },
  'Checked-In': { icon: <CheckCircle size={14} />, color: 'text-green-600', bg: 'bg-green-100' },
  'Checked-Out': { icon: <LogOut size={14} />, color: 'text-slate-500', bg: 'bg-slate-100' },
};

/* ─── Info Row ───────────────────────────────────────────────────────────── */
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-[13px] font-semibold text-slate-800 mt-0.5 break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function VisitorDetailsPage() {
  const params = useParams();
  const visitorId = params?.id as string;
  const visitor = mockVisitorDetails[visitorId] || defaultVisitor;

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(visitor.chat);

  const statusCfg = statusConfig[visitor.status];
  const typeCfg = typeConfig[visitor.type];

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessages(prev => [...prev, {
      id: `c${Date.now()}`, sender: 'host', senderName: 'Rahul Agarwal',
      text: chatMessage.trim(), time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatMessage('');
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <UserCheck size={15} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={15} /> },
    { id: 'documents', label: 'Documents & Compliance', icon: <FileText size={15} /> },
    { id: 'chat', label: 'Chat History', icon: <MessageSquare size={15} /> },
  ];

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href="/visitor-log"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-primary-700 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Visitor Log
          </Link>
        </div>

        <div className="flex gap-5">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Hero Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Avatar */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-[28px] font-bold shrink-0 ${visitor.avatarColor} shadow-md`}>
                  {visitor.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <h1 className="text-[22px] font-bold text-slate-800">{visitor.name}</h1>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[12px] font-semibold ${typeCfg.bg} ${typeCfg.text}`}>
                      {visitor.type}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      {visitor.status}
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-500 mb-3">{visitor.company}</p>

                  <div className="flex flex-wrap gap-4 text-[13px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-green-500" />
                      <span>Check-in: <strong className="text-slate-700">{visitor.checkIn}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <LogOut size={13} className="text-slate-400" />
                      <span>Check-out: <strong className="text-slate-700">{visitor.checkOut}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-primary-500" />
                      <span>Duration: <strong className="text-slate-700">{visitor.duration}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{visitor.gate}</span>
                    </div>
                  </div>
                </div>

                {/* Pass ID */}
                <div className="shrink-0 text-right">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Pass ID</p>
                    <p className="text-[16px] font-bold text-slate-800 font-mono mt-0.5">VMS-{visitor.id.toUpperCase()}-2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
              {/* Tab Bar */}
              <div className="flex border-b border-slate-200 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                      ? 'border-primary-600 text-primary-700 bg-primary-50/50' :'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Quick Actions</h3>
                      <div className="flex flex-wrap gap-2">
                        <button className="flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors">
                          <RefreshCw size={13} />
                          Resend WhatsApp Invite
                        </button>
                        <button className="flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                          <Printer size={13} />
                          Print Pass
                        </button>
                        {visitor.status === 'Checked-In' && (
                          <button className="flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                            <LogOut size={13} />
                            Mark as Checked-Out
                          </button>
                        )}
                        <button className="flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                          <Ban size={13} />
                          Add to Blacklist
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Contact & Identity */}
                      <div>
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Contact & Identity</h3>
                        <div className="bg-slate-50 rounded-xl border border-slate-100 px-4">
                          <InfoRow icon={<Phone size={14} />} label="Mobile" value={visitor.mobile} />
                          <InfoRow icon={<Mail size={14} />} label="Email" value={visitor.email} />
                          <InfoRow icon={<CreditCard size={14} />} label="ID Type" value={visitor.idType} />
                          <InfoRow icon={<Shield size={14} />} label="ID Number" value={visitor.idNumber} />
                        </div>
                      </div>

                      {/* Visit Details */}
                      <div>
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Visit Details</h3>
                        <div className="bg-slate-50 rounded-xl border border-slate-100 px-4">
                          <InfoRow icon={<UserCheck size={14} />} label="Host" value={visitor.host} />
                          <InfoRow icon={<FileText size={14} />} label="Purpose" value={visitor.purpose} />
                          <InfoRow icon={<Building2 size={14} />} label="Site" value={visitor.site} />
                          <InfoRow icon={<MapPin size={14} />} label="Floor / Area" value={visitor.floor} />
                        </div>
                      </div>

                      {/* Vehicle & Items */}
                      <div>
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Vehicle & Items</h3>
                        <div className="bg-slate-50 rounded-xl border border-slate-100 px-4">
                          <InfoRow icon={<Car size={14} />} label="Vehicle Number" value={visitor.vehicle} />
                          <InfoRow icon={<Package size={14} />} label="Items Carried" value={visitor.items} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-5">Visit Journey</h3>
                    <div className="relative">
                      {visitor.timeline.map((step, idx) => {
                        const cfg = timelineStatusConfig[step.status];
                        const isLast = idx === visitor.timeline.length - 1;
                        return (
                          <div key={step.status} className="flex gap-4 relative">
                            {/* Line */}
                            {!isLast && (
                              <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-200" />
                            )}
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${step.completed ? cfg.bg : 'bg-slate-100'} ${step.completed ? cfg.color : 'text-slate-400'}`}>
                              {cfg.icon}
                            </div>
                            {/* Content */}
                            <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className={`text-[14px] font-bold ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>{step.status}</p>
                                {step.active && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Current</span>
                                )}
                              </div>
                              <p className="text-[12px] text-slate-500 mb-1">{step.time} · {step.date}</p>
                              <p className="text-[12px] text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{step.note}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Documents & Compliance Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-5">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Compliance Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: 'NDA Signed', status: true, icon: <FileText size={16} />, file: 'NDA_MeeraPillai_Apr2026.pdf' },
                        { label: 'Health Declaration', status: true, icon: <Shield size={16} />, file: 'HealthDecl_Apr2026.pdf' },
                        { label: 'Safety Induction', status: false, icon: <AlertTriangle size={16} />, file: null },
                        { label: 'ID Verified', status: true, icon: <CreditCard size={16} />, file: 'ID_Passport_P1234567.jpg' },
                        { label: 'Photo Captured', status: true, icon: <Camera size={16} />, file: 'Photo_MeeraPillai.jpg' },
                        { label: 'DPDP Consent', status: true, icon: <CheckCircle size={16} />, file: 'DPDP_Consent_Apr2026.pdf' },
                      ].map(doc => (
                        <div key={doc.label} className={`flex items-center gap-3 p-4 rounded-xl border ${doc.status ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-200'}`}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${doc.status ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                            {doc.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-slate-800">{doc.label}</p>
                            {doc.file ? (
                              <p className="text-[11px] text-slate-400 truncate">{doc.file}</p>
                            ) : (
                              <p className="text-[11px] text-slate-400">Not completed</p>
                            )}
                          </div>
                          {doc.status && doc.file && (
                            <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors shrink-0">
                              <Download size={13} />
                            </button>
                          )}
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${doc.status ? 'bg-green-500' : 'bg-slate-300'}`}>
                            {doc.status
                              ? <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              : <X size={10} className="text-white" />
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat History Tab */}
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-[480px]">
                    <div className="flex items-center gap-2 mb-4">
                      <Wifi size={14} className="text-green-500" />
                      <span className="text-[12px] font-semibold text-green-600">WhatsApp Channel Active</span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] ${msg.sender === 'system' ? 'mx-auto' : ''}`}>
                            {msg.sender !== 'system' && (
                              <p className={`text-[10px] font-semibold mb-1 ${msg.sender === 'visitor' ? 'text-right text-violet-600' : 'text-left text-primary-600'}`}>
                                {msg.senderName}
                              </p>
                            )}
                            <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                              msg.sender === 'system' ?'bg-slate-100 text-slate-500 text-center text-[11px] rounded-lg px-3 py-1.5'
                                : msg.sender === 'visitor' ?'bg-violet-500 text-white rounded-br-sm' :'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                            }`}>
                              {msg.text}
                            </div>
                            <p className={`text-[10px] text-slate-400 mt-1 ${msg.sender === 'visitor' ? 'text-right' : 'text-left'}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={chatMessage}
                        onChange={e => setChatMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        className="flex-1 px-4 py-2.5 text-[13px] border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                      />
                      <button
                        onClick={sendMessage}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-colors shrink-0"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Right Sidebar */}
          <div className="w-72 shrink-0 hidden xl:block">
            <div className="sticky top-5 space-y-4">
              {/* Live Summary */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Live Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-500">Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      {visitor.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-500">Check-In</span>
                    <span className="text-[12px] font-semibold text-slate-700">{visitor.checkIn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-500">Check-Out</span>
                    <span className="text-[12px] font-semibold text-slate-700">{visitor.checkOut}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-500">Duration</span>
                    <span className="text-[12px] font-semibold text-slate-700">{visitor.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-500">Gate</span>
                    <span className="text-[12px] font-semibold text-slate-700">{visitor.gate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-500">Host</span>
                    <span className="text-[12px] font-semibold text-slate-700">{visitor.host}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Actions */}
              <div className="bg-white rounded-xl border border-red-100 shadow-card p-5">
                <h3 className="text-[11px] font-bold text-red-400 uppercase tracking-widest mb-3">Emergency</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-[12px] font-semibold text-red-700 transition-colors">
                    <AlertTriangle size={14} />
                    Flag as Suspicious
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-[12px] font-semibold text-white transition-colors">
                    <Shield size={14} />
                    Emergency Escort
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-700 transition-colors">
                    <Ban size={14} />
                    Deny Re-Entry
                  </button>
                </div>
              </div>

              {/* Compliance Summary */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Compliance</h3>
                <div className="space-y-2">
                  {[
                    { label: 'NDA', ok: true },
                    { label: 'ID Verified', ok: true },
                    { label: 'Photo', ok: true },
                    { label: 'Safety Induction', ok: false },
                    { label: 'DPDP Consent', ok: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-[12px] text-slate-600">{item.label}</span>
                      <span className={`flex items-center gap-1 text-[11px] font-semibold ${item.ok ? 'text-green-600' : 'text-red-500'}`}>
                        {item.ok
                          ? <><CheckCircle size={12} /> Done</>
                          : <><X size={12} /> Pending</>
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
                <Link
                  href="/visitor-log"
                  className="flex items-center justify-between text-[13px] font-medium text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <span>← Back to Visitor Log</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
