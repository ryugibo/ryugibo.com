import { Input, Label, LoadingButton } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { data, Form, redirect, useNavigation } from "react-router";
import { z } from "zod";
import { createSSRClient } from "~/supabase.server.ts";
import { createProfile } from "../mutation.ts";
import { getProfileById } from "../queries.ts";
import type { Route } from "./+types/make-profile-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Create Profile | den" }];
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
  username: z.string().min(3),
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

  const { username } = dataForm;
  const user = await getAuthUser();
  if (!user) {
    return redirect("/", { headers });
  }
  const { id: user_id } = user;

  const { error: insertError } = await createProfile({
    supabase,
    id: user_id,
    username,
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
        <p className="text-muted-foreground">Pick a username to get started.</p>
      </div>

      <Form method="post" className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" required placeholder="username" />
          <p className="text-xs text-muted-foreground">This will be your unique handle.</p>
        </div>
        {actionData?.formError?.username?.map(
          ({ key, message }: { key: number; message: string }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ),
        )}
        {actionData?.insertError?.username?.map(
          ({ key, message }: { key: number; message: string }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ),
        )}

        <LoadingButton isLoading={isSubmitting}>Create Profile</LoadingButton>
        {actionData?.insertError && !actionData.insertError.username && (
          <p className="text-sm text-red-500">Unknown error occurred. Please contact support.</p>
        )}
      </Form>
    </div>
  );
}
