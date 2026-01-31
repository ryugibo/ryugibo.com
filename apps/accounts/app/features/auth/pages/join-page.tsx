import { Button, LoadingButton } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { Form, Link, redirect, useNavigation } from "react-router";
import z from "zod";
import InputPair from "~/common/components/input-pair.tsx";
import AuthButtons from "~/features/auth/components/auth-buttons.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/join-page";

export const meta = () => {
  return [{ title: "Join | wemake" }];
};

const formSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error: formZodError } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    const formError = parseZodError(formZodError);
    return { formError };
  }
  const { supabase, headers } = createSSRClient(request);
  const { email, password } = data;
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpError) {
    return { signUpError };
  }

  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get("redirect_url") || "/";

  return redirect(redirectUrl, { headers });
};

export default function JoinPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/login">Login</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <Form method="post" className="w-full space-y-4">
          <InputPair
            label="Email"
            description="Enter your email"
            id="email"
            name="email"
            required
            type="email"
            placeholder="Enter your email"
          />
          {actionData?.formError?.email?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Password"
            description="Enter your password"
            id="password"
            name="password"
            required
            type="password"
            placeholder="Enter your password"
          />
          {actionData?.formError?.password?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <LoadingButton isLoading={isSubmitting}>Create an account</LoadingButton>
          {actionData?.signUpError && (
            <p className="text-sm text-red-500">{actionData.signUpError.message}</p>
          )}
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}
