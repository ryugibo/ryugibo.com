export type PositiveInteger<N extends number> = `${N}` extends `-${string}` | "0" ? never : N;

export const resolveParentPath = <T extends number>({
  pathname,
  steps,
}: {
  pathname: string;
  steps: T & PositiveInteger<T>;
}) => {
  const segments = pathname.split("/").filter(Boolean);
  const parentSegments = steps >= segments.length ? [] : segments.slice(0, -steps);
  return `/${parentSegments.join("/")}`;
};
