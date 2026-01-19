import { SiGithub } from "@icons-pack/react-simple-icons";
import { Button } from "@ryugibo/ui/button";
import { LockIcon, MessageCircleIcon } from "@ryugibo/ui/icons";
import { Separator } from "@ryugibo/ui/separator";
import { Link } from "react-router";

export default function AuthButtons() {
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
          <Link to="/auth/social/kakao/start">
            <MessageCircleIcon className="size-4" />
            Kakao Talk
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/auth/social/github/start">
            <SiGithub className="size-5" />
            Github
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/auth/otp/start">
            <LockIcon className="size-4" />
            OTP
          </Link>
        </Button>
      </div>
    </div>
  );
}
