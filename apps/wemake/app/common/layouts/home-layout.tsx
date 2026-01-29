import { cn } from "@ryugibo/ui";
import { Outlet, redirect } from "react-router";
import { getProfileById } from "~/features/users/queries.ts";
import { createSSRClient } from "~/supabase-client.ts";
import Navigation from "../components/navigation.tsx";
import type { Route } from "./+types/home-layout";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { origin } = url;
  const { supabase } = createSSRClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { user, profile: null, origin };
  }

  const isMakeProfilePage = url.pathname === "/make-profile";
  try {
    const profile = await getProfileById(supabase, { id: user.id });
    if (isMakeProfilePage) {
      return redirect("/");
    }
    return { user, profile, origin };
  } catch (_error) {
    if (!isMakeProfilePage) {
      return redirect("/make-profile");
    }
    return { user, profile: null, origin };
  }
};

export default function HomeLayout({ loaderData }: Route.ComponentProps) {
  const isLoggedIn = loaderData.user !== null;
  return (
    <div className={cn("py-28 px-5 lg:px-20")}>
      <Navigation
        origin={loaderData.origin}
        isLoggedIn={isLoggedIn}
        name={loaderData.profile?.name}
        username={loaderData.profile?.username}
        avatar={loaderData.profile?.avatar}
        hasNotifications={true}
        hasMessages={true}
      />
      <Outlet />
    </div>
  );
}
