import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  Toaster,
} from "@ryugibo/ui";
import { BookOpen } from "@ryugibo/ui/icons";
import { useEffect } from "react";
import { data, Link, Outlet, redirect, useLocation, useSearchParams } from "react-router";
import { toast } from "sonner";
import { getProfileById } from "~/features/profile/queries.ts";
import { createSSRClient } from "~/supabase.server.ts";
import { AppSidebar } from "../components/app-sidebar.tsx";
import { BottomNav } from "../components/bottom-nav.tsx";
import { useTranslation } from "../hooks/use-translation.ts";
import type { Route } from "./+types/app-layout.ts";

const segmentTranslationMap: Record<string, string> = {
  library: "nav.library",
  collections: "nav.collections",
  settings: "nav.settings",
  books: "nav.books",
  search: "nav.search",
  add: "nav.add",
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { supabase, headers } = createSSRClient(request);
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return data({}, { headers });
  }

  const {
    user: { id },
  } = userData;
  const isMakeProfilePage = url.pathname === "/make-profile";

  try {
    const profile = await getProfileById({ supabase, id });

    // If on make-profile but already has profile -> redirect to home
    if (profile && isMakeProfilePage) {
      return redirect("/", { headers });
    }

    // If NOT on make-profile but NO profile -> redirect to make-profile
    if (!profile && !isMakeProfilePage) {
      return redirect("/make-profile", { headers });
    }

    return null;
  } catch (_error) {
    // On error (e.g. getProfileById fails/returns null logic), if not on make-profile, go there
    if (!isMakeProfilePage) {
      return redirect("/make-profile", { headers });
    }
    return null;
  }
};

export default function AppLayout(_: Route.ComponentProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "login_required") {
      toast.error(t("auth.loginRequired") || "로그인이 필요한 기능입니다.");
      // Clear the error param
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, t]);

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
                <BreadcrumbItem className="md:hidden">
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 pb-20 md:pb-4">
          <Outlet />
        </div>
      </SidebarInset>
      <BottomNav />
      <Toaster position="top-center" />
    </SidebarProvider>
  );
}
