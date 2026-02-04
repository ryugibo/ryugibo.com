export const ROLE_VALUES = [
  "developer",
  "designer",
  "marketer",
  "founder",
  "product-manager",
] as const;

export const ROLE_LABELS: Record<(typeof ROLE_VALUES)[number], string> = {
  developer: "Developer",
  designer: "Designer",
  marketer: "Marketer",
  founder: "Founder",
  "product-manager": "Product Manager",
};

export const ROLE_TYPES = ROLE_VALUES.map((value) => ({
  label: ROLE_LABELS[value],
  value,
}));

export type RoleType = (typeof ROLE_VALUES)[number];

export const NOTIFICATION_VALUES = ["follow", "review", "reply"] as const;

export const NOTIFICATION_LABELS: Record<(typeof NOTIFICATION_VALUES)[number], string> = {
  follow: " followed you.",
  review: " left a review on your product.",
  reply: " replied to your comment.",
};

export const NOTIFICATION_TYPES = NOTIFICATION_VALUES.map((value) => ({
  label: NOTIFICATION_LABELS[value],
  value,
}));

export type NotificationType = (typeof NOTIFICATION_VALUES)[number];
