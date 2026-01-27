import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase-client.ts";
import type { JobType, LocationType, SalaryOption } from "./constants.ts";

export const getJobs = async (
  supabase: SupabaseClient<Database>,
  {
    limit,
    location,
    type,
    salary,
  }: {
    limit: number;
    location?: LocationType;
    type?: JobType;
    salary?: SalaryOption;
  },
) => {
  const query = supabase
    .from("jobs")
    .select(`
    id,
    position,
    overview,
    company_name,
    company_logo,
    company_location,
    job_type,
    location,
    salary_range,
    created_at
    `)
    .limit(limit);

  if (location) {
    query.eq("location", location);
  }

  if (type) {
    query.eq("job_type", type);
  }

  if (salary) {
    query.eq("salary_range", salary);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
};

export const getJobById = async (supabase: SupabaseClient<Database>, { id }: { id: number }) => {
  const { data, error } = await supabase.from("jobs").select().eq("id", id).single();

  if (error) {
    throw error;
  }

  return data;
};
