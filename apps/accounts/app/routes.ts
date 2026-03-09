import { index, layout, prefix, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  layout("common/layouts/app-layout.tsx", [
    index("common/pages/home-page.tsx"),
    route("/privacy", "features/legal/pages/privacy-page.tsx"),
    layout("features/auth/layouts/auth-layout.tsx", [
      route("/join", "features/auth/pages/join-page.tsx"),
      route("/login", "features/auth/pages/login-page.tsx"),
      route("/logout", "features/auth/pages/logout-page.tsx"),
      ...prefix("/otp", [
        route("/start", "features/auth/pages/otp-start-page.tsx"),
        route("/complete", "features/auth/pages/otp-complete-page.tsx"),
      ]),
      ...prefix("/social/:provider", [
        route("/start", "features/auth/pages/social-start-page.tsx"),
        route("/complete", "features/auth/pages/social-complete-page.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
