import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ryugibo/ui/breadcrumb";
import { Separator } from "@ryugibo/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@ryugibo/ui/sidebar";
import { Toaster } from "@ryugibo/ui/sonner";
import { BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router";
import { AppSidebar } from "../components/app-sidebar";
import { BottomNav } from "../components/bottom-nav";
import { useTranslation } from "../hooks/use-translation";

interface AppLayoutProps {
  children: React.ReactNode;
}

const segmentTranslationMap: Record<string, string> = {
  library: "nav.library",
  collections: "nav.collections",
  settings: "nav.settings",
  books: "nav.books",
  search: "nav.search",
  add: "nav.add",
};

export default function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-sidebar-border bg-sidebar px-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 hidden md:flex" />
            <div className="h-4 mr-1 hidden md:block">
              <Separator orientation="vertical" />
            </div>

            <Breadcrumb>
              <BreadcrumbList>
                {/* Mobile Home/Logo Breadcrumb */}
                <BreadcrumbItem className="md:hidden!">
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center gap-2">
                      <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-indigo-600 text-sidebar-primary-foreground">
                        <BookOpen className="size-3 text-white" />
                      </div>
                      <span className="font-semibold">Den</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.length > 0 && <BreadcrumbSeparator className="md:hidden" />}

                {pathSegments.map((segment, index) => {
                  if (segment === "books") return null;

                  const isLast = index === pathSegments.length - 1;
                  // Construct URL for this segment
                  const to = `/${pathSegments.slice(0, index + 1).join("/")}`;

                  // Use mapped translation key or default capitalization
                  const translationKey = segmentTranslationMap[segment];
                  const title = translationKey
                    ? t(translationKey)
                    : segment.charAt(0).toUpperCase() + segment.slice(1);

                  return (
                    <div key={to} className="flex items-center gap-1.5 sm:gap-2.5">
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={to}>{title}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </div>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 pb-20 md:pb-4">{children}</div>
      </SidebarInset>
      <BottomNav />
      <Toaster />
    </SidebarProvider>
  );
}
