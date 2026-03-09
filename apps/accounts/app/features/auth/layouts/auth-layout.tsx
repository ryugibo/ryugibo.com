import { FlickeringGrid } from "@ryugibo/ui";
import { Outlet } from "react-router";
import type { Route } from "./+types/auth-layout";

export default function AuthLayout(_: Route.ComponentProps) {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 grow">
      {/* Desktop: left branding panel */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden">
        <FlickeringGrid
          squareSize={4}
          gridGap={5}
          maxOpacity={0.5}
          flickerChance={0.2}
          color="#E11D49"
          className="absolute inset-0 z-0"
        />
        <div className="z-10 text-foreground font-bold text-5xl tracking-widest flex items-center select-none">
          <span>ryugibo</span>
          <span className="text-primary animate-pulse transition-opacity duration-1000 ease-in-out">
            .com
          </span>
        </div>
      </div>
      {/* Form column: grid fades in behind the heading on mobile */}
      <div className="relative grow lg:grow-0 flex flex-col">
        <FlickeringGrid
          squareSize={4}
          gridGap={5}
          maxOpacity={0.3}
          flickerChance={0.2}
          color="#E11D49"
          className="absolute inset-x-0 top-0 h-48 z-0 lg:hidden"
          style={{ maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)" }}
        />
        {/* Mobile: ryugibo.com logo on top of grid */}
        <div className="lg:hidden absolute top-0 inset-x-0 z-10 flex items-center justify-center px-6 pt-4 pointer-events-none select-none">
          <span className="text-foreground font-bold text-xl tracking-widest">ryugibo</span>
          <span className="text-primary font-bold text-xl tracking-widest animate-pulse">.com</span>
        </div>
        <div className="relative z-10 grow flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
