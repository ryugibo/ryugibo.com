import { Button } from "@ryugibo/ui/button";
import { LoaderCircleIcon } from "@ryugibo/ui/icons";
import { Form, Link, redirect, useNavigation } from "react-router";
import z from "zod";
import InputPair from "~/common/components/input-pair.tsx";
import AuthButtons from "~/features/auth/components/auth-buttons.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { isExistsUsername } from "../queries.ts";
import type { Route } from "./+types/join-page";

export const meta = () => {
  return [{ title: "Join | wemake" }];
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  console.log(formData);
  const { success, data, error: formZodError } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    const formError = formZodError.issues.reduce(
      (acc, issue) => {
        const key = issue.path.join(".");
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push({ key: acc[key].length, message: issue.message });
        return acc;
      },
      {} as Record<string, { key: number; message: string }[]>,
    );
    return { formError };
  }
  const { supabase, headers } = createSSRClient(request);
  const isTakenUsername = await isExistsUsername(supabase, { username: data.username });
  if (isTakenUsername) {
    return { formError: { username: [{ key: 0, message: "Username already exists" }] } };
  }
  const { email, password, name, username } = data;
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        username,
      },
    },
  });
  if (signUpError) {
    return { signUpError };
  }
  return redirect("/", { headers });
};

export default function JoinPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/auth/login">Login</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <Form method="post" className="w-full space-y-4">
          <InputPair
            label="Name"
            description="Enter your name"
            id="name"
            name="name"
            required
            type="text"
            placeholder="Enter your name"
          />
          {actionData?.formError?.name?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Username"
            description="Enter your username"
            id="username"
            name="username"
            required
            type="text"
            placeholder="Enter your username"
          />
          {actionData?.formError?.username?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
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
          <Button type="submit" className="w-full">
            {isSubmitting ? <LoaderCircleIcon className="animate-spin" /> : "Create an account"}
          </Button>
          {actionData?.signUpError && (
            <p className="text-sm text-red-500">{actionData.signUpError.message}</p>
          )}
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}
