import { cn } from "@ryugibo/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@ryugibo/ui/avatar";

interface MessageBubbleProps {
  avatarSrc: string;
  avatarFallback: string;
  message: string;
  isCurrentUser?: boolean;
}

export function MessageBubble({
  avatarSrc,
  avatarFallback,
  message,
  isCurrentUser,
}: MessageBubbleProps) {
  return (
    <div className={cn("flex items-end gap-4", isCurrentUser && "flex-row-reverse")}>
      <Avatar>
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div
        className={cn({
          "rounded-md p-4 text-sm w-1/4": true,
          "bg-accent rounded-br-none": isCurrentUser,
          "bg-primary text-primary-foreground rounded-bl-none": !isCurrentUser,
        })}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}
