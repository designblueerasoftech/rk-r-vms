'use client';

import React, { useState } from 'react';
import SiteAdminSidebar from './SiteAdminSidebar';
import SiteAdminTopbar from './SiteAdminTopbar';

interface SiteAdminLayoutProps {
  children: React.ReactNode;
}

export default function SiteAdminLayout({ children }: SiteAdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <SiteAdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <SiteAdminTopbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {children}
        </main>
        <footer className="shrink-0 h-8 flex items-center justify-between px-6 text-[11px] text-text-muted border-t border-border bg-white">
          <span>VMSPro v2.4.1 · AWS Mumbai (ap-south-1)</span>
          <span>Site Admin Access · Restricted View</span>
        </footer>
      </div>
    </div>
  );
}
