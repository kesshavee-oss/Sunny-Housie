import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Contrast,
  Download,
  Globe,
  Palette,
  Smile,
  Type,
  Upload,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { LanguageId, ThemeId } from '../types/housie';
import { I18N } from '../utils/i18n';
import { parseAndValidateBackup } from '../utils/storage';
import { THEME_LIST, THEMES } from '../utils/themes';
import { ConfirmModal } from './ConfirmModal';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsModalProps {
  isOpen: boolean;
  theme: ThemeId;
  language: LanguageId;
  kidsMode: boolean;
  highContrast: boolean;
  largeText: boolean;
  onSelectTheme: (theme: ThemeId) => void;
  onSelectLanguage: (language: LanguageId) => void;
  onToggleKidsMode: () => void;
  onToggleHighContrast: () => void;
  onToggleLargeText: () => void;
  onExportData: () => void;
  onImportData: (data: Record<string, string>) => void;
  onClose: () => void;
}

const LANGUAGE_IDS: LanguageId[] = ['en', 'hi', 'pa'];

export function SettingsModal({
  isOpen,
  theme,
  language,
  kidsMode,
  highContrast,
  largeText,
  onSelectTheme,
  onSelectLanguage,
  onToggleKidsMode,
  onToggleHighContrast,
  onToggleLargeText,
  onExportData,
  onImportData,
  onClose,
}: SettingsModalProps) {
  const palette = THEMES[theme];
  const t = I18N[language];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [pendingBackup, setPendingBackup] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setImportError(null);
      setPendingBackup(null);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !pendingBackup) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pendingBackup, onClose]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const validated = parseAndValidateBackup(text);
      if (!validated) {
        setImportError(t.invalidBackupError);
        return;
      }
      setImportError(null);
      setPendingBackup(validated);
    } catch {
      setImportError(t.invalidBackupError);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={onClose}
              className="fixed inset-0 bg-stone-950/45 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              data-hc-surface="true"
              className={`relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FFFDF8] p-5 sm:p-7 shadow-xl border-2 ${
                highContrast ? 'border-stone-950 bg-white' : palette.cardBorder
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <h2
                  id="settings-modal-title"
                  className="font-display text-2xl font-extrabold text-stone-950"
                >
                  {t.settings}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t.close}
                  className={`min-h-[44px] min-w-[44px] px-3 rounded-2xl border flex items-center justify-center gap-1.5 font-semibold text-sm ${
                    highContrast
                      ? 'bg-white border-stone-950 text-stone-950 hover:bg-stone-100'
                      : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
                  } focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline}`}
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-6">
                {/* Theme Picker */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Palette className="w-4.5 h-4.5 text-stone-700 shrink-0" strokeWidth={2.3} />
                    <span className="font-display font-bold text-base text-stone-950">
                      {t.themeLabel}
                    </span>
                  </div>
                  <div
                    role="radiogroup"
                    aria-label={t.themeLabel}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                  >
                    {THEME_LIST.map((item) => {
                      const isActive = item.id === theme;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          onClick={() => onSelectTheme(item.id)}
                          className={`min-h-[46px] px-3 py-2 rounded-2xl border-2 font-semibold text-sm flex items-center justify-between gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                            isActive
                              ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                              : highContrast
                              ? 'bg-white text-stone-950 border-stone-950 hover:bg-stone-100'
                              : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="flex items-center -space-x-1 shrink-0" aria-hidden="true">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-white"
                                style={{ backgroundColor: item.swatchColors[0] }}
                              />
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-white"
                                style={{ backgroundColor: item.swatchColors[1] }}
                              />
                            </span>
                            <span className="truncate">{t.themes[item.id]}</span>
                          </span>
                          {isActive && <Check className="w-4 h-4 shrink-0" strokeWidth={2.6} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Language Picker */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Globe className="w-4.5 h-4.5 text-stone-700 shrink-0" strokeWidth={2.3} />
                    <span className="font-display font-bold text-base text-stone-950">
                      {t.languageLabel}
                    </span>
                  </div>
                  <div
                    role="radiogroup"
                    aria-label={t.languageLabel}
                    className="grid grid-cols-3 gap-2"
                  >
                    {LANGUAGE_IDS.map((langId) => {
                      const isActive = langId === language;
                      return (
                        <button
                          key={langId}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          onClick={() => onSelectLanguage(langId)}
                          className={`min-h-[46px] px-3 py-2 rounded-2xl border-2 font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                            isActive
                              ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                              : highContrast
                              ? 'bg-white text-stone-950 border-stone-950 hover:bg-stone-100'
                              : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <span>{t.languages[langId]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simple Toggles: Kids Mode, High Contrast, Large Text */}
                <div className="flex flex-col gap-2.5">
                  <SettingSwitchRow
                    icon={<Smile className="w-5 h-5 shrink-0" strokeWidth={2.3} />}
                    label={t.kidsModeLabel}
                    checked={kidsMode}
                    highContrast={highContrast}
                    focusOutline={palette.focusOutline}
                    onToggle={onToggleKidsMode}
                  />

                  <SettingSwitchRow
                    icon={<Contrast className="w-5 h-5 shrink-0" strokeWidth={2.3} />}
                    label={t.highContrastLabel}
                    checked={highContrast}
                    highContrast={highContrast}
                    focusOutline={palette.focusOutline}
                    onToggle={onToggleHighContrast}
                  />

                  <SettingSwitchRow
                    icon={<Type className="w-5 h-5 shrink-0" strokeWidth={2.3} />}
                    label={t.largeTextLabel}
                    checked={largeText}
                    highContrast={highContrast}
                    focusOutline={palette.focusOutline}
                    onToggle={onToggleLargeText}
                  />
                </div>

                {/* Backup and Restore: Export Data & Import Data */}
                <div className="pt-2 border-t border-stone-200 flex flex-col gap-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={onExportData}
                      className={`min-h-[46px] px-4 py-2.5 rounded-2xl border-2 font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                        highContrast
                          ? 'bg-white border-stone-950 text-stone-950 hover:bg-stone-100'
                          : palette.homeBtn
                      }`}
                    >
                      <Download className="w-4 h-4 shrink-0" strokeWidth={2.4} />
                      <span>{t.exportData}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`min-h-[46px] px-4 py-2.5 rounded-2xl border-2 font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${
                        highContrast
                          ? 'bg-white border-stone-950 text-stone-950 hover:bg-stone-100'
                          : palette.lockBtn
                      }`}
                    >
                      <Upload className="w-4 h-4 shrink-0" strokeWidth={2.4} />
                      <span>{t.importData}</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {importError && (
                    <p
                      role="alert"
                      className="text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl px-3.5 py-2 text-center"
                    >
                      {importError}
                    </p>
                  )}

                  <PWAInstallButton
                    theme={theme}
                    language={language}
                    highContrast={highContrast}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className={`min-h-[48px] w-full sm:w-auto px-7 py-2.5 rounded-2xl font-display font-extrabold text-base text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.focusOutline} ${palette.callNextBtn}`}
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={pendingBackup !== null}
        title={t.importConfirmTitle}
        message={t.importConfirmMessage}
        confirmLabel={t.yesImportData}
        cancelLabel={t.cancel}
        onConfirm={() => {
          if (pendingBackup) {
            onImportData(pendingBackup);
          }
          setPendingBackup(null);
        }}
        onCancel={() => setPendingBackup(null)}
      />
    </>
  );
}

interface SettingSwitchRowProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  highContrast: boolean;
  focusOutline: string;
  onToggle: () => void;
}

function SettingSwitchRow({
  icon,
  label,
  checked,
  highContrast,
  focusOutline,
  onToggle,
}: SettingSwitchRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`min-h-[52px] w-full px-4 py-2.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${focusOutline} ${
        highContrast
          ? 'bg-white border-stone-950 text-stone-950 hover:bg-stone-100'
          : 'bg-white border-stone-200 text-stone-900 hover:bg-stone-50'
      }`}
    >
      <span className="flex items-center gap-3 font-display font-bold text-base">
        <span className="text-stone-700">{icon}</span>
        <span>{label}</span>
      </span>

      <span
        aria-hidden="true"
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-colors ${
          checked
            ? 'bg-teal-600 border-teal-700'
            : highContrast
            ? 'bg-stone-300 border-stone-950'
            : 'bg-stone-200 border-stone-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
            checked ? 'translate-x-5.5' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}
