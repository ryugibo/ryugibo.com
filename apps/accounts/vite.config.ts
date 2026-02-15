import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import { INSPECTOR_PORTS, PORTS } from "@ryugibo/utils";
import { getBaseViteConfig } from "@ryugibo/vite-config";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return getBaseViteConfig("accounts", {
    server: {
      port: PORTS.accounts,
    },
    plugins: [
      cloudflare({ inspectorPort: INSPECTOR_PORTS.accounts, viteEnvironment: { name: "ssr" } }),
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
    ],
  });
});
