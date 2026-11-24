import { ArrowLeft } from 'lucide-react';
import { LanguageId, ThemeId } from '../types/housie';
import { I18N } from '../utils/i18n';
import { THEMES } from '../utils/themes';
import { ThemeDecorations } from './ThemeDecorations';
import { ThemeSwitcher } from './ThemeSwitcher';
import { TicketCountPicker } from './TicketCountPicker';

interface PlaySetupProps {
  theme: ThemeId;
  language: LanguageId;
  kidsMode: boolean;
  highContrast: boolean;
  onSelectTheme: (theme: ThemeId) => void;
  onGenerate: (count: number) => void;
  onBackHome: () => void;
}

export function PlaySetup({
  theme,
  language,
  kidsMode,
  highContrast,
  onSelectTheme,
  onGenerate,
  onBackHome,
}: PlaySetupProps) {
  const palette = THEMES[theme];
  const t = I18N[language];

  return (
    <div className={`relative min-h-screen flex flex-col transition-colors duration-200 ${palette.pageBg}`}>
      <ThemeDecorations theme={theme} variant="ambient" />

      <header className={`sticky top-0 z-30 backdrop-blur-md border-b ${palette.headerBg}`}>
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onBackHome}
              className={`min-h-[44px] min-w-[44px] px-3 rounded-2xl border font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${palette.homeBtn}`}
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              <span>{t.home}</span>
            </button>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-stone-950 truncate pl-1">
              {kidsMode ? t.playGameKids : t.playGame}
            </h1>
          </div>

          <ThemeSwitcher
            currentTheme={theme}
            language={language}
            onSelectTheme={onSelectTheme}
            variant="compact"
          />
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:py-12 flex flex-col justify-center">
        <TicketCountPicker
          theme={theme}
          language={language}
          kidsMode={kidsMode}
          highContrast={highContrast}
          onGenerate={onGenerate}
        />
      </main>
    </div>
  );
}
