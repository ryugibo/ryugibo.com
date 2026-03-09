import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LoadingButton,
  ScrollArea,
} from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Form, Link, redirect, useNavigation, useSearchParams } from "react-router";
import remarkGfm from "remark-gfm";
import z from "zod";
import InputPair from "~/common/components/input-pair.tsx";
import AuthButtons from "~/features/auth/components/auth-buttons.tsx";
import privacyPolicy from "~/features/auth/content/privacy-policy.md?raw";
import { createSSRClient } from "~/supabase-client.ts";
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
    <div className="flex flex-col relative items-center justify-center h-full px-6 sm:px-12">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to={`/login?${searchParams.toString()}`}>로그인</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-lg gap-8">
        <h1 className="text-2xl font-semibold">계정 생성</h1>
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
            description="안전한 비밀번호를 설정해주세요."
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
          {actionData?.signUpError && (
            <p className="text-sm text-red-500">{actionData.signUpError.message}</p>
          )}
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}
