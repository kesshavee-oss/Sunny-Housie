import { useEffect, useState } from 'react';
import { Calendar, ChevronRight, Trophy, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  LanguageId,
  PastGameSummary,
  PrizeItem,
  ThemeId,
} from '../types/housie';
import { I18N } from '../utils/i18n';
import { createDefaultPrizeList, sanitizePrizeList } from '../utils/storage';
import { THEMES } from '../utils/themes';
import { getPrizeDisplayName } from './PrizeBoard';

interface PastGamesPanelProps {
  pastGames: PastGameSummary[];
  theme: ThemeId;
  language: LanguageId;
  highContrast?: boolean;
}

function formatDisplayDate(dateStr: string, language: LanguageId): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const locale = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-US';
    return dt.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function PastGamesPanel({
  pastGames,
  theme,
  language,
  highContrast = false,
}: PastGamesPanelProps) {
  const [selectedGame, setSelectedGame] = useState<PastGameSummary | null>(null);
  const palette = THEMES[theme];
  const t = I18N[language];

  useEffect(() => {
    if (!selectedGame) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedGame(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGame]);

  const selectedPrizeItems: PrizeItem[] = selectedGame
    ? Array.isArray(selectedGame.prizes)
      ? sanitizePrizeList(selectedGame.prizes)
      : sanitizePrizeList(null, selectedGame.prizes)
    : [];

  return (
    <>
      <section
        aria-label={t.pastGames}
        data-hc-surface="true"
        className={`w-full rounded-3xl bg-white/95 border shadow-md p-5 sm:p-6 ${
          highContrast ? 'border-stone-950 border-2' : palette.cardBorder
        }`}
      >
        <div className="flex items-center gap-2.5 mb-3.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${palette.setupIconBg}`}
          >
            <Calendar className="w-5 h-5" strokeWidth={2.3} />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-stone-950">
            {t.pastGames}
          </h2>
        </div>

        {pastGames.length === 0 ? (
          <div
            data-hc-border="true"
            className={`rounded-2xl border px-4 py-5 text-center text-stone-500 font-semibold ${
              highContrast
                ? 'bg-white border-stone-950 text-stone-950'
                : `${palette.subtleCellBg} ${palette.subtleCellBorder}`
            }`}
          >
            —
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-0.5">
            {pastGames.map((game) => (
              <button
                key={game.date}
                type="button"
                onClick={() => setSelectedGame(game)}
                className={`min-h-[52px] px-4 py-2.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                  highContrast
                    ? 'bg-white border-2 border-stone-950 text-stone-950 hover:bg-stone-100'
                    : `${palette.subtleCellBg} ${palette.subtleCellBorder} hover:bg-white text-stone-900`
                }`}
              >
                <div className="min-w-0">
                  <div className="font-display font-extrabold text-base text-stone-950 truncate">
                    {formatDisplayDate(game.date, language)}
                  </div>
                  <div className="text-xs font-semibold text-stone-600 tabular-nums mt-0.5">
                    {game.calledNumbers.length} / 90 · {game.claims.length}
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-stone-500 shrink-0" strokeWidth={2.4} />
              </button>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedGame && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="past-game-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedGame(null)}
              className="fixed inset-0 bg-stone-950/45 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              data-hc-surface="true"
              className={`relative z-10 w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl bg-[#FFFDF8] p-5 sm:p-7 shadow-xl border-2 ${
                highContrast ? 'border-stone-950 bg-white' : palette.cardBorder
              }`}
            >
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <h3
                  id="past-game-modal-title"
                  className="font-display text-2xl font-extrabold text-stone-950"
                >
                  {formatDisplayDate(selectedGame.date, language)}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedGame(null)}
                  aria-label={t.close}
                  className={`min-h-[44px] min-w-[44px] px-3 rounded-2xl border flex items-center justify-center ${
                    highContrast
                      ? 'bg-white border-stone-950 text-stone-950 hover:bg-stone-100'
                      : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
                  } focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline}`}
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              {/* Numbers Called */}
              <div className="mt-5">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-display font-bold text-base text-stone-950">
                    {t.numbersCalledLabel}
                  </span>
                  <span className="text-sm font-bold text-stone-700 tabular-nums">
                    {selectedGame.calledNumbers.length} / 90
                  </span>
                </div>

                {selectedGame.calledNumbers.length === 0 ? (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3 text-center text-stone-500 font-semibold">
                    —
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2.5 rounded-2xl border border-stone-200 bg-white">
                    {selectedGame.calledNumbers.map((num, idx) => {
                      const ballStyle =
                        palette.ballPalette[idx % palette.ballPalette.length];
                      return (
                        <span
                          key={`${num}-${idx}`}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-xs tabular-nums ${ballStyle.bg} ${ballStyle.text}`}
                        >
                          {num}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Patterns Won & Prizes */}
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <Trophy className="w-4.5 h-4.5 text-stone-700 shrink-0" strokeWidth={2.3} />
                  <span className="font-display font-bold text-base text-stone-950">
                    {t.patternsWonLabel}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {(selectedPrizeItems.length > 0
                    ? selectedPrizeItems
                    : createDefaultPrizeList()
                  ).map((prize) => {
                    const claim = selectedGame.claims.find(
                      (c) => (c.prizeId ?? c.patternId) === prize.id
                    );
                    const isWon = prize.status === 'won' || Boolean(claim);
                    const winnerName = prize.wonByTicketName ?? claim?.ticketName;
                    const prizeTitle = getPrizeDisplayName(prize, language);
                    const prizeText = prize.reward.trim();

                    return (
                      <div
                        key={prize.id}
                        className={`rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2 ${
                          isWon
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-display font-bold text-sm sm:text-base text-stone-950">
                            {prizeTitle}
                          </div>
                          {prizeText && (
                            <div className="text-xs font-medium text-stone-600 truncate">
                              {prizeText}
                            </div>
                          )}
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
                            isWon
                              ? 'bg-emerald-700 text-white'
                              : 'bg-white text-stone-600 border border-stone-200'
                          }`}
                        >
                          {isWon && winnerName
                            ? `${t.wonStatus} · ${winnerName}`
                            : isWon
                            ? t.wonStatus
                            : t.openStatus}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedGame(null)}
                  className={`min-h-[44px] w-full sm:w-auto px-6 py-2.5 rounded-2xl font-display font-extrabold text-base text-white ${palette.callNextBtn}`}
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
