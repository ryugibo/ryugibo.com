import { Badge } from "@ryugibo/ui";
import { Link, Outlet, redirect, useLocation } from "react-router";
import { createSSRClient } from "~/supabase.server.ts";
import type { Route } from "./+types/admin-layout";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return redirect("/login");
  }

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Response("Unauthorized", { status: 403 });
  }

  return {};
};

export default function AdminLayout() {
  const location = useLocation();

  // Simple active tab logic based on path
  const currentTab = location.pathname.includes("/admin/content") ? "content" : "requests";

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage content and requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Admin Access</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
          <Link
            to="/admin"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              currentTab === "requests" ? "bg-background text-foreground shadow" : ""
            }`}
          >
            Requests
          </Link>
          <Link
            to="/admin/content"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              currentTab === "content" ? "bg-background text-foreground shadow" : ""
            }`}
          >
            Content
          </Link>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
