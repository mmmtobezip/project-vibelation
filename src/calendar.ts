// Korean public/substitute holidays in the imported 2026 SR dataset's calendar year.
export const holidays = new Set([
  "2026-01-01",
  "2026-02-16",
  "2026-02-17",
  "2026-02-18",
  "2026-03-01",
  "2026-03-02",
  "2026-05-05",
  "2026-05-24",
  "2026-05-25",
  "2026-06-03",
  "2026-06-06",
  "2026-08-15",
  "2026-08-17",
  "2026-09-24",
  "2026-09-25",
  "2026-09-26",
  "2026-10-03",
  "2026-10-05",
  "2026-10-09",
  "2026-12-25",
]);
export function standardDays(mm: number) {
  return (
    [
      [0.3, 8],
      [0.6, 11],
      [1, 15],
      [1.5, 22],
      [2.5, 26],
      [3.5, 40],
      [5, 50],
    ].find(([limit]) => mm >= 0 && mm < limit)?.[1] ?? null
  );
}
export function shiftWorkdays(value: string, count: number) {
  const d = new Date(value + "T00:00:00Z");
  let left = Math.abs(count);
  while (left) {
    d.setUTCDate(d.getUTCDate() + (count < 0 ? -1 : 1));
    const s = d.toISOString().slice(0, 10);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6 && !holidays.has(s)) left--;
  }
  return d.toISOString().slice(0, 10);
}
export function workdaysBetween(start: string, end: string) {
  let n = 0,
    d = start;
  while (d < end) {
    const next = new Date(d + "T00:00:00Z");
    next.setUTCDate(next.getUTCDate() + 1);
    d = next.toISOString().slice(0, 10);
    if (next.getUTCDay() !== 0 && next.getUTCDay() !== 6 && !holidays.has(d))
      n++;
  }
  return n;
}
