import { useMemo, useState } from 'react';
import { History, Trash2 } from 'lucide-react';
import { CallHistoryEntry, LanguageId, ThemeId } from '../types/housie';
import { I18N } from '../utils/i18n';
import { THEMES } from '../utils/themes';
import { ConfirmModal } from './ConfirmModal';

interface NumberHistoryPanelProps {
  history: CallHistoryEntry[];
  isLocked: boolean;
  theme: ThemeId;
  language: LanguageId;
  highContrast?: boolean;
  onClearHistory: () => void;
}

export function NumberHistoryPanel({
  history,
  isLocked,
  theme,
  language,
  highContrast = false,
  onClearHistory,
}: NumberHistoryPanelProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const palette = THEMES[theme];
  const t = I18N[language];

  const newestFirst = useMemo(() => {
    return history
      .map((entry, idx) => ({ ...entry, order: idx + 1 }))
      .reverse();
  }, [history]);

  const formatTime = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <>
      <section
        aria-label={t.history}
        className={`rounded-3xl bg-white/95 border shadow-md p-4 sm:p-6 ${
          highContrast ? 'border-stone-950 border-2' : palette.cardBorder
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${palette.setupIconBg}`}
            >
              <History className="w-5 h-5" strokeWidth={2.3} />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-stone-950">
              {t.history}
            </h2>
          </div>

          {!isLocked && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              disabled={history.length === 0}
              className={`min-h-[44px] px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
                history.length === 0
                  ? 'text-stone-400 bg-stone-100 cursor-not-allowed'
                  : 'text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.clearHistory}</span>
            </button>
          )}
        </div>

        {newestFirst.length === 0 ? (
          <div
            data-hc-border="true"
            className={`rounded-2xl border px-4 py-8 text-center text-stone-600 font-medium ${palette.subtleCellBg} ${palette.subtleCellBorder}`}
          >
            —
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto pr-1 flex flex-col gap-2">
            {newestFirst.map((item) => {
              const rowColorIdx =
                Math.floor((item.number - 1) / 10) % palette.ballPalette.length;
              const ballStyle = palette.ballPalette[rowColorIdx];

              return (
                <div
                  key={`${item.order}-${item.number}-${item.calledAt}`}
                  data-hc-border="true"
                  className={`rounded-2xl border px-3.5 py-2 flex items-center justify-between gap-3 ${
                    highContrast
                      ? 'bg-white border-stone-950'
                      : `${palette.subtleCellBg} ${palette.subtleCellBorder}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-stone-600 tabular-nums w-7">
                      #{item.order}
                    </span>
                    <div
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center font-display font-extrabold text-base tabular-nums ring-2 ring-white ${ballStyle.bg} ${ballStyle.text}`}
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1 left-2 w-3.5 h-1.5 rounded-full bg-white/40 -rotate-20"
                      />
                      <span className="relative z-10">{item.number}</span>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-stone-700 tabular-nums">
                    {formatTime(item.calledAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmModal
        isOpen={showClearConfirm}
        title={t.clearHistoryTitle}
        message={t.clearHistoryMessage}
        confirmLabel={t.clearHistory}
        cancelLabel={t.keepHistory}
        onConfirm={() => {
          setShowClearConfirm(false);
          onClearHistory();
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </>
  );
}
