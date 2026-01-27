import { Button } from "@ryugibo/ui/button";
import { LoaderCircleIcon } from "@ryugibo/ui/icons";
import { Form, Link, redirect, useNavigation } from "react-router";
import z from "zod";
import InputPair from "~/common/components/input-pair.tsx";
import AuthButtons from "~/features/auth/components/auth-buttons.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/login-page";

export const meta = () => {
  return [{ title: "Login | wemake" }];
};

const formSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string({ error: "Password must be a string" })
    .min(8, { error: "Password must be at least 8 characters long" }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, error: formZodError, data } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    const formError = formZodError.issues.reduce(
      (acc, issue) => {
        const key = issue.path.join(".");
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push({ index: acc[key].length, message: issue.message });
        return acc;
      },
      {} as Record<string, { index: number; message: string }[]>,
    );
    return { formError };
  }

  const { email, password } = data;
  const { supabase, headers } = createSSRClient(request);
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) {
    return { loginError };
  }

  return redirect("/", { headers });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/auth/join">Join</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">Log in to your account</h1>
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
          {actionData?.formError?.email?.map(({ index, message }) => (
            <p key={`${index}`} className="text-sm text-red-500">
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
          {actionData?.formError?.password?.map(({ index, message }) => (
            <p key={`${index}`} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircleIcon className="animate-spin" /> : "Login"}
          </Button>
          {actionData?.loginError && (
            <p className="text-sm text-red-500">{actionData.loginError.message}</p>
          )}
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}
