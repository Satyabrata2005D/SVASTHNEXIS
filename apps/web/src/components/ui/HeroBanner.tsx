import React from 'react';

export interface HeroBannerProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'critical' | 'neutral';
  actions?: React.ReactNode;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  badgeText,
  badgeVariant = 'success',
  actions,
}) => {
  const badgeStyles = {
    success: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    critical: 'bg-coral-deep/10 text-coral-deep border-coral-deep/30',
    neutral: 'bg-slate/10 text-slate border-slate/30',
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-soft-grey bg-hero-gradient p-6 mb-6 shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {badgeText && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2.5 rounded-full text-xs font-semibold tracking-wide border bg-white/70 backdrop-blur-xs shadow-2xs">
              <span className={`w-1.5 h-1.5 rounded-full ${badgeVariant === 'success' ? 'bg-emerald-500' : 'bg-coral'}`} />
              <span className={badgeStyles[badgeVariant]}>{badgeText}</span>
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold font-display text-navy tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate mt-1 max-w-2xl font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

