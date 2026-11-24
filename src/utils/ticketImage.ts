import { HousieTicket, ThemeId } from '../types/housie';
import { THEMES } from './themes';

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

const STAMP_COLORS: Record<ThemeId, string[]> = {
  classic: ['#EC4899', '#14B8A6', '#F97316', '#8B5CF6'],
  diwali: ['#D97706', '#E11D48', '#7C3AED', '#DC2626'],
  christmas: ['#DC2626', '#15803D', '#B91C1C', '#047857'],
  pongal: ['#15803D', '#EA580C', '#CA8A04', '#059669'],
  summer: ['#0EA5E9', '#FB7185', '#0D9488', '#F97316'],
};

const BG_TINTS: Record<ThemeId, [string, string]> = {
  classic: ['#FFFDF7', '#FFE8D4'],
  diwali: ['#FFF9E6', '#FDE6B8'],
  christmas: ['#FFFFFF', '#FEE2E2'],
  pongal: ['#FEFCE8', '#DCFCE7'],
  summer: ['#E0F2FE', '#FFE4E6'],
};

/**
 * Renders a Housie ticket (name, grid numbers, and marked stamps) onto an HTML Canvas
 * and downloads it as a crisp PNG file using only the browser Canvas API.
 */
export function downloadTicketPicture(
  ticket: HousieTicket,
  ticketIndex: number,
  displayLabel: string,
  theme: ThemeId,
  wonPatternLabels: string[]
): void {
  const width = 1040;
  const hasBadges = wonPatternLabels.length > 0;
  const height = hasBadges ? 530 : 480;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const palette = THEMES[theme];
  const [bgStart, bgEnd] = BG_TINTS[theme];
  const stampPalette = STAMP_COLORS[theme];
  const stampColor = stampPalette[ticketIndex % stampPalette.length];

  // Outer canvas background
  const pageGrad = ctx.createLinearGradient(0, 0, width, height);
  pageGrad.addColorStop(0, bgStart);
  pageGrad.addColorStop(1, bgEnd);
  ctx.fillStyle = pageGrad;
  ctx.fillRect(0, 0, width, height);

  // Card container
  const cardX = 28;
  const cardY = 24;
  const cardW = width - 56;
  const cardH = height - 48;

  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fillStyle = '#FFFDF9';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = palette.swatchColors[0];
  ctx.stroke();
  ctx.clip();

  // Top decorative stripe
  const stripeColors = palette.confettiColors;
  const stripeWidth = cardW / stripeColors.length;
  stripeColors.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(cardX + idx * stripeWidth, cardY, stripeWidth + 2, 14);
  });

  // Header band
  ctx.fillStyle = '#FFF8EE';
  ctx.fillRect(cardX, cardY + 14, cardW, 76);

  // Header bottom border
  ctx.strokeStyle = '#E7E5E4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX, cardY + 90);
  ctx.lineTo(cardX + cardW, cardY + 90);
  ctx.stroke();

  // Ticket Name with yellow highlighter stripe behind it
  const nameX = cardX + 32;
  const nameY = cardY + 62;
  ctx.font = '800 32px Nunito, system-ui, sans-serif';
  const nameMetrics = ctx.measureText(displayLabel);
  const highlightW = Math.min(nameMetrics.width + 16, cardW - 220);

  ctx.fillStyle = 'rgba(253, 224, 71, 0.78)';
  drawRoundedRect(ctx, nameX - 6, nameY - 14, highlightW, 18, 9);
  ctx.fill();

  ctx.fillStyle = '#1C1917';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillText(displayLabel, nameX, nameY, cardW - 220);

  // Marked count on right
  ctx.font = '700 24px Poppins, system-ui, sans-serif';
  ctx.fillStyle = '#44403C';
  ctx.textAlign = 'right';
  ctx.fillText(`${ticket.markedNumbers.length} / 15`, cardX + cardW - 32, nameY);

  // 3 x 9 Ticket Grid
  const gridPadX = 28;
  const gridX = cardX + gridPadX;
  const gridY = cardY + 114;
  const gridW = cardW - gridPadX * 2;
  const cols = 9;
  const rows = 3;
  const gap = 10;
  const cellW = (gridW - gap * (cols - 1)) / cols;
  const cellH = 88;

  const markedSet = new Set(ticket.markedNumbers);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = ticket.grid[r]?.[c] ?? null;
      const cx = gridX + c * (cellW + gap);
      const cy = gridY + r * (cellH + gap);

      drawRoundedRect(ctx, cx, cy, cellW, cellH, 16);
      if (val === null) {
        ctx.fillStyle = '#FFF9EC';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#FDE68A';
        ctx.stroke();
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#FED7AA';
        ctx.stroke();

        const centerX = cx + cellW / 2;
        const centerY = cy + cellH / 2;

        if (markedSet.has(val)) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, 31, 0, Math.PI * 2);
          ctx.fillStyle = stampColor;
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();

          ctx.font = '800 30px Nunito, system-ui, sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(val), centerX, centerY + 1);
        } else {
          ctx.font = '800 30px Nunito, system-ui, sans-serif';
          ctx.fillStyle = '#1C1917';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(val), centerX, centerY + 1);
        }
      }
    }
  }

  // Optional Won Patterns row
  if (hasBadges) {
    let badgeX = cardX + 32;
    const badgeY = gridY + rows * (cellH + gap) + 12;
    ctx.font = '700 20px Nunito, system-ui, sans-serif';
    ctx.textBaseline = 'middle';

    for (const label of wonPatternLabels) {
      const textW = ctx.measureText(label).width;
      const pillW = textW + 28;
      if (badgeX + pillW > cardX + cardW - 24) break;

      drawRoundedRect(ctx, badgeX, badgeY, pillW, 34, 17);
      ctx.fillStyle = '#D1FAE5';
      ctx.fill();

      ctx.fillStyle = '#065F46';
      ctx.textAlign = 'left';
      ctx.fillText(label, badgeX + 14, badgeY + 18);

      badgeX += pillW + 10;
    }
  }

  ctx.restore();

  const safeSlug =
    displayLabel
      .toLowerCase()
      .replace(/[^a-z0-9\u0900-\u097F\u0A00-\u0A7F]+/gi, '-')
      .replace(/^-+|-+$/g, '') || `ticket-${ticket.ticketNumber}`;
  const filename = `${safeSlug}.png`;

  if (typeof canvas.toBlob === 'function') {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  } else {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
