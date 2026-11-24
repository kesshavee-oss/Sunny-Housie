import {
  CallHistoryEntry,
  HostGameState,
  HousieTicket,
  LanguageId,
  LockState,
  PastGameSummary,
  PatternClaim,
  PatternId,
  PlayGameState,
  PrizeItem,
  PrizeMap,
  ThemeId,
  WINNING_PATTERNS,
} from '../types/housie';

const APP_KEY_PREFIX = 'sunny_housie_';
const HOST_PREFIX = 'sunny_housie_host_';
const HOST_TICKETS_PREFIX = 'sunny_housie_host_tickets_';
const PLAY_PREFIX = 'sunny_housie_play_';
const CLAIMS_PREFIX = 'sunny_housie_claims_';
const PRIZES_PREFIX = 'sunny_housie_prizes_';
const HISTORY_PREFIX = 'sunny_housie_history_';
const PAST_GAMES_KEY = 'sunny_housie_past_games';
const LOCK_KEY = 'sunny_housie_lock';
const SOUND_KEY = 'sunny_housie_sound';
const VOICE_KEY = 'sunny_housie_voice';
const MUSIC_KEY = 'sunny_housie_music';
const THEME_KEY = 'sunny_housie_theme';
const LANG_KEY = 'sunny_housie_lang';
const KIDS_MODE_KEY = 'sunny_housie_kids_mode';
const HIGH_CONTRAST_KEY = 'sunny_housie_high_contrast';
const LARGE_TEXT_KEY = 'sunny_housie_large_text';

const MAX_PAST_GAME_DAYS = 30;
const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const DEFAULT_PRIZES: PrizeMap = {
  earlyFive: '',
  topLine: '',
  middleLine: '',
  bottomLine: '',
  fullHouse: '',
};

/**
 * Returns today's local calendar date as YYYY-MM-DD.
 * Using local year/month/day ensures daily reset aligns with the family's local midnight.
 */
export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKeyMs(dateKey: string): number | null {
  if (!DATE_KEY_REGEX.test(dateKey)) return null;
  const [y, m, d] = dateKey.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

const VALID_RULES = new Set<PatternId>([
  'earlyFive',
  'topLine',
  'middleLine',
  'bottomLine',
  'fullHouse',
]);

export const MAX_TOTAL_PRIZES = 10;

export function createDefaultPrizeList(): PrizeItem[] {
  return WINNING_PATTERNS.map((p) => ({
    id: p.id,
    reward: '',
    rule: p.id,
    isDefault: true,
    status: 'open',
  }));
}

export function toLegacyPrizeMap(items: PrizeItem[]): PrizeMap {
  const map: PrizeMap = { ...DEFAULT_PRIZES };
  for (const item of items) {
    if (item.isDefault && VALID_RULES.has(item.id as PatternId)) {
      map[item.id as PatternId] = item.reward;
    }
  }
  return map;
}

export function sanitizePrizeList(
  rawItems: unknown,
  fallbackMap?: Partial<PrizeMap> | null
): PrizeItem[] {
  if (!Array.isArray(rawItems)) {
    const defaults = createDefaultPrizeList();
    if (fallbackMap) {
      const legacy = sanitizePrizeMap(fallbackMap);
      return defaults.map((item) => ({
        ...item,
        reward: legacy[item.id as PatternId] ?? '',
      }));
    }
    return defaults;
  }

  const byId = new Map<string, PrizeItem>();
  const extras: PrizeItem[] = [];

  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') continue;
    const obj = raw as Partial<PrizeItem>;
    if (typeof obj.id !== 'string' || !obj.id) continue;

    const isDefault = VALID_RULES.has(obj.id as PatternId);
    const rule: PatternId = isDefault
      ? (obj.id as PatternId)
      : VALID_RULES.has(obj.rule as PatternId)
      ? (obj.rule as PatternId)
      : 'earlyFive';

    const clean: PrizeItem = {
      id: obj.id,
      reward: typeof obj.reward === 'string' ? obj.reward.slice(0, 40) : '',
      rule,
      isDefault,
      status: obj.status === 'won' ? 'won' : 'open',
    };

    if (typeof obj.customName === 'string' && obj.customName.trim().length > 0) {
      clean.customName = obj.customName.trim().slice(0, 30);
    }
    if (clean.status === 'won') {
      if (typeof obj.wonByTicketName === 'string') clean.wonByTicketName = obj.wonByTicketName;
      if (typeof obj.wonByTicketNumber === 'number') clean.wonByTicketNumber = obj.wonByTicketNumber;
      if (obj.wonBySource === 'host' || obj.wonBySource === 'play') clean.wonBySource = obj.wonBySource;
      if (typeof obj.wonAt === 'number') clean.wonAt = obj.wonAt;
    }

    if (isDefault) {
      byId.set(obj.id, clean);
    } else {
      extras.push(clean);
    }
  }

  const defaults = createDefaultPrizeList().map((def) => byId.get(def.id) ?? def);
  return [...defaults, ...extras].slice(0, MAX_TOTAL_PRIZES);
}

export function resetPrizeStatusesToOpen(items: PrizeItem[]): PrizeItem[] {
  return items.map((item) => ({
    id: item.id,
    ...(item.customName ? { customName: item.customName } : {}),
    reward: item.reward,
    rule: item.rule,
    isDefault: item.isDefault,
    status: 'open',
  }));
}

function sanitizePrizeMap(raw?: Partial<PrizeMap> | null): PrizeMap {
  return {
    earlyFive: typeof raw?.earlyFive === 'string' ? raw.earlyFive : '',
    topLine: typeof raw?.topLine === 'string' ? raw.topLine : '',
    middleLine: typeof raw?.middleLine === 'string' ? raw.middleLine : '',
    bottomLine: typeof raw?.bottomLine === 'string' ? raw.bottomLine : '',
    fullHouse: typeof raw?.fullHouse === 'string' ? raw.fullHouse : '',
  };
}

function prunePastGames(
  entries: PastGameSummary[],
  today: string = getTodayKey()
): PastGameSummary[] {
  const todayMs = parseDateKeyMs(today);
  const byDate = new Map<string, PastGameSummary>();

  for (const entry of entries) {
    if (!entry || typeof entry.date !== 'string') continue;
    const entryMs = parseDateKeyMs(entry.date);
    if (entryMs === null) continue;
    if (todayMs !== null) {
      const ageDays = Math.floor((todayMs - entryMs) / 86_400_000);
      if (ageDays >= MAX_PAST_GAME_DAYS) continue;
    }

    const existing = byDate.get(entry.date);
    if (!existing || (entry.endedAt ?? 0) >= (existing.endedAt ?? 0)) {
      byDate.set(entry.date, {
        date: entry.date,
        calledNumbers: Array.isArray(entry.calledNumbers)
          ? entry.calledNumbers.filter((n): n is number => typeof n === 'number' && n >= 1 && n <= 90)
          : [],
        claims: Array.isArray(entry.claims) ? entry.claims : [],
        prizes: Array.isArray(entry.prizes)
          ? sanitizePrizeList(entry.prizes)
          : sanitizePrizeMap(entry.prizes),
        endedAt: typeof entry.endedAt === 'number' ? entry.endedAt : entryMs ?? Date.now(),
      });
    }
  }

  return Array.from(byDate.values())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_PAST_GAME_DAYS);
}

export function loadPastGames(today: string = getTodayKey()): PastGameSummary[] {
  try {
    const raw = localStorage.getItem(PAST_GAMES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const pruned = prunePastGames(parsed as PastGameSummary[], today);
    if (pruned.length !== parsed.length) {
      localStorage.setItem(PAST_GAMES_KEY, JSON.stringify(pruned));
    }
    return pruned;
  } catch {
    return [];
  }
}

export function savePastGameSummary(
  summary: PastGameSummary,
  today: string = getTodayKey()
): PastGameSummary[] {
  const current = loadPastGames(today);
  const next = prunePastGames([summary, ...current], today);
  try {
    localStorage.setItem(PAST_GAMES_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors
  }
  return next;
}

/**
 * Archives any previous days' game state into Past Games before daily keys are cleaned up.
 */
function archivePreviousDays(today: string): void {
  try {
    const previousDates = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      let datePart: string | null = null;
      if (key.startsWith(HOST_TICKETS_PREFIX)) {
        datePart = key.slice(HOST_TICKETS_PREFIX.length);
      } else if (key.startsWith(HOST_PREFIX)) {
        datePart = key.slice(HOST_PREFIX.length);
      } else if (key.startsWith(CLAIMS_PREFIX)) {
        datePart = key.slice(CLAIMS_PREFIX.length);
      } else if (key.startsWith(PRIZES_PREFIX)) {
        datePart = key.slice(PRIZES_PREFIX.length);
      }

      if (datePart && DATE_KEY_REGEX.test(datePart) && datePart !== today) {
        previousDates.add(datePart);
      }
    }

    if (previousDates.size === 0) return;

    const existingPast = loadPastGames(today);
    const existingDates = new Set(existingPast.map((g) => g.date));
    const newlyArchived: PastGameSummary[] = [];

    for (const date of previousDates) {
      if (existingDates.has(date)) continue;

      let calledNumbers: number[] = [];
      let claims: PatternClaim[] = [];
      let prizes: PrizeMap | PrizeItem[] = createDefaultPrizeList();

      try {
        const hostRaw = localStorage.getItem(`${HOST_PREFIX}${date}`);
        if (hostRaw) {
          const parsed = JSON.parse(hostRaw) as Partial<HostGameState>;
          if (Array.isArray(parsed.calledNumbers)) {
            calledNumbers = parsed.calledNumbers.filter(
              (n): n is number => typeof n === 'number' && n >= 1 && n <= 90
            );
          }
        }
      } catch {
        // Ignore corrupt previous day host entry
      }

      try {
        const claimsRaw = localStorage.getItem(`${CLAIMS_PREFIX}${date}`);
        if (claimsRaw) {
          const parsed = JSON.parse(claimsRaw) as { claims?: PatternClaim[] };
          if (Array.isArray(parsed.claims)) {
            claims = parsed.claims;
          }
        }
      } catch {
        // Ignore corrupt previous day claims
      }

      try {
        const prizesRaw = localStorage.getItem(`${PRIZES_PREFIX}${date}`);
        if (prizesRaw) {
          const parsed = JSON.parse(prizesRaw) as {
            items?: unknown;
            prizes?: Partial<PrizeMap>;
          };
          prizes = sanitizePrizeList(parsed.items, parsed.prizes);
        }
      } catch {
        // Ignore corrupt previous day prizes
      }

      if (calledNumbers.length > 0 || claims.length > 0) {
        const dateMs = parseDateKeyMs(date);
        newlyArchived.push({
          date,
          calledNumbers,
          claims,
          prizes,
          endedAt: dateMs ?? Date.now(),
        });
      }
    }

    if (newlyArchived.length > 0) {
      const merged = prunePastGames([...newlyArchived, ...existingPast], today);
      localStorage.setItem(PAST_GAMES_KEY, JSON.stringify(merged));
    }
  } catch {
    // Ignore storage issues
  }
}

/**
 * Removes any daily storage keys from previous days after archiving their game summaries.
 */
export function cleanupPreviousDays(today: string = getTodayKey()): void {
  archivePreviousDays(today);
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith(HOST_TICKETS_PREFIX)) {
        if (key !== `${HOST_TICKETS_PREFIX}${today}`) {
          keysToRemove.push(key);
        }
      } else if (key.startsWith(HOST_PREFIX)) {
        if (key !== `${HOST_PREFIX}${today}`) {
          keysToRemove.push(key);
        }
      } else if (key.startsWith(PLAY_PREFIX)) {
        if (key !== `${PLAY_PREFIX}${today}`) {
          keysToRemove.push(key);
        }
      } else if (key.startsWith(CLAIMS_PREFIX)) {
        if (key !== `${CLAIMS_PREFIX}${today}`) {
          keysToRemove.push(key);
        }
      } else if (key.startsWith(PRIZES_PREFIX)) {
        if (key !== `${PRIZES_PREFIX}${today}`) {
          keysToRemove.push(key);
        }
      } else if (key.startsWith(HISTORY_PREFIX)) {
        if (key !== `${HISTORY_PREFIX}${today}`) {
          keysToRemove.push(key);
        }
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage access issues
  }
}

export function loadHostNumbers(today: string = getTodayKey()): number[] {
  cleanupPreviousDays(today);
  try {
    const raw = localStorage.getItem(`${HOST_PREFIX}${today}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<HostGameState>;
    if (parsed.date !== today || !Array.isArray(parsed.calledNumbers)) {
      return [];
    }
    return parsed.calledNumbers.filter(
      (n): n is number => typeof n === 'number' && n >= 1 && n <= 90
    );
  } catch {
    return [];
  }
}

export function saveHostNumbers(calledNumbers: number[], today: string = getTodayKey()): void {
  try {
    const payload: HostGameState = { date: today, calledNumbers };
    localStorage.setItem(`${HOST_PREFIX}${today}`, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearHostNumbers(today: string = getTodayKey()): void {
  try {
    localStorage.removeItem(`${HOST_PREFIX}${today}`);
  } catch {
    // Ignore
  }
}

export function loadPlayTickets(today: string = getTodayKey()): HousieTicket[] | null {
  cleanupPreviousDays(today);
  try {
    const raw = localStorage.getItem(`${PLAY_PREFIX}${today}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlayGameState>;
    if (parsed.date !== today || !Array.isArray(parsed.tickets) || parsed.tickets.length === 0) {
      return null;
    }
    return parsed.tickets;
  } catch {
    return null;
  }
}

export function savePlayTickets(tickets: HousieTicket[], today: string = getTodayKey()): void {
  try {
    const payload: PlayGameState = { date: today, tickets };
    localStorage.setItem(`${PLAY_PREFIX}${today}`, JSON.stringify(payload));
  } catch {
    // Ignore
  }
}

export function clearPlayTickets(today: string = getTodayKey()): void {
  try {
    localStorage.removeItem(`${PLAY_PREFIX}${today}`);
  } catch {
    // Ignore
  }
}

export function loadHostTickets(today: string = getTodayKey()): HousieTicket[] | null {
  cleanupPreviousDays(today);
  try {
    const raw = localStorage.getItem(`${HOST_TICKETS_PREFIX}${today}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlayGameState>;
    if (parsed.date !== today || !Array.isArray(parsed.tickets) || parsed.tickets.length === 0) {
      return null;
    }
    return parsed.tickets;
  } catch {
    return null;
  }
}

export function saveHostTickets(tickets: HousieTicket[], today: string = getTodayKey()): void {
  try {
    const payload: PlayGameState = { date: today, tickets };
    localStorage.setItem(`${HOST_TICKETS_PREFIX}${today}`, JSON.stringify(payload));
  } catch {
    // Ignore
  }
}

export function clearHostTickets(today: string = getTodayKey()): void {
  try {
    localStorage.removeItem(`${HOST_TICKETS_PREFIX}${today}`);
  } catch {
    // Ignore
  }
}

export function loadClaims(today: string = getTodayKey()): PatternClaim[] {
  cleanupPreviousDays(today);
  try {
    const raw = localStorage.getItem(`${CLAIMS_PREFIX}${today}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { date?: string; claims?: PatternClaim[] };
    if (parsed.date !== today || !Array.isArray(parsed.claims)) {
      return [];
    }
    return parsed.claims;
  } catch {
    return [];
  }
}

export function saveClaims(claims: PatternClaim[], today: string = getTodayKey()): void {
  try {
    localStorage.setItem(`${CLAIMS_PREFIX}${today}`, JSON.stringify({ date: today, claims }));
  } catch {
    // Ignore
  }
}

export function clearClaims(today: string = getTodayKey()): void {
  try {
    localStorage.removeItem(`${CLAIMS_PREFIX}${today}`);
  } catch {
    // Ignore
  }
}

export function loadPrizes(today: string = getTodayKey()): PrizeItem[] {
  cleanupPreviousDays(today);
  try {
    const raw = localStorage.getItem(`${PRIZES_PREFIX}${today}`);
    if (!raw) return createDefaultPrizeList();
    const parsed = JSON.parse(raw) as {
      date?: string;
      items?: unknown;
      prizes?: Partial<PrizeMap>;
    };
    if (parsed.date !== today) {
      return createDefaultPrizeList();
    }
    return sanitizePrizeList(parsed.items, parsed.prizes);
  } catch {
    return createDefaultPrizeList();
  }
}

export function savePrizes(items: PrizeItem[], today: string = getTodayKey()): void {
  try {
    const payload = {
      date: today,
      items,
      prizes: toLegacyPrizeMap(items),
    };
    localStorage.setItem(`${PRIZES_PREFIX}${today}`, JSON.stringify(payload));
  } catch {
    // Ignore
  }
}

export function clearPrizes(today: string = getTodayKey()): void {
  try {
    localStorage.removeItem(`${PRIZES_PREFIX}${today}`);
  } catch {
    // Ignore
  }
}

export function loadCallHistory(today: string = getTodayKey()): CallHistoryEntry[] {
  cleanupPreviousDays(today);
  try {
    const raw = localStorage.getItem(`${HISTORY_PREFIX}${today}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { date?: string; history?: CallHistoryEntry[] };
    if (parsed.date !== today || !Array.isArray(parsed.history)) {
      return [];
    }
    return parsed.history.filter(
      (entry): entry is CallHistoryEntry =>
        typeof entry?.number === 'number' && typeof entry?.calledAt === 'number'
    );
  } catch {
    return [];
  }
}

export function saveCallHistory(history: CallHistoryEntry[], today: string = getTodayKey()): void {
  try {
    localStorage.setItem(`${HISTORY_PREFIX}${today}`, JSON.stringify({ date: today, history }));
  } catch {
    // Ignore
  }
}

export function clearCallHistory(today: string = getTodayKey()): void {
  try {
    localStorage.removeItem(`${HISTORY_PREFIX}${today}`);
  } catch {
    // Ignore
  }
}

export function loadLockState(today: string = getTodayKey()): LockState | null {
  try {
    const raw = localStorage.getItem(LOCK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LockState>;
    if (
      parsed.locked === true &&
      parsed.date === today &&
      (parsed.view === 'host' || parsed.view === 'play')
    ) {
      return {
        locked: true,
        view: parsed.view,
        date: parsed.date,
      };
    }
    localStorage.removeItem(LOCK_KEY);
    return null;
  } catch {
    return null;
  }
}

export function saveLockState(lockState: LockState | null): void {
  try {
    if (!lockState || !lockState.locked) {
      localStorage.removeItem(LOCK_KEY);
    } else {
      localStorage.setItem(LOCK_KEY, JSON.stringify(lockState));
    }
  } catch {
    // Ignore
  }
}

export function loadSoundPreference(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function saveSoundPreference(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off');
  } catch {
    // Ignore
  }
}

export function loadVoicePreference(): boolean {
  try {
    return localStorage.getItem(VOICE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function saveVoicePreference(enabled: boolean): void {
  try {
    localStorage.setItem(VOICE_KEY, enabled ? 'on' : 'off');
  } catch {
    // Ignore
  }
}

export function loadMusicPreference(): boolean {
  try {
    return localStorage.getItem(MUSIC_KEY) === 'on';
  } catch {
    return false;
  }
}

export function saveMusicPreference(enabled: boolean): void {
  try {
    localStorage.setItem(MUSIC_KEY, enabled ? 'on' : 'off');
  } catch {
    // Ignore
  }
}

export function loadTheme(): ThemeId {
  try {
    const val = localStorage.getItem(THEME_KEY);
    if (
      val === 'classic' ||
      val === 'diwali' ||
      val === 'christmas' ||
      val === 'pongal' ||
      val === 'summer'
    ) {
      return val;
    }
    return 'classic';
  } catch {
    return 'classic';
  }
}

export function saveTheme(theme: ThemeId): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore
  }
}

export function loadLanguage(): LanguageId {
  try {
    const val = localStorage.getItem(LANG_KEY);
    if (val === 'en' || val === 'hi' || val === 'pa') {
      return val;
    }
    return 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguage(language: LanguageId): void {
  try {
    localStorage.setItem(LANG_KEY, language);
  } catch {
    // Ignore
  }
}

export function loadKidsMode(): boolean {
  try {
    return localStorage.getItem(KIDS_MODE_KEY) === 'on';
  } catch {
    return false;
  }
}

export function saveKidsMode(enabled: boolean): void {
  try {
    localStorage.setItem(KIDS_MODE_KEY, enabled ? 'on' : 'off');
  } catch {
    // Ignore
  }
}

export function loadHighContrast(): boolean {
  try {
    return localStorage.getItem(HIGH_CONTRAST_KEY) === 'on';
  } catch {
    return false;
  }
}

export function saveHighContrast(enabled: boolean): void {
  try {
    localStorage.setItem(HIGH_CONTRAST_KEY, enabled ? 'on' : 'off');
  } catch {
    // Ignore
  }
}

export function loadLargeText(): boolean {
  try {
    return localStorage.getItem(LARGE_TEXT_KEY) === 'on';
  } catch {
    return false;
  }
}

export function saveLargeText(enabled: boolean): void {
  try {
    localStorage.setItem(LARGE_TEXT_KEY, enabled ? 'on' : 'off');
  } catch {
    // Ignore
  }
}

export function exportAllAppData(): string {
  const data: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(APP_KEY_PREFIX)) continue;
      const value = localStorage.getItem(key);
      if (value !== null) {
        data[key] = value;
      }
    }
  } catch {
    // Ignore storage read issues
  }

  return JSON.stringify(
    {
      app: 'sunny-housie',
      version: 1,
      exportedAt: Date.now(),
      data,
    },
    null,
    2
  );
}

export function parseAndValidateBackup(rawText: string): Record<string, string> | null {
  try {
    const parsed = JSON.parse(rawText) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    if (record.app !== 'sunny-housie' || typeof record.version !== 'number') {
      return null;
    }

    if (!record.data || typeof record.data !== 'object' || Array.isArray(record.data)) {
      return null;
    }

    const rawEntries = Object.entries(record.data as Record<string, unknown>);
    const validated: Record<string, string> = {};

    for (const [key, value] of rawEntries) {
      if (!key.startsWith(APP_KEY_PREFIX) || typeof value !== 'string') {
        return null;
      }
      // Validate JSON-structured values parse cleanly
      const trimmed = value.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        JSON.parse(trimmed);
      }
      validated[key] = value;
    }

    return validated;
  } catch {
    return null;
  }
}

export function applyBackupData(data: Record<string, string>): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(APP_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
    for (const [key, value] of Object.entries(data)) {
      localStorage.setItem(key, value);
    }
  } catch {
    // Ignore storage write issues
  }
}
