import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("common/pages/dashboard-page.tsx"),
  route("library", "features/library/pages/library-page.tsx"),
  route("library/:bookId", "features/book/pages/book-details-page.tsx"),
  route("books/search", "features/book/pages/search-books-page.tsx"),
  route("books/add", "features/book/pages/add-book-page.tsx"),
  route("collections", "features/collections/pages/collections-page.tsx"),
  route("collections/:collectionId", "features/collections/pages/collection-details-page.tsx"),
  route("settings", "features/settings/pages/settings-page.tsx"),
  route("login", "features/auth/pages/login-page.tsx"),
  route("signup", "features/auth/pages/signup-page.tsx"),
] satisfies RouteConfig;
