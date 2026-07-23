'use client';

import { ReactNode } from 'react';

// Disabling client-side MSW in favor of real Next.js API routes (/api/*)
export function MSWProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}