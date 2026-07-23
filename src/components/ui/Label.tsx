'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'flex items-center gap-1.5 text-sm font-medium text-[#243D24]',
          'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
    )
  }
);
Label.displayName = 'Label';

export { Label };