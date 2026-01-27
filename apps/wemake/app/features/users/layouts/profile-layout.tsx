import { cn } from "@ryugibo/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@ryugibo/ui/avatar";
import { Badge } from "@ryugibo/ui/badge";
import { Button, buttonVariants } from "@ryugibo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ryugibo/ui/dialog";
import { Textarea } from "@ryugibo/ui/textarea";
import { Form, Link, NavLink, Outlet } from "react-router";
import { z } from "zod";
import { getUserProfile } from "../queries.ts";
import type { Route } from "./+types/profile-layout";

const paramsSchema = z.object({
  username: z.string(),
});
export const loader = async ({ params }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const { username } = data;
  const profile = await getUserProfile(username);
  return { profile };
};

export default function ProfileLayout({ loaderData }: Route.ComponentProps) {
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
            <Button variant="outline" asChild>
              <Link to="/my/settings">Edit Profile</Link>
            </Button>
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
