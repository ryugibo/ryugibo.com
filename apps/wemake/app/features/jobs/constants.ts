export const JOB_TYPES = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Freelance", value: "freelance" },
] as const;
export type JobType = (typeof JOB_TYPES)[number]["value"];

export const LOCATION_TYPES = [
  { label: "Remote", value: "remote" },
  { label: "In-Person", value: "in-person" },
  { label: "Hybrid", value: "hybrid" },
] as const;
export type LocationType = (typeof LOCATION_TYPES)[number]["value"];

export const SALARY_RANGE = [
  "$0 - $50,000",
  "$50,000 - $70,000",
  "$70,000 - $100,000",
  "$100,000 - $120,000",
  "$120,000 - $150,000",
  "$150,000 - $250,000",
  "$250,000+",
] as const;
export type SalaryOption = (typeof SALARY_RANGE)[number];
