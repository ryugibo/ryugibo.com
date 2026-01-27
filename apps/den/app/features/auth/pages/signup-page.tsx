import { Button } from "@ryugibo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ryugibo/ui/card";
import { Input } from "@ryugibo/ui/input";
import { Label } from "@ryugibo/ui/label";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "../../../common/hooks/use-translation.ts";
import type { Route } from "./+types/signup-page";

export default function SignupPage(_: Route.ComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("auth.signup.title")}</CardTitle>
          <CardDescription>{t("auth.signup.subtitle")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("auth.signup.name")}</Label>
              <Input id="name" placeholder="Ryugibo" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("auth.signup.email")}</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("auth.signup.password")}</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full">{t("auth.signup.submit")}</Button>
            <div className="text-center text-sm">
              {t("auth.signup.hasAccount")}{" "}
              <Link to="/auth/login" className="underline underline-offset-4">
                {t("auth.signup.login")}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
