import { Input, Label, LoadingButton } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { data, Form, redirect, useNavigation } from "react-router";
import { z } from "zod";
import SelectPair from "~/common/components/select-pair.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { ROLE_TYPES } from "../constants.ts";
import { getProfileById } from "../queries.ts";
import type { Route } from "./+types/make-profile-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Create Profile | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, getAuthUser, headers } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    return redirect("/", { headers });
  }
  const { id } = user;
  const profile = await getProfileById({ supabase, id });
  if (profile) {
    return redirect("/", { headers });
  }
  return data(null, { headers });
};

const formSchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  role: z.string().default(ROLE_TYPES[0].value),
  bio: z.string().optional().default(""),
  headline: z.string().optional().default(""),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase, headers, getAuthUser } = createSSRClient(request);

  const defaultReturn = {
    data: null,
    formError: null,
    insertError: null,
  };

  const formData = await request.formData();
  const {
    success: successForm,
    error: errorForm,
    data: dataForm,
  } = formSchema.safeParse(Object.fromEntries(formData));

  if (!successForm) {
    return data({ ...defaultReturn, formError: parseZodError(errorForm) }, { headers });
  }

  const { name, username, role, bio, headline } = dataForm;
  const user = await getAuthUser();
  if (!user) {
    return redirect("/", { headers });
  }
  const { id: user_id } = user;

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user_id,
    name,
    username,
    role: role as (typeof ROLE_TYPES)[number]["value"],
    bio,
    headline,
  });

  if (insertError) {
    const { code } = insertError;
    if (code === "23505") {
      return data(
        {
          ...defaultReturn,
          insertError: { username: [{ key: 0, message: "Username already exists" }] },
        },
        { headers },
      );
    } else {
      console.log(insertError);
      return data(defaultReturn, { headers });
    }
  }

  return redirect("/", { headers });
};

export default function MakeProfilePage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Create your profile</h1>
        <p className="text-muted-foreground">Tell us a bit about yourself to get started.</p>
      </div>

      <Form method="post" className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        {actionData?.formError?.name?.map(({ key, message }) => (
          <p key={key} className="text-sm text-red-500">
            {message}
          </p>
        ))}

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" required placeholder="username" />
          <p className="text-xs text-muted-foreground">This will be your unique handle.</p>
        </div>
        {actionData?.formError?.username?.map(({ key, message }) => (
          <p key={key} className="text-sm text-red-500">
            {message}
          </p>
        ))}
        {actionData?.insertError?.username?.map(({ key, message }) => (
          <p key={key} className="text-sm text-red-500">
            {message}
          </p>
        ))}

        <div className="space-y-2">
          <SelectPair
            label="Role"
            description="What role do you play in the community?"
            name="role"
            required
            options={ROLE_TYPES}
            placeholder="Select your role"
          />
        </div>
        {actionData?.formError?.role?.map(({ key, message }) => (
          <p key={key} className="text-sm text-red-500">
            {message}
          </p>
        ))}

        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" name="headline" placeholder="Software Engineer at ..." />
        </div>
        {actionData?.formError?.headline?.map(({ key, message }) => (
          <p key={key} className="text-sm text-red-500">
            {message}
          </p>
        ))}

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input id="bio" name="bio" placeholder="Tell us about yourself" />
        </div>
        {actionData?.formError?.bio?.map(({ key, message }) => (
          <p key={key} className="text-sm text-red-500">
            {message}
          </p>
        ))}
        <LoadingButton isLoading={isSubmitting}>Create Profile</LoadingButton>
        {actionData?.insertError && (
          <p className="text-sm text-red-500">Unknown error occurred. Please contact support.</p>
        )}
      </Form>
    </div>
  );
}
