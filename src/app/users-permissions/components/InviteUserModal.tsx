'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, UserPlus, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

interface InviteUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  sites: string[];
  sendWhatsApp: boolean;
}

interface InviteUserModalProps {
  onClose: () => void;
}

const roleOptions = [
  { id: 'role-opt-superadmin', value: 'Super Admin',     desc: 'Full platform access — all sites and settings', color: 'border-amber-200 bg-amber-50' },
  { id: 'role-opt-siteadmin',  value: 'Site Admin',      desc: 'Assigned sites only — full operational control', color: 'border-primary-200 bg-primary-50' },
  { id: 'role-opt-operator',   value: 'Operator',        desc: 'Check-in / check-out — no configuration access', color: 'border-teal-200 bg-teal-50' },
  { id: 'role-opt-security',   value: 'Security Guard',  desc: 'View-only access — blacklist alerts and headcount', color: 'border-purple-200 bg-purple-50' },
];

const siteOptions = [
  { id: 'site-opt-mumbai',    label: 'Mumbai HQ' },
  { id: 'site-opt-bangalore', label: 'Bengaluru Tech Park' },
  { id: 'site-opt-delhi',     label: 'Delhi NCR Office' },
  { id: 'site-opt-chennai',   label: 'Chennai Data Centre' },
  { id: 'site-opt-hyderabad', label: 'Hyderabad Campus' },
];

export default function InviteUserModal({ onClose }: InviteUserModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [allSites, setAllSites] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteUserFormData>();

  const toggleSite = (label: string) => {
    setSelectedSites((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const onSubmit = (data: InviteUserFormData) => {
    if (!selectedRole) {
      toast.error('Please select a role for this user');
      return;
    }
    setSubmitting(true);
    // Backend: POST /api/users/invite { ...data, role: selectedRole, sites: allSites ? ['all'] : selectedSites }
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Invitation sent to ${data.email}`, {
        description: `${data.firstName} will receive an email with setup instructions.`,
      });
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <UserPlus size={16} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-text-primary">Invite New User</h2>
              <p className="text-[11px] text-text-muted">They'll receive a setup email with login instructions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-6 py-5 space-y-5">

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  {...register('firstName', { required: 'First name required' })}
                  placeholder="Priya"
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                />
                {errors.firstName && <p className="text-[11px] text-danger-text mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  {...register('lastName', { required: 'Last name required' })}
                  placeholder="Mehta"
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                />
                {errors.lastName && <p className="text-[11px] text-danger-text mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold text-text-primary mb-1">
                Work Email <span className="text-danger">*</span>
              </label>
              <p className="text-[11px] text-text-muted mb-1.5">Use their corporate email — this is their login username</p>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                })}
                type="email"
                placeholder="priya.mehta@acmecorp.in"
                className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
              />
              {errors.email && <p className="text-[11px] text-danger-text mt-1">{errors.email.message}</p>}
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-[12px] font-semibold text-text-primary mb-2">
                Role <span className="text-danger">*</span>
              </label>
              <div className="space-y-2">
                {roleOptions.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                      selectedRole === role.value
                        ? `${role.color} border-primary-400`
                        : 'border-border hover:border-border/80 hover:bg-surface/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                      selectedRole === role.value ? 'border-primary-600 bg-primary-600' : 'border-slate-300'
                    }`}>
                      {selectedRole === role.value && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-text-primary">{role.value}</p>
                      <p className="text-[11px] text-text-muted">{role.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Site assignment */}
            {selectedRole && selectedRole !== 'Super Admin' && (
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-2">
                  Assign to Sites <span className="text-danger">*</span>
                </label>
                <p className="text-[11px] text-text-muted mb-2">Select which sites this user can access</p>
                <div className="space-y-1.5">
                  {siteOptions.map((site) => (
                    <label
                      key={site.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:border-primary-200 hover:bg-primary-50/30 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSites.includes(site.label)}
                        onChange={() => toggleSite(site.label)}
                        className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-200"
                      />
                      <span className="text-[13px] font-medium text-text-primary">{site.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {selectedRole === 'Super Admin' && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[12px] text-amber-700">
                  Super Admins have access to all sites and platform-wide settings. Site assignment is not required.
                </p>
              </div>
            )}

            {/* WhatsApp toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div>
                <p className="text-[13px] font-semibold text-text-primary">Send WhatsApp notification</p>
                <p className="text-[11px] text-text-muted">Also send invite via WhatsApp (requires phone number)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-surface/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-70 min-w-[140px] justify-center"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}