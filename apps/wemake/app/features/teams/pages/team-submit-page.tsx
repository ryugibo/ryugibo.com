import { LoadingButton } from "@ryugibo/ui";
import { parseZodError, resolveParentPath } from "@ryugibo/utils";
import { Form, redirect, useNavigation } from "react-router";
import z from "zod";
import { Hero } from "~/common/components/hero.tsx";
import InputPair from "~/common/components/input-pair.tsx";
import SelectPair from "~/common/components/select-pair.tsx";
import { PRODUCT_STAGE } from "~/features/teams/constants.ts";
import { createSSRClient } from "~/supabase-client.ts";
import { createTeam } from "../mutations.ts";
import type { Route } from "./+types/team-submit-page";

export const meta = () => {
  return [{ title: "Create Team | wemake" }, { description: "Create a team to find a team mate." }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { pathname } = new URL(request.url);
  const { getAuthUser } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    throw redirect(resolveParentPath({ pathname, steps: 1 }));
  }
};

export const formSchema = z.object({
  product_name: z.string().min(1, "Name is required").max(20, "Name must be at most 20 characters"),
  product_stage: z.enum(PRODUCT_STAGE.map((stage) => stage.value)),
  team_size: z.coerce.number().min(1, "Size is required").max(100, "Size must be at most 100"),
  equity_split: z.coerce
    .number()
    .min(1, "Equity is required")
    .max(100, "Equity must be at most 100"),
  roles: z.string().min(1, "Roles is required"),
  product_description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be at most 200 characters"),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { pathname } = new URL(request.url);
  const { supabase, getAuthUser } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    throw redirect(resolveParentPath({ pathname, steps: 1 }));
  }
  const { id: profile_id } = user;
  const { success, error: formZodError, data } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    const formError = parseZodError(formZodError);
    return { formError };
  }
  const { id } = await createTeam({ supabase, data, team_leader_id: profile_id });
  return redirect(`/teams/${id}`);
};

export default function TeamSubmitPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div>
      <Hero title="Create Team" description="Create a team to find a team mate." />
      <Form method="post" className="max-w-screen-2xl mx-auto flex flex-col gap-10 items-center">
        <div className="grid grid-cols-3 gap-10">
          <InputPair
            label="What is the name of yout product?"
            description="(20 characters max)"
            name="product_name"
            maxLength={20}
            type="text"
            id="product_name"
            required
            placeholder="i.e Wemake"
          />
          {actionData?.formError?.product_name?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <SelectPair
            label="What is the stage of your product?"
            description="Select the stage of your product"
            name="product_stage"
            required
            placeholder="Select the stage of your product"
            options={PRODUCT_STAGE}
          />
          {actionData?.formError?.product_stage?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="What is the size of yout team?"
            description="(1-100)"
            name="team_size"
            max={100}
            min={1}
            type="number"
            id="team_size"
            required
          />
          {actionData?.formError?.team_size?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="How much equity are you willing to give?"
            description="(each)"
            name="equity_split"
            max={100}
            min={1}
            type="number"
            id="equity_split"
            required
          />
          {actionData?.formError?.equity_split?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="What roles are you looking for?"
            description="(comma separated)"
            name="roles"
            type="text"
            id="roles"
            required
            placeholder="i.e Frontend Developer, Backend Developer, etc."
          />
          {actionData?.formError?.roles?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="What is the description of your product?"
            description="(200 characters max)"
            name="product_description"
            type="text"
            id="product_description"
            maxLength={200}
            required
            placeholder="i.e We are looking for a senior React developer to join our team."
            textarea
          />
          {actionData?.formError?.product_description?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
        </div>
        <LoadingButton className="max-w-sm" isLoading={isSubmitting}>
          Create Team
        </LoadingButton>
      </Form>
    </div>
  );
}
