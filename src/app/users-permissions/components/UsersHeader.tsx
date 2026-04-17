'use client';

import React, { useState } from 'react';
import { UserCog, UserPlus, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import InviteUserModal from './InviteUserModal';

export default function UsersHeader() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <UserCog size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary leading-tight">Users & Permissions</h1>
            <p className="text-[12px] text-text-muted">Manage admin accounts, roles, and site-level access control</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast?.info('Exporting user report...')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all duration-150"
          >
            <Download size={13} /> Export
          </button>
          <button
            onClick={() => toast?.info('Refreshing user list...')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all duration-150"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-white blue-gradient rounded-lg hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
          >
            <UserPlus size={15} /> Invite User
          </button>
        </div>
      </div>
      {showModal && <InviteUserModal onClose={() => setShowModal(false)} />}
    </>
  );
}