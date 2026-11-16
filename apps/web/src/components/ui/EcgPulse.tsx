import React from 'react';

interface EcgPulseProps {
  color?: string;
  className?: string;
  width?: number;
  height?: number;
}

export const EcgPulse: React.FC<EcgPulseProps> = ({
  color = '#FF5B47',
  className = '',
  width = 160,
  height = 36,
}) => {
  return (
    <div className={`relative inline-flex items-center overflow-hidden ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 160 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Background baseline */}
        <path
          d="M0 18 H40 L45 8 L50 26 L55 2 L62 34 L68 18 H90 L95 10 L100 24 L106 18 H160"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated scanning pulse */}
        <path
          d="M0 18 H40 L45 8 L50 26 L55 2 L62 34 L68 18 H90 L95 10 L100 24 L106 18 H160"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-line"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
    </div>
  );
};

