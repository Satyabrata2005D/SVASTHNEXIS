import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary:
      'bg-coral text-white hover:bg-coral-deep shadow-sm focus:ring-coral active:scale-[0.98]',
    secondary:
      'bg-white text-navy border border-soft-grey hover:bg-warm-light-grey focus:ring-soft-grey active:scale-[0.98]',
    destructive:
      'bg-coral-deep text-white hover:bg-[#a83225] shadow-sm focus:ring-coral-deep active:scale-[0.98]',
    ghost:
      'bg-transparent text-slate hover:bg-warm-light-grey hover:text-navy focus:ring-soft-grey',
    outline:
      'bg-transparent border border-soft-grey text-navy hover:bg-white focus:ring-coral',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-sm gap-1.5',
    md: 'text-sm px-3.5 py-2 rounded-md gap-2',
    lg: 'text-base px-5 py-2.5 rounded-md gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

