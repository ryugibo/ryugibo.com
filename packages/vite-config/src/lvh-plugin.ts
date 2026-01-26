import type { Plugin } from "vite";

export function lvhMePlugin(subDomain: string): Plugin {
  return {
    name: "vite-plugin-lvh-me",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const address = server.httpServer?.address();
        const port = typeof address === "object" ? address?.port : null;

        if (port) {
          setTimeout(() => {
            console.log(
              `  \x1b[32m➜\x1b[0m  \x1b[1mLvh.me:\x1b[0m    \x1b[36mhttp://${subDomain}.lvh.me:${port}/\x1b[0m`,
            );
          }, 150);
        }
      });
    },
  };
}
