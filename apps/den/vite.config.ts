import { reactRouter } from "@react-router/dev/vite";
import { PORTS } from "@ryugibo/utils";
import { getBaseViteConfig } from "@ryugibo/vite-config";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";

export default defineConfig(() => {
  return getBaseViteConfig(pkg.name, {
    server: { port: PORTS.den },
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  });
});
