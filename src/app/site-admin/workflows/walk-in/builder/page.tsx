'use client';

import React, { Suspense } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import WalkInWorkflowBuilder from '@/app/workflows/components/WalkInWorkflowBuilder';
import { useSearchParams } from 'next/navigation';

function WalkInBuilderContent() {
  const searchParams = useSearchParams();
  const visitorType = searchParams?.get('visitorType') ?? 'General Visitor';
  const workflowName = searchParams?.get('workflowName') ?? '';

  return (
    <SiteAdminLayout>
      <WalkInWorkflowBuilder
        initialVisitorType={visitorType}
        initialWorkflowName={workflowName}
        backHref="/site-admin/workflows/walk-in"
      />
    </SiteAdminLayout>
  );
}

export default function SiteAWalkInBuilderPage() {
  return (
    <Suspense fallback={<SiteAdminLayout><div className="flex items-center justify-center h-full text-text-muted text-sm">Loading...</div></SiteAdminLayout>}>
      <WalkInBuilderContent />
    </Suspense>
  );
}
