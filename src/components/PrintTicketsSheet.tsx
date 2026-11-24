import { HousieTicket, LanguageId } from '../types/housie';
import { I18N } from '../utils/i18n';

interface PrintTicketsSheetProps {
  tickets: HousieTicket[] | null;
  language: LanguageId;
}

/**
 * Paper-friendly print-only sheet rendering blank unmarked tickets with dashed cut lines
 * and zero ink-wasting backgrounds or interactive controls.
 */
export function PrintTicketsSheet({ tickets, language }: PrintTicketsSheetProps) {
  if (!tickets || tickets.length === 0) {
    return null;
  }

  const t = I18N[language];

  return (
    <div className="hidden print:block bg-white text-black p-4">
      <div className="flex flex-col">
        {tickets.map((ticket, idx) => {
          const displayLabel =
            ticket.customName?.trim() || `${t.ticketPrefix} ${ticket.ticketNumber}`;

          return (
            <div key={ticket.ticketNumber} className="print-ticket-block">
              <div className="border-2 border-black rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between border-b border-black pb-1.5 mb-2">
                  <span className="font-display text-lg font-bold text-black">
                    {displayLabel}
                  </span>
                </div>

                <table className="w-full border-collapse table-fixed">
                  <tbody>
                    {ticket.grid.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="border border-black h-11 text-center align-middle font-display text-lg font-bold text-black bg-white"
                          >
                            {cell !== null ? cell : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {idx < tickets.length - 1 && (
                <div
                  aria-hidden="true"
                  className="my-5 border-t-2 border-dashed border-black"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
