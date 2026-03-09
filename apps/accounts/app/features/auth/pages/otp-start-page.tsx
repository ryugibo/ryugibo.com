import { Button, FloatingInput, LoadingButton } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { Form, Link, redirect, useNavigation } from "react-router";
import z from "zod";
import { createSSRClient } from "~/supabase.server.ts";
import type { Route } from "./+types/otp-start-page";

export const meta = () => {
  return [{ title: "OTP 로그인 | ryugibo.com" }];
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
    return { error: "이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }

  return redirect(`/otp/complete?email=${encodeURIComponent(email)}`);
};

export default function OtpStartPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/join">회원가입</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">OTP로 로그인</h1>
          <p className="text-sm text-muted-foreground">
            계정에 로그인하기 위해 4자리 인증 코드를 보내드립니다.
          </p>
        </div>
        <Form method="post" className="w-full space-y-4">
          <FloatingInput
            label="이메일"
            id="email"
            name="email"
            required
            type="email"
            error={actionData?.formError?.email?.map((e) => e.message).join(" ")}
          />
          <LoadingButton isLoading={isSubmitting}>인증 코드 전송</LoadingButton>
          {actionData?.error && <p className="text-sm text-red-500">{actionData.error}</p>}
        </Form>
      </div>
    </div>
  );
}
