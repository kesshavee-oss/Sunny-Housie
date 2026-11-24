import { useState } from 'react';
import { Ticket } from 'lucide-react';
import { motion } from 'motion/react';
import { LanguageId, ThemeId } from '../types/housie';
import { I18N } from '../utils/i18n';
import { THEMES } from '../utils/themes';

interface TicketCountPickerProps {
  theme: ThemeId;
  language: LanguageId;
  kidsMode?: boolean;
  highContrast?: boolean;
  onGenerate: (count: number) => void;
}

const TICKET_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function TicketCountPicker({
  theme,
  language,
  kidsMode = false,
  highContrast = false,
  onGenerate,
}: TicketCountPickerProps) {
  const [selectedCount, setSelectedCount] = useState<number>(2);
  const palette = THEMES[theme];
  const t = I18N[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      data-hc-surface="true"
      className={`rounded-3xl bg-white/95 border shadow-md p-6 sm:p-8 text-center ${
        highContrast ? 'border-stone-950 border-2' : palette.cardBorder
      }`}
    >
      <div
        className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center ${palette.setupIconBg}`}
      >
        <Ticket className="w-7 h-7" strokeWidth={2.2} />
      </div>

      <h2
        className={`mt-4 font-display font-bold text-stone-950 text-balance ${
          kidsMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
        }`}
      >
        {kidsMode ? t.howManyTicketsKids : t.howManyTickets}
      </h2>
      {!kidsMode && (
        <p data-hc-subtle="true" className="mt-1.5 text-base text-stone-600">
          {t.choose1to10}
        </p>
      )}

      <div
        className="mt-7 grid grid-cols-5 gap-2.5 sm:gap-3"
        role="radiogroup"
        aria-label={t.howManyTickets}
      >
        {TICKET_COUNTS.map((count) => {
          const isSelected = selectedCount === count;
          return (
            <button
              key={count}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedCount(count)}
              className={`${
                kidsMode ? 'min-h-[62px] text-2xl' : 'min-h-[54px] text-xl'
              } rounded-2xl font-display font-bold tabular-nums transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                isSelected
                  ? `${palette.setupSelectedCount} ${highContrast ? 'ring-2 ring-stone-950' : ''}`
                  : highContrast
                  ? 'bg-white text-stone-950 border-2 border-stone-950 hover:bg-stone-100'
                  : `${palette.subtleCellBg} hover:opacity-85 text-stone-800 border ${palette.cardBorder}`
              }`}
            >
              {count}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onGenerate(selectedCount)}
        className={`mt-8 w-full ${
          kidsMode ? 'min-h-[66px] text-2xl' : 'min-h-[58px] text-xl'
        } px-6 py-4 rounded-2xl bg-gradient-to-r ${palette.setupGenerateBtn} text-white font-display font-bold shadow-md transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-3 ${palette.focusOutline}`}
      >
        {kidsMode ? t.generateTicketsKids : t.generateTickets}
      </button>
    </motion.div>
  );
}
