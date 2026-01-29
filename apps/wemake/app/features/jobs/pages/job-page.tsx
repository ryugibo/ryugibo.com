import { Badge, Button } from "@ryugibo/ui";
import { DotIcon } from "@ryugibo/ui/icons";
import { DateTime } from "luxon";
import z from "zod";
import { createSSRClient } from "~/supabase-client.ts";
import { getJobById } from "../queries.ts";
import type { Route } from "./+types/job-page";

export const meta = () => {
  return [{ title: "Job Details | wemake" }, { name: "description", content: "Job details" }];
};

const paramsSchema = z.object({
  id: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);

  if (!success) {
    throw new Error("Invalid params");
  }

  const { id } = data;
  const { supabase } = createSSRClient(request);
  const job = await getJobById(supabase, { id });
  return { job };
};

export default function JobPage({ loaderData }: Route.ComponentProps) {
  const { job } = loaderData;
  return (
    <div>
      <div className="bg-linear-to-tr from-primary/80 to-primary/10 h-60 w-full rounded-lg"></div>
      <div className="grid grid-cols-6 -mt-16 gap-20 items-start">
        <div className="col-span-4 space-y-10">
          <div>
            <div className="size-40 bg-white rounded-full overflow-hidden relative left-10">
              <img src={job.company_logo} alt="" className="object-cover" />
            </div>
            <h1 className="text-4xl font-bold">{job.position}</h1>
            <h4 className="text-lg text-muted-foreground">{job.company_name}</h4>
          </div>
          <div className="flex gap-2 capitalize">
            <Badge variant="secondary">{job.job_type}</Badge>
            <Badge variant="secondary">{job.location}</Badge>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-3xl font-bold">Overview</h4>
            <p className="text-lg">{job.overview}</p>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-3xl font-bold">Responsibilities</h4>
            <ul className="list-disc list-inside">
              {job.responsibilities.split(",").map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-3xl font-bold">Qualifications</h4>
            <ul className="list-disc list-inside">
              {job.qualifications.split(",").map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-3xl font-bold">Benefits</h4>
            <ul className="list-disc list-inside">
              {job.benefits.split(",").map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-3xl font-bold">Skills</h4>
            <ul className="list-disc list-inside">
              {job.skills.split(",").map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-2 sticky top-20 p-6 border rounded-lg mt-32 space-y-5">
          <div className="flex flex-col">
            <h4 className="text-sm text-muted-foreground">Avg. Salary</h4>
            <p className="text-2xl font-medium">{job.salary_range}</p>
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm text-muted-foreground">Location</h4>
            <p className="text-2xl font-medium capitalize">{job.location}</p>
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm text-muted-foreground">Type</h4>
            <p className="text-2xl font-medium capitalize">{job.job_type}</p>
          </div>
          <div className="flex">
            <h4 className="text-sm text-muted-foreground">
              {DateTime.fromISO(job.created_at).toRelative()}
            </h4>
            <DotIcon className="size-4" />
            <span className="text-sm text-muted-foreground">395 views</span>
          </div>
          <Button className="w-full">Apply Now</Button>
        </div>
      </div>
    </div>
  );
}
