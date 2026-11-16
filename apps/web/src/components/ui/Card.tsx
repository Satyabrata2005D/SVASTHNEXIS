import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white border border-soft-grey rounded-lg shadow-card p-5 transition-all duration-150',
          hoverable && 'hover:shadow-popover hover:border-slate/30',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={twMerge(clsx('flex items-center justify-between pb-3 mb-3 border-b border-soft-grey/60', className))} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3 className={twMerge(clsx('text-base font-semibold font-display text-navy', className))} {...props}>
      {children}
    </h3>
  );
};

