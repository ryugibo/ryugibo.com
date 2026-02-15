import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@ryugibo/ui";
import { LogOut } from "@ryugibo/ui/icons";
import { resolveAppUrl } from "@ryugibo/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { data, Form, redirect } from "react-router";
import { toast } from "sonner";
import { getProfileById } from "~/features/profile/queries.ts";
import { createSSRClient } from "~/supabase.server.ts";
import { useTranslation } from "../../../common/hooks/use-translation.ts";
import { translations } from "../../../common/translations/translations.ts";
import type { Route } from "./+types/settings-page";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSSRClient(request);
  const { data: dataUser, error: errorUser } = await supabase.auth.getUser();
  if (errorUser) {
    return redirect("/?error=login_required", { headers });
  }
  const {
    user: { id, email },
  } = dataUser;
  const profile = await getProfileById({ supabase, id });
  return data({ profile, email }, { headers });
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "logout") {
    return redirect(`${resolveAppUrl("accounts")}/logout`);
  }
};

export default function SettingsPage({ loaderData }: Route.ComponentProps) {
  const { t, language, setLanguage } = useTranslation();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { profile, email } = loaderData;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    toast.success(t("settings.saved") || "설정이 저장되었습니다.", {
      description: t("settings.savedDesc") || "변경사항이 성공적으로 저장되었습니다.",
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 max-w-4xl mx-auto w-full">
      <header className="border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          {t("settings.title") || "설정"}
        </h1>
        <p className="text-muted-foreground">
          {t("settings.subtitle") || "계정 및 앱 설정을 관리하세요."}
        </p>
      </header>

      <div className="space-y-8">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.profile") || "프로필"}</CardTitle>
            <CardDescription>
              {t("settings.profileDesc") || "프로필 정보를 관리하세요."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">사용자명</Label>
                <Input id="username" defaultValue={profile?.username || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" defaultValue={email || ""} disabled />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">로그아웃</Label>
                <p className="text-sm text-muted-foreground">현재 계정에서 로그아웃합니다.</p>
              </div>
              <Form method="post">
                <input type="hidden" name="intent" value="logout" />
                <Button type="submit" variant="outline">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </Button>
              </Form>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.appearance") || "외관"}</CardTitle>
            <CardDescription>
              {t("settings.appearanceDesc") || "앱의 외관을 사용자 지정하세요."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("settings.language") || "언어"}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.languageDesc") || "앱에서 사용할 언어를 선택하세요."}
                </p>
              </div>
              <div className="w-[180px]">
                {mounted ? (
                  <Select value={language} onValueChange={(val) => setLanguage(val as "en" | "ko")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{translations.en["language.label"]}</SelectItem>
                      <SelectItem value="ko">{translations.ko["language.label"]}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Select defaultValue="ko" disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                  </Select>
                )}
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("settings.theme") || "테마"}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.themeDesc") || "앱의 테마를 선택하세요."}
                </p>
              </div>
              <div className="w-[180px]">
                {mounted ? (
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("settings.theme") || "테마"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t("settings.theme.light") || "라이트"}</SelectItem>
                      <SelectItem value="dark">{t("settings.theme.dark") || "다크"}</SelectItem>
                      <SelectItem value="system">
                        {t("settings.theme.system") || "시스템"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Select defaultValue="system" disabled>
                    <SelectTrigger>
                      <SelectValue placeholder={t("settings.theme") || "테마"} />
                    </SelectTrigger>
                  </Select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="ghost">{t("settings.cancel") || "취소"}</Button>
          <Button onClick={handleSave}>{t("settings.save") || "저장"}</Button>
        </div>
      </div>
    </div>
  );
}
