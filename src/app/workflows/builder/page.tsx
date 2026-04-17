'use client';

import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import WorkflowBuilderPage from '../components/WorkflowBuilderPage';

export default function WorkflowBuilderRoute() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="flex items-center justify-center h-full text-text-muted text-sm">Loading builder...</div>}>
        <WorkflowBuilderPage />
      </Suspense>
    </AppLayout>
  );
}
