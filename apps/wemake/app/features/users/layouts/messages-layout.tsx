import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarProvider } from "@ryugibo/ui";
import { Outlet } from "react-router";
import { MessageCard } from "~/features/users/components/message-card.tsx";
import type { Route } from "./+types/messages-layout";

export default function MessagesLayout(_: Route.ComponentProps) {
  return (
    <SidebarProvider className="flex h-[calc(100vh-14rem)] max-h-[calc(100vh-14rem)] overflow-hidden min-h-full">
      <Sidebar variant="floating" className="pt-16">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {[...Array(11).keys()].map((index) => (
                <MessageCard
                  key={index}
                  avatarSrc="https://github.com/shadcn.png"
                  avatarFallback="WM"
                  userName={`JohnDoe${index}`}
                  lastMessage="Last message"
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="w-full h-full">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
