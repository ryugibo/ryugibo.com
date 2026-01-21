import { bigint, text, timestamp } from "@ryugibo/db/core";
import { pg } from "~/db";
import { JOB_TYPES, LOCATION_TYPES, SALARY_RANGE } from "./constants";

export const jobTypes = pg.enum(
  "job_type",
  JOB_TYPES.map((type) => type.value) as [string, ...string[]],
);

export const locations = pg.enum(
  "location",
  LOCATION_TYPES.map((location) => location.value) as [string, ...string[]],
);

export const salaryRanges = pg.enum("salary_range", SALARY_RANGE);

export const jobs = pg.table("jobs", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  position: text().notNull(),
  overview: text().notNull(),
  responsibilities: text().notNull(),
  qualifications: text().notNull(),
  benefits: text().notNull(),
  skills: text().notNull(),
  company_name: text().notNull(),
  company_logo: text().notNull(),
  company_location: text().notNull(),
  apply_url: text().notNull(),
  job_type: jobTypes().notNull(),
  location: locations().notNull(),
  salary_range: salaryRanges().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
