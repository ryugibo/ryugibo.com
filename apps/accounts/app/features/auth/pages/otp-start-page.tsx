import { Button, LoadingButton } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { Form, Link, redirect, useNavigation } from "react-router";
import z from "zod";
import InputPair from "~/common/components/input-pair.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/otp-start-page";

export const meta = () => {
  return [{ title: "OTP Start | wemake" }];
};

const formSchema = z.object({
  email: z.email(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, error: formZodError, data } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    const formError = parseZodError(formZodError);
    return { formError };
  }

  const { email } = data;
  const { supabase } = createSSRClient(request);
  const { error: authError } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });

  if (authError) {
    console.log(authError);
    return { authError };
  }

  return redirect(`/otp/complete?email=${encodeURIComponent(email)}`);
};

export default function OtpStartPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/join">Join</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Log in with OTP</h1>
          <p className="text-sm text-muted-foreground">
            We will send you a 4-digit code to log in to your account.
          </p>
        </div>
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
          <LoadingButton isLoading={isSubmitting}>Send OTP</LoadingButton>
          {actionData?.authError && <p className="text-sm text-red-500">Unknown Error occurred</p>}
        </Form>
      </div>
    </div>
  );
}
