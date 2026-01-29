export const ROLE_TYPES = [
  { label: "Developer", value: "developer" },
  { label: "Designer", value: "designer" },
  { label: "Marketer", value: "marketer" },
  { label: "Founder", value: "founder" },
  { label: "Product Manager", value: "product-manager" },
] as const;
export type RoleType = (typeof ROLE_TYPES)[number]["value"];
