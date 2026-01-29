import { SiGithub } from "@icons-pack/react-simple-icons";
import { Button, Separator } from "@ryugibo/ui";
import { LockIcon } from "@ryugibo/ui/icons";
import { Link, useSearchParams } from "react-router";

export default function AuthButtons() {
  const [searchParams] = useSearchParams();
  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div className="w-full flex flex-col items-center gap-2">
        <Separator className="w-full" />
        <span className="text-xs text-muted-foreground uppercase font-medium">
          or continue with
        </span>
        <Separator className="w-full" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/social/github/start?${searchParams.toString()}`}>
            <SiGithub className="size-5" />
            Github
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/otp/start">
            <LockIcon className="size-4" />
            OTP
          </Link>
        </Button>
      </div>
    </div>
  );
}
