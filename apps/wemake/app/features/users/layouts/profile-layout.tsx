import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  buttonVariants,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Textarea,
} from "@ryugibo/ui";
import { data, Form, Link, NavLink, Outlet, useOutletContext } from "react-router";
import { z } from "zod";
import type { OutletContext } from "~/common/layouts/home-layout.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { getProfileByUsername } from "../queries.ts";
import type { Route } from "./+types/profile-layout";

const paramsSchema = z.object({
  username: z.string(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data: dataParams } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const { username } = dataParams;
  const { supabase, headers } = createSSRClient(request);
  const profile = await getProfileByUsername({ supabase, username });
  return data({ profile }, { headers });
};

export default function ProfileLayout({ loaderData }: Route.ComponentProps) {
  const { isLoggedIn, username } = useOutletContext<OutletContext>();
  const { profile } = loaderData;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <Avatar className="size-40">
          {profile.avatar && <AvatarImage src={profile.avatar} alt="" />}
          <AvatarFallback className="text-2xl">{profile.username[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-4">
          <div className="flex gap-2">
            <h1 className="text-2xl font-semibold">{profile.name}</h1>
            {isLoggedIn && username === profile.username && (
              <Button variant="outline" asChild>
                <Link to="/my/settings">Edit Profile</Link>
              </Button>
            )}
            {isLoggedIn && username !== profile.username && (
              <>
                <Button variant="secondary">Follow</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Message</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Message</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="space-y-50">
                      <span className="text-sm text-muted-foreground">
                        Send a message to {profile.name}
                      </span>
                      <Form className="space-y-4">
                        <Textarea placeholder="message" className="resize-none" rows={4} />
                        <Button type="submit">Send</Button>
                      </Form>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">@{profile.username}</span>
            <Badge variant="secondary" className="capitalize">
              {profile.role}
            </Badge>
            <Badge variant="secondary">100 followers</Badge>
            <Badge variant="secondary">100 following</Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-5">
        {[
          { label: "About", to: `/users/${profile.username}` },
          { label: "Products", to: `/users/${profile.username}/products` },
          { label: "Posts", to: `/users/${profile.username}/posts` },
        ].map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end
            className={({ isActive }) =>
              cn([
                buttonVariants({ variant: "outline" }),
                isActive && "bg-accent text-accent-foreground",
              ])
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="max-w-3xl">
        <Outlet context={{ headline: profile.headline, bio: profile.bio }} />
      </div>
    </div>
  );
}
