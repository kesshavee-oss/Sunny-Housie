import { useEffect, useRef } from 'react';

export interface ConfettiTrigger {
  id: number;
  type: 'row' | 'fullHouse';
}

interface ConfettiBurstProps {
  trigger: ConfettiTrigger | null;
  colors: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle';
  alpha: number;
  decay: number;
}

export function ConfettiBurst({ trigger, colors }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger || trigger.id === 0) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    updateSize();

    const palette = [...colors, '#FBBF24', '#FFFFFF'];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isFullHouse = trigger.type === 'fullHouse';
    const count = isFullHouse ? 130 : 65;

    const spawnBurst = (originX: number, originY: number, spreadAngle: number, burstCount: number) => {
      for (let i = 0; i < burstCount; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * spreadAngle;
        const speed = (isFullHouse ? 8 : 6.5) + Math.random() * (isFullHouse ? 11 : 8);
        particlesRef.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isFullHouse ? 2.5 : 1),
          size: 6 + Math.random() * 6,
          color: palette[Math.floor(Math.random() * palette.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.22,
          shape: Math.random() > 0.35 ? 'rect' : 'circle',
          alpha: 1,
          decay: isFullHouse ? 0.0085 + Math.random() * 0.005 : 0.011 + Math.random() * 0.006,
        });
      }
    };

    if (isFullHouse) {
      spawnBurst(width * 0.25, height * 0.72, 1.3, Math.floor(count * 0.4));
      spawnBurst(width * 0.75, height * 0.72, 1.3, Math.floor(count * 0.4));
      spawnBurst(width * 0.5, height * 0.55, 1.8, Math.floor(count * 0.2));
    } else {
      spawnBurst(width * 0.5, height * 0.68, 1.5, count);
    }

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const remaining: Particle[] = [];
      for (const p of particlesRef.current) {
        p.vx *= 0.985;
        p.vy += 0.26;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0.02 && p.y < window.innerHeight + 40) {
          remaining.push(p);
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size * 0.32, p.size, p.size * 0.64);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      particlesRef.current = remaining;
      if (remaining.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        rafRef.current = null;
      }
    };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [trigger, colors]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
}
