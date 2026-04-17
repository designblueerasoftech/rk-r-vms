'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {children}
        </main>
        {/* Footer */}
        <footer
          className="shrink-0 h-8 flex items-center justify-between px-6 text-[11px] text-text-muted border-t border-border bg-white"
        >
          <span>VMSPro v2.4.1 · AWS Mumbai (ap-south-1)</span>
          <span>Enterprise Plan · 5 sites · 15 kiosks · Last full sync: 10 Apr 2026, 08:15 AM</span>
        </footer>
      </div>
    </div>
  );
}