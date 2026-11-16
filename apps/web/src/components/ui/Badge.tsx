import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'critical' | 'neutral' | 'info';
  hasDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  hasDot = false,
  ...props
}) => {
  const variantStyles = {
    success: 'bg-emerald-soft text-emerald-600 border-emerald-500/20',
    warning: 'bg-amber-soft text-amber-600 border-amber-500/30',
    critical: 'bg-coral-soft text-coral-deep border-coral-500/20',
    neutral: 'bg-warm-light-grey text-slate border-soft-grey',
    info: 'bg-[#F1F4F9] text-navy border-[#E2E7F0]',
  };

  const dotStyles = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-coral-deep',
    neutral: 'bg-slate',
    info: 'bg-navy',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border select-none',
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {hasDot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotStyles[variant])} />}
      {children}
    </span>
  );
};

