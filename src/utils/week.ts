import dayjs from "dayjs";
import { monthRangeKeys } from "./date";

export interface WeekGroup {
  key: string;
  label: string;
  dateKeys: string[];
}

export function groupDateKeysByWeek(dateKeys: string[]): WeekGroup[] {
  const map = new Map<string, WeekGroup>();

  for (const dateKey of dateKeys) {
    const d = dayjs(dateKey);
    const start = d.startOf("week");
    const end = d.endOf("week");
    const key = start.format("YYYY-MM-DD");
    const label = `${start.format("MMM D")} - ${end.format("MMM D")}`;

    if (!map.has(key)) {
      map.set(key, { key, label, dateKeys: [] });
    }
    map.get(key)!.dateKeys.push(dateKey);
  }

  return Array.from(map.values());
}

export function getMonthWeekGroups(
  year: number,
  monthIndex: number,
): WeekGroup[] {
  const dateKeys = monthRangeKeys(year, monthIndex);
  return groupDateKeysByWeek(dateKeys);
}
