import { ThemeId } from '../types/housie';
import { THEMES } from '../utils/themes';

interface ThemeDecorationsProps {
  theme: ThemeId;
  variant?: 'home' | 'ambient';
}

const FLOATING_DOTS = [
  { top: '14%', left: '8%', size: 12, delay: '0s' },
  { top: '20%', left: '88%', size: 14, delay: '0.6s' },
  { top: '42%', left: '5%', size: 10, delay: '1.1s' },
  { top: '38%', left: '93%', size: 12, delay: '0.3s' },
  { top: '76%', left: '10%', size: 14, delay: '0.9s' },
  { top: '72%', left: '90%', size: 11, delay: '1.4s' },
];

const DIYA_POSITIONS = [
  { top: '16%', left: '7%', delay: '0s' },
  { top: '24%', left: '89%', delay: '0.7s' },
  { top: '55%', left: '4%', delay: '1.2s' },
  { top: '60%', left: '92%', delay: '0.4s' },
  { top: '82%', left: '11%', delay: '1.6s' },
  { top: '80%', left: '86%', delay: '0.9s' },
];

const SNOWFLAKES = [
  { left: '6%', size: 8, duration: '9s', delay: '0s' },
  { left: '14%', size: 6, duration: '11s', delay: '2s' },
  { left: '23%', size: 10, duration: '8.5s', delay: '1s' },
  { left: '34%', size: 7, duration: '10.5s', delay: '3.2s' },
  { left: '46%', size: 9, duration: '9.5s', delay: '0.5s' },
  { left: '58%', size: 6, duration: '11.5s', delay: '4s' },
  { left: '68%', size: 10, duration: '8.8s', delay: '1.8s' },
  { left: '78%', size: 7, duration: '10s', delay: '2.7s' },
  { left: '87%', size: 9, duration: '9.2s', delay: '0.9s' },
  { left: '94%', size: 6, duration: '10.8s', delay: '3.6s' },
];

const KOLAM_POSITIONS = [
  { top: '14%', left: '5%', size: 76, color: '#CA8A04' },
  { top: '22%', left: '87%', size: 68, color: '#15803D' },
  { top: '70%', left: '6%', size: 72, color: '#15803D' },
  { top: '74%', left: '88%', size: 80, color: '#CA8A04' },
];

function DiyaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="14" r="10" fill="#FDE047" opacity="0.35" />
      <path
        d="M24 6 C28 12, 28 18, 24 21 C20 18, 20 12, 24 6 Z"
        fill="#F97316"
      />
      <path
        d="M24 10 C26 14, 26 17.5, 24 19.5 C22 17.5, 22 14, 24 10 Z"
        fill="#FEF08A"
      />
      <path
        d="M8 25 Q24 31 40 25 Q37 37 24 38 Q11 37 8 25 Z"
        fill="#B45309"
      />
      <ellipse cx="24" cy="25" rx="16" ry="3.2" fill="#F59E0B" />
    </svg>
  );
}

function KolamPattern({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="2" opacity="0.4">
        <path d="M40 10 C55 10, 70 25, 70 40 C70 55, 55 70, 40 70 C25 70, 10 55, 10 40 C10 25, 25 10, 40 10 Z" />
        <path d="M40 16 L64 40 L40 64 L16 40 Z" />
      </g>
      {[
        [40, 22],
        [40, 40],
        [40, 58],
        [22, 40],
        [58, 40],
        [28, 28],
        [52, 28],
        [28, 52],
        [52, 52],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.6" fill={color} opacity="0.55" />
      ))}
    </svg>
  );
}

export function ThemeDecorations({ theme, variant = 'ambient' }: ThemeDecorationsProps) {
  const palette = THEMES[theme];
  const isHome = variant === 'home';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Top Festive Bunting (Home screen) */}
      {isHome && (
        <div className="w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 54"
            preserveAspectRatio="none"
            className="w-full h-11 sm:h-14 drop-shadow-xs"
          >
            <path
              d="M0,4 Q600,18 1200,4"
              fill="none"
              stroke="#D6CFC7"
              strokeWidth="2.5"
            />
            {Array.from({ length: 20 }).map((_, idx) => {
              const x1 = idx * 60 + 6;
              const x2 = x1 + 48;
              const xMid = (x1 + x2) / 2;
              const color = palette.buntingColors[idx % palette.buntingColors.length];
              const sag = Math.sin(((idx + 0.5) / 20) * Math.PI) * 7;
              const yTop = 5 + sag;
              return (
                <polygon
                  key={idx}
                  points={`${x1},${yTop} ${x2},${yTop} ${xMid},${yTop + 34}`}
                  fill={color}
                  opacity="0.92"
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Classic & Summer Fun Floating Confetti Dots */}
      {(theme === 'classic' || theme === 'summer') &&
        FLOATING_DOTS.map((dot, idx) => (
          <span
            key={idx}
            className={`animate-gentle-float ${
              isHome ? 'hidden sm:block' : 'hidden xl:block'
            } absolute rounded-full ${theme === 'summer' ? 'opacity-40' : 'opacity-35'}`}
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              backgroundColor: palette.confettiColors[idx % palette.confettiColors.length],
              animationDelay: dot.delay,
            }}
          />
        ))}

      {/* Summer Sun Glow */}
      {theme === 'summer' && isHome && (
        <div
          className="hidden sm:block absolute top-14 right-10 w-20 h-20 rounded-full bg-yellow-300/45 blur-md animate-gentle-float"
        />
      )}

      {/* Diwali Floating Diyas & Golden Glow */}
      {theme === 'diwali' &&
        DIYA_POSITIONS.map((diya, idx) => (
          <div
            key={idx}
            className={`animate-diya-glow ${
              isHome ? 'block' : 'hidden xl:block'
            } absolute`}
            style={{
              top: diya.top,
              left: diya.left,
              animationDelay: diya.delay,
            }}
          >
            <DiyaIcon className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.75)]" />
          </div>
        ))}

      {/* Christmas Gentle Snowfall */}
      {theme === 'christmas' &&
        SNOWFLAKES.map((flake, idx) => (
          <span
            key={idx}
            className="animate-snowfall absolute -top-4 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] border border-sky-100/70"
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
              animationDuration: flake.duration,
              animationDelay: flake.delay,
            }}
          />
        ))}

      {/* Pongal Kolam-Style Dot Patterns */}
      {theme === 'pongal' &&
        KOLAM_POSITIONS.map((kolam, idx) => (
          <div
            key={idx}
            className={`animate-gentle-float ${
              isHome ? 'hidden sm:block' : 'hidden xl:block'
            } absolute`}
            style={{
              top: kolam.top,
              left: kolam.left,
              animationDelay: `${idx * 0.6}s`,
            }}
          >
            <KolamPattern size={kolam.size} color={kolam.color} />
          </div>
        ))}
    </div>
  );
}
