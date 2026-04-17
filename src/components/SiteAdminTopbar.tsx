'use client';

import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Eye, X, HelpCircle } from 'lucide-react';
import { useRole } from '@/context/RoleContext';

export default function SiteAdminTopbar() {
  const { siteName } = useRole();
  const [searchVal, setSearchVal] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className="shrink-0">
      {/* Scoped Access Banner */}
      {!bannerDismissed && (
        <div className="flex items-center justify-between gap-3 px-6 py-2 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span className="text-[12px] font-semibold text-blue-700">
              Viewing {siteName} – Site Admin Access
            </span>
            <div className="relative">
              <button
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
                className="text-blue-400 hover:text-blue-600 transition-colors"
              >
                <HelpCircle size={13} />
              </button>
              {tooltipVisible && (
                <div className="absolute left-5 top-0 z-50 w-64 p-3 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl leading-relaxed">
                  You are viewing a site-scoped view. All data, reports, and settings are restricted to <strong>{siteName}</strong> only. Global features are not accessible in this role.
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setBannerDismissed(true)} className="text-blue-400 hover:text-blue-600 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
      {/* Main Topbar */}
      <header
        className="h-14 flex items-center gap-4 px-6 bg-white"
        style={{ boxShadow: '0 1px 0 #E2E8F0, 0 2px 8px rgba(0,0,0,0.04)' }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={`Search in ${siteName}...`}
            value={searchVal}
            onChange={(e) => setSearchVal(e?.target?.value)}
            className="w-full pl-9 pr-4 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 placeholder:text-text-muted transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Site badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[11px] font-semibold text-blue-700 max-w-[120px] truncate">{siteName}</span>
          </div>

          {/* Preview Visitor Experience */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface hover:border-border/80 transition-all duration-150">
            <Eye size={13} />
            Preview Visitor Experience
          </button>

          {/* Bell */}
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface border border-transparent hover:border-border transition-all duration-150">
            <Bell size={16} className="text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-white" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-border ml-1 cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-[11px] font-bold">SA</div>
            <div className="hidden sm:block">
              <p className="text-[12px] font-semibold text-text-primary leading-tight">Reeja Pillai</p>
              <p className="text-[10px] text-text-muted leading-tight truncate max-w-[100px]">{siteName}</p>
            </div>
            <ChevronDown size={12} className="text-text-muted group-hover:text-text-secondary transition-colors" />
          </div>
        </div>
      </header>
    </div>
  );
}
