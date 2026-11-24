import { useState } from 'react';
import { ArrowLeft, Lock, Printer, RotateCcw } from 'lucide-react';
import { HousieTicket, LanguageId, PatternClaim, PrizeItem, ThemeId } from '../types/housie';
import { I18N } from '../utils/i18n';
import { THEMES } from '../utils/themes';
import { AudioToggleBar } from './AudioToggleBar';
import { ConfirmModal } from './ConfirmModal';
import { LockBanner } from './LockBanner';
import { getPrizeDisplayName, PrizeBoard } from './PrizeBoard';
import { ThemeDecorations } from './ThemeDecorations';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ClaimFeedback, CompletedRowFlash, TicketCard } from './TicketCard';

export type { CompletedRowFlash };

interface PlayTicketsViewProps {
  tickets: HousieTicket[];
  claims: PatternClaim[];
  prizes: PrizeItem[];
  isLocked: boolean;
  soundEnabled: boolean;
  theme: ThemeId;
  language: LanguageId;
  kidsMode: boolean;
  highContrast: boolean;
  completedRowFlash: CompletedRowFlash | null;
  claimFeedbackByTicket: Record<number, ClaimFeedback | null>;
  onSelectTheme: (theme: ThemeId) => void;
  onToggleMark: (ticketNumber: number, num: number) => void;
  onRenameTicket: (ticketNumber: number, customName?: string) => void;
  onClaimTicket: (ticketNumber: number) => void;
  onPrintTickets: () => void;
  onResetTickets: () => void;
  onBackHome: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onToggleSound: () => void;
}

export function PlayTicketsView({
  tickets,
  claims,
  prizes,
  isLocked,
  soundEnabled,
  theme,
  language,
  kidsMode,
  highContrast,
  completedRowFlash,
  claimFeedbackByTicket,
  onSelectTheme,
  onToggleMark,
  onRenameTicket,
  onClaimTicket,
  onPrintTickets,
  onResetTickets,
  onBackHome,
  onLock,
  onUnlock,
  onToggleSound,
}: PlayTicketsViewProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const palette = THEMES[theme];
  const t = I18N[language];

  return (
    <div className={`relative min-h-screen flex flex-col transition-colors duration-200 ${palette.pageBg}`}>
      <ThemeDecorations theme={theme} variant="ambient" />

      {isLocked ? (
        <LockBanner language={language} onUnlock={onUnlock} />
      ) : (
        <header className={`sticky top-0 z-30 backdrop-blur-md border-b ${palette.headerBg}`}>
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={onBackHome}
                className={`min-h-[44px] min-w-[44px] px-3 rounded-2xl border font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${palette.homeBtn}`}
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                <span>{t.home}</span>
              </button>
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-stone-950 truncate pl-1">
                {kidsMode ? t.playGameKids : t.playGame}
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ThemeSwitcher
                currentTheme={theme}
                language={language}
                onSelectTheme={onSelectTheme}
                variant="compact"
              />

              <button
                type="button"
                onClick={onLock}
                className={`min-h-[44px] px-3 sm:px-4 rounded-2xl border font-semibold text-sm flex items-center gap-1.5 sm:gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${palette.lockBtn}`}
              >
                <Lock className="w-4 h-4" strokeWidth={2.4} />
                <span className="hidden sm:inline">{t.lockScreen}</span>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <button
            type="button"
            onClick={onPrintTickets}
            className={`min-h-[44px] px-4 py-2 rounded-2xl border-2 font-display font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
              highContrast
                ? 'bg-white border-stone-950 text-stone-950 hover:bg-stone-100'
                : palette.homeBtn
            }`}
          >
            <Printer className="w-4 h-4 shrink-0" strokeWidth={2.4} />
            <span>{t.printTickets}</span>
          </button>

          <div className="ml-auto [&>div]:mb-0">
            <AudioToggleBar
              theme={theme}
              language={language}
              highContrast={highContrast}
              soundEnabled={soundEnabled}
              onToggleSound={onToggleSound}
            />
          </div>
        </div>

        <div
          className={`grid gap-6 ${
            tickets.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 lg:grid-cols-2'
          }`}
        >
          {tickets.map((ticket, index) => {
            const ticketClaims = claims.filter(
              (c) =>
                c.source === 'play' &&
                c.ticketNumber === ticket.ticketNumber
            );
            const wonBadges = ticketClaims.map((c) => {
              const prizeId = c.prizeId ?? c.patternId;
              const matchedPrize = prizes.find((p) => p.id === prizeId);
              const label = matchedPrize
                ? getPrizeDisplayName(matchedPrize, language)
                : c.prizeName ?? t.patterns[c.patternId];
              return {
                id: prizeId,
                label,
                isFullHouse:
                  prizeId === 'fullHouse' || c.patternId === 'fullHouse',
              };
            });

            return (
              <TicketCard
                key={ticket.ticketNumber}
                ticket={ticket}
                index={index}
                theme={theme}
                language={language}
                kidsMode={kidsMode}
                highContrast={highContrast}
                completedRowFlash={completedRowFlash}
                wonPatterns={ticketClaims.map((c) => c.patternId)}
                wonBadges={wonBadges}
                claimFeedback={claimFeedbackByTicket[ticket.ticketNumber] ?? null}
                onToggleMark={onToggleMark}
                onRenameTicket={onRenameTicket}
                onClaimTicket={onClaimTicket}
              />
            );
          })}
        </div>

        {/* Read-Only Prize Board */}
        <div className="mt-8 max-w-3xl mx-auto">
          <PrizeBoard
            prizes={prizes}
            claims={claims}
            theme={theme}
            language={language}
            highContrast={highContrast}
            editable={false}
          />
        </div>

        {!isLocked && (
          <div className="mt-8 pb-4 flex justify-center">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="min-h-[48px] px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-900 font-semibold text-base flex items-center gap-2 transition-colors whitespace-nowrap shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.resetTodaysTickets}</span>
            </button>
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={showResetConfirm}
        title={t.resetTodaysTicketsTitle}
        message={t.resetTodaysTicketsMessage}
        confirmLabel={t.yesResetTickets}
        cancelLabel={t.keepTickets}
        onConfirm={() => {
          setShowResetConfirm(false);
          onResetTickets();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
