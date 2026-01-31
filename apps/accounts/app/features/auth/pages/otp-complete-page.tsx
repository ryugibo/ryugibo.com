import { Button, LoadingButton } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { Form, Link, redirect, useNavigation, useSearchParams } from "react-router";
import z from "zod";
import InputPair from "~/common/components/input-pair.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/otp-complete-page";

export const meta = () => {
  return [{ title: "Verify OTP | wemake" }];
};

const formSchema = z.object({
  email: z.email(),
  token: z.string().min(8).max(8),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, error: formZodError, data } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    const formError = parseZodError(formZodError);
    return { formError };
  }

  const { email, token } = data;
  const { supabase, headers } = createSSRClient(request);
  const { error: authError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (authError) {
    console.log(authError);
    return { formError: { token: [{ key: 0, message: "Token has expired or is invalid" }] } };
  }

  return redirect("/", { headers });
};

export default function OtpCompletePage({ actionData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/join">Join</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Confirm OTP</h1>
          <p className="text-sm text-muted-foreground">
            Enter the OTP code sent to your meail address.
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
            placeholder="i.e wemake@example.com"
            defaultValue={email}
            readOnly
          />
          <InputPair
            label="OTP Code"
            description="Enter the OTP code sent to your email address"
            id="token"
            name="token"
            required
            type="number"
            placeholder="i.e 1234"
          />
          {actionData?.formError?.token?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}

          <LoadingButton isLoading={isSubmitting}>Log in</LoadingButton>
        </Form>
      </div>
    </div>
  );
}
