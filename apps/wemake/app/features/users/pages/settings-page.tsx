import { Alert, AlertDescription, AlertTitle, Button, Input, Label } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { useState } from "react";
import { data, Form, redirect } from "react-router";
import z from "zod";
import InputPair from "~/common/components/input-pair.tsx";
import SelectPair from "~/common/components/select-pair.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { ROLE_TYPES } from "../constants.ts";
import { updateAvatar, updateProfile } from "../mutations.ts";
import { getProfileById } from "../queries.ts";
import type { Route } from "./+types/settings-page";

export const meta = () => [
  { title: "Settings | wemake" },
  { name: "description", content: "Settings" },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, getAuthUser, headers } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    return redirect("/", { headers });
  }
  const { id } = user;
  const profile = await getProfileById({ supabase, id });
  return data({ user: profile }, { headers });
};

export const formSchema = z.object({
  name: z.string().min(3).max(50),
  role: z.enum(ROLE_TYPES.map((type) => type.value)),
  headline: z.string().max(100).default(""),
  bio: z.string().max(1000).default(""),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase, getAuthUser, headers } = createSSRClient(request);

  const defaultReturn = {
    data: null,
    formError: null,
    avatarError: null,
    success: false,
  };

  const user = await getAuthUser();
  if (!user) {
    return redirect("/", { headers });
  }
  const { id: profile_id } = user;

  const formData = await request.formData();
  const avatarFile = formData.get("avatar");
  if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
    if (avatarFile.type.startsWith("image/") && avatarFile.size <= 1024 * 1024 * 2) {
      const { data: dataUpload, error } = await supabase.storage
        .from("wemake.avatars")
        .upload(`${profile_id}/${Date.now()}`, avatarFile, {
          contentType: avatarFile.type,
        });
      if (error) {
        return data({ ...defaultReturn, avatarError: { message: error.message } }, { headers });
      }
      const {
        data: { publicUrl: avatar },
      } = await supabase.storage.from("wemake.avatars").getPublicUrl(dataUpload.path);
      await updateAvatar({ supabase, profile_id, avatar });
      return data({ ...defaultReturn, success: true }, { headers });
    } else {
      return data({ ...defaultReturn, avatarError: { message: "Invalid avatar" } }, { headers });
    }
  } else {
    const {
      success: successForm,
      data: dataForm,
      error: errorFormZod,
    } = formSchema.safeParse(Object.fromEntries(formData));
    if (!successForm) {
      const formError = parseZodError(errorFormZod);
      return data({ ...defaultReturn, formError }, { headers });
    }
    await updateProfile({ supabase, profile_id, data: dataForm });
    return data({ ...defaultReturn, success: true }, { headers });
  }
};

export default function SettingsPage({ loaderData, actionData }: Route.ComponentProps) {
  const { user } = loaderData;
  const [avatar, setAvatar] = useState<string | null>(user.avatar);
  const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };
  return (
    <div className="space-y-20">
      <div className="grid grid-cols-6 gap-40">
        <div className="col-span-4 flex flex-col gap-10">
          {actionData?.success && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Profile updated successfully</AlertDescription>
            </Alert>
          )}
          <h2 className="text-2xl font-semibold">Edit Profile</h2>
          <Form method="post" className="flex flex-col w-1/2 gap-5">
            <InputPair
              label="Name"
              description="Your public name"
              id="name"
              name="name"
              required
              placeholder="John Doe"
              defaultValue={user.name}
            />
            {actionData?.formError?.name?.map(({ key, message }) => (
              <Alert key={key}>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            ))}
            <SelectPair
              label="Role"
              description="What role do you play in the community?"
              name="role"
              required
              options={ROLE_TYPES}
              placeholder="Select your role"
              defaultValue={user.role}
            />
            {actionData?.formError?.role?.map(({ key, message }) => (
              <Alert key={key}>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            ))}
            <InputPair
              label="Headline"
              description="An introdunction to your profile"
              id="headline"
              name="headline"
              required
              textarea
              placeholder="Tell us about yourself"
              defaultValue={user.headline || ""}
            />
            {actionData?.formError?.headline?.map(({ key, message }) => (
              <Alert key={key}>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            ))}
            <InputPair
              label="Bio"
              description="Your public bio"
              id="bio"
              name="bio"
              required
              textarea
              placeholder="Tell us about yourself"
              defaultValue={user.bio || ""}
            />
            {actionData?.formError?.bio?.map(({ key, message }) => (
              <Alert key={key}>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            ))}
            <Button type="submit" className="w-full" size="lg">
              Update Profile
            </Button>
          </Form>
        </div>
        <Form
          method="post"
          encType="multipart/form-data"
          className="col-span-2 p-6 rounded-lg border shadow-md"
        >
          <div className="space-y-5">
            <Label htmlFor="avatar" className="flex flex-col items-start">
              Avatar
              <small className="text-muted-foreground">The avatar of your profile</small>
            </Label>
            <div className="size-40 rounded-full shadow-xl overflow-hidden">
              {avatar && (
                <img src={avatar} alt="avatar-preview" className="w-full h-full object-cover" />
              )}
            </div>
            <Input
              type="file"
              onChange={onChangeAvatar}
              name="avatar"
              id="avatar"
              required
              className="w-1/2"
            />
            {actionData?.avatarError && (
              <Alert>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{actionData.avatarError.message}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col text-xs">
              <span className="text-muted-foreground">Recommended size: 128x128</span>
              <span className="text-muted-foreground">Allowed formats: PNG, JPEG</span>
              <span className="text-muted-foreground">Max file size: 2MB</span>
            </div>
            <Button className="w-full">Update Avatar</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
