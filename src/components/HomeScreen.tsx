import { Mic, Settings, Ticket } from 'lucide-react';
import { motion } from 'motion/react';
import { LanguageId, PastGameSummary, ThemeId } from '../types/housie';
import { I18N } from '../utils/i18n';
import { THEMES } from '../utils/themes';
import { PastGamesPanel } from './PastGamesPanel';
import { ThemeDecorations } from './ThemeDecorations';

interface HomeScreenProps {
  calledCountToday: number;
  ticketCountToday: number;
  pastGames: PastGameSummary[];
  theme: ThemeId;
  language: LanguageId;
  kidsMode: boolean;
  highContrast: boolean;
  onOpenSettings: () => void;
  onSelectHost: () => void;
  onSelectPlay: () => void;
}

export function HomeScreen({
  calledCountToday,
  ticketCountToday,
  pastGames,
  theme,
  language,
  kidsMode,
  highContrast,
  onOpenSettings,
  onSelectHost,
  onSelectPlay,
}: HomeScreenProps) {
  const palette = THEMES[theme];
  const t = I18N[language];

  return (
    <div
      className={`relative min-h-screen overflow-hidden flex flex-col justify-between transition-colors duration-200 ${palette.pageBg}`}
    >
      <ThemeDecorations theme={theme} variant="home" />

      {/* Top Settings Button */}
      <div className="relative z-20 mx-auto w-full max-w-4xl px-4 pt-3 sm:px-8 flex justify-end">
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t.settings}
          className={`min-h-[44px] px-4 py-2 rounded-2xl border-2 font-display font-bold text-sm sm:text-base flex items-center gap-2 shadow-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
            highContrast
              ? 'bg-white border-stone-950 text-stone-950 hover:bg-stone-100'
              : palette.homeBtn
          }`}
        >
          <Settings className="w-4.5 h-4.5 shrink-0" strokeWidth={2.4} />
          <span>{t.settings}</span>
        </button>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 py-4 sm:px-8 sm:py-6 flex flex-col items-center justify-center gap-8">
        {/* Cheerful Smiling Bingo Ball Mascot + Title */}
        <div className="text-center max-w-xl">
          <div
            className={`mx-auto mb-4 ${
              kidsMode ? 'w-26 h-26 sm:w-28 sm:h-28' : 'w-22 h-22 sm:w-24 sm:h-24'
            } flex items-center justify-center animate-mascot-bounce`}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-md"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="mascotBallGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="55%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#EA580C" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#mascotBallGrad)" stroke="#FFFFFF" strokeWidth="3" />
              <ellipse cx="34" cy="26" rx="14" ry="8" transform="rotate(-25 34 26)" fill="#FFFFFF" opacity="0.55" />
              <circle cx="50" cy="54" r="27" fill="#FFFDF7" opacity="0.96" />
              <circle cx="40" cy="49" r="3.5" fill="#292524" />
              <circle cx="60" cy="49" r="3.5" fill="#292524" />
              <circle cx="41.2" cy="47.8" r="1.1" fill="#FFFFFF" />
              <circle cx="61.2" cy="47.8" r="1.1" fill="#FFFFFF" />
              <ellipse cx="33" cy="56" rx="4.5" ry="2.8" fill="#FB7185" opacity="0.55" />
              <ellipse cx="67" cy="56" rx="4.5" ry="2.8" fill="#FB7185" opacity="0.55" />
              <path
                d="M41 58 Q50 67 59 58"
                fill="none"
                stroke="#292524"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1
            className={`font-display font-black tracking-tight text-stone-950 text-balance ${
              kidsMode ? 'text-4xl sm:text-6xl' : 'text-4xl sm:text-5xl'
            }`}
          >
            {t.appName}
          </h1>
          {!kidsMode && (
            <p
              data-hc-subtle="true"
              className="mt-2 text-lg sm:text-xl text-stone-700 font-medium"
            >
              {t.appSubtitle}
            </p>
          )}
        </div>

        {/* Two Large Floating Colorful Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Host Game */}
          <div className="animate-gentle-float">
            <motion.button
              type="button"
              onClick={onSelectHost}
              whileHover={{
                scale: kidsMode ? 1.04 : 1.02,
                rotate: kidsMode ? [0, -2.5, 2.5, -1.2, 0] : [0, -1.5, 1.5, -0.8, 0],
                transition: { duration: 0.4 },
              }}
              whileTap={{
                scale: kidsMode ? 0.92 : 0.95,
                rotate: kidsMode ? -2.5 : -1.5,
                transition: { type: 'spring', stiffness: kidsMode ? 520 : 450, damping: 16 },
              }}
              className={`relative overflow-hidden w-full group text-left rounded-3xl bg-gradient-to-br ${palette.hostCardGradient} text-white ${
                kidsMode ? 'p-8 sm:p-9 min-h-[225px] sm:min-h-[255px]' : 'p-7 sm:p-8 min-h-[205px] sm:min-h-[235px]'
              } ${highContrast ? 'border-2 border-stone-950' : ''} ${palette.hostCardShadow} transition-colors duration-150 flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-offset-4 ${palette.focusOutline}`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-card-shine"
              />

              <div
                className={`relative z-10 ${
                  kidsMode ? 'w-17 h-17' : 'w-15 h-15'
                } rounded-2xl bg-white/25 border border-white/30 flex items-center justify-center shadow-xs`}
              >
                <Mic className={kidsMode ? 'w-9 h-9 text-white' : 'w-8 h-8 text-white'} strokeWidth={2.3} />
              </div>

              <div className="relative z-10 mt-6">
                <span
                  className={`block font-display font-extrabold tracking-tight ${
                    kidsMode ? 'text-4xl' : 'text-3xl'
                  }`}
                >
                  {kidsMode ? t.hostGameKids : t.hostGame}
                </span>
                <span className={`mt-1.5 block text-base font-medium ${palette.hostCardSubtext}`}>
                  {calledCountToday > 0
                    ? t.calledTodayCount(calledCountToday)
                    : t.callNumbersSub}
                </span>
              </div>
            </motion.button>
          </div>

          {/* Play Game */}
          <div className="animate-gentle-float-delayed">
            <motion.button
              type="button"
              onClick={onSelectPlay}
              whileHover={{
                scale: kidsMode ? 1.04 : 1.02,
                rotate: kidsMode ? [0, 2.5, -2.5, 1.2, 0] : [0, 1.5, -1.5, 0.8, 0],
                transition: { duration: 0.4 },
              }}
              whileTap={{
                scale: kidsMode ? 0.92 : 0.95,
                rotate: kidsMode ? 2.5 : 1.5,
                transition: { type: 'spring', stiffness: kidsMode ? 520 : 450, damping: 16 },
              }}
              className={`relative overflow-hidden w-full group text-left rounded-3xl bg-gradient-to-br ${palette.playCardGradient} text-white ${
                kidsMode ? 'p-8 sm:p-9 min-h-[225px] sm:min-h-[255px]' : 'p-7 sm:p-8 min-h-[205px] sm:min-h-[235px]'
              } ${highContrast ? 'border-2 border-stone-950' : ''} ${palette.playCardShadow} transition-colors duration-150 flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-offset-4 ${palette.focusOutline}`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-card-shine-delayed"
              />

              <div
                className={`relative z-10 ${
                  kidsMode ? 'w-17 h-17' : 'w-15 h-15'
                } rounded-2xl bg-white/25 border border-white/30 flex items-center justify-center shadow-xs`}
              >
                <Ticket className={kidsMode ? 'w-9 h-9 text-white' : 'w-8 h-8 text-white'} strokeWidth={2.3} />
              </div>

              <div className="relative z-10 mt-6">
                <span
                  className={`block font-display font-extrabold tracking-tight ${
                    kidsMode ? 'text-4xl' : 'text-3xl'
                  }`}
                >
                  {kidsMode ? t.playGameKids : t.playGame}
                </span>
                <span className={`mt-1.5 block text-base font-medium ${palette.playCardSubtext}`}>
                  {ticketCountToday > 0
                    ? t.ticketsTodayCount(ticketCountToday)
                    : t.getTicketsSub}
                </span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Past Games Panel */}
        <PastGamesPanel
          pastGames={pastGames}
          theme={theme}
          language={language}
          highContrast={highContrast}
        />
      </main>

      <footer
        data-hc-subtle="true"
        className="relative z-10 pb-6 px-4 text-center text-sm text-stone-700 font-medium"
      >
        {t.savedOnDevice}
      </footer>
    </div>
  );
}
