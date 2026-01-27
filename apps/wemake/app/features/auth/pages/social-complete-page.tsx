import type { Route } from "./+types/social-complete-page";

export const meta = () => {
  return [{ title: "Social Complete | wemake" }];
};

export default function SocialCompletePage(_: Route.ComponentProps) {
  return <div>Social Complete Page</div>;
}
