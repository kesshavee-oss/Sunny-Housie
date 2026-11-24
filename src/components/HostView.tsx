import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Grid3X3,
  History,
  Lock,
  Printer,
  RotateCcw,
  Sparkles,
  Ticket,
  Trophy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CallHistoryEntry,
  HousieTicket,
  LanguageId,
  PatternClaim,
  PatternId,
  PrizeItem,
  ThemeId,
} from '../types/housie';
import { I18N } from '../utils/i18n';
import { THEMES } from '../utils/themes';
import { AudioToggleBar } from './AudioToggleBar';
import { ConfirmModal } from './ConfirmModal';
import { LockBanner } from './LockBanner';
import { NumberHistoryPanel } from './NumberHistoryPanel';
import { getPrizeDisplayName, PrizeBoard } from './PrizeBoard';
import { ThemeDecorations } from './ThemeDecorations';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ClaimFeedback, CompletedRowFlash, TicketCard } from './TicketCard';
import { TicketCountPicker } from './TicketCountPicker';

interface HostViewProps {
  calledNumbers: number[];
  hostTickets: HousieTicket[] | null;
  claims: PatternClaim[];
  prizes: PrizeItem[];
  history: CallHistoryEntry[];
  completedRowFlash: CompletedRowFlash | null;
  claimFeedbackByTicket: Record<number, ClaimFeedback | null>;
  isLocked: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  musicEnabled: boolean;
  theme: ThemeId;
  language: LanguageId;
  kidsMode: boolean;
  highContrast: boolean;
  onSelectTheme: (theme: ThemeId) => void;
  onCallNext: () => void;
  onStartOver: () => void;
  onEndTodaysGame: () => void;
  onPrintTickets: () => void;
  onGenerateHostTickets: (count: number) => void;
  onToggleHostMark: (ticketNumber: number, num: number) => void;
  onRenameHostTicket: (ticketNumber: number, customName?: string) => void;
  onClaimHostTicket: (ticketNumber: number) => void;
  onResetHostTickets: () => void;
  onChangePrizeReward: (prizeId: string, reward: string) => void;
  onRenamePrize: (prizeId: string, customName: string) => void;
  onChangePrizeRule: (prizeId: string, rule: PatternId) => void;
  onAddPrize: () => PrizeItem | null;
  onRemovePrize: (prizeId: string) => void;
  onClearHistory: () => void;
  onBackHome: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onToggleSound: () => void;
  onToggleVoice: () => void;
  onToggleMusic: () => void;
}

type HostRightTab = 'board' | 'tickets' | 'prizes' | 'history';

const ALL_NUMBERS = Array.from({ length: 90 }, (_, i) => i + 1);
const PROGRESS_DOTS = Array.from({ length: 90 }, (_, i) => i);

export function HostView({
  calledNumbers,
  hostTickets,
  claims,
  prizes,
  history,
  completedRowFlash,
  claimFeedbackByTicket,
  isLocked,
  soundEnabled,
  voiceEnabled,
  musicEnabled,
  theme,
  language,
  kidsMode,
  highContrast,
  onSelectTheme,
  onCallNext,
  onStartOver,
  onEndTodaysGame,
  onPrintTickets,
  onGenerateHostTickets,
  onToggleHostMark,
  onRenameHostTicket,
  onClaimHostTicket,
  onResetHostTickets,
  onChangePrizeReward,
  onRenamePrize,
  onChangePrizeRule,
  onAddPrize,
  onRemovePrize,
  onClearHistory,
  onBackHome,
  onLock,
  onUnlock,
  onToggleSound,
  onToggleVoice,
  onToggleMusic,
}: HostViewProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);
  const [showResetHostTicketsConfirm, setShowResetHostTicketsConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<HostRightTab>('board');
  const palette = THEMES[theme];
  const t = I18N[language];

  const calledSet = useMemo(() => new Set(calledNumbers), [calledNumbers]);
  const latestNumber =
    calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : null;

  const previousFive = useMemo(() => {
    if (calledNumbers.length <= 1) return [];
    const startIdx = Math.max(0, calledNumbers.length - 6);
    return calledNumbers.slice(startIdx, -1).map((num, offset) => ({
      num,
      callIndex: startIdx + offset,
    }));
  }, [calledNumbers]);

  const calledCount = calledNumbers.length;
  const remainingCount = 90 - calledCount;
  const allCalled = remainingCount === 0;

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
                {kidsMode ? t.hostGameKids : t.hostGame}
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
                className={`min-h-[44px] px-3.5 sm:px-4 rounded-2xl border font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${palette.lockBtn}`}
              >
                <Lock className="w-4 h-4" strokeWidth={2.4} />
                <span className="hidden sm:inline">{t.lockScreen}</span>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <AudioToggleBar
          theme={theme}
          language={language}
          highContrast={highContrast}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
          showVoice
          voiceEnabled={voiceEnabled}
          onToggleVoice={onToggleVoice}
          showMusic
          musicEnabled={musicEnabled}
          onToggleMusic={onToggleMusic}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Caller Panel (Focal Anchor) */}
          <section
            className={`lg:col-span-5 rounded-3xl bg-white/95 border shadow-md p-6 sm:p-7 flex flex-col items-center text-center ${
              highContrast ? 'border-stone-950 border-2' : palette.cardBorder
            }`}
          >
            {/* Large Glossy Colored Ball */}
            <div
              className={`relative flex items-center justify-center ${
                kidsMode ? 'w-48 h-48 sm:w-54 sm:h-54' : 'w-44 h-44 sm:w-48 sm:h-48'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {latestNumber !== null ? (
                  <motion.div
                    key={latestNumber}
                    initial={{ x: -72, scaleX: 1.18, scaleY: 0.84, opacity: 0 }}
                    animate={{
                      x: 0,
                      scaleX: [1.18, 0.9, 1.06, 1],
                      scaleY: [0.84, 1.12, 0.95, 1],
                      opacity: 1,
                    }}
                    exit={{ x: 48, scale: 0.75, opacity: 0 }}
                    transition={{
                      duration: kidsMode ? 0.48 : 0.42,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`relative flex items-center justify-center w-full h-full rounded-full ${palette.callerBallBg} shadow-xl shadow-orange-900/15 ring-4 ring-white`}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-3 left-6 w-20 h-10 rounded-full bg-white/40 -rotate-24 blur-[0.5px]"
                    />
                    <span
                      className={`relative z-10 font-display ${
                        kidsMode ? 'text-8xl sm:text-9xl' : 'text-7xl sm:text-8xl'
                      } font-black tabular-nums leading-none ${palette.callerBallText}`}
                    >
                      {latestNumber}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`relative flex items-center justify-center w-full h-full rounded-full ${palette.callerBallBg} opacity-75 shadow-md ring-4 ring-white`}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-3 left-6 w-20 h-10 rounded-full bg-white/35 -rotate-24"
                    />
                    <span className={`font-display text-5xl font-black ${palette.callerEmptyText}`}>
                      —
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Last 5 Called Numbers */}
            <div className="mt-6 w-full">
              <p
                data-hc-subtle="true"
                className="text-xs font-semibold tracking-wide text-stone-600"
              >
                {t.last5Numbers}
              </p>
              <div className="mt-2.5 flex items-center justify-center gap-2.5 min-h-[48px] overflow-hidden py-1">
                <AnimatePresence mode="popLayout" initial={false}>
                  {previousFive.map(({ num, callIndex }) => {
                    const ballStyle =
                      palette.ballPalette[callIndex % palette.ballPalette.length];
                    return (
                      <motion.div
                        key={num}
                        layout
                        initial={{ x: 32, scale: 0.7, opacity: 0 }}
                        animate={{ x: 0, scale: 1, opacity: 1 }}
                        exit={{ x: -32, scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative ${
                          kidsMode ? 'w-12 h-12 sm:w-13 sm:h-13 text-xl' : 'w-11 h-11 sm:w-12 sm:h-12 text-lg'
                        } rounded-full flex items-center justify-center font-display font-extrabold tabular-nums ring-2 ring-white shrink-0 ${ballStyle.bg} ${ballStyle.text}`}
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1 left-2 w-4 h-2 rounded-full bg-white/45 -rotate-20"
                        />
                        <span className="relative z-10">{num}</span>
                      </motion.div>
                    );
                  })}
                  {Array.from({ length: Math.max(0, 5 - previousFive.length) }).map(
                    (_, emptyIdx) => (
                      <div
                        key={`empty-${emptyIdx}`}
                        className={`${
                          kidsMode ? 'w-12 h-12 sm:w-13 sm:h-13' : 'w-11 h-11 sm:w-12 sm:h-12'
                        } rounded-full bg-stone-100 border-2 ${
                          highContrast ? 'border-stone-950 text-stone-700' : 'border-stone-200/80 text-stone-300'
                        } flex items-center justify-center font-display font-bold text-lg shrink-0`}
                      >
                        ·
                      </div>
                    )
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Large Call Next Number Button */}
            <button
              type="button"
              onClick={onCallNext}
              disabled={allCalled}
              className={`mt-6 w-full ${
                kidsMode ? 'min-h-[68px] text-2xl' : 'min-h-[60px] text-xl'
              } px-6 py-4 rounded-2xl font-display font-extrabold flex items-center justify-center gap-2.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-3 ${palette.focusOutline} ${
                allCalled
                  ? 'bg-stone-200 text-stone-600 cursor-not-allowed'
                  : `${palette.callNextBtn} text-white`
              }`}
            >
              {allCalled ? (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>{t.allCalled}</span>
                </>
              ) : (
                <span>{kidsMode ? t.callNextNumberKids : t.callNextNumber}</span>
              )}
            </button>

            {/* Called & Remaining Counts */}
            <div className="mt-5 w-full pt-4 border-t border-stone-200 flex items-center justify-center gap-6 text-base font-semibold text-stone-800 tabular-nums">
              <div>
                <span className="text-stone-950 font-bold">{calledCount}</span>{' '}
                <span>{t.called}</span>
              </div>
              <span aria-hidden="true" className="text-stone-400">
                ·
              </span>
              <div>
                <span className="text-stone-950 font-bold">{remainingCount}</span>{' '}
                <span>{t.remaining}</span>
              </div>
            </div>

            {/* Start Over & End Today's Game Buttons (Hidden while locked) */}
            {!isLocked && (
              <div className="mt-5 w-full flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  disabled={calledCount === 0}
                  className={`min-h-[44px] px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
                    calledCount === 0
                      ? 'text-stone-400 cursor-not-allowed'
                      : 'text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.startOver}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEndGameConfirm(true)}
                  className={`min-h-[44px] px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                    highContrast
                      ? 'bg-white border-stone-950 text-stone-950 hover:bg-stone-100'
                      : palette.lockBtn
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.endTodaysGame}</span>
                </button>
              </div>
            )}
          </section>

          {/* Right Column: Number Board, My Tickets, Prizes, History */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              role="tablist"
              aria-label={t.hostGame}
              data-hc-surface="true"
              className={`grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-white/90 border shadow-xs ${
                highContrast ? 'border-stone-950 border-2' : palette.cardBorder
              }`}
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'board'}
                onClick={() => setActiveTab('board')}
                className={`min-h-[44px] px-3 py-2 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                  activeTab === 'board'
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'text-stone-800 hover:bg-stone-100/80'
                }`}
              >
                <Grid3X3 className="w-4 h-4 shrink-0" strokeWidth={2.4} />
                <span>{t.tabBoard}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'tickets'}
                onClick={() => setActiveTab('tickets')}
                className={`min-h-[44px] px-3 py-2 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                  activeTab === 'tickets'
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'text-stone-800 hover:bg-stone-100/80'
                }`}
              >
                <Ticket className="w-4 h-4 shrink-0" strokeWidth={2.4} />
                <span>{t.tabMyTickets}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'prizes'}
                onClick={() => setActiveTab('prizes')}
                className={`min-h-[44px] px-3 py-2 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                  activeTab === 'prizes'
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'text-stone-800 hover:bg-stone-100/80'
                }`}
              >
                <Trophy className="w-4 h-4 shrink-0" strokeWidth={2.4} />
                <span>{t.tabPrizes}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
                className={`min-h-[44px] px-3 py-2 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                  activeTab === 'history'
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'text-stone-800 hover:bg-stone-100/80'
                }`}
              >
                <History className="w-4 h-4 shrink-0" strokeWidth={2.4} />
                <span>{t.tabHistory}</span>
              </button>
            </div>

            {activeTab === 'board' ? (
              <div className="flex flex-col gap-5">
                {/* 90-Dot Progress Bar */}
                <section
                  aria-label={t.calledTodayCount(calledCount)}
                  className={`rounded-2xl bg-white/95 border shadow-sm px-4 py-3.5 sm:px-5 ${
                    highContrast ? 'border-stone-950 border-2' : palette.cardBorder
                  }`}
                >
                  <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] sm:grid-cols-[repeat(30,minmax(0,1fr))] gap-1.5">
                    {PROGRESS_DOTS.map((idx) => {
                      const isFilled = idx < calledCount;
                      const dotColor = palette.ballPalette[idx % palette.ballPalette.length].dotBg;
                      return (
                        <span
                          key={idx}
                          aria-hidden="true"
                          className={`h-2.5 w-2.5 mx-auto rounded-full transition-colors duration-200 ${
                            isFilled ? dotColor : highContrast ? 'bg-stone-300' : 'bg-stone-200/90'
                          }`}
                        />
                      );
                    })}
                  </div>
                </section>

                {/* 1 to 90 Number Board */}
                <section
                  aria-label={t.tabBoard}
                  className={`rounded-3xl bg-white/95 border shadow-md p-3.5 sm:p-6 ${
                    highContrast ? 'border-stone-950 border-2' : palette.cardBorder
                  }`}
                >
                  <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
                    {ALL_NUMBERS.map((num) => {
                      const isCalled = calledSet.has(num);
                      const isLatest = latestNumber === num;
                      const rowColorIdx = Math.floor((num - 1) / 10) % palette.ballPalette.length;
                      const ballStyle = palette.ballPalette[rowColorIdx];

                      return (
                        <motion.div
                          key={num}
                          role="img"
                          tabIndex={0}
                          aria-label={`${num}, ${isCalled ? t.srCalled : t.srNotCalled}`}
                          initial={false}
                          animate={
                            isCalled
                              ? { scale: kidsMode ? [1, 1.3, 1] : [1, 1.24, 1] }
                              : { scale: 1 }
                          }
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className={`relative aspect-square min-h-[32px] sm:min-h-[44px] rounded-full flex items-center justify-center font-display font-extrabold ${
                            kidsMode ? 'text-sm sm:text-lg' : 'text-xs sm:text-base'
                          } tabular-nums focus-visible:outline-2 focus-visible:outline-offset-1 ${palette.focusOutline} ${
                            isCalled
                              ? `${ballStyle.bg} ${ballStyle.text} ${
                                  isLatest ? palette.boardLatestRing : ''
                                } ${highContrast ? 'ring-2 ring-stone-950' : ''}`
                              : highContrast
                              ? 'bg-white text-stone-950 border-2 border-stone-950'
                              : 'bg-white/80 text-stone-500 border-2 border-stone-200/80'
                          }`}
                        >
                          {isCalled && (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute top-1 left-1.5 w-2.5 h-1.5 sm:w-3.5 sm:h-2 rounded-full bg-white/40 -rotate-20"
                            />
                          )}
                          <span className="relative z-10">{num}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              </div>
            ) : activeTab === 'tickets' ? (
              <div className="flex flex-col gap-5">
                {!hostTickets || hostTickets.length === 0 ? (
                  <TicketCountPicker
                    theme={theme}
                    language={language}
                    kidsMode={kidsMode}
                    highContrast={highContrast}
                    onGenerate={onGenerateHostTickets}
                  />
                ) : (
                  <>
                    <div className="flex justify-end">
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
                    </div>

                    <div className="flex flex-col gap-5">
                      {hostTickets.map((ticket, index) => {
                        const ticketClaims = claims.filter(
                          (c) =>
                            c.source === 'host' &&
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
                            calledSet={calledSet}
                            latestCalledNumber={latestNumber}
                            onToggleMark={onToggleHostMark}
                            onRenameTicket={onRenameHostTicket}
                            onClaimTicket={onClaimHostTicket}
                          />
                        );
                      })}
                    </div>

                    {!isLocked && (
                      <div className="pt-2 pb-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => setShowResetHostTicketsConfirm(true)}
                          className="min-h-[48px] px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-900 font-semibold text-base flex items-center gap-2 transition-colors whitespace-nowrap shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>{t.resetMyTickets}</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : activeTab === 'prizes' ? (
              <PrizeBoard
                prizes={prizes}
                claims={claims}
                theme={theme}
                language={language}
                highContrast={highContrast}
                editable
                onChangePrizeReward={onChangePrizeReward}
                onRenamePrize={onRenamePrize}
                onChangePrizeRule={onChangePrizeRule}
                onAddPrize={onAddPrize}
                onRemovePrize={onRemovePrize}
              />
            ) : (
              <NumberHistoryPanel
                history={history}
                isLocked={isLocked}
                theme={theme}
                language={language}
                highContrast={highContrast}
                onClearHistory={onClearHistory}
              />
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={showResetConfirm}
        title={t.startOverTitle}
        message={t.startOverMessage}
        confirmLabel={t.yesStartOver}
        cancelLabel={t.keepNumbers}
        onConfirm={() => {
          setShowResetConfirm(false);
          onStartOver();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />

      <ConfirmModal
        isOpen={showEndGameConfirm}
        title={t.endTodaysGameTitle}
        message={t.endTodaysGameMessage}
        confirmLabel={t.yesEndGame}
        cancelLabel={t.keepPlaying}
        onConfirm={() => {
          setShowEndGameConfirm(false);
          onEndTodaysGame();
        }}
        onCancel={() => setShowEndGameConfirm(false)}
      />

      <ConfirmModal
        isOpen={showResetHostTicketsConfirm}
        title={t.resetMyTicketsTitle}
        message={t.resetMyTicketsMessage}
        confirmLabel={t.yesResetMyTickets}
        cancelLabel={t.keepTickets}
        onConfirm={() => {
          setShowResetHostTicketsConfirm(false);
          onResetHostTickets();
        }}
        onCancel={() => setShowResetHostTicketsConfirm(false)}
      />
    </div>
  );
}
