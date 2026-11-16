import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`bg-white border border-soft-grey rounded-xl shadow-modal w-full ${maxWidthStyles[maxWidth]} overflow-hidden animate-in zoom-in-95 duration-150`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-soft-grey">
          <div>
            <h3 className="text-lg font-bold font-display text-navy">{title}</h3>
            {description && <p className="text-xs text-slate mt-0.5">{description}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close dialog">
            <X className="w-5 h-5 text-slate" />
          </Button>
        </div>

        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-warm-light-grey/60 border-t border-soft-grey">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

