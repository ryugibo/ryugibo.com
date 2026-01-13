import { index, layout, prefix, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("common/pages/homepage.tsx"),
  ...prefix("products", [
    index("features/products/pages/products-page.tsx"),
    ...prefix("leaderboards", [
      index("features/products/pages/leaderboards-page.tsx"),
      route("/yearly/:year", "features/products/pages/leaderboards-yearly-page.tsx"),
      route("/monthly/:year/:month", "features/products/pages/leaderboards-monthly-page.tsx"),
      route(
        "/weekly/:weekYear/:weekNumber",
        "features/products/pages/leaderboards-weekly-page.tsx",
      ),
      route("/daily/:year/:month/:day", "features/products/pages/leaderboards-daily-page.tsx"),
      route("/:period", "features/products/pages/leaderboards-redirection-page.tsx"),
    ]),
    ...prefix("categories", [
      index("features/products/pages/categories-page.tsx"),
      route("/:category", "features/products/pages/category-page.tsx"),
    ]),
    route("/search", "features/products/pages/search-page.tsx"),
    route("/submit", "features/products/pages/submit-page.tsx"),
    route("/promote", "features/products/pages/promote-page.tsx"),
    ...prefix("/:productId", [
      index("features/products/pages/product-redirect-page.tsx"),
      layout("features/products/layouts/product-layout.tsx", [
        route("/overview", "features/products/pages/product-overview-page.tsx"),
        route("/reviews", "features/products/pages/product-reviews-page.tsx"),
      ]),
    ]),
  ]),
  ...prefix("/ideas", [
    index("features/ideas/pages/ideas-page.tsx"),
    route("/:ideaId", "features/ideas/pages/idea-page.tsx"),
  ]),
  ...prefix("/jobs", [
    index("features/jobs/pages/jobs-page.tsx"),
    route("/:jobId", "features/jobs/pages/job-page.tsx"),
    route("/submit", "features/jobs/pages/job-submit-page.tsx"),
  ]),
] satisfies RouteConfig;
