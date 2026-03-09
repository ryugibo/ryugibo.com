import { Button, ScrollArea } from "@ryugibo/ui";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router";
import remarkGfm from "remark-gfm";
import privacyPolicy from "~/features/auth/content/privacy-policy.md?raw";
import type { Route } from "./+types/privacy-page";

export const meta = () => {
  return [{ title: "개인정보 처리방침 | ryugibo.com" }];
};

export default function PrivacyPage(_: Route.ComponentProps) {
  const navigate = useNavigate();

  // 상단 헤더 타이틀 추출 로직 (join-page와 동일)
  const [policyTitleLine, ...policyBodyLines] = privacyPolicy.split("\n");
  const policyTitle = policyTitleLine.replace(/^#\s*/, "");
  const policyBody = policyBodyLines.join("\n").trim();

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{policyTitle}</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          돌아가기
        </Button>
      </div>

      <ScrollArea className="grow border rounded-lg p-8 bg-muted/10 shadow-sm">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{policyBody}</ReactMarkdown>
        </div>
      </ScrollArea>
    </div>
  );
}
