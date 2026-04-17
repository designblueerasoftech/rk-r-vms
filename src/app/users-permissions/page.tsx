import React from 'react';
import AppLayout from '@/components/AppLayout';
import UsersHeader from './components/UsersHeader';
import RoleSummaryCards from './components/RoleSummaryCards';
import UsersTable from './components/UsersTable';
import PermissionMatrix from './components/PermissionMatrix';

export default function UsersPermissionsPage() {
  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        <UsersHeader />
        <RoleSummaryCards />
        <UsersTable />
        <PermissionMatrix />
      </div>
    </AppLayout>
  );
}