export const SORT_OPTIONS = ["newest", "popular"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const PERIOD_OPTIONS = ["all", "today", "week", "month", "year"] as const;
export type PeriodOption = (typeof PERIOD_OPTIONS)[number];
