export const BOOK_SOURCES = [
  { label: "교보문고", value: "kyobo" },
  { label: "알라딘", value: "aladin" },
  { label: "예스24", value: "yes24" },
  { label: "리디북스", value: "ridibooks" },
  { label: "기타", value: "etc" },
] as const;
export type BookSource = (typeof BOOK_SOURCES)[number]["value"];

export const READ_STATE = ["reading", "toread", "completed"] as const;
export type ReadState = (typeof READ_STATE)[number];
