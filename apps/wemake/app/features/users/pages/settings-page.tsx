import { useState } from "react";
import { Form } from "react-router";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";

export const meta = () => [
  { title: "Settings | wemake" },
  { name: "description", content: "Settings" },
];

export default function SettingsPage() {
  const [avatar, setAvatar] = useState<string | null>(null);
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
          <h2 className="text-2xl font-semibold">Edit Profile</h2>
          <Form className="flex flex-col w-1/2 gap-5">
            <InputPair
              label="Name"
              description="Your public name"
              id="name"
              name="name"
              required
              placeholder="John Doe"
            />
            <SelectPair
              label="Role"
              description="What role do you play in the community?"
              name="role"
              required
              options={[
                { label: "Developer", value: "developer" },
                { label: "Designer", value: "designer" },
                { label: "Manager", value: "manager" },
                { label: "Other", value: "other" },
              ]}
              placeholder="Select your role"
            />
            <InputPair
              label="Bio"
              description="Your public bio"
              id="bio"
              name="bio"
              required
              textarea
              placeholder="Tell us about yourself"
            />
            <Button type="submit" className="w-full" size="lg">
              Update Profile
            </Button>
          </Form>
        </div>
        <aside className="col-span-2 p-6 rounded-lg border shadow-md">
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
            <div className="flex flex-col text-xs">
              <span className="text-muted-foreground">Recommended size: 128x128</span>
              <span className="text-muted-foreground">Allowed formats: PNG, JPEG</span>
              <span className="text-muted-foreground">Max file size: 1MB</span>
            </div>
            <Button className="w-full">Update Avatar</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
