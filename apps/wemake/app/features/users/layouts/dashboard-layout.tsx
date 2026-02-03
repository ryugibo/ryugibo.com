import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@ryugibo/ui";
import { HomeIcon, PackageIcon, SparkleIcon } from "@ryugibo/ui/icons";
import { Link, Outlet, redirect, useLocation } from "react-router";
import { createSSRClient } from "~/supabase-client.ts";
import { getProductsByProfileId } from "../queries.ts";
import type { Route } from "./+types/dashboard-layout";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, getAuthUser } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    throw redirect("/");
  }
  const { id: profile_id } = user;
  const products = await getProductsByProfileId({ supabase, profile_id });
  return { products };
};

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const { products } = loaderData;

  return (
    <SidebarProvider className="flex min-h-full">
      <Sidebar variant="floating" className="pt-16">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/my/dashboard"}>
                  <Link to="/my/dashboard">
                    <HomeIcon className="size-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/my/dashboard/ideas"}>
                  <Link to="/my/dashboard/ideas">
                    <SparkleIcon className="size-4" />
                    <span>Ideas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Product Analytics</SidebarGroupLabel>
            <SidebarMenu>
              {products.map((product) => (
                <SidebarMenuItem key={product.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === `/my/dashboard/products/${product.id}`}
                  >
                    <Link to={`/my/dashboard/products/${product.id}`}>
                      <PackageIcon className="size-4" />
                      <span>{product.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
