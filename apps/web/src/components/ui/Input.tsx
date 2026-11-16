import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3 text-slate pointer-events-none">{icon}</div>}
          <input
            id={inputId}
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-warm-light-grey border border-soft-grey text-navy rounded-md text-sm px-3.5 py-2.5 transition-all duration-150',
                'placeholder:text-slate/60 focus:bg-white focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20',
                icon && 'pl-9',
                error && 'border-coral-deep bg-red-50/20 focus:border-coral-deep focus:ring-coral-deep/20',
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-coral-deep mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

