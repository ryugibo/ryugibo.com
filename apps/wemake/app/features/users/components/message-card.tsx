import { Avatar, AvatarFallback, AvatarImage } from "@ryugibo/ui/avatar";
import { SidebarMenuButton, SidebarMenuItem } from "@ryugibo/ui/sidebar";
import { Link, useLocation } from "react-router";

interface MessageCardProps {
  avatarSrc: string;
  avatarFallback: string;
  userName: string;
  lastMessage: string;
}

export function MessageCard({
  avatarSrc,
  avatarFallback,
  userName,
  lastMessage,
}: MessageCardProps) {
  const location = useLocation();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="h-18"
        asChild
        isActive={location.pathname === `/my/messages/${userName}`}
      >
        <Link to={`/my/messages/${userName}`}>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={avatarSrc} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-muted-foreground">{lastMessage}</span>
            </div>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
