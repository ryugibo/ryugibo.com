import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
} from "@ryugibo/ui";
import { EyeIcon } from "@ryugibo/ui/icons";
import { DateTime } from "luxon";
import { Link } from "react-router";
import type { NotificationType } from "../constants.ts";
import { NOTIFICATION_LABELS } from "../constants.ts";

interface NotificationCardProps {
  avatar: string | null;
  name: string;
  type: NotificationType;
  timestamp: string;
  seen: boolean;
  product: { id: number; name: string } | null;
  post: { id: number; title: string } | null;
}

export function NotificationCard({
  avatar,
  name,
  type,
  timestamp,
  seen,
  product,
  post,
}: NotificationCardProps) {
  return (
    <Card className={cn("min-w-[450px]", !seen && "bg-yellow-500/60")}>
      <CardHeader className="flex flex-row gap-5 items-start">
        <Avatar>
          {avatar && <AvatarImage src={avatar} />}
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg font-bold">
            <span>{name}</span>
            <span>{NOTIFICATION_LABELS[type]}</span>
            {type === "review" && product && (
              <Button variant={"ghost"} asChild className="text-lg">
                <Link to={`/products/${product.id}`}>{product.name}</Link>
              </Button>
            )}
            {type === "reply" && post && (
              <Button variant={"ghost"} asChild className="text-lg">
                <Link to={`/community/${post.id}`}>{post.title}</Link>
              </Button>
            )}
          </CardTitle>
          <small className="text-muted-foreground text-sm">
            {DateTime.fromISO(timestamp).toRelative()}
          </small>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="icon">
          <EyeIcon className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
