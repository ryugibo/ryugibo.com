import type { Route } from "./+types/home-page";

export const meta = (_: Route.MetaArgs) => [
  { title: "New React Router App" },
  { name: "description", content: "Welcome to React Router!" },
];

export default function HomePage() {
  return <div />;
}
