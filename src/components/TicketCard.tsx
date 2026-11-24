import { useEffect, useRef, useState } from 'react';
import { Award, ImageDown, Pencil, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { HousieTicket, LanguageId, PatternId, ThemeId } from '../types/housie';
import { I18N } from '../utils/i18n';
import { THEMES } from '../utils/themes';
import { downloadTicketPicture } from '../utils/ticketImage';

export interface CompletedRowFlash {
  ticketNumber: number;
  rowIndex: number;
  id: number;
}

export interface WonPrizeBadge {
  id: string;
  label: string;
  isFullHouse?: boolean;
}

export interface ClaimFeedback {
  status: 'notYet' | 'won';
  patterns?: PatternId[];
  wonLabels?: string[];
  id: number;
}

interface TicketCardProps {
  ticket: HousieTicket;
  index: number;
  theme: ThemeId;
  language: LanguageId;
  kidsMode?: boolean;
  highContrast?: boolean;
  completedRowFlash: CompletedRowFlash | null;
  wonPatterns: PatternId[];
  wonBadges?: WonPrizeBadge[];
  claimFeedback: ClaimFeedback | null;
  calledSet?: Set<number>;
  latestCalledNumber?: number | null;
  onToggleMark: (ticketNumber: number, num: number) => void;
  onRenameTicket: (ticketNumber: number, customName?: string) => void;
  onClaimTicket: (ticketNumber: number) => void;
}

export function TicketCard({
  ticket,
  index,
  theme,
  language,
  kidsMode = false,
  highContrast = false,
  completedRowFlash,
  wonPatterns,
  wonBadges,
  claimFeedback,
  calledSet,
  latestCalledNumber,
  onToggleMark,
  onRenameTicket,
  onClaimTicket,
}: TicketCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const palette = THEMES[theme];
  const t = I18N[language];

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditing]);

  const accent = palette.ticketAccents[index % palette.ticketAccents.length];
  const markedSet = new Set(ticket.markedNumbers);
  const resolvedBadges: WonPrizeBadge[] =
    wonBadges ?? wonPatterns.map((pId) => ({ id: pId, label: t.patterns[pId], isFullHouse: pId === 'fullHouse' }));
  const isFullHouseClaimed =
    wonPatterns.includes('fullHouse') || resolvedBadges.some((b) => b.isFullHouse);
  const displayLabel =
    ticket.customName?.trim() || `${t.ticketPrefix} ${ticket.ticketNumber}`;

  const startEditing = () => {
    setDraftName(displayLabel);
    setIsEditing(true);
  };

  const commitEdit = () => {
    const trimmed = draftName.trim().slice(0, 20);
    onRenameTicket(ticket.ticketNumber, trimmed.length > 0 ? trimmed : undefined);
    setIsEditing(false);
  };

  const getPatternLabel = (id: PatternId) => t.patterns[id];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay: Math.min(index * 0.03, 0.2),
        ease: [0.16, 1, 0.3, 1],
      }}
      aria-label={displayLabel}
      className={`rounded-3xl bg-[#FFFDF9] border-2 shadow-md overflow-hidden ${
        highContrast ? 'border-stone-950 bg-white' : palette.cardBorder
      }`}
    >
      {/* Striped Colored Top Edge */}
      <div className="h-3 w-full ticket-top-stripe" aria-hidden="true" />

      {/* Ticket Header with Editable Highlighter Name */}
      <div
        className={`px-3.5 py-2 sm:px-5 sm:py-2.5 border-b flex items-center justify-between gap-2 ${
          highContrast ? 'border-stone-950 bg-white' : `${palette.cardBorder} ${accent.headerBg}`
        }`}
      >
        <div className="min-w-0 flex-1 flex items-center">
          {isEditing ? (
            <div className="relative inline-flex items-center max-w-full">
              <Pencil
                aria-hidden="true"
                className="w-4 h-4 text-stone-600 absolute left-3 pointer-events-none"
              />
              <input
                ref={nameInputRef}
                type="text"
                value={draftName}
                maxLength={20}
                aria-label={`${t.ticketPrefix} ${ticket.ticketNumber}`}
                onChange={(e) => setDraftName(e.target.value.slice(0, 20))}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commitEdit();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsEditing(false);
                  }
                }}
                className="min-h-[44px] w-44 sm:w-52 pl-9 pr-3 py-1.5 rounded-2xl border-2 border-amber-400 bg-white font-display font-extrabold text-base sm:text-lg text-stone-950 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              aria-label={displayLabel}
              className={`min-h-[44px] px-2.5 py-1.5 -ml-1.5 rounded-2xl inline-flex items-center gap-2 text-left max-w-full hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline}`}
            >
              <span className="relative inline-block font-display text-lg sm:text-xl font-black text-stone-950 truncate">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0.5 h-3.5 rounded-full bg-yellow-300/75"
                />
                <span className="relative z-10 px-1">{displayLabel}</span>
              </span>
              <Pencil
                aria-hidden="true"
                className="w-4 h-4 text-stone-600 shrink-0"
                strokeWidth={2.2}
              />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {isFullHouseClaimed && (
            <motion.div
              initial={{ scale: 0.65, opacity: 0 }}
              animate={{ scale: 1, y: [0, -4, 0], opacity: 1 }}
              transition={{
                scale: { type: 'spring', stiffness: 420, damping: 16 },
                y: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white font-display font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="inline-flex"
              >
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              </motion.span>
              <span>{t.patterns.fullHouse}</span>
            </motion.div>
          )}

          <span className="text-sm font-semibold text-stone-800 tabular-nums">
            {ticket.markedNumbers.length} / 15
          </span>
        </div>
      </div>

      {/* Bouncing Pattern Win Banner */}
      <AnimatePresence>
        {claimFeedback?.status === 'won' &&
          ((claimFeedback.wonLabels && claimFeedback.wonLabels.length > 0) ||
            (claimFeedback.patterns && claimFeedback.patterns.length > 0)) && (
          <motion.div
            key={`won-${claimFeedback.id}`}
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{
              opacity: { duration: 0.18 },
              scale: { type: 'spring', stiffness: kidsMode ? 500 : 420, damping: 14 },
              y: { duration: 0.9, repeat: 2, ease: 'easeInOut' },
            }}
            className="mx-3 mt-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white font-display font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 shrink-0" strokeWidth={2.5} />
            <span>
              {(claimFeedback.wonLabels && claimFeedback.wonLabels.length > 0
                ? claimFeedback.wonLabels
                : (claimFeedback.patterns ?? []).map(getPatternLabel)
              ).join(' · ')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3x9 Paper Ticket Grid */}
      <div className={`p-2.5 sm:p-4 ${highContrast ? 'bg-white' : 'bg-[#FFFDF9]'} flex flex-col gap-1 sm:gap-1.5`}>
        {ticket.grid.map((row, rowIdx) => {
          const isFlashingRow =
            completedRowFlash !== null &&
            completedRowFlash.ticketNumber === ticket.ticketNumber &&
            completedRowFlash.rowIndex === rowIdx;

          return (
            <div key={rowIdx} className="relative grid grid-cols-9 gap-1 sm:gap-1.5">
              {isFlashingRow && (
                <motion.div
                  key={completedRowFlash.id}
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: [0, 0.9, 0], scale: [0.98, 1.01, 1] }}
                  transition={{ duration: 0.95, ease: 'easeOut' }}
                  className="pointer-events-none absolute -inset-1 z-20 rounded-2xl bg-yellow-300/35 ring-2 ring-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.55)]"
                />
              )}

              {row.map((cell, colIdx) => {
                if (cell === null) {
                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      role="img"
                      aria-label={`${displayLabel}, ${t.srBlank}`}
                      className={`${
                        kidsMode ? 'min-h-[52px] sm:min-h-[64px]' : 'min-h-[46px] sm:min-h-[56px]'
                      } rounded-xl border ${
                        highContrast
                          ? 'bg-stone-100 border-stone-950 border-2'
                          : `${palette.subtleCellBg} ${palette.subtleCellBorder}`
                      }`}
                    />
                  );
                }

                const isMarked = markedSet.has(cell);
                const isJustCalledUnmarked =
                  !isMarked && latestCalledNumber !== undefined && latestCalledNumber === cell;
                const isCalledUnmarked =
                  !isMarked && calledSet !== undefined && calledSet.has(cell);

                return (
                  <button
                    key={`${rowIdx}-${colIdx}`}
                    type="button"
                    aria-pressed={isMarked}
                    aria-label={`${displayLabel}, ${cell}, ${isMarked ? t.srMarked : t.srUnmarked}`}
                    onClick={() => onToggleMark(ticket.ticketNumber, cell)}
                    className={`relative ${
                      kidsMode
                        ? 'min-h-[52px] sm:min-h-[64px] text-xl sm:text-2xl'
                        : 'min-h-[46px] sm:min-h-[56px] text-base sm:text-xl'
                    } rounded-xl border-2 font-display font-extrabold tabular-nums flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 ${palette.focusOutline} ${
                      highContrast
                        ? isJustCalledUnmarked
                          ? 'bg-amber-200 border-stone-950 text-stone-950 ring-2 ring-stone-950'
                          : isCalledUnmarked
                          ? 'bg-amber-100 border-stone-950 text-stone-950'
                          : 'bg-white border-stone-950 text-stone-950'
                        : isJustCalledUnmarked
                        ? 'bg-amber-100 border-orange-400 text-stone-950 ring-2 ring-orange-300/75'
                        : isCalledUnmarked
                        ? 'bg-amber-50/95 border-amber-300 text-stone-950'
                        : `bg-white ${palette.ticketNumberCellBorder} text-stone-950`
                    }`}
                  >
                    {isMarked ? (
                      <span className="relative flex items-center justify-center">
                        <motion.span
                          aria-hidden="true"
                          initial={{ scale: 0.55, opacity: 0.75 }}
                          animate={{ scale: kidsMode ? 1.7 : 1.55, opacity: 0 }}
                          transition={{ duration: 0.42, ease: 'easeOut' }}
                          className={`pointer-events-none absolute ${
                            kidsMode ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-9 h-9 sm:w-11 sm:h-11'
                          } rounded-full ${accent.dotBg}`}
                        />
                        <motion.span
                          initial={{ scale: 0.3 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: kidsMode ? 560 : 500,
                            damping: kidsMode ? 12 : 14,
                          }}
                          className={`relative z-10 ${
                            kidsMode ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-9 h-9 sm:w-11 sm:h-11'
                          } rounded-full ${accent.dotBg} text-white flex items-center justify-center shadow-sm ring-2 ${
                            highContrast ? 'ring-stone-950' : accent.ringColor
                          }`}
                        >
                          {cell}
                        </motion.span>
                      </span>
                    ) : (
                      <span>{cell}</span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Ticket Footer: Claimed Patterns / Calm "Not yet" + Claim Button */}
      <div
        className={`px-3.5 py-2.5 sm:px-5 border-t flex flex-wrap items-center justify-between gap-2.5 ${
          highContrast ? 'border-stone-950 bg-white' : `${palette.cardBorder} bg-[#FFFBF2]`
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {resolvedBadges.map((badge) => (
            <span
              key={badge.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-display font-bold text-xs sm:text-sm"
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>{badge.label}</span>
            </span>
          ))}

          {claimFeedback?.status === 'notYet' && (
            <motion.span
              key={`not-yet-${claimFeedback.id}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-semibold text-stone-700"
            >
              {t.notYet}
            </motion.span>
          )}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              downloadTicketPicture(
                ticket,
                index,
                displayLabel,
                theme,
                resolvedBadges.map((b) => b.label)
              )
            }
            className={`${
              kidsMode ? 'min-h-[48px] px-4 text-sm sm:text-base' : 'min-h-[44px] px-3.5 text-xs sm:text-sm'
            } py-2 rounded-2xl border-2 font-display font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
              highContrast
                ? 'bg-white border-stone-950 text-stone-950 hover:bg-stone-100'
                : palette.homeBtn
            }`}
          >
            <ImageDown className="w-4 h-4 shrink-0" strokeWidth={2.3} />
            <span>{t.saveTicketPicture}</span>
          </button>

          <button
            type="button"
            onClick={() => onClaimTicket(ticket.ticketNumber)}
            className={`${
              kidsMode ? 'min-h-[48px] px-6 text-base sm:text-lg' : 'min-h-[44px] px-5 text-sm sm:text-base'
            } py-2 rounded-2xl font-display font-extrabold text-white shadow-xs whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${palette.callNextBtn}`}
          >
            {t.claim}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
