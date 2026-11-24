import { Mic, MicOff, Music, Volume2, VolumeX } from 'lucide-react';
import { LanguageId, ThemeId } from '../types/housie';
import { I18N } from '../utils/i18n';
import { THEMES } from '../utils/themes';

interface AudioToggleBarProps {
  theme: ThemeId;
  language: LanguageId;
  highContrast?: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  showVoice?: boolean;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  showMusic?: boolean;
  musicEnabled?: boolean;
  onToggleMusic?: () => void;
}

export function AudioToggleBar({
  theme,
  language,
  highContrast = false,
  soundEnabled,
  onToggleSound,
  showVoice = false,
  voiceEnabled = true,
  onToggleVoice,
  showMusic = false,
  musicEnabled = false,
  onToggleMusic,
}: AudioToggleBarProps) {
  const palette = THEMES[theme];
  const t = I18N[language];

  const offClasses = highContrast
    ? 'bg-white text-stone-950 border-stone-950 hover:bg-stone-100'
    : 'bg-white/90 text-stone-500 border-stone-200 hover:bg-white';

  const onClasses = highContrast
    ? 'bg-teal-800 text-white border-stone-950 shadow-xs'
    : 'bg-teal-600 text-white border-teal-600 shadow-xs';

  return (
    <div
      className="flex flex-wrap items-center justify-end gap-2 mb-4"
      role="group"
      aria-label={`${t.voice} / ${t.sound}`}
    >
      {showVoice && onToggleVoice && (
        <button
          type="button"
          aria-pressed={voiceEnabled}
          onClick={onToggleVoice}
          className={`min-h-[44px] px-3.5 py-2 rounded-2xl border-2 font-display font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
            voiceEnabled ? onClasses : offClasses
          }`}
        >
          {voiceEnabled ? (
            <Mic className="w-4 h-4 shrink-0" strokeWidth={2.4} />
          ) : (
            <MicOff className="w-4 h-4 shrink-0" strokeWidth={2.4} />
          )}
          <span>{t.voice}</span>
        </button>
      )}

      <button
        type="button"
        aria-pressed={soundEnabled}
        onClick={onToggleSound}
        className={`min-h-[44px] px-3.5 py-2 rounded-2xl border-2 font-display font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
          soundEnabled ? onClasses : offClasses
        }`}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 shrink-0" strokeWidth={2.4} />
        ) : (
          <VolumeX className="w-4 h-4 shrink-0" strokeWidth={2.4} />
        )}
        <span>{t.sound}</span>
      </button>

      {showMusic && onToggleMusic && (
        <button
          type="button"
          aria-pressed={musicEnabled}
          onClick={onToggleMusic}
          className={`min-h-[44px] px-3.5 py-2 rounded-2xl border-2 font-display font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
            musicEnabled ? onClasses : offClasses
          }`}
        >
          <Music className="w-4 h-4 shrink-0" strokeWidth={2.4} />
          <span>{t.music}</span>
        </button>
      )}
    </div>
  );
}
