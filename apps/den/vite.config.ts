import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import { INSPECTOR_PORTS, PORTS } from "@ryugibo/utils";
import { getBaseViteConfig } from "@ryugibo/vite-config";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";

export default defineConfig(() => {
  return getBaseViteConfig(pkg.name, {
    server: { port: PORTS.den },
    plugins: [
      cloudflare({ inspectorPort: INSPECTOR_PORTS.den, viteEnvironment: { name: "ssr" } }),
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
    ],
  });
});
