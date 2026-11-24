import { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { LanguageId, ThemeId } from '../types/housie';
import { I18N } from '../utils/i18n';
import { THEMES } from '../utils/themes';

interface PWAInstallButtonProps {
  theme: ThemeId;
  language: LanguageId;
  highContrast?: boolean;
}

export function PWAInstallButton({
  theme,
  language,
  highContrast = false,
}: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const palette = THEMES[theme];
  const t = I18N[language];

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={`min-h-[46px] w-full px-4 py-2.5 rounded-2xl font-display font-bold text-base text-white flex items-center justify-center gap-2 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${palette.callNextBtn}`}
      >
        <Download className="w-4.5 h-4.5 shrink-0" strokeWidth={2.4} />
        <span>{t.installApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`min-h-[46px] w-full px-4 py-2.5 rounded-2xl border-2 font-display font-bold text-base flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
            highContrast
              ? 'bg-white border-stone-950 text-stone-950 hover:bg-stone-100'
              : 'bg-white border-stone-300 text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Download className="w-4.5 h-4.5 shrink-0" strokeWidth={2.4} />
          <span>{t.installIOS}</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50"
            role="dialog"
            aria-modal="true"
            aria-label={t.installIOS}
          >
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border-2 border-stone-200 text-center">
              <h3 className="font-display text-xl font-extrabold text-stone-950">
                {t.installIOS}
              </h3>
              <p className="mt-2.5 text-sm font-medium text-stone-700">
                {t.installIOSBody}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className={`mt-5 w-full min-h-[44px] rounded-2xl font-display font-bold text-base text-white ${palette.callNextBtn}`}
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
