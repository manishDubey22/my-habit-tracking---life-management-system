/** Format a Date as YYYY-MM-DD (local date). */
export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse YYYY-MM-DD to Date (local midnight). */
export function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Compare two YYYY-MM-DD strings: -1 if a < b, 0 if equal, 1 if a > b. */
export function compareDates(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** Add n days to a YYYY-MM-DD string; returns YYYY-MM-DD. */
export function addDays(dateStr: string, n: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + n);
  return formatDate(d);
}

/** Today in YYYY-MM-DD. */
export function today(): string {
  return formatDate(new Date());
}

/** Last N days (including today) as YYYY-MM-DD[]. */
export function lastNDays(n: number): string[] {
  const t = today();
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(addDays(t, -i));
  }
  return out;
}
