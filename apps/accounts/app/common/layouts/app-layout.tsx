import { Link, Outlet } from "react-router";
import type { Route } from "./+types/app-layout";

export default function AppLayout(_: Route.ComponentProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow flex flex-col">
        <Outlet />
      </main>
      <footer className="py-6 mt-auto border-t bg-muted/20">
        <div className="container px-4 mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ryugibo.com. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline underline-offset-4">
              개인정보 처리방침
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
