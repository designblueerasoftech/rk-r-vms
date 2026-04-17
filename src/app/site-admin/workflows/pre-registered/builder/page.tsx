'use client';

import React, { Suspense } from 'react';
import SiteAdminLayout from '@/components/SiteAdminLayout';
import { useSearchParams } from 'next/navigation';
import WorkflowBuilder from '@/app/workflows/components/WorkflowBuilder';

function PreRegisteredBuilderContent() {
  const searchParams = useSearchParams();
  const visitorType = searchParams?.get('visitorType') ?? 'General Visitor';
  const workflowName = searchParams?.get('workflowName') ?? '';

  return (
    <SiteAdminLayout>
      <WorkflowBuilder
        initialVisitorType={visitorType}
        initialWorkflowName={workflowName}
        backHref="/site-admin/workflows/pre-registered"
      />
    </SiteAdminLayout>
  );
}

export default function SiteAPreRegisteredBuilderPage() {
  return (
    <Suspense fallback={<SiteAdminLayout><div className="flex items-center justify-center h-full text-text-muted text-sm">Loading...</div></SiteAdminLayout>}>
      <PreRegisteredBuilderContent />
    </Suspense>
  );
}
