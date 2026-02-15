import { mergeConfig, type UserConfig } from "vite";
import { appNameTypeGenPlugin } from "./plugins/app-name-type-gen-plugin.ts";
import { lvhMePlugin } from "./plugins/lvh-me-plugin.ts";

export function getBaseViteConfig(appName: string, overrides: UserConfig = {}): UserConfig {
  const defaultConfig: UserConfig = {
    define: {
      __APP_NAME__: JSON.stringify(appName),
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: [`${appName}.ryugibo.com`, `${appName}.lvh.me`, ".trycloudflare.com"],
    },
    plugins: [lvhMePlugin(appName), appNameTypeGenPlugin(appName)],
  };

  return mergeConfig(defaultConfig, overrides);
}
