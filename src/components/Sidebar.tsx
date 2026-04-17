'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { useRole } from '@/context/RoleContext';
import { LayoutDashboard, Users, GitBranch, Paintbrush, ShieldAlert, MonitorSmartphone, UserCog, Moon, ChevronLeft, ChevronRight, LogOut, ChevronDown, ChevronUp, ClipboardList, Shield, Lock, DoorOpen, Plug, Bell, BarChart2, BookOpen, Settings, Building2, HelpCircle,  } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavGroup {
  label: string;
  items: NavItemDef[];
}

interface NavItemDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navGroups: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'nav-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
      { id: 'nav-visitor-log', label: 'Visitor Logs', icon: <ClipboardList size={18} />, href: '/visitor-log', badge: 3 },
    ],
  },
  {
    label: 'VISITOR CONFIGURATION',
    items: [
      { id: 'nav-visitor-types', label: 'Visitor Types', icon: <Users size={18} />, href: '/visitor-types' },
      // Workflow Builder is injected manually below
      { id: 'nav-induction', label: 'Induction Hub', icon: <Shield size={18} />, href: '/induction' },
      { id: 'nav-branding', label: 'Branding & Appearance', icon: <Paintbrush size={18} />, href: '/branding' },
    ],
  },
  {
    label: 'SECURITY & ACCESS',
    items: [
      { id: 'nav-locations', label: 'Sites & Locations', icon: <Building2 size={18} />, href: '/locations-sites' },
      { id: 'nav-gates', label: 'Gates & Entry Points', icon: <DoorOpen size={18} />, href: '/gates' },
      { id: 'nav-access-zones', label: 'Access Zones', icon: <Lock size={18} />, href: '/access-zones' },
      { id: 'nav-kiosks', label: 'Kiosks & Hardware', icon: <MonitorSmartphone size={18} />, href: '/kiosks' },
      { id: 'nav-blacklist', label: 'Blacklist & Watchlists', icon: <ShieldAlert size={18} />, href: '/blacklist', badge: 2 },
    ],
  },
  {
    label: 'USERS & INTEGRATIONS',
    items: [
      { id: 'nav-users', label: 'Users & Permissions', icon: <UserCog size={18} />, href: '/users-permissions' },
      { id: 'nav-integrations', label: 'Integrations', icon: <Plug size={18} />, href: '/integrations' },
      { id: 'nav-notifications', label: 'Notifications', icon: <Bell size={18} />, href: '/notifications' },
    ],
  },
  {
    label: 'ANALYTICS & COMPLIANCE',
    items: [
      { id: 'nav-reports', label: 'Reports & Analytics', icon: <BarChart2 size={18} />, href: '/reports' },
      { id: 'nav-compliance', label: 'Compliance & Audit', icon: <BookOpen size={18} />, href: '/compliance' },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { id: 'nav-settings', label: 'Settings', icon: <Settings size={18} />, href: '/settings' },
    ],
  },
];

// Items that appear after Visitor Types in VISITOR CONFIGURATION (before Induction Hub)
const WORKFLOW_BUILDER_GROUP = 'VISITOR CONFIGURATION';

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedRole, setSelectedRole } = useRole();
  const isWorkflowActive = pathname === '/workflows' || pathname.startsWith('/workflows/');
  const [workflowExpanded, setWorkflowExpanded] = useState(isWorkflowActive);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleOptions: Array<'Global' | 'Site A' | 'Site B'> = ['Global', 'Site A', 'Site B'];

  const handleRoleChange = (role: 'Global' | 'Site A' | 'Site B') => {
    setSelectedRole(role);
    setRoleDropdownOpen(false);
    if (role === 'Site A' || role === 'Site B') {
      router.push('/site-admin/dashboard');
    }
  };

  const isPreRegistered = pathname === '/workflows' || pathname === '/workflows/pre-registered';
  const isWalkIn = pathname === '/workflows/walk-in' || pathname.startsWith('/workflows/walk-in/');

  const renderNavItem = (item: NavItemDef) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    return (
      <Link key={item.id} href={item.href}>
        <div
          className={`
            relative flex items-center gap-3 mx-2 my-0.5 rounded-lg cursor-pointer
            transition-all duration-150
            ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'}
            ${isActive ? 'bg-primary-600/20 text-white' : 'hover:bg-white/[0.07] text-white/70 hover:text-white'}
          `}
          title={collapsed ? item.label : undefined}
        >
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary-400" />
          )}
          <span className={`shrink-0 ${isActive ? 'text-primary-400' : ''}`}>
            {item.icon}
          </span>
          {!collapsed && (
            <span className="text-[13px] font-medium truncate flex-1">{item.label}</span>
          )}
          {!collapsed && item.badge && (
            <span className="ml-auto bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
              {item.badge}
            </span>
          )}
          {collapsed && item.badge && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          )}
        </div>
      </Link>
    );
  };

  const renderWorkflowBuilder = () => (
    <div key="workflow-builder">
      {/* Workflow Builder Parent */}
      <div
        onClick={() => { if (!collapsed) setWorkflowExpanded(prev => !prev); }}
        className={`
          relative flex items-center gap-3 mx-2 my-0.5 rounded-lg cursor-pointer
          transition-all duration-150
          ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'}
          ${isWorkflowActive ? 'bg-primary-600/20 text-white' : 'hover:bg-white/[0.07] text-white/70 hover:text-white'}
        `}
        title={collapsed ? 'Workflow Builder' : undefined}
      >
        {isWorkflowActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary-400" />
        )}
        <span className={`shrink-0 ${isWorkflowActive ? 'text-primary-400' : ''}`}>
          <GitBranch size={18} />
        </span>
        {!collapsed && (
          <>
            <span className="text-[13px] font-medium truncate flex-1">Workflow Builder</span>
            <span className="shrink-0 ml-1">
              {workflowExpanded
                ? <ChevronUp size={13} className="text-white/50" />
                : <ChevronDown size={13} className="text-white/50" />
              }
            </span>
          </>
        )}
      </div>

      {/* Sub-menu items */}
      {!collapsed && workflowExpanded && (
        <div className="ml-2 mt-0.5 mb-1">
          {/* Pre-Registered */}
          <Link href="/workflows">
            <div
              className={`
                relative flex items-center gap-2.5 mx-2 my-0.5 pl-7 pr-3 py-1.5 rounded-lg cursor-pointer
                transition-all duration-150
                ${isPreRegistered ? 'bg-primary-600/20 text-white' : 'hover:bg-white/[0.07] text-white/60 hover:text-white'}
              `}
            >
              {isPreRegistered && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-blue-400" />
              )}
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPreRegistered ? 'bg-blue-400' : 'bg-white/30'}`} />
              <span className="text-[12px] font-medium truncate">Pre-Registered</span>
            </div>
          </Link>

          {/* Walk-In Visitors */}
          <Link href="/workflows/walk-in">
            <div
              className={`
                relative flex items-center gap-2.5 mx-2 my-0.5 pl-7 pr-3 py-1.5 rounded-lg cursor-pointer
                transition-all duration-150
                ${isWalkIn ? 'bg-orange-500/20 text-white' : 'hover:bg-white/[0.07] text-white/60 hover:text-white'}
              `}
            >
              {isWalkIn && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-orange-400" />
              )}
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isWalkIn ? 'bg-orange-400' : 'bg-white/30'}`} />
              <span className="text-[12px] font-medium truncate">Walk-In Visitors</span>
            </div>
          </Link>
        </div>
      )}

      {/* Collapsed: show tooltip indicator for workflow sub-items */}
      {collapsed && isWorkflowActive && (
        <div className="flex justify-center mt-0.5 mb-1">
          <div className="w-1 h-1 rounded-full bg-primary-400" />
        </div>
      )}
    </div>
  );

  return (
    <aside
      className="relative flex flex-col h-full transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? '64px' : '240px',
        background: 'linear-gradient(180deg, #405189 0%, #4a5fa0 50%, #3a4a7e 100%)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-14 border-b px-3 shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <AppLogo size={32} className="shrink-0" />
          {!collapsed && (
            <span className="font-bold text-white text-[15px] tracking-tight truncate fade-in">
              VMSPro
            </span>
          )}
        </div>
      </div>

      {/* Role Selector Dropdown */}
      {!collapsed && (
        <div className="px-3 py-2.5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(prev => !prev)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-white text-[12px] font-medium transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <span className="truncate">{selectedRole}</span>
              <ChevronDown
                size={13}
                className="shrink-0 text-white/60 transition-transform duration-150"
                style={{ transform: roleDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute left-0 right-0 top-full mt-1 rounded-lg overflow-hidden z-50"
                style={{
                  background: '#3a4a7e',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                {roleOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleRoleChange(option)}
                    className="w-full text-left px-3 py-2 text-[12px] font-medium transition-all duration-100"
                    style={{
                      color: selectedRole === option ? '#fff' : 'rgba(255,255,255,0.65)',
                      background: selectedRole === option ? 'rgba(255,255,255,0.12)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (selectedRole !== option) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
                    onMouseLeave={e => { if (selectedRole !== option) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={`group-${group.label}`} className="mb-1">
            {!collapsed && (
              <p
                className="px-4 pt-3 pb-1.5 text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {group.label}
              </p>
            )}
            {collapsed && (
              <div className="my-1 mx-2 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            )}

            {group.label === WORKFLOW_BUILDER_GROUP ? (
              <>
                {/* Visitor Types */}
                {renderNavItem(group.items[0])}
                {/* Workflow Builder (parent + sub-menu) */}
                {renderWorkflowBuilder()}
                {/* Induction Hub + Branding */}
                {group.items.slice(1).map(renderNavItem)}
              </>
            ) : (
              group.items.map(renderNavItem)
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        {/* Help Center */}
        <div
          className={`flex items-center gap-3 mx-2 my-1 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/[0.07] transition-all duration-150 ${collapsed ? 'justify-center px-0' : ''}`}
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          <HelpCircle size={16} className="shrink-0" />
          {!collapsed && <span className="text-[13px] font-medium">Help Center</span>}
        </div>

        {/* Dark mode toggle */}
        <div
          className={`flex items-center gap-3 mx-2 my-0.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/[0.07] transition-all duration-150 ${collapsed ? 'justify-center px-0' : ''}`}
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          <Moon size={16} className="shrink-0" />
          {!collapsed && <span className="text-[13px] font-medium">Dark Mode</span>}
        </div>

        {/* User profile */}
        <div
          className={`flex items-center gap-2.5 mx-2 mb-2 p-2 rounded-lg hover:bg-white/[0.07] cursor-pointer transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
            RP
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-semibold truncate">Reeja Pillai</p>
              <p className="text-white/45 text-[11px] truncate">Global Overview</p>
            </div>
          )}
          {!collapsed && <LogOut size={14} className="text-white/35 shrink-0" />}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center shadow-card hover:bg-primary-50 hover:border-primary-200 transition-all duration-150 z-10"
      >
        {collapsed
          ? <ChevronRight size={12} className="text-text-secondary" />
          : <ChevronLeft size={12} className="text-text-secondary" />
        }
      </button>
    </aside>
  );
}