import { FloatingInput, LoadingButton } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { Form, Link, redirect, useNavigation, useSearchParams } from "react-router";
import z from "zod";
import AuthButtons from "~/features/auth/components/auth-buttons.tsx";
import { createSSRClient } from "~/supabase.server.ts";
import type { Route } from "./+types/login-page";

export const meta = () => {
  return [{ title: "로그인 | ryugibo.com" }];
};

const formSchema = z.object({
  email: z.email({ error: "유효하지 않은 이메일 형식입니다." }),
  password: z
    .string({ error: "비밀번호를 입력해주세요." })
    .min(8, { error: "비밀번호는 최소 8자 이상이어야 합니다." }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, error: formZodError, data } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    const formError = parseZodError(formZodError);
    return { formError };
  }

  const { email, password } = data;
  const { supabase, headers } = createSSRClient(request);
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

  if (loginError) {
    const message =
      loginError.code === "invalid_credentials"
        ? "이메일 또는 비밀번호가 올바르지 않습니다."
        : "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    return { error: message };
  }

  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get("redirect_url") || "/";

  return redirect(redirectUrl, { headers });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full px-6 py-12 lg:py-0 sm:px-12">
      <div className="flex flex-col items-center justify-center w-full max-w-lg gap-8">
        <h1 className="text-2xl font-semibold">로그인</h1>
        <Form method="post" className="w-full space-y-4">
          <FloatingInput
            label="이메일"
            id="email"
            name="email"
            required
            type="email"
            error={actionData?.formError?.email?.map((e) => e.message).join(" ")}
          />
          <FloatingInput
            label="비밀번호"
            id="password"
            name="password"
            required
            type="password"
            error={actionData?.formError?.password?.map((e) => e.message).join(" ")}
          />
          <LoadingButton isLoading={isSubmitting}>로그인</LoadingButton>
          {actionData?.error && <p className="text-sm text-red-500">{actionData.error}</p>}
        </Form>
        <AuthButtons />
        <div className="text-sm text-center text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link
            to={`/join?${searchParams.toString()}`}
            className="text-primary hover:underline font-medium"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
