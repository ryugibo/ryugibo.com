import { LoadingButton } from "@ryugibo/ui";
import { parseZodError, resolveParentPath } from "@ryugibo/utils";
import { Form, redirect, useNavigation } from "react-router";
import z from "zod";
import { Hero } from "~/common/components/hero.tsx";
import InputPair from "~/common/components/input-pair.tsx";
import SelectPair from "~/common/components/select-pair.tsx";
import { JOB_TYPES, LOCATION_TYPES, SALARY_RANGE } from "~/features/jobs/constants.ts";
import { ensureLoggedInProfileId } from "~/features/users/queries.ts";
import { createSSRClient } from "~/supabase-client.ts";
import { createJob } from "../mutation.ts";
import type { Route } from "./+types/job-submit-page";

export const meta = () => {
  return [
    { title: "Post a Job | wemake" },
    { name: "description", content: "Reach out to the best developers." },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { pathname } = new URL(request.url);
  const { supabase } = createSSRClient(request);

  await ensureLoggedInProfileId({
    supabase,
    redirect_path: resolveParentPath({ pathname, steps: 1 }),
  });
};

export const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(40, "Position must be at most 40 characters"),
  overview: z
    .string()
    .min(1, "Overview is required")
    .max(400, "Overview must be at most 400 characters"),
  responsibilities: z
    .string()
    .min(1, "Responsibilities is required")
    .max(400, "Responsibilities must be at most 400 characters"),
  qualifications: z
    .string()
    .min(1, "Qualifications is required")
    .max(400, "Qualifications must be at most 400 characters"),
  benefits: z
    .string()
    .min(1, "Benefits is required")
    .max(400, "Benefits must be at most 400 characters"),
  skills: z.string().min(1, "Skills is required").max(400, "Skills must be at most 400 characters"),
  company_name: z
    .string()
    .min(1, "Company name is required")
    .max(40, "Company name must be at most 40 characters"),
  company_logo: z
    .string()
    .min(1, "Company logo URL is required")
    .max(40, "Company logo URL must be at most 40 characters"),
  company_location: z
    .string()
    .min(1, "Company location is required")
    .max(40, "Company location must be at most 40 characters"),
  apply_url: z.string().url("Invalid URL").max(40, "Apply URL must be at most 40 characters"),
  job_type: z.enum(JOB_TYPES.map((jobType) => jobType.value)),
  location: z.enum(LOCATION_TYPES.map((jobLocation) => jobLocation.value)),
  salary_range: z.enum(SALARY_RANGE),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase } = createSSRClient(request);
  const formData = await request.formData();
  const { success, data, error: formZodError } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    const formError = parseZodError(formZodError);
    return { formError };
  }
  const { id } = await createJob({ supabase, data });
  return redirect(`/jobs/${id}`);
};

export default function JobSubmitPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div>
      <Hero title="Post a job" description="Reach out to the best developers." />
      <Form method="post" className="max-w-screen-2xl mx-auto flex flex-col gap-10 items-center">
        <div className="grid grid-cols-3 gap-10">
          <InputPair
            label="Postion"
            description="(40 characters max)"
            id="position"
            name="position"
            maxLength={40}
            type="text"
            required
            placeholder="i.e Senior React Developers"
          />
          {actionData?.formError?.position?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Overview"
            description="(400 characters max)"
            id="overview"
            name="overview"
            maxLength={400}
            type="text"
            required
            placeholder="i.e We are looking for a senior React developer to join our team."
            textarea
          />
          {actionData?.formError?.overview?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Responsibilities"
            description="(400 characters max, comma separated)"
            id="responsibilities"
            name="responsibilities"
            maxLength={400}
            type="text"
            required
            placeholder="i.e Implement new features, Maintain code quality, etc."
            textarea
          />
          {actionData?.formError?.responsibilities?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Qualifications"
            description="(400 characters max, comma separated)"
            id="qualifications"
            name="qualifications"
            maxLength={400}
            type="text"
            required
            placeholder="i.e Bachelor's degree, 2+ years of experience, etc."
            textarea
          />
          {actionData?.formError?.qualifications?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Benefits"
            description="(400 characters max, comma separated)"
            id="benefits"
            name="benefits"
            maxLength={400}
            type="text"
            required
            placeholder="i.e Health Insurance, Paid Time Off, etc."
            textarea
          />
          {actionData?.formError?.benefits?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Skills"
            description="(400 characters max, comma separated)"
            id="skills"
            name="skills"
            maxLength={400}
            type="text"
            required
            placeholder="i.e React, Node.js, Python, etc."
            textarea
          />
          {actionData?.formError?.skills?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Company Name"
            description="(40 characters max)"
            id="company_name"
            name="company_name"
            maxLength={40}
            type="text"
            required
            placeholder="i.e Wemake"
          />
          {actionData?.formError?.company_name?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Company Logo URL"
            description="(40 characters max)"
            id="company_logo"
            name="company_logo"
            maxLength={40}
            type="url"
            required
            placeholder="i.e https://example.com/logo.png"
          />
          {actionData?.formError?.company_logo?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Company Location"
            description="(40 characters max)"
            id="company_location"
            name="company_location"
            maxLength={40}
            type="text"
            required
            placeholder="i.e Remote"
          />
          {actionData?.formError?.company_location?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Apply URL"
            description="(40 characters max)"
            id="apply_url"
            name="apply_url"
            maxLength={40}
            type="url"
            required
            placeholder="i.e https://example.com/apply"
          />
          {actionData?.formError?.apply_url?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <SelectPair
            label="Job Type"
            description="Select the type of job"
            name="job_type"
            required
            placeholder="Select the type of job"
            options={JOB_TYPES.map((type) => ({ value: type.value, label: type.label }))}
          />
          {actionData?.formError?.job_type?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <SelectPair
            label="Job Location"
            description="Select the location of the job"
            name="location"
            required
            placeholder="Select the location of the job"
            options={LOCATION_TYPES.map((location) => ({
              value: location.value,
              label: location.label,
            }))}
          />
          {actionData?.formError?.location?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <SelectPair
            label="Salary Range"
            description="Select the salary range of the job"
            name="salary_range"
            required
            placeholder="Select the salary range of the job"
            options={SALARY_RANGE.map((salary) => ({
              value: salary,
              label: salary,
            }))}
          />
          {actionData?.formError?.salary_range?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
        </div>
        <LoadingButton className="max-w-sm" isLoading={isSubmitting}>
          Post job for $100
        </LoadingButton>
      </Form>
    </div>
  );
}
