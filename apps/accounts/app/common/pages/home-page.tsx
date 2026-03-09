import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ryugibo/ui";
import { BookOpen } from "@ryugibo/ui/icons";
import { resolveAppUrl } from "@ryugibo/utils";
import { useState } from "react";
import { Form, redirect } from "react-router";
import { createAdminClient, createSSRClient } from "~/supabase.server.ts";
import type { Route } from "./+types/home-page";

export const meta = () => {
  return [{ title: "홈 | ryugibo.com" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return { user };
};

export const action = async ({ request, context }: Route.ActionArgs) => {
  const { supabase, headers } = createSSRClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login", { headers });
  }

  const serviceRoleKey = context.cloudflare?.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    return { error: "서비스 설정 오류입니다. 관리자에게 문의해 주세요." };
  }

  const adminClient = createAdminClient(serviceRoleKey);

  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    return { error: "계정 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }

  await supabase.auth.signOut();
  return redirect("/login", { headers });
};

export default function HomePage({ loaderData, actionData }: Route.ComponentProps) {
  const { user } = loaderData;
  const denUrl = resolveAppUrl("den");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full grow bg-muted/20 px-6 py-12 lg:py-0 sm:px-12">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">환영합니다!</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <a href={denUrl} className="block group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  Den
                </CardTitle>
                <CardDescription>개인 도서 라이브러리 및 독서 기록 공간입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Den으로 이동하기 &rarr;</p>
              </CardContent>
            </Card>
          </a>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Form method="get" action="/logout">
            <Button type="submit" variant="ghost">
              로그아웃
            </Button>
          </Form>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-destructive hover:text-destructive text-sm">
                회원 탈퇴
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>정말로 탈퇴하시겠습니까?</DialogTitle>
                <DialogDescription>
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                </DialogDescription>
              </DialogHeader>
              {actionData?.error && <p className="text-sm text-destructive">{actionData.error}</p>}
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  취소
                </Button>
                <Form method="post" onSubmit={() => setIsDeleteDialogOpen(false)}>
                  <Button type="submit" variant="destructive">
                    탈퇴하기
                  </Button>
                </Form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
