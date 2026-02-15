import { PORTS } from "./ports.ts";

export const resolveAppUrl = (appName: keyof typeof PORTS) => {
  if (import.meta.env.DEV) {
    return `http://${appName}.lvh.me:${PORTS[appName]}`;
  }
  return `https://${appName}${import.meta.env.VITE_COOKIE_DOMAIN}`;
};

export const getAccountsUrl = () => {
  return resolveAppUrl("accounts");
};
