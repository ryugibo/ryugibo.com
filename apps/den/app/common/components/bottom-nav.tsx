import { cn } from "@ryugibo/ui";
import { Home, Layers, Library, Search, Settings } from "@ryugibo/ui/icons";
import { Link, useLocation } from "react-router";

import { useTranslation } from "../hooks/use-translation.ts";

export function BottomNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const items = [
    {
      title: t("nav.home"),
      url: "/",
      icon: Home,
    },
    {
      title: t("nav.search"),
      url: "/books/search",
      icon: Search,
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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 md:hidden">
      <nav className="flex h-16 items-center justify-around px-4">
        {items.map((item) => {
          const isActive =
            location.pathname === item.url ||
            (item.url !== "/" && location.pathname.startsWith(item.url));

          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon
                className={cn("h-6 w-6", isActive && "fill-current")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
