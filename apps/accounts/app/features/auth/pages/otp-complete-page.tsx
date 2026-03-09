import { Button, LoadingButton } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { Form, Link, redirect, useNavigation, useSearchParams } from "react-router";
import z from "zod";
import InputPair from "~/common/components/input-pair.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/otp-complete-page";

export const meta = () => {
  return [{ title: "OTP 인증 | ryugibo.com" }];
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
    return {
      formError: { token: [{ key: 0, message: "올바르지 않거나 만료된 인증 코드입니다." }] },
    };
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
        <Link to="/join">회원가입</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">OTP 인증</h1>
          <p className="text-sm text-muted-foreground">
            이메일로 전송된 4자리 인증 코드를 입력해주세요.
          </p>
        </div>
        <Form method="post" className="w-full space-y-4">
          <InputPair
            label="이메일"
            description="이메일 주소를 입력해주세요."
            id="email"
            name="email"
            required
            type="email"
            placeholder="이메일을 입력하세요"
            defaultValue={email}
            readOnly
          />
          <InputPair
            label="인증 코드"
            description="이메일로 전송된 OTP 인증 코드를 입력해주세요."
            id="token"
            name="token"
            required
            type="number"
            placeholder="예: 1234"
          />
          {actionData?.formError?.token?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}

          <LoadingButton isLoading={isSubmitting}>로그인</LoadingButton>
        </Form>
      </div>
    </div>
  );
}
