export type AppView = 'home' | 'host' | 'play';

export type ThemeId = 'classic' | 'diwali' | 'christmas' | 'pongal' | 'summer';

export type LanguageId = 'en' | 'hi' | 'pa';

export interface AppSettings {
  theme: ThemeId;
  language: LanguageId;
  kidsMode: boolean;
  highContrast: boolean;
  largeText: boolean;
}

export type TicketCell = number | null;

export interface HousieTicket {
  /** 1-based ticket label number (Ticket 1, Ticket 2, ...) */
  ticketNumber: number;
  /** Optional custom player/ticket name (max 20 chars) */
  customName?: string;
  /** 3 rows x 9 columns grid */
  grid: TicketCell[][];
  /** Marked numbers on this ticket */
  markedNumbers: number[];
}

export interface HostGameState {
  date: string;
  calledNumbers: number[];
}

export interface PlayGameState {
  date: string;
  tickets: HousieTicket[];
}

export interface LockState {
  locked: boolean;
  view: 'host' | 'play';
  date: string;
}

export type PatternId =
  | 'earlyFive'
  | 'topLine'
  | 'middleLine'
  | 'bottomLine'
  | 'fullHouse';

export interface PatternDefinition {
  id: PatternId;
  label: string;
}

export const WINNING_PATTERNS: PatternDefinition[] = [
  { id: 'earlyFive', label: 'Early Five' },
  { id: 'topLine', label: 'Top Line' },
  { id: 'middleLine', label: 'Middle Line' },
  { id: 'bottomLine', label: 'Bottom Line' },
  { id: 'fullHouse', label: 'Full House' },
];

export interface PatternClaim {
  /** Optional prize ID when claimed against a PrizeItem (defaults to patternId) */
  prizeId?: string;
  /** Optional prize display name at time of claim */
  prizeName?: string;
  patternId: PatternId;
  ticketNumber: number;
  ticketName: string;
  source: 'play' | 'host';
  claimedAt: number;
}

export type PrizeMap = Record<PatternId, string>;

export interface PrizeItem {
  id: string;
  customName?: string;
  reward: string;
  rule: PatternId;
  isDefault: boolean;
  status: 'open' | 'won';
  wonByTicketName?: string;
  wonByTicketNumber?: number;
  wonBySource?: 'play' | 'host';
  wonAt?: number;
}

export interface CallHistoryEntry {
  number: number;
  calledAt: number;
}

export interface PastGameSummary {
  date: string;
  calledNumbers: number[];
  claims: PatternClaim[];
  prizes: PrizeMap | PrizeItem[];
  endedAt: number;
}


