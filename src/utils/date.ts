import dayjs from "dayjs";

export function toDateKey(value: string | Date): string {
  return dayjs(value).startOf("day").format("YYYY-MM-DD");
}

export function todayKey(): string {
  return dayjs().startOf("day").format("YYYY-MM-DD");
}

export function daysInMonth(year: number, monthIndex: number): number {
  return dayjs(new Date(year, monthIndex, 1)).daysInMonth();
}

export function monthRangeKeys(year: number, monthIndex: number): string[] {
  const total = daysInMonth(year, monthIndex);
  return Array.from({ length: total }, (_, i) =>
    toDateKey(new Date(year, monthIndex, i + 1)),
  );
}

export function completionKey(habitId: string, value: string | Date): string {
  return `${habitId}-${toDateKey(value)}`;
}

export function parseDateKey(dateKey: string): dayjs.Dayjs {
  return dayjs(dateKey).startOf("day");
}
