import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  durationMs = 1200,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(startValue + (endValue - startValue) * easedProgress));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, durationMs]);

  return (
    <span className={`tabular-nums font-mono font-bold ${className}`}>
      {prefix}
      {displayValue.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};

