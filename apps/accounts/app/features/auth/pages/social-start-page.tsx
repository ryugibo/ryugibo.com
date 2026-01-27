import type { Route } from "./+types/social-start-page";

export const meta = () => {
  return [{ title: "Social Start | wemake" }];
};

export default function SocialStartPage(_: Route.ComponentProps) {
  return <div>Social Start Page</div>;
}
