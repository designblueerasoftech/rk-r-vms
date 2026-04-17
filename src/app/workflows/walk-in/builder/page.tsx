'use client';

import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import WalkInWorkflowBuilder from '../../components/WalkInWorkflowBuilder';
import { useSearchParams } from 'next/navigation';

function WalkInBuilderContent() {
  const searchParams = useSearchParams();
  const visitorType = searchParams?.get('visitorType') ?? 'General Visitor';
  const workflowName = searchParams?.get('workflowName') ?? '';

  return (
    <AppLayout>
      <WalkInWorkflowBuilder
        initialVisitorType={visitorType}
        initialWorkflowName={workflowName}
      />
    </AppLayout>
  );
}

export default function WalkInBuilderPage() {
  return (
    <Suspense fallback={<AppLayout><div className="flex items-center justify-center h-full text-text-muted text-sm">Loading...</div></AppLayout>}>
      <WalkInBuilderContent />
    </Suspense>
  );
}
