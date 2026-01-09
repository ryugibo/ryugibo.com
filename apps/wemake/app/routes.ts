import { index, prefix, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("common/pages/homepage.tsx"),
  ...prefix("products", [
    index("features/products/pages/products.tsx"),
    ...prefix("leaderboards", [
      index("features/products/pages/leaderboards.tsx"),
      route("/yearly/:year", "features/products/pages/leaderboards-yearly.tsx"),
      route("/monthly/:year/:month", "features/products/pages/leaderboards-monthly.tsx"),
      route("/weekly/:year/:week", "features/products/pages/leaderboards-weekly.tsx"),
      route("/daily/:year/:month/:day", "features/products/pages/leaderboards-daily.tsx"),
    ]),
    ...prefix("categories", [
      index("features/products/pages/categories.tsx"),
      route("/:category", "features/products/pages/category.tsx"),
    ]),
    route("/search", "features/products/pages/search.tsx"),
    route("/submit", "features/products/pages/submit.tsx"),
    route("/promote", "features/products/pages/promote.tsx"),
  ]),
] satisfies RouteConfig;
