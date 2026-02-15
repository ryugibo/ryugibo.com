import { index, layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  layout("common/layouts/app-layout.tsx", [
    index("common/pages/dashboard-page.tsx"),
    route("library", "features/library/pages/library-page.tsx"),
    route("books/search", "features/book/pages/search-books-page.tsx"),
    route("settings", "features/settings/pages/settings-page.tsx"),
  ]),
  route("make-profile", "features/profile/pages/make-profile-page.tsx"),
] satisfies RouteConfig;
