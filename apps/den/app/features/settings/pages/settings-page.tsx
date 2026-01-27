import { Avatar, AvatarFallback, AvatarImage } from "@ryugibo/ui/avatar";
import { Button } from "@ryugibo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ryugibo/ui/card";
import { Input } from "@ryugibo/ui/input";
import { Label } from "@ryugibo/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ryugibo/ui/select";
import { Separator } from "@ryugibo/ui/separator";
import { Slider } from "@ryugibo/ui/slider";
import { Switch } from "@ryugibo/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "../../../common/hooks/use-translation.ts";
import AppLayout from "../../../common/layouts/app-layout.tsx";
import { translations } from "../../../common/translations/translations.ts";
import type { Route } from "./+types/settings-page";

export default function SettingsPage(_: Route.ComponentProps) {
  const { t, language, setLanguage } = useTranslation();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    toast.success(t("settings.saved"), {
      description: t("settings.savedDesc"),
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-8 p-4 max-w-4xl mx-auto w-full">
        <header className="border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            {t("settings.title")}
          </h1>
          <p className="text-muted-foreground">{t("settings.subtitle")}</p>
        </header>

        <div className="space-y-8">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.profile")}</CardTitle>
              <CardDescription>{t("settings.profileDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">R</AvatarFallback>
                </Avatar>
                <Button variant="outline">{t("settings.changeAvatar")}</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="display-name">{t("settings.displayName")}</Label>
                  <Input id="display-name" defaultValue="Ryugibo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("settings.email")}</Label>
                  <Input id="email" type="email" defaultValue="ryugibo@example.com" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.appearance")}</CardTitle>
              <CardDescription>{t("settings.appearanceDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.language")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.languageDesc")}</p>
                </div>
                <div className="w-[180px]">
                  {mounted ? (
                    <Select
                      value={language}
                      onValueChange={(val) => setLanguage(val as "en" | "ko")}
                    >
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
                  <Label>{t("settings.theme")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.themeDesc")}</p>
                </div>
                <div className="w-[180px]">
                  {mounted ? (
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("settings.theme")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t("settings.theme.light")}</SelectItem>
                        <SelectItem value="dark">{t("settings.theme.dark")}</SelectItem>
                        <SelectItem value="system">{t("settings.theme.system")}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select defaultValue="system" disabled>
                      <SelectTrigger>
                        <SelectValue placeholder={t("settings.theme")} />
                      </SelectTrigger>
                    </Select>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.animations")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.animationsDesc")}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>{t("settings.coverSize")}</Label>
                  <span className="text-sm text-muted-foreground">Medium</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">{t("settings.dangerZone")}</CardTitle>
              <CardDescription>{t("settings.dangerZoneDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("settings.deleteAccount")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.deleteAccountDesc")}</p>
                </div>
                <Button variant="destructive">{t("settings.deleteAccount")}</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="ghost">{t("settings.cancel")}</Button>
            <Button onClick={handleSave}>{t("settings.save")}</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
