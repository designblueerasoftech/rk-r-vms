'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SiteAdminWorkflowsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router?.replace('/site-admin/workflows/pre-registered');
  }, [router]);
  return null;
}
