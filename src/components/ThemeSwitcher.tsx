import { useEffect, useRef, useState } from 'react';
import { Check, Palette } from 'lucide-react';
import { LanguageId, ThemeId } from '../types/housie';
import { I18N } from '../utils/i18n';
import { THEME_LIST, THEMES } from '../utils/themes';

interface ThemeSwitcherProps {
  currentTheme: ThemeId;
  language: LanguageId;
  onSelectTheme: (theme: ThemeId) => void;
  variant?: 'full' | 'compact';
}

export function ThemeSwitcher({
  currentTheme,
  language,
  onSelectTheme,
  variant = 'full',
}: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const palette = THEMES[currentTheme];
  const t = I18N[language];

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (variant === 'full') {
    return (
      <div
        role="radiogroup"
        aria-label={t.themeLabel}
        className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/85 border border-stone-200/80 shadow-2xs"
      >
        {THEME_LIST.map((theme) => {
          const isActive = theme.id === currentTheme;
          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelectTheme(theme.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100/80'
              }`}
            >
              <span className="flex items-center -space-x-1 shrink-0" aria-hidden="true">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/80"
                  style={{ backgroundColor: theme.swatchColors[0] }}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/80"
                  style={{ backgroundColor: theme.swatchColors[1] }}
                />
              </span>
              <span>{t.themes[theme.id]}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${t.themeLabel}: ${t.themes[currentTheme]}`}
        className={`min-h-[44px] min-w-[44px] px-3 rounded-2xl border font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${palette.homeBtn}`}
      >
        <Palette className="w-4 h-4 shrink-0" strokeWidth={2.3} />
        <span className="hidden sm:inline">{t.themes[currentTheme]}</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t.themeLabel}
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-stone-200 shadow-lg p-1.5 z-50"
        >
          {THEME_LIST.map((theme) => {
            const isActive = theme.id === currentTheme;
            return (
              <button
                key={theme.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onSelectTheme(theme.id);
                  setOpen(false);
                }}
                className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-between gap-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-stone-100 text-stone-900'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex items-center -space-x-1 shrink-0" aria-hidden="true">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white"
                      style={{ backgroundColor: theme.swatchColors[0] }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white"
                      style={{ backgroundColor: theme.swatchColors[1] }}
                    />
                  </span>
                  <span>{t.themes[theme.id]}</span>
                </span>
                {isActive && <Check className="w-4 h-4 text-stone-800 shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
