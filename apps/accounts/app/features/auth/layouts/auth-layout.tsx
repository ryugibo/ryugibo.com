import { FlickeringGrid } from "@ryugibo/ui";
import { Outlet } from "react-router";
import type { Route } from "./+types/auth-layout";

export default function AuthLayout(_: Route.ComponentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      <FlickeringGrid
        squareSize={4}
        gridGap={5}
        maxOpacity={0.5}
        flickerChance={0.2}
        color="#E11D49"
        className="hidden lg:block"
      />
      <Outlet />
    </div>
  );
}
