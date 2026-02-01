import { Button, cn } from "@ryugibo/ui";
import { data, useSearchParams } from "react-router";
import z from "zod";
import { Hero } from "~/common/components/hero.tsx";
import { JobCard } from "~/features/jobs/components/job-card.tsx";
import { JOB_TYPES, LOCATION_TYPES, SALARY_RANGE } from "~/features/jobs/constants.ts";
import { createSSRClient } from "~/supabase-client.ts";
import { getJobs } from "../queries.ts";
import type { Route } from "./+types/jobs-page";

export const meta = () => {
  return [
    { title: "Jobs | wemake" },
    { name: "description", content: "Companies looking for makers" },
  ];
};

const searchParamsSchema = z.object({
  type: z.enum(JOB_TYPES.map((type) => type.value)).optional(),
  location: z.enum(LOCATION_TYPES.map((type) => type.value)).optional(),
  salary: z.enum(SALARY_RANGE).optional(),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { success, data: dataFilter } = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams),
  );
  if (!success) {
    throw data({ error_code: "invalid_params", message: "invalid params" }, { status: 400 });
  }
  const { supabase } = createSSRClient(request);
  const jobs = await getJobs({ supabase, limit: 11, ...dataFilter });
  return { jobs };
};

export default function JobsPage({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const onClickFilter = (key: string, value: string) => {
    if (searchParams.get(key) === value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    setSearchParams(searchParams);
  };
  return (
    <div className="space-y-20">
      <Hero title="Jobs" description="Companies looking for makers" />
      <div className="grid grid-cols-1 xl:grid-cols-6 gap-20 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-5">
          {loaderData.jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              companyName={job.company_name}
              companyLogoUrl={job.company_logo}
              title={job.position}
              postedAt={job.created_at}
              type={job.job_type}
              locationType={job.location}
              salary={job.salary_range}
              location={job.company_location}
            />
          ))}
        </div>
        <div className="xl:col-span-2 sticky top-20 flex flex-col gap-10">
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">Type</h4>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  onClick={() => onClickFilter("type", type.value)}
                  className={cn(
                    searchParams.get("type") === type.value && "bg-accent text-accent-foreground",
                  )}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">Location</h4>
            <div className="flex flex-wrap gap-2">
              {LOCATION_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  onClick={() => onClickFilter("location", type.value)}
                  className={cn(
                    searchParams.get("location") === type.value &&
                      "bg-accent text-accent-foreground",
                  )}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">Salary Range</h4>
            <div className="flex flex-wrap gap-2">
              {SALARY_RANGE.map((range) => (
                <Button
                  key={range}
                  variant="outline"
                  onClick={() => onClickFilter("salary", range)}
                  className={cn(
                    searchParams.get("salary") === range && "bg-accent text-accent-foreground",
                  )}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
