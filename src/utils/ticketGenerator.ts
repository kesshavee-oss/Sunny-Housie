import { HousieTicket, TicketCell } from '../types/housie';

const TOTAL_ROWS = 3;
const TOTAL_COLS = 9;
const NUMBERS_PER_ROW = 5;
const NUMBERS_PER_TICKET = TOTAL_ROWS * NUMBERS_PER_ROW; // 15

/**
 * Returns the valid number range [min, max] for a given column index (0..8).
 * Col 0: 1..9, Col 1: 10..19, ..., Col 7: 70..79, Col 8: 80..90
 */
function getColumnRange(colIndex: number): [number, number] {
  if (colIndex === 0) return [1, 9];
  if (colIndex === 8) return [80, 90];
  return [colIndex * 10, colIndex * 10 + 9];
}

/**
 * Fisher-Yates shuffle returning a new shuffled array.
 */
function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Generates a single valid 3x9 Housie ticket following all standard rules:
 * - 3 rows x 9 columns
 * - Exactly 5 numbers and 4 blanks per row
 * - Every column has 1 to 3 numbers (at least 1)
 * - Column 1: 1-9, Column 2: 10-19, ..., Column 9: 80-90
 * - Numbers in each column are sorted ascending top-to-bottom
 * - No repeated numbers
 */
export function generateSingleTicket(ticketNumber: number): HousieTicket {
  // 1. Decide how many numbers each column gets (each starts at 1, total = 15)
  const colCounts = new Array<number>(TOTAL_COLS).fill(1);
  let remaining = NUMBERS_PER_TICKET - TOTAL_COLS; // 6 extra slots

  while (remaining > 0) {
    const col = Math.floor(Math.random() * TOTAL_COLS);
    if (colCounts[col] < TOTAL_ROWS) {
      colCounts[col]++;
      remaining--;
    }
  }

  // 2. Assign row positions for each column so every row receives exactly 5 numbers.
  // Processing columns in descending order of count (3s, then 2s, then 1s) and
  // picking the rows with the lowest current count (ties broken randomly) guarantees
  // the row counts stay balanced and always finish at [5, 5, 5].
  const columnsByCount = shuffleArray(
    colCounts.map((count, colIndex) => ({ colIndex, count }))
  ).sort((a, b) => b.count - a.count);

  const rowCounts = [0, 0, 0];
  const colRowAssignments: number[][] = Array.from({ length: TOTAL_COLS }, () => []);

  for (const { colIndex, count } of columnsByCount) {
    const rowOrder = shuffleArray([0, 1, 2]).sort(
      (rA, rB) => rowCounts[rA] - rowCounts[rB]
    );
    const chosenRows = rowOrder.slice(0, count).sort((a, b) => a - b);
    for (const r of chosenRows) {
      rowCounts[r]++;
    }
    colRowAssignments[colIndex] = chosenRows;
  }

  // 3. Populate each column with distinct random numbers sorted top-to-bottom
  const grid: TicketCell[][] = Array.from({ length: TOTAL_ROWS }, () =>
    new Array<TicketCell>(TOTAL_COLS).fill(null)
  );

  for (let col = 0; col < TOTAL_COLS; col++) {
    const [min, max] = getColumnRange(col);
    const pool: number[] = [];
    for (let n = min; n <= max; n++) {
      pool.push(n);
    }
    const picked = shuffleArray(pool)
      .slice(0, colCounts[col])
      .sort((a, b) => a - b);

    const rows = colRowAssignments[col];
    for (let i = 0; i < rows.length; i++) {
      grid[rows[i]][col] = picked[i];
    }
  }

  return {
    ticketNumber,
    grid,
    markedNumbers: [],
  };
}

/**
 * Produces a canonical string signature of a ticket's grid to guarantee uniqueness.
 */
function getTicketSignature(grid: TicketCell[][]): string {
  return grid
    .map((row) => row.map((cell) => (cell === null ? '_' : String(cell))).join(','))
    .join('|');
}

/**
 * Generates `count` (clamped 1..10) unique Housie tickets.
 */
export function generateUniqueTickets(count: number): HousieTicket[] {
  const safeCount = Math.max(1, Math.min(10, Math.floor(count)));
  const tickets: HousieTicket[] = [];
  const seenSignatures = new Set<string>();

  while (tickets.length < safeCount) {
    const candidate = generateSingleTicket(tickets.length + 1);
    const signature = getTicketSignature(candidate.grid);
    if (!seenSignatures.has(signature)) {
      seenSignatures.add(signature);
      tickets.push(candidate);
    }
  }

  return tickets;
}
