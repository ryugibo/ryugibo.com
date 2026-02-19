import { index, layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  layout("common/layouts/app-layout.tsx", [
    index("common/pages/dashboard-page.tsx"),
    route("library", "features/library/pages/library-page.tsx"),
    route("books/search", "features/book/pages/search-books-page.tsx"),
    route("books/:isbn", "features/book/pages/book-detail-page.tsx"),
    route("settings", "features/settings/pages/settings-page.tsx"),
    route("admin", "features/admin/layouts/admin-layout.tsx", [
      index("features/admin/pages/admin-requests-page.tsx"),
      route("content", "features/admin/pages/admin-content-page.tsx"),
    ]),
  ]),
  route("make-profile", "features/profile/pages/make-profile-page.tsx"),
] satisfies RouteConfig;
