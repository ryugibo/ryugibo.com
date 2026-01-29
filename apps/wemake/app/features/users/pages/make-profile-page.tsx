import { Button } from "@ryugibo/ui/button";
import { Input } from "@ryugibo/ui/input";
import { Label } from "@ryugibo/ui/label";
import { Form, redirect, useNavigation } from "react-router";
import SelectPair from "~/common/components/select-pair.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { ROLE_TYPES } from "../constants.ts";
import type { Route } from "./+types/make-profile-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Create Profile | wemake" }];
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const headline = formData.get("headline") as string;

  const { supabase } = createSSRClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    name,
    username,
    role: role as (typeof ROLE_TYPES)[number]["value"],
    bio,
    headline,
  });

  if (error) {
    return { error: error.message };
  }

  return redirect("/");
};

export default function MakeProfilePage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Create your profile</h1>
        <p className="text-muted-foreground">Tell us a bit about yourself to get started.</p>
      </div>

      <Form method="post" className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" required placeholder="username" />
          <p className="text-xs text-muted-foreground">This will be your unique handle.</p>
        </div>

        <div className="space-y-2">
          <SelectPair
            label="Role"
            description="What role do you play in the community?"
            name="role"
            required
            options={ROLE_TYPES}
            placeholder="Select your role"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" name="headline" placeholder="Software Engineer at ..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input id="bio" name="bio" placeholder="Tell us about yourself" />
        </div>

        {actionData?.error && (
          <div className="text-red-500 text-sm font-medium">{actionData.error}</div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating..." : "Create Profile"}
        </Button>
      </Form>
    </div>
  );
}
