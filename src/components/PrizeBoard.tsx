import { useEffect, useRef, useState } from 'react';
import { Pencil, Plus, Trash2, Trophy } from 'lucide-react';
import {
  LanguageId,
  PatternClaim,
  PatternId,
  PrizeItem,
  ThemeId,
  WINNING_PATTERNS,
} from '../types/housie';
import { I18N } from '../utils/i18n';
import { MAX_TOTAL_PRIZES } from '../utils/storage';
import { THEMES } from '../utils/themes';
import { ConfirmModal } from './ConfirmModal';

interface PrizeBoardProps {
  prizes: PrizeItem[];
  claims: PatternClaim[];
  theme: ThemeId;
  language: LanguageId;
  highContrast?: boolean;
  editable?: boolean;
  onChangePrizeReward?: (prizeId: string, reward: string) => void;
  onRenamePrize?: (prizeId: string, customName: string) => void;
  onChangePrizeRule?: (prizeId: string, rule: PatternId) => void;
  onAddPrize?: () => PrizeItem | null;
  onRemovePrize?: (prizeId: string) => void;
}

export function getPrizeDisplayName(
  prize: PrizeItem,
  language: LanguageId
): string {
  const t = I18N[language];
  if (prize.customName?.trim()) return prize.customName.trim();
  if (prize.isDefault) return t.patterns[prize.rule];
  return t.prizePlaceholder;
}

export function PrizeBoard({
  prizes,
  claims,
  theme,
  language,
  highContrast = false,
  editable = false,
  onChangePrizeReward,
  onRenamePrize,
  onChangePrizeRule,
  onAddPrize,
  onRemovePrize,
}: PrizeBoardProps) {
  const palette = THEMES[theme];
  const t = I18N[language];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingId && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingId]);

  const startEditing = (prize: PrizeItem) => {
    if (!editable) return;
    setDraftName(getPrizeDisplayName(prize, language));
    setEditingId(prize.id);
  };

  const commitEdit = (prize: PrizeItem) => {
    const trimmed = draftName.trim().slice(0, 30);
    if (trimmed.length > 0) {
      onRenamePrize?.(prize.id, trimmed);
    }
    setEditingId(null);
  };

  const handleAddClick = () => {
    if (!onAddPrize || prizes.length >= MAX_TOTAL_PRIZES) return;
    const created = onAddPrize();
    if (created) {
      setDraftName(getPrizeDisplayName(created, language));
      setEditingId(created.id);
    }
  };

  const atLimit = prizes.length >= MAX_TOTAL_PRIZES;

  return (
    <>
      <section
        aria-label={t.prizes}
        className={`rounded-3xl bg-white/95 border shadow-md p-4 sm:p-6 ${
          highContrast ? 'border-stone-950 border-2' : palette.cardBorder
        }`}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${palette.setupIconBg}`}
          >
            <Trophy className="w-5 h-5" strokeWidth={2.3} />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-stone-950">
            {t.prizes}
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {prizes.map((prize) => {
            const claim = claims.find(
              (c) => (c.prizeId ?? c.patternId) === prize.id
            );
            const isWon = prize.status === 'won' || Boolean(claim);
            const winnerName = prize.wonByTicketName ?? claim?.ticketName;
            const displayName = getPrizeDisplayName(prize, language);
            const isEditing = editable && editingId === prize.id;

            return (
              <div
                key={prize.id}
                data-hc-border="true"
                className={`rounded-2xl border px-3.5 py-2.5 sm:px-4 sm:py-3 flex flex-col gap-2.5 ${
                  isWon
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : highContrast
                    ? 'bg-white border-stone-950'
                    : `${palette.subtleCellBg} ${palette.subtleCellBorder}`
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
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
                          maxLength={30}
                          aria-label={displayName}
                          onChange={(e) => setDraftName(e.target.value.slice(0, 30))}
                          onBlur={() => commitEdit(prize)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              commitEdit(prize);
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              setEditingId(null);
                            }
                          }}
                          className="min-h-[44px] w-48 sm:w-56 pl-9 pr-3 py-1.5 rounded-2xl border-2 border-amber-400 bg-white font-display font-extrabold text-base text-stone-950 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
                        />
                      </div>
                    ) : editable ? (
                      <button
                        type="button"
                        onClick={() => startEditing(prize)}
                        aria-label={displayName}
                        className={`min-h-[44px] px-2 py-1 -ml-1.5 rounded-2xl inline-flex items-center gap-1.5 text-left max-w-full hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline}`}
                      >
                        <span className="relative inline-block font-display text-base sm:text-lg font-black text-stone-950 truncate">
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0.5 h-3 rounded-full bg-yellow-300/75"
                          />
                          <span className="relative z-10 px-1">{displayName}</span>
                        </span>
                        <Pencil
                          aria-hidden="true"
                          className="w-3.5 h-3.5 text-stone-600 shrink-0"
                          strokeWidth={2.2}
                        />
                      </button>
                    ) : (
                      <span className="relative inline-block font-display text-base sm:text-lg font-black text-stone-950 truncate py-1">
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-1 h-3 rounded-full bg-yellow-300/75"
                        />
                        <span className="relative z-10 px-1">{displayName}</span>
                      </span>
                    )}

                    {/* Rule dropdown for extra prizes (Host) or read-only rule pill (Play) */}
                    {!prize.isDefault &&
                      (editable ? (
                        <select
                          aria-label={`${displayName} ${t.prizeRuleLabel}`}
                          value={prize.rule}
                          onChange={(e) =>
                            onChangePrizeRule?.(prize.id, e.target.value as PatternId)
                          }
                          className={`min-h-[44px] px-3 py-1.5 rounded-2xl border-2 bg-white font-display font-bold text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                            highContrast ? 'border-stone-950' : palette.cardBorder
                          }`}
                        >
                          {WINNING_PATTERNS.map((pat) => (
                            <option key={pat.id} value={pat.id}>
                              {t.patterns[pat.id]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            highContrast
                              ? 'bg-white border-stone-950 text-stone-950'
                              : 'bg-white/90 border-stone-200 text-stone-700'
                          }`}
                        >
                          {t.patterns[prize.rule]}
                        </span>
                      ))}
                  </div>

                  {/* Mobile status badge */}
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 sm:hidden ${
                      isWon
                        ? 'bg-emerald-700 text-white'
                        : highContrast
                        ? 'bg-white text-stone-950 border-2 border-stone-950'
                        : 'bg-white/90 text-stone-600 border border-stone-200'
                    }`}
                  >
                    {isWon && winnerName
                      ? `${t.wonStatus} · ${winnerName}`
                      : isWon
                      ? t.wonStatus
                      : t.openStatus}
                  </span>
                </div>

                {/* Second row / right controls: Reward field + Remove (extra only) + Status */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-1 min-w-[160px]">
                    {editable ? (
                      <input
                        type="text"
                        value={prize.reward}
                        maxLength={40}
                        aria-label={`${displayName} ${t.prizePlaceholder}`}
                        placeholder={t.prizePlaceholder}
                        onChange={(e) =>
                          onChangePrizeReward?.(prize.id, e.target.value)
                        }
                        className={`min-h-[44px] w-full px-3.5 py-2 rounded-2xl border-2 bg-white font-medium text-sm sm:text-base text-stone-950 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                          highContrast ? 'border-stone-950' : palette.cardBorder
                        }`}
                      />
                    ) : (
                      <span className="text-sm sm:text-base font-semibold text-stone-800 truncate">
                        {prize.reward.trim() ? prize.reward : '—'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {editable && !prize.isDefault && (
                      <button
                        type="button"
                        onClick={() => setPendingRemoveId(prize.id)}
                        className="min-h-[44px] px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.remove}</span>
                      </button>
                    )}

                    <span
                      className={`hidden sm:inline-flex items-center text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
                        isWon
                          ? 'bg-emerald-700 text-white'
                          : highContrast
                          ? 'bg-white text-stone-950 border-2 border-stone-950'
                          : 'bg-white/90 text-stone-600 border border-stone-200'
                      }`}
                    >
                      {isWon && winnerName
                        ? `${t.wonStatus} · ${winnerName}`
                        : isWon
                        ? t.wonStatus
                        : t.openStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {editable && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              disabled={atLimit}
              onClick={handleAddClick}
              className={`min-h-[48px] w-full sm:w-auto px-6 py-2.5 rounded-2xl font-display font-extrabold text-base flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                atLimit
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  : `${palette.callNextBtn} text-white shadow-sm`
              }`}
            >
              <Plus className="w-5 h-5 shrink-0" strokeWidth={2.5} />
              <span>{t.addPrize}</span>
            </button>
          </div>
        )}
      </section>

      <ConfirmModal
        isOpen={pendingRemoveId !== null}
        title={t.removePrizeTitle}
        message={t.removePrizeMessage}
        confirmLabel={t.yesRemove}
        cancelLabel={t.keepPrize}
        onConfirm={() => {
          if (pendingRemoveId) {
            onRemovePrize?.(pendingRemoveId);
          }
          setPendingRemoveId(null);
        }}
        onCancel={() => setPendingRemoveId(null)}
      />
    </>
  );
}
