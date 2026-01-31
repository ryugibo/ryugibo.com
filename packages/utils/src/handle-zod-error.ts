import type { ZodError } from "zod";

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[],
];

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
          ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
          : never;
      }[keyof T]
    : "";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const parseZodError = <T>(error: ZodError<T>) => {
  return error.issues.reduce(
    (acc, issue) => {
      const key = issue.path.join(".");
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ key: acc[key].length, message: issue.message });
      return acc;
    },
    {} as Record<string, { key: number; message: string }[]>,
  ) as Prettify<Partial<Record<Paths<T>, { key: number; message: string }[]>>>;
};
