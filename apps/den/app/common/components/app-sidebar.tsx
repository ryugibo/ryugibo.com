import { Avatar, AvatarFallback, AvatarImage } from "@ryugibo/ui/avatar";
import { BookOpen, Home, Layers, Library, Settings } from "@ryugibo/ui/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ryugibo/ui/sidebar";
import { useEffect, useState } from "react";
import { Link, useLocation, useRouteLoaderData } from "react-router";

import { useTranslation } from "../hooks/use-translation.ts";

export function AppSidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useRouteLoaderData("root");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const items = [
    {
      title: t("nav.home"),
      url: "/",
      icon: Home,
    },
    {
      title: t("nav.library"),
      url: "/library",
      icon: Library,
    },
    {
      title: t("nav.collections"),
      url: "/collections",
      icon: Layers,
    },
    {
      title: t("nav.settings"),
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-sidebar-primary-foreground">
                  <BookOpen className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{t("nav.den")}</span>
                  <span className="truncate text-xs">{t("nav.libraryManager")}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.url ||
                      (item.url !== "/" && location.pathname.startsWith(item.url))
                    }
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {user ? (
                <Link to="/settings">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="" alt="Ryugibo" />
                    <AvatarFallback className="rounded-lg">R</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.email}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </Link>
              ) : (
                <a
                  href={`${import.meta.env.VITE_ACCOUNTS_URL}/login?redirect_url=${encodeURIComponent(
                    `${origin}${location.pathname}`,
                  )}`}
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-sidebar-primary-foreground">
                    <BookOpen className="size-4 text-white" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Login</span>
                  </div>
                </a>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
