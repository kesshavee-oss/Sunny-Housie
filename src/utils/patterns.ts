import { HousieTicket, PatternId, PrizeItem, WINNING_PATTERNS } from '../types/housie';

/**
 * Checks whether a single row (0, 1, or 2) on a ticket has all 5 numbers marked.
 */
function isRowMarked(ticket: HousieTicket, rowIndex: number, markedSet: Set<number>): boolean {
  const row = ticket.grid[rowIndex];
  if (!row) return false;
  const rowNumbers = row.filter((cell): cell is number => cell !== null);
  return rowNumbers.length === 5 && rowNumbers.every((num) => markedSet.has(num));
}

/**
 * Checks if a ticket qualifies for a given winning pattern based on its markedNumbers.
 */
export function doesTicketQualifyForPattern(
  ticket: HousieTicket,
  patternId: PatternId
): boolean {
  const markedSet = new Set(ticket.markedNumbers);
  switch (patternId) {
    case 'earlyFive':
      return markedSet.size >= 5;
    case 'topLine':
      return isRowMarked(ticket, 0, markedSet);
    case 'middleLine':
      return isRowMarked(ticket, 1, markedSet);
    case 'bottomLine':
      return isRowMarked(ticket, 2, markedSet);
    case 'fullHouse':
      return markedSet.size === 15;
  }
}

/**
 * Checks that a ticket has at least one marked number and every marked number has been called.
 */
export function areAllMarkedNumbersCalled(
  ticket: HousieTicket,
  calledNumbers: number[]
): boolean {
  if (ticket.markedNumbers.length === 0) return false;
  const calledSet = new Set(calledNumbers);
  return ticket.markedNumbers.every((num) => calledSet.has(num));
}

/**
 * Returns the list of pattern IDs that the ticket qualifies for and have not been claimed yet.
 */
export function getNewlyClaimablePatterns(
  ticket: HousieTicket,
  calledNumbers: number[],
  alreadyClaimedPatterns: Set<PatternId>
): { validMarks: boolean; qualifiedPatterns: PatternId[] } {
  const validMarks = areAllMarkedNumbersCalled(ticket, calledNumbers);
  if (!validMarks) {
    return { validMarks: false, qualifiedPatterns: [] };
  }

  const qualifiedPatterns: PatternId[] = [];
  for (const pattern of WINNING_PATTERNS) {
    if (alreadyClaimedPatterns.has(pattern.id)) continue;
    if (doesTicketQualifyForPattern(ticket, pattern.id)) {
      qualifiedPatterns.push(pattern.id);
    }
  }

  return { validMarks: true, qualifiedPatterns };
}

/**
 * Evaluates all open prizes (default patterns and extra host-defined prizes) for a ticket claim.
 * A prize can only be won once per day, and only when all marked numbers on the ticket have been called.
 */
export function getNewlyClaimablePrizes(
  ticket: HousieTicket,
  calledNumbers: number[],
  prizes: PrizeItem[],
  claimedPrizeIds: Set<string>
): { validMarks: boolean; qualifiedPrizes: PrizeItem[] } {
  const validMarks = areAllMarkedNumbersCalled(ticket, calledNumbers);
  if (!validMarks) {
    return { validMarks: false, qualifiedPrizes: [] };
  }

  const qualifiedPrizes: PrizeItem[] = [];
  for (const prize of prizes) {
    if (prize.status === 'won' || claimedPrizeIds.has(prize.id)) continue;
    if (doesTicketQualifyForPattern(ticket, prize.rule)) {
      qualifiedPrizes.push(prize);
    }
  }

  return { validMarks: true, qualifiedPrizes };
}

