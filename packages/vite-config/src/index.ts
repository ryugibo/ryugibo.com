import { mergeConfig, type UserConfig } from "vite";
import { lvhMePlugin } from "./lvh-plugin.ts";

export function getBaseViteConfig(appName: string, overrides: UserConfig = {}): UserConfig {
  const defaultConfig: UserConfig = {
    define: {
      __APP_NAME__: appName,
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: [`${appName}.lvh.me`],
    },
    plugins: [lvhMePlugin(appName)],
  };

  return mergeConfig(defaultConfig, overrides);
}
