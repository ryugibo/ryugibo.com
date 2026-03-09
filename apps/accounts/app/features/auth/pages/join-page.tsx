import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FloatingInput,
  LoadingButton,
  ScrollArea,
} from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Form, Link, redirect, useNavigation, useSearchParams } from "react-router";
import remarkGfm from "remark-gfm";
import z from "zod";
import AuthButtons from "~/features/auth/components/auth-buttons.tsx";
import privacyPolicy from "~/features/auth/content/privacy-policy.md?raw";
import { createSSRClient } from "~/supabase.server.ts";
import type { Route } from "./+types/join-page";

export const meta = () => {
  return [{ title: "회원가입 | ryugibo.com" }];
};

const formSchema = z.object({
  email: z.email("유효하지 않은 이메일 형식입니다."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  terms: z.literal("on", {
    message: "개인정보 수집 및 이용에 동의해야 합니다.",
  }),
});

const getSignUpErrorMessage = (code: string | undefined, message: string): string => {
  switch (code) {
    case "user_already_exists":
    case "email_exists":
      return "이미 가입된 이메일입니다.";
    case "weak_password":
      return "비밀번호가 너무 약합니다. 더 복잡한 비밀번호를 사용해주세요.";
    case "over_request_rate_limit":
      return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    case "email_provider_disabled":
      return "이메일 가입이 비활성화되어 있습니다.";
    default:
      if (message.includes("already registered") || message.includes("already exists")) {
        return "이미 가입된 이메일입니다.";
      }
      return "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
};

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
    const errorMessage = getSignUpErrorMessage(signUpError.code, signUpError.message);
    return { error: errorMessage };
  }

  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get("redirect_url") || "/";

  return redirect(redirectUrl, { headers });
};

export default function JoinPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState<boolean | "indeterminate">(false);

  const [policyTitleLine, ...policyBodyLines] = privacyPolicy.split("\n");
  const policyTitle = policyTitleLine.replace(/^#\s*/, "");
  const policyBody = policyBodyLines.join("\n").trim();

  const handleAgreeClick = () => {
    setIsTermsChecked(true);
    setIsTermsModalOpen(false);
  };

  return (
    <div className="flex flex-col relative items-center justify-center h-full px-6 py-12 lg:py-0 sm:px-12">
      <div className="flex flex-col items-center justify-center w-full max-w-lg gap-8">
        <h1 className="text-2xl font-semibold">계정 생성</h1>
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
          <div className="flex items-start space-x-2 mt-4">
            <Checkbox
              id="terms"
              name="terms"
              required
              className="mt-1"
              checked={isTermsChecked}
              onCheckedChange={setIsTermsChecked}
            />
            <div className="grid gap-1.5 leading-none">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  (필수) ryugibo.com 개인정보 수집 및 이용에 동의합니다.
                </label>
                <Dialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      type="button"
                      className="p-0 h-auto text-sm text-muted-foreground justify-start"
                    >
                      내용 보기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>{policyTitle}</DialogTitle>
                      <DialogDescription>
                        회원 가입을 위해 필수적인 개인정보 수집 및 이용 동의입니다.
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[50vh] mt-4 border rounded-md p-4 bg-muted/20">
                      <div className="text-sm prose prose-sm dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{policyBody}</ReactMarkdown>
                      </div>
                    </ScrollArea>
                    <div className="mt-4 flex justify-end">
                      <Button type="button" onClick={handleAgreeClick}>
                        동의합니다
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          {actionData?.formError?.terms?.map(({ key, message }) => (
            <p key={key} className="text-sm text-red-500">
              {message}
            </p>
          ))}
          <LoadingButton isLoading={isSubmitting}>계정 생성하기</LoadingButton>
          {actionData?.error && <p className="text-sm text-red-500">{actionData.error}</p>}
        </Form>
        <AuthButtons />
        <div className="text-sm text-center text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link
            to={`/login?${searchParams.toString()}`}
            className="text-primary hover:underline font-medium"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
