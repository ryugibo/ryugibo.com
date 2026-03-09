import { LoadingButton } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { Form, Link, redirect, useNavigation, useSearchParams } from "react-router";
import z from "zod";
import InputPair from "~/common/components/input-pair.tsx";
import AuthButtons from "~/features/auth/components/auth-buttons.tsx";
import { createSSRClient } from "~/supabase.server.ts";
import type { Route } from "./+types/login-page";

export const meta = () => {
  return [{ title: "로그인 | ryugibo.com" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/");
  }
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
    return { loginError };
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
          <InputPair
            label="이메일"
            description="이메일 주소를 입력해주세요."
            id="email"
            name="email"
            required
            type="email"
            placeholder="이메일을 입력하세요"
          />
          {actionData?.formError?.email?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="비밀번호"
            description="비밀번호를 입력해주세요."
            id="password"
            name="password"
            required
            type="password"
            placeholder="비밀번호를 입력하세요"
          />
          {actionData?.formError?.password?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <LoadingButton isLoading={isSubmitting}>로그인</LoadingButton>
          {actionData?.loginError && (
            <p className="text-sm text-red-500">{actionData.loginError.message}</p>
          )}
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
