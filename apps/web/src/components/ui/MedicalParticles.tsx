import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'plus' | 'circle' | 'ring';
  alpha: number;
  color: string;
}

export const MedicalParticles: React.FC<{
  density?: number;
  interactive?: boolean;
  className?: string;
}> = ({ density = 45, interactive = true, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(255, 91, 71, ',   // Coral
      'rgba(16, 185, 129, ',  // Emerald
      'rgba(23, 28, 44, ',    // Navy
      'rgba(251, 192, 36, ',  // Amber
      'rgba(14, 165, 233, ',  // Sky Blue
    ];

    const particles: Particle[] = [];
    const count = Math.min(density, Math.floor((width * height) / 18000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 4 + 2,
        type: Math.random() > 0.6 ? 'plus' : Math.random() > 0.3 ? 'ring' : 'circle',
        alpha: Math.random() * 0.4 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle glowing medical synapsing lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.18;
            ctx.strokeStyle = `rgba(255, 91, 71, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction attraction
        if (mouseRef.current.active) {
          const mdx = mouseRef.current.x - p.x;
          const mdy = mouseRef.current.y - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < 140 && mDist > 0) {
            const force = (1 - mDist / 140) * 0.8;
            p.x += (mdx / mDist) * force;
            p.y += (mdy / mDist) * force;

            // Draw line to mouse
            ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - mDist / 140) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        }

        // Bounce on boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Render shapes
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.strokeStyle = `${p.color}${p.alpha})`;

        if (p.type === 'plus') {
          // Medical '+' sign
          const half = p.size;
          const thick = Math.max(1.2, p.size * 0.35);
          ctx.fillRect(p.x - half, p.y - thick / 2, half * 2, thick);
          ctx.fillRect(p.x - thick / 2, p.y - half, thick, half * 2);
        } else if (p.type === 'ring') {
          // Cellular Ring
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Soft Node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

