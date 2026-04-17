'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddSiteFormData {
  siteName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  timezone: string;
  capacity: string;
  gateCount: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  emergencyContact: string;
}

interface AddSiteModalProps {
  onClose: () => void;
}

export default function AddSiteModal({ onClose }: AddSiteModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddSiteFormData>();

  const onSubmit = (data: AddSiteFormData) => {
    setSubmitting(true);
    // Backend: POST /api/sites { ...data }
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Site "${data.siteName}" created successfully!`, {
        description: 'Kiosk setup instructions sent to site contact.',
      });
      onClose();
    }, 1600);
  };

  const steps = [
    { id: 1, label: 'Site Info' },
    { id: 2, label: 'Configuration' },
    { id: 3, label: 'Contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col fade-in">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <MapPin size={16} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-text-primary">Add New Site</h2>
              <p className="text-[11px] text-text-muted">Configure a new physical location</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 py-3 border-b border-border bg-surface/50">
          {steps.map((s, idx) => (
            <React.Fragment key={`step-${s.id}`}>
              <button
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 ${
                  step === s.id
                    ? 'bg-primary-600 text-white'
                    : step > s.id
                    ? 'text-success-text bg-success/10' :'text-text-muted bg-transparent'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.id ? 'bg-white/20' : step > s.id ? 'bg-success/20' : 'bg-slate-200'
                }`}>
                  {s.id}
                </span>
                {s.label}
              </button>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-px mx-1 ${step > s.id ? 'bg-success/40' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-6 py-5 space-y-4">

            {/* Step 1: Site Info */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1">
                    Site Name <span className="text-danger">*</span>
                  </label>
                  <p className="text-[11px] text-text-muted mb-1.5">This will appear across all dashboards and reports</p>
                  <input
                    {...register('siteName', { required: 'Site name is required' })}
                    placeholder="e.g. Mumbai HQ — Tower A"
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                  />
                  {errors.siteName && (
                    <p className="text-[11px] text-danger-text mt-1">{errors.siteName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1">
                    Street Address <span className="text-danger">*</span>
                  </label>
                  <input
                    {...register('address', { required: 'Address is required' })}
                    placeholder="e.g. Plot C-12, Bandra Kurla Complex"
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                  />
                  {errors.address && (
                    <p className="text-[11px] text-danger-text mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-text-primary mb-1">City <span className="text-danger">*</span></label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      placeholder="Mumbai"
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                    />
                    {errors.city && <p className="text-[11px] text-danger-text mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-text-primary mb-1">State <span className="text-danger">*</span></label>
                    <input
                      {...register('state', { required: 'State is required' })}
                      placeholder="Maharashtra"
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                    />
                    {errors.state && <p className="text-[11px] text-danger-text mt-1">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-text-primary mb-1">PIN Code</label>
                    <input
                      {...register('pincode')}
                      placeholder="400051"
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-text-primary mb-1">Country</label>
                    <select
                      {...register('country')}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all bg-white"
                    >
                      <option value="India">India</option>
                      <option value="Singapore">Singapore</option>
                      <option value="UAE">UAE</option>
                      <option value="USA">USA</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1">Timezone</label>
                  <select
                    {...register('timezone')}
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all bg-white"
                  >
                    <option value="IST">IST — UTC+5:30 (India Standard Time)</option>
                    <option value="SGT">SGT — UTC+8:00 (Singapore Time)</option>
                    <option value="GST">GST — UTC+4:00 (Gulf Standard Time)</option>
                    <option value="EST">EST — UTC-5:00 (Eastern Standard Time)</option>
                  </select>
                </div>
              </>
            )}

            {/* Step 2: Configuration */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1">
                    Maximum Capacity <span className="text-danger">*</span>
                  </label>
                  <p className="text-[11px] text-text-muted mb-1.5">Maximum number of visitors allowed on-site simultaneously</p>
                  <input
                    {...register('capacity', {
                      required: 'Capacity is required',
                      min: { value: 1, message: 'Must be at least 1' },
                    })}
                    type="number"
                    placeholder="e.g. 200"
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                  />
                  {errors.capacity && <p className="text-[11px] text-danger-text mt-1">{errors.capacity.message}</p>}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1">
                    Number of Gates / Entry Points <span className="text-danger">*</span>
                  </label>
                  <p className="text-[11px] text-text-muted mb-1.5">Each gate can have one or more kiosks assigned to it</p>
                  <input
                    {...register('gateCount', { required: 'Gate count is required' })}
                    type="number"
                    placeholder="e.g. 3"
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                  />
                  {errors.gateCount && <p className="text-[11px] text-danger-text mt-1">{errors.gateCount.message}</p>}
                </div>

                {/* Feature toggles */}
                <div className="space-y-3 pt-1">
                  <p className="text-[12px] font-semibold text-text-primary">Site Features</p>
                  {[
                    { id: 'feat-whatsapp', label: 'WhatsApp Pre-Registration', desc: 'Enable WhatsApp invite flow for this site' },
                    { id: 'feat-induction', label: 'Mandatory Induction', desc: 'Require safety video + quiz before check-in' },
                    { id: 'feat-badge', label: 'Badge Printing', desc: 'Auto-print visitor badge on check-in' },
                    { id: 'feat-photo', label: 'Photo Capture', desc: 'Capture visitor photo at kiosk' },
                    { id: 'feat-nda', label: 'NDA / Agreement', desc: 'Require digital NDA signature' },
                  ].map((feat) => (
                    <div key={feat.id} className="flex items-start justify-between gap-3 p-3 rounded-xl border border-border hover:border-primary-200 transition-colors">
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-text-primary">{feat.label}</p>
                        <p className="text-[11px] text-text-muted">{feat.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                        <input type="checkbox" className="sr-only peer" defaultChecked={feat.id === 'feat-whatsapp' || feat.id === 'feat-photo'} />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
              <>
                <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 mb-2">
                  <p className="text-[12px] font-semibold text-primary-700">Site Contact Details</p>
                  <p className="text-[11px] text-primary-600/70">This person will receive kiosk setup instructions and site-level alerts</p>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1">
                    Contact Name <span className="text-danger">*</span>
                  </label>
                  <input
                    {...register('contactName', { required: 'Contact name is required' })}
                    placeholder="e.g. Priya Mehta"
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                  />
                  {errors.contactName && <p className="text-[11px] text-danger-text mt-1">{errors.contactName.message}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1">
                    Contact Email <span className="text-danger">*</span>
                  </label>
                  <input
                    {...register('contactEmail', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                    })}
                    type="email"
                    placeholder="e.g. priya.mehta@acmecorp.in"
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                  />
                  {errors.contactEmail && <p className="text-[11px] text-danger-text mt-1">{errors.contactEmail.message}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1">Contact Phone</label>
                  <input
                    {...register('contactPhone')}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1">Emergency Contact</label>
                  <p className="text-[11px] text-text-muted mb-1.5">For evacuation alerts and critical notifications</p>
                  <input
                    {...register('emergencyContact')}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-text-muted"
                  />
                </div>
              </>
            )}
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
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="px-5 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-70 min-w-[120px] justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Site'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}