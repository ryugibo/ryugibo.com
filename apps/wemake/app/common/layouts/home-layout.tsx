import { cn } from "@ryugibo/ui";
import { data, Outlet, redirect } from "react-router";
import { getProfileById } from "~/features/users/queries.ts";
import { createSSRClient } from "~/supabase-client.ts";
import Navigation from "../components/navigation.tsx";
import type { Route } from "./+types/home-layout";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { origin } = url;
  const { supabase, getAuthUser, headers } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    return data({ isLoggedIn: false, profile: null, origin }, { headers });
  }
  const { id } = user;

  const isMakeProfilePage = url.pathname === "/make-profile";
  try {
    const profile = await getProfileById({ supabase, id });
    if (isMakeProfilePage) {
      return redirect("/", { headers });
    }
    return data({ isLoggedIn: true, profile, origin }, { headers });
  } catch (_error) {
    if (!isMakeProfilePage) {
      return redirect("/make-profile", { headers });
    }
    return data({ isLoggedIn: false, profile: null, origin }, { headers });
  }
};

export type OutletContext =
  | {
      isLoggedIn: true;
      name: string;
      username: string;
      avatar: string | null;
    }
  | {
      isLoggedIn: false;
      name: null;
      username: null;
      avatar: null;
    };

export default function HomeLayout({ loaderData }: Route.ComponentProps) {
  const { isLoggedIn } = loaderData;
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
      <Outlet
        context={
          {
            isLoggedIn,
            name: loaderData.profile?.name,
            username: loaderData.profile?.username,
            avatar: loaderData.profile?.avatar,
          } as OutletContext
        }
      />
    </div>
  );
}
