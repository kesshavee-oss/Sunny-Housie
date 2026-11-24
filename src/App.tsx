import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ConfettiBurst, ConfettiTrigger } from './components/ConfettiBurst';
import { HomeScreen } from './components/HomeScreen';
import { HostView } from './components/HostView';
import { PlaySetup } from './components/PlaySetup';
import { CompletedRowFlash, PlayTicketsView } from './components/PlayTicketsView';
import { PrintTicketsSheet } from './components/PrintTicketsSheet';
import { getPrizeDisplayName } from './components/PrizeBoard';
import { SettingsModal } from './components/SettingsModal';
import { ClaimFeedback } from './components/TicketCard';
import {
  AppView,
  CallHistoryEntry,
  HousieTicket,
  LanguageId,
  PastGameSummary,
  PatternClaim,
  PatternId,
  PrizeItem,
  ThemeId,
} from './types/housie';
import { I18N } from './utils/i18n';
import { getNewlyClaimablePrizes } from './utils/patterns';
import {
  playCallChime,
  playCheerSound,
  playTapPop,
  startBackgroundMusic,
  stopBackgroundMusic,
  unlockAudio,
} from './utils/sound';
import {
  applyBackupData,
  clearCallHistory,
  clearClaims,
  clearHostNumbers,
  clearHostTickets,
  clearPlayTickets,
  exportAllAppData,
  getTodayKey,
  loadCallHistory,
  loadClaims,
  loadHighContrast,
  loadHostNumbers,
  loadHostTickets,
  loadKidsMode,
  loadLanguage,
  loadLargeText,
  loadLockState,
  loadMusicPreference,
  loadPastGames,
  loadPlayTickets,
  loadPrizes,
  loadSoundPreference,
  loadTheme,
  loadVoicePreference,
  MAX_TOTAL_PRIZES,
  resetPrizeStatusesToOpen,
  saveCallHistory,
  saveClaims,
  saveHighContrast,
  saveHostNumbers,
  saveHostTickets,
  saveKidsMode,
  saveLanguage,
  saveLargeText,
  saveLockState,
  saveMusicPreference,
  savePastGameSummary,
  savePlayTickets,
  savePrizes,
  saveSoundPreference,
  saveTheme,
  saveVoicePreference,
} from './utils/storage';
import { THEMES } from './utils/themes';
import { generateUniqueTickets } from './utils/ticketGenerator';
import { speakCallout, stopSpeech } from './utils/voice';

function isInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.closest('input, textarea') !== null
  );
}

export default function App() {
  const [todayKey, setTodayKey] = useState<string>(() => getTodayKey());
  const [calledNumbers, setCalledNumbers] = useState<number[]>(() =>
    loadHostNumbers(getTodayKey())
  );
  const [hostTickets, setHostTickets] = useState<HousieTicket[] | null>(() =>
    loadHostTickets(getTodayKey())
  );
  const [tickets, setTickets] = useState<HousieTicket[] | null>(() =>
    loadPlayTickets(getTodayKey())
  );
  const [claims, setClaims] = useState<PatternClaim[]>(() =>
    loadClaims(getTodayKey())
  );
  const [prizes, setPrizes] = useState<PrizeItem[]>(() =>
    loadPrizes(getTodayKey())
  );
  const [callHistory, setCallHistory] = useState<CallHistoryEntry[]>(() =>
    loadCallHistory(getTodayKey())
  );
  const [pastGames, setPastGames] = useState<PastGameSummary[]>(() =>
    loadPastGames(getTodayKey())
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() =>
    loadSoundPreference()
  );
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() =>
    loadVoicePreference()
  );
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() =>
    loadMusicPreference()
  );
  const [theme, setTheme] = useState<ThemeId>(() => loadTheme());
  const [language, setLanguage] = useState<LanguageId>(() => loadLanguage());
  const [kidsMode, setKidsMode] = useState<boolean>(() => loadKidsMode());
  const [highContrast, setHighContrast] = useState<boolean>(() => loadHighContrast());
  const [largeText, setLargeText] = useState<boolean>(() => loadLargeText());
  const [showSettings, setShowSettings] = useState(false);

  const [confettiTrigger, setConfettiTrigger] = useState<ConfettiTrigger | null>(null);
  const [completedRowFlash, setCompletedRowFlash] = useState<CompletedRowFlash | null>(null);
  const [playClaimFeedback, setPlayClaimFeedback] = useState<Record<number, ClaimFeedback | null>>({});
  const [hostClaimFeedback, setHostClaimFeedback] = useState<Record<number, ClaimFeedback | null>>({});

  const confettiCounterRef = useRef(0);
  const rowFlashCounterRef = useRef(0);
  const claimFeedbackCounterRef = useRef(0);
  const hasUserTappedRef = useRef(false);

  // Restore active locked view on refresh so lock state cannot be bypassed by reloading
  const [initialSession] = useState(() => {
    const today = getTodayKey();
    const lock = loadLockState(today);
    const savedTickets = loadPlayTickets(today);
    if (lock?.locked) {
      if (lock.view === 'play' && !savedTickets) {
        saveLockState(null);
        return { view: 'home' as AppView, locked: false };
      }
      return { view: lock.view as AppView, locked: true };
    }
    return { view: 'home' as AppView, locked: false };
  });

  const [view, setView] = useState<AppView>(initialSession.view);
  const [isLocked, setIsLocked] = useState<boolean>(initialSession.locked);
  const lockGuardPushedRef = useRef(false);

  // Apply root accessibility & language attributes
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    if (largeText) {
      root.dataset.largeText = 'true';
    } else {
      delete root.dataset.largeText;
    }
    if (highContrast) {
      root.dataset.highContrast = 'true';
    } else {
      delete root.dataset.highContrast;
    }
  }, [language, largeText, highContrast]);

  // Block copy, cut, contextmenu, and dragstart outside input fields
  useEffect(() => {
    const preventOutsideInputs = (e: Event) => {
      if (isInputTarget(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener('copy', preventOutsideInputs);
    document.addEventListener('cut', preventOutsideInputs);
    document.addEventListener('contextmenu', preventOutsideInputs);
    document.addEventListener('dragstart', preventOutsideInputs);

    return () => {
      document.removeEventListener('copy', preventOutsideInputs);
      document.removeEventListener('cut', preventOutsideInputs);
      document.removeEventListener('contextmenu', preventOutsideInputs);
      document.removeEventListener('dragstart', preventOutsideInputs);
    };
  }, []);

  // Enforce daily rule if midnight passes while app stays open, archiving previous day first
  const syncDate = useCallback(() => {
    const current = getTodayKey();
    if (current !== todayKey) {
      if (calledNumbers.length > 0 || claims.length > 0) {
        savePastGameSummary(
          {
            date: todayKey,
            calledNumbers,
            claims,
            prizes,
            endedAt: Date.now(),
          },
          current
        );
      }

      setTodayKey(current);
      setCalledNumbers(loadHostNumbers(current));
      setHostTickets(loadHostTickets(current));
      setTickets(loadPlayTickets(current));
      setClaims(loadClaims(current));
      setPrizes(loadPrizes(current));
      setCallHistory(loadCallHistory(current));
      setPastGames(loadPastGames(current));
      setPlayClaimFeedback({});
      setHostClaimFeedback({});
      setIsLocked(false);
      saveLockState(null);
      setView('home');
    }
  }, [todayKey, calledNumbers, claims, prizes]);

  useEffect(() => {
    const interval = window.setInterval(syncDate, 30_000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncDate();
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || !e.key.startsWith('sunny_housie_')) return;
      const current = getTodayKey();
      setCalledNumbers(loadHostNumbers(current));
      setHostTickets(loadHostTickets(current));
      setTickets(loadPlayTickets(current));
      setClaims(loadClaims(current));
      setPrizes(loadPrizes(current));
      setCallHistory(loadCallHistory(current));
      setPastGames(loadPastGames(current));
    };
    window.addEventListener('focus', syncDate);
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', syncDate);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [syncDate]);

  // Lock screen protection: beforeunload warning + browser back-button trap
  useEffect(() => {
    if (!isLocked) {
      lockGuardPushedRef.current = false;
      return;
    }

    if (!lockGuardPushedRef.current) {
      try {
        window.history.pushState({ sunnyHousieLocked: true }, '');
        lockGuardPushedRef.current = true;
      } catch {
        // Ignore history restrictions in constrained frames
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = () => {
      try {
        window.history.pushState({ sunnyHousieLocked: true }, '');
      } catch {
        // Ignore
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isLocked]);

  // Unlock Web Audio on first user tap and manage Host background music loop
  useEffect(() => {
    const handleFirstTap = () => {
      hasUserTappedRef.current = true;
      unlockAudio();
      if (view === 'host' && musicEnabled) {
        startBackgroundMusic();
      }
    };

    window.addEventListener('pointerdown', handleFirstTap, { passive: true });
    window.addEventListener('keydown', handleFirstTap);
    return () => {
      window.removeEventListener('pointerdown', handleFirstTap);
      window.removeEventListener('keydown', handleFirstTap);
    };
  }, [view, musicEnabled]);

  useEffect(() => {
    if (view === 'host' && musicEnabled && hasUserTappedRef.current) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }

    if (view !== 'host') {
      stopSpeech();
    }

    return () => {
      stopBackgroundMusic();
    };
  }, [view, musicEnabled]);

  const handleSelectTheme = useCallback((nextTheme: ThemeId) => {
    setTheme(nextTheme);
    saveTheme(nextTheme);
  }, []);

  const handleSelectLanguage = useCallback((nextLang: LanguageId) => {
    setLanguage(nextLang);
    saveLanguage(nextLang);
  }, []);

  const handleToggleKidsMode = useCallback(() => {
    setKidsMode((prev) => {
      const next = !prev;
      saveKidsMode(next);
      return next;
    });
  }, []);

  const handleToggleHighContrast = useCallback(() => {
    setHighContrast((prev) => {
      const next = !prev;
      saveHighContrast(next);
      return next;
    });
  }, []);

  const handleToggleLargeText = useCallback(() => {
    setLargeText((prev) => {
      const next = !prev;
      saveLargeText(next);
      return next;
    });
  }, []);

  const handleExportData = useCallback(() => {
    const json = exportAllAppData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `housie-backup-${getTodayKey()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, []);

  const handleImportData = useCallback((data: Record<string, string>) => {
    applyBackupData(data);
    const current = getTodayKey();
    setTodayKey(current);
    setCalledNumbers(loadHostNumbers(current));
    setHostTickets(loadHostTickets(current));
    setTickets(loadPlayTickets(current));
    setClaims(loadClaims(current));
    setPrizes(loadPrizes(current));
    setCallHistory(loadCallHistory(current));
    setPastGames(loadPastGames(current));
    setSoundEnabled(loadSoundPreference());
    setVoiceEnabled(loadVoicePreference());
    setMusicEnabled(loadMusicPreference());
    setTheme(loadTheme());
    setLanguage(loadLanguage());
    setKidsMode(loadKidsMode());
    setHighContrast(loadHighContrast());
    setLargeText(loadLargeText());
    setPlayClaimFeedback({});
    setHostClaimFeedback({});
    setCompletedRowFlash(null);
    setIsLocked(false);
    saveLockState(null);
  }, []);

  const handlePrintTickets = useCallback(() => {
    window.print();
  }, []);

  const handleLock = useCallback((targetView: 'host' | 'play') => {
    const today = getTodayKey();
    setIsLocked(true);
    saveLockState({ locked: true, view: targetView, date: today });
  }, []);

  const handleUnlock = useCallback(() => {
    setIsLocked(false);
    saveLockState(null);
  }, []);

  const handleToggleSound = useCallback(() => {
    hasUserTappedRef.current = true;
    unlockAudio();
    setSoundEnabled((prev) => {
      const next = !prev;
      saveSoundPreference(next);
      return next;
    });
  }, []);

  const handleToggleVoice = useCallback(() => {
    hasUserTappedRef.current = true;
    setVoiceEnabled((prev) => {
      const next = !prev;
      saveVoicePreference(next);
      if (!next) {
        stopSpeech();
      }
      return next;
    });
  }, []);

  const handleToggleMusic = useCallback(() => {
    hasUserTappedRef.current = true;
    unlockAudio();
    setMusicEnabled((prev) => {
      const next = !prev;
      saveMusicPreference(next);
      if (next && view === 'host') {
        startBackgroundMusic();
      } else {
        stopBackgroundMusic();
      }
      return next;
    });
  }, [view]);

  // Shared helper for toggling a mark on a ticket list
  const computeMarkedUpdate = useCallback(
    (sourceTickets: HousieTicket[], ticketNumber: number, num: number) => {
      let completedRowIdx: number | null = null;
      let wasMarking = false;

      const updated = sourceTickets.map((ticket) => {
        if (ticket.ticketNumber !== ticketNumber) return ticket;
        const exists = ticket.markedNumbers.includes(num);
        wasMarking = !exists;
        const nextMarked = exists
          ? ticket.markedNumbers.filter((n) => n !== num)
          : [...ticket.markedNumbers, num];

        if (!exists) {
          const nextSet = new Set(nextMarked);
          const rowIndex = ticket.grid.findIndex((row) => {
            const rowNums = row.filter((cell): cell is number => cell !== null);
            return rowNums.includes(num) && rowNums.every((n) => nextSet.has(n));
          });
          if (rowIndex !== -1) {
            completedRowIdx = rowIndex;
          }
        }

        return {
          ...ticket,
          markedNumbers: nextMarked,
        };
      });

      if (completedRowIdx !== null) {
        rowFlashCounterRef.current += 1;
        setCompletedRowFlash({
          ticketNumber,
          rowIndex: completedRowIdx,
          id: rowFlashCounterRef.current,
        });
      }

      if (soundEnabled) {
        playTapPop(wasMarking);
      }

      return updated;
    },
    [soundEnabled]
  );

  // Shared claim validation and award handler
  const handleClaimForSource = useCallback(
    (
      source: 'play' | 'host',
      sourceTickets: HousieTicket[] | null,
      ticketNumber: number,
      setFeedback: Dispatch<SetStateAction<Record<number, ClaimFeedback | null>>>
    ) => {
      if (!sourceTickets) return;
      const ticket = sourceTickets.find((t) => t.ticketNumber === ticketNumber);
      if (!ticket) return;

      const claimedPrizeIds = new Set(claims.map((c) => c.prizeId ?? c.patternId));
      const { validMarks, qualifiedPrizes } = getNewlyClaimablePrizes(
        ticket,
        calledNumbers,
        prizes,
        claimedPrizeIds
      );

      claimFeedbackCounterRef.current += 1;
      const feedbackId = claimFeedbackCounterRef.current;

      if (!validMarks || qualifiedPrizes.length === 0) {
        setFeedback((prev) => ({
          ...prev,
          [ticketNumber]: { status: 'notYet', id: feedbackId },
        }));
        return;
      }

      const today = getTodayKey();
      const defaultPrefix = I18N[language].ticketPrefix;
      const ticketName = ticket.customName?.trim() || `${defaultPrefix} ${ticket.ticketNumber}`;
      const now = Date.now();

      const newClaims: PatternClaim[] = qualifiedPrizes.map((prize) => ({
        prizeId: prize.id,
        prizeName: getPrizeDisplayName(prize, language),
        patternId: prize.rule,
        ticketNumber: ticket.ticketNumber,
        ticketName,
        source,
        claimedAt: now,
      }));

      const nextClaims = [...claims, ...newClaims];
      setClaims(nextClaims);
      saveClaims(nextClaims, today);

      const wonPrizeIdSet = new Set(qualifiedPrizes.map((p) => p.id));
      const nextPrizes: PrizeItem[] = prizes.map((p) =>
        wonPrizeIdSet.has(p.id)
          ? {
              ...p,
              status: 'won',
              wonByTicketName: ticketName,
              wonByTicketNumber: ticket.ticketNumber,
              wonBySource: source,
              wonAt: now,
            }
          : p
      );
      setPrizes(nextPrizes);
      savePrizes(nextPrizes, today);

      const wonLabels = qualifiedPrizes.map((p) => getPrizeDisplayName(p, language));
      const wonRules = qualifiedPrizes.map((p) => p.rule);
      setFeedback((prev) => ({
        ...prev,
        [ticketNumber]: {
          status: 'won',
          patterns: wonRules,
          wonLabels,
          id: feedbackId,
        },
      }));

      const isFullHouseWin = qualifiedPrizes.some(
        (p) => p.id === 'fullHouse' || p.rule === 'fullHouse'
      );
      confettiCounterRef.current += 1;
      setConfettiTrigger({
        id: confettiCounterRef.current,
        type: isFullHouseWin ? 'fullHouse' : 'row',
      });

      if (soundEnabled) {
        playCheerSound();
      }
    },
    [claims, prizes, calledNumbers, soundEnabled, language]
  );

  // Host actions
  const handleCallNext = useCallback(() => {
    const today = getTodayKey();
    if (calledNumbers.length >= 90) return;

    const calledSet = new Set(calledNumbers);
    const available: number[] = [];
    for (let n = 1; n <= 90; n++) {
      if (!calledSet.has(n)) {
        available.push(n);
      }
    }
    if (available.length === 0) return;

    const randomIdx = Math.floor(Math.random() * available.length);
    const nextNum = available[randomIdx];
    const updatedNumbers = [...calledNumbers, nextNum];
    const updatedHistory = [...callHistory, { number: nextNum, calledAt: Date.now() }];

    setCalledNumbers(updatedNumbers);
    saveHostNumbers(updatedNumbers, today);
    setCallHistory(updatedHistory);
    saveCallHistory(updatedHistory, today);

    hasUserTappedRef.current = true;
    unlockAudio();

    if (soundEnabled) {
      playCallChime();
    }
    if (voiceEnabled) {
      speakCallout(nextNum, language);
    }
  }, [calledNumbers, callHistory, soundEnabled, voiceEnabled, language]);

  const handleStartOverHost = useCallback(() => {
    const today = getTodayKey();
    setCalledNumbers([]);
    clearHostNumbers(today);
    setCallHistory([]);
    clearCallHistory(today);
  }, []);

  const handleEndTodaysGame = useCallback(() => {
    const today = getTodayKey();
    const updatedPast = savePastGameSummary(
      {
        date: today,
        calledNumbers,
        claims,
        prizes,
        endedAt: Date.now(),
      },
      today
    );
    setPastGames(updatedPast);

    const resetPrizes = resetPrizeStatusesToOpen(prizes);
    setPrizes(resetPrizes);
    savePrizes(resetPrizes, today);

    setCalledNumbers([]);
    clearHostNumbers(today);
    setCallHistory([]);
    clearCallHistory(today);
    setClaims([]);
    clearClaims(today);
    setPlayClaimFeedback({});
    setHostClaimFeedback({});
    setView('home');
  }, [calledNumbers, claims, prizes]);

  const handleClearHistory = useCallback(() => {
    const today = getTodayKey();
    setCallHistory([]);
    clearCallHistory(today);
  }, []);

  const handleChangePrizeReward = useCallback(
    (prizeId: string, reward: string) => {
      const today = getTodayKey();
      const updated = prizes.map((p) =>
        p.id === prizeId ? { ...p, reward: reward.slice(0, 40) } : p
      );
      setPrizes(updated);
      savePrizes(updated, today);
    },
    [prizes]
  );

  const handleRenamePrize = useCallback(
    (prizeId: string, customName: string) => {
      const trimmed = customName.trim().slice(0, 30);
      if (!trimmed) return;
      const today = getTodayKey();
      const updated = prizes.map((p) =>
        p.id === prizeId ? { ...p, customName: trimmed } : p
      );
      setPrizes(updated);
      savePrizes(updated, today);

      const hasClaim = claims.some((c) => (c.prizeId ?? c.patternId) === prizeId);
      if (hasClaim) {
        const updatedClaims = claims.map((c) =>
          (c.prizeId ?? c.patternId) === prizeId ? { ...c, prizeName: trimmed } : c
        );
        setClaims(updatedClaims);
        saveClaims(updatedClaims, today);
      }
    },
    [prizes, claims]
  );

  const handleChangePrizeRule = useCallback(
    (prizeId: string, rule: PatternId) => {
      const today = getTodayKey();
      const updated = prizes.map((p) =>
        p.id === prizeId && !p.isDefault ? { ...p, rule } : p
      );
      setPrizes(updated);
      savePrizes(updated, today);
    },
    [prizes]
  );

  const handleAddPrize = useCallback((): PrizeItem | null => {
    if (prizes.length >= MAX_TOTAL_PRIZES) return null;
    const today = getTodayKey();
    const nextNumber = prizes.length + 1;
    const defaultLabel = `${I18N[language].prizePlaceholder} ${nextNumber}`;
    const created: PrizeItem = {
      id: `extra_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      customName: defaultLabel,
      reward: '',
      rule: 'earlyFive',
      isDefault: false,
      status: 'open',
    };
    const updated = [...prizes, created];
    setPrizes(updated);
    savePrizes(updated, today);
    return created;
  }, [prizes, language]);

  const handleRemovePrize = useCallback(
    (prizeId: string) => {
      const today = getTodayKey();
      const updated = prizes.filter((p) => p.isDefault || p.id !== prizeId);
      setPrizes(updated);
      savePrizes(updated, today);

      const remainingClaims = claims.filter(
        (c) => (c.prizeId ?? c.patternId) !== prizeId
      );
      if (remainingClaims.length !== claims.length) {
        setClaims(remainingClaims);
        saveClaims(remainingClaims, today);
      }
    },
    [prizes, claims]
  );

  const handleGenerateHostTickets = useCallback((count: number) => {
    const today = getTodayKey();
    const generated = generateUniqueTickets(count);
    setHostTickets(generated);
    saveHostTickets(generated, today);
    setHostClaimFeedback({});
  }, []);

  const handleToggleHostMark = useCallback(
    (ticketNumber: number, num: number) => {
      if (!hostTickets) return;
      const today = getTodayKey();
      const updated = computeMarkedUpdate(hostTickets, ticketNumber, num);
      setHostTickets(updated);
      saveHostTickets(updated, today);
      setHostClaimFeedback((prev) =>
        prev[ticketNumber]?.status === 'notYet'
          ? { ...prev, [ticketNumber]: null }
          : prev
      );
    },
    [hostTickets, computeMarkedUpdate]
  );

  const handleRenameHostTicket = useCallback(
    (ticketNumber: number, customName?: string) => {
      if (!hostTickets) return;
      const today = getTodayKey();
      const updated = hostTickets.map((ticket) => {
        if (ticket.ticketNumber !== ticketNumber) return ticket;
        const copy = { ...ticket };
        if (customName) {
          copy.customName = customName;
        } else {
          delete copy.customName;
        }
        return copy;
      });
      setHostTickets(updated);
      saveHostTickets(updated, today);

      const newLabel = customName?.trim() || `${I18N[language].ticketPrefix} ${ticketNumber}`;
      const hasMatchingClaim = claims.some(
        (c) => c.source === 'host' && c.ticketNumber === ticketNumber
      );
      if (hasMatchingClaim) {
        const updatedClaims = claims.map((c) =>
          c.source === 'host' && c.ticketNumber === ticketNumber
            ? { ...c, ticketName: newLabel }
            : c
        );
        setClaims(updatedClaims);
        saveClaims(updatedClaims, today);
      }
    },
    [hostTickets, claims, language]
  );

  const handleClaimHostTicket = useCallback(
    (ticketNumber: number) => {
      handleClaimForSource('host', hostTickets, ticketNumber, setHostClaimFeedback);
    },
    [handleClaimForSource, hostTickets]
  );

  const handleResetHostTickets = useCallback(() => {
    const today = getTodayKey();
    setHostTickets(null);
    setCompletedRowFlash(null);
    setHostClaimFeedback({});
    clearHostTickets(today);

    const remainingClaims = claims.filter((c) => c.source !== 'host');
    setClaims(remainingClaims);
    saveClaims(remainingClaims, today);

    const remainingPrizeIds = new Set(
      remainingClaims.map((c) => c.prizeId ?? c.patternId)
    );
    const updatedPrizes: PrizeItem[] = prizes.map((p) => {
      if (p.wonBySource === 'host' || (p.status === 'won' && !remainingPrizeIds.has(p.id))) {
        return {
          id: p.id,
          ...(p.customName ? { customName: p.customName } : {}),
          reward: p.reward,
          rule: p.rule,
          isDefault: p.isDefault,
          status: 'open',
        };
      }
      return p;
    });
    setPrizes(updatedPrizes);
    savePrizes(updatedPrizes, today);
  }, [claims, prizes]);

  // Play actions
  const handleGenerateTickets = useCallback((count: number) => {
    const today = getTodayKey();
    const generated = generateUniqueTickets(count);
    setTickets(generated);
    savePlayTickets(generated, today);
    setPlayClaimFeedback({});
  }, []);

  const handleRenameTicket = useCallback(
    (ticketNumber: number, customName?: string) => {
      if (!tickets) return;
      const today = getTodayKey();
      const updated = tickets.map((ticket) => {
        if (ticket.ticketNumber !== ticketNumber) return ticket;
        const copy = { ...ticket };
        if (customName) {
          copy.customName = customName;
        } else {
          delete copy.customName;
        }
        return copy;
      });
      setTickets(updated);
      savePlayTickets(updated, today);

      const newLabel = customName?.trim() || `${I18N[language].ticketPrefix} ${ticketNumber}`;
      const hasMatchingClaim = claims.some(
        (c) => c.source === 'play' && c.ticketNumber === ticketNumber
      );
      if (hasMatchingClaim) {
        const updatedClaims = claims.map((c) =>
          c.source === 'play' && c.ticketNumber === ticketNumber
            ? { ...c, ticketName: newLabel }
            : c
        );
        setClaims(updatedClaims);
        saveClaims(updatedClaims, today);
      }
    },
    [tickets, claims, language]
  );

  const handleToggleMark = useCallback(
    (ticketNumber: number, num: number) => {
      if (!tickets) return;
      const today = getTodayKey();
      const updated = computeMarkedUpdate(tickets, ticketNumber, num);
      setTickets(updated);
      savePlayTickets(updated, today);
      setPlayClaimFeedback((prev) =>
        prev[ticketNumber]?.status === 'notYet'
          ? { ...prev, [ticketNumber]: null }
          : prev
      );
    },
    [tickets, computeMarkedUpdate]
  );

  const handleClaimTicket = useCallback(
    (ticketNumber: number) => {
      handleClaimForSource('play', tickets, ticketNumber, setPlayClaimFeedback);
    },
    [handleClaimForSource, tickets]
  );

  const handleResetTickets = useCallback(() => {
    const today = getTodayKey();
    setTickets(null);
    setCompletedRowFlash(null);
    setPlayClaimFeedback({});
    setHostClaimFeedback({});
    clearPlayTickets(today);

    setClaims([]);
    clearClaims(today);

    const resetPrizes = resetPrizeStatusesToOpen(prizes);
    setPrizes(resetPrizes);
    savePrizes(resetPrizes, today);
  }, [prizes]);

  const handleBackHome = useCallback(() => {
    if (isLocked) return;
    syncDate();
    setView('home');
  }, [isLocked, syncDate]);

  const activePalette = THEMES[theme];
  const transitionKey =
    view === 'play'
      ? !tickets || tickets.length === 0
        ? 'play-setup'
        : 'play-tickets'
      : view;

  const printableTickets = view === 'host' ? hostTickets : tickets;

  return (
    <MotionConfig reducedMotion="user">
      <div className="print:hidden">
        <ConfettiBurst trigger={confettiTrigger} colors={activePalette.confettiColors} />

        <AnimatePresence mode="wait">
          <motion.div
            key={transitionKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {view === 'host' ? (
              <HostView
                calledNumbers={calledNumbers}
                hostTickets={hostTickets}
                claims={claims}
                prizes={prizes}
                history={callHistory}
                completedRowFlash={completedRowFlash}
                claimFeedbackByTicket={hostClaimFeedback}
                isLocked={isLocked}
                soundEnabled={soundEnabled}
                voiceEnabled={voiceEnabled}
                musicEnabled={musicEnabled}
                theme={theme}
                language={language}
                kidsMode={kidsMode}
                highContrast={highContrast}
                onSelectTheme={handleSelectTheme}
                onCallNext={handleCallNext}
                onStartOver={handleStartOverHost}
                onEndTodaysGame={handleEndTodaysGame}
                onPrintTickets={handlePrintTickets}
                onGenerateHostTickets={handleGenerateHostTickets}
                onToggleHostMark={handleToggleHostMark}
                onRenameHostTicket={handleRenameHostTicket}
                onClaimHostTicket={handleClaimHostTicket}
                onResetHostTickets={handleResetHostTickets}
                onChangePrizeReward={handleChangePrizeReward}
                onRenamePrize={handleRenamePrize}
                onChangePrizeRule={handleChangePrizeRule}
                onAddPrize={handleAddPrize}
                onRemovePrize={handleRemovePrize}
                onClearHistory={handleClearHistory}
                onBackHome={handleBackHome}
                onLock={() => handleLock('host')}
                onUnlock={handleUnlock}
                onToggleSound={handleToggleSound}
                onToggleVoice={handleToggleVoice}
                onToggleMusic={handleToggleMusic}
              />
            ) : view === 'play' ? (
              !tickets || tickets.length === 0 ? (
                <PlaySetup
                  theme={theme}
                  language={language}
                  kidsMode={kidsMode}
                  highContrast={highContrast}
                  onSelectTheme={handleSelectTheme}
                  onGenerate={handleGenerateTickets}
                  onBackHome={handleBackHome}
                />
              ) : (
                <PlayTicketsView
                  tickets={tickets}
                  claims={claims}
                  prizes={prizes}
                  isLocked={isLocked}
                  soundEnabled={soundEnabled}
                  theme={theme}
                  language={language}
                  kidsMode={kidsMode}
                  highContrast={highContrast}
                  completedRowFlash={completedRowFlash}
                  claimFeedbackByTicket={playClaimFeedback}
                  onSelectTheme={handleSelectTheme}
                  onToggleMark={handleToggleMark}
                  onRenameTicket={handleRenameTicket}
                  onClaimTicket={handleClaimTicket}
                  onPrintTickets={handlePrintTickets}
                  onResetTickets={handleResetTickets}
                  onBackHome={handleBackHome}
                  onLock={() => handleLock('play')}
                  onUnlock={handleUnlock}
                  onToggleSound={handleToggleSound}
                />
              )
            ) : (
              <HomeScreen
                calledCountToday={calledNumbers.length}
                ticketCountToday={tickets ? tickets.length : 0}
                pastGames={pastGames}
                theme={theme}
                language={language}
                kidsMode={kidsMode}
                highContrast={highContrast}
                onOpenSettings={() => setShowSettings(true)}
                onSelectHost={() => {
                  syncDate();
                  setView('host');
                }}
                onSelectPlay={() => {
                  syncDate();
                  setView('play');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <SettingsModal
          isOpen={showSettings}
          theme={theme}
          language={language}
          kidsMode={kidsMode}
          highContrast={highContrast}
          largeText={largeText}
          onSelectTheme={handleSelectTheme}
          onSelectLanguage={handleSelectLanguage}
          onToggleKidsMode={handleToggleKidsMode}
          onToggleHighContrast={handleToggleHighContrast}
          onToggleLargeText={handleToggleLargeText}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onClose={() => setShowSettings(false)}
        />
      </div>

      <PrintTicketsSheet tickets={printableTickets} language={language} />
    </MotionConfig>
  );
}
