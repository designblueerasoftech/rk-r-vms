'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Copy,
  ChevronRight,
  CheckCircle2,
  Zap,
  Shield,
  Globe,
  Bell,
  Users,
  Briefcase,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


// ─── Types ───────────────────────────────────────────────────────────────────
interface DemoAccount {
  role: string;
  email: string;
  badgeColor: string;
  badgeText: string;
  route: string;
}

// ─── Demo Accounts ────────────────────────────────────────────────────────────
const demoAccounts: DemoAccount[] = [
  {
    role: 'Company Admin',
    email: 'rahul.agarwal@techcorp.in',
    badgeColor: 'bg-blue-100 text-blue-700',
    badgeText: 'Admin',
    route: '/dashboard',
  },
  {
    role: 'Site Admin',
    email: 'priya.sharma@techcorp.in',
    badgeColor: 'bg-teal-100 text-teal-700',
    badgeText: 'Site',
    route: '/dashboard',
  },
  {
    role: 'Host',
    email: 'deepa.krishnan@techcorp.in',
    badgeColor: 'bg-green-100 text-green-700',
    badgeText: 'Host',
    route: '/visitor-log',
  },
  {
    role: 'Receptionist / Front Desk',
    email: 'amit.patel@techcorp.in',
    badgeColor: 'bg-purple-100 text-purple-700',
    badgeText: 'Desk',
    route: '/kiosks',
  },
  {
    role: 'Assistant',
    email: 'neha.desai@techcorp.in',
    badgeColor: 'bg-orange-100 text-orange-700',
    badgeText: 'Asst',
    route: '/visitor-log',
  },
  {
    role: 'Security Staff',
    email: 'sunil.gupta@techcorp.in',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    badgeText: 'Sec',
    route: '/blacklist',
  },
];

// ─── Lifecycle Steps ──────────────────────────────────────────────────────────
const lifecycleSteps = [
  { num: 1, label: 'Invited', sub: 'WhatsApp QR sent', color: 'bg-blue-500' },
  { num: 2, label: 'Pre-Registered', sub: 'OTP verified', color: 'bg-purple-500' },
  { num: 3, label: 'At Gate', sub: 'ID scanned', color: 'bg-orange-500' },
  { num: 4, label: 'Checked In', sub: 'Badge printed', color: 'bg-green-500' },
  { num: 5, label: 'Checked Out', sub: 'Pass invalidated', color: 'bg-slate-400' },
];

// ─── Feature Highlights ───────────────────────────────────────────────────────
const features = [
  { iconName: 'Zap', label: 'No-code visual workflow builder' },
  { iconName: 'Globe', label: 'Multi-site centralized management' },
  { iconName: 'Shield', label: 'Real-time watchlist screening' },
  { iconName: 'Bell', label: 'WhatsApp Business API primary channel' },
  { iconName: 'CheckCircle2', label: 'DPDP Act 2023 compliant' },
  { iconName: 'Users', label: 'Group & contractor pass management' },
];

// ─── Icon map (avoids module-level JSX which causes hydration mismatch) ────────
const featureIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Zap,
  Globe,
  Shield,
  Bell,
  CheckCircle2,
  Users,
};

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: '2.4L+', label: 'Visitors managed' },
  { value: '180+', label: 'Sites across India' },
  { value: '99.97%', label: 'Platform uptime' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  };

  const handleDemoLogin = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword('demo123');
    showToast(`Logging in as ${account.role}…`);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vms_role', account.role);
      localStorage.setItem('vms_email', account.email);
    }
    setTimeout(() => {
      router.push(account.route);
    }, 1200);
  };

  const handleCopyEmail = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email).catch(() => {});
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 1500);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const account = demoAccounts.find((a) => a.email === email);
    if (account) {
      handleDemoLogin(account);
    } else {
      showToast('Use a demo account below to sign in.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* ── Toast ── */}
      {toast.visible && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1E293B] text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-modal fade-in flex items-center gap-2">
          <CheckCircle2 size={15} className="text-green-400 shrink-0" />
          {toast.message}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          LEFT PANEL — Purple Gradient Hero
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="lg:w-1/2 flex flex-col justify-between px-8 py-8 lg:px-12 lg:py-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #5B21B6 0%, #3B1A8F 40%, #1E1133 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Briefcase size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight tracking-tight">VMS Pro</p>
            <p className="text-purple-300 text-[10px] font-semibold tracking-[0.15em] uppercase">Visitor Management</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 mt-10 lg:mt-0">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            <span className="text-white">Intelligent Visitor</span>
            <br />
            <span className="text-purple-300">Management</span>
            <br />
            <span className="text-white">for India</span>
          </h1>
          <p className="mt-4 text-purple-200 text-sm lg:text-base leading-relaxed max-w-sm">
            From invite to check-out — a frictionless, secure, fully compliant visitor journey across all your sites.
          </p>

          {/* Visitor Lifecycle */}
          <div className="mt-8">
            <p className="text-purple-400 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">Visitor Lifecycle</p>
            <div className="flex items-start gap-0 overflow-x-auto pb-1">
              {lifecycleSteps.map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className="flex flex-col items-center min-w-[72px]">
                    <div className={`w-9 h-9 rounded-xl ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {step.num}
                    </div>
                    <p className="text-white text-[11px] font-semibold mt-2 text-center leading-tight">{step.label}</p>
                    <p className="text-purple-300 text-[10px] text-center leading-tight mt-0.5">{step.sub}</p>
                  </div>
                  {idx < lifecycleSteps.length - 1 && (
                    <div className="flex-1 h-px bg-purple-600 mt-[18px] mx-1 min-w-[12px]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
            {features.map((f, i) => {
              const Icon = featureIconMap[f.iconName];
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-purple-300 shrink-0">
                    {Icon && <Icon size={14} />}
                  </span>
                  <span className="text-purple-100 text-[12px] leading-snug">{f.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 mt-10 lg:mt-0 grid grid-cols-3 gap-4 border-t border-purple-700/50 pt-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-white text-2xl font-bold tabular-nums">{s.value}</p>
              <p className="text-purple-300 text-[11px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT PANEL — Sign-In Form
      ══════════════════════════════════════════════════════════════ */}
      <div className="lg:w-1/2 bg-white flex flex-col justify-between min-h-screen lg:min-h-0 overflow-y-auto scrollbar-thin">
        <div className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-14 xl:px-20 max-w-xl mx-auto w-full">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Sign in to VMS Pro</h2>
            <p className="text-text-secondary text-sm mt-1">Enter your credentials to access your workspace.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">Work Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.in"
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-text-primary">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 border border-border rounded-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Keep signed in */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-400 cursor-pointer"
              />
              <span className="text-sm text-text-secondary">Keep me signed in for 30 days</span>
            </label>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-card text-white font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.99] shadow-card-md"
              style={{ background: 'linear-gradient(135deg, #405189 0%, #4a5fa0 100%)' }}
            >
              Sign In
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 border border-border rounded-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border">
              <Users size={14} className="text-text-muted" />
              <span className="text-sm font-semibold text-text-primary">Demo Accounts</span>
              <span className="text-xs text-text-muted">— click any row to autofill &amp; login as that role</span>
            </div>
            <div className="divide-y divide-border">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleDemoLogin(account)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors cursor-pointer text-left group"
                >
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-badge ${account.badgeColor}`}>
                    {account.badgeText}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary leading-tight">{account.role}</p>
                    <p className="text-[11px] text-text-muted font-mono truncate">{account.email}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => handleCopyEmail(e, account.email)}
                      className="p-1 rounded hover:bg-slate-200 transition-colors"
                      aria-label="Copy email"
                      title="Copy email"
                    >
                      {copiedEmail === account.email ? (
                        <CheckCircle2 size={13} className="text-green-500" />
                      ) : (
                        <Copy size={13} className="text-text-muted" />
                      )}
                    </button>
                    <ChevronRight size={14} className="text-text-muted" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 lg:px-14 xl:px-20 py-5 border-t border-border text-center max-w-xl mx-auto w-full">
          <p className="text-[11px] text-text-muted leading-relaxed">
            By signing in you agree to our{' '}
            <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
            {' '}DPDP Act 2023 compliant.
          </p>
          <p className="text-[11px] text-text-muted mt-1">
            Powered by{' '}
            <span className="text-primary-600 font-semibold">BlueEra Softech</span>
          </p>
        </div>
      </div>

      {/* ── Forgot Password Modal (demo) ── */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm fade-in">
          <div className="bg-white rounded-card shadow-modal p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-bold text-text-primary mb-1">Reset Password</h3>
            <p className="text-sm text-text-secondary mb-4">Enter your work email and we'll send a reset link.</p>
            <input
              type="email"
              placeholder="you@company.in"
              className="w-full px-3.5 py-2.5 border border-border rounded-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowForgot(false)}
                className="flex-1 py-2 rounded-card border border-border text-sm font-medium text-text-secondary hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowForgot(false); showToast('Reset link sent (demo mode).'); }}
                className="flex-1 py-2 rounded-card text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #405189 0%, #4a5fa0 100%)' }}
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
