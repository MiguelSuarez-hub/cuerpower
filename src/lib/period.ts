// Measurement dates come from a date-only <input type="date">, which
// JavaScript parses as UTC midnight. The period boundaries are computed in
// UTC too so they line up regardless of the server's local timezone.
export function getCurrentMonthRange(now: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
  return { start, end };
}
