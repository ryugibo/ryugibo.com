import cloudflare from "@astrojs/cloudflare";
import { INSPECTOR_PORTS, PORTS } from "@ryugibo/utils";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  server: {
    port: PORTS.snipt,
    host: "snipt.lvh.me",
  },
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
    inspectorPort: INSPECTOR_PORTS.snipt,
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
