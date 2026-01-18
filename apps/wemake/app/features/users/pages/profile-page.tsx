import type { Route } from "./+types/profile-page";

export const meta = (_: Route.MetaArgs) => [
  { title: "Profile | wenake" },
  { name: "description", content: "Profile" },
];

export default function ProfilePage() {
  return (
    <div className="max-w-3xl flex flex-col space-y-10">
      <div className="space-y-2">
        <h4 className="text-lg font-bold">Headline</h4>
        <p className="text-muted-foreground">
          I'm a product designer based on the UK, I like doing product design, design systems and
          design tokens.
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="text-lg font-bold">About</h4>
        <p className="text-muted-foreground">
          I'm a product designer based on the UK, I like doing product design, design systems and
          design tokens.
        </p>
      </div>
    </div>
  );
}
