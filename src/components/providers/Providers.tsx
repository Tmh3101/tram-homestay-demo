'use client';

import { ReactNode } from 'react';
import { FramerProvider } from '@/components/providers/FramerProvider';
import { MSWProvider } from '@/components/providers/MSWProvider';
import { ToastProvider } from '@/components/ui/Toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FramerProvider>
      <MSWProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </MSWProvider>
    </FramerProvider>
  );
}