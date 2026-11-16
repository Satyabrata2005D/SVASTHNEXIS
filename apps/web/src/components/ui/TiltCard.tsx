import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderColor?: string;
  tiltAmount?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(255, 91, 71, 0.15)',
  borderColor = 'rgba(23, 28, 44, 0.12)',
  tiltAmount = 14,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for buttery tilt physics
  const springConfig = { damping: 20, stiffness: 300 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltAmount, -tiltAmount]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltAmount, tiltAmount]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
    setMousePos({ x: mouseX, y: mouseY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative rounded-2xl transition-shadow duration-300 ${className}`}
    >
      {/* 3D Dynamic Spotlight Radial Aura following cursor */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 z-10 overflow-hidden"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 80%)`,
          }}
        />
      )}

      {/* Shimmer Border Light Streak */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-colors duration-300"
        style={{
          border: `1.5px solid ${isHovered ? borderColor : 'rgba(231, 229, 224, 0.8)'}`,
          boxShadow: isHovered
            ? `0 20px 40px -15px ${glowColor.replace('0.15', '0.25')}, 0 0 1px 1px ${borderColor}`
            : '0 4px 12px rgba(23, 28, 44, 0.04)',
        }}
      />

      {/* Card Content with 3D Z-Lift */}
      <div className="relative z-20 h-full flex flex-col justify-between" style={{ transform: 'translateZ(25px)' }}>
        {children}
      </div>
    </motion.div>
  );
};

