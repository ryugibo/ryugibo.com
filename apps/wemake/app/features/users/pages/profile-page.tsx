import type { Route } from "./+types/profile-page";

export const meta: Route.MetaFunction = () => [
  { title: "Profile | Wemake" },
  { name: "description", content: "Profile" },
];

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Profile</h1>
    </div>
  );
}
