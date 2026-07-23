'use client';

import { MotionConfig } from 'framer-motion';
import { ReactNode } from 'react';

export function FramerProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      {children}
    </MotionConfig>
  );
}