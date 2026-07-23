'use client';

import { ReactNode, useEffect, useRef, forwardRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, size = 'md', className }, ref) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
      },
      [onClose]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      },
      [onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return createPortal(
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm animate-in fade-in-0"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div
          ref={contentRef}
          className={cn(
            'relative w-full mx-auto my-8 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-300',
            sizeClasses[size],
            className
          )}
        >
          {title && (
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              {title && (
                <h2 id="modal-title" className="font-cormorant text-xl font-semibold text-[#243D24]">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[#F5F0E1] text-[#243D24] flex items-center justify-center hover:bg-[#e8e0d0] transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="p-5">{children}</div>
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';